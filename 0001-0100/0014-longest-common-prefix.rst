0014. Longest Common Prefix
===========================

题目信息
--------

:题号: 0014
:难度: Easy
:主题: 字符串、前缀、纵向扫描
:原题: `LeetCode 0014 <https://leetcode.com/problems/longest-common-prefix/>`_
:重点: 用公共前缀长度连接逐行收缩与逐列验证，并由首次越界或字符冲突立即确定答案

题目重述
--------

给定字符串数组 ``strs``，返回所有字符串共有的最长前缀。前缀必须从每个字符串的下标 ``0`` 开始连续出现；
若首字符就无法统一，返回空字符串 ``""``。

数组长度位于 ``[1, 200]``，每个字符串长度位于 ``[0, 200]``，并且只包含小写英文字母。数组只有一个
字符串时，该字符串本身就是答案；只要数组中存在空字符串，公共前缀就只能为空。

自建示例
--------

* 普通情况：``strs = ["interact", "internet", "internal"]``，前五列相同，返回 ``"inter"``；
* 首列冲突：``strs = ["dog", "racecar", "car"]``，返回 ``""``；
* 短字符串限制上界：``strs = ["app", "apple", "application"]``，返回 ``"app"``；
* 包含空字符串：``strs = ["alpha", "", "alpine"]``，返回 ``""``；
* 单个字符串：``strs = ["solo"]``，返回 ``"solo"``。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       std::string shrinkByRows(const std::vector<std::string>& strs) {
           int length = static_cast<int>(strs[0].size());
           for (int row = 1; row < static_cast<int>(strs.size()); ++row) {
               int column = 0;
               while (column < length && column < static_cast<int>(strs[row].size()) &&
                      strs[0][column] == strs[row][column]) {
                   ++column;
               }
               length = column;
               if (length == 0) {
                   break;
               }
           }
           return strs[0].substr(0, length);
       }

       std::string scanByColumns(const std::vector<std::string>& strs) {
           for (int column = 0; column < static_cast<int>(strs[0].size()); ++column) {
               for (int row = 1; row < static_cast<int>(strs.size()); ++row) {
                   if (column >= static_cast<int>(strs[row].size()) || strs[row][column] != strs[0][column]) {
                       return strs[0].substr(0, column);
                   }
               }
           }
           return strs[0];
       }

   public:
       std::string longestCommonPrefix(std::vector<std::string>& strs) {
           return scanByColumns(strs);
       }
   };

题解
----

候选范围
~~~~~~~~

任何公共前缀都必须是 ``strs[0]`` 的前缀，因此候选不需要保存为任意字符串，只需要保存一个长度：

``length = 当前已经确认的公共前缀长度``。

长度为 ``length`` 的候选表示 ``strs[0][0:length]``。后续字符串只能让这个长度保持或缩短，不可能在已经
失配的位置之后重新产生更长前缀。

逐行收缩
~~~~~~~~

``shrinkByRows`` 初始令 ``length = strs[0].size()``。处理第 ``row`` 个字符串时，从第 0 列开始比较，直到
到达当前长度上界、当前字符串结束或字符不同，然后把 ``length`` 缩短到本次成功比较的列数。

循环不变量是：处理完下标 ``[0, row]`` 的字符串后，``strs[0][0:length]`` 正好是这些字符串的最长公共
前缀。

新字符串加入时，任何全局公共前缀都必须同时是旧候选和新字符串的前缀，所以只保留两者的最长公共部分不会
删除合法答案。若 ``length`` 变为 0，后续字符串也不可能让空前缀重新增长，可以立即停止。

逐列验证
~~~~~~~~

逐行方法先选字符串，再比较它的各列。``scanByColumns`` 交换这两层组织方式：先固定一列，再验证所有字符串。

开始检查第 ``column`` 列时，区间 ``[0, column)`` 已经在所有字符串中验证成功。当前列只有两种失败方式：

* 某个字符串长度不超过 ``column``，该列不存在；
* 某个字符串在该列的字符与 ``strs[0][column]`` 不同。

一旦失败，任何长度大于 ``column`` 的前缀都必须包含这列，因此全部非法；而前 ``column`` 列已经验证成功，
所以 ``strs[0].substr(0, column)`` 立即就是最长答案。

若 ``strs[0]`` 的所有列都通过，它本身已经是公共前缀。答案又不可能比第一个字符串更长，因此直接返回
``strs[0]``。

状态不变量
~~~~~~~~~~

以 ``["interact", "internet", "internal"]`` 为例：

.. code-block:: text

   column = 0..4：三行字符分别为 i、n、t、e、r，全部通过
   column = 5：字符分别为 a、n、n，首次冲突
   answer = strs[0][0:5] = "inter"

这里无需继续检查第 6 列之后的字符。前缀不能跳过第 5 列，所以后续任何相同字符都无法修复当前冲突。

代码演进
~~~~~~~~

``shrinkByRows`` 显式维护公共前缀长度。每加入一个字符串，就重新计算旧候选与该字符串的共同长度。

``scanByColumns`` 删除可变的 ``length`` 状态，把“当前仍然有效的候选长度”隐含在列下标中。某列通过就自然
扩展一位，首次失败就直接返回，不再需要完成剩余行或剩余列的扫描。

公开入口采用 ``scanByColumns``。它不修改输入，不需要排序，也不会构造中间前缀字符串；只在答案确定后执行
一次 ``substr``。

复杂度分析
~~~~~~~~~~

设所有字符串的总字符数为 ``S``，最长公共前缀长度为 ``L``。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 状态
   * - 逐行收缩
     - ``O(S)``
     - ``O(1)``
     - 当前公共前缀长度
   * - 逐列验证
     - ``O(S)``
     - ``O(1)``
     - 当前待验证列

更精确地说，逐列方法最多检查约 ``strs.size() * L`` 个字符，并在首次冲突处结束。工作空间均不计返回
字符串；空字符串、单元素数组和某个字符串恰好等于答案的情况都由相同循环边界自然处理。
