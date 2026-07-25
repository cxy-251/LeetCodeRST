1593. Split a String Into the Max Number of Unique Substrings
=============================================================

题目信息
--------

:题号: 1593
:难度: Medium
:主题: 字符串、回溯、集合
:原题: `LeetCode 1593 <https://leetcode.com/problems/split-a-string-into-the-max-number-of-unique-substrings/>`_
:重点: 把整个字符串切成若干非空连续片段，所有片段内容必须两两不同；最大化片段数量

题目重述
--------

给定小写字符串 ``s``。选择若干切分位置，把整个字符串按原顺序划分为非空连续子串。

要求所有得到的子串内容互不相同。请返回能够得到的最大子串数量。

``1 <= s.length <= 16``。

自建示例
--------

重复字符可以通过不同长度片段避免重复：

.. code-block:: text

   输入：s = "abab"
   输出：3
   解释：可以切分为 "a"、"b"、"ab"，三个子串互不相同。

所有字符互不相同时可以逐字符切分：

.. code-block:: text

   输入：s = "abc"
   输出：3
   解释：切成 "a"、"b"、"c" 即达到字符串长度上限。