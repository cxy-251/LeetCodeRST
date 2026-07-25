1636. Sort Array by Increasing Frequency
========================================

题目信息
--------

:题号: 1636
:难度: Easy
:主题: 频次统计、排序
:原题: `LeetCode 1636 <https://leetcode.com/problems/sort-array-by-increasing-frequency/>`_
:重点: 先按出现次数升序，频次相同时按数值降序

题目重述
--------

给定整数数组，按元素出现频次从小到大排序；两个值频次相同时，数值较大的排在前面。相同值的所有实例连续出现。

自建示例
--------

.. code-block:: text

   输入：nums = [2,3,1,3,2,2]
   输出：[1,3,3,2,2,2]
   解释：频次依次为 1、2、3。

.. code-block:: text

   输入：nums = [4,5]
   输出：[5,4]
   解释：频次相同，按数值降序。