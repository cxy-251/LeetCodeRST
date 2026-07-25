1442. Count Triplets That Can Form Two Arrays of Equal XOR
==========================================================

题目信息
--------

:题号: 1442
:难度: Medium
:主题: 数组、前缀异或、计数
:原题: `LeetCode 1442 <https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor/>`_
:重点: 统计 ``i < j <= k`` 且 ``arr[i..j-1]`` 与 ``arr[j..k]`` 异或值相等的三元组

题目重述
--------

给定整数数组 ``arr``。选择下标 ``i``、``j``、``k``，满足 ``0 <= i < j <= k < arr.length``。

令 ``a`` 为 ``arr[i]`` 到 ``arr[j-1]`` 的按位异或，``b`` 为 ``arr[j]`` 到 ``arr[k]`` 的按位异或。请返回满足 ``a == b`` 的三元组数量。

``1 <= arr.length <= 300``，``1 <= arr[i] <= 10^8``。

自建示例
--------

相邻相同元素可以形成合法三元组：

.. code-block:: text

   输入：arr = [1,1,1]
   输出：2
   解释：(0,1,1) 和 (1,2,2) 都使左右两段异或值等于 1。

数组长度为一时无法选择三元组：

.. code-block:: text

   输入：arr = [5]
   输出：0
   解释：不存在满足 i < j <= k 的下标。