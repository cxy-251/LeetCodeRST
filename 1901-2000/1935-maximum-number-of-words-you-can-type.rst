1935. Maximum Number of Words You Can Type
==========================================

题目信息
--------

:题号: 1935
:难度: Easy
:主题: 字符串、集合
:原题: `LeetCode 1935 <https://leetcode.com/problems/maximum-number-of-words-you-can-type/>`_
:重点: 包含任意损坏字母的单词都无法输入

题目重述
--------

句子中的单词由单空格分隔。给定损坏键盘字母集合，返回完全不含损坏字母、因而可以输入的单词数量。

自建示例
--------

.. code-block:: text

   输入：text = "hello world code", brokenLetters = "od"
   输出：0
   解释：三个单词都含有 o 或 d。

.. code-block:: text

   输入：text = "hello world code", brokenLetters = "z"
   输出：3
   解释：没有单词包含损坏字母 z。
