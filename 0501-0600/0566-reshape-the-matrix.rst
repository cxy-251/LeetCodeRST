0566. Reshape the Matrix
========================

题目信息
--------

:题号: 0566
:难度: Easy
:主题: 矩阵重塑、行优先顺序、元素总数、失败回退
:原题: `LeetCode 0566 <https://leetcode.com/problems/reshape-the-matrix/>`_
:重点: 新旧矩阵元素总数必须相同、按原矩阵行优先顺序填充、无法重塑时返回原矩阵

题目重述
--------

给定 ``m × n`` 整数矩阵 ``mat``，以及目标行数 ``r`` 和列数 ``c``。若 ``m * n = r * c``，把原矩阵中的元素按从左到右、从上到下的行优先顺序依次填入一个 ``r × c`` 新矩阵并返回。

若目标形状容纳的元素数量与原矩阵不同，则不能进行重塑，必须返回原矩阵。重塑只改变行列组织方式，不能丢失、复制或重新排序元素。

自建示例
--------

成功改变形状：

.. code-block:: text

   输入：mat = [[1,2,3],[4,5,6]]，r = 3，c = 2
   输出：[[1,2],[3,4],[5,6]]
   解释：六个元素按原行优先顺序依次填入 3 行 2 列矩阵。

元素数量不匹配：

.. code-block:: text

   输入：mat = [[1,2],[3,4]]，r = 1，c = 3
   输出：[[1,2],[3,4]]
   解释：原矩阵有 4 个元素，目标只有 3 个位置，因此返回原矩阵。

用一维序号保持行优先顺序
------------------------

先比较原矩阵和目标矩阵的元素总数；不相等时直接返回原矩阵。相等时把原坐标 ``(i,j)`` 映射为一维序号 ``i * oldColumns + j``，再映射到目标的 ``(index / c, index % c)``，从而只改变形状不改变顺序。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<std::vector<int>> matrixReshape(
           std::vector<std::vector<int>>& mat, int r, int c) {
           int rows = static_cast<int>(mat.size());
           int columns = static_cast<int>(mat[0].size());
           if (static_cast<long long>(rows) * columns !=
               static_cast<long long>(r) * c) {
               return mat;
           }

           std::vector<std::vector<int>> result(
               r, std::vector<int>(c));
           for (int index = 0; index < rows * columns; ++index) {
               int oldRow = index / columns;
               int oldColumn = index % columns;
               result[index / c][index % c] = mat[oldRow][oldColumn];
           }
           return result;
       }
   };

代码分析
--------

一维序号在新旧矩阵中保持不变，保证每个元素恰好复制一次且顺序不变；容量检查失败时不创建新结构。时间复杂度为 ``O(rows * columns)``，结果矩阵空间为 ``O(r*c)``。
