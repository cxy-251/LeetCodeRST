1521. Find a Value of a Mysterious Function Closest to Target
=============================================================

题目信息
--------

:题号: 1521
:难度: Hard
:主题: 数组、位运算、子数组、集合压缩
:原题: `LeetCode 1521 <https://leetcode.com/problems/find-a-value-of-a-mysterious-function-closest-to-target/>`_
:重点: 神秘函数等于连续子数组全部元素的按位与；寻找其结果与 ``target`` 的最小绝对差

题目重述
--------

给定整数数组 ``arr`` 和整数 ``target``。对于任意 ``0 <= l <= r < arr.length``，函数 ``func(arr,l,r)`` 定义为 ``arr[l] & arr[l+1] & ... & arr[r]``，其中 ``&`` 是按位与。

请在所有非空连续子数组中选择一个，使函数值与 ``target`` 的绝对差最小，并返回这个最小差值。

``1 <= arr.length <= 10^5``，``1 <= arr[i], target <= 10^6``。

自建示例
--------

多个元素按位与可以恰好得到目标：

.. code-block:: text

   输入：arr = [9,12,3], target = 8
   输出：0
   解释：子数组 [9,12] 的按位与为 8，与目标完全相同。

单元素数组只有一个候选结果：

.. code-block:: text

   输入：arr = [5], target = 2
   输出：3
   解释：唯一函数值为 5，绝对差为 3。