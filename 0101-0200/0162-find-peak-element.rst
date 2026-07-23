0162. Find Peak Element
=======================

题目信息
--------

:题号: 0162
:难度: Medium
:主题: 数组、二分查找、局部单调性
:原题: `LeetCode 0162 <https://leetcode.com/problems/find-peak-element/>`_
:重点: 比较相邻斜率、保留必含峰值半区、边界虚拟负无穷

题目重述
--------

给定整数数组 ``nums``，相邻元素互不相等。峰值元素严格大于它的相邻元素，数组边界之外视为负无穷。返回任意一个峰值的下标，并要求使用 ``O(log n)`` 时间完成查找。

自建示例
--------

.. code-block:: text

   nums = [1,2,3,1]
   输出：2，因为 nums[2] = 3 大于左右相邻元素。

   nums = [1,2,1,3,5,6,4]
   输出 1 或 5 都合法，对应峰值 2 或 6。

   nums = [1]
   输出：0，数组外两侧都视为负无穷。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int linear(const std::vector<int>& nums) {
           for (int i = 0; i + 1 < static_cast<int>(nums.size()); ++i)
               if (nums[i] > nums[i + 1]) return i;
           return static_cast<int>(nums.size()) - 1;
       }

       int slopeBinarySearch(const std::vector<int>& nums) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;
           while (left < right) {
               int middle = left + (right - left) / 2;
               if (nums[middle] < nums[middle + 1]) left = middle + 1;
               else right = middle;
           }
           return left;
       }

   public:
       int findPeakElement(std::vector<int>& nums) {
           return slopeBinarySearch(nums);
       }
   };

题解
----

相邻比较如何确定方向
~~~~~~~~~~~~~~~~~~~~

若 ``nums[middle] < nums[middle+1]``，向右处于上坡，右半区必有峰值；否则左半区连同 ``middle`` 必有峰值。

边界虚拟负无穷的作用
~~~~~~~~~~~~~~~~~~~~~~

题目把数组外视为负无穷，因此严格上升数组的末端和严格下降数组的首端都合法。

复杂度来源
~~~~~~~~~~

每轮保留必含峰值的一半区间，时间 ``O(log n)``、空间 ``O(1)``。
