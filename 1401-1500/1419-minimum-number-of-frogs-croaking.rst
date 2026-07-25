1419. Minimum Number of Frogs Croaking
======================================

题目信息
--------

:题号: 1419
:难度: Medium
:主题: 字符串、状态计数、并发序列
:原题: `LeetCode 1419 <https://leetcode.com/problems/minimum-number-of-frogs-croaking/>`_
:重点: 每只青蛙必须按 ``c-r-o-a-k`` 顺序完整鸣叫；字符流可由多只青蛙交错产生，求同时鸣叫的最少数量，非法时返回 ``-1``

题目重述
--------

给定只包含 ``c``、``r``、``o``、``a``、``k`` 的字符串 ``croakOfFrogs``。每只青蛙的一次叫声必须严格形成完整单词 ``"croak"``，多只青蛙的字符可以交错出现。

若字符串能够由若干只青蛙的完整叫声组成，返回过程中同时处于鸣叫状态的最少青蛙数量；若字符顺序非法或存在未完成叫声，返回 ``-1``。

``1 <= croakOfFrogs.length <= 10^5``。

自建示例
--------

两段叫声完全交错时需要两只青蛙：

.. code-block:: text

   输入：croakOfFrogs = "ccrrooaakk"
   输出：2
   解释：两个 c 在任何 k 出现前都已开始两段叫声，因此至少需要两只青蛙。

存在未完成叫声时输入非法：

.. code-block:: text

   输入：croakOfFrogs = "croakcroa"
   输出：-1
   解释：第二段叫声缺少末尾字符 k。