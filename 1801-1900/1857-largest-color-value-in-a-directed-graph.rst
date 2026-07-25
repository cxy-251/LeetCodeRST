1857. Largest Color Value in a Directed Graph
=============================================

题目信息
--------

:题号: 1857
:难度: Hard
:主题: 图、拓扑排序、动态规划
:原题: `LeetCode 1857 <https://leetcode.com/problems/largest-color-value-in-a-directed-graph/>`_
:重点: 路径颜色值是同一颜色出现的最大次数，有环返回 -1

题目重述
--------

每个有向图节点带一个颜色。对任意路径，颜色值定义为路径中出现次数最多的单一颜色次数。返回最大颜色值；图中存在有向环时返回 -1。

自建示例
--------

.. code-block:: text

   输入：colors = "aba", edges = [[0,1],[1,2]]
   输出：2
   解释：路径 0→1→2 中颜色 a 出现两次。

.. code-block:: text

   输入：colors = "ab", edges = [[0,1],[1,0]]
   输出：-1
   解释：图中存在有向环。
