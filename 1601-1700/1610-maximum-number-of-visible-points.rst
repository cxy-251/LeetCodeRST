1610. Maximum Number of Visible Points
======================================

题目信息
--------

:题号: 1610
:难度: Hard
:主题: 几何、极角、滑动窗口
:原题: `LeetCode 1610 <https://leetcode.com/problems/maximum-number-of-visible-points/>`_
:重点: 观察方向可任意旋转；视野是给定角度的闭区间，同位置点始终可见

题目重述
--------

观察者位于 ``location``。选择任意朝向，在大小为 ``angle`` 度的视野内统计可见点；位于观察者位置的点无论朝向如何都可见。返回最大可见点数。

边界方向上的点计入视野。

自建示例
--------

.. code-block:: text

   输入：points = [[1,0],[0,1],[-1,0]], angle = 90, location = [0,0]
   输出：2
   解释：选择第一象限方向可同时看到 (1,0) 与 (0,1)。

.. code-block:: text

   输入：points = [[2,2],[2,2]], angle = 0, location = [2,2]
   输出：2
   解释：两个点与观察者重合，始终可见。