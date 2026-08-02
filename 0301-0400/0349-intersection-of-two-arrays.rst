0349. Intersection of Two Arrays
================================

题目信息
--------

:题号: 0349
:难度: Easy
:主题: 两个数组、集合交集、结果去重、顺序不限
:原题: `LeetCode 0349 <https://leetcode.com/problems/intersection-of-two-arrays/>`_
:重点: 元素必须同时出现在两个数组中、每个共同值只返回一次、输入中的重复次数不影响结果

题目重述
--------

给定两个整数数组 ``nums1`` 和 ``nums2``，返回它们的集合交集：某个整数只有在两个数组中都至少出现一次时才属于结果。

结果中的每个整数必须唯一，即使它在输入数组中重复多次也只能返回一次；结果顺序不限。两个数组长度均位于 ``[1, 1000]``，元素位于 ``[0, 1000]``。

自建示例
--------

输入包含多个重复值：

.. code-block:: text

   输入：nums1 = [1, 2, 2, 4]，nums2 = [2, 2, 3, 4, 4]
   输出：[2, 4]
   解释：2 和 4 都在两个数组中出现，但集合交集只保留每个共同值一次；输出顺序可以是 [4,2]。

没有共同元素：

.. code-block:: text

   输入：nums1 = [0, 1]，nums2 = [2, 3]
   输出：[]
   解释：不存在同时出现在两个数组中的整数。

把第一个数组变成待匹配集合
----------------------------

将 ``nums1`` 的值放入集合，扫描 ``nums2`` 时若当前值仍在集合中，就把它加入答案并从集合删除。删除的作用是同时完成去重：后续即使再次遇到同一值，也不会再次输出。集合中最终只保留“尚未在第二个数组中匹配”的第一个数组值。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> intersection(
           std::vector<int>& nums1, std::vector<int>& nums2) {
           std::unordered_set<int> candidates(
               nums1.begin(), nums1.end());
           std::vector<int> result;
           for (int value : nums2) {
               auto it = candidates.find(value);
               if (it == candidates.end()) continue;
               result.push_back(value);
               candidates.erase(it);
           }
           return result;
       }
   };

代码分析
--------

集合只表达是否出现过，不记录频次，符合普通集合交集的定义；从候选集合删除后保证每个共同值只输出一次。哈希集合操作平均为常数时间，时间复杂度为 ``O(nums1.size() + nums2.size())``，额外空间为 ``O(nums1.size())``。
