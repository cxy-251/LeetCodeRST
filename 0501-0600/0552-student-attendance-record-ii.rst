0552. Student Attendance Record II
==================================

题目信息
--------

:题号: 0552
:难度: Hard
:主题: 出勤记录计数、长度固定、缺席上限、连续迟到、取模
:原题: `LeetCode 0552 <https://leetcode.com/problems/student-attendance-record-ii/>`_
:重点: 统计所有长度为 n 的合法字符串、A 最多一个、不能含 LLL、答案对 10^9+7 取模

题目重述
--------

给定正整数 ``n``，统计长度恰好为 ``n`` 的出勤记录字符串数量。每个位置可以是 ``'A'``、``'L'`` 或 ``'P'``，但合法记录必须同时满足：整个字符串中至多出现一次 ``A``；任何位置都不能出现连续三个 ``L``。

返回合法记录数量对 ``1,000,000,007`` 取模后的结果。不同字符串按字符序列区分；这是统计所有可能记录，而不是判断某一条已给定记录。

自建示例
--------

长度为一：

.. code-block:: text

   输入：n = 1
   输出：3
   解释："A"、"L"、"P" 三种记录都合法。

长度为二：

.. code-block:: text

   输入：n = 2
   输出：8
   解释：共有 9 个字符串，只有 "AA" 因出现两次缺席而不合法；长度 2 不可能含有 LLL。

状态记录缺席数和连续迟到数
--------------------------

构造记录时，合法性的未来只取决于已经使用了几次 ``A``（0 或 1）以及末尾连续 ``L`` 的长度（0、1 或 2）。在每个状态后追加 ``P``、``A`` 或 ``L``，若不违反限制就把方案数转移到新状态，并按模数保存。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int checkRecord(int n) {
           const int mod = 1000000007;
           std::array<std::array<long long, 3>, 2> dp{};
           dp[0][0] = 1;
           for (int day = 0; day < n; ++day) {
               std::array<std::array<long long, 3>, 2> next{};
               for (int absent = 0; absent <= 1; ++absent) {
                   for (int late = 0; late <= 2; ++late) {
                       long long ways = dp[absent][late];
                       if (ways == 0) continue;
                       next[absent][0] =
                           (next[absent][0] + ways) % mod;  // P
                       if (absent == 0) {
                           next[1][0] = (next[1][0] + ways) % mod; // A
                       }
                       if (late < 2) {
                           next[absent][late + 1] =
                               (next[absent][late + 1] + ways) % mod;
                       }
                   }
               }
               dp = next;
           }

           long long answer = 0;
           for (const auto& row : dp) {
               for (long long ways : row) answer = (answer + ways) % mod;
           }
           return static_cast<int>(answer);
       }
   };

代码分析
--------

状态中的两个维度正好保存追加字符所需的历史信息，所有合法记录都沿唯一字符序列转移到某个终态，非法的第二个 ``A`` 或第三个连续 ``L`` 不进入状态。状态数固定为 6，每天处理常数转移，时间复杂度为 ``O(n)``，空间复杂度为 ``O(1)``。
