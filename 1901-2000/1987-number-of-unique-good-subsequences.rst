1987. Number of Unique Good Subsequences
=======================================

题目信息
--------

:题号: 1987
:难度: Hard
:主题: 动态规划、字符串
:原题: `LeetCode 1987 <https://leetcode.com/problems/number-of-unique-good-subsequences/>`_
:重点: 好子序列不能有前导零，单独的字符串 ``0`` 例外，按内容去重

题目重述
--------

统计二进制字符串中内容不同的非空子序列数量，使子序列没有前导零，或子序列恰好为 ``0``。结果取模。

自建示例
--------

.. code-block:: text

   输入：binary = "101"
   输出：5
   解释：不同好子序列为 "0"、"1"、"10"、"11"、"101"。

.. code-block:: text

   输入：binary = "0"
   输出：1
   解释：单独的 "0" 被视为好子序列。
