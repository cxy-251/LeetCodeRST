1928. Minimum Cost to Reach Destination in Time
==============================================

题目信息
--------

:题号: 1928
:难度: Hard
:主题: 图、动态规划、最短路
:原题: `LeetCode 1928 <https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/>`_
:重点: 路径总时间不超过上限，代价是经过节点的通行费之和

题目重述
--------

无向图边带行驶时间，每个节点有通行费。返回从节点 0 在 ``maxTime`` 内到达最后节点的最小总费用，起点和终点费用都计入；无法到达返回 -1。

自建示例
--------

.. code-block:: text

   输入：maxTime = 10, edges = [[0,1,5],[1,2,5],[0,2,20]], passingFees = [1,2,3]
   输出：6
   解释：路径 0→1→2 用时 10，费用为 1 + 2 + 3。

.. code-block:: text

   输入：maxTime = 4, edges = [[0,1,5]], passingFees = [2,3]
   输出：-1
   解释：唯一道路的行驶时间超过上限。
