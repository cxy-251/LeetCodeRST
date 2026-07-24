1374. Generate a String With Characters That Have Odd Counts
============================================================

题目信息
--------

:题号: 1374
:难度: Easy
:主题: 字符串、构造、奇偶性
:原题: `LeetCode 1374 <https://leetcode.com/problems/generate-a-string-with-characters-that-have-odd-counts/>`_
:重点: 返回长度恰好为 ``n`` 的小写字符串，其中每种实际出现字符的出现次数都为奇数

题目重述
--------

给定正整数 ``n``。构造一个长度为 ``n`` 的小写英文字母字符串，使字符串中每个出现过的不同字符，其出现次数都是奇数。

任意满足条件的字符串均可返回，不要求使用固定字符数量。

``1 <= n <= 500``。

自建示例
--------

偶数长度可使用两个奇数频次字符：

.. code-block:: text

   输入：n = 4
   输出："aaab"
   解释：a 出现三次，b 出现一次，两种频次都为奇数。

长度为一时任意单字符均合法：

.. code-block:: text

   输入：n = 1
   输出："x"
   解释：x 出现一次。