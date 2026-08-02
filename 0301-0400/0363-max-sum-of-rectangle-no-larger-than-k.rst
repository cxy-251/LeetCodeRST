0363. Max Sum of Rectangle No Larger Than K
==========================================

题目信息
--------

:题号: 0363
:难度: Hard
:主题: 整数矩阵、连续矩形、区域和、上界约束
:原题: `LeetCode 0363 <https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/>`_
:重点: 矩形必须非空且由连续行列组成、区域和必须不超过 ``k``、返回所有合法区域中的最大和

题目重述
--------

给定整数矩阵 ``matrix`` 和整数 ``k``，选择一个非空矩形区域。该区域必须由一段连续的行和一段连续的列共同确定，边与矩阵边界平行；区域内所有元素的和必须小于或等于 ``k``。

返回所有满足条件的矩形区域中最大的元素和。矩阵行数和列数均位于 ``[1, 100]``，元素位于 ``[-100, 100]``，``k`` 位于 ``[-10^5, 10^5]``。题目保证至少存在一个区域和不超过 ``k``，因此总能得到合法答案。

自建示例
--------

最佳区域跨越多行：

.. code-block:: text

   输入：matrix = [[2,-1],[3,4]]，k = 5
   输出：5
   解释：选择第一列的两个连续格子 2 和 3，区域和为 5；完整矩阵的和为 8，超过上界。

所有元素均为负数：

.. code-block:: text

   输入：matrix = [[-4,-2],[-3,-1]]，k = -2
   输出：-2
   解释：单个元素 -2 构成合法非空矩形；-1 大于 k，不合法，其余合法区域的和都不超过 -2。

压缩两条边后求不超过 k 的最大子数组
------------------------------------

固定矩形的上边和下边，把这两行之间每一列的元素累加成 ``colSum``。此时选择连续列就等价于在一维数组中寻找和不超过 ``k`` 的最大非空子数组。枚举所有上下边界，就覆盖了所有非空矩形。

一维问题用有序集合保存已经出现的前缀和。当前前缀为 ``prefix`` 时，子数组和为 ``prefix - old``；要不超过 ``k``，需要 ``old >= prefix - k``。取集合中不小于这个下界的最小前缀，就得到当前结尾下能达到的最大合法和。前缀集合保留所有历史值，因为矩阵元素可以为负，不能只保留一个最小或最大前缀。

若矩阵行数多于列数，先转置，使枚举的两条边位于较短维度，减少平方枚举次数。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int maxSumSubmatrix(std::vector<std::vector<int>>& matrix,
                           int k) {
           std::vector<std::vector<int>> values = matrix;
           if (values.size() > values[0].size()) {
               std::vector<std::vector<int>> transposed(
                   values[0].size(),
                   std::vector<int>(values.size()));
               for (int r = 0; r < static_cast<int>(values.size()); ++r) {
                   for (int c = 0;
                        c < static_cast<int>(values[0].size()); ++c) {
                       transposed[c][r] = values[r][c];
                   }
               }
               values.swap(transposed);
           }

           int rows = static_cast<int>(values.size());
           int cols = static_cast<int>(values[0].size());
           long long answer = LLONG_MIN;
           for (int top = 0; top < rows; ++top) {
               std::vector<long long> columnSum(cols, 0);
               for (int bottom = top; bottom < rows; ++bottom) {
                   for (int col = 0; col < cols; ++col) {
                       columnSum[col] += values[bottom][col];
                   }

                   std::set<long long> prefixes = {0};
                   long long prefix = 0;
                   for (long long value : columnSum) {
                       prefix += value;
                       auto it = prefixes.lower_bound(prefix - k);
                       if (it != prefixes.end()) {
                           answer = std::max(answer, prefix - *it);
                       }
                       prefixes.insert(prefix);
                   }
               }
           }
           return static_cast<int>(answer);
       }
   };

代码分析
--------

每个上下边界产生一个一维列和数组，前缀集合的下界查找保证子数组和满足 ``<= k``，而取最小可行旧前缀使结果最大；从 ``prefixes = {0}`` 开始也能计入从第一列开始的矩形。设短边为 ``R``、长边为 ``C``，时间复杂度为 ``O(R^2 C log C)``，额外空间为 ``O(C)``。
