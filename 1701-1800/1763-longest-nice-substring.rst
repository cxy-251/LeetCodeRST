1763. Longest Nice Substring
============================

题目信息
--------

:题号: 1763
:难度: Easy
:主题: 字符串、分治、集合
:原题: `LeetCode 1763 <https://leetcode.com/problems/longest-nice-substring/>`_
:重点: 子串中每个出现字母的小写和大写形式都必须同时出现；并列取最早者

题目重述
--------

给定大小写英文字母字符串。返回最长的连续美好子串；若多个答案等长，返回起始位置最早者；不存在时返回空串。

自建示例
--------

.. code-block:: text

   输入：s = "YazaAay"
   输出："aAa"
   解释：a 与 A 都出现，且不存在更长合法子串。

.. code-block:: text

   输入：s = "abc"
   输出：""
   解释：没有任一字母同时出现大小写形式。