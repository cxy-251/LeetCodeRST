1253. Reconstruct a 2-Row Binary Matrix
=======================================

题目信息
--------

:题号: 1253
:难度: Medium
:主题: 二进制矩阵、贪心、行列和
:原题: `LeetCode 1253 <https://leetcode.com/problems/reconstruct-a-2-row-binary-matrix/>`_
:重点: 构造两行二进制矩阵，使两行元素和分别为 ``upper``、``lower``，每列元素和等于 ``colsum[i]``；无解返回空数组

题目重述
--------

给定非负整数 ``upper``、``lower`` 和数组 ``colsum``。需要构造一个 ``2 x n`` 的二进制矩阵，其中第一行元素和为 ``upper``，第二行元素和为 ``lower``，并且第 ``i`` 列两项之和恰好等于 ``colsum[i]``。

若存在多种构造，可返回任意一种；若无法满足全部行列和约束，返回空数组。

``1 <= colsum.length <= 10^5``，``0 <= upper, lower <= colsum.length``，``colsum[i]`` 为 ``0``、``1`` 或 ``2``。

自建示例
--------

列和为一的位置可以分配给任意一行：

.. code-block:: text

   输入：upper = 2, lower = 1, colsum = [1,1,1]
   输出：[[1,1,0],[0,0,1]]
   解释：两行元素和分别为 2 和 1，每一列的元素和都为 1。

行和总量与列和总量不一致时无解：

.. code-block:: text

   输入：upper = 1, lower = 1, colsum = [2,1]
   输出：[]
   解释：两行要求的总和为 2，但所有列和之和为 3。