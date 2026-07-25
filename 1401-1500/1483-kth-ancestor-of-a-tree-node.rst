1483. Kth Ancestor of a Tree Node
=================================

题目信息
--------

:题号: 1483
:难度: Hard
:主题: 树、倍增、设计题
:原题: `LeetCode 1483 <https://leetcode.com/problems/kth-ancestor-of-a-tree-node/>`_
:重点: 根节点编号为 ``0`` 且父节点为 ``-1``；多次查询节点向上第 ``k`` 个祖先，不存在返回 ``-1``

题目重述
--------

给定包含 ``n`` 个节点的有根树，节点编号为 ``0`` 到 ``n-1``，``parent[i]`` 表示节点 ``i`` 的直接父节点，根节点 ``0`` 的父节点为 ``-1``。

实现 ``TreeAncestor`` 类。``getKthAncestor(node,k)`` 返回从 ``node`` 向上经过 ``k`` 条父边到达的节点；若树高不足，返回 ``-1``。各次查询共享同一棵树。

``1 <= n <= 5 * 10^4``，查询次数不超过 ``5 * 10^4``，``1 <= k <= n``。

自建示例
--------

祖先可以跨越多层父子关系：

.. code-block:: text

   输入：
   ["TreeAncestor","getKthAncestor","getKthAncestor"]
   [[4,[-1,0,0,1]],[3,2],[2,2]]
   输出：[null,0,-1]
   解释：节点 3 的父节点是 1，第二级祖先是 0；节点 2 只有一级祖先。

查询根节点的任意正级祖先都不存在：

.. code-block:: text

   输入：
   ["TreeAncestor","getKthAncestor"]
   [[1,[-1]],[0,1]]
   输出：[null,-1]
   解释：根节点没有父节点。