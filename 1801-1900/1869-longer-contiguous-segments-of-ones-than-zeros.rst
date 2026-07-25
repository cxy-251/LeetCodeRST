1869. Longer Contiguous Segments of Ones than Zeros
===================================================

题目信息
--------

:题号: 1869
:难度: Easy
:主题: 字符串、连续段
:原题: `LeetCode 1869 <https://leetcode.com/problems/longer-contiguous-segments-of-ones-than-zeros/>`_
:重点: 比较最长连续 1 段与最长连续 0 段，必须严格更长

题目重述
--------

返回二进制字符串中最长连续 1 段的长度是否严格大于最长连续 0 段的长度。

自建示例
--------

.. code-block:: text

   输入：s = "11100"
   输出：true
   解释：最长 1 段长度为 3，最长 0 段长度为 2。

.. code-block:: text

   输入：s = "11000111"
   输出：false
   解释：最长 1 段和最长 0 段长度都为 3，不满足严格大于。
