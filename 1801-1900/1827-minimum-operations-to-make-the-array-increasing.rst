1827. Minimum Operations to Make the Array Increasing
=====================================================

题目信息
--------

:题号: 1827
:难度: Easy
:主题: 贪心、数组
:原题: `LeetCode 1827 <https://leetcode.com/problems/minimum-operations-to-make-the-array-increasing/>`_
:重点: 每次只能将元素加一，使数组严格递增

题目重述
--------

每次操作可把任意元素增加 1。返回把数组变成严格递增数组所需的最少操作次数。

自建示例
--------

.. code-block:: text

   输入：nums = [1,1,1]
   输出：3
   解释：可变为 [1,2,3]，共增加 0 + 1 + 2 次。

.. code-block:: text

   输入：nums = [3,5,7]
   输出：0
   解释：原数组已经严格递增。
