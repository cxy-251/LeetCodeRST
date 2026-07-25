1791. Find Center of Star Graph
===============================

题目信息
--------

:题号: 1791
:难度: Easy
:主题: 图、度数
:原题: `LeetCode 1791 <https://leetcode.com/problems/find-center-of-star-graph/>`_
:重点: 星形图中心出现在每条边中，查看前两条边即可确定

题目重述
--------

给定一张保证为星形图的无向图边列表，返回唯一中心节点编号。

自建示例
--------

.. code-block:: text

   输入：edges = [[1,2],[2,3],[4,2]]
   输出：2
   解释：节点 2 与所有其他节点相连。

.. code-block:: text

   输入：edges = [[5,6],[6,7]]
   输出：6
   解释：两条边的公共端点为 6。