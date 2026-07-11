0037. Sudoku Solver
===================

题目信息
--------

:题号: 0037
:难度: Hard
:主题: 回溯、约束传播、位掩码、最少候选优先
:原题: `LeetCode 0037 <https://leetcode.com/problems/sudoku-solver/>`_
:访问状态: Available
:教学重点: 约束状态、候选集合、递归选择与撤销、MRV 剪枝

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
``2``，恢复行列宫状态，再尝试 ``6``。

接近完成的棋盘
~~~~~~~~~~~~~~

只有几个空格时，候选集合通常很小。优先处理候选最少的格子可显著减少分支。

问题抽象
--------

0036 只回答“当前局面是否冲突”。本题需要在同一约束模型上搜索完整赋值：

* 每个空格是一个待赋值变量；
* 候选数字由所在行、列、宫尚未使用的数字共同决定；
* 选择一个候选后更新三类约束；
* 若后续无解，撤销该选择并尝试其他候选。

数字范围固定为 1 至 9，可用 9 位整数表示集合。第 ``d`` 位为 1 表示数字 ``d + 1``
已经被占用。可用候选为三类占用掩码并集的按位取反，再限制到低 9 位。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 位掩码回溯 + 最少候选优先
     - 最坏 ``O(9^E)``
     - ``O(E)`` 递归栈
     - 主解法；约束检查为常数时间，剪枝强
   * - 按固定顺序逐格回溯
     - 最坏 ``O(9^E)``
     - ``O(E)``
     - 实现更短，容易在困难局面产生大量无效分支
   * - 精确覆盖 / Algorithm X
     - 取决于搜索树
     - 较高
     - 通用而强大，超出本题当前教学主线

主解法：位掩码回溯与 MRV
-------------------------

状态含义
~~~~~~~~

维护：

* ``rows[r]``：第 ``r`` 行已经使用的数字位集合；
* ``cols[c]``：第 ``c`` 列已经使用的数字位集合；
* ``boxes[b]``：第 ``b`` 个宫已经使用的数字位集合；
* 棋盘本身：已经确定的字符与尚未填入的 ``'.'``。

对空格 ``(r, c)``：

.. code-block:: text

   used = rows[r] | cols[c] | boxes[b]
   candidates = (~used) & 0b1_1111_1111

``candidates`` 中每个最低位 1 对应一个合法数字。

最少候选优先
~~~~~~~~~~~~

每层递归扫描所有剩余空格，选择候选数量最少的格子。该策略称为 MRV
（Minimum Remaining Values，最少剩余值）：

* 候选为 0：当前分支立即失败；
* 候选为 1：形成强制选择；
* 候选越少，越早暴露冲突，搜索树通常越小。

选择与撤销
~~~~~~~~~~

尝试某一位 ``bit`` 时：

#. 把对应数字写入棋盘；
#. 将 ``bit`` 加入行、列、宫掩码；
#. 递归处理剩余空格；
#. 若递归失败，从三个掩码删除 ``bit``，并把棋盘恢复为 ``'.'``。

因为该位在进入当前递归前一定未被使用，所以加入可用按位或，撤销可用按位异或或按位与非。

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
递归始终保持三类唯一性约束。到达没有空格的状态时，81 个格子均已填入且无冲突，因此得到
合法数独解。

**完备性。** 对选中的空格，算法枚举其所有当前合法候选。任何完整解在该格上的数字必属于
这些候选之一。若某候选不能扩展为完整解，回溯后继续枚举下一候选。因此只要解存在，沿着
解中每个空格的真实数字形成的分支不会被遗漏。

**撤销正确性。** 本层只修改一个格子及其对应的三个掩码位。递归失败后恢复这四处状态，父层
看到的状态与尝试前完全相同，不会让失败分支污染后续分支。

复杂度
~~~~~~

设初始空格数为 ``E``。最坏情况下每格最多尝试 9 个数字，时间复杂度上界为 ``O(9^E)``。
行列宫约束与 MRV 会大幅减少实际分支。每层扫描至多 81 个格子，这一固定因子不改变指数上界。
递归深度最多 ``E``，三组掩码固定大小，额外空间为 ``O(E)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>

   static int popcount9(int x) {
       int count = 0;
       while (x) {
           x &= x - 1;
           ++count;
       }
       return count;
   }

   static bool solve(char **board, int rows[9], int cols[9], int boxes[9]) {
       int best_r = -1, best_c = -1, best_mask = 0, best_count = 10;
       const int full = (1 << 9) - 1;

       for (int r = 0; r < 9; ++r) {
           for (int c = 0; c < 9; ++c) {
               if (board[r][c] != '.') continue;
               int b = (r / 3) * 3 + c / 3;
               int mask = full & ~(rows[r] | cols[c] | boxes[b]);
               int count = popcount9(mask);
               if (count == 0) return false;
               if (count < best_count) {
                   best_r = r; best_c = c; best_mask = mask; best_count = count;
                   if (count == 1) goto selected;
               }
           }
       }

   selected:
       if (best_r == -1) return true;
       int b = (best_r / 3) * 3 + best_c / 3;
       while (best_mask) {
           int bit = best_mask & -best_mask;
           best_mask ^= bit;
           int d = 0;
           while ((1 << d) != bit) ++d;

           board[best_r][best_c] = (char)('1' + d);
           rows[best_r] |= bit; cols[best_c] |= bit; boxes[b] |= bit;
           if (solve(board, rows, cols, boxes)) return true;
           rows[best_r] ^= bit; cols[best_c] ^= bit; boxes[b] ^= bit;
           board[best_r][best_c] = '.';
       }
       return false;
   }

   void solveSudoku(char **board, int boardSize, int *boardColSize) {
       int rows[9] = {0}, cols[9] = {0}, boxes[9] = {0};
       (void)boardSize;
       (void)boardColSize;
       for (int r = 0; r < 9; ++r) {
           for (int c = 0; c < 9; ++c) {
               if (board[r][c] == '.') continue;
               int bit = 1 << (board[r][c] - '1');
               int b = (r / 3) * 3 + c / 3;
               rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
           }
       }
       solve(board, rows, cols, boxes);
   }

C++
~~~

.. code-block:: cpp

   class Solution {
       int rows[9]{}, cols[9]{}, boxes[9]{};

       bool dfs(vector<vector<char>>& board) {
           int br = -1, bc = -1, mask = 0, best = 10;
           for (int r = 0; r < 9; ++r) {
               for (int c = 0; c < 9; ++c) {
                   if (board[r][c] != '.') continue;
                   int b = (r / 3) * 3 + c / 3;
                   int current = 0x1FF & ~(rows[r] | cols[c] | boxes[b]);
                   int count = __builtin_popcount(current);
                   if (count == 0) return false;
                   if (count < best) {
                       br = r; bc = c; mask = current; best = count;
                   }
               }
           }
           if (br == -1) return true;
           int b = (br / 3) * 3 + bc / 3;
           while (mask) {
               int bit = mask & -mask;
               mask ^= bit;
               int d = __builtin_ctz(bit);
               board[br][bc] = static_cast<char>('1' + d);
               rows[br] |= bit; cols[bc] |= bit; boxes[b] |= bit;
               if (dfs(board)) return true;
               rows[br] ^= bit; cols[bc] ^= bit; boxes[b] ^= bit;
               board[br][bc] = '.';
           }
           return false;
       }

   public:
       void solveSudoku(vector<vector<char>>& board) {
           for (int r = 0; r < 9; ++r) for (int c = 0; c < 9; ++c) {
               if (board[r][c] == '.') continue;
               int bit = 1 << (board[r][c] - '1');
               int b = (r / 3) * 3 + c / 3;
               rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
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

           for r in range(9):
               for c in range(9):
                   if board[r][c] == ".":
                       continue
                   bit = 1 << (ord(board[r][c]) - ord("1"))
                   box = (r // 3) * 3 + c // 3
                   rows[r] |= bit
                   cols[c] |= bit
                   boxes[box] |= bit

           def dfs() -> bool:
               best: tuple[int, int, int] | None = None
               best_count = 10
               for r in range(9):
                   for c in range(9):
                       if board[r][c] != ".":
                           continue
                       box = (r // 3) * 3 + c // 3
                       mask = 0x1FF & ~(rows[r] | cols[c] | boxes[box])
                       count = mask.bit_count()
                       if count == 0:
                           return False
                       if count < best_count:
                           best = (r, c, mask)
                           best_count = count
               if best is None:
                   return True

               r, c, mask = best
               box = (r // 3) * 3 + c // 3
               while mask:
                   bit = mask & -mask
                   mask ^= bit
                   digit = bit.bit_length() - 1
                   board[r][c] = chr(ord("1") + digit)
                   rows[r] |= bit; cols[c] |= bit; boxes[box] |= bit
                   if dfs():
                       return True
                   rows[r] ^= bit; cols[c] ^= bit; boxes[box] ^= bit
                   board[r][c] = "."
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
           for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
               if (board[r][c] == '.') continue;
               int bit = 1 << (board[r][c] - '1');
               int b = (r / 3) * 3 + c / 3;
               rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
           }
           dfs(board);
       }

       private boolean dfs(char[][] board) {
           int br = -1, bc = -1, mask = 0, best = 10;
           for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
               if (board[r][c] != '.') continue;
               int b = (r / 3) * 3 + c / 3;
               int current = 0x1FF & ~(rows[r] | cols[c] | boxes[b]);
               int count = Integer.bitCount(current);
               if (count == 0) return false;
               if (count < best) { br = r; bc = c; mask = current; best = count; }
           }
           if (br == -1) return true;
           int b = (br / 3) * 3 + bc / 3;
           while (mask != 0) {
               int bit = mask & -mask;
               mask ^= bit;
               int d = Integer.numberOfTrailingZeros(bit);
               board[br][bc] = (char)('1' + d);
               rows[br] |= bit; cols[bc] |= bit; boxes[b] |= bit;
               if (dfs(board)) return true;
               rows[br] ^= bit; cols[bc] ^= bit; boxes[b] ^= bit;
               board[br][bc] = '.';
           }
           return false;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn solve_sudoku(board: &mut Vec<Vec<char>>) {
           fn dfs(board: &mut [Vec<char>], rows: &mut [u16; 9],
                  cols: &mut [u16; 9], boxes: &mut [u16; 9]) -> bool {
               let mut best: Option<(usize, usize, u16)> = None;
               let mut best_count = 10;
               for r in 0..9 { for c in 0..9 {
                   if board[r][c] != '.' { continue; }
                   let b = (r / 3) * 3 + c / 3;
                   let mask = 0x1FF & !(rows[r] | cols[c] | boxes[b]);
                   let count = mask.count_ones();
                   if count == 0 { return false; }
                   if count < best_count {
                       best = Some((r, c, mask));
                       best_count = count;
                   }
               }}
               let Some((r, c, mut mask)) = best else { return true; };
               let b = (r / 3) * 3 + c / 3;
               while mask != 0 {
                   let bit = mask & mask.wrapping_neg();
                   mask ^= bit;
                   let d = bit.trailing_zeros() as u8;
                   board[r][c] = (b'1' + d) as char;
                   rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
                   if dfs(board, rows, cols, boxes) { return true; }
                   rows[r] ^= bit; cols[c] ^= bit; boxes[b] ^= bit;
                   board[r][c] = '.';
               }
               false
           }

           let mut rows = [0u16; 9];
           let mut cols = [0u16; 9];
           let mut boxes = [0u16; 9];
           for r in 0..9 { for c in 0..9 {
               if board[r][c] == '.' { continue; }
               let bit = 1u16 << (board[r][c] as u8 - b'1');
               let b = (r / 3) * 3 + c / 3;
               rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
           }}
           dfs(board, &mut rows, &mut cols, &mut boxes);
       }
   }

Go
~~

.. code-block:: go

   func solveSudoku(board [][]byte) {
       var rows, cols, boxes [9]int
       for r := 0; r < 9; r++ { for c := 0; c < 9; c++ {
           if board[r][c] == '.' { continue }
           bit := 1 << (board[r][c] - '1')
           b := (r/3)*3 + c/3
           rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit
       }}

       var dfs func() bool
       dfs = func() bool {
           br, bc, bestMask, best := -1, -1, 0, 10
           for r := 0; r < 9; r++ { for c := 0; c < 9; c++ {
               if board[r][c] != '.' { continue }
               b := (r/3)*3 + c/3
               mask := 0x1FF & ^(rows[r] | cols[c] | boxes[b])
               count := bits.OnesCount(uint(mask))
               if count == 0 { return false }
               if count < best { br, bc, bestMask, best = r, c, mask, count }
           }}
           if br == -1 { return true }
           b := (br/3)*3 + bc/3
           for bestMask != 0 {
               bit := bestMask & -bestMask
               bestMask ^= bit
               d := bits.TrailingZeros(uint(bit))
               board[br][bc] = byte('1' + d)
               rows[br] |= bit; cols[bc] |= bit; boxes[b] |= bit
               if dfs() { return true }
               rows[br] ^= bit; cols[bc] ^= bit; boxes[b] ^= bit
               board[br][bc] = '.'
           }
           return false
       }
       dfs()
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function solveSudoku(board: string[][]): void {
       const rows = Array(9).fill(0), cols = Array(9).fill(0), boxes = Array(9).fill(0);
       for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
           if (board[r][c] === ".") continue;
           const bit = 1 << (board[r][c].charCodeAt(0) - 49);
           const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
           rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
       }
       const countBits = (x: number): number => {
           let count = 0;
           while (x !== 0) { x &= x - 1; count++; }
           return count;
       };
       const dfs = (): boolean => {
           let br = -1, bc = -1, mask = 0, best = 10;
           for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
               if (board[r][c] !== ".") continue;
               const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
               const current = 0x1ff & ~(rows[r] | cols[c] | boxes[b]);
               const count = countBits(current);
               if (count === 0) return false;
               if (count < best) [br, bc, mask, best] = [r, c, current, count];
           }
           if (br === -1) return true;
           const b = Math.floor(br / 3) * 3 + Math.floor(bc / 3);
           while (mask !== 0) {
               const bit = mask & -mask;
               mask ^= bit;
               const d = 31 - Math.clz32(bit);
               board[br][bc] = String.fromCharCode(49 + d);
               rows[br] |= bit; cols[bc] |= bit; boxes[b] |= bit;
               if (dfs()) return true;
               rows[br] ^= bit; cols[bc] ^= bit; boxes[b] ^= bit;
               board[br][bc] = ".";
           }
           return false;
       };
       dfs();
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       private readonly int[] rows = new int[9], cols = new int[9], boxes = new int[9];
       public void SolveSudoku(char[][] board) {
           for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
               if (board[r][c] == '.') continue;
               int bit = 1 << (board[r][c] - '1');
               int b = (r / 3) * 3 + c / 3;
               rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
           }
           Dfs(board);
       }
       private bool Dfs(char[][] board) {
           int br = -1, bc = -1, mask = 0, best = 10;
           for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
               if (board[r][c] != '.') continue;
               int b = (r / 3) * 3 + c / 3;
               int current = 0x1FF & ~(rows[r] | cols[c] | boxes[b]);
               int count = System.Numerics.BitOperations.PopCount((uint)current);
               if (count == 0) return false;
               if (count < best) { br = r; bc = c; mask = current; best = count; }
           }
           if (br == -1) return true;
           int box = (br / 3) * 3 + bc / 3;
           while (mask != 0) {
               int bit = mask & -mask;
               mask ^= bit;
               int d = System.Numerics.BitOperations.TrailingZeroCount((uint)bit);
               board[br][bc] = (char)('1' + d);
               rows[br] |= bit; cols[bc] |= bit; boxes[box] |= bit;
               if (Dfs(board)) return true;
               rows[br] ^= bit; cols[bc] ^= bit; boxes[box] ^= bit;
               board[br][bc] = '.';
           }
           return false;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function solveSudoku(board::Vector{Vector{Char}})::Nothing
       rows = zeros(Int, 9); cols = zeros(Int, 9); boxes = zeros(Int, 9)
       for r in 1:9, c in 1:9
           board[r][c] == '.' && continue
           bit = 1 << (Int(board[r][c] - '1'))
           b = div(r - 1, 3) * 3 + div(c - 1, 3) + 1
           rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit
       end
       function dfs()::Bool
           br = 0; bc = 0; chosen = 0; best = 10
           for r in 1:9, c in 1:9
               board[r][c] == '.' || continue
               b = div(r - 1, 3) * 3 + div(c - 1, 3) + 1
               mask = 0x1ff & ~(rows[r] | cols[c] | boxes[b])
               count = count_ones(mask)
               count == 0 && return false
               if count < best
                   br, bc, chosen, best = r, c, mask, count
               end
           end
           br == 0 && return true
           b = div(br - 1, 3) * 3 + div(bc - 1, 3) + 1
           while chosen != 0
               bit = chosen & -chosen
               chosen ⊻= bit
               d = trailing_zeros(bit)
               board[br][bc] = Char(Int('1') + d)
               rows[br] |= bit; cols[bc] |= bit; boxes[b] |= bit
               dfs() && return true
               rows[br] ⊻= bit; cols[bc] ⊻= bit; boxes[b] ⊻= bit
               board[br][bc] = '.'
           end
           false
       end
       dfs()
       nothing
   end

R
~

.. code-block:: r

   solveSudoku <- function(board) {
     rows <- integer(9); cols <- integer(9); boxes <- integer(9)
     for (r in 1:9) for (c in 1:9) {
       if (board[[r]][c] == ".") next
       bit <- bitwShiftL(1L, as.integer(board[[r]][c]) - 1L)
       b <- ((r - 1L) %/% 3L) * 3L + ((c - 1L) %/% 3L) + 1L
       rows[r] <- bitwOr(rows[r], bit)
       cols[c] <- bitwOr(cols[c], bit)
       boxes[b] <- bitwOr(boxes[b], bit)
     }
     bit_count <- function(x) {
       count <- 0L
       while (x != 0L) { x <- bitwAnd(x, x - 1L); count <- count + 1L }
       count
     }
     dfs <- function() {
       br <- 0L; bc <- 0L; chosen <- 0L; best <- 10L
       for (r in 1:9) for (c in 1:9) {
         if (board[[r]][c] != ".") next
         b <- ((r - 1L) %/% 3L) * 3L + ((c - 1L) %/% 3L) + 1L
         used <- bitwOr(bitwOr(rows[r], cols[c]), boxes[b])
         mask <- bitwAnd(511L, bitwNot(used))
         count <- bit_count(mask)
         if (count == 0L) return(FALSE)
         if (count < best) { br <<- r; bc <<- c; chosen <<- mask; best <<- count }
       }
       if (br == 0L) return(TRUE)
       b <- ((br - 1L) %/% 3L) * 3L + ((bc - 1L) %/% 3L) + 1L
       mask <- chosen
       while (mask != 0L) {
         bit <- bitwAnd(mask, -mask)
         mask <- bitwXor(mask, bit)
         d <- 0L; probe <- bit
         while (probe > 1L) { probe <- bitwShiftR(probe, 1L); d <- d + 1L }
         board[[br]][bc] <<- as.character(d + 1L)
         rows[br] <<- bitwOr(rows[br], bit)
         cols[bc] <<- bitwOr(cols[bc], bit)
         boxes[b] <<- bitwOr(boxes[b], bit)
         if (dfs()) return(TRUE)
         rows[br] <<- bitwXor(rows[br], bit)
         cols[bc] <<- bitwXor(cols[bc], bit)
         boxes[b] <<- bitwXor(boxes[b], bit)
         board[[br]][bc] <<- "."
       }
       FALSE
     }
     dfs()
     board
   }

关键边界与易错点
----------------

* 初始化掩码时必须读取所有已填数字，空格不能登记。
* 候选集合必须用 ``& 0x1FF`` 限制到低 9 位；按位取反会产生更高位的 1。
* 写入棋盘、更新三个掩码、递归、撤销四个步骤必须成对出现。
* 找到完整解后要立即沿递归链返回，不能继续撤销已确认的答案。
* MRV 只改变搜索顺序，不改变候选全集，因此不会损害完备性。
* R 的闭包修改外层状态需要 ``<<-``；实现返回修改后的棋盘以符合 R 的值语义。

新增与强化知识
--------------

* 新增：9 位掩码表示固定数字集合，最低位提取为 ``mask & -mask``。
* 新增：MRV 用最少候选变量优先暴露矛盾。
* 强化：回溯的选择、递归、撤销必须保持状态可逆。
* 强化：0036 的行列宫验证状态可直接升级为求解器约束状态。

关联题目
--------

* `0036. Valid Sudoku <0036-valid-sudoku.rst>`_：只构建并验证三类约束，不执行搜索。
* `0022. Generate Parentheses <0022-generate-parentheses.rst>`_：较简单的合法前缀回溯。

最小自检
--------

#. 为什么候选掩码需要限制到低 9 位？
#. MRV 为什么通常比固定顺序更快？
#. 撤销时漏掉棋盘字符恢复会产生什么后果？
#. 题目保证唯一解是否是回溯正确性的必要条件？

答案要点
~~~~~~~~

#. 按位取反会把整数的其他位也变为 1，只有低 9 位代表数字 1 至 9。
#. 候选少的格子更容易形成强制选择或立即冲突，能提前剪掉大分支。
#. 后续分支会把失败候选当成已确定数字，状态与掩码不一致。
#. 不是；存在至少一个解即可找到某个解，唯一性只保证最终答案确定。
