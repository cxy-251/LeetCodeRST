0424. Longest Repeating Character Replacement
==============================================

题目信息
--------

:题号: 0424
:难度: Medium
:主题: 大写字符串、至多 ``k`` 次替换、连续子串、相同字符
:原题: `LeetCode 0424 <https://leetcode.com/problems/longest-repeating-character-replacement/>`_
:重点: 只能替换字符不能重排、选择的是连续子串、替换后子串内所有字符相同、操作次数可以少于 ``k``

题目重述
--------

给定只包含大写英文字母的字符串 ``s`` 和非负整数 ``k``。最多可以选择 ``k`` 个位置，把其中的字符替换成任意大写英文字母。返回经过这些操作后，字符串中能够出现的最长连续同字符子串长度。

``s.length`` 位于 ``[1, 10^5]``，``k`` 位于 ``[0, s.length]``。不要求必须使用完全部 ``k`` 次替换；不能删除、插入或重新排列字符。只返回最大长度，不需要返回修改后的字符串或子串位置。

自建示例
--------

一次替换扩展末尾重复段：

.. code-block:: text

   输入：s = "ABACCC"，k = 1
   输出：4
   解释：把紧邻三个 C 的 A 替换为 C，可以得到连续四个 C；一次替换无法形成长度为 5 的同字符子串。

不允许替换：

.. code-block:: text

   输入：s = "AABBA"，k = 0
   输出：2
   解释：不能改变任何字符，最长现有重复段是 AA 或 BB，长度均为 2。

窗口长度减去最高频次就是所需替换数
--------------------------------------

维护一个滑动窗口和窗口内每个大写字母的频次。若把窗口中出现次数最多的字符保留为目标字符，其余字符都替换掉即可使整个窗口相同，所需次数为 ``windowLength - maxFrequency``。当这个数量超过 ``k`` 时，移动左端并归还字符；否则用窗口长度更新答案。

``maxFrequency`` 可以只增不减：它是窗口历史上的上界，偶尔比当前窗口真实最高频次大只会让窗口暂时显得更宽，不会让最终记录的最大合法长度超过真实答案；左端仍会在必要时继续收缩。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int characterReplacement(std::string s, int k) {
           std::array<int, 26> frequency{};
           int left = 0;
           int maxFrequency = 0;
           int answer = 0;

           for (int right = 0;
                right < static_cast<int>(s.size()); ++right) {
               maxFrequency = std::max(
                   maxFrequency, ++frequency[s[right] - 'A']);
               while (right - left + 1 - maxFrequency > k) {
                   --frequency[s[left] - 'A'];
                   ++left;
               }
               answer = std::max(answer, right - left + 1);
           }
           return answer;
       }
   };

代码分析
--------

窗口保持“可由至多 ``k`` 次替换统一”的条件，最长合法窗口就是答案；字符频次固定为 26，左右指针各走一次。时间复杂度为 ``O(n)``，额外空间为 ``O(1)``。
