0419. Battleships in a Board
============================

题目信息
--------

:题号: 0419
:难度: Medium
:主题: 字符矩阵、直线战舰、四邻接分离、数量统计
:原题: `LeetCode 0419 <https://leetcode.com/problems/battleships-in-a-board/>`_
:重点: 每艘战舰是水平或竖直连续 ``X``、不能弯折、不同战舰不在上下左右方向相邻、返回舰船数量

题目重述
--------

给定只包含字符 ``'X'`` 和 ``'.'`` 的矩阵 ``board``。``'X'`` 表示战舰的一部分，``'.'`` 表示空格。每艘战舰由同一行或同一列中的一个或多个连续 ``'X'`` 组成，不能弯折。

题目保证输入棋盘有效：两艘不同战舰之间不会在上下或左右方向直接相邻。返回棋盘中的战舰数量。矩阵行列数均位于 ``[1, 200]``。函数不应修改输入棋盘；题目的进阶要求只扫描一次并使用常数额外空间。

自建示例
--------

同时包含水平、竖直和单格战舰：

.. code-block:: text

   输入：board = [["X","X",".","."],
                   [".",".",".","X"],
                   ["X",".",".","X"]]
   输出：3
   解释：第一行前两个 X 构成一艘水平战舰；最右列后两个 X 构成一艘竖直战舰；左下角单独的 X 是第三艘战舰。

全为空格：

.. code-block:: text

   输入：board = [[".","."],[".","."]]
   输出：0
   解释：棋盘中没有字符 X，因此没有战舰。

只数每艘战舰的左上端点
------------------------

输入保证不同战舰不在上下左右相邻，因此一艘水平或竖直战舰的第一个 ``X`` 不会在它的上方或左方紧邻另一个 ``X``。扫描每个格子时，只有当前格为 ``X`` 且上方、左方都不是 ``X``，才把它视为一艘新战舰；同一战舰后续的横向或纵向格子都会被跳过。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int countBattleships(std::vector<std::vector<char>>& board) {
           int rows = static_cast<int>(board.size());
           int cols = static_cast<int>(board[0].size());
           int result = 0;
           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (board[row][col] != 'X') continue;
                   if (row > 0 && board[row - 1][col] == 'X') continue;
                   if (col > 0 && board[row][col - 1] == 'X') continue;
                   ++result;
               }
           }
           return result;
       }
   };

代码分析
--------

有效输入保证一艘战舰不会从左方和上方同时以另一艘船接入，所以“没有上邻居且没有左邻居”恰好只命中每艘船一次；算法不修改棋盘。时间复杂度为 ``O(mn)``，额外空间为 ``O(1)``。
