1078. Occurrences After Bigram
==============================

题目信息
--------

:题号: 1078
:难度: Easy
:主题: 文本分词、连续三词、顺序收集
:原题: `LeetCode 1078 <https://leetcode.com/problems/occurrences-after-bigram/>`_
:重点: 查找文本中连续出现的 ``first second third`` 三词片段，并按出现顺序返回每个对应的 ``third``；重复结果需要保留

题目重述
--------

给定由小写单词和单个空格组成的字符串 ``text``，以及两个小写单词 ``first`` 和 ``second``。把文本按空格分成单词序列。

对于每个下标 ``i``，若第 ``i`` 个单词等于 ``first``、第 ``i + 1`` 个单词等于 ``second``，则把第 ``i + 2`` 个单词加入结果。只处理确实存在第三个单词的位置，并按文本中的出现顺序返回结果。

``1 <= text.length <= 1000``，文本没有首尾空格且相邻单词之间恰好一个空格；所有单词只含小写英文字母。

自建示例
--------

同一二元短语可以出现多次：

.. code-block:: text

   输入：text = "we will we will rock you", first = "we", second = "will"
   输出：["we","rock"]
   解释：前两个匹配片段分别是 "we will we" 和 "we will rock"，因此依次收集第三个单词 we 与 rock。
