1178. Number of Valid Words for Each Puzzle
===========================================

题目信息
--------

:题号: 1178
:难度: Hard
:主题: 字符串、位掩码、子集枚举
:原题: `LeetCode 1178 <https://leetcode.com/problems/number-of-valid-words-for-each-puzzle/>`_
:重点: 有效单词必须包含谜面的首字母，并且单词中的每种字母都出现在该谜面中；重复字母不影响包含关系

题目重述
--------

给定单词数组 ``words`` 和谜面数组 ``puzzles``。每个谜面恰好包含 ``7`` 个互不相同的小写字母。

对于某个谜面，一个单词有效需要同时满足：单词包含谜面的第一个字母；单词中的每个字母都属于该谜面的七个字母。请为每个谜面统计有效单词数量，并按谜面顺序返回结果。

``1 <= words.length <= 10^5``，``4 <= words[i].length <= 50``；``1 <= puzzles.length <= 10^4``，``puzzles[i].length == 7`` 且字符互不相同；所有字符串只含小写英文字母。

自建示例
--------

首字母条件会排除字母集合相容的单词：

.. code-block:: text

   输入：words = ["apple","plea","ale","lap","pea"], puzzles = ["aelpxyz","lpaeuvw"]
   输出：[5,4]
   解释：第一个谜面要求包含 a，五个单词均满足；第二个谜面要求包含 l，"pea" 虽然字母都在谜面中，但不含 l，因此只有四个有效单词。

没有单词包含谜面首字母：

.. code-block:: text

   输入：words = ["aaaa"], puzzles = ["bcdefgh"]
   输出：[0]
   解释：单词不包含谜面的首字母 b，因此无效。