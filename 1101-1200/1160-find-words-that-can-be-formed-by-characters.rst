1160. Find Words That Can Be Formed by Characters
=================================================

题目信息
--------

:题号: 1160
:难度: Easy
:主题: 字符串、字符计数、多重集合
:原题: `LeetCode 1160 <https://leetcode.com/problems/find-words-that-can-be-formed-by-characters/>`_
:重点: 判断每个单词时都可独立使用 ``chars`` 中的字符；每个字符实例在同一单词内最多使用一次，返回所有可构成单词的长度总和

题目重述
--------

给定小写单词数组 ``words`` 和字符字符串 ``chars``。若可以从 ``chars`` 中选择字符并重新排列，恰好组成某个单词，则该单词是好单词。

判断单个单词时，``chars`` 中每个字符实例最多使用一次；不同单词之间的判断互不消耗字符。请返回全部好单词长度之和。

``1 <= words.length <= 1000``，``1 <= words[i].length, chars.length <= 100``，所有字符串只包含小写英文字母。

自建示例
--------

每个单词独立使用同一组字符：

.. code-block:: text

   输入：words = ["moon","mon","no"], chars = "mnoo"
   输出：9
   解释：三个单词都能由 chars 中的字符组成，长度分别为 4、3、2，总和为 9。

字符出现次数不足：

.. code-block:: text

   输入：words = ["aa","a"], chars = "a"
   输出：1
   解释："aa" 需要两个 a，无法组成；"a" 可以组成，因此只累加长度 1。