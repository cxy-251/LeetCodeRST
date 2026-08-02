0354. Russian Doll Envelopes
============================

题目信息
--------

:题号: 0354
:难度: Hard
:主题: 二维嵌套、严格比较、数组、最大链长度
:原题: `LeetCode 0354 <https://leetcode.com/problems/russian-doll-envelopes/>`_
:重点: 宽度和高度都必须严格变大、信封不能旋转、每个信封最多使用一次、只返回最大数量

题目重述
--------

给定若干信封，``envelopes[i] = [wi, hi]`` 表示第 ``i`` 个信封的宽度和高度。一个信封只有在宽度和高度都严格小于另一个信封时，才能放入后者；任一维度相等都不能嵌套，信封也不能旋转。

返回能够形成的最长连续嵌套链所包含的信封数量。每个输入信封最多使用一次。信封数量位于 ``[1, 10^5]``，宽度和高度均位于 ``[1, 10^5]``。题目只要求返回最大数量，不要求恢复具体嵌套顺序。

自建示例
--------

同宽信封不能互相嵌套：

.. code-block:: text

   输入：envelopes = [[2,2],[3,3],[3,5],[4,6]]
   输出：3
   解释：可以选择 [2,2] -> [3,3] -> [4,6]，或 [2,2] -> [3,5] -> [4,6]；两个宽度同为 3 的信封不能放入彼此。

只有高度增加仍不合法：

.. code-block:: text

   输入：envelopes = [[5,2],[5,7]]
   输出：1
   解释：两者宽度相等，不满足宽和高都严格增大的条件，因此最多选择一个。

用排序处理宽度，再在高度上做严格 LIS
--------------------------------------

先按宽度升序排序；宽度相等时按高度降序排序。这样在高度序列中寻找严格递增子序列时，同宽信封的高度会反向排列，不可能被同一条递增子序列同时选中，正好排除了“宽度相等也嵌套”的错误。宽度严格增加的候选则按高度的严格递增关系形成合法链。

维护 ``tails[len - 1]`` 为长度为 ``len`` 的递增子序列能够拥有的最小末尾高度。对当前高度用 ``lower_bound`` 找到第一个大于等于它的位置并替换；找不到时扩展序列长度。这里必须使用 ``lower_bound``，因为高度相等也不允许嵌套。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int maxEnvelopes(std::vector<std::vector<int>>& envelopes) {
           std::sort(envelopes.begin(), envelopes.end(),
               [](const std::vector<int>& first,
                  const std::vector<int>& second) {
                   if (first[0] != second[0]) {
                       return first[0] < second[0];
                   }
                   return first[1] > second[1];
               });

           std::vector<int> tails;
           for (const auto& envelope : envelopes) {
               auto it = std::lower_bound(
                   tails.begin(), tails.end(), envelope[1]);
               if (it == tails.end()) {
                   tails.push_back(envelope[1]);
               } else {
                   *it = envelope[1];
               }
           }
           return static_cast<int>(tails.size());
       }
   };

代码分析
--------

宽度升序、高度降序的排序规则把二维严格条件转成一维严格 LIS；``tails`` 只记录每种长度的最小末尾，不直接保存最终链，但长度保持正确。排序时间为 ``O(n log n)``，LIS 同样为 ``O(n log n)``，额外空间为 ``O(n)``。
