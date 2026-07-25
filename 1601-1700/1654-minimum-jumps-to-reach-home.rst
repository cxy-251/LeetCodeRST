1654. Minimum Jumps to Reach Home
================================

题目信息
--------

:题号: 1654
:难度: Medium
:主题: 广度优先搜索、状态
:原题: `LeetCode 1654 <https://leetcode.com/problems/minimum-jumps-to-reach-home/>`_
:重点: 可向前跳 ``a`` 或向后跳 ``b``，不能连续后跳且不能落在禁区或负坐标

题目重述
--------

从位置 ``0`` 出发，按规则跳到 ``x``。返回最少跳跃次数，不可达时返回 ``-1``。

自建示例
--------

.. code-block:: text

   输入：forbidden = [], a = 2, b = 1, x = 3
   输出：3
   解释：可按 0 -> 2 -> 4 -> 3 到达。

.. code-block:: text

   输入：forbidden = [2], a = 2, b = 1, x = 2
   输出：-1
   解释：目标本身是禁区。