1672. Richest Customer Wealth
=============================

题目信息
--------

:题号: 1672
:难度: Easy
:主题: 矩阵、行和
:原题: `LeetCode 1672 <https://leetcode.com/problems/richest-customer-wealth/>`_
:重点: 每位客户财富为其所有银行账户余额之和

题目重述
--------

给定账户矩阵 ``accounts``，第 ``i`` 行属于第 ``i`` 位客户。返回所有客户行和中的最大值。

自建示例
--------

.. code-block:: text

   输入：accounts = [[1,2],[4,0],[2,3]]
   输出：5
   解释：第三位客户财富为 5，与最大值相同。

.. code-block:: text

   输入：accounts = [[7]]
   输出：7
   解释：只有一位客户和一个账户。