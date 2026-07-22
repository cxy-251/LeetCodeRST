0153. Find Minimum in Rotated Sorted Array
==========================================

题目信息
--------

:题号: 0153
:难度: Medium
:主题: 数组、二分查找、旋转有序数组
:原题: `LeetCode 0153 <https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/>`_
:教学重点: 与右端比较、最小值所在半区、无重复收缩

题目重述
--------

在无重复的旋转递增数组中找到最小值。

自建示例
--------

.. code-block:: text

   [4,5,6,7,0,1,2] -> 0
   [1,2,3] -> 1

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

       int binarySearch(const std::vector<int>& nums) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;
           while (left < right) {
               int middle = left + (right - left) / 2;
               if (nums[middle] > nums[right]) left = middle + 1;
               else right = middle;
           }
           return nums[left];
       }

   public:
       int findMin(std::vector<int>& nums) {
           return binarySearch(nums);
       }
   };

题解
----

为什么与右端比较
~~~~~~~~

右端位于旋转后的右侧有序段。若 ``nums[middle] > nums[right]``，最小值必在 ``middle`` 右边；否则 ``middle`` 可能就是最小值，不能丢弃。

区间为何最终收敛到最小值
~~~~~~~~~~~~

每轮都保留至少一个最小值下标，并严格缩短闭区间。无重复条件消除了相等时的不确定性。

复杂度来源
~~~~~

二分每轮把区间缩短约一半，时间 ``O(log n)``、空间 ``O(1)``。
