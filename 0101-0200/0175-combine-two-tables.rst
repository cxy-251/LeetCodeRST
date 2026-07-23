0175. Combine Two Tables
========================

题目信息
--------

:题号: 0175
:难度: Easy
:主题: Database、LEFT JOIN、空值保留
:原题: `LeetCode 0175 <https://leetcode.com/problems/combine-two-tables/>`_
:重点: Person 为完整主集合、按 personId 关联、无地址人员仍需输出

题目重述
--------

数据库包含 ``Person`` 和 ``Address`` 两张表。``Person.personId`` 唯一标识人员，并保存 ``firstName`` 与 ``lastName``；``Address.addressId`` 唯一标识地址记录，``Address.personId`` 指向对应人员，并保存 ``city`` 与 ``state``。

编写查询，返回每个 ``Person`` 记录的 ``firstName``、``lastName``、``city`` 和 ``state``。没有对应地址记录的人员仍必须出现在结果中，其 ``city`` 和 ``state`` 应为 ``NULL``。结果行顺序没有要求。

自建示例
--------

.. code-block:: text

   Person:
   personId | lastName | firstName
   10       | Chen     | Mira
   20       | Diaz     | Leo

   Address:
   addressId | personId | city   | state
   7         | 10       | Austin | TX

   输出：
   firstName | lastName | city   | state
   Mira      | Chen     | Austin | TX
   Leo       | Diaz     | NULL   | NULL

   解释：Mira 通过 personId = 10 匹配到地址；Leo 没有地址记录，但仍须保留并以 NULL 填充地址列。