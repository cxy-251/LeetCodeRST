0383. Ransom Note
=================

题目信息
--------

:题号: 0383
:难度: Easy
:主题: 两个字符串、字符频次、一次性使用、小写字母
:原题: `LeetCode 0383 <https://leetcode.com/problems/ransom-note/>`_
:重点: 杂志中的每个字符实例最多使用一次、字符顺序无关、每种字母数量必须足够

题目重述
--------

给定字符串 ``ransomNote`` 和 ``magazine``，判断能否从 ``magazine`` 提供的字符中取出若干字符，重新排列后组成完整的 ``ransomNote``。``magazine`` 中的每个字符位置最多使用一次。

两个字符串长度均位于 ``[1, 10^5]``，只包含小写英文字母。若 ``ransomNote`` 中任意字母所需次数超过它在 ``magazine`` 中的出现次数，应返回 ``false``；多余的杂志字符可以不使用。

自建示例
--------

杂志字符足够：

.. code-block:: text

   输入：ransomNote = "note"，magazine = "stone"
   输出：true
   解释：magazine 中各有一个 n、o、t、e，可以重新排列组成 note，多余的 s 不必使用。

重复字母不足：

.. code-block:: text

   输入：ransomNote = "aabc"，magazine = "abc"
   输出：false
   解释：目标需要两个 a，而 magazine 中只有一个 a，同一个字符位置不能使用两次。
