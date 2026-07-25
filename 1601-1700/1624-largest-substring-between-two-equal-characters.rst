1624. Largest Substring Between Two Equal Characters
====================================================

题目信息
--------

:题号: 1624
:难度: Easy
:主题: 字符串、首次位置
:原题: `LeetCode 1624 <https://leetcode.com/problems/largest-substring-between-two-equal-characters/>`_
:重点: 选择两个相同字符，返回它们之间字符数量的最大值

题目重述
--------

给定小写字符串 ``s``。在两个相同字符之间形成子串，端点字符不计入长度。返回最大长度；没有重复字符时返回 ``-1``。

自建示例
--------

.. code-block:: text

   输入：s = "abca"
   输出：2
   解释：两个 a 之间是 "bc"。

.. code-block:: text

   输入：s = "xyz"
   输出：-1
   解释：没有任意两个相同字符。