1300. Sum of Mutated Array Closest to Target
============================================

题目信息
--------

:题号: 1300
:难度: Medium
:主题: 数组、二分查找、截断值
:原题: `LeetCode 1300 <https://leetcode.com/problems/sum-of-mutated-array-closest-to-target/>`_
:重点: 选择整数 ``value``，把所有大于它的元素替换为它；使新数组总和最接近 ``target``，距离并列时返回较小值

题目重述
--------

给定正整数数组 ``arr`` 和整数 ``target``。选择一个整数 ``value``，并把数组中所有严格大于 ``value`` 的元素替换为 ``value``，其余元素保持不变。

请找到使修改后数组元素和与 ``target`` 的绝对差最小的 ``value``。若多个值产生相同的最小差，返回其中较小的值。

``1 <= arr.length <= 10^4``，``1 <= arr[i], target <= 10^5``。

自建示例
--------

截断后可以恰好达到目标：

.. code-block:: text

   输入：arr = [2,5,9], target = 10
   输出：4
   解释：选择 4 后数组变为 [2,4,4]，总和恰好为 10。

距离相同时返回较小截断值：

.. code-block:: text

   输入：arr = [4,4], target = 5
   输出：2
   解释：value = 2 时总和为 4，value = 3 时总和为 6，与目标距离都为 1，因此返回较小的 2。