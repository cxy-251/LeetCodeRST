1937. Maximum Number of Points with Cost
=======================================

题目信息
--------

:题号: 1937
:难度: Medium
:主题: 动态规划、矩阵
:原题: `LeetCode 1937 <https://leetcode.com/problems/maximum-number-of-points-with-cost/>`_
:重点: 每行选一个格子，相邻两行列位置变化产生绝对值代价

题目重述
--------

从矩阵每一行恰好选择一个格子，获得其分数；相邻行选择列 ``c1``、``c2`` 时扣除 ``|c1-c2|``。返回最大总分。

自建示例
--------

.. code-block:: text

   输入：points = [[1,2],[3,1]]
   输出：4
   解释：两行都选第 0 列得 1 + 3，或选第 1 列再移到第 0 列得 2 + 3 - 1。

.. code-block:: text

   输入：points = [[4,7,2]]
   输出：7
   解释：只有一行，选择最大元素即可。
