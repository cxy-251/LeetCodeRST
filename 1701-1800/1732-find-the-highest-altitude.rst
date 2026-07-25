1732. Find the Highest Altitude
===============================

题目信息
--------

:题号: 1732
:难度: Easy
:主题: 前缀和
:原题: `LeetCode 1732 <https://leetcode.com/problems/find-the-highest-altitude/>`_
:重点: 骑手从海拔零开始，``gain[i]`` 是相邻点高度变化

题目重述
--------

根据高度增量数组计算所有经过点的海拔，返回包含起点在内的最高海拔。

自建示例
--------

.. code-block:: text

   输入：gain = [-5,1,5,0,-7]
   输出：1
   解释：海拔依次为 0、-5、-4、1、1、-6。

.. code-block:: text

   输入：gain = [-2,-1]
   输出：0
   解释：后续海拔均低于起点。