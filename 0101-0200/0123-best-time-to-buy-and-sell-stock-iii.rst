0123. Best Time to Buy and Sell Stock III
=========================================

题目信息
--------

:题号: 0123
:难度: Hard
:主题: 数组、有限交易次数、动态规划、状态机
:原题: `LeetCode 0123 <https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/>`_
:重点: 至多两次交易、单股持仓、两次交易不重叠

题目重述
--------

给定整数数组 ``prices``，其中 ``prices[i]`` 表示第 ``i`` 天的股票价格。最多完成两次买入和卖出交易；任意时刻最多持有一股股票，因此第二次买入只能发生在第一次卖出之后。可以只完成一次交易或完全不交易，返回能够获得的最大总利润。

数组长度在 ``1..10^5`` 范围内，每个价格在 ``0..10^5`` 范围内。

自建示例
--------

.. code-block:: text

   输入：prices = [6,1,5,2,8,3,9]
   输出：13
   解释：第一次以 1 买入、8 卖出，利润为 7；第二次以 3 买入、9 卖出，利润为 6，总利润为 13。

.. code-block:: text

   输入：prices = [5,4,3]
   输出：0
   解释：不存在盈利交易，因此不进行任何交易。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int splitPrefixSuffix(const std::vector<int>& prices) {
           int n = prices.size();
           std::vector<int> left(n), right(n);
           int lowest = prices[0];
           for (int i = 1; i < n; ++i) {
               lowest = std::min(lowest, prices[i]);
               left[i] = std::max(left[i - 1], prices[i] - lowest);
           }
           int highest = prices[n - 1];
           for (int i = n - 2; i >= 0; --i) {
               highest = std::max(highest, prices[i]);
               right[i] = std::max(right[i + 1], highest - prices[i]);
           }
           int best = 0;
           for (int split = 0; split < n; ++split)
               best = std::max(best, left[split] + right[split]);
           return best;
       }

       int transactionDp(const std::vector<int>& prices) {
           std::vector<int> cash(3), hold(3, -prices[0]);
           hold[0] = -1000000000;
           for (int i = 1; i < static_cast<int>(prices.size()); ++i) {
               std::vector<int> old_cash = cash, old_hold = hold;
               for (int count = 1; count <= 2; ++count) {
                   hold[count] = std::max(old_hold[count], old_cash[count - 1] - prices[i]);
                   cash[count] = std::max(old_cash[count], old_hold[count] + prices[i]);
               }
           }
           return std::max(cash[1], cash[2]);
       }

       int fourStates(const std::vector<int>& prices) {
           int hold1 = -prices[0], cash1 = 0;
           int hold2 = -prices[0], cash2 = 0;
           for (int i = 1; i < static_cast<int>(prices.size()); ++i) {
               int a = hold1, b = cash1, c = hold2, d = cash2;
               hold1 = std::max(a, -prices[i]);
               cash1 = std::max(b, a + prices[i]);
               hold2 = std::max(c, b - prices[i]);
               cash2 = std::max(d, c + prices[i]);
           }
           return cash2;
       }

   public:
       int maxProfit(std::vector<int>& prices) {
           return fourStates(prices);
       }
   };

题解
----

为什么需要四个阶段
~~~~~~~~~~~~~~~~~~

扫描到某天后，合法历史按交易进度分为：

.. code-block:: text

   hold1  第一次买入后持股
   cash1  第一次卖出后空仓
   hold2  第二次买入后持股
   cash2  第二次卖出后空仓

每个状态保存达到该阶段的最大现金，买入减价格，卖出加价格。

四个转移
~~~~~~~~

.. code-block:: text

   hold1' = max(hold1, -price)
   cash1' = max(cash1, hold1 + price)
   hold2' = max(hold2, cash1 - price)
   cash2' = max(cash2, hold2 + price)

保持旧状态表示当天不操作；另一项表示执行当前阶段唯一允许的操作。

为什么使用旧状态快照
~~~~~~~~~~~~~~~~~~~~

所有右侧表达式都应描述前一天结束后的状态。先保存四个旧值，再统一更新，使“第二次买入来自已经完成第一次交易的历史”清晰可证。题目允许同日卖出再买入，即使顺序更新也不会增加利润，但快照消除了实现依赖。

.. list-table::
   :header-rows: 1

   * - 价格
     - ``hold1``
     - ``cash1``
     - ``hold2``
     - ``cash2``
   * - 1
     - -1
     - 0
     - -1
     - 0
   * - 4
     - -1
     - 3
     - -1
     - 3
   * - 2
     - -1
     - 3
     - 1
     - 3
   * - 7
     - -1
     - 6
     - 1
     - 8

为什么允许少做交易
~~~~~~~~~~~~~~~~~~

``cash1``、``cash2`` 初始化为 0，``hold2`` 初始等同于只做第一次买入。状态含义是“至多使用相应次数”，因此下降序列自然保持 0，单段上涨也不被迫切成两笔。

分割点方法为何正确
~~~~~~~~~~~~~~~~~~

任选一个分割日，第一笔交易完全位于前缀，第二笔完全位于后缀；枚举全部分割点覆盖所有不重叠交易对。前后缀分别复用第 121 题即可，但需要 ``O(n)`` 数组。

为什么最终返回 cash2
~~~~~~~~~~~~~~~~~~~~

合法最终策略不能持股。``cash2`` 表示至多完成两次交易的最大空仓现金，它同时包含 0、1、2 次交易方案，因此就是答案。

复杂度来源
~~~~~~~~~~

前后缀方法为 ``O(n)`` 时间、``O(n)`` 空间；交易次数 DP 为 ``O(2n)``；四状态压缩为 ``O(n)`` 时间、``O(1)`` 空间。

九语言实现
----------

C
~

.. code-block:: c

   int maxProfit(int*p,int n){int h1=-p[0],c1=0,h2=-p[0],c2=0;for(int i=1;i<n;i++){int a=h1,b=c1,c=h2,d=c2;h1=a>-p[i]?a:-p[i];c1=b>a+p[i]?b:a+p[i];h2=c>b-p[i]?c:b-p[i];c2=d>c+p[i]?d:c+p[i];}return c2;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxProfit(self, prices: list[int]) -> int:
           hold1, cash1, hold2, cash2 = -prices[0], 0, -prices[0], 0
           for price in prices[1:]:
               a, b, c, d = hold1, cash1, hold2, cash2
               hold1 = max(a, -price); cash1 = max(b, a + price)
               hold2 = max(c, b - price); cash2 = max(d, c + price)
           return cash2

Java
~~~~

.. code-block:: java

   class Solution {public int maxProfit(int[]p){int h1=-p[0],c1=0,h2=-p[0],c2=0;for(int i=1;i<p.length;i++){int a=h1,b=c1,c=h2,d=c2;h1=Math.max(a,-p[i]);c1=Math.max(b,a+p[i]);h2=Math.max(c,b-p[i]);c2=Math.max(d,c+p[i]);}return c2;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn max_profit(p:Vec<i32>)->i32{let(mut h1,mut c1,mut h2,mut c2)=(-p[0],0,-p[0],0);for &x in &p[1..]{let(a,b,c,d)=(h1,c1,h2,c2);h1=a.max(-x);c1=b.max(a+x);h2=c.max(b-x);c2=d.max(c+x);}c2}}

Go
~~

.. code-block:: go

   func maxProfit(p []int)int{h1,c1,h2,c2:=-p[0],0,-p[0],0;for _,x:=range p[1:]{a,b,c,d:=h1,c1,h2,c2;h1=max(a,-x);c1=max(b,a+x);h2=max(c,b-x);c2=max(d,c+x)};return c2}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxProfit(p:number[]):number{let h1=-p[0],c1=0,h2=-p[0],c2=0;for(let i=1;i<p.length;i++){const[a,b,c,d]=[h1,c1,h2,c2],x=p[i];h1=Math.max(a,-x);c1=Math.max(b,a+x);h2=Math.max(c,b-x);c2=Math.max(d,c+x);}return c2;}

C#
~~

.. code-block:: csharp

   public class Solution {public int MaxProfit(int[]p){int h1=-p[0],c1=0,h2=-p[0],c2=0;for(int i=1;i<p.Length;i++){int a=h1,b=c1,c=h2,d=c2,x=p[i];h1=Math.Max(a,-x);c1=Math.Max(b,a+x);h2=Math.Max(c,b-x);c2=Math.Max(d,c+x);}return c2;}}

Julia
~~~~~

.. code-block:: julia

   function max_profit(p::Vector{Int})
       h1,c1,h2,c2=-p[1],0,-p[1],0
       for x in p[2:end];a,b,c,d=h1,c1,h2,c2;h1=max(a,-x);c1=max(b,a+x);h2=max(c,b-x);c2=max(d,c+x);end
       c2
   end

R
~

.. code-block:: r

   max_profit <- function(p){h1<--p[[1L]];c1<-0L;h2<--p[[1L]];c2<-0L;if(length(p)>1L)for(x in p[-1L]){a<-h1;b<-c1;c<-h2;d<-c2;h1<-max(a,-x);c1<-max(b,a+x);h2<-max(c,b-x);c2<-max(d,c+x)};c2}