1910. Remove All Occurrences of a Substring
===========================================

题目信息
--------

:题号: 1910
:难度: Medium
:主题: 字符串、栈、模拟
:原题: `LeetCode 1910 <https://leetcode.com/problems/remove-all-occurrences-of-a-substring/>`_
:重点: 反复删除当前最左侧的 ``part``，直到不再出现

题目重述
--------

在字符串 ``s`` 中不断找到最左侧出现的 ``part`` 并删除它。返回无法继续删除时的字符串。

自建示例
--------

.. code-block:: text

   输入：s = "aaaaa", part = "aa"
   输出："a"
   解释：连续删除两个最左侧的 "aa" 后剩一个字符。

.. code-block:: text

   输入：s = "abc", part = "x"
   输出："abc"
   解释：part 从未出现。
