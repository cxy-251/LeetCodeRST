1754. Largest Merge Of Two Strings
==================================

题目信息
--------

:题号: 1754
:难度: Medium
:主题: 字符串、贪心
:原题: `LeetCode 1754 <https://leetcode.com/problems/largest-merge-of-two-strings/>`_
:重点: 每步从两个字符串当前首字符中选择一个，保持各自内部顺序并最大化结果字典序

题目重述
--------

反复从 ``word1`` 或 ``word2`` 的开头取一个字符追加到结果，直到两者为空。返回字典序最大的合并字符串。

自建示例
--------

.. code-block:: text

   输入：word1 = "cabaa", word2 = "bcaaa"
   输出："cbcabaaaaa"
   解释：比较剩余后缀决定相同或接近字符时的选择顺序。

.. code-block:: text

   输入：word1 = "a", word2 = "z"
   输出："za"
   解释：先取较大的 z。