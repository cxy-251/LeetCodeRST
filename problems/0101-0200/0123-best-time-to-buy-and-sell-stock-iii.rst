0123. Best Time to Buy and Sell Stock III
=========================================

题目信息
--------

:题号: 0123
:难度: Hard
:主题: 数组、动态规划、状态机
:原题: `LeetCode 0123 <https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/>`_
:访问状态: Available
:教学重点: 四状态滚动

题目重述
--------

最多完成两次交易，返回最大利润，同一时间最多持有一股。

自建示例
--------

.. code-block:: text

   输入：prices = [3,3,5,0,0,3,1,4]
   输出：6

问题抽象
--------

维护第一次买入 ``buy1``、第一次卖出 ``sell1``、第二次买入 ``buy2``、第二次卖出 ``sell2`` 的最大现金状态。

主解法：四状态 DP
------------

思路
~~~~

四状态 DP。 四状态滚动

核心状态与不变量
~~~~~~~~~~~~~~~~

维护第一次买入 ``buy1``、第一次卖出 ``sell1``、第二次买入 ``buy2``、第二次卖出 ``sell2`` 的最大现金状态。

正确性依据
~~~~~~~~~~

每天每个状态由“不操作”或执行对应动作转移；动作顺序保持交易次数和持仓合法。归纳后四状态覆盖全部至多两次交易历史，``sell2`` 为最优。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；空间 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <limits.h>
   int maxProfit(int*p,int n) {
       int b1=INT_MIN,s1=0,b2=INT_MIN,s2=0;
       for(int x=0;x<n;x++) {
           int v=p[x];
           if(-v>b1)b1=-v;
           if(b1+v>s1)s1=b1+v;
           if(s1-v>b2)b2=s1-v;
           if(b2+v>s2)s2=b2+v;
       }
       return s2;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:int maxProfit(vector<int>&p) {
           int b1=INT_MIN,s1=0,b2=INT_MIN,s2=0;
           for(int x:p) {
               b1=max(b1,-x);
               s1=max(s1,b1+x);
               b2=max(b2,s1-x);
               s2=max(s2,b2+x);
           }
           return s2;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def maxProfit(self, p: list[int]) -> int:
           b1 = b2 = -10 ** 30
           s1 = s2 = 0
           for x in p:
               b1 = max(b1, -x)
               s1 = max(s1, b1 + x)
               b2 = max(b2, s1 - x)
               s2 = max(s2, b2 + x)
           return s2
Java
~~~~

.. code-block:: java

   class Solution {
       public int maxProfit(int[]p) {
           int b1=Integer.MIN_VALUE,s1=0,b2=Integer.MIN_VALUE,s2=0;
           for(int x:p) {
               b1=Math.max(b1,-x);
               s1=Math.max(s1,b1+x);
               b2=Math.max(b2,s1-x);
               s2=Math.max(s2,b2+x);
           }
           return s2;
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn max_profit(p:Vec<i32>)->i32 {
           let(mut b1,mut s1,mut b2,mut s2)=(i32::MIN,0,i32::MIN,0);
           for x in p {
               b1=b1.max(-x);
               s1=s1.max(b1+x);
               b2=b2.max(s1-x);
               s2=s2.max(b2+x);
           }
           s2
       }
   }
Go
~~

.. code-block:: go

   func maxProfit(p []int) int {
   	min := -int(^uint(0)>>1) - 1
   	b1, s1, b2, s2 := min, 0, min, 0
   	for _, x := range p {
   		if -x > b1 {
   			b1 = -x
   		}
   		if b1+x > s1 {
   			s1 = b1 + x
   		}
   		if s1-x > b2 {
   			b2 = s1 - x
   		}
   		if b2+x > s2 {
   			s2 = b2 + x
   		}
   	}
   	return s2
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxProfit(p: number[]): number {
       let b1 = -Infinity, s1 = 0, b2 = -Infinity, s2 = 0;
       for (const x of p) {
           b1 = Math.max(b1, -x);
           s1 = Math.max(s1, b1 + x);
           b2 = Math.max(b2, s1 - x);
           s2 = Math.max(s2, b2 + x);
       }
       return s2;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int MaxProfit(int[]p) {
           int b1=int.MinValue,s1=0,b2=int.MinValue,s2=0;
           foreach(int x in p) {
               b1=Math.Max(b1,-x);
               s1=Math.Max(s1,b1+x);
               b2=Math.Max(b2,s1-x);
               s2=Math.Max(s2,b2+x);
           }
           return s2;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function max_profit(p::Vector{Int})::Int
       b1=typemin(Int)
       s1=0
       b2=typemin(Int)
       s2=0
       for x in p
           b1=max(b1,-x)
           s1=max(s1,b1+x)
           b2=max(b2,s1-x)
           s2=max(s2,b2+x)
       end
       s2
   end
R
~

.. code-block:: r

   max_profit <- function(p) {
       b1<-b2<--Inf
       s1<-s2<-0
       for(x in p) {
           b1<-max(b1,-x)
           s1<-max(s1,b1+x)
           b2<-max(b2,s1-x)
           s2<-max(s2,b2+x)
       }
       as.integer(s2)
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空价格返回 0。
* 第二次买入成本应扣除第一次利润。

易错点
------

* 状态初始化为 0 使买入状态非法。
* 更新时使用错误的新旧状态语义。

本题新增知识
------------

* 四状态滚动
* 题号 0123 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0121. Best Time to Buy and Sell Stock <0121-best-time-to-buy-and-sell-stock.rst>`_；
* `0122. Best Time to Buy and Sell Stock II <0122-best-time-to-buy-and-sell-stock-ii.rst>`_；

最小自检
--------

#. ``四状态 DP`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

每天每个状态由“不操作”或执行对应动作转移；动作顺序保持交易次数和持仓合法。归纳后四状态覆盖全部至多两次交易历史，``sell2`` 为最优。
