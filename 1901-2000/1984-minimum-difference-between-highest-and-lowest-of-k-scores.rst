1984. Minimum Difference Between Highest and Lowest of K Scores
==============================================================

题目信息
--------

:题号: 1984
:难度: Easy
:主题: 排序、滑动窗口
:原题: `LeetCode 1984 <https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores/>`_
:重点: 选择恰好 ``k`` 个分数，最小化最大值与最小值之差

题目重述
--------

从数组中选择 ``k`` 个元素，返回所选元素最大值与最小值之差的最小可能值。

自建示例
--------

.. code-block:: text

   输入：nums = [9,4,1,7], k = 2
   输出：2
   解释：选择 7 和 9，差值为 2。

.. code-block:: text

   输入：nums = [5,8], k = 1
   输出：0
   解释：只选择一个分数时最大值与最小值相同。
