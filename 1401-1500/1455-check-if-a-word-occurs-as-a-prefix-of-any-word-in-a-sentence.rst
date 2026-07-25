1455. Check If a Word Occurs As a Prefix of Any Word in a Sentence
==================================================================

题目信息
--------

:题号: 1455
:难度: Easy
:主题: 字符串、前缀匹配
:原题: `LeetCode 1455 <https://leetcode.com/problems/check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence/>`_
:重点: 按句中单词顺序寻找第一个以 ``searchWord`` 开头的单词，返回一基下标；不存在返回 ``-1``

题目重述
--------

给定由单个空格分隔的小写英文句子 ``sentence`` 和字符串 ``searchWord``。

请找到句子中第一个以前缀 ``searchWord`` 开头的单词，并返回它在句子中的一基位置。若不存在这样的单词，返回 ``-1``。

``1 <= sentence.length <= 100``，``1 <= searchWord.length <= 10``。

自建示例
--------

多个单词匹配时返回最早位置：

.. code-block:: text

   输入：sentence = "alpha beta alpine", searchWord = "al"
   输出：1
   解释：第一个单词 alpha 已经以前缀 al 开头。

没有匹配前缀时返回负一：

.. code-block:: text

   输入：sentence = "one two", searchWord = "three"
   输出：-1
   解释：两个单词都不以 three 开头。