1953. Maximum Number of Weeks for Which You Can Work
===================================================

题目信息
--------

:题号: 1953
:难度: Medium
:主题: 贪心、数组
:原题: `LeetCode 1953 <https://leetcode.com/problems/maximum-number-of-weeks-for-which-you-can-work/>`_
:重点: 不能连续两周处理同一项目，最大项目需由其他项目间隔

题目重述
--------

每个项目有若干周工作量。每周完成一个里程碑，且相邻两周不能来自同一项目。返回最多能够连续工作的周数。

自建示例
--------

.. code-block:: text

   输入：milestones = [1,2,3]
   输出：6
   解释：最大项目的 3 周可以被其他项目的 3 周完全间隔。

.. code-block:: text

   输入：milestones = [5,1]
   输出：3
   解释：最多安排大项目、另一项目、大项目，之后无法继续避免相邻重复。
