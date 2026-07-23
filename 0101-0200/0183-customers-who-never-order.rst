0183. Customers Who Never Order
===============================

题目信息
--------

:题号: 0183
:难度: Easy
:主题: SQL、反连接、NOT EXISTS
:原题: `LeetCode 183 <https://leetcode.com/problems/customers-who-never-order/>`_
:重点: 使用反连接或 ``NOT EXISTS``，判断客户是否完全没有匹配订单。

题目重述
--------

给定 ``Customers`` 与 ``Orders`` 表，返回从未产生订单的客户姓名，结果列名为 ``Customers``。

自建示例
--------

.. code-block:: text

   Customers:
   id | name
   1  | Alice
   2  | Bob
   3  | Carol

   Orders:
   id | customerId
   10 | 1
   11 | 3

   结果:
   Customers
   Bob
