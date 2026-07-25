1992. Find All Groups of Farmland
================================

题目信息
--------

:题号: 1992
:难度: Medium
:主题: 矩阵、搜索
:原题: `LeetCode 1992 <https://leetcode.com/problems/find-all-groups-of-farmland/>`_
:重点: 每组相连农田保证构成矩形，返回左上与右下坐标

题目重述
--------

二进制矩阵中的 1 表示农田，四方向相连的一组农田保证是矩形，不同组不相邻。返回每组的 ``[topRow,leftCol,bottomRow,rightCol]``，顺序任意。

自建示例
--------

.. code-block:: text

   输入：land = [[1,1,0],[1,1,0],[0,0,1]]
   输出：[[0,0,1,1],[2,2,2,2]]
   解释：存在一个 2×2 农田组和一个单格农田组。

.. code-block:: text

   输入：land = [[0,0]]
   输出：[]
   解释：矩阵中没有农田。
