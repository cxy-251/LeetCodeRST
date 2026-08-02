0529. Minesweeper
=================

题目信息
--------

:题号: 0529
:难度: Medium
:主题: 矩阵、扫雷规则、八邻域、递归揭示
:原题: `LeetCode 0529 <https://leetcode.com/problems/minesweeper/>`_
:重点: 点击地雷改为 X、空格按八邻域地雷数更新、零相邻地雷时继续揭示周围未揭示空格

题目重述
--------

给定一个扫雷棋盘 ``board`` 和一次点击坐标 ``click``。未揭示地雷用 ``'M'`` 表示，未揭示空格用 ``'E'`` 表示。按照扫雷规则更新棋盘并返回更新后的矩阵。

若点击到地雷，把该格改为 ``'X'`` 并结束。若点击到空格，统计它周围八个方向内的地雷数量：数量大于零时把该格改为对应字符 ``'1'`` 到 ``'8'``；数量为零时把它改为 ``'B'``，并继续揭示所有相邻的未揭示空格。已经揭示的格子不重复处理。

自建示例
--------

点击有相邻地雷的空格：

.. code-block:: text

   输入：board = [["M","E","E"],["E","E","E"],["E","E","E"]]，click = [1,1]
   输出：[["M","E","E"],["E","1","E"],["E","E","E"]]
   解释：中心格的八邻域中有左上角一颗地雷，因此只把中心格标记为 1，不继续展开。

直接点击地雷：

.. code-block:: text

   输入：board = [["E","M"]]，click = [0,1]
   输出：[["E","X"]]
   解释：点击位置是地雷，立即改为 X。

递归揭示零邻雷区域
------------------

点击地雷时直接改为 ``X``。点击未揭示空格后，先统计八个方向的 ``M``；若数量非零，只写入数字并停止扩展；若数量为零，写入 ``B`` 后递归访问八邻域的未揭示空格。先把当前格改写为 ``B``，就能防止递归环路和重复处理。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       const int directions[8][2] = {
           {-1, -1}, {-1, 0}, {-1, 1}, {0, -1},
           {0, 1}, {1, -1}, {1, 0}, {1, 1}
       };

       void reveal(std::vector<std::vector<char>>& board,
                   int row, int column) {
           int rows = static_cast<int>(board.size());
           int columns = static_cast<int>(board[0].size());
           if (row < 0 || row >= rows || column < 0 || column >= columns ||
               board[row][column] != 'E') return;

           int mines = 0;
           for (const auto& direction : directions) {
               int nextRow = row + direction[0];
               int nextColumn = column + direction[1];
               if (nextRow >= 0 && nextRow < rows &&
                   nextColumn >= 0 && nextColumn < columns &&
                   board[nextRow][nextColumn] == 'M') {
                   ++mines;
               }
           }
           if (mines > 0) {
               board[row][column] = static_cast<char>('0' + mines);
               return;
           }

           board[row][column] = 'B';
           for (const auto& direction : directions) {
               reveal(board, row + direction[0],
                      column + direction[1]);
           }
       }

   public:
       std::vector<std::vector<char>> updateBoard(
           std::vector<std::vector<char>>& board,
           std::vector<int>& click) {
           int row = click[0];
           int column = click[1];
           if (board[row][column] == 'M') {
               board[row][column] = 'X';
           } else {
               reveal(board, row, column);
           }
           return board;
       }
   };

代码分析
--------

每个空格在第一次进入时就被改为 ``B`` 或数字，后续邻居不会再次展开它；八方向计数与扫雷规则完全对应。每个格子最多处理一次，时间复杂度为 ``O(rows * columns)``，递归栈空间为 ``O(rows * columns)`` 的最坏上界。
