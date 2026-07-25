1790. Check if One String Swap Can Make Strings Equal
====================================================

题目信息
--------

:题号: 1790
:难度: Easy
:主题: 字符串、差异位置
:原题: `LeetCode 1790 <https://leetcode.com/problems/check-if-one-string-swap-can-make-strings-equal/>`_
:重点: 最多在其中一个字符串内交换两个位置一次

题目重述
--------

给定等长字符串 ``s1`` 和 ``s2``。判断是否能通过至多一次交换 ``s1`` 中两个字符，使其等于 ``s2``。

自建示例
--------

.. code-block:: text

   输入：s1 = "bank", s2 = "kanb"
   输出：true
   解释：交换 s1 的首尾字符即可。

.. code-block:: text

   输入：s1 = "attack", s2 = "defend"
   输出：false
   解释：差异位置超过两个，单次交换无法修复。