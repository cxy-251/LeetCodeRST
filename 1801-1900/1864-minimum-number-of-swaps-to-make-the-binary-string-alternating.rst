1864. Minimum Number of Swaps to Make the Binary String Alternating
==================================================================

题目信息
--------

:题号: 1864
:难度: Medium
:主题: 贪心、字符串
:原题: `LeetCode 1864 <https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-binary-string-alternating/>`_
:重点: 可交换任意两个位置，求变成交替串的最少交换数，不可能返回 -1

题目重述
--------

允许交换二进制字符串中的任意两个字符。返回使相邻字符始终不同所需的最少交换次数；无法做到时返回 -1。

自建示例
--------

.. code-block:: text

   输入：s = "111000"
   输出：1
   解释：交换下标 1 与 4 后可得到 101010。

.. code-block:: text

   输入：s = "1110"
   输出：-1
   解释：0 与 1 的数量差超过 1，无法形成交替串。
