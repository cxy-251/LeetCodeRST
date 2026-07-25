1877. Minimize Maximum Pair Sum in Array
========================================

题目信息
--------

:题号: 1877
:难度: Medium
:主题: 贪心、排序、双指针
:原题: `LeetCode 1877 <https://leetcode.com/problems/minimize-maximum-pair-sum-in-array/>`_
:重点: 将最小值与最大值配对，使所有数对和的最大值最小

题目重述
--------

把偶数长度数组的所有元素分成若干数对。数对和的最大值称为最大数对和，返回其最小可能值。

自建示例
--------

.. code-block:: text

   输入：nums = [3,5,2,3]
   输出：7
   解释：配对 (2,5) 与 (3,3)，数对和为 7 和 6。

.. code-block:: text

   输入：nums = [1,1]
   输出：2
   解释：唯一数对的和为 2。
