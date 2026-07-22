0220. Contains Duplicate III
============================

题目信息
--------

:题号: 0220
:难度: Hard
:主题: 数组、有序集合、桶、滑动窗口
:原题: `LeetCode 0220 <https://leetcode.com/problems/contains-duplicate-iii/>`_
:教学重点: 下标窗口、数值距离、溢出安全

题目重述
--------

给定整数数组 ``nums``、``indexDiff`` 与 ``valueDiff``，接口为 ``bool containsNearbyAlmostDuplicate(vector<int>& nums, int indexDiff, int valueDiff)``。判断是否存在不同下标 ``i``、``j``，同时满足 ``|i-j| <= indexDiff`` 与 ``|nums[i]-nums[j]| <= valueDiff``。元素覆盖 32 位整数范围，计算差值必须使用更宽类型；返回布尔值且不修改输入。

自建示例
--------

.. code-block:: text

   输入：nums = [10,3,8], indexDiff = 2, valueDiff = 2
   输出：true
   说明：10 与 8 的下标距离为 2，数值距离为 2。

   输入：nums = [1,20,40], indexDiff = 2, valueDiff = 5
   输出：false
