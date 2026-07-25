1643. Kth Smallest Instructions
===============================

题目信息
--------

:题号: 1643
:难度: Hard
:主题: 组合数学、字典序构造
:原题: `LeetCode 1643 <https://leetcode.com/problems/kth-smallest-instructions/>`_
:重点: 从原点到目标只使用 ``H`` 与 ``V``，返回字典序第 ``k`` 小的完整指令串

题目重述
--------

目标为 ``[row,column]``。每个 ``H`` 向右一步，每个 ``V`` 向下一步。所有可达指令串按字典序排列，返回第 ``k`` 个。

自建示例
--------

.. code-block:: text

   输入：destination = [2,1], k = 2
   输出："VHV"
   解释：三个指令串依次为 HVV、VHV、VVH。

.. code-block:: text

   输入：destination = [1,1], k = 1
   输出："HV"
   解释：HV 在 VH 之前。