1851. Minimum Interval to Include Each Query
===========================================

题目信息
--------

:题号: 1851
:难度: Hard
:主题: 离线查询、堆、排序
:原题: `LeetCode 1851 <https://leetcode.com/problems/minimum-interval-to-include-each-query/>`_
:重点: 对每个查询返回包含它的最短闭区间长度

题目重述
--------

给定若干闭区间和查询值。对每个查询返回包含该值的区间中最短区间的长度；不存在时返回 -1。

自建示例
--------

.. code-block:: text

   输入：intervals = [[1,4],[2,2],[5,7]], queries = [2,6,8]
   输出：[1,3,-1]
   解释：2 被长度 1 的 [2,2] 覆盖，6 被长度 3 的 [5,7] 覆盖，8 不在任何区间中。

.. code-block:: text

   输入：intervals = [[0,0]], queries = [0]
   输出：[1]
   解释：单点闭区间长度为 1。
