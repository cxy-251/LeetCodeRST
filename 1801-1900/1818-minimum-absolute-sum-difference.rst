1818. Minimum Absolute Sum Difference
=====================================

题目信息
--------

:题号: 1818
:难度: Medium
:主题: 数组、二分查找
:原题: `LeetCode 1818 <https://leetcode.com/problems/minimum-absolute-sum-difference/>`_
:重点: 最多将 ``nums1`` 的一个元素替换为 ``nums1`` 中已有值

题目重述
--------

计算两个等长数组对应元素绝对差之和。允许最多一次把 ``nums1`` 的某个元素替换为该数组中的任意已有元素，返回最小可能总差并取模。

自建示例
--------

.. code-block:: text

   输入：nums1 = [1,7,5], nums2 = [2,3,5]
   输出：3
   解释：将 7 替换为 5，总差变为 1 + 2 + 0。

.. code-block:: text

   输入：nums1 = [4,6], nums2 = [4,6]
   输出：0
   解释：两个数组已经完全相同。
