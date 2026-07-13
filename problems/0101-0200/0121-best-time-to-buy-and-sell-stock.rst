0121. Best Time to Buy and Sell Stock
=====================================

题目信息
--------

:题号: 0121
:难度: Easy
:主题: 数组、贪心
:原题: `LeetCode 0121 <https://leetcode.com/problems/best-time-to-buy-and-sell-stock/>`_
:访问状态: Available
:教学重点: 前缀最低价

题目重述
--------

给定每日股价，最多完成一次先买后卖，返回最大利润；不交易利润为 0。

自建示例
--------

.. code-block:: text

   输入：prices = [7,1,5,3,6,4]
   输出：5

   输入：prices = [7,6,4,3,1]
   输出：0

问题抽象
--------

维护到当前日前的最低买入价 ``min_price``，以当前价卖出的最佳利润为 ``price-min_price``，更新全局最大值。

主解法：扫描前缀最小值
-------------

思路
~~~~

扫描前缀最小值。 前缀最低价

核心状态与不变量
~~~~~~~~~~~~~~~~

维护到当前日前的最低买入价 ``min_price``，以当前价卖出的最佳利润为 ``price-min_price``，更新全局最大值。

正确性依据
~~~~~~~~~~

对每个卖出日，最优买入日必是此前最低价格；算法计算并比较了每个可能卖出日的最优利润，因此最大值就是全局最优。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；额外空间 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   int maxProfit(int*p,int n) {
       if(n<2)return 0;
       int low=p[0],best=0;
       for(int i=1;i<n;i++) {
           if(p[i]-low>best)best=p[i]-low;
           if(p[i]<low)low=p[i];
       }
       return best;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:int maxProfit(vector<int>&p) {
           int low=INT_MAX,best=0;
           for(int x:p) {
               best=max(best,x-low);
               low=min(low,x);
           }
           return best;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def maxProfit(self, prices: list[int]) -> int:
           low = float('inf')
           best = 0
           for x in prices:
               best = max(best, x - low)
               low = min(low, x)
           return best
Java
~~~~

.. code-block:: java

   class Solution {
       public int maxProfit(int[]p) {
           int low=Integer.MAX_VALUE,best=0;
           for(int x:p) {
               best=Math.max(best,x-low);
               low=Math.min(low,x);
           }
           return best;
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn max_profit(p:Vec<i32>)->i32 {
           let(mut low,mut best)=(i32::MAX,0);
           for x in p {
               best=best.max(x-low);
               low=low.min(x);
           }
           best
       }
   }
Go
~~

.. code-block:: go

   func maxProfit(p []int) int {
   	low := int(^uint(0) >> 1)
   	best := 0
   	for _, x := range p {
   		if x-low > best {
   			best = x - low
   		}
   		if x < low {
   			low = x
   		}
   	}
   	return best
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxProfit(p: number[]): number {
       let low = Infinity, best = 0;
       for (const x of p) {
           best = Math.max(best, x - low);
           low = Math.min(low, x);
       }
       return best;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int MaxProfit(int[]p) {
           int low=int.MaxValue,best=0;
           foreach(int x in p) {
               best=Math.Max(best,x-low);
               low=Math.Min(low,x);
           }
           return best;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function max_profit(p::Vector{Int})::Int
       low=typemax(Int)
       best=0
       for x in p
           best=max(best,x-low)
           low=min(low,x)
       end
       best
   end
R
~

.. code-block:: r

   max_profit <- function(p) {
       low<-Inf
       best<-0
       for(x in p) {
           best<-max(best,x-low)
           low<-min(low,x)
       }
       as.integer(best)
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 少于两天时利润为 0。
* 利润不能为负。

易错点
------

* 先更新最低价后错误允许同日买卖虽然利润仍 0，但状态解释混乱。
* 寻找全局最低和其后全局最高时忽略顺序。

本题新增知识
------------

* 前缀最低价
* 题号 0121 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0122. Best Time to Buy and Sell Stock II <0122-best-time-to-buy-and-sell-stock-ii.rst>`_；
* `0123. Best Time to Buy and Sell Stock III <0123-best-time-to-buy-and-sell-stock-iii.rst>`_；

最小自检
--------

#. ``扫描前缀最小值`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

对每个卖出日，最优买入日必是此前最低价格；算法计算并比较了每个可能卖出日的最优利润，因此最大值就是全局最优。
