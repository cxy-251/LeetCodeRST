0085. Maximal Rectangle
=======================

题目信息
--------

:题号: 0085
:难度: Hard
:主题: 矩阵、动态柱高、单调栈
:原题: `LeetCode 0085 <https://leetcode.com/problems/maximal-rectangle/>`_
:访问状态: Available
:教学重点: 按行压缩、柱状图复用、底边归属、单元格线性复杂度

题目重述
--------

给定一个只包含字符 ``'0'`` 和 ``'1'`` 的二维矩阵，求全部由 ``'1'`` 组成且边与矩阵边界
平行的最大矩形面积。

题目保证行数和列数都不超过 200。矩阵只读，返回值是矩形包含的单元格数量。

自建示例
--------

.. code-block:: text

   matrix =
   [
     ['1','0','1','0','0'],
     ['1','0','1','1','1'],
     ['1','1','1','1','1'],
     ['1','0','0','1','0']
   ]

   输出：6

第三行作为底边时，连续三列的高度至少为 2，得到面积 ``2 × 3 = 6``。

问题抽象
--------

固定某一行作为矩形底边。对每一列维护 ``heights[column]``：

* 当前单元格为 ``'1'`` 时，在上一行高度基础上加一；
* 当前单元格为 ``'0'`` 时，高度清零；
* 更新后，``heights`` 表示以当前行为底边的连续 ``'1'`` 柱状图。

因此，每处理一行，只需在当前柱状图上求一次最大矩形。0084 的递增下标栈可以直接复用。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 按行更新柱高并调用单调栈
     - ``O(rows × columns)``
     - ``O(columns)``
     - 主解法；每个单元格只参与常数次操作
   * - 枚举上下边界再检查列区间
     - ``O(rows² × columns)``
     - ``O(columns)``
     - 重复扫描相同纵向信息
   * - 枚举所有矩形
     - 至少 ``O(rows² × columns²)``
     - ``O(1)``
     - 只适合极小输入

主解法：逐行构造柱状图
----------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

处理完第 ``row`` 行后：

* ``heights[column]`` 等于该列以 ``row`` 为底、向上连续 ``'1'`` 的数量；
* 任何底边位于 ``row`` 的全一矩形，都对应 ``heights`` 中一个连续柱区间；
* 该矩形高度等于区间柱高最小值；
* 单调栈会计算当前柱状图的最大矩形面积。

若当前单元格是 ``'0'``，任何跨过该位置且以当前行为底的矩形都不合法，所以对应柱高必须归零。
若是 ``'1'``，向上连续高度恰好比上一行增加一。

为什么覆盖全部矩形
~~~~~~~~~~~~~~~~~~

任意合法全一矩形都有唯一底边行 ``bottom``。算法处理该行时，矩形覆盖的每一列都至少具有矩形
高度，因此它在 ``heights`` 中表现为一个连续柱区间。柱状图算法会为区间内某根最矮柱计算覆盖
该区间的候选面积，所以不会漏掉该矩形。

反过来，柱状图中高度为 ``h``、宽度为 ``w`` 的候选，表示对应列在当前底边之上连续至少 ``h``
行都是 ``'1'``，因此映射回矩阵后一定是合法的 ``h × w`` 全一矩形。

柱状图结算
~~~~~~~~~~

每一行内部使用与 0084 相同的非递减下标栈：

* 当前高度严格小于栈顶柱高时，栈顶柱的右侧首个更矮位置已经确定；
* 弹栈后的新栈顶给出左侧首个更矮位置；
* 循环末尾使用局部零高度哨兵清空非递减后缀；
* 哨兵只存在于循环变量中，不写入 ``heights`` 或输入矩阵。

正确性依据
~~~~~~~~~~

**柱高正确。** 按行递推精确记录每列向上的连续 ``'1'`` 数量。

**映射合法。** 柱状图候选区间内每列高度都不低于候选高度，映射回矩阵后全部单元格均为
``'1'``。

**覆盖完整。** 每个矩形在其底边行被转换为一个柱状图区间，单调栈会计算不小于它的合法候选。

**最优性。** 所有计算面积都对应合法矩形，同时所有合法矩形都被某次柱状图计算覆盖，因此最大值
恰好等于答案。

复杂度与数值边界
~~~~~~~~~~~~~~~~

设矩阵为 ``rows × columns``：

* 更新柱高访问每个单元格一次；
* 每一行中，每个列下标最多入栈、出栈各一次；
* 总时间复杂度为 ``O(rows × columns)``；
* 柱高数组和栈均为 ``O(columns)``；
* 最大面积不超过 ``200 × 200 = 40000``，适合 32 位有符号整数。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   static int largest_histogram(
       const int *heights,
       int size,
       int *stack
   ) {
       int top = 0;
       int best = 0;

       for (int right = 0; right <= size; ++right) {
           const int current_height =
               right == size ? 0 : heights[right];

           while (top > 0 &&
                  current_height < heights[stack[top - 1]]) {
               const int middle = stack[--top];
               const int left =
                   top == 0 ? 0 : stack[top - 1] + 1;
               const int area =
                   heights[middle] * (right - left);
               if (area > best) {
                   best = area;
               }
           }
           stack[top++] = right;
       }
       return best;
   }

   int maximalRectangle(
       char **matrix,
       int matrixSize,
       int *matrixColSize
   ) {
       if (matrixSize == 0) {
           return 0;
       }

       const int columns = matrixColSize[0];
       if (columns == 0) {
           return 0;
       }

       int *heights = calloc(
           (size_t)columns,
           sizeof(*heights)
       );
       int *stack = malloc(
           (size_t)(columns + 1) * sizeof(*stack)
       );
       if (heights == NULL || stack == NULL) {
           free(heights);
           free(stack);
           return 0;
       }

       int best = 0;
       for (int row = 0; row < matrixSize; ++row) {
           for (int column = 0;
                column < columns;
                ++column) {
               if (matrix[row][column] == '1') {
                   ++heights[column];
               } else {
                   heights[column] = 0;
               }
           }

           const int area = largest_histogram(
               heights,
               columns,
               stack
           );
           if (area > best) {
               best = area;
           }
       }

       free(heights);
       free(stack);
       return best;
   }


C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
       static int largestHistogram(
           const std::vector<int>& heights
       ) {
           std::vector<int> stack;
           stack.reserve(heights.size() + 1);
           int best = 0;

           for (int right = 0;
                right <= static_cast<int>(heights.size());
                ++right) {
               const int currentHeight =
                   right == static_cast<int>(heights.size())
                       ? 0
                       : heights[right];

               while (!stack.empty() &&
                      currentHeight < heights[stack.back()]) {
                   const int middle = stack.back();
                   stack.pop_back();
                   const int left =
                       stack.empty() ? 0 : stack.back() + 1;
                   const int area =
                       heights[middle] * (right - left);
                   if (area > best) {
                       best = area;
                   }
               }
               stack.push_back(right);
           }
           return best;
       }

   public:
       int maximalRectangle(
           std::vector<std::vector<char>>& matrix
       ) {
           if (matrix.empty() || matrix[0].empty()) {
               return 0;
           }

           std::vector<int> heights(matrix[0].size(), 0);
           int best = 0;

           for (const auto& row : matrix) {
               for (std::size_t column = 0;
                    column < row.size();
                    ++column) {
                   heights[column] =
                       row[column] == '1'
                           ? heights[column] + 1
                           : 0;
               }
               const int area = largestHistogram(heights);
               if (area > best) {
                   best = area;
               }
           }
           return best;
       }
   };


Python
~~~~~~

.. code-block:: python

   class Solution:
       def maximalRectangle(
           self,
           matrix: list[list[str]],
       ) -> int:
           if not matrix or not matrix[0]:
               return 0

           heights = [0] * len(matrix[0])
           best = 0

           for row in matrix:
               for column, cell in enumerate(row):
                   heights[column] = (
                       heights[column] + 1
                       if cell == "1"
                       else 0
                   )

               stack: list[int] = []
               for right in range(len(heights) + 1):
                   current_height = (
                       0
                       if right == len(heights)
                       else heights[right]
                   )

                   while (
                       stack
                       and current_height < heights[stack[-1]]
                   ):
                       middle = stack.pop()
                       left = stack[-1] + 1 if stack else 0
                       area = heights[middle] * (right - left)
                       best = max(best, area)

                   stack.append(right)

           return best


Java
~~~~

.. code-block:: java

   class Solution {
       public int maximalRectangle(char[][] matrix) {
           if (matrix.length == 0 || matrix[0].length == 0) {
               return 0;
           }

           int columns = matrix[0].length;
           int[] heights = new int[columns];
           int[] stack = new int[columns + 1];
           int best = 0;

           for (char[] row : matrix) {
               for (int column = 0;
                    column < columns;
                    ++column) {
                   heights[column] =
                       row[column] == '1'
                           ? heights[column] + 1
                           : 0;
               }

               int top = 0;
               for (int right = 0;
                    right <= columns;
                    ++right) {
                   int currentHeight =
                       right == columns ? 0 : heights[right];

                   while (top > 0 &&
                          currentHeight <
                              heights[stack[top - 1]]) {
                       int middle = stack[--top];
                       int left =
                           top == 0 ? 0 : stack[top - 1] + 1;
                       int area =
                           heights[middle] * (right - left);
                       best = Math.max(best, area);
                   }
                   stack[top++] = right;
               }
           }
           return best;
       }
   }


Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn maximal_rectangle(
           matrix: Vec<Vec<char>>,
       ) -> i32 {
           if matrix.is_empty() || matrix[0].is_empty() {
               return 0;
           }

           let columns = matrix[0].len();
           let mut heights = vec![0i32; columns];
           let mut best = 0i32;

           for row in matrix {
               for column in 0..columns {
                   heights[column] = if row[column] == '1' {
                       heights[column] + 1
                   } else {
                       0
                   };
               }

               let mut stack: Vec<usize> =
                   Vec::with_capacity(columns + 1);
               for right in 0..=columns {
                   let current_height = if right == columns {
                       0
                   } else {
                       heights[right]
                   };

                   while let Some(&middle) = stack.last() {
                       if current_height >= heights[middle] {
                           break;
                       }

                       stack.pop();
                       let left = stack
                           .last()
                           .map_or(0, |&index| index + 1);
                       let width = (right - left) as i32;
                       best = best.max(heights[middle] * width);
                   }
                   stack.push(right);
               }
           }
           best
       }
   }


Go
~~

.. code-block:: go

   func maximalRectangle(matrix [][]byte) int {
       if len(matrix) == 0 || len(matrix[0]) == 0 {
           return 0
       }

       columns := len(matrix[0])
       heights := make([]int, columns)
       stack := make([]int, columns+1)
       best := 0

       for _, row := range matrix {
           for column, cell := range row {
               if cell == '1' {
                   heights[column]++
               } else {
                   heights[column] = 0
               }
           }

           top := 0
           for right := 0; right <= columns; right++ {
               currentHeight := 0
               if right < columns {
                   currentHeight = heights[right]
               }

               for top > 0 &&
                   currentHeight < heights[stack[top-1]] {
                   middle := stack[top-1]
                   top--
                   left := 0
                   if top > 0 {
                       left = stack[top-1] + 1
                   }
                   area := heights[middle] * (right - left)
                   if area > best {
                       best = area
                   }
               }
               stack[top] = right
               top++
           }
       }
       return best
   }


TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maximalRectangle(matrix: string[][]): number {
       if (matrix.length === 0 || matrix[0].length === 0) {
           return 0;
       }

       const columns = matrix[0].length;
       const heights = new Array<number>(columns).fill(0);
       const stack = new Array<number>(columns + 1);
       let best = 0;

       for (const row of matrix) {
           for (let column = 0;
                column < columns;
                column += 1) {
               heights[column] =
                   row[column] === "1"
                       ? heights[column] + 1
                       : 0;
           }

           let top = 0;
           for (let right = 0;
                right <= columns;
                right += 1) {
               const currentHeight =
                   right === columns ? 0 : heights[right];

               while (
                   top > 0
                   && currentHeight <
                       heights[stack[top - 1]]
               ) {
                   const middle = stack[top - 1];
                   top -= 1;
                   const left =
                       top === 0 ? 0 : stack[top - 1] + 1;
                   const area =
                       heights[middle] * (right - left);
                   best = Math.max(best, area);
               }
               stack[top] = right;
               top += 1;
           }
       }
       return best;
   }


C#
~~

.. code-block:: csharp

   public class Solution {
       public int MaximalRectangle(char[][] matrix) {
           if (matrix.Length == 0 ||
               matrix[0].Length == 0) {
               return 0;
           }

           int columns = matrix[0].Length;
           int[] heights = new int[columns];
           int[] stack = new int[columns + 1];
           int best = 0;

           foreach (char[] row in matrix) {
               for (int column = 0;
                    column < columns;
                    ++column) {
                   heights[column] =
                       row[column] == '1'
                           ? heights[column] + 1
                           : 0;
               }

               int top = 0;
               for (int right = 0;
                    right <= columns;
                    ++right) {
                   int currentHeight =
                       right == columns ? 0 : heights[right];

                   while (top > 0 &&
                          currentHeight <
                              heights[stack[top - 1]]) {
                       int middle = stack[--top];
                       int left =
                           top == 0 ? 0 : stack[top - 1] + 1;
                       int area =
                           heights[middle] * (right - left);
                       best = System.Math.Max(best, area);
                   }
                   stack[top++] = right;
               }
           }
           return best;
       }
   }


Julia
~~~~~

.. code-block:: julia

   function maximal_rectangle(
       matrix::Vector{Vector{Char}},
   )
       if isempty(matrix) || isempty(matrix[1])
           return 0
       end

       columns = length(matrix[1])
       heights = zeros(Int, columns)
       best = 0

       for row in matrix
           for column in 1:columns
               heights[column] =
                   row[column] == '1' ?
                   heights[column] + 1 :
                   0
           end

           stack = Int[]
           for right in 1:(columns + 1)
               current_height =
                   right == columns + 1 ? 0 : heights[right]

               while !isempty(stack) &&
                     current_height < heights[stack[end]]
                   middle = pop!(stack)
                   left = isempty(stack) ? 1 : stack[end] + 1
                   area = heights[middle] * (right - left)
                   best = max(best, area)
               end
               push!(stack, right)
           end
       end
       return best
   end


R
~

.. code-block:: r

   largest_histogram <- function(heights) {
     columns <- length(heights)
     stack <- integer(columns + 1L)
     top <- 0L
     best <- 0

     for (right in seq_len(columns + 1L)) {
       current_height <- if (right == columns + 1L) {
         0L
       } else {
         heights[[right]]
       }

       while (
         top > 0L &&
         current_height < heights[[stack[[top]]]]
       ) {
         middle <- stack[[top]]
         top <- top - 1L
         left <- if (top == 0L) {
           1L
         } else {
           stack[[top]] + 1L
         }
         area <- heights[[middle]] * (right - left)
         best <- max(best, area)
       }

       top <- top + 1L
       stack[[top]] <- right
     }
     best
   }

   maximal_rectangle <- function(matrix) {
     if (length(matrix) == 0L || nrow(matrix) == 0L ||
         ncol(matrix) == 0L) {
       return(0)
     }

     columns <- ncol(matrix)
     heights <- integer(columns)
     best <- 0

     for (row in seq_len(nrow(matrix))) {
       for (column in seq_len(columns)) {
         heights[[column]] <- if (
           matrix[row, column] == "1"
         ) {
           heights[[column]] + 1L
         } else {
           0L
         }
       }
       best <- max(best, largest_histogram(heights))
     }
     best
   }


语言边界说明
------------

* C 为柱高和栈分配两个线性数组，分配失败返回 0；资源失败不属于题目输入域；
* C++、Java、Rust、Go、TypeScript 和 C# 都复用固定长度柱高数组；
* Rust 的虚拟下标只在最后一次循环入栈，之后不会再访问 ``heights[columns]``；
* Julia 和 R 使用一基下标，虚拟右边界为 ``columns + 1``；
* 所有实现都只读取矩阵，柱高状态保存在独立数组中。

对照解法：枚举上下边界
----------------------

固定上边界后逐步下移底边，并维护每列是否全部为 ``'1'``，每次寻找最长连续可用列。该方法需要
``O(rows² × columns)`` 时间，能作为小规模基准，却重复处理相同的纵向连续高度。

验证计划与证据
--------------

``运行验证``
   覆盖单元素、全零、全一、单行、单列、交错零和经典示例。

``随机基准对拍``
   Python 对随机小矩阵枚举所有上下左右边界；可运行编译语言使用独立枚举行区间与列区间的基准。

``编译验证``
   C 使用 C17 严格警告、AddressSanitizer 与 UndefinedBehaviorSanitizer；C++ 使用 C++17；
   Java、Go 和 TypeScript 完成编译或严格类型检查。

``静态验证``
   Rust、C#、Julia 和 R 检查下标、容器类型、虚拟边界和返回值范围，不宣称运行通过。

关联题目
--------

* `0084. Largest Rectangle in Histogram <0084-largest-rectangle-in-histogram.rst>`_
* `0073. Set Matrix Zeroes <0073-set-matrix-zeroes.rst>`_
