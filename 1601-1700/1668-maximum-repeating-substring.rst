1668. Maximum Repeating Substring
=================================

题目信息
--------

:题号: 1668
:难度: Easy
:主题: 字符串、枚举
:原题: `LeetCode 1668 <https://leetcode.com/problems/maximum-repeating-substring/>`_
:重点: 找最大 ``k``，使 ``word`` 连续重复 ``k`` 次后是 ``sequence`` 的子串

题目重述
--------

给定 ``sequence`` 和 ``word``。返回 ``word`` 连续重复后仍出现在 ``sequence`` 中的最大次数；一次都不出现时返回 ``0``。

自建示例
--------

.. code-block:: text

   输入：sequence = "ababc", word = "ab"
   输出：2
   解释："abab" 是子串，而 "ababab" 不是。

.. code-block:: text

   输入：sequence = "xyz", word = "a"
   输出：0
   解释：word 本身都不是子串。