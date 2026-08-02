0407. Trapping Rain Water II
============================

题目信息
--------

:题号: 0407
:难度: Hard
:主题: 二维地形、边界泄水、四邻接、总蓄水量
:原题: `LeetCode 0407 <https://leetcode.com/problems/trapping-rain-water-ii/>`_
:重点: 每格表示单位柱体高度、水可从外边界流走、只通过上下左右连通、返回所有格子的总蓄水量

题目重述
--------

给定 ``m × n`` 的非负整数矩阵 ``heightMap``，每个格子表示一个底面积为 1 的柱体高度。降雨后，水可以在由较高地形围住的低洼处积存，也可以沿上下左右相邻格子流动并从矩阵外边界流出。

返回整个地形最终能够储存的水量总和。矩阵行列数均位于 ``[1, 200]``，每个高度位于 ``[0, 2 * 10^4]``。对角线接触不形成连通通道；位于外边界的格子自身不能依靠矩阵外侧形成挡水墙。

自建示例
--------

单个封闭低点：

.. code-block:: text

   输入：heightMap = [[3,3,3],[3,1,3],[3,3,3]]
   输出：2
   解释：中心格高度为 1，四周最低边界高度为 3，因此中心可以储存 2 个单位的水。

四邻接边界缺口限制水位：

.. code-block:: text

   输入：heightMap = [[4,1,4],[4,0,4],[4,4,4]]
   输出：1
   解释：中心格与高度为 1 的上边界格四邻接，水位超过 1 就会从该缺口流出，因此中心只能储存 1 个单位。

从外边界维护当前最低挡水墙
----------------------------

水能否留在内部取决于它到外界路径上的最低边界。把所有边界格先放入按高度排序的最小堆，并标记已访问；每次取出当前最低的边界格，检查四邻格。若邻格更低，它能储存 ``边界高度 - 邻格高度`` 的水；随后把邻格以 ``max(邻格地形高度, 当前边界高度)`` 作为新的有效边界压入堆。

这样堆中的高度表示从已探索区域向外的最低泄水门槛，而不是单纯的原始地形高度。边界格只入堆一次，四邻接检查也不会把对角接触当作通道。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       using Cell = std::tuple<int, int, int>;

   public:
       int trapRainWater(std::vector<std::vector<int>>& heightMap) {
           int rows = static_cast<int>(heightMap.size());
           int cols = static_cast<int>(heightMap[0].size());
           if (rows < 3 || cols < 3) return 0;

           std::priority_queue<Cell, std::vector<Cell>,
                               std::greater<Cell>> boundary;
           std::vector<std::vector<bool>> visited(
               rows, std::vector<bool>(cols, false));
           auto push = [&](int row, int col) {
               if (visited[row][col]) return;
               visited[row][col] = true;
               boundary.emplace(heightMap[row][col], row, col);
           };

           for (int row = 0; row < rows; ++row) {
               push(row, 0);
               push(row, cols - 1);
           }
           for (int col = 1; col + 1 < cols; ++col) {
               push(0, col);
               push(rows - 1, col);
           }

           const int directions[4][2] = {
               {-1, 0}, {1, 0}, {0, -1}, {0, 1}
           };
           int water = 0;
           while (!boundary.empty()) {
               auto [level, row, col] = boundary.top();
               boundary.pop();
               for (const auto& direction : directions) {
                   int nextRow = row + direction[0];
                   int nextCol = col + direction[1];
                   if (nextRow < 0 || nextRow >= rows
                       || nextCol < 0 || nextCol >= cols
                       || visited[nextRow][nextCol]) {
                       continue;
                   }
                   visited[nextRow][nextCol] = true;
                   water += std::max(
                       0, level - heightMap[nextRow][nextCol]);
                   boundary.emplace(
                       std::max(level, heightMap[nextRow][nextCol]),
                       nextRow, nextCol);
               }
           }
           return water;
       }
   };

代码分析
--------

最小堆每次扩展全局最低有效边界，邻格一旦被访问就确定其能够达到的最低外部水位；若地形低于该水位，差值就是可储水量。每个格子入堆一次，时间复杂度为 ``O(mn log(mn))``，额外空间为 ``O(mn)``。
