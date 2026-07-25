1703. Minimum Adjacent Swaps for K Consecutive Ones
===================================================

题目信息
--------

:题号: 1703
:难度: Hard
:主题: 中位数、滑动窗口、前缀和
:原题: `LeetCode 1703 <https://leetcode.com/problems/minimum-adjacent-swaps-for-k-consecutive-ones/>`_
:重点: 每次交换相邻元素，使至少 ``k`` 个 1 占据连续位置

题目重述
--------

给定二进制数组和 ``k``。通过相邻交换，返回让 ``k`` 个 1 连续排列所需的最少交换次数。

自建示例
--------

.. code-block:: text

   输入：nums = [1,0,0,1,0,1], k = 2
   输出：1
   解释：把最后一个 1 向左移动一格即可与中间的 1 相邻。

.. code-block:: text

   输入：nums = [0,1,0], k = 1
   输出：0
   解释：单个 1 本身已经连续。