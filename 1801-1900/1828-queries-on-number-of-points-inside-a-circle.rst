1828. Queries on Number of Points Inside a Circle
=================================================

题目信息
--------

:题号: 1828
:难度: Medium
:主题: 几何、数组
:原题: `LeetCode 1828 <https://leetcode.com/problems/queries-on-number-of-points-inside-a-circle/>`_
:重点: 对每个圆统计位于圆内或圆周上的点

题目重述
--------

每个查询给出圆心和半径。返回每个圆覆盖的输入点数量，边界上的点也计入。

自建示例
--------

.. code-block:: text

   输入：points = [[1,1],[3,3],[5,1]], queries = [[2,2,2],[4,1,1]]
   输出：[2,1]
   解释：第一个圆覆盖前两个点，第二个圆只覆盖 [5,1]。

.. code-block:: text

   输入：points = [[0,0]], queries = [[3,3,2]]
   输出：[0]
   解释：唯一点到圆心的距离大于半径。
