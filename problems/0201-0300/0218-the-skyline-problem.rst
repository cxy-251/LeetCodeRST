0218. The Skyline Problem
=========================

题目信息
--------

:题号: 0218
:难度: Hard
:主题: 扫描线、最大堆、惰性删除、关键点规范化
:原题: `LeetCode 0218 <https://leetcode.com/problems/the-skyline-problem/>`_
:访问状态: Available
:教学重点: 半开区间、同坐标整体处理、活动建筑最大高度、过期堆顶清理、二维输出所有权

精确契约
--------

每栋建筑由 ``[left,right,height]`` 表示，并覆盖半开区间 ``left <= x < right``。天空线由一组关键点
``[x,height]`` 表示：从横坐标 ``x`` 开始，轮廓高度变为 ``height``。

本文采用以下合同：

* ``left < right`` 且 ``height > 0``；
* 建筑只在 ``left <= x < right`` 时活跃，``right == x`` 时已经结束；
* 输出关键点横坐标严格递增；
* 相邻关键点高度不同，不输出没有高度变化的冗余点；
* 最后一段建筑结束后必须回到高度 0；
* 空输入返回空结果；
* 官方输入按 ``left`` 非递减排列，本文实现利用这一合同并保持输入只读；
* 若业务输入可能无序，应复制建筑索引或建筑数组并按 ``left`` 排序，增加 ``O(n log n)`` 时间和 ``O(n)`` 材料空间。

半开区间是整个算法的语义基础。建筑 ``[2,5,7]`` 在 ``x=4`` 贡献高度 7，在 ``x=5`` 已不再贡献。

自建示例
--------

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

在 ``x=7``，高度 15 的建筑结束；高度 12 的建筑仍活跃，所以轮廓降到 12 而不是 0。

单建筑
~~~~~~

.. code-block:: text

   [[1,4,6]] -> [[1,6],[4,0]]

左边界产生上升点，右边界产生回到地面的点。

相邻等高建筑
~~~~~~~~~~~~

.. code-block:: text

   [[1,3,5],[3,6,5]] -> [[1,5],[6,0]]

``x=3`` 同时有旧建筑结束和新建筑开始，整体处理后的高度仍为 5，不应输出 ``[3,0]`` 或 ``[3,5]``。

同起点与同终点
~~~~~~~~~~~~~~

.. code-block:: text

   [[2,6,4],[2,6,9],[2,6,7]] -> [[2,9],[6,0]]

同一横坐标只能根据全部事件处理后的最终高度输出一次。

完全包含
~~~~~~~~

.. code-block:: text

   [[1,10,3],[3,7,8]] -> [[1,3],[3,8],[7,3],[10,0]]

内部高建筑结束后，外部低建筑重新成为轮廓。

问题抽象与解法选择
------------------

天空线高度只可能在建筑的左边界或右边界变化。两个相邻边界之间没有建筑开始或结束，活动建筑集合保持不变，
所以该开区间上的最大高度也保持不变。

本文使用：

#. 收集全部左右边界并排序、去重；
#. 按横坐标从小到大扫描；
#. 使用最大堆保存已经开始但尚未确定可以永久删除的建筑，堆元素为 ``(height,right)``；
#. 在每个坐标加入所有 ``left <= x`` 的建筑；
#. 持续弹出堆顶中 ``right <= x`` 的过期建筑；
#. 清理后堆顶高度就是当前轮廓高度；
#. 当前高度与前一高度不同时追加关键点。

为什么不为每个开始和结束事件立即输出
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

同一横坐标可能同时发生多个开始和结束。逐个事件更新并立即输出会产生重复横坐标和中间伪高度。
例如相邻等高建筑在同一点交接，逐事件处理可能先降到 0 再升回 5；真实轮廓没有变化。

因此算法先把同坐标的状态变化整体完成，再比较最终高度。使用去重后的边界数组天然保证每个横坐标只处理一次。

扫描状态与不变量
----------------

设当前处理去重边界 ``x``，维护：

``building_index``
   第一栋尚未加入堆的建筑下标。官方输入按左边界非递减排列。

``heap``
   已经满足 ``left <= x`` 的候选建筑。堆按高度降序排列；同高度时可让更大的 ``right`` 优先。

``previous_height``
   上一个已输出区间的轮廓高度。

处理 ``x`` 时执行：

.. code-block:: text

   while building_index < n and buildings[building_index].left <= x:
       push(height, right)
       building_index += 1

   while heap not empty and heap.top.right <= x:
       pop()

   current_height = heap.top.height if heap not empty else 0

加入阶段结束后，所有左边界不大于 ``x`` 的建筑都已进入堆；尚未加入的建筑左边界严格大于 ``x``。
清理阶段结束后，堆顶若存在必满足 ``right > x``，所以它在 ``x`` 处活跃。

惰性删除为什么正确
------------------

堆中可能保留已经过期但不在顶部的建筑。普通二叉堆不能高效删除任意内部元素，本文采用惰性删除：
只有当一个元素成为堆顶时，才检查它是否过期。

这不会污染当前最大高度：

* 若过期建筑不在堆顶，说明堆顶高度不低于它；它不可能决定当前最大值；
* 若压住它的更高建筑仍活跃，堆顶就是合法最大候选；
* 若更高建筑后来过期并被弹出，该旧元素可能上浮为堆顶，此时继续执行 ``right <= x`` 检查并将它弹出；
* 清理循环持续到堆空或堆顶活跃，所以过期建筑绝不会作为输出高度。

关键点规范化
------------

清理后得到 ``current_height``：

* 若它等于 ``previous_height``，轮廓没有变化，不输出；
* 若它不同，追加 ``[x,current_height]`` 并更新 ``previous_height``。

边界数组严格升序，因此输出横坐标严格升序。只在高度变化时追加，保证相邻关键点高度不同。
最后一个边界是某栋建筑的最大右端点；处理该坐标后所有建筑都满足 ``right <= x`` 并最终被清理，当前高度为 0，
若此前高度非零就输出终止关键点。

正确性证明
----------

引理一：只处理左右边界不会遗漏高度变化
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任取两个相邻不同边界 ``x1 < x2``。区间 ``(x1,x2)`` 内没有建筑左边界或右边界。
每栋建筑在整个区间内要么始终活跃，要么始终不活跃，因此活动建筑集合与其最大高度均不变。
高度变化只能发生在边界坐标。

引理二：加入阶段后所有可能在 x 活跃的建筑都在堆中
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

建筑按 ``left`` 非递减排列。循环加入全部 ``left <= x`` 的建筑，退出时尚未加入的第一栋建筑若存在，其
``left > x``，之后建筑的左边界也不小于它。因此任何满足 ``left <= x`` 的建筑都已进入堆。

引理三：清理后堆顶若存在一定在 x 活跃
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

加入堆的建筑都满足 ``left <= x``。清理循环持续弹出所有堆顶 ``right <= x`` 的建筑。
循环结束时堆顶满足 ``right > x``，结合半开区间条件得到 ``left <= x < right``，所以堆顶活跃。

引理四：清理后堆顶高度等于所有活跃建筑的最大高度
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理二，每栋活跃建筑都在堆中。最大堆顶部高度不小于堆内任何元素。
若顶部过期，清理循环会弹出；循环结束后的顶部由引理三可知活跃。
因此顶部既是一个活跃建筑，又不低于任何其他活跃建筑，其高度正是当前最大高度。堆空时没有活跃建筑，高度为 0。

引理五：惰性删除不会输出过期高度
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

过期但被更高元素压住的建筑不是堆顶，不参与当前高度。它只有在上方元素移除后才可能成为堆顶，
而每次读取高度之前都会持续检查并删除过期堆顶。因此任何被用作 ``current_height`` 的非空堆顶都没有过期。

引理六：算法输出全部必要关键点且没有冗余点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理一，高度只可能在扫描边界变化；由引理四，每个边界处理后的 ``current_height`` 是真实轮廓高度。
高度变化时算法一定输出，因此不遗漏必要关键点；高度不变时不输出，因此不会产生相邻等高冗余点。
边界去重保证同一横坐标最多输出一次。

定理：算法返回规范化的完整天空线
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理四保证每个扫描坐标的高度正确，引理六保证所有且仅有必要变化被记录。
最后边界处理后高度回到 0，所以结果覆盖所有建筑并满足横坐标递增、相邻高度不同和终止归零合同。

终止性
~~~~~~

边界循环处理有限个去重坐标；``building_index`` 只增加，每栋建筑只入堆一次；每次弹出都减少堆大小，
每栋建筑至多出堆一次。因此所有循环均终止。

复杂度与真实资源
----------------

设建筑数为 ``n``，去重边界数为 ``b <= 2n``，输出关键点数为 ``k <= b``：

* 收集并排序边界耗时 ``O(n log n)``；
* 每栋建筑入堆一次、至多出堆一次，堆操作总耗时 ``O(n log n)``；
* 扫描边界耗时 ``O(b)``，总时间 ``O(n log n)``；
* 边界材料占 ``O(n)``，最大堆占 ``O(n)``；
* 返回结果载荷占 ``O(k)`` 个二元关键点；
* 输入保持只读；若输入无序并额外排序副本，还需 ``O(n)`` 排序材料。

不能忽略边界数组、堆和输出后声称额外空间 ``O(1)``。

十语言实现
----------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>

   typedef struct {
       int height;
       int right;
   } HeapNode;

   static int compare_ints(const void *left, const void *right) {
       const int a = *(const int *)left;
       const int b = *(const int *)right;
       return (a > b) - (a < b);
   }

   static int higher(HeapNode a, HeapNode b) {
       if (a.height != b.height) return a.height > b.height;
       return a.right > b.right;
   }

   static void heap_push(HeapNode *heap, size_t *size, HeapNode node) {
       size_t index = (*size)++;
       heap[index] = node;
       while (index > 0) {
           const size_t parent = (index - 1) / 2;
           if (higher(heap[parent], heap[index])) break;
           const HeapNode temporary = heap[parent];
           heap[parent] = heap[index];
           heap[index] = temporary;
           index = parent;
       }
   }

   static void heap_pop(HeapNode *heap, size_t *size) {
       --(*size);
       if (*size == 0) return;
       heap[0] = heap[*size];
       size_t index = 0;
       for (;;) {
           const size_t left = index * 2 + 1;
           if (left >= *size) break;
           const size_t right = left + 1;
           size_t best = left;
           if (right < *size && higher(heap[right], heap[left])) {
               best = right;
           }
           if (higher(heap[index], heap[best])) break;
           const HeapNode temporary = heap[index];
           heap[index] = heap[best];
           heap[best] = temporary;
           index = best;
       }
   }

   static void free_result_rows(int **rows, int count) {
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
       if (returnSize == NULL || returnColumnSizes == NULL) return NULL;
       *returnSize = 0;
       *returnColumnSizes = NULL;
       if (buildingsSize <= 0) return NULL;

       const size_t size_max = (size_t)-1;
       const size_t count = (size_t)buildingsSize;
       if (count > size_max / 2) return NULL;
       const size_t boundary_count = count * 2;
       if (boundary_count > size_max / sizeof(int) ||
           count > size_max / sizeof(HeapNode) ||
           boundary_count > size_max / sizeof(int *) ||
           boundary_count > size_max / sizeof(int)) {
           return NULL;
       }

       int *boundaries = (int *)malloc(boundary_count * sizeof(int));
       HeapNode *heap = (HeapNode *)malloc(count * sizeof(HeapNode));
       int **rows = (int **)malloc(boundary_count * sizeof(int *));
       int *columns = (int *)malloc(boundary_count * sizeof(int));
       if (boundaries == NULL || heap == NULL || rows == NULL || columns == NULL) {
           free(boundaries);
           free(heap);
           free(rows);
           free(columns);
           return NULL;
       }

       for (size_t i = 0; i < count; ++i) {
           boundaries[i * 2] = buildings[i][0];
           boundaries[i * 2 + 1] = buildings[i][1];
       }
       qsort(boundaries, boundary_count, sizeof(int), compare_ints);

       size_t unique_count = 0;
       for (size_t i = 0; i < boundary_count; ++i) {
           if (unique_count == 0 || boundaries[i] != boundaries[unique_count - 1]) {
               boundaries[unique_count++] = boundaries[i];
           }
       }

       size_t building_index = 0;
       size_t heap_size = 0;
       int result_size = 0;
       int previous_height = 0;

       for (size_t i = 0; i < unique_count; ++i) {
           const int x = boundaries[i];
           while (building_index < count &&
                  buildings[building_index][0] <= x) {
               HeapNode node = {
                   buildings[building_index][2],
                   buildings[building_index][1]
               };
               heap_push(heap, &heap_size, node);
               ++building_index;
           }
           while (heap_size > 0 && heap[0].right <= x) {
               heap_pop(heap, &heap_size);
           }

           const int current_height = heap_size > 0 ? heap[0].height : 0;
           if (current_height != previous_height) {
               int *row = (int *)malloc(2 * sizeof(int));
               if (row == NULL) {
                   free(boundaries);
                   free(heap);
                   free(columns);
                   free_result_rows(rows, result_size);
                   return NULL;
               }
               row[0] = x;
               row[1] = current_height;
               rows[result_size] = row;
               columns[result_size] = 2;
               ++result_size;
               previous_height = current_height;
           }
       }

       free(boundaries);
       free(heap);
       *returnSize = result_size;
       *returnColumnSizes = columns;
       return rows;
   }

C 利用官方按左边界排序的输入合同。成功时调用方拥有每个二元行、行指针数组和 ``returnColumnSizes``；
任一分配失败时释放已取得资源并返回 ``NULL``，``returnSize`` 保持 0。

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
           std::size_t index = 0;
           int previous = 0;

           for (int x : boundaries) {
               while (index < buildings.size() && buildings[index][0] <= x) {
                   heap.push({buildings[index][2], buildings[index][1]});
                   ++index;
               }
               while (!heap.empty() && heap.top().second <= x) heap.pop();
               const int current = heap.empty() ? 0 : heap.top().first;
               if (current != previous) {
                   result.push_back({x, current});
                   previous = current;
               }
           }
           return result;
       }
   };

需要 ``<algorithm>``、``<queue>``、``<utility>`` 与 ``<vector>``。``pair`` 先比较高度，再比较右端点，正好构成最大堆。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def getSkyline(self, buildings: list[list[int]]) -> list[list[int]]:
           import heapq

           boundaries = sorted({x for left, right, _ in buildings
                                  for x in (left, right)})
           heap: list[tuple[int, int]] = []
           result: list[list[int]] = []
           index = 0
           previous = 0

           for x in boundaries:
               while index < len(buildings) and buildings[index][0] <= x:
                   left, right, height = buildings[index]
                   heapq.heappush(heap, (-height, right))
                   index += 1
               while heap and heap[0][1] <= x:
                   heapq.heappop(heap)
               current = -heap[0][0] if heap else 0
               if current != previous:
                   result.append([x, current])
                   previous = current

           return result

Python ``heapq`` 是最小堆，使用负高度得到最大高度；同高度时较小右端点先清理，不影响正确性。

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
           int previous = 0;

           for (int i = 0; i < boundaries.length; ) {
               int x = boundaries[i];
               while (i < boundaries.length && boundaries[i] == x) ++i;
               while (buildingIndex < buildings.length &&
                      buildings[buildingIndex][0] <= x) {
                   heap.offer(new int[]{
                       buildings[buildingIndex][2],
                       buildings[buildingIndex][1]
                   });
                   ++buildingIndex;
               }
               while (!heap.isEmpty() && heap.peek()[1] <= x) heap.poll();
               int current = heap.isEmpty() ? 0 : heap.peek()[0];
               if (current != previous) {
                   result.add(java.util.Arrays.asList(x, current));
                   previous = current;
               }
           }
           return result;
       }
   }

比较器使用 ``Integer.compare``，避免用减法比较时溢出。边界数组通过跳过相等值实现同坐标分组。

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
           let mut previous = 0_i32;

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
               while heap.peek().is_some_and(|&(_, right)| right <= x) {
                   heap.pop();
               }
               let current = heap.peek().map_or(0, |&(height, _)| height);
               if current != previous {
                   result.push(vec![x, current]);
                   previous = current;
               }
           }
           result
       }
   }

``BinaryHeap<(i32,i32)>`` 按元组字典序取最大值。若目标编译环境较旧，可把 ``is_some_and`` 改写为显式 ``match``。

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
       previous := 0

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
           current := 0
           if active.Len() > 0 {
               current = (*active)[0].height
           }
           if current != previous {
               result = append(result, []int{x, current})
               previous = current
           }
       }
       return result
   }

Go 的 ``container/heap`` 通过反转 ``Less`` 构造最大堆；输入切片及其建筑行保持只读。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   type SkylineNode = { height: number; right: number };

   class SkylineMaxHeap {
       private data: SkylineNode[] = [];

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
           while (true) {
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
       let previous = 0;

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
           const current = heap.peek()?.height ?? 0;
           if (current !== previous) {
               result.push([x, current]);
               previous = current;
           }
       }
       return result;
   }

官方整数范围在 JavaScript ``number`` 的精确整数范围内。``flatMap`` 与 ``Set`` 会物化 ``O(n)`` 边界材料。

C#
~~

.. code-block:: csharp

   public class Solution {
       public System.Collections.Generic.IList<
           System.Collections.Generic.IList<int>
       > GetSkyline(int[][] buildings) {
           var boundaries = new int[buildings.Length * 2];
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
           int previous = 0;

           for (int i = 0; i < boundaries.Length; ) {
               int x = boundaries[i];
               while (i < boundaries.Length && boundaries[i] == x) ++i;
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
               int current = heap.Count == 0 ? 0 : heap.Peek().Height;
               if (current != previous) {
                   result.Add(new int[] { x, current });
                   previous = current;
               }
           }
           return result;
       }
   }

``PriorityQueue`` 是最小优先级队列，使用负高度与负右端点得到目标最大顺序。题目高度和坐标为正，取负不会碰到 ``int.MinValue``。

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
       previous = 0
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
           current = isempty(heap) ? 0 : heap[1][1]
           if current != previous
               push!(result, [x, current])
               previous = current
           end
       end
       result
   end

Julia 使用一基建筑字段和自建最大堆；``unique!`` 在已排序边界上原地去重。

R
~

.. code-block:: r

   get_skyline <- function(buildings) {
     if (length(buildings) == 0L) return(list())

     boundaries <- sort(unique(unlist(lapply(
       buildings,
       function(building) building[c(1L, 2L)]
     ), use.names = FALSE)))

     heap <- new.env(parent = emptyenv())
     heap$height <- integer(length(buildings))
     heap$right <- integer(length(buildings))
     heap$size <- 0L

     higher <- function(i, j) {
       heap$height[i] > heap$height[j] ||
         (heap$height[i] == heap$height[j] &&
          heap$right[i] > heap$right[j])
     }

     heap_push <- function(height, right) {
       heap$size <- heap$size + 1L
       index <- heap$size
       heap$height[index] <- height
       heap$right[index] <- right
       while (index > 1L) {
         parent <- index %/% 2L
         if (higher(parent, index)) break
         temporary_height <- heap$height[parent]
         temporary_right <- heap$right[parent]
         heap$height[parent] <- heap$height[index]
         heap$right[parent] <- heap$right[index]
         heap$height[index] <- temporary_height
         heap$right[index] <- temporary_right
         index <- parent
       }
       invisible(NULL)
     }

     heap_pop <- function() {
       heap$height[1L] <- heap$height[heap$size]
       heap$right[1L] <- heap$right[heap$size]
       heap$size <- heap$size - 1L
       index <- 1L
       while (TRUE) {
         left <- index * 2L
         if (left > heap$size) break
         right <- left + 1L
         best <- left
         if (right <= heap$size && higher(right, left)) best <- right
         if (higher(index, best)) break
         temporary_height <- heap$height[index]
         temporary_right <- heap$right[index]
         heap$height[index] <- heap$height[best]
         heap$right[index] <- heap$right[best]
         heap$height[best] <- temporary_height
         heap$right[best] <- temporary_right
         index <- best
       }
       invisible(NULL)
     }

     result <- vector("list", length(boundaries))
     result_size <- 0L
     building_index <- 1L
     previous <- 0L

     for (x in boundaries) {
       while (building_index <= length(buildings) &&
              buildings[[building_index]][1L] <= x) {
         heap_push(
           as.integer(buildings[[building_index]][3L]),
           as.integer(buildings[[building_index]][2L])
         )
         building_index <- building_index + 1L
       }
       while (heap$size > 0L && heap$right[1L] <= x) heap_pop()
       current <- if (heap$size == 0L) 0L else heap$height[1L]
       if (current != previous) {
         result_size <- result_size + 1L
         result[[result_size]] <- c(as.integer(x), current)
         previous <- current
       }
     }

     if (result_size == 0L) list() else result[seq_len(result_size)]
   }

R 使用环境保存共享堆状态，并预分配最大结果列表，避免每次追加都重建整个列表。官方坐标在 32 位整数范围内。

人工静态推演
------------

经典重叠建筑
   在每个边界加入所有已开始建筑，``x=7`` 清理高度 15 后，堆顶高度 12；``x=12`` 清理剩余第一组建筑后降到 0。

单建筑
   左边界入堆得到高度，右边界满足 ``right<=x`` 被清理并输出 0。

相邻等高建筑
   在交接坐标先加入新建筑，再清理旧建筑，最终高度仍相同，不产生关键点。

同起点不同高度
   同一坐标的建筑全部入堆后只读取最高值，因此只输出一个横坐标。

完全包含
   内层高建筑结束时，外层低建筑仍在堆中并重新成为顶部。

互不重叠
   前一建筑右端输出 0，后一建筑左端重新上升；空白区被正确表达。

静态审查记录
------------

本题未运行、未编译、未对拍、未穷举，也未执行 sanitizer。已人工核对：

* ``left <= x < right`` 与 ``right <= x`` 过期条件；
* 全部左右边界排序去重以及同坐标只处理一次；
* 加入所有 ``left <= x`` 建筑后再持续清理过期堆顶；
* 惰性删除不让过期非顶部元素污染当前最大高度；
* 关键点仅在高度变化时输出，横坐标严格增加且最终归零；
* 每栋建筑至多入堆和出堆一次；
* 十语言堆比较方向、字段顺序、索引和二维结果快照；
* C 的 ``2*n``、各数组分配大小、部分失败清理、行所有权和输入排序前提；
* Julia/R 一基字段，R 环境共享状态与预分配结果列表；
* 边界、堆、输出载荷分别报告。

剩余风险是十语言代码没有经过目标平台编译或执行；C# ``PriorityQueue``、Rust 标准库版本和各语言平台签名按常见 LeetCode 环境静态核对。

关键易错点
----------

* 把 ``right==x`` 的建筑继续视为活跃；
* 同一横坐标每处理一个事件就输出，产生中间伪高度；
* 只弹出一个过期堆顶，没有持续清理；
* 试图从普通堆内部直接删除任意过期元素；
* 读取堆顶前没有清理，输出已经结束的高建筑；
* 高度未变化仍输出冗余关键点；
* 遗漏最后回到 0 的关键点；
* 假设无序输入也能直接用单调建筑下标；
* 忽略边界数组、堆或二维输出材料。

知识联系
--------

本题把扫描线的离散事件、优先队列的极值维护和惰性删除组合在一起。相同结构也用于区间最大值事件、会议资源峰值、
带过期时间的任务优先队列和时间轴上的动态上包络。

惰性删除成立的关键是查询只关心堆顶极值。若需要随时删除任意元素、统计全部活动元素或支持非极值查询，
需要计数映射、可索引堆、平衡树或其他支持精确删除的数据结构。

自检问题
--------

#. 为什么建筑在 ``right==x`` 时必须过期？
#. 为什么只扫描左右边界就足够？
#. 为什么同一横坐标必须整体处理后再输出？
#. 堆中保留过期的非顶部建筑为什么安全？
#. 为什么清理循环必须持续执行而不是只弹出一次？
#. 如何保证关键点没有相邻等高冗余项？
#. 为什么最后一定能输出高度 0？
#. 若建筑没有按左边界排序，需要增加什么步骤和成本？
#. C 成功返回后调用方拥有哪些对象？

参考答案
~~~~~~~~

#. 半开区间只覆盖 ``left<=x<right``，右端点本身不再属于建筑。
#. 相邻边界之间没有活动状态变化，最大高度恒定。
#. 同坐标可能同时开始和结束多栋建筑，中间处理顺序不代表真实轮廓。
#. 它不是堆顶就不决定最大值；成为堆顶时会在读取前被检查并删除。
#. 弹出一个过期元素后，下一个堆顶也可能已经过期。
#. 只在 ``current_height != previous_height`` 时追加。
#. 最大右端边界处理后所有建筑都过期，堆清理为空，当前高度为 0。
#. 先复制并按 ``left`` 排序，增加 ``O(n log n)`` 时间和 ``O(n)`` 空间。
#. 每个二元行、行指针数组以及 ``returnColumnSizes``；调用方需要分别释放。
