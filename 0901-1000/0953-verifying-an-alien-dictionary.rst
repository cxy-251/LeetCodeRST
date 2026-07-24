0953. Verifying an Alien Dictionary
===================================

题目信息
--------

:题号: 0953
:难度: Easy
:主题: 字符串、定制字母顺序、字典序
:原题: `LeetCode 0953 <https://leetcode.com/problems/verifying-an-alien-dictionary/>`_
:重点: 使用 ``order`` 给出的完整字母优先级比较相邻单词；首个不同字符决定顺序，若一个单词是另一个的前缀则较短者必须在前

题目重述
--------

给定小写单词数组 ``words`` 和长度为 ``26`` 的字符串 ``order``。``order`` 是所有小写英文字母的一个排列，表示外星语言中字母从小到大的顺序。

按照该字母顺序判断 ``words`` 是否已经按非递减字典序排列。比较两个单词时，由第一个不同字符决定大小；若较短单词是较长单词的完整前缀，则较短单词更小。若数组有序返回 ``true``，否则返回 ``false``。

``1 <= words.length <= 100``，``1 <= words[i].length <= 20``。

自建示例
--------

第一个字母采用外星顺序：

.. code-block:: text

   输入：words = ["za","zb","ca"], order = "zabcdefghijklmnopqrstuvwxy"
   输出：true
   解释："za" 与 "zb" 在第二个字符处满足 a < b；"zb" 与 "ca" 在首字符处比较，外星顺序中 z 位于 c 之前。