0153. Find Minimum in Rotated Sorted Array
==========================================

题目信息
--------

:题号: 0153
:难度: Medium
:主题: 数组、二分查找、旋转有序数组
:原题: `LeetCode 0153 <https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/>`_
:重点: 元素互不相同、旋转次数未知、最小值定位、对数时间

题目重述
--------

给定一个长度为 ``n``、元素互不相同且原本严格递增的整数数组。该数组在输入前可能整体旋转了 ``1..n`` 次；一次旋转会把末尾元素移动到数组开头。返回旋转后数组中的最小元素。

数组长度在 ``1..5000`` 范围内，每个元素在 ``-5000..5000`` 范围内。算法应在 ``O(log n)`` 时间内完成，因此不能依赖完整线性扫描。

自建示例
--------

.. code-block:: text

   输入：nums = [11,14,18,2,5,8]
   输出：2
   解释：原严格递增数组在 18 与 2 之间发生旋转，2 是右侧有序段的起点。

.. code-block:: text

   输入：nums = [-6,-1,3,9]
   输出：-6
   解释：数组旋转整整 n 次后与原数组相同，最小值仍位于首位。

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
~~~~~~~~~~~

每轮都保留至少一个最小值下标，并严格缩短闭区间。无重复条件消除了相等时的不确定性。

复杂度来源
~~~~~

二分每轮把区间缩短约一半，时间 ``O(log n)``、空间 ``O(1)``。