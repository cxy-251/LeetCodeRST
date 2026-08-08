0071. Simplify Path
===================

题目信息
--------

:题号: 0071. 简化路径
:难度: Medium
:主题: 字符串、栈、路径规范化
:原题: `LeetCode 0071 <https://leetcode.com/problems/simplify-path/>`_
:重点: 从按斜杠分段，推导到维护规范目录栈，再用写入位置完成结果回滚

题目重述
--------

给定一个以 ``/`` 开头的 Unix 风格绝对路径 ``path``，返回对应的规范路径。

路径中的组件遵循以下规则：

* 连续多个 ``/`` 只表示一个分隔位置；
* 空组件和 ``.`` 不改变当前目录；
* ``..`` 返回父目录，但不能越过根目录；
* 其他非空组件都按普通目录名保留，包括 ``...``、``.git`` 和 ``name..``。

规范结果必须以一个 ``/`` 开头，目录之间只能有一个 ``/``，除根目录本身外不能以 ``/`` 结尾。

约束条件：

* ``1 <= path.length <= 3000``；
* 路径由英文字母、数字、点、斜杠和下划线组成。

自建示例
--------

* 混合规则：``/team//docs/./draft/../final/`` 规范化为 ``/team/docs/final``；
* 根目录回退：``/../../a`` 规范化为 ``/a``，前两个 ``..`` 都不能越过根目录；
* 点组成的名称：``/a/.../.hidden/..`` 规范化为 ``/a/...``，``...`` 是普通目录名；
* 全部抵消：``/a/b/../..`` 规范化为 ``/``；
* 只有分隔符：``////`` 规范化为 ``/``。

C++ 实现
--------

.. code-block:: cpp

   #include <sstream>
   #include <string>
   #include <vector>

   class Solution {
   private:
       std::string buildPath(const std::vector<std::string>& directories) {
           if (directories.empty()) {
               return "/";
           }

           std::string result;
           for (const std::string& directory : directories) {
               result.push_back('/');
               result += directory;
           }
           return result;
       }

       std::string splitWithStream(const std::string& path) {
           std::stringstream stream(path);
           std::string component;
           std::vector<std::string> directories;

           while (std::getline(stream, component, '/')) {
               if (component.empty() || component == ".") {
                   continue;
               }

               if (component == "..") {
                   if (!directories.empty()) {
                       directories.pop_back();
                   }
               } else {
                   directories.push_back(component);
               }
           }

           return buildPath(directories);
       }

       std::string manualComponentScan(const std::string& path) {
           std::vector<std::string> directories;
           int index = 0;
           const int length = static_cast<int>(path.size());

           while (index < length) {
               while (index < length && path[index] == '/') {
                   ++index;
               }

               const int start = index;
               while (index < length && path[index] != '/') {
                   ++index;
               }

               if (start == index) {
                   continue;
               }

               const std::string component = path.substr(start, index - start);
               if (component == ".") {
                   continue;
               }

               if (component == "..") {
                   if (!directories.empty()) {
                       directories.pop_back();
                   }
               } else {
                   directories.push_back(component);
               }
           }

           return buildPath(directories);
       }

       std::string rollbackBuffer(const std::string& path) {
           std::string result;
           std::vector<int> restorePositions;
           int index = 0;
           const int length = static_cast<int>(path.size());

           while (index < length) {
               while (index < length && path[index] == '/') {
                   ++index;
               }

               const int start = index;
               while (index < length && path[index] != '/') {
                   ++index;
               }

               if (start == index) {
                   continue;
               }

               const std::string component = path.substr(start, index - start);
               if (component == ".") {
                   continue;
               }

               if (component == "..") {
                   if (!restorePositions.empty()) {
                       result.resize(restorePositions.back());
                       restorePositions.pop_back();
                   }
               } else {
                   restorePositions.push_back(static_cast<int>(result.size()));
                   result.push_back('/');
                   result += component;
               }
           }

           return result.empty() ? "/" : result;
       }

   public:
       std::string simplifyPath(std::string path) {
           return manualComponentScan(path);
       }
   };

题解
----

组件级语义
~~~~~~~~~~

路径规则作用于两个斜杠之间的完整组件，而不是任意字符片段。``.`` 和 ``..`` 只有在组件完全相等时才有特殊语义；
``...``、``.hidden`` 和 ``name..`` 都必须保留。

因此，反复替换 ``//``、``/./`` 或某段 ``name/..`` 并不稳妥。字符串替换既可能误判普通名称，也会反复移动后续字符。
更直接的模型是先识别组件，再按组件类别更新当前目录层级。

目录栈不变量
~~~~~~~~~~~~

处理完输入的任意前缀后，``directories`` 从底到顶恰好保存该前缀规范化后的目录层级：

* 空组件和 ``.`` 不改变栈；
* 普通组件表示进入子目录，压入栈顶；
* ``..`` 表示返回父目录，栈非空时弹出栈顶；
* 栈为空时已经位于根目录，额外的 ``..`` 不产生效果。

以 ``/team//docs/./draft/../final/`` 为例：

.. list-table::
   :header-rows: 1

   * - 组件
     - 处理后目录栈
     - 动作
   * - ``team``
     - ``[team]``
     - 进入目录
   * - ``docs``
     - ``[team, docs]``
     - 进入目录
   * - ``.``
     - ``[team, docs]``
     - 保持当前位置
   * - ``draft``
     - ``[team, docs, draft]``
     - 进入目录
   * - ``..``
     - ``[team, docs]``
     - 返回父目录
   * - ``final``
     - ``[team, docs, final]``
     - 进入目录

输入组件按顺序更新栈，因此当前栈始终对应已经处理部分的唯一规范路径。

流式分词
~~~~~~~~

``splitWithStream`` 使用 ``std::getline`` 按 ``/`` 分段。连续斜杠会产生空组件，统一忽略即可。

这一版直接表达了“分段后分类”的思路，但会创建流对象，并把分词过程交给通用字符串流。算法仍为线性时间，额外抽象并非本题所必需。

手工组件扫描
~~~~~~~~~~~~

``manualComponentScan`` 用下标直接识别每个组件：

#. 跳过一段连续斜杠；
#. 记录组件起点 ``start``；
#. 扫描到下一个斜杠或字符串末尾；
#. 对半开区间 ``[start, index)`` 对应的组件执行栈操作。

每个输入字符只被跳过或扫描常数次。连续斜杠、开头斜杠和结尾斜杠都由同一循环处理，不需要额外分支。

结果重建
~~~~~~~~

栈内只含真实目录名。重建时为每个目录先写入一个 ``/``，再写目录名：

.. code-block:: text

   [team, docs, final] -> /team/docs/final

这种写法自动保证目录之间只有一个斜杠，并且不会产生尾斜杠。若栈为空，单独返回根目录 ``/``。

写入位置回滚
~~~~~~~~~~~~

``rollbackBuffer`` 不保存目录字符串，而是在结果中直接追加 ``/组件``。追加前记录当前结果长度；遇到 ``..`` 时，
将结果缩回最近一次记录的位置，就等价于删除最后一级目录。

例如结果已经是 ``/team/docs``，追加 ``/draft`` 前记录长度 ``10``。之后读取 ``..``，把字符串恢复到长度
``10``，结果重新变为 ``/team/docs``。

目录栈保存的是“有哪些目录”，写入位置栈保存的是“删除最后一级时应退到哪里”。两者表达同一个后进先出的结构。

正确性
~~~~~~

对输入组件按顺序归纳：

* 空组件和 ``.`` 不改变当前位置，忽略后结果不变；
* 普通组件唯一地在当前路径末尾增加一级目录，压栈后结果正确；
* ``..`` 在非根目录删除最后一级，在根目录保持不动，恰好符合父目录规则。

因此全部组件处理完成后，栈表示的目录层级与原路径指向的位置相同。重建过程只插入必要的单个斜杠，所得字符串同时满足
路径语义和规范格式。

复杂度分析
~~~~~~~~~~

设路径长度为 ``n``：

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要状态
   * - 流式分词
     - ``O(n)``
     - ``O(n)``
     - 字符串流与目录栈
   * - 手工组件扫描
     - ``O(n)``
     - ``O(n)``
     - 目录栈
   * - 写入位置回滚
     - ``O(n)``
     - ``O(n)``
     - 结果缓冲区与恢复位置栈

返回字符串本身最多包含 ``O(n)`` 个字符。公开入口采用手工组件扫描，它不依赖流对象，组件边界和栈更新也最直接。

边界处理
~~~~~~~~

* 输入为 ``/`` 或全部由斜杠组成时，目录栈为空，返回 ``/``；
* 任意多个前导 ``..`` 都不能让空栈继续弹出；
* ``.`` 和 ``..`` 之外的点组成名称全部保留；
* 结尾斜杠只产生空组件，不会进入结果；
* 每个目录名按原字符完整保留，算法不修改大小写或内容。
