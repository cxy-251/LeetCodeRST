1760. Minimum Limit of Balls in a Bag
=====================================

题目信息
--------

:题号: 1760
:难度: Medium
:主题: 二分查找、贪心
:原题: `LeetCode 1760 <https://leetcode.com/problems/minimum-limit-of-balls-in-a-bag/>`_
:重点: 每次把一袋球拆成两袋正数量球，最多操作指定次数，最小化最终最大袋容量

题目重述
--------

给定每袋球数和 ``maxOperations``。返回执行不超过该次数拆分后，所有袋子中球数最大值的最小可能值。

自建示例
--------

.. code-block:: text

   输入：nums = [9], maxOperations = 2
   输出：3
   解释：把 9 拆成三袋各 3 个需两次操作。

.. code-block:: text

   输入：nums = [1,2], maxOperations = 0
   输出：2
   解释：不能拆分，最大袋容量保持为 2。