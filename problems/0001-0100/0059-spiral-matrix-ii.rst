0059. Spiral Matrix II
======================

题目信息
--------

:题号: 0059
:难度: Medium
:主题: 矩阵、边界模拟、螺旋构造
:原题: `LeetCode 0059 <https://leetcode.com/problems/spiral-matrix-ii/>`_
:访问状态: Available
:教学重点: 剩余矩形不变量、四边界收缩、位置和值的一一对应、二维返回结构

题目重述
--------

给定正整数 ``n``，生成一个 ``n × n`` 方阵，把整数 ``1`` 到 ``n²`` 按顺时针螺旋顺序写入矩阵。
题目保证 ``1 <= n <= 20``，因此最大写入值为 ``400``，安全落在所有目标语言的普通整数范围内。

自建示例
--------

三阶矩阵
~~~~~~~~

.. code-block:: text

   输入：n = 3
   输出：
   [
     [1, 2, 3],
     [8, 9, 4],
     [7, 6, 5]
   ]

单元素
~~~~~~

.. code-block:: text

   输入：n = 1
   输出：[[1]]

四阶矩阵
~~~~~~~~

.. code-block:: text

   输入：n = 4
   输出：
   [
     [ 1,  2,  3,  4],
     [12, 13, 14,  5],
     [11, 16, 15,  6],
     [10,  9,  8,  7]
   ]

问题抽象
--------

先建立 ``n × n`` 结果矩阵。尚未写入的位置始终构成一个闭合矩形，用四个边界描述：

* ``top``：剩余矩形最上方行；
* ``bottom``：剩余矩形最下方行；
* ``left``：剩余矩形最左侧列；
* ``right``：剩余矩形最右侧列。

每轮依次沿上边、右边、下边、左边写入递增整数，然后把相应边界向内收缩。上边和右边写完后，
必须使用更新后的边界判断下边和左边是否仍存在，避免单行、单列或中心点被重复写入。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 算法额外空间
     - 定位
   * - 四边界螺旋写入
     - ``O(n²)``
     - ``O(1)``
     - 主解法；直接复用 0054 的剩余矩形模型
   * - 方向数组与访问标记
     - ``O(n²)``
     - ``O(n²)``
     - 移动统一，但访问标记没有必要
   * - 按圈计算坐标
     - ``O(n²)``
     - ``O(1)``
     - 可行，分层长度和中心边界更易写错

这里的算法额外空间不含必须返回的 ``n × n`` 矩阵；输出本身占 ``O(n²)`` 空间。

主解法：沿剩余矩形外圈递增写入
--------------------------------

写入顺序
~~~~~~~~

当 ``top <= bottom`` 且 ``left <= right`` 时执行一轮：

#. 从 ``left`` 到 ``right`` 写入 ``top`` 行，然后 ``top += 1``；
#. 从 ``top`` 到 ``bottom`` 写入 ``right`` 列，然后 ``right -= 1``；
#. 若 ``top <= bottom``，从 ``right`` 到 ``left`` 写入 ``bottom`` 行，然后 ``bottom -= 1``；
#. 若 ``left <= right``，从 ``bottom`` 到 ``top`` 写入 ``left`` 列，然后 ``left += 1``。

变量 ``value`` 初始为 ``1``，每写一个位置后增加 ``1``。

核心不变量
~~~~~~~~~~

每轮开始时：

* 未写入位置恰好构成 ``[top..bottom] × [left..right]``；
* 边界外的位置已经按照顺时针螺旋路径写入；
* 已写入值恰好是 ``1..value-1``，每个值出现一次；
* 未写入位置仍保持初始值，不参与后续边界判断；
* 四个边界只向内移动，不会重新包含已写入位置。

正确性依据
~~~~~~~~~~

**路径顺序正确。** 每轮按照向右、向下、向左、向上的顺序遍历剩余矩形外圈，恰好是顺时针螺旋
路径。收缩后继续处理内层矩形，因此各圈连接顺序正确。

**无遗漏。** 每轮写入当前剩余矩形的全部外边界并将其移出剩余区域。任意矩阵位置都属于某一层
外边界，所以最终一定会被写入。

**无重复。** 上边和右边写完后先收缩 ``top`` 与 ``right``；只有剩余区域仍存在时才写下边和左边。
因此退化为单行、单列或中心点时不会重复访问位置。

**值与位置一一对应。** 路径中的每个位置只访问一次，``value`` 在每次写入后严格增加一次。总共有
``n²`` 个位置，因此最终写入值恰好为 ``1..n²``，没有重复或遗漏。

**终止性。** 每轮至少删除一行和一列的外边界。边界单调向内，有限轮后剩余矩形为空，循环终止。

复杂度
~~~~~~

* 每个矩阵位置恰好写入一次，时间复杂度为 ``O(n²)``；
* 除返回矩阵外，只保存四个边界和当前值，算法额外空间为 ``O(1)``；
* 返回矩阵占 ``O(n²)`` 输出空间；
* 最大值 ``n² <= 400``，整数递增不会溢出。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   static void free_matrix(int **matrix, int rows) {
       if (matrix == NULL) {
           return;
       }
       for (int row = 0; row < rows; ++row) {
           free(matrix[row]);
       }
       free(matrix);
   }

   int **generateMatrix(
       int n,
       int *returnSize,
       int **returnColumnSizes
   ) {
       int **matrix = calloc((size_t)n, sizeof(*matrix));
       int *column_sizes = malloc(
           (size_t)n * sizeof(*column_sizes)
       );
       if (matrix == NULL || column_sizes == NULL) {
           free(matrix);
           free(column_sizes);
           *returnSize = 0;
           *returnColumnSizes = NULL;
           return NULL;
       }

       for (int row = 0; row < n; ++row) {
           matrix[row] = malloc(
               (size_t)n * sizeof(*matrix[row])
           );
           if (matrix[row] == NULL) {
               free_matrix(matrix, row);
               free(column_sizes);
               *returnSize = 0;
               *returnColumnSizes = NULL;
               return NULL;
           }
           column_sizes[row] = n;
       }

       int top = 0;
       int bottom = n - 1;
       int left = 0;
       int right = n - 1;
       int value = 1;

       while (top <= bottom && left <= right) {
           for (int col = left; col <= right; ++col) {
               matrix[top][col] = value++;
           }
           ++top;

           for (int row = top; row <= bottom; ++row) {
               matrix[row][right] = value++;
           }
           --right;

           if (top <= bottom) {
               for (int col = right; col >= left; --col) {
                   matrix[bottom][col] = value++;
               }
               --bottom;
           }

           if (left <= right) {
               for (int row = bottom; row >= top; --row) {
                   matrix[row][left] = value++;
               }
               ++left;
           }
       }

       *returnSize = n;
       *returnColumnSizes = column_sizes;
       return matrix;
   }

外层指针数组使用 ``calloc`` 初始化为空；任一行分配失败时，只释放已经成功建立的行，并清理列长度
数组。资源失败不会返回部分矩阵。

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       std::vector<std::vector<int>> generateMatrix(int n) {
           std::vector<std::vector<int>> matrix(
               static_cast<std::size_t>(n),
               std::vector<int>(static_cast<std::size_t>(n), 0)
           );

           int top = 0;
           int bottom = n - 1;
           int left = 0;
           int right = n - 1;
           int value = 1;

           while (top <= bottom && left <= right) {
               for (int col = left; col <= right; ++col) {
                   matrix[top][col] = value++;
               }
               ++top;

               for (int row = top; row <= bottom; ++row) {
                   matrix[row][right] = value++;
               }
               --right;

               if (top <= bottom) {
                   for (int col = right; col >= left; --col) {
                       matrix[bottom][col] = value++;
                   }
                   --bottom;
               }

               if (left <= right) {
                   for (int row = bottom; row >= top; --row) {
                       matrix[row][left] = value++;
                   }
                   ++left;
               }
           }
           return matrix;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def generateMatrix(self, n: int) -> list[list[int]]:
           matrix = [[0] * n for _ in range(n)]
           top = 0
           bottom = n - 1
           left = 0
           right = n - 1
           value = 1

           while top <= bottom and left <= right:
               for col in range(left, right + 1):
                   matrix[top][col] = value
                   value += 1
               top += 1

               for row in range(top, bottom + 1):
                   matrix[row][right] = value
                   value += 1
               right -= 1

               if top <= bottom:
                   for col in range(right, left - 1, -1):
                       matrix[bottom][col] = value
                       value += 1
                   bottom -= 1

               if left <= right:
                   for row in range(bottom, top - 1, -1):
                       matrix[row][left] = value
                       value += 1
                   left += 1

           return matrix

Java
~~~~

.. code-block:: java

   class Solution {
       public int[][] generateMatrix(int n) {
           int[][] matrix = new int[n][n];
           int top = 0;
           int bottom = n - 1;
           int left = 0;
           int right = n - 1;
           int value = 1;

           while (top <= bottom && left <= right) {
               for (int col = left; col <= right; ++col) {
                   matrix[top][col] = value++;
               }
               ++top;

               for (int row = top; row <= bottom; ++row) {
                   matrix[row][right] = value++;
               }
               --right;

               if (top <= bottom) {
                   for (int col = right; col >= left; --col) {
                       matrix[bottom][col] = value++;
                   }
                   --bottom;
               }

               if (left <= right) {
                   for (int row = bottom; row >= top; --row) {
                       matrix[row][left] = value++;
                   }
                   ++left;
               }
           }
           return matrix;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn generate_matrix(n: i32) -> Vec<Vec<i32>> {
           let size = n as usize;
           let mut matrix = vec![vec![0; size]; size];

           let mut top = 0i32;
           let mut bottom = n - 1;
           let mut left = 0i32;
           let mut right = n - 1;
           let mut value = 1i32;

           while top <= bottom && left <= right {
               for col in left..=right {
                   matrix[top as usize][col as usize] = value;
                   value += 1;
               }
               top += 1;

               for row in top..=bottom {
                   matrix[row as usize][right as usize] = value;
                   value += 1;
               }
               right -= 1;

               if top <= bottom {
                   for col in (left..=right).rev() {
                       matrix[bottom as usize][col as usize] = value;
                       value += 1;
                   }
                   bottom -= 1;
               }

               if left <= right {
                   for row in (top..=bottom).rev() {
                       matrix[row as usize][left as usize] = value;
                       value += 1;
                   }
                   left += 1;
               }
           }
           matrix
       }
   }

所有可能为空的范围都在进入循环前由边界条件保护；``n >= 1`` 支撑从 ``i32`` 到 ``usize`` 的索引转换。

Go
~~

.. code-block:: go

   func generateMatrix(n int) [][]int {
       matrix := make([][]int, n)
       for row := range matrix {
           matrix[row] = make([]int, n)
       }

       top, bottom := 0, n-1
       left, right := 0, n-1
       value := 1

       for top <= bottom && left <= right {
           for col := left; col <= right; col++ {
               matrix[top][col] = value
               value++
           }
           top++

           for row := top; row <= bottom; row++ {
               matrix[row][right] = value
               value++
           }
           right--

           if top <= bottom {
               for col := right; col >= left; col-- {
                   matrix[bottom][col] = value
                   value++
               }
               bottom--
           }

           if left <= right {
               for row := bottom; row >= top; row-- {
                   matrix[row][left] = value
                   value++
               }
               left++
           }
       }
       return matrix
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function generateMatrix(n: number): number[][] {
       const matrix: number[][] = Array.from(
           { length: n },
           () => Array<number>(n).fill(0),
       );

       let top = 0;
       let bottom = n - 1;
       let left = 0;
       let right = n - 1;
       let value = 1;

       while (top <= bottom && left <= right) {
           for (let col = left; col <= right; col += 1) {
               matrix[top][col] = value;
               value += 1;
           }
           top += 1;

           for (let row = top; row <= bottom; row += 1) {
               matrix[row][right] = value;
               value += 1;
           }
           right -= 1;

           if (top <= bottom) {
               for (let col = right; col >= left; col -= 1) {
                   matrix[bottom][col] = value;
                   value += 1;
               }
               bottom -= 1;
           }

           if (left <= right) {
               for (let row = bottom; row >= top; row -= 1) {
                   matrix[row][left] = value;
                   value += 1;
               }
               left += 1;
           }
       }
       return matrix;
   }

最大值只有 ``400``，远低于 JavaScript ``number`` 的安全整数上限，代码不使用位运算。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int[][] GenerateMatrix(int n) {
           int[][] matrix = new int[n][];
           for (int row = 0; row < n; ++row) {
               matrix[row] = new int[n];
           }

           int top = 0;
           int bottom = n - 1;
           int left = 0;
           int right = n - 1;
           int value = 1;

           while (top <= bottom && left <= right) {
               for (int col = left; col <= right; ++col) {
                   matrix[top][col] = value++;
               }
               ++top;

               for (int row = top; row <= bottom; ++row) {
                   matrix[row][right] = value++;
               }
               --right;

               if (top <= bottom) {
                   for (int col = right; col >= left; --col) {
                       matrix[bottom][col] = value++;
                   }
                   --bottom;
               }

               if (left <= right) {
                   for (int row = bottom; row >= top; --row) {
                       matrix[row][left] = value++;
                   }
                   ++left;
               }
           }
           return matrix;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function generate_matrix(n::Int)::Matrix{Int}
       matrix = zeros(Int, n, n)
       top = 1
       bottom = n
       left = 1
       right = n
       value = 1

       while top <= bottom && left <= right
           for col in left:right
               matrix[top, col] = value
               value += 1
           end
           top += 1

           if top <= bottom
               for row in top:bottom
                   matrix[row, right] = value
                   value += 1
               end
           end
           right -= 1

           if top <= bottom && left <= right
               for col in right:-1:left
                   matrix[bottom, col] = value
                   value += 1
               end
               bottom -= 1
           end

           if top <= bottom && left <= right
               for row in bottom:-1:top
                   matrix[row, left] = value
                   value += 1
               end
               left += 1
           end
       end
       matrix
   end

Julia 使用一基矩阵坐标；反向遍历显式写负步长，并在进入循环前检查剩余边界。

R
~

.. code-block:: r

   generate_matrix <- function(n) {
     matrix_result <- matrix(0L, nrow = n, ncol = n)
     top <- 1L
     bottom <- as.integer(n)
     left <- 1L
     right <- as.integer(n)
     value <- 1L

     while (top <= bottom && left <= right) {
       for (col in seq.int(left, right)) {
         matrix_result[top, col] <- value
         value <- value + 1L
       }
       top <- top + 1L

       if (top <= bottom) {
         for (row in seq.int(top, bottom)) {
           matrix_result[row, right] <- value
           value <- value + 1L
         }
       }
       right <- right - 1L

       if (top <= bottom && left <= right) {
         for (col in seq.int(right, left, by = -1L)) {
           matrix_result[bottom, col] <- value
           value <- value + 1L
         }
         bottom <- bottom - 1L
       }

       if (top <= bottom && left <= right) {
         for (row in seq.int(bottom, top, by = -1L)) {
           matrix_result[row, left] <- value
           value <- value + 1L
         }
         left <- left + 1L
       }
     }
     matrix_result
   }

R 的矩阵采用值语义，返回对象本身就是必须的输出空间。反向 ``seq.int`` 仅在边界有效时执行。

语言语义与边界
--------------

* 输出矩阵每一行必须独立，不能复用同一个可变行对象；
* 下边和左边使用收缩后的边界守卫；
* Rust 的闭区间与 Julia/R 的反向序列都在边界有效时构造；
* ``n² <= 400``，所有计数与索引运算安全；
* C 同步维护外层指针、每行数据和列长度，失败路径整体清理；
* 算法额外空间与必须返回的 ``O(n²)`` 矩阵空间分开报告。

验证
----

固定用例
~~~~~~~~

验证 ``n = 1``、``2``、``3``、``4`` 和 ``20``，检查：

* 结果维度为 ``n × n``；
* 所有值恰好组成 ``1..n²``；
* 沿 0054 的螺旋读取顺序得到严格递增序列 ``1..n²``；
* 中心点、中心行和中心列没有重复写入。

随机与交叉验证
~~~~~~~~~~~~~~

对多个 ``n``：

#. 使用主算法生成矩阵；
#. 使用独立方向数组模拟器生成参考矩阵；
#. 比较全部位置；
#. 再使用 0054 的螺旋读取算法验证输出序列。

关联题目
--------

* ``0054. Spiral Matrix``：沿相同螺旋路径读取矩阵；
* ``0059. Spiral Matrix II``：沿该路径递增写入；
* ``0048. Rotate Image``：矩阵坐标映射和原地变换。
