1859. Sorting the Sentence
==========================

题目信息
--------

:题号: 1859
:难度: Easy
:主题: 字符串、排序
:原题: `LeetCode 1859 <https://leetcode.com/problems/sorting-the-sentence/>`_
:重点: 每个单词末尾数字表示其在原句中的位置

题目重述
--------

给定被打乱的句子，每个单词末尾附有 1 到单词数的序号。按序号恢复句子并移除数字。

自建示例
--------

.. code-block:: text

   输入：s = "is2 sentence4 This1 a3"
   输出："This is a sentence"
   解释：按末尾序号 1、2、3、4 排列单词。

.. code-block:: text

   输入：s = "word1"
   输出："word"
   解释：只有一个单词。
