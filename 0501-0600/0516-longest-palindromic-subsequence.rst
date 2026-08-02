0516. Longest Palindromic Subsequence
=====================================

题目信息
--------

:题号: 0516
:难度: Medium
:主题: 字符串、子序列、回文、最大长度
:原题: `LeetCode 0516 <https://leetcode.com/problems/longest-palindromic-subsequence/>`_
:重点: 子序列可以删除字符但不能改变剩余顺序、无需连续、返回长度而不是具体字符串

题目重述
--------

给定只含小写英文字母的字符串 ``s``，从中删除任意数量的字符但保持剩余字符的相对顺序，可以得到一个子序列。返回所有回文子序列中的最大长度。

回文要求从左到右和从右到左读取相同。子序列不要求在原字符串中连续；单个字符本身也是长度为 1 的回文子序列。

自建示例
--------

删除中间不匹配字符：

.. code-block:: text

   输入：s = "agbdba"
   输出：5
   解释：可以保留子序列 "abdba"，它是长度为 5 的回文；不存在更长的回文子序列。

没有相同字符：

.. code-block:: text

   输入：s = "abc"
   输出：1
   解释：任意单个字符都构成回文，但无法选择两个或更多字符组成回文。

区间回文状态压缩
----------------

令区间 ``[i,j]`` 的状态表示该子串能得到的最长回文子序列长度。若两端字符相同，可以把它们同时选入，状态为内层 ``[i+1,j-1]`` 加 2；若不同，则最优解必须放弃左端或右端之一，取两个较短区间的较大值。

用一维数组按 ``i`` 从右向左处理。更新 ``dp[j]`` 前保存旧的 ``dp[j-1]``，它就是上一轮的内层状态，避免覆盖二维转移所需的信息。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int longestPalindromeSubseq(std::string s) {
           int n = static_cast<int>(s.size());
           std::vector<int> dp(n, 1);
           for (int left = n - 2; left >= 0; --left) {
               int diagonal = 0;
               for (int right = left + 1; right < n; ++right) {
                   int old = dp[right];
                   if (s[left] == s[right]) {
                       dp[right] = diagonal + 2;
                   } else {
                       dp[right] = std::max(dp[right], dp[right - 1]);
                   }
                   diagonal = old;
               }
           }
           return dp.empty() ? 0 : dp.back();
       }
   };

代码分析
--------

相等端点的选择和不相等端点的二选一完整覆盖了区间最优解；``diagonal`` 保存更新前的内层值，``dp[right-1]`` 保存当前左端下的左侧区间。时间复杂度为 ``O(n^2)``，空间复杂度压缩为 ``O(n)``。
