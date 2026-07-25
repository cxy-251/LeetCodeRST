1688. Count of Matches in Tournament
=====================================

题目信息
--------

:题号: 1688
:难度: Easy
:主题: 数学、模拟
:原题: `LeetCode 1688 <https://leetcode.com/problems/count-of-matches-in-tournament/>`_
:重点: 每场比赛淘汰一支队伍，最终只剩冠军

题目重述
--------

淘汰赛每轮按题目规则安排比赛，奇数队时一队轮空。返回从 ``n`` 支队伍决出冠军所需的总比赛数。

自建示例
--------

.. code-block:: text

   输入：n = 7
   输出：6
   解释：每场比赛淘汰一队，从七队减少到一队共淘汰六队。

.. code-block:: text

   输入：n = 1
   输出：0
   解释：已经只有冠军，无需比赛。