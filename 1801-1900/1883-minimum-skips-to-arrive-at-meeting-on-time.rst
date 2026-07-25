1883. Minimum Skips to Arrive at Meeting On Time
================================================

题目信息
--------

:题号: 1883
:难度: Hard
:主题: 动态规划、数组
:原题: `LeetCode 1883 <https://leetcode.com/problems/minimum-skips-to-arrive-at-meeting-on-time/>`_
:重点: 路段之间通常要等到整数小时，可跳过部分等待

题目重述
--------

以固定速度经过所有路段。除最后一段外，到达后通常需等待到下一个整数小时；可以跳过若干次等待。返回在 ``hoursBefore`` 内到达所需的最少跳过次数，不可能时返回 -1。

自建示例
--------

.. code-block:: text

   输入：dist = [1,3,2], speed = 2, hoursBefore = 3
   输出：1
   解释：跳过第一段后的等待，总时间可压缩到 3 小时。

.. code-block:: text

   输入：dist = [5], speed = 2, hoursBefore = 2
   输出：-1
   解释：唯一一段本身就需要 2.5 小时，没有等待可跳过。
