0036. Valid Sudoku
==================

题目信息
--------

:题号: 0036
:难度: Medium
:主题: 矩阵、集合、约束验证、状态编码
:原题: `LeetCode 0036 <https://leetcode.com/problems/valid-sudoku/>`_
:访问状态: Available
:教学重点: 行列宫三类约束、只验证已填数字、固定范围状态压缩

题目重述
--------

给定一个 ``9 × 9`` 数独棋盘。每个格子要么是字符 ``'1'`` 至 ``'9'``，要么是空格标记
``'.'``。判断当前已填入的数字是否违反数独规则：同一行、同一列、同一个 ``3 × 3``
宫内不能出现重复数字。

本题只验证当前局面，不要求判断它是否一定能够补全，也不要求求出完整答案。

自建示例
--------

合法的未完成局面
~~~~~~~~~~~~~~~~

第一行含 ``5``、``3``，第二行含 ``6``，其余位置可以为空；只要三类区域内没有重复，
即返回 ``true``。

行内重复
~~~~~~~~

若第 0 行的两个不同格子都为 ``'7'``，返回 ``false``。

列内重复
~~~~~~~~

若第 1 列的两个不同格子都为 ``'4'``，即使它们位于不同宫，也返回 ``false``。

宫内重复
~~~~~~~~

若左上角 ``3 × 3`` 宫内出现两个 ``'9'``，即使它们不同行也不同列，仍返回 ``false``。

全空棋盘
~~~~~~~~

所有格子均为 ``'.'`` 时没有任何冲突，返回 ``true``。

问题抽象
--------

每个非空格子 ``(row, col)`` 同时属于三个约束集合：

* 第 ``row`` 行；
* 第 ``col`` 列；
* 编号为 ``(row / 3) * 3 + col / 3`` 的宫。

扫描一个数字时，只需检查该数字是否已经出现在这三个集合中的任意一个。若出现，当前局面
非法；否则把它登记到三个集合中并继续。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 三组布尔表或位掩码
     - ``O(81)``
     - ``O(1)``
     - 主解法；状态与三类约束直接对应
   * - 每遇到数字重新扫描所属行列宫
     - ``O(81 × 9)``
     - ``O(1)``
     - 可行但重复检查
   * - 字符串或通用哈希键
     - ``O(81)``
     - ``O(81)``
     - 写法灵活，固定小范围下不如布尔表清晰

主解法：三类固定布尔状态
------------------------

状态含义
~~~~~~~~

维护三个 ``9 × 9`` 布尔表：

* ``rows[r][d]``：数字 ``d + 1`` 是否已在第 ``r`` 行出现；
* ``cols[c][d]``：数字 ``d + 1`` 是否已在第 ``c`` 列出现；
* ``boxes[b][d]``：数字 ``d + 1`` 是否已在第 ``b`` 个宫出现。

宫编号公式为 ``b = (r / 3) * 3 + c / 3``。整数除法把行列压缩到 ``0..2`` 的宫坐标，
再映射为 ``0..8`` 的一维编号。

核心不变量
~~~~~~~~~~

扫描到格子 ``(r, c)`` 之前，三个状态表准确记录所有已扫描非空格子。若当前数字在任一对应
状态中已经为真，就找到了同一区域内更早出现的相同数字。若三项均为假，登记后不变量继续成立。

正确性依据
~~~~~~~~~~

若算法返回 ``false``，当前数字在同行、同列或同宫的状态中已经出现，因此确实存在一对违反
规则的相同数字。

若算法扫描完成后返回 ``true``，每个非空数字登记时都未与此前同区域数字冲突。任取两个位于
同一区域的相同数字，后扫描的那个必然会检测到先扫描者，产生矛盾。因此不存在任何违规重复。

复杂度
~~~~~~

棋盘固定为 81 个格子，每格执行常数次操作，时间复杂度为 ``O(81)``，通常写作 ``O(1)``；
三个固定大小状态表占用 ``O(1)`` 额外空间。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>

   bool isValidSudoku(char **board, int boardSize, int *boardColSize) {
       bool rows[9][9] = {{false}};
       bool cols[9][9] = {{false}};
       bool boxes[9][9] = {{false}};

       (void)boardSize;
       (void)boardColSize; /* 题目保证固定 9 × 9。 */

       for (int r = 0; r < 9; ++r) {
           for (int c = 0; c < 9; ++c) {
               char ch = board[r][c];
               if (ch == '.') continue;

               int d = ch - '1';
               int b = (r / 3) * 3 + c / 3;
               if (rows[r][d] || cols[c][d] || boxes[b][d]) return false;
               rows[r][d] = cols[c][d] = boxes[b][d] = true;
           }
       }
       return true;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       bool isValidSudoku(vector<vector<char>>& board) {
           bool rows[9][9]{};
           bool cols[9][9]{};
           bool boxes[9][9]{};

           for (int r = 0; r < 9; ++r) {
               for (int c = 0; c < 9; ++c) {
                   char ch = board[r][c];
                   if (ch == '.') continue;
                   int d = ch - '1';
                   int b = (r / 3) * 3 + c / 3;
                   if (rows[r][d] || cols[c][d] || boxes[b][d]) return false;
                   rows[r][d] = cols[c][d] = boxes[b][d] = true;
               }
           }
           return true;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isValidSudoku(self, board: list[list[str]]) -> bool:
           rows = [[False] * 9 for _ in range(9)]
           cols = [[False] * 9 for _ in range(9)]
           boxes = [[False] * 9 for _ in range(9)]

           for r in range(9):
               for c in range(9):
                   ch = board[r][c]
                   if ch == ".":
                       continue
                   digit = ord(ch) - ord("1")
                   box = (r // 3) * 3 + c // 3
                   if rows[r][digit] or cols[c][digit] or boxes[box][digit]:
                       return False
                   rows[r][digit] = cols[c][digit] = boxes[box][digit] = True
           return True

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isValidSudoku(char[][] board) {
           boolean[][] rows = new boolean[9][9];
           boolean[][] cols = new boolean[9][9];
           boolean[][] boxes = new boolean[9][9];

           for (int r = 0; r < 9; r++) {
               for (int c = 0; c < 9; c++) {
                   char ch = board[r][c];
                   if (ch == '.') continue;
                   int d = ch - '1';
                   int b = (r / 3) * 3 + c / 3;
                   if (rows[r][d] || cols[c][d] || boxes[b][d]) return false;
                   rows[r][d] = cols[c][d] = boxes[b][d] = true;
               }
           }
           return true;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_valid_sudoku(board: Vec<Vec<char>>) -> bool {
           let mut rows = [[false; 9]; 9];
           let mut cols = [[false; 9]; 9];
           let mut boxes = [[false; 9]; 9];

           for r in 0..9 {
               for c in 0..9 {
                   let ch = board[r][c];
                   if ch == '.' { continue; }
                   let d = ch as usize - '1' as usize;
                   let b = (r / 3) * 3 + c / 3;
                   if rows[r][d] || cols[c][d] || boxes[b][d] { return false; }
                   rows[r][d] = true;
                   cols[c][d] = true;
                   boxes[b][d] = true;
               }
           }
           true
       }
   }

Go
~~

.. code-block:: go

   func isValidSudoku(board [][]byte) bool {
       var rows, cols, boxes [9][9]bool
       for r := 0; r < 9; r++ {
           for c := 0; c < 9; c++ {
               ch := board[r][c]
               if ch == '.' { continue }
               d := int(ch - '1')
               b := (r/3)*3 + c/3
               if rows[r][d] || cols[c][d] || boxes[b][d] { return false }
               rows[r][d], cols[c][d], boxes[b][d] = true, true, true
           }
       }
       return true
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isValidSudoku(board: string[][]): boolean {
       const rows = Array.from({ length: 9 }, () => Array(9).fill(false));
       const cols = Array.from({ length: 9 }, () => Array(9).fill(false));
       const boxes = Array.from({ length: 9 }, () => Array(9).fill(false));

       for (let r = 0; r < 9; r++) {
           for (let c = 0; c < 9; c++) {
               const ch = board[r][c];
               if (ch === ".") continue;
               const d = ch.charCodeAt(0) - "1".charCodeAt(0);
               const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
               if (rows[r][d] || cols[c][d] || boxes[b][d]) return false;
               rows[r][d] = cols[c][d] = boxes[b][d] = true;
           }
       }
       return true;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsValidSudoku(char[][] board) {
           var rows = new bool[9, 9];
           var cols = new bool[9, 9];
           var boxes = new bool[9, 9];
           for (int r = 0; r < 9; r++) {
               for (int c = 0; c < 9; c++) {
                   char ch = board[r][c];
                   if (ch == '.') continue;
                   int d = ch - '1';
                   int b = (r / 3) * 3 + c / 3;
                   if (rows[r,d] || cols[c,d] || boxes[b,d]) return false;
                   rows[r,d] = cols[c,d] = boxes[b,d] = true;
               }
           }
           return true;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function isValidSudoku(board::Vector{Vector{Char}})::Bool
       rows = falses(9, 9)
       cols = falses(9, 9)
       boxes = falses(9, 9)
       for r in 1:9, c in 1:9
           ch = board[r][c]
           ch == '.' && continue
           d = Int(ch - '0')             # 数字 1..9 可直接作为一基列号。
           b = div(r - 1, 3) * 3 + div(c - 1, 3) + 1
           (rows[r,d] || cols[c,d] || boxes[b,d]) && return false
           rows[r,d] = cols[c,d] = boxes[b,d] = true
       end
       return true
   end

R
~

.. code-block:: r

   isValidSudoku <- function(board) {
     rows <- matrix(FALSE, 9, 9)
     cols <- matrix(FALSE, 9, 9)
     boxes <- matrix(FALSE, 9, 9)
     for (r in 1:9) for (c in 1:9) {
       ch <- board[[r]][c]
       if (ch == ".") next
       d <- as.integer(ch)               # R 矩阵使用一基索引，数字可直接作列号。
       b <- ((r - 1) %/% 3) * 3 + ((c - 1) %/% 3) + 1
       if (rows[r,d] || cols[c,d] || boxes[b,d]) return(FALSE)
       rows[r,d] <- cols[c,d] <- boxes[b,d] <- TRUE
     }
     TRUE
   }

关键边界与易错点
----------------

* ``'.'`` 不属于数字，不能登记到状态表；多个空格互不冲突。
* 本题不检查可解性；一个无重复的残缺棋盘仍可能没有完整解。
* 数字下标应由 ``'1'`` 映射到 0，不能用 ``'0'`` 作为布尔表偏移基准。
* 宫编号必须同时使用行宫坐标和列宫坐标。
* Julia 与 R 的容器是一基索引，宫编号和数字槽位需要加 1。

新增与强化知识
--------------

* 新增：把一个格子同时投影到行、列、宫三组约束状态。
* 新增：固定小值域可用布尔表或位掩码替代通用哈希集合。
* 强化：扫描不变量——状态只描述已经处理的前缀。

关联题目
--------

* `0037. Sudoku Solver <0037-sudoku-solver.rst>`_：在同一约束状态上加入选择、递归和撤销。

最小自检
--------

#. 为什么仅检查当前数字对应的三个状态就足够？
#. 宫编号公式如何保证同一个 ``3 × 3`` 宫得到相同编号？
#. 一个无重复局面是否一定可解？

答案要点
~~~~~~~~

#. 数独的全部局部规则正是行、列、宫三类唯一性约束。
#. 行列分别整除 3 得到宫坐标，再按行优先映射到 ``0..8``。
#. 不一定；本题只验证当前重复冲突，不证明存在完整解。
