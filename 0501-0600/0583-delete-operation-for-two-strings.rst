0583. Delete Operation for Two Strings
======================================

题目信息
--------

:题号: 0583
:难度: Medium
:主题: 两个字符串、删除字符、相同结果、最少操作
:原题: `LeetCode 0583 <https://leetcode.com/problems/delete-operation-for-two-strings/>`_
:重点: 每次只能从其中一个字符串删除一个字符、不能插入或替换、目标是让两串完全相同

题目重述
--------

给定两个只含小写英文字母的字符串 ``word1`` 和 ``word2``。一次操作可以从任意一个字符串中删除一个字符。

返回使两个字符串最终完全相同所需的最少删除次数。可以从两个字符串都删除字符，但不能插入、替换或改变剩余字符的相对顺序；若两串起初相同，答案为 ``0``。

自建示例
--------

两个字符串都需要删除：

.. code-block:: text

   输入：word1 = "abcd"，word2 = "ace"
   输出：3
   解释：从 word1 删除 b、d，从 word2 删除 e，两个字符串都变为 "ac"，共删除 3 次。

初始已经相同：

.. code-block:: text

   输入：word1 = "tree"，word2 = "tree"
   输出：0
   解释：无需执行任何删除。

保留最长公共子序列
------------------

最终相同的字符串必须同时是两个输入的公共子序列。若保留最长公共子序列长度为 ``l``，删除次数就是 ``len1-l + len2-l``；因此先求 LCS，再从两边删除其余字符即可达到最少操作。

用一维 DP 保存前缀 LCS 长度，当前行从右向左更新，避免覆盖 ``dp[j-1]`` 所代表的左上状态。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int minDistance(std::string word1, std::string word2) {
           int n = static_cast<int>(word2.size());
           std::vector<int> dp(n + 1, 0);
           for (char first : word1) {
               int diagonal = 0;
               for (int j = 1; j <= n; ++j) {
                   int old = dp[j];
                   if (first == word2[j - 1]) {
                       dp[j] = diagonal + 1;
                   } else {
                       dp[j] = std::max(dp[j], dp[j - 1]);
                   }
                   diagonal = old;
               }
           }
           return static_cast<int>(word1.size() + word2.size()) -
                  2 * dp[n];
       }
   };

代码分析
--------

LCS 状态的匹配与跳过转移覆盖所有共同保留方案，删除非 LCS 字符后即可构造相同结果，故该下界可达。时间复杂度为 ``O(|word1|*|word2|)``，空间复杂度为 ``O(|word2|)``。
