0309. Best Time to Buy and Sell Stock with Cooldown
===================================================

题目信息
--------

:题号: 0309
:难度: Medium
:主题: 股票交易、交易状态、冷冻期、最大利润
:原题: `LeetCode 0309 <https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/>`_
:重点: 可以完成多次交易、同一时间最多持有一股、卖出后的下一天禁止买入

题目重述
--------

给定数组 ``prices``，其中 ``prices[i]`` 表示第 ``i`` 天的股票价格。可以进行任意多次买入和卖出，每次交易只能持有一股股票，因此必须先卖出当前持股才能再次买入。

卖出股票后的下一天属于冷冻期，不能在该天买入；可以选择什么都不做。返回在整个时间段内能够获得的最大总利润。``prices`` 的长度位于 ``[1, 5000]``，每个价格位于 ``[0, 1000]``。题目不收取交易手续费，也不要求返回具体交易日期。

自建示例
--------

冷冻期阻止紧接着再次买入：

.. code-block:: text

   输入：prices = [1, 4, 2, 3, 0, 5]
   输出：8
   解释：第 0 天以 1 买入、第 1 天以 4 卖出，利润为 3；第 2 天必须冷冻，之后第 4 天以 0 买入、第 5 天以 5 卖出，再获利 5，总利润为 8。

没有获利机会：

.. code-block:: text

   输入：prices = [6, 4, 2]
   输出：0
   解释：价格持续下降，选择不交易比任何买卖方案都好。

把每天结束时的持仓状态分开
----------------------------

冷冻期的限制只影响“今天能否买入”，所以关键不是记录最后一次交易，而是区分每天结束时所处的状态：``hold`` 表示手里持有股票，``sold`` 表示今天刚卖出，``rest`` 表示不持股且不处于刚卖出的状态。每个状态保存截至当天的最大利润。

第 ``i`` 天结束时，持有股票可以来自昨天继续持有，也可以从昨天的 ``rest`` 状态买入；不能从昨天 ``sold`` 买入，这正是冷冻期约束。今天刚卖出只能由昨天持股卖出；今天处于 ``rest`` 则可以来自昨天继续休息，或昨天已经卖出并度过冷冻期。用上一天的三个值计算新值，再覆盖旧值即可。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int maxProfit(std::vector<int>& prices) {
           const long long impossible = -(1LL << 60);
           long long hold = -prices[0];
           long long sold = impossible;
           long long rest = 0;

           for (int i = 1; i < static_cast<int>(prices.size()); ++i) {
               long long nextHold = std::max(hold,
                                             rest - prices[i]);
               long long nextSold = hold + prices[i];
               long long nextRest = std::max(rest, sold);
               hold = nextHold;
               sold = nextSold;
               rest = nextRest;
           }

           return static_cast<int>(std::max(sold, rest));
       }
   };

代码分析
--------

``newHold`` 只从旧的 ``rest`` 买入，因此不会把卖出后的第二天误当成可买入日；``newRest`` 接收旧的 ``sold``，表示冷冻期在今天结束。初始第一天不可能已经卖出，所以把 ``sold`` 设为负无穷，避免引入虚假的交易。三种状态只依赖上一天，时间复杂度为 ``O(n)``，额外空间为 ``O(1)``。
