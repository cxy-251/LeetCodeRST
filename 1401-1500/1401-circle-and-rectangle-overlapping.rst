1401. Circle and Rectangle Overlapping
======================================

题目信息
--------

:题号: 1401
:难度: Medium
:主题: 平面几何、距离、相交判断
:原题: `LeetCode 1401 <https://leetcode.com/problems/circle-and-rectangle-overlapping/>`_
:重点: 判断圆与轴对齐矩形是否至少共享一个点；边界相切也视为重叠

题目重述
--------

给定圆的半径 ``radius``、圆心 ``(xCenter, yCenter)``，以及轴对齐矩形左下角 ``(x1, y1)`` 和右上角 ``(x2, y2)``。

若圆与矩形内部或边界至少存在一个公共点，返回 ``true``；完全分离时返回 ``false``。

``1 <= radius <= 2000``，所有坐标位于 ``[-10^4, 10^4]``，并满足 ``x1 < x2``、``y1 < y2``。

自建示例
--------

圆与矩形边界相切也算重叠：

.. code-block:: text

   输入：radius = 1, xCenter = 0, yCenter = 0, x1 = 1, y1 = 0, x2 = 2, y2 = 1
   输出：true
   解释：点 (1,0) 同时位于圆和矩形边界上。

最近角点仍在圆外时完全分离：

.. code-block:: text

   输入：radius = 1, xCenter = 0, yCenter = 0, x1 = 2, y1 = 2, x2 = 3, y2 = 3
   输出：false
   解释：矩形距离圆心最近的点是 (2,2)，其距离大于半径。