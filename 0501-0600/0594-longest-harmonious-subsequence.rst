0594. Longest Harmonious Subsequence
====================================

题目信息
--------

:题号: 0594
:难度: Easy
:主题: 数组、子序列、最大值最小值、频次统计
:原题: `LeetCode 0594 <https://leetcode.com/problems/longest-harmonious-subsequence/>`_
:重点: 子序列无需连续、最大值与最小值之差必须恰好为 1、只有一种数值时不合格

题目重述
--------

给定整数数组 ``nums``，寻找最长的和谐子序列。和谐子序列要求所选元素中的最大值与最小值之差恰好等于 ``1``。

子序列可以删除原数组中的任意元素，但保留元素的相对顺序不能改变；只需返回最大长度。若不存在同时包含两个相邻整数值的子序列，返回 ``0``。

自建示例
--------

相邻两种数值共同组成最长答案：

.. code-block:: text

   输入：nums = [1,2,2,3,3,3]
   输出：5
   解释：选择所有 2 和 3，可得到长度 5 的子序列，最大值与最小值之差为 1。

只有一种数值：

.. code-block:: text

   输入：nums = [4,4,4]
   输出：0
   解释：任意非空子序列的最大值与最小值之差都是 0，不满足恰好为 1。

统计相邻数值的频次总和
----------------------

和谐子序列只关心选出的数值集合，且允许从原数组删除任意元素，所以对于一对 ``x`` 和 ``x + 1``，可以把它们的全部出现位置都选入子序列。统计每个数值的频次，再枚举每个 ``x`` 与 ``x + 1`` 的频次和即可。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findLHS(std::vector<int>& nums) {
           std::unordered_map<int, int> frequency;
           for (int value : nums) ++frequency[value];

           int answer = 0;
           for (const auto& [value, count] : frequency) {
               auto next = frequency.find(value + 1);
               if (next != frequency.end()) {
                   answer = std::max(answer, count + next->second);
               }
           }
           return answer;
       }
   };

代码分析
--------

任意合法答案的最小值和最大值必须恰好是 ``x`` 与 ``x + 1``，同一数值的所有出现位置都不会破坏这个条件，因此该数值对的最大贡献就是两种频次之和。哈希表统计和枚举均为平均 ``O(n)``，额外空间复杂度为 ``O(u)``，其中 ``u`` 是不同数值的数量。
