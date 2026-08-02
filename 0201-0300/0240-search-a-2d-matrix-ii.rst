0240. Search a 2D Matrix II
===========================

题目信息
--------

:题号: 0240
:难度: Medium
:主题: 矩阵、单调性、二分查找、搜索
:原题: `LeetCode 0240 <https://leetcode.com/problems/search-a-2d-matrix-ii/>`_
:重点: 每行与每列分别非递减、目标存在性、重复值、矩阵不要求整体展平有序

题目重述
--------

给定一个 ``m x n`` 的整数矩阵 ``matrix`` 和整数 ``target``。矩阵的每一行都从左到右按非递减顺序排列，每一列都从上到下按非递减顺序排列。判断矩阵中是否至少有一个单元格的值等于 ``target``；存在时返回 ``true``，否则返回 ``false``。

``m`` 和 ``n`` 均位于 ``[1, 300]``，矩阵元素和 ``target`` 位于 ``[-10^9, 10^9]``。相邻行之间没有“上一行末尾小于下一行开头”的额外保证，因此不能把矩阵直接视为一个整体有序的一维数组。矩阵可以包含重复值，函数无需修改输入。

自建示例
--------

目标位于内部位置：

.. code-block:: text

   输入：matrix = [[1, 4, 8, 11],
                    [2, 5, 9, 14],
                    [6, 7, 12, 18]]，target = 7
   输出：true
   解释：第 3 行第 2 列的值为 7，满足目标存在性要求。

目标落在两个已有值之间：

.. code-block:: text

   输入：matrix = [[1, 3, 6],
                    [2, 5, 9]]，target = 4
   输出：false
   解释：所有行列都保持非递减，但矩阵中没有值 4。

从右上角消除一行或一列
----------------------

从右上角 ``(row=0, column=n-1)`` 开始：

* 当前值等于 ``target``，立即成功；
* 当前值大于 ``target``，当前列下面的值只会更大，整列都不可能包含目标，向左移动；
* 当前值小于 ``target``，当前行左侧的值只会更小，整行都不可能包含目标，向下移动。

每次移动至少删除一行或一列的搜索范围，直到越过矩阵边界。矩阵的行列单调性足以支持这个消除过程，
但不要求行与行之间整体有序，因此不应把坐标直接映射到一维二分查找。

正确性说明
----------

若当前值大于目标，因为当前列从上到下非递减，当前位置下方不可能出现更小的目标，删除整列安全；
若当前值小于目标，因为当前行从左到右非递减，当前位置左侧不可能出现更大的目标，删除整行安全。
等于时返回真。每个未删除位置都保留了出现目标的可能性，越界时搜索范围为空，返回假也就正确。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool searchMatrix(std::vector<std::vector<int>>& matrix, int target) {
           if (matrix.empty() || matrix[0].empty()) return false;

           int row = 0;
           int column = static_cast<int>(matrix[0].size()) - 1;
           const int rows = static_cast<int>(matrix.size());
           while (row < rows && column >= 0) {
               if (matrix[row][column] == target) return true;
               if (matrix[row][column] > target) {
                   --column;
               } else {
                   ++row;
               }
           }
           return false;
       }
   };

代码分析
--------

行指针只向下移动，列指针只向左移动，最多执行 ``m+n`` 次比较，时间复杂度为 ``O(m+n)``，
额外空间为 ``O(1)``。算法只读取矩阵，不受重复值影响，也不需要额外的 visited 标记。
