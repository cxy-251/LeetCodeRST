0051. N-Queens
===============

题目信息
--------

:题号: 0051. N 皇后
:难度: Hard
:主题: 数组、回溯、约束传播、位掩码
:原题: `LeetCode 0051 <https://leetcode.com/problems/n-queens/>`_
:重点: 从逐行扫描已有皇后，推导到持续维护列与两类对角线的占用状态

题目重述
--------

给定整数 ``n``，在 ``n × n`` 棋盘上放置 ``n`` 个皇后，使任意两个皇后都不在同一行、同一列或
同一条对角线上。返回所有不同的合法棋盘，答案顺序不限。

每个棋盘由 ``n`` 个长度为 ``n`` 的字符串组成：``'Q'`` 表示皇后，``'.'`` 表示空位置。

约束为 ``1 <= n <= 9``。

自建示例
--------

.. code-block:: text

   输入：n = 4
   输出：
   [
     [".Q..", "...Q", "Q...", "..Q."],
     ["..Q.", "Q...", "...Q", ".Q.."]
   ]

第一块棋盘的皇后列序列为 ``[1,3,0,2]``。每行恰有一个皇后，四个列号互不相同，两类对角线
编号也都互不相同。

.. code-block:: text

   输入：n = 1
   输出：[["Q"]]

单个格子本身就是唯一合法棋盘。

C++ 实现
--------

.. code-block:: cpp

   #include <cstdlib>
   #include <string>
   #include <vector>

   class Solution {
   private:
       std::vector<std::string> buildBoard(const std::vector<int>& placement) {
           const int n = static_cast<int>(placement.size());
           std::vector<std::string> board(n, std::string(n, '.'));
           for (int row = 0; row < n; ++row) {
               board[row][placement[row]] = 'Q';
           }
           return board;
       }

       bool isSafeByScanning(
           const std::vector<int>& placement,
           int row,
           int column
       ) {
           for (int previousRow = 0; previousRow < row; ++previousRow) {
               int previousColumn = placement[previousRow];
               if (previousColumn == column) return false;
               if (std::abs(previousRow - row) ==
                   std::abs(previousColumn - column)) {
                   return false;
               }
           }
           return true;
       }

       void scanDfs(
           int row,
           std::vector<int>& placement,
           std::vector<std::vector<std::string>>& result
       ) {
           const int n = static_cast<int>(placement.size());
           if (row == n) {
               result.push_back(buildBoard(placement));
               return;
           }

           for (int column = 0; column < n; ++column) {
               if (!isSafeByScanning(placement, row, column)) continue;
               placement[row] = column;
               scanDfs(row + 1, placement, result);
           }
       }

       std::vector<std::vector<std::string>> scanPreviousQueens(int n) {
           std::vector<std::vector<std::string>> result;
           std::vector<int> placement(n, -1);
           scanDfs(0, placement, result);
           return result;
       }

       void occupancyDfs(
           int row,
           std::vector<int>& placement,
           std::vector<char>& columns,
           std::vector<char>& mainDiagonals,
           std::vector<char>& antiDiagonals,
           std::vector<std::vector<std::string>>& result
       ) {
           const int n = static_cast<int>(placement.size());
           if (row == n) {
               result.push_back(buildBoard(placement));
               return;
           }

           for (int column = 0; column < n; ++column) {
               int main = row - column + n - 1;
               int anti = row + column;
               if (columns[column] || mainDiagonals[main] ||
                   antiDiagonals[anti]) {
                   continue;
               }

               placement[row] = column;
               columns[column] = true;
               mainDiagonals[main] = true;
               antiDiagonals[anti] = true;

               occupancyDfs(
                   row + 1,
                   placement,
                   columns,
                   mainDiagonals,
                   antiDiagonals,
                   result
               );

               columns[column] = false;
               mainDiagonals[main] = false;
               antiDiagonals[anti] = false;
           }
       }

       std::vector<std::vector<std::string>> occupancyArrays(int n) {
           std::vector<std::vector<std::string>> result;
           std::vector<int> placement(n, -1);
           std::vector<char> columns(n, false);
           std::vector<char> mainDiagonals(2 * n - 1, false);
           std::vector<char> antiDiagonals(2 * n - 1, false);

           occupancyDfs(
               0,
               placement,
               columns,
               mainDiagonals,
               antiDiagonals,
               result
           );
           return result;
       }

       int columnOfBit(int bit) {
           int column = 0;
           while ((1 << column) != bit) ++column;
           return column;
       }

       void bitmaskDfs(
           int row,
           int fullMask,
           int columns,
           int mainAttacks,
           int antiAttacks,
           std::vector<int>& placement,
           std::vector<std::vector<std::string>>& result
       ) {
           const int n = static_cast<int>(placement.size());
           if (row == n) {
               result.push_back(buildBoard(placement));
               return;
           }

           int available = fullMask &
               ~(columns | mainAttacks | antiAttacks);
           while (available != 0) {
               int bit = available & -available;
               available -= bit;
               placement[row] = columnOfBit(bit);

               bitmaskDfs(
                   row + 1,
                   fullMask,
                   columns | bit,
                   ((mainAttacks | bit) << 1) & fullMask,
                   (antiAttacks | bit) >> 1,
                   placement,
                   result
               );
           }
       }

       std::vector<std::vector<std::string>> bitMasks(int n) {
           std::vector<std::vector<std::string>> result;
           std::vector<int> placement(n, -1);
           int fullMask = (1 << n) - 1;
           bitmaskDfs(0, fullMask, 0, 0, 0, placement, result);
           return result;
       }

   public:
       std::vector<std::vector<std::string>> solveNQueens(int n) {
           return occupancyArrays(n);
       }
   };

题解
----

逐行搜索基线
~~~~~~~~~~~~

若对每个格子分别决定是否放皇后，搜索会产生大量已经违反行约束的状态。合法棋盘有 ``n`` 个皇后和
``n`` 行，同一行又不能放两个皇后，因此每一行必须恰好放一个皇后。

令递归层 ``row`` 表示当前要确定的行，并用：

.. code-block:: text

   placement[row] = column

记录该行皇后的列号。进入第 ``row`` 层时，前 ``row`` 行已经各放置一个互不攻击的皇后；本层枚举
全部列，只保留与此前皇后不冲突的位置。到达 ``row == n`` 时，列序列已经唯一确定一块完整棋盘。

``scanPreviousQueens`` 直接回看前面各行。候选 ``(row,column)`` 与
``(previousRow,previousColumn)`` 冲突，当且仅当：

.. code-block:: text

   previousColumn == column
   abs(previousRow - row) == abs(previousColumn - column)

同行冲突由逐行搜索自动消除。该方法严格对应题意，但每个候选都要扫描此前最多 ``row`` 个皇后。

三类占用编号
~~~~~~~~~~~~

冲突判断只依赖候选所在的列和两类对角线：

.. code-block:: text

   列：column
   主对角线 \：row - column
   副对角线 /：row + column

同一条 ``\`` 对角线上的 ``row-column`` 相同，同一条 ``/`` 对角线上的 ``row+column`` 相同。
其中 ``row-column`` 的范围为 ``[-(n-1),n-1]``，加上 ``n-1`` 后可作为
``[0,2n-2]`` 内的数组下标；``row+column`` 本身也处于这个范围。

因此只需维护：

.. code-block:: text

   columns[column]
   mainDiagonals[row - column + n - 1]
   antiDiagonals[row + column]

三次数组查询即可判断候选是否合法，不再回看具体皇后坐标。

逐行占用不变量
~~~~~~~~~~~~~~

``occupancyDfs`` 进入第 ``row`` 层时保持：

* ``placement[0..row-1]`` 是当前已经放置的皇后列序列；
* 三张占用表恰好记录这些皇后占据的列和对角线；
* 前 ``row`` 行中的皇后两两不攻击。

选择 ``(row,column)`` 时，三个对应位置必须都未占用。写入 ``placement`` 并标记三条线路后，
不变量扩展到下一行。递归返回时撤销同一组三个标记，兄弟分支便重新获得完全相同的父状态。

对 ``n = 4`` 的一条成功路径：

.. list-table::
   :header-rows: 1

   * - 行
     - 列
     - 主对角线编号
     - 副对角线编号
   * - 0
     - 1
     - 2
     - 1
   * - 1
     - 3
     - 1
     - 4
   * - 2
     - 0
     - 5
     - 2
   * - 3
     - 2
     - 4
     - 5

三组编号分别互不重复，所以列序列 ``[1,3,0,2]`` 构成合法棋盘。

任意合法棋盘在每一行都有唯一列号。算法逐行枚举所有列，只删除与当前前缀冲突的候选，因此该棋盘的
列序列不会被遗漏。任何到达叶子的路径又满足行、列和两类对角线约束，所以一定是合法解。不同列序列
至少在一行不同，构造出的棋盘也不同。

位掩码状态转移
~~~~~~~~~~~~~~

当 ``n <= 9`` 时，一个整数的低 ``n`` 位可以表示一行中的全部列。``columns``、``mainAttacks`` 和
``antiAttacks`` 的置位分别表示当前行已被列或对角线攻击的位置：

.. code-block:: text

   available = fullMask & ~(columns | mainAttacks | antiAttacks)

``available`` 中的每个置位都是当前行的合法列。``available & -available`` 每次取出最低置位，
从而只遍历合法候选。

放置 ``bit`` 后，列攻击在下一行保持原列。``\`` 对角线在下一行向右移动一列，所以左移一位；
``/`` 对角线向左移动一列，所以右移一位：

.. code-block:: text

   nextColumns = columns | bit
   nextMain = ((mainAttacks | bit) << 1) & fullMask
   nextAnti = (antiAttacks | bit) >> 1

位掩码法与占用数组法展开同一棵逐行搜索树，只把三张布尔表和逐列检查改写成整数位运算。
公开入口采用占用数组法，它已经把候选判断降为常数时间，并保留了最直观的约束含义。

边界处理
~~~~~~~~

``n = 1`` 时，根层唯一候选立即形成答案。``n = 2`` 和 ``n = 3`` 的每条路径都会在放满所有行前
失去合法候选，因此自然返回空结果，不需要特殊分支。

复杂度分析
~~~~~~~~~~

忽略对角线剪枝，逐行选择不同列的搜索规模以 ``n!`` 为上界量级。扫描法每次候选检查还需回看
``O(n)`` 个皇后，可写成 ``O(n² · n!)`` 的宽松上界。

占用数组法每个搜索节点扫描 ``n`` 列，搜索部分为 ``O(n · n!)`` 的宽松上界。位掩码法只枚举当前
合法位，状态转移数以 ``O(n!)`` 为上界量级。若合法棋盘数为 ``S``，构造输出还必须写入
``S · n²`` 个字符。

不计返回结果，三种方法的递归深度和列序列均为 ``O(n)``。占用数组使用 ``O(n)`` 额外状态，
位掩码只保存常数个整数和递归栈。
