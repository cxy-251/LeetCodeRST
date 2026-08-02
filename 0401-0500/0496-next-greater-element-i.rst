0496. Next Greater Element I
===========================

题目信息
--------

:题号: 0496
:难度: Easy
:主题: 两个无重复数组、子集关系、右侧首个更大值、结果对齐
:原题: `LeetCode 0496 <https://leetcode.com/problems/next-greater-element-i/>`_
:重点: ``nums1`` 是 ``nums2`` 的子集、先在 ``nums2`` 定位同值元素、只搜索其右侧、返回第一个严格更大的值

题目重述
--------

给定两个不含重复元素的整数数组 ``nums1`` 和 ``nums2``，并保证 ``nums1`` 中的每个值都出现在 ``nums2`` 中。对 ``nums1`` 中的每个元素 ``x``，先找到它在 ``nums2`` 中的位置，再在该位置右侧寻找第一个严格大于 ``x`` 的元素。

按 ``nums1`` 的原顺序返回查询结果；若某个元素右侧不存在更大值，则对应位置返回 ``-1``。两个数组长度位于 ``[1, 1000]``，元素位于 ``[0, 10^4]``。

自建示例
--------

两个查询都存在右侧更大值：

.. code-block:: text

   输入：nums1 = [2,4]，nums2 = [1,2,3,4,5]
   输出：[3,5]
   解释：2 右侧第一个更大值是 3；4 右侧第一个更大值是 5。

右侧元素全部更小：

.. code-block:: text

   输入：nums1 = [5]，nums2 = [5,4,3]
   输出：[-1]
   解释：5 在 nums2 的右侧没有严格更大的元素。

单调栈预处理 nums2 的下一个更大值
---------------------------------

从 ``nums2`` 右向左扫描，栈中保持一组可能成为后续元素“右侧第一个更大值”的候选。处理当前值时，栈顶小于等于当前值的候选不可能再成为当前值或更左元素的答案，全部弹出；剩下的栈顶就是当前值右侧第一个严格更大的元素。

把每个 ``nums2`` 值的答案存入哈希表，最后按 ``nums1`` 原顺序查询即可。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> nextGreaterElement(
           std::vector<int>& nums1, std::vector<int>& nums2) {
           std::unordered_map<int, int> nextGreater;
           std::vector<int> stack;
           for (int i = static_cast<int>(nums2.size()) - 1; i >= 0; --i) {
               while (!stack.empty() && stack.back() <= nums2[i]) {
                   stack.pop_back();
               }
               nextGreater[nums2[i]] = stack.empty() ? -1 : stack.back();
               stack.push_back(nums2[i]);
           }

           std::vector<int> result;
           result.reserve(nums1.size());
           for (int value : nums1) result.push_back(nextGreater[value]);
           return result;
       }
   };

代码分析
--------

每个元素入栈一次、出栈至多一次，栈顶在弹出后不会重新成为候选；因此预处理 ``nums2`` 的时间复杂度为 ``O(|nums2|)``，查询 ``nums1`` 为 ``O(|nums1|)``，额外空间复杂度为 ``O(|nums2|)``。
