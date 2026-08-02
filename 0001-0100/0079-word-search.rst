0079. Word Search
=================

题目信息
--------

:题号: 0079
:难度: Medium
:主题: 矩阵、深度优先搜索、回溯
:原题: `LeetCode 0079 <https://leetcode.com/problems/word-search/>`_
:重点: 四方向相邻、字符顺序、单路径格子不可复用、起点枚举

题目重述
--------

给定 ``m × n`` 字符矩阵 ``board`` 和字符串 ``word``，判断能否从某个格子出发，通过上、下、左、右相邻格子依次拼出完整单词。同一格子在同一条构造路径中最多使用一次。

约束为 ``1 <= m, n <= 6``、``1 <= word.length <= 15``，矩阵和单词只包含英文字母。

自建示例
--------

.. code-block:: text

   输入：
   board = [["A","X","C"],["D","E","F"],["G","H","I"]]
   word = "AXCFI"
   输出：true

路径依次经过 ``A -> X -> C -> F -> I``，每一步都移动到上下左右相邻格子。

.. code-block:: text

   输入：同一矩阵，word = "AXA"
   输出：false

矩阵中只有一个 ``A``，路径不能返回并复用起点。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <array>
   #include <string>
   #include <vector>

   class Solution {
   private:
       bool visitedDfs(const std::vector<std::vector<char>>& board,
                       std::vector<std::vector<char>>& visited,
                       const std::string& word, int row, int col, int index) {
           if (row < 0 || row >= static_cast<int>(board.size()) ||
               col < 0 || col >= static_cast<int>(board[0].size()) ||
               visited[row][col] || board[row][col] != word[index]) return false;
           if (index + 1 == static_cast<int>(word.size())) return true;
           visited[row][col] = true;
           bool found = visitedDfs(board, visited, word, row + 1, col, index + 1) ||
                        visitedDfs(board, visited, word, row - 1, col, index + 1) ||
                        visitedDfs(board, visited, word, row, col + 1, index + 1) ||
                        visitedDfs(board, visited, word, row, col - 1, index + 1);
           visited[row][col] = false;
           return found;
       }

       bool inPlaceDfs(std::vector<std::vector<char>>& board,
                       const std::string& word, int row, int col, int index) {
           if (row < 0 || row >= static_cast<int>(board.size()) ||
               col < 0 || col >= static_cast<int>(board[0].size()) ||
               board[row][col] != word[index]) return false;
           if (index + 1 == static_cast<int>(word.size())) return true;
           char saved = board[row][col];
           board[row][col] = '\0';
           bool found = inPlaceDfs(board, word, row + 1, col, index + 1) ||
                        inPlaceDfs(board, word, row - 1, col, index + 1) ||
                        inPlaceDfs(board, word, row, col + 1, index + 1) ||
                        inPlaceDfs(board, word, row, col - 1, index + 1);
           board[row][col] = saved;
           return found;
       }

       bool frequencyPruned(std::vector<std::vector<char>>& board, std::string word) {
           if (word.size() > board.size() * board[0].size()) return false;
           std::array<int,128> count{};
           for (const auto& row : board) for (char ch : row) ++count[static_cast<unsigned char>(ch)];
           for (char ch : word) if (--count[static_cast<unsigned char>(ch)] < 0) return false;

           std::array<int,128> board_count{};
           for (const auto& row : board) for (char ch : row) ++board_count[static_cast<unsigned char>(ch)];
           if (board_count[static_cast<unsigned char>(word.front())] >
               board_count[static_cast<unsigned char>(word.back())]) std::reverse(word.begin(), word.end());

           for (int row = 0; row < static_cast<int>(board.size()); ++row)
               for (int col = 0; col < static_cast<int>(board[0].size()); ++col)
                   if (inPlaceDfs(board, word, row, col, 0)) return true;
           return false;
       }

   public:
       bool exist(std::vector<std::vector<char>>& board, std::string word) {
           return frequencyPruned(board, word);
       }
   };

题解
----

起点枚举为什么必要
~~~~~~~~~~~~~~~~

单词首字符可能出现在任意格子，题目没有固定起点。算法枚举所有格子；不匹配首字符的起点立即失败，匹配者进入路径搜索。

递归状态保存什么
~~~~~~~~~~~~~~~~

``dfs(row,col,index)`` 表示此前路径已匹配 ``word[0:index]``，现在尝试用当前位置匹配 ``word[index]``。当前位置越界、已占用或字符不同都立即返回假。

为什么必须标记占用
~~~~~~~~~~~~~~~~

仅限制“不能立即回头”不够，路径还可能绕一圈再次进入更早格子。把当前格改成字符域外哨兵，可让本路径的所有后续递归都拒绝该位置。

选择与恢复顺序
~~~~~~~~~~~~~~

当前字符匹配后，先保存原字符，再写哨兵，随后尝试四个方向。无论某个方向成功还是全部失败，都要先恢复原字符，再向调用者返回。

.. list-table::
   :header-rows: 1

   * - index
     - 当前格
     - 状态
   * - 0
     - A(0,0)
     - 标记并寻找 B
   * - 1
     - B(0,1)
     - 标记并寻找 C
   * - 2
     - C(0,2)
     - 标记并寻找 F
   * - 3
     - F(1,2)
     - 标记并寻找 I
   * - 4
     - I(2,2)
     - 匹配完整单词
   * - 返回
     - 所有路径格
     - 逐层恢复

为什么成功短路仍会恢复
~~~~~~~~~~~~~~~~~~~~~~

四方向表达式可能在第一个成功分支后短路，但结果先保存到 ``found``，恢复语句位于返回之前，因此当前层仍会执行恢复。上层也按相同结构恢复自己的格子。

频次预检排除了什么
~~~~~~~~~~~~~~~~~~

若单词长度超过格子数，或某字符需求多于矩阵总量，不可能存在路径，可在线性预检后直接失败。这只检查必要条件，不会误删可行路径。

为什么可以反转搜索单词
~~~~~~~~~~~~~~~~~~~~~~

一条路径正向拼出单词，当且仅当同一路径反向拼出逆序单词。若末字符在矩阵中更少，从它开始能减少起点和早期分支；答案真假不变。

为什么不重用格子也不遗漏路径
~~~~~~~~~~~~~~~~~~~~~~~~~~

标记保证当前路径中的每个坐标唯一。对每个合法路径前缀，递归完整尝试四个相邻坐标，因此目标路径的下一步必被枚举；所有起点也被扫描，所以不会遗漏。

复杂度来源
~~~~~~~~~~

设单词长度 ``L``。起点最多 ``rows*cols`` 个，首步后通常最多三个未占用方向，时间上界 ``O(rows*cols*3^L)``；递归栈 ``O(L)``。原地标记不需要 visited 矩阵。

九语言实现
----------

C
~

.. code-block:: c

   static bool dfs(char**b,int m,int n,char*w,int r,int c,int i){if(r<0||r>=m||c<0||c>=n||b[r][c]!=w[i])return false;if(w[i+1]=='\0')return true;char saved=b[r][c];b[r][c]='\0';bool ok=dfs(b,m,n,w,r+1,c,i+1)||dfs(b,m,n,w,r-1,c,i+1)||dfs(b,m,n,w,r,c+1,i+1)||dfs(b,m,n,w,r,c-1,i+1);b[r][c]=saved;return ok;}
   bool exist(char**b,int m,int*n,char*w){for(int r=0;r<m;r++)for(int c=0;c<n[0];c++)if(dfs(b,m,n[0],w,r,c,0))return true;return false;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def exist(self, board: list[list[str]], word: str) -> bool:
           rows,cols=len(board),len(board[0])
           def dfs(r,c,i):
               if r<0 or r==rows or c<0 or c==cols or board[r][c]!=word[i]:return False
               if i==len(word)-1:return True
               saved=board[r][c];board[r][c]='\0'
               found=dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i+1)
               board[r][c]=saved;return found
           return any(dfs(r,c,0) for r in range(rows) for c in range(cols))

Java
~~~~

.. code-block:: java

   class Solution {char[][]b;String w;int m,n;boolean dfs(int r,int c,int i){if(r<0||r==m||c<0||c==n||b[r][c]!=w.charAt(i))return false;if(i+1==w.length())return true;char saved=b[r][c];b[r][c]='\0';boolean ok=dfs(r+1,c,i+1)||dfs(r-1,c,i+1)||dfs(r,c+1,i+1)||dfs(r,c-1,i+1);b[r][c]=saved;return ok;}public boolean exist(char[][]board,String word){b=board;w=word;m=b.length;n=b[0].length;for(int r=0;r<m;r++)for(int c=0;c<n;c++)if(dfs(r,c,0))return true;return false;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn exist(mut b:Vec<Vec<char>>,w:String)->bool{fn dfs(b:&mut Vec<Vec<char>>,w:&[u8],r:i32,c:i32,i:usize)->bool{if r<0||c<0||r as usize>=b.len()||c as usize>=b[0].len()||b[r as usize][c as usize]as u8!=w[i]{return false}if i+1==w.len(){return true}let saved=b[r as usize][c as usize];b[r as usize][c as usize]='\0';let ok=dfs(b,w,r+1,c,i+1)||dfs(b,w,r-1,c,i+1)||dfs(b,w,r,c+1,i+1)||dfs(b,w,r,c-1,i+1);b[r as usize][c as usize]=saved;ok}for r in 0..b.len(){for c in 0..b[0].len(){if dfs(&mut b,w.as_bytes(),r as i32,c as i32,0){return true}}}false}}

Go
~~

.. code-block:: go

   func exist(b [][]byte,w string)bool{m,n:=len(b),len(b[0]);var dfs func(int,int,int)bool;dfs=func(r,c,i int)bool{if r<0||r==m||c<0||c==n||b[r][c]!=w[i]{return false};if i+1==len(w){return true};saved:=b[r][c];b[r][c]=0;ok:=dfs(r+1,c,i+1)||dfs(r-1,c,i+1)||dfs(r,c+1,i+1)||dfs(r,c-1,i+1);b[r][c]=saved;return ok};for r:=0;r<m;r++{for c:=0;c<n;c++{if dfs(r,c,0){return true}}};return false}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function exist(b:string[][],w:string):boolean{const m=b.length,n=b[0].length;const dfs=(r:number,c:number,i:number):boolean=>{if(r<0||r===m||c<0||c===n||b[r][c]!==w[i])return false;if(i+1===w.length)return true;const saved=b[r][c];b[r][c]='\0';const ok=dfs(r+1,c,i+1)||dfs(r-1,c,i+1)||dfs(r,c+1,i+1)||dfs(r,c-1,i+1);b[r][c]=saved;return ok;};for(let r=0;r<m;r++)for(let c=0;c<n;c++)if(dfs(r,c,0))return true;return false;}

C#
~~

.. code-block:: csharp

   public class Solution {char[][]b;string w;int m,n;bool Dfs(int r,int c,int i){if(r<0||r==m||c<0||c==n||b[r][c]!=w[i])return false;if(i+1==w.Length)return true;char saved=b[r][c];b[r][c]='\0';bool ok=Dfs(r+1,c,i+1)||Dfs(r-1,c,i+1)||Dfs(r,c+1,i+1)||Dfs(r,c-1,i+1);b[r][c]=saved;return ok;}public bool Exist(char[][]board,string word){b=board;w=word;m=b.Length;n=b[0].Length;for(int r=0;r<m;r++)for(int c=0;c<n;c++)if(Dfs(r,c,0))return true;return false;}}

Julia
~~~~~

.. code-block:: julia

   function exist_word!(b,w)
       chars=collect(w);m,n=size(b)
       function dfs(r,c,i);(r<1||r>m||c<1||c>n||b[r,c]!=chars[i])&&return false;i==length(chars)&&return true;saved=b[r,c];b[r,c]='\0';ok=dfs(r+1,c,i+1)||dfs(r-1,c,i+1)||dfs(r,c+1,i+1)||dfs(r,c-1,i+1);b[r,c]=saved;ok;end
       any(dfs(r,c,1) for r in 1:m for c in 1:n)
   end

R
~

.. code-block:: r

   exist_word <- function(board,word){chars<-strsplit(word,"",fixed=TRUE)[[1]];m<-nrow(board);n<-ncol(board);dfs<-function(r,c,i){if(r<1L||r>m||c<1L||c>n||board[r,c]!=chars[[i]])return(FALSE);if(i==length(chars))return(TRUE);saved<-board[r,c];board[r,c]<<-"";ok<-dfs(r+1L,c,i+1L)||dfs(r-1L,c,i+1L)||dfs(r,c+1L,i+1L)||dfs(r,c-1L,i+1L);board[r,c]<<-saved;ok};for(r in seq_len(m))for(c in seq_len(n))if(dfs(r,c,1L))return(TRUE);FALSE}
