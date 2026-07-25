1637. Widest Vertical Area Between Two Points Containing No Points
=================================================================

题目信息
--------

:题号: 1637
:难度: Medium
:主题: 几何、排序
:原题: `LeetCode 1637 <https://leetcode.com/problems/widest-vertical-area-between-two-points-containing-no-points/>`_
:重点: 只需排序横坐标，答案为相邻不同横坐标的最大差

题目重述
--------

给定平面点集。寻找两条竖直线之间不包含任何给定点的最宽区域，返回宽度；点的纵坐标不影响答案。

自建示例
--------

.. code-block:: text

   输入：points = [[1,5],[4,2],[7,9]]
   输出：3
   解释：相邻横坐标差均为 3。

.. code-block:: text

   输入：points = [[2,1],[2,8],[3,0]]
   输出：1
   解释：重复横坐标不增加宽度。