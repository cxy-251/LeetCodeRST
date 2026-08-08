0122. Best Time to Buy and Sell Stock II
========================================

题目信息
--------

:题号: 0122. 买卖股票的最佳时机 II
:难度: Medium
:主题: 数组、多次交易、状态机、相邻差分贪心
:原题: `LeetCode 0122 <https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/>`_
:重点: 先用持股/空仓状态压缩交易序列，再利用次数不限这一结构把任意上涨区间拆成全部正相邻差分

题目重述
--------

给定价格数组 ``prices``，其中 ``prices[i]`` 是第 ``i`` 天的股价。可以完成任意多笔交易，但任意时刻最多
持有一股：再次买入前必须卖出已有持仓。交易端点可以相接，不交易也是合法选择。返回最大总利润。

数组长度在 ``1..3 * 10^4`` 范围内，每个价格在 ``0..10^4`` 范围内。交易必须遵守日期顺序，不能通过
排序价格忽略时间。

自建示例
--------

* 两段上涨：``prices = [5,2,6,1,4,7]``，返回 ``10``，利润为 ``(6-2) + (7-1)``；
* 连续上涨：``prices = [1,3,5,8]``，返回 ``7``，一次 ``1 -> 8`` 与逐段收集涨幅等价；
* 持续下降：``prices = [9,6,4,1]``，返回 ``0``；
* 价格不变：``prices = [4,4,4]``，返回 ``0``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int tradingStateMachine(const std::vector<int>& prices) {
           int cash = 0;
           int hold = -prices[0];
           for (int day = 1; day < static_cast<int>(prices.size()); ++day) {
               const int previousCash = cash;
               const int previousHold = hold;
               cash = std::max(previousCash, previousHold + prices[day]);
               hold = std::max(previousHold, previousCash - prices[day]);
           }
           return cash;
       }

       int collectPositiveDifferences(const std::vector<int>& prices) {
           int profit = 0;
           for (int day = 1; day < static_cast<int>(prices.size()); ++day) {
               profit += std::max(0, prices[day] - prices[day - 1]);
           }
           return profit;
       }

   public:
       int maxProfit(std::vector<int>& prices) {
           return collectPositiveDifferences(prices);
       }
   };

题解
----

交易序列空间
~~~~~~~~~~~~

允许多次交易后，候选不再是一个买卖下标对，而是若干按时间排列、互不重叠的持仓区间。直接搜索每天买入、
卖出或等待的决定会产生指数级交易序列，并且许多不同历史在某天结束时具有相同的持仓状态。

未来决策不需要知道过去每笔交易的端点，只需要知道当前是否持股，以及在该状态下已经能保留的最大现金。
这把完整交易历史压缩为两个状态。

持股与空仓状态
~~~~~~~~~~~~~~

扫描完某天后定义：

* ``cash``：当天结束时不持股的最大利润；
* ``hold``：当天结束时持有一股时的最大现金值，买入成本已扣除。

第一天可以不交易得到 ``cash = 0``，或买入得到 ``hold = -prices[0]``。之后每一天：

.. code-block:: text

   newCash = max(previousCash,
                 previousHold + price)

   newHold = max(previousHold,
                 previousCash - price)

空仓状态来自继续空仓或今天卖出；持股状态来自继续持股或今天买入。两类来源覆盖全部合法最后动作，且都从
前一天状态转移，不会同时持有两股。最终持股仍包含未兑现股票，答案取 ``cash``。

``tradingStateMachine`` 保存旧状态后再更新，保持每个转移都明确来自前一天。这一 DP 已把指数交易序列降为
``O(n)`` 时间和常量状态，适用于从规则直接推导答案。

区间利润拆分
~~~~~~~~~~~~

本题没有交易次数上限、手续费或冷冻期，这使状态机还能进一步化简。一次从 ``buy`` 到 ``sell`` 的利润可以
写成沿途相邻差分的望远镜和：

.. code-block:: text

   prices[sell] - prices[buy]
     = sum(prices[day] - prices[day - 1])
       for day = buy + 1 .. sell

若持仓区间包含负差分，可以在下降前卖出、下降后重新买入，去掉该负项而不减少其他利润。若连续若干天都是
正差分，把每天涨幅分别实现，和在谷底买入、峰顶卖出完全相同；交易端点相接不会造成同时持有多股。

最优上界与实现
~~~~~~~~~~~~~~

任意合法交易组合由若干不重叠区间组成，每笔利润都是其覆盖的相邻差分之和。删除所有非正差分只会让总和
更大，因此任何方案都不超过全数组正差分之和。

这个上界又可以实现：对每个 ``prices[day] > prices[day - 1]`` 的相邻上涨，视为前一天买入、当天卖出；
连续上涨日的相邻交易可以共享端点，下降日则保持空仓。每个正差分都被合法收集一次，所以正差分总和就是
最大利润，而不只是一个估计。

对 ``[5,2,6,1,4,7]``：

.. list-table::
   :header-rows: 1

   * - 相邻价格
     - 差分
     - 收集利润
     - 累计利润
   * - ``5 -> 2``
     - -3
     - 0
     - 0
   * - ``2 -> 6``
     - 4
     - 4
     - 4
   * - ``6 -> 1``
     - -5
     - 0
     - 4
   * - ``1 -> 4``
     - 3
     - 3
     - 7
   * - ``4 -> 7``
     - 3
     - 3
     - 10

主解与复杂度
~~~~~~~~~~~~

公开入口采用正差分贪心，因为它利用“次数不限且无额外交易约束”删除了显式持股状态，只保留累计利润。
状态机仍有教学价值：若以后加入手续费、冷冻期或交易次数限制，正差分结论通常失效，而状态转移可以扩展。

两种实现都扫描数组一次，时间 ``O(n)``、额外空间 ``O(1)``。持续下降或价格不变时没有正差分，初始利润
``0`` 自然表示不交易。
