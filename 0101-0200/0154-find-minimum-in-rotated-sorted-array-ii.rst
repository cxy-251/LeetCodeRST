0154. Find Minimum in Rotated Sorted Array II
=============================================

题目信息
--------

:题号: 0154
:难度: Hard
:主题: 数组、二分查找、重复值
:原题: `LeetCode 0154 <https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/>`_
:重点: 非递减数组、重复元素、端点相等消歧、最坏线性退化

题目重述
--------

给定一个按非递减顺序排列且允许包含重复元素的整数数组。该数组在输入前可能整体旋转了 ``1..n`` 次，返回旋转后数组中的最小元素。

数组长度在 ``1..5000`` 范围内，每个元素在 ``-5000..5000`` 范围内。重复值可能使中间元素与端点相等，从而无法立即判断最小值位于哪一半；算法应尽量利用二分查找，但最坏情况下允许退化为线性时间。

自建示例
--------

.. code-block:: text

   输入：nums = [6,6,8,1,3,6]
   输出：1
   解释：数组在 8 与 1 之间旋转；重复的 6 不改变最小值位置。

.. code-block:: text

   输入：nums = [4,4,4,4]
   输出：4
   解释：所有元素相等，每个位置都可以视为最小值位置，返回其共同值 4。

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