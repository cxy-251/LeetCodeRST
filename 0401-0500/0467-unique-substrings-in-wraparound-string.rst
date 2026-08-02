0467. Unique Substrings in Wraparound String
============================================

题目信息
--------

:题号: 0467
:难度: Medium
:主题: 小写字符串、环绕字母表、连续子串、不同结果计数
:原题: `LeetCode 0467 <https://leetcode.com/problems/unique-substrings-in-wraparound-string/>`_
:重点: 无限串按 ``a..z`` 循环、``z`` 后可接 ``a``、只统计 ``p`` 的连续子串、相同文本只计一次

题目重述
--------

考虑无限环绕字符串：

.. code-block:: text

   ...zabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz...

给定只包含小写英文字母的字符串 ``p``，统计 ``p`` 的不同非空连续子串中，有多少个也出现在该无限字符串中。

``p.length`` 位于 ``[1, 10^5]``。合法子串中相邻字符必须按字母表后继关系前进，并允许 ``z`` 后接 ``a``。同一字符串即使在 ``p`` 中出现多次，也只能计数一次。

自建示例
--------

跨越 z 到 a 的边界：

.. code-block:: text

   输入：p = "xyzab"
   输出：15
   解释：整个字符串按 x、y、z、a、b 连续环绕，所有 5×6/2 = 15 个连续子串都合法且互不相同。

没有长度大于一的合法子串：

.. code-block:: text

   输入：p = "cac"
   输出：2
   解释：不同单字符子串为 a 和 c；相邻字符 ca、ac 都不符合环绕后继关系，因此只有 2 个结果。

记录每个结尾字母能达到的最长长度
--------------------------------

若当前位置与前一字符满足环绕后继关系，则以当前位置结尾的合法连续段长度加 1；否则从 1 重新开始。设某个字母 ``c`` 作为结尾时出现过的最大长度为 ``best[c]``，那么长度 ``1..best[c]`` 的后缀都以 ``c`` 结尾且合法，每个长度对应一个不同的字符串。

同一字母的短合法串可能在多个位置重复出现，但只取最大长度就已经包含所有更短前缀，因此答案是 26 个最大长度之和。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findSubstringInWraproundString(std::string p) {
           std::array<int, 26> best{};
           int length = 0;
           for (int i = 0; i < static_cast<int>(p.size()); ++i) {
               if (i > 0 &&
                   (p[i] - p[i - 1] + 26) % 26 == 1) {
                   ++length;
               } else {
                   length = 1;
               }
               int letter = p[i] - 'a';
               best[letter] = std::max(best[letter], length);
           }

           return std::accumulate(best.begin(), best.end(), 0);
       }
   };

代码分析
--------

``length`` 表示当前合法段的最大后缀长度，只有满足 ``z -> a`` 或普通相邻后继时才延长。对每个结尾字母只保留最大值，消除了重复子串的重复计数；时间复杂度为 ``O(|p|)``，额外空间复杂度为 ``O(1)``。
