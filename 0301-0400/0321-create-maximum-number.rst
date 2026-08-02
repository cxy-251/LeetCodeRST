0321. Create Maximum Number
===========================

题目信息
--------

:题号: 0321
:难度: Hard
:主题: 数字数组、子序列合并、相对顺序、字典序最大
:原题: `LeetCode 0321 <https://leetcode.com/problems/create-maximum-number/>`_
:重点: 必须恰好选择 k 个数字、两个数组内部顺序分别保持、返回字典序最大的数字序列

题目重述
--------

给定两个数字数组 ``nums1`` 和 ``nums2``，它们分别表示两个不含前导零的十进制数，以及整数 ``k``。从两个数组中合计选择恰好 ``k`` 个数字，并按选择后的顺序组成长度为 ``k`` 的结果数组。

来自同一个原数组的数字必须保持原有相对顺序，来自不同数组的数字可以交错排列。返回所有合法选择中字典序最大的结果。两个数组长度均位于 ``[1, 500]``，元素位于 ``[0, 9]``，并满足 ``1 <= k <= nums1.length + nums2.length``。

自建示例
--------

需要舍弃一个较早的小数字：

.. code-block:: text

   输入：nums1 = [6, 7]，nums2 = [6, 0, 4]，k = 4
   输出：[7, 6, 0, 4]
   解释：从 nums1 只选择 7，从 nums2 选择全部数字并合并，可让首位成为 7；任何以 6 开头的合法结果都更小。

选择全部数字时仍要保持各自顺序：

.. code-block:: text

   输入：nums1 = [8, 1]，nums2 = [7, 9]，k = 4
   输出：[8, 7, 9, 1]
   解释：四个数字都必须使用；nums1 中 8 必须在 1 前，nums2 中 7 必须在 9 前，在这些限制下该合并结果字典序最大。

拆成“各取多少”与“如何交错”
----------------------------

最优答案一定有一个确定的分配：从 ``nums1`` 取 ``take1`` 个，从 ``nums2`` 取 ``k - take1`` 个。枚举这个分配后，问题分成两步。第一步，在每个数组内部取指定数量的字典序最大子序列；第二步，把两个子序列交错合并成最大的整体序列。枚举范围限制为两边都能取够数字的范围。

固定取 ``t`` 个数字时，使用单调栈从左到右构造最大子序列。允许丢弃 ``length - t`` 个数字；当前数字比栈顶大且仍有丢弃额度时，弹出栈顶可以让更大的数字提前出现。扫描结束若额度尚未用完，就从尾部删除。这个贪心保留了原数组内部顺序。

合并时不能只比较两个当前数字：如果两边当前数字相等，后续较大的位置决定哪一边应先取。每次比较两个剩余后缀的字典序，选择较大的后缀的首位；相等后缀任选一边都得到同一个结果。对所有分配取最大候选即可覆盖全部合法答案。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::vector<int> maxSubsequence(
           const std::vector<int>& nums, int length) {
           std::vector<int> stack;
           int drop = static_cast<int>(nums.size()) - length;
           for (int value : nums) {
               while (drop > 0 && !stack.empty()
                      && stack.back() < value) {
                   stack.pop_back();
                   --drop;
               }
               stack.push_back(value);
           }
           stack.resize(length);
           return stack;
       }

       bool greaterSuffix(const std::vector<int>& first, int i,
                          const std::vector<int>& second, int j) {
           while (i < static_cast<int>(first.size())
                  && j < static_cast<int>(second.size())
                  && first[i] == second[j]) {
               ++i;
               ++j;
           }
           return j == static_cast<int>(second.size())
               || (i < static_cast<int>(first.size())
                   && first[i] > second[j]);
       }

       std::vector<int> merge(const std::vector<int>& first,
                              const std::vector<int>& second) {
           std::vector<int> result;
           int i = 0;
           int j = 0;
           while (i < static_cast<int>(first.size())
                  || j < static_cast<int>(second.size())) {
               if (greaterSuffix(first, i, second, j)) {
                   result.push_back(first[i++]);
               } else {
                   result.push_back(second[j++]);
               }
           }
           return result;
       }

   public:
       std::vector<int> maxNumber(std::vector<int>& nums1,
                                  std::vector<int>& nums2, int k) {
           int n1 = static_cast<int>(nums1.size());
           int n2 = static_cast<int>(nums2.size());
           int low = std::max(0, k - n2);
           int high = std::min(k, n1);
           std::vector<int> answer;

           for (int take1 = low; take1 <= high; ++take1) {
               int take2 = k - take1;
               std::vector<int> first = maxSubsequence(nums1, take1);
               std::vector<int> second = maxSubsequence(nums2, take2);
               std::vector<int> candidate = merge(first, second);
               if (candidate > answer) answer = candidate;
           }
           return answer;
       }
   };

代码分析
--------

``maxSubsequence`` 只删除不会影响长度下限的较小前缀，保证固定取数数量下的最优性；``greaterSuffix`` 在当前数字相等时继续比较后缀，避免把“当前相等”错误地当成任意选择。每一种合法的取数分配都会被枚举，因此全局最优不会遗漏。设候选分配数为 ``s``，单调栈部分为 ``O(s(n1+n2))``；简单后缀比较在大量相等数字时可能重复扫描，合并最坏为 ``O(k^2)``，总复杂度可写为 ``O(s(n1+n2+k^2))``，额外空间为 ``O(k)``。
