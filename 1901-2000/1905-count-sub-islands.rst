1905. Count Sub Islands
=======================

题目信息
--------

:题号: 1905
:难度: Medium
:主题: 深度优先搜索、矩阵
:原题: `LeetCode 1905 <https://leetcode.com/problems/count-sub-islands/>`_
:重点: ``grid2`` 的整座岛屿每个陆地格都必须在 ``grid1`` 中也是陆地

题目重述
--------

两个二进制网格大小相同。统计 ``grid2`` 中完全包含在 ``grid1`` 某座岛屿内的岛屿数量。

自建示例
--------

.. code-block:: text

   输入：grid1 = [[1,1],[1,1]], grid2 = [[1,0],[1,1]]
   输出：1
   解释：grid2 的唯一岛屿全部落在 grid1 的陆地上。

.. code-block:: text

   输入：grid1 = [[1,0],[0,0]], grid2 = [[1,1],[0,0]]
   输出：0
   解释：grid2 的岛屿包含位置 [0,1]，该位置在 grid1 中是水域。
