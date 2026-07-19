0056. Merge Intervals
=====================

题目信息
--------

:题号: 0056
:难度: Medium
:主题: 区间、排序、贪心、扫描合并
:原题: `LeetCode 0056 <https://leetcode.com/problems/merge-intervals/>`_
:访问状态: Available
:教学重点: 起点排序、当前合并段、闭区间相交、结果快照与输入修改

题目重述
--------

给定若干闭区间 ``[start, end]``，合并所有相互重叠的区间，返回互不重叠且覆盖范围相同的区间列表。

题目保证 ``1 <= intervals.length <= 10000``，每个区间恰有两个整数，并满足
``0 <= start <= end <= 10000``。结果顺序按照起点递增返回。

主实现按起点、终点排序输入区间。可变容器语言会重排输入；Rust 消费传入向量；R 使用排序索引建立
新的矩阵视图。返回结果始终建立独立区间快照。

自建示例
--------

普通重叠
~~~~~~~~

.. code-block:: text

   输入：[[1,3], [2,6], [8,10], [15,18]]
   输出：[[1,6], [8,10], [15,18]]

端点接触
~~~~~~~~

.. code-block:: text

   输入：[[1,4], [4,5]]
   输出：[[1,5]]

区间是闭区间，端点 4 同时属于两者，因此需要合并。

包含关系
~~~~~~~~

.. code-block:: text

   输入：[[1,10], [2,3], [4,8]]
   输出：[[1,10]]

问题抽象
--------

先按 ``start`` 升序排序；起点相同时按 ``end`` 升序排序。扫描时维护当前合并区间
``[current_start, current_end]``：

* 若 ``next_start <= current_end``，下一个闭区间与当前区间重叠，更新
  ``current_end = max(current_end, next_end)``；
* 若 ``next_start > current_end``，下一个区间以及所有更晚区间都无法与当前区间重叠，把当前区间
  写入答案，再以新区间开始。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 排序后线性合并
     - ``O(n log n)``
     - ``O(log n)``
     - 主解法；排序栈之外只维护当前区间
   * - 按端点扫描线
     - ``O(n log n)``
     - ``O(n)``
     - 可推广到覆盖计数，本题状态更重
   * - 两两反复合并
     - 最坏 ``O(n²)``
     - ``O(n)``
     - 合并后还需重新检查其他区间

主解法：排序后维护当前覆盖段
----------------------------

核心不变量
~~~~~~~~~~

扫描完排序数组的前 ``i`` 个区间后：

* 结果列表中的区间互不重叠，且起点严格递增；
* 结果列表已经完整覆盖所有已完成的合并组；
* ``[current_start, current_end]`` 是最后一个尚未提交的合并组；
* 已扫描区间的并集等于结果列表与当前合并组的并集；
* 未来区间起点不会小于当前扫描位置的起点。

为什么分离后可以提交
~~~~~~~~~~~~~~~~~~~~

若 ``next_start > current_end``，排序保证未来所有区间的起点都满足
``future_start >= next_start > current_end``。因此未来区间也不可能与当前合并组相交，当前组可以永久
写入答案。

正确性依据
~~~~~~~~~~

**重叠合并正确。** 当 ``next_start <= current_end`` 时，两个闭区间有公共点。它们的并集仍是连续
区间，左端保持 ``current_start``，右端为两者右端点最大值。

**分组完整。** 扫描过程中，只要新区间与当前组重叠就扩展右端；第一次出现严格分离时，排序保证
后续区间也无法回头连接当前组。因此每个连通覆盖组恰好提交一次。

**结果无重叠。** 提交当前组的条件是下一个起点严格大于当前右端。新区间及后续合并组的起点不会
减小，所以相邻输出区间严格分离。

**覆盖等价。** 合并只把相交区间替换为它们的并集，不增加或删除任何覆盖点。按组处理全部输入后，
输出区间并集与输入区间并集相同。

**终止性。** 排序后进行一次有限扫描，每轮消费一个区间，最后提交当前组。

复杂度
~~~~~~

设区间数量为 ``n``：

* 排序时间为 ``O(n log n)``，线性扫描为 ``O(n)``；
* 原地排序的比较排序通常使用 ``O(log n)`` 调用栈；具体标准库可能具有不同常数和最坏保证；
* 返回结果最多包含 ``n`` 个区间，占 ``O(n)`` 输出空间；
* 某语言为避免修改输入而复制区间时，应额外计入 ``O(n)`` 适配器空间。本题实现会明确各自语义。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>

   static int compare_intervals(const void *left, const void *right) {
       int *const *a = left;
       int *const *b = right;

       if ((*a)[0] < (*b)[0]) {
           return -1;
       }
       if ((*a)[0] > (*b)[0]) {
           return 1;
       }
       if ((*a)[1] < (*b)[1]) {
           return -1;
       }
       if ((*a)[1] > (*b)[1]) {
           return 1;
       }
       return 0;
   }

   int **merge(
       int **intervals,
       int intervalsSize,
       int *intervalsColSize,
       int *returnSize,
       int **returnColumnSizes
   ) {
       (void)intervalsColSize;
       qsort(
           intervals,
           (size_t)intervalsSize,
           sizeof(*intervals),
           compare_intervals
       );

       int **result = malloc(
           (size_t)intervalsSize * sizeof(*result)
       );
       int *column_sizes = malloc(
           (size_t)intervalsSize * sizeof(*column_sizes)
       );
       if (result == NULL || column_sizes == NULL) {
           free(result);
           free(column_sizes);
           *returnSize = 0;
           *returnColumnSizes = NULL;
           return NULL;
       }

       int size = 0;
       int current_start = intervals[0][0];
       int current_end = intervals[0][1];

       for (int index = 1; index < intervalsSize; ++index) {
           int next_start = intervals[index][0];
           int next_end = intervals[index][1];

           if (next_start <= current_end) {
               if (next_end > current_end) {
                   current_end = next_end;
               }
               continue;
           }

           int *merged = malloc(2 * sizeof(*merged));
           if (merged == NULL) {
               for (int row = 0; row < size; ++row) {
                   free(result[row]);
               }
               free(result);
               free(column_sizes);
               *returnSize = 0;
               *returnColumnSizes = NULL;
               return NULL;
           }
           merged[0] = current_start;
           merged[1] = current_end;
           result[size] = merged;
           column_sizes[size] = 2;
           ++size;

           current_start = next_start;
           current_end = next_end;
       }

       int *merged = malloc(2 * sizeof(*merged));
       if (merged == NULL) {
           for (int row = 0; row < size; ++row) {
               free(result[row]);
           }
           free(result);
           free(column_sizes);
           *returnSize = 0;
           *returnColumnSizes = NULL;
           return NULL;
       }
       merged[0] = current_start;
       merged[1] = current_end;
       result[size] = merged;
       column_sizes[size] = 2;
       ++size;

       *returnSize = size;
       *returnColumnSizes = column_sizes;
       return result;
   }

比较器使用分支比较，避免用减法造成溢出。函数会重排 ``intervals`` 指针数组；结果中的每一行都是
独立堆分配，失败时清理全部已完成行。

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   public:
       std::vector<std::vector<int>> merge(
           std::vector<std::vector<int>>& intervals
       ) {
           std::sort(
               intervals.begin(),
               intervals.end(),
               [](const auto& left, const auto& right) {
                   if (left[0] != right[0]) {
                       return left[0] < right[0];
                   }
                   return left[1] < right[1];
               }
           );

           std::vector<std::vector<int>> result;
           result.reserve(intervals.size());

           for (const auto& interval : intervals) {
               if (result.empty() ||
                   interval[0] > result.back()[1]) {
                   result.push_back(interval);
               } else {
                   result.back()[1] = std::max(
                       result.back()[1],
                       interval[1]
                   );
               }
           }
           return result;
       }
   };

输入向量按引用排序，调用后顺序改变；``push_back`` 复制当前区间形成独立结果。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def merge(self, intervals: list[list[int]]) -> list[list[int]]:
           intervals.sort(key=lambda interval: (interval[0], interval[1]))
           result: list[list[int]] = []

           for start, end in intervals:
               if not result or start > result[-1][1]:
                   result.append([start, end])
               else:
                   result[-1][1] = max(result[-1][1], end)

           return result

``list.sort`` 原地重排输入列表；结果行是新建列表，不与输入区间共享。

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.Arrays;
   import java.util.List;

   class Solution {
       public int[][] merge(int[][] intervals) {
           Arrays.sort(
               intervals,
               (left, right) -> {
                   int byStart = Integer.compare(left[0], right[0]);
                   return byStart != 0
                       ? byStart
                       : Integer.compare(left[1], right[1]);
               }
           );

           List<int[]> result = new ArrayList<>(intervals.length);
           int currentStart = intervals[0][0];
           int currentEnd = intervals[0][1];

           for (int index = 1; index < intervals.length; ++index) {
               int nextStart = intervals[index][0];
               int nextEnd = intervals[index][1];

               if (nextStart <= currentEnd) {
                   currentEnd = Math.max(currentEnd, nextEnd);
               } else {
                   result.add(new int[] {currentStart, currentEnd});
                   currentStart = nextStart;
                   currentEnd = nextEnd;
               }
           }
           result.add(new int[] {currentStart, currentEnd});
           return result.toArray(new int[result.size()][]);
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn merge(mut intervals: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
           intervals.sort_unstable_by(|left, right| {
               left[0]
                   .cmp(&right[0])
                   .then(left[1].cmp(&right[1]))
           });

           let mut result: Vec<Vec<i32>> =
               Vec::with_capacity(intervals.len());

           for interval in intervals {
               if let Some(last) = result.last_mut() {
                   if interval[0] <= last[1] {
                       last[1] = last[1].max(interval[1]);
                       continue;
                   }
               }
               result.push(interval);
           }
           result
       }
   }

输入向量按值传入，函数取得其所有权并排序；新区间可直接移动到结果，无需复制行向量。

Go
~~

.. code-block:: go

   import "sort"

   func merge(intervals [][]int) [][]int {
       sort.Slice(intervals, func(i int, j int) bool {
           if intervals[i][0] != intervals[j][0] {
               return intervals[i][0] < intervals[j][0]
           }
           return intervals[i][1] < intervals[j][1]
       })

       result := make([][]int, 0, len(intervals))
       for _, interval := range intervals {
           if len(result) == 0 ||
               interval[0] > result[len(result)-1][1] {
               result = append(
                   result,
                   []int{interval[0], interval[1]},
               )
           } else if interval[1] > result[len(result)-1][1] {
               result[len(result)-1][1] = interval[1]
           }
       }
       return result
   }

排序会重排输入外层切片。结果为每个区间新建长度 2 的切片，避免后续修改输入行影响结果。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function merge(intervals: number[][]): number[][] {
       intervals.sort((left, right) => {
           if (left[0] !== right[0]) {
               return left[0] - right[0];
           }
           return left[1] - right[1];
       });

       const result: number[][] = [];
       for (const [start, end] of intervals) {
           const last = result[result.length - 1];
           if (last === undefined || start > last[1]) {
               result.push([start, end]);
           } else {
               last[1] = Math.max(last[1], end);
           }
       }
       return result;
   }

端点范围只有 ``0..10000``，比较器减法精确落在安全整数范围。排序会改变输入外层数组顺序。

C#
~~

.. code-block:: csharp

   using System;

   public class Solution {
       public int[][] Merge(int[][] intervals) {
           Array.Sort(
               intervals,
               (left, right) => {
                   int byStart = left[0].CompareTo(right[0]);
                   return byStart != 0
                       ? byStart
                       : left[1].CompareTo(right[1]);
               }
           );

           var result = new int[intervals.Length][];
           int size = 0;
           int currentStart = intervals[0][0];
           int currentEnd = intervals[0][1];

           for (int index = 1; index < intervals.Length; ++index) {
               int nextStart = intervals[index][0];
               int nextEnd = intervals[index][1];

               if (nextStart <= currentEnd) {
                   currentEnd = Math.Max(currentEnd, nextEnd);
               } else {
                   result[size++] =
                       new int[] {currentStart, currentEnd};
                   currentStart = nextStart;
                   currentEnd = nextEnd;
               }
           }
           result[size++] = new int[] {currentStart, currentEnd};

           var exact = new int[size][];
           Array.Copy(result, exact, size);
           return exact;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function merge_intervals(
       intervals::Vector{Vector{Int}}
   )::Vector{Vector{Int}}
       sort!(intervals, by = interval -> (interval[1], interval[2]))
       result = Vector{Vector{Int}}()

       for interval in intervals
           if isempty(result) || interval[1] > result[end][2]
               push!(result, [interval[1], interval[2]])
           else
               result[end][2] = max(result[end][2], interval[2])
           end
       end
       result
   end

``sort!`` 会修改输入向量顺序；结果使用新建二元素向量保存快照。

R
~

.. code-block:: r

   merge_intervals <- function(intervals) {
     ordering <- order(intervals[, 1L], intervals[, 2L])
     sorted <- intervals[ordering, , drop = FALSE]
     result <- matrix(
       0L,
       nrow = nrow(sorted),
       ncol = 2L
     )
     size <- 0L

     current_start <- sorted[1L, 1L]
     current_end <- sorted[1L, 2L]

     if (nrow(sorted) >= 2L) {
       for (index in 2L:nrow(sorted)) {
         next_start <- sorted[index, 1L]
         next_end <- sorted[index, 2L]

         if (next_start <= current_end) {
           current_end <- max(current_end, next_end)
         } else {
           size <- size + 1L
           result[size, ] <- c(current_start, current_end)
           current_start <- next_start
           current_end <- next_end
         }
       }
     }

     size <- size + 1L
     result[size, ] <- c(current_start, current_end)
     result[seq_len(size), , drop = FALSE]
   }

R 使用排序索引产生 ``sorted`` 副本，并预分配最大结果矩阵；额外适配器空间为 ``O(n)``。

验证计划与证据
--------------

* 固定用例覆盖普通重叠、端点接触、包含、完全分离、相同起点和单区间；
* 随机区间与离散点覆盖参考实现对拍；
* 检查结果按起点递增、相邻区间严格分离；
* 检查输入与输出覆盖的整数点集合一致。

已完成的验证：

* **运行验证：** C、C++、Python、Java、Go、TypeScript 执行重叠、接触、包含、分离和单区间用例；
* **随机对拍：** Python 对随机短区间集合与独立的反复连通合并实现一致；
* **编译验证：** C17 ``-Wall -Wextra -Werror``、C++17、``javac -Xlint:all``、
  TypeScript ``tsc --strict``；
* **静态验证：** Rust、C#、Julia、R 检查排序语义、快照独立性和一基访问；
* **内存验证：** C 使用 AddressSanitizer 与 UndefinedBehaviorSanitizer 检查多层返回和失败清理；
* 当前环境未安装 Rust、C#、Julia、R 运行时，因此不声称运行通过。

关键边界
--------

* 闭区间满足 ``next_start == current_end`` 时也需要合并；
* 排序后第一个区间用于初始化，非空约束支撑访问；
* 当前组提交后必须完整重置两个端点；
* 结果行必须与输入行独立；
* 输入排序和适配器复制需要明确说明；
* C 多层返回结构的每行长度固定为 2。

易错点
------

* 使用 ``next_start < current_end``，漏掉端点接触；
* 只按终点排序，无法保证当前组永久可提交；
* 直接把输入区间引用放入结果后再修改，造成共享别名；
* 比较器使用不受约束的大整数减法；
* 忘记在循环结束后提交最后一个合并组。

本题新增知识
------------

* 排序把任意区间集合转化为可单向提交的扫描序列；
* 闭区间重叠条件是 ``next_start <= current_end``；
* 一旦出现严格分离，排序保证未来区间无法回连当前组；
* 结果快照和输入排序语义需要分别说明。

本题强化知识
------------

* 0015、0018 的排序后双指针/多指针扫描；
* 0034 的边界与闭区间语义；
* C 多层结果结构、事务式失败清理和列长度数组；
* 输入原地排序与返回副本的所有权边界。

关联题目
--------

* `0057. Insert Interval <0057-insert-interval.rst>`_：有序不重叠区间中插入并合并；
* `0034. Find First and Last Position
  <0034-find-first-and-last-position-of-element-in-sorted-array.rst>`_：闭区间边界与有序扫描。

最小自检
--------

#. 为什么必须先按起点排序？
#. ``next_start == current_end`` 是否需要合并？
#. 为什么一旦严格分离，当前组就可以永久提交？
#. 结果为什么要保存独立区间快照？
#. 排序是否修改输入？

答案要点
~~~~~~~~

#. 排序保证未来区间起点不减，当前合并组才能单向扩展和永久提交。
#. 需要；闭区间在该端点相交。
#. 后续起点只会更大，不可能再次落入当前右端。
#. 避免输入排序或后续端点修改通过共享引用污染结果。
#. C、C++、Python、Java、Go、TypeScript、C#、Julia 会重排输入；Rust 消费所有权；R 建立排序副本。
