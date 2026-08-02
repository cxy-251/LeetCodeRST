0210. Course Schedule II
========================

题目信息
--------

:题号: 0210
:难度: Medium
:主题: 有向图、拓扑排序、顺序构造
:原题: `LeetCode 0210 <https://leetcode.com/problems/course-schedule-ii/>`_
:重点: 先修对方向、返回全部课程、合法顺序可不唯一、有环返回空数组

题目重述
--------

共有 ``numCourses`` 门课程，编号为 ``0`` 到 ``numCourses-1``。每个先修关系 ``[a, b]`` 表示：学习课程 ``a`` 前必须先完成课程 ``b``。返回任意一个能够完成全部课程的合法顺序；若不存在这样的顺序，返回空数组。

``numCourses`` 位于 ``[1, 2000]``，先修关系数量位于 ``[0, 5000]``。所有课程编号合法，所有先修对互不重复。返回数组必须恰好包含每门课程一次，并使每个先修课程都出现在依赖它的课程之前；合法顺序可能不唯一，任意一个都可接受。

自建示例
--------

存在多个合法顺序：

.. code-block:: text

   输入：numCourses = 5，prerequisites = [[2,0],[2,1],[4,2],[4,3]]
   输出：[0,1,2,3,4]
   解释：0 和 1 都必须早于 2，2 和 3 都必须早于 4；[1,0,3,2,4] 也满足全部约束。

有环时不能返回部分结果：

.. code-block:: text

   输入：numCourses = 4，prerequisites = [[1,0],[2,1],[0,2]]
   输出：[]
   解释：0、1、2 形成循环依赖；即使课程 3 没有先修要求，也不存在包含全部四门课程的合法顺序。

问题抽象与解法选择
------------------

目标是构造一个拓扑序。Kahn 算法维护所有当前入度为 0 的课程：这些课程不再依赖任何未处理课程，
可以安全接到输出前缀末尾。每弹出一门课程，就删除其出边并更新后继入度。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 取舍
   * - Kahn 入度队列
     - ``O(V+E)``
     - ``O(V+E)``
     - 主解法；自然生成顺序并用处理数判断有环
   * - DFS 三色标记后逆后序
     - ``O(V+E)``
     - ``O(V+E)``
     - 同样正确，但递归深度和反转顺序增加语言风险
   * - 枚举课程排列
     - ``O(V!)``
     - ``O(V)``
     - 不可行

这里 ``V=numCourses``，``E`` 是先修对数量，重复边按出现次数计入 ``E``。返回数组本身有 ``O(V)`` 输出载荷。

状态与核心不变量
----------------

维护：

``indegree[v]``
   来自未处理课程、仍未删除的入边数量。

``queue``
   已经发现、尚未输出且当前入度为 0 的课程。

``order``
   已经弹出队列的课程顺序。

每轮开始时保持：

#. 对每个未处理课程 ``v``，``indegree[v]`` 恰好等于来自未处理课程的剩余入边数；
#. 队列中的每门课程当前入度为 0，并且尚未进入 ``order``；
#. 每门课程至多入队一次；
#. ``order`` 中每门课程恰好出现一次；
#. 对任意已经输出的课程，其所有仍存在的后继尚未输出，删除过的边都来自更早的输出课程；
#. ``order`` 是一个合法拓扑前缀：前缀内部每条边的起点早于终点；
#. 重复边在邻接表和入度中保持相同次数；
#. 输入先修表未被修改。

初始化
~~~~~~

根据全部先修对建立邻接表和完整入度。此时没有课程被处理，因此完整入度就是剩余入度。
扫描所有课程，把入度为 0 的课程各入队一次，``order`` 为空，不变量成立。

处理课程
~~~~~~~~

从队列弹出 ``u`` 并追加到 ``order``。由于 ``indegree[u]=0``，它没有来自任何未处理课程的先修边，
所以放在当前前缀末尾不会违反依赖。

随后逐条处理 ``u -> v``：

.. code-block:: text

   indegree[v] -= 1

当 ``indegree[v]`` 第一次变为 0 时，``v`` 的全部先修课程都已输出，将其入队。

为什么不会重复入队
~~~~~~~~~~~~~~~~~~

入度只递减。初始为 0 的课程只在初始化入队；初始为正的课程只有一次从 1 变为 0，
因此入队条件至多触发一次。重复边会带来多次递减，但仍只有最后一次删除剩余入边时触发零转换。

正确性证明
----------

引理一：剩余入度不变量始终成立
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

初始化时没有课程被处理，入度等于完整图入度。处理 ``u`` 时，算法恰好删除所有以 ``u`` 为起点的邻接项，
并对每个终点递减一次。其他边不变，因此每个未处理课程的入度继续等于来自未处理课程的剩余入边数。
重复边逐条保存、逐条删除，不破坏计数。

引理二：每次追加到 order 的课程都满足全部先修要求
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

课程 ``u`` 出队时当前入度为 0。由引理一，它没有来自未处理课程的入边；所有原始先修课程都已进入
``order``。因此把 ``u`` 追加到前缀末尾后，每条进入 ``u`` 的边起点都早于 ``u``。

引理三：order 始终是合法拓扑前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

空前缀显然合法。假设已有前缀合法，新追加课程由引理二满足所有进入边；它的出边终点尚未因为这条边而变为
可处理状态，不能已经在它之前错误输出。于是新前缀仍满足所有内部边的先后关系。归纳成立。

引理四：有限非空 DAG 必有零入度节点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

反设有限非空 DAG 中每个节点入度至少为 1。从任意节点反复沿一条入边移动到前驱。
节点有限而路径可无限延长，必然重复某个节点并形成有向环，与 DAG 假设矛盾。

引理五：图无环时算法会输出全部课程
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

假设仍有未处理课程。由引理一，剩余课程及剩余边构成原图的诱导剩余子图；DAG 的子图仍无环。
由引理四，该非空剩余图必有零入度课程，它应在队列中，与算法因队列为空而停止矛盾。
因此无环时最终 ``order`` 长度必为 ``V``。

引理六：图有环时算法不能输出全部课程
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

环中每个课程都有一条来自环内前驱的入边。要让某个环节点入度归零，必须先处理它的环内前驱；
沿环追溯又要求先处理原节点，因此没有环节点能成为第一个出队者。至少一个环上的课程不会进入 ``order``，
所以输出长度小于 ``V``。

定理：算法返回且仅返回合法完整顺序
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若 ``order`` 长度为 ``V``，引理三说明它是包含全部课程且满足每条先修边的拓扑序，算法返回它。
若长度小于 ``V``，引理五的逆向结论与引理六说明图中存在有向环，不存在完整拓扑序；算法丢弃部分前缀并返回空数组。
因此返回值与题目合同完全一致。

非唯一顺序为何都正确
--------------------

当队列同时含有多门零入度课程时，它们之间当前没有来自未处理课程的强制先后关系。不同语言的容器或邻接顺序
可能产生不同输出。验证应检查：

#. 输出长度是否为 ``V``；
#. 每门课程是否恰好出现一次；
#. 对每条 ``prerequisite -> course``，前者位置是否更小。

不能只与某个固定示例数组比较。

人工状态推演
------------

菱形图 ``0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3``：

.. list-table::
   :header-rows: 1

   * - 时刻
     - 队列
     - 入度 ``[0,1,1,2]`` 的变化
     - order
   * - 初始化
     - ``[0]``
     - ``[0,1,1,2]``
     - ``[]``
   * - 弹出 0
     - ``[1,2]``
     - ``[0,0,0,2]``
     - ``[0]``
   * - 弹出 1
     - ``[2]``
     - ``[0,0,0,1]``
     - ``[0,1]``
   * - 弹出 2
     - ``[3]``
     - ``[0,0,0,0]``
     - ``[0,1,2]``
   * - 弹出 3
     - ``[]``
     - ``[0,0,0,0]``
     - ``[0,1,2,3]``

若 1 与 2 的入队或出队顺序交换，得到 ``[0,2,1,3]``，仍合法。

复杂度与资源成本
----------------

* 建图扫描 ``E`` 条边，Kahn 过程访问每个顶点一次、每条邻接项一次，时间 ``O(V+E)``；
* 邻接表保存 ``E`` 个终点，入度和队列各 ``O(V)``，工作空间 ``O(V+E)``；
* 返回顺序是 ``O(V)`` 输出载荷，不能把它隐藏在 ``O(1)`` 中；
* C 使用出度、前缀偏移、游标、邻接、入度、队列和结果数组，任一分配失败都清理并返回 ``NULL``、``returnSize=0``；
* C 的空结果无法区分“图有环”和“资源分配失败”，平台签名没有第三种状态；
* C++、Java、Rust、Go、TypeScript 和 C# 的嵌套邻接容器还有对象头或容量冗余；
* Julia、R 将零基课程编号加一访问数组，但返回值仍保持题目要求的零基编号；
* R 实现使用 CSR 和预分配队列，避免对邻接表反复 ``c`` 导致的额外复制。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> findOrder(
           int numCourses, std::vector<std::vector<int>>& prerequisites) {
           std::vector<std::vector<int>> graph(numCourses);
           std::vector<int> indegree(numCourses, 0);
           for (const auto& prerequisite : prerequisites) {
               int course = prerequisite[0];
               int prerequisiteCourse = prerequisite[1];
               graph[prerequisiteCourse].push_back(course);
               ++indegree[course];
           }

           std::queue<int> ready;
           for (int course = 0; course < numCourses; ++course) {
               if (indegree[course] == 0) ready.push(course);
           }

           std::vector<int> order;
           order.reserve(numCourses);
           while (!ready.empty()) {
               int course = ready.front();
               ready.pop();
               order.push_back(course);
               for (int next : graph[course]) {
                   if (--indegree[next] == 0) ready.push(next);
               }
           }
           if (static_cast<int>(order.size()) != numCourses) return {};
           return order;
       }
   };

代码分析
--------

这段代码与“完成全部课程”的版本使用同一入度不变量，但把每次出队的课程保存到 ``order``。队列开始时包含所有无需先修课的课程；课程出队后，它对后继课程的最后一条未完成依赖可能被删除，于是后继才可入队。因而 ``order`` 中任意边 ``prerequisite -> course`` 都满足先修课先出现。

若图有环，环中每个节点至少保留一条来自环内的入边，无法进入队列，结果长度会小于 ``numCourses``，此时必须返回空数组而不是返回不完整顺序。无环时拓扑过程会处理每个课程，得到的任意一个合法顺序都满足题目要求。每条边只处理一次，时间复杂度为 ``O(V+E)``；邻接表和入度数组是 ``O(V+E)``，返回顺序本身另占 ``O(V)``。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>

   int *findOrder(
       int numCourses,
       int **prerequisites,
       int prerequisitesSize,
       int *prerequisitesColSize,
       int *returnSize
   ) {
       *returnSize = 0;
       if (numCourses <= 0) {
           return NULL;
       }

       const size_t v = (size_t)numCourses;
       const size_t e = prerequisitesSize > 0 ? (size_t)prerequisitesSize : 0U;
       if (v > SIZE_MAX / sizeof(int) ||
           (v + 1U) > SIZE_MAX / sizeof(size_t) ||
           e > SIZE_MAX / sizeof(int)) {
           return NULL;
       }

       int *outdegree = calloc(v, sizeof(int));
       int *indegree = calloc(v, sizeof(int));
       size_t *offset = calloc(v + 1U, sizeof(size_t));
       size_t *cursor = calloc(v, sizeof(size_t));
       int *adjacency = e == 0U ? NULL : malloc(e * sizeof(int));
       int *queue = malloc(v * sizeof(int));
       int *order = malloc(v * sizeof(int));

       if (outdegree == NULL || indegree == NULL || offset == NULL ||
           cursor == NULL || (e > 0U && adjacency == NULL) ||
           queue == NULL || order == NULL) {
           free(outdegree);
           free(indegree);
           free(offset);
           free(cursor);
           free(adjacency);
           free(queue);
           free(order);
           return NULL;
       }

       for (int i = 0; i < prerequisitesSize; ++i) {
           if (prerequisitesColSize != NULL && prerequisitesColSize[i] < 2) {
               free(outdegree); free(indegree); free(offset); free(cursor);
               free(adjacency); free(queue); free(order);
               return NULL;
           }
           const int course = prerequisites[i][0];
           const int prerequisite = prerequisites[i][1];
           if (course < 0 || course >= numCourses ||
               prerequisite < 0 || prerequisite >= numCourses) {
               free(outdegree); free(indegree); free(offset); free(cursor);
               free(adjacency); free(queue); free(order);
               return NULL;
           }
           ++outdegree[prerequisite];
           ++indegree[course];
       }

       for (size_t i = 0; i < v; ++i) {
           offset[i + 1U] = offset[i] + (size_t)outdegree[i];
           cursor[i] = offset[i];
       }
       for (int i = 0; i < prerequisitesSize; ++i) {
           const int course = prerequisites[i][0];
           const int prerequisite = prerequisites[i][1];
           adjacency[cursor[prerequisite]++] = course;
       }

       size_t head = 0U;
       size_t tail = 0U;
       size_t count = 0U;
       for (int course = 0; course < numCourses; ++course) {
           if (indegree[course] == 0) {
               queue[tail++] = course;
           }
       }

       while (head < tail) {
           const int course = queue[head++];
           order[count++] = course;
           for (size_t edge = offset[course]; edge < offset[course + 1]; ++edge) {
               const int next = adjacency[edge];
               --indegree[next];
               if (indegree[next] == 0) {
                   queue[tail++] = next;
               }
           }
       }

       free(outdegree);
       free(indegree);
       free(offset);
       free(cursor);
       free(adjacency);
       free(queue);

       if (count != v) {
           free(order);
           return NULL;
       }
       *returnSize = numCourses;
       return order;
   }

C++
~~~

.. code-block:: cpp

   #include <queue>
   #include <vector>

   class Solution {
   public:
       std::vector<int> findOrder(
           int numCourses,
           const std::vector<std::vector<int>>& prerequisites
       ) {
           std::vector<std::vector<int>> graph(numCourses);
           std::vector<int> indegree(numCourses, 0);
           for (const auto& edge : prerequisites) {
               const int course = edge[0];
               const int prerequisite = edge[1];
               graph[prerequisite].push_back(course);
               ++indegree[course];
           }

           std::queue<int> ready;
           for (int course = 0; course < numCourses; ++course) {
               if (indegree[course] == 0) ready.push(course);
           }

           std::vector<int> order;
           order.reserve(numCourses);
           while (!ready.empty()) {
               const int course = ready.front();
               ready.pop();
               order.push_back(course);
               for (const int next : graph[course]) {
                   if (--indegree[next] == 0) ready.push(next);
               }
           }
           return order.size() == static_cast<std::size_t>(numCourses)
               ? order : std::vector<int>{};
       }
   };

Python
~~~~~~

.. code-block:: python

   from collections import deque

   class Solution:
       def findOrder(self, numCourses: int, prerequisites: list[list[int]]) -> list[int]:
           graph = [[] for _ in range(numCourses)]
           indegree = [0] * numCourses
           for course, prerequisite in prerequisites:
               graph[prerequisite].append(course)
               indegree[course] += 1

           ready = deque(course for course in range(numCourses) if indegree[course] == 0)
           order: list[int] = []
           while ready:
               course = ready.popleft()
               order.append(course)
               for next_course in graph[course]:
                   indegree[next_course] -= 1
                   if indegree[next_course] == 0:
                       ready.append(next_course)
           return order if len(order) == numCourses else []

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       public int[] findOrder(int numCourses, int[][] prerequisites) {
           List<List<Integer>> graph = new ArrayList<>(numCourses);
           for (int i = 0; i < numCourses; ++i) graph.add(new ArrayList<>());
           int[] indegree = new int[numCourses];
           for (int[] edge : prerequisites) {
               graph.get(edge[1]).add(edge[0]);
               ++indegree[edge[0]];
           }

           ArrayDeque<Integer> ready = new ArrayDeque<>();
           for (int course = 0; course < numCourses; ++course) {
               if (indegree[course] == 0) ready.addLast(course);
           }

           int[] order = new int[numCourses];
           int count = 0;
           while (!ready.isEmpty()) {
               int course = ready.removeFirst();
               order[count++] = course;
               for (int next : graph.get(course)) {
                   if (--indegree[next] == 0) ready.addLast(next);
               }
           }
           return count == numCourses ? order : new int[0];
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::collections::VecDeque;

   impl Solution {
       pub fn find_order(num_courses: i32, prerequisites: Vec<Vec<i32>>) -> Vec<i32> {
           let n = num_courses as usize;
           let mut graph = vec![Vec::<usize>::new(); n];
           let mut indegree = vec![0usize; n];
           for edge in prerequisites {
               let course = edge[0] as usize;
               let prerequisite = edge[1] as usize;
               graph[prerequisite].push(course);
               indegree[course] += 1;
           }

           let mut ready = VecDeque::new();
           for course in 0..n {
               if indegree[course] == 0 { ready.push_back(course); }
           }

           let mut order = Vec::with_capacity(n);
           while let Some(course) = ready.pop_front() {
               order.push(course as i32);
               for &next in &graph[course] {
                   indegree[next] -= 1;
                   if indegree[next] == 0 { ready.push_back(next); }
               }
           }
           if order.len() == n { order } else { Vec::new() }
       }
   }

Go
~~

.. code-block:: go

   func findOrder(numCourses int, prerequisites [][]int) []int {
       graph := make([][]int, numCourses)
       indegree := make([]int, numCourses)
       for _, edge := range prerequisites {
           course, prerequisite := edge[0], edge[1]
           graph[prerequisite] = append(graph[prerequisite], course)
           indegree[course]++
       }

       queue := make([]int, 0, numCourses)
       for course := 0; course < numCourses; course++ {
           if indegree[course] == 0 { queue = append(queue, course) }
       }
       order := make([]int, 0, numCourses)
       for head := 0; head < len(queue); head++ {
           course := queue[head]
           order = append(order, course)
           for _, next := range graph[course] {
               indegree[next]--
               if indegree[next] == 0 { queue = append(queue, next) }
           }
       }
       if len(order) != numCourses { return []int{} }
       return order
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function findOrder(numCourses: number, prerequisites: number[][]): number[] {
       const graph: number[][] = Array.from({ length: numCourses }, () => []);
       const indegree = new Array<number>(numCourses).fill(0);
       for (const [course, prerequisite] of prerequisites) {
           graph[prerequisite].push(course);
           indegree[course] += 1;
       }

       const queue: number[] = [];
       for (let course = 0; course < numCourses; course += 1) {
           if (indegree[course] === 0) queue.push(course);
       }
       const order: number[] = [];
       for (let head = 0; head < queue.length; head += 1) {
           const course = queue[head];
           order.push(course);
           for (const next of graph[course]) {
               indegree[next] -= 1;
               if (indegree[next] === 0) queue.push(next);
           }
       }
       return order.length === numCourses ? order : [];
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public int[] FindOrder(int numCourses, int[][] prerequisites) {
           var graph = new List<int>[numCourses];
           for (int i = 0; i < numCourses; ++i) graph[i] = new List<int>();
           var indegree = new int[numCourses];
           foreach (int[] edge in prerequisites) {
               graph[edge[1]].Add(edge[0]);
               ++indegree[edge[0]];
           }

           var ready = new Queue<int>();
           for (int course = 0; course < numCourses; ++course) {
               if (indegree[course] == 0) ready.Enqueue(course);
           }
           var order = new int[numCourses];
           int count = 0;
           while (ready.Count > 0) {
               int course = ready.Dequeue();
               order[count++] = course;
               foreach (int next in graph[course]) {
                   if (--indegree[next] == 0) ready.Enqueue(next);
               }
           }
           return count == numCourses ? order : System.Array.Empty<int>();
       }
   }

Julia
~~~~~

.. code-block:: julia

   function find_order(num_courses::Int, prerequisites::Vector{Vector{Int}})::Vector{Int}
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
           indegree[course + 1] == 0 && push!(queue, course)
       end
       order = Int[]
       head = 1
       while head <= length(queue)
           course = queue[head]
           head += 1
           push!(order, course)
           for next in graph[course + 1]
               indegree[next + 1] -= 1
               indegree[next + 1] == 0 && push!(queue, next)
           end
       end
       return length(order) == num_courses ? order : Int[]
   end

R
~

.. code-block:: r

   find_order <- function(num_courses, prerequisites) {
     if (num_courses == 0L) return(integer(0))
     edge_count <- if (length(prerequisites) == 0L) 0L else nrow(prerequisites)
     outdegree <- integer(num_courses)
     indegree <- integer(num_courses)

     if (edge_count > 0L) {
       for (i in seq_len(edge_count)) {
         course <- prerequisites[i, 1L]
         prerequisite <- prerequisites[i, 2L]
         outdegree[prerequisite + 1L] <- outdegree[prerequisite + 1L] + 1L
         indegree[course + 1L] <- indegree[course + 1L] + 1L
       }
     }

     offset <- integer(num_courses + 1L)
     for (i in seq_len(num_courses)) offset[i + 1L] <- offset[i] + outdegree[i]
     cursor <- offset[seq_len(num_courses)]
     adjacency <- integer(edge_count)
     if (edge_count > 0L) {
       for (i in seq_len(edge_count)) {
         course <- prerequisites[i, 1L]
         prerequisite <- prerequisites[i, 2L]
         slot <- cursor[prerequisite + 1L] + 1L
         adjacency[slot] <- course
         cursor[prerequisite + 1L] <- cursor[prerequisite + 1L] + 1L
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

     order <- integer(num_courses)
     head <- 1L
     count <- 0L
     while (head <= tail) {
       course <- queue[head]
       head <- head + 1L
       count <- count + 1L
       order[count] <- course
       begin <- offset[course + 1L] + 1L
       end <- offset[course + 2L]
       if (begin <= end) {
         for (slot in seq.int(begin, end)) {
           next_course <- adjacency[slot]
           indegree[next_course + 1L] <- indegree[next_course + 1L] - 1L
           if (indegree[next_course + 1L] == 0L) {
             tail <- tail + 1L
             queue[tail] <- next_course
           }
         }
       }
     }
     if (count != num_courses) integer(0) else order
   }

静态审查记录
------------

本章未运行、未编译、未对拍或测试任何题解代码。完成的静态检查包括：

* 人工推演单边、菱形 DAG、多个合法顺序、自环、两节点环、孤立课程、重复边和多分量；
* 核对所有语言都使用 ``prerequisite -> course``，并逐条保留重复边；
* 证明剩余入度不变量、合法输出前缀、DAG 零入度引理和完整输出与无环等价；
* 核对有环时丢弃部分顺序，而不是把部分前缀当成答案；
* 核对 C 的 CSR 构建、所有分配失败清理、``returnSize`` 和空结果语义；
* 核对 C++/Go/TypeScript 的队列不执行线性首部删除；
* 核对 R/Julia 的零基课程编号到一基数组映射，R 的空邻接区间不构造反向 ``seq.int``；
* 核对复杂度包含 ``E`` 条邻接载荷和 ``V`` 项输出载荷。

剩余风险：题解未经过目标平台编译或执行；C 的 ``NULL/0`` 同时表示有环、空扩展和资源失败；
各托管语言容器真实字节开销依赖运行时实现。

关键易错点
----------

* 把先修对建成 ``course -> prerequisite`` 却仍沿用当前入度解释；
* 队列耗尽后直接返回部分 ``order``；
* 强制答案等于某个固定数组，误判另一合法拓扑序；
* 邻接表去重而入度不去重，或反过来；
* 只检查是否存在初始零入度课程；
* 声称空间只有 ``O(V)``，忽略 ``E`` 条邻接载荷；
* R/Julia 返回一基课程编号；
* C 分配中途失败时泄漏已创建数组。

知识更新与关联题
----------------

* ``0207 Course Schedule``：使用相同 Kahn 状态，只返回是否可完成；
* ``0210`` 新增输出前缀不变量、完整顺序载荷和非唯一答案验证；
* ``0269 Alien Dictionary``：从字符顺序约束构造图并返回拓扑序；
* ``0444 Sequence Reconstruction``：进一步判断拓扑序是否唯一。

自检问题与答案
--------------

**问题 1：为什么合法输出不一定唯一？**

同时入度为 0 的课程之间可能没有依赖约束，选择任意一个先输出都可保持拓扑性质。

**问题 2：为什么有环时不能返回已处理前缀？**

题目要求包含全部课程的顺序。部分前缀虽然内部合法，却遗漏环上课程，不满足输出合同。

**问题 3：怎样验证一个候选顺序？**

检查长度为 ``V``、每门课程恰好一次，并确认每条 ``prerequisite -> course`` 的起点位置更小。

**问题 4：重复边为什么不会让课程重复入队？**

重复边同时增加入度和邻接项次数；只有最后一次递减使入度从 1 变为 0，零转换只发生一次。

**问题 5：为什么 ``order`` 长度为 ``V`` 能证明无环？**

若存在有向环，环内节点始终保留至少一条环内入边，无法全部入队，因此不可能输出全部课程。
