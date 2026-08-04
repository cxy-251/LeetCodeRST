0036. Valid Sudoku
==================

题目信息
--------

:题号: 0036
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

逐格检查如何直接对应规则
~~~~~~~~~~~~~~~~~~~~~~~~

最直接的做法是访问每个已填格子 ``(row, col)``，再分别扫描它所在的整行、整列和 ``3 x 3`` 宫，确认没有另一个
相同数字。``checkEveryCell`` 完全按照题目定义工作：只要某个数字在任一所属区域中出现第二次，棋盘就无效。

这种方法容易验证正确，但同一片区域会被反复读取。例如一行有七个已填数字时，这一行会被七个格子各扫描一次；同一
列和同一宫也存在相同重复。真正需要保存的不是所有同伴格子，而是“每个区域已经出现过哪些数字”。

一次遍历需要维护三类状态
~~~~~~~~~~~~~~~~~~~~~~~~

每个已填格子唯一属于一行、一列和一个九宫格。扫描到数字 ``digit`` 时，只需查询三个集合：

* ``rows[row]``：当前行已经出现的数字；
* ``columns[col]``：当前列已经出现的数字；
* ``boxes[box]``：当前九宫格已经出现的数字。

只要数字已存在于任一集合，就发现冲突并返回 ``false``；否则同时写入三个集合。这样每个格子只处理一次，之后的
格子直接复用此前登记的结果。

九宫格编号如何由坐标得到
~~~~~~~~~~~~~~~~~~~~~~~~

整数除法 ``row / 3`` 得到宫格所在的大行，``col / 3`` 得到宫格所在的大列，二者都位于 ``0`` 到 ``2``。按行
展开后，九宫格编号为：

.. math::

   box=(row/3)\times3+col/3

例如 ``(0, 0)``、``(1, 2)`` 和 ``(2, 1)`` 都映射到宫格 ``0``；``(8, 8)`` 映射到宫格 ``8``。

布尔表如何保证三类唯一性
~~~~~~~~~~~~~~~~~~~~~~~~

``booleanTables`` 为每个区域保存九个布尔值。数字字符 ``cell`` 转为下标 ``cell - '1'``，因此数字 ``1`` 到 ``9``
分别对应下标 ``0`` 到 ``8``。

处理某个数字前，三张表描述所有此前扫描格子的状态。若对应布尔值已经为 ``true``，说明当前数字与此前某格处于同一
行、同一列或同一宫；若三处都为 ``false``，登记后不变量继续成立：每张表准确记录已扫描区域中的数字集合。

位掩码如何压缩九个布尔值
~~~~~~~~~~~~~~~~~~~~~~~~

每个区域只需表示九种数字是否出现，可以用一个整数的低九位代替九个布尔值。数字 ``cell`` 对应：

.. code-block:: text

   bit = 1 << (cell - '1')

检查 ``mask & bit`` 是否非零即可判断重复，使用 ``mask |= bit`` 完成登记。``bitMasks`` 与布尔表保存完全相同的
信息，只是把集合压缩为整数，并让查询与写入都变为一次位运算。

状态演化
~~~~~~~~

先处理 ``board[0][0] = '4'`` 时，数字 ``4`` 对应位 ``1 << 3``，该位被写入 ``rows[0]``、``columns[0]`` 和
``boxes[0]``。

随后处理 ``board[2][2] = '4'``：``rows[2]`` 与 ``columns[2]`` 中尚未出现数字 ``4``，但该格仍属于
``boxes[0]``，对应位已经为 ``1``，因此立即判定九宫格重复。

为什么扫描结束就足以判定有效
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任意违规都表现为同一数字在某个区域中至少出现两次。第一次出现时算法登记该数字；第二次进入同一区域时，相应集合
已经包含它，冲突一定被发现。

反过来，若全部格子处理结束仍未发现冲突，则每一行、每一列和每一宫中的已填数字都互不重复，正好满足题目对“当前
棋盘有效”的定义。算法没有尝试填写空格，因此不会把“暂时无法证明可解”误判为无效。

代码演进
~~~~~~~~

``checkEveryCell`` 保存的是棋盘本身，每遇到一个数字都重新读取其全部同伴格子。``booleanTables`` 把这些重复读取
压缩成三张区域数字表，使每个已填格只查询和登记一次。

``bitMasks`` 保留同样的一次遍历结构，再把每组九个布尔值压缩为一个整数掩码。公开入口采用位掩码方法；布尔表更
直观，适合先理解状态含义，位掩码则是该状态的紧凑实现。

复杂度分析
~~~~~~~~~~

棋盘固定为 ``9 x 9``，三种方法的时间和空间在题目范围内都可视为 ``O(1)``，但实际工作量不同。

若把棋盘边长推广为 ``n``，逐格方法对 ``n^2`` 个格子分别扫描行、列和宫，时间为 ``O(n^3)``；一次登记方法只
遍历棋盘，时间为 ``O(n^2)``。布尔表保存各行、列和宫的数字集合，需要 ``O(n^2)`` 个布尔状态；在数字集合能装入
一个机器字的固定九阶数独中，位掩码只使用 27 个整数，因此为常量额外空间。
