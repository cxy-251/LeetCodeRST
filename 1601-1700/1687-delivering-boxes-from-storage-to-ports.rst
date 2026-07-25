1687. Delivering Boxes from Storage to Ports
============================================

题目信息
--------

:题号: 1687
:难度: Hard
:主题: 动态规划、单调队列
:原题: `LeetCode 1687 <https://leetcode.com/problems/delivering-boxes-from-storage-to-ports/>`_
:重点: 箱子必须按顺序运送，每趟受箱数和总重量限制，连续同港口无需额外港口切换

题目重述
--------

货船从仓库出发，按 ``boxes`` 顺序装载一段连续箱子，满足 ``maxBoxes`` 与 ``maxWeight``，依次送到对应港口后返回仓库。返回运完所有箱子的最少航程段数。

自建示例
--------

.. code-block:: text

   输入：boxes = [[1,1],[2,1]], portsCount = 2, maxBoxes = 2, maxWeight = 2
   输出：3
   解释：一次装两箱，路线为仓库到港口 1、港口 2、再回仓库。

.. code-block:: text

   输入：boxes = [[1,5]], portsCount = 1, maxBoxes = 1, maxWeight = 5
   输出：2
   解释：单箱需要一次去港口和一次返回。