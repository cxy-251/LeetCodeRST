1334. Find the City With the Smallest Number of Neighbors at a Threshold Distance
=================================================================================

题目信息
--------

:题号: 1334
:难度: Medium
:主题: 图、最短路径、全源最短路
:原题: `LeetCode 1334 <https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/>`_
:重点: 统计最短路径距离不超过阈值的其他城市数量；数量并列时返回编号最大的城市

题目重述
--------

有 ``n`` 个城市和若干无向带权道路 ``[from,to,weight]``。两城市之间的距离定义为所有路径中的最小权重和。

对每个城市，统计与它最短距离不超过 ``distanceThreshold`` 的其他城市数量。返回数量最少的城市编号；若多个城市并列，返回编号最大的一个。

``2 <= n <= 100``，道路权重为正数，任意城市对至多一条直接道路。

自建示例
--------

端点城市可达邻居更少：

.. code-block:: text

   输入：n = 4, edges = [[0,1,2],[1,2,2],[2,3,2]], distanceThreshold = 2
   输出：3
   解释：城市 0 和 3 各只能到达一个邻居，并列时选择编号较大的 3。

所有城市可达数量相同时取最大编号：

.. code-block:: text

   输入：n = 3, edges = [[0,1,1],[1,2,1],[0,2,2]], distanceThreshold = 2
   输出：2
   解释：每个城市都能到达另外两个城市。