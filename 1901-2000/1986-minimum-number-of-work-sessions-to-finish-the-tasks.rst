1986. Minimum Number of Work Sessions to Finish the Tasks
========================================================

题目信息
--------

:题号: 1986
:难度: Medium
:主题: 状态压缩、动态规划、回溯
:原题: `LeetCode 1986 <https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/>`_
:重点: 每个任务不可拆分，每个工作时段总时长不超过 ``sessionTime``

题目重述
--------

把所有任务分配到若干工作时段，每个任务完整放入一个时段，每个时段任务时长总和不超过 ``sessionTime``。返回最少时段数。

自建示例
--------

.. code-block:: text

   输入：tasks = [1,2,3], sessionTime = 3
   输出：2
   解释：可安排 [1,2] 和 [3] 两个时段。

.. code-block:: text

   输入：tasks = [2,2], sessionTime = 3
   输出：2
   解释：两个任务不能放入同一时段。
