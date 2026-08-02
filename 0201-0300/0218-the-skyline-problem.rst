0218. The Skyline Problem
=========================

题目信息
--------

:题号: 0218
:难度: Hard
:主题: 扫描线、最大堆、惰性删除、关键点规范化
:原题: `LeetCode 0218 <https://leetcode.com/problems/the-skyline-problem/>`_
:访问状态: Available
:教学重点: 半开区间、同坐标整体处理、活动建筑最大高度、惰性删除

精确契约
--------

输入 ``buildings`` 中每栋建筑表示为 ``[left, right, height]``，覆盖半开区间
``left <= x < right``。题目保证：

* ``1 <= buildings.length <= 10^4``；
* ``0 <= left < right <= 2^31 - 1``；
* ``1 <= height <= 2^31 - 1``；

输出由关键点 ``[x, height]`` 组成。关键点表示从横坐标 ``x`` 开始，天空线高度变为
``height``。结果必须满足：

* 横坐标严格递增；
* 相邻关键点的高度不同；
* 最后一个关键点的高度为 0；
* 建筑之间的地面空隙也属于轮廓；
* 输入数组保持只读。

半开区间决定了右边界的含义：建筑 ``[2, 5, 7]`` 在 ``x = 4`` 仍然有效，在
``x = 5`` 已经结束。因此清理过期建筑时使用 ``right <= x``，不能写成 ``right < x``。

示例与边界
----------

经典重叠建筑
~~~~~~~~~~~~

.. code-block:: text

   buildings = [
       [2,9,10], [3,7,15], [5,12,12],
       [15,20,10], [19,24,8]
   ]

   skyline = [
       [2,10], [3,15], [7,12], [12,0],
       [15,10], [20,8], [24,0]
   ]

在 ``x = 7``，高度 15 的建筑结束，高度 12 的建筑仍然覆盖该位置，所以轮廓从
15 降到 12，而不是直接降到 0。

相邻等高建筑
~~~~~~~~~~~~

.. code-block:: text

   [[0,2,3], [2,5,3]] -> [[0,3], [5,0]]

``x = 2`` 同时发生旧建筑结束和新建筑开始。处理完该坐标的全部变化后，最大高度仍为
3，因此不能输出 ``[2,0]`` 或新的 ``[2,3]``。

同起点建筑
~~~~~~~~~~

.. code-block:: text

   [[2,6,4], [2,6,9], [2,6,7]] -> [[2,9], [6,0]]

同一横坐标只允许根据全部事件处理后的最终高度输出一次。

包含关系
~~~~~~~~

.. code-block:: text

   [[1,10,3], [3,7,8]] -> [[1,3], [3,8], [7,3], [10,0]]

内部高建筑结束后，外部低建筑重新成为最高的活动建筑。

问题抽象
--------

对任意横坐标 ``x``，天空线高度等于所有覆盖 ``x`` 的建筑高度最大值：

.. code-block:: text

   skyline(x) = max(height_i), 其中 left_i <= x < right_i

高度只可能在建筑的左边界或右边界发生变化。两个相邻边界之间没有建筑开始或结束，
活动建筑集合保持不变，最大高度也保持不变。

因此问题可以拆成两个部分：

#. 按横坐标从左向右扫描全部边界；
#. 动态维护当前活动建筑中的最大高度。

第二部分适合使用最大堆。堆元素保存 ``(height, right)``：

* ``height`` 用于取得当前最大高度；
* ``right`` 用于判断堆顶建筑是否已经结束。

解法：边界扫描与最大堆
----------------------

先收集所有建筑的左、右边界，排序并去重。随后依次处理每个边界 ``x``：

#. 把所有满足 ``left <= x`` 的建筑加入最大堆；
#. 反复弹出满足 ``right <= x`` 的过期堆顶；
#. 堆顶高度就是 ``x`` 之后这一段轮廓的高度，堆空时高度为 0；
#. 只有当前高度与上一个输出高度不同，才追加 ``[x, current_height]``。

伪代码如下：

.. code-block:: text

   boundaries = sort_unique(all left and right)
   heap = empty max heap ordered by height
   ordered = sort_copy(buildings by left)
   building_index = 0
   previous_height = 0

   for x in boundaries:
       while building_index < n and ordered[building_index].left <= x:
           heap.push(height, right)
           building_index += 1

       while heap is not empty and heap.top.right <= x:
           heap.pop()

       current_height = heap.top.height if heap is not empty else 0
       if current_height != previous_height:
           answer.append([x, current_height])
           previous_height = current_height

为什么必须按坐标整体处理
------------------------

同一横坐标可能有多栋建筑开始，也可能有多栋建筑结束。轮廓关心的是这个坐标处理完成后的
最大高度，不关心事件的中间顺序。

以 ``[[0,2,3], [2,5,3]]`` 为例。如果先处理结束事件并立即输出，会暂时得到高度 0；再处理
开始事件，又回到高度 3。这两个中间状态都不属于真实天空线。

本文对边界去重，每个横坐标只读取一次最终堆顶，因此天然消除了同坐标伪关键点。

扫描状态与不变量
----------------

扫描到边界 ``x`` 时维护三个状态：

``building_index``
   按左边界排序的副本中第一栋尚未加入堆的建筑。排序后加入过程只需要单调向右移动，不能直接假设调用者传入数组已经有序。

``heap``
   所有已经开始、但尚未从堆中删除的候选建筑。堆顶按高度最大排列。

``previous_height``
   最近一个已输出关键点的高度，用于消除连续等高线段。

在读取当前高度前，保持以下不变量：

#. 所有 ``left <= x`` 的建筑都已经加入堆；
#. 所有尚未加入的建筑都满足 ``left > x``；
#. 清理结束后，堆顶若存在，一定满足 ``right > x``；
#. 清理后的堆顶高度等于所有活动建筑的最大高度。

惰性删除
--------

普通二叉堆只能高效删除堆顶，无法根据右边界直接删除堆内部任意建筑。因此已经结束的建筑
可能暂时留在堆中，直到它上升到堆顶时再删除，这就是惰性删除。

过期的非堆顶元素不会影响答案：

* 它不是堆顶时，不负责当前最大高度；
* 当压在它上方的建筑被删除后，它可能成为堆顶；
* 每次读取高度前都会持续检查 ``right <= x``，所以它一旦成为堆顶就会被清理；
* 清理循环结束后，堆顶一定是仍然活动的建筑。

这里必须使用 ``while``，因为弹出一个过期堆顶后，下一个堆顶也可能已经过期。

正确性证明
----------

引理一：高度变化只可能发生在建筑边界
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任取两个相邻边界 ``x1 < x2``。开区间 ``(x1, x2)`` 内没有任何建筑开始或结束，
每栋建筑在整个区间内的活动状态不变。因此活动建筑集合及其最大高度不变。

所以扫描全部左右边界足以覆盖所有可能的高度变化。

引理二：清理后的堆顶高度等于当前真实高度
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

加入阶段结束后，所有满足 ``left <= x`` 的建筑都已经进入堆。清理阶段持续删除
``right <= x`` 的堆顶，因此最终堆顶若存在，满足 ``left <= x < right``，是活动建筑。

所有活动建筑都在堆中，而最大堆顶高度不小于堆中其他元素。过期且可能影响最大值的元素一旦
位于堆顶就会被删除。因此清理后的堆顶高度正是全部活动建筑的最大高度；堆空时真实高度为 0。

引理三：算法输出所有且仅有必要关键点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理一，高度只可能在扫描边界变化；由引理二，每个边界得到的 ``current_height`` 是真实高度。
当该高度与 ``previous_height`` 不同时，算法输出关键点，因此不会遗漏变化。

当两者相同时，轮廓仍处于同一水平线段，算法不输出，因此不会生成相邻等高的冗余关键点。
边界已经去重，所以同一横坐标最多输出一次。

定理：算法返回完整且规范化的天空线
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理二保证每个扫描位置的高度正确，引理三保证输出准确记录所有高度变化且没有冗余点。
最大右边界处理完成后，全部建筑都已过期，堆最终为空；若此前高度非零，算法输出高度 0 的终止点。
因此结果满足题目要求。

复杂度
------

设建筑数量为 ``n``，不同边界数量为 ``b``，输出关键点数量为 ``k``，其中 ``b <= 2n``。

* 复制并按左边界排序建筑、收集并排序边界需要 ``O(n log n)`` 时间；
* 每栋建筑入堆一次、至多出堆一次，共需要 ``O(n log n)`` 时间；
* 扫描边界需要 ``O(b)`` 时间；
* 总时间复杂度为 ``O(n log n)``；
* 边界数组和最大堆需要 ``O(n)`` 辅助空间；
* 返回结果需要 ``O(k)`` 空间。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<std::vector<int>> getSkyline(
           std::vector<std::vector<int>>& buildings) {
           std::vector<std::vector<int>> ordered = buildings;
           std::sort(ordered.begin(), ordered.end());

           std::vector<int> boundaries;
           boundaries.reserve(ordered.size() * 2);
           for (const auto& building : ordered) {
               boundaries.push_back(building[0]);
               boundaries.push_back(building[1]);
           }
           std::sort(boundaries.begin(), boundaries.end());
           boundaries.erase(
               std::unique(boundaries.begin(), boundaries.end()),
               boundaries.end());

           std::priority_queue<std::pair<int, int>> active;
           std::vector<std::vector<int>> answer;
           std::size_t next = 0;
           int previousHeight = 0;

           for (int x : boundaries) {
               while (next < ordered.size() && ordered[next][0] <= x) {
                   active.push({ordered[next][2], ordered[next][1]});
                   ++next;
               }
               while (!active.empty() && active.top().second <= x) {
                   active.pop();
               }

               int currentHeight = active.empty() ? 0 : active.top().first;
               if (currentHeight != previousHeight) {
                   answer.push_back({x, currentHeight});
                   previousHeight = currentHeight;
               }
           }
           return answer;
       }
   };

代码分析
--------

代码先复制并按 ``left`` 排序建筑，因为题目只给出每栋建筑的边界约束，并不保证输入数组顺序。``next`` 指向尚未加入堆的建筑；扫描到 ``x`` 时加入所有 ``left <= x`` 的建筑，再删除堆顶中 ``right <= x`` 的过期建筑。半开区间语义保证 ``right == x`` 的建筑在该位置已经失效。

堆按高度最大化，堆顶就是当前仍可能影响轮廓的最高建筑。堆只能直接删除堆顶，所以较矮的过期建筑可以暂留；等它成为堆顶时，清理循环会把它移除。每个边界只计算一次最终高度，只有高度与上一个关键点不同才输出，因此相邻等高建筑不会制造伪关键点，也会在最大右边界输出高度 0。

例如 ``[[0,2,3],[2,5,3]]`` 在 ``x=2`` 先加入第二栋、再清理第一栋，堆顶高度仍为 3，不会输出中间的 0；无序输入如 ``[[5,7,4],[1,3,2]]`` 也会先通过 ``ordered`` 排序，再按边界得到两个互不相连的轮廓。排序、边界扫描和堆操作的总时间复杂度为 ``O(n log n)``，排序副本、边界数组和堆占 ``O(n)`` 额外空间，返回结果另占 ``O(k)``。

十语言实现
----------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   typedef struct {
       int height;
       int right;
   } HeapNode;

   static int compare_ints(const void *left, const void *right) {
       int a = *(const int *)left;
       int b = *(const int *)right;
       return (a > b) - (a < b);
   }

   static int higher(HeapNode a, HeapNode b) {
       if (a.height != b.height) return a.height > b.height;
       return a.right > b.right;
   }

   static void heap_push(HeapNode *heap, int *size, HeapNode node) {
       int index = (*size)++;
       heap[index] = node;

       while (index > 0) {
           int parent = (index - 1) / 2;
           if (higher(heap[parent], heap[index])) break;

           HeapNode temporary = heap[parent];
           heap[parent] = heap[index];
           heap[index] = temporary;
           index = parent;
       }
   }

   static void heap_pop(HeapNode *heap, int *size) {
       --(*size);
       if (*size == 0) return;

       heap[0] = heap[*size];
       int index = 0;

       for (;;) {
           int left = index * 2 + 1;
           if (left >= *size) break;

           int right = left + 1;
           int best = left;
           if (right < *size && higher(heap[right], heap[left])) {
               best = right;
           }
           if (higher(heap[index], heap[best])) break;

           HeapNode temporary = heap[index];
           heap[index] = heap[best];
           heap[best] = temporary;
           index = best;
       }
   }

   static void free_rows(int **rows, int count) {
       if (rows == NULL) return;
       for (int i = 0; i < count; ++i) free(rows[i]);
       free(rows);
   }

   int **getSkyline(
       int **buildings,
       int buildingsSize,
       int *buildingsColSize,
       int *returnSize,
       int **returnColumnSizes
   ) {
       (void)buildingsColSize;
       *returnSize = 0;
       *returnColumnSizes = NULL;
       if (buildingsSize == 0) return NULL;

       int boundaryCount = buildingsSize * 2;
       int *boundaries = malloc((size_t)boundaryCount * sizeof(int));
       HeapNode *heap = malloc((size_t)buildingsSize * sizeof(HeapNode));
       int **rows = malloc((size_t)boundaryCount * sizeof(int *));
       int *columns = malloc((size_t)boundaryCount * sizeof(int));

       if (boundaries == NULL || heap == NULL || rows == NULL || columns == NULL) {
           free(boundaries);
           free(heap);
           free(rows);
           free(columns);
           return NULL;
       }

       for (int i = 0; i < buildingsSize; ++i) {
           boundaries[i * 2] = buildings[i][0];
           boundaries[i * 2 + 1] = buildings[i][1];
       }
       qsort(boundaries, (size_t)boundaryCount, sizeof(int), compare_ints);

       int uniqueCount = 0;
       for (int i = 0; i < boundaryCount; ++i) {
           if (uniqueCount == 0 || boundaries[i] != boundaries[uniqueCount - 1]) {
               boundaries[uniqueCount++] = boundaries[i];
           }
       }

       int buildingIndex = 0;
       int heapSize = 0;
       int resultSize = 0;
       int previousHeight = 0;

       for (int i = 0; i < uniqueCount; ++i) {
           int x = boundaries[i];

           while (buildingIndex < buildingsSize &&
                  buildings[buildingIndex][0] <= x) {
               HeapNode node = {
                   buildings[buildingIndex][2],
                   buildings[buildingIndex][1]
               };
               heap_push(heap, &heapSize, node);
               ++buildingIndex;
           }

           while (heapSize > 0 && heap[0].right <= x) {
               heap_pop(heap, &heapSize);
           }

           int currentHeight = heapSize == 0 ? 0 : heap[0].height;
           if (currentHeight != previousHeight) {
               int *row = malloc(2 * sizeof(int));
               if (row == NULL) {
                   free(boundaries);
                   free(heap);
                   free(columns);
                   free_rows(rows, resultSize);
                   return NULL;
               }
               row[0] = x;
               row[1] = currentHeight;
               rows[resultSize] = row;
               columns[resultSize] = 2;
               ++resultSize;
               previousHeight = currentHeight;
           }
       }

       free(boundaries);
       free(heap);
       *returnSize = resultSize;
       *returnColumnSizes = columns;
       return rows;
   }

C 版本直接使用题目给出的 ``n <= 10^4`` 约束分配数组。返回成功后，调用方拥有每个结果行、
行指针数组以及 ``returnColumnSizes``。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       std::vector<std::vector<int>> getSkyline(
           std::vector<std::vector<int>>& buildings
       ) {
           std::vector<int> boundaries;
           boundaries.reserve(buildings.size() * 2);

           for (const auto& building : buildings) {
               boundaries.push_back(building[0]);
               boundaries.push_back(building[1]);
           }

           std::sort(boundaries.begin(), boundaries.end());
           boundaries.erase(
               std::unique(boundaries.begin(), boundaries.end()),
               boundaries.end()
           );

           std::priority_queue<std::pair<int, int>> heap;
           std::vector<std::vector<int>> result;
           std::size_t buildingIndex = 0;
           int previousHeight = 0;

           for (int x : boundaries) {
               while (buildingIndex < buildings.size() &&
                      buildings[buildingIndex][0] <= x) {
                   heap.push({
                       buildings[buildingIndex][2],
                       buildings[buildingIndex][1]
                   });
                   ++buildingIndex;
               }

               while (!heap.empty() && heap.top().second <= x) {
                   heap.pop();
               }

               int currentHeight = heap.empty() ? 0 : heap.top().first;
               if (currentHeight != previousHeight) {
                   result.push_back({x, currentHeight});
                   previousHeight = currentHeight;
               }
           }

           return result;
       }
   };

``priority_queue<pair<int,int>>`` 先按高度、再按右边界取最大值。右边界的次级顺序不影响正确性。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def getSkyline(self, buildings: list[list[int]]) -> list[list[int]]:
           import heapq

           boundaries = sorted({
               x
               for left, right, _ in buildings
               for x in (left, right)
           })

           heap: list[tuple[int, int]] = []
           result: list[list[int]] = []
           building_index = 0
           previous_height = 0

           for x in boundaries:
               while (building_index < len(buildings)
                      and buildings[building_index][0] <= x):
                   left, right, height = buildings[building_index]
                   heapq.heappush(heap, (-height, right))
                   building_index += 1

               while heap and heap[0][1] <= x:
                   heapq.heappop(heap)

               current_height = -heap[0][0] if heap else 0
               if current_height != previous_height:
                   result.append([x, current_height])
                   previous_height = current_height

           return result

Python 的 ``heapq`` 是最小堆，因此保存负高度。

Java
~~~~

.. code-block:: java

   class Solution {
       public java.util.List<java.util.List<Integer>> getSkyline(int[][] buildings) {
           int[] boundaries = new int[buildings.length * 2];
           for (int i = 0; i < buildings.length; ++i) {
               boundaries[i * 2] = buildings[i][0];
               boundaries[i * 2 + 1] = buildings[i][1];
           }
           java.util.Arrays.sort(boundaries);

           java.util.PriorityQueue<int[]> heap = new java.util.PriorityQueue<>(
               (a, b) -> a[0] != b[0]
                   ? Integer.compare(b[0], a[0])
                   : Integer.compare(b[1], a[1])
           );
           java.util.List<java.util.List<Integer>> result =
               new java.util.ArrayList<>();

           int buildingIndex = 0;
           int previousHeight = 0;

           for (int i = 0; i < boundaries.length; ) {
               int x = boundaries[i];
               while (i < boundaries.length && boundaries[i] == x) {
                   ++i;
               }

               while (buildingIndex < buildings.length &&
                      buildings[buildingIndex][0] <= x) {
                   heap.offer(new int[] {
                       buildings[buildingIndex][2],
                       buildings[buildingIndex][1]
                   });
                   ++buildingIndex;
               }

               while (!heap.isEmpty() && heap.peek()[1] <= x) {
                   heap.poll();
               }

               int currentHeight = heap.isEmpty() ? 0 : heap.peek()[0];
               if (currentHeight != previousHeight) {
                   result.add(java.util.Arrays.asList(x, currentHeight));
                   previousHeight = currentHeight;
               }
           }

           return result;
       }
   }

比较器使用 ``Integer.compare``，避免减法比较带来的溢出风险。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn get_skyline(buildings: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
           use std::collections::BinaryHeap;

           let mut boundaries = Vec::with_capacity(buildings.len() * 2);
           for building in &buildings {
               boundaries.push(building[0]);
               boundaries.push(building[1]);
           }
           boundaries.sort_unstable();
           boundaries.dedup();

           let mut heap: BinaryHeap<(i32, i32)> = BinaryHeap::new();
           let mut result = Vec::new();
           let mut building_index = 0_usize;
           let mut previous_height = 0_i32;

           for x in boundaries {
               while building_index < buildings.len()
                   && buildings[building_index][0] <= x
               {
                   heap.push((
                       buildings[building_index][2],
                       buildings[building_index][1],
                   ));
                   building_index += 1;
               }

               loop {
                   match heap.peek() {
                       Some(&(_, right)) if right <= x => {
                           heap.pop();
                       }
                       _ => break,
                   }
               }

               let current_height = heap.peek().map_or(0, |&(height, _)| height);
               if current_height != previous_height {
                   result.push(vec![x, current_height]);
                   previous_height = current_height;
               }
           }

           result
       }
   }

``BinaryHeap<(i32,i32)>`` 按元组字典序取最大元素。

Go
~~

.. code-block:: go

   import (
       "container/heap"
       "sort"
   )

   type skylineNode struct {
       height int
       right  int
   }

   type skylineHeap []skylineNode

   func (h skylineHeap) Len() int { return len(h) }
   func (h skylineHeap) Less(i, j int) bool {
       if h[i].height != h[j].height {
           return h[i].height > h[j].height
       }
       return h[i].right > h[j].right
   }
   func (h skylineHeap) Swap(i, j int) { h[i], h[j] = h[j], h[i] }
   func (h *skylineHeap) Push(value any) {
       *h = append(*h, value.(skylineNode))
   }
   func (h *skylineHeap) Pop() any {
       old := *h
       value := old[len(old)-1]
       *h = old[:len(old)-1]
       return value
   }

   func getSkyline(buildings [][]int) [][]int {
       boundaries := make([]int, 0, len(buildings)*2)
       for _, building := range buildings {
           boundaries = append(boundaries, building[0], building[1])
       }
       sort.Ints(boundaries)

       active := &skylineHeap{}
       heap.Init(active)
       result := make([][]int, 0)
       buildingIndex := 0
       previousHeight := 0

       for i := 0; i < len(boundaries); {
           x := boundaries[i]
           for i < len(boundaries) && boundaries[i] == x {
               i++
           }

           for buildingIndex < len(buildings) &&
               buildings[buildingIndex][0] <= x {
               heap.Push(active, skylineNode{
                   height: buildings[buildingIndex][2],
                   right:  buildings[buildingIndex][1],
               })
               buildingIndex++
           }

           for active.Len() > 0 && (*active)[0].right <= x {
               heap.Pop(active)
           }

           currentHeight := 0
           if active.Len() > 0 {
               currentHeight = (*active)[0].height
           }
           if currentHeight != previousHeight {
               result = append(result, []int{x, currentHeight})
               previousHeight = currentHeight
           }
       }

       return result
   }

Go 通过反转 ``Less`` 的比较方向构造最大堆。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   type SkylineNode = { height: number; right: number };

   class SkylineMaxHeap {
       private readonly data: SkylineNode[] = [];

       private higher(a: SkylineNode, b: SkylineNode): boolean {
           return a.height !== b.height
               ? a.height > b.height
               : a.right > b.right;
       }

       peek(): SkylineNode | undefined {
           return this.data[0];
       }

       push(node: SkylineNode): void {
           this.data.push(node);
           let index = this.data.length - 1;

           while (index > 0) {
               const parent = Math.floor((index - 1) / 2);
               if (this.higher(this.data[parent], this.data[index])) break;
               [this.data[parent], this.data[index]] =
                   [this.data[index], this.data[parent]];
               index = parent;
           }
       }

       pop(): SkylineNode | undefined {
           if (this.data.length === 0) return undefined;

           const top = this.data[0];
           const last = this.data.pop()!;
           if (this.data.length === 0) return top;

           this.data[0] = last;
           let index = 0;

           for (;;) {
               const left = index * 2 + 1;
               if (left >= this.data.length) break;

               const right = left + 1;
               let best = left;
               if (right < this.data.length &&
                   this.higher(this.data[right], this.data[left])) {
                   best = right;
               }
               if (this.higher(this.data[index], this.data[best])) break;

               [this.data[index], this.data[best]] =
                   [this.data[best], this.data[index]];
               index = best;
           }

           return top;
       }
   }

   function getSkyline(buildings: number[][]): number[][] {
       const boundaries = Array.from(
           new Set(buildings.flatMap(building => [building[0], building[1]]))
       ).sort((a, b) => a - b);

       const heap = new SkylineMaxHeap();
       const result: number[][] = [];
       let buildingIndex = 0;
       let previousHeight = 0;

       for (const x of boundaries) {
           while (buildingIndex < buildings.length &&
                  buildings[buildingIndex][0] <= x) {
               heap.push({
                   height: buildings[buildingIndex][2],
                   right: buildings[buildingIndex][1]
               });
               buildingIndex += 1;
           }

           while (heap.peek() !== undefined && heap.peek()!.right <= x) {
               heap.pop();
           }

           const currentHeight = heap.peek()?.height ?? 0;
           if (currentHeight !== previousHeight) {
               result.push([x, currentHeight]);
               previousHeight = currentHeight;
           }
       }

       return result;
   }

题目坐标不超过 ``2^31 - 1``，在 JavaScript ``number`` 的精确整数范围内。

C#
~~

.. code-block:: csharp

   public class Solution {
       public System.Collections.Generic.IList<
           System.Collections.Generic.IList<int>
       > GetSkyline(int[][] buildings) {
           int[] boundaries = new int[buildings.Length * 2];
           for (int i = 0; i < buildings.Length; ++i) {
               boundaries[i * 2] = buildings[i][0];
               boundaries[i * 2 + 1] = buildings[i][1];
           }
           System.Array.Sort(boundaries);

           var heap = new System.Collections.Generic.PriorityQueue<
               (int Height, int Right),
               (int NegHeight, int NegRight)
           >();
           var result = new System.Collections.Generic.List<
               System.Collections.Generic.IList<int>
           >();

           int buildingIndex = 0;
           int previousHeight = 0;

           for (int i = 0; i < boundaries.Length; ) {
               int x = boundaries[i];
               while (i < boundaries.Length && boundaries[i] == x) {
                   ++i;
               }

               while (buildingIndex < buildings.Length &&
                      buildings[buildingIndex][0] <= x) {
                   int height = buildings[buildingIndex][2];
                   int right = buildings[buildingIndex][1];
                   heap.Enqueue((height, right), (-height, -right));
                   ++buildingIndex;
               }

               while (heap.Count > 0 && heap.Peek().Right <= x) {
                   heap.Dequeue();
               }

               int currentHeight = heap.Count == 0 ? 0 : heap.Peek().Height;
               if (currentHeight != previousHeight) {
                   result.Add(new int[] { x, currentHeight });
                   previousHeight = currentHeight;
               }
           }

           return result;
       }
   }

``PriorityQueue`` 是最小优先级队列，使用负高度构造所需顺序。

Julia
~~~~~

.. code-block:: julia

   function get_skyline(buildings::Vector{Vector{Int}})::Vector{Vector{Int}}
       boundaries = Int[]
       sizehint!(boundaries, 2 * length(buildings))
       for building in buildings
           push!(boundaries, building[1], building[2])
       end
       sort!(boundaries)
       unique!(boundaries)

       heap = Tuple{Int,Int}[]
       higher(a, b) = a[1] != b[1] ? a[1] > b[1] : a[2] > b[2]

       function heap_push!(node::Tuple{Int,Int})
           push!(heap, node)
           index = length(heap)
           while index > 1
               parent = index ÷ 2
               higher(heap[parent], heap[index]) && break
               heap[parent], heap[index] = heap[index], heap[parent]
               index = parent
           end
       end

       function heap_pop!()
           top = heap[1]
           last = pop!(heap)
           isempty(heap) && return top

           heap[1] = last
           index = 1
           while true
               left = index * 2
               left > length(heap) && break

               right = left + 1
               best = right <= length(heap) && higher(heap[right], heap[left]) ?
                   right : left
               higher(heap[index], heap[best]) && break

               heap[index], heap[best] = heap[best], heap[index]
               index = best
           end
           top
       end

       result = Vector{Vector{Int}}()
       building_index = 1
       previous_height = 0

       for x in boundaries
           while building_index <= length(buildings) &&
                 buildings[building_index][1] <= x
               heap_push!((
                   buildings[building_index][3],
                   buildings[building_index][2]
               ))
               building_index += 1
           end

           while !isempty(heap) && heap[1][2] <= x
               heap_pop!()
           end

           current_height = isempty(heap) ? 0 : heap[1][1]
           if current_height != previous_height
               push!(result, [x, current_height])
               previous_height = current_height
           end
       end

       result
   end

Julia 数组从 1 开始，建筑字段依次为 ``building[1]``、``building[2]``、``building[3]``。

R
~

.. code-block:: r

   get_skyline <- function(buildings) {
     boundaries <- sort(unique(unlist(lapply(
       buildings,
       function(building) building[c(1L, 2L)]
     ), use.names = FALSE)))

     heap_height <- integer(length(buildings))
     heap_right <- integer(length(buildings))
     heap_size <- 0L

     higher <- function(i, j) {
       heap_height[i] > heap_height[j] ||
         (heap_height[i] == heap_height[j] && heap_right[i] > heap_right[j])
     }

     heap_push <- function(height, right) {
       heap_size <<- heap_size + 1L
       index <- heap_size
       heap_height[index] <<- height
       heap_right[index] <<- right

       while (index > 1L) {
         parent <- index %/% 2L
         if (higher(parent, index)) break

         temporary_height <- heap_height[parent]
         temporary_right <- heap_right[parent]
         heap_height[parent] <<- heap_height[index]
         heap_right[parent] <<- heap_right[index]
         heap_height[index] <<- temporary_height
         heap_right[index] <<- temporary_right
         index <- parent
       }
     }

     heap_pop <- function() {
       heap_height[1L] <<- heap_height[heap_size]
       heap_right[1L] <<- heap_right[heap_size]
       heap_size <<- heap_size - 1L
       index <- 1L

       while (TRUE) {
         left <- index * 2L
         if (left > heap_size) break

         right <- left + 1L
         best <- left
         if (right <= heap_size && higher(right, left)) best <- right
         if (higher(index, best)) break

         temporary_height <- heap_height[index]
         temporary_right <- heap_right[index]
         heap_height[index] <<- heap_height[best]
         heap_right[index] <<- heap_right[best]
         heap_height[best] <<- temporary_height
         heap_right[best] <<- temporary_right
         index <- best
       }
     }

     result <- vector("list", length(boundaries))
     result_size <- 0L
     building_index <- 1L
     previous_height <- 0L

     for (x in boundaries) {
       while (building_index <= length(buildings) &&
              buildings[[building_index]][1L] <= x) {
         heap_push(
           as.integer(buildings[[building_index]][3L]),
           as.integer(buildings[[building_index]][2L])
         )
         building_index <- building_index + 1L
       }

       while (heap_size > 0L && heap_right[1L] <= x) {
         heap_pop()
       }

       current_height <- if (heap_size == 0L) 0L else heap_height[1L]
       if (current_height != previous_height) {
         result_size <- result_size + 1L
         result[[result_size]] <- c(as.integer(x), current_height)
         previous_height <- current_height
       }
     }

     result[seq_len(result_size)]
   }

R 使用父作用域中的向量保存堆，并通过 ``<<-`` 更新共享堆状态。

关键易错点
----------

* 把右边界写成闭区间，使用 ``right < x`` 才清理；
* 同一横坐标每处理一个开始或结束事件就立即输出；
* 只弹出一个过期堆顶，没有持续清理；
* 在加入当前坐标开始的建筑之前读取高度；
* 高度没有变化时仍然输出关键点；
* 遗漏建筑间空隙中的高度 0；
* 遗漏最右端回到高度 0 的终止关键点；
* 输入未排序时仍然使用单调 ``building_index``。

知识联系
--------

本题是“离散事件 + 动态极值”的典型模型。扫描线负责把连续横轴压缩成有限个事件坐标，
最大堆负责维护当前活动集合的极值，惰性删除负责绕开普通堆无法删除内部元素的限制。

相同结构还会出现在带结束时间的任务优先级、区间最大权值、时间轴上的资源峰值等问题中。
惰性删除适用于查询只关心堆顶的场景；若需要随时删除任意元素或查询完整有序集合，应考虑
平衡树、可索引堆或“堆 + 计数表”。

自检问题
--------

#. 为什么建筑在 ``right == x`` 时已经失效？
#. 为什么只扫描所有左、右边界就足够？
#. 为什么同一横坐标必须整体处理后再决定是否输出？
#. 过期的非堆顶建筑为什么暂时留在堆中仍然安全？
#. 为什么清理过期建筑必须使用 ``while``？
#. 如何保证结果中不存在相邻等高关键点？
#. 为什么最后一定会得到高度 0 的终止点？

参考答案
~~~~~~~~

#. 建筑覆盖的是半开区间 ``left <= x < right``，右边界本身不属于建筑。
#. 相邻边界之间没有建筑开始或结束，活动集合及最大高度不会变化。
#. 同坐标可能同时开始和结束多栋建筑，中间事件顺序不代表真实轮廓。
#. 它不在堆顶时不会决定最大值；成为堆顶时会在读取前被清理。
#. 弹出一个过期堆顶后，下一个堆顶也可能已经过期。
#. 只有 ``current_height != previous_height`` 时才追加关键点。
#. 最大右边界处理后所有建筑都过期，堆清空，当前高度回到 0。
