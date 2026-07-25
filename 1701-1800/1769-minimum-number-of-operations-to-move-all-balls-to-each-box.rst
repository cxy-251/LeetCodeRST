1769. Minimum Number of Operations to Move All Balls to Each Box
===============================================================

题目信息
--------

:题号: 1769
:难度: Medium
:主题: 前缀和、字符串
:原题: `LeetCode 1769 <https://leetcode.com/problems/minimum-number-of-operations-to-move-all-balls-to-each-box/>`_
:重点: 一次操作把一个球移动到相邻盒子，对每个目标盒独立计算总距离

题目重述
--------

二进制字符串表示每个盒子是否有球。返回数组，其中第 ``i`` 项是把所有球移动到盒子 ``i`` 所需的最少相邻移动次数。

自建示例
--------

.. code-block:: text

   输入：boxes = "110"
   输出：[1,1,3]
   解释：两个球到各目标位置的距离之和分别为 1、1、3。

.. code-block:: text

   输入：boxes = "0"
   输出：[0]
   解释：没有球需要移动。