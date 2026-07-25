1995. Count Special Quadruplets
==============================

题目信息
--------

:题号: 1995
:难度: Easy
:主题: 数组、枚举、哈希表
:原题: `LeetCode 1995 <https://leetcode.com/problems/count-special-quadruplets/>`_
:重点: 统计 ``a < b < c < d`` 且前三个元素和等于第四个元素

题目重述
--------

返回下标四元组 ``(a,b,c,d)`` 的数量，要求下标严格递增，并满足 ``nums[a] + nums[b] + nums[c] = nums[d]``。

自建示例
--------

.. code-block:: text

   输入：nums = [1,1,1,3]
   输出：1
   解释：唯一四元组的前三项和为 3。

.. code-block:: text

   输入：nums = [1,2,3,4]
   输出：0
   解释：前三个最小元素之和已经大于末尾元素 4。
