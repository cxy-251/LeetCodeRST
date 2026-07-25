1717. Maximum Score From Removing Substrings
============================================

题目信息
--------

:题号: 1717
:难度: Medium
:主题: 贪心、栈、字符串
:原题: `LeetCode 1717 <https://leetcode.com/problems/maximum-score-from-removing-substrings/>`_
:重点: 删除 ``ab`` 得 ``x`` 分，删除 ``ba`` 得 ``y`` 分，删除后字符串重新连接

题目重述
--------

可反复删除相邻子串 ``ab`` 或 ``ba`` 并获得对应分数。返回最优删除顺序下的最大总分。

自建示例
--------

.. code-block:: text

   输入：s = "abba", x = 5, y = 3
   输出：8
   解释：先删 ab 得 5，再删剩余 ba 得 3。

.. code-block:: text

   输入：s = "cccc", x = 4, y = 7
   输出：0
   解释：没有可删除模式。