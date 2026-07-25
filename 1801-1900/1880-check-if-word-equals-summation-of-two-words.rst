1880. Check if Word Equals Summation of Two Words
================================================

题目信息
--------

:题号: 1880
:难度: Easy
:主题: 字符串、模拟
:原题: `LeetCode 1880 <https://leetcode.com/problems/check-if-word-equals-summation-of-two-words/>`_
:重点: 将 a 到 j 映射为数字 0 到 9，拼接后按十进制整数比较

题目重述
--------

把每个单词中的字母 ``a`` 到 ``j`` 分别替换为数字 0 到 9，得到对应整数。判断前两个单词的数值之和是否等于目标单词数值。

自建示例
--------

.. code-block:: text

   输入：firstWord = "acb", secondWord = "cba", targetWord = "cdb"
   输出：true
   解释：021 + 210 = 231。

.. code-block:: text

   输入：firstWord = "aaa", secondWord = "a", targetWord = "b"
   输出：false
   解释：0 + 0 不等于 1。
