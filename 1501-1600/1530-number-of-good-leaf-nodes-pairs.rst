1530. Number of Good Leaf Nodes Pairs
=====================================

题目信息
--------

:题号: 1530
:难度: Medium
:主题: 二叉树、深度优先搜索、距离计数
:原题: `LeetCode 1530 <https://leetcode.com/problems/number-of-good-leaf-nodes-pairs/>`_
:重点: 只统计不同叶节点之间的无向最短路径；路径边数不超过 ``distance`` 时构成好数对

题目重述
--------

给定二叉树根节点 ``root`` 和正整数 ``distance``。从树中选择两个不同叶节点，它们之间的距离定义为连接二者最短路径上的边数。

若距离不超过 ``distance``，则这对叶节点是好数对。请返回所有无序好数对的数量。

树中节点数不超过 ``1024``，``1 <= distance <= 10``。

自建示例
--------

跨越共同祖先的叶节点距离按边数计算：

.. code-block:: text

   输入：root = [1,2,3,null,4], distance = 3
   输出：1
   解释：叶节点 4 到叶节点 3 的路径包含三条边，因此构成一对。

只有一个叶节点时没有可配对对象：

.. code-block:: text

   输入：root = [7], distance = 2
   输出：0
   解释：树中不存在两个不同叶节点。