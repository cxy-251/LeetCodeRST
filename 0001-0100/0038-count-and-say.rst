0038. Count and Say
===================

题目信息
--------

:题号: 0038
:难度: Medium
:主题: 字符串、游程编码、递推
:原题: `LeetCode 0038 <https://leetcode.com/problems/count-and-say/>`_
:重点: 从保存完整序列，推导到只保留当前项，并用最大连续字符段唯一生成下一项

题目重述
--------

定义字符串序列 ``countAndSay``：

* 第 ``1`` 项为 ``"1"``；
* 第 ``n`` 项通过从左到右描述第 ``n-1`` 项得到。

描述一个字符串时，把相邻且相同的字符划分为最大连续段。对于每一段，依次写出“该段的字符数量”和“该字符”。
给定整数 ``n``，返回序列的第 ``n`` 项。

这里处理的是字符串而不是整数运算。例如 ``"21"`` 表示“两个 ``1``”，生成下一项时应把它读成一个 ``2``、
一个 ``1``，得到 ``"1211"``。``n`` 位于 ``[1, 30]``。

自建示例
--------

* ``n = 1`` 时返回 ``"1"``，这是序列定义给出的初始项；
* ``n = 4`` 时返回 ``"1211"``，因为第三项 ``"21"`` 包含一个 ``2`` 和一个 ``1``；
* ``n = 6`` 时返回 ``"312211"``，因为第五项 ``"111221"`` 被划分为 ``"111"``、``"22"``、
  ``"1"``，分别描述为 ``"31"``、``"22"``、``"11"``；
* 描述 ``"1211"`` 时，开头的 ``'1'`` 与末尾的两个 ``'1'`` 不能合并，因为中间的 ``'2'`` 将它们分隔成
  不同连续段。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       std::string describe(const std::string& current) {
           std::string next;
           next.reserve(current.size() * 2);

           int start = 0;
           while (start < static_cast<int>(current.size())) {
               int end = start + 1;
               while (end < static_cast<int>(current.size()) &&
                      current[end] == current[start]) {
                   ++end;
               }

               next += std::to_string(end - start);
               next.push_back(current[start]);
               start = end;
           }
           return next;
       }

       std::string buildWholeSequence(int n) {
           std::vector<std::string> sequence(n);
           sequence[0] = "1";
           for (int index = 1; index < n; ++index) {
               sequence[index] = describe(sequence[index - 1]);
           }
           return sequence.back();
       }

       std::string rollingGeneration(int n) {
           std::string current = "1";
           for (int index = 2; index <= n; ++index) {
               current = describe(current);
           }
           return current;
       }

   public:
       std::string countAndSay(int n) {
           return rollingGeneration(n);
       }
   };

题解
----

直接保存前 n 项
~~~~~~~~~~~~~~~

按照定义，最直接的做法是创建数组 ``sequence``：先写入 ``sequence[0] = "1"``，之后令
``sequence[i] = describe(sequence[i-1])``，最后返回第 ``n`` 项。

``buildWholeSequence`` 完整保留了递推关系，因而正确性直接来自题目定义。它的问题不是重复计算，而是保存了已经不会
再次使用的历史项。生成第 ``i+1`` 项只读取第 ``i`` 项；第 ``i-1`` 项及更早字符串在此后都没有用途。

下一项不是全局字符计数
~~~~~~~~~~~~~~~~~~~~~~

描述操作统计的是最大连续相同字符段，而不是整个字符串中的字符频率。以 ``"1211"`` 为例，它的唯一分段是：

.. code-block:: text

   "1" | "2" | "11"

因此输出为：

.. code-block:: text

   一个 1  -> "11"
   一个 2  -> "12"
   两个 1  -> "21"
   合并    -> "111221"

若把三个 ``1`` 合并统计为 ``"31"``，就破坏了原字符串中的读取顺序，得到的不是题目定义的下一项。

双指针如何确定一个最大连续段
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``start`` 指向尚未描述部分的第一个字符，``end`` 从 ``start + 1`` 开始向右移动。只要
``current[end] == current[start]``，两个位置仍属于同一段；遇到不同字符或到达字符串末尾时停止。

此时半开区间 ``[start, end)`` 具有三个性质：

#. 区间内所有字符相同；
#. 长度为 ``end - start``；
#. 若 ``end`` 未越界，``current[end]`` 与该段字符不同，因此当前段不能继续延长。

所以它恰好是从 ``start`` 开始的最大连续段。写入段长度和段字符后令 ``start = end``，下一轮从第一个未处理字符
继续。每个输入字符恰好属于一个段，不会遗漏，也不会被重复描述。

状态演化
~~~~~~~~

描述 ``"111221"``：

.. list-table::
   :header-rows: 1

   * - ``start``
     - ``end``
     - 最大连续段
     - 写入片段
     - 累计结果
   * - 0
     - 3
     - ``"111"``
     - ``"31"``
     - ``"31"``
   * - 3
     - 5
     - ``"22"``
     - ``"22"``
     - ``"3122"``
   * - 5
     - 6
     - ``"1"``
     - ``"11"``
     - ``"312211"``

使用 ``std::to_string(end - start)``，而不是假设段长度永远只有一位数字，使 ``describe`` 对任意字符串的连续段都
保持正确。

为什么连续段划分唯一
~~~~~~~~~~~~~~~~~~~~

从字符串首字符开始，一个连续段的结束位置只能是“第一个不同字符”或字符串末尾。确定第一段后，对剩余后缀应用
同一规则，下一段也被唯一确定。重复执行直到末尾，整个字符串便被唯一划分。

每段的长度和字符随划分唯一确定，因此 ``describe(current)`` 的结果唯一。由第一项 ``"1"`` 开始逐轮应用该函数，
每一项也都唯一确定。

只保留当前项
~~~~~~~~~~~~

递推只存在一阶依赖：

.. math::

   term_i = describe(term_{i-1})

生成新字符串后，旧 ``current`` 不会再参与后续计算，可以直接由新字符串替换。``rollingGeneration`` 因而只维护
当前项，而不保存完整 ``sequence``。

这一步没有改变任何一轮的输入或输出。第 ``i`` 轮开始时，``current`` 与直接方法中的 ``sequence[i-1]`` 相同；
调用相同的 ``describe`` 后，新 ``current`` 就与 ``sequence[i]`` 相同。由此逐轮保持等价，最终返回第 ``n`` 项。

边界处理
~~~~~~~~

``n = 1`` 时循环区间 ``[2, n]`` 为空，直接返回初始字符串 ``"1"``。当当前项只有一个字符时，``end`` 立即到达
末尾，仍会正确写出 ``"1" + 字符``。连续段位于字符串末尾时，也由越界条件正常结束，不需要哨兵字符。

复杂度分析
~~~~~~~~~~

设第 ``i`` 项长度为 ``L_i``。生成第 ``i+1`` 项时，需要扫描 ``L_i`` 个字符，并写出长度为 ``L_{i+1}`` 的结果，
因此生成第 ``n`` 项的总时间为：

.. math::

   O\left(\sum_{i=1}^{n-1}(L_i+L_{i+1})\right)
   = O\left(\sum_{i=1}^{n}L_i\right)

``buildWholeSequence`` 保存全部项，额外空间为 ``O(\sum L_i)``。``rollingGeneration`` 在一轮转换期间只同时持有当前项
和下一项，工作空间为 ``O(L_{n-1}+L_n)``，除返回结果外可写为与最大单项长度同阶。公开入口采用滚动生成方法。
