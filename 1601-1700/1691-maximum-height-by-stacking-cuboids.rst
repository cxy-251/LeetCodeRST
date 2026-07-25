1691. Maximum Height by Stacking Cuboids
========================================

题目信息
--------

:题号: 1691
:难度: Hard
:主题: 排序、动态规划、三维堆叠
:原题: `LeetCode 1691 <https://leetcode.com/problems/maximum-height-by-stacking-cuboids/>`_
:重点: 每个长方体可旋转，顶部三个维度均不能超过下方对应维度

题目重述
--------

给定若干长方体尺寸。可任意旋转并选择部分长方体堆叠，要求上方长方体的长、宽、高分别不大于下方对应尺寸。返回最大总高度。

自建示例
--------

.. code-block:: text

   输入：cuboids = [[1,1,1],[2,2,2]]
   输出：3
   解释：小立方体可叠在大立方体上。

.. code-block:: text

   输入：cuboids = [[1,2,3]]
   输出：3
   解释：把最长边作为高度即可。