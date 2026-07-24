1312. Minimum Insertion Steps to Make a String Palindrome
=========================================================

题目信息
--------

:题号: 1312
:难度: Hard
:主题: 字符串、动态规划、最长回文子序列
:原题: `LeetCode 1312 <https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/>`_
:重点: 只能插入字符，不能删除或重排原字符；求使整个字符串成为回文串的最少插入次数

题目重述
--------

给定小写字符串 ``s``。每次操作可以在任意位置插入任意小写英文字母，原有字符的相对顺序保持不变。

请返回把整个字符串变成回文串所需的最少插入次数。

``1 <= s.length <= 500``。

自建示例
--------

保留较长回文子序列可减少插入：

.. code-block:: text

   输入：s = "abcda"
   输出：2
   解释：可以插入两个字符得到 "abcdcba"；一次插入不足以修复两组不匹配。

原字符串已经是回文串：

.. code-block:: text

   输入：s = "level"
   输出：0
   解释：无需插入任何字符。