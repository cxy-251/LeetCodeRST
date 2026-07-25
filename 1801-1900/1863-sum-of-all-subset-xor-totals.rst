1863. Sum of All Subset XOR Totals
==================================

题目信息
--------

:题号: 1863
:难度: Easy
:主题: 位运算、回溯
:原题: `LeetCode 1863 <https://leetcode.com/problems/sum-of-all-subset-xor-totals/>`_
:重点: 枚举所有子集并累加各自异或值，空集异或值为 0

题目重述
--------

计算数组所有子集的元素异或值之和并返回。

自建示例
--------

.. code-block:: text

   输入：nums = [1,2]
   输出：6
   解释：四个子集的异或值为 0、1、2、3。

.. code-block:: text

   输入：nums = [0]
   输出：0
   解释：空集和只含 0 的子集异或值都为 0。
