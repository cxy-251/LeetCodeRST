0925. Long Pressed Name
=======================

题目信息
--------

:题号: 0925
:难度: Easy
:主题: 字符串、连续字符组、长按输入
:原题: `LeetCode 0925 <https://leetcode.com/problems/long-pressed-name/>`_
:重点: ``typed`` 必须按 ``name`` 的字符顺序产生；同一字符可以因长按连续重复，但不能新增不同字符、漏掉姓名字符或改变顺序

题目重述
--------

给定两个只含小写英文字母的字符串 ``name`` 和 ``typed``。输入姓名时，每按下一次按键会产生对应字符，但某次按键可能被长按，从而在 ``typed`` 中连续出现多个相同字符。

判断 ``typed`` 是否可能由完整输入 ``name`` 得到。``name`` 中每个字符至少要在对应位置输入一次；额外字符只能是紧跟其对应字符产生的连续重复，不能改变不同字符组的先后顺序。

``1 <= name.length, typed.length <= 1000``。

自建示例
--------

多个字符都发生长按：

.. code-block:: text

   输入：name = "alex", typed = "aaleexx"
   输出：true
   解释：a、e、x 分别被连续输入两次，l 输入一次；去除各字符组中的额外重复后正好得到 "alex"。

输入结果漏掉姓名字符：

.. code-block:: text

   输入：name = "anna", typed = "ana"
   输出：false
   解释：name 中连续的两个 n 都必须至少输入一次，而 typed 只有一个 n；长按只能增加字符，不能补救字符缺失。