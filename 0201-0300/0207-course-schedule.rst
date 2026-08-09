0207. Course Schedule
=====================

题目信息
--------

:题号: 0207. 课程表
:难度: Medium
:主题: 有向图、拓扑排序、环检测
:原题: `LeetCode 0207 <https://leetcode.com/problems/course-schedule/>`_
:重点: 将先修关系定向为先修课到后续课，只有无环图才能逐步取出零入度课程

题目重述
--------

共有 ``numCourses`` 门课程，编号为 ``0`` 到 ``numCourses - 1``。每个先修关系
``[course, prerequisite]`` 表示必须先完成 ``prerequisite``，才能学习 ``course``。判断是否
存在一种顺序完成全部课程；能完成返回 ``true``，否则返回 ``false``。

``numCourses`` 位于 ``[1, 2000]``，先修关系数量不超过 ``5000``，课程编号均合法，关系对互不
重复。课程图可以有多个互不相连的分量，也可以有完全没有先修关系的孤立课程；函数只判断可行性，
不需要返回具体顺序。

自建示例
--------

分支最终汇合：

.. code-block:: text

   输入：numCourses = 4，prerequisites = [[1,0],[2,0],[3,1],[3,2]]
   输出：true
   解释：先完成 0，再完成 1、2，最后完成 3。

局部循环会阻塞全部课程：

.. code-block:: text

   输入：numCourses = 4，prerequisites = [[1,0],[0,1]]
   输出：false
   解释：0 和 1 互相等待；即使课程 2、3 没有先修关系，也不能完成全部课程。

没有任何先修关系：

.. code-block:: text

   输入：numCourses = 3，prerequisites = []
   输出：true

C++ 实现
--------

.. code-block:: cpp

   #include <queue>
   #include <vector>

   class Solution {
   public:
       bool canFinish(int numCourses,
                      std::vector<std::vector<int>>& prerequisites) {
           return canFinishByIndegree(numCourses, prerequisites);
       }

   private:
       bool canFinishByIndegree(int numCourses,
                                const std::vector<std::vector<int>>& prerequisites) {
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

           int processed = 0;
           while (!ready.empty()) {
               int course = ready.front();
               ready.pop();
               ++processed;

               for (int next : graph[course]) {
                   if (--indegree[next] == 0) ready.push(next);
               }
           }
           return processed == numCourses;
       }

       bool canFinishByDfs(int numCourses,
                           const std::vector<std::vector<int>>& prerequisites) {
           std::vector<std::vector<int>> graph(numCourses);
           for (const auto& prerequisite : prerequisites) {
               graph[prerequisite[1]].push_back(prerequisite[0]);
           }

           std::vector<int> state(numCourses, 0);
           for (int course = 0; course < numCourses; ++course) {
               if (state[course] == 0 && hasCycle(course, graph, state)) {
                   return false;
               }
           }
           return true;
       }

       bool hasCycle(int course,
                     const std::vector<std::vector<int>>& graph,
                     std::vector<int>& state) {
           state[course] = 1;
           for (int next : graph[course]) {
               if (state[next] == 1) return true;
               if (state[next] == 0 && hasCycle(next, graph, state)) return true;
           }
           state[course] = 2;
           return false;
       }
   };

题解
----

先修关系就是有向边
~~~~~~~~~~~~~~~~~~~~

把 ``[course, prerequisite]`` 直接理解成 ``course -> prerequisite`` 容易把方向写反。为了表示
“先完成谁”，统一建立边：

.. code-block:: text

   prerequisite -> course

这样，一个课程的入度就是它尚未完成的直接先修课程数量。完成全部课程等价于找到一个拓扑顺序：
每条边的起点都出现在终点之前。

暴力排列与局部选择
~~~~~~~~~~~~~~~~~~~~

枚举所有课程排列并逐条检查先修关系是阶乘级搜索。更有希望的贪心是每一步选择当前没有未完成
先修课的课程，完成它后再释放后续课程；因为它当前入度为 0，把它接到已有顺序末尾不会违反
任何边。

若某一步没有可选课程，却仍有课程未完成，剩余课程之间的每个入度都大于 0。沿剩余入边不断
回溯，有限节点中必然重复，形成环；环内没有第一个可以启动的课程。因此“能否持续取出零入度
课程直到全部完成”正好等价于“图是否无环”。

Kahn 算法逐步删除已完成课程
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``canFinishByIndegree`` 维护两类状态：邻接表保存每门课程完成后会释放哪些后续课程，
``indegree`` 保存仍来自未完成课程的边数。初始化时把所有入度为 0 的课程放入队列。

每弹出课程 ``course``，就把它视为已完成，并遍历所有 ``course -> next`` 边，将
``indegree[next]`` 减一；某个后继第一次变为 0 时，说明它的全部先修课都已经完成，可以入队。
每门课程只会从 1 变为 0 一次，因此不会重复入队。

核心不变量
~~~~~~~~~~~~

每轮开始时保持：

* 对任何未完成课程，``indegree`` 恰好是它来自未完成课程的剩余入边数量；
* 队列中的课程恰好是已发现、未处理且当前入度为 0 的课程；
* 已处理课程的顺序满足所有已经删除的边；
* 每条邻接边只在其起点被处理时删除一次，入度与边的数量同步。

处理零入度课程不会制造新的前置违反；递减后继入度只删除一条已经满足的先修边，所以不变量
可以逐轮推进。最终 ``processed == numCourses`` 时，出队顺序就是合法拓扑序；否则队列先空，
剩余图含有环。

状态走读
~~~~~~~~

对 ``[[1,0],[2,0],[3,1],[3,2]]``，边为 ``0->1、0->2、1->3、2->3``：

.. list-table::
   :header-rows: 1

   * - 阶段
     - 队列
     - 入度
     - processed
   * - 初始化
     - ``[0]``
     - ``[0,1,1,2]``
     - 0
   * - 处理 0
     - ``[1,2]``
     - ``[0,0,0,2]``
     - 1
   * - 处理 1
     - ``[2]``
     - ``[0,0,0,1]``
     - 2
   * - 处理 2
     - ``[3]``
     - ``[0,0,0,0]``
     - 3
   * - 处理 3
     - ``[]``
     - ``[0,0,0,0]``
     - 4

课程 3 要等 1、2 两条入边都删除后才入队。若只有 ``0->1``、``1->0``，初始化入度为
``[1,1]``，队列为空，``processed`` 保持 0，算法立即判定无法完成全部课程。

DFS 三色判环
~~~~~~~~~~~~~~

``canFinishByDfs`` 用另一种状态压缩表达同一结论：0 表示未访问，1 表示正在当前递归路径中，
2 表示该课程及其后继已经确认无环。沿边访问时遇到状态 1，就是从当前路径回到了祖先，形成
有向环；完成全部后继后标为 2，可被其他分量复用而不重复搜索。

DFS 与 Kahn 都是 ``O(V+E)``，但递归深度可能达到课程数；主入口选择 Kahn，使用显式队列并让
处理数量直接对应“已完成课程数”。外层遍历所有课程仍然必要，因为图可能有多个不连通分量。

代码分析
~~~~~~~~

建图时必须把 ``prerequisite[1]`` 放在邻接表起点，把 ``prerequisite[0]`` 作为后继；入度只
增加后者。队列初始化覆盖所有孤立课程和所有分量的入口，不能只从课程 0 开始搜索。

弹出课程后先增加 ``processed``，再遍历邻接项递减入度。边被访问一次且只在从 1 变成 0 时入队，
所以队列不会重复同一课程；最后比较数量而不是只检查队列是否为空，才能发现局部环留下的未处理
课程。

DFS 版本的 ``state`` 只记录“当前递归路径”和“已完成搜索”两种有区别的访问状态；若把访问过
的节点简单标成一个布尔值，会丢失回边与跨分支边的语义，可能漏报环。

复杂度与边界
~~~~~~~~~~~~

设课程数为 ``V``、先修关系数为 ``E``。Kahn 建图、入度处理和队列遍历总时间为 ``O(V+E)``，
邻接表、入度数组和队列额外空间为 ``O(V+E)``；DFS 同阶，但递归栈最坏为 ``O(V)``。

没有先修关系时所有课程初始入队，返回 ``true``；孤立课程与其他分量独立处理。自环或更长环
不会产生零入度入口，最终使处理数量小于 ``V``。输入关系保证课程编号和二元结构合法，代码不需
额外修复无效边。
