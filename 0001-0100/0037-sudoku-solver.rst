0037. Sudoku Solver
===================

题目信息
--------

:题号: 0037. 解数独
:难度: Hard
:主题: 矩阵、回溯、位掩码、约束搜索
:原题: `LeetCode 0037 <https://leetcode.com/problems/sudoku-solver/>`_
:重点: 从逐候选重复扫描约束，推导到位掩码增量维护，并优先搜索候选最少的空格

题目重述
--------

给定一个未完成的 ``9 x 9`` 数独棋盘 ``board``，把所有空格填成数字，使最终棋盘满足以下规则：

#. 每一行都包含数字 ``1`` 到 ``9``，且每个数字恰好出现一次；
#. 每一列都包含数字 ``1`` 到 ``9``，且每个数字恰好出现一次；
#. 每个 ``3 x 3`` 九宫格都包含数字 ``1`` 到 ``9``，且每个数字恰好出现一次。

字符 ``'.'`` 表示空格，其余格子为 ``'1'`` 到 ``'9'``。必须直接修改 ``board``，不需要返回新的棋盘。题目保证
初始棋盘符合数独规则，并且存在唯一解。

自建示例
--------

普通棋盘：

.. code-block:: text

   输入：
   ["53..7....",
    "6..195...",
    ".98....6.",
    "8...6...3",
    "4..8.3..1",
    "7...2...6",
    ".6....28.",
    "...419..5",
    "....8..79"]

   修改后：
   ["534678912",
    "672195348",
    "198342567",
    "859761423",
    "426853791",
    "713924856",
    "961537284",
    "287419635",
    "345286179"]

* 只缺一个数字：把上面完整棋盘的 ``board[0][0]`` 改为 ``'.'``，求解后该位置恢复为 ``'5'``；
* 已经填满：输入上面的完整棋盘时，不需要尝试任何候选，棋盘保持不变；
* 多个候选：普通棋盘初始时，``(0, 2)`` 可填 ``{1, 2, 4}``，而 ``(4, 4)`` 只能填 ``5``，优先处理后者
  可以立即确定一个位置。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <array>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       static constexpr int allDigits = (1 << 9) - 1;

       std::array<int, 9> rows{};
       std::array<int, 9> columns{};
       std::array<int, 9> boxes{};
       std::vector<std::pair<int, int>> emptyCells;

       int boxIndex(int row, int col) {
           return (row / 3) * 3 + col / 3;
       }

       bool canPlaceByScanning(
           const std::vector<std::vector<char>>& board,
           int row,
           int col,
           char digit
       ) {
           for (int index = 0; index < 9; ++index) {
               if (board[row][index] == digit || board[index][col] == digit) {
                   return false;
               }
           }

           const int startRow = row / 3 * 3;
           const int startCol = col / 3 * 3;
           for (int deltaRow = 0; deltaRow < 3; ++deltaRow) {
               for (int deltaCol = 0; deltaCol < 3; ++deltaCol) {
                   if (board[startRow + deltaRow][startCol + deltaCol] == digit) {
                       return false;
                   }
               }
           }
           return true;
       }

       bool scanBacktracking(std::vector<std::vector<char>>& board, int position) {
           if (position == 81) {
               return true;
           }
           const int row = position / 9;
           const int col = position % 9;
           if (board[row][col] != '.') {
               return scanBacktracking(board, position + 1);
           }

           for (char digit = '1'; digit <= '9'; ++digit) {
               if (!canPlaceByScanning(board, row, col, digit)) {
                   continue;
               }
               board[row][col] = digit;
               if (scanBacktracking(board, position + 1)) {
                   return true;
               }
               board[row][col] = '.';
           }
           return false;
       }

       void initializeMasks(const std::vector<std::vector<char>>& board) {
           rows.fill(0);
           columns.fill(0);
           boxes.fill(0);
           emptyCells.clear();

           for (int row = 0; row < 9; ++row) {
               for (int col = 0; col < 9; ++col) {
                   const char cell = board[row][col];
                   if (cell == '.') {
                       emptyCells.push_back({row, col});
                       continue;
                   }
                   const int bit = 1 << (cell - '1');
                   rows[row] |= bit;
                   columns[col] |= bit;
                   boxes[boxIndex(row, col)] |= bit;
               }
           }
       }

       int availableMask(int row, int col) {
           const int used = rows[row] | columns[col] | boxes[boxIndex(row, col)];
           return allDigits & ~used;
       }

       void place(
           std::vector<std::vector<char>>& board,
           int row,
           int col,
           int bit
       ) {
           const int digit = __builtin_ctz(static_cast<unsigned>(bit));
           board[row][col] = static_cast<char>('1' + digit);
           rows[row] |= bit;
           columns[col] |= bit;
           boxes[boxIndex(row, col)] |= bit;
       }

       void remove(
           std::vector<std::vector<char>>& board,
           int row,
           int col,
           int bit
       ) {
           board[row][col] = '.';
           rows[row] &= ~bit;
           columns[col] &= ~bit;
           boxes[boxIndex(row, col)] &= ~bit;
       }

       bool fixedOrderBacktracking(std::vector<std::vector<char>>& board, int index) {
           if (index == static_cast<int>(emptyCells.size())) {
               return true;
           }

           const auto [row, col] = emptyCells[index];
           int mask = availableMask(row, col);
           while (mask != 0) {
               const int bit = mask & -mask;
               mask -= bit;
               place(board, row, col, bit);
               if (fixedOrderBacktracking(board, index + 1)) {
                   return true;
               }
               remove(board, row, col, bit);
           }
           return false;
       }

       bool minimumRemainingBacktracking(
           std::vector<std::vector<char>>& board,
           int index
       ) {
           if (index == static_cast<int>(emptyCells.size())) {
               return true;
           }

           int best = index;
           int bestMask = 0;
           int bestCount = 10;
           for (int candidate = index;
                candidate < static_cast<int>(emptyCells.size());
                ++candidate) {
               const auto [row, col] = emptyCells[candidate];
               const int mask = availableMask(row, col);
               const int count = __builtin_popcount(static_cast<unsigned>(mask));
               if (count == 0) {
                   return false;
               }
               if (count < bestCount) {
                   best = candidate;
                   bestMask = mask;
                   bestCount = count;
               }
           }

           std::swap(emptyCells[index], emptyCells[best]);
           const auto [row, col] = emptyCells[index];
           int mask = bestMask;
           while (mask != 0) {
               const int bit = mask & -mask;
               mask -= bit;
               place(board, row, col, bit);
               if (minimumRemainingBacktracking(board, index + 1)) {
                   return true;
               }
               remove(board, row, col, bit);
           }

           std::swap(emptyCells[index], emptyCells[best]);
           return false;
       }

       void solveByRepeatedScanning(std::vector<std::vector<char>>& board) {
           scanBacktracking(board, 0);
       }

       void solveByFixedOrderMasks(std::vector<std::vector<char>>& board) {
           initializeMasks(board);
           fixedOrderBacktracking(board, 0);
       }

       void solveByMinimumRemainingValues(std::vector<std::vector<char>>& board) {
           initializeMasks(board);
           minimumRemainingBacktracking(board, 0);
       }

   public:
       void solveSudoku(std::vector<std::vector<char>>& board) {
           solveByMinimumRemainingValues(board);
       }
   };

题解
----

顺序回溯基线
~~~~~~~~~~~~

最直接的搜索按棋盘顺序找到空格，依次尝试数字 ``1`` 到 ``9``。某个数字若与同行、同列或同宫中的已填数字冲突，
当前选择立即排除；否则先写入棋盘，再递归处理后续位置。后续无解时恢复 ``'.'``，继续尝试下一个数字。

``scanBacktracking`` 完整枚举每个空格的所有合法候选。任何完整解在当前空格使用的数字一定不会立即违反三类约束，
因此对应分支不会被跳过；递归到位置 ``81`` 时所有格子都已填，并且每次填入都保持无重复，所以得到合法数独。

这套方法的问题不在回溯本身，而在候选检查。每尝试一个数字，``canPlaceByScanning`` 都重新读取整行、整列和整个
九宫格。同一批已填数字会在搜索树的大量节点中被反复扫描。

三类约束掩码
~~~~~~~~~~~~

数字只有 ``1`` 到 ``9``，可以用一个九位整数表示某个区域已经使用的数字：第 ``d-1`` 位为一，表示数字 ``d``
已经出现。

``rows[row]``、``columns[col]`` 和 ``boxes[box]`` 分别记录行、列和宫的状态。空格 ``(row, col)`` 的已用数字为
三者按位或，可用数字为：

.. math::

   available = 0x1FF \mathbin{\&} \mathord{\sim}(rows[row] \mathbin{|} columns[col] \mathbin{|} boxes[box])

这样，逐个数字加三次区域扫描被替换为一次位运算。``fixedOrderBacktracking`` 仍按空格原顺序搜索，但候选集合直接由
``availableMask`` 得到；循环每次取出最低位的一，恰好枚举一个可用数字。

试填与撤销
~~~~~~~~~~

放置一个候选时，代码同时修改四项状态：棋盘格、行掩码、列掩码和宫掩码。递归失败后，必须把同一位从三个掩码中
清除，并把棋盘格恢复为 ``'.'``。

本层候选来自 ``availableMask``，所以该位在放置前一定没有出现在三个掩码中。使用 ``mask &= ~bit`` 撤销后，各项
状态精确恢复到进入本层前的值。若只恢复棋盘或只恢复掩码，后续分支看到的约束就会与棋盘不一致。

固定顺序的分支浪费
~~~~~~~~~~~~~~~~~~

位掩码删除了候选检查的重复读取，但没有改变搜索树形状。按行优先遇到的第一个空格可能有三个或四个候选，而棋盘中
另一个空格可能只剩一个候选。先在宽分支上尝试，会产生许多稍后才被证明失败的路径。

例如普通棋盘初始时：

.. list-table::
   :header-rows: 1

   * - 空格
     - 候选
     - 分支数
   * - ``(0, 2)``
     - ``{1, 2, 4}``
     - 3
   * - ``(4, 4)``
     - ``{5}``
     - 1

固定顺序先处理 ``(0, 2)``；最少候选策略先填 ``(4, 4)=5``，无需猜测，并可能继续收紧其他空格的候选。

最少剩余值
~~~~~~~~~~

每层递归在尚未处理的 ``emptyCells[index:]`` 中计算候选数，选择候选最少的空格。候选数为零时，当前部分填法已经
不可能完成，可以立即回溯；候选数为一时只有唯一分支；其余情况也优先选择分支最少的位置。

这种选择只改变空格的搜索顺序，不删除任何候选。假设当前状态存在完整解，被选空格在该解中的数字一定包含在它的
候选掩码中，循环仍会枚举该分支，因此启发式不会遗漏答案。

代码通过交换 ``emptyCells[index]`` 与最佳位置，把选中的空格放到当前层。前缀 ``emptyCells[0:index]`` 已经填好，
后缀尚未处理。当前层全部候选失败时再交换回来，保证调用者看到的顺序恢复；找到解后立即返回，不再需要恢复顺序。

代码演进
~~~~~~~~

三阶段代码删除的是两类不同的重复工作：

#. ``scanBacktracking`` 每次尝试数字都扫描同行、同列和同宫；
#. ``fixedOrderBacktracking`` 用三组掩码替换这些扫描，但仍按固定空格顺序展开搜索；
#. ``minimumRemainingBacktracking`` 保留位掩码，并在每层把候选最少的空格换到当前位置，尽早暴露零候选分支并优先
   执行确定性更强的选择。

公开入口采用第三种方法。题目保证唯一解，因此首次到达全部空格已填的状态即可结束；即使只要求找到任意一个解，
同样的提前返回也成立。

复杂度分析
~~~~~~~~~~

设空格数量为 ``E``。逐格回溯的最坏搜索树可粗略上界为 ``O(9^E)``；基础方法在每次候选判断时还扫描 27 个格子，
这部分是固定常数。位掩码把一次候选计算降为常数位运算，但固定顺序方法的最坏搜索树上界仍是 ``O(9^E)``。

最少候选方法的理论最坏上界仍为 ``O(9^E)``，因为某些构造可能保留大量分支；它通过优先处理约束最强的空格，通常
显著缩小实际搜索树。三组掩码占固定空间，空格数组与递归栈占 ``O(E)`` 空间。
