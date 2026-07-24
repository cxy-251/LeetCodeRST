1343. Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold
===================================================================================

题目信息
--------

:题号: 1343
:难度: Medium
:主题: 数组、滑动窗口、固定长度子数组
:原题: `LeetCode 1343 <https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/>`_
:重点: 只统计长度恰好为 ``k`` 的连续子数组，平均值不小于 ``threshold``

题目重述
--------

给定整数数组 ``arr``、窗口长度 ``k`` 和阈值 ``threshold``。枚举所有长度恰好为 ``k`` 的连续子数组。

请返回平均值大于或等于 ``threshold`` 的子数组数量。等价地，窗口元素和至少为 ``k * threshold``。

``1 <= k <= arr.length <= 10^5``，数组元素和阈值均为非负整数。

自建示例
--------

相邻窗口可以同时满足条件：

.. code-block:: text

   输入：arr = [1,5,3,8,6], k = 3, threshold = 5
   输出：2
   解释：三个窗口和分别为 9、16、17，后两个平均值不小于 5。

唯一窗口恰好达到阈值：

.. code-block:: text

   输入：arr = [2,4], k = 2, threshold = 3
   输出：1
   解释：整个数组平均值恰好为 3。