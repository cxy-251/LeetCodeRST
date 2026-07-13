0122. Best Time to Buy and Sell Stock II
========================================

题目信息
--------

:题号: 0122
:难度: Medium
:主题: 数组、贪心
:原题: `LeetCode 0122 <https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/>`_
:访问状态: Available
:教学重点: 累加所有正差

题目重述
--------

允许多次交易但同一时间最多持有一股，返回最大利润。

自建示例
--------

.. code-block:: text

   输入：prices = [7,1,5,3,6,4]
   输出：7

   输入：prices = [1,2,3,4,5]
   输出：4

问题抽象
--------

把每个相邻上涨 ``prices[i]-prices[i-1]`` 的正值累加。

主解法：正增量贪心
-----------

思路
~~~~

正增量贪心。 累加所有正差

核心状态与不变量
~~~~~~~~~~~~~~~~

把每个相邻上涨 ``prices[i]-prices[i-1]`` 的正值累加。

正确性依据
~~~~~~~~~~

任意上升区间从谷买峰卖的利润等于区间内所有正相邻差之和；把交易切分或合并不改变利润。所有下降差应跳过，因此累加正差达到最优。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；空间 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   int maxProfit(int*p,int n) {
       int ans=0;
       for(int i=1;i<n;i++)if(p[i]>p[i-1])ans+=p[i]-p[i-1];
       return ans;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:int maxProfit(vector<int>&p) {
           int a=0;
           for(size_t i=1;i<p.size();i++)a+=max(0,p[i]-p[i-1]);
           return a;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def maxProfit(self, p: list[int]) -> int:
           return sum((max(0, b - a) for a, b in zip(p, p[1:])))
Java
~~~~

.. code-block:: java

   class Solution {
       public int maxProfit(int[]p) {
           int a=0;
           for(int i=1;i<p.length;i++)a+=Math.max(0,p[i]-p[i-1]);
           return a;
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn max_profit(p:Vec<i32>)->i32 {
           p.windows(2).map(|w|(w[1]-w[0]).max(0)).sum()
       }
   }
Go
~~

.. code-block:: go

   func maxProfit(p []int) int {
   	a := 0
   	for i := 1; i < len(p); i++ {
   		if p[i] > p[i-1] {
   			a += p[i] - p[i-1]
   		}
   	}
   	return a
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxProfit(p: number[]): number {
       let a = 0;
       for (let i = 1; i < p.length; i++)
           a += Math.max(0, p[i] - p[i - 1]);
       return a;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int MaxProfit(int[]p) {
           int a=0;
           for(int i=1;i<p.Length;i++)a+=Math.Max(0,p[i]-p[i-1]);
           return a;
       }
   }
Julia
~~~~~

.. code-block:: julia

   max_profit(p::Vector{Int})=sum(max(0,p[i]-p[i-1]) for i in 2:length(p)
   init=0)
R
~

.. code-block:: r

   max_profit <- function(p) {
       if(length(p)<2L)return(0L)
       sum(pmax.int(0L,diff(p)))
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空数组或单日返回 0。
* 允许同日卖出再买入，等价于合并交易。

易错点
------

* 把一次交易算法直接复用。
* 累加绝对差或负差。

本题新增知识
------------

* 累加所有正差
* 题号 0122 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0121. Best Time to Buy and Sell Stock <0121-best-time-to-buy-and-sell-stock.rst>`_；
* `0123. Best Time to Buy and Sell Stock III <0123-best-time-to-buy-and-sell-stock-iii.rst>`_；

最小自检
--------

#. ``正增量贪心`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

任意上升区间从谷买峰卖的利润等于区间内所有正相邻差之和；把交易切分或合并不改变利润。所有下降差应跳过，因此累加正差达到最优。
