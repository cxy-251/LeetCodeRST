0037. Sudoku Solver
===================

题目信息
--------

:题号: 0037
:难度: Hard
:主题: 回溯、约束传播、位掩码、MRV
:原题: `LeetCode 0037 <https://leetcode.com/problems/sudoku-solver/>`_
:教学重点: 候选集合、最少候选优先、选择与撤销、棋盘和掩码一致性、原地求解

题目重述
--------

给定一个合法但未完成的 ``9 × 9`` 数独棋盘，``'.'`` 表示空格。原地填入数字字符，使每行、每列和每个 ``3 × 3`` 宫都包含 1 至 9 且无重复。题目保证存在唯一解。

自建示例
--------

某空格所在行已使用 ``1,3,4,5,6,7,8,9``，列和宫也允许 ``2``，则候选掩码只含数字 2，这是强制选择。

另一个空格可能允许 ``2`` 或 ``6``。尝试 2 后若后续某格候选为空，必须恢复该格为 ``'.'``，并从行、列、宫掩码中同时删除数字 2，再尝试 6。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <bit>
   #include <vector>

   class Solution {
   private:
       bool canPlace(const std::vector<std::vector<char>>& board, int row, int col, char digit) {
           for (int i = 0; i < 9; ++i) {
               if (board[row][i] == digit || board[i][col] == digit) return false;
           }
           int start_row = row / 3 * 3, start_col = col / 3 * 3;
           for (int r = start_row; r < start_row + 3; ++r)
               for (int c = start_col; c < start_col + 3; ++c)
                   if (board[r][c] == digit) return false;
           return true;
       }

       bool directBacktrack(std::vector<std::vector<char>>& board, int position) {
           if (position == 81) return true;
           int row = position / 9, col = position % 9;
           if (board[row][col] != '.') return directBacktrack(board, position + 1);
           for (char digit = '1'; digit <= '9'; ++digit) {
               if (!canPlace(board, row, col, digit)) continue;
               board[row][col] = digit;
               if (directBacktrack(board, position + 1)) return true;
               board[row][col] = '.';
           }
           return false;
       }

       bool booleanDfs(
           std::vector<std::vector<char>>& board,
           const std::vector<std::pair<int,int>>& spaces,
           int index,
           bool rows[9][9], bool cols[9][9], bool boxes[9][9]
       ) {
           if (index == static_cast<int>(spaces.size())) return true;
           auto [row, col] = spaces[index];
           int box = (row / 3) * 3 + col / 3;
           for (int digit = 0; digit < 9; ++digit) {
               if (rows[row][digit] || cols[col][digit] || boxes[box][digit]) continue;
               board[row][col] = static_cast<char>('1' + digit);
               rows[row][digit] = cols[col][digit] = boxes[box][digit] = true;
               if (booleanDfs(board, spaces, index + 1, rows, cols, boxes)) return true;
               rows[row][digit] = cols[col][digit] = boxes[box][digit] = false;
               board[row][col] = '.';
           }
           return false;
       }

       bool mrvDfs(
           std::vector<std::vector<char>>& board,
           std::array<int,9>& rows,
           std::array<int,9>& cols,
           std::array<int,9>& boxes
       ) {
           constexpr int full = (1 << 9) - 1;
           int best_row = -1, best_col = -1, best_mask = 0, best_count = 10;

           for (int row = 0; row < 9; ++row) for (int col = 0; col < 9; ++col) {
               if (board[row][col] != '.') continue;
               int box = (row / 3) * 3 + col / 3;
               int mask = full & ~(rows[row] | cols[col] | boxes[box]);
               int count = std::popcount(static_cast<unsigned>(mask));
               if (count == 0) return false;
               if (count < best_count) {
                   best_row = row; best_col = col; best_mask = mask; best_count = count;
                   if (count == 1) break;
               }
           }

           if (best_row == -1) return true;
           int box = (best_row / 3) * 3 + best_col / 3;
           while (best_mask != 0) {
               int bit = best_mask & -best_mask;
               best_mask ^= bit;
               int digit = std::countr_zero(static_cast<unsigned>(bit));
               board[best_row][best_col] = static_cast<char>('1' + digit);
               rows[best_row] |= bit; cols[best_col] |= bit; boxes[box] |= bit;
               if (mrvDfs(board, rows, cols, boxes)) return true;
               rows[best_row] ^= bit; cols[best_col] ^= bit; boxes[box] ^= bit;
               board[best_row][best_col] = '.';
           }
           return false;
       }

       void solveWithMrv(std::vector<std::vector<char>>& board) {
           std::array<int,9> rows{}, cols{}, boxes{};
           for (int row = 0; row < 9; ++row) for (int col = 0; col < 9; ++col) {
               if (board[row][col] == '.') continue;
               int bit = 1 << (board[row][col] - '1');
               int box = (row / 3) * 3 + col / 3;
               rows[row] |= bit; cols[col] |= bit; boxes[box] |= bit;
           }
           mrvDfs(board, rows, cols, boxes);
       }

   public:
       void solveSudoku(std::vector<std::vector<char>>& board) {
           solveWithMrv(board);
       }
   };

题解
----

从合法性检查到赋值搜索
~~~~~~~~~~~~~~~~~~~~~~

第 36 题只登记已出现数字。本题把每个空格看作变量：候选是所在行、列、宫都未使用的数字；选择候选后更新三类状态；若后续无法完成，就撤销并尝试下一个候选。

直接逐格检查为何重复工作
~~~~~~~~~~~~~~~~~~~~~~~~

最直接回溯每次尝试数字都重新扫描 9 个同行格、9 个同列格和 9 个宫格。搜索树中同一区域被反复查询。布尔表或位掩码把“某数字是否已使用”降为常数时间成员查询。

候选掩码如何得到
~~~~~~~~~~~~~~~~

每个整数的低 9 位表示数字 1 至 9。空格 ``(r,c)`` 的已用集合为：

.. code-block:: text

   used = rows[r] | cols[c] | boxes[box]
   candidates = (~used) & 0x1ff

候选位为 1 表示该数字同时未出现在三类区域中。

为什么选择候选最少的空格
~~~~~~~~~~~~~~~~~~~~~~~~

固定顺序回溯可能先处理有 7 个候选的格子，产生大量分支，而某个只有 1 个候选的格子已经能强制决定路径。MRV（Minimum Remaining Values）每层扫描所有空格，选择候选数最少者：候选为 0 立即失败，候选为 1 直接传播，通常显著缩小搜索树。

最低位如何枚举候选
~~~~~~~~~~~~~~~~~~

``bit = mask & -mask`` 提取最低位的 1。该位下标对应数字减一；尝试后用 ``mask ^= bit`` 从局部候选集合删除。9 位范围很小，也可以逐位循环，但最低位提取使状态变化更直接。

选择与撤销必须同步哪些状态
~~~~~~~~~~~~~~~~~~~~~~~~~~

尝试 ``bit`` 时同时：写入棋盘字符、将位加入行掩码、列掩码和宫掩码。递归失败时必须反向恢复这四处。因为候选位在尝试前确定未被使用，所以登记可用按位或，撤销可用按位异或。

.. list-table::
   :header-rows: 1

   * - 阶段
     - 棋盘格
     - 三类掩码
   * - 选择前
     - ``'.'``
     - 均不含 ``bit``
   * - 尝试
     - 写入数字
     - 三处加入 ``bit``
   * - 子树失败
     - 恢复 ``'.'``
     - 三处删除 ``bit``

为什么回溯安全且完备
~~~~~~~~~~~~~~~~~~~~

安全性来自候选定义：被尝试数字不在当前行、列、宫中，因此每次写入都保持约束。没有空格时，81 个格子均已填满且无冲突，得到合法解。

完备性来自候选枚举：任意真实解在选中格子的数字一定属于当前候选集合；算法逐个尝试全部候选，不会剪掉真实解分支。失败分支返回前完整撤销，所以不会污染兄弟分支。题目保证唯一解，首次成功即可停止。

复杂度来源
~~~~~~~~~~

设空格数为 ``E``，粗略最坏上界为 ``O(9^E)``，递归深度 ``O(E)``。行列宫查询为常数时间；每层 MRV 扫描最多 81 格，是固定因子。实际搜索量由约束和候选排序大幅缩小。

九语言实现
----------

C
~

.. code-block:: c

   static int count_bits(int x){int n=0;while(x){x&=x-1;++n;}return n;}
   static int bit_index(int bit){int d=0;while((1<<d)!=bit)++d;return d;}
   static bool solve(char **board,int rows[9],int cols[9],int boxes[9]){
       int br=-1,bc=-1,bm=0,best=10,full=(1<<9)-1;
       for(int r=0;r<9;r++)for(int c=0;c<9;c++)if(board[r][c]=='.'){
           int b=(r/3)*3+c/3,mask=full&~(rows[r]|cols[c]|boxes[b]),count=count_bits(mask);
           if(count==0)return false;if(count<best){br=r;bc=c;bm=mask;best=count;}
       }
       if(br<0)return true;int b=(br/3)*3+bc/3;
       while(bm){int bit=bm&-bm;bm^=bit;int d=bit_index(bit);board[br][bc]=(char)('1'+d);
           rows[br]|=bit;cols[bc]|=bit;boxes[b]|=bit;if(solve(board,rows,cols,boxes))return true;
           rows[br]^=bit;cols[bc]^=bit;boxes[b]^=bit;board[br][bc]='.';}
       return false;
   }
   void solveSudoku(char **board,int boardSize,int *boardColSize){
       int rows[9]={0},cols[9]={0},boxes[9]={0};(void)boardSize;(void)boardColSize;
       for(int r=0;r<9;r++)for(int c=0;c<9;c++)if(board[r][c]!='.'){
           int bit=1<<(board[r][c]-'1'),b=(r/3)*3+c/3;rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit;}
       solve(board,rows,cols,boxes);
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def solveSudoku(self, board: list[list[str]]) -> None:
           rows, cols, boxes = [0]*9, [0]*9, [0]*9
           for r in range(9):
               for c in range(9):
                   if board[r][c] != ".":
                       bit = 1 << (ord(board[r][c]) - 49); box = (r//3)*3 + c//3
                       rows[r] |= bit; cols[c] |= bit; boxes[box] |= bit
           full = (1 << 9) - 1
           def dfs() -> bool:
               best = None; best_mask = 0
               for r in range(9):
                   for c in range(9):
                       if board[r][c] == ".":
                           box = (r//3)*3 + c//3; mask = full & ~(rows[r] | cols[c] | boxes[box])
                           if mask == 0: return False
                           if best is None or mask.bit_count() < best_mask.bit_count(): best, best_mask = (r,c,box), mask
               if best is None: return True
               r,c,box = best; mask = best_mask
               while mask:
                   bit = mask & -mask; mask ^= bit; board[r][c] = str(bit.bit_length())
                   rows[r] |= bit; cols[c] |= bit; boxes[box] |= bit
                   if dfs(): return True
                   rows[r] ^= bit; cols[c] ^= bit; boxes[box] ^= bit; board[r][c] = "."
               return False
           dfs()

Java
~~~~

.. code-block:: java

   class Solution {
       int[] rows=new int[9],cols=new int[9],boxes=new int[9];char[][] board;final int FULL=(1<<9)-1;
       boolean dfs(){int br=-1,bc=-1,bm=0,best=10;
           for(int r=0;r<9;r++)for(int c=0;c<9;c++)if(board[r][c]=='.'){
               int b=(r/3)*3+c/3,mask=FULL&~(rows[r]|cols[c]|boxes[b]),count=Integer.bitCount(mask);
               if(count==0)return false;if(count<best){br=r;bc=c;bm=mask;best=count;}}
           if(br<0)return true;int b=(br/3)*3+bc/3;
           while(bm!=0){int bit=bm&-bm;bm^=bit;int d=Integer.numberOfTrailingZeros(bit);board[br][bc]=(char)('1'+d);
               rows[br]|=bit;cols[bc]|=bit;boxes[b]|=bit;if(dfs())return true;
               rows[br]^=bit;cols[bc]^=bit;boxes[b]^=bit;board[br][bc]='.';}return false;}
       public void solveSudoku(char[][] board){this.board=board;for(int r=0;r<9;r++)for(int c=0;c<9;c++)if(board[r][c]!='.'){
           int bit=1<<(board[r][c]-'1'),b=(r/3)*3+c/3;rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit;}dfs();}
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn solve_sudoku(board: &mut Vec<Vec<char>>) {
           fn dfs(board:&mut Vec<Vec<char>>,rows:&mut [u16;9],cols:&mut [u16;9],boxes:&mut [u16;9])->bool{
               let(mut br,mut bc,mut bm,mut best)=(9usize,9usize,0u16,10u32);
               for r in 0..9{for c in 0..9{if board[r][c]=='.'{let b=(r/3)*3+c/3;let mask=0x1ff&!(rows[r]|cols[c]|boxes[b]);let count=mask.count_ones();if count==0{return false}if count<best{br=r;bc=c;bm=mask;best=count;}}}}
               if br==9{return true}let b=(br/3)*3+bc/3;while bm!=0{let bit=bm&bm.wrapping_neg();bm^=bit;let d=bit.trailing_zeros() as u8;board[br][bc]=(b'1'+d)as char;
                   rows[br]|=bit;cols[bc]|=bit;boxes[b]|=bit;if dfs(board,rows,cols,boxes){return true}rows[br]^=bit;cols[bc]^=bit;boxes[b]^=bit;board[br][bc]='.';}false}
           let(mut rows,mut cols,mut boxes)=([0u16;9],[0u16;9],[0u16;9]);for r in 0..9{for c in 0..9{if board[r][c]!='.'{let bit=1u16<<(board[r][c]as u8-b'1');let b=(r/3)*3+c/3;rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit;}}}dfs(board,&mut rows,&mut cols,&mut boxes);
       }
   }

Go
~~

.. code-block:: go

   func solveSudoku(board [][]byte){rows,cols,boxes:=[9]int{},[9]int{},[9]int{};for r:=0;r<9;r++{for c:=0;c<9;c++{if board[r][c]!='.'{bit:=1<<int(board[r][c]-'1');b:=(r/3)*3+c/3;rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit}}}
       var dfs func()bool;dfs=func()bool{br,bc,bm,best:=-1,-1,0,10;for r:=0;r<9;r++{for c:=0;c<9;c++{if board[r][c]=='.'{b:=(r/3)*3+c/3;mask:=0x1ff&^(rows[r]|cols[c]|boxes[b]);count:=bits.OnesCount(uint(mask));if count==0{return false};if count<best{br,bc,bm,best=r,c,mask,count}}}};if br<0{return true};b:=(br/3)*3+bc/3;for bm!=0{bit:=bm&-bm;bm^=bit;d:=bits.TrailingZeros(uint(bit));board[br][bc]=byte('1'+d);rows[br]|=bit;cols[bc]|=bit;boxes[b]|=bit;if dfs(){return true};rows[br]^=bit;cols[bc]^=bit;boxes[b]^=bit;board[br][bc]='.'};return false};dfs()}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function solveSudoku(board: string[][]): void {
       const rows=Array(9).fill(0),cols=Array(9).fill(0),boxes=Array(9).fill(0);
       for(let r=0;r<9;r++)for(let c=0;c<9;c++)if(board[r][c]!=="."){const bit=1<<(board[r][c].charCodeAt(0)-49),b=Math.floor(r/3)*3+Math.floor(c/3);rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit;}
       const count=(x:number)=>{let n=0;while(x){x&=x-1;n++;}return n;};
       const dfs=():boolean=>{let br=-1,bc=-1,bm=0,best=10;for(let r=0;r<9;r++)for(let c=0;c<9;c++)if(board[r][c]==="."){const b=Math.floor(r/3)*3+Math.floor(c/3),mask=0x1ff&~(rows[r]|cols[c]|boxes[b]),n=count(mask);if(n===0)return false;if(n<best){br=r;bc=c;bm=mask;best=n;}}if(br<0)return true;const b=Math.floor(br/3)*3+Math.floor(bc/3);while(bm){const bit=bm&-bm;bm^=bit;const d=31-Math.clz32(bit);board[br][bc]=String(d+1);rows[br]|=bit;cols[bc]|=bit;boxes[b]|=bit;if(dfs())return true;rows[br]^=bit;cols[bc]^=bit;boxes[b]^=bit;board[br][bc]=".";}return false;};dfs();
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       int[] rows=new int[9],cols=new int[9],boxes=new int[9];char[][] board;
       bool Dfs(){int br=-1,bc=-1,bm=0,best=10;for(int r=0;r<9;r++)for(int c=0;c<9;c++)if(board[r][c]=='.'){int b=(r/3)*3+c/3,mask=0x1ff&~(rows[r]|cols[c]|boxes[b]),n=System.Numerics.BitOperations.PopCount((uint)mask);if(n==0)return false;if(n<best){br=r;bc=c;bm=mask;best=n;}}if(br<0)return true;int box=(br/3)*3+bc/3;while(bm!=0){int bit=bm&-bm;bm^=bit;int d=System.Numerics.BitOperations.TrailingZeroCount((uint)bit);board[br][bc]=(char)('1'+d);rows[br]|=bit;cols[bc]|=bit;boxes[box]|=bit;if(Dfs())return true;rows[br]^=bit;cols[bc]^=bit;boxes[box]^=bit;board[br][bc]='.';}return false;}
       public void SolveSudoku(char[][] board){this.board=board;for(int r=0;r<9;r++)for(int c=0;c<9;c++)if(board[r][c]!='.'){int bit=1<<(board[r][c]-'1'),b=(r/3)*3+c/3;rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit;}Dfs();}
   }

Julia
~~~~~

.. code-block:: julia

   function solve_sudoku!(board)
       rows=zeros(Int,9);cols=zeros(Int,9);boxes=zeros(Int,9)
       for r in 1:9,c in 1:9;if board[r][c]!='.';bit=1<<(Int(board[r][c])-Int('1'));b=((r-1)÷3)*3+(c-1)÷3+1;rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit;end;end
       function dfs();br=0;bc=0;bm=0;best=10
           for r in 1:9,c in 1:9;if board[r][c]=='.';b=((r-1)÷3)*3+(c-1)÷3+1;mask=0x1ff&~(rows[r]|cols[c]|boxes[b]);n=count_ones(mask);n==0&&return false;if n<best;br=r;bc=c;bm=mask;best=n;end;end;end
           br==0&&return true;b=((br-1)÷3)*3+(bc-1)÷3+1
           while bm!=0;bit=bm&-bm;bm⊻=bit;d=trailing_zeros(bit);board[br][bc]=Char(Int('1')+d);rows[br]|=bit;cols[bc]|=bit;boxes[b]|=bit;dfs()&&return true;rows[br]⊻=bit;cols[bc]⊻=bit;boxes[b]⊻=bit;board[br][bc]='.';end;false
       end;dfs();board
   end

R
~

.. code-block:: r

   solve_sudoku <- function(board) {
     rows<-integer(9);cols<-integer(9);boxes<-integer(9)
     for(r in 1:9)for(c in 1:9)if(board[[r]][[c]]!="."){d<-match(board[[r]][[c]],as.character(1:9))-1L;bit<-bitwShiftL(1L,d);b<-((r-1L)%/%3L)*3L+(c-1L)%/%3L+1L;rows[[r]]<-bitwOr(rows[[r]],bit);cols[[c]]<-bitwOr(cols[[c]],bit);boxes[[b]]<-bitwOr(boxes[[b]],bit)}
     count_bits<-function(x){n<-0L;while(x!=0L){x<-bitwAnd(x,x-1L);n<-n+1L};n}
     dfs<-function(){br<-0L;bc<-0L;bm<-0L;best<-10L
       for(r in 1:9)for(c in 1:9)if(board[[r]][[c]]=="."){b<-((r-1L)%/%3L)*3L+(c-1L)%/%3L+1L;mask<-bitwAnd(511L,bitwNot(bitwOr(bitwOr(rows[[r]],cols[[c]]),boxes[[b]])));n<-count_bits(mask);if(n==0L)return(FALSE);if(n<best){br<-r;bc<-c;bm<-mask;best<-n}}
       if(br==0L)return(TRUE);b<-((br-1L)%/%3L)*3L+(bc-1L)%/%3L+1L
       while(bm!=0L){bit<-bitwAnd(bm,-bm);bm<-bitwXor(bm,bit);d<-0L;while(bitwShiftL(1L,d)!=bit)d<-d+1L;board[[br]][[bc]]<<-as.character(d+1L);rows[[br]]<<-bitwOr(rows[[br]],bit);cols[[bc]]<<-bitwOr(cols[[bc]],bit);boxes[[b]]<<-bitwOr(boxes[[b]],bit);if(dfs())return(TRUE);rows[[br]]<<-bitwXor(rows[[br]],bit);cols[[bc]]<<-bitwXor(cols[[bc]],bit);boxes[[b]]<<-bitwXor(boxes[[b]],bit);board[[br]][[bc]]<<-"."};FALSE}
     dfs();board
   }