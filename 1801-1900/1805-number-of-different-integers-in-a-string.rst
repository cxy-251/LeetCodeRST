1805. Number of Different Integers in a String
==============================================

题目信息
--------

:题号: 1805
:难度: Easy
:主题: 字符串、哈希集合
:原题: `LeetCode 1805 <https://leetcode.com/problems/number-of-different-integers-in-a-string/>`_
:重点: 数字片段按整数值去重，前导零不影响数值

题目重述
--------

将字符串中的字母视为分隔符，提取所有连续数字片段。忽略前导零后，返回不同整数的数量。

自建示例
--------

.. code-block:: text

   输入：word = "a001b1c020d20"
   输出：2
   解释：数字片段对应整数 1、1、20、20。

.. code-block:: text

   输入：word = "letters"
   输出：0
   解释：字符串中没有数字片段。
