0051. N-Queens
===============

题目信息
--------

:题号: 0051
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

先把搜索空间缩成每行一个决定
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最直接的建模可以对每个格子决定“放或不放”，但绝大多数中间状态既没有放满 ``n`` 个皇后，也很早就
违反行约束。

合法棋盘共有 ``n`` 个皇后，同一行又不能出现两个皇后。棋盘恰好有 ``n`` 行，因此每一行必须恰好
放置一个皇后。递归层 ``row`` 可以直接表示“正在决定第几行”，本层只需枚举这一行的列号。

``placement[row] = column`` 保存当前路径。到达 ``row == n`` 时，所有行均已确定，再把列序列转换成
字符串棋盘。搜索过程中不必反复修改完整棋盘。

第一种方法：回看此前皇后
~~~~~~~~~~~~~~~~~~~~~~~~

准备把皇后放在 ``(row,column)`` 时，只需与此前各行的皇后比较：

.. code-block:: text

   previousColumn == column
       同列冲突

   abs(previousRow-row) == abs(previousColumn-column)
       对角线冲突

同行冲突已经由“每层只处理一行”自动消除。该方法直接对应定义，也不会漏掉任何约束，但每次候选判断
都要扫描此前最多 ``row`` 个皇后。

冲突检查真正依赖哪三个编号
~~~~~~~~~~~~~~~~~~~~~~~~~~

此前皇后的具体坐标并非每次都要重新读取。候选位置只会被三类已占用线路攻击：

.. code-block:: text

   列：column
   主对角线 \：row - column
   副对角线 /：row + column

同一条 ``\`` 对角线上的格子具有相同 ``row-column``；同一条 ``/`` 对角线上的格子具有相同
``row+column``。

``row-column`` 的范围是 ``[-(n-1),n-1]``，加上 ``n-1`` 后落入 ``[0,2n-2]``。另一类编号
``row+column`` 本来就处于同一范围。因此一张长度为 ``n`` 的列数组和两张长度为 ``2n-1`` 的
对角线数组足以保存全部冲突状态。

第二种方法：持续维护占用状态
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

主方法在选择 ``(row,column)`` 时，把对应的列、主对角线和副对角线同时标记为已占用。下一层只做
三次数组查询，合法性判断由 ``O(row)`` 降为 ``O(1)``。

递归返回后必须撤销同一组三个标记。这不是清理工作，而是回溯状态定义的一部分：兄弟分支应从完全相同
的父状态开始。若遗漏一次撤销，已经离开当前路径的皇后仍会错误阻塞后续候选。

对 ``n = 4`` 的一条成功路径：

.. list-table::
   :header-rows: 1

   * - 行
     - 选择列
     - 主对角线编号 ``row-column+n-1``
     - 副对角线编号 ``row+column``
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

第三种方法：把三张表压成位掩码
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

当 ``n <= 9`` 时，一个整数的低 ``n`` 位就能表示一行的全部列。位为 1 表示该列已经被占用或被
对角线攻击：

.. code-block:: text

   available = fullMask & ~(columns | mainAttacks | antiAttacks)

``available`` 中的每个置位都是当前行的合法列。表达式 ``available & -available`` 每次取出最低置位，
从而只遍历合法候选。

进入下一行时，列攻击位置不变。若第 ``column`` 位放入皇后，则它的 ``\`` 对角线在下一行攻击
``column+1``，所以左移一位；``/`` 对角线攻击 ``column-1``，所以右移一位。位掩码法没有改变搜索树，
只把三张布尔表和逐列检查压缩成整数运算。

为什么所有棋盘恰好生成一次
~~~~~~~~~~~~~~~~~~~~~~~~~~

任意合法棋盘在每一行都有唯一皇后列，因此对应唯一的 ``placement`` 序列。算法逐行枚举全部列，只跳过
与当前路径已有皇后冲突的候选，所以该合法序列的每一步都会被保留，最终必然到达叶子。

反过来，任何到达 ``row == n`` 的路径都通过了列和两类对角线检查，又由递归层保证每行恰有一个皇后，
因此一定是合法棋盘。两个不同路径至少有一行列号不同，构造出的棋盘也不同，所以不会产生重复答案。

边界情况
~~~~~~~~

``n = 1`` 时，根层唯一列立即形成答案。``n = 2`` 和 ``n = 3`` 的每条路径都会在放满所有行之前
失去合法候选，因此自然返回空结果，不需要特殊分支。

复杂度来源
~~~~~~~~~~

忽略对角线剪枝，逐行选择不同列的搜索树规模以 ``n!`` 为上界量级。扫描法的每次候选检查还需回看
``O(n)`` 个皇后，可写成 ``O(n² · n!)`` 的宽松上界。

占用数组法每个搜索节点扫描 ``n`` 列，搜索部分为 ``O(n · n!)`` 的宽松上界；位掩码法只枚举合法位，
状态转移数以 ``O(n!)`` 为上界量级。若合法棋盘数为 ``S``，构造并复制输出还必须写入 ``S · n²``
个字符。

不计返回结果，三种方法的递归深度与列序列均为 ``O(n)``；占用数组和位掩码也只使用 ``O(n)`` 或更少的
额外状态。
