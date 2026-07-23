0121. Best Time to Buy and Sell Stock
=====================================

题目信息
--------

:题号: 0121
:难度: Easy
:主题: 数组、单次交易、前缀最小值、单次扫描
:原题: `LeetCode 0121 <https://leetcode.com/problems/best-time-to-buy-and-sell-stock/>`_
:重点: 固定卖出日、历史最低价、交易顺序、零利润边界

题目重述
--------

给定按日期排列的价格数组，最多完成一次“先买后卖”的交易，返回最大非负利润。买入日必须严格早于卖出日；若没有盈利机会，返回 0。

自建示例
--------

.. code-block:: text

   [7,1,5,3,6,4] -> 5
   第 1 天以 1 买入，第 4 天以 6 卖出。

.. code-block:: text

   [7,6,4,3,1] -> 0
   [8] -> 0

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int pairEnumeration(const std::vector<int>& prices) {
           int best = 0;
           for (int buy = 0; buy < static_cast<int>(prices.size()); ++buy)
               for (int sell = buy + 1; sell < static_cast<int>(prices.size()); ++sell)
                   best = std::max(best, prices[sell] - prices[buy]);
           return best;
       }

       int suffixMaximum(const std::vector<int>& prices) {
           int n = prices.size();
           std::vector<int> highest(n);
           highest[n - 1] = prices[n - 1];
           for (int i = n - 2; i >= 0; --i)
               highest[i] = std::max(prices[i], highest[i + 1]);
           int best = 0;
           for (int buy = 0; buy + 1 < n; ++buy)
               best = std::max(best, highest[buy + 1] - prices[buy]);
           return best;
       }

       int prefixMinimum(const std::vector<int>& prices) {
           int lowest = prices[0], best = 0;
           for (int sell = 1; sell < static_cast<int>(prices.size()); ++sell) {
               best = std::max(best, prices[sell] - lowest);
               lowest = std::min(lowest, prices[sell]);
           }
           return best;
       }

   public:
       int maxProfit(std::vector<int>& prices) {
           return prefixMinimum(prices);
       }
   };

题解
----

固定卖出日后还缺什么
~~~~~~~~~~~~~~~~~~~~

若卖出日为 ``sell``，合法买入日只能来自 ``0..sell-1``。当前卖出日的最佳利润是：

.. code-block:: text

   prices[sell] - min(prices[0..sell-1])

因此不需要重复枚举所有买入日，只需维护历史最低价格。

更新顺序为何重要
~~~~~~~~~~~~~~~~

先用旧 ``lowest`` 计算当前卖出利润，再把当天价格加入最低价。这样买入日必然早于卖出日；若先更新最低价，当天可能同时被当作买入和卖出，虽然利润仍为 0，却破坏状态语义。

.. list-table::
   :header-rows: 1

   * - 卖出价
     - 历史最低价
     - 当前利润
     - 最大利润
   * - 1
     - 7
     - -6
     - 0
   * - 5
     - 1
     - 4
     - 4
   * - 3
     - 1
     - 2
     - 4
   * - 6
     - 1
     - 5
     - 5

为什么不能排序
~~~~~~~~~~~~~~

数组下标表达时间。排序会破坏“买入早于卖出”的约束，例如最低价出现在最后一天时，不能与之前的高价配对。

为什么下降序列返回 0
~~~~~~~~~~~~~~~~~~~~

``best`` 初始化为 0，表示可以不交易。每个合法卖出日产生的利润都为负时，最大值保持 0。

为什么覆盖全部交易
~~~~~~~~~~~~~~~~~~

任意合法交易都有唯一卖出日。扫描到该日时，``lowest`` 不高于该交易买入价，因此计算出的候选利润至少与它相同；另一方面候选使用真实历史价格，始终对应合法交易。取全部卖出日最大值即为全局最优。

复杂度来源
~~~~~~~~~~

双重枚举为 ``O(n²)``；后缀数组为 ``O(n)`` 时间、``O(n)`` 空间；前缀最低价扫描为 ``O(n)`` 时间、``O(1)`` 额外空间。

九语言实现
----------

C
~

.. code-block:: c

   int maxProfit(int*prices,int n){int lowest=prices[0],best=0;for(int i=1;i<n;i++){int profit=prices[i]-lowest;if(profit>best)best=profit;if(prices[i]<lowest)lowest=prices[i];}return best;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxProfit(self, prices: list[int]) -> int:
           lowest, best = prices[0], 0
           for price in prices[1:]:
               best = max(best, price - lowest)
               lowest = min(lowest, price)
           return best

Java
~~~~

.. code-block:: java

   class Solution {public int maxProfit(int[]p){int low=p[0],best=0;for(int i=1;i<p.length;i++){best=Math.max(best,p[i]-low);low=Math.min(low,p[i]);}return best;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn max_profit(prices:Vec<i32>)->i32{let mut low=prices[0];let mut best=0;for &p in &prices[1..]{best=best.max(p-low);low=low.min(p);}best}}

Go
~~

.. code-block:: go

   func maxProfit(prices []int)int{low,best:=prices[0],0;for _,p:=range prices[1:]{if p-low>best{best=p-low};if p<low{low=p}};return best}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxProfit(prices:number[]):number{let low=prices[0],best=0;for(let i=1;i<prices.length;i++){best=Math.max(best,prices[i]-low);low=Math.min(low,prices[i]);}return best;}

C#
~~

.. code-block:: csharp

   public class Solution {public int MaxProfit(int[]p){int low=p[0],best=0;for(int i=1;i<p.Length;i++){best=Math.Max(best,p[i]-low);low=Math.Min(low,p[i]);}return best;}}

Julia
~~~~~

.. code-block:: julia

   function max_profit(prices::Vector{Int})
       low=prices[1];best=0
       for p in prices[2:end];best=max(best,p-low);low=min(low,p);end
       best
   end

R
~

.. code-block:: r

   max_profit <- function(prices){low<-prices[[1L]];best<-0L;if(length(prices)>1L)for(p in prices[-1L]){best<-max(best,p-low);low<-min(low,p)};best}