0123. Best Time to Buy and Sell Stock III
=========================================

题目信息
--------

:题号: 0123. 买卖股票的最佳时机 III
:难度: Hard
:主题: 数组、有限交易次数、前后缀最优、交易状态机
:原题: `LeetCode 0123 <https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/>`_
:重点: 从四个交易端点的搜索，先用分割日组合两次单笔最优，再压缩为买一、卖一、买二、卖二四阶段

题目重述
--------

给定价格数组 ``prices``，最多完成两笔交易。每笔交易由一次买入和之后的一次卖出组成；任意时刻最多持有
一股，因此第二次买入只能在第一次卖出后进行。可以只做一笔或完全不交易，返回最大总利润。

数组长度在 ``1..10^5`` 范围内，每个价格在 ``0..10^5`` 范围内。交易必须遵守日期顺序，不能让两段持仓
区间重叠。

自建示例
--------

* 两段交易：``prices = [6,1,5,2,8,3,9]``，返回 ``13``，可做 ``1 -> 8`` 与 ``3 -> 9``；
* 只有一段上涨：``prices = [1,2,3,4]``，返回 ``3``，不必强制完成两笔；
* 持续下降：``prices = [5,4,3]``，返回 ``0``；
* 单天：``prices = [7]``，返回 ``0``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int splitPrefixAndSuffix(const std::vector<int>& prices) {
           const int count = static_cast<int>(prices.size());
           std::vector<int> prefixProfit(count);
           std::vector<int> suffixProfit(count);
           int lowestPrice = prices[0];
           for (int day = 1; day < count; ++day) {
               lowestPrice = std::min(lowestPrice, prices[day]);
               prefixProfit[day] = std::max(prefixProfit[day - 1], prices[day] - lowestPrice);
           }
           int highestPrice = prices[count - 1];
           for (int day = count - 2; day >= 0; --day) {
               highestPrice = std::max(highestPrice, prices[day]);
               suffixProfit[day] = std::max(suffixProfit[day + 1], highestPrice - prices[day]);
           }
           int maximumProfit = 0;
           for (int split = 0; split < count; ++split) {
               maximumProfit = std::max(maximumProfit, prefixProfit[split] + suffixProfit[split]);
           }
           return maximumProfit;
       }

       int fourTradingStages(const std::vector<int>& prices) {
           int firstBuy = -prices[0];
           int firstSell = 0;
           int secondBuy = -prices[0];
           int secondSell = 0;
           for (int day = 1; day < static_cast<int>(prices.size()); ++day) {
               const int previousFirstBuy = firstBuy;
               const int previousFirstSell = firstSell;
               const int previousSecondBuy = secondBuy;
               const int previousSecondSell = secondSell;
               firstBuy = std::max(previousFirstBuy, -prices[day]);
               firstSell = std::max(previousFirstSell, previousFirstBuy + prices[day]);
               secondBuy = std::max(previousSecondBuy, previousFirstSell - prices[day]);
               secondSell = std::max(previousSecondSell, previousSecondBuy + prices[day]);
           }
           return secondSell;
       }

   public:
       int maxProfit(std::vector<int>& prices) {
           return fourTradingStages(prices);
       }
   };

题解
----

四个端点
~~~~~~~~

两笔交易可以由 ``buy1 < sell1 <= buy2 < sell2`` 四个时间端点描述。直接枚举所有有序四元组能覆盖全部候选，
但最坏需要四层搜索；还要把只做一笔和不交易作为额外情况。

交易不重叠提供了一个划分结构：总能找到某一天，把第一笔完整放在该日前缀，把第二笔完整放在该日后缀。
与其同时选择四个端点，可以先固定前后两段的分界。

分割日前后缀
~~~~~~~~~~~~

``prefixProfit[i]`` 表示日期 ``[0,i]`` 内最多一笔交易的最大利润，可在从左到右扫描中维护历史最低买价；
``suffixProfit[i]`` 表示日期 ``[i,n)`` 内最多一笔交易的最大利润，可从右向左维护未来最高卖价。

对每个 ``split``，``prefixProfit[split] + suffixProfit[split]`` 组合两段互不交叉的单笔最优。任意合法两笔交易
都能选择位于第一次卖出与第二次买入之间的分割日，因此会被某次组合覆盖；两张表中的 ``0`` 又允许某一段
不交易。

``splitPrefixAndSuffix`` 把四端点搜索降为三次线性扫描，但两张长度 ``n`` 的数组只为最后的组合服务。还可以
不显式枚举分割日，而是在每天结束时记录交易已经推进到哪个阶段。

四阶段状态
~~~~~~~~~~

扫描到某天后，合法历史按操作进度压缩为：

.. code-block:: text

   firstBuy   完成第一次买入后，持股状态的最大现金
   firstSell  完成第一次卖出后，空仓状态的最大利润
   secondBuy  完成第二次买入后，持股状态的最大现金
   secondSell 完成第二次卖出后，空仓状态的最大利润

每个状态都允许“至多推进到该阶段”，因此初始两个卖出状态为 ``0``，两个买入状态为 ``-prices[0]``；这让
不交易或只做一笔自然包含在后续最优值中，不必强制执行两次盈利交易。

每天以价格 ``price`` 更新：

.. code-block:: text

   firstBuy'   = max(firstBuy, -price)
   firstSell'  = max(firstSell, firstBuy + price)
   secondBuy'  = max(secondBuy, firstSell - price)
   secondSell' = max(secondSell, secondBuy + price)

每个第一项表示当天不执行该阶段操作，第二项表示由紧邻的前一阶段在今天完成买入或卖出。``secondBuy`` 可能
为正数，因为第一次交易的利润可以在支付第二次买入后仍留下正现金。

更新顺序
~~~~~~~~

代码先保存四个前一天快照，再统一计算新状态。这样第二次买入明确来自此前已经完成第一次卖出的历史，第二次
卖出也来自此前持有第二股的历史；状态边界不依赖同一天更新后的值。即使题目允许交易端点相接，快照写法仍让
转移来源最容易验证。

对 ``[6,1,5,2,8,3,9]``：

.. list-table::
   :header-rows: 1

   * - 处理价格
     - ``firstBuy``
     - ``firstSell``
     - ``secondBuy``
     - ``secondSell``
   * - 6
     - -6
     - 0
     - -6
     - 0
   * - 1
     - -1
     - 0
     - -1
     - 0
   * - 5
     - -1
     - 4
     - -1
     - 4
   * - 2
     - -1
     - 4
     - 2
     - 4
   * - 8
     - -1
     - 7
     - 2
     - 10
   * - 3
     - -1
     - 7
     - 4
     - 10
   * - 9
     - -1
     - 8
     - 4
     - 13

最终必须空仓，``secondSell = 13`` 同时覆盖至多零、一、两笔交易的最优方案。

主解与复杂度
~~~~~~~~~~~~

公开入口采用四阶段状态机，因为它把前后缀数组和分割日扫描压缩为四个整数，同时直接维护交易顺序。与无限
次交易不同，不能简单收集所有正差分；上涨段超过两段时必须选择或合并最有价值的两次交易。

前后缀方法时间 ``O(n)``、空间 ``O(n)``；四状态主解时间 ``O(n)``、额外空间 ``O(1)``。价格与最多两笔
利润之和都在 32 位整数范围内。
