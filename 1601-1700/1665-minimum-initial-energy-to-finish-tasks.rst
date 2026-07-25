1665. Minimum Initial Energy to Finish Tasks
===========================================

题目信息
--------

:题号: 1665
:难度: Hard
:主题: 贪心、排序
:原题: `LeetCode 1665 <https://leetcode.com/problems/minimum-initial-energy-to-finish-tasks/>`_
:重点: 开始任务前能量至少为最低要求，完成后消耗实际能量；任务顺序可重排

题目重述
--------

每个任务为 ``[actual, minimum]``。选择任意顺序完成全部任务，求能够完成所有任务所需的最小初始能量。

自建示例
--------

.. code-block:: text

   输入：tasks = [[1,2],[2,4]]
   输出：4
   解释：先完成第二个任务，剩余 2 点能量后可完成第一个任务。

.. code-block:: text

   输入：tasks = [[5,5]]
   输出：5
   解释：单个任务开始时至少需要 5 点能量。