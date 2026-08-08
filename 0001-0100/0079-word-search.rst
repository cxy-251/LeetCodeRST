0079. Word Search
=================

题目信息
--------

:题号: 0079. 单词搜索
:难度: Medium
:主题: 矩阵、深度优先搜索、回溯
:原题: `LeetCode 0079 <https://leetcode.com/problems/word-search/>`_
:重点: 从枚举起点，推导到路径占用回溯，再加入频次与搜索方向剪枝

题目重述
--------

给定一个 ``m × n`` 的字符矩阵 ``board`` 和字符串 ``word``，判断矩阵中是否存在一条路径，
使路径上的字符按顺序组成 ``word``。

路径可以从任意格子开始。每一步只能移动到当前格子的上、下、左、右相邻格子；
同一个格子在同一条路径中最多使用一次。

约束如下：

* ``1 <= m, n <= 6``；
* ``1 <= word.length <= 15``；
* ``board`` 和 ``word`` 只包含英文字母。

自建示例
--------

.. code-block:: text

   输入：
   board = [["A","X","C"],
            ["D","E","F"],
            ["G","H","I"]]
   word = "AXCFI"

   输出：true

可以沿 ``A -> X -> C -> F -> I`` 移动，每一步都进入上下左右相邻格子。

.. code-block:: text

   输入：
   board = [["A","B"],
            ["C","D"]]
   word = "ABA"

   输出：false

最后一个 ``A`` 只能复用起点，但同一条路径中不能重复使用格子。

.. code-block:: text

   输入：
   board = [["A","A"],
            ["B","C"]]
   word = "AAA"

   输出：false

矩阵中只有两个 ``A``，字符频次预检即可判定无解。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <array>
   #include <string>
   #include <vector>

   class Solution {
   private:
       bool visitedDfs(
           const std::vector<std::vector<char>>& board,
           const std::string& word,
           int row,
           int col,
           int index,
           std::vector<std::vector<char>>& visited
       ) {
           int rows = static_cast<int>(board.size());
           int cols = static_cast<int>(board[0].size());

           if (row < 0 || row >= rows || col < 0 || col >= cols) {
               return false;
           }
           if (visited[row][col] || board[row][col] != word[index]) {
               return false;
           }
           if (index + 1 == static_cast<int>(word.size())) {
               return true;
           }

           visited[row][col] = true;

           bool found =
               visitedDfs(board, word, row + 1, col, index + 1, visited) ||
               visitedDfs(board, word, row - 1, col, index + 1, visited) ||
               visitedDfs(board, word, row, col + 1, index + 1, visited) ||
               visitedDfs(board, word, row, col - 1, index + 1, visited);

           visited[row][col] = false;
           return found;
       }

       bool searchWithVisited(
           const std::vector<std::vector<char>>& board,
           const std::string& word
       ) {
           int rows = static_cast<int>(board.size());
           int cols = static_cast<int>(board[0].size());
           std::vector<std::vector<char>> visited(
               rows,
               std::vector<char>(cols, false)
           );

           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (visitedDfs(board, word, row, col, 0, visited)) {
                       return true;
                   }
               }
           }
           return false;
       }

       bool inPlaceDfs(
           std::vector<std::vector<char>>& board,
           const std::string& word,
           int row,
           int col,
           int index
       ) {
           int rows = static_cast<int>(board.size());
           int cols = static_cast<int>(board[0].size());

           if (row < 0 || row >= rows || col < 0 || col >= cols) {
               return false;
           }
           if (board[row][col] != word[index]) {
               return false;
           }
           if (index + 1 == static_cast<int>(word.size())) {
               return true;
           }

           char saved = board[row][col];
           board[row][col] = '\0';

           bool found =
               inPlaceDfs(board, word, row + 1, col, index + 1) ||
               inPlaceDfs(board, word, row - 1, col, index + 1) ||
               inPlaceDfs(board, word, row, col + 1, index + 1) ||
               inPlaceDfs(board, word, row, col - 1, index + 1);

           board[row][col] = saved;
           return found;
       }

       bool searchInPlace(
           std::vector<std::vector<char>>& board,
           const std::string& word
       ) {
           int rows = static_cast<int>(board.size());
           int cols = static_cast<int>(board[0].size());

           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (inPlaceDfs(board, word, row, col, 0)) {
                       return true;
                   }
               }
           }
           return false;
       }

       bool frequencyPrunedSearch(
           std::vector<std::vector<char>>& board,
           std::string word
       ) {
           int rows = static_cast<int>(board.size());
           int cols = static_cast<int>(board[0].size());

           if (static_cast<int>(word.size()) > rows * cols) {
               return false;
           }

           std::array<int, 128> available{};
           for (const auto& row : board) {
               for (char ch : row) {
                   ++available[static_cast<unsigned char>(ch)];
               }
           }

           std::array<int, 128> remaining = available;
           for (char ch : word) {
               int code = static_cast<unsigned char>(ch);
               if (--remaining[code] < 0) {
                   return false;
               }
           }

           int first = static_cast<unsigned char>(word.front());
           int last = static_cast<unsigned char>(word.back());
           if (available[first] > available[last]) {
               std::reverse(word.begin(), word.end());
           }

           return searchInPlace(board, word);
       }

   public:
       bool exist(
           std::vector<std::vector<char>>& board,
           std::string word
       ) {
           return frequencyPrunedSearch(board, word);
       }
   };

题解
----

路径状态
~~~~~~~~

枚举每个格子作为起点。递归状态 ``dfs(row, col, index)`` 表示：

* ``word[0:index)`` 已由当前路径匹配；
* 现在尝试用 ``board[row][col]`` 匹配 ``word[index]``；
* 当前路径已经使用过的格子不能再次进入。

越界、字符不匹配或格子已被当前路径占用时，该分支立即失败。
当前位置匹配最后一个字符时，完整单词已经形成，可以返回成功。

选择与恢复
~~~~~~~~~~

字符匹配后，需要暂时占用当前格子，再尝试四个方向。独立访问矩阵直接记录占用状态；
原地方案把当前字符暂时改成字符域外的 ``'\0'``，从而复用矩阵本身保存状态。

四个方向搜索结束后，必须恢复原字符。成功分支也先写入 ``found``，恢复后再返回，
因此公开方法结束时矩阵内容与输入一致。

.. list-table::
   :header-rows: 1

   * - 阶段
     - 当前状态
     - 动作
   * - 匹配
     - 当前字符等于 ``word[index]``
     - 暂时占用当前格
   * - 扩展
     - 还未匹配完整单词
     - 尝试四个相邻格
   * - 回退
     - 当前分支成功或失败
     - 恢复当前格
   * - 继续
     - 回到上一层
     - 尝试下一方向或起点

格子不可复用
~~~~~~~~~~~~

只禁止立即返回上一格并不充分，因为路径可能绕一圈后再次进入更早的格子。
访问标记覆盖整条当前路径，任何已占用坐标都会被后续递归拒绝。

回溯离开一层时恢复标记，使同一格子仍可被其他起点或其他分支使用。
限制只作用于单条搜索路径，不会永久删除矩阵位置。

起点与方向剪枝
~~~~~~~~~~~~~~

单词首字符可能位于任意格子，因此所有起点都要被考虑；不匹配首字符的起点会在递归入口立即失败。

搜索前先比较字符总量。若单词长度超过格子数，或某字符需求超过矩阵中的可用数量，
路径一定不存在，可以直接返回 ``false``。

一条路径正向拼出 ``word``，反向沿同一路径就会拼出逆序单词。
因此可以从首尾字符中出现次数更少的一端开始搜索，减少候选起点和早期分支，
同时不改变答案真假。

搜索完整性
~~~~~~~~~~

对任意可行路径，外层循环会枚举到它的起点。递归在每一步完整尝试四个相邻格，
其中必然包含目标路径的下一格；访问标记只排除路径中已经使用的坐标，
所以合法路径不会被剪掉。

同一条坐标路径只按确定的起点和移动序列被访问。题目只要求判断是否存在，
找到任意完整路径后即可停止。

复杂度
~~~~~~

设矩阵有 ``m * n`` 个格子，单词长度为 ``L``。每个格子都可能作为起点；
首步之后通常最多继续到三个未占用方向，最坏时间可写为 ``O(mn * 3^L)``。

频次预检需要 ``O(mn + L)`` 时间。递归栈深度最多为 ``L``，原地标记除递归栈外
只使用固定大小的频次数组，因此额外空间为 ``O(L)``。
