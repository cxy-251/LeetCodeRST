1690. Stone Game VII
====================

题目信息
--------

:题号: 1690
:难度: Medium
:主题: 区间动态规划、博弈
:原题: `LeetCode 1690 <https://leetcode.com/problems/stone-game-vii/>`_
:重点: 每次移除一端石头，得分为移除后剩余石头之和；双方最优时求最终分差

题目重述
--------

Alice 与 Bob 轮流从石堆数组左端或右端移除一块，并获得当前剩余石头值之和。Alice 先手，返回双方最优策略下 Alice 得分减 Bob 得分。

自建示例
--------

.. code-block:: text

   输入：stones = [5,3,1,4,2]
   输出：6
   解释：双方按最优策略行动后，Alice 能保证领先 6 分。

.. code-block:: text

   输入：stones = [1,2]
   输出：2
   解释：Alice 移除 1 后获得剩余值 2，Bob 最后得零分。