0134. Gas Station
=================

题目信息
--------

:题号: 0134
:难度: Medium
:主题: 贪心、前缀和、环形数组、失败区间排除
:原题: `LeetCode 0134 <https://leetcode.com/problems/gas-station/>`_
:访问状态: Available
:教学重点: 全局可行性、最小前缀候选、一次失败排除整段起点

题目重述与精确契约
------------------

环形道路上有 ``n`` 个加油站。到达站点 ``i`` 时可以获得 ``gas[i]`` 单位汽油，
从站点 ``i`` 驶向下一站需要 ``cost[i]`` 单位汽油。车辆油箱容量不设上限，出发时油箱为空。
返回一个能够顺时针行驶完整一圈的零基起点；若不存在则返回 ``-1``。

本文采用官方输入域：

* ``1 <= n <= 100000``，并且 ``len(gas) == len(cost) == n``；
* ``0 <= gas[i], cost[i] <= 10000``；
* 到站后先获得该站汽油，再支付前往下一站的费用；
* 行驶过程中油量不能为负，恰好为零仍可继续；
* 若存在可行起点，官方保证答案唯一；
* 输入数组只读，算法不排序、不旋转也不改写元素；
* 返回 LeetCode 要求的零基下标。

若放宽“答案唯一”，同一算法仍返回一个可行起点；本文只在官方契约下讨论唯一返回值。

自建示例
--------

存在唯一解
~~~~~~~~~~

.. code-block:: text

   gas  = [1, 2, 3, 4, 5]
   cost = [3, 4, 5, 1, 2]
   净变化 = [-2, -2, -2, 3, 3]

   从站点 3 出发：
   油量依次为 3, 6, 4, 3, 1，能够回到站点 3。
   输出 = 3

总量不足
~~~~~~~~

.. code-block:: text

   gas  = [2, 3, 4]
   cost = [3, 4, 3]
   净变化 = [-1, -1, 1]
   总净量 = -1
   输出 = -1

不论从哪里开始，一整圈的总供给都少于总消耗。

失败区间整体排除
~~~~~~~~~~~~~~~~

.. code-block:: text

   净变化 = [2, -1, -2, 4, -1]

候选 ``0`` 到站点 ``2`` 后累计为 ``-1``。站点 ``0, 1, 2`` 都无法跨过这次失败，
所以下一候选直接跳到站点 ``3``，而不是逐个重新模拟。

问题抽象
--------

先把每个站点压缩为净变化：

.. code-block:: text

   difference[i] = gas[i] - cost[i]

从起点出发能够完成一圈，当且仅当沿环形顺序的每个前缀净和都非负。
朴素方法从每个起点重新模拟，最坏要检查 ``n^2`` 个站点。

线性贪心同时维护：

* ``total``：从站点 ``0`` 到当前位置的全局净量，用来判断整圈总量是否足够；
* ``tank``：当前候选 ``start`` 到当前位置的净量，用来判断该候选是否已经失败；
* ``start``：尚未被失败区间排除的候选起点。

当 ``tank < 0`` 时，一次证明可以排除 ``start..i`` 的全部起点，候选直接移到
``i + 1``。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 工作空间
     - 定位
   * - 从每个起点完整模拟
     - 最坏 ``O(n^2)``
     - ``O(1)``
     - 重复扫描相同失败区间
   * - 前缀和最低点
     - ``O(n)``
     - 可做到 ``O(1)``
     - 与主解法等价的全局视角
   * - 失败区间排除贪心
     - ``O(n)``
     - ``O(1)``
     - 主解法；一次扫描直接给出候选

前缀最低点视角把起点放在全局最小前缀和之后；失败区间贪心在扫描过程中维护同一个事实，
更容易对应代码变量。

主解法：累计失败时跳过整段
----------------------------

扫描状态
~~~~~~~~

初始化 ``total = 0``、``tank = 0``、``start = 0``。依次处理站点 ``i``：

.. code-block:: text

   difference = gas[i] - cost[i]
   total += difference
   tank += difference

   if tank < 0:
       start = i + 1
       tank = 0

扫描结束后：

* ``total < 0``：总供给小于总消耗，返回 ``-1``；
* ``total >= 0``：返回最后保留的 ``start``。

循环不变量
~~~~~~~~~~

处理完站点 ``i`` 后保持：

* ``total = sum(difference[0..i])``；
* 若当前段尚未失败，``tank = sum(difference[start..i]) >= 0``；
* ``start`` 之前的所有下标都已经由某个失败区间证明不可行；
* 令 ``prefix[i] = sum(difference[0..i])``，则
  ``prefix[start - 1]``（``start = 0`` 时取虚拟前缀 ``0``）
  是扫描至今见过的最小前缀值；
* 输入数组保持不变。

为什么一次失败能排除整段
~~~~~~~~~~~~~~~~~~~~~~~~

设当前候选为 ``s``，它第一次在站点 ``i`` 后出现负油量：

.. code-block:: text

   sum(difference[s..i]) < 0

对任意 ``k in [s, i]``，候选在到达 ``i`` 前从未失败，所以
``sum(difference[s..k-1]) >= 0``。于是：

.. code-block:: text

   sum(difference[k..i])
     = sum(difference[s..i])
       - sum(difference[s..k-1])
     < 0

从 ``k`` 出发也无法跨过站点 ``i``，因此整段 ``s..i`` 都可安全排除。

正确性证明
----------

引理一：总净量为负时无解
~~~~~~~~~~~~~~~~~~~~~~~~

完成一圈会恰好获得全部 ``gas`` 并支付全部 ``cost``。若
``sum(gas[i] - cost[i]) < 0``，结束时总油量必为负，与途中油量从不为负矛盾。
所以任何起点都不可行。

引理二：每次候选重置都只排除不可行起点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

上一节已经证明，当候选 ``s`` 首次在 ``i`` 失败时，区间 ``s..i`` 中每个起点到
``i`` 的累计净量都为负。算法把下一候选设为 ``i + 1``，不会排除任何可能完成一圈的起点。

引理三：最终候选位于全局最小前缀之后
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每次失败都意味着当前前缀和严格小于上一次候选前的基准前缀，算法随即把这个更小值设为新基准。
两次重置之间，``tank`` 非负，说明期间前缀和不会低于当前基准。因此扫描完成时，
候选前的前缀值是所有已见前缀中的最小值。

引理四：总净量非负时最终候选可行
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

从最终 ``start`` 到数组末尾，循环不变量保证每个途中前缀油量非负。绕回站点 ``0`` 后，
到任意站点 ``j < start`` 的油量为：

.. code-block:: text

   total - prefix[start - 1] + prefix[j]

由引理三，``prefix[j] >= prefix[start - 1]``；又有 ``total >= 0``，
所以上式非负。最终候选在后半圈和绕回的前半圈都不会缺油，能够完成整圈。

定理：算法返回正确答案
~~~~~~~~~~~~~~~~~~~~~~

若 ``total < 0``，引理一证明返回 ``-1`` 正确。若 ``total >= 0``，
引理二保证算法没有误删可行起点，引理四证明最终候选本身可行；官方又保证可行答案唯一，
所以返回值就是题目要求的起点。

终止性与副作用
~~~~~~~~~~~~~~

下标从 ``0`` 单调增加到 ``n - 1``，每站只处理一次，算法必然终止。
全部状态是局部标量，输入数组只读。

复杂度与数值边界
----------------

* 每个站点只扫描一次，时间复杂度 ``Theta(n)``；
* 只维护 ``total``、``tank``、``start`` 和当前差值，额外空间 ``Theta(1)``；
* 返回单个整数，返回载荷 ``Theta(1)``；
* 单项差值位于 ``[-10000, 10000]``，全局绝对累计值不超过 ``10^9``；
* 官方上界在 32 位有符号整数内，但 C、C++、Java、Rust、C# 使用 64 位累计，
  为约束扩展和中间减法保留余量；
* Go 的平台 ``int`` 即使为 32 位也覆盖官方 ``10^9`` 上界；
* TypeScript ``number`` 在该范围内保持精确整数；
* Julia 宿主 ``Int`` 和 R 双精度数都能精确表示官方累计范围；
* 所有实现不复制、不旋转、不排序输入数组。

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
       if (gasSize <= 0 || costSize != gasSize) {
           return -1;
       }

       long long total = 0;
       long long tank = 0;
       int start = 0;

       for (int index = 0; index < gasSize; ++index) {
           long long difference =
               (long long)gas[index] - cost[index];
           total += difference;
           tank += difference;
           if (tank < 0) {
               start = index + 1;
               tank = 0;
           }
       }
       return total >= 0 ? start : -1;
   }

长度不匹配分支是官方输入域之外的防御性检查；合法输入不触发。

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

           for (
               int index = 0;
               index < static_cast<int>(gas.size());
               ++index
           ) {
               const long long difference =
                   static_cast<long long>(gas[index]) - cost[index];
               total += difference;
               tank += difference;
               if (tank < 0) {
                   start = index + 1;
                   tank = 0;
               }
           }
           return total >= 0 ? start : -1;
       }
   };

Python
~~~~~~

.. code-block:: python

   from typing import List


   class Solution:
       def canCompleteCircuit(
           self,
           gas: List[int],
           cost: List[int],
       ) -> int:
           total = 0
           tank = 0
           start = 0

           for index in range(len(gas)):
               difference = gas[index] - cost[index]
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
           long total = 0L;
           long tank = 0L;
           int start = 0;

           for (int index = 0; index < gas.length; ++index) {
               long difference =
                   (long) gas[index] - cost[index];
               total += difference;
               tank += difference;
               if (tank < 0L) {
                   start = index + 1;
                   tank = 0L;
               }
           }
           return total >= 0L ? start : -1;
       }
   }

Rust
~~~~

Rust 按值取得两个向量的所有权，但只借用元素，不修改或复制载荷。

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
                   i64::from(gas[index]) -
                   i64::from(cost[index]);
               total += difference;
               tank += difference;
               if tank < 0 {
                   start = index + 1;
                   tank = 0;
               }
           }

           if total >= 0 {
               start as i32
           } else {
               -1
           }
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
           long total = 0L;
           long tank = 0L;
           int start = 0;

           for (int index = 0; index < gas.Length; ++index) {
               long difference =
                   (long)gas[index] - cost[index];
               total += difference;
               tank += difference;
               if (tank < 0L) {
                   start = index + 1;
                   tank = 0L;
               }
           }

           return total >= 0L ? start : -1;
       }
   }

Julia
~~~~~

Julia 数组一基，``start`` 保存一基候选；返回时减一转换为平台零基下标。

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

R 同样内部使用一基位置，最终返回零基下标。``seq_along`` 对合法非空输入覆盖全部站点。

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

关键边界与易错点
----------------

* 单站且 ``gas[0] >= cost[0]`` 时返回 ``0``，不足时返回 ``-1``；
* ``tank == 0`` 仍然可行，只有严格小于零才重置；
* 失败后必须同时把候选移到下一站并把局部累计清零；
* ``total`` 判断全局是否存在解，``tank`` 只判断当前候选是否已经失败，二者不能合并；
* 一次失败能排除整段的前提，是候选在更早位置从未出现负局部前缀；
* 只检查 ``total >= 0`` 而不维护候选，无法给出正确起点；
* 把数组排序或只挑最大 ``gas[i]`` 会破坏环形行驶顺序；
* Julia 与 R 内部一基，返回值必须减一；
* 若最后一次重置把候选移到 ``n``，则所有已扫描段净量都为负，``total`` 必为负，
  最终返回 ``-1``，不会把越界下标作为可行答案。

精简验证记录
------------

原实现已经历生成阶段验证，本次不重复随机对拍或 sanitizer。由于正文证明和少量接口代码发生修改，
本轮只执行最小针对性检查：

* Python 运行两个官方示例，以及单站可行、单站不可行、全零、候选多次重置四类边界；
* C++17 主实现使用严格警告编译并运行代表案例；
* 其余语言逐项检查累计宽度、输入长度前提、零基返回和候选重置，与正文状态一致；
* 检查十语言代码块、RST 层级、相对链接、单文件和无题目分片。

验证的目的只是确认本轮修改没有破坏接口；贪心最优性由失败区间排除和最小前缀证明承担。

知识更新
--------

``algorithm.gas_station_failed_prefix_elimination``
   候选到某站的累计净量首次为负时，该候选到失败站之间的每个起点都无法跨过失败站，
   下一候选可直接跳到失败站之后。

``proof.gas_station_total_surplus_feasibility``
   总净量为负给出无解证书；总量非负时，全局最小前缀之后的候选能安全走完后缀并绕回前缀。

``workflow.targeted_example_validation``
   已验证代码的内容返工只做与修改相称的固定案例和静态核对，不以大量随机测试作为完成条件。

关联题目
--------

* `0122. Best Time to Buy and Sell Stock II
  <0122-best-time-to-buy-and-sell-stock-ii.rst>`_：
  同样把原数组压缩为相邻净变化，并用全局证明支撑线性贪心；
* `0053. Maximum Subarray <../0001-0100/0053-maximum-subarray.rst>`_：
  都会在局部累计不再有利时重置，但本题还必须证明环形前缀可行；
* 前缀和最低点是本题贪心候选的等价全局解释。

最小自检
--------

#. 当前候选在站点 ``i`` 失败时，为什么 ``start..i`` 都不能成为起点？
#. ``total`` 和 ``tank`` 分别回答什么问题？
#. 总净量非负为什么还需要“最终候选位于最小前缀之后”的证明？
#. 为什么局部油量恰好为零时不能重置？

答案要点
~~~~~~~~

#. 候选此前每个局部前缀非负；从失败负和中删除任一非负前缀，剩余到 ``i`` 的和仍为负。
#. ``total`` 判断整圈总供给是否足够；``tank`` 判断当前候选能否继续到下一站。
#. 总量非负只证明至少有机会；最小前缀性质保证候选走后缀和绕回前缀时每一步都不缺油。
#. 油量为零仍能到站并领取下一站汽油，不构成不可行见证。
