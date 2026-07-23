0036. Valid Sudoku
==================

题目信息
--------

:题号: 0036
:难度: Medium
:主题: 矩阵、哈希集合、位掩码
:原题: `LeetCode 0036 <https://leetcode.com/problems/valid-sudoku/>`_
:重点: 只检查已填数字、行列与九宫格唯一性、有效不等于可解

题目重述
--------

给定一个 ``9 x 9`` 的数独棋盘 ``board``，判断当前已填写的数字是否满足数独规则：

#. 每一行中，数字 ``1`` 到 ``9`` 不能重复；
#. 每一列中，数字 ``1`` 到 ``9`` 不能重复；
#. 每个 ``3 x 3`` 九宫格中，数字 ``1`` 到 ``9`` 不能重复。

字符 ``'.'`` 表示空格，只检查已经填写的格子。棋盘满足以上局部规则即可判为有效，并不要求证明它一定能够补全为完整数独。棋盘中的字符只可能是 ``'.'`` 或 ``'1'`` 到 ``'9'``。

自建示例
--------

以下坐标均使用零基下标，未特别列出的格子都为 ``'.'``。

同一行重复：

.. code-block:: text

   输入：board[0][1] = '5'，board[0][7] = '5'
   输出：false
   解释：第 0 行中数字 5 出现两次。

同一列重复：

.. code-block:: text

   输入：board[1][3] = '7'，board[8][3] = '7'
   输出：false
   解释：第 3 列中数字 7 出现两次。

同一九宫格重复：

.. code-block:: text

   输入：board[0][0] = '4'，board[2][2] = '4'
   输出：false
   解释：两个数字 4 都位于左上角的 3 x 3 九宫格内。

全空棋盘：

.. code-block:: text

   输入：所有格子均为 '.'
   输出：true
   解释：没有已填数字违反行、列或九宫格规则。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <unordered_set>
   #include <vector>

   class Solution {
   private:
       bool repeatedScans(const std::vector<std::vector<char>>& board) {
           for (int row = 0; row < 9; ++row) {
               std::array<bool, 9> seen{};
               for (int col = 0; col < 9; ++col) {
                   if (board[row][col] == '.') continue;
                   int digit = board[row][col] - '1';
                   if (seen[digit]) return false;
                   seen[digit] = true;
               }
           }
           for (int col = 0; col < 9; ++col) {
               std::array<bool, 9> seen{};
               for (int row = 0; row < 9; ++row) {
                   if (board[row][col] == '.') continue;
                   int digit = board[row][col] - '1';
                   if (seen[digit]) return false;
                   seen[digit] = true;
               }
           }
           for (int box_row = 0; box_row < 3; ++box_row) {
               for (int box_col = 0; box_col < 3; ++box_col) {
                   std::array<bool, 9> seen{};
                   for (int offset = 0; offset < 9; ++offset) {
                       int row = box_row * 3 + offset / 3;
                       int col = box_col * 3 + offset % 3;
                       if (board[row][col] == '.') continue;
                       int digit = board[row][col] - '1';
                       if (seen[digit]) return false;
                       seen[digit] = true;
                   }
               }
           }
           return true;
       }

       bool tupleSet(const std::vector<std::vector<char>>& board) {
           std::unordered_set<std::string> seen;
           for (int row = 0; row < 9; ++row) {
               for (int col = 0; col < 9; ++col) {
                   char digit = board[row][col];
                   if (digit == '.') continue;
                   if (!seen.insert("r" + std::to_string(row) + digit).second ||
                       !seen.insert("c" + std::to_string(col) + digit).second ||
                       !seen.insert("b" + std::to_string((row / 3) * 3 + col / 3) + digit).second)
                       return false;
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
                   char cell = board[row][col];
                   if (cell == '.') continue;
                   int bit = 1 << (cell - '1');
                   int box = (row / 3) * 3 + col / 3;
                   if ((rows[row] & bit) || (columns[col] & bit) || (boxes[box] & bit)) return false;
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

为什么只需检查已经填写的格子
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

空格不代表某个数字，也不参与重复。当前棋盘有效只要求已填数字不违反三类唯一性约束；它不保证存在完整解，因此
不能把求解失败当作无效判据。

三次独立扫描与一次统一扫描
~~~~~~~~~~~~~~~~~~~~~~~~~~

直接方法分别扫描九行、九列和九个宫格，每个区域维护九位布尔集合。总操作仍为常数 243 次，但规则被分散在三段
代码中。统一扫描在访问每个已填格时同时登记它所属的行、列和宫格。

宫格编号如何由坐标得到
~~~~~~~~~~~~~~~~~~~~~~

``row / 3`` 给出宫格行，``col / 3`` 给出宫格列，二者均为 0 到 2。按行编号得到：

.. math::

   box=(row/3)\times3+col/3

左上宫格为 0，右下宫格为 8。

位掩码如何表示数字集合
~~~~~~~~~~~~~~~~~~~~~~

数字 ``d`` 使用位 ``1 << (d-'1')``。每个区域掩码的九个低位分别表示 1 到 9 是否已经出现。读取格子时先与掩码
按位与；非零说明重复，返回 ``false``。未重复则按位或写入三个掩码。

状态演化
~~~~~~~~

若先处理 ``(0,0)='4'``，则第 3 位写入 ``rows[0]``、``columns[0]``、``boxes[0]``。再处理
``(2,2)='4'`` 时，行 2 和列 2 尚未出现 4，但 ``boxes[0]`` 的第 3 位已经为 1，因此立即发现宫格冲突。

为什么一次扫描覆盖全部规则
~~~~~~~~~~~~~~~~~~~~~~~~~~

每个已填格唯一属于一行、一列和一个宫格。算法在访问时同时检查三个所属集合，所以任意规则冲突都会在同一数字第二次
进入对应集合时被发现。反之，扫描结束未发现重复，三类区域中的已填数字均互异，棋盘按题目定义有效。

复杂度来源
~~~~~~~~~~

棋盘固定为 81 格，时间和额外空间都可视为 ``O(1)``。若推广到 ``N x N``，一次扫描时间为 ``O(N^2)``，行列宫格
集合空间为 ``O(N)`` 个掩码。

九语言实现
----------

C
~

.. code-block:: c

   bool isValidSudoku(char** board,int boardSize,int* boardColSize){
       int rows[9]={0},cols[9]={0},boxes[9]={0};
       for(int r=0;r<9;r++)for(int c=0;c<9;c++){char x=board[r][c];if(x=='.')continue;int bit=1<<(x-'1'),box=(r/3)*3+c/3;
           if((rows[r]&bit)||(cols[c]&bit)||(boxes[box]&bit))return false;rows[r]|=bit;cols[c]|=bit;boxes[box]|=bit;}
       return true;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isValidSudoku(self, board: list[list[str]]) -> bool:
           rows=[0]*9;columns=[0]*9;boxes=[0]*9
           for r in range(9):
               for c in range(9):
                   if board[r][c]==".":continue
                   bit=1<<(ord(board[r][c])-ord("1"));box=(r//3)*3+c//3
                   if rows[r]&bit or columns[c]&bit or boxes[box]&bit:return False
                   rows[r]|=bit;columns[c]|=bit;boxes[box]|=bit
           return True

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isValidSudoku(char[][] board){
           int[] rows=new int[9],cols=new int[9],boxes=new int[9];
           for(int r=0;r<9;r++)for(int c=0;c<9;c++){char x=board[r][c];if(x=='.')continue;int bit=1<<(x-'1'),box=(r/3)*3+c/3;
               if((rows[r]&bit)!=0||(cols[c]&bit)!=0||(boxes[box]&bit)!=0)return false;rows[r]|=bit;cols[c]|=bit;boxes[box]|=bit;}
           return true;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_valid_sudoku(board:Vec<Vec<char>>)->bool{
           let(mut rows,mut cols,mut boxes)=([0i32;9],[0i32;9],[0i32;9]);
           for r in 0..9{for c in 0..9{let x=board[r][c];if x=='.'{continue}let bit=1<<(x as u8-b'1');let b=(r/3)*3+c/3;
               if rows[r]&bit!=0||cols[c]&bit!=0||boxes[b]&bit!=0{return false}rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit;}}true
       }
   }

Go
~~

.. code-block:: go

   func isValidSudoku(board [][]byte)bool{
       rows,cols,boxes:=[9]int{},[9]int{},[9]int{}
       for r:=0;r<9;r++{for c:=0;c<9;c++{x:=board[r][c];if x=='.'{continue};bit:=1<<(x-'1');b:=(r/3)*3+c/3
           if rows[r]&bit!=0||cols[c]&bit!=0||boxes[b]&bit!=0{return false};rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit}};return true
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isValidSudoku(board:string[][]):boolean{
       const rows=new Array(9).fill(0),cols=new Array(9).fill(0),boxes=new Array(9).fill(0);
       for(let r=0;r<9;r++)for(let c=0;c<9;c++){const x=board[r][c];if(x===".")continue;const bit=1<<(x.charCodeAt(0)-49),b=Math.floor(r/3)*3+Math.floor(c/3);
           if((rows[r]&bit)||(cols[c]&bit)||(boxes[b]&bit))return false;rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit;}return true;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsValidSudoku(char[][] board){
           int[] rows=new int[9],cols=new int[9],boxes=new int[9];
           for(int r=0;r<9;r++)for(int c=0;c<9;c++){char x=board[r][c];if(x=='.')continue;int bit=1<<(x-'1'),b=(r/3)*3+c/3;
               if((rows[r]&bit)!=0||(cols[c]&bit)!=0||(boxes[b]&bit)!=0)return false;rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit;}return true;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function is_valid_sudoku(board)
       rows=zeros(Int,9);cols=zeros(Int,9);boxes=zeros(Int,9)
       for r in 1:9,c in 1:9;x=board[r][c];x=='.'&&continue;bit=1<<(Int(x-'1'));b=((r-1)÷3)*3+(c-1)÷3+1
           if rows[r]&bit!=0||cols[c]&bit!=0||boxes[b]&bit!=0;return false;end;rows[r]|=bit;cols[c]|=bit;boxes[b]|=bit
       end;true
   end

R
~

.. code-block:: r

   is_valid_sudoku <- function(board) {
       rows<-integer(9);cols<-integer(9);boxes<-integer(9)
       for(r in 1:9)for(c in 1:9){x<-board[[r]][[c]];if(x==".")next;bit<-bitwShiftL(1L,as.integer(x)-1L);b<-(r-1L)%/%3L*3L+(c-1L)%/%3L+1L
           if(bitwAnd(rows[[r]],bit)||bitwAnd(cols[[c]],bit)||bitwAnd(boxes[[b]],bit))return(FALSE);rows[[r]]<-bitwOr(rows[[r]],bit);cols[[c]]<-bitwOr(cols[[c]],bit);boxes[[b]]<-bitwOr(boxes[[b]],bit)};TRUE
   }