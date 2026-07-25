1840. Maximum Building Height
=============================

题目信息
--------

:题号: 1840
:难度: Hard
:主题: 贪心、排序、数学
:原题: `LeetCode 1840 <https://leetcode.com/problems/maximum-building-height/>`_
:重点: 相邻建筑高度差至多 1，并满足部分位置的高度上限

题目重述
--------

建筑编号 1 到 ``n``，第一栋高度为 0，相邻高度差不超过 1，部分建筑还有高度上限。返回所有合法方案中能够出现的最大建筑高度。

自建示例
--------

.. code-block:: text

   输入：n = 5, restrictions = [[2,1],[4,1]]
   输出：2
   解释：高度可取 [0,1,2,1,2]，最大值为 2。

.. code-block:: text

   输入：n = 2, restrictions = []
   输出：1
   解释：从第一栋高度 0 出发，第二栋最高为 1。
