1962. Remove Stones to Minimize the Total
========================================

题目信息
--------

:题号: 1962
:难度: Medium
:主题: 贪心、优先队列
:原题: `LeetCode 1962 <https://leetcode.com/problems/remove-stones-to-minimize-the-total/>`_
:重点: 每次从一堆移除向下取整的一半石头，应优先处理最大堆

题目重述
--------

执行恰好 ``k`` 次操作，每次选择一堆石头并移除 ``floor(pile / 2)`` 个。返回操作后石头总数的最小值。

自建示例
--------

.. code-block:: text

   输入：piles = [5,4], k = 2
   输出：5
   解释：先把 5 变为 3，再把 4 变为 2，剩余总数为 5。

.. code-block:: text

   输入：piles = [1], k = 5
   输出：1
   解释：每次可移除的石头数都是 0。
