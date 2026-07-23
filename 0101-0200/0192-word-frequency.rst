0192. Word Frequency
====================

题目信息
--------

:题号: 0192
:难度: Medium
:主题: Shell、文本分词、频次统计、数值排序
:原题: `LeetCode 192 <https://leetcode.com/problems/word-frequency/>`_
:重点: words.txt 输入、空白分隔、每词一行、按频次降序

题目重述
--------

编写 Bash 脚本读取当前目录中的 ``words.txt``。文件由若干行文本组成，单词之间可能使用一个或多个空白字符分隔。统计每个不同单词在整个文件中的出现次数。

输出时每个单词只占一行，格式为 ``word count``，单词与次数之间使用一个空格；所有行按出现次数从高到低排列。统计范围跨越文件中的全部行，而不是逐行分别计算。

自建示例
--------

.. code-block:: text

   words.txt:
   red   blue red
   green blue red
   blue

   输出：
   blue 3
   red 3
   green 1

   解释：blue 与 red 在整个文件中都出现三次，green 出现一次；输出按频次降序排列，并把连续空格与换行都视为单词分隔符。