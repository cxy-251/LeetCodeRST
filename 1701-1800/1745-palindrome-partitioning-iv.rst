1745. Palindrome Partitioning IV
===============================

题目信息
--------

:题号: 1745
:难度: Hard
:主题: 字符串、动态规划、回文
:原题: `LeetCode 1745 <https://leetcode.com/problems/palindrome-partitioning-iv/>`_
:重点: 必须把整个字符串切成恰好三个连续非空回文子串

题目重述
--------

判断字符串 ``s`` 是否存在两个切分点，使三个连续非空部分全部为回文串。

自建示例
--------

.. code-block:: text

   输入：s = "abcbdd"
   输出：true
   解释：可切分为 "a"、"bcb"、"dd"。

.. code-block:: text

   输入：s = "abcd"
   输出：false
   解释：无法形成三个回文部分。