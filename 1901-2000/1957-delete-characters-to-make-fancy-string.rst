1957. Delete Characters to Make Fancy String
============================================

题目信息
--------

:题号: 1957
:难度: Easy
:主题: 字符串、贪心
:原题: `LeetCode 1957 <https://leetcode.com/problems/delete-characters-to-make-fancy-string/>`_
:重点: 删除最少字符，使任意三个连续字符不完全相同

题目重述
--------

从字符串中删除部分字符，使结果中不存在三个连续相同字符。返回删除最少字符后的字符串。

自建示例
--------

.. code-block:: text

   输入：s = "aaabaaaa"
   输出："aabaa"
   解释：每段连续相同字符最多保留两个。

.. code-block:: text

   输入：s = "abc"
   输出："abc"
   解释：原字符串已经满足条件。
