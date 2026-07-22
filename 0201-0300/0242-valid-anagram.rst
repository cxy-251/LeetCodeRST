0242. Valid Anagram
===================

题目信息
--------

:题号: 0242
:难度: Easy
:主题: 哈希表、字符串、排序
:原题: `LeetCode 0242 <https://leetcode.com/problems/valid-anagram/>`_
:教学重点: 字符频次、多重集合相等

题目重述
--------

给定两个仅含小写英文字母的字符串 ``s``、``t``，接口为 ``bool isAnagram(string s, string t)``。判断 ``t`` 是否能通过重新排列 ``s`` 的全部字符得到；字符数量必须完全一致。长度最多约 ``5 * 10^4``，返回布尔值，不修改输入。

自建示例
--------

.. code-block:: text

   输入：s="aabbc", t="abcab"
   输出：true

   输入：s="ab", t="aa"
   输出：false
