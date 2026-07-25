1627. Graph Connectivity With Threshold
=======================================

题目信息
--------

:题号: 1627
:难度: Hard
:主题: 并查集、数论、倍数
:原题: `LeetCode 1627 <https://leetcode.com/problems/graph-connectivity-with-threshold/>`_
:重点: 两节点存在大于阈值的公共因子时直接相连，查询考虑传递连通性

题目重述
--------

节点编号为 ``1`` 到 ``n``。若两个节点存在严格大于 ``threshold`` 的公共因子，则它们之间有边。对每个查询判断两节点是否位于同一连通分量。

自建示例
--------

.. code-block:: text

   输入：n = 6, threshold = 2, queries = [[3,6],[4,5]]
   输出：[true,false]
   解释：3 与 6 共享因子 3；4 与 5 无法通过合法边连通。

.. code-block:: text

   输入：n = 3, threshold = 0, queries = [[1,3]]
   输出：[true]
   解释：所有节点都与因子 1 相关，因此整张图连通。