1702. Maximum Binary String After Change
========================================

题目信息
--------

:题号: 1702
:难度: Medium
:主题: 字符串、贪心
:原题: `LeetCode 1702 <https://leetcode.com/problems/maximum-binary-string-after-change/>`_
:重点: 可把 ``00`` 变为 ``10``，或把 ``10`` 变为 ``01``，求可达字典序最大二进制串

题目重述
--------

给定二进制字符串。两种局部替换可执行任意次，返回所有可达字符串中字典序最大的结果。

自建示例
--------

.. code-block:: text

   输入：binary = "000"
   输出："110"
   解释：通过合法替换可把零集中为至多一个，并尽量放到右侧。

.. code-block:: text

   输入：binary = "1"
   输出："1"
   解释：没有可执行的操作。