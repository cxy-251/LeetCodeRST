0037. Sudoku Solver
===================

题目信息
--------

:题号: 0037
:难度: Hard
:主题: 回溯、约束传播、位掩码、最少候选优先
:原题: `LeetCode 0037 <https://leetcode.com/problems/sudoku-solver/>`_
:访问状态: Available
:教学重点: 约束状态、候选集合、递归选择与撤销、MRV 剪枝、可变状态作用域

题目重述
--------

给定一个合法的 ``9 × 9`` 数独棋盘，其中 ``'.'`` 表示空格。需要原地填入字符 ``'1'``
至 ``'9'``，使每一行、每一列和每个 ``3 × 3`` 宫都恰好包含数字 1 至 9。题目保证存在
唯一解。

自建示例
--------

单空格
~~~~~~

若某一行已经包含 1 至 8，唯一空格所在列和宫也允许 9，则该格直接填入 ``'9'``。

需要回退的局面
~~~~~~~~~~~~~~

某个空格可能暂时允许 ``2`` 或 ``6``。先填 ``2`` 后，后续某格没有候选，算法必须撤销
``2``，恢复行、列、宫状态，再尝试 ``6``。

接近完成的棋盘
~~~~~~~~~~~~~~

只有几个空格时，候选集合通常很小。优先处理候选最少的格子可显著减少分支。

问题抽象
--------

0036 只回答“当前局面是否冲突”。本题需要在同一约束模型上搜索完整赋值：

* 每个空格是一个待赋值变量；
* 候选数字由所在行、列、宫尚未使用的数字共同决定；
* 选择一个候选后更新三类约束；
* 若后续无解，撤销选择并尝试其他候选。

数字范围固定为 1 至 9，可以用一个 9 位整数表示集合。第 ``d`` 位为 1 表示数字
``d + 1`` 已被占用。空格 ``(r, c)`` 的候选集合为：

.. code-block:: text

   used = rows[r] | cols[c] | boxes[box]
   candidates = (~used) & 0b1_1111_1111

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 位掩码回溯 + MRV
     - 最坏 ``O(9^E)``
     - ``O(E)`` 递归栈
     - 主解法；约束检查为常数时间，剪枝强
   * - 固定顺序逐格回溯
     - 最坏 ``O(9^E)``
     - ``O(E)``
     - 实现较短，困难局面可能产生大量无效分支
   * - 精确覆盖 / Algorithm X
     - 取决于搜索树
     - 较高
     - 通用而强大，超出当前教学主线

主解法：位掩码回溯与 MRV
-------------------------

状态含义
~~~~~~~~

维护：

* ``rows[r]``：第 ``r`` 行已经使用的数字位集合；
* ``cols[c]``：第 ``c`` 列已经使用的数字位集合；
* ``boxes[b]``：第 ``b`` 个宫已经使用的数字位集合；
* 棋盘本身：已确定字符和未填入的 ``'.'``。

宫编号为 ``(r / 3) * 3 + c / 3``，不同语言根据零基或一基索引调整。

最少候选优先
~~~~~~~~~~~~

每层递归扫描所有剩余空格，选择候选数量最少的格子。该策略称为 MRV
（Minimum Remaining Values，最少剩余值）：

* 候选为 0：当前分支立即失败；
* 候选为 1：形成强制选择；
* 候选越少，越早暴露冲突，搜索树通常越小。

最低位提取
~~~~~~~~~~

候选掩码中的每个 1 代表一个数字。表达式 ``mask & -mask`` 可以提取最低位的 1，尝试后
再用异或从候选集合中删除该位。位的位置就是数字减一。

选择与撤销
~~~~~~~~~~

尝试某一位 ``bit`` 时：

#. 把对应数字写入棋盘；
#. 将 ``bit`` 加入行、列、宫掩码；
#. 递归处理剩余空格；
#. 若递归失败，从三个掩码删除 ``bit``，并把棋盘恢复为 ``'.'``。

因为该位在进入当前递归前一定未被使用，所以加入可以用按位或，撤销可以用按位异或。

核心不变量
~~~~~~~~~~

每次递归开始时：

* 棋盘中所有已填格子满足行、列、宫唯一性；
* 三组掩码与棋盘中的已填数字完全一致；
* 当前递归只负责为剩余空格寻找合法赋值；
* 返回失败前会撤销本层造成的全部修改。

正确性依据
~~~~~~~~~~

**安全性。** 每个候选位都不在对应行、列、宫的占用并集中，因此写入后不会产生重复。
递归始终保持三类唯一性约束。到达没有空格的状态时，81 个格子均已填入且无冲突，所以
得到合法数独解。

**完备性。** 对选中的空格，算法枚举其所有当前合法候选。任何完整解在该格上的数字必属于
这些候选之一。若某候选不能扩展为完整解，回溯后继续枚举下一候选。因此只要解存在，沿着
真实解中每个空格的数字形成的分支不会被遗漏。

**撤销正确性。** 本层只修改一个格子及其对应的三个掩码位。递归失败后恢复这四处状态，
父层看到的状态与尝试前完全相同，失败分支不会污染后续分支。

复杂度
~~~~~~

设初始空格数为 ``E``。最坏情况下每格最多尝试 9 个数字，时间复杂度上界为 ``O(9^E)``。
行列宫约束与 MRV 会大幅减少实际分支。每层扫描至多 81 个格子，这个固定因子不改变指数
上界。递归深度最多为 ``E``，三组掩码大小固定，额外空间复杂度为 ``O(E)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>

   static int popcount9(int value) {
       int count = 0;
       while (value != 0) {
           value &= value - 1;
           ++count;
       }
       return count;
   }

   static int trailing_index(int bit) {
       int index = 0;
       while ((1 << index) != bit) {
           ++index;
       }
       return index;
   }

   static bool solve(
       char **board,
       int rows[9],
       int cols[9],
       int boxes[9]
   ) {
       int best_r = -1;
       int best_c = -1;
       int best_mask = 0;
       int best_count = 10;
       const int full = (1 << 9) - 1;

       for (int r = 0; r < 9; ++r) {
           for (int c = 0; c < 9; ++c) {
               if (board[r][c] != '.') {
                   continue;
               }

               int box = (r / 3) * 3 + c / 3;
               int mask = full & ~(rows[r] | cols[c] | boxes[box]);
               int count = popcount9(mask);

               if (count == 0) {
                   return false;
               }
               if (count < best_count) {
                   best_r = r;
                   best_c = c;
                   best_mask = mask;
                   best_count = count;
               }
           }
       }

       if (best_r == -1) {
           return true;
       }

       int box = (best_r / 3) * 3 + best_c / 3;
       while (best_mask != 0) {
           int bit = best_mask & -best_mask;
           best_mask ^= bit;
           int digit = trailing_index(bit);

           board[best_r][best_c] = (char)('1' + digit);
           rows[best_r] |= bit;
           cols[best_c] |= bit;
           boxes[box] |= bit;

           if (solve(board, rows, cols, boxes)) {
               return true;
           }

           rows[best_r] ^= bit;
           cols[best_c] ^= bit;
           boxes[box] ^= bit;
           board[best_r][best_c] = '.';
       }

       return false;
   }

   void solveSudoku(char **board, int boardSize, int *boardColSize) {
       int rows[9] = {0};
       int cols[9] = {0};
       int boxes[9] = {0};

       (void)boardSize;
       (void)boardColSize;

       for (int r = 0; r < 9; ++r) {
           for (int c = 0; c < 9; ++c) {
               if (board[r][c] == '.') {
                   continue;
               }
               int bit = 1 << (board[r][c] - '1');
               int box = (r / 3) * 3 + c / 3;
               rows[r] |= bit;
               cols[c] |= bit;
               boxes[box] |= bit;
           }
       }

       solve(board, rows, cols, boxes);
   }

C++
~~~

.. code-block:: cpp

   class Solution {
       int rows[9]{};
       int cols[9]{};
       int boxes[9]{};

       bool dfs(vector<vector<char>>& board) {
           int bestRow = -1;
           int bestCol = -1;
           int bestMask = 0;
           int bestCount = 10;

           for (int row = 0; row < 9; ++row) {
               for (int col = 0; col < 9; ++col) {
                   if (board[row][col] != '.') {
                       continue;
                   }
                   int box = (row / 3) * 3 + col / 3;
                   int mask = 0x1FF &
                       ~(rows[row] | cols[col] | boxes[box]);
                   int count = __builtin_popcount(mask);
                   if (count == 0) {
                       return false;
                   }
                   if (count < bestCount) {
                       bestRow = row;
                       bestCol = col;
                       bestMask = mask;
                       bestCount = count;
                   }
               }
           }

           if (bestRow == -1) {
               return true;
           }

           int box = (bestRow / 3) * 3 + bestCol / 3;
           while (bestMask != 0) {
               int bit = bestMask & -bestMask;
               bestMask ^= bit;
               int digit = __builtin_ctz(bit);

               board[bestRow][bestCol] =
                   static_cast<char>('1' + digit);
               rows[bestRow] |= bit;
               cols[bestCol] |= bit;
               boxes[box] |= bit;

               if (dfs(board)) {
                   return true;
               }

               rows[bestRow] ^= bit;
               cols[bestCol] ^= bit;
               boxes[box] ^= bit;
               board[bestRow][bestCol] = '.';
           }

           return false;
       }

   public:
       void solveSudoku(vector<vector<char>>& board) {
           for (int row = 0; row < 9; ++row) {
               for (int col = 0; col < 9; ++col) {
                   if (board[row][col] == '.') {
                       continue;
                   }
                   int bit = 1 << (board[row][col] - '1');
                   int box = (row / 3) * 3 + col / 3;
                   rows[row] |= bit;
                   cols[col] |= bit;
                   boxes[box] |= bit;
               }
           }
           dfs(board);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def solveSudoku(self, board: list[list[str]]) -> None:
           rows = [0] * 9
           cols = [0] * 9
           boxes = [0] * 9

           for row in range(9):
               for col in range(9):
                   if board[row][col] == ".":
                       continue
                   bit = 1 << (ord(board[row][col]) - ord("1"))
                   box = (row // 3) * 3 + col // 3
                   rows[row] |= bit
                   cols[col] |= bit
                   boxes[box] |= bit

           def dfs() -> bool:
               best: tuple[int, int, int] | None = None
               best_count = 10

               for row in range(9):
                   for col in range(9):
                       if board[row][col] != ".":
                           continue
                       box = (row // 3) * 3 + col // 3
                       mask = 0x1FF & ~(
                           rows[row] | cols[col] | boxes[box]
                       )
                       count = mask.bit_count()
                       if count == 0:
                           return False
                       if count < best_count:
                           best = (row, col, mask)
                           best_count = count

               if best is None:
                   return True

               row, col, mask = best
               box = (row // 3) * 3 + col // 3

               while mask:
                   bit = mask & -mask
                   mask ^= bit
                   digit = bit.bit_length() - 1

                   board[row][col] = chr(ord("1") + digit)
                   rows[row] |= bit
                   cols[col] |= bit
                   boxes[box] |= bit

                   if dfs():
                       return True

                   rows[row] ^= bit
                   cols[col] ^= bit
                   boxes[box] ^= bit
                   board[row][col] = "."

               return False

           dfs()

Java
~~~~

.. code-block:: java

   class Solution {
       private final int[] rows = new int[9];
       private final int[] cols = new int[9];
       private final int[] boxes = new int[9];

       public void solveSudoku(char[][] board) {
           for (int row = 0; row < 9; row++) {
               for (int col = 0; col < 9; col++) {
                   if (board[row][col] == '.') {
                       continue;
                   }
                   int bit = 1 << (board[row][col] - '1');
                   int box = (row / 3) * 3 + col / 3;
                   rows[row] |= bit;
                   cols[col] |= bit;
                   boxes[box] |= bit;
               }
           }
           dfs(board);
       }

       private boolean dfs(char[][] board) {
           int bestRow = -1;
           int bestCol = -1;
           int bestMask = 0;
           int bestCount = 10;

           for (int row = 0; row < 9; row++) {
               for (int col = 0; col < 9; col++) {
                   if (board[row][col] != '.') {
                       continue;
                   }
                   int box = (row / 3) * 3 + col / 3;
                   int mask = 0x1FF &
                       ~(rows[row] | cols[col] | boxes[box]);
                   int count = Integer.bitCount(mask);
                   if (count == 0) {
                       return false;
                   }
                   if (count < bestCount) {
                       bestRow = row;
                       bestCol = col;
                       bestMask = mask;
                       bestCount = count;
                   }
               }
           }

           if (bestRow == -1) {
               return true;
           }

           int box = (bestRow / 3) * 3 + bestCol / 3;
           while (bestMask != 0) {
               int bit = bestMask & -bestMask;
               bestMask ^= bit;
               int digit = Integer.numberOfTrailingZeros(bit);

               board[bestRow][bestCol] = (char) ('1' + digit);
               rows[bestRow] |= bit;
               cols[bestCol] |= bit;
               boxes[box] |= bit;

               if (dfs(board)) {
                   return true;
               }

               rows[bestRow] ^= bit;
               cols[bestCol] ^= bit;
               boxes[box] ^= bit;
               board[bestRow][bestCol] = '.';
           }

           return false;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn solve_sudoku(board: &mut Vec<Vec<char>>) {
           let mut rows = [0u16; 9];
           let mut cols = [0u16; 9];
           let mut boxes = [0u16; 9];

           for row in 0..9 {
               for col in 0..9 {
                   if board[row][col] == '.' {
                       continue;
                   }
                   let digit = board[row][col] as u8 - b'1';
                   let bit = 1u16 << digit;
                   let box_index = (row / 3) * 3 + col / 3;
                   rows[row] |= bit;
                   cols[col] |= bit;
                   boxes[box_index] |= bit;
               }
           }

           fn dfs(
               board: &mut Vec<Vec<char>>,
               rows: &mut [u16; 9],
               cols: &mut [u16; 9],
               boxes: &mut [u16; 9],
           ) -> bool {
               let mut best: Option<(usize, usize, u16)> = None;
               let mut best_count = 10;

               for row in 0..9 {
                   for col in 0..9 {
                       if board[row][col] != '.' {
                           continue;
                       }
                       let box_index = (row / 3) * 3 + col / 3;
                       let mask = 0x1ffu16 &
                           !(rows[row] | cols[col] | boxes[box_index]);
                       let count = mask.count_ones();
                       if count == 0 {
                           return false;
                       }
                       if count < best_count {
                           best = Some((row, col, mask));
                           best_count = count;
                       }
                   }
               }

               let Some((row, col, mut mask)) = best else {
                   return true;
               };
               let box_index = (row / 3) * 3 + col / 3;

               while mask != 0 {
                   let bit = mask & mask.wrapping_neg();
                   mask ^= bit;
                   let digit = bit.trailing_zeros() as u8;

                   board[row][col] = (b'1' + digit) as char;
                   rows[row] |= bit;
                   cols[col] |= bit;
                   boxes[box_index] |= bit;

                   if dfs(board, rows, cols, boxes) {
                       return true;
                   }

                   rows[row] ^= bit;
                   cols[col] ^= bit;
                   boxes[box_index] ^= bit;
                   board[row][col] = '.';
               }

               false
           }

           dfs(board, &mut rows, &mut cols, &mut boxes);
       }
   }

Go
~~

.. code-block:: go

   func solveSudoku(board [][]byte) {
       rows := [9]int{}
       cols := [9]int{}
       boxes := [9]int{}

       for row := 0; row < 9; row++ {
           for col := 0; col < 9; col++ {
               if board[row][col] == '.' {
                   continue
               }
               bit := 1 << (board[row][col] - '1')
               box := (row/3)*3 + col/3
               rows[row] |= bit
               cols[col] |= bit
               boxes[box] |= bit
           }
       }

       var bitCount func(int) int
       bitCount = func(value int) int {
           count := 0
           for value != 0 {
               value &= value - 1
               count++
           }
           return count
       }

       var dfs func() bool
       dfs = func() bool {
           bestRow, bestCol := -1, -1
           bestMask, bestCount := 0, 10

           for row := 0; row < 9; row++ {
               for col := 0; col < 9; col++ {
                   if board[row][col] != '.' {
                       continue
                   }
                   box := (row/3)*3 + col/3
                   mask := 0x1ff & ^(rows[row] | cols[col] | boxes[box])
                   count := bitCount(mask)
                   if count == 0 {
                       return false
                   }
                   if count < bestCount {
                       bestRow, bestCol = row, col
                       bestMask, bestCount = mask, count
                   }
               }
           }

           if bestRow == -1 {
               return true
           }

           box := (bestRow/3)*3 + bestCol/3
           for bestMask != 0 {
               bit := bestMask & -bestMask
               bestMask ^= bit
               digit := 0
               for (1 << digit) != bit {
                   digit++
               }

               board[bestRow][bestCol] = byte('1' + digit)
               rows[bestRow] |= bit
               cols[bestCol] |= bit
               boxes[box] |= bit

               if dfs() {
                   return true
               }

               rows[bestRow] ^= bit
               cols[bestCol] ^= bit
               boxes[box] ^= bit
               board[bestRow][bestCol] = '.'
           }

           return false
       }

       dfs()
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function solveSudoku(board: string[][]): void {
       const rows = new Array<number>(9).fill(0);
       const cols = new Array<number>(9).fill(0);
       const boxes = new Array<number>(9).fill(0);

       for (let row = 0; row < 9; row++) {
           for (let col = 0; col < 9; col++) {
               if (board[row][col] === ".") {
                   continue;
               }
               const bit = 1 << (board[row][col].charCodeAt(0) - 49);
               const box = Math.floor(row / 3) * 3 +
                   Math.floor(col / 3);
               rows[row] |= bit;
               cols[col] |= bit;
               boxes[box] |= bit;
           }
       }

       const bitCount = (value: number): number => {
           let count = 0;
           while (value !== 0) {
               value &= value - 1;
               count++;
           }
           return count;
       };

       const dfs = (): boolean => {
           let bestRow = -1;
           let bestCol = -1;
           let bestMask = 0;
           let bestCount = 10;

           for (let row = 0; row < 9; row++) {
               for (let col = 0; col < 9; col++) {
                   if (board[row][col] !== ".") {
                       continue;
                   }
                   const box = Math.floor(row / 3) * 3 +
                       Math.floor(col / 3);
                   const mask = 0x1ff &
                       ~(rows[row] | cols[col] | boxes[box]);
                   const count = bitCount(mask);
                   if (count === 0) {
                       return false;
                   }
                   if (count < bestCount) {
                       bestRow = row;
                       bestCol = col;
                       bestMask = mask;
                       bestCount = count;
                   }
               }
           }

           if (bestRow === -1) {
               return true;
           }

           const box = Math.floor(bestRow / 3) * 3 +
               Math.floor(bestCol / 3);
           while (bestMask !== 0) {
               const bit = bestMask & -bestMask;
               bestMask ^= bit;
               const digit = 31 - Math.clz32(bit);

               board[bestRow][bestCol] = String(digit + 1);
               rows[bestRow] |= bit;
               cols[bestCol] |= bit;
               boxes[box] |= bit;

               if (dfs()) {
                   return true;
               }

               rows[bestRow] ^= bit;
               cols[bestCol] ^= bit;
               boxes[box] ^= bit;
               board[bestRow][bestCol] = ".";
           }

           return false;
       };

       dfs();
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       private readonly int[] rows = new int[9];
       private readonly int[] cols = new int[9];
       private readonly int[] boxes = new int[9];

       public void SolveSudoku(char[][] board) {
           for (int row = 0; row < 9; row++) {
               for (int col = 0; col < 9; col++) {
                   if (board[row][col] == '.') {
                       continue;
                   }
                   int bit = 1 << (board[row][col] - '1');
                   int box = (row / 3) * 3 + col / 3;
                   rows[row] |= bit;
                   cols[col] |= bit;
                   boxes[box] |= bit;
               }
           }
           Dfs(board);
       }

       private static int BitCount(int value) {
           int count = 0;
           while (value != 0) {
               value &= value - 1;
               count++;
           }
           return count;
       }

       private bool Dfs(char[][] board) {
           int bestRow = -1;
           int bestCol = -1;
           int bestMask = 0;
           int bestCount = 10;

           for (int row = 0; row < 9; row++) {
               for (int col = 0; col < 9; col++) {
                   if (board[row][col] != '.') {
                       continue;
                   }
                   int box = (row / 3) * 3 + col / 3;
                   int mask = 0x1FF &
                       ~(rows[row] | cols[col] | boxes[box]);
                   int count = BitCount(mask);
                   if (count == 0) {
                       return false;
                   }
                   if (count < bestCount) {
                       bestRow = row;
                       bestCol = col;
                       bestMask = mask;
                       bestCount = count;
                   }
               }
           }

           if (bestRow == -1) {
               return true;
           }

           int boxIndex = (bestRow / 3) * 3 + bestCol / 3;
           while (bestMask != 0) {
               int bit = bestMask & -bestMask;
               bestMask ^= bit;
               int digit = 0;
               while ((1 << digit) != bit) {
                   digit++;
               }

               board[bestRow][bestCol] = (char)('1' + digit);
               rows[bestRow] |= bit;
               cols[bestCol] |= bit;
               boxes[boxIndex] |= bit;

               if (Dfs(board)) {
                   return true;
               }

               rows[bestRow] ^= bit;
               cols[bestCol] ^= bit;
               boxes[boxIndex] ^= bit;
               board[bestRow][bestCol] = '.';
           }

           return false;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function solveSudoku(board::Vector{Vector{Char}})::Nothing
       rows = zeros(Int, 9)
       cols = zeros(Int, 9)
       boxes = zeros(Int, 9)

       for row in 1:9, col in 1:9
           board[row][col] == '.' && continue
           bit = 1 << Int(board[row][col] - '1')
           box = div(row - 1, 3) * 3 + div(col - 1, 3) + 1
           rows[row] |= bit
           cols[col] |= bit
           boxes[box] |= bit
       end

       function dfs()::Bool
           best_row = 0
           best_col = 0
           best_mask = 0
           best_count = 10

           for row in 1:9, col in 1:9
               board[row][col] == '.' || continue
               box = div(row - 1, 3) * 3 + div(col - 1, 3) + 1
               mask = 0x1ff & ~(rows[row] | cols[col] | boxes[box])
               count = count_ones(mask)
               count == 0 && return false
               if count < best_count
                   best_row = row
                   best_col = col
                   best_mask = mask
                   best_count = count
               end
           end

           best_row == 0 && return true
           box = div(best_row - 1, 3) * 3 +
               div(best_col - 1, 3) + 1

           while best_mask != 0
               bit = best_mask & -best_mask
               best_mask ⊻= bit
               digit = trailing_zeros(bit)

               board[best_row][best_col] = Char(Int('1') + digit)
               rows[best_row] |= bit
               cols[best_col] |= bit
               boxes[box] |= bit

               dfs() && return true

               rows[best_row] ⊻= bit
               cols[best_col] ⊻= bit
               boxes[box] ⊻= bit
               board[best_row][best_col] = '.'
           end

           false
       end

       dfs()
       nothing
   end

R
~

.. code-block:: r

   solve_sudoku <- function(board) {
     # environment 提供引用语义；递归层自己的选择变量仍使用局部 <-。
     state <- new.env(parent = emptyenv())
     state$board <- board
     state$rows <- integer(9)
     state$cols <- integer(9)
     state$boxes <- integer(9)

     for (row in 1:9) {
       for (col in 1:9) {
         if (state$board[[row]][col] == ".") {
           next
         }
         digit <- as.integer(state$board[[row]][col]) - 1L
         bit <- bitwShiftL(1L, digit)
         box <- ((row - 1L) %/% 3L) * 3L +
           ((col - 1L) %/% 3L) + 1L
         state$rows[row] <- bitwOr(state$rows[row], bit)
         state$cols[col] <- bitwOr(state$cols[col], bit)
         state$boxes[box] <- bitwOr(state$boxes[box], bit)
       }
     }

     bit_count <- function(value) {
       count <- 0L
       while (value != 0L) {
         value <- bitwAnd(value, value - 1L)
         count <- count + 1L
       }
       count
     }

     dfs <- function() {
       # 这些变量属于当前递归调用，不能使用 <<- 修改父调用。
       best_row <- 0L
       best_col <- 0L
       best_mask <- 0L
       best_count <- 10L

       for (row in 1:9) {
         for (col in 1:9) {
           if (state$board[[row]][col] != ".") {
             next
           }

           box <- ((row - 1L) %/% 3L) * 3L +
             ((col - 1L) %/% 3L) + 1L
           used <- bitwOr(
             bitwOr(state$rows[row], state$cols[col]),
             state$boxes[box]
           )
           mask <- bitwAnd(511L, bitwNot(used))
           count <- bit_count(mask)

           if (count == 0L) {
             return(FALSE)
           }
           if (count < best_count) {
             best_row <- row
             best_col <- col
             best_mask <- mask
             best_count <- count
           }
         }
       }

       if (best_row == 0L) {
         return(TRUE)
       }

       box <- ((best_row - 1L) %/% 3L) * 3L +
         ((best_col - 1L) %/% 3L) + 1L
       mask <- best_mask

       while (mask != 0L) {
         bit <- bitwAnd(mask, -mask)
         mask <- bitwXor(mask, bit)

         digit <- 0L
         probe <- bit
         while (probe > 1L) {
           probe <- bitwShiftR(probe, 1L)
           digit <- digit + 1L
         }

         row_values <- state$board[[best_row]]
         row_values[best_col] <- as.character(digit + 1L)
         state$board[[best_row]] <- row_values
         state$rows[best_row] <- bitwOr(state$rows[best_row], bit)
         state$cols[best_col] <- bitwOr(state$cols[best_col], bit)
         state$boxes[box] <- bitwOr(state$boxes[box], bit)

         if (dfs()) {
           return(TRUE)
         }

         state$rows[best_row] <- bitwXor(state$rows[best_row], bit)
         state$cols[best_col] <- bitwXor(state$cols[best_col], bit)
         state$boxes[box] <- bitwXor(state$boxes[box], bit)
         row_values <- state$board[[best_row]]
         row_values[best_col] <- "."
         state$board[[best_row]] <- row_values
       }

       FALSE
     }

     dfs()
     state$board
   }

R 版把真正需要跨递归层共享的棋盘和掩码放入 ``environment``。``best_row``、
``best_col``、``best_mask``、``best_count`` 属于每次 ``dfs`` 调用自身，使用普通 ``<-``。
这样子调用不会覆盖父调用正在枚举的格子和候选集合。

关键边界与易错点
----------------

* 初始化掩码时必须读取所有已填数字，空格不能登记；
* 候选集合必须限制到低 9 位，按位取反会产生更高位的 1；
* 写入棋盘、更新三个掩码、递归、撤销四个步骤必须成对出现；
* 找到完整解后要立即沿递归链返回，不能继续撤销已确认答案；
* MRV 只改变搜索顺序，不改变候选全集，因此不会损害完备性；
* R 中递归层的选择变量必须保持局部，只有显式可变状态应跨层共享。

新增与强化知识
--------------

新增
~~~~

* 9 位掩码表示固定数字集合，最低位提取为 ``mask & -mask``；
* MRV 用最少候选变量优先暴露矛盾；
* R 可用 ``environment`` 明确表达递归算法中的共享可变状态。

强化
~~~~

* 回溯的选择、递归、撤销必须保持状态可逆；
* 0036 的行列宫验证状态可以直接升级为求解器约束状态；
* 闭包中的局部搜索变量和跨层共享状态必须严格区分。

关联题目
--------

* `0036. Valid Sudoku <0036-valid-sudoku.rst>`_：只构建并验证三类约束，不执行搜索；
* `0022. Generate Parentheses <0022-generate-parentheses.rst>`_：较简单的合法前缀回溯。

最小自检
--------

#. 为什么候选掩码需要限制到低 9 位？
#. MRV 为什么通常比固定顺序更快？
#. 撤销时漏掉棋盘字符恢复会产生什么后果？
#. R 版为什么不能对 ``best_row`` 等递归局部变量使用 ``<<-``？
#. 题目保证唯一解是否是回溯正确性的必要条件？

答案要点
~~~~~~~~

#. 按位取反会把整数的其他位也变为 1，只有低 9 位代表数字 1 至 9；
#. 候选少的格子更容易形成强制选择或立即冲突，能提前剪掉大分支；
#. 后续分支会把失败候选当成已确定数字，棋盘和掩码状态不一致；
#. ``<<-`` 会向父环境查找并修改绑定，子调用可能覆盖父调用的选择状态；
#. 不是；存在至少一个解即可找到某个解，唯一性只保证最终答案确定。
