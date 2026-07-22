0196. Delete Duplicate Emails
=============================

题目信息
--------

:题号: 0196
:难度: Easy
:类型: Database
:主题: SQL、DELETE、自连接、最小主键保留
:原题: `LeetCode 196 <https://leetcode.com/problems/delete-duplicate-emails/>`_
:教学重点: 删除同邮箱中存在更小 ``id`` 的记录，保证最小主键行留下。

题目重述
--------

``Person`` 表可能有重复邮箱。删除重复记录，使每个邮箱只保留 ``id`` 最小的那一行。

自建示例
--------

.. code-block:: text

   删除前:
   id | email
   1  | a@example.com
   2  | a@example.com
   3  | b@example.com

   删除后:
   id | email
   1  | a@example.com
   3  | b@example.com
