1963. Minimum Number of Swaps to Make the String Balanced
========================================================

题目信息
--------

:题号: 1963
:难度: Medium
:主题: 贪心、括号、双指针
:原题: `LeetCode 1963 <https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced/>`_
:重点: 左右方括号数量相等，可交换任意两个位置

题目重述
--------

二进制括号串含相同数量的 ``[`` 与 ``]``。每次可交换任意两个字符，返回使字符串成为平衡括号串的最少交换次数。

自建示例
--------

.. code-block:: text

   输入：s = "]][["
   输出：1
   解释：交换第一个字符与最后一个字符即可得到 "[[]]"，因此只需一次。

.. code-block:: text

   输入：s = "[]"
   输出：0
   解释：字符串已经平衡。