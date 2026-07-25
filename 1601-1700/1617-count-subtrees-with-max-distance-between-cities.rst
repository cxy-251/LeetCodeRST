1617. Count Subtrees With Max Distance Between Cities
=====================================================

题目信息
--------

:题号: 1617
:难度: Hard
:主题: 树、子集枚举、直径
:原题: `LeetCode 1617 <https://leetcode.com/problems/count-subtrees-with-max-distance-between-cities/>`_
:重点: 统计由节点子集诱导且连通的子树，并按直径 ``1`` 到 ``n-1`` 分类

题目重述
--------

给定一棵 ``n`` 节点树。对每个包含至少两个节点且诱导子图连通的节点子集，计算任意两节点最短距离的最大值。返回数组 ``answer``，其中 ``answer[d-1]`` 是直径恰为 ``d`` 的子树数量。

自建示例
--------

.. code-block:: text

   输入：n = 3, edges = [[1,2],[2,3]]
   输出：[2,1]
   解释：两条单边子树直径为 1；包含三个节点的整棵树直径为 2。

.. code-block:: text

   输入：n = 2, edges = [[1,2]]
   输出：[1]
   解释：唯一含至少两个节点的连通子树就是整棵树。