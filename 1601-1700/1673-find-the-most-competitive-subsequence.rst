1673. Find the Most Competitive Subsequence
===========================================

题目信息
--------

:题号: 1673
:难度: Medium
:主题: 单调栈、子序列
:原题: `LeetCode 1673 <https://leetcode.com/problems/find-the-most-competitive-subsequence/>`_
:重点: 在保持相对顺序的长度 ``k`` 子序列中选择字典序最小者

题目重述
--------

给定数组 ``nums`` 和 ``k``。返回长度恰为 ``k`` 的最具竞争力子序列，即与其他候选比较时第一个不同位置数值更小的子序列。

自建示例
--------

.. code-block:: text

   输入：nums = [3,5,2,6], k = 2
   输出：[2,6]
   解释：可以删除前两个较大元素并保留长度二。

.. code-block:: text

   输入：nums = [4,1], k = 2
   输出：[4,1]
   解释：必须保留全部元素。