1976. Number of Ways to Arrive at Destination
=============================================

题目信息
--------

:题号: 1976
:难度: Medium
:主题: 最短路、计数、图
:原题: `LeetCode 1976 <https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/>`_
:重点: 统计从节点 0 到节点 n-1 的最短时间路径数量

题目重述
--------

无向连通图的边带行驶时间。返回从节点 0 到最后节点、总时间等于最短时间的不同路径数量，结果取模。

自建示例
--------

.. code-block:: text

   输入：n = 3, roads = [[0,1,1],[1,2,1],[0,2,2]]
   输出：2
   解释：路径 0→2 与 0→1→2 的时间都为 2。

.. code-block:: text

   输入：n = 2, roads = [[0,1,5]]
   输出：1
   解释：只有一条可行路径。
