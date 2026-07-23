0196. Delete Duplicate Emails
=============================

题目信息
--------

:题号: 0196
:难度: Easy
:主题: Database、DELETE、自连接、最小主键保留
:原题: `LeetCode 196 <https://leetcode.com/problems/delete-duplicate-emails/>`_
:重点: 修改原表、相同 email 去重、保留最小 id、删除其余记录

题目重述
--------

``Person`` 表包含唯一主键 ``id`` 和非空邮箱 ``email``，同一个邮箱可能出现在多条记录中。编写 ``DELETE`` 语句直接修改该表，使每个不同邮箱最终只保留一条记录。

对于一组邮箱相同的记录，必须保留 ``id`` 最小的那一行，并删除该组中所有更大 ``id`` 的行。题目要求执行删除操作，而不是仅查询去重后的结果；删除后表中记录的显示顺序没有要求。

自建示例
--------

.. code-block:: text

   删除前 Person：
   id | email
   4  | a@example.com
   7  | b@example.com
   9  | a@example.com
   12 | a@example.com
   15 | b@example.com

   删除后 Person：
   id | email
   4  | a@example.com
   7  | b@example.com

   解释：a@example.com 保留最小 id 4，删除 id 9 和 12；b@example.com 保留最小 id 7，删除 id 15。