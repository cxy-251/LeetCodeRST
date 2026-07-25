1744. Can You Eat Your Favorite Candy on Your Favorite Day?
===========================================================

题目信息
--------

:题号: 1744
:难度: Medium
:主题: 前缀和、区间相交
:原题: `LeetCode 1744 <https://leetcode.com/problems/can-you-eat-your-favorite-candy-on-your-favorite-day/>`_
:重点: 每天至少吃一颗、至多吃 ``dailyCap`` 颗，并按糖果类型顺序吃完

题目重述
--------

对每个查询 ``[type, day, cap]``，判断是否存在一种合法每日食用数量安排，使第 ``day`` 天能够吃到指定类型糖果。日期从 ``0`` 开始。

自建示例
--------

.. code-block:: text

   输入：candiesCount = [7,4,5], queries = [[1,7,1],[2,3,2]]
   输出：[true,false]
   解释：每天一颗时第 7 天开始吃类型 1；到第 3 天最多只吃 8 颗，尚不能到类型 2。

.. code-block:: text

   输入：candiesCount = [1], queries = [[0,0,1]]
   输出：[true]
   解释：第一天可吃唯一糖果。