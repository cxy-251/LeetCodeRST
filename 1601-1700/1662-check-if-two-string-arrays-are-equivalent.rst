1662. Check If Two String Arrays are Equivalent
===============================================

题目信息
--------

:题号: 1662
:难度: Easy
:主题: 字符串、双指针
:原题: `LeetCode 1662 <https://leetcode.com/problems/check-if-two-string-arrays-are-equivalent/>`_
:重点: 比较两个字符串数组按原顺序拼接后的完整字符串

题目重述
--------

给定两个字符串数组。若分别连接所有元素后得到的字符串完全相同，返回 ``true``，否则返回 ``false``。

自建示例
--------

.. code-block:: text

   输入：word1 = ["ab","c"], word2 = ["a","bc"]
   输出：true
   解释：两边拼接后都是 "abc"。

.. code-block:: text

   输入：word1 = ["a","b"], word2 = ["ab","c"]
   输出：false
   解释：拼接结果分别为 "ab" 与 "abc"。