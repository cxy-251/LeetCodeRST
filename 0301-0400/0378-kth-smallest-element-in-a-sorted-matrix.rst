0378. Kth Smallest Element in a Sorted Matrix
=============================================

题目信息
--------

:题号: 0378
:难度: Medium
:主题: 有序方阵、顺序统计量、重复值、排名
:原题: `LeetCode 0378 <https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/>`_
:重点: 每行每列均非递减、第 k 小按全部元素位置计数、重复值分别占据排名、k 从 1 开始

题目重述
--------

给定一个 ``n x n`` 整数方阵 ``matrix``，其中每一行从左到右、每一列从上到下都按非递减顺序排列。把矩阵中的 ``n^2`` 个元素整体按值排序，返回其中第 ``k`` 小的元素。

``k`` 使用一基排名，位于 ``[1, n^2]``。矩阵边长位于 ``[1, 300]``，元素位于 ``[-10^9, 10^9]``。重复值不会去重，每次出现都占据一个独立排序位置；题目要求返回值，而不是矩阵坐标。

自建示例
--------

重复值分别参与排名：

.. code-block:: text

   输入：matrix = [[1,2],[2,3]]，k = 3
   输出：2
   解释：全部元素排序后为 [1,2,2,3]，第三个元素仍然是 2。

单元素方阵：

.. code-block:: text

   输入：matrix = [[-5]]，k = 1
   输出：-5
   解释：矩阵只有一个元素，它同时是第一小元素。

二分答案值，计数不超过它的元素
------------------------------

矩阵中的最小值和最大值给出了答案范围。对候选值 ``mid``，逐行用 ``upper_bound`` 统计小于等于 ``mid`` 的元素个数；这个计数随着 ``mid`` 增大单调不减。如果计数至少为 ``k``，第 ``k`` 小值不大于 ``mid``，收缩右边界；否则答案必须更大，移动左边界。

计数按出现次数累加，所以重复值不会被去重；最终二分找到的是第一个使计数达到 ``k`` 的值，也就是一基排名下的第 ``k`` 小元素。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int kthSmallest(std::vector<std::vector<int>>& matrix,
                       int k) {
           long long left = matrix[0][0];
           long long right = matrix.back().back();
           while (left < right) {
               long long middle = left + (right - left) / 2;
               int count = 0;
               for (const auto& row : matrix) {
                   count += static_cast<int>(
                       std::upper_bound(row.begin(), row.end(), middle)
                       - row.begin());
               }

               if (count >= k) {
                   right = middle;
               } else {
                   left = middle + 1;
               }
           }
           return static_cast<int>(left);
       }
   };

代码分析
--------

``upper_bound`` 利用每行有序性完成计数，二分利用“计数至少为 k”的单调性；行列同时有序但这里不需要额外构造元素堆。设边长为 ``n``、数值范围宽度为 ``V``，时间复杂度为 ``O(n log n log V)``，额外空间为 ``O(1)``。
