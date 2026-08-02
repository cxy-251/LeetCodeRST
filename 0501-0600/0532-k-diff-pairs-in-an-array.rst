0532. K-diff Pairs in an Array
==============================

题目信息
--------

:题号: 0532
:难度: Medium
:主题: 数组、绝对差、不同数值对、重复元素
:原题: `LeetCode 0532 <https://leetcode.com/problems/k-diff-pairs-in-an-array/>`_
:重点: 统计满足绝对差为 k 的不同数值对、同一对不能因下标组合重复计数、k=0 时要求值至少出现两次

题目重述
--------

给定整数数组 ``nums`` 和非负整数 ``k``，统计有多少个不同的数值对 ``(a, b)`` 满足 ``|a - b| = k``，且 ``a``、``b`` 都来自数组中的不同位置。

答案按数值对去重，而不是按下标对计数；同一组数值即使由多组下标形成，也只计一次。当 ``k = 0`` 时，只有在某个值至少出现两次时，数值对 ``(x, x)`` 才成立。

自建示例
--------

重复值不重复贡献同一数值对：

.. code-block:: text

   输入：nums = [1,3,1,5,4]，k = 2
   输出：2
   解释：不同数值对为 (1,3) 和 (3,5)；两个数值 1 不会让 (1,3) 被重复计数。

零差值：

.. code-block:: text

   输入：nums = [2,2,2,3]，k = 0
   输出：1
   解释：只有数值 2 至少出现两次，因此唯一数值对是 (2,2)。

先压缩出现次数再按数值查找
--------------------------

频次表把下标差异压缩为数值集合。若 ``k > 0``，每个出现过的 ``x`` 至多贡献一次数值对 ``(x, x+k)``；若 ``k = 0``，只有频次至少为 2 的 ``x`` 能贡献 ``(x,x)``。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findPairs(std::vector<int>& nums, int k) {
           std::unordered_map<int, int> frequency;
           for (int value : nums) ++frequency[value];

           int answer = 0;
           for (const auto& [value, count] : frequency) {
               if (k == 0) {
                   if (count >= 2) ++answer;
               } else if (frequency.count(value + k) != 0) {
                   ++answer;
               }
           }
           return answer;
       }
   };

代码分析
--------

遍历频次表而非原数组，保证同一数值对不会按多个下标重复计数；``k=0`` 单独检查重复出现条件。平均时间复杂度为 ``O(n)``，额外空间复杂度为 ``O(n)``。
