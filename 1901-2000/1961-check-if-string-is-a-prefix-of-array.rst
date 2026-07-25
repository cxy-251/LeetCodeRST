1961. Check If String Is a Prefix of Array
==========================================

题目信息
--------

:题号: 1961
:难度: Easy
:主题: 字符串、数组、双指针
:原题: `LeetCode 1961 <https://leetcode.com/problems/check-if-string-is-a-prefix-of-array/>`_
:重点: 必须连接 ``words`` 的前若干个完整单词，不能截断单词

题目重述
--------

判断字符串 ``s`` 是否恰好等于 ``words`` 中前 ``k`` 个单词按顺序连接的结果，其中 ``k >= 1``。

自建示例
--------

.. code-block:: text

   输入：s = "ilove", words = ["i","love","coding"]
   输出：true
   解释：连接前两个单词得到 "ilove"。

.. code-block:: text

   输入：s = "abc", words = ["a","b"]
   输出：false
   解释：全部单词连接后只有 "ab"。
