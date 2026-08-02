0375. Guess Number Higher or Lower II
====================================

题目信息
--------

:题号: 0375
:难度: Medium
:主题: 保证获胜、最坏情况成本、猜数游戏、最小资金
:原题: `LeetCode 0375 <https://leetcode.com/problems/guess-number-higher-or-lower-ii/>`_
:重点: 猜错才支付所猜金额、提示目标更高或更低、目标由对手任意选择、求保证成功所需的最少资金

题目重述
--------

系统从 ``1`` 到 ``n`` 中秘密选择一个整数。每次猜测整数 ``x``：若猜中，游戏结束且不再支付；若猜错，需要支付 ``x`` 元，并获知目标比 ``x`` 更大还是更小，然后继续猜测。

需要预先准备足够资金，使无论系统选择哪个目标，都能保证最终猜中。返回在采用最佳策略时所需的最少保证资金。这里计算的是所有可能目标中的最坏情况成本，不是某个固定目标的实际花费，也不是平均花费。``n`` 位于 ``[1, 200]``。

自建示例
--------

三个候选数字：

.. code-block:: text

   输入：n = 3
   输出：2
   解释：先猜 2；猜中无需支付，猜错时支付 2 后即可根据提示确定目标是 1 还是 3，因此 2 元可以保证获胜。

只有一个候选数字：

.. code-block:: text

   输入：n = 1
   输出：0
   解释：第一次猜 1 必然正确，不会产生猜错费用。

区间状态取“猜法的最坏分支”
----------------------------

定义 ``dp[left][right]`` 为保证猜中闭区间 ``[left, right]`` 中任意目标所需的最少资金。若先猜 ``guess``，猜中时不花钱；猜错后目标会落在左区间或右区间，最坏成本是两个子区间所需资金的较大值，再加上本次猜错必付的 ``guess``。

因此固定首猜的成本为
``guess + max(dp[left][guess-1], dp[guess+1][right])``，再在所有可能的首猜中取最小。按区间长度从短到长填表，空区间成本视为零；这与“对手选择最坏目标、我们选择最优策略”的题意相匹配。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int getMoneyAmount(int n) {
           std::vector<std::vector<int>> dp(
               n + 2, std::vector<int>(n + 2, 0));

           for (int length = 2; length <= n; ++length) {
               for (int left = 1;
                    left + length - 1 <= n; ++left) {
                   int right = left + length - 1;
                   dp[left][right] = INT_MAX;
                   for (int guess = left; guess <= right; ++guess) {
                       int worst = std::max(
                           dp[left][guess - 1],
                           dp[guess + 1][right]);
                       dp[left][right] = std::min(
                           dp[left][right], guess + worst);
                   }
               }
           }
           return dp[1][n];
       }
   };

代码分析
--------

``max`` 模拟猜错方向由对手决定，``min`` 则选择我们预先采用的首猜；区间变短保证转移来源已完成。状态数为 ``O(n^2)``，每个区间枚举 ``O(n)`` 个猜测，时间复杂度为 ``O(n^3)``，额外空间为 ``O(n^2)``。
