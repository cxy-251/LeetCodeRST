1625. Lexicographically Smallest String After Applying Operations
=================================================================

题目信息
--------

:题号: 1625
:难度: Medium
:主题: 字符串、状态搜索、循环操作
:原题: `LeetCode 1625 <https://leetcode.com/problems/lexicographically-smallest-string-after-applying-operations/>`_
:重点: 可反复给奇数下标数字加 ``a``（模 10），或把字符串向右轮转 ``b`` 位

题目重述
--------

给定偶数长度数字字符串 ``s`` 和整数 ``a``、``b``。两种操作均可执行任意次，返回所有可达字符串中字典序最小者。

自建示例
--------

.. code-block:: text

   输入：s = "11", a = 1, b = 1
   输出："00"
   解释：通过反复加法与轮转，可让两个位置都变为 0。

.. code-block:: text

   输入：s = "00", a = 7, b = 2
   输出："00"
   解释：原字符串已经是可能的最小值。