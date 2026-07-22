0299. Bulls and Cows
====================

题目信息
--------

:题号: 0299
:难度: Medium
:主题: 哈希表、字符串、计数
:原题: `LeetCode 0299 <https://leetcode.com/problems/bulls-and-cows/>`_
:教学重点: 同位匹配、剩余频次、多重集合交集

题目重述
--------

给定等长数字字符串 ``secret`` 与 ``guess``，接口为 ``string getHint(string secret, string guess)``。位置和数字都相同的是 bull；数字存在但位置错误的是 cow，每个字符只能匹配一次。返回格式 ``"xAyB"``，字符串长度最多约 1000，允许重复数字。

自建示例
--------

.. code-block:: text

   输入：secret="1123", guess="0111"
   输出："1A1B"
