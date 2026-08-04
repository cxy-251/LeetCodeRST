0014. Longest Common Prefix
===========================

题目信息
--------

:题号: 0014
:难度: Easy
:主题: 字符串、前缀、纵向扫描
:原题: `LeetCode 0014 <https://leetcode.com/problems/longest-common-prefix/>`_
:重点: 从逐个收缩候选前缀，推导到按列验证首次冲突，并比较排序端点的替代结构

题目重述
--------

给定字符串数组 ``strs``，返回所有字符串共同拥有的最长前缀。前缀必须从每个字符串的下标 ``0`` 开始并
连续出现；若首字符就无法统一，返回空字符串 ``""``。

数组长度位于 ``[1, 200]``，每个字符串长度位于 ``[0, 200]``，字符串只包含小写英文字母。数组只有一个
字符串时，该字符串本身就是答案；数组中包含空字符串时，答案必为空。

自建示例
--------

* 普通公共前缀：``strs = ["interact", "internet", "internal"]``，返回 ``"inter"``；
* 只共享两个字符：``strs = ["stone", "stack", "style"]``，返回 ``"st"``；
* 首字符不同：``strs = ["dog", "racecar", "car"]``，返回 ``""``；
* 包含空字符串：``strs = ["alpha", "", "alpine"]``，返回 ``""``；
* 一个字符串：``strs = ["solo"]``，返回 ``"solo"``；
* 某个字符串就是公共前缀：``strs = ["app", "apple", "application"]``，返回 ``"app"``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   private:
       std::string horizontalShrink(const std::vector<std::string>& strs) {
           std::string prefix = strs[0];
           for (int row = 1; row < static_cast<int>(strs.size()); ++row) {
               while (strs[row].compare(0, prefix.size(), prefix) != 0) {
                   prefix.pop_back();
                   if (prefix.empty()) {
                       return "";
                   }
               }
           }
           return prefix;
       }

       std::string verticalScan(const std::vector<std::string>& strs) {
           for (int column = 0; column < static_cast<int>(strs[0].size()); ++column) {
               const char expected = strs[0][column];
               for (int row = 1; row < static_cast<int>(strs.size()); ++row) {
                   if (column >= static_cast<int>(strs[row].size()) || strs[row][column] != expected) {
                       return strs[0].substr(0, column);
                   }
               }
           }
           return strs[0];
       }

       std::string sortedEndpoints(std::vector<std::string> strs) {
           std::sort(strs.begin(), strs.end());
           const std::string& first = strs.front();
           const std::string& last = strs.back();
           int length = 0;
           while (length < static_cast<int>(first.size()) && length < static_cast<int>(last.size()) &&
                  first[length] == last[length]) {
               ++length;
           }
           return first.substr(0, length);
       }

   public:
       std::string longestCommonPrefix(std::vector<std::string>& strs) {
           return verticalScan(strs);
       }
   };

题解
----

候选收缩
~~~~~~~~

最直接的方法把第一个字符串整体作为候选 ``prefix``。每加入一个新字符串，若它不以当前候选开头，就从候选
末尾删除一个字符，直到匹配或候选变为空。

处理完前 ``row`` 个字符串后，``prefix`` 始终是它们的最长公共前缀。新字符串只能让公共前缀保持或缩短，
不可能产生当前候选之外的新字符，因此删除候选后缀不会遗漏答案。

``horizontalShrink`` 直接维护这个不变量。它易于理解，缺点是一次较长候选可能在多个字符串上被反复比较和
缩短。

按列验证
~~~~~~~~

长度为 ``k`` 的公共前缀要求所有字符串的前 ``k`` 列分别相同。前缀具有连续性：第 ``column`` 列失败后，
任何更长候选都仍包含这次冲突，不可能重新合法。

``verticalScan`` 以第一个字符串的当前字符作为期望值，检查其余字符串：

* 当前列已经超出某个字符串长度，公共前缀在此结束；
* 当前字符与期望值不同，公共前缀在此结束；
* 全部字符串都通过，继续验证下一列。

若第 ``column`` 列首次失败，区间 ``[0, column)`` 已全部验证，而当前列不能加入答案，所以返回
``strs[0].substr(0, column)`` 恰好得到最长长度。

状态推演
~~~~~~~~

对 ``["interact", "internet", "internal"]``：

.. list-table::
   :header-rows: 1

   * - 列
     - 期望
     - 其余字符
     - 结果
   * - 0
     - ``i``
     - ``i, i``
     - 继续
   * - 1
     - ``n``
     - ``n, n``
     - 继续
   * - 2
     - ``t``
     - ``t, t``
     - 继续
   * - 3
     - ``e``
     - ``e, e``
     - 继续
   * - 4
     - ``r``
     - ``r, r``
     - 继续
   * - 5
     - ``a``
     - ``n, n``
     - 返回 ``inter``

首次冲突之后无需继续读取任何字符串，因为前缀不能跳过第 5 列再从后面恢复。

排序端点
~~~~~~~~

字典序排序后，拥有同一前缀的字符串会连续排列。排序首项与尾项代表全体字符串的最大字典序跨度：

* 某一列首尾相同，则所有中间字符串也仍处于这个共同前缀范围内；
* 某一列首尾不同，则全体不可能共享该列。

``sortedEndpoints`` 因此只比较排序后的首尾字符串。这个方法代码简洁，但需要排序并复制输入，时间代价通常
高于直接按列扫描。

代码演进
~~~~~~~~

``horizontalShrink`` 按字符串加入顺序维护一个候选，每次发现不匹配就逐字符删除候选后缀。

``verticalScan`` 改为按列组织搜索。候选字符串和反复前缀比较消失，首次越界或字符冲突直接确定答案长度。

``sortedEndpoints`` 利用字典序把全体约束压缩到两个极端字符串，代价是增加排序和输入副本。它是结构不同的
替代方案，不是纵向扫描的无条件优化。

公开入口采用 ``verticalScan``，因为它不修改输入、不需要排序，并能在首次冲突处立即结束。

复杂度分析
~~~~~~~~~~

设所有字符串总字符数为 ``S``，字符串数量为 ``n``。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要代价
   * - 横向收缩
     - ``O(S)``
     - ``O(L)``
     - 保存并缩短候选前缀
   * - 纵向扫描
     - ``O(S)``
     - ``O(1)``
     - 按列验证到首次冲突
   * - 排序端点
     - 取决于字符串排序
     - ``O(S)``
     - 复制并排序全部字符串

``L`` 是第一个字符串长度。纵向扫描的工作空间不计返回字符串；空字符串会在第 0 列检查或空循环中自然得到
空答案。
