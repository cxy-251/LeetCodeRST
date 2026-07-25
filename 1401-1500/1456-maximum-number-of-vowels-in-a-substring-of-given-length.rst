1456. Maximum Number of Vowels in a Substring of Given Length
=============================================================

题目信息
--------

:题号: 1456
:难度: Medium
:主题: 字符串、滑动窗口、计数
:原题: `LeetCode 1456 <https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/>`_
:重点: 在所有长度恰为 ``k`` 的连续子串中，最大化元音 ``a/e/i/o/u`` 的数量

题目重述
--------

给定小写字符串 ``s`` 和整数 ``k``。枚举所有长度恰好为 ``k`` 的连续子串，统计其中元音字母 ``a``、``e``、``i``、``o``、``u`` 的数量。

请返回任一长度为 ``k`` 的子串能够包含的最大元音数。

``1 <= s.length <= 10^5``，``1 <= k <= s.length``。

自建示例
--------

窗口可以完全由元音组成：

.. code-block:: text

   输入：s = "aeiob", k = 2
   输出：2
   解释：前两个字符组成的子串 "ae" 含有两个元音。

字符串不含元音时返回零：

.. code-block:: text

   输入：s = "rhythm", k = 3
   输出：0
   解释：任意长度为三的子串都不含五个指定元音。