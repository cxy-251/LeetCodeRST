1734. Decode XORed Permutation
==============================

题目信息
--------

:题号: 1734
:难度: Medium
:主题: 位运算、排列
:原题: `LeetCode 1734 <https://leetcode.com/problems/decode-xored-permutation/>`_
:重点: 原数组是 ``1..n`` 的排列且 ``n`` 为奇数，编码为相邻元素异或

题目重述
--------

给定 ``encoded``，其中 ``encoded[i]=perm[i] XOR perm[i+1]``。恢复唯一的奇数长度排列 ``perm``。

自建示例
--------

.. code-block:: text

   输入：encoded = [3,1]
   输出：[1,2,3]
   解释：1 XOR 2 = 3，2 XOR 3 = 1。

.. code-block:: text

   输入：encoded = []
   输出：[1]
   解释：长度一的唯一排列为 [1]。