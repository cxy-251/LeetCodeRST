1406. Stone Game III
====================

题目信息
--------

:题号: 1406
:难度: Hard
:主题: 动态规划、博弈、后缀状态
:原题: `LeetCode 1406 <https://leetcode.com/problems/stone-game-iii/>`_
:重点: 两人轮流从数组开头取一至三堆，得分为石子值之和；双方采用最优策略，返回胜者或平局

题目重述
--------

石子堆按数组 ``stoneValue`` 从左到右排列。Alice 先手，两人轮流从当前最左端取走 ``1``、``2`` 或 ``3`` 堆，并把所取石子值加入自己的总分，直到所有堆被取完。

双方都采用最优策略。Alice 得分更高时返回 ``"Alice"``，Bob 更高时返回 ``"Bob"``，得分相同返回 ``"Tie"``。

``1 <= stoneValue.length <= 5 * 10^4``，``-1000 <= stoneValue[i] <= 1000``。

自建示例
--------

先手可以一次取完三堆确保获胜：

.. code-block:: text

   输入：stoneValue = [2,1,-5]
   输出："Alice"
   解释：Alice 取前两堆可得 3 分，Bob 只能取到 -5 分，因此 Alice 获胜。

唯一石子值为零时平局：

.. code-block:: text

   输入：stoneValue = [0]
   输出："Tie"
   解释：Alice 取走唯一石子堆后双方得分都为零。