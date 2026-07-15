0134. Gas Station
=================

题目信息
--------

:题号: 0134
:难度: Medium
:主题: 贪心、前缀和、环形数组
:原题: `LeetCode 0134 <https://leetcode.com/problems/gas-station/>`_
:访问状态: Available
:教学重点: 全局可行性、失败区间排除、候选起点重置

题目重述
--------

环形道路上有若干加油站。``gas[i]`` 是第 ``i`` 站可获得的油量，``cost[i]`` 是从该站驶向下一站
需要的油量。油箱初始为空，返回能够顺时针完成一圈的起点下标；不存在时返回 ``-1``。
数组长度相同且非空，存在解时题目保证答案唯一。

算法
-----

扫描每个站点，令 ``difference = gas[i] - cost[i]``：

* ``total`` 累计全局净油量；
* ``tank`` 累计当前候选起点到当前位置的净油量；
* ``start`` 保存当前候选起点。

若 ``tank < 0``，当前候选无法到达下一站，并且从该候选到当前位置之间的任一点也无法跨过当前位置。
因此把 ``start`` 移到 ``i + 1``，并把 ``tank`` 清零。扫描结束后，``total < 0`` 表示全局油量不足；
否则最后保留的 ``start`` 就是答案。

正确性
~~~~~~

当候选起点 ``s`` 在位置 ``i`` 首次失败时，``s`` 到 ``i`` 的累计净油量为负。对任意
``k`` 属于 ``[s, i]``，从 ``s`` 到 ``k-1`` 的累计量在失败前非负；删除这段非负前缀后，
从 ``k`` 到 ``i`` 的累计量仍为负，所以这些位置都不能成为起点。

算法依次排除所有失败区间。若 ``total < 0``，完成一圈所需油量超过总供给，任何起点都不可能成功。
若 ``total >= 0``，最后一个未被排除的候选不会在剩余路段失败；绕回前面时，全局非负余量能够补足，
因此它可以完成整圈。

复杂度
~~~~~~

扫描一次，时间 ``O(n)``，只使用三个累计状态，额外空间 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   int canCompleteCircuit(
       int *gas,
       int gasSize,
       int *cost,
       int costSize
   ) {
       (void)costSize;
       long long total = 0;
       long long tank = 0;
       int start = 0;

       for (int i = 0; i < gasSize; ++i) {
           long long diff = (long long)gas[i] - cost[i];
           total += diff;
           tank += diff;
           if (tank < 0) {
               start = i + 1;
               tank = 0;
           }
       }
       return total >= 0 ? start : -1;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       int canCompleteCircuit(
           std::vector<int>& gas,
           std::vector<int>& cost
       ) {
           long long total = 0;
           long long tank = 0;
           int start = 0;

           for (int i = 0; i < static_cast<int>(gas.size()); ++i) {
               long long diff =
                   static_cast<long long>(gas[i]) - cost[i];
               total += diff;
               tank += diff;
               if (tank < 0) {
                   start = i + 1;
                   tank = 0;
               }
           }
           return total >= 0 ? start : -1;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def canCompleteCircuit(
           self,
           gas: list[int],
           cost: list[int],
       ) -> int:
           total = 0
           tank = 0
           start = 0

           for index, (gain, spend) in enumerate(zip(gas, cost)):
               difference = gain - spend
               total += difference
               tank += difference
               if tank < 0:
                   start = index + 1
                   tank = 0

           return start if total >= 0 else -1

Java
~~~~

.. code-block:: java

   class Solution {
       public int canCompleteCircuit(int[] gas, int[] cost) {
           long total = 0;
           long tank = 0;
           int start = 0;
           for (int i = 0; i < gas.length; ++i) {
               long difference = (long) gas[i] - cost[i];
               total += difference;
               tank += difference;
               if (tank < 0) {
                   start = i + 1;
                   tank = 0;
               }
           }
           return total >= 0 ? start : -1;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn can_complete_circuit(
           gas: Vec<i32>,
           cost: Vec<i32>,
       ) -> i32 {
           let mut total = 0_i64;
           let mut tank = 0_i64;
           let mut start = 0_usize;
           for index in 0..gas.len() {
               let difference =
                   i64::from(gas[index]) - i64::from(cost[index]);
               total += difference;
               tank += difference;
               if tank < 0 {
                   start = index + 1;
                   tank = 0;
               }
           }
           if total >= 0 { start as i32 } else { -1 }
       }
   }

Go
~~

.. code-block:: go

   func canCompleteCircuit(gas []int, cost []int) int {
       total := 0
       tank := 0
       start := 0
       for index := range gas {
           difference := gas[index] - cost[index]
           total += difference
           tank += difference
           if tank < 0 {
               start = index + 1
               tank = 0
           }
       }
       if total >= 0 {
           return start
       }
       return -1
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function canCompleteCircuit(
       gas: number[],
       cost: number[],
   ): number {
       let total = 0;
       let tank = 0;
       let start = 0;
       for (let index = 0; index < gas.length; index++) {
           const difference = gas[index] - cost[index];
           total += difference;
           tank += difference;
           if (tank < 0) {
               start = index + 1;
               tank = 0;
           }
       }
       return total >= 0 ? start : -1;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int CanCompleteCircuit(int[] gas, int[] cost) {
           long total = 0;
           long tank = 0;
           int start = 0;
           for (int index = 0; index < gas.Length; ++index) {
               long difference = (long)gas[index] - cost[index];
               total += difference;
               tank += difference;
               if (tank < 0) {
                   start = index + 1;
                   tank = 0;
               }
           }
           return total >= 0 ? start : -1;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function can_complete_circuit(
       gas::Vector{Int},
       cost::Vector{Int},
   )::Int
       total = 0
       tank = 0
       start = 1
       for index in eachindex(gas)
           difference = gas[index] - cost[index]
           total += difference
           tank += difference
           if tank < 0
               start = index + 1
               tank = 0
           end
       end
       return total >= 0 ? start - 1 : -1
   end

R
~

.. code-block:: r

   can_complete_circuit <- function(gas, cost) {
     total <- 0
     tank <- 0
     start <- 1L
     for (index in seq_along(gas)) {
       difference <- gas[[index]] - cost[[index]]
       total <- total + difference
       tank <- tank + difference
       if (tank < 0) {
         start <- index + 1L
         tank <- 0
       }
     }
     if (total >= 0) start - 1L else -1L
   }

关键边界
--------

* 单站且油量足够时返回 ``0``；
* 总净油量为负时返回 ``-1``；
* ``tank`` 变负后必须把下一站设为候选，不能只清零累计量；
* 返回值使用题目要求的零基下标。

验证
----

运行两个官方示例，并补充单站可行、单站不可行和全零数组三个边界；Python 与 C++ 结果一致。
未执行随机对拍。

最小自检
--------

#. 为什么一次失败可以同时排除一整段候选起点？
#. ``total`` 与 ``tank`` 分别回答什么问题？
#. 为什么最终只需检查 ``total`` 是否非负？
