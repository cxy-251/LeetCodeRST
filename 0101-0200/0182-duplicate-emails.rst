0182. Duplicate Emails
======================

题目信息
--------

:题号: 0182
:难度: Easy
:主题: Database、分组、聚合过滤
:原题: `LeetCode 182 <https://leetcode.com/problems/duplicate-emails/>`_
:重点: 非空邮箱、出现次数大于一次、每个重复值只输出一次

题目重述
--------

``Person`` 表包含唯一标识 ``id`` 和非空电子邮箱 ``email``。编写查询，找出在表中出现至少两次的所有邮箱地址，并把结果列命名为 ``Email``。

同一个重复邮箱无论出现多少次，在结果中都只输出一行；只出现一次的邮箱不输出。结果行顺序没有要求。

自建示例
--------

.. code-block:: text

   Person:
   id | email
   1  | team@example.com
   2  | solo@example.com
   3  | team@example.com
   4  | news@example.com
   5  | news@example.com
   6  | news@example.com

   输出：
   Email
   team@example.com
   news@example.com

   解释：team@example.com 出现两次，news@example.com 出现三次，二者各输出一次；solo@example.com 只出现一次。