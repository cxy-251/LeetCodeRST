1822. Sign of the Product of an Array
=====================================

题目信息
--------

:题号: 1822
:难度: Easy
:主题: 数组、数学
:原题: `LeetCode 1822 <https://leetcode.com/problems/sign-of-the-product-of-an-array/>`_
:重点: 无需计算乘积，只需判断零元素和负数个数奇偶性

题目重述
--------

返回数组所有元素乘积的符号：正数返回 1，负数返回 -1，乘积为零返回 0。

自建示例
--------

.. code-block:: text

   输入：nums = [-1,-2,3]
   输出：1
   解释：负数个数为偶数且没有零，乘积为正。

.. code-block:: text

   输入：nums = [1,0,-3]
   输出：0
   解释：包含零，乘积为零。
