1642. Furthest Building You Can Reach
=====================================

题目信息
--------

:题号: 1642
:难度: Medium
:主题: 贪心、优先队列
:原题: `LeetCode 1642 <https://leetcode.com/problems/furthest-building-you-can-reach/>`_
:重点: 向上高度差需消耗砖块或一架梯子，向下或相等无需资源

题目重述
--------

从建筑 ``0`` 依次向右移动。遇到上升可使用等量砖块或一架梯子。返回在资源最优分配下能够到达的最远建筑下标。

自建示例
--------

.. code-block:: text

   输入：heights = [4,2,7,6,9], bricks = 5, ladders = 1
   输出：4
   解释：梯子用于高度差 5，砖块用于高度差 3，可到达末尾。

.. code-block:: text

   输入：heights = [5,4,3], bricks = 0, ladders = 0
   输出：2
   解释：全程下降，不消耗资源。