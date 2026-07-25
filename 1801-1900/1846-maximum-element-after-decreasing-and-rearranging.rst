1846. Maximum Element After Decreasing and Rearranging
=====================================================

题目信息
--------

:题号: 1846
:难度: Medium
:主题: 贪心、排序
:原题: `LeetCode 1846 <https://leetcode.com/problems/maximum-element-after-decreasing-and-rearranging/>`_
:重点: 可重排并任意减小元素，使首项为 1 且相邻差不超过 1

题目重述
--------

允许重排数组，并把任意元素减小到正整数。要求第一个元素为 1、相邻元素差的绝对值至多为 1，返回最终数组最大元素的最大可能值。

自建示例
--------

.. code-block:: text

   输入：arr = [2,2,1,2,1]
   输出：2
   解释：重排为 [1,1,2,2,2] 即可满足条件。

.. code-block:: text

   输入：arr = [100]
   输出：1
   解释：单个元素必须减小为 1。
