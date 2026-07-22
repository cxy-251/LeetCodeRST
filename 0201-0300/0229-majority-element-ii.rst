0229. Majority Element II
=========================

题目信息
--------

:题号: 0229
:难度: Medium
:主题: 数组、计数、Boyer-Moore 投票
:原题: `LeetCode 0229 <https://leetcode.com/problems/majority-element-ii/>`_
:教学重点: 至多两个候选、抵消、二次验证

题目重述
--------

给定整数数组 ``nums``，接口为 ``vector<int> majorityElement(vector<int>& nums)``。返回所有出现次数严格大于 ``floor(n/3)`` 的元素。数组长度最多约 ``5 * 10^4``；答案至多两个，元素顺序不作强制要求，但不能重复，输入无需修改。

自建示例
--------

.. code-block:: text

   输入：[1,2,1,3,1,2,2]
   输出：[1,2]
   说明：1 和 2 都出现 3 次，大于 floor(7/3)。
