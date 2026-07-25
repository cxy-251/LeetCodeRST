1936. Add Minimum Number of Rungs
================================

题目信息
--------

:题号: 1936
:难度: Medium
:主题: 贪心、数组
:原题: `LeetCode 1936 <https://leetcode.com/problems/add-minimum-number-of-rungs/>`_
:重点: 相邻可踩横档高度差不能超过 ``dist``

题目重述
--------

从高度 0 开始攀爬严格递增的横档。可以添加任意横档，使每次上升距离至多为 ``dist``。返回最少添加数量。

自建示例
--------

.. code-block:: text

   输入：rungs = [1,3,5], dist = 2
   输出：0
   解释：所有相邻高度差都不超过 2。

.. code-block:: text

   输入：rungs = [3], dist = 2
   输出：1
   解释：可在高度 1 或 2 添加一根横档。
