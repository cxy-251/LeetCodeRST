1862. Sum of Floored Pairs
==========================

题目信息
--------

:题号: 1862
:难度: Hard
:主题: 计数、前缀和、数论
:原题: `LeetCode 1862 <https://leetcode.com/problems/sum-of-floored-pairs/>`_
:重点: 对所有有序元素对求整数除法向下取整之和

题目重述
--------

对数组中的每个有序下标对 ``(i,j)``，计算 ``floor(nums[i] / nums[j])``。返回全部结果之和并取模。

自建示例
--------

.. code-block:: text

   输入：nums = [2,5]
   输出：4
   解释：四个有序对的结果为 1、0、2、1。

.. code-block:: text

   输入：nums = [3]
   输出：1
   解释：唯一有序对计算 3 / 3。
