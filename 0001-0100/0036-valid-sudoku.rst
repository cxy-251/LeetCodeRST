0036. Valid Sudoku
==================

题目信息
--------

:题号: 0036
:难度: Medium
:主题: 矩阵、约束验证、集合、位掩码
:原题: `LeetCode 0036 <https://leetcode.com/problems/valid-sudoku/>`_
:重点: 行列宫三类约束、只验证已填数字、宫编号、固定范围状态压缩

题目重述
--------

给定固定 ``9 × 9`` 棋盘，格子为 ``'1'`` 至 ``'9'`` 或空格 ``'.'``。判断当前已填数字是否满足：同一行、同一列、同一 ``3 × 3`` 宫内均无重复。本题不要求判断棋盘能否最终解出。

自建示例
--------

.. code-block:: text

   (0,0) = '5'，(0,7) = '5'：同行重复，立即失败。
   (1,1) = '4'，(7,1) = '4'：同列重复，立即失败。
   (0,0) = '9'，(2,2) = '9'：同行列都不同，但同属左上宫，仍失败。

全空棋盘没有已填数字冲突，应返回 ``true``。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <vector>

   class Solution {
   private:
       bool repeatedScan(const std::vector<std::vector<char>>& board) {
           for (int r = 0; r < 9; ++r) {
               for (int c = 0; c < 9; ++c) {
                   char value = board[r][c];
                   if (value == '.') continue;
                   for (int k = c + 1; k < 9; ++k)
                       if (board[r][k] == value) return false;
                   for (int k = r + 1; k < 9; ++k)
                       if (board[k][c] == value) return false;
                   int box_r = r / 3 * 3, box_c = c / 3 * 3;
                   for (int rr = box_r; rr < box_r + 3; ++rr)
                       for (int cc = box_c; cc < box_c + 3; ++cc)
                           if ((rr > r || (rr == r && cc > c)) && board[rr][cc] == value) return false;
               }
           }
           return true;
       }

       bool booleanTables(const std::vector<std::vector<char>>& board) {
           bool rows[9][9]{}, cols[9][9]{}, boxes[9][9]{};
           for (int r = 0; r < 9; ++r) for (int c = 0; c < 9; ++c) {
               if (board[r][c] == '.') continue;
               int digit = board[r][c] - '1';
               int box = (r / 3) * 3 + c / 3;
               if (rows[r][digit] || cols[c][digit] || boxes[box][digit]) return false;
               rows[r][digit] = cols[c][digit] = boxes[box][digit] = true;
           }
           return true;
       }

       bool bitMasks(const std::vector<std::vector<char>>& board) {
           int rows[9]{}, cols[9]{}, boxes[9]{};
           for (int r = 0; r < 9; ++r) for (int c = 0; c < 9; ++c) {
               if (board[r][c] == '.') continue;
               int bit = 1 << (board[r][c] - '1');
               int box = (r / 3) * 3 + c / 3;
               if ((rows[r] & bit) || (cols[c] & bit) || (boxes[box] & bit)) return false;
               rows[r] |= bit; cols[c] |= bit; boxes[box] |= bit;
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

重复扫描浪费了哪些检查
~~~~~~~~~~~~~~~~~~~~~~

对每个数字重新扫描所属行、列、宫虽然正确，但同一对格子会被多次比较。扫描顺序已经提供了更直接的状态：只需记录每个区域此前出现过哪些数字，新格子到来时执行成员查询。

一个格子为什么同时属于三个约束集合
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

格子 ``(r,c)`` 属于第 ``r`` 行、第 ``c`` 列，以及宫：

.. math::

   box=(r\div3)\times3+(c\div3)

整数除法把行列坐标分别压缩到 ``0..2`` 的宫坐标，再映射到 ``0..8``。当前数字只要在三者任一状态中已经出现，就构成违规重复。

布尔表如何直接表达约束
~~~~~~~~~~~~~~~~~~~~~~

``rows[r][d]`` 表示数字 ``d+1`` 是否已在第 ``r`` 行出现；列和宫完全对称。扫描非空格时先查询三项，再同时登记三项。空格不代表数字，不参与任何状态。

位掩码如何压缩固定数字集合
~~~~~~~~~~~~~~~~~~~~~~~~~~

数字范围只有 1 至 9，可用 9 位整数表示集合。数字 ``d`` 对应位 ``1 << (d-1)``：

* ``mask & bit`` 非零表示已出现；
* ``mask | bit`` 登记出现。

三个长度为 9 的整数数组即可替代三组 ``9 × 9`` 布尔表，状态含义不变。

扫描状态
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 格子
     - 数字位
     - 查询状态
     - 动作
   * - ``(0,0)``
     - ``5`` 的位
     - 行列宫均未出现
     - 登记三处
   * - ``(0,7)``
     - ``5`` 的位
     - 第 0 行已经出现
     - 返回 ``false``

为什么一次扫描足以发现所有冲突
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若算法返回失败，当前数字在同行、同列或同宫的状态中已经存在，因此确实有更早格子与它冲突。反过来，若棋盘中存在任意一对同区域相同数字，后扫描的那个必然查询到先扫描者登记的位并失败。扫描结束仍未失败，说明所有三类区域都无重复。

当前合法不等于一定可解
~~~~~~~~~~~~~~~~~~~~~~

状态只验证“已经填入的数字没有直接违反规则”。某个无冲突局面仍可能没有完整解；判断或构造完整解需要第 37 题的回溯搜索。本题不能把“没有局部重复”扩大解释为“存在解”。

复杂度来源
~~~~~~~~~~

棋盘固定 81 格，每格执行常数次位运算，时间 ``O(81)``、空间 ``O(27)``，按输入规模通常写作 ``O(1)``。重复扫描仍是固定常数，但做了更多无意义比较。

九语言实现
----------

C
~

.. code-block:: c

   bool isValidSudoku(char **board, int boardSize, int *boardColSize) {
       int rows[9] = {0}, cols[9] = {0}, boxes[9] = {0};
       (void)boardSize; (void)boardColSize;
       for (int r = 0; r < 9; ++r) for (int c = 0; c < 9; ++c) {
           char ch = board[r][c]; if (ch == '.') continue;
           int bit = 1 << (ch - '1'), box = (r / 3) * 3 + c / 3;
           if ((rows[r] & bit) || (cols[c] & bit) || (boxes[box] & bit)) return false;
           rows[r] |= bit; cols[c] |= bit; boxes[box] |= bit;
       }
       return true;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isValidSudoku(self, board: list[list[str]]) -> bool:
           rows, cols, boxes = [0] * 9, [0] * 9, [0] * 9
           for r in range(9):
               for c in range(9):
                   if board[r][c] == ".":
                       continue
                   bit = 1 << (ord(board[r][c]) - ord("1"))
                   box = (r // 3) * 3 + c // 3
                   if rows[r] & bit or cols[c] & bit or boxes[box] & bit:
                       return False
                   rows[r] |= bit; cols[c] |= bit; boxes[box] |= bit
           return True

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isValidSudoku(char[][] board) {
           int[] rows = new int[9], cols = new int[9], boxes = new int[9];
           for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
               char ch = board[r][c]; if (ch == '.') continue;
               int bit = 1 << (ch - '1'), box = (r / 3) * 3 + c / 3;
               if ((rows[r] & bit) != 0 || (cols[c] & bit) != 0 || (boxes[box] & bit) != 0) return false;
               rows[r] |= bit; cols[c] |= bit; boxes[box] |= bit;
           }
           return true;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_valid_sudoku(board: Vec<Vec<char>>) -> bool {
           let (mut rows, mut cols, mut boxes) = ([0u16; 9], [0u16; 9], [0u16; 9]);
           for r in 0..9 { for c in 0..9 {
               let ch = board[r][c]; if ch == '.' { continue; }
               let bit = 1u16 << (ch as u8 - b'1'); let b = (r / 3) * 3 + c / 3;
               if rows[r] & bit != 0 || cols[c] & bit != 0 || boxes[b] & bit != 0 { return false; }
               rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
           }}
           true
       }
   }

Go
~~

.. code-block:: go

   func isValidSudoku(board [][]byte) bool {
       rows, cols, boxes := [9]int{}, [9]int{}, [9]int{}
       for r := 0; r < 9; r++ { for c := 0; c < 9; c++ {
           ch := board[r][c]; if ch == '.' { continue }
           bit, box := 1<<int(ch-'1'), (r/3)*3+c/3
           if rows[r]&bit != 0 || cols[c]&bit != 0 || boxes[box]&bit != 0 { return false }
           rows[r] |= bit; cols[c] |= bit; boxes[box] |= bit
       }}
       return true
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isValidSudoku(board: string[][]): boolean {
       const rows = Array(9).fill(0), cols = Array(9).fill(0), boxes = Array(9).fill(0);
       for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
           const ch = board[r][c]; if (ch === ".") continue;
           const bit = 1 << (ch.charCodeAt(0) - 49), box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
           if ((rows[r] & bit) || (cols[c] & bit) || (boxes[box] & bit)) return false;
           rows[r] |= bit; cols[c] |= bit; boxes[box] |= bit;
       }
       return true;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsValidSudoku(char[][] board) {
           int[] rows = new int[9], cols = new int[9], boxes = new int[9];
           for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
               char ch = board[r][c]; if (ch == '.') continue;
               int bit = 1 << (ch - '1'), box = (r / 3) * 3 + c / 3;
               if ((rows[r] & bit) != 0 || (cols[c] & bit) != 0 || (boxes[box] & bit) != 0) return false;
               rows[r] |= bit; cols[c] |= bit; boxes[box] |= bit;
           }
           return true;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function is_valid_sudoku(board::Vector{Vector{Char}})
       rows = zeros(Int, 9); cols = zeros(Int, 9); boxes = zeros(Int, 9)
       for r in 1:9, c in 1:9
           ch = board[r][c]; ch == '.' && continue
           bit = 1 << (Int(ch) - Int('1')); box = ((r - 1) ÷ 3) * 3 + (c - 1) ÷ 3 + 1
           (rows[r] & bit != 0 || cols[c] & bit != 0 || boxes[box] & bit != 0) && return false
           rows[r] |= bit; cols[c] |= bit; boxes[box] |= bit
       end
       true
   end

R
~

.. code-block:: r

   is_valid_sudoku <- function(board) {
     rows <- integer(9); cols <- integer(9); boxes <- integer(9)
     for (r in 1:9) for (c in 1:9) {
       ch <- board[[r]][[c]]; if (ch == ".") next
       digit <- match(ch, as.character(1:9)) - 1L
       bit <- bitwShiftL(1L, digit); box <- ((r - 1L) %/% 3L) * 3L + (c - 1L) %/% 3L + 1L
       if (bitwAnd(rows[[r]], bit) != 0L || bitwAnd(cols[[c]], bit) != 0L || bitwAnd(boxes[[box]], bit) != 0L) return(FALSE)
       rows[[r]] <- bitwOr(rows[[r]], bit); cols[[c]] <- bitwOr(cols[[c]], bit); boxes[[box]] <- bitwOr(boxes[[box]], bit)
     }
     TRUE
   }