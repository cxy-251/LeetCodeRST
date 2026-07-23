0037. Sudoku Solver
===================

题目信息
--------

:题号: 0037
:难度: Hard
:主题: 矩阵、回溯、位掩码、约束传播
:原题: `LeetCode 0037 <https://leetcode.com/problems/sudoku-solver/>`_
:重点: 原地填充、行列宫约束、唯一解保证、空格字符

题目重述
--------

给定一个未完成的 ``9 x 9`` 数独棋盘 ``board``，把所有空格填成数字，使最终棋盘满足：每一行、每一列以及每个 ``3 x 3`` 九宫格都恰好包含数字 ``1`` 到 ``9`` 各一次。

字符 ``'.'`` 表示空格，其余格子为 ``'1'`` 到 ``'9'``。必须直接在 ``board`` 上完成填充，不需要返回新棋盘。题目保证输入棋盘符合基本规则并且存在唯一解。

自建示例
--------

输入棋盘：

.. code-block:: text

   [".34678912",
    "672195348",
    "198342567",
    "859761423",
    "426853791",
    "713924856",
    "961537284",
    "287419635",
    "34528617."]

修改后的棋盘：

.. code-block:: text

   ["534678912",
    "672195348",
    "198342567",
    "859761423",
    "426853791",
    "713924856",
    "961537284",
    "287419635",
    "345286179"]

解释：左上角空格只能填 5，右下角空格只能填 9。填入后，每行、每列和每个九宫格都包含 1 到 9 各一次。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <vector>

   class Solution {
   private:
       bool scanCandidates(std::vector<std::vector<char>>& board, int position) {
           if (position == 81) return true;
           int row = position / 9, col = position % 9;
           if (board[row][col] != '.') return scanCandidates(board, position + 1);

           for (char digit = '1'; digit <= '9'; ++digit) {
               bool allowed = true;
               for (int i = 0; i < 9; ++i) {
                   if (board[row][i] == digit || board[i][col] == digit) allowed = false;
               }
               int start_row = row / 3 * 3, start_col = col / 3 * 3;
               for (int dr = 0; dr < 3; ++dr)
                   for (int dc = 0; dc < 3; ++dc)
                       if (board[start_row + dr][start_col + dc] == digit) allowed = false;
               if (!allowed) continue;
               board[row][col] = digit;
               if (scanCandidates(board, position + 1)) return true;
               board[row][col] = '.';
           }
           return false;
       }

       std::array<int, 9> rows{}, columns{}, boxes{};
       std::vector<std::pair<int, int>> empty_cells;

       int candidates(int row, int col) {
           int used = rows[row] | columns[col] | boxes[(row / 3) * 3 + col / 3];
           return (~used) & 0x1FF;
       }

       bool solve(std::vector<std::vector<char>>& board, int index) {
           if (index == static_cast<int>(empty_cells.size())) return true;

           int best = index;
           int best_mask = 0;
           int best_count = 10;
           for (int i = index; i < static_cast<int>(empty_cells.size()); ++i) {
               auto [row, col] = empty_cells[i];
               int mask = candidates(row, col);
               int count = __builtin_popcount(static_cast<unsigned>(mask));
               if (count < best_count) {
                   best_count = count;
                   best_mask = mask;
                   best = i;
                   if (count == 1) break;
               }
           }
           if (best_count == 0) return false;

           std::swap(empty_cells[index], empty_cells[best]);
           auto [row, col] = empty_cells[index];
           int box = (row / 3) * 3 + col / 3;
           int mask = best == index ? best_mask : candidates(row, col);

           while (mask != 0) {
               int bit = mask & -mask;
               mask -= bit;
               int digit = __builtin_ctz(static_cast<unsigned>(bit));
               board[row][col] = static_cast<char>('1' + digit);
               rows[row] |= bit; columns[col] |= bit; boxes[box] |= bit;

               if (solve(board, index + 1)) return true;

               rows[row] ^= bit; columns[col] ^= bit; boxes[box] ^= bit;
               board[row][col] = '.';
           }

           std::swap(empty_cells[index], empty_cells[best]);
           return false;
       }

   public:
       void solveSudoku(std::vector<std::vector<char>>& board) {
           rows.fill(0); columns.fill(0); boxes.fill(0); empty_cells.clear();
           for (int row = 0; row < 9; ++row) {
               for (int col = 0; col < 9; ++col) {
                   char cell = board[row][col];
                   if (cell == '.') {
                       empty_cells.push_back({row, col});
                   } else {
                       int bit = 1 << (cell - '1');
                       rows[row] |= bit;
                       columns[col] |= bit;
                       boxes[(row / 3) * 3 + col / 3] |= bit;
                   }
               }
           }
           solve(board, 0);
       }
   };

题解
----

逐格扫描候选为什么重复检查约束
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最直接的回溯找到下一个空格后，尝试 1 到 9，并每次扫描整行、整列和宫格判断是否合法。每次候选检查需要访问多个
格子，同一约束在大量递归节点中重复计算。

三个掩码集合如何维护已使用数字
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``rows[r]``、``columns[c]``、``boxes[b]`` 的九个低位表示数字 1 到 9 是否已使用。空格 ``(r,c)`` 的已用集合为
三者按位或，可用集合为其补集限制到九位：

.. math::

   candidates=(\sim(rows[r]\lor columns[c]\lor boxes[b]))\land 0x1FF

每个候选数字对应一个单独置位的 ``bit``。

放置与撤销如何保持约束同步
~~~~~~~~~~~~~~~~~~~~~~~~~~

放置数字时同时写棋盘并对三个掩码按位或；递归失败后对相同位按异或清除，并把棋盘恢复为 ``'.'``。由于候选位在
放置前保证未设置，异或能准确恢复原状态。棋盘与掩码必须成对更新，不能只恢复其中一个。

为什么优先选择候选最少的空格
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

不同空格的分支数差异很大。每层扫描尚未处理空格，选择候选数最少者，相当于优先处理约束最强变量：候选为零立即
失败，候选为一直接推进。它不改变答案集合，只改变搜索顺序，通常显著缩小搜索树。

动态空格顺序如何通过交换实现
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``empty_cells[0:index]`` 已经填好，后缀尚未处理。找到最佳位置 ``best`` 后与 ``index`` 交换，本层就可以按固定索引
处理。若本层所有候选失败，再交换回来，恢复调用者看到的顺序。成功路径无需恢复，因为搜索立即结束。

状态演化
~~~~~~~~

对自建棋盘，初始两个空格的候选分别为：

.. code-block:: text

   (0,0) -> {5}
   (8,8) -> {9}

选择任一格都只有一个分支。填入 5 后更新第 0 行、第 0 列和左上宫掩码；再填入 9 后所有空格处理完毕，递归返回成功。

为什么完整填充必然满足数独规则
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

初始掩码记录全部已填数字。每次只从未被同行、同列、同宫使用的候选中选择，因此加入的新数字不会制造冲突。递归终点
表示所有空格已填，九个位置的区域中又没有重复数字，故每行、每列和每宫都只能是 1 到 9 的一个排列。

为什么回溯不会遗漏唯一解
~~~~~~~~~~~~~~~~~~~~~~~~

当前格的候选掩码包含所有且仅包含不立即违反约束的数字。循环枚举其中每一位，对每个选择递归枚举后续空格；任何合法
完整解在当前格使用的数字必在候选集合中，因此对应分支不会被跳过。题目保证唯一解，首次成功即可停止。

复杂度来源
~~~~~~~~~~

设空格数为 ``E``，最坏搜索树上界可粗略写为 ``O(9^E)``，但约束检查通过位运算为常数，最少候选启发式大幅减少
实际分支。掩码空间固定，空格数组和递归栈为 ``O(E)``。

九语言实现
----------

C
~

.. code-block:: c

   static int rows[9],cols[9],boxes[9],empty_r[81],empty_c[81],empty_n;
   static int box_id(int r,int c){return(r/3)*3+c/3;}
   static bool dfs(char** board,int index){
       if(index==empty_n)return true;int best=index,best_count=10;
       for(int i=index;i<empty_n;i++){int mask=(~(rows[empty_r[i]]|cols[empty_c[i]]|boxes[box_id(empty_r[i],empty_c[i])]))&0x1FF;int count=__builtin_popcount((unsigned)mask);if(count<best_count){best_count=count;best=i;}}
       if(best_count==0)return false;int tr=empty_r[index],tc=empty_c[index];empty_r[index]=empty_r[best];empty_c[index]=empty_c[best];empty_r[best]=tr;empty_c[best]=tc;
       int r=empty_r[index],c=empty_c[index],b=box_id(r,c),mask=(~(rows[r]|cols[c]|boxes[b]))&0x1FF;
       while(mask){int bit=mask&-mask;mask-=bit;int d=__builtin_ctz((unsigned)bit);board[r][c]=(char)('1'+d);rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit;if(dfs(board,index+1))return true;rows[r]^=bit;cols[c]^=bit;boxes[b]^=bit;board[r][c]='.';}
       tr=empty_r[index];tc=empty_c[index];empty_r[index]=empty_r[best];empty_c[index]=empty_c[best];empty_r[best]=tr;empty_c[best]=tc;return false;
   }
   void solveSudoku(char** board,int boardSize,int* boardColSize){
       memset(rows,0,sizeof(rows));memset(cols,0,sizeof(cols));memset(boxes,0,sizeof(boxes));empty_n=0;
       for(int r=0;r<9;r++)for(int c=0;c<9;c++)if(board[r][c]=='.'){empty_r[empty_n]=r;empty_c[empty_n++]=c;}else{int bit=1<<(board[r][c]-'1');rows[r]|=bit;cols[c]|=bit;boxes[box_id(r,c)]|=bit;}dfs(board,0);
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def solveSudoku(self, board: list[list[str]]) -> None:
           rows=[0]*9;cols=[0]*9;boxes=[0]*9;empty=[]
           for r in range(9):
               for c in range(9):
                   if board[r][c]==".":empty.append((r,c))
                   else:
                       bit=1<<(ord(board[r][c])-49);rows[r]|=bit;cols[c]|=bit;boxes[(r//3)*3+c//3]|=bit
           def dfs(index):
               if index==len(empty):return True
               best=min(range(index,len(empty)),key=lambda i:((~(rows[empty[i][0]]|cols[empty[i][1]]|boxes[(empty[i][0]//3)*3+empty[i][1]//3]))&0x1FF).bit_count())
               empty[index],empty[best]=empty[best],empty[index];r,c=empty[index];b=(r//3)*3+c//3;mask=(~(rows[r]|cols[c]|boxes[b]))&0x1FF
               while mask:
                   bit=mask&-mask;mask-=bit;d=bit.bit_length()-1;board[r][c]=str(d+1);rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit
                   if dfs(index+1):return True
                   rows[r]^=bit;cols[c]^=bit;boxes[b]^=bit;board[r][c]="."
               empty[index],empty[best]=empty[best],empty[index];return False
           dfs(0)

Java
~~~~

.. code-block:: java

   class Solution {
       int[] rows=new int[9],cols=new int[9],boxes=new int[9];List<int[]> empty=new ArrayList<>();
       public void solveSudoku(char[][] board){for(int r=0;r<9;r++)for(int c=0;c<9;c++)if(board[r][c]=='.')empty.add(new int[]{r,c});else{int bit=1<<(board[r][c]-'1');rows[r]|=bit;cols[c]|=bit;boxes[(r/3)*3+c/3]|=bit;}dfs(board,0);}
       boolean dfs(char[][] board,int index){if(index==empty.size())return true;int best=index,count=10;for(int i=index;i<empty.size();i++){int[] p=empty.get(i);int mask=(~(rows[p[0]]|cols[p[1]]|boxes[(p[0]/3)*3+p[1]/3]))&0x1FF;int x=Integer.bitCount(mask);if(x<count){count=x;best=i;}}Collections.swap(empty,index,best);int[] p=empty.get(index);int r=p[0],c=p[1],b=(r/3)*3+c/3,mask=(~(rows[r]|cols[c]|boxes[b]))&0x1FF;while(mask!=0){int bit=mask&-mask;mask-=bit;int d=Integer.numberOfTrailingZeros(bit);board[r][c]=(char)('1'+d);rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit;if(dfs(board,index+1))return true;rows[r]^=bit;cols[c]^=bit;boxes[b]^=bit;board[r][c]='.';}Collections.swap(empty,index,best);return false;}
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn solve_sudoku(board:&mut Vec<Vec<char>>){
           fn dfs(board:&mut Vec<Vec<char>>,empty:&mut Vec<(usize,usize)>,rows:&mut [i32;9],cols:&mut [i32;9],boxes:&mut [i32;9],index:usize)->bool{
               if index==empty.len(){return true}let mut best=index;let mut count=10;for i in index..empty.len(){let(r,c)=empty[i];let x=((!(rows[r]|cols[c]|boxes[(r/3)*3+c/3]))&0x1FF).count_ones();if x<count{count=x;best=i;}}empty.swap(index,best);let(r,c)=empty[index];let b=(r/3)*3+c/3;let mut mask=(!(rows[r]|cols[c]|boxes[b]))&0x1FF;
               while mask!=0{let bit=mask&-mask;mask-=bit;let d=bit.trailing_zeros() as u8;board[r][c]=(b'1'+d)as char;rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit;if dfs(board,empty,rows,cols,boxes,index+1){return true}rows[r]^=bit;cols[c]^=bit;boxes[b]^=bit;board[r][c]='.';}empty.swap(index,best);false}
           let(mut rows,mut cols,mut boxes)=([0;9],[0;9],[0;9]);let mut empty=Vec::new();for r in 0..9{for c in 0..9{if board[r][c]=='.'{empty.push((r,c))}else{let bit=1<<(board[r][c] as u8-b'1');rows[r]|=bit;cols[c]|=bit;boxes[(r/3)*3+c/3]|=bit;}}}dfs(board,&mut empty,&mut rows,&mut cols,&mut boxes,0);
       }
   }

Go
~~

.. code-block:: go

   func solveSudoku(board [][]byte){
       rows,cols,boxes:=[9]int{},[9]int{},[9]int{};empty:=[][2]int{}
       for r:=0;r<9;r++{for c:=0;c<9;c++{if board[r][c]=='.'{empty=append(empty,[2]int{r,c})}else{bit:=1<<(board[r][c]-'1');rows[r]|=bit;cols[c]|=bit;boxes[(r/3)*3+c/3]|=bit}}}
       var dfs func(int)bool;dfs=func(index int)bool{if index==len(empty){return true};best,count:=index,10;for i:=index;i<len(empty);i++{r,c:=empty[i][0],empty[i][1];x:=bits.OnesCount(uint((^(rows[r]|cols[c]|boxes[(r/3)*3+c/3]))&0x1FF));if x<count{count=x;best=i}};empty[index],empty[best]=empty[best],empty[index];r,c:=empty[index][0],empty[index][1];b:=(r/3)*3+c/3;mask:=(^(rows[r]|cols[c]|boxes[b]))&0x1FF
           for mask!=0{bit:=mask&-mask;mask-=bit;d:=bits.TrailingZeros(uint(bit));board[r][c]=byte('1'+d);rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit;if dfs(index+1){return true};rows[r]^=bit;cols[c]^=bit;boxes[b]^=bit;board[r][c]='.'};empty[index],empty[best]=empty[best],empty[index];return false};dfs(0)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function solveSudoku(board:string[][]):void{
       const rows=new Array(9).fill(0),cols=new Array(9).fill(0),boxes=new Array(9).fill(0),empty:[number,number][]=[];
       for(let r=0;r<9;r++)for(let c=0;c<9;c++)if(board[r][c]===".")empty.push([r,c]);else{const bit=1<<(board[r][c].charCodeAt(0)-49);rows[r]|=bit;cols[c]|=bit;boxes[Math.floor(r/3)*3+Math.floor(c/3)]|=bit;}
       const dfs=(index:number):boolean=>{if(index===empty.length)return true;let best=index,count=10;for(let i=index;i<empty.length;i++){const[r,c]=empty[i],mask=(~(rows[r]|cols[c]|boxes[Math.floor(r/3)*3+Math.floor(c/3)]))&0x1FF,x=mask.toString(2).replace(/0/g,"").length;if(x<count){count=x;best=i;}}[empty[index],empty[best]]=[empty[best],empty[index]];const[r,c]=empty[index],b=Math.floor(r/3)*3+Math.floor(c/3);let mask=(~(rows[r]|cols[c]|boxes[b]))&0x1FF;while(mask){const bit=mask&-mask;mask-=bit,d=Math.log2(bit);board[r][c]=String(d+1);rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit;if(dfs(index+1))return true;rows[r]^=bit;cols[c]^=bit;boxes[b]^=bit;board[r][c]=".";}[empty[index],empty[best]]=[empty[best],empty[index]];return false;};dfs(0)
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       int[] rows=new int[9],cols=new int[9],boxes=new int[9];List<(int,int)> empty=new();
       public void SolveSudoku(char[][] board){for(int r=0;r<9;r++)for(int c=0;c<9;c++)if(board[r][c]=='.')empty.Add((r,c));else{int bit=1<<(board[r][c]-'1');rows[r]|=bit;cols[c]|=bit;boxes[(r/3)*3+c/3]|=bit;}Dfs(board,0);}
       bool Dfs(char[][] board,int index){if(index==empty.Count)return true;int best=index,count=10;for(int i=index;i<empty.Count;i++){var(r,c)=empty[i];int x=BitOperations.PopCount((uint)((~(rows[r]|cols[c]|boxes[(r/3)*3+c/3]))&0x1FF));if(x<count){count=x;best=i;}}(empty[index],empty[best])=(empty[best],empty[index]);var(rr,cc)=empty[index];int b=(rr/3)*3+cc/3,mask=(~(rows[rr]|cols[cc]|boxes[b]))&0x1FF;while(mask!=0){int bit=mask&-mask;mask-=bit;int d=BitOperations.TrailingZeroCount((uint)bit);board[rr][cc]=(char)('1'+d);rows[rr]|=bit;cols[cc]|=bit;boxes[b]|=bit;if(Dfs(board,index+1))return true;rows[rr]^=bit;cols[cc]^=bit;boxes[b]^=bit;board[rr][cc]='.';}(empty[index],empty[best])=(empty[best],empty[index]);return false;}
   }

Julia
~~~~~

.. code-block:: julia

   function solve_sudoku!(board)
       rows=zeros(Int,9);cols=zeros(Int,9);boxes=zeros(Int,9);empty=Tuple{Int,Int}[]
       for r in 1:9,c in 1:9;if board[r][c]=='.';push!(empty,(r,c));else;bit=1<<Int(board[r][c]-'1');rows[r]|=bit;cols[c]|=bit;boxes[((r-1)÷3)*3+(c-1)÷3+1]|=bit;end;end
       function dfs(index)
           index>length(empty)&&return true;best=index;count=10
           for i in index:length(empty);r,c=empty[i];x=count_ones((~(rows[r]|cols[c]|boxes[((r-1)÷3)*3+(c-1)÷3+1]))&0x1FF);if x<count;count=x;best=i;end;end
           empty[index],empty[best]=empty[best],empty[index];r,c=empty[index];b=((r-1)÷3)*3+(c-1)÷3+1;mask=(~(rows[r]|cols[c]|boxes[b]))&0x1FF
           while mask!=0;bit=mask&-mask;mask-=bit;d=trailing_zeros(bit);board[r][c]=Char(Int('1')+d);rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit;dfs(index+1)&&return true;rows[r]⊻=bit;cols[c]⊻=bit;boxes[b]⊻=bit;board[r][c]='.';end
           empty[index],empty[best]=empty[best],empty[index];false
       end;dfs(1)
   end

R
~

.. code-block:: r

   solve_sudoku <- function(board) {
       rows<-integer(9);cols<-integer(9);boxes<-integer(9);empty<-list()
       for(r in 1:9)for(c in 1:9)if(board[[r]][[c]]==".")empty[[length(empty)+1L]]<-c(r,c)else{bit<-bitwShiftL(1L,as.integer(board[[r]][[c]])-1L);rows[[r]]<-bitwOr(rows[[r]],bit);cols[[c]]<-bitwOr(cols[[c]],bit);b<-(r-1L)%/%3L*3L+(c-1L)%/%3L+1L;boxes[[b]]<-bitwOr(boxes[[b]],bit)}
       dfs<-function(index){if(index>length(empty))return(TRUE);best<-index;best_count<-10L
           for(i in index:length(empty)){r<-empty[[i]][[1]];c<-empty[[i]][[2]];b<-(r-1L)%/%3L*3L+(c-1L)%/%3L+1L;mask<-bitwAnd(bitwNot(bitwOr(bitwOr(rows[[r]],cols[[c]]),boxes[[b]])),511L);x<-sum(as.integer(intToBits(mask)[1:9]));if(x<best_count){best_count<-x;best<-i}}
           temp<-empty[[index]];empty[[index]]<<-empty[[best]];empty[[best]]<<-temp;r<-empty[[index]][[1]];c<-empty[[index]][[2]];b<-(r-1L)%/%3L*3L+(c-1L)%/%3L+1L;mask<-bitwAnd(bitwNot(bitwOr(bitwOr(rows[[r]],cols[[c]]),boxes[[b]])),511L)
           for(d in 0:8){bit<-bitwShiftL(1L,d);if(bitwAnd(mask,bit)==0L)next;board[[r]][[c]]<<-as.character(d+1L);rows[[r]]<<-bitwOr(rows[[r]],bit);cols[[c]]<<-bitwOr(cols[[c]],bit);boxes[[b]]<<-bitwOr(boxes[[b]],bit);if(dfs(index+1L))return(TRUE);rows[[r]]<<-bitwXor(rows[[r]],bit);cols[[c]]<<-bitwXor(cols[[c]],bit);boxes[[b]]<<-bitwXor(boxes[[b]],bit);board[[r]][[c]]<<-"."}
           temp<-empty[[index]];empty[[index]]<<-empty[[best]];empty[[best]]<<-temp;FALSE}
       dfs(1L);board
   }