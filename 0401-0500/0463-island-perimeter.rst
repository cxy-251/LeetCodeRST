0463. Island Perimeter
======================

题目信息
--------

:题号: 0463
:难度: Easy
:主题: 二值网格、单一岛屿、四邻接、外露边长
:原题: `LeetCode 0463 <https://leetcode.com/problems/island-perimeter/>`_
:重点: 陆地格边长为 1、共享边不计周长、网格外和水格构成边界、岛内没有湖泊

题目重述
--------

给定只包含 0 和 1 的矩阵 ``grid``，1 表示陆地，0 表示水。网格中恰好有一个由上下左右相邻陆地格组成的岛屿，并且岛屿内部没有完全被陆地包围的湖泊。返回该岛屿的周长。

每个格子是边长为 1 的正方形。陆地格与水格或网格外部相邻的一条边贡献 1 个单位周长；两个陆地格共享的边位于岛屿内部，不计入周长。矩阵行列数位于 ``[1, 100]``。

自建示例
--------

三个格子组成 L 形：

.. code-block:: text

   输入：grid = [[1,1],[1,0]]
   输出：8
   解释：三个陆地格单独共有 12 条边，其中两对相邻陆地共享 2 条边，每条共享边会从外周长中消去两侧，因此周长为 12 - 4 = 8。

单个陆地格：

.. code-block:: text

   输入：grid = [[1]]
   输出：4
   解释：该格子的四条边都面向网格外部。

从每块陆地的四条边累计
----------------------

一块陆地初始贡献 4 条边。若它的上方或左方也是陆地，则这条共享边已经在之前或当前的计数中出现两次，减去 2；只检查上、左两个方向，就能在不重复计算的前提下处理所有相邻陆地对。面向网格外或水的边不会触发扣除，自然保留在周长中。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int islandPerimeter(std::vector<std::vector<int>>& grid) {
           int rows = static_cast<int>(grid.size());
           int columns = static_cast<int>(grid[0].size());
           int perimeter = 0;
           for (int row = 0; row < rows; ++row) {
               for (int column = 0; column < columns; ++column) {
                   if (grid[row][column] == 0) continue;
                   perimeter += 4;
                   if (row > 0 && grid[row - 1][column] == 1) {
                       perimeter -= 2;
                   }
                   if (column > 0 && grid[row][column - 1] == 1) {
                       perimeter -= 2;
                   }
               }
           }
           return perimeter;
       }
   };

代码分析
--------

每个陆地格与相邻陆地共享的边会从两块格子的独立边数中消失，因此每发现一对相邻陆地扣除 2；只从上、左检查保证每对只处理一次。遍历每个格子一次，时间复杂度为 ``O(rows * columns)``，额外空间复杂度为 ``O(1)``。
