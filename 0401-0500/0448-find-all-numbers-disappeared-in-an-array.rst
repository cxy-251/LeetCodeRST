0448. Find All Numbers Disappeared in an Array
==============================================

题目信息
--------

:题号: 0448
:难度: Easy
:主题: 长度为 ``n`` 的数组、数值范围 ``1..n``、缺失整数、结果集合
:原题: `LeetCode 0448 <https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/>`_
:重点: 找出完整范围中未出现的值、重复元素不会重复占范围位置、结果顺序不限、允许修改输入

题目重述
--------

给定长度为 ``n`` 的整数数组 ``nums``，其中每个元素都位于 ``[1, n]``。返回范围 ``1..n`` 中所有没有在数组中出现的整数。

``n`` 位于 ``[1, 10^5]``。输入可能包含重复值，因此会有同样数量的范围值缺失。每个缺失整数在结果中只出现一次，结果顺序不限。题目要求使用 ``O(n)`` 时间，并且除返回数组外不使用额外空间；允许原地修改 ``nums``。

自建示例
--------

两个重复值对应两个缺失值：

.. code-block:: text

   输入：nums = [1, 1, 2, 4, 6, 6]
   输出：[3,5]
   解释：数组长度为 6，完整范围是 1..6；其中 3 和 5 从未出现。

所有范围值都出现：

.. code-block:: text

   输入：nums = [2, 1]
   输出：[]
   解释：范围 1..2 中的两个整数都至少出现一次，因此没有缺失值。

用出现值标记对应范围位置
------------------------

值 ``x`` 对应下标 ``x - 1``。第一次看到 ``x`` 时，将 ``nums[x - 1]`` 变为负数，表示范围值 ``x`` 出现过；完成标记后再次扫描，仍为正数的下标 ``i`` 就代表值 ``i + 1`` 从未出现。

读取输入值时先取绝对值，因为数组中的元素可能已经被前面的标记取反。重复值只会重复访问同一位置，不会影响“是否出现”的最终状态。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> findDisappearedNumbers(std::vector<int>& nums) {
           for (int value : nums) {
               int index = std::abs(value) - 1;
               if (nums[index] > 0) nums[index] = -nums[index];
           }

           std::vector<int> result;
           for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
               if (nums[i] > 0) result.push_back(i + 1);
           }
           return result;
       }
   };

代码分析
--------

原数组的每个槽位同时承担“对应值是否出现”的标记位，第二次扫描将正槽位反解为缺失值。取绝对值保证已被改写的元素仍能正确映射下标；标记和收集各扫描一次，时间复杂度为 ``O(n)``，除返回结果外额外空间复杂度为 ``O(1)``。
