1599. Maximum Profit of Operating a Centennial Wheel
====================================================

题目信息
--------

:题号: 1599
:难度: Medium
:主题: 数组、模拟、累计利润
:原题: `LeetCode 1599 <https://leetcode.com/problems/maximum-profit-of-operating-a-centennial-wheel/>`_
:重点: 每轮最多登乘四人，每人贡献 ``boardingCost``，每轮固定支出 ``runningCost``；返回累计利润首次达到最大值的轮次

题目重述
--------

摩天轮每转一轮最多搭载四名等待顾客。``customers[i]`` 表示第 ``i+1`` 轮开始前新到达的顾客数；所有已等待顾客会继续排队，直到登乘。每位登乘顾客带来 ``boardingCost`` 收入，每轮运行成本为 ``runningCost``。

可以在顾客全部处理前后选择停止。请返回累计利润最大时的最早轮次编号；若最大利润不为正数，返回 ``-1``。

``1 <= customers.length <= 10^5``，成本和顾客数均为非负整数。

自建示例
--------

处理剩余少量顾客可能降低累计利润：

.. code-block:: text

   输入：customers = [5], boardingCost = 5, runningCost = 6
   输出：1
   解释：第一轮搭载四人利润为 14；第二轮只搭载一人使累计利润降为 13。

每轮收入都不足运行成本时返回负一：

.. code-block:: text

   输入：customers = [1], boardingCost = 1, runningCost = 5
   输出：-1
   解释：唯一一轮利润为 -4，未产生正利润。