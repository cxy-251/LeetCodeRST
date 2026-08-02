0491. Non-decreasing Subsequences
================================

题目信息
--------

:题号: 0491
:难度: Medium
:主题: 子序列、非递减、长度至少二、结果去重
:原题: `LeetCode 0491 <https://leetcode.com/problems/non-decreasing-subsequences/>`_
:重点: 保持原下标顺序但可跳过元素、后项可等于前项、相同数值序列只返回一次、结果顺序不限

题目重述
--------

给定整数数组 ``nums``，返回其中所有不同的非递减子序列。每个子序列长度至少为 2，并且相邻所选元素满足后一个值大于或等于前一个值。

子序列可以跳过原数组中的元素，但保留元素的下标顺序不能改变。由不同下标选择产生相同数值序列时，结果中只能保留一个副本。``nums.length`` 位于 ``[1, 15]``，每个元素位于 ``[-100, 100]``，结果顺序不限。

自建示例
--------

重复值会产生重复下标选择：

.. code-block:: text

   输入：nums = [1,2,1,2]
   输出可包含：[[1,1], [1,2], [2,2], [1,1,2], [1,2,2]]
   解释：[1,2] 可以由多个不同下标组合得到，但作为数值序列只能返回一次；列出的五种是全部不同合法结果，顺序不限。

只有一条合法子序列：

.. code-block:: text

   输入：nums = [3,3,2]
   输出：[[3,3]]
   解释：前两个 3 构成非递减子序列，任何包含末尾 2 的长度至少为 2 的子序列都会下降。

按递归层去重并保持下标递增
--------------------------

回溯参数 ``start`` 表示下一次只能从哪个下标之后选择，因而自动保证子序列顺序。若候选值不小于路径末尾，就可以加入路径；路径长度达到 2 时记录一份结果，然后继续向后扩展。

同一递归层中，数值相同的候选会产生相同的后续数值序列，只保留第一次尝试。这个集合必须在每层递归重新建立：同一个值在不同深度仍可能形成合法的不同长度序列。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::vector<int> path;
       std::vector<std::vector<int>> result;

       void search(const std::vector<int>& nums, int start) {
           if (path.size() >= 2) result.push_back(path);
           std::unordered_set<int> used;
           for (int i = start; i < static_cast<int>(nums.size()); ++i) {
               if (used.count(nums[i])) continue;
               used.insert(nums[i]);
               if (!path.empty() && nums[i] < path.back()) continue;

               path.push_back(nums[i]);
               search(nums, i + 1);
               path.pop_back();
           }
       }

   public:
       std::vector<std::vector<int>> findSubsequences(
           std::vector<int>& nums) {
           path.clear();
           result.clear();
           search(nums, 0);
           return result;
       }
   };

代码分析
--------

``start`` 只向右移动，保证每条路径是原数组的子序列；层内去重只删除相同值、相同前缀下的重复分支，不会删除跨层的合法序列。最坏时间复杂度与不同子序列数量同阶，额外空间为 ``O(n)`` 的递归路径和去重集合（不计输出）。
