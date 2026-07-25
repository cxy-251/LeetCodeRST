1876. Substrings of Size Three with Distinct Characters
======================================================

题目信息
--------

:题号: 1876
:难度: Easy
:主题: 字符串、滑动窗口
:原题: `LeetCode 1876 <https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters/>`_
:重点: 统计长度恰为 3 且三个字符互不相同的连续子串

题目重述
--------

返回字符串中长度为 3、内部没有重复字符的连续子串数量。

自建示例
--------

.. code-block:: text

   输入：s = "xyzzab"
   输出：2
   解释：满足条件的子串是 "xyz" 和 "zab"。

.. code-block:: text

   输入：s = "aa"
   输出：0
   解释：字符串长度不足 3。
