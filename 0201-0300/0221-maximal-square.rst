0221. Maximal Square
====================

题目信息
--------

:题号: 0221
:难度: Medium
:主题: 矩阵、动态规划、正方形
:原题: `LeetCode 0221 <https://leetcode.com/problems/maximal-square/>`_
:重点: 连续方形区域、全部单元格为字符 1、返回面积而非边长

题目重述
--------

给定一个 ``m x n`` 的字符矩阵 ``matrix``，每个单元格只可能是字符 ``'0'`` 或 ``'1'``。需要找出矩阵中面积最大的正方形，使该正方形覆盖的每个单元格都为 ``'1'``，并返回它的面积；题目不要求返回正方形的位置。

``m`` 和 ``n`` 均位于 ``[1, 300]``。正方形必须由连续的行和连续的列组成；单独一个 ``'1'`` 也构成面积为 1 的正方形。若矩阵中没有 ``'1'``，返回 ``0``。输入矩阵无需修改。

自建示例
--------

最大边长为 2：

.. code-block:: text

   输入：matrix = [["1","1","0","1"],
                    ["1","1","1","1"],
                    ["0","1","1","1"]]
   输出：4
   解释：右下区域存在多个边长为 2 的全 1 正方形，但不存在边长为 3 的全 1 正方形，因此最大面积为 2 x 2 = 4。

没有可用单元格：

.. code-block:: text

   输入：matrix = [["0","0"],
                    ["0","0"]]
   输出：0
   解释：矩阵中没有字符 1，无法形成正面积的目标正方形。

以右下角定义状态
----------------

令 ``dp[j]`` 表示处理到当前行时，以当前列 ``j-1`` 为右边界、以当前行
为下边界的全 ``1`` 正方形最大边长。若当前单元格是 ``'0'``，任何以它为右下角的
目标都不存在，所以状态为 0。若当前单元格是 ``'1'``，它能扩成的最大边长取决于三个相邻状态：

* 上方状态：限制正方形的上方区域；
* 左方状态：限制左侧区域；
* 左上方状态：限制内部已经形成的较小正方形。

因此有：

.. math::

   dp[i][j] = 1 + \min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])

这里的 ``dp[i][j]`` 表示以矩阵单元格 ``(i,j)`` 为右下角的边长，不是面积；扫描过程中记录最大边长，
最后平方得到面积。

滚动数组实现
~~~~~~~~~~~~

用一维数组保存上一行。更新当前列前，``dp[j]`` 还是上方状态；``dp[j-1]`` 已经更新为左方状态；
另存的 ``previous_diagonal`` 是左上方状态。计算完成后再把旧的 ``dp[j]`` 保存为下一列的左上方状态，
更新顺序不能颠倒。

正确性说明
----------

若一个全 ``1`` 正方形以 ``(i,j)`` 为右下角且边长大于 1，那么去掉最后一行、最后一列以及右下角后，
它要求上方、左方和左上方分别存在至少边长减一的正方形。因此边长不能超过三个邻居状态的最小值，
加上当前的 ``'1'`` 后得到的最小值加一正好可行。对所有单元格取最大边长，就覆盖了每个可能的右下角，
其平方即为全矩阵最大正方形面积。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int maximalSquare(std::vector<std::vector<char>>& matrix) {
           if (matrix.empty() || matrix[0].empty()) return 0;

           const int rows = static_cast<int>(matrix.size());
           const int columns = static_cast<int>(matrix[0].size());
           std::vector<int> dp(columns + 1, 0);
           int best = 0;

           for (int row = 0; row < rows; ++row) {
               int previous_diagonal = 0;
               for (int column = 1; column <= columns; ++column) {
                   const int upper = dp[column];
                   if (matrix[row][column - 1] == '1') {
                       dp[column] = 1 + std::min({
                           dp[column], dp[column - 1], previous_diagonal
                       });
                       best = std::max(best, dp[column]);
                   } else {
                       dp[column] = 0;
                   }
                   previous_diagonal = upper;
               }
           }
           return best * best;
       }
   };

代码分析
--------

``upper`` 必须在覆盖 ``dp[column]`` 前保存，否则左上方状态会被破坏。遇到 ``'0'`` 时显式清零，
避免把上一行的正方形错误延伸到当前行。每个单元格只处理一次，时间复杂度为 ``O(mn)``，滚动数组额外
占 ``O(n)`` 空间，返回的面积不需要另建矩阵。
