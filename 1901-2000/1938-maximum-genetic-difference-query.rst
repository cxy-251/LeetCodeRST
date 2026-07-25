1938. Maximum Genetic Difference Query
======================================

题目信息
--------

:题号: 1938
:难度: Hard
:主题: 树、位字典树、离线查询
:原题: `LeetCode 1938 <https://leetcode.com/problems/maximum-genetic-difference-query/>`_
:重点: 查询节点与其任意祖先编号异或的最大值

题目重述
--------

``parents`` 描述一棵根树，节点的遗传值等于节点编号。每个查询给出节点和整数 ``val``，返回 ``val`` 与该节点自身或任意祖先编号异或后的最大值。

自建示例
--------

.. code-block:: text

   输入：parents = [-1,0,1], queries = [[2,3],[1,4]]
   输出：[3,5]
   解释：节点 2 的祖先编号为 2、1、0，最大异或为 3；节点 1 的最大异或为 1 XOR 4 = 5。

.. code-block:: text

   输入：parents = [-1], queries = [[0,7]]
   输出：[7]
   解释：唯一可选节点编号为 0。
