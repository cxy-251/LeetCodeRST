1036. Escape a Large Maze
=========================

题目信息
--------

:题号: 1036
:难度: Hard
:主题: 超大网格、阻塞格、四向可达性
:原题: `LeetCode 1036 <https://leetcode.com/problems/escape-a-large-maze/>`_
:重点: 网格大小为一百万乘一百万，但阻塞格至多 200 个；只能在边界内四向移动，需判断 source 与 target 是否连通

题目重述
--------

在坐标范围 ``0 <= x, y < 10^6`` 的方形网格中，数组 ``blocked`` 给出不能进入的格子。给定两个不同且未被阻塞的坐标 ``source`` 和 ``target``。

每一步可以从当前格移动到上下左右相邻且仍位于网格内、未被阻塞的格子。允许经过任意数量的空格，请判断是否存在从 ``source`` 到 ``target`` 的路径。

``0 <= blocked.length <= 200``，所有坐标互不重复且位于网格范围内；``source`` 和 ``target`` 不在阻塞集合中。

自建示例
--------

四个阻塞格可以完全围住起点：

.. code-block:: text

   输入：blocked = [[0,1],[1,0],[1,2],[2,1]], source = [1,1], target = [3,3]
   输出：false
   解释：source 的四个相邻格全部被阻塞，无法执行第一步，因此不能到达 target。

没有任何阻塞格：

.. code-block:: text

   输入：blocked = [], source = [0,0], target = [999999,999999]
   输出：true
   解释：网格中没有禁止进入的位置，可以沿行列方向逐步到达目标。