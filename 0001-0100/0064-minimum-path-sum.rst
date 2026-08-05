0064. Minimum Path Sum
======================

题目信息
--------

:题号: 0064
:难度: Medium
:主题: 动态规划、网格、最小代价、滚动数组
:原题: `LeetCode 0064 <https://leetcode.com/problems/minimum-path-sum/>`_
:重点: 从枚举右下移动序列，推导到只保存到达当前格的最小路径和

题目重述
--------

给定一个 ``m × n`` 的非负整数网格 ``grid``。从左上角 ``(0,0)`` 出发，每一步只能向右或向下移动一格，
直到到达右下角 ``(m-1,n-1)``。

返回所有合法路径中最小的路径和。路径和包含起点、终点以及沿途经过的每一个单元格。

约束为 ``1 <= m, n <= 200``、``0 <= grid[row][column] <= 200``。

自建示例
--------

.. code-block:: text

   输入：
   [[2,1,4],
    [3,2,1],
    [5,1,1]]

   输出：7

路径 ``2 -> 1 -> 2 -> 1 -> 1`` 的和为 7，其他合法路径的和都不小于 7。

.. code-block:: text

   输入：[[4],[1],[7]]
   输出：12

单列网格只能连续向下，路径和为 ``4 + 1 + 7``。

.. code-block:: text

   输入：[[0,0],[0,0]]
   输出：0

网格值允许为 0，合法最小路径和也可能为 0。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <limits>
   #include <vector>

   class Solution {
   private:
       int enumeratePaths(
           const std::vector<std::vector<int>>& grid,
           int row,
           int column
       ) {
           const int rows = static_cast<int>(grid.size());
           const int columns = static_cast<int>(grid[0].size());
           if (row == rows - 1 && column == columns - 1) {
               return grid[row][column];
           }

           int suffix = std::numeric_limits<int>::max();
           if (row + 1 < rows) {
               suffix = std::min(
                   suffix,
                   enumeratePaths(grid, row + 1, column)
               );
           }
           if (column + 1 < columns) {
               suffix = std::min(
                   suffix,
                   enumeratePaths(grid, row, column + 1)
               );
           }
           return grid[row][column] + suffix;
       }

       int tableDp(const std::vector<std::vector<int>>& grid) {
           const int rows = static_cast<int>(grid.size());
           const int columns = static_cast<int>(grid[0].size());
           std::vector<std::vector<int>> best(
               rows,
               std::vector<int>(columns, 0)
           );

           best[0][0] = grid[0][0];
           for (int column = 1; column < columns; ++column) {
               best[0][column] = best[0][column - 1] + grid[0][column];
           }
           for (int row = 1; row < rows; ++row) {
               best[row][0] = best[row - 1][0] + grid[row][0];
           }

           for (int row = 1; row < rows; ++row) {
               for (int column = 1; column < columns; ++column) {
                   best[row][column] = grid[row][column] + std::min(
                       best[row - 1][column],
                       best[row][column - 1]
                   );
               }
           }
           return best[rows - 1][columns - 1];
       }

       int overwriteGrid(std::vector<std::vector<int>>& grid) {
           const int rows = static_cast<int>(grid.size());
           const int columns = static_cast<int>(grid[0].size());

           for (int column = 1; column < columns; ++column) {
               grid[0][column] += grid[0][column - 1];
           }
           for (int row = 1; row < rows; ++row) {
               grid[row][0] += grid[row - 1][0];
           }

           for (int row = 1; row < rows; ++row) {
               for (int column = 1; column < columns; ++column) {
                   grid[row][column] += std::min(
                       grid[row - 1][column],
                       grid[row][column - 1]
                   );
               }
           }
           return grid[rows - 1][columns - 1];
       }

       int rollingDp(const std::vector<std::vector<int>>& grid) {
           const int rows = static_cast<int>(grid.size());
           const int columns = static_cast<int>(grid[0].size());
           std::vector<int> best(columns, 0);

           best[0] = grid[0][0];
           for (int column = 1; column < columns; ++column) {
               best[column] = best[column - 1] + grid[0][column];
           }

           for (int row = 1; row < rows; ++row) {
               best[0] += grid[row][0];
               for (int column = 1; column < columns; ++column) {
                   best[column] = grid[row][column] + std::min(
                       best[column],
                       best[column - 1]
                   );
               }
           }
           return best[columns - 1];
       }

   public:
       int minPathSum(std::vector<std::vector<int>>& grid) {
           return rollingDp(grid);
       }
   };

题解
----

路径枚举
~~~~~~~~

最直接的方法从起点开始递归。当前位置不是终点时，分别尝试向下和向右；两条分支返回各自后缀路径的最小和，
当前层再加上当前格的数值。

``enumeratePaths`` 完整覆盖所有合法移动序列，因此一定能找到答案。问题在于不同前缀会反复进入同一个格子，
并重新计算从该格到终点的相同后缀。例如先右后下与先下后右都会到达 ``(1,1)``。

网格共有 ``mn`` 个位置，而递归树按移动序列展开。消除重复计算的关键，是把状态从“此前走过的整条路径”压缩为
“到达当前格的最小路径和”。

位置最优状态
~~~~~~~~~~~~

定义：

.. code-block:: text

   best[row][column] = 从起点到达 (row,column) 的最小路径和

内部格的最后一步只能来自上方或左方，因此：

.. code-block:: text

   best[row][column]
       = grid[row][column]
       + min(best[row-1][column], best[row][column-1])

若一条到达当前格的最优路径来自上方，它在上方格之前的前缀也必须最优。否则可以替换为更小的上方前缀，
并保持最后一步不变，从而得到更小的当前路径，与原路径最优矛盾。左方来源同理。

上方与左方覆盖了全部合法最后一步，所以取两者较小值既不会遗漏路径，也不会引入非法路径。

边界累计
~~~~~~~~

第一行没有上方来源，只能从左侧连续移动；第一列没有左方来源，只能从上方连续移动。因此边界状态分别为前一个
边界状态加当前格数值：

.. code-block:: text

   best[0][column] = best[0][column-1] + grid[0][column]
   best[row][0]    = best[row-1][0] + grid[row][0]

不能把不存在的来源当成 0。网格值非负，虚构的零代价入口可能小于真实边界路径，使第一行或第一列得到错误结果。

起点状态直接为 ``grid[0][0]``，因为路径和包含起点本身。``1 × 1`` 网格也由该初始化直接覆盖。

状态演化
~~~~~~~~

对网格：

.. code-block:: text

   1 3 1
   1 5 1
   4 2 1

二维状态依次变为：

.. code-block:: text

   1 4 5
   2 7 6
   6 8 7

例如中心格的状态为 ``5 + min(4,2) = 7``，右下角最终得到最小路径和 7。

原地覆盖
~~~~~~~~

二维表中的每个状态只用于右侧和下方转移。若允许修改输入，可以直接把 ``grid[row][column]`` 覆盖为到达该格
的最小路径和，转移公式不变。

``overwriteGrid`` 因此只使用常数个循环变量，额外空间为 ``O(1)``。代价是输入矩阵不再保存原始单元格值。
公开入口保持输入不变，所以不选择该方法作为默认实现。

一维滚动
~~~~~~~~

处理当前行的 ``column`` 位置前：

* ``best[column]`` 仍保存上一行同列状态，即上方最小路径和；
* ``best[column-1]`` 已在当前行更新，即左方最小路径和。

因此可以直接执行：

.. code-block:: text

   best[column]
       = grid[row][column]
       + min(best[column], best[column-1])

更新必须从左向右进行。若从右向左扫描，``best[column-1]`` 尚未更新，表示上一行左侧位置，而不是当前格的左邻居。

第一列在每一行只有上方来源，所以执行 ``best[0] += grid[row][0]``。第一行先做前缀累加，随后所有内部行都能
使用同一条滚动转移。

状态含义
~~~~~~~~

每处理完 ``(row,column)``，已经更新的当前行前缀都保存精确最小路径和；右侧尚未处理的位置仍保存上一行状态。
这个不变量保证覆盖旧值时，转移所需的上方与左方信息同时存在。

网格值允许为 0，路径和也可能为 0，因此不能用 0 表示未计算状态。二维与滚动方法通过明确的边界初始化区分真实
零值和尚未写入的位置。

方法关系
~~~~~~~~

路径枚举保留完整选择树，同一位置的后续问题会被重复计算。二维动态规划把每个位置只计算一次，状态数量降为
``mn``。

原地方法继续观察到输入格在读取后可以改写，用输入矩阵替代独立状态表。滚动方法则保留输入，只保存上一行与当前行
前缀所需的一维状态。

公开入口调用 ``rollingDp``，在不修改输入的前提下把辅助空间从 ``O(mn)`` 降为 ``O(n)``。

复杂度分析
~~~~~~~~~~

设网格有 ``m`` 行、``n`` 列。

朴素递归会重复访问相同位置，时间随路径数量指数增长，递归深度为 ``O(m+n)``。

二维动态规划、原地覆盖和滚动数组都恰好处理每个格一次，时间为 ``O(mn)``。二维表使用 ``O(mn)`` 辅助空间；
滚动数组使用 ``O(n)`` 辅助空间；原地覆盖除输入矩阵外只使用 ``O(1)`` 额外空间。