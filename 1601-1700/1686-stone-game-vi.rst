1686. Stone Game VI
===================

题目信息
--------

:题号: 1686
:难度: Medium
:主题: 贪心、排序、博弈
:原题: `LeetCode 1686 <https://leetcode.com/problems/stone-game-vi/>`_
:重点: 两人轮流选石头，各自获得该石头在自己价值数组中的分数

题目重述
--------

Alice 先手，与 Bob 轮流从剩余石头中选一块。第 ``i`` 块石头对两人的价值分别为 ``aliceValues[i]`` 与 ``bobValues[i]``。双方最优行动后，Alice 分数更高返回 ``1``，相等返回 ``0``，更低返回 ``-1``。

自建示例
--------

.. code-block:: text

   输入：aliceValues = [1,3], bobValues = [2,1]
   输出：1
   解释：Alice 先选第二块得 3 分，Bob 得 2 分。

.. code-block:: text

   输入：aliceValues = [1,1], bobValues = [1,1]
   输出：0
   解释：两人各选择一块并各得 1 分。