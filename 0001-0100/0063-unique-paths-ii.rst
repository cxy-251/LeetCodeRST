0063. Unique Paths II
=====================

题目信息
--------

:题号: 0063
:难度: Medium
:主题: 动态规划、网格、障碍、滚动数组
:原题: `LeetCode 0063 <https://leetcode.com/problems/unique-paths-ii/>`_
:重点: 从递归统计剩余路径，推导到障碍清零的一维路径状态

题目重述
--------

给定一个 ``m × n`` 网格 ``obstacleGrid``，其中 ``0`` 表示可通行单元格，``1`` 表示障碍。
机器人从左上角 ``(0,0)`` 出发，每一步只能向右或向下移动一格。

返回机器人到达右下角 ``(m-1,n-1)`` 且不进入任何障碍格的不同路径数量。若起点或终点是障碍，
答案为 ``0``。

约束为 ``1 <= m, n <= 100``，并保证最终答案不超过 ``2 * 10^9``。

自建示例
--------

.. code-block:: text

   输入：
   [[0,0,0,0],
    [0,1,0,0],
    [0,0,1,0]]

   输出：2

两条合法路径分别沿第一行到达最右列，或先进入 ``(1,2)`` 再向右；它们都避开两个障碍。

.. code-block:: text

   输入：[[1,0,0]]
   输出：0

起点是障碍，机器人无法进入网格。

.. code-block:: text

   输入：[[0,0,1,0,0]]
   输出：0

网格只有一行，障碍切断了起点与终点之间的唯一通道。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       static constexpr int LIMIT = 2'000'000'001;

       int cappedAdd(int first, int second) {
           return static_cast<int>(
               std::min<long long>(
                   LIMIT,
                   static_cast<long long>(first) + second
               )
           );
       }

       int memoDfs(
           const std::vector<std::vector<int>>& grid,
           int row,
           int column,
           std::vector<std::vector<int>>& memo
       ) {
           if (row < 0 || column < 0 || grid[row][column] == 1) {
               return 0;
           }
           if (row == 0 && column == 0) {
               return 1;
           }

           int& cached = memo[row][column];
           if (cached != -1) {
               return cached;
           }

           cached = cappedAdd(
               memoDfs(grid, row - 1, column, memo),
               memoDfs(grid, row, column - 1, memo)
           );
           return cached;
       }

       int memoizedSearch(const std::vector<std::vector<int>>& grid) {
           const int rows = static_cast<int>(grid.size());
           const int columns = static_cast<int>(grid[0].size());
           std::vector<std::vector<int>> memo(
               rows,
               std::vector<int>(columns, -1)
           );
           return memoDfs(grid, rows - 1, columns - 1, memo);
       }

       int tableDp(const std::vector<std::vector<int>>& grid) {
           const int rows = static_cast<int>(grid.size());
           const int columns = static_cast<int>(grid[0].size());
           std::vector<std::vector<int>> ways(
               rows,
               std::vector<int>(columns, 0)
           );
           ways[0][0] = grid[0][0] == 0 ? 1 : 0;

           for (int row = 0; row < rows; ++row) {
               for (int column = 0; column < columns; ++column) {
                   if (grid[row][column] == 1) {
                       ways[row][column] = 0;
                       continue;
                   }
                   if (row == 0 && column == 0) {
                       continue;
                   }

                   const int fromAbove =
                       row > 0 ? ways[row - 1][column] : 0;
                   const int fromLeft =
                       column > 0 ? ways[row][column - 1] : 0;
                   ways[row][column] = cappedAdd(fromAbove, fromLeft);
               }
           }
           return ways[rows - 1][columns - 1];
       }

       int rollingDp(const std::vector<std::vector<int>>& grid) {
           const int rows = static_cast<int>(grid.size());
           const int columns = static_cast<int>(grid[0].size());
           std::vector<int> ways(columns, 0);
           ways[0] = grid[0][0] == 0 ? 1 : 0;

           for (int row = 0; row < rows; ++row) {
               for (int column = 0; column < columns; ++column) {
                   if (grid[row][column] == 1) {
                       ways[column] = 0;
                   } else if (column > 0) {
                       ways[column] = cappedAdd(
                           ways[column],
                           ways[column - 1]
                       );
                   }
               }
           }
           return ways[columns - 1];
       }

   public:
       int uniquePathsWithObstacles(
           std::vector<std::vector<int>>& obstacleGrid
       ) {
           return rollingDp(obstacleGrid);
       }
   };

题解
----

递归状态
~~~~~~~~

先从终点反向思考。到达开放格 ``(row,column)`` 的最后一步只能来自上方或左方，因此路径数满足：

.. code-block:: text

   paths(row, column)
       = paths(row - 1, column)
       + paths(row, column - 1)

越过网格边界或落在障碍格时返回 ``0``；到达开放的起点时返回 ``1``，表示尚未移动也构成一条有效前缀。
直接递归会从不同移动顺序反复计算同一格，重复子问题随网格增大迅速增加。

记忆化复用
~~~~~~~~~~

``memoizedSearch`` 为每个坐标保存一次递归结果。状态只由当前位置决定，与此前采用哪条路径到达无关，
所以同一格的后续计算可以安全复用。

每个开放格最多展开一次，递归搜索由指数规模降为 ``O(mn)``。这一版保留了递归定义，下一步可以按依赖顺序
直接填表，消除递归栈。

二维路径状态
~~~~~~~~~~~~

定义：

.. code-block:: text

   ways[row][column]
       = 从起点到达当前格的合法路径数量

扫描顺序为从上到下、从左到右。计算当前格时，上方和左方已经完成，因此开放格直接把两个来源相加。
两类路径的最后一步方向不同，互不重叠；任何到达当前格的路径又必属于其中一类，所以转移没有遗漏或重复。

障碍清零
~~~~~~~~

障碍格不能作为路径终点，也不能把此前路径继续传播到右方或下方，因此它的状态必须写成 ``0``。

在一维状态中，``ways[column]`` 进入当前格前仍保存上方路径数。若障碍格不清零，这个旧值会被错误带到
同一行右侧以及下一行。覆盖为 ``0`` 正好切断所有穿过该障碍的路径。

起点开放时初始化为 ``1``；起点是障碍时初始化为 ``0``。第一行或第一列一旦遇到障碍，状态归零后会自然
向后传播，不需要单独预填整行或整列。

状态演化
~~~~~~~~

以中央存在一个障碍的网格为例：

.. code-block:: text

   网格：       路径数：
   0 0 0        1 1 1
   0 1 0   ->   1 0 1
   0 0 0        1 1 2

障碍格归零后，其右侧只能接收上方路径，障碍下方只能接收左方路径。终点的两条路径分别从障碍的上方和
下方绕行。

一维滚动
~~~~~~~~

二维转移只依赖上一行同列和当前行左侧，可以把状态压缩为一行。逐行从左向右更新时：

* 更新前的 ``ways[column]`` 表示上方路径数；
* 已更新的 ``ways[column - 1]`` 表示左方路径数；
* 开放格执行两者相加；
* 障碍格把当前列覆盖为 ``0``。

从左向右的顺序使同一个数组同时保存两类依赖。若反向更新，左侧状态仍属于上一行，便不再对应当前格的
真实左方来源。

饱和计数
~~~~~~~~

题目只保证最终答案不超过 ``2 * 10^9``。在大型开放区域中，中间格路径数仍可能先超过该范围，随后又被
障碍完全切断。直接使用 32 位加法会在这些无效的大状态处溢出。

代码把超过上限的状态统一截为 ``LIMIT = 2,000,000,001``。所有转移只有非负加法和障碍清零。若一个已超过
上限的状态仍存在通往终点的后缀，那么该状态的每条不同前缀都能接上同一后缀，最终路径数也会超过题目上限。
因此在题目保证成立时，这类状态必然无法贡献到终点；对它进行饱和不会改变最终精确答案。

方法关系
~~~~~~~~

记忆化递归直接保存递归定义中的坐标答案；二维动态规划按照依赖顺序主动计算全部坐标；滚动数组继续观察到
每轮只需要上一行，于是删除更早的状态。

三种方法使用相同的路径计数不变量，区别只在求值顺序和状态存储范围。公开入口调用 ``rollingDp``，保留
``O(mn)`` 时间并把辅助空间降为 ``O(n)``。

复杂度分析
~~~~~~~~~~

设网格大小为 ``m × n``：

* 记忆化递归时间为 ``O(mn)``，备忘录为 ``O(mn)``，递归栈最深为 ``O(m+n)``；
* 二维动态规划时间为 ``O(mn)``，辅助空间为 ``O(mn)``；
* 一维滚动动态规划时间为 ``O(mn)``，辅助空间为 ``O(n)``。

饱和加法只增加常数时间。起点、终点、单行和单列网格都由同一初始化与障碍清零规则覆盖。
