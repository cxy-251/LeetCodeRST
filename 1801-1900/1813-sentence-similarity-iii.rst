1813. Sentence Similarity III
=============================

题目信息
--------

:题号: 1813
:难度: Medium
:主题: 字符串、双指针
:原题: `LeetCode 1813 <https://leetcode.com/problems/sentence-similarity-iii/>`_
:重点: 较短句子能否通过在某一位置插入连续单词变为较长句子

题目重述
--------

判断两个句子是否相似。若可以在其中一个句子的任意位置插入一段单词，使其与另一个句子完全相同，则返回 ``true``。

自建示例
--------

.. code-block:: text

   输入：sentence1 = "My name Alice", sentence2 = "My Alice"
   输出：true
   解释：在第二个句子的 My 与 Alice 之间插入 name。

.. code-block:: text

   输入：sentence1 = "a b", sentence2 = "a c"
   输出：false
   解释：替换单词不属于允许的插入操作。
