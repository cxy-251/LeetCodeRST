1674. Minimum Moves to Make Array Complementary
===============================================

题目信息
--------

:题号: 1674
:难度: Medium
:主题: 差分数组、配对、区间计数
:原题: `LeetCode 1674 <https://leetcode.com/problems/minimum-moves-to-make-array-complementary/>`_
:重点: 对称位置成对，修改元素到 ``1..limit``，使所有对的和相同

题目重述
--------

给定偶数长度数组。一次可把任一元素改为 ``1`` 到 ``limit`` 的任意值。返回使每个对称元素对之和都相等的最少修改次数。

自建示例
--------

.. code-block:: text

   输入：nums = [1,2,4,3], limit = 4
   输出：1
   解释：两对和为 4 与 6，把 4 改为 2 后都为 4。

.. code-block:: text

   输入：nums = [2,3,3,2], limit = 3
   输出：0
   解释：两组对称元素和都为 4。