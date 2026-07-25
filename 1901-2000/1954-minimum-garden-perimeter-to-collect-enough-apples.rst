1954. Minimum Garden Perimeter to Collect Enough Apples
======================================================

题目信息
--------

:题号: 1954
:难度: Medium
:主题: 数学、二分查找
:原题: `LeetCode 1954 <https://leetcode.com/problems/minimum-garden-perimeter-to-collect-enough-apples/>`_
:重点: 选择以原点为中心、边与坐标轴平行的正方形花园

题目重述
--------

坐标 ``(i,j)`` 的苹果数为 ``|i| + |j|``。返回能够收集至少 ``neededApples`` 个苹果的最小正方形花园周长。

自建示例
--------

.. code-block:: text

   输入：neededApples = 1
   输出：8
   解释：半边长 1 的正方形已包含 12 个苹果，周长为 8。

.. code-block:: text

   输入：neededApples = 13
   输出：16
   解释：半边长 1 只有 12 个苹果，需要扩大到半边长 2。
