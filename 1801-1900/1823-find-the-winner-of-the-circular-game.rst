1823. Find the Winner of the Circular Game
==========================================

题目信息
--------

:题号: 1823
:难度: Medium
:主题: 约瑟夫环、队列、数学
:原题: `LeetCode 1823 <https://leetcode.com/problems/find-the-winner-of-the-circular-game/>`_
:重点: 每次数到第 ``k`` 人时淘汰，统计最后留下的编号

题目重述
--------

编号 1 到 ``n`` 的玩家围成一圈，从指定起点反复计数并淘汰第 ``k`` 人。返回最后未被淘汰的玩家编号。

自建示例
--------

.. code-block:: text

   输入：n = 5, k = 2
   输出：3
   解释：依次淘汰 2、4、1、5，最后剩下 3。

.. code-block:: text

   输入：n = 1, k = 7
   输出：1
   解释：只有一名玩家，因此直接获胜。
