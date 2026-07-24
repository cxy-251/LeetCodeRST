1255. Maximum Score Words Formed by Letters
===========================================

题目信息
--------

:题号: 1255
:难度: Hard
:主题: 回溯、子集选择、字符计数
:原题: `LeetCode 1255 <https://leetcode.com/problems/maximum-score-words-formed-by-letters/>`_
:重点: 从 ``words`` 中选择一个子集，每个给定字母实例最多使用一次；单词得分为其字符分数之和，目标是最大化总分

题目重述
--------

给定单词数组 ``words``、可用字母多重集合 ``letters`` 和长度为 ``26`` 的分数数组 ``score``。字母 ``a`` 到 ``z`` 的分数分别由 ``score[0]`` 到 ``score[25]`` 给出。

可以选择若干单词，每个单词至多选择一次，并使用 ``letters`` 中的字母实例拼出所有被选单词。任何字母实例都不能重复使用。请返回可获得的最大总分；允许一个单词都不选。

``1 <= words.length <= 14``，``1 <= words[i].length <= 15``，``1 <= letters.length <= 100``，``score.length == 26``，``0 <= score[i] <= 10``。

自建示例
--------

字母数量足够时可以同时选择多个单词：

.. code-block:: text

   输入：words = ["ab","bc"], letters = ["a","b","b","c"], score(a)=1, score(b)=2, score(c)=3，其余为 0
   输出：8
   解释：两个单词可同时组成，得分分别为 3 和 5，总分为 8。

字母不足以组成任何完整单词时返回零：

.. code-block:: text

   输入：words = ["aa"], letters = ["a"], score(a)=5，其余为 0
   输出：0
   解释：只有一个 a，无法组成需要两个 a 的单词。