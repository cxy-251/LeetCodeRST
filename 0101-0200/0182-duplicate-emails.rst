0182. Duplicate Emails
======================

题目信息
--------

:题号: 0182
:难度: Easy
:类型: Database
:主题: SQL、分组、聚合过滤
:原题: `LeetCode 182 <https://leetcode.com/problems/duplicate-emails/>`_
:教学重点: 按邮箱分组并在聚合后筛选计数大于一的组。

题目重述
--------

从 ``Person`` 表中找出出现次数大于一次的电子邮箱。每个重复邮箱只输出一次，结果列名为 ``Email``。

自建示例
--------

.. code-block:: text

   Person:
   id | email
   1  | a@example.com
   2  | b@example.com
   3  | a@example.com

   结果:
   Email
   a@example.com
