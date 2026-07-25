1807. Evaluate the Bracket Pairs of a String
============================================

题目信息
--------

:题号: 1807
:难度: Medium
:主题: 字符串、哈希表
:原题: `LeetCode 1807 <https://leetcode.com/problems/evaluate-the-bracket-pairs-of-a-string/>`_
:重点: 用知识表替换括号内键，缺失键替换为问号

题目重述
--------

字符串中每个括号对包含一个键。根据 ``knowledge`` 中的键值关系完成替换；不存在的键替换为 ``?``，并移除括号。

自建示例
--------

.. code-block:: text

   输入：s = "(x)+(y)", knowledge = [["x","a"],["y","b"]]
   输出："a+b"
   解释：两个键都能在知识表中找到。

.. code-block:: text

   输入：s = "(a)(b)", knowledge = [["a","x"]]
   输出："x?"
   解释：键 b 不存在，因此替换为问号。
