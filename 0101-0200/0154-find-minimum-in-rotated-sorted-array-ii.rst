0154. Find Minimum in Rotated Sorted Array II
=============================================

题目信息
--------

:题号: 0154
:难度: Hard
:主题: 数组、二分查找、重复值
:原题: `LeetCode 0154 <https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/>`_
:教学重点: 端点相等消歧、安全收缩、最坏线性退化

题目重述
--------

在允许重复值的旋转递增数组中找到最小值。

自建示例
--------

.. code-block:: text

   [2,2,2,0,1] -> 0
   [1,1,1,1] -> 1

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int linear(const std::vector<int>& nums) {
           return *std::min_element(nums.begin(), nums.end());
       }

       int duplicateAwareBinarySearch(const std::vector<int>& nums) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;
           while (left < right) {
               int middle = left + (right - left) / 2;
               if (nums[middle] > nums[right]) {
                   left = middle + 1;
               } else if (nums[middle] < nums[right]) {
                   right = middle;
               } else {
                   --right;  // 相等时只能安全丢弃一个重复端点
               }
           }
           return nums[left];
       }

   public:
       int findMin(std::vector<int>& nums) {
           return duplicateAwareBinarySearch(nums);
       }
   };

题解
----

重复值带来的歧义
~~~~~~~~

当 ``nums[middle] == nums[right]`` 时，最小值可能在任一侧，无法判断有序半区。

为什么可以右端减一
~~~~~~~~~

右端值与中点值相同，丢弃右端不会丢失唯一更小值；若右端本身是最小值，中点仍保留了同值候选。

复杂度来源
~~~~~

通常接近 ``O(log n)``；全相等时每轮只能缩短一个位置，最坏 ``O(n)``。空间 ``O(1)``。
