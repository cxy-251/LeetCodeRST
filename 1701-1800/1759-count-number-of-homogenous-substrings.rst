1759. Count Number of Homogenous Substrings
===========================================

题目信息
--------

:题号: 1759
:难度: Medium
:主题: 字符串、连续段计数
:原题: `LeetCode 1759 <https://leetcode.com/problems/count-number-of-homogenous-substrings/>`_
:重点: 同质子串中的所有字符相同，不同起止位置分别计数

题目重述
--------

统计字符串中所有非空同质连续子串数量，结果对 ``10^9+7`` 取模。

自建示例
--------

.. code-block:: text

   输入：s = "abb"
   输出：4
   解释：子串 "a"、两个 "b" 和 "bb" 合法。

.. code-block:: text

   输入：s = "z"
   输出：1
   解释：唯一单字符子串同质。