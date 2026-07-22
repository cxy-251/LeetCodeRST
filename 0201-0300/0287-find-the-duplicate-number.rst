0287. Find the Duplicate Number
===============================

题目信息
--------

:题号: 0287
:难度: Medium
:主题: 数组、双指针、二分查找、位运算
:原题: `LeetCode 0287 <https://leetcode.com/problems/find-the-duplicate-number/>`_
:教学重点: 值到下标映射、Floyd 判环、只读与常数空间

题目重述
--------

给定长度为 ``n+1`` 的整数数组 ``nums``，每个元素位于 ``[1,n]``，且只有一个数重复出现一次或多次，接口为 ``int findDuplicate(vector<int>& nums)``。返回该重复值。要求不修改数组且只用常数额外空间，``n`` 最多约 ``10^5``；答案唯一。

自建示例
--------

.. code-block:: text

   输入：[2,5,1,4,3,5]
   输出：5
