1806. Minimum Number of Operations to Reinitialize a Permutation
===============================================================

题目信息
--------

:题号: 1806
:难度: Medium
:主题: 数组、数学、模拟
:原题: `LeetCode 1806 <https://leetcode.com/problems/minimum-number-of-operations-to-reinitialize-a-permutation/>`_
:重点: 重复应用固定下标映射，求排列首次恢复初始状态的次数

题目重述
--------

从排列 ``[0,1,...,n-1]`` 开始，每轮按题目给定的奇偶下标规则生成新排列。返回排列首次恢复初始状态所需的操作次数。

自建示例
--------

.. code-block:: text

   输入：n = 4
   输出：2
   解释：第一轮得到 [0,2,1,3]，第二轮恢复原排列。

.. code-block:: text

   输入：n = 2
   输出：1
   解释：一次映射后排列已经与初始状态相同。
