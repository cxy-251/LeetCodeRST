1771. Maximize Palindrome Length From Subsequences
==================================================

题目信息
--------

:题号: 1771
:难度: Hard
:主题: 最长回文子序列、动态规划
:原题: `LeetCode 1771 <https://leetcode.com/problems/maximize-palindrome-length-from-subsequences/>`_
:重点: 必须分别从 ``word1`` 与 ``word2`` 选择非空子序列后拼接成回文串

题目重述
--------

从两个字符串各选一个非空子序列，按 ``word1`` 子序列在前、``word2`` 子序列在后拼接。返回可形成回文串的最大长度；无法形成时返回 ``0``。

自建示例
--------

.. code-block:: text

   输入：word1 = "cacb", word2 = "cbba"
   输出：5
   解释：可从两边选择字符组成长度五的回文串。

.. code-block:: text

   输入：word1 = "a", word2 = "b"
   输出：0
   解释：两个非空子序列拼接为 "ab"，不是回文串。