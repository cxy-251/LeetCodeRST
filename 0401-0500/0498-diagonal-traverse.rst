0498. Diagonal Traverse
=======================

题目信息
--------

:题号: 0498
:难度: Medium
:主题: 矩阵、斜对角线、交替方向、完整遍历
:原题: `LeetCode 0498 <https://leetcode.com/problems/diagonal-traverse/>`_
:重点: 从左上角开始、同一斜线上的坐标满足 ``row+col`` 相同、方向在右上和左下之间交替、每格恰好一次

题目重述
--------

给定 ``m × n`` 整数矩阵 ``mat``，从左上角元素开始，按斜对角线顺序遍历所有元素。第一条可移动的斜线方向为右上；到达边界后转到下一条斜线并改为左下，之后每条斜线交替方向。

返回按访问顺序组成的一维数组。矩阵行列数均位于 ``[1, 10^4]``，总元素数不超过 ``10^4``，元素位于 ``[-10^5, 10^5]``。每个格子必须恰好访问一次。

自建示例
--------

非方形矩阵：

.. code-block:: text

   输入：mat = [[1,2,3],[4,5,6]]
   输出：[1,2,4,5,3,6]
   解释：各条斜线依次为 [1]、[2,4]、[5,3]、[6]，方向交替。

单列矩阵：

.. code-block:: text

   输入：mat = [[7],[8],[9]]
   输出：[7,8,9]
   解释：每条斜线只有一个元素，遍历顺序就是从上到下。

按 row + col 分组并交替反转
---------------------------

同一条右上到左下斜线上的格子满足 ``row + col`` 相等，因此从 0 到 ``m+n-2`` 枚举这个和就能覆盖所有斜线。先按行递增、列递减收集一条斜线；当该斜线编号为偶数时反转，得到从左上开始向右上交替的题目顺序。

斜线起点由其编号决定：编号小于列数时从第一行开始，否则从最后一列、超出部分的行开始。之后同时向下、向左移动直到越界。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> findDiagonalOrder(
           std::vector<std::vector<int>>& mat) {
           int rows = static_cast<int>(mat.size());
           int columns = static_cast<int>(mat[0].size());
           std::vector<int> result;
           result.reserve(rows * columns);

           for (int diagonal = 0;
                diagonal < rows + columns - 1; ++diagonal) {
               int row = diagonal < columns ? 0 : diagonal - columns + 1;
               int column = diagonal < columns ? diagonal : columns - 1;
               std::vector<int> current;
               while (row < rows && column >= 0) {
                   current.push_back(mat[row][column]);
                   ++row;
                   --column;
               }
               if (diagonal % 2 == 0) {
                   std::reverse(current.begin(), current.end());
               }
               result.insert(result.end(), current.begin(), current.end());
           }
           return result;
       }
   };

代码分析
--------

每个格子只属于一个 ``row + col`` 分组，收集后按奇偶反转正好实现方向交替；起点公式覆盖了矩阵变宽或变高后的两段斜线。总时间复杂度为 ``O(rows * columns)``，临时斜线和结果数组之外的辅助空间最大为 ``O(min(rows, columns))``。
