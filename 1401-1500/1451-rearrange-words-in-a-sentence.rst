1451. Rearrange Words in a Sentence
===================================

题目信息
--------

:题号: 1451
:难度: Medium
:主题: 字符串、稳定排序
:原题: `LeetCode 1451 <https://leetcode.com/problems/rearrange-words-in-a-sentence/>`_
:重点: 按单词长度升序稳定排列，等长单词保持原顺序；结果仅首字符大写，其余字母小写

题目重述
--------

给定一个英文句子 ``text``，单词之间由单个空格分隔。原句只有第一个单词首字母大写，其余字母均为小写。

按单词长度从短到长重新排列；长度相同时保持原出现顺序。返回重新组成的句子，并使新句子只有首字符大写，其余字母小写。

``1 <= text.length <= 10^5``，句子没有首尾空格。

自建示例
--------

等长单词保持原相对顺序：

.. code-block:: text

   输入：text = "Keep calm now"
   输出："Now keep calm"
   解释：now 长度为 3，keep 与 calm 长度均为 4，并保持原先顺序。

只有一个单词时内容不变：

.. code-block:: text

   输入：text = "Hello"
   输出："Hello"
   解释：无需重新排列。