0176. Second Highest Salary
===========================

题目信息
--------

:题号: 0176
:难度: Medium
:主题: Database、去重、排序、空结果
:原题: `LeetCode 176 <https://leetcode.com/problems/second-highest-salary/>`_
:重点: 不同薪资等级、第二高值、固定列名、无结果返回 NULL

题目重述
--------

``Employee`` 表包含唯一员工标识 ``id`` 和薪资 ``salary``。编写查询，返回表中第二高的**不同薪资值**，并把结果列命名为 ``SecondHighestSalary``。

多名员工拥有相同薪资时，该薪资只算一个等级。若表中少于两个不同的薪资等级，查询仍应返回一行，但该列的值必须为 ``NULL``。

自建示例
--------

.. code-block:: text

   Employee:
   id | salary
   1  | 4200
   2  | 6100
   3  | 6100
   4  | 5300

   输出：
   SecondHighestSalary
   5300

   解释：不同薪资按降序为 6100、5300、4200；重复的 6100 只占一个等级，因此第二高薪资是 5300。

.. code-block:: text

   Employee:
   id | salary
   1  | 4800
   2  | 4800

   输出：
   SecondHighestSalary
   NULL

   解释：表中只有一个不同薪资等级，不存在第二高薪资。