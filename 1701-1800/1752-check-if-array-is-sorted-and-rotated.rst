1752. Check if Array Is Sorted and Rotated
==========================================

题目信息
--------

:题号: 1752
:难度: Easy
:主题: 数组、循环顺序
:原题: `LeetCode 1752 <https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/>`_
:重点: 判断数组是否由某个非递减数组旋转得到，允许重复值和旋转零位

题目重述
--------

给定数组 ``nums``。若存在一个非递减数组经过循环旋转后等于 ``nums``，返回 ``true``。

自建示例
--------

.. code-block:: text

   输入：nums = [3,4,5,1,2]
   输出：true
   解释：它由 [1,2,3,4,5] 旋转得到。

.. code-block:: text

   输入：nums = [2,1,3,4]
   输出：false
   解释：循环比较中存在两次下降。