0462. Minimum Moves to Equal Array Elements II
===============================================

题目信息
--------

:题号: 0462
:难度: Medium
:主题: 整数数组、单元素加减一、共同目标值、最少移动
:原题: `LeetCode 0462 <https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/>`_
:重点: 每次只修改一个元素 1 个单位、最终目标整数可自由选择、返回总操作次数的最小值

题目重述
--------

给定整数数组 ``nums``。一次操作可以选择一个元素，将它增加 1 或减少 1。返回把所有数组元素变成同一个整数所需的最少操作次数。

``nums.length`` 位于 ``[1, 10^5]``，每个元素位于 ``[-10^9, 10^9]``，题目保证答案适合 32 位有符号整数。最终共同值不要求原先存在于数组中；每个元素移动的次数等于它与目标值之差的绝对值。

自建示例
--------

中间值作为共同目标：

.. code-block:: text

   输入：nums = [1, 4, 7]
   输出：6
   解释：把 1 增加到 4 需要 3 次，把 7 减少到 4 需要 3 次，总计 6 次；选择其他目标不会更少。

数组已经相等：

.. code-block:: text

   输入：nums = [5, 5]
   输出：0
   解释：所有元素已经相同，不需要任何操作。

绝对距离和在中位数处最小
------------------------

若把所有元素变成目标 ``t``，操作数为 ``sum |nums[i] - t|``。目标向右移动一个单位时，左侧元素的距离增加、右侧元素的距离减少；当左右元素数量平衡或从左侧转为右侧时，距离和达到最小，这正是排序数组的中位数位置。

排序后选取 ``nums[n/2]`` 作为目标即可。数组长度为偶数时，任意位于两个中间值之间的整数都能达到相同最小值，选右中位数不会影响答案。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int minMoves2(std::vector<int>& nums) {
           std::sort(nums.begin(), nums.end());
           long long median = nums[nums.size() / 2];
           long long moves = 0;
           for (int value : nums) {
               moves += std::llabs(static_cast<long long>(value) - median);
           }
           return static_cast<int>(moves);
       }
   };

代码分析
--------

中位数使绝对距离和的左右斜率分别为负和正，任何其他目标都不能更小；偶数长度时中间区间上的目标等价。排序耗时 ``O(n log n)``，求和耗时 ``O(n)``，额外空间复杂度为 ``O(1)``（不计排序实现的栈）。
