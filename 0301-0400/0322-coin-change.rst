0322. Coin Change
=================

题目信息
--------

:题号: 0322
:难度: Medium
:主题: 硬币面额、无限使用、最少数量、不可达状态
:原题: `LeetCode 0322 <https://leetcode.com/problems/coin-change/>`_
:重点: 每种面额可使用任意次、目标必须恰好组成、无解返回 -1、金额 0 返回 0

题目重述
--------

给定整数数组 ``coins``，其中每个元素是一种正整数硬币面额，以及非负整数 ``amount``。每种面额的硬币数量无限，选择若干硬币使面额总和恰好等于 ``amount``，返回所需硬币的最少数量。

若无法恰好组成目标金额，返回 ``-1``；当 ``amount == 0`` 时不需要任何硬币，返回 ``0``。``coins`` 的长度位于 ``[1, 12]``，每个面额位于 ``[1, 2^31-1]``，``amount`` 位于 ``[0, 10^4]``。

自建示例
--------

同一面额可以重复使用：

.. code-block:: text

   输入：coins = [2, 5]，amount = 7
   输出：2
   解释：使用一个 2 和一个 5 可以恰好组成 7，无法只用一枚硬币完成。

目标金额不可达：

.. code-block:: text

   输入：coins = [4, 6]，amount = 5
   输出：-1
   解释：任意数量的 4 和 6 之和都不能等于 5。

金额为零：

.. code-block:: text

   输入：coins = [9]，amount = 0
   输出：0
   解释：空选择的总金额就是 0，因此不需要硬币。

按金额建立最少硬币数
----------------------

定义 ``dp[x]`` 为恰好组成金额 ``x`` 所需的最少硬币数；不可达状态先设为一个大于任何可能答案的值。``dp[0] = 0`` 是空选择的真实基础。对于当前金额 ``x``，若使用一枚面额 ``coin`` 作为最后一枚硬币，前面的部分必须恰好组成 ``x - coin``，因此可以从 ``dp[x - coin] + 1`` 转移。

金额按从小到大计算，所有转移来源都已经确定。由于同一面额可以无限使用，当前循环再次读取更小金额的状态就自然允许重复使用；而“最后一枚硬币”的枚举覆盖了每一种组合。金额大于 ``amount`` 的面额不可能参与任何解，可以直接跳过。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int coinChange(std::vector<int>& coins, int amount) {
           const int impossible = amount + 1;
           std::vector<int> dp(amount + 1, impossible);
           dp[0] = 0;

           for (int current = 1; current <= amount; ++current) {
               for (long long coin : coins) {
                   if (coin > current) continue;
                   int previous = current - static_cast<int>(coin);
                   dp[current] = std::min(dp[current], dp[previous] + 1);
               }
           }

           return dp[amount] == impossible ? -1 : dp[amount];
       }
   };

代码分析
--------

``amount + 1`` 足以作为不可达标记，因为任何可达金额最多使用 ``amount`` 枚面额至少为 1 的硬币；即使从不可达状态加一，也不会产生整数溢出。``coin`` 用 ``long long`` 接收，比较时不会因题目允许的超大面额而发生窄化问题。时间复杂度为 ``O(amount * coins.size())``，额外空间为 ``O(amount)``；金额为零时只读取 ``dp[0]`` 并返回零。
