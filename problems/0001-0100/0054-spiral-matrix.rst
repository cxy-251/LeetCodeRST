0054. Spiral Matrix
===================

题目信息
--------

:题号: 0054
:难度: Medium
:主题: 矩阵、边界模拟、分层遍历、输出构造
:原题: `LeetCode 0054 <https://leetcode.com/problems/spiral-matrix/>`_
:访问状态: Available
:教学重点: 剩余矩形边界、单行单列守卫、每个元素恰好输出一次

题目重述
--------

给定一个 ``m × n`` 整数矩阵，按照顺时针螺旋顺序返回全部元素。

题目保证 ``1 <= m, n <= 10``，每行长度均为 ``n``，元素值位于 ``-100..100``。输入矩阵不需要
修改，返回数组长度必须恰好为 ``m * n``。

自建示例
--------

三行四列
~~~~~~~~

.. code-block:: text

   输入：
   [
     [1,  2,  3,  4],
     [5,  6,  7,  8],
     [9, 10, 11, 12]
   ]

   输出：[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]

单行矩阵
~~~~~~~~

.. code-block:: text

   输入：[[4, 5, 6]]
   输出：[4, 5, 6]

单列矩阵
~~~~~~~~

.. code-block:: text

   输入：[[4], [5], [6]]
   输出：[4, 5, 6]

问题抽象
--------

尚未输出的元素始终构成一个闭合矩形。使用四个边界描述它：

* ``top``：剩余矩形最上方行；
* ``bottom``：剩余矩形最下方行；
* ``left``：剩余矩形最左侧列；
* ``right``：剩余矩形最右侧列。

每轮按照上边、右边、下边、左边的顺序输出一圈，然后把对应边界向内收缩。收缩后若只剩一行或
一列，下边和左边遍历必须先检查边界是否仍有效，避免重复输出同一元素。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 算法额外空间
     - 定位
   * - 四边界分层模拟
     - ``O(mn)``
     - ``O(1)``
     - 主解法；边界含义和重复保护清楚
   * - 方向数组 + visited
     - ``O(mn)``
     - ``O(mn)``
     - 统一移动逻辑，但需要额外访问标记
   * - 递归剥离外圈
     - ``O(mn)``
     - ``O(min(m,n))``
     - 递归层次直观，栈空间没有必要

主解法：收缩剩余矩形
--------------------

遍历顺序
~~~~~~~~

当 ``top <= bottom`` 且 ``left <= right`` 时执行一轮：

#. 从 ``left`` 到 ``right`` 输出 ``top`` 行，然后 ``top += 1``；
#. 从 ``top`` 到 ``bottom`` 输出 ``right`` 列，然后 ``right -= 1``；
#. 若 ``top <= bottom``，从 ``right`` 到 ``left`` 输出 ``bottom`` 行，然后 ``bottom -= 1``；
#. 若 ``left <= right``，从 ``bottom`` 到 ``top`` 输出 ``left`` 列，然后 ``left += 1``。

第三步和第四步的条件使用更新后的边界。这样当剩余区域退化为单行或单列时，不会沿反方向再次
输出已经处理的边。

核心不变量
~~~~~~~~~~

每轮开始时：

* 尚未输出的元素恰好位于矩形 ``[top..bottom] × [left..right]``；
* 矩形外的元素已经按照正确螺旋顺序输出；
* 输出数组中没有重复位置；
* 四个边界只向内移动，不会重新包含已经输出的位置。

正确性依据
~~~~~~~~~~

**顺序正确。** 一轮依次访问剩余矩形的上、右、下、左边界，方向分别为向右、向下、向左和向上，
正是顺时针绕行外圈的顺序。

**无遗漏。** 每轮输出当前剩余矩形的全部外边界，然后把这些边界移出剩余区域。任意矩阵位置都
属于某一层的外边界，因此最终一定被输出。

**无重复。** 上边和右边输出后先收缩 ``top`` 与 ``right``。只有剩余区域仍有下边或左边时才继续
遍历，因此单行、单列和中心单点不会被第二次访问。

**终止性。** 每轮至少收缩一个行边界和一个列边界。边界均单调向内，有限轮后
``top > bottom`` 或 ``left > right``，循环结束。

复杂度
~~~~~~

设矩阵共有 ``m * n`` 个元素：

* 每个位置恰好输出一次，时间复杂度为 ``O(mn)``；
* 四个边界和循环下标占 ``O(1)`` 算法额外空间；
* 返回数组保存全部元素，占 ``O(mn)`` 输出空间。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   int *spiralOrder(
       int **matrix,
       int matrixSize,
       int *matrixColSize,
       int *returnSize
   ) {
       int rows = matrixSize;
       int cols = matrixColSize[0];
       size_t count = (size_t)rows * (size_t)cols;
       int *result = malloc(count * sizeof(*result));
       if (result == NULL) {
           *returnSize = 0;
           return NULL;
       }

       int top = 0;
       int bottom = rows - 1;
       int left = 0;
       int right = cols - 1;
       int write = 0;

       while (top <= bottom && left <= right) {
           for (int col = left; col <= right; ++col) {
               result[write++] = matrix[top][col];
           }
           ++top;

           for (int row = top; row <= bottom; ++row) {
               result[write++] = matrix[row][right];
           }
           --right;

           if (top <= bottom) {
               for (int col = right; col >= left; --col) {
                   result[write++] = matrix[bottom][col];
               }
               --bottom;
           }

           if (left <= right) {
               for (int row = bottom; row >= top; --row) {
                   result[write++] = matrix[row][left];
               }
               ++left;
           }
       }

       *returnSize = write;
       return result;
   }

题目保证矩阵非空且为规则矩形，因此 ``matrixColSize[0]`` 有效。分配尺寸先转换到 ``size_t``；
分配失败与合法空答案不会混淆。

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       std::vector<int> spiralOrder(
           const std::vector<std::vector<int>>& matrix
       ) {
           int top = 0;
           int bottom = static_cast<int>(matrix.size()) - 1;
           int left = 0;
           int right = static_cast<int>(matrix[0].size()) - 1;

           std::vector<int> result;
           result.reserve(matrix.size() * matrix[0].size());

           while (top <= bottom && left <= right) {
               for (int col = left; col <= right; ++col) {
                   result.push_back(matrix[top][col]);
               }
               ++top;

               for (int row = top; row <= bottom; ++row) {
                   result.push_back(matrix[row][right]);
               }
               --right;

               if (top <= bottom) {
                   for (int col = right; col >= left; --col) {
                       result.push_back(matrix[bottom][col]);
                   }
                   --bottom;
               }

               if (left <= right) {
                   for (int row = bottom; row >= top; --row) {
                       result.push_back(matrix[row][left]);
                   }
                   ++left;
               }
           }
           return result;
       }
   };

精确约束保证矩阵尺寸可安全转换为 ``int``。``reserve`` 只预留输出容量，不改变结果长度。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def spiralOrder(self, matrix: list[list[int]]) -> list[int]:
           top = 0
           bottom = len(matrix) - 1
           left = 0
           right = len(matrix[0]) - 1
           result: list[int] = []

           while top <= bottom and left <= right:
               for col in range(left, right + 1):
                   result.append(matrix[top][col])
               top += 1

               for row in range(top, bottom + 1):
                   result.append(matrix[row][right])
               right -= 1

               if top <= bottom:
                   for col in range(right, left - 1, -1):
                       result.append(matrix[bottom][col])
                   bottom -= 1

               if left <= right:
                   for row in range(bottom, top - 1, -1):
                       result.append(matrix[row][left])
                   left += 1

           return result

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       public List<Integer> spiralOrder(int[][] matrix) {
           int top = 0;
           int bottom = matrix.length - 1;
           int left = 0;
           int right = matrix[0].length - 1;
           List<Integer> result = new ArrayList<>(
               matrix.length * matrix[0].length
           );

           while (top <= bottom && left <= right) {
               for (int col = left; col <= right; ++col) {
                   result.add(matrix[top][col]);
               }
               ++top;

               for (int row = top; row <= bottom; ++row) {
                   result.add(matrix[row][right]);
               }
               --right;

               if (top <= bottom) {
                   for (int col = right; col >= left; --col) {
                       result.add(matrix[bottom][col]);
                   }
                   --bottom;
               }

               if (left <= right) {
                   for (int row = bottom; row >= top; --row) {
                       result.add(matrix[row][left]);
                   }
                   ++left;
               }
           }
           return result;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn spiral_order(matrix: Vec<Vec<i32>>) -> Vec<i32> {
           let rows = matrix.len();
           let cols = matrix[0].len();
           let mut result = Vec::with_capacity(rows * cols);

           let mut top = 0_i32;
           let mut bottom = rows as i32 - 1;
           let mut left = 0_i32;
           let mut right = cols as i32 - 1;

           while top <= bottom && left <= right {
               for col in left..=right {
                   result.push(matrix[top as usize][col as usize]);
               }
               top += 1;

               for row in top..=bottom {
                   result.push(matrix[row as usize][right as usize]);
               }
               right -= 1;

               if top <= bottom {
                   for col in (left..=right).rev() {
                       result.push(matrix[bottom as usize][col as usize]);
                   }
                   bottom -= 1;
               }

               if left <= right {
                   for row in (top..=bottom).rev() {
                       result.push(matrix[row as usize][left as usize]);
                   }
                   left += 1;
               }
           }
           result
       }
   }

范围只在边界有效时构造，转换为 ``usize`` 前已经证明下标非负。

Go
~~

.. code-block:: go

   func spiralOrder(matrix [][]int) []int {
       rows := len(matrix)
       cols := len(matrix[0])
       result := make([]int, 0, rows*cols)

       top, bottom := 0, rows-1
       left, right := 0, cols-1

       for top <= bottom && left <= right {
           for col := left; col <= right; col++ {
               result = append(result, matrix[top][col])
           }
           top++

           for row := top; row <= bottom; row++ {
               result = append(result, matrix[row][right])
           }
           right--

           if top <= bottom {
               for col := right; col >= left; col-- {
                   result = append(result, matrix[bottom][col])
               }
               bottom--
           }

           if left <= right {
               for row := bottom; row >= top; row-- {
                   result = append(result, matrix[row][left])
               }
               left++
           }
       }
       return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function spiralOrder(matrix: number[][]): number[] {
       let top = 0;
       let bottom = matrix.length - 1;
       let left = 0;
       let right = matrix[0].length - 1;
       const result: number[] = [];

       while (top <= bottom && left <= right) {
           for (let col = left; col <= right; col += 1) {
               result.push(matrix[top][col]);
           }
           top += 1;

           for (let row = top; row <= bottom; row += 1) {
               result.push(matrix[row][right]);
           }
           right -= 1;

           if (top <= bottom) {
               for (let col = right; col >= left; col -= 1) {
                   result.push(matrix[bottom][col]);
               }
               bottom -= 1;
           }

           if (left <= right) {
               for (let row = bottom; row >= top; row -= 1) {
                   result.push(matrix[row][left]);
               }
               left += 1;
           }
       }
       return result;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<int> SpiralOrder(int[][] matrix) {
           int top = 0;
           int bottom = matrix.Length - 1;
           int left = 0;
           int right = matrix[0].Length - 1;
           var result = new List<int>(
               matrix.Length * matrix[0].Length
           );

           while (top <= bottom && left <= right) {
               for (int col = left; col <= right; ++col) {
                   result.Add(matrix[top][col]);
               }
               ++top;

               for (int row = top; row <= bottom; ++row) {
                   result.Add(matrix[row][right]);
               }
               --right;

               if (top <= bottom) {
                   for (int col = right; col >= left; --col) {
                       result.Add(matrix[bottom][col]);
                   }
                   --bottom;
               }

               if (left <= right) {
                   for (int row = bottom; row >= top; --row) {
                       result.Add(matrix[row][left]);
                   }
                   ++left;
               }
           }
           return result;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function spiral_order(matrix::Matrix{Int})::Vector{Int}
       rows, cols = size(matrix)
       result = Vector{Int}(undef, rows * cols)
       write = 1

       top, bottom = 1, rows
       left, right = 1, cols

       while top <= bottom && left <= right
           for col in left:right
               result[write] = matrix[top, col]
               write += 1
           end
           top += 1

           for row in top:bottom
               result[write] = matrix[row, right]
               write += 1
           end
           right -= 1

           if top <= bottom
               for col in right:-1:left
                   result[write] = matrix[bottom, col]
                   write += 1
               end
               bottom -= 1
           end

           if left <= right
               for row in bottom:-1:top
                   result[write] = matrix[row, left]
                   write += 1
               end
               left += 1
           end
       end
       result
   end

Julia 的 ``top:bottom`` 在 ``top > bottom`` 时为空；反向遍历显式使用负步长 ``right:-1:left``。

R
~

.. code-block:: r

   spiral_order <- function(matrix) {
     rows <- nrow(matrix)
     cols <- ncol(matrix)
     result <- integer(rows * cols)
     write <- 1L

     top <- 1L
     bottom <- rows
     left <- 1L
     right <- cols

     while (top <= bottom && left <= right) {
       for (col in seq.int(left, right)) {
         result[[write]] <- matrix[top, col]
         write <- write + 1L
       }
       top <- top + 1L

       if (top <= bottom) {
         for (row in seq.int(top, bottom)) {
           result[[write]] <- matrix[row, right]
           write <- write + 1L
         }
       }
       right <- right - 1L

       if (top <= bottom) {
         for (col in seq.int(right, left, by = -1L)) {
           result[[write]] <- matrix[bottom, col]
           write <- write + 1L
         }
         bottom <- bottom - 1L
       }

       if (left <= right) {
         for (row in seq.int(bottom, top, by = -1L)) {
           result[[write]] <- matrix[row, left]
           write <- write + 1L
         }
         left <- left + 1L
       }
     }
     result
   }

R 对向下遍历先检查 ``top <= bottom``，避免 ``seq.int`` 在边界交错时构造意外序列；结果向量一次性
预分配。

验证计划与证据
--------------

本题使用固定形状和随机矩阵验证：

* 单元素、单行、单列、方阵、宽矩阵和高矩阵；
* 检查输出长度等于 ``m*n``，且输出多重集与输入一致；
* 使用“方向数组 + visited”独立实现进行随机对拍。

已完成的验证：

* **运行验证：** C、C++、Python、Java、Go、TypeScript 执行单行、单列、方阵和矩形固定用例；
* **随机对拍：** Python 对 ``1..7`` 行列范围的随机矩阵与独立 ``visited`` 方向模拟一致；
* **编译验证：** C17 ``-Wall -Wextra -Werror``、C++17、``javac -Xlint:all``、
  TypeScript ``tsc --strict``；
* **内存验证：** C 使用 AddressSanitizer 与 UndefinedBehaviorSanitizer；
* **静态验证：** Rust、C#、Julia、R 检查边界收缩、一基索引、反向范围和输出长度；
* 当前环境未安装 Rust、C#、Julia、R 运行时，因此不声称运行通过。

关键边界
--------

* 剩余区域退化为单行时，不能再遍历下边；
* 剩余区域退化为单列时，不能再遍历左边；
* 反向循环必须在边界有效后构造；
* 输出空间与算法额外空间分开计算；
* C 的返回数组长度和分配失败路径必须完整。

易错点
------

* 每轮四条边都无条件遍历，导致中心行或中心列重复；
* 更新边界顺序错误，使角点重复或遗漏；
* 把 ``m`` 和 ``n`` 混用；
* R/Julia 反向范围没有显式负步长；
* 把输出数组的 ``O(mn)`` 误写成算法额外空间 ``O(1)`` 的反例。

本题新增知识
------------

* 尚未输出区域可以用四个单调收缩边界精确描述；
* 单行与单列退化需要使用更新后的边界做二次守卫；
* 模拟题的证明可以围绕“剩余区域”和“每个位置恰好一次”展开。

本题强化知识
------------

* 0048 的矩阵坐标和一基/零基转换；
* 0041 的原地边界安全：任何数组访问都由当前有效范围支撑；
* 输出构造与算法工作状态继续分开计费。

关联题目
--------

* `0048. Rotate Image <0048-rotate-image.rst>`_：矩阵坐标与边界；
* `0059. Spiral Matrix II <0059-spiral-matrix-ii.rst>`_：使用相同边界顺序写入矩阵。

最小自检
--------

#. 为什么第三条边必须再次检查 ``top <= bottom``？
#. 为什么第四条边必须再次检查 ``left <= right``？
#. 每轮开始时，尚未输出的元素位于哪里？
#. 输出空间为什么不属于算法额外空间？
#. 单行矩阵会执行哪些方向？

答案要点
~~~~~~~~

#. 上边输出后 ``top`` 已收缩，若没有剩余行，下边就是已经输出过的同一行。
#. 右边输出后 ``right`` 已收缩，若没有剩余列，左边就是已经输出过的同一列。
#. 恰好位于 ``[top..bottom] × [left..right]``。
#. 返回值本身必须保存 ``m*n`` 个元素；算法工作状态只有四个边界。
#. 只执行从左到右的上边遍历。
