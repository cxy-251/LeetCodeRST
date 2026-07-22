0176. Second Highest Salary
===========================

题目信息
--------

:题号: 0176
:难度: Medium
:类型: Database
:主题: SQL、去重、排序、空结果
:原题: `LeetCode 176 <https://leetcode.com/problems/second-highest-salary/>`_
:教学重点: 先按薪资去重，再定位第二个降序薪资；没有第二级时仍需产生一行空值。

题目重述
--------

从 ``Employee`` 表中返回第二高的不同薪资，并将结果列命名为 ``SecondHighestSalary``。重复薪资只算一个等级；不同薪资不足两个时必须返回一行 ``NULL``。

自建示例
--------

.. code-block:: text

   Employee:
   id | salary
   1  | 100
   2  | 300
   3  | 300
   4  | 200

   结果:
   SecondHighestSalary
   200

   若薪资只有 100、100，则结果为 NULL。
