0079. Word Search
=================

题目信息
--------

:题号: 0079
:难度: Medium
:主题: 矩阵、深度优先搜索、回溯
:原题: `LeetCode 0079 <https://leetcode.com/problems/word-search/>`_
:访问状态: Available
:教学重点: 路径前缀、原地访问标记、严格恢复、指数分支

题目重述
--------

给定一个非空字符矩阵 ``board`` 和非空字符串 ``word``，判断能否从某个格子出发，依次沿上、下、左、
右相邻格子拼出完整单词。同一个格子在一条路径中最多使用一次。

题目保证 ``1 <= rows, cols <= 6``、``1 <= len(word) <= 15``，矩阵和单词只包含大小写英文字母。
矩阵必须在函数返回前恢复原状，成功路径和失败路径都不能留下访问标记。

自建示例
--------

可找到
~~~~~~

.. code-block:: text

   board =
   [
     ['A','B','C','E'],
     ['S','F','C','S'],
     ['A','D','E','E']
   ]
   word = "ABCCED"
   输出：true

不能重复使用格子
~~~~~~~~~~~~~~~~

.. code-block:: text

   board =
   [
     ['A','B'],
     ['C','D']
   ]
   word = "ABA"
   输出：false

第二个 ``A`` 不能重新使用起点格子。

问题抽象
--------

枚举每个格子作为起点。递归状态 ``dfs(row, col, index)`` 表示：此前路径已经匹配
``word[0:index]``，现在尝试用 ``board[row][col]`` 匹配 ``word[index]``。

当前格子匹配后，把它临时改成输入字符域之外的哨兵 ``'\0'``，阻止同一路径再次访问。四个方向全部
尝试结束后，无论成功或失败，都恢复原字符。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 原地标记的 DFS 回溯
     - ``O(rows × cols × 3^L)``
     - ``O(L)`` 递归栈
     - 主解法；不额外建立访问矩阵
   * - 独立 ``visited`` 矩阵
     - 同阶
     - ``O(rows × cols + L)``
     - 状态更显式，额外占用网格级空间

其中 ``L = len(word)``。起点最多有四个方向，后续步骤不能立即回到已标记的前一格，所以分支上界可写为
常数倍的 ``3^(L-1)``，简写为 ``O(3^L)``。

主解法：原地标记与恢复
----------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

进入 ``dfs(row, col, index)`` 时：

* 当前递归路径已经匹配 ``word[0:index]``；
* 路径中的格子彼此不同，并被临时标记为哨兵；
* 当前格子尚未加入路径；
* 除当前递归路径外，矩阵内容与输入一致。

先检查坐标和字符。若当前字符是单词最后一位，立即成功，不需要写入标记。否则保存原字符、写入哨兵，
递归探索四个方向，再恢复原字符。

为什么原地标记足以防止重复
~~~~~~~~~~~~~~~~~~~~~~~~~~

所有合法输入字符都是英文字母，``'\0'`` 不可能与 ``word[index]`` 相等。路径中的每个格子在进入下一层
前都被改为哨兵，因此任何后续递归再次到达该格子时都会在字符比较处失败。

递归返回后恢复字符，使兄弟分支可以重新使用该格子。访问限制只属于当前路径，不应永久删除格子。

正确性依据
~~~~~~~~~~

**路径合法。** 每次递归只移动到四邻格子。已使用格子带有哨兵，无法再次匹配，因此同一路径没有重复
格子。每层只在当前字符等于目标字符时继续，所以路径字符顺序正确。

**搜索完整。** 任意合法路径有一个起点，外层循环会枚举该起点。路径每一步必属于四个方向之一，递归会
尝试该方向。合法路径中的格子互不重复，不会被哨兵规则错误排除，因此完整路径能够被访问。

**恢复正确。** 写入哨兵前保存原字符，四个方向计算结束后统一恢复。短路成功也先汇总到 ``found``，
再执行恢复，所以函数返回时矩阵与进入该层前一致。

**终止性。** 每次成功进入下一层时 ``index`` 增加一，最大为 ``L-1``。边界、字符不匹配和访问标记都会
立即终止分支，递归树有限。

复杂度
~~~~~~

设矩阵大小为 ``m × n``、单词长度为 ``L``：

* 枚举起点需要 ``m × n``；
* 每个起点的搜索上界为常数倍 ``3^L``；
* 最坏时间复杂度为 ``O(mn × 3^L)``；
* 递归深度最多为 ``L``，工作空间为 ``O(L)``；
* 原地哨兵只占常数状态，矩阵在返回前恢复；
* R 的值语义实现把矩阵放入环境中管理，运行时可能产生复制，算法状态仍对应原地标记模型。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <string.h>

   static bool search_word(
       char **board,
       int rows,
       int cols,
       const char *word,
       int word_length,
       int index,
       int row,
       int col
   ) {
       if (row < 0 || row >= rows || col < 0 || col >= cols) {
           return false;
       }
       if (board[row][col] != word[index]) {
           return false;
       }
       if (index == word_length - 1) {
           return true;
       }

       const char saved = board[row][col];
       board[row][col] = '\0';

       const bool found =
           search_word(
               board, rows, cols, word, word_length,
               index + 1, row - 1, col
           ) ||
           search_word(
               board, rows, cols, word, word_length,
               index + 1, row + 1, col
           ) ||
           search_word(
               board, rows, cols, word, word_length,
               index + 1, row, col - 1
           ) ||
           search_word(
               board, rows, cols, word, word_length,
               index + 1, row, col + 1
           );

       board[row][col] = saved;
       return found;
   }

   bool exist(
       char **board,
       int boardSize,
       int *boardColSize,
       char *word
   ) {
       const int cols = boardColSize[0];
       const int word_length = (int)strlen(word);

       if (word_length > boardSize * cols) {
           return false;
       }

       for (int row = 0; row < boardSize; ++row) {
           for (int col = 0; col < cols; ++col) {
               if (search_word(
                   board,
                   boardSize,
                   cols,
                   word,
                   word_length,
                   0,
                   row,
                   col
               )) {
                   return true;
               }
           }
       }
       return false;
   }

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
       bool dfs(
           std::vector<std::vector<char>>& board,
           const std::string& word,
           int index,
           int row,
           int col
       ) {
           const int rows = static_cast<int>(board.size());
           const int cols = static_cast<int>(board[0].size());

           if (row < 0 || row >= rows || col < 0 || col >= cols) {
               return false;
           }
           if (board[row][col] != word[index]) {
               return false;
           }
           if (index + 1 == static_cast<int>(word.size())) {
               return true;
           }

           const char saved = board[row][col];
           board[row][col] = '\0';

           const bool found =
               dfs(board, word, index + 1, row - 1, col) ||
               dfs(board, word, index + 1, row + 1, col) ||
               dfs(board, word, index + 1, row, col - 1) ||
               dfs(board, word, index + 1, row, col + 1);

           board[row][col] = saved;
           return found;
       }

   public:
       bool exist(
           std::vector<std::vector<char>>& board,
           std::string word
       ) {
           const int rows = static_cast<int>(board.size());
           const int cols = static_cast<int>(board[0].size());

           if (word.size() > board.size() * board[0].size()) {
               return false;
           }

           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (dfs(board, word, 0, row, col)) {
                       return true;
                   }
               }
           }
           return false;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def exist(
           self,
           board: list[list[str]],
           word: str,
       ) -> bool:
           rows = len(board)
           cols = len(board[0])

           if len(word) > rows * cols:
               return False

           def dfs(row: int, col: int, index: int) -> bool:
               if not (0 <= row < rows and 0 <= col < cols):
                   return False
               if board[row][col] != word[index]:
                   return False
               if index + 1 == len(word):
                   return True

               saved = board[row][col]
               board[row][col] = "\0"

               found = (
                   dfs(row - 1, col, index + 1)
                   or dfs(row + 1, col, index + 1)
                   or dfs(row, col - 1, index + 1)
                   or dfs(row, col + 1, index + 1)
               )

               board[row][col] = saved
               return found

           return any(
               dfs(row, col, 0)
               for row in range(rows)
               for col in range(cols)
           )

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean exist(char[][] board, String word) {
           int rows = board.length;
           int cols = board[0].length;

           if (word.length() > rows * cols) {
               return false;
           }

           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (dfs(board, word, 0, row, col)) {
                       return true;
                   }
               }
           }
           return false;
       }

       private boolean dfs(
           char[][] board,
           String word,
           int index,
           int row,
           int col
       ) {
           int rows = board.length;
           int cols = board[0].length;

           if (row < 0 || row >= rows || col < 0 || col >= cols) {
               return false;
           }
           if (board[row][col] != word.charAt(index)) {
               return false;
           }
           if (index + 1 == word.length()) {
               return true;
           }

           char saved = board[row][col];
           board[row][col] = '\0';

           boolean found =
               dfs(board, word, index + 1, row - 1, col) ||
               dfs(board, word, index + 1, row + 1, col) ||
               dfs(board, word, index + 1, row, col - 1) ||
               dfs(board, word, index + 1, row, col + 1);

           board[row][col] = saved;
           return found;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn exist(
           mut board: Vec<Vec<char>>,
           word: String,
       ) -> bool {
           fn dfs(
               board: &mut [Vec<char>],
               word: &[char],
               index: usize,
               row: isize,
               col: isize,
           ) -> bool {
               if row < 0 || col < 0 {
                   return false;
               }

               let row_index = row as usize;
               let col_index = col as usize;
               if row_index >= board.len() ||
                   col_index >= board[0].len() {
                   return false;
               }
               if board[row_index][col_index] != word[index] {
                   return false;
               }
               if index + 1 == word.len() {
                   return true;
               }

               let saved = board[row_index][col_index];
               board[row_index][col_index] = '\0';

               let found =
                   dfs(board, word, index + 1, row - 1, col) ||
                   dfs(board, word, index + 1, row + 1, col) ||
                   dfs(board, word, index + 1, row, col - 1) ||
                   dfs(board, word, index + 1, row, col + 1);

               board[row_index][col_index] = saved;
               found
           }

           let letters: Vec<char> = word.chars().collect();
           let rows = board.len();
           let cols = board[0].len();

           if letters.len() > rows * cols {
               return false;
           }

           for row in 0..rows {
               for col in 0..cols {
                   if dfs(
                       &mut board,
                       &letters,
                       0,
                       row as isize,
                       col as isize,
                   ) {
                       return true;
                   }
               }
           }
           false
       }
   }

Go
~~

.. code-block:: go

   func exist(board [][]byte, word string) bool {
       rows := len(board)
       cols := len(board[0])

       if len(word) > rows*cols {
           return false
       }

       var dfs func(row int, col int, index int) bool
       dfs = func(row int, col int, index int) bool {
           if row < 0 || row >= rows || col < 0 || col >= cols {
               return false
           }
           if board[row][col] != word[index] {
               return false
           }
           if index+1 == len(word) {
               return true
           }

           saved := board[row][col]
           board[row][col] = 0

           found :=
               dfs(row-1, col, index+1) ||
                   dfs(row+1, col, index+1) ||
                   dfs(row, col-1, index+1) ||
                   dfs(row, col+1, index+1)

           board[row][col] = saved
           return found
       }

       for row := 0; row < rows; row++ {
           for col := 0; col < cols; col++ {
               if dfs(row, col, 0) {
                   return true
               }
           }
       }
       return false
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function exist(board: string[][], word: string): boolean {
       const rows = board.length;
       const cols = board[0].length;

       if (word.length > rows * cols) {
           return false;
       }

       const dfs = (
           row: number,
           col: number,
           index: number,
       ): boolean => {
           if (
               row < 0 || row >= rows ||
               col < 0 || col >= cols
           ) {
               return false;
           }
           if (board[row][col] !== word[index]) {
               return false;
           }
           if (index + 1 === word.length) {
               return true;
           }

           const saved = board[row][col];
           board[row][col] = "\0";

           const found =
               dfs(row - 1, col, index + 1) ||
               dfs(row + 1, col, index + 1) ||
               dfs(row, col - 1, index + 1) ||
               dfs(row, col + 1, index + 1);

           board[row][col] = saved;
           return found;
       };

       for (let row = 0; row < rows; row++) {
           for (let col = 0; col < cols; col++) {
               if (dfs(row, col, 0)) {
                   return true;
               }
           }
       }
       return false;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool Exist(char[][] board, string word) {
           int rows = board.Length;
           int cols = board[0].Length;

           if (word.Length > rows * cols) {
               return false;
           }

           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (Dfs(board, word, 0, row, col)) {
                       return true;
                   }
               }
           }
           return false;
       }

       private static bool Dfs(
           char[][] board,
           string word,
           int index,
           int row,
           int col
       ) {
           int rows = board.Length;
           int cols = board[0].Length;

           if (row < 0 || row >= rows || col < 0 || col >= cols) {
               return false;
           }
           if (board[row][col] != word[index]) {
               return false;
           }
           if (index + 1 == word.Length) {
               return true;
           }

           char saved = board[row][col];
           board[row][col] = '\0';

           bool found =
               Dfs(board, word, index + 1, row - 1, col) ||
               Dfs(board, word, index + 1, row + 1, col) ||
               Dfs(board, word, index + 1, row, col - 1) ||
               Dfs(board, word, index + 1, row, col + 1);

           board[row][col] = saved;
           return found;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function exist(board::Matrix{Char}, word::String)::Bool
       letters = collect(word)
       rows, cols = size(board)

       length(letters) > rows * cols && return false

       function dfs(
           row::Int,
           col::Int,
           index::Int,
       )::Bool
           if row < 1 || row > rows || col < 1 || col > cols
               return false
           end
           if board[row, col] != letters[index]
               return false
           end
           if index == length(letters)
               return true
           end

           saved = board[row, col]
           board[row, col] = '\0'

           found =
               dfs(row - 1, col, index + 1) ||
               dfs(row + 1, col, index + 1) ||
               dfs(row, col - 1, index + 1) ||
               dfs(row, col + 1, index + 1)

           board[row, col] = saved
           return found
       end

       for row in 1:rows
           for col in 1:cols
               dfs(row, col, 1) && return true
           end
       end
       return false
   end

R
~

.. code-block:: r

   exist <- function(board, word) {
     letters <- strsplit(word, "", fixed = TRUE)[[1]]
     rows <- nrow(board)
     cols <- ncol(board)

     if (length(letters) > rows * cols) {
       return(FALSE)
     }

     state <- new.env(parent = emptyenv())
     state$board <- board

     dfs <- function(row, col, index) {
       if (row < 1L || row > rows || col < 1L || col > cols) {
         return(FALSE)
       }
       if (state$board[row, col] != letters[[index]]) {
         return(FALSE)
       }
       if (index == length(letters)) {
         return(TRUE)
       }

       saved <- state$board[row, col]
       state$board[row, col] <- "#"

       found <-
         dfs(row - 1L, col, index + 1L) ||
         dfs(row + 1L, col, index + 1L) ||
         dfs(row, col - 1L, index + 1L) ||
         dfs(row, col + 1L, index + 1L)

       state$board[row, col] <- saved
       found
     }

     for (row in seq_len(rows)) {
       for (col in seq_len(cols)) {
         if (dfs(row, col, 1L)) {
           return(TRUE)
         }
       }
     }
     FALSE
   }

验证计划与证据
--------------

覆盖单格、单行、单列、必须转弯、无解、字符重复和尝试复用格子的情况；对小随机矩阵与独立
``visited`` 基准对拍，并在每次调用后比较矩阵是否完全恢复。可用语言执行编译和运行测试。

关键边界
--------

* ``len(word) > rows × cols`` 时一定无解，可以直接返回；
* 哨兵必须位于输入字符域之外；
* 找到答案后也必须恢复当前格子；
* 相邻只包括上下左右，不包括对角线；
* 同一格子可以被不同起点或不同分支使用，只不能在同一路径中重复；
* Rust 接口按值接收矩阵，在局部副本上标记；其他可变接口需要显式恢复调用者矩阵。

易错点
------

* 成功时直接 ``return true``，跳过恢复步骤并污染矩阵；
* 使用全局永久访问集合，错误阻止其他起点复用格子；
* 在字符匹配前就写入哨兵，丢失比较所需原值；
* 把对角线也当成合法移动；
* 复杂度写成 ``O(mn)``，忽略回溯分支；
* 只检查路径长度，不检查每一位字符是否匹配。

本题新增知识
------------

* 网格回溯可以复用输入格子保存当前路径访问状态；
* 短路搜索仍要把恢复动作放在统一返回之前；
* 第一层最多四个方向、后续层最多三个新方向，可得到更紧的指数上界。

本题强化知识
------------

* 0037 的“写入选择、递归、撤销选择”继续应用到网格路径；
* 0073 的分阶段修改再次说明临时状态必须在边界处完整恢复；
* ASCII 字符域证明允许选择不会与输入碰撞的固定哨兵。

关联题目
--------

* `0037. Sudoku Solver <0037-sudoku-solver.rst>`_
* `0051. N-Queens <0051-n-queens.rst>`_

最小自检
--------

#. ``dfs(row, col, index)`` 进入时，哪些字符已经匹配？
#. 为什么 ``'\0'`` 可以作为访问标记？
#. 找到单词后为什么仍需恢复矩阵？
#. 为什么后续递归分支常用三而不是四估计？
#. ``word`` 比格子总数更长时为何可以立即失败？

答案要点
~~~~~~~~

#. ``word[0:index]``，当前格子负责匹配 ``word[index]``。
#. 输入只含英文字母，哨兵不会与任何目标字符相等。
#. 访问状态只属于当前路径，函数契约要求输入恢复。
#. 前一格已经标记，不能立即返回，剩余最多三个未排除方向。
#. 合法路径不能重复格子，可使用位置数量不足。
