1031. Maximum Sum of Two Non-Overlapping Subarrays
==================================================

题目信息
--------

:题号: 1031
:难度: Medium
:主题: 数组、固定长度子数组、不重叠区间
:原题: `LeetCode 1031 <https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/>`_
:重点: 选择长度分别为 ``firstLen`` 和 ``secondLen`` 的两个连续子数组，二者不能共享下标，但前后顺序不限

题目重述
--------

给定非负整数数组 ``nums``，以及两个正整数 ``firstLen`` 和 ``secondLen``。需要从数组中选择两个连续子数组，其中一个长度恰好为 ``firstLen``，另一个长度恰好为 ``secondLen``。

两个子数组不能重叠，即不能包含相同的数组下标；长度为 ``firstLen`` 的区间可以位于另一区间之前或之后。请返回两个子数组元素和之和的最大值。

``2 <= nums.length <= 1000``，``0 <= nums[i] <= 1000``，``1 <= firstLen, secondLen`` 且二者之和不超过数组长度。

自建示例
--------

较短区间的前后顺序由最优结果决定：

.. code-block:: text

   输入：nums = [2,1,5,6,0,9,5], firstLen = 2, secondLen = 2
   输出：25
   解释：选择子数组 [5,6] 和 [9,5]，两段不重叠，元素和分别为 11 和 14，总和为 25。

两个区间必须覆盖整个数组：

.. code-block:: text

   输入：nums = [1,2,3], firstLen = 1, secondLen = 2
   输出：6
   解释：两段长度之和等于数组长度，任何合法方案都会使用全部三个元素，总和为 6。