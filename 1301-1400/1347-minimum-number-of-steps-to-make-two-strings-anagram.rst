1347. Minimum Number of Steps to Make Two Strings Anagram
=========================================================

题目信息
--------

:题号: 1347
:难度: Medium
:主题: 字符串、频次统计、变位词
:原题: `LeetCode 1347 <https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram/>`_
:重点: 每一步只能替换字符串 ``t`` 中的一个字符；求使 ``t`` 与 ``s`` 字符频次相同的最少替换次数

题目重述
--------

给定两个等长小写字符串 ``s`` 和 ``t``。一次操作可以选择 ``t`` 中任意位置，把该字符替换为另一个小写字母。

请返回使 ``t`` 成为 ``s`` 的字母异位词所需的最少操作次数。字符顺序不重要，只需各字母出现次数相同。

``1 <= s.length == t.length <= 5 * 10^4``。

自建示例
--------

每个缺少的字符需要一次替换：

.. code-block:: text

   输入：s = "aabb", t = "abcc"
   输出：2
   解释：t 比 s 少一个 a 和一个 b，把两个 c 分别替换即可。

已经互为异位词时无需操作：

.. code-block:: text

   输入：s = "abc", t = "cba"
   输出：0
   解释：两个字符串的字符频次完全相同。