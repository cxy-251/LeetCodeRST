1909. Remove One Element to Make the Array Strictly Increasing
==============================================================

题目信息
--------

:题号: 1909
:难度: Easy
:主题: 数组、枚举
:原题: `LeetCode 1909 <https://leetcode.com/problems/remove-one-element-to-make-the-array-strictly-increasing/>`_
:重点: 最多删除恰好一个元素后检查严格递增

题目重述
--------

判断能否删除数组中的一个元素，使剩余元素按原顺序构成严格递增数组。

自建示例
--------

.. code-block:: text

   输入：nums = [1,2,10,5,7]
   输出：true
   解释：删除 10 后得到 [1,2,5,7]。

.. code-block:: text

   输入：nums = [2,1,1]
   输出：false
   解释：删除任意一个元素后仍存在不严格递增的位置。
