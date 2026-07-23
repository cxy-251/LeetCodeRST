0207. Course Schedule
=====================

题目信息
--------

:题号: 0207
:难度: Medium
:主题: 有向图、拓扑排序、环检测
:原题: `LeetCode 0207 <https://leetcode.com/problems/course-schedule/>`_
:重点: 先修对方向、完成全部课程、环导致不可完成、孤立课程与多个分量

题目重述
--------

共有 ``numCourses`` 门课程，编号为 ``0`` 到 ``numCourses-1``。每个先修关系 ``[a, b]`` 表示：要学习课程 ``a``，必须先完成课程 ``b``。判断是否存在一种学习顺序，使所有课程都能满足各自的先修要求；存在时返回 ``true``，否则返回 ``false``。

``numCourses`` 位于 ``[1, 2000]``，先修关系数量位于 ``[0, 5000]``。每个课程编号都在合法范围内，所有先修对互不重复。课程图可以不连通，也可以存在没有任何先修关系的课程；函数只需判断可行性，不要求返回实际顺序。

自建示例
--------

多个分支最终汇合：

.. code-block:: text

   输入：numCourses = 4，prerequisites = [[2,0],[2,1],[3,2]]
   输出：true
   解释：可以先完成 0 和 1，再完成 2，最后完成 3；0 与 1 的先后顺序可以互换。

局部有环且另有孤立课程：

.. code-block:: text

   输入：numCourses = 4，prerequisites = [[1,0],[2,1],[0,2]]
   输出：false
   解释：课程 0、1、2 形成循环依赖，课程 3 虽然可以单独完成，也无法让全部课程都完成。

问题抽象与解法选择
------------------

课程要求形成有向图 ``G=(V,E)``。完成全部课程等价于找到一个拓扑序：对每条边
``u -> v``，课程 ``u`` 在 ``v`` 之前出现。

Kahn 算法不断选择当前入度为 0 的课程：

#. 建立从先修课程到后续课程的邻接表；
#. 统计每个课程的入度；
#. 把所有入度为 0 的课程放入队列；
#. 每次取出一门课程，将其视为已完成；
#. 删除它的全部出边，也就是逐个递减后继课程入度；
#. 某后继入度第一次变为 0 时入队；
#. 最终判断已处理课程数是否等于 ``numCourses``。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - Kahn 入度拓扑排序
     - ``O(V+E)``
     - ``O(V+E)``
     - 主解法；处理数直接给出是否存在环
   * - DFS 三色判环
     - ``O(V+E)``
     - ``O(V+E)``
     - 同样正确；递归语言可能有栈深风险
   * - 只检查初始是否有零入度节点
     - 不完整
     - ``O(V+E)``
     - 错误；局部有入口不代表其他分量无环
   * - 枚举所有课程排列
     - 阶乘级
     - ``O(V)``
     - 完全不可取

这里 ``V=numCourses``，``E=prerequisites`` 中先修对数量，重复边也各自计入 ``E``。

状态与核心不变量
----------------

设 ``processed`` 是已经从队列弹出并完成的课程集合。代码只保存其数量，但证明中把它视为集合。

每轮开始时保持：

#. 对每个未处理课程 ``v``，``indegree[v]`` 恰好等于所有来自未处理课程的剩余入边数量；
#. 队列中恰好保存已经发现、尚未处理且当前入度为 0 的课程；
#. 每个课程至多入队一次；
#. 已处理课程都排在它们被删除的出边所指向课程之前；
#. 尚未删除的每条输入边仍由其起点未处理这一事实对应；
#. 重复边按次数分别存在，入度递减次数与邻接项次数一致；
#. 输入先修对保持只读。

初始化
~~~~~~

建图后还没有处理课程，所以每个课程的当前入度就是完整图中的入度。算法扫描全部课程，把入度为 0 的课程各入队一次，不变量成立。

处理一个课程
~~~~~~~~~~~~

从队列取出课程 ``u``，它当前没有来自未处理课程的入边，因此把它放在当前拓扑前缀末尾不会违反任何先修要求。

随后遍历每个邻接项 ``u -> v``。处理 ``u`` 意味着这条边不再是“来自未处理课程的入边”，所以执行：

.. code-block:: text

   indegree[v] -= 1

若某个 ``v`` 的入度变为 0，说明它所有先修课程都已处理，将其加入队列。

为什么每个课程至多入队一次
~~~~~~~~~~~~~~~~~~~~~~~~~~

入度只会递减，不会增加。课程初始入度为 0 时只在初始化入队；初始为正时，只会在某次递减中第一次从 1 变为 0，此时入队。以后不会再次变成正数，也不会再次触发零转换。

重复边为何安全
~~~~~~~~~~~~~~

两条相同的 ``u -> v`` 在完整图中给 ``v`` 贡献两次入度。邻接表也保留两个项。处理 ``u`` 时循环执行两次递减，恰好删除两条输入边。计数模型始终一致。

正确性证明
----------

引理一：入度不变量始终成立
~~~~~~~~~~~~~~~~~~~~~~~~~~

初始化时没有处理节点，``indegree[v]`` 是完整图中所有进入 ``v`` 的边数，等于来自未处理节点的入边数。

假设处理 ``u`` 前不变量成立。算法只删除以 ``u`` 为起点的边，并对每个邻接项的终点入度递减一次。其他边和其他入度不变。因此处理后，每个未处理节点的入度仍恰好等于来自未处理节点的剩余入边数。重复边逐条处理，不破坏该结论。

引理二：队列中的课程都可以安全接到当前顺序之后
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

队列课程的当前入度为 0。由引理一，它没有来自任何未处理课程的先修边；所有进入它的原始边都来自已处理课程。因此把它接在当前拓扑前缀之后，全部先修要求已经满足。

引理三：有限非空 DAG 必然存在入度为 0 的节点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

反设一个有限非空有向无环图中每个节点入度都至少为 1。从任意节点开始，反复选择一条入边并移动到其起点。节点数量有限，路径却能无限延长，所以必然重复某个节点，形成有向环，与无环假设矛盾。因此 DAG 必有零入度节点。

引理四：若算法处理完全部课程，则存在合法完成顺序
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

记录课程弹出队列的顺序。由引理二，每次加入的课程都没有来自尚未加入课程的入边，所以每条
``prerequisite -> course`` 的起点一定先于终点出现。若 ``processed=V``，该顺序包含每门课程恰好一次，是合法拓扑序，因此全部课程可以完成。

引理五：有向环中的课程无法被 Kahn 算法全部处理
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

考虑一个有向环。环中每个课程都有一条来自环内前驱的入边。要让某个环节点入度归零，必须先处理它的环内前驱；沿环继续追溯，又要求先处理原节点。没有任何环节点能成为第一个被处理的节点，因此环中课程始终至少保留一条环内入边，不能全部进入队列。

引理六：若算法停止时仍有未处理课程，则剩余图含有环
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

队列为空时，所有剩余课程入度都大于 0。由引理一，这些入度都来自剩余课程之间的边。若剩余图无环，引理三保证至少存在一个零入度节点，与队列为空矛盾。因此剩余图必有有向环。

定理：``processed == numCourses`` 当且仅当可以完成全部课程
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若处理数等于课程数，引理四给出合法拓扑序。若处理数小于课程数，引理六说明剩余图有环，而引理五说明环上的先修要求无法同时满足。因此算法返回值与题意完全等价。

终止性
~~~~~~

每门课程至多入队、出队一次；每条邻接项只在其起点出队时访问一次。课程和边数量有限，算法必然终止。

人工状态推演
------------

单边
~~~~

``V=2``，边 ``0 -> 1``：

.. list-table::
   :header-rows: 1

   * - 时刻
     - 队列
     - 入度
     - 已处理数
   * - 初始化
     - ``[0]``
     - ``[0,1]``
     - 0
   * - 弹出 0
     - ``[1]``
     - ``[0,0]``
     - 1
   * - 弹出 1
     - ``[]``
     - ``[0,0]``
     - 2

处理数等于 2，返回真。

两节点环
~~~~~~~~

``0 -> 1`` 与 ``1 -> 0`` 使入度为 ``[1,1]``。初始队列为空，处理数保持 0，小于 2，返回假。

菱形 DAG
~~~~~~~~

初始入度 ``[0,1,1,2]``，队列为 ``[0]``。处理 0 后，1 和 2 都归零入队。处理 1 后，3 的入度从 2 降到 1；处理 2 后从 1 降到 0，3 入队。最终四门课程全部处理。

孤立课程和多个分量
~~~~~~~~~~~~~~~~~~

若课程 4 没有任何边，它初始就进入队列。一个分量的处理不会修改另一个分量的入度；所有无环分量都会各自持续产生零入度节点。

重复边
~~~~~~

两条 ``0 -> 1`` 使 ``indegree[1]=2``。处理 0 时邻接表访问两次课程 1，依次把入度变为 1、0，只在第二次递减后入队一次。

复杂度与语言资源
----------------

* 建立邻接表和入度需要 ``O(V+E)`` 时间；
* 每个课程至多入队、出队一次，每条边访问一次，总时间 ``O(V+E)``；
* 邻接载荷保存 ``E`` 个终点，入度与队列各保存 ``V`` 个整数，总额外空间 ``O(V+E)``；
* C 使用两遍 CSR 构建：出度、前缀偏移、连续邻接数组、入度和队列都显式分配，成功路径为 ``O(V+E)``；
* C 的平台签名只返回 ``bool``，无法区分“图有环”和“内存分配失败/防御性输入无效”。实现统一返回 ``false`` 并完整释放已分配内存，这是接口层剩余风险；
* C++、Python、Java、Rust、Go、TypeScript、C# 与 Julia 使用嵌套邻接容器，容器对象本身还有每个顶点的管理开销；
* R 使用两遍 CSR 数组，避免在循环中反复增长每个邻接向量；课程编号 ``u`` 映射到 R 索引 ``u+1``；
* Julia 同样把课程编号加一后访问数组，但邻接表中可以继续保存零基课程编号；
* 重复边不会改变渐近复杂度，它们按出现次数计入 ``E``。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>
   #include <string.h>

   bool canFinish(
       int numCourses,
       int **prerequisites,
       int prerequisitesSize,
       int *prerequisitesColSize
   ) {
       if (numCourses < 0 || prerequisitesSize < 0) {
           return false;
       }
       if (numCourses == 0) {
           return prerequisitesSize == 0;
       }

       size_t vertex_count = (size_t)numCourses;
       size_t edge_count = (size_t)prerequisitesSize;

       if (vertex_count > SIZE_MAX / sizeof(int)
           || vertex_count > SIZE_MAX / sizeof(size_t) - 1
           || edge_count > SIZE_MAX / sizeof(int)) {
           return false;
       }

       int *indegree = calloc(vertex_count, sizeof(int));
       size_t *outdegree = calloc(vertex_count, sizeof(size_t));
       size_t *offsets = malloc((vertex_count + 1) * sizeof(size_t));
       size_t *cursor = malloc(vertex_count * sizeof(size_t));
       int *edges = edge_count == 0
           ? NULL
           : malloc(edge_count * sizeof(int));
       int *queue = malloc(vertex_count * sizeof(int));

       bool result = false;
       if (indegree == NULL || outdegree == NULL || offsets == NULL
           || cursor == NULL || queue == NULL
           || (edge_count > 0 && edges == NULL)) {
           goto cleanup;
       }

       for (int i = 0; i < prerequisitesSize; ++i) {
           if (prerequisites == NULL || prerequisites[i] == NULL
               || prerequisitesColSize == NULL
               || prerequisitesColSize[i] < 2) {
               goto cleanup;
           }

           int course = prerequisites[i][0];
           int prerequisite = prerequisites[i][1];
           if (course < 0 || course >= numCourses
               || prerequisite < 0 || prerequisite >= numCourses) {
               goto cleanup;
           }

           outdegree[prerequisite] += 1;
           indegree[course] += 1;
       }

       offsets[0] = 0;
       for (size_t course = 0; course < vertex_count; ++course) {
           offsets[course + 1] = offsets[course] + outdegree[course];
       }
       memcpy(cursor, offsets, vertex_count * sizeof(size_t));

       for (int i = 0; i < prerequisitesSize; ++i) {
           int course = prerequisites[i][0];
           int prerequisite = prerequisites[i][1];
           edges[cursor[prerequisite]++] = course;
       }

       size_t head = 0;
       size_t tail = 0;
       for (int course = 0; course < numCourses; ++course) {
           if (indegree[course] == 0) {
               queue[tail++] = course;
           }
       }

       size_t processed = 0;
       while (head < tail) {
           int course = queue[head++];
           processed += 1;

           size_t begin = offsets[course];
           size_t end = offsets[course + 1];
           for (size_t index = begin; index < end; ++index) {
               int next_course = edges[index];
               indegree[next_course] -= 1;
               if (indegree[next_course] == 0) {
                   queue[tail++] = next_course;
               }
           }
       }

       result = processed == vertex_count;

   cleanup:
       free(queue);
       free(edges);
       free(cursor);
       free(offsets);
       free(outdegree);
       free(indegree);
       return result;
   }

两遍构建 CSR，重复边被连续数组逐条保存。所有失败路径都进入 ``cleanup``。由于返回类型只有
``bool``，资源失败与有环都表现为 ``false``。

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       bool canFinish(
           int numCourses,
           const std::vector<std::vector<int>>& prerequisites
       ) {
           std::vector<std::vector<int>> graph(numCourses);
           std::vector<int> indegree(numCourses, 0);

           for (const auto& edge : prerequisites) {
               int course = edge[0];
               int prerequisite = edge[1];
               graph[prerequisite].push_back(course);
               ++indegree[course];
           }

           std::vector<int> queue;
           queue.reserve(numCourses);
           for (int course = 0; course < numCourses; ++course) {
               if (indegree[course] == 0) {
                   queue.push_back(course);
               }
           }

           std::size_t head = 0;
           int processed = 0;
           while (head < queue.size()) {
               int course = queue[head++];
               ++processed;

               for (int nextCourse : graph[course]) {
                   --indegree[nextCourse];
                   if (indegree[nextCourse] == 0) {
                       queue.push_back(nextCourse);
                   }
               }
           }

           return processed == numCourses;
       }
   };

输入向量只读。``queue`` 配合头索引，避免从首部删除造成线性搬移。

Python
~~~~~~

.. code-block:: python

   from collections import deque
   from typing import List

   class Solution:
       def canFinish(
           self,
           numCourses: int,
           prerequisites: List[List[int]],
       ) -> bool:
           graph = [[] for _ in range(numCourses)]
           indegree = [0] * numCourses

           for course, prerequisite in prerequisites:
               graph[prerequisite].append(course)
               indegree[course] += 1

           queue = deque(
               course
               for course in range(numCourses)
               if indegree[course] == 0
           )
           processed = 0

           while queue:
               course = queue.popleft()
               processed += 1
               for next_course in graph[course]:
                   indegree[next_course] -= 1
                   if indegree[next_course] == 0:
                       queue.append(next_course)

           return processed == numCourses

``deque.popleft`` 为常数时间。嵌套列表和整数对象的真实内存高于紧凑整数数组，但渐近空间仍为
``O(V+E)``。

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.ArrayList;
   import java.util.List;
   import java.util.Queue;

   class Solution {
       public boolean canFinish(int numCourses, int[][] prerequisites) {
           List<List<Integer>> graph = new ArrayList<>(numCourses);
           for (int course = 0; course < numCourses; ++course) {
               graph.add(new ArrayList<>());
           }

           int[] indegree = new int[numCourses];
           for (int[] edge : prerequisites) {
               int course = edge[0];
               int prerequisite = edge[1];
               graph.get(prerequisite).add(course);
               ++indegree[course];
           }

           Queue<Integer> queue = new ArrayDeque<>();
           for (int course = 0; course < numCourses; ++course) {
               if (indegree[course] == 0) {
                   queue.add(course);
               }
           }

           int processed = 0;
           while (!queue.isEmpty()) {
               int course = queue.remove();
               ++processed;

               for (int nextCourse : graph.get(course)) {
                   --indegree[nextCourse];
                   if (indegree[nextCourse] == 0) {
                       queue.add(nextCourse);
                   }
               }
           }

           return processed == numCourses;
       }
   }

``ArrayList<Integer>`` 会装箱邻接终点，实际资源成本高于原始 ``int`` 数组。

Rust
~~~~

.. code-block:: rust

   use std::collections::VecDeque;

   impl Solution {
       pub fn can_finish(
           num_courses: i32,
           prerequisites: Vec<Vec<i32>>,
       ) -> bool {
           let vertex_count = num_courses as usize;
           let mut graph = vec![Vec::<usize>::new(); vertex_count];
           let mut indegree = vec![0usize; vertex_count];

           for edge in prerequisites {
               let course = edge[0] as usize;
               let prerequisite = edge[1] as usize;
               graph[prerequisite].push(course);
               indegree[course] += 1;
           }

           let mut queue = VecDeque::new();
           for course in 0..vertex_count {
               if indegree[course] == 0 {
                   queue.push_back(course);
               }
           }

           let mut processed = 0usize;
           while let Some(course) = queue.pop_front() {
               processed += 1;

               for &next_course in &graph[course] {
                   indegree[next_course] -= 1;
                   if indegree[next_course] == 0 {
                       queue.push_back(next_course);
                   }
               }
           }

           processed == vertex_count
       }
   }

平台保证编号非负且合法，转换到 ``usize`` 后作为索引。邻接遍历只借用当前向量，入度数组独立可变借用。

Go
~~

.. code-block:: go

   func canFinish(numCourses int, prerequisites [][]int) bool {
       graph := make([][]int, numCourses)
       indegree := make([]int, numCourses)

       for _, edge := range prerequisites {
           course := edge[0]
           prerequisite := edge[1]
           graph[prerequisite] = append(graph[prerequisite], course)
           indegree[course]++
       }

       queue := make([]int, 0, numCourses)
       for course := 0; course < numCourses; course++ {
           if indegree[course] == 0 {
               queue = append(queue, course)
           }
       }

       head := 0
       processed := 0
       for head < len(queue) {
           course := queue[head]
           head++
           processed++

           for _, nextCourse := range graph[course] {
               indegree[nextCourse]--
               if indegree[nextCourse] == 0 {
                   queue = append(queue, nextCourse)
               }
           }
       }

       return processed == numCourses
   }

队列使用切片加头索引，底层数组最多保存 ``V`` 个课程编号。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function canFinish(
       numCourses: number,
       prerequisites: number[][],
   ): boolean {
       const graph: number[][] = Array.from(
           { length: numCourses },
           () => [],
       );
       const indegree: number[] = new Array(numCourses).fill(0);

       for (const [course, prerequisite] of prerequisites) {
           graph[prerequisite].push(course);
           indegree[course] += 1;
       }

       const queue: number[] = [];
       for (let course = 0; course < numCourses; course += 1) {
           if (indegree[course] === 0) {
               queue.push(course);
           }
       }

       let head = 0;
       let processed = 0;
       while (head < queue.length) {
           const course = queue[head];
           head += 1;
           processed += 1;

           for (const nextCourse of graph[course]) {
               indegree[nextCourse] -= 1;
               if (indegree[nextCourse] === 0) {
                   queue.push(nextCourse);
               }
           }
       }

       return processed === numCourses;
   }

``number`` 对官方规模可以精确表示所有计数。普通数组不是紧凑整数数组，真实内存包含引擎槽位开销。

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public bool CanFinish(int numCourses, int[][] prerequisites) {
           var graph = new List<int>[numCourses];
           for (int course = 0; course < numCourses; ++course) {
               graph[course] = new List<int>();
           }

           var indegree = new int[numCourses];
           foreach (int[] edge in prerequisites) {
               int course = edge[0];
               int prerequisite = edge[1];
               graph[prerequisite].Add(course);
               ++indegree[course];
           }

           var queue = new Queue<int>();
           for (int course = 0; course < numCourses; ++course) {
               if (indegree[course] == 0) {
                   queue.Enqueue(course);
               }
           }

           int processed = 0;
           while (queue.Count > 0) {
               int course = queue.Dequeue();
               ++processed;

               foreach (int nextCourse in graph[course]) {
                   --indegree[nextCourse];
                   if (indegree[nextCourse] == 0) {
                       queue.Enqueue(nextCourse);
                   }
               }
           }

           return processed == numCourses;
       }
   }

``List<int>[]`` 保留每条重复边，``Queue<int>`` 负责常数均摊队列操作。

Julia
~~~~~

.. code-block:: julia

   function can_finish(
       num_courses::Int,
       prerequisites::Vector{Vector{Int}},
   )::Bool
       if num_courses == 0
           return isempty(prerequisites)
       end

       graph = [Int[] for _ in 1:num_courses]
       indegree = zeros(Int, num_courses)

       for edge in prerequisites
           course = edge[1]
           prerequisite = edge[2]
           push!(graph[prerequisite + 1], course)
           indegree[course + 1] += 1
       end

       queue = Int[]
       for course in 0:(num_courses - 1)
           if indegree[course + 1] == 0
               push!(queue, course)
           end
       end

       head = 1
       processed = 0
       while head <= length(queue)
           course = queue[head]
           head += 1
           processed += 1

           for next_course in graph[course + 1]
               index = next_course + 1
               indegree[index] -= 1
               if indegree[index] == 0
                   push!(queue, next_course)
               end
           end
       end

       return processed == num_courses
   end

函数开头处理 0 门课程扩展边界，避免构造 ``0:-1`` 的递减范围。正常输入中课程编号加一后访问数组。

R
~

.. code-block:: r

   can_finish <- function(num_courses, prerequisites) {
     if (num_courses == 0L) {
       return(length(prerequisites) == 0L)
     }

     edge_count <- length(prerequisites)
     outdegree <- integer(num_courses)
     indegree <- integer(num_courses)

     if (edge_count > 0L) {
       for (i in seq_len(edge_count)) {
         course <- prerequisites[[i]][1]
         prerequisite <- prerequisites[[i]][2]
         outdegree[prerequisite + 1L] <-
           outdegree[prerequisite + 1L] + 1L
         indegree[course + 1L] <- indegree[course + 1L] + 1L
       }
     }

     offsets <- integer(num_courses + 1L)
     for (index in seq_len(num_courses)) {
       offsets[index + 1L] <- offsets[index] + outdegree[index]
     }

     edges <- integer(edge_count)
     cursor <- offsets[seq_len(num_courses)]

     if (edge_count > 0L) {
       for (i in seq_len(edge_count)) {
         course <- prerequisites[[i]][1]
         prerequisite_index <- prerequisites[[i]][2] + 1L
         cursor[prerequisite_index] <-
           cursor[prerequisite_index] + 1L
         edges[cursor[prerequisite_index]] <- course
       }
     }

     queue <- integer(num_courses)
     tail <- 0L
     for (course in 0:(num_courses - 1L)) {
       if (indegree[course + 1L] == 0L) {
         tail <- tail + 1L
         queue[tail] <- course
       }
     }

     head <- 1L
     processed <- 0L
     while (head <= tail) {
       course <- queue[head]
       head <- head + 1L
       processed <- processed + 1L

       begin <- offsets[course + 1L] + 1L
       end <- offsets[course + 2L]
       if (begin <= end) {
         for (position in seq.int(begin, end)) {
           next_course <- edges[position]
           index <- next_course + 1L
           indegree[index] <- indegree[index] - 1L
           if (indegree[index] == 0L) {
             tail <- tail + 1L
             queue[tail] <- next_course
           }
         }
       }
     }

     processed == num_courses
   }

R 使用 CSR 和预分配队列。只有在 ``begin<=end`` 时才构造 ``seq.int(begin,end)``，避免空邻接段产生错误方向序列。课程编号加一后访问向量。

静态审查记录
------------

本章未运行、未编译、未对拍或测试任何题解代码。完成的检查包括：

* 人工推演单边、自环、两节点环、菱形 DAG、孤立课程、多个分量和重复边；
* 对建边 ``prerequisite -> course``、完整入度和剩余入度逐项映射；
* 证明 DAG 零入度引理、环阻塞、剩余图有环和 ``processed==V`` 的充要性；
* 核对每个课程至多入队一次、每条重复边恰好递减一次；
* 核对 C 的两遍 CSR、所有分配失败清理和 ``bool`` 失败通道歧义；
* 核对 C++/Go/TypeScript 的头索引队列不执行首部删除；
* 核对 Rust 邻接借用与独立入度可变借用；
* 核对 Julia/R 的零基课程编号到一基数组索引映射；
* 核对 R 仅在非空区间构造 ``seq.int``；
* 核对复杂度包含 ``E`` 条邻接载荷，没有误写成 ``O(V)`` 空间；
* 核对每种语言都保留重复边次数，并且输入先修表只读。

剩余风险：

* 题解未经过目标平台编译或执行，语法和平台签名仍存在静态审查无法消除的风险；
* C 的标准平台接口不能表达内存失败，返回 ``false`` 无法与真实有环区分；
* 防御性扩展没有替代官方输入约束，托管语言实现默认课程编号和边形状合法；
* 各语言嵌套容器的真实字节成本依赖运行时实现。

关键易错点
----------

* 把 ``[course, prerequisite]`` 错建为 ``course -> prerequisite``，同时仍按“未完成先修数”解释入度；
* 只找到一个初始零入度节点就返回真，没有处理全部课程；
* 队列为空时直接返回假，却没有比较已处理数和总课程数；
* 邻接表去重、入度不去重，或反过来，导致重复边计数失衡；
* 某后继入度已经为 0 后仍重复入队；
* 用无向图的“父节点”方法判断有向环；
* 声称额外空间 ``O(V)``，忽略邻接表中的 ``E`` 个终点；
* R/Julia 忘记课程编号加一；
* C 分配中途失败时泄漏已创建数组。

知识更新与关联题
----------------

* ``0133 Clone Graph``：邻接表、图节点与边载荷；
* ``0141 Linked List Cycle``：有限状态中的环，但本题是有向图拓扑环；
* ``0200 Number of Islands``：连通分量遍历，不涉及有向入度；
* ``0210 Course Schedule II``：同一 Kahn 状态，进一步返回实际拓扑顺序；
* ``0269 Alien Dictionary``：从顺序约束构造有向图并拓扑排序；
* ``0310 Minimum Height Trees``：使用无向图度数逐层剥离，度数含义不同。

自检问题与答案
--------------

**问题 1：为什么边是 prerequisite -> course？**

因为处理先修课程后才能解除后续课程的一条要求。这样 ``course`` 的入度正好表示尚未处理的先修边数。

**问题 2：为什么有一个零入度课程仍不足以返回真？**

它只说明至少能开始一个分量。其他未处理分量仍可能包含环，必须确认最终处理数等于全部课程数。

**问题 3：为什么 DAG 只要还有节点就一定能继续？**

有限非空 DAG 必有零入度节点；否则不断沿入边追溯会在有限节点中重复并形成环。

**问题 4：重复边为什么不会让课程入队两次？**

重复边同时增加入度和邻接项次数。处理起点时逐条递减，只有最后一次使入度从 1 变为 0，入队条件只触发一次。

**问题 5：``processed<V`` 为什么能证明有环？**

队列为空时剩余节点都没有零入度。若剩余图是 DAG，零入度引理要求至少有一个零入度节点，矛盾，因此剩余图含环。

**问题 6：C 为什么不能把分配失败精确报告给调用者？**

平台签名只返回 ``bool``，两个值已经用于“可完成/不可完成”。没有第三个状态或错误参数，分配失败只能折叠成 ``false`` 并在文档中声明。
