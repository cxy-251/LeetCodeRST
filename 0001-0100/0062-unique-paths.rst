0062. Unique Paths
==================

题目信息
--------

:题号: 0062
:难度: Medium
:主题: 动态规划、滚动数组、组合计数
:原题: `LeetCode 0062 <https://leetcode.com/problems/unique-paths/>`_
:重点: 从枚举移动序列，推导到网格状态复用与固定步数的组合选择

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

每条路径包含 3 次向下和 4 次向右，因此共有 ``C(7,3) = 35`` 种排列。

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

从定义出发：枚举每一种移动序列
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

位于 ``(row,column)`` 时，若下方仍在网格内，可以向下；若右方仍在网格内，可以向右。递归分别尝试两种
选择，到达右下角时找到一条完整路径。

``enumeratePaths`` 与题意完全一致，但不同移动前缀会反复到达同一位置。例如从 ``(0,0)`` 先右后下，或
先下后右，都会到达 ``(1,1)``。从 ``(1,1)`` 到终点的剩余路径与此前如何到达无关，却会在递归树中被重复
计算。

递归树的深度固定为 ``m+n-2``，分支数量随网格增大快速增长。要消除重复，状态应由当前位置决定，而不是由
完整移动历史决定。

二维动态规划：复用同一位置的答案
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

定义：

.. code-block:: text

   ways[row][column] = 从起点到达 (row,column) 的路径数量

对于内部位置，最后一步只有两种来源：

#. 从 ``(row-1,column)`` 向下进入；
#. 从 ``(row,column-1)`` 向右进入。

两类路径的最后一步方向不同，互不重叠；任何合法路径的最后一步又必属于其中一类，因此：

.. code-block:: text

   ways[row][column] = ways[row-1][column] + ways[row][column-1]

第一行只能一直向右，第一列只能一直向下，所以它们的状态都为 1。``1 × 1`` 网格中，机器人已经位于终点，
不移动也构成唯一方案，同样由初始化覆盖。

以 ``3 × 4`` 网格为例：

.. code-block:: text

   1  1  1  1
   1  2  3  4
   1  3  6 10

每个内部状态只计算一次，右下角得到全部路径数。

一维数组如何保存足够的信息
~~~~~~~~~~~~~~~~~~~~~~~~~~

计算当前行时，转移只依赖上一行同列和当前行左侧，不再需要更早的行。因此可以让 ``ways[column]`` 同时承担
两种含义：

* 更新前，它是上一行同列的路径数；
* 更新后，它是当前行同列的路径数。

从左向右执行：

.. code-block:: text

   ways[column] += ways[column-1]

右侧的 ``ways[column]`` 尚未更新，仍表示上方状态；左侧的 ``ways[column-1]`` 已经更新，表示当前行左方
状态，二者正好对应二维转移。

更新顺序不能反过来。若从右向左扫描，左侧状态仍属于上一行，会错误地把两个旧状态相加。代码把较短维度
作为一维数组长度，使辅助空间降为 ``O(min(m,n))``。

路径为什么可以直接变成组合计数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

无论路径如何弯曲，从左上角到右下角都必须恰好执行：

.. code-block:: text

   向下 m-1 次
   向右 n-1 次
   总计 m+n-2 步

因此，一条路径可以唯一编码为长度 ``m+n-2`` 的移动序列。只要从全部位置中选择 ``m-1`` 个位置放置向下
移动，其余位置就只能放置向右移动；反过来，任何这样的选择都会生成一条合法路径。

这建立了路径与位置集合之间的一一对应，所以答案为：

.. code-block:: text

   C(m+n-2, m-1) = C(m+n-2, n-1)

选择较小的 ``min(m-1,n-1)`` 计算，可以减少乘除次数。

为什么逐步乘除不会产生截断误差
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

令 ``total = m+n-2``，``choose = min(m-1,n-1)``。代码逐步计算：

.. code-block:: text

   C(total-choose+selected, selected)

第 ``selected`` 轮开始前保存的是前一项组合数，乘上新分子再除以 ``selected`` 后，结果恰好是下一项组合数，
所以每轮结果都是整数，不依赖浮点数，也不会出现整数除法截断。

题目保证最终答案不超过 ``2 * 10^9``。这些中间组合数单调增长且不超过最终答案；乘法发生在 ``long long``
中，在本题约束下也不会溢出。

组合方法为什么覆盖全部路径且没有重复
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每条路径的向下步骤位置构成唯一集合，因此两条不同路径不可能映射到同一个选择。每个大小为 ``m-1`` 的位置
集合又唯一确定一串向下与向右动作，并且动作总数恰好把机器人送到右下角。因此组合数既没有遗漏，也没有重复。

主入口选择 ``countByCombinations``，因为它直接利用路径中两类步数固定这一最终结构，不需要建立整个网格状态。

复杂度来源
~~~~~~~~~~

朴素递归的路径树为指数规模。二维动态规划时间 ``O(mn)``、空间 ``O(mn)``；滚动数组时间 ``O(mn)``、
空间 ``O(min(m,n))``。

组合方法循环 ``min(m-1,n-1)`` 次，时间 ``O(min(m,n))``、额外空间 ``O(1)``。
