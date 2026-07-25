1971. Find if Path Exists in Graph
=================================

题目信息
--------

:题号: 1971
:难度: Easy
:主题: 图、搜索、并查集
:原题: `LeetCode 1971 <https://leetcode.com/problems/find-if-path-exists-in-graph/>`_
:重点: 判断无向图中源点与终点是否连通

题目重述
--------

给定 ``n`` 个节点和无向边集合，判断是否存在从 ``source`` 到 ``destination`` 的路径。

自建示例
--------

.. code-block:: text

   输入：n = 3, edges = [[0,1],[1,2]], source = 0, destination = 2
   输出：true
   解释：路径为 0→1→2。

.. code-block:: text

   输入：n = 3, edges = [[0,1]], source = 0, destination = 2
   输出：false
   解释：节点 2 与其他节点不连通。
