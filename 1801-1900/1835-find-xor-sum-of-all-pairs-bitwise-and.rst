1835. Find XOR Sum of All Pairs Bitwise AND
===========================================

题目信息
--------

:题号: 1835
:难度: Hard
:主题: 位运算、数组
:原题: `LeetCode 1835 <https://leetcode.com/problems/find-xor-sum-of-all-pairs-bitwise-and/>`_
:重点: 计算所有跨数组数对按位与结果的异或和

题目重述
--------

对 ``arr1`` 与 ``arr2`` 的每个跨数组元素对计算按位与，再把全部结果异或起来并返回。

自建示例
--------

.. code-block:: text

   输入：arr1 = [1,2], arr2 = [3]
   输出：3
   解释：(1 AND 3) XOR (2 AND 3) = 1 XOR 2 = 3。

.. code-block:: text

   输入：arr1 = [0], arr2 = [7]
   输出：0
   解释：0 与任意整数按位与都为 0。
