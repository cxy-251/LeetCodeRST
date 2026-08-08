0121. Best Time to Buy and Sell Stock
=====================================

题目信息
--------

:题号: 0121. 买卖股票的最佳时机
:难度: Easy
:主题: 数组、下标对枚举、前缀最小值、单次扫描
:原题: `LeetCode 0121 <https://leetcode.com/problems/best-time-to-buy-and-sell-stock/>`_
:重点: 固定交易一端后删除另一端的重复搜索，再把后缀数组压缩为扫描中的历史最低价

题目重述
--------

给定整数数组 ``prices``，其中 ``prices[i]`` 是第 ``i`` 天的股票价格。最多完成一笔交易：选择一天买入，
再选择严格更晚的一天卖出，利润为卖出价减买入价。也可以不交易，因此最大利润不会小于 ``0``。

数组长度在 ``1..10^5`` 范围内，每个价格在 ``0..10^4`` 范围内。不能排序后再配对，因为数组下标表示时间。

自建示例
--------

* 中途低点买入：``prices = [9,4,7,2,8,5]``，返回 ``6``，在价格 ``2`` 时买入、价格 ``8`` 时卖出；
* 最低价位于最后：``prices = [5,8,2]``，返回 ``3``，不能把最后的 ``2`` 与此前的 ``8`` 反向配对；
* 无利润：``prices = [3,3,2,2]``，返回 ``0``；
* 单天：``prices = [7]``，没有合法买卖日对，返回 ``0``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int enumerateTransactions(const std::vector<int>& prices) {
           int maximumProfit = 0;
           for (int buy = 0; buy < static_cast<int>(prices.size()); ++buy) {
               for (int sell = buy + 1; sell < static_cast<int>(prices.size()); ++sell) {
                   maximumProfit = std::max(maximumProfit, prices[sell] - prices[buy]);
               }
           }
           return maximumProfit;
       }

       int suffixMaximumPrices(const std::vector<int>& prices) {
           const int count = static_cast<int>(prices.size());
           std::vector<int> highestFrom(count);
           highestFrom[count - 1] = prices[count - 1];
           for (int day = count - 2; day >= 0; --day) {
               highestFrom[day] = std::max(prices[day], highestFrom[day + 1]);
           }
           int maximumProfit = 0;
           for (int buy = 0; buy + 1 < count; ++buy) {
               maximumProfit = std::max(maximumProfit, highestFrom[buy + 1] - prices[buy]);
           }
           return maximumProfit;
       }

       int prefixMinimumPrice(const std::vector<int>& prices) {
           int lowestEarlierPrice = prices[0];
           int maximumProfit = 0;
           for (int sell = 1; sell < static_cast<int>(prices.size()); ++sell) {
               maximumProfit = std::max(maximumProfit, prices[sell] - lowestEarlierPrice);
               lowestEarlierPrice = std::min(lowestEarlierPrice, prices[sell]);
           }
           return maximumProfit;
       }

   public:
       int maxProfit(std::vector<int>& prices) {
           return prefixMinimumPrice(prices);
       }
   };

题解
----

交易下标对
~~~~~~~~~~

原始搜索空间是所有满足 ``buy < sell`` 的下标对。``enumerateTransactions`` 固定买入日后枚举所有更晚卖出日，
恰好检查每笔合法交易一次；``maximumProfit`` 从 ``0`` 开始，使全部价差非正时选择不交易。

长度为 ``n`` 时共有 ``n(n - 1) / 2`` 个候选，时间为 ``O(n²)``。每次价差计算很便宜，瓶颈是对不同买入日
反复寻找其右侧的最高价格，或对不同卖出日反复寻找其左侧的最低价格。

固定买入日
~~~~~~~~~~

若买入日 ``buy`` 已定，最佳卖出价就是严格位于其后的最高价格。``suffixMaximumPrices`` 从右向左预处理：

.. code-block:: text

   highestFrom[day] = max(prices[day], highestFrom[day + 1])

随后每个买入日只查询 ``highestFrom[buy + 1]``，保证卖出严格更晚。第二层枚举被后缀查询替代，时间降为
``O(n)``，代价是保存 ``O(n)`` 的最高价数组。

这个数组中的相邻状态只服务于构造；最终扫描买入日时仍需要整份后缀，因为未来最高价位于尚未处理的方向。
若改为固定卖出日，所需的最低买入价来自已经扫描过的历史，可以边走边压缩为一个整数。

固定卖出日
~~~~~~~~~~

扫描到卖出日 ``sell`` 时，合法买入日只能来自 ``[0, sell)``。该日能得到的最佳利润为：

.. code-block:: text

   prices[sell] - min(prices[0..sell - 1])

``prefixMinimumPrice`` 用 ``lowestEarlierPrice`` 维护这个前缀最小值。先以旧最低价计算当前卖出候选，再把当天
价格纳入最低价，保持“状态只包含严格更早日期”的含义。后缀数组和第二次扫描随之消失，工作空间降为常数。

状态走读
~~~~~~~~

对 ``[9,4,7,2,8,5]``：

.. list-table::
   :header-rows: 1

   * - 卖出日价格
     - 计算前历史最低价
     - 当日候选利润
     - 扫描后最大利润
     - 更新后最低价
   * - 4
     - 9
     - -5
     - 0
     - 4
   * - 7
     - 4
     - 3
     - 3
     - 4
   * - 2
     - 4
     - -2
     - 3
     - 2
   * - 8
     - 2
     - 6
     - 6
     - 2
   * - 5
     - 2
     - 3
     - 6
     - 2

任意合法交易都有唯一卖出日。扫描到该日时，历史最低价对应一个真实且更早的买入日，产生的候选合法；它又
不高于任何其他买入价，所以覆盖该卖出日的全部交易。取所有卖出日候选的最大值即为全局最优。

排序与主解选择
~~~~~~~~~~~~~~

不能把价格排序后用最大值减最小值，排序会丢失日期约束。``[5,8,2]`` 的全局最低价 ``2`` 出现在最高价
``8`` 之后，两者不能组成交易。

公开入口采用前缀最低价扫描，因为它在线性时间内同时保持时间顺序和最优历史买入价，且只需两个整数状态。
单天数组的循环不执行，初始利润 ``0`` 自然返回。

复杂度分析
~~~~~~~~~~

下标对枚举时间 ``O(n²)``、空间 ``O(1)``；后缀最高价方法时间 ``O(n)``、空间 ``O(n)``；前缀最低价
主解时间 ``O(n)``、额外空间 ``O(1)``。所有方法只读取价格数组。
