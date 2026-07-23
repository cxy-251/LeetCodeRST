0134. Gas Station
=================

题目信息
--------

:题号: 0134
:难度: Medium
:主题: 贪心、前缀和、环形数组
:原题: `LeetCode 0134 <https://leetcode.com/problems/gas-station/>`_
:重点: 空油箱出发、顺时针完整一圈、唯一可行起点

题目重述
--------

环形道路上有 ``n`` 个加油站，``gas[i]`` 表示在站点 ``i`` 能获得的汽油量，``cost[i]`` 表示从站点 ``i`` 驶向下一个站点所需的汽油量。汽车从某个站点以空油箱出发，在每站先加油再驶向下一站。返回能够顺时针行驶完整一圈的零基起点下标；若不存在可行起点，返回 ``-1``。若存在解，题目保证该起点唯一。

两个数组长度相同，范围为 ``1..10^5``；每个 ``gas[i]`` 和 ``cost[i]`` 都在 ``0..10^4`` 范围内。

自建示例
--------

.. code-block:: text

   输入：gas = [2,4,1,5], cost = [3,2,4,1]
   输出：3
   解释：从站点 3 出发时，沿一圈的油量依次保持为 4、3、5、2，从未低于 0；其他起点都会在途中耗尽汽油。

.. code-block:: text

   输入：gas = [1,2], cost = [2,3]
   输出：-1
   解释：总汽油量为 3，小于总消耗 5，因此从任何站点都无法完成一圈。

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