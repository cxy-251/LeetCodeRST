0329. Longest Increasing Path in a Matrix
=========================================

题目信息
--------

:题号: 0329
:难度: Hard
:主题: 整数矩阵、四邻接路径、严格递增、最长长度
:原题: `LeetCode 0329 <https://leetcode.com/problems/longest-increasing-path-in-a-matrix/>`_
:重点: 路径可从任意格开始、每步只能上下左右移动、下一格必须严格更大、返回格子数量

题目重述
--------

给定整数矩阵 ``matrix``，可以从任意格子作为起点，并反复移动到上、下、左、右相邻格子。每一步到达格子的数值必须严格大于前一个格子的数值；不能对角移动，也不能越过矩阵边界。

返回所有合法路径中包含格子数量的最大值。矩阵行数和列数均位于 ``[1, 200]``，每个元素位于 ``[0, 2^31-1]``。相等值不能延长路径；题目只要求最长长度，不要求返回具体坐标序列。

自建示例
--------

路径在矩阵中多次转向：

.. code-block:: text

   输入：matrix = [
          [7, 8, 9],
          [6, 1, 10],
          [5, 4, 3]
        ]
   输出：8
   解释：一条最长路径是 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10，共经过 8 个格子，每一步都移动到四邻格中的更大值。

所有数值相等：

.. code-block:: text

   输入：matrix = [[2, 2], [2, 2]]
   输出：1
   解释：严格递增不允许移动到相等值，因此任意合法路径只能包含起点一个格子。

严格递增关系形成无环图
------------------------

把每个格子看作节点，只向数值更大的四邻格连边。沿边移动时数值严格增加，因此不可能回到已经访问的格子，也就形成一个有向无环图。定义 ``length(r,c)`` 为从格子 ``(r,c)`` 出发能得到的最长路径长度，则它等于 1 加上所有更大邻居的最大 ``length``；没有更大邻居时就是 1。

同一个格子可能从多个起点被询问，递归结果必须缓存。深搜只在第一次到达时计算，之后直接复用；最后遍历所有格子的出发长度取最大值。相等值不连边，正好对应“严格递增”。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int longestIncreasingPath(
           std::vector<std::vector<int>>& matrix) {
           int rows = static_cast<int>(matrix.size());
           int cols = static_cast<int>(matrix[0].size());
           std::vector<std::vector<int>> memo(
               rows, std::vector<int>(cols, 0));
           const int directions[4][2] = {
               {-1, 0}, {1, 0}, {0, -1}, {0, 1}
           };

           std::function<int(int, int)> dfs =
               [&](int row, int col) -> int {
               if (memo[row][col] != 0) return memo[row][col];
               int best = 1;
               for (const auto& direction : directions) {
                   int nextRow = row + direction[0];
                   int nextCol = col + direction[1];
                   if (nextRow < 0 || nextRow >= rows
                       || nextCol < 0 || nextCol >= cols
                       || matrix[nextRow][nextCol]
                              <= matrix[row][col]) {
                       continue;
                   }
                   best = std::max(best,
                                   1 + dfs(nextRow, nextCol));
               }
               return memo[row][col] = best;
           };

           int answer = 0;
           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   answer = std::max(answer, dfs(row, col));
               }
           }
           return answer;
       }
   };

代码分析
--------

递归只沿严格增大的边走，因而不会出现环；``memo`` 使每个格子至多真正展开一次，四个方向的检查总量与格子数成正比。矩阵规模为 ``R * C`` 时，时间复杂度为 ``O(RC)``，缓存和递归栈额外空间为 ``O(RC)``（递归深度最多为路径长度）。
