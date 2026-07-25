1911. Maximum Alternating Subsequence Sum
========================================

题目信息
--------

:题号: 1911
:难度: Medium
:主题: 动态规划、贪心
:原题: `LeetCode 1911 <https://leetcode.com/problems/maximum-alternating-subsequence-sum/>`_
:重点: 子序列偶数位置相加、奇数位置相减，最大化结果

题目重述
--------

选择一个非空子序列，按子序列下标从 0 开始，将偶数位置元素相加、奇数位置元素相减。返回最大交替和。

自建示例
--------

.. code-block:: text

   输入：nums = [4,2,5,3]
   输出：7
   解释：选择 [4,2,5]，交替和为 4 - 2 + 5。

.. code-block:: text

   输入：nums = [5]
   输出：5
   解释：唯一非空子序列的交替和为 5。
