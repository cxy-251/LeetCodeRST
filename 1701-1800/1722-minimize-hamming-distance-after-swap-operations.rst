1722. Minimize Hamming Distance After Swap Operations
=====================================================

题目信息
--------

:题号: 1722
:难度: Medium
:主题: 并查集、频次匹配
:原题: `LeetCode 1722 <https://leetcode.com/problems/minimize-hamming-distance-after-swap-operations/>`_
:重点: 允许的交换可重复执行，因此同一连通分量内元素可任意重排

题目重述
--------

给定等长数组 ``source``、``target`` 和可交换下标对。通过任意次合法交换，返回 ``source`` 与 ``target`` 的最小汉明距离。

自建示例
--------

.. code-block:: text

   输入：source = [1,2,3], target = [2,1,3], allowedSwaps = [[0,1]]
   输出：0
   解释：交换前两个位置即可完全相同。

.. code-block:: text

   输入：source = [1,2], target = [2,1], allowedSwaps = []
   输出：2
   解释：没有允许交换，两个位置都不同。