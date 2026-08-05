0062. Unique Paths
==================

题目信息
--------

:题号: 0062
:难度: Medium
:主题: 动态规划、滚动数组、组合计数
:原题: `LeetCode 0062 <https://leetcode.com/problems/unique-paths/>`_
:重点: 从枚举移动序列，推导到复用位置状态，再利用固定步数直接组合计数

题目重述
--------

机器人位于 ``m × n`` 网格的左上角 ``(0,0)``。每一步只能向右或向下移动一格，求到达右下角
``(m-1,n-1)`` 的不同路径数量。

两条路径只要移动序列不同，就视为不同路径。

约束为 ``1 <= m, n <= 100``，并保证答案不超过 ``2 * 10^9``。

自建示例
--------

.. code-block:: text

   输入：m = 3, n = 4
   输出：10

每条路径必须执行 2 次向下和 3 次向右，共 5 步。选择其中哪 2 个位置执行向下，共有
``C(5,2) = 10`` 种路径。

.. code-block:: text

   输入：m = 1, n = 6
   输出：1

只有一行时只能连续向右，路径唯一。

.. code-block:: text

   输入：m = 4, n = 5
   输出：35

每条路径包含 3 次向下和 4 次向右，因此共有 ``C(7,3) = 35`` 种移动序列。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int enumeratePaths(int row, int column, int rows, int columns) {
           if (row == rows - 1 && column == columns - 1) return 1;

           int paths = 0;
           if (row + 1 < rows) {
               paths += enumeratePaths(row + 1, column, rows, columns);
           }
           if (column + 1 < columns) {
               paths += enumeratePaths(row, column + 1, rows, columns);
           }
           return paths;
       }

       int tableDp(int rows, int columns) {
           std::vector<std::vector<int>> ways(
               rows,
               std::vector<int>(columns, 1)
           );

           for (int row = 1; row < rows; ++row) {
               for (int column = 1; column < columns; ++column) {
                   ways[row][column] = ways[row - 1][column] +
                                       ways[row][column - 1];
               }
           }
           return ways[rows - 1][columns - 1];
       }

       int rollingDp(int rows, int columns) {
           if (columns > rows) std::swap(rows, columns);
           std::vector<int> ways(columns, 1);

           for (int row = 1; row < rows; ++row) {
               for (int column = 1; column < columns; ++column) {
                   ways[column] += ways[column - 1];
               }
           }
           return ways[columns - 1];
       }

       int countByCombinations(int rows, int columns) {
           const int totalSteps = rows + columns - 2;
           const int chosenSteps = std::min(rows - 1, columns - 1);

           long long combinations = 1;
           for (int selected = 1; selected <= chosenSteps; ++selected) {
               combinations = combinations *
                              (totalSteps - chosenSteps + selected) /
                              selected;
           }
           return static_cast<int>(combinations);
       }

   public:
       int uniquePaths(int m, int n) {
           return countByCombinations(m, n);
       }
   };

题解
----

枚举移动序列
~~~~~~~~~~~~

从 ``(row,column)`` 出发时，递归尝试仍在网格内的向下和向右移动。到达右下角时返回 1，父状态把两个方向
返回的路径数相加。

``enumeratePaths`` 直接描述了全部移动序列，但同一位置会被不同前缀反复到达。例如先右后下和先下后右都会
到达 ``(1,1)``，而从该位置到终点的剩余答案只由坐标决定，与此前路径无关。

递归状态因此应从“完整移动历史”压缩为“当前位置”。

位置路径数不变量
~~~~~~~~~~~~~~~~

定义：

.. code-block:: text

   ways[row][column] = 从起点到达 (row,column) 的路径数量

内部位置的最后一步只有两种互斥来源：从上方下移，或从左侧右移。因此：

.. code-block:: text

   ways[row][column] = ways[row-1][column] + ways[row][column-1]

第一行只能连续向右，第一列只能连续向下，所以边界状态都为 1。``1 × 1`` 网格中不移动也构成一条路径，
同样由这个初始化覆盖。

按从上到下、从左到右的顺序计算时，每个状态依赖的上方和左方都已经确定。处理完 ``(row,column)`` 后，
``ways`` 中该位置保存的就是全部到达路径，不会遗漏或重复：每条路径按最后一步唯一归入两个来源之一。

对 ``3 × 4`` 网格，状态表为：

.. code-block:: text

   1  1  1  1
   1  2  3  4
   1  3  6 10

二维状态转移
~~~~~~~~~~~~

``tableDp`` 保存完整二维表。每个位置只计算一次，已经消除了递归树中对相同坐标的重复求解。

这个表仍保留了不再需要的旧行。计算当前行时，只会读取上一行同列和当前行左侧，更早的行不会再次参与
转移。

滚动数组压缩
~~~~~~~~~~~~

一维数组 ``ways[column]`` 在一次更新前表示上一行同列的路径数，更新后表示当前行同列的路径数。
从左向右执行：

.. code-block:: text

   ways[column] += ways[column-1]

此时右操作数仍是上方状态，左侧元素已经更新为当前行左方状态，恰好对应二维转移。

扫描方向不能改为从右向左，否则 ``ways[column-1]`` 仍属于上一行。代码让较短维度作为数组长度，把辅助
空间压缩为 ``O(min(m,n))``。

固定步数组合
~~~~~~~~~~~~

从左上角到右下角，任意路径都必须恰好执行：

.. code-block:: text

   向下 m-1 次
   向右 n-1 次
   总步数 m+n-2

一条路径可以唯一表示为一串固定长度的动作。选择总步数中的 ``m-1`` 个位置放置向下动作，其余位置只能
放置向右动作；任意这样的选择也一定得到一条合法路径。因此路径与位置集合一一对应：

.. code-block:: text

   C(m+n-2, m-1) = C(m+n-2, n-1)

选择 ``min(m-1,n-1)`` 作为组合数的下标，可以减少循环次数。

逐步组合计算
~~~~~~~~~~~~

令 ``total = m+n-2``，``choose = min(m-1,n-1)``。代码依次计算：

.. code-block:: text

   C(total-choose+selected, selected)

第 ``selected`` 轮开始前保存上一项组合数。乘上新分子并除以 ``selected`` 后，结果正好是下一项组合数，
所以每轮除法都整除，不需要浮点数。

题目保证最终答案不超过 ``2 * 10^9``。中间组合数单调增长且不超过最终答案，乘法使用 ``long long``，能够
安全容纳本题范围内的中间结果。

方法关系
~~~~~~~~

四种方法处理的是同一棵路径决策树：

.. code-block:: text

   递归枚举：逐条访问根到叶路径
   二维 DP：合并到达同一坐标的重复子问题
   滚动 DP：删除转移不再依赖的旧行
   组合计数：利用所有路径的两类步数固定，直接计算叶子数量

主入口调用 ``countByCombinations``，因为它不需要建立网格状态，并且直接表达路径与动作位置集合的一一对应。

边界处理
~~~~~~~~

当 ``m = 1`` 或 ``n = 1`` 时，``chosenSteps = 0``，组合循环不执行并返回 1，表示只有一条直线路径。

当 ``m = n = 1`` 时，总步数为 0，同样返回 1。所有方法都把“不移动”视为从起点到终点的唯一合法路径。

复杂度分析
~~~~~~~~~~

朴素递归的搜索树为指数规模，递归深度为 ``O(m+n)``。

二维动态规划时间和空间均为 ``O(mn)``。滚动数组时间为 ``O(mn)``，额外空间为
``O(min(m,n))``。

组合方法循环 ``min(m-1,n-1)`` 次，时间为 ``O(min(m,n))``，额外空间为 ``O(1)``。
