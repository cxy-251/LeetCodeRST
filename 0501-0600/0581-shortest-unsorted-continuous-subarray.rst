0581. Shortest Unsorted Continuous Subarray
===========================================

题目信息
--------

:题号: 0581
:难度: Medium
:主题: 连续区间、局部排序、全局非递减、最短长度
:原题: `LeetCode 0581 <https://leetcode.com/problems/shortest-unsorted-continuous-subarray/>`_
:重点: 只能选择一个连续子数组排序、排序后整个数组必须非递减、返回最短区间长度、已有序时返回 0

题目重述
--------

给定整数数组 ``nums``，选择其中一个连续子数组，将该子数组按非递减顺序排序，而区间外元素保持原位置。寻找能够使整个数组最终变为非递减序列的最短连续子数组，并返回其长度。

若原数组已经按非递减顺序排列，不需要选择任何区间，返回 ``0``。区间必须包含所有会妨碍全局排序的元素，不能选择若干个分散区间。

自建示例
--------

无序区域会向两侧扩展：

.. code-block:: text

   输入：nums = [1,3,5,4,2,6,7]
   输出：4
   解释：排序下标 1..4 的 [3,5,4,2] 后，数组变为 [1,2,3,4,5,6,7]；更短区间无法把 2 放到 3 和 5 之前。

数组已经有序：

.. code-block:: text

   输入：nums = [1,2,2,4]
   输出：0
   解释：数组本身已经非递减。

从左右扫描确定需要扩展的边界
----------------------------

从左到右维护已见最大值：若当前值小于它，当前位置一定需要被纳入排序区间，并更新右边界。再从右到左维护已见最小值：若当前值大于它，当前位置一定需要被纳入，并更新左边界。两次扫描后，``[left,right]`` 正好覆盖所有破坏全局有序性的元素。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findUnsortedSubarray(std::vector<int>& nums) {
           int n = static_cast<int>(nums.size());
           int left = n;
           int right = -1;
           int maximum = INT_MIN;
           for (int i = 0; i < n; ++i) {
               maximum = std::max(maximum, nums[i]);
               if (nums[i] < maximum) right = i;
           }

           int minimum = INT_MAX;
           for (int i = n - 1; i >= 0; --i) {
               minimum = std::min(minimum, nums[i]);
               if (nums[i] > minimum) left = i;
           }
           return right == -1 ? 0 : right - left + 1;
       }
   };

代码分析
--------

左扫描发现的逆序值必须向右延伸到当前位置，右扫描发现的逆序值必须向左延伸；没有任何边界被触发时数组已经有序。两次线性扫描，时间复杂度为 ``O(n)``，额外空间复杂度为 ``O(1)``。
