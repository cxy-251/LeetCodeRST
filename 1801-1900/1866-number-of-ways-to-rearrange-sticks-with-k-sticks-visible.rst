1866. Number of Ways to Rearrange Sticks With K Sticks Visible
=============================================================

题目信息
--------

:题号: 1866
:难度: Hard
:主题: 动态规划、组合数学
:原题: `LeetCode 1866 <https://leetcode.com/problems/number-of-ways-to-rearrange-sticks-with-k-sticks-visible/>`_
:重点: 从左观察时，只有高于此前全部木棍的木棍可见

题目重述
--------

将高度 1 到 ``n`` 的不同木棍排成一列，统计从左侧恰好能看到 ``k`` 根的排列数量，结果取模。

自建示例
--------

.. code-block:: text

   输入：n = 3, k = 2
   输出：3
   解释：共有三种排列恰好产生两个从左侧可见的新高度。

.. code-block:: text

   输入：n = 2, k = 1
   输出：1
   解释：排列 [2,1] 只有第一根可见。
