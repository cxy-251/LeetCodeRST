0210. Course Schedule II
========================

题目信息
--------

:题号: 0210. 课程表 II
:难度: Medium
:主题: 有向图、拓扑排序、顺序构造、环检测
:原题: `LeetCode 0210 <https://leetcode.com/problems/course-schedule-ii/>`_
:重点: 维护合法拓扑前缀，全部课程出队才返回顺序，遇到环则丢弃部分结果

题目重述
--------

共有 ``numCourses`` 门课程，编号为 ``0`` 到 ``numCourses - 1``。先修关系
``[course, prerequisite]`` 表示必须先完成 ``prerequisite``，才能完成 ``course``。返回任意一个
包含全部课程、且满足每条先修关系的学习顺序；若不存在完整顺序，返回空数组。

``numCourses`` 位于 ``[1, 2000]``，先修关系数量位于 ``[0, numCourses * (numCourses - 1)]``，
关系对合法、互不重复且不存在 ``[x, x]``。合法顺序可能不唯一，返回数组必须恰好包含每门课程一次。

自建示例
--------

一条先修链：

.. code-block:: text

   输入：numCourses = 2，prerequisites = [[1,0]]
   输出：[0,1]

分支课程可以互换顺序：

.. code-block:: text

   输入：numCourses = 4，prerequisites = [[1,0],[2,0],[3,1],[3,2]]
   输出：[0,1,2,3] 或 [0,2,1,3]

存在环时不能返回剩余可完成课程：

.. code-block:: text

   输入：numCourses = 4，prerequisites = [[1,0],[2,1],[0,2]]
   输出：[]

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <queue>
   #include <vector>

   class Solution {
   public:
       std::vector<int> findOrder(int numCourses,
                                  std::vector<std::vector<int>>& prerequisites) {
           return orderByIndegree(numCourses, prerequisites);
       }

   private:
       std::vector<int> orderByIndegree(
           int numCourses, const std::vector<std::vector<int>>& prerequisites) {
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

       std::vector<int> orderByDfs(
           int numCourses, const std::vector<std::vector<int>>& prerequisites) {
           std::vector<std::vector<int>> graph(numCourses);
           for (const auto& prerequisite : prerequisites) {
               graph[prerequisite[1]].push_back(prerequisite[0]);
           }

           std::vector<int> state(numCourses, 0);
           std::vector<int> order;
           for (int course = 0; course < numCourses; ++course) {
               if (state[course] == 0 && hasCycle(course, graph, state, order)) {
                   return {};
               }
           }

           std::reverse(order.begin(), order.end());
           return order;
       }

       bool hasCycle(int course,
                     const std::vector<std::vector<int>>& graph,
                     std::vector<int>& state,
                     std::vector<int>& order) {
           state[course] = 1;
           for (int next : graph[course]) {
               if (state[next] == 1) return true;
               if (state[next] == 0 && hasCycle(next, graph, state, order)) return true;
           }
           state[course] = 2;
           order.push_back(course);
           return false;
       }
   };

题解
----

返回顺序比判断可行多一个状态
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

只判断能否完成时，答案可以压缩成一个布尔值；本题还要返回每门课程的先后，因此算法必须在
判断无环的同时构造一个顺序。将关系定向为 ``prerequisite -> course`` 后，目标就是构造拓扑序：
每条边的起点出现在终点之前。

枚举排列与安全选择
~~~~~~~~~~~~~~~~~~~~

枚举所有课程排列并逐条验证先修关系是阶乘级搜索。更有用的直接策略是反复寻找当前没有未完成
先修课的课程，并把它追加到输出末尾；这样的课程入度为 0，把它放在当前拓扑前缀之后不会违反
任何边。

若仍有课程却找不到零入度课程，剩余依赖必然形成环。此时已经构造出的前缀可能合法，但它不是
题目要求的“包含全部课程”的答案，必须返回空数组，不能把部分顺序交给调用者。

Kahn 算法直接生成拓扑前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``orderByIndegree`` 维护邻接表和每门课程的剩余入度：

1. 建立从先修课到后续课的边，并统计后续课入度；
2. 把所有入度为 0 的课程放入队列；
3. 弹出一门课程并追加到 ``order``；
4. 删除它的每条出边，后继入度减一；
5. 后继第一次变为 0 时入队。

每轮的 ``order`` 都是合法拓扑前缀。入度只递减，所以一门课程最多入队一次；当队列为空时，
若 ``order`` 长度小于课程数，剩余图没有可启动节点，必含有环。

状态不变量
~~~~~~~~~~~~

每次从队列取出课程前保持：

* ``indegree[v]`` 等于未进入 ``order`` 的课程指向 ``v`` 的剩余边数；
* 队列中的课程尚未进入 ``order`` 且当前入度为 0；
* ``order`` 中没有重复课程，且已满足其中所有边的先后关系；
* 每条出边只在起点加入 ``order`` 后删除一次。

弹出的课程没有来自未处理课程的入边，可以安全追加；删除它的出边只会减少后继的剩余要求。
某个后继从 1 变为 0 时，恰好说明所有先修课程都已进入前缀，加入队列不会破坏不变量。

状态走读
~~~~~~~~

对菱形依赖 ``0->1、0->2、1->3、2->3``：

.. list-table::
   :header-rows: 1

   * - 阶段
     - ready
     - indegree
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

若先弹出 2，则得到 ``[0,2,1,3]``，仍然合法；队列选择顺序只影响一个可行答案，不改变拓扑
约束本身。环 ``0->1->2->0`` 初始化时没有零入度课程，``order`` 为空，最后必须丢弃它。

DFS 逆后序作为替代法
~~~~~~~~~~~~~~~~~~~~~~

``orderByDfs`` 使用三种状态：0 未访问，1 在当前递归路径中，2 已完成。沿边访问时遇到状态 1，
说明回到了当前路径祖先，存在环；一个节点所有后继都完成后再把它加入 ``order``，得到的是
逆后序，最后整体反转即为拓扑序。

DFS 适合展示“回边就是环”的结构，但递归栈最坏达到课程数；主入口选择 Kahn，让输出顺序在出队
时直接形成，也避免深递归。两种方法都必须遍历所有课程，不能只从课程 0 开始，因为图可能有
多个分量或孤立课程。

代码分析
~~~~~~~~

建图时 ``prerequisite[1]`` 是边起点，``prerequisite[0]`` 是终点；入度增加在终点。Kahn
每弹出一门课程就把它追加到结果，不需要额外排序；后继入度只在对应边被删除时递减。

最后用 ``order.size()`` 与 ``numCourses`` 比较，而不是只返回当前前缀。数量不足代表有环，
代码返回空数组，避免把部分合法前缀误当成完整答案。DFS 版本则在发现回边时立即返回空，
无环完成后反转后序列表。

复杂度与边界
~~~~~~~~~~~~

设课程数为 ``V``、先修关系数为 ``E``。两种方法都建立并遍历每个顶点和每条边一次，时间复杂度
``O(V + E)``；邻接表、入度或访问状态、队列/递归栈的工作空间为 ``O(V + E)``。返回数组本身
还承载 ``O(V)`` 个课程编号，不能计入常量空间。

没有先修关系时所有课程初始入队，返回包含全部编号的任意顺序；孤立课程与其他分量独立推进。
单门课程直接返回 ``[0]``；自环虽被题目排除，若出现也会使该课程入度不为 0，最终返回空数组。
