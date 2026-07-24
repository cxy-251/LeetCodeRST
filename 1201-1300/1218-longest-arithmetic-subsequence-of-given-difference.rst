1218. Longest Arithmetic Subsequence of Given Difference
========================================================

题目信息
--------

:题号: 1218
:难度: Medium
:主题: 数组、子序列、动态规划、哈希表
:原题: `LeetCode 1218 <https://leetcode.com/problems/longest-arithmetic-subsequence-of-given-difference/>`_
:重点: 子序列保留原下标顺序但不要求连续，任意相邻选中元素之差必须等于给定 ``difference``

题目重述
--------

给定整数数组 ``arr`` 和整数 ``difference``。从数组中删除任意数量的元素但不改变剩余元素相对顺序，可以得到一个子序列。

请返回最长子序列的长度，使其中每一对相邻元素都满足“后一个元素减前一个元素等于 ``difference``”。

``1 <= arr.length <= 10^5``，``-10^4 <= arr[i], difference <= 10^4``。

自建示例
--------

公差可以为负数：

.. code-block:: text

   输入：arr = [7,4,1,-2,5], difference = -3
   输出：4
   解释：选择 7、4、1、-2，任意相邻两项之差都为 -3。

公差为零时寻找相同值的最长子序列：

.. code-block:: text

   输入：arr = [5,1,5,5], difference = 0
   输出：3
   解释：选择三个值为 5 的元素即可形成长度为 3 的等差子序列。