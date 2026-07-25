1727. Largest Submatrix With Rearrangements
===========================================

题目信息
--------

:题号: 1727
:难度: Medium
:主题: 矩阵、排序、柱状图
:原题: `LeetCode 1727 <https://leetcode.com/problems/largest-submatrix-with-rearrangements/>`_
:重点: 可任意重排矩阵列一次，求重排后全一子矩阵最大面积

题目重述
--------

给定二进制矩阵。允许按任意顺序重新排列整列，返回能够形成的全 ``1`` 子矩阵最大面积。

自建示例
--------

.. code-block:: text

   输入：matrix = [[1,0,1],[1,1,1]]
   输出：4
   解释：把两列连续高度为 2 的列放在一起，可形成 2×2 全一矩形。

.. code-block:: text

   输入：matrix = [[0,0]]
   输出：0
   解释：没有值为 1 的格子。