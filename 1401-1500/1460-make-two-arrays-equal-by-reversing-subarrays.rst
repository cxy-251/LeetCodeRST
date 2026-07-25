1460. Make Two Arrays Equal by Reversing Subarrays
==================================================

题目信息
--------

:题号: 1460
:难度: Easy
:主题: 数组、频次统计、排列
:原题: `LeetCode 1460 <https://leetcode.com/problems/make-two-arrays-equal-by-reversing-subarrays/>`_
:重点: 可以任意多次翻转 ``arr`` 的连续子数组；能够变为 ``target`` 当且仅当两个数组包含相同的元素多重集合

题目重述
--------

给定长度相同的整数数组 ``target`` 和 ``arr``。一次操作可以选择 ``arr`` 的任意连续子数组并反转其中元素顺序。

可以执行任意次数操作。请判断能否把 ``arr`` 变成 ``target``。

``1 <= target.length == arr.length <= 1000``，``1 <= target[i], arr[i] <= 1000``。

自建示例
--------

元素频次相同即可通过翻转调整顺序：

.. code-block:: text

   输入：target = [1,2,2], arr = [2,1,2]
   输出：true
   解释：两个数组包含相同的元素多重集合，可以通过连续子数组翻转重排。

元素频次不同必然无法转换：

.. code-block:: text

   输入：target = [1,2], arr = [1,1]
   输出：false
   解释：arr 缺少元素 2，并多出一个 1。