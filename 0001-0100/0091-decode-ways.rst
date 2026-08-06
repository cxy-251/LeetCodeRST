0091. Decode Ways
=================

题目信息
--------

:题号: 0091
:难度: Medium
:主题: 字符串、动态规划、记忆化搜索、滚动状态
:原题: `LeetCode 0091 <https://leetcode.com/problems/decode-ways/>`_
:重点: 从枚举一位与两位切分，推导到只保留前两个前缀状态

题目重述
--------

数字 ``1`` 到 ``26`` 分别映射到字母 ``A`` 到 ``Z``。给定一个只包含数字的非空字符串 ``s``，
返回把整个字符串切分为合法编码的方案数。

一位编码只能是 ``1..9``，两位编码只能是 ``10..26``。字符 ``0`` 不能单独解码，也不能作为两位编码的首位。
题目保证最终答案位于 32 位有符号整数范围内。

自建示例
--------

.. code-block:: text

   输入：s = "1212"
   输出：5

合法切分为 ``1|2|1|2``、``12|1|2``、``1|21|2``、``1|2|12`` 和 ``12|12``。

.. code-block:: text

   输入：s = "101"
   输出：1

只有 ``10|1`` 合法；``1|01`` 中的 ``0`` 不能单独解码。

.. code-block:: text

   输入：s = "230"
   输出：0

``0`` 不能单独解码，而 ``30`` 超出 ``10..26``。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool validPair(char first, char second) {
           int value = (first - '0') * 10 + (second - '0');
           return 10 <= value && value <= 26;
       }

       int plainRecursion(const std::string& s, int index) {
           if (index == static_cast<int>(s.size())) {
               return 1;
           }
           if (s[index] == '0') {
               return 0;
           }

           int ways = plainRecursion(s, index + 1);
           if (index + 1 < static_cast<int>(s.size()) &&
               validPair(s[index], s[index + 1])) {
               ways += plainRecursion(s, index + 2);
           }
           return ways;
       }

       int memoDfs(const std::string& s, int index,
                   std::vector<int>& memo) {
           if (index == static_cast<int>(s.size())) {
               return 1;
           }
           if (s[index] == '0') {
               return 0;
           }
           if (memo[index] != -1) {
               return memo[index];
           }

           int ways = memoDfs(s, index + 1, memo);
           if (index + 1 < static_cast<int>(s.size()) &&
               validPair(s[index], s[index + 1])) {
               ways += memoDfs(s, index + 2, memo);
           }
           memo[index] = ways;
           return ways;
       }

       int memoizedSearch(const std::string& s) {
           std::vector<int> memo(s.size(), -1);
           return memoDfs(s, 0, memo);
       }

       int tableDp(const std::string& s) {
           int n = static_cast<int>(s.size());
           std::vector<int> dp(n + 1);
           dp[0] = 1;

           for (int length = 1; length <= n; ++length) {
               if (s[length - 1] != '0') {
                   dp[length] += dp[length - 1];
               }
               if (length >= 2 &&
                   validPair(s[length - 2], s[length - 1])) {
                   dp[length] += dp[length - 2];
               }
           }
           return dp[n];
       }

       int rollingDp(const std::string& s) {
           int twoBack = 1;
           int oneBack = s[0] == '0' ? 0 : 1;

           for (int length = 2;
                length <= static_cast<int>(s.size()); ++length) {
               int current = 0;
               if (s[length - 1] != '0') {
                   current += oneBack;
               }
               if (validPair(s[length - 2], s[length - 1])) {
                   current += twoBack;
               }

               twoBack = oneBack;
               oneBack = current;
           }
           return oneBack;
       }

   public:
       int numDecodings(std::string s) {
           return rollingDp(s);
       }
   };

解题思路
--------

递归切分
~~~~~~~~

从下标 ``index`` 开始，下一段编码只有两种长度：

* 当前字符不是 ``0`` 时，可以把它作为一位编码，递归处理 ``index + 1``；
* 当前两位处于 ``10..26`` 时，可以把它们作为两位编码，递归处理 ``index + 2``。

到达字符串末尾表示此前所有字符都已被合法切分，因此返回 1。遇到 ``0`` 则当前后缀无法从一位编码开始，返回 0。

同一个后缀会被不同切分路径重复计算。例如处理 ``1212`` 时，下标 2 既可能由 ``1|2`` 到达，也可能由 ``12`` 到达，
裸递归因此最坏呈指数增长。

后缀记忆化
~~~~~~~~~~

``memo[index]`` 保存后缀 ``s[index:]`` 的解码方案数。状态只由起始下标决定，因为此前如何切分不会改变剩余字符。
每个下标首次计算后写入缓存，后续直接复用，把重复递归压缩为线性数量的状态。

前缀动态规划
~~~~~~~~~~~~

定义 ``dp[length]`` 为前 ``length`` 个字符的完整解码方案数。最后一个编码只能占一位或两位：

.. code-block:: text

   s[length-1] 可以单独解码
       dp[length] += dp[length-1]

   s[length-2:length] 属于 10..26
       dp[length] += dp[length-2]

两类方案的最后一个编码长度不同，因此互不重复。任意完整解码也必然以其中一种编码结束，所以转移没有遗漏。

空前缀状态
~~~~~~~~~~

``dp[0] = 1`` 表示空前缀只有一种空切分。它让首个合法一位编码从 ``dp[0]`` 获得一个方案，也让前两个字符组成
合法两位编码时从 ``dp[0]`` 获得一个方案。

零的约束
~~~~~~~~

字符 ``0`` 会同时限制两条转移：

* 当前字符为 ``0`` 时，不能接收 ``dp[length-1]`` 的一位贡献；
* 只有 ``10`` 或 ``20`` 才能接收 ``dp[length-2]`` 的两位贡献。

因此 ``06`` 从首字符开始就是 0 种方案，``30`` 的两条转移都无效，而 ``10`` 恰好只保留 ``10`` 这一种切分。

状态演化
~~~~~~~~

以 ``11106`` 为例：

.. list-table::
   :header-rows: 1

   * - 前缀
     - 一位贡献
     - 两位贡献
     - 方案数
   * - 空
     - —
     - —
     - 1
   * - ``1``
     - 1
     - —
     - 1
   * - ``11``
     - 1
     - 1
     - 2
   * - ``111``
     - 2
     - 1
     - 3
   * - ``1110``
     - 0
     - 2
     - 2
   * - ``11106``
     - 2
     - 0
     - 2

滚动压缩
~~~~~~~~

计算 ``dp[length]`` 只依赖 ``dp[length-1]`` 和 ``dp[length-2]``。用 ``oneBack``、``twoBack`` 保存这两个状态，
先算出 ``current``，再整体向前滚动，即可把额外空间从 ``O(n)`` 降为 ``O(1)``。

复杂度
~~~~~~

裸递归最坏为指数时间，递归深度 ``O(n)``。记忆化搜索和两种动态规划均为 ``O(n)`` 时间；记忆化与完整表使用
``O(n)`` 空间，滚动动态规划使用 ``O(1)`` 额外空间。
