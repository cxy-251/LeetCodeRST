0036. Valid Sudoku
==================

题目信息
--------

:题号: 0036. 有效的数独
:难度: Medium
:主题: 矩阵、集合、位掩码
:原题: `LeetCode 0036 <https://leetcode.com/problems/valid-sudoku/>`_
:重点: 从逐格重复检查同行同列同宫，推导到一次遍历同时维护三类数字集合

题目重述
--------

给定一个 ``9 x 9`` 的数独棋盘 ``board``，判断当前已经填写的数字是否满足以下三类约束：

#. 每一行中，数字 ``1`` 到 ``9`` 不能重复；
#. 每一列中，数字 ``1`` 到 ``9`` 不能重复；
#. 每个 ``3 x 3`` 九宫格中，数字 ``1`` 到 ``9`` 不能重复。

字符 ``'.'`` 表示空格，不参与重复检查。题目只判断当前局面是否违反约束，不要求证明棋盘能够继续填成一个完整
数独。因此，一个尚未填满但没有重复数字的棋盘仍然有效。

棋盘固定为 ``9 x 9``，其中每个字符只可能是 ``'.'`` 或 ``'1'`` 到 ``'9'``。

自建示例
--------

以下坐标使用零基下标，未列出的格子都为 ``'.'``：

* 同一行重复：``board[0][1] = '5'``、``board[0][7] = '5'``，返回 ``false``；
* 同一列重复：``board[1][3] = '7'``、``board[8][3] = '7'``，返回 ``false``；
* 同一宫重复：``board[0][0] = '4'``、``board[2][2] = '4'``，返回 ``false``；
* 数字同时位于不同的行、列和宫：``board[0][0] = '6'``、``board[4][4] = '6'``，返回 ``true``；
* 全空棋盘：所有格子均为 ``'.'``，返回 ``true``。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <vector>

   class Solution {
   private:
       bool conflictsWithPeers(
           const std::vector<std::vector<char>>& board,
           int row,
           int col
       ) {
           const char digit = board[row][col];
           for (int index = 0; index < 9; ++index) {
               if (index != col && board[row][index] == digit) {
                   return true;
               }
               if (index != row && board[index][col] == digit) {
                   return true;
               }
           }

           const int boxRow = row / 3 * 3;
           const int boxCol = col / 3 * 3;
           for (int offset = 0; offset < 9; ++offset) {
               const int peerRow = boxRow + offset / 3;
               const int peerCol = boxCol + offset % 3;
               if ((peerRow != row || peerCol != col) &&
                   board[peerRow][peerCol] == digit) {
                   return true;
               }
           }
           return false;
       }

       bool checkEveryCell(const std::vector<std::vector<char>>& board) {
           for (int row = 0; row < 9; ++row) {
               for (int col = 0; col < 9; ++col) {
                   if (board[row][col] != '.' && conflictsWithPeers(board, row, col)) {
                       return false;
                   }
               }
           }
           return true;
       }

       bool booleanTables(const std::vector<std::vector<char>>& board) {
           std::array<std::array<bool, 9>, 9> rows{};
           std::array<std::array<bool, 9>, 9> columns{};
           std::array<std::array<bool, 9>, 9> boxes{};

           for (int row = 0; row < 9; ++row) {
               for (int col = 0; col < 9; ++col) {
                   const char cell = board[row][col];
                   if (cell == '.') {
                       continue;
                   }
                   const int digit = cell - '1';
                   const int box = row / 3 * 3 + col / 3;
                   if (rows[row][digit] || columns[col][digit] || boxes[box][digit]) {
                       return false;
                   }
                   rows[row][digit] = true;
                   columns[col][digit] = true;
                   boxes[box][digit] = true;
               }
           }
           return true;
       }

       bool bitMasks(const std::vector<std::vector<char>>& board) {
           std::array<int, 9> rows{};
           std::array<int, 9> columns{};
           std::array<int, 9> boxes{};

           for (int row = 0; row < 9; ++row) {
               for (int col = 0; col < 9; ++col) {
                   const char cell = board[row][col];
                   if (cell == '.') {
                       continue;
                   }
                   const int bit = 1 << (cell - '1');
                   const int box = row / 3 * 3 + col / 3;
                   if ((rows[row] & bit) != 0 ||
                       (columns[col] & bit) != 0 ||
                       (boxes[box] & bit) != 0) {
                       return false;
                   }
                   rows[row] |= bit;
                   columns[col] |= bit;
                   boxes[box] |= bit;
               }
           }
           return true;
       }

   public:
       bool isValidSudoku(std::vector<std::vector<char>>& board) {
           return bitMasks(board);
       }
   };

题解
----

逐格验证
~~~~~~~~

最直接的方法是访问每个已填格子 ``(row, col)``，再扫描它所在的整行、整列和 ``3 x 3`` 宫，确认没有另一个
相同数字。``checkEveryCell`` 完全按照题目定义工作，只要某个数字在任一所属区域中出现第二次，棋盘就无效。

这种方法的问题是重复读取。同一行中的多个已填格子会反复扫描整行，同一列和同一宫也存在相同浪费。验证一个新
格子真正需要的信息不是全部同伴格子，而是三个所属区域已经出现过哪些数字。

区域数字集合
~~~~~~~~~~~~

每个已填格子唯一属于一行、一列和一个九宫格。扫描到数字 ``digit`` 时，只需查询三个集合：

* ``rows[row]``：当前行已经出现的数字；
* ``columns[col]``：当前列已经出现的数字；
* ``boxes[box]``：当前九宫格已经出现的数字。

数字若已存在于任一集合，就与此前格子发生冲突；三处都未出现时，同时登记到三个集合。这样每个格子只读取一次，
后续格子直接复用已登记的区域状态。

``booleanTables`` 为每个区域保存九个布尔值。数字字符 ``cell`` 转为下标 ``cell - '1'``，使数字 ``1`` 到 ``9``
分别映射到下标 ``0`` 到 ``8``。

九宫格映射
~~~~~~~~~~

整数除法 ``row / 3`` 得到宫格所在的大行，``col / 3`` 得到宫格所在的大列，二者都位于 ``0`` 到 ``2``。按行
展开后的九宫格编号为：

.. math::

   box=(row/3)\times3+col/3

因此左上宫映射为 ``0``，右下宫映射为 ``8``。同一 ``3 x 3`` 宫中的九个坐标会得到同一个 ``box``，可以共用
同一份数字集合。

单次扫描不变量
~~~~~~~~~~~~~~

处理任意格子前，三张表准确记录所有已扫描格子在各行、各列和各宫中出现过的数字。当前格子为空时跳过，不改变
状态；当前格子为数字时，先查询三个所属集合。

若某处已经登记该数字，当前格子就是该区域中的第二次出现，可以立即返回 ``false``。若三处都未登记，同时写入
三张表后，不变量继续成立。

任意违规都表现为同一数字在某个区域中至少出现两次。第一次出现会被登记，第二次出现一定触发冲突。扫描结束仍未
发现冲突，则每一行、每一列和每一宫中的已填数字都互不重复，正好满足题目对当前棋盘有效性的定义。算法不尝试
填写空格，也不会把尚未完成的合法局面误判为无效。

位掩码压缩
~~~~~~~~~~

每个区域只需表示九种数字是否出现，可以用一个整数的低九位代替九个布尔值。数字 ``cell`` 对应：

.. code-block:: text

   bit = 1 << (cell - '1')

``mask & bit`` 非零表示该数字已经出现，``mask |= bit`` 表示登记数字。``bitMasks`` 与布尔表保存完全相同的集合
状态，只是把九个布尔值压缩为一个整数。

例如先处理 ``board[0][0] = '4'`` 时，数字 ``4`` 对应位 ``1 << 3``，该位被写入 ``rows[0]``、
``columns[0]`` 和 ``boxes[0]``。随后处理 ``board[2][2] = '4'`` 时，行表与列表没有冲突，但两格同属
``boxes[0]``，对应位已经存在，因此立即判定九宫格重复。

代码演进
~~~~~~~~

``checkEveryCell`` 每遇到一个数字都重新读取其全部同伴格子。``booleanTables`` 把重复读取压缩成三张区域数字表，
使每个已填格只查询和登记一次。

``bitMasks`` 保留相同的一次遍历结构，再把每组九个布尔值压缩为一个整数掩码。公开入口采用位掩码方法；布尔表
更直观，位掩码则是同一状态的紧凑实现。

复杂度分析
~~~~~~~~~~

棋盘固定为 ``9 x 9``，三种方法的时间和空间在题目范围内都可视为 ``O(1)``，但实际工作量不同。

若把棋盘边长推广为 ``n``，逐格方法对 ``n^2`` 个格子分别扫描行、列和宫，时间为 ``O(n^3)``；一次登记方法只
遍历棋盘，时间为 ``O(n^2)``。布尔表保存各行、列和宫的数字集合，需要 ``O(n^2)`` 个布尔状态；在固定九阶数独
中，位掩码只使用 27 个整数，因此为常量额外空间。
