1725. Number Of Rectangles That Can Form The Largest Square
===========================================================

题目信息
--------

:题号: 1725
:难度: Easy
:主题: 数组、计数
:原题: `LeetCode 1725 <https://leetcode.com/problems/number-of-rectangles-that-can-form-the-largest-square/>`_
:重点: 每个矩形能裁出的最大正方形边长为两边较小值

题目重述
--------

给定矩形边长数组。求所有矩形可裁出的最大正方形边长，并返回能裁出该最大边长正方形的矩形数量。

自建示例
--------

.. code-block:: text

   输入：rectangles = [[5,8],[3,9],[5,12],[16,5]]
   输出：3
   解释：可裁边长分别为 5、3、5、5，最大值 5 出现三次。

.. code-block:: text

   输入：rectangles = [[2,2]]
   输出：1
   解释：唯一矩形形成边长 2 的正方形。