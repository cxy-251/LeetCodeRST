1850. Minimum Adjacent Swaps to Reach the Kth Smallest Number
============================================================

题目信息
--------

:题号: 1850
:难度: Medium
:主题: 字符串、排列、贪心
:原题: `LeetCode 1850 <https://leetcode.com/problems/minimum-adjacent-swaps-to-reach-the-kth-smallest-number/>`_
:重点: 先求第 ``k`` 个更大的排列，再计算原字符串通过相邻交换变换过去的最少次数

题目重述
--------

目标字符串是 ``num`` 按字典序向后的第 ``k`` 个不同排列。返回仅通过交换相邻数字把 ``num`` 变成目标字符串所需的最少次数。

自建示例
--------

.. code-block:: text

   输入：num = "123", k = 1
   输出：1
   解释：下一个排列是 132，只需交换最后两个数字。

.. code-block:: text

   输入：num = "112", k = 1
   输出：1
   解释：下一个不同排列是 121，交换后两个位置即可。
