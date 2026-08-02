0350. Intersection of Two Arrays II
===================================

题目信息
--------

:题号: 0350
:难度: Easy
:主题: 两个数组、多重集交集、频次下界、顺序不限
:原题: `LeetCode 0350 <https://leetcode.com/problems/intersection-of-two-arrays-ii/>`_
:重点: 共同值可以重复返回、返回次数取两个数组频次的较小值、结果顺序不限

题目重述
--------

给定两个整数数组 ``nums1`` 和 ``nums2``，返回它们的多重集交集。对每个整数 ``x``，它在结果中出现的次数应等于它在两个输入数组中出现次数的较小值。

结果顺序不限。两个数组长度均位于 ``[1, 1000]``，元素位于 ``[0, 1000]``。与普通集合交集不同，重复元素需要按可配对次数保留；同一个输入位置不能被重复匹配。

自建示例
--------

不同元素具有不同可配对次数：

.. code-block:: text

   输入：nums1 = [1, 2, 2, 2, 4]，nums2 = [2, 2, 3, 4, 4]
   输出：[2, 2, 4]
   解释：2 在两个数组中分别出现 3 次和 2 次，因此结果保留 2 次；4 分别出现 1 次和 2 次，因此保留 1 次。输出顺序可以不同。

没有多重集交集：

.. code-block:: text

   输入：nums1 = [5, 5]，nums2 = [6]
   输出：[]
   解释：两个数组没有可配对的相同值。

用剩余频次表示可用位置
------------------------

先统计 ``nums1`` 中每个值还可以被匹配的次数。扫描 ``nums2`` 时，只有当某值的剩余次数大于零，才把它放入答案并将次数减一。这样同一个 ``nums1`` 位置不会被重复使用；最终某值的输出次数正好是两个数组频次的较小值。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> intersect(
           std::vector<int>& nums1, std::vector<int>& nums2) {
           std::unordered_map<int, int> remaining;
           for (int value : nums1) ++remaining[value];

           std::vector<int> result;
           for (int value : nums2) {
               auto it = remaining.find(value);
               if (it == remaining.end() || it->second == 0) continue;
               result.push_back(value);
               --it->second;
           }
           return result;
       }
   };

代码分析
--------

频次表把多重集交集的“每个位置最多匹配一次”直接编码为可用额度；扫描第二个数组时消耗额度，不需要对输入排序，也不依赖结果顺序。平均时间复杂度为 ``O(nums1.size() + nums2.size())``，额外空间为 ``O(nums1.size())``。
