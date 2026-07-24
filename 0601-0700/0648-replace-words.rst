0648. Replace Words
===================

题目信息
--------

:题号: 0648
:难度: Medium
:主题: 字典词根、前缀、最短替换、句子重建
:原题: `LeetCode 0648 <https://leetcode.com/problems/replace-words/>`_
:重点: 词根必须是单词前缀、存在多个可用词根时选最短者、没有词根时保留原词、单词顺序不变

题目重述
--------

给定互不相同的词根列表 ``dictionary`` 和由小写英文单词组成的句子 ``sentence``。若某个句子单词以词根开头，就用能够匹配它的最短词根替换该单词；若没有任何词根是它的前缀，则保留原单词。

返回完成所有替换后的句子，单词原有顺序不变，并继续使用单个空格分隔。``dictionary.length`` 位于 ``[1, 1000]``，每个词根长度位于 ``[1, 100]``，句子长度位于 ``[1, 10^6]``；输入只包含小写英文字母和分隔单词的空格。

自建示例
--------

多个词根匹配时选最短者：

.. code-block:: text

   输入：dictionary = ["cat","c","bat"]，sentence = "cattle battery dog"
   输出："c bat dog"
   解释：cattle 同时以 c 和 cat 开头，因此替换为更短的 c；battery 替换为 bat，dog 保持不变。

词根必须从单词开头匹配：

.. code-block:: text

   输入：dictionary = ["art"]，sentence = "smart artist"
   输出："smart art"
   解释：smart 中的 art 不位于开头，不能替换；artist 以 art 开头，因此替换为 art。
