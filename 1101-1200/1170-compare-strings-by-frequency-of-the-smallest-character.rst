1170. Compare Strings by Frequency of the Smallest Character
============================================================

题目信息
--------

:题号: 1170
:难度: Medium
:主题: 字符串、字符频次、离线查询
:原题: `LeetCode 1170 <https://leetcode.com/problems/compare-strings-by-frequency-of-the-smallest-character/>`_
:重点: ``f(s)`` 是字符串中字典序最小字符的出现次数；对每个查询统计 ``f(word)`` 严格更大的单词数量

题目重述
--------

定义函数 ``f(s)``：找到字符串 ``s`` 中字典序最小的字符，并返回该字符在 ``s`` 中出现的次数。

给定查询数组 ``queries`` 和单词数组 ``words``。对于每个 ``queries[i]``，统计有多少个 ``words[j]`` 满足 ``f(words[j]) > f(queries[i])``，并按查询顺序返回结果数组。

``1 <= queries.length, words.length <= 2000``，每个字符串长度在 ``[1,10]`` 范围内，只包含小写英文字母。

自建示例
--------

严格比较最小字符频次：

.. code-block:: text

   输入：queries = ["bbb","cc"], words = ["a","aa","dddd"]
   输出：[1,1]
   解释：两个查询的 f 值分别为 3 和 2；单词的 f 值为 1、2、4，因此两次都只有 "dddd" 严格更大。

没有单词频次更大：

.. code-block:: text

   输入：queries = ["aaaa"], words = ["b","cc"]
   输出：[0]
   解释：查询的 f 值为 4，而两个单词的 f 值分别为 1 和 2。