0132. Palindrome Partitioning II
================================

题目信息
--------

:题号: 0132. 分割回文串 II
:难度: Hard
:主题: 字符串、动态规划、区间回文、前缀最优值
:原题: `LeetCode 0132 <https://leetcode.com/problems/palindrome-partitioning-ii/>`_
:重点: 将全部切分路径压缩为每个前缀的最少切割，并用回文表把转移判断从线性降为常数时间

题目重述
--------

给定非空字符串 ``s``，在字符间切若干刀，使每个得到的连续非空片段都是回文串。返回最少切割次数。若
整个字符串本身就是回文串，答案为 ``0``；切成 ``k`` 个片段只需要 ``k-1`` 刀。

自建示例
--------

* ``s = "racecarx"``：切成 ``"racecar" | "x"``，只需一刀；
* ``s = "abacdc"``：切成 ``"aba" | "cdc"``，答案为 ``1``；
* ``s = "aab"``：最优切分为 ``"aa" | "b"``，答案为 ``1``，逐字符切分的两刀不是最优；
* ``s = "level"``：整串是回文，返回 ``0``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   private:
       bool isPalindrome(const std::string& s, int left, int right) {
           while (left < right) {
               if (s[left] != s[right]) {
                   return false;
               }
               ++left;
               --right;
           }
           return true;
       }

       int minimumPiecesFrom(
           const std::string& s,
           int start,
           std::vector<int>& memo
       ) {
           if (start == static_cast<int>(s.size())) {
               return 0;
           }
           if (memo[start] != -1) {
               return memo[start];
           }

           int bestPieces = static_cast<int>(s.size()) - start;
           for (int end = start; end < static_cast<int>(s.size()); ++end) {
               if (isPalindrome(s, start, end)) {
                   bestPieces = std::min(
                       bestPieces,
                       1 + minimumPiecesFrom(s, end + 1, memo)
                   );
               }
           }
           memo[start] = bestPieces;
           return bestPieces;
       }

       int memoizedSuffixSearch(const std::string& s) {
           std::vector<int> memo(s.size(), -1);
           return minimumPiecesFrom(s, 0, memo) - 1;
       }

       std::vector<std::vector<bool>> buildPalindromeTable(
           const std::string& s
       ) {
           const int length = static_cast<int>(s.size());
           std::vector<std::vector<bool>> palindrome(
               length,
               std::vector<bool>(length, false)
           );
           for (int left = length - 1; left >= 0; --left) {
               for (int right = left; right < length; ++right) {
                   palindrome[left][right] =
                       s[left] == s[right] &&
                       (right - left <= 2 || palindrome[left + 1][right - 1]);
               }
           }
           return palindrome;
       }

       int prefixDynamicProgramming(const std::string& s) {
           const int length = static_cast<int>(s.size());
           const auto palindrome = buildPalindromeTable(s);
           std::vector<int> minimumCuts(length + 1, 0);
           minimumCuts[0] = -1;

           for (int end = 1; end <= length; ++end) {
               minimumCuts[end] = end - 1;
               for (int start = 0; start < end; ++start) {
                   if (palindrome[start][end - 1]) {
                       minimumCuts[end] = std::min(
                           minimumCuts[end],
                           minimumCuts[start] + 1
                       );
                   }
               }
           }
           return minimumCuts[length];
       }

   public:
       int minCut(std::string s) {
           return prefixDynamicProgramming(s);
       }
   };

题解
----

原始空间与“只求最优”的新信息
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

长度为 ``n`` 的字符串有 ``n-1`` 个潜在切缝，所有切分方案最多达到 ``2^(n-1)``。像上一题那样回溯能够
列出每条合法路径，再从中选片段最少的一条；但本题不要求方案内容，只要求一个最小值。许多不同前缀切法
到达同一后缀起点后，未来可选的回文片段完全相同，继续分别搜索是在重复解决同一个问题。

令状态 ``start`` 表示尚未处理的后缀 ``s[start..n-1]``。枚举它的第一段 ``s[start..end]``，只在该段为
回文时继续。``minimumPiecesFrom(start)`` 等于一加剩余后缀的最少片段数；同一个 ``start`` 的结果记忆一次，
就把指数路径树压缩成 ``n`` 个后缀状态。

方案一：记忆化后缀最少片段数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``minimumPiecesFrom`` 的终点 ``start == n`` 返回零，表示空后缀不再需要片段；非空状态最坏可逐字符切开，
所以 ``bestPieces`` 初值为剩余字符数。每个合法首段贡献一个片段，再接 ``end+1`` 后缀的最优值。

代码先算片段数，公开辅助方案最后减一得到切割数。这样递归终点自然，但每个状态仍要枚举 ``O(n)`` 个终点，
每次 ``isPalindrome`` 又可能比较 ``O(n)`` 个字符，最坏时间 ``O(n^3)``。记忆化删除了重复后缀搜索，却没
删除不同状态转移对区间回文性的重复判断。

回文表提供可共享的转移条件
~~~~~~~~~~~~~~~~~~~~~~~~~~

区间 ``[left, right]`` 为回文，当且仅当两端字符相等，并且区间长度不超过三或内部区间为回文：

.. code-block:: text

   palindrome[left][right] =
       s[left] == s[right] &&
       (right - left <= 2 || palindrome[left + 1][right - 1])

``left`` 从右向左计算，保证更靠内的状态已经就绪。预处理花费 ``O(n^2)`` 后，每个候选最后片段是否回文
都能在 ``O(1)`` 时间确定。

从后缀递归改写为前缀最优
~~~~~~~~~~~~~~~~~~~~~~~~

主解令 ``minimumCuts[end]`` 表示前 ``end`` 个字符 ``s[0..end-1]`` 的最少切割。对每个 ``end``，枚举最后
一段的起点 ``start``；若 ``s[start..end-1]`` 是回文，前缀 ``[0, start)`` 的最优切法与最后一段之间增加
一刀：

.. code-block:: text

   minimumCuts[end] = min(minimumCuts[start] + 1)
                      对所有回文 s[start..end-1]

最后一段确定后，它与更早的具体切点互不影响。如果前缀使用的不是最少切割，可以用更优前缀替换且保持
最后一段不变，所以只保存 ``minimumCuts[start]`` 不会丢失全局最优方案。

为何空前缀必须设为负一
~~~~~~~~~~~~~~~~~~~~~~

``minimumCuts[0] = -1`` 是对“片段数比切割数多一”的统一编码。若 ``s[0..end-1]`` 整段为回文，转移取
``start = 0``，得到 ``-1 + 1 = 0``，恰好表示第一段前面不需要切刀。若把空前缀设为零，整串回文也会被
误算成一刀。

对非空前缀，逐字符切开最多需要 ``end-1`` 刀，因此代码以它初始化。这个上界也保证即使只找到单字符
回文，状态仍会得到合法答案。

具体走读 ``aab``
~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - ``end`` 与前缀
     - 可作最后一段的回文
     - ``minimumCuts[end]``
   * - ``0``，空前缀
     - 不适用
     - ``-1``
   * - ``1``，``a``
     - ``s[0..0] = "a"``
     - ``-1 + 1 = 0``
   * - ``2``，``aa``
     - ``"a"``、``"aa"``
     - 整段 ``"aa"`` 令结果为 ``0``
   * - ``3``，``aab``
     - 最后一段只能取 ``"b"``
     - ``minimumCuts[2] + 1 = 1``

这里无需保存 ``["a", "a", "b"]`` 与 ``["aa", "b"]`` 两条路径；前缀 ``aa`` 只留下切割数零，便足以
决定追加 ``b`` 后的最优值。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开入口采用二维回文表加一维前缀 DP，状态含义和计算顺序清楚，时间 ``O(n^2)``、空间 ``O(n^2)``。
记忆化后缀方案只需 ``O(n)`` 状态和递归栈，但由于即时回文检查最坏达到 ``O(n^3)``，保留它是为了展示
从答案枚举到最优值状态压缩的第一步，而非主解。返回方案本身不在题目要求中，所以代码完全删除了路径
数组与回溯复制。
