1629. Slowest Key
=================

题目信息
--------

:题号: 1629
:难度: Easy
:主题: 数组、持续时间、并列规则
:原题: `LeetCode 1629 <https://leetcode.com/problems/slowest-key/>`_
:重点: 第一次持续时间为 ``releaseTimes[0]``，其余为相邻释放时间之差；并列取字典序较大按键

题目重述
--------

给定按键释放时间和对应字符。计算每次按键持续时间，返回持续时间最长的字符；若并列，返回字典序更大的字符。

自建示例
--------

.. code-block:: text

   输入：releaseTimes = [2,5,9], keysPressed = "abc"
   输出："c"
   解释：持续时间分别为 2、3、4。

.. code-block:: text

   输入：releaseTimes = [3,6], keysPressed = "az"
   输出："z"
   解释：两次持续时间均为 3，并列时取 z。