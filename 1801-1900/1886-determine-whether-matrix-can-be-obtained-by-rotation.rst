1886. Determine Whether Matrix Can Be Obtained By Rotation
=========================================================

题目信息
--------

:题号: 1886
:难度: Easy
:主题: 矩阵、模拟
:原题: `LeetCode 1886 <https://leetcode.com/problems/determine-whether-matrix-can-be-obtained-by-rotation/>`_
:重点: 最多尝试四种顺时针旋转状态

题目重述
--------

判断方阵 ``mat`` 是否能通过若干次顺时针旋转 90 度变成 ``target``，旋转零次也允许。

自建示例
--------

.. code-block:: text

   输入：mat = [[1,0],[0,1]], target = [[1,0],[0,1]]
   输出：true
   解释：旋转零次即相同。

.. code-block:: text

   输入：mat = [[1,0],[0,0]], target = [[1,1],[0,0]]
   输出：false
   解释：两个矩阵中 1 的数量不同，任何旋转都无法得到目标。
