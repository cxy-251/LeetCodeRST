0134. Gas Station
=================

题目信息
--------

:题号: 0134. 加油站
:难度: Medium
:主题: 贪心、前缀和、环形数组、候选区间删除
:原题: `LeetCode 0134 <https://leetcode.com/problems/gas-station/>`_
:重点: 将每站净油量分离出来，用总和判断全局可行性，并在一次失败时淘汰整段起点

题目重述
--------

环形道路上有 ``n`` 个加油站。到达站点 ``i`` 可加入 ``gas[i]`` 单位汽油，从该站驶向下一站需要
``cost[i]`` 单位。汽车从某个站以空油箱出发，在每站先加油再行驶；返回能顺时针完成一整圈的零基起点，
不存在则返回 ``-1``。题目保证若解存在则唯一。

自建示例
--------

* ``gas = [2, 4, 1, 5]``、``cost = [3, 2, 4, 1]``：每站净变化为 ``[-1, 2, -3, 4]``，
  从站点 ``3`` 出发时油量依次为 ``4, 3, 5, 2``，返回 ``3``；
* ``gas = [1, 2]``、``cost = [2, 3]``：总汽油为 ``3``，总消耗为 ``5``，返回 ``-1``；
* ``gas = [3]``、``cost = [3]``：从唯一站点出发恰好回到原处，返回 ``0``。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int simulateEveryStart(
           const std::vector<int>& gas,
           const std::vector<int>& cost
       ) {
           const int stationCount = static_cast<int>(gas.size());
           for (int start = 0; start < stationCount; ++start) {
               long long tank = 0;
               int traveled = 0;
               while (traveled < stationCount) {
                   const int station = (start + traveled) % stationCount;
                   tank += static_cast<long long>(gas[station]) - cost[station];
                   if (tank < 0) {
                       break;
                   }
                   ++traveled;
               }
               if (traveled == stationCount) {
                   return start;
               }
           }
           return -1;
       }

       int eliminateFailedIntervals(
           const std::vector<int>& gas,
           const std::vector<int>& cost
       ) {
           long long totalBalance = 0;
           long long candidateBalance = 0;
           int candidateStart = 0;

           for (int station = 0;
                station < static_cast<int>(gas.size());
                ++station) {
               const long long balance =
                   static_cast<long long>(gas[station]) - cost[station];
               totalBalance += balance;
               candidateBalance += balance;

               if (candidateBalance < 0) {
                   candidateStart = station + 1;
                   candidateBalance = 0;
               }
           }
           return totalBalance < 0 ? -1 : candidateStart;
       }

   public:
       int canCompleteCircuit(
           std::vector<int>& gas,
           std::vector<int>& cost
       ) {
           return eliminateFailedIntervals(gas, cost);
       }
   };

题解
----

先把加油与消耗合成一种状态变化
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

在站点 ``i`` 完成加油并驶向下一站后，油箱净变化固定为
``balance[i] = gas[i] - cost[i]``。从某个起点能否前进，只取决于沿途净变化的前缀和是否始终非负；绕一圈
后的最终变化则与起点无关，恒为 ``sum(balance)``。

于是先得到一个必要条件：若总净变化为负，一圈消耗多于一圈补给，换任何起点都无法完成。总和非负还不能
直接告诉我们从哪里出发，但它把“是否可能”与“候选位置”分成了两个可独立维护的量。

原始方案：逐个起点完整模拟
~~~~~~~~~~~~~~~~~~~~~~~~~~

``simulateEveryStart`` 对每个站点把油箱清零，按环形下标继续，首次负油时停止。它直接验证了题意，也能找到
答案；问题是相邻起点会重复走相同区间。若许多起点都在接近一圈时才失败，最坏要检查 ``O(n^2)`` 个站点。

失败不只淘汰当前起点
~~~~~~~~~~~~~~~~~~~~

假设当前候选为 ``start``，从它出发到站点 ``i`` 后，``candidateBalance`` 第一次变为负。在此之前，从
``start`` 到任意 ``k-1`` 的累计值都非负。对区间内另一个起点 ``k``，走到 ``i`` 后的净量是：

.. code-block:: text

   sum(k..i) = sum(start..i) - sum(start..k-1)

右侧第一项为负，第二项非负，所以结果一定为负。也就是说 ``start, start+1, ..., i`` 都无法越过站点
``i``，无需逐个重试；下一个仍可能成功的候选只能从 ``i+1`` 开始。代码重置候选油量，因为新起点以空
油箱出发，不继承失败路线的负债。

具体走读区间删除
~~~~~~~~~~~~~~~~

对净变化 ``[-1, 2, -3, 4]``：

.. list-table::
   :header-rows: 1

   * - 扫描站点
     - 候选与累计油量
     - 删除动作
   * - ``0``，净量 ``-1``
     - 从 ``0`` 得到 ``-1``
     - 淘汰起点 ``0``，候选改为 ``1``
   * - ``1``，净量 ``2``
     - 从 ``1`` 得到 ``2``
     - 保留候选
   * - ``2``，净量 ``-3``
     - 从 ``1`` 得到 ``-1``
     - 同时淘汰 ``1``、``2``，候选改为 ``3``
   * - ``3``，净量 ``4``
     - 从 ``3`` 得到 ``4``
     - 扫描结束

一次负前缀淘汰整段，正是线性算法删除逐起点重复模拟的来源。

为何最终候选能绕回数组开头
~~~~~~~~~~~~~~~~~~~~~~~~~~

用全局前缀和 ``P`` 看，候选每次重置都发生在累计值创下新的严格低点之后，所以最终
``candidateStart`` 位于全局最低前缀之后。从这个位置向数组末尾走，任意前缀相对最低点都非负。

绕回数组开头并走到位置 ``j`` 时，油量等于总净变化再加 ``P[j]`` 相对最低前缀的增量；前者由
``totalBalance >= 0`` 保证非负，后者也非负。因此环形后半段的每个中间状态都不会欠油。区间淘汰得到的
候选配合总和条件，既是必要条件也是充分条件。

这里也解释了两个累加器的职责：``candidateBalance`` 只验证当前线性后缀，失败可清零；``totalBalance``
必须保留所有站点的净量，最终负责判定环形拼接是否可能，绝不能随候选一起清零。

代码边界与主解选择
~~~~~~~~~~~~~~~~~~

若总和为负，扫描中留下的 ``candidateStart`` 只是一个局部后缀候选，公开函数必须返回 ``-1``。若总和
非负，最后一次失败不可能把候选留在数组外而没有后续补偿，否则所有已删除段之和为负、末尾又为空，总和
也会为负。单站且收支相等时累计值从不为负，候选保持 ``0``。

公开入口采用区间淘汰贪心：只扫描一次，时间 ``O(n)``、额外空间 ``O(1)``。逐起点模拟保留为正确性起点，
时间最坏 ``O(n^2)``。代码以 ``long long`` 累加净量，避免数组规模或单站数值扩大时总和溢出。
