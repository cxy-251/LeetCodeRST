0467. Unique Substrings in Wraparound String
============================================

题目信息
--------

:题号: 0467
:难度: Medium
:主题: 小写字符串、环绕字母表、连续子串、不同结果计数
:原题: `LeetCode 0467 <https://leetcode.com/problems/unique-substrings-in-wraparound-string/>`_
:重点: 无限串按 ``a..z`` 循环、``z`` 后可接 ``a``、只统计 ``p`` 的连续子串、相同文本只计一次

题目重述
--------

考虑无限环绕字符串：

.. code-block:: text

   ...zabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz...

给定只包含小写英文字母的字符串 ``p``，统计 ``p`` 的不同非空连续子串中，有多少个也出现在该无限字符串中。

``p.length`` 位于 ``[1, 10^5]``。合法子串中相邻字符必须按字母表后继关系前进，并允许 ``z`` 后接 ``a``。同一字符串即使在 ``p`` 中出现多次，也只能计数一次。

自建示例
--------

跨越 z 到 a 的边界：

.. code-block:: text

   输入：p = "xyzab"
   输出：15
   解释：整个字符串按 x、y、z、a、b 连续环绕，所有 5×6/2 = 15 个连续子串都合法且互不相同。

没有长度大于一的合法子串：

.. code-block:: text

   输入：p = "cac"
   输出：2
   解释：不同单字符子串为 a 和 c；相邻字符 ca、ac 都不符合环绕后继关系，因此只有 2 个结果。
