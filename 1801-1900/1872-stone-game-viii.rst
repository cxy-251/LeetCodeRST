1872. Stone Game VIII
=====================

题目信息
--------

:题号: 1872
:难度: Hard
:主题: 动态规划、博弈、前缀和
:原题: `LeetCode 1872 <https://leetcode.com/problems/stone-game-viii/>`_
:重点: 每轮取走至少两堆并将其和作为新堆放回，双方最大化分差

题目重述
--------

Alice 与 Bob 轮流选择最左侧至少两堆石头，获得它们的总和，并把一堆等于该总和的石头放回左端。游戏剩一堆时结束，返回双方最优策略下 Alice 与 Bob 的分数差。

自建示例
--------

.. code-block:: text

   输入：stones = [1,2,3]
   输出：6
   解释：Alice 直接合并全部三堆并获得 6，游戏结束。

.. code-block:: text

   输入：stones = [-1,-2,-3]
   输出：3
   解释：Alice 先合并前两堆得 -3，Bob 再得到 -6，分差为 3。
