0540. Single Element in a Sorted Array
======================================

题目信息
--------

:题号: 0540
:难度: Medium
:主题: 有序数组、唯一单次元素、成对元素、对数时间
:原题: `LeetCode 0540 <https://leetcode.com/problems/single-element-in-a-sorted-array/>`_
:重点: 恰有一个值出现一次、其他值都恰好出现两次、数组非递减、要求 O(log n) 时间和 O(1) 空间

题目重述
--------

给定一个按非递减顺序排列的整数数组 ``nums``。数组中恰好有一个元素只出现一次，其余每个元素都恰好出现两次。返回这个只出现一次的元素。

需要满足 ``O(log n)`` 时间复杂度和 ``O(1)`` 额外空间。重复元素的两份在排序后相邻，但唯一元素可能位于开头、中间或末尾。

自建示例
--------

唯一元素位于中间：

.. code-block:: text

   输入：nums = [1,1,2,3,3,4,4]
   输出：2
   解释：1、3、4 都出现两次，只有 2 出现一次。

唯一元素位于末尾：

.. code-block:: text

   输入：nums = [0,0,5]
   输出：5
   解释：前两个元素构成一对，末尾的 5 没有配对。

唯一元素改变了成对下标的奇偶性
------------------------------

在唯一元素左侧，成对元素的第一份位于偶数下标、第二份位于奇数下标；越过唯一元素后，这种配对对齐会整体错一位。取中点并把它调整为偶数下标后，若 ``nums[mid] == nums[mid+1]``，唯一元素在右侧，否则在左侧（含中点）。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int singleNonDuplicate(std::vector<int>& nums) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;
           while (left < right) {
               int middle = left + (right - left) / 2;
               if (middle % 2 == 1) --middle;
               if (nums[middle] == nums[middle + 1]) {
                   left = middle + 2;
               } else {
                   right = middle;
               }
           }
           return nums[left];
       }
   };

代码分析
--------

每次比较都根据配对是否完整排除一半区间，且把中点对齐到一对的起始下标，边界始终包含唯一元素。时间复杂度为 ``O(log n)``，额外空间复杂度为 ``O(1)``。
