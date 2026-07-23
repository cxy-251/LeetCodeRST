0192. Word Frequency
====================

题目信息
--------

:题号: 0192
:难度: Medium
:主题: Shell、文本统计、排序
:原题: `LeetCode 192 <https://leetcode.com/problems/word-frequency/>`_
:重点: 先把任意空白统一为逐词输入，再计数并按第二列数值降序排列。

题目重述
--------

读取 ``words.txt``。文件包含由空白字符分隔的单词，统计每个单词的出现次数，并按频次从高到低输出，每行格式为 ``word count``。

自建示例
--------

.. code-block:: text

   words.txt:
   the day is sunny the the
   the sunny is is

   输出:
   the 4
   is 3
   sunny 2
   day 1
