1855. Maximum Distance Between a Pair of Values
===============================================

题目信息
--------

:题号: 1855
:难度: Medium
:主题: 双指针、二分查找
:原题: `LeetCode 1855 <https://leetcode.com/problems/maximum-distance-between-a-pair-of-values/>`_
:重点: 两个数组均非递增，寻找 ``i <= j`` 且 ``nums1[i] <= nums2[j]`` 的最大 ``j - i``

题目重述
--------

在两个非递增数组中选择下标 ``i``、``j``，满足 ``i <= j`` 且第一个数组的值不大于第二个数组的值。返回最大下标距离。

自建示例
--------

.. code-block:: text

   输入：nums1 = [5,3,2], nums2 = [6,4,3,1]
   输出：1
   解释：取 i = 1、j = 2，3 <= 3，距离为 1。

.. code-block:: text

   输入：nums1 = [1], nums2 = [1]
   输出：0
   解释：唯一合法下标对是 (0,0)。
