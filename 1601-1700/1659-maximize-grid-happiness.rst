1659. Maximize Grid Happiness
============================

题目信息
--------

:题号: 1659
:难度: Hard
:主题: 状态压缩动态规划、网格
:原题: `LeetCode 1659 <https://leetcode.com/problems/maximize-grid-happiness/>`_
:重点: 内向与外向住户有不同基础幸福值，相邻关系会同时影响双方

题目重述
--------

在 ``m x n`` 网格中放置不超过给定数量的内向和外向住户。内向基础幸福值 120，每个邻居使其减 30；外向基础值 40，每个邻居使其加 20。返回可达到的最大总幸福值。

自建示例
--------

.. code-block:: text

   输入：m = 1, n = 2, introvertsCount = 1, extrovertsCount = 1
   输出：150
   解释：相邻放置时基础值 160，双方相互作用净减少 10。

.. code-block:: text

   输入：m = 1, n = 1, introvertsCount = 0, extrovertsCount = 0
   输出：0
   解释：没有住户可放置。