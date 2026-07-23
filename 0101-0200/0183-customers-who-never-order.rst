0183. Customers Who Never Order
===============================

题目信息
--------

:题号: 0183
:难度: Easy
:主题: Database、反连接、NOT EXISTS
:原题: `LeetCode 183 <https://leetcode.com/problems/customers-who-never-order/>`_
:重点: Customers 为候选全集、Orders.customerId 关联、完全没有订单、输出姓名

题目重述
--------

``Customers`` 表包含客户的 ``id`` 和 ``name``；``Orders`` 表包含订单 ``id`` 以及下单客户的 ``customerId``，该字段引用 ``Customers.id``。

编写查询，返回从未在 ``Orders`` 表中出现过的客户姓名，并把结果列命名为 ``Customers``。客户只要存在至少一条订单记录就不能输出；结果行顺序没有要求。

自建示例
--------

.. code-block:: text

   Customers:
   id | name
   1  | Hana
   2  | Luis
   3  | Mei
   4  | Tariq

   Orders:
   id | customerId
   11 | 1
   12 | 3
   13 | 1

   输出：
   Customers
   Luis
   Tariq

   解释：Hana 和 Mei 至少有一条订单；Luis 与 Tariq 的 id 从未出现在 Orders.customerId 中。