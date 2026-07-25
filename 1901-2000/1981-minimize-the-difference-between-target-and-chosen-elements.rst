1981. Minimize the Difference Between Target and Chosen Elements
===============================================================

题目信息
--------

:题号: 1981
:难度: Medium
:主题: 动态规划、矩阵
:原题: `LeetCode 1981 <https://leetcode.com/problems/minimize-the-difference-between-target-and-chosen-elements/>`_
:重点: 每行恰选一个元素，使总和与目标值的绝对差最小

题目重述
--------

从矩阵每一行选择一个元素，计算所选元素总和。返回该总和与 ``target`` 之间能够达到的最小绝对差。

自建示例
--------

.. code-block:: text

   输入：mat = [[1,2],[3,4]], target = 6
   输出：0
   解释：选择 2 和 4，总和恰好为 6。

.. code-block:: text

   输入：mat = [[1,2],[3,4]], target = 1
   输出：3
   解释：最小可选总和为 1 + 3 = 4，与目标差 3。
