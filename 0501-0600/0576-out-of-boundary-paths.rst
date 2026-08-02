0576. Out of Boundary Paths
===========================

题目信息
--------

:题号: 0576
:难度: Medium
:主题: 网格移动、四方向、至多步数、越界路径计数
:原题: `LeetCode 0576 <https://leetcode.com/problems/out-of-boundary-paths/>`_
:重点: 起点在网格内、每步上下左右移动、在至多 maxMove 步内首次越界即形成一条路径、答案取模

题目重述
--------

有一个 ``m × n`` 网格，球从有效坐标 ``[startRow, startColumn]`` 开始。每一步可以向上、下、左或右移动一格。统计在至多 ``maxMove`` 步内把球移出网格边界的不同移动序列数量。

一旦某一步使球越界，该路径立即完成，不再继续移动。返回路径数量对 ``1,000,000,007`` 取模后的结果。若 ``maxMove = 0``，球无法移动出界，答案为 ``0``。

自建示例
--------

狭长网格中的两阶段出界：

.. code-block:: text

   输入：m = 1，n = 2，maxMove = 2，startRow = 0，startColumn = 0
   输出：6
   解释：第一步向上、下、左共有 3 条路径直接出界；第一步向右后，第二步向上、下、右又有 3 条路径出界，共 6 条。

没有移动机会：

.. code-block:: text

   输入：m = 3，n = 3，maxMove = 0，startRow = 1，startColumn = 1
   输出：0
   解释：不能执行任何移动，因此无法离开网格。

按步数滚动统计仍在网格内的路径
------------------------------

``dp[row][column]`` 表示完成当前步数后仍位于该格的路径数。每次从格子向四个方向转移：若目标越界，就把该路径数加入答案；否则累加到下一层。越界路径不再进入下一层，正好实现“首次越界即结束”。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findPaths(int m, int n, int maxMove,
                     int startRow, int startColumn) {
           const int mod = 1000000007;
           std::vector<std::vector<int>> current(
               m, std::vector<int>(n, 0));
           current[startRow][startColumn] = 1;
           const int directions[4][2] = {
               {-1, 0}, {1, 0}, {0, -1}, {0, 1}
           };
           long long answer = 0;
           for (int step = 0; step < maxMove; ++step) {
               std::vector<std::vector<int>> next(
                   m, std::vector<int>(n, 0));
               for (int row = 0; row < m; ++row) {
                   for (int column = 0; column < n; ++column) {
                       int ways = current[row][column];
                       if (ways == 0) continue;
                       for (const auto& direction : directions) {
                           int nextRow = row + direction[0];
                           int nextColumn = column + direction[1];
                           if (nextRow < 0 || nextRow >= m ||
                               nextColumn < 0 || nextColumn >= n) {
                               answer = (answer + ways) % mod;
                           } else {
                               next[nextRow][nextColumn] =
                                   (next[nextRow][nextColumn] + ways) % mod;
                           }
                       }
                   }
               }
               current.swap(next);
           }
           return static_cast<int>(answer);
       }
   };

代码分析
--------

每层只保存尚未出界的路径，所有出界转移立即计数并丢弃；因此每条移动序列在第一次出界的步数被计数一次。时间复杂度为 ``O(maxMove * m * n)``，滚动数组空间复杂度为 ``O(mn)``。
