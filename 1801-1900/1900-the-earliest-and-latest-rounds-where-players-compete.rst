1900. The Earliest and Latest Rounds Where Players Compete
=========================================================

题目信息
--------

:题号: 1900
:难度: Hard
:主题: 记忆化搜索、动态规划
:原题: `LeetCode 1900 <https://leetcode.com/problems/the-earliest-and-latest-rounds-where-players-compete/>`_
:重点: 两名指定强者始终获胜，其余比赛结果可任意，求二者相遇轮次范围

题目重述
--------

淘汰赛每轮首尾玩家配对，奇数人数时中间玩家轮空。指定两名玩家在遇到彼此前不会输，其余比赛结果任意。返回这两名玩家最早与最晚可能相遇的轮次。

自建示例
--------

.. code-block:: text

   输入：n = 2, firstPlayer = 1, secondPlayer = 2
   输出：[1,1]
   解释：两人首轮直接相遇。

.. code-block:: text

   输入：n = 3, firstPlayer = 1, secondPlayer = 2
   输出：[2,2]
   解释：首轮玩家 1 对阵玩家 3，玩家 2 轮空，两人在决赛相遇。
