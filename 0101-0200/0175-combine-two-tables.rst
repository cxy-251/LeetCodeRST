0175. Combine Two Tables
========================

题目信息
--------

:题号: 0175
:难度: Easy
:类型: Database
:主题: SQL、LEFT JOIN、空值保留
:原题: `LeetCode 175 <https://leetcode.com/problems/combine-two-tables/>`_
:教学重点: 以人员表为主表执行左连接，避免丢失没有地址记录的人。

题目重述
--------

关联 ``Person`` 与 ``Address`` 两张表，返回每个人的 ``firstName``、``lastName``、``city`` 和 ``state``。即使某个人没有地址记录，也必须保留该人员，并让地址列返回 ``NULL``。

自建示例
--------

.. code-block:: text

   Person:
   id | lastName | firstName
   1  | Wang     | Alice
   2  | Li       | Bob

   Address:
   personId | city    | state
   1        | Seattle | WA

   结果:
   firstName | lastName | city    | state
   Alice     | Wang     | Seattle | WA
   Bob       | Li       | NULL    | NULL
