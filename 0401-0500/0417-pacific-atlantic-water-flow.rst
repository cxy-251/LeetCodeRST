0417. Pacific Atlantic Water Flow
=================================

题目信息
--------

:题号: 0417
:难度: Medium
:主题: 高度矩阵、水流方向、双海岸可达、坐标集合
:原题: `LeetCode 0417 <https://leetcode.com/problems/pacific-atlantic-water-flow/>`_
:重点: 水只能流向四邻接且不更高的格子、上左边界接太平洋、下右边界接大西洋、返回同时可达的坐标

题目重述
--------

给定 ``m × n`` 整数矩阵 ``heights``，每个格子表示该位置的高度。雨水可以从一个格子流向上下左右相邻且高度小于或等于当前格子的格子。

太平洋与矩阵的上边界和左边界相接，大西洋与下边界和右边界相接。返回所有能够沿合法水流路径同时到达两个海洋的格子坐标 ``[row, col]``，结果顺序不限。

``m`` 和 ``n`` 均位于 ``[1, 200]``，高度位于 ``[0, 10^5]``。位于两组海岸边界交会处的格子可以直接到达两个海洋；等高格子之间允许水流动。

自建示例
--------

所有高点不一定都能到达两侧：

.. code-block:: text

   输入：heights = [[1,2],[4,3]]
   输出：[[0,1],[1,0],[1,1]]
   解释：(0,1) 同时位于上边界和右边界；(1,0) 同时位于左边界和下边界；(1,1) 位于大西洋边界，并可向上流到高度 2 的太平洋边界。(0,0) 无法流向更高的相邻格子，所以不能到达大西洋。

单个格子：

.. code-block:: text

   输入：heights = [[7]]
   输出：[[0,0]]
   解释：唯一格子同时属于上、下、左、右边界，因此可以到达两个海洋。

从海洋反向寻找可到达格子
--------------------------

正向从每个格子找水流路径会重复搜索。反过来从太平洋边界和大西洋边界分别做 BFS：若当前格高度为 ``h``，反向只能走到高度大于或等于 ``h`` 的邻格，因为那样的水才可能从邻格向当前格流下。两次搜索得到的可达集合取交集，就是同时能到达两海洋的格子。

每个边界格只入各自队列一次，等高格也允许通过；四邻接方向和矩阵边界的初始化直接对应题目规则。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       void flood(const std::vector<std::vector<int>>& heights,
                  std::queue<std::pair<int, int>>& queue,
                  std::vector<std::vector<bool>>& seen) {
           int rows = static_cast<int>(heights.size());
           int cols = static_cast<int>(heights[0].size());
           const int directions[4][2] = {
               {-1, 0}, {1, 0}, {0, -1}, {0, 1}
           };
           while (!queue.empty()) {
               auto [row, col] = queue.front();
               queue.pop();
               for (const auto& direction : directions) {
                   int nextRow = row + direction[0];
                   int nextCol = col + direction[1];
                   if (nextRow < 0 || nextRow >= rows
                       || nextCol < 0 || nextCol >= cols
                       || seen[nextRow][nextCol]
                       || heights[nextRow][nextCol]
                              < heights[row][col]) {
                       continue;
                   }
                   seen[nextRow][nextCol] = true;
                   queue.push({nextRow, nextCol});
               }
           }
       }

   public:
       std::vector<std::vector<int>> pacificAtlantic(
           std::vector<std::vector<int>>& heights) {
           int rows = static_cast<int>(heights.size());
           int cols = static_cast<int>(heights[0].size());
           std::vector<std::vector<bool>> pacific(
               rows, std::vector<bool>(cols, false));
           std::vector<std::vector<bool>> atlantic(
               rows, std::vector<bool>(cols, false));
           std::queue<std::pair<int, int>> pacificQueue;
           std::queue<std::pair<int, int>> atlanticQueue;

           for (int row = 0; row < rows; ++row) {
               pacific[row][0] = true;
               pacificQueue.push({row, 0});
               atlantic[row][cols - 1] = true;
               atlanticQueue.push({row, cols - 1});
           }
           for (int col = 0; col < cols; ++col) {
               if (!pacific[0][col]) {
                   pacific[0][col] = true;
                   pacificQueue.push({0, col});
               }
               if (!atlantic[rows - 1][col]) {
                   atlantic[rows - 1][col] = true;
                   atlanticQueue.push({rows - 1, col});
               }
           }
           flood(heights, pacificQueue, pacific);
           flood(heights, atlanticQueue, atlantic);

           std::vector<std::vector<int>> result;
           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (pacific[row][col] && atlantic[row][col]) {
                       result.push_back({row, col});
                   }
               }
           }
           return result;
       }
   };

代码分析
--------

反向边条件 ``next >= current`` 恰好是正向水流“不上坡”的逆命题；两个独立 visited 矩阵不会混淆海洋来源。每个格子最多被两次搜索各访问一次，时间复杂度为 ``O(mn)``，额外空间为 ``O(mn)``。
