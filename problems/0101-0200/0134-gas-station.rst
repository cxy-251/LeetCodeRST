0134. Gas Station
=================

题目信息
--------

:题号: 0134
:难度: Medium
:主题: 数组、贪心、前缀和
:原题: `LeetCode 0134 <https://leetcode.com/problems/gas-station/>`_
:访问状态: Available
:教学重点: 总量可行性与失败前缀跳过

题目重述
--------

有一圈加油站，站 ``i`` 提供 ``gas[i]``，到下一站消耗 ``cost[i]``。返回能绕一圈的起点，不存在返回 -1；若有解题目保证唯一。

自建示例
--------

.. code-block:: text

   输入：gas = [1,2,3,4,5], cost = [3,4,5,1,2]
   输出：3

问题抽象
--------

维护总净油量和从候选起点开始的当前油量。若当前油量变负，则当前候选到失败点之间任何位置都不能作为起点，下一位置成为新候选。

主解法：单次扫描贪心
------------

思路
~~~~

单次扫描贪心。 总量可行性与失败前缀跳过

核心状态与不变量
~~~~~~~~~~~~~~~~

维护总净油量和从候选起点开始的当前油量。若当前油量变负，则当前候选到失败点之间任何位置都不能作为起点，下一位置成为新候选。

正确性依据
~~~~~~~~~~

若总净油量负，全局不可能。失败时，从候选到失败点的任意中间起点少获得一段非负前缀，抵达失败点时油量不会更高，因此可整体排除。总量非负时最终候选可完成一圈。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；空间 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   int canCompleteCircuit(int*g,int n,int*c,int cn) {
       (void)cn;
       long total=0,tank=0;
       int start=0;
       for(int i=0;i<n;i++) {
           long d=(long)g[i]-c[i];
           total+=d;
           tank+=d;
           if(tank<0) {
               start=i+1;
               tank=0;
           }
       }
       return total<0?-1:start;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:int canCompleteCircuit(vector<int>&g,vector<int>&c) {
           long long total=0,tank=0;
           int start=0;
           for(size_t i=0;i<g.size();i++) {
               long long d=(long long)g[i]-c[i];
               total+=d;
               tank+=d;
               if(tank<0) {
                   start=i+1;
                   tank=0;
               }
           }
           return total<0?-1:start;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:
           total = tank = 0
           start = 0
           for i, (g, c) in enumerate(zip(gas, cost)):
               d = g - c
               total += d
               tank += d
               if tank < 0:
                   start = i + 1
                   tank = 0
           return -1 if total < 0 else start
Java
~~~~

.. code-block:: java

   class Solution {
       public int canCompleteCircuit(int[]g,int[]c) {
           long total=0,tank=0;
           int start=0;
           for(int i=0;i<g.length;i++) {
               long d=(long)g[i]-c[i];
               total+=d;
               tank+=d;
               if(tank<0) {
                   start=i+1;
                   tank=0;
               }
           }
           return total<0?-1:start;
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn can_complete_circuit(g:Vec<i32>,c:Vec<i32>)->i32 {
           let(mut total,mut tank,mut start)=(0i64,0i64,0usize);
           for i in 0..g.len() {
               let d=g[i]as i64-c[i]as i64;
               total+=d;
               tank+=d;
               if tank<0 {
                   start=i+1;
                   tank=0;
               }
           }
           if total<0 {
               -1
           } else {
               start as i32
           }
       }
   }
Go
~~

.. code-block:: go

   func canCompleteCircuit(g, c []int) int {
   	total, tank, start := 0, 0, 0
   	for i := range g {
   		d := g[i] - c[i]
   		total += d
   		tank += d
   		if tank < 0 {
   			start = i + 1
   			tank = 0
   		}
   	}
   	if total < 0 {
   		return -1
   	}
   	return start
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function canCompleteCircuit(g: number[], c: number[]): number {
       let total = 0, tank = 0, start = 0;
       for (let i = 0; i < g.length; i++) {
           const d = g[i] - c[i];
           total += d;
           tank += d;
           if (tank < 0) {
               start = i + 1;
               tank = 0;
           }
       }
       return total < 0 ? -1 : start;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int CanCompleteCircuit(int[]g,int[]c) {
           long total=0,tank=0;
           int start=0;
           for(int i=0;i<g.Length;i++) {
               long d=(long)g[i]-c[i];
               total+=d;
               tank+=d;
               if(tank<0) {
                   start=i+1;
                   tank=0;
               }
           }
           return total<0?-1:start;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function can_complete_circuit(g::Vector{Int},c::Vector{Int})::Int
       total=0
       tank=0
       start=1
       for i in eachindex(g)
           d=g[i]-c[i]
           total+=d
           tank+=d
           if tank<0
               start=i+1
               tank=0
           end
       end
       total<0 ? -1 : start-1
   end
R
~

.. code-block:: r

   can_complete_circuit <- function(g,c) {
       total<-tank<-0
       start<-1L
       for(i in seq_along(g)) {
           d<-g[[i]]-c[[i]]
           total<-total+d
           tank<-tank+d
           if(tank<0) {
               start<-i+1L
               tank<-0
           }
       }
       if(total<0)-1L else start-1L
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 数组长度相等且非空。
* 累计和使用足够宽整数。

易错点
------

* 只检查总和却不找起点。
* 失败后只重置油量而不更新起点。

本题新增知识
------------

* 总量可行性与失败前缀跳过
* 题号 0134 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0045. Jump Game II <../0001-0100/0045-jump-game-ii.rst>`_；
* `0055. Jump Game <../0001-0100/0055-jump-game.rst>`_；

最小自检
--------

#. ``单次扫描贪心`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

若总净油量负，全局不可能。失败时，从候选到失败点的任意中间起点少获得一段非负前缀，抵达失败点时油量不会更高，因此可整体排除。总量非负时最终候选可完成一圈。
