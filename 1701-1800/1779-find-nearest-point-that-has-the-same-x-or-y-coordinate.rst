1779. Find Nearest Point That Has the Same X or Y Coordinate
============================================================

题目信息
--------

:题号: 1779
:难度: Easy
:主题: 几何、曼哈顿距离
:原题: `LeetCode 1779 <https://leetcode.com/problems/find-nearest-point-that-has-the-same-x-or-y-coordinate/>`_
:重点: 有效点必须与目标共享横坐标或纵坐标，距离并列取最小下标

题目重述
--------

给定目标坐标和点数组。返回曼哈顿距离最近的有效点下标；不存在有效点时返回 ``-1``。

自建示例
--------

.. code-block:: text

   输入：x = 3, y = 4, points = [[1,2],[3,5],[3,3]]
   输出：1
   解释：后两个点距离均为 1，并列取较小下标 1。

.. code-block:: text

   输入：x = 0, y = 0, points = [[1,2]]
   输出：-1
   解释：该点既不共享横坐标也不共享纵坐标。