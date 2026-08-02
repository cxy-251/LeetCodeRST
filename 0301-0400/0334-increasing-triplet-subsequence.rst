0334. Increasing Triplet Subsequence
====================================

题目信息
--------

:题号: 0334
:难度: Medium
:主题: 数组、三元素子序列、严格递增、下标顺序
:原题: `LeetCode 0334 <https://leetcode.com/problems/increasing-triplet-subsequence/>`_
:重点: 三个下标必须严格递增、三个数值也必须严格递增、元素不要求连续

题目重述
--------

给定整数数组 ``nums``，判断是否存在三个下标 ``i``、``j``、``k``，满足 ``i < j < k`` 且 ``nums[i] < nums[j] < nums[k]``。只要存在任意一组三元素严格递增子序列就返回 ``true``，否则返回 ``false``。

数组长度位于 ``[1, 5 * 10^5]``，元素位于 32 位有符号整数范围。三个元素在原数组中可以不连续，但不能改变出现顺序；相等值不能满足严格递增条件。进阶要求 ``O(n)`` 时间和 ``O(1)`` 额外空间。

自建示例
--------

需要跳过中间元素：

.. code-block:: text

   输入：nums = [5, 1, 4, 2, 3]
   输出：true
   解释：下标 1、3、4 对应的数值 1、2、3 严格递增，虽然它们不是从数组开头连续取得。

只有相等值：

.. code-block:: text

   输入：nums = [3, 3, 3]
   输出：false
   解释：任意三个值都相等，不满足严格小于关系。

只保留最有希望的前两个数
--------------------------

扫描到当前位置时，维护一个最小的 ``first``，以及在 ``first`` 之后出现、且尽可能小的 ``second``。遇到 ``x``：若 ``x <= first``，用它替换 ``first``；否则若 ``x <= second``，用它替换 ``second``；若 ``x`` 同时大于两者，就得到 ``first < second < x`` 的三元组。

替换不会破坏下标顺序：``first`` 只来自当前或更早位置，``second`` 只在当前值大于 ``first`` 时更新，因此保存的 ``first`` 必定位于 ``second`` 之前。用 ``<=`` 更新是为了让相等值不能错误地推进到更长的严格序列，同时给后续更大值留下最小前缀。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool increasingTriplet(std::vector<int>& nums) {
           int first = INT_MAX;
           int second = INT_MAX;

           for (int value : nums) {
               if (value <= first) {
                   first = value;
               } else if (value <= second) {
                   second = value;
               } else {
                   return true;
               }
           }
           return false;
       }
   };

代码分析
--------

``first`` 和 ``second`` 不是固定的某两个下标，而是到当前位置为止最有利于扩展的状态；较小的前缀不会减少后续可选值。两个变量始终保持严格候选关系，第三次进入 ``else`` 才返回真。算法只扫描一次数组，时间复杂度为 ``O(n)``，额外空间为 ``O(1)``。
