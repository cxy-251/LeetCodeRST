0122. Best Time to Buy and Sell Stock II
========================================

题目信息
--------

:题号: 0122
:难度: Medium
:主题: 数组、多次交易、贪心、相邻差分
:原题: `LeetCode 0122 <https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/>`_
:重点: 正涨幅累加、区间利润拆分、可实现性、交易不重叠

题目重述
--------

给定按日期排列的股票价格数组 ``prices``，可以进行任意多次买卖，返回能够获得的最大利润。任意时刻最多持有一股股票，因此再次买入前必须先卖出当前持有的股票；也可以选择不进行交易。

自建示例
--------

.. code-block:: text

   [7,1,5,3,6,4] -> 7
   1->5 得 4，3->6 得 3。

.. code-block:: text

   [1,2,3,4,5] -> 4
   [7,6,4,3,1] -> 0

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int stateMachine(const std::vector<int>& prices) {
           int hold = -prices[0], cash = 0;
           for (int i = 1; i < static_cast<int>(prices.size()); ++i) {
               int old_hold = hold, old_cash = cash;
               hold = std::max(old_hold, old_cash - prices[i]);
               cash = std::max(old_cash, old_hold + prices[i]);
           }
           return cash;
       }

       int valleyPeak(const std::vector<int>& prices) {
           int profit = 0, index = 0, n = prices.size();
           while (index + 1 < n) {
               while (index + 1 < n && prices[index + 1] <= prices[index]) ++index;
               int valley = prices[index];
               while (index + 1 < n && prices[index + 1] >= prices[index]) ++index;
               profit += prices[index] - valley;
           }
           return profit;
       }

       int positiveDifferences(const std::vector<int>& prices) {
           int profit = 0;
           for (int day = 1; day < static_cast<int>(prices.size()); ++day)
               profit += std::max(0, prices[day] - prices[day - 1]);
           return profit;
       }

   public:
       int maxProfit(std::vector<int>& prices) {
           return positiveDifferences(prices);
       }
   };

题解
----

交易利润如何拆成相邻变化
~~~~~~~~~~~~~~~~~~~~~~~~

一次从 ``buy`` 到 ``sell`` 的利润可望远镜展开：

.. code-block:: text

   prices[sell] - prices[buy]
     = Σ(prices[d] - prices[d-1]), d=buy+1..sell

若区间中出现负变化，可以在下降前卖出、下降后重新买入，把该负项从总利润中删除。

为什么正涨幅总和是上界
~~~~~~~~~~~~~~~~~~~~~~

任意合法交易组合覆盖若干互不重叠日期区间。每笔利润都是其区间内相邻差分之和；删除其中负项只会增大结果，因此所有交易总利润不超过全数组正差分之和。

为什么这个上界能够实现
~~~~~~~~~~~~~~~~~~~~~~

把每段连续上涨区间视为一次“谷底买入、峰顶卖出”的交易。该交易利润恰好等于区间内全部正差分之和，各上涨段由下降或数组边界分隔，持仓区间不重叠。因此正差分总和是可实现利润。

.. list-table::
   :header-rows: 1

   * - 相邻价格
     - 差分
     - 累计
   * - ``7 -> 1``
     - -6
     - 0
   * - ``1 -> 5``
     - 4
     - 4
   * - ``5 -> 3``
     - -2
     - 4
   * - ``3 -> 6``
     - 3
     - 7

连续上涨为何可拆可合
~~~~~~~~~~~~~~~~~~~~

``1->2->3`` 的正差分和为 ``1+1=2``，等于一次 ``1->3`` 交易利润。逐日交易只是数学拆分，不要求实际同时持有多股。

状态机为何等价
~~~~~~~~~~~~~~

``hold`` 表示扫描到当天后持股的最大现金，``cash`` 表示空仓最大现金。每天选择保持状态、买入或卖出。交易次数不限时，这两个状态足以描述全部历史；最终必须空仓，所以返回 ``cash``。

复杂度来源
~~~~~~~~~~

三种方法都为 ``O(n)`` 时间。正差分和状态最少，只使用 ``O(1)`` 额外空间。

九语言实现
----------

C
~

.. code-block:: c

   int maxProfit(int*prices,int n){int profit=0;for(int i=1;i<n;i++)if(prices[i]>prices[i-1])profit+=prices[i]-prices[i-1];return profit;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxProfit(self, prices: list[int]) -> int:
           return sum(max(0, prices[i] - prices[i-1]) for i in range(1, len(prices)))

Java
~~~~

.. code-block:: java

   class Solution {public int maxProfit(int[]p){int out=0;for(int i=1;i<p.length;i++)if(p[i]>p[i-1])out+=p[i]-p[i-1];return out;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn max_profit(prices:Vec<i32>)->i32{prices.windows(2).map(|w|(w[1]-w[0]).max(0)).sum()}}

Go
~~

.. code-block:: go

   func maxProfit(prices []int)int{out:=0;for i:=1;i<len(prices);i++{if prices[i]>prices[i-1]{out+=prices[i]-prices[i-1]}};return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxProfit(prices:number[]):number{let out=0;for(let i=1;i<prices.length;i++)out+=Math.max(0,prices[i]-prices[i-1]);return out;}

C#
~~

.. code-block:: csharp

   public class Solution {public int MaxProfit(int[]p){int o=0;for(int i=1;i<p.Length;i++)o+=Math.Max(0,p[i]-p[i-1]);return o;}}

Julia
~~~~~

.. code-block:: julia

   max_profit(prices::Vector{Int}) = sum(max(0,prices[i]-prices[i-1]) for i in 2:length(prices))

R
~

.. code-block:: r

   max_profit <- function(prices){if(length(prices)<2L)return(0L);sum(pmax(0L,diff(prices)))}