1616. Split Two Strings to Make Palindrome
==========================================

题目信息
--------

:题号: 1616
:难度: Medium
:主题: 字符串、双指针、回文
:原题: `LeetCode 1616 <https://leetcode.com/problems/split-two-strings-to-make-palindrome/>`_
:重点: 在相同位置切分两个等长字符串，检查 ``a`` 前缀加 ``b`` 后缀或反向组合

题目重述
--------

给定等长字符串 ``a`` 和 ``b``。选择一个切分位置，把两者分别分成前缀和后缀。若 ``a`` 的前缀与 ``b`` 的后缀，或 ``b`` 的前缀与 ``a`` 的后缀能组成回文串，返回 ``true``。

允许空前缀或空后缀。

自建示例
--------

.. code-block:: text

   输入：a = "abc", b = "cba"
   输出：true
   解释：在末尾切分时 a 本身不是回文，但在位置 1 切分可得到 "a" + "ba" = "aba"。

.. code-block:: text

   输入：a = "ab", b = "cd"
   输出：false
   解释：所有合法组合均不是回文串。