1177. Can Make Palindrome from Substring
========================================

题目信息
--------

:题号: 1177
:难度: Medium
:主题: 字符串、前缀计数、回文重排
:原题: `LeetCode 1177 <https://leetcode.com/problems/can-make-palindrome-from-substring/>`_
:重点: 每次查询可先任意重排闭区间子串，再替换至多 ``k`` 个字符；判断能否形成回文串

题目重述
--------

给定小写字符串 ``s`` 和查询数组 ``queries``。每个查询 ``[left, right, k]`` 取出闭区间子串 ``s[left..right]``，允许任意重排其中字符，并最多把 ``k`` 个字符替换为任意小写字母。

判断处理后的子串能否成为回文串。每个查询彼此独立，不会真正修改原字符串。请按查询顺序返回布尔结果数组。

``1 <= s.length, queries.length <= 10^5``，``0 <= left <= right < s.length``，``0 <= k <= 26``，字符串只含小写英文字母。

自建示例
--------

不同区间需要的替换次数不同：

.. code-block:: text

   输入：s = "abcba", queries = [[0,4,0],[0,3,1],[1,2,0]]
   输出：[true,true,false]
   解释：整个字符串已经是回文；"abcb" 有两个奇数频次字符，一次替换即可处理；"bc" 在不替换时无法重排成回文。

单字符区间不需要替换：

.. code-block:: text

   输入：s = "xyz", queries = [[2,2,0]]
   输出：[true]
   解释：任意单字符字符串本身都是回文串。