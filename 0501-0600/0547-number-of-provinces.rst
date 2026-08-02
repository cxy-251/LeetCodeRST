0547. Number of Provinces
=========================

题目信息
--------

:题号: 0547
:难度: Medium
:主题: 无向图、邻接矩阵、传递连接、连通分量
:原题: `LeetCode 0547 <https://leetcode.com/problems/number-of-provinces/>`_
:重点: 城市通过直接或间接关系属于同一省份、矩阵对称且对角线为 1、返回连通分量数量

题目重述
--------

有 ``n`` 个城市，方阵 ``isConnected`` 描述它们的直接连接关系。若 ``isConnected[i][j] = 1``，城市 ``i`` 与城市 ``j`` 直接相连；连接关系是无向的，并且每个城市与自身相连。

若两个城市可以通过一条由若干直接连接组成的路径互相到达，则它们属于同一个省份。返回所有城市形成的省份数量，也就是该无向图的连通分量数。

自建示例
--------

形成两个独立省份：

.. code-block:: text

   输入：isConnected = [[1,1,0,0],[1,1,0,0],[0,0,1,1],[0,0,1,1]]
   输出：2
   解释：城市 0、1 相互连接，城市 2、3 相互连接，两组之间没有路径。

所有城市彼此孤立：

.. code-block:: text

   输入：isConnected = [[1,0,0],[0,1,0],[0,0,1]]
   输出：3
   解释：除自身之外没有任何直接或间接连接，因此每个城市单独构成一个省份。

从未访问城市开始 DFS
--------------------

每次找到一个未访问城市，就把它作为新省份的起点，并沿邻接矩阵访问所有直接或间接可达城市。一次 DFS 完成一个连通分量，随后继续寻找下一个未访问城市。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       void visit(const std::vector<std::vector<int>>& graph,
                  std::vector<bool>& visited, int city) {
           visited[city] = true;
           for (int next = 0; next < static_cast<int>(graph.size()); ++next) {
               if (graph[city][next] == 1 && !visited[next]) {
                   visit(graph, visited, next);
               }
           }
       }

   public:
       int findCircleNum(std::vector<std::vector<int>>& isConnected) {
           int n = static_cast<int>(isConnected.size());
           std::vector<bool> visited(n, false);
           int provinces = 0;
           for (int city = 0; city < n; ++city) {
               if (visited[city]) continue;
               ++provinces;
               visit(isConnected, visited, city);
           }
           return provinces;
       }
   };

代码分析
--------

访问标记保证每座城市只被归入一个连通分量；无向矩阵中的路径可通过递归传递，因此一次 DFS 恰好覆盖一个省份。遍历矩阵时间复杂度为 ``O(n^2)``，访问标记和递归栈空间为 ``O(n)``。
