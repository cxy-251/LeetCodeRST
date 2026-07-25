1786. Number of Restricted Paths From First to Last Node
=======================================================

题目信息
--------

:题号: 1786
:难度: Medium
:主题: 最短路、动态规划、图
:原题: `LeetCode 1786 <https://leetcode.com/problems/number-of-restricted-paths-from-first-to-last-node/>`_
:重点: 路径上节点到终点 ``n`` 的最短距离必须严格递减

题目重述
--------

给定连通带权无向图。统计从节点 ``1`` 到节点 ``n`` 的受限路径数量：沿路径前进时，每个后继节点到 ``n`` 的最短距离都严格小于当前节点。结果取模。

自建示例
--------

.. code-block:: text

   输入：n = 3, edges = [[1,2,3],[2,3,1],[1,3,5]]
   输出：2
   解释：路径 1-3 与 1-2-3 的终点距离均严格递减。

.. code-block:: text

   输入：n = 2, edges = [[1,2,7]]
   输出：1
   解释：唯一边形成唯一受限路径。