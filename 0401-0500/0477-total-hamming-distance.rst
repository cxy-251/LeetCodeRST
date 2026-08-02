0477. Total Hamming Distance
============================

题目信息
--------

:题号: 0477
:难度: Medium
:主题: 非负整数数组、无序数对、二进制不同位、距离总和
:原题: `LeetCode 0477 <https://leetcode.com/problems/total-hamming-distance/>`_
:重点: 对所有 ``i < j`` 的数对分别计算、相同数值的不同下标仍是一个数对、每对只计一次

题目重述
--------

给定非负整数数组 ``nums``，对所有满足 ``0 <= i < j < nums.length`` 的无序下标对，计算 ``nums[i]`` 与 ``nums[j]`` 的汉明距离，并返回这些距离的总和。

两个整数的汉明距离是二进制表示中对应位不同的数量。``nums.length`` 位于 ``[1, 10^4]``，每个元素位于 ``[0, 10^9]``。重复数值位于不同下标时仍会形成数对，只是它们之间的距离可能为 0。

自建示例
--------

三组数对贡献相同距离：

.. code-block:: text

   输入：nums = [1, 2, 7]
   输出：6
   解释：1 与 2、1 与 7、2 与 7 的汉明距离都为 2，三个无序数对总和为 6。

相同整数之间距离为零：

.. code-block:: text

   输入：nums = [4, 4]
   输出：0
   解释：两个下标构成一个数对，但对应二进制位完全相同。

按位统计一方为 1、另一方为 0
------------------------------

固定某一个二进制位，设数组中有 ``ones`` 个数在该位为 1，``zeros = n - ones`` 个数为 0。这个位对总汉明距离的贡献就是从两类中各选一个的 ``ones * zeros``，因为每个无序下标对只在该位不同一次。

对所有有效位累加即可，不需要枚举 ``O(n^2)`` 个数对。不同下标的重复数值也会被分别放入计数，符合题目的下标计数规则。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int totalHammingDistance(std::vector<int>& nums) {
           long long answer = 0;
           int n = static_cast<int>(nums.size());
           for (int bit = 0; bit < 31; ++bit) {
               int ones = 0;
               for (int value : nums) {
                   if (value & (1 << bit)) ++ones;
               }
               answer += static_cast<long long>(ones) * (n - ones);
           }
           return static_cast<int>(answer);
       }
   };

代码分析
--------

每个数对在每个二进制位上的差异被独立计算，``ones * zeros`` 恰好枚举该位的两种取值组合，因此不存在重复或遗漏。输入上界小于 ``2^30``，检查 31 位足够；时间复杂度为 ``O(31n)``，额外空间复杂度为 ``O(1)``。
