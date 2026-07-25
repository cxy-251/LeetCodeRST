1576. Replace All ?'s to Avoid Consecutive Repeating Characters
===============================================================

题目信息
--------

:题号: 1576
:难度: Easy
:主题: 字符串、贪心、字符替换
:原题: `LeetCode 1576 <https://leetcode.com/problems/replace-all-s-to-avoid-consecutive-repeating-characters/>`_
:重点: 只替换问号，每个问号改为小写字母；结果中任意相邻字符必须不同，任意合法结果均可

题目重述
--------

给定由小写英文字母和字符 ``?`` 组成的字符串 ``s``。题目保证原有的相邻字母不会相同。

请把每个问号替换为某个小写英文字母，使最终字符串中不存在两个相邻相同字符。返回任意一个合法结果。

``1 <= s.length <= 100``。

自建示例
--------

问号需要同时避开左右邻居：

.. code-block:: text

   输入：s = "?a?"
   输出："bab"
   解释：两个问号都替换为 b，且 b 与相邻的 a 不同。

没有问号时原字符串直接有效：

.. code-block:: text

   输入：s = "abc"
   输出："abc"
   解释：原字符串已不存在相邻重复字符。