1704. Determine if String Halves Are Alike
==========================================

题目信息
--------

:题号: 1704
:难度: Easy
:主题: 字符串、元音计数
:原题: `LeetCode 1704 <https://leetcode.com/problems/determine-if-string-halves-are-alike/>`_
:重点: 比较等长前后两半中大小写元音字母数量

题目重述
--------

给定偶数长度字符串 ``s``。将其分成等长两半，若两部分包含的元音字符数量相同，返回 ``true``。

自建示例
--------

.. code-block:: text

   输入：s = "book"
   输出：true
   解释："bo" 和 "ok" 各含一个元音。

.. code-block:: text

   输入：s = "textbook"
   输出：false
   解释：前半含一个元音，后半含两个。