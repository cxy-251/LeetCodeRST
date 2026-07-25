1653. Minimum Deletions to Make String Balanced
===============================================

题目信息
--------

:题号: 1653
:难度: Medium
:主题: 字符串、动态规划、前后缀
:原题: `LeetCode 1653 <https://leetcode.com/problems/minimum-deletions-to-make-string-balanced/>`_
:重点: 平衡字符串中不存在位于 ``b`` 之后的 ``a``

题目重述
--------

给定只含 ``a`` 和 ``b`` 的字符串。删除任意字符，使所有 ``a`` 都位于所有 ``b`` 之前，返回最少删除次数。

自建示例
--------

.. code-block:: text

   输入：s = "aababbab"
   输出：2
   解释：删除两个造成逆序的字符即可得到平衡串。

.. code-block:: text

   输入：s = "bbb"
   输出：0
   解释：没有 a 位于 b 之后。