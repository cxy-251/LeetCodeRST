0523. Continuous Subarray Sum
=============================

题目信息
--------

:题号: 0523
:难度: Medium
:主题: 连续子数组、长度下限、整倍数、布尔判定
:原题: `LeetCode 0523 <https://leetcode.com/problems/continuous-subarray-sum/>`_
:重点: 子数组必须连续且长度至少为 2、元素和应是 k 的整数倍、零也是 k 的倍数

题目重述
--------

给定非负整数数组 ``nums`` 和正整数 ``k``，判断是否存在一个长度至少为 ``2`` 的连续子数组，使该子数组的元素和等于 ``k`` 的某个整数倍。

整数倍可以是 ``0``，因此和为 ``0`` 的合格子数组也满足条件。只需返回是否存在，不需要返回子数组位置；单个元素即使本身是 ``k`` 的倍数，也不满足长度要求。

自建示例
--------

前两个元素组成整倍数：

.. code-block:: text

   输入：nums = [4,2,3]，k = 3
   输出：true
   解释：连续子数组 [4,2] 的和为 6，是 3 的 2 倍，且长度为 2。

不存在合格连续区间：

.. code-block:: text

   输入：nums = [1,2,3]，k = 7
   输出：false
   解释：长度至少为 2 的连续子数组和为 3、5 或 6，都不是 7 的整数倍。

相同前缀余数之间形成整倍数
--------------------------

若两个前缀和对 ``k`` 取模后相同，它们的差值就是 ``k`` 的整数倍；差值对应的数组区间必须至少包含两个元素。对每个余数只记录最早出现的位置，后面再次出现时得到的区间最长，也最容易满足长度要求。

初始余数 0 放在位置 ``-1``，覆盖从数组开头开始的区间；题目中的 ``k`` 为正数，余数始终在 ``0..k-1``。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool checkSubarraySum(std::vector<int>& nums, int k) {
           std::unordered_map<int, int> first;
           first[0] = -1;
           long long prefix = 0;
           for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
               prefix = (prefix + nums[i]) % k;
               int remainder = static_cast<int>(prefix);
               auto it = first.find(remainder);
               if (it != first.end()) {
                   if (i - it->second >= 2) return true;
               } else {
                   first[remainder] = i;
               }
           }
           return false;
       }
   };

代码分析
--------

前缀余数相等与区间和为 ``k`` 的倍数等价，保留最早位置不会丢失任何长度至少 2 的可行区间。每个元素只做一次哈希查找，平均时间复杂度为 ``O(n)``，额外空间复杂度为 ``O(min(n,k))``。
