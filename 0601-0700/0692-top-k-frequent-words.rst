0692. Top K Frequent Words
==========================

题目信息
--------

:题号: 0692
:难度: Medium
:主题: 单词频率、前 k 名、字典序并列规则
:原题: `LeetCode 0692 <https://leetcode.com/problems/top-k-frequent-words/>`_
:重点: 相同单词按出现次数汇总、频率高者优先、频率相同时字典序较小者优先、返回恰好 k 个不同单词

题目重述
--------

给定小写英文单词数组 ``words`` 和整数 ``k``，统计每个不同单词的出现次数，返回频率最高的 ``k`` 个不同单词。

结果必须先按频率从高到低排序；若两个单词频率相同，则按普通字典序从小到大排列。``words.length`` 位于 ``[1, 500]``，每个单词长度位于 ``[1, 10]``，``k`` 位于 ``[1, 不同单词数量]``。

自建示例
--------

频率并列时比较字典序：

.. code-block:: text

   输入：words = ["pear","apple","pear","banana","apple","pear","banana"]，k = 2
   输出：["pear","apple"]
   解释：pear 出现三次；apple 和 banana 都出现两次，apple 的字典序更小，因此排在 banana 前并进入前两名。

所有单词频率相同：

.. code-block:: text

   输入：words = ["dog","cat","ant"]，k = 2
   输出：["ant","cat"]
   解释：三个单词都出现一次，按字典序选择并排列前两个单词。
