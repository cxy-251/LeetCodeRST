0184. Department Highest Salary
===============================

题目信息
--------

:题号: 0184
:难度: Medium
:类型: Database
:主题: SQL、分组最大值、并列保留
:原题: `LeetCode 184 <https://leetcode.com/problems/department-highest-salary/>`_
:教学重点: 先确定各部门最高薪资，再回到员工记录保留所有并列者。

题目重述
--------

返回每个部门中薪资最高的员工。若同一部门有多人并列最高，必须全部返回。结果列为 ``Department``、``Employee``、``Salary``。

自建示例
--------

.. code-block:: text

   Department:
   id | name
   1  | Engineering

   Employee:
   name  | salary | departmentId
   Alice | 9000   | 1
   Bob   | 9000   | 1
   Carol | 8000   | 1

   结果:
   Department  | Employee | Salary
   Engineering | Alice    | 9000
   Engineering | Bob      | 9000
