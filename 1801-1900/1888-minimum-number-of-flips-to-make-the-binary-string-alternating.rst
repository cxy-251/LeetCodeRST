1888. Minimum Number of Flips to Make the Binary String Alternating
==================================================================

题目信息
--------

:题号: 1888
:难度: Medium
:主题: 滑动窗口、字符串
:原题: `LeetCode 1888 <https://leetcode.com/problems/minimum-number-of-flips-to-make-the-binary-string-alternating/>`_
:重点: 可反复把首字符移到末尾，再翻转任意字符

题目重述
--------

允许先进行任意次循环左移，再翻转任意位置的二进制字符。返回把字符串变成交替串所需的最少翻转次数。

自建示例
--------

.. code-block:: text

   输入：s = "010"
   输出：0
   解释：原字符串已经交替。

.. code-block:: text

   输入：s = "111"
   输出：1
   解释：翻转中间字符即可得到 101。
