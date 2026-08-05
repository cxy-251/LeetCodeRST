0073. Set Matrix Zeroes
=======================

题目信息
--------

:题号: 0073
:难度: Medium
:主题: 矩阵、原地标记、分阶段更新
:原题: `LeetCode 0073 <https://leetcode.com/problems/set-matrix-zeroes/>`_
:重点: 从保存原矩阵，推导到行列标记，再复用首行首列实现常量额外空间

题目重述
--------

给定一个 ``m × n`` 整数矩阵 ``matrix``。只要输入矩阵中的某个单元格原始值为 0，就必须把该单元格
所在的整行和整列全部设为 0。

算法必须直接修改输入矩阵，不返回新矩阵。修改过程中产生的新零不能继续触发其他行列，否则会扩大
原始零的影响范围。

约束如下：

* ``1 <= m, n <= 200``；
* ``-2^31 <= matrix[row][col] <= 2^31 - 1``；
* 进阶目标是只使用 ``O(1)`` 额外空间。

自建示例
--------

.. code-block:: text

   输入：
   [[1, 2, 0, 4],
    [5, 6, 7, 8],
    [0, 10, 11, 12]]

   修改后：
   [[0, 0, 0, 0],
    [0, 6, 0, 8],
    [0, 0, 0, 0]]

原始零位于第 0 行第 2 列和第 2 行第 0 列，因此第 0、2 行以及第 0、2 列需要清零。

.. code-block:: text

   输入：
   [[1, 2, 3],
    [4, 0, 6],
    [7, 8, 9]]

   修改后：
   [[1, 0, 3],
    [0, 0, 0],
    [7, 0, 9]]

中间的原始零只影响第 1 行和第 1 列。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       void copyAndExpand(std::vector<std::vector<int>>& matrix) {
           const std::vector<std::vector<int>> original = matrix;
           const int rows = static_cast<int>(matrix.size());
           const int cols = static_cast<int>(matrix[0].size());

           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (original[row][col] != 0) {
                       continue;
                   }

                   for (int currentCol = 0; currentCol < cols; ++currentCol) {
                       matrix[row][currentCol] = 0;
                   }
                   for (int currentRow = 0; currentRow < rows; ++currentRow) {
                       matrix[currentRow][col] = 0;
                   }
               }
           }
       }

       void markerArrays(std::vector<std::vector<int>>& matrix) {
           const int rows = static_cast<int>(matrix.size());
           const int cols = static_cast<int>(matrix[0].size());
           std::vector<bool> zeroRow(rows, false);
           std::vector<bool> zeroCol(cols, false);

           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (matrix[row][col] == 0) {
                       zeroRow[row] = true;
                       zeroCol[col] = true;
                   }
               }
           }

           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (zeroRow[row] || zeroCol[col]) {
                       matrix[row][col] = 0;
                   }
               }
           }
       }

       void boundaryMarkers(std::vector<std::vector<int>>& matrix) {
           const int rows = static_cast<int>(matrix.size());
           const int cols = static_cast<int>(matrix[0].size());
           bool zeroFirstRow = false;
           bool zeroFirstCol = false;

           for (int col = 0; col < cols; ++col) {
               if (matrix[0][col] == 0) {
                   zeroFirstRow = true;
               }
           }
           for (int row = 0; row < rows; ++row) {
               if (matrix[row][0] == 0) {
                   zeroFirstCol = true;
               }
           }

           for (int row = 1; row < rows; ++row) {
               for (int col = 1; col < cols; ++col) {
                   if (matrix[row][col] == 0) {
                       matrix[row][0] = 0;
                       matrix[0][col] = 0;
                   }
               }
           }

           for (int row = 1; row < rows; ++row) {
               for (int col = 1; col < cols; ++col) {
                   if (matrix[row][0] == 0 || matrix[0][col] == 0) {
                       matrix[row][col] = 0;
                   }
               }
           }

           if (zeroFirstRow) {
               for (int col = 0; col < cols; ++col) {
                   matrix[0][col] = 0;
               }
           }
           if (zeroFirstCol) {
               for (int row = 0; row < rows; ++row) {
                   matrix[row][0] = 0;
               }
           }
       }

   public:
       void setZeroes(std::vector<std::vector<int>>& matrix) {
           boundaryMarkers(matrix);
       }
   };

题解
----

直接扩散的污染问题
~~~~~~~~~~~~~~~~~~

扫描矩阵时若发现一个零便立即清空对应行列，后续扫描会把新写入的零误认为原始零。例如原始零只在
``(1, 1)``，清空第 1 行后，扫描到该行其他位置的新零时可能继续清空额外列。

最直接的修正是先复制完整矩阵，只根据副本中的零修改原矩阵。这样语义正确，但每个原始零都可能重新
遍历一整行和一整列，最坏时间为 ``O(mn(m+n))``，副本还需要 ``O(mn)`` 空间。

行列触发集合
~~~~~~~~~~~~

最终是否清零只取决于两个事实：当前行是否含原始零，以及当前列是否含原始零。由此可把完整副本压缩为
两个标记数组：

.. code-block:: text

   zeroRow[row] = 第 row 行是否出现原始零
   zeroCol[col] = 第 col 列是否出现原始零

第一次扫描只收集标记，第二次扫描再统一写零。每个位置只处理常数次，时间降为 ``O(mn)``，额外空间为
``O(m+n)``。

首行首列复用
~~~~~~~~~~~~

矩阵本身已经为每一行和每一列提供了一个可复用的存储位置：

.. code-block:: text

   matrix[row][0] 作为第 row 行的清零标记
   matrix[0][col] 作为第 col 列的清零标记

扫描内部区域 ``row >= 1``、``col >= 1`` 时，若遇到原始零，就把对应首列和首行位置写成 0。标记完成后，
内部单元格只需检查这两个标记槽。

边界状态分离
~~~~~~~~~~~~

``matrix[0][0]`` 同时属于首行和首列，单独一个值无法区分以下两种事实：

* 首行原本含零；
* 首列原本含零。

因此在首行首列被用作标记区之前，先用 ``zeroFirstRow`` 和 ``zeroFirstCol`` 分别保存这两个状态。两个
布尔值的数量与矩阵规模无关，仍属于 ``O(1)`` 额外空间。

分阶段更新
~~~~~~~~~~

原地方案必须按固定顺序执行：

.. code-block:: text

   1. 保存首行、首列原始状态
   2. 扫描内部区域并写入行列标记
   3. 根据标记清零内部区域
   4. 根据两个布尔值清零首行、首列

首行首列在第 3 步结束前仍承担标记作用。若提前清零边界，标记会被污染，内部区域可能全部被错误清零。

扫描不变量
~~~~~~~~~~

写标记阶段处理完内部前缀后，首列和首行中的零准确记录该前缀出现过原始零的行与列。此阶段不批量
修改内部值，因此尚未扫描的位置仍保持原始数据。

清零阶段开始时，全部触发行列已经固定。每个内部位置在且仅在其行标记或列标记为零时被改写，因此新零
不会再产生新的标记。最后恢复首行首列的独立状态，所得矩阵正好反映所有原始零的影响范围。

复杂度
~~~~~~

矩阵副本方法最坏时间为 ``O(mn(m+n))``，空间为 ``O(mn)``。行列标记数组方法时间为 ``O(mn)``，空间为
``O(m+n)``。首行首列复用方法同样为 ``O(mn)`` 时间，只使用两个布尔值，额外空间为 ``O(1)``。
