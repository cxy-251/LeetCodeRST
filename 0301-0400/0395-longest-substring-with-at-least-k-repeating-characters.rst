0395. Longest Substring with At Least K Repeating Characters
============================================================

题目信息
--------

:题号: 0395
:难度: Medium
:主题: 连续子串、局部字符频次、最少出现次数、最大长度
:原题: `LeetCode 0395 <https://leetcode.com/problems/longest-substring-with-at-least-k-repeating-characters/>`_
:重点: 统计范围只限所选子串、子串中的每一种字符都必须至少出现 k 次、无合法非空子串返回 0

题目重述
--------

给定只包含小写英文字母的字符串 ``s`` 和整数 ``k``，寻找一个最长连续子串，使该子串中出现过的每一种字符，在该子串内部都至少出现 ``k`` 次。返回这个最长长度。

``s`` 的长度位于 ``[1, 10^4]``，``k`` 位于 ``[1, 10^5]``。字符在原字符串其他位置的出现次数不计入所选子串的频次；若没有任何非空子串满足要求，返回 ``0``。存在多个同样长的子串时仍只返回长度。

自建示例
--------

尾部低频字符不能加入：

.. code-block:: text

   输入：s = "aaabbbc"，k = 3
   输出：6
   解释：子串 "aaabbb" 中 a 和 b 都出现三次；加入末尾 c 后，c 只出现一次，不再合法。

没有字符达到要求：

.. code-block:: text

   输入：s = "abc"，k = 2
   输出：0
   解释：任意非空子串中的每个字符最多出现一次，无法满足至少两次。

低频字符一定是合法子串的分界
------------------------------

对当前区间统计 26 个字符频次。若某字符出现次数小于 ``k``，任何包含它的子串都不可能合法，因此它可以作为分界点，把问题拆成左右两个独立区间；递归求两边最大值。若当前区间中每个出现过的字符都达到 ``k``，整个区间就是合法候选，直接返回区间长度。

这个分治不会漏掉答案：合法子串不可能跨过低频字符；若没有低频字符，当前区间本身已经满足条件。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       int solve(const std::string& s, int left, int right, int k) {
           if (right - left < k) return 0;

           std::array<int, 26> frequency{};
           for (int i = left; i < right; ++i) {
               ++frequency[s[i] - 'a'];
           }

           for (int i = left; i < right; ++i) {
               if (frequency[s[i] - 'a'] >= k) continue;
               int next = i + 1;
               while (next < right
                      && frequency[s[next] - 'a'] < k) {
                   ++next;
               }
               return std::max(solve(s, left, i, k),
                               solve(s, next, right, k));
           }
           return right - left;
       }

   public:
       int longestSubstring(std::string s, int k) {
           return solve(s, 0, static_cast<int>(s.size()), k);
       }
   };

代码分析
--------

频次小于 ``k`` 的字符在当前区间中不能出现在任何合法答案里，连续低频字符可以一次跳过后再递归；没有分界点时整个区间一次返回。字母表固定为 26，平均递归层数下时间复杂度为 ``O(26n)`` 到 ``O(26n log n)`` 的范围，额外空间为 ``O(n)`` 递归栈最坏情况。
