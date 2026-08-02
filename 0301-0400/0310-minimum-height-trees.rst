0310. Minimum Height Trees
==========================

题目信息
--------

:题号: 0310
:难度: Medium
:主题: 无向树、根节点选择、树高、结果集合
:原题: `LeetCode 0310 <https://leetcode.com/problems/minimum-height-trees/>`_
:重点: 输入保证是一棵树、树高取根到最远叶节点的边数、返回全部最优根且顺序不限

题目重述
--------

有一棵包含 ``n`` 个节点的无向树，节点编号为 ``0`` 到 ``n-1``，边数组 ``edges`` 中每个 ``[a, b]`` 表示两个节点之间存在一条无向边。把任意节点选作根后，树的高度是根节点到最远叶节点路径上的边数。

返回所有能够使树高达到最小值的根节点编号，结果顺序不限。``n`` 位于 ``[1, 2 * 10^4]``；当 ``n > 1`` 时恰有 ``n-1`` 条边，端点合法、两端不同，输入没有重复边，并保证整体连通且无环。当 ``n == 1`` 时，边数组为空，唯一节点 ``0`` 就是答案。

自建示例
--------

树有两个同样优的中心：

.. code-block:: text

   输入：n = 6，edges = [[0,1], [1,2], [2,3], [3,4], [4,5]]
   输出：[2,3]
   解释：以节点 2 或 3 为根时，最远节点距离都是 3；选择更靠近任一端点的节点都会得到更大的树高，输出顺序可以交换。

只有一个节点：

.. code-block:: text

   输入：n = 1，edges = []
   输出：[0]
   解释：不存在边，节点 0 作为根时树高为 0，也是唯一选择。

从叶子向树心剥离
------------------

树的最小高度根只能位于树的直径中心：若根偏离中心，直径的一端会比另一端更远；向中心移动一层可以缩短较长的一侧而不会增加最远距离。因此答案最多有两个相邻节点，分别对应直径长度为偶数或奇数的情形。

可以反向寻找这些中心。第一层叶子是当前度数为 1 的节点；无论把根放在哪里，这些叶子都属于最外层。删去整层叶子后，剩余树的中心不变，继续删去新产生的叶子。每次必须整层删除，不能只删除队列中的一个，否则会破坏“按距离同步向内收缩”的含义。当剩余节点不超过两个时，它们就是全部最优根。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> findMinHeightTrees(
           int n, std::vector<std::vector<int>>& edges) {
           if (n == 1) return {0};

           std::vector<std::vector<int>> graph(n);
           std::vector<int> degree(n, 0);
           for (const auto& edge : edges) {
               graph[edge[0]].push_back(edge[1]);
               graph[edge[1]].push_back(edge[0]);
               ++degree[edge[0]];
               ++degree[edge[1]];
           }

           std::queue<int> leaves;
           for (int node = 0; node < n; ++node) {
               if (degree[node] == 1) leaves.push(node);
           }

           int remaining = n;
           while (remaining > 2) {
               int layerSize = static_cast<int>(leaves.size());
               remaining -= layerSize;
               for (int i = 0; i < layerSize; ++i) {
                   int leaf = leaves.front();
                   leaves.pop();
                   for (int neighbor : graph[leaf]) {
                       if (--degree[neighbor] == 1) {
                           leaves.push(neighbor);
                       }
                   }
               }
           }

           std::vector<int> result;
           while (!leaves.empty()) {
               result.push_back(leaves.front());
               leaves.pop();
           }
           return result;
       }
   };

代码分析
--------

度数数组记录删除叶子后邻居还剩多少条边；某个邻居度数降为 1 时，它恰好成为下一层叶子。树保证连通，所以队列在最后会保留一个或两个中心，``n == 1`` 单独返回是因为单节点没有度数为 1 的叶子。每条边只被处理有限次，时间复杂度为 ``O(n + |edges|)``，额外空间为 ``O(n + |edges|)``。
