1753. Maximum Score From Removing Stones
========================================

题目信息
--------

:题号: 1753
:难度: Medium
:主题: 贪心、数学
:原题: `LeetCode 1753 <https://leetcode.com/problems/maximum-score-from-removing-stones/>`_
:重点: 每次从两个不同的非空石堆各取一块并得一分

题目重述
--------

给定三堆石头数量 ``a,b,c``。重复合法取石，返回可获得的最大分数。

自建示例
--------

.. code-block:: text

   输入：a = 2, b = 4, c = 6
   输出：6
   解释：总石头数为 12，三堆可充分配对完成六次操作。

.. code-block:: text

   输入：a = 1, b = 1, c = 10
   输出：2
   解释：两个小堆耗尽后无法继续。