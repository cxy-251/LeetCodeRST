1736. Latest Time by Replacing Hidden Digits
============================================

题目信息
--------

:题号: 1736
:难度: Easy
:主题: 字符串、贪心
:原题: `LeetCode 1736 <https://leetcode.com/problems/latest-time-by-replacing-hidden-digits/>`_
:重点: 用数字替换问号，构造合法 24 小时时间中的最晚值

题目重述
--------

给定格式 ``hh:mm`` 的字符串，部分数字为 ``?``。替换所有问号，使时间位于 ``00:00`` 到 ``23:59``，返回最晚时间。

自建示例
--------

.. code-block:: text

   输入：time = "?4:5?"
   输出："14:59"
   解释：小时个位为 4 时，十位最大只能为 1。

.. code-block:: text

   输入：time = "??:??"
   输出："23:59"
   解释：完全未知时选择当天最晚时间。