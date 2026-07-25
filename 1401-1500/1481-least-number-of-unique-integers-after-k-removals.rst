1481. Least Number of Unique Integers after K Removals
======================================================

题目信息
--------

:题号: 1481
:难度: Medium
:主题: 数组、频次统计、贪心
:原题: `LeetCode 1481 <https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals/>`_
:重点: 恰好删除 ``k`` 个元素实例，优先完整删除出现次数较少的数值，最小化剩余不同整数数量

题目重述
--------

给定整数数组 ``arr`` 和整数 ``k``。从数组中删除恰好 ``k`` 个元素，每次删除一个具体元素实例。

请返回删除后数组中不同整数的最少数量。

``1 <= arr.length <= 10^5``，``1 <= arr[i] <= 10^9``，``0 <= k <= arr.length``。

自建示例
--------

完整删除低频数值可以减少不同整数数量：

.. code-block:: text

   输入：arr = [1,1,2,3], k = 2
   输出：1
   解释：删除唯一的 2 和 3 后，只剩数值 1。

不删除元素时返回原有不同数数量：

.. code-block:: text

   输入：arr = [4,4,5], k = 0
   输出：2
   解释：数组中包含 4 和 5 两种数值。