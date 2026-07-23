0134. Gas Station
=================

题目信息
--------

:题号: 0134
:难度: Medium
:主题: 贪心、前缀和、环形数组
:原题: `LeetCode 0134 <https://leetcode.com/problems/gas-station/>`_
:重点: 总净量、失败区间排除、候选起点重置

题目重述
--------

环形道路上有 ``n`` 个加油站，站点 ``i`` 提供 ``gas[i]`` 单位汽油，从站点 ``i`` 驶向下一站需要消耗 ``cost[i]``。汽车油箱初始为空，返回能够顺时针行驶一整圈的零基起点下标；若不存在则返回 ``-1``。题目保证可行起点至多一个。

自建示例
--------

.. code-block:: text

   gas  = [1,2,3,4,5]
   cost = [3,4,5,1,2]
   净变化 = [-2,-2,-2,3,3] -> 起点 3

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int simulateEveryStart(const std::vector<int>& gas,
                              const std::vector<int>& cost) {
           int n = gas.size();
           for (int start = 0; start < n; ++start) {
               int tank = 0, count = 0;
               while (count < n) {
                   int i = (start + count) % n;
                   tank += gas[i] - cost[i];
                   if (tank < 0) break;
                   ++count;
               }
               if (count == n) return start;
           }
           return -1;
       }

       int minimumPrefix(const std::vector<int>& gas,
                         const std::vector<int>& cost) {
           int total = 0, prefix = 0, minimum = 0, answer = 0;
           for (int i = 0; i < static_cast<int>(gas.size()); ++i) {
               prefix += gas[i] - cost[i];
               total += gas[i] - cost[i];
               if (prefix < minimum) { minimum = prefix; answer = i + 1; }
           }
           return total < 0 ? -1 : answer % gas.size();
       }

       int greedyReset(const std::vector<int>& gas,
                       const std::vector<int>& cost) {
           int total = 0, tank = 0, start = 0;
           for (int i = 0; i < static_cast<int>(gas.size()); ++i) {
               int delta = gas[i] - cost[i];
               total += delta; tank += delta;
               if (tank < 0) { start = i + 1; tank = 0; }
           }
           return total < 0 ? -1 : start;
       }

   public:
       int canCompleteCircuit(std::vector<int>& gas, std::vector<int>& cost) {
           return greedyReset(gas, cost);
       }
   };

题解
----

全局条件
~~~~~~~~

完整一圈的最终油量变化固定为 ``sum(gas[i]-cost[i])``。总净量为负时任何起点都不可能成功；总净量非负是存在解的必要条件，并与贪心候选结合成为充分条件。

失败为何排除整段起点
~~~~~~~~~~~~~~~~~~~~

假设从 ``start`` 出发，到站点 ``i`` 后油量首次为负。对任意 ``k`` 位于 ``start+1..i``，从 ``start`` 到 ``k`` 前的累计油量在首次失败前都非负；去掉这段非负前缀，只会让 ``k`` 到 ``i`` 的累计结果不更大，因此这些起点也会失败。下一个候选可直接设为 ``i+1``。

.. list-table::
   :header-rows: 1

   * - 站点
     - 净变化
     - 当前油量
     - 候选
   * - 0
     - -2
     - -2
     - 重置为 1
   * - 1
     - -2
     - -2
     - 重置为 2
   * - 2
     - -2
     - -2
     - 重置为 3
   * - 3,4
     - 3,3
     - 6
     - 保持 3

为什么最后候选可完成环
~~~~~~~~~~~~~~~~~~~~~~

扫描结束时，候选到数组末尾的任何前缀都不负。若总净量非负，则数组开头被排除部分的总和足以由末尾剩余油量覆盖；连接成环后不会中途变负。

最小前缀视角
~~~~~~~~~~~~

从前缀和最低点之后出发，后续前缀相对该最低值都非负；绕回开头时由总净量非负保证。它与失败重置法选择同一类候选。

复杂度来源
~~~~~~~~~~

逐起点模拟最坏 ``O(n²)``；贪心只扫描一次，时间 ``O(n)``、额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   int canCompleteCircuit(int*gas,int n,int*cost,int m){int total=0,tank=0,start=0;for(int i=0;i<n;i++){int d=gas[i]-cost[i];total+=d;tank+=d;if(tank<0){start=i+1;tank=0;}}return total<0?-1:start;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:
           total=tank=start=0
           for i,(g,c) in enumerate(zip(gas,cost)):
               total+=g-c; tank+=g-c
               if tank<0: start=i+1; tank=0
           return -1 if total<0 else start

Java
~~~~

.. code-block:: java

   class Solution {public int canCompleteCircuit(int[]g,int[]c){int total=0,tank=0,start=0;for(int i=0;i<g.length;i++){int d=g[i]-c[i];total+=d;tank+=d;if(tank<0){start=i+1;tank=0;}}return total<0?-1:start;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn can_complete_circuit(g:Vec<i32>,c:Vec<i32>)->i32{let(mut total,mut tank,mut start)=(0,0,0);for i in 0..g.len(){let d=g[i]-c[i];total+=d;tank+=d;if tank<0{start=i+1;tank=0;}}if total<0{-1}else{start as i32}}}

Go
~~

.. code-block:: go

   func canCompleteCircuit(g,c []int)int{total,tank,start:=0,0,0;for i:=range g{d:=g[i]-c[i];total+=d;tank+=d;if tank<0{start=i+1;tank=0}};if total<0{return -1};return start}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function canCompleteCircuit(g:number[],c:number[]):number{let total=0,tank=0,start=0;for(let i=0;i<g.length;i++){const d=g[i]-c[i];total+=d;tank+=d;if(tank<0){start=i+1;tank=0;}}return total<0?-1:start;}

C#
~~

.. code-block:: csharp

   public class Solution {public int CanCompleteCircuit(int[]g,int[]c){int total=0,tank=0,start=0;for(int i=0;i<g.Length;i++){int d=g[i]-c[i];total+=d;tank+=d;if(tank<0){start=i+1;tank=0;}}return total<0?-1:start;}}

Julia
~~~~~

.. code-block:: julia

   function can_complete_circuit(g,c)
       total=0;tank=0;start=1
       for i in eachindex(g);d=g[i]-c[i];total+=d;tank+=d;if tank<0;start=i+1;tank=0;end;end
       total<0 ? -1 : start-1
   end

R
~

.. code-block:: r

   can_complete_circuit <- function(g,c){total<-0L;tank<-0L;start<-0L;for(i in seq_along(g)){d<-g[[i]]-c[[i]];total<-total+d;tank<-tank+d;if(tank<0L){start<-i;tank<-0L}};if(total<0L)-1L else start}