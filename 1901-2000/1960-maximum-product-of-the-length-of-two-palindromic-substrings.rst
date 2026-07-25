1960. Maximum Product of the Length of Two Palindromic Substrings
================================================================

题目信息
--------

:题号: 1960
:难度: Hard
:主题: 回文串、Manacher、前后缀
:原题: `LeetCode 1960 <https://leetcode.com/problems/maximum-product-of-the-length-of-two-palindromic-substrings/>`_
:重点: 选择两个互不重叠的奇数长度回文子串，最大化长度乘积

题目重述
--------

在字符串中选择两个不重叠的非空奇数长度回文子串，返回它们长度乘积的最大值。

自建示例
--------

.. code-block:: text

   输入：s = "abacdc"
   输出：9
   解释：选择 "aba" 与 "cdc"，长度乘积为 3 × 3。

.. code-block:: text

   输入：s = "aa"
   输出：1
   解释：只能选择两个不同位置的单字符回文串。
