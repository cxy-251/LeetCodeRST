0464. Can I Win
===============

题目信息
--------

:题号: 0464
:难度: Medium
:主题: 两人博弈、不重复整数、累计总和、先手必胜
:原题: `LeetCode 0464 <https://leetcode.com/problems/can-i-win/>`_
:重点: 每个整数最多选择一次、谁先使累计和达到或超过目标谁获胜、双方采用最优策略

题目重述
--------

两名玩家轮流从整数集合 ``1..maxChoosableInteger`` 中选择一个尚未使用的整数，并把它加入共享累计总和。第一个使累计总和达到或超过 ``desiredTotal`` 的玩家立即获胜，先手玩家先行动。

判断双方都采用最优策略时，先手玩家是否能够保证获胜。``maxChoosableInteger`` 位于 ``[1, 20]``，``desiredTotal`` 位于 ``[0, 300]``。每个整数整局只能使用一次；若所有可选整数之和仍小于目标，则任何玩家都无法达到目标，先手不能保证获胜。

自建示例
--------

先手存在必胜开局：

.. code-block:: text

   输入：maxChoosableInteger = 4，desiredTotal = 6
   输出：true
   解释：先手选择 1。无论对手随后选择 2、3 或 4，先手都能选择一个尚未使用的数，使累计和达到或超过 6。

所有整数总和不足：

.. code-block:: text

   输入：maxChoosableInteger = 3，desiredTotal = 7
   输出：false
   解释：1 + 2 + 3 = 6，小于目标 7，整局不可能有人达到目标。
