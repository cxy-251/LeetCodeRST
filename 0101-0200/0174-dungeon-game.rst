0174. Dungeon Game
==================

题目信息
--------

:题号: 0174. 地下城游戏
:难度: Hard
:主题: 动态规划、逆向状态、网格、空间压缩
:原题: `LeetCode 0174 <https://leetcode.com/problems/dungeon-game/>`_
:重点: 从路径前缀生命约束逆推每格最低入场生命，再把二维后继需求压缩到一行

题目重述
--------

给定 ``m x n`` 整数网格 ``dungeon``。骑士从左上角进入，只能向右或向下移动，最终到达
右下角。进入格子后，生命立即加上该格的数值；生命在任何时刻都必须至少为 1，降到 0
或以下就会失败。

返回保证骑士能够到达终点所需的最小初始生命值。

自建示例
--------

.. code-block:: text

   输入：
   dungeon = [
     [-2, -3,  3],
     [-5,-10,  1],
     [10, 30, -5]
   ]

   输出：7

   选择 -2 -> -3 -> 3 -> 1 -> -5，生命从 7 开始依次变为
   5 -> 2 -> 5 -> 6 -> 1，全程存活。

.. code-block:: text

   输入：dungeon = [[5]]
   输出：1

   即使格子增加生命，进入前也至少要有 1 点生命。

.. code-block:: text

   输入：dungeon = [[-8]]
   输出：9

   进入后恰好剩 1 点生命。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <limits>
   #include <vector>

   class Solution {
   private:
       int twoDimensional(
           const std::vector<std::vector<int>>& dungeon) {
           int rows = static_cast<int>(dungeon.size());
           int columns = static_cast<int>(dungeon[0].size());
           long long unreachable =
               std::numeric_limits<long long>::max() / 4;

           std::vector<std::vector<long long>> need(
               rows + 1,
               std::vector<long long>(columns + 1, unreachable));
           need[rows][columns - 1] = 1;
           need[rows - 1][columns] = 1;

           for (int row = rows - 1; row >= 0; --row) {
               for (int column = columns - 1; column >= 0; --column) {
                   long long next_need = std::min(
                       need[row + 1][column], need[row][column + 1]);
                   need[row][column] = std::max(
                       1LL,
                       next_need - dungeon[row][column]);
               }
           }
           return static_cast<int>(need[0][0]);
       }

       int rollingRow(
           const std::vector<std::vector<int>>& dungeon) {
           int rows = static_cast<int>(dungeon.size());
           int columns = static_cast<int>(dungeon[0].size());
           long long unreachable =
               std::numeric_limits<long long>::max() / 4;
           std::vector<long long> need(columns + 1, unreachable);
           need[columns - 1] = 1;

           for (int row = rows - 1; row >= 0; --row) {
               for (int column = columns - 1; column >= 0; --column) {
                   long long next_need =
                       std::min(need[column], need[column + 1]);
                   need[column] = std::max(
                       1LL,
                       next_need - dungeon[row][column]);
               }
           }
           return static_cast<int>(need[0]);
       }

   public:
       int calculateMinimumHP(
           std::vector<std::vector<int>>& dungeon) {
           return rollingRow(dungeon);
       }
   };

题解
----

枚举路径为什么迅速失控
~~~~~~~~~~~~~~~~~~~~~~

从起点到终点的每条路径都可以独立检查：累加沿途格子值，记录最小前缀和；若最小前缀为
``lowest``，这条路径所需初始生命就是 ``max(1, 1 - lowest)``。枚举全部路径后取最小值，
定义上完全正确。

瓶颈是同一个格子之后的剩余路径会被许多不同前缀反复枚举，路径数随行列组合呈指数级
增长。只最大化终点总和也不够：一条最终收益很高的路径可能先遭受致命伤害，生命约束作用
于每个前缀，而不只作用于终点。

从起点正向描述还会携带“当前生命、沿途最低生命、到达方式”等历史。题目真正提供的结构
是每个格子只有右、下两个后继；从终点反向看，未来要求可以被压缩成一个标量。

逆向状态删除路径历史
~~~~~~~~~~~~~~~~~~~~

定义 ``need[row][column]``：在进入格子 ``(row,column)`` **之前**，从该格走到终点并
始终存活所需的最小生命值。

设当前格效果为 ``effect``。若选择的后继要求入场生命 ``next_need``，当前入场生命
``health`` 必须同时满足：

.. code-block:: text

   health >= 1
   health + effect >= next_need

所以针对这个后继，最低入场生命是：

.. code-block:: text

   max(1, next_need - effect)

骑士可以在向右、向下中选择需求较小的后继。上述公式关于 ``next_need`` 单调不减，
因此转移为：

.. code-block:: text

   next_need = min(need[row + 1][column], need[row][column + 1])
   need[row][column] = max(1, next_need - dungeon[row][column])

这个状态不再区分有多少条前缀到达当前格，也不枚举后续路径；每个子网格只保留完成它所需
的最低入场资源。

为何必须从终点向起点扫描
~~~~~~~~~~~~~~~~~~~~~~~~~~

当前状态依赖右侧与下方两个后继，所以计算顺序必须保证它们已经确定：行从下到上、列从
右到左。右下角没有真实后继，可以把“完成任务后仍活着”视为需求 1 的虚拟后继，于是
同一公式得到：

.. code-block:: text

   need[last] = max(1, 1 - dungeon[last])

这同时解释单格正数答案为何仍为 1，以及单格 ``-8`` 为何需要 9。

二维状态与边界哨兵
~~~~~~~~~~~~~~~~~~

``twoDimensional`` 在真实网格下方和右侧增加一圈不可达大值，只把右下角下方、右下角
右方两个虚拟位置设为 1。右下角因而能选择需求 1；底行其他格的下方仍不可达，只能选择
已计算的右侧；最右列其他格同理只能选择真实下方。

不能把整条虚拟边界都设为 1，否则算法会错误允许骑士从任意底行格向下离开，或从任意
最右列格向右离开。不可达哨兵的意义是保持“只能走向网格内合法后继”。

二维表的具体走读
~~~~~~~~~~~~~~~~

标准示例从右下向左上计算出的最低入场生命为：

.. code-block:: text

   need = [
     [7,  5, 2],
     [6, 11, 5],
     [1,  1, 6]
   ]

右下角值为 -5，完成后至少剩 1，因此入场需要 6。它左侧的 30 能把生命补到足够水平，
所以入场只需 1。中间的 -10 可以选择需求为 1 的下方格，故需要
``max(1, 1 - (-10)) = 11``。

起点的两个后继需求分别是 5、6，选择较小的右侧；经过起点 -2 前需要
``max(1, 5 - (-2)) = 7``。沿所选路径，进入每个下一格时都恰好满足表中的需求。

一维数组如何保留依赖
~~~~~~~~~~~~~~~~~~~~

计算当前行时只需要“下一行”和“当前行右侧”，完整二维历史不再有用。``rollingRow``
把状态压缩到长度 ``columns + 1`` 的数组：

* 更新 ``need[column]`` 前，它保存下方格的需求；
* 因为列从右向左扫描，``need[column + 1]`` 已更新为当前行右侧格的需求；
* 写回后，``need[column]`` 成为当前格需求，供左侧格和上一行继续使用。

数组初始全是不可达大值，仅 ``need[columns - 1] = 1``，表示右下角下方的唯一虚拟后继；
最右端 ``need[columns]`` 始终保持不可达。每个真实格在逆序中至少有一个有限后继，所以
取最小值后不会拿不可达哨兵参与减法。

正确性与方案选择
~~~~~~~~~~~~~~~~

对逆向顺序归纳：右下角的虚拟需求正确；若右、下状态都表示各自最小入场生命，转移选择
需求更小的合法后继，并计算足以承受当前格效果且至少为 1 的最小生命，因此当前状态既不
低估也不高估。归纳到左上角，``need[0][0]`` 正是最小初始生命。

二维方案直接对应状态定义，时间 ``O(mn)``、空间 ``O(mn)``；一维方案不改变转移，只
删除不会再被读取的旧行，时间仍为 ``O(mn)``，额外空间降为 ``O(n)``，因此主解采用
``rollingRow``。状态和减法使用 ``long long``，避免哨兵或累积伤害在中间计算中溢出；
题目保证最终答案适合接口的 ``int`` 返回类型。
