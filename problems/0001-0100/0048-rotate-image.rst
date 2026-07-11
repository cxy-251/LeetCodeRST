0048. Rotate Image
==================

题目信息
--------

:题号: 0048
:难度: Medium
:主题: 矩阵、原地变换、坐标映射、转置
:原题: `LeetCode 0048 <https://leetcode.com/problems/rotate-image/>`_
:访问状态: Available
:教学重点: 顺时针坐标映射、主对角线转置、行内反转、原地空间约束

题目重述
--------

给定一个 ``n × n`` 方阵 ``matrix``，将图像顺时针旋转 90 度。必须直接修改原矩阵，不能使用
另一个同规模矩阵保存完整结果。

自建示例
--------

三阶矩阵
~~~~~~~~

.. code-block:: text

   输入：                 输出：
   1  2  3               7  4  1
   4  5  6       ->      8  5  2
   7  8  9               9  6  3

四阶矩阵
~~~~~~~~

.. code-block:: text

   输入第一行：[ 1,  2,  3,  4]
   旋转后第一行：[13,  9,  5,  1]

单元素
~~~~~~

.. code-block:: text

   输入：[[5]]
   输出：[[5]]

问题抽象
--------

使用零基坐标时，原位置 ``(row, column)`` 顺时针旋转后应到达：

.. code-block:: text

   (row, column) -> (column, n - 1 - row)

直接按四个位置成环交换可以原地完成，但坐标容易写错。主解法把旋转拆成两个更容易验证的
可逆变换：

#. 沿主对角线转置：``(row, column) -> (column, row)``；
#. 反转每一行：``(column, row) -> (column, n - 1 - row)``。

两步复合恰好得到顺时针 90 度旋转坐标。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 主对角线转置后反转每行
     - ``O(n²)``
     - ``O(1)``
     - 主解法；两个阶段和坐标证明都清晰
   * - 分层四元环交换
     - ``O(n²)``
     - ``O(1)``
     - 一次移动四个元素，边界和偏移更易出错
   * - 新矩阵按目标坐标写入
     - ``O(n²)``
     - ``O(n²)``
     - 最直观，但违反原地空间要求

主解法：转置后反转每一行
------------------------

第一阶段：主对角线转置
~~~~~~~~~~~~~~~~~~~~~~

只遍历主对角线一侧：

.. code-block:: text

   row = 0..n-1
   column = row+1..n-1

交换：

.. code-block:: text

   matrix[row][column] <-> matrix[column][row]

不能遍历整个矩阵后都交换，否则每对非对角元素会被交换两次，最终恢复原状。主对角线元素无需
修改。

第二阶段：反转每一行
~~~~~~~~~~~~~~~~~~~~

对每一行使用左右指针：

.. code-block:: text

   left = 0
   right = n - 1

持续交换 ``matrix[row][left]`` 与 ``matrix[row][right]``，直到左右指针相遇。

坐标复合证明
~~~~~~~~~~~~

原元素位于 ``(row, column)``：

* 转置后到 ``(column, row)``；
* 该行反转后，列坐标 ``row`` 变成 ``n - 1 - row``；
* 最终位置为 ``(column, n - 1 - row)``。

这与顺时针 90 度旋转公式完全一致。

核心不变量
~~~~~~~~~~

转置阶段处理到 ``(row, column)`` 时：

* 已遍历的上三角位置都已与对应下三角位置交换；
* 未遍历位置仍保持原值；
* 每对关于主对角线对称的位置只交换一次。

行反转阶段处理某一行时：

* 左右两端已经移动到旋转后的正确列；
* 中间未处理区间仍保持转置后的顺序；
* 已完成行不会再被后续行修改。

正确性依据
~~~~~~~~~~

转置阶段把每个原元素 ``matrix[row][column]`` 移到 ``matrix[column][row]``。由于只遍历上三角，
每个非对角元素对恰好交换一次；对角元素位置不变。因此转置结果正确。

随后每一行独立反转。位于转置矩阵 ``(column, row)`` 的元素被移动到
``(column, n - 1 - row)``，这正是原元素顺时针旋转后的目标位置。每个矩阵位置都属于唯一一行，
每行反转又是一个双射，因此所有元素恰好到达目标位置，没有丢失或重复。

复杂度
~~~~~~

* 转置访问约 ``n(n - 1) / 2`` 对元素，行反转访问约 ``n² / 2`` 对元素，时间复杂度为
  ``O(n²)``；
* 对原地可变矩阵语言，只使用常数个索引和临时变量，额外空间为 ``O(1)``；
* R 采用值语义，函数返回修改后的矩阵对象，运行时可能触发写时复制；算法本身没有显式建立
  第二个同规模结果矩阵。

核心语言实现
------------

C
~

.. code-block:: c

   void rotate(
       int **matrix,
       int matrixSize,
       int *matrixColSize
   ) {
       (void)matrixColSize;

       for (int row = 0; row < matrixSize; ++row) {
           for (int column = row + 1;
                column < matrixSize;
                ++column) {
               int temp = matrix[row][column];
               matrix[row][column] = matrix[column][row];
               matrix[column][row] = temp;
           }
       }

       for (int row = 0; row < matrixSize; ++row) {
           int left = 0;
           int right = matrixSize - 1;

           while (left < right) {
               int temp = matrix[row][left];
               matrix[row][left] = matrix[row][right];
               matrix[row][right] = temp;
               ++left;
               --right;
           }
       }
   }

``matrixColSize`` 是 LeetCode C 接口提供的每行列数；题目保证方阵，因此主算法只需
``matrixSize``。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       void rotate(vector<vector<int>>& matrix) {
           int size = static_cast<int>(matrix.size());

           for (int row = 0; row < size; ++row) {
               for (int column = row + 1;
                    column < size;
                    ++column) {
                   swap(matrix[row][column], matrix[column][row]);
               }
           }

           for (vector<int>& row : matrix) {
               reverse(row.begin(), row.end());
           }
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def rotate(self, matrix: list[list[int]]) -> None:
           size = len(matrix)

           for row in range(size):
               for column in range(row + 1, size):
                   matrix[row][column], matrix[column][row] = (
                       matrix[column][row],
                       matrix[row][column],
                   )

           for row in matrix:
               row.reverse()

方法按题目要求返回 ``None``，结果通过原矩阵可见。

Java
~~~~

.. code-block:: java

   class Solution {
       public void rotate(int[][] matrix) {
           int size = matrix.length;

           for (int row = 0; row < size; ++row) {
               for (int column = row + 1;
                    column < size;
                    ++column) {
                   int temp = matrix[row][column];
                   matrix[row][column] = matrix[column][row];
                   matrix[column][row] = temp;
               }
           }

           for (int row = 0; row < size; ++row) {
               int left = 0;
               int right = size - 1;

               while (left < right) {
                   int temp = matrix[row][left];
                   matrix[row][left] = matrix[row][right];
                   matrix[row][right] = temp;
                   ++left;
                   --right;
               }
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn rotate(matrix: &mut Vec<Vec<i32>>) {
           let size = matrix.len();

           for row in 0..size {
               for column in (row + 1)..size {
                   let temp = matrix[row][column];
                   matrix[row][column] = matrix[column][row];
                   matrix[column][row] = temp;
               }
           }

           for row in matrix.iter_mut() {
               row.reverse();
           }
       }
   }

这里先复制 ``i32`` 临时值，再分步写入，避免同时取得 ``matrix[row]`` 与 ``matrix[column]`` 的
两个重叠可变借用。

Go
~~

.. code-block:: go

   func rotate(matrix [][]int) {
       size := len(matrix)

       for row := 0; row < size; row++ {
           for column := row + 1; column < size; column++ {
               matrix[row][column], matrix[column][row] =
                   matrix[column][row], matrix[row][column]
           }
       }

       for row := 0; row < size; row++ {
           left, right := 0, size-1
           for left < right {
               matrix[row][left], matrix[row][right] =
                   matrix[row][right], matrix[row][left]
               left++
               right--
           }
       }
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function rotate(matrix: number[][]): void {
       const size = matrix.length;

       for (let row = 0; row < size; row++) {
           for (let column = row + 1; column < size; column++) {
               [matrix[row][column], matrix[column][row]] =
                   [matrix[column][row], matrix[row][column]];
           }
       }

       for (const row of matrix) {
           row.reverse();
       }
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public void Rotate(int[][] matrix) {
           int size = matrix.Length;

           for (int row = 0; row < size; ++row) {
               for (int column = row + 1;
                    column < size;
                    ++column) {
                   (matrix[row][column], matrix[column][row]) =
                       (matrix[column][row], matrix[row][column]);
               }
           }

           for (int row = 0; row < size; ++row) {
               Array.Reverse(matrix[row]);
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function rotate!(matrix::Matrix{Int})::Nothing
       size = size(matrix, 1)

       for row in 1:size
           for column in (row + 1):size
               matrix[row, column], matrix[column, row] =
                   matrix[column, row], matrix[row, column]
           end
       end

       for row in 1:size
           left = 1
           right = size
           while left < right
               matrix[row, left], matrix[row, right] =
                   matrix[row, right], matrix[row, left]
               left += 1
               right -= 1
           end
       end

       return nothing
   end

当 ``row == size`` 时，范围 ``(row + 1):size`` 在 Julia 中可能形成递减序列。稳妥写法应在进入
内层循环前判断 ``row < size``：

.. code-block:: julia

   if row < size
       for column in (row + 1):size
           matrix[row, column], matrix[column, row] =
               matrix[column, row], matrix[row, column]
       end
   end

完整实现应采用该判断，避免最后一行产生越界索引。

R
~

.. code-block:: r

   rotate_image <- function(matrix) {
     size <- nrow(matrix)

     if (size >= 2L) {
       for (row in seq_len(size - 1L)) {
         for (column in seq.int(row + 1L, size)) {
           temp <- matrix[row, column]
           matrix[row, column] <- matrix[column, row]
           matrix[column, row] <- temp
         }
       }
     }

     for (row in seq_len(size)) {
       left <- 1L
       right <- size

       while (left < right) {
         temp <- matrix[row, left]
         matrix[row, left] <- matrix[row, right]
         matrix[row, right] <- temp
         left <- left + 1L
         right <- right - 1L
       }
     }

     matrix
   }

R 函数返回旋转后的矩阵。R 对对象使用值语义，调用者需接收返回值；实现没有显式创建第二个结果
矩阵，但运行时可能因写时复制分配新存储。

关键边界
--------

* ``1 × 1``：转置和反转都不改变元素；
* 奇数阶矩阵：中心元素在两步中都保持原位置；
* 偶数阶矩阵：没有中心格，但每个元素仍按坐标双射移动；
* 方阵前提：非方阵转置后尺寸会变化，不能使用本题接口；
* 原地要求：不能创建 ``n × n`` 临时结果矩阵。

易错点
------

* 先反转每行再转置，得到逆时针旋转而非顺时针；
* 转置时遍历整个矩阵，导致对称元素被交换两次；
* 上三角内层从 ``column = row`` 开始虽不错误，但多做无效对角交换；
* 把目标坐标写成 ``(n - 1 - column, row)``，那是逆时针映射；
* Julia 或 R 使用递减范围时意外访问越界位置；
* R 忘记接收返回矩阵，误以为调用者对象一定被原地修改。

新增与强化知识
--------------

新增
~~~~

* 顺时针 90 度旋转可分解为主对角线转置与水平镜像；
* 复杂矩阵操作可通过坐标映射复合证明；
* 只遍历一个三角区域可确保每对对称元素交换一次。

强化
~~~~

* 复用 0031 中“可逆原地变换”的思想；
* 原地算法仍可使用常数个临时变量；
* Julia/R 的一基索引需要重新推导循环边界，而不是机械翻译零基代码。

最小自检
--------

#. 原位置 ``(row, column)`` 顺时针旋转后的零基坐标是什么？
#. 为什么转置时只遍历主对角线一侧？
#. 转置后为什么要反转每一行，而不是每一列？
#. 两步复合怎样得到目标坐标？
#. 为什么 R 版本需要返回矩阵？

答案要点
~~~~~~~~

#. ``(column, n - 1 - row)``。
#. 每对对称位置只应交换一次；遍历两侧会交换两次。
#. 行反转改变转置后元素的列坐标，得到 ``n - 1 - row``。
#. ``(row, column) -> (column, row) -> (column, n - 1 - row)``。
#. R 使用值语义和写时复制，调用者需要接收修改后的对象。
