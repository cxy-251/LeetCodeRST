1833. Maximum Ice Cream Bars
============================

题目信息
--------

:题号: 1833
:难度: Medium
:主题: 贪心、排序
:原题: `LeetCode 1833 <https://leetcode.com/problems/maximum-ice-cream-bars/>`_
:重点: 优先购买价格最低的冰淇淋以最大化数量

题目重述
--------

每根冰淇淋只能购买一次。给定价格数组和硬币数，返回最多能购买的根数。

自建示例
--------

.. code-block:: text

   输入：costs = [1,3,2,4], coins = 6
   输出：3
   解释：购买价格 1、2、3 的三根，正好花费 6。

.. code-block:: text

   输入：costs = [5], coins = 4
   输出：0
   解释：硬币不足以购买唯一商品。
