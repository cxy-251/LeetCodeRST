1848. Minimum Distance to the Target Element
============================================

题目信息
--------

:题号: 1848
:难度: Easy
:主题: 数组、线性扫描
:原题: `LeetCode 1848 <https://leetcode.com/problems/minimum-distance-to-the-target-element/>`_
:重点: 找到值等于目标的下标与起点下标的最小距离

题目重述
--------

返回所有满足 ``nums[i] = target`` 的下标中，``|i - start|`` 的最小值。

自建示例
--------

.. code-block:: text

   输入：nums = [1,2,3,2], target = 2, start = 0
   输出：1
   解释：最近的目标值位于下标 1。

.. code-block:: text

   输入：nums = [1,2,3,2], target = 2, start = 3
   输出：0
   解释：起点位置本身就是目标值。
