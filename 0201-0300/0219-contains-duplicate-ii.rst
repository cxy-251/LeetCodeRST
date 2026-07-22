0219. Contains Duplicate II
===========================

题目信息
--------

:题号: 0219
:难度: Easy
:主题: 数组、哈希表、滑动窗口
:原题: `LeetCode 0219 <https://leetcode.com/problems/contains-duplicate-ii/>`_
:教学重点: 最近下标、窗口成员关系、重复值距离

题目重述
--------

给定整数数组 ``nums`` 和非负整数 ``k``，LeetCode 接口为 ``bool containsNearbyDuplicate(vector<int>& nums, int k)``。判断是否存在不同下标 ``i``、``j``，使 ``nums[i] == nums[j]`` 且 ``|i-j| <= k``。数组长度最多约 ``10^5``，元素可为任意 32 位整数；只需返回布尔值，不修改输入。

自建示例
--------

.. code-block:: text

   输入：nums = [4,1,7,4], k = 3
   输出：true
   说明：两个 4 的下标距离为 3。

   输入：nums = [2,5,2], k = 1
   输出：false
   说明：重复值距离为 2，超过窗口。
