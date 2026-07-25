1931. Painting a Grid With Three Different Colors
================================================

题目信息
--------

:题号: 1931
:难度: Hard
:主题: 状态压缩、动态规划
:原题: `LeetCode 1931 <https://leetcode.com/problems/painting-a-grid-with-three-different-colors/>`_
:重点: 用三种颜色填充网格，水平和垂直相邻格颜色必须不同

题目重述
--------

统计给 ``m × n`` 网格使用三种颜色的合法涂色方案数，使任意共享边的两个格子颜色不同。结果取模。

自建示例
--------

.. code-block:: text

   输入：m = 1, n = 1
   输出：3
   解释：单格可以选择任意一种颜色。

.. code-block:: text

   输入：m = 1, n = 2
   输出：6
   解释：首格有 3 种选择，第二格有 2 种不同颜色可选。
