1297. Maximum Number of Occurrences of a Substring
==================================================

题目信息
--------

:题号: 1297
:难度: Medium
:主题: 字符串、滑动窗口、频次统计
:原题: `LeetCode 1297 <https://leetcode.com/problems/maximum-number-of-occurrences-of-a-substring/>`_
:重点: 统计长度位于 ``[minSize,maxSize]`` 且不同字符数不超过 ``maxLetters`` 的子串出现次数，返回最大频次

题目重述
--------

给定小写字符串 ``s`` 和整数 ``maxLetters``、``minSize``、``maxSize``。一个连续子串只有在不同字符数量不超过 ``maxLetters``，且长度位于指定闭区间内时才合法。

请返回任意合法子串在 ``s`` 中出现次数的最大值。不同起始位置分别计数；若不存在合法子串，返回 ``0``。

``1 <= s.length <= 10^5``，``1 <= maxLetters <= 26``，``1 <= minSize <= maxSize <= min(26, s.length)``。

自建示例
--------

重复子串可以在相邻位置重叠：

.. code-block:: text

   输入：s = "aaaa", maxLetters = 1, minSize = 2, maxSize = 3
   输出：3
   解释：合法子串 "aa" 从下标 0、1、2 开始出现三次。

不同字符数超限时没有合法结果：

.. code-block:: text

   输入：s = "abc", maxLetters = 1, minSize = 2, maxSize = 2
   输出：0
   解释：每个长度为 2 的子串都包含两个不同字符。