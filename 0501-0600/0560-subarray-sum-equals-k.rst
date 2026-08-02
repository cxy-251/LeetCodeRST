0560. Subarray Sum Equals K
===========================

题目信息
--------

:题号: 0560
:难度: Medium
:主题: 整数数组、连续子数组、目标和、区间计数
:原题: `LeetCode 0560 <https://leetcode.com/problems/subarray-sum-equals-k/>`_
:重点: 子数组必须非空且连续、负数与零均允许、不同起止下标分别计数、返回数量

题目重述
--------

给定整数数组 ``nums`` 和整数 ``k``，统计元素和恰好等于 ``k`` 的非空连续子数组数量。

数组元素可以为正数、负数或零，因此子数组和不会随区间扩展保持单调。即使两个子数组包含相同的数值序列，只要起止下标不同，也应作为不同答案计数。

自建示例
--------

多个重叠区间：

.. code-block:: text

   输入：nums = [1,-1,1,-1]，k = 0
   输出：4
   解释：合格区间为下标 0..1、1..2、2..3 和 0..3，共四个。

相同值出现在不同位置：

.. code-block:: text

   输入：nums = [2,2]，k = 2
   输出：2
   解释：两个单元素子数组分别位于下标 0 和 1，应分别计数。

前缀和频次直接计数区间
----------------------

当前位置前缀和为 ``prefix`` 时，若之前出现过 ``prefix-k``，从那些位置之后到当前的每个区间都恰好和为 ``k``。哈希表记录每个前缀和出现次数，因此同一终点的多个起点会一次性加入答案；初始前缀和 0 出现一次，覆盖从下标 0 开始的非空区间。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int subarraySum(std::vector<int>& nums, int k) {
           std::unordered_map<long long, int> frequency;
           frequency[0] = 1;
           long long prefix = 0;
           int answer = 0;
           for (int value : nums) {
               prefix += value;
               auto it = frequency.find(prefix - k);
               if (it != frequency.end()) answer += it->second;
               ++frequency[prefix];
           }
           return answer;
       }
   };

代码分析
--------

区间和等于两个前缀和之差，频次而不是单个最早位置保证重叠和重复值对应的不同起止下标全部计入。每个元素一次哈希操作，平均时间复杂度为 ``O(n)``，额外空间复杂度为 ``O(n)``。
