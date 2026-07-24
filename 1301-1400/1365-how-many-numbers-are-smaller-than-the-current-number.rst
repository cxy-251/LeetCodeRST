1365. How Many Numbers Are Smaller Than the Current Number
==========================================================

题目信息
--------

:题号: 1365
:难度: Easy
:主题: 数组、计数、排序
:原题: `LeetCode 1365 <https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number/>`_
:重点: 对每个位置统计数组中严格小于当前值的其他元素数量；相等元素不计入

题目重述
--------

给定整数数组 ``nums``。对于每个下标 ``i``，统计满足 ``j != i`` 且 ``nums[j] < nums[i]`` 的下标数量。

按原下标顺序返回所有统计结果。

``2 <= nums.length <= 500``，``0 <= nums[i] <= 100``。

自建示例
--------

重复最大值获得相同计数：

.. code-block:: text

   输入：nums = [5,0,5,2]
   输出：[2,0,2,1]
   解释：每个 5 前有两个更小值 0、2；2 只有一个更小值 0。

所有元素相同时计数均为零：

.. code-block:: text

   输入：nums = [3,3,3]
   输出：[0,0,0]
   解释：不存在严格更小的元素。