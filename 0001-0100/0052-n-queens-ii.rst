0052. N-Queens II
=================

题目信息
--------

:题号: 0052
:难度: Hard
:主题: 数组、回溯、约束状态、位掩码
:原题: `LeetCode 0052 <https://leetcode.com/problems/n-queens-ii/>`_
:重点: 从完整枚举棋盘转为叶子计数，再把列与对角线约束压缩进位掩码

题目重述
--------

给定整数 ``n``，统计在 ``n × n`` 棋盘上放置 ``n`` 个皇后的不同方案数。任意两个皇后都不能位于同一行、同一列或同一条对角线上。本题只返回方案数量，不需要返回每个棋盘。

约束为 ``1 <= n <= 9``。

自建示例
--------

.. code-block:: text

   输入：n = 4
   输出：2

两个合法方案的每行皇后列下标分别为 ``[1,3,0,2]`` 和 ``[2,0,3,1]``。

.. code-block:: text

   输入：n = 3
   输出：0

无论第一行选择哪一列，后续某一行都会失去全部合法位置。

.. code-block:: text

   输入：n = 1
   输出：1

唯一格子放置一个皇后即为完整方案。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       bool conflictsWithPrevious(
           const std::vector<int>& placement,
           int row,
           int col
       ) {
           for (int previousRow = 0; previousRow < row; ++previousRow) {
               int previousCol = placement[previousRow];
               if (previousCol == col) return true;
               if (previousRow - previousCol == row - col) return true;
               if (previousRow + previousCol == row + col) return true;
           }
           return false;
       }

       int scanDfs(int n, int row, std::vector<int>& placement) {
           if (row == n) return 1;

           int total = 0;
           for (int col = 0; col < n; ++col) {
               if (conflictsWithPrevious(placement, row, col)) continue;
               placement[row] = col;
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
           if (row == n) return 1;

           int total = 0;
           for (int col = 0; col < n; ++col) {
               int down = row - col + n - 1;
               int up = row + col;
               if (columns[col] || downDiagonals[down] || upDiagonals[up]) continue;

               columns[col] = true;
               downDiagonals[down] = true;
               upDiagonals[up] = true;

               total += occupancyDfs(
                   n,
                   row + 1,
                   columns,
                   downDiagonals,
                   upDiagonals
               );

               columns[col] = false;
               downDiagonals[down] = false;
               upDiagonals[up] = false;
           }
           return total;
       }

       int occupancyArrays(int n) {
           std::vector<char> columns(n, false);
           std::vector<char> downDiagonals(2 * n - 1, false);
           std::vector<char> upDiagonals(2 * n - 1, false);
           return occupancyDfs(n, 0, columns, downDiagonals, upDiagonals);
       }

       int bitDfs(
           unsigned int full,
           unsigned int columns,
           unsigned int downAttacks,
           unsigned int upAttacks
       ) {
           if (columns == full) return 1;

           unsigned int available = full & ~(columns | downAttacks | upAttacks);
           int total = 0;

           while (available != 0) {
               unsigned int bit = available & (~available + 1U);
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
           unsigned int full = (1U << n) - 1U;
           return bitDfs(full, 0U, 0U, 0U);
       }

   public:
       int totalNQueens(int n) {
           return bitMasks(n);
       }
   };

题解
----

0051 与 0052 的搜索树是否不同
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

两题搜索的是同一批合法列序列。第 ``row`` 层决定第 ``row`` 行的皇后放在哪一列；深度达到 ``n`` 时，一条合法路径已经确定一个完整棋盘。

区别只在叶子处理：

.. code-block:: text

   0051：把列序列转换成 n 行字符串并保存
   0052：返回 1，表示发现一个合法方案

父节点把所有子分支返回值相加，根节点得到方案总数。因此本题不需要维护字符棋盘，也不需要保存所有答案。

为什么可以固定每行恰好放一个皇后
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

合法棋盘一共放置 ``n`` 个皇后，同一行又不能出现两个皇后，而棋盘只有 ``n`` 行。因此每行必须恰好有一个皇后。

递归不必对每个格子做“放或不放”的二选一，只需逐行选择列。这样搜索深度固定为 ``n``，同一行冲突天然消失，只剩列和两类对角线约束。

方法一：回看以前各行
~~~~~~~~~~~~~~~~~~~~

``placement[row]`` 保存第 ``row`` 行选择的列。尝试 ``(row,col)`` 时，逐个检查此前皇后：

.. code-block:: text

   同列：previousCol == col
   同一条 \ 对角线：previousRow - previousCol == row - col
   同一条 / 对角线：previousRow + previousCol == row + col

这个方法直接翻译“不互相攻击”的定义，容易验证。第 ``row`` 行每个候选最多回看 ``row`` 个皇后，许多分支会重复询问同一列或同一对角线是否已被占用。

方法二：持续维护三类占用状态
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

冲突判断只依赖三个编号：

.. code-block:: text

   列编号：col
   \ 对角线编号：row - col + n - 1
   / 对角线编号：row + col

``row-col`` 的原始范围是 ``[-(n-1),n-1]``，平移 ``n-1`` 后落在 ``[0,2n-2]``；``row+col`` 本来就在同一范围内。

三张布尔表分别记录当前路径已经占用的列和对角线。候选检查从扫描以前所有行变为三次数组访问。选择后设置三个标记，递归返回时恢复同一组标记，兄弟分支才能从相同父状态继续。

为什么计数可以直接在返回值中累加
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设 ``count(row,state)`` 表示在当前约束状态下，从第 ``row`` 行继续摆放的合法完成数。

若 ``row == n``，所有行都已合法放置，当前路径贡献 ``1``。否则每个合法列产生一个互不重叠的子问题：

.. code-block:: text

   count(row,state)
       = 所有合法 col 的 count(row+1,newState) 之和

不同列分支在当前行已经不同，不可能生成同一个棋盘，因此子问题数量可以直接相加，不需要结果集合去重。

方法三：把一整行状态压进整数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由于 ``n <= 9``，一个整数的低 ``n`` 位足以表示一整行。第 ``c`` 位对应第 ``c`` 列，``full`` 的低 ``n`` 位全为 1：

.. code-block:: text

   full = (1 << n) - 1

位掩码含义为：

.. code-block:: text

   columns      已经放过皇后的列
   downAttacks  当前行受到 \ 对角线攻击的列
   upAttacks    当前行受到 / 对角线攻击的列

因此当前行全部合法列可以一次得到：

.. code-block:: text

   available = full & ~(columns | downAttacks | upAttacks)

与 ``full`` 相与会清除取反后棋盘范围外的高位。

为什么对角线进入下一行时需要移位
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

假设位 ``c`` 代表第 ``c`` 列。在当前行选择该位后：

* ``\`` 对角线在下一行攻击第 ``c+1`` 列，因此整体左移一位；
* ``/`` 对角线在下一行攻击第 ``c-1`` 列，因此整体右移一位。

所以下一层状态是：

.. code-block:: text

   columns'     = columns | bit
   downAttacks' = ((downAttacks | bit) << 1) & full
   upAttacks'   = (upAttacks | bit) >> 1

这里的两张对角线掩码始终描述“当前递归层所在行”的受攻击列。每下降一行就移动一次，不需要再显式保存行列坐标对应的对角线编号。

最低位提取如何枚举所有合法列
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``available`` 中每个 1 都是一个候选列。无符号整数的 ``~available + 1`` 是其模 ``2^w`` 相反数，因此：

.. code-block:: text

   bit = available & (~available + 1)

只保留最低的 1。随后用 ``available ^= bit`` 删除这个候选。循环结束前，每个合法列恰好被提取一次。

位掩码递归为什么不需要显式 row
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每次递归都选择一个此前未占用的列，并把对应位加入 ``columns``。因此 ``columns`` 中 1 的数量等于已经放置的皇后数，也等于已经处理的行数。

当 ``columns == full`` 时，全部 ``n`` 列都已各放置一个皇后；递归又保证每层只放一个皇后，所以此时恰好完成 ``n`` 行，可以返回 ``1``。

以 n = 4 观察一次状态
~~~~~~~~~~~~~~~~~~~~~

初始 ``full = 1111``，三类占用都为 0，因此第一行 ``available = 1111``。

若第一行选择第 1 列，即 ``bit = 0010``，下一行状态为：

.. code-block:: text

   columns     = 0010
   downAttacks = 0100
   upAttacks   = 0001
   available   = 1111 & ~(0010 | 0100 | 0001)
               = 1000

第二行只剩第 3 列可选。继续递归后若某层 ``available`` 变为 0，该路径贡献 0 并自动回到上一层尝试其他位。

为什么不会漏算或重复计算
~~~~~~~~~~~~~~~~~~~~~~~~

任意合法棋盘都有唯一的逐行列序列。三种方法都在每一行枚举所有尚未被列或对角线攻击的列，所以合法序列的每一步都会被保留，最终一定到达叶子。

任意两个不同棋盘至少有一行选择了不同列，因此它们在搜索树该层进入不同分支。每个叶子只返回一次 ``1``，父层只做分支求和，所以每个合法棋盘恰好计数一次。

复杂度来源
~~~~~~~~~~

忽略约束剪枝，逐行选择互不相同的列至多形成排列量级的 ``O(n!)`` 搜索树。回看方法每次候选判断还需扫描至多 ``n`` 个既有皇后，可写成 ``O(n · n!)`` 的上界；布尔占用与位掩码方法对每个候选只做常数操作，上界为 ``O(n!)``。

三种方法的递归深度均为 ``O(n)``。回看方法保存 ``O(n)`` 的列序列；布尔方法再保存总长度 ``O(n)`` 的占用表；位掩码方法每层只携带固定数量整数，不计递归栈的额外空间为 ``O(1)``。本题不构造棋盘，因此没有 0051 中每个方案 ``O(n²)`` 的输出成本。
