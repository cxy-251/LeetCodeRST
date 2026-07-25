1775. Equal Sum Arrays With Minimum Number of Operations
=======================================================

题目信息
--------

:题号: 1775
:难度: Medium
:主题: 贪心、排序、计数
:原题: `LeetCode 1775 <https://leetcode.com/problems/equal-sum-arrays-with-minimum-number-of-operations/>`_
:重点: 每次把任一元素改为 ``1..6``，最少操作使两数组元素和相等

题目重述
--------

给定两个元素范围为 ``1`` 到 ``6`` 的数组。返回使两数组总和相等的最少修改次数；不可能时返回 ``-1``。

自建示例
--------

.. code-block:: text

   输入：nums1 = [1,1,1], nums2 = [6]
   输出：1
   解释：把一个 1 改为 4，或把 6 改为 3，即可使两边和为 6 或 3。

.. code-block:: text

   输入：nums1 = [1,2,3], nums2 = [6]
   输出：0
   解释：两数组总和已经相等。