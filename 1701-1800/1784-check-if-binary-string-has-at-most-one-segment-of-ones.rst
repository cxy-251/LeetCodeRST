1784. Check if Binary String Has at Most One Segment of Ones
===========================================================

题目信息
--------

:题号: 1784
:难度: Easy
:主题: 字符串、连续段
:原题: `LeetCode 1784 <https://leetcode.com/problems/check-if-binary-string-has-at-most-one-segment-of-ones/>`_
:重点: 字符串以 ``1`` 开头，判断是否出现过 ``01`` 模式

题目重述
--------

给定二进制字符串。若其中所有 ``1`` 都位于同一个连续段内，返回 ``true``；否则返回 ``false``。

自建示例
--------

.. code-block:: text

   输入：s = "1100"
   输出：true
   解释：所有 1 连续出现在开头。

.. code-block:: text

   输入：s = "101"
   输出：false
   解释：两个 1 段被 0 分隔。