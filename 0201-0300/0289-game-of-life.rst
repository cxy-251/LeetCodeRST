0289. Game of Life
=================

题目信息
--------

:题号: 0289
:难度: Medium
:主题: 二维矩阵、八邻域、同步状态更新、原地修改
:原题: `LeetCode 0289 <https://leetcode.com/problems/game-of-life/>`_
:重点: 每个格子依据更新前的八个邻居同时演化、四条生存规则、结果原地写回

题目重述
--------

给定由 ``0`` 和 ``1`` 组成的 ``m × n`` 棋盘 ``board``，``1`` 表示活细胞，``0`` 表示死细胞。每个格子的邻居是水平、垂直和对角方向上最多八个相邻格子。按照以下规则计算下一代：

* 活细胞的活邻居少于 2 个时死亡；
* 活细胞有 2 个或 3 个活邻居时继续存活；
* 活细胞的活邻居多于 3 个时死亡；
* 死细胞恰好有 3 个活邻居时复活。

``m`` 和 ``n`` 均位于 ``[1, 25]``。所有格子的下一状态必须基于同一份更新前棋盘同时决定，不能让较早写入的新状态影响后面格子的判断。函数没有返回值，最终结果必须原地写回 ``board``。进阶要求是在常数额外空间内完成更新。

自建示例
--------

死细胞因三个邻居复活：

.. code-block:: text

   输入：board = [[1, 1], [1, 0]]
   修改后：board = [[1, 1], [1, 1]]
   解释：右下角死细胞有三个活邻居，因此复活；其余三个活细胞各有两个活邻居，因此继续存活。

孤立活细胞死亡：

.. code-block:: text

   输入：board = [[0, 0, 0], [0, 1, 0], [0, 0, 0]]
   修改后：board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
   解释：中心活细胞没有活邻居，因邻居少于两个而死亡；其他死细胞也都没有三个活邻居。

用过渡标记保存前一代状态
------------------------

原地更新的难点是某个格子一旦改写，后续邻居统计不能把它误当成新一代状态。
使用两个额外状态编码过渡：

* ``-1``：原来活、下一代死；
* ``2``：原来死、下一代活；
* ``0`` 和 ``1``：表示前后状态都分别为死、活。

统计邻居时，只有 ``1`` 和 ``-1`` 算作“上一代活细胞”。第一遍根据原始状态决定过渡标记，
第二遍把大于 0 的标记统一改为 1，其余改为 0。这样所有格子都基于同一代数据更新。

正确性说明
----------

遍历某格时，每个八方向邻居若是 ``1`` 或 ``-1``，恰好表示它在更新前存活；
若是 ``0`` 或 ``2``，更新前均为死亡。因此活邻居计数与原棋盘完全一致，四条规则给出的下一状态被准确编码。
编码不会改变尚未读取的“上一代”语义，统一解码后得到的矩阵就是同步演化结果。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       void gameOfLife(std::vector<std::vector<int>>& board) {
           const int rows = static_cast<int>(board.size());
           const int columns = static_cast<int>(board[0].size());
           const int directions[8][2] = {
               {-1, -1}, {-1, 0}, {-1, 1}, {0, -1},
               {0, 1}, {1, -1}, {1, 0}, {1, 1}
           };

           for (int row = 0; row < rows; ++row) {
               for (int column = 0; column < columns; ++column) {
                   int live = 0;
                   for (const auto& direction : directions) {
                       const int next_row = row + direction[0];
                       const int next_column = column + direction[1];
                       if (next_row >= 0 && next_row < rows &&
                           next_column >= 0 && next_column < columns &&
                           (board[next_row][next_column] == 1 ||
                            board[next_row][next_column] == -1)) {
                           ++live;
                       }
                   }

                   if (board[row][column] == 1 && (live < 2 || live > 3)) {
                       board[row][column] = -1;
                   } else if (board[row][column] == 0 && live == 3) {
                       board[row][column] = 2;
                   }
               }
           }

           for (auto& row : board) {
               for (int& cell : row) cell = cell > 0 ? 1 : 0;
           }
       }
   };

代码分析
--------

每个格子检查最多八个邻居，时间复杂度为 ``O(mn)``；只使用固定方向表和计数变量，额外空间为 ``O(1)``。
过渡值只在函数内部存在，第二遍完成后棋盘仍只含 0 和 1，且没有创建同等规模的副本。
