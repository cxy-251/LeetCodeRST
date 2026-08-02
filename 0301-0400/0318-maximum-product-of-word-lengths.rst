0318. Maximum Product of Word Lengths
=====================================

题目信息
--------

:题号: 0318
:难度: Medium
:主题: 字符串数组、字符集合、两两选择、最大乘积
:原题: `LeetCode 0318 <https://leetcode.com/problems/maximum-product-of-word-lengths/>`_
:重点: 两个单词不能共享任何字母、同一字母重复出现仍只表示共享、无合法单词对时返回 0

题目重述
--------

给定字符串数组 ``words``，每个字符串只包含小写英文字母。从数组中选择两个不同下标的单词，要求二者没有任何共同字母，并计算它们长度的乘积。返回所有合法单词对能够得到的最大乘积。

``words`` 的长度位于 ``[2, 1000]``，每个单词长度位于 ``[1, 1000]``。判断是否共享字符只关心字母是否出现，不关心出现次数；若任意两个单词都至少共享一个字母，则返回 ``0``。

自建示例
--------

最长的两个单词恰好没有公共字母：

.. code-block:: text

   输入：words = ["ab", "cde", "afg", "hi"]
   输出：9
   解释："cde" 与 "afg" 的字符集合互不相交，长度乘积为 3*3=9；其他合法单词对的乘积都不超过 9。

不存在合法单词对：

.. code-block:: text

   输入：words = ["aa", "ab", "ac"]
   输出：0
   解释：任意两个单词都包含字母 a，因此没有一对满足条件。

把每个单词压成 26 位集合
------------------------

一个单词是否包含某个字母只需要一个布尔状态，因此可以用整数的第 ``c - 'a'`` 位表示字母 ``c`` 是否出现。两个单词的掩码按位与为零，当且仅当它们没有公共字母；单词内部同一字母重复出现不会改变掩码。

先按掩码记录同一字符集合下的最长单词。相同掩码的两个单词不可能合法配对，较短者也不可能在与第三个单词的乘积中优于同掩码的较长者，因此保留每个掩码的最大长度即可。最后枚举不同掩码的两两组合，更新合法乘积。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int maxProduct(std::vector<std::string>& words) {
           std::unordered_map<int, int> longest;
           for (const std::string& word : words) {
               int mask = 0;
               for (char c : word) {
                   mask |= 1 << (c - 'a');
               }
               longest[mask] = std::max(longest[mask],
                                        static_cast<int>(word.size()));
           }

           std::vector<std::pair<int, int>> groups(
               longest.begin(), longest.end());
           int answer = 0;
           for (int i = 0; i < static_cast<int>(groups.size()); ++i) {
               for (int j = i + 1;
                    j < static_cast<int>(groups.size()); ++j) {
                   if ((groups[i].first & groups[j].first) == 0) {
                       answer = std::max(answer,
                           groups[i].second * groups[j].second);
                   }
               }
           }
           return answer;
       }
   };

代码分析
--------

位运算一次就能完成字符集合相交判断，避免对每一对单词重复扫描字符。压缩同掩码单词不会改变最优值，且在重复字符集合较多时减少配对数量。设保留下来的掩码数为 ``u``，建掩码需要 ``O(所有单词字符总数)``，配对需要 ``O(u^2)``，额外空间为 ``O(u)``。
