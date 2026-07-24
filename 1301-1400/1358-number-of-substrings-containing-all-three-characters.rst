1358. Number of Substrings Containing All Three Characters
==========================================================

题目信息
--------

:题号: 1358
:难度: Medium
:主题: 字符串、滑动窗口、子串计数
:原题: `LeetCode 1358 <https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/>`_
:重点: 输入只包含 ``a``、``b``、``c``；统计同时至少包含一次三种字符的连续子串数量

题目重述
--------

给定只由 ``a``、``b`` 和 ``c`` 组成的字符串 ``s``。枚举所有连续非空子串。

请返回其中同时包含至少一个 ``a``、至少一个 ``b`` 和至少一个 ``c`` 的子串数量。相同内容但起止位置不同的子串分别计数。

``3 <= s.length <= 5 * 10^4``。

自建示例
--------

多个起点可以共享同一终点：

.. code-block:: text

   输入：s = "aaabc"
   输出：3
   解释：三个合法子串分别从下标 0、1、2 开始，并都在末尾 c 结束。

缺少任意一种字符时答案为零：

.. code-block:: text

   输入：s = "aaaa"
   输出：0
   解释：字符串中没有 b 和 c。