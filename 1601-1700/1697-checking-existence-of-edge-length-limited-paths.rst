1697. Checking Existence of Edge Length Limited Paths
=====================================================

题目信息
--------

:题号: 1697
:难度: Hard
:主题: 并查集、离线查询、排序
:原题: `LeetCode 1697 <https://leetcode.com/problems/checking-existence-of-edge-length-limited-paths/>`_
:重点: 查询路径上的每条边权都必须严格小于 ``limit``

题目重述
--------

给定带权无向图和若干查询 ``[p,q,limit]``。判断是否存在从 ``p`` 到 ``q`` 的路径，使路径上所有边权均严格小于 ``limit``，按查询顺序返回结果。

自建示例
--------

.. code-block:: text

   输入：n = 3, edgeList = [[0,1,2],[1,2,4]], queries = [[0,2,5],[0,2,4]]
   输出：[true,false]
   解释：第一项允许边权 2 和 4；第二项不允许权重恰为 4 的边。

.. code-block:: text

   输入：n = 2, edgeList = [], queries = [[0,1,10]]
   输出：[false]
   解释：两节点之间没有路径。