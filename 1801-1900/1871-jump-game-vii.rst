1871. Jump Game VII
===================

题目信息
--------

:题号: 1871
:难度: Medium
:主题: 动态规划、滑动窗口
:原题: `LeetCode 1871 <https://leetcode.com/problems/jump-game-vii/>`_
:重点: 只能落在字符 0 上，每次跳跃距离位于闭区间内

题目重述
--------

从字符串下标 0 出发，每次向右跳 ``minJump`` 到 ``maxJump`` 个位置，并且只能落在字符 ``0`` 上。判断能否到达最后一个下标。

自建示例
--------

.. code-block:: text

   输入：s = "0000", minJump = 1, maxJump = 2
   输出：true
   解释：可以依次跳到下标 1 和 3。

.. code-block:: text

   输入：s = "0110", minJump = 2, maxJump = 2
   输出：false
   解释：第一跳只能落到字符 1 的下标 2。
