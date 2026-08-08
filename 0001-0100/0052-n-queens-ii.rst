0052. N-Queens II
=================

题目信息
--------

:题号: 0052. N 皇后 II
:难度: Hard
:主题: 数组、回溯、约束状态、位掩码
:原题: `LeetCode 0052 <https://leetcode.com/problems/n-queens-ii/>`_
:重点: 从完整枚举棋盘转为叶子计数，再把列与对角线约束压缩进位掩码

题目重述
--------

给定整数 ``n``，统计在 ``n × n`` 棋盘上放置 ``n`` 个皇后的不同方案数。任意两个皇后都不能位于
同一行、同一列或同一条对角线上。本题只返回方案数量，不需要返回每个棋盘。

约束为 ``1 <= n <= 9``。

自建示例
--------

.. code-block:: text

   输入：n = 4
   输出：2
   解释：两个合法列序列为 [1, 3, 0, 2] 和 [2, 0, 3, 1]。

.. code-block:: text

   输入：n = 3
   输出：0
   解释：无论第一行选择哪一列，后续某一行都会失去全部合法位置。

.. code-block:: text

   输入：n = 1
   输出：1
   解释：唯一格子放置一个皇后即为完整方案。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       bool conflictsWithPrevious(
           const std::vector<int>& placement,
           int row,
           int column
       ) {
           for (int previousRow = 0; previousRow < row; ++previousRow) {
               const int previousColumn = placement[previousRow];
               if (previousColumn == column) {
                   return true;
               }
               if (previousRow - previousColumn == row - column) {
                   return true;
               }
               if (previousRow + previousColumn == row + column) {
                   return true;
               }
           }
           return false;
       }

       int scanDfs(int n, int row, std::vector<int>& placement) {
           if (row == n) {
               return 1;
           }

           int total = 0;
           for (int column = 0; column < n; ++column) {
               if (conflictsWithPrevious(placement, row, column)) {
                   continue;
               }
               placement[row] = column;
               total += scanDfs(n, row + 1, placement);
           }
           return total;
       }

       int scanPreviousRows(int n) {
           std::vector<int> placement(n, -1);
           return scanDfs(n, 0, placement);
       }

       int occupancyDfs(
           int n,
           int row,
           std::vector<char>& columns,
           std::vector<char>& downDiagonals,
           std::vector<char>& upDiagonals
       ) {
           if (row == n) {
               return 1;
           }

           int total = 0;
           for (int column = 0; column < n; ++column) {
               const int down = row - column + n - 1;
               const int up = row + column;
               if (columns[column] ||
                   downDiagonals[down] ||
                   upDiagonals[up]) {
                   continue;
               }

               columns[column] = true;
               downDiagonals[down] = true;
               upDiagonals[up] = true;

               total += occupancyDfs(
                   n,
                   row + 1,
                   columns,
                   downDiagonals,
                   upDiagonals
               );

               columns[column] = false;
               downDiagonals[down] = false;
               upDiagonals[up] = false;
           }
           return total;
       }

       int occupancyArrays(int n) {
           std::vector<char> columns(n, false);
           std::vector<char> downDiagonals(2 * n - 1, false);
           std::vector<char> upDiagonals(2 * n - 1, false);
           return occupancyDfs(
               n,
               0,
               columns,
               downDiagonals,
               upDiagonals
           );
       }

       int bitDfs(
           unsigned int full,
           unsigned int columns,
           unsigned int downAttacks,
           unsigned int upAttacks
       ) {
           if (columns == full) {
               return 1;
           }

           unsigned int available =
               full & ~(columns | downAttacks | upAttacks);
           int total = 0;

           while (available != 0U) {
               const unsigned int bit =
                   available & (~available + 1U);
               available ^= bit;

               total += bitDfs(
                   full,
                   columns | bit,
                   ((downAttacks | bit) << 1) & full,
                   (upAttacks | bit) >> 1
               );
           }
           return total;
       }

       int bitMasks(int n) {
           const unsigned int full = (1U << n) - 1U;
           return bitDfs(full, 0U, 0U, 0U);
       }

   public:
       int totalNQueens(int n) {
           return bitMasks(n);
       }
   };

题解
----

逐行计数模型
~~~~~~~~~~~~

合法棋盘共有 ``n`` 个皇后，同一行不能出现两个皇后，而棋盘也恰好有 ``n`` 行。因此每一行必须恰好
放置一个皇后。

递归层 ``row`` 直接表示当前要决定的行，本层只枚举皇后列号。到达 ``row == n`` 时，一条完整且合法的
列序列已经形成。本题不需要构造棋盘，只返回 ``1`` 表示发现一个方案；父节点把所有子分支的计数相加。

这与 0051 使用同一搜索树，区别只在叶子处理：0051 保存棋盘，0052 累加叶子数量。

扫描已有皇后
~~~~~~~~~~~~

``placement[row]`` 保存第 ``row`` 行的皇后列。尝试 ``(row, column)`` 时，只需与此前各行比较：

.. code-block:: text

   previousColumn == column
       同列冲突

   previousRow - previousColumn == row - column
       同一条 \ 对角线

   previousRow + previousColumn == row + column
       同一条 / 对角线

同行冲突已由逐行搜索消除。``scanPreviousRows`` 直接按照定义检查候选，能够作为正确基线；代价是每次判断
都要重新扫描此前皇后。

占用状态缓存
~~~~~~~~~~~~

候选是否合法只依赖三类线路是否已经出现皇后：

.. code-block:: text

   列编号：column
   \ 对角线编号：row - column + n - 1
   / 对角线编号：row + column

``row - column`` 的范围是 ``[-(n - 1), n - 1]``，平移 ``n - 1`` 后与 ``row + column`` 一样，
都落在 ``[0, 2n - 2]``。因此一张长度为 ``n`` 的列数组和两张长度为 ``2n - 1`` 的对角线数组
足以保存全部冲突状态。

选择一个候选时设置对应的三个标记，递归返回后撤销同一组三个标记。进入任意递归层时始终保持：

* 三张占用表恰好描述当前路径中的皇后；
* 当前行之前每行恰有一个皇后；
* 当前路径内部不存在列或对角线冲突。

所以候选只需三次数组查询即可判断。撤销保证兄弟分支从相同父状态开始，不会受到已经退出路径的皇后影响。

计数递推不变量
~~~~~~~~~~~~~~

设 ``count(row, state)`` 表示在当前占用状态下，从第 ``row`` 行继续放置能够得到的合法方案数。

若 ``row == n``，当前路径已放满所有行，贡献 ``1``。否则每个合法列都产生一个新的子状态：

.. code-block:: text

   count(row, state)
       = 所有合法 column 的 count(row + 1, newState) 之和

不同列分支在当前行已经不同，不可能生成同一个棋盘。任意合法棋盘又有唯一的逐行列序列，因此所有叶子可以直接
相加，每个合法方案恰好计数一次。

位掩码压缩
~~~~~~~~~~

由于 ``n <= 9``，一个无符号整数的低 ``n`` 位足以表示一整行。第 ``column`` 位对应同名列，
``full`` 的低 ``n`` 位全部为 ``1``：

.. code-block:: text

   full = (1 << n) - 1

三个掩码分别表示：

.. code-block:: text

   columns      已经放过皇后的列
   downAttacks  当前行受到 \ 对角线攻击的列
   upAttacks    当前行受到 / 对角线攻击的列

当前行全部合法列可一次得到：

.. code-block:: text

   available = full & ~(columns | downAttacks | upAttacks)

与 ``full`` 相与会清除取反后棋盘范围外的高位。``available`` 中每个置位都对应一个合法候选。

对角线状态转移
~~~~~~~~~~~~~~

当前行选择第 ``column`` 位后，列攻击在下一行仍位于原列。两类对角线则发生水平移动：

* ``\`` 对角线在下一行攻击 ``column + 1``，对应整体左移一位；
* ``/`` 对角线在下一行攻击 ``column - 1``，对应整体右移一位。

因此下一层状态为：

.. code-block:: text

   columns'     = columns | bit
   downAttacks' = ((downAttacks | bit) << 1) & full
   upAttacks'   = (upAttacks | bit) >> 1

表达式 ``available & (~available + 1U)`` 提取最低置位，``available ^= bit`` 再删除它。循环会把当前行
每个合法列恰好枚举一次。

位掩码版本不必显式传递 ``row``。每层恰好选择一个此前未占用的列，所以 ``columns`` 中置位数量就是已放置
皇后数，也就是已处理行数。当 ``columns == full`` 时，全部 ``n`` 列均已使用，当前路径恰好完成 ``n`` 行，
返回 ``1``。

状态演化
~~~~~~~~

对 ``n = 4``，初始 ``full = 1111``，第一行所有列都可选。若第一行选择第 1 列：

.. code-block:: text

   bit         = 0010
   columns     = 0010
   downAttacks = 0100
   upAttacks   = 0001
   available   = 1111 & ~(0010 | 0100 | 0001)
               = 1000

第二行只剩第 3 列可选。若某层 ``available`` 为零，该路径没有合法完成方式，返回的计数自然为零；递归随后
回到上一层尝试其他候选。

代码演进
~~~~~~~~

``scanPreviousRows`` 保存列序列，并为每个候选重新扫描已有皇后。

``occupancyArrays`` 把重复冲突检查缓存为列和两类对角线占用表，使候选判断降为常数时间。

``bitMasks`` 进一步把三张表压缩为整数，并一次计算当前行全部合法列。公开入口采用该方法，因为它只保留计数所需的
约束状态，不构造列序列或棋盘。

复杂度分析
~~~~~~~~~~

忽略对角线剪枝，逐行选择互不相同的列形成的搜索树以 ``O(n!)`` 为上界量级。扫描方法的候选检查还需回看
``O(n)`` 个皇后，可写成 ``O(n · n!)`` 的宽松上界；占用数组与位掩码方法对每个候选只做常数状态操作，
搜索上界为 ``O(n!)``。

三种方法递归深度均为 ``O(n)``。扫描方法保存 ``O(n)`` 的列序列，占用数组额外保存总长度 ``O(n)`` 的
布尔状态；位掩码除递归栈外只携带固定数量整数。本题不构造棋盘，因此没有 0051 中每个方案 ``O(n²)`` 的
输出成本。
