0057. Insert Interval
=====================

题目信息
--------

:题号: 0057
:难度: Medium
:主题: 数组、区间、线性扫描、闭区间合并
:原题: `LeetCode 0057 <https://leetcode.com/problems/insert-interval/>`_
:访问状态: Available
:教学重点: 已排序不重叠前提、三阶段扫描、闭区间重叠判定、输出快照

题目重述
--------

给定一组按起点升序排列、彼此不重叠的闭区间 ``intervals``，以及一个新的闭区间
``newInterval``。把新区间插入原序列；若它与已有区间重叠，就合并所有相交区间。返回仍按起点升序、
彼此不重叠的结果。

题目保证：

* ``0 <= intervals.length <= 10000``；
* 每个区间都写成 ``[start, end]``，且 ``0 <= start <= end <= 100000``；
* 原区间按 ``start`` 严格递增并且两两不重叠；
* ``newInterval`` 也满足合法端点顺序；
* 区间是闭区间，因此端点相接时视为重叠。

主实现不修改输入区间或 ``newInterval``，返回独立的结果区间快照。

自建示例
--------

跨越多个区间
~~~~~~~~~~~~

.. code-block:: text

   输入：intervals = [[1,2], [3,5], [6,7], [8,10], [12,16]]
         newInterval = [4,8]
   输出：[[1,2], [3,10], [12,16]]

新区间与 ``[3,5]``、``[6,7]``、``[8,10]`` 连成一个覆盖段。

插入最前方
~~~~~~~~~~

.. code-block:: text

   输入：intervals = [[3,5], [8,9]]
         newInterval = [0,1]
   输出：[[0,1], [3,5], [8,9]]

空输入
~~~~~~

.. code-block:: text

   输入：intervals = []
         newInterval = [2,4]
   输出：[[2,4]]

端点相接
~~~~~~~~

.. code-block:: text

   输入：intervals = [[1,2], [5,7]]
         newInterval = [2,5]
   输出：[[1,7]]

闭区间共享端点，因此需要合并。

问题抽象
--------

原区间已经有序且不重叠，不需要重新排序。扫描结果天然分为三段：

#. **左侧完全分离区间**：``interval.end < merged_start``；
#. **与新区间连通的重叠区间**：``interval.start <= merged_end``；
#. **右侧完全分离区间**：``interval.start > merged_end``。

其中 ``[merged_start, merged_end]`` 最初等于 ``newInterval``。处理中间段时持续执行：

.. code-block:: text

   merged_start = min(merged_start, interval.start)
   merged_end   = max(merged_end, interval.end)

由于原区间按起点排序，进入右侧阶段后，后续区间只会更靠右，不可能重新与合并段相交。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 算法额外空间
     - 定位
   * - 三阶段线性扫描
     - ``O(n)``
     - ``O(1)``
     - 主解法；直接利用有序且不重叠前提
   * - 追加新区间后重新排序并统一合并
     - ``O(n log n)``
     - 取决于排序实现
     - 通用但浪费已有顺序
   * - 逐个插入并反复移动数组
     - 最坏 ``O(n²)``
     - ``O(1)``
     - 数组移动成本高

返回结果最多包含 ``n + 1`` 个区间，因此输出空间为 ``O(n)``。

主解法：三阶段扫描
------------------

核心不变量
~~~~~~~~~~

扫描到下标 ``index`` 时保持：

* 已写入结果的左侧区间全部位于 ``merged_start`` 左侧，并保持原顺序；
* ``[merged_start, merged_end]`` 等于新区间与所有已扫描重叠区间的并集；
* 尚未扫描区间仍按起点升序且彼此不重叠；
* 结果中的每个区间都是独立快照，不依赖输入对象后续变化。

第一阶段：复制左侧区间
~~~~~~~~~~~~~~~~~~~~~~

当 ``intervals[index].end < merged_start`` 时，当前区间与新区间严格分离。由于区间是闭区间，
必须使用严格小于；若右端等于 ``merged_start``，两个区间共享端点，应进入合并阶段。

第二阶段：吸收全部重叠区间
~~~~~~~~~~~~~~~~~~~~~~~~~~

当 ``intervals[index].start <= merged_end`` 时，当前区间与合并段相交或端点相接。更新左右端点并继续
扫描。合并段右端可能扩大，从而继续吸收原本位于更右侧的区间。

第三阶段：复制右侧区间
~~~~~~~~~~~~~~~~~~~~~~

遇到第一个 ``interval.start > merged_end`` 后，当前合并段可以提交。排序保证所有后续区间起点更大，
不会再与它重叠，剩余区间按原顺序复制即可。

正确性依据
~~~~~~~~~~

**左段提交正确。** 第一阶段中的区间满足 ``end < merged_start``，与新区间及后续扩大的合并段均无
公共点。原序列有序且不重叠，所以它们可以永久写入结果。

**合并段覆盖完整。** 第二阶段逐个吸收所有满足 ``start <= merged_end`` 的区间。每次合并后，
``[merged_start, merged_end]`` 恰好是新区间与已吸收区间的最小闭区间并集。若右端扩大，循环继续
检查后续区间，因此不会漏掉链式重叠。

**合并段没有多余覆盖。** 更新端点只取参与合并区间的最小起点与最大终点。所有参与区间彼此通过
当前合并段连通，所以它们的并集没有内部断点，正好等于该闭区间。

**右段提交正确。** 当首个未处理区间满足 ``start > merged_end`` 时，它与合并段严格分离。后续起点
不会更小，因此都不可能重新连接合并段。

**顺序与不重叠。** 左段保持原顺序；合并段位于左段之后、右段之前；右段保持原顺序。三部分相邻
边界都严格分离，所以结果有序且两两不重叠。

**终止性。** 下标只向右移动，每个原区间最多处理一次，有限步后结束。

复杂度
~~~~~~

设原区间数量为 ``n``：

* 每个区间最多访问一次，时间复杂度为 ``O(n)``；
* 除结果容器、循环下标和合并端点外不保存随 ``n`` 增长的状态，算法额外空间为 ``O(1)``；
* 返回结果最多含 ``n + 1`` 个二元区间，占 ``O(n)`` 输出空间；
* 某些语言会为每个输出区间建立独立数组或向量，这是结果载荷，不计入算法额外空间。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>

   static void free_rows(int **rows, int count) {
       if (rows == NULL) {
           return;
       }
       for (int index = 0; index < count; ++index) {
           free(rows[index]);
       }
       free(rows);
   }

   static bool append_interval(
       int **result,
       int *column_sizes,
       int *write,
       int start,
       int end
   ) {
       int *row = malloc(2U * sizeof(*row));
       if (row == NULL) {
           return false;
       }
       row[0] = start;
       row[1] = end;
       result[*write] = row;
       column_sizes[*write] = 2;
       ++(*write);
       return true;
   }

   int **insert(
       int **intervals,
       int intervalsSize,
       int *intervalsColSize,
       int *newInterval,
       int newIntervalSize,
       int *returnSize,
       int **returnColumnSizes
   ) {
       (void)intervalsColSize;
       (void)newIntervalSize;

       size_t capacity = (size_t)intervalsSize + 1U;
       int **result = malloc(capacity * sizeof(*result));
       int *column_sizes = malloc(capacity * sizeof(*column_sizes));
       if (result == NULL || column_sizes == NULL) {
           free(result);
           free(column_sizes);
           *returnSize = 0;
           *returnColumnSizes = NULL;
           return NULL;
       }

       int write = 0;
       int index = 0;
       int merged_start = newInterval[0];
       int merged_end = newInterval[1];

       while (
           index < intervalsSize &&
           intervals[index][1] < merged_start
       ) {
           if (!append_interval(
               result,
               column_sizes,
               &write,
               intervals[index][0],
               intervals[index][1]
           )) {
               free_rows(result, write);
               free(column_sizes);
               *returnSize = 0;
               *returnColumnSizes = NULL;
               return NULL;
           }
           ++index;
       }

       while (
           index < intervalsSize &&
           intervals[index][0] <= merged_end
       ) {
           if (intervals[index][0] < merged_start) {
               merged_start = intervals[index][0];
           }
           if (intervals[index][1] > merged_end) {
               merged_end = intervals[index][1];
           }
           ++index;
       }

       if (!append_interval(
           result,
           column_sizes,
           &write,
           merged_start,
           merged_end
       )) {
           free_rows(result, write);
           free(column_sizes);
           *returnSize = 0;
           *returnColumnSizes = NULL;
           return NULL;
       }

       while (index < intervalsSize) {
           if (!append_interval(
               result,
               column_sizes,
               &write,
               intervals[index][0],
               intervals[index][1]
           )) {
               free_rows(result, write);
               free(column_sizes);
               *returnSize = 0;
               *returnColumnSizes = NULL;
               return NULL;
           }
           ++index;
       }

       *returnSize = write;
       *returnColumnSizes = column_sizes;
       return result;
   }

结果容量由 ``n + 1`` 精确推导。任一行分配失败时释放此前全部行，资源失败不会伪装成合法空结果。

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   public:
       std::vector<std::vector<int>> insert(
           const std::vector<std::vector<int>>& intervals,
           const std::vector<int>& newInterval
       ) {
           std::vector<std::vector<int>> result;
           result.reserve(intervals.size() + 1U);

           std::size_t index = 0;
           int mergedStart = newInterval[0];
           int mergedEnd = newInterval[1];

           while (
               index < intervals.size() &&
               intervals[index][1] < mergedStart
           ) {
               result.push_back(intervals[index]);
               ++index;
           }

           while (
               index < intervals.size() &&
               intervals[index][0] <= mergedEnd
           ) {
               mergedStart = std::min(
                   mergedStart,
                   intervals[index][0]
               );
               mergedEnd = std::max(
                   mergedEnd,
                   intervals[index][1]
               );
               ++index;
           }

           result.push_back({mergedStart, mergedEnd});

           while (index < intervals.size()) {
               result.push_back(intervals[index]);
               ++index;
           }
           return result;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def insert(
           self,
           intervals: list[list[int]],
           newInterval: list[int],
       ) -> list[list[int]]:
           result: list[list[int]] = []
           index = 0
           merged_start, merged_end = newInterval

           while (
               index < len(intervals)
               and intervals[index][1] < merged_start
           ):
               result.append(intervals[index].copy())
               index += 1

           while (
               index < len(intervals)
               and intervals[index][0] <= merged_end
           ):
               merged_start = min(
                   merged_start,
                   intervals[index][0],
               )
               merged_end = max(
                   merged_end,
                   intervals[index][1],
               )
               index += 1

           result.append([merged_start, merged_end])

           while index < len(intervals):
               result.append(intervals[index].copy())
               index += 1

           return result

显式复制二元列表，使结果快照不与输入内层列表共享。

Java
~~~~

.. code-block:: java

   import java.util.Arrays;

   class Solution {
       public int[][] insert(int[][] intervals, int[] newInterval) {
           int[][] result = new int[intervals.length + 1][2];
           int write = 0;
           int index = 0;
           int mergedStart = newInterval[0];
           int mergedEnd = newInterval[1];

           while (
               index < intervals.length &&
               intervals[index][1] < mergedStart
           ) {
               result[write++] = Arrays.copyOf(intervals[index], 2);
               ++index;
           }

           while (
               index < intervals.length &&
               intervals[index][0] <= mergedEnd
           ) {
               mergedStart = Math.min(
                   mergedStart,
                   intervals[index][0]
               );
               mergedEnd = Math.max(
                   mergedEnd,
                   intervals[index][1]
               );
               ++index;
           }

           result[write++] = new int[]{mergedStart, mergedEnd};

           while (index < intervals.length) {
               result[write++] = Arrays.copyOf(intervals[index], 2);
               ++index;
           }

           return Arrays.copyOf(result, write);
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn insert(
           intervals: Vec<Vec<i32>>,
           new_interval: Vec<i32>,
       ) -> Vec<Vec<i32>> {
           let mut result: Vec<Vec<i32>> =
               Vec::with_capacity(intervals.len() + 1);
           let mut index = 0usize;
           let mut merged_start = new_interval[0];
           let mut merged_end = new_interval[1];

           while
               index < intervals.len()
               && intervals[index][1] < merged_start
           {
               result.push(intervals[index].clone());
               index += 1;
           }

           while
               index < intervals.len()
               && intervals[index][0] <= merged_end
           {
               merged_start =
                   merged_start.min(intervals[index][0]);
               merged_end =
                   merged_end.max(intervals[index][1]);
               index += 1;
           }

           result.push(vec![merged_start, merged_end]);

           while index < intervals.len() {
               result.push(intervals[index].clone());
               index += 1;
           }
           result
       }
   }

平台按值传入 ``intervals``，当前写法仍建立独立结果行；二元向量克隆属于输出载荷。

Go
~~

.. code-block:: go

   func insert(intervals [][]int, newInterval []int) [][]int {
       result := make([][]int, 0, len(intervals)+1)
       index := 0
       mergedStart := newInterval[0]
       mergedEnd := newInterval[1]

       for index < len(intervals) &&
           intervals[index][1] < mergedStart {
           result = append(
               result,
               []int{intervals[index][0], intervals[index][1]},
           )
           index++
       }

       for index < len(intervals) &&
           intervals[index][0] <= mergedEnd {
           if intervals[index][0] < mergedStart {
               mergedStart = intervals[index][0]
           }
           if intervals[index][1] > mergedEnd {
               mergedEnd = intervals[index][1]
           }
           index++
       }

       result = append(result, []int{mergedStart, mergedEnd})

       for index < len(intervals) {
           result = append(
               result,
               []int{intervals[index][0], intervals[index][1]},
           )
           index++
       }
       return result
   }

每个输出区间建立新的二元切片，避免结果与输入行共享底层数组。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function insert(
       intervals: number[][],
       newInterval: number[],
   ): number[][] {
       const result: number[][] = [];
       let index = 0;
       let mergedStart = newInterval[0];
       let mergedEnd = newInterval[1];

       while (
           index < intervals.length &&
           intervals[index][1] < mergedStart
       ) {
           result.push([
               intervals[index][0],
               intervals[index][1],
           ]);
           index += 1;
       }

       while (
           index < intervals.length &&
           intervals[index][0] <= mergedEnd
       ) {
           mergedStart = Math.min(
               mergedStart,
               intervals[index][0],
           );
           mergedEnd = Math.max(
               mergedEnd,
               intervals[index][1],
           );
           index += 1;
       }

       result.push([mergedStart, mergedEnd]);

       while (index < intervals.length) {
           result.push([
               intervals[index][0],
               intervals[index][1],
           ]);
           index += 1;
       }
       return result;
   }

C#
~~

.. code-block:: csharp

   using System;
   using System.Collections.Generic;

   public class Solution {
       public int[][] Insert(
           int[][] intervals,
           int[] newInterval
       ) {
           var result = new List<int[]>(intervals.Length + 1);
           int index = 0;
           int mergedStart = newInterval[0];
           int mergedEnd = newInterval[1];

           while (
               index < intervals.Length &&
               intervals[index][1] < mergedStart
           ) {
               result.Add(new int[] {
                   intervals[index][0],
                   intervals[index][1]
               });
               ++index;
           }

           while (
               index < intervals.Length &&
               intervals[index][0] <= mergedEnd
           ) {
               mergedStart = Math.Min(
                   mergedStart,
                   intervals[index][0]
               );
               mergedEnd = Math.Max(
                   mergedEnd,
                   intervals[index][1]
               );
               ++index;
           }

           result.Add(new int[] { mergedStart, mergedEnd });

           while (index < intervals.Length) {
               result.Add(new int[] {
                   intervals[index][0],
                   intervals[index][1]
               });
               ++index;
           }
           return result.ToArray();
       }
   }

Julia
~~~~~

.. code-block:: julia

   function insert_interval(
       intervals::Vector{Vector{Int}},
       new_interval::Vector{Int},
   )::Vector{Vector{Int}}
       result = Vector{Vector{Int}}()
       sizehint!(result, length(intervals) + 1)

       index = 1
       merged_start = new_interval[1]
       merged_end = new_interval[2]

       while (
           index <= length(intervals) &&
           intervals[index][2] < merged_start
       )
           push!(
               result,
               [intervals[index][1], intervals[index][2]],
           )
           index += 1
       end

       while (
           index <= length(intervals) &&
           intervals[index][1] <= merged_end
       )
           merged_start = min(
               merged_start,
               intervals[index][1],
           )
           merged_end = max(
               merged_end,
               intervals[index][2],
           )
           index += 1
       end

       push!(result, [merged_start, merged_end])

       while index <= length(intervals)
           push!(
               result,
               [intervals[index][1], intervals[index][2]],
           )
           index += 1
       end
       result
   end

R
~

.. code-block:: r

   insert_interval <- function(intervals, new_interval) {
     count <- nrow(intervals)
     result <- matrix(
       0L,
       nrow = count + 1L,
       ncol = 2L
     )
     write <- 0L
     index <- 1L
     merged_start <- new_interval[[1L]]
     merged_end <- new_interval[[2L]]

     while (
       index <= count &&
       intervals[index, 2L] < merged_start
     ) {
       write <- write + 1L
       result[write, ] <- intervals[index, ]
       index <- index + 1L
     }

     while (
       index <= count &&
       intervals[index, 1L] <= merged_end
     ) {
       merged_start <- min(
         merged_start,
         intervals[index, 1L]
       )
       merged_end <- max(
         merged_end,
         intervals[index, 2L]
       )
       index <- index + 1L
     }

     write <- write + 1L
     result[write, ] <- c(merged_start, merged_end)

     while (index <= count) {
       write <- write + 1L
       result[write, ] <- intervals[index, ]
       index <- index + 1L
     }

     result[seq_len(write), , drop = FALSE]
   }

R 无法表达平台的原地二维数组接口；这里预分配结果矩阵并返回独立适配器对象。

语言语义与边界
--------------

* 闭区间重叠条件是 ``next_start <= merged_end``，不能误写成严格小于；
* 原区间已经排序且不重叠，主解法不重新排序；
* 输出区间是独立快照，避免结果与输入内层容器共享；
* 输入为空时三阶段扫描仍自然返回新区间；
* C 的多层结果分配遵守整体成功或整体清理契约；
* 所有端点和下标范围都安全落在 32 位整数内。

验证
----

固定用例
~~~~~~~~

覆盖：

* 空输入；
* 插入最前方和最后方；
* 完全包含与被包含；
* 跨越多个区间的链式合并；
* 端点相接的闭区间；
* 新区间与所有原区间分离。

随机对拍
~~~~~~~~

随机生成有序、两两分离的闭区间和新区间；主算法与“追加新区间、按起点排序、统一合并”的独立参考
算法比较结果，检查：

* 输出按起点升序；
* 输出区间两两严格分离；
* 输出覆盖并集与输入加新区间完全相同。

关联题目
--------

* ``0056. Merge Intervals``：先排序再合并任意区间集合；
* ``0057. Insert Interval``：本题直接利用已有有序不重叠结构；
* ``0035. Search Insert Position``：有序序列中的边界定位。
