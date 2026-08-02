0503. Next Greater Element II
=============================

题目信息
--------

:题号: 0503
:难度: Medium
:主题: 循环数组、严格更大、右侧搜索、按下标返回
:原题: `LeetCode 0503 <https://leetcode.com/problems/next-greater-element-ii/>`_
:重点: 数组首尾相连、寻找遇到的第一个严格更大值、允许跨越末尾、找不到时返回 -1

题目重述
--------

给定一个循环整数数组 ``nums``。对每个下标 ``i``，从 ``i`` 的下一个位置开始按向右方向查找；到达数组末尾后继续从下标 ``0`` 查找，直到回到 ``i`` 之前。返回搜索过程中遇到的第一个严格大于 ``nums[i]`` 的元素值。

若不存在这样的元素，该位置返回 ``-1``。相等元素不算更大，结果数组与 ``nums`` 等长，并按原下标对应。

自建示例
--------

跨越数组末尾找到答案：

.. code-block:: text

   输入：nums = [5,1,4,2,3]
   输出：[-1,4,5,3,5]
   解释：4 的右侧线性部分没有更大值，但循环到开头后遇到 5；最大值 5 无法找到更大元素。

全部元素相等：

.. code-block:: text

   输入：nums = [7,7,7]
   输出：[-1,-1,-1]
   解释：相等值不满足“严格更大”，因此所有位置都返回 -1。

把循环数组展开两倍
------------------

对每个位置，最多向右查看 ``n-1`` 个元素；将索引视为长度 ``2n`` 的虚拟数组，就能把跨越尾部的部分变成普通的右侧搜索。从右向左维护单调递减栈，弹出小于等于当前值的元素后，栈顶就是第一个严格更大的候选。

第二遍只是为第一遍位置提供候选，只有 ``i < n`` 时才写入答案；因此每个原位置最终仍只返回一个值。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> nextGreaterElements(std::vector<int>& nums) {
           int n = static_cast<int>(nums.size());
           std::vector<int> result(n, -1);
           std::vector<int> stack;
           for (int i = 2 * n - 1; i >= 0; --i) {
               int value = nums[i % n];
               while (!stack.empty() && stack.back() <= value) {
                   stack.pop_back();
               }
               if (i < n && !stack.empty()) result[i] = stack.back();
               stack.push_back(value);
           }
           return result;
       }
   };

代码分析
--------

栈中保留的元素按从栈底到栈顶递减，所有被弹出的值都不可能成为当前或更左元素的首个更大值；相等值弹出确保结果严格更大。虚拟两遍扫描使每个值最多入栈、出栈一次，时间复杂度为 ``O(n)``，额外空间为 ``O(n)``。
