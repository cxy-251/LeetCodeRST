1849. Splitting a String Into Descending Consecutive Values
==========================================================

题目信息
--------

:题号: 1849
:难度: Medium
:主题: 回溯、字符串、枚举
:原题: `LeetCode 1849 <https://leetcode.com/problems/splitting-a-string-into-descending-consecutive-values/>`_
:重点: 至少拆成两个整数，后一个必须恰好比前一个小 1

题目重述
--------

判断数字字符串能否切分成至少两个非负整数，使相邻整数严格递减且差值恒为 1。片段可以包含前导零。

自建示例
--------

.. code-block:: text

   输入：s = "3210"
   输出：true
   解释：可以拆成 3、2、1、0。

.. code-block:: text

   输入：s = "1234"
   输出：false
   解释：无法得到连续递减且差为 1 的序列。
