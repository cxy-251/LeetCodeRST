0162. Find Peak Element
=======================

题目信息
--------

:题号: 0162
:难度: Medium
:主题: 数组、二分查找、局部单调性
:原题: `LeetCode 0162 <https://leetcode.com/problems/find-peak-element/>`_
:重点: 相邻元素不等、边界视为负无穷、任意峰值下标、对数时间

题目重述
--------

给定整数数组 ``nums``，其中任意两个相邻元素都不相等。若某元素严格大于它左右相邻的元素，则该位置是峰值；数组下标范围外的值统一视为负无穷，因此首元素或尾元素也可能成为峰值。

返回任意一个峰值元素的下标。数组可能含有多个合法峰值，返回其中任意一个即可。``nums`` 的长度在 ``1..1000`` 范围内，元素均在 32 位有符号整数范围内；算法必须在 ``O(log n)`` 时间内完成。

自建示例
--------

.. code-block:: text

   输入：nums = [2,7,4,9,3]
   输出：1 或 3
   解释：nums[1] = 7 和 nums[3] = 9 都严格大于各自左右相邻元素，返回任一峰值下标都合法。

.. code-block:: text

   输入：nums = [8,5,2]
   输出：0
   解释：首元素 8 大于右邻元素 5，而左侧边界视为负无穷，因此下标 0 是峰值。

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