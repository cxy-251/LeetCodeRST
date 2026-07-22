0181. Employees Earning More Than Their Managers
================================================

题目信息
--------

:题号: 0181
:难度: Easy
:类型: Database
:主题: SQL、自连接、层级关系
:原题: `LeetCode 181 <https://leetcode.com/problems/employees-earning-more-than-their-managers/>`_
:教学重点: 将员工行与经理行按 ``managerId = id`` 自连接，再比较两者薪资。

题目重述
--------

``Employee`` 表中 ``managerId`` 指向另一名员工。返回工资严格高于其直属经理的员工姓名，结果列名为 ``Employee``。没有经理的员工不参与比较。

自建示例
--------

.. code-block:: text

   Employee:
   id | name  | salary | managerId
   1  | Alice | 9000   | NULL
   2  | Bob   | 10000  | 1
   3  | Carol | 8000   | 1

   结果:
   Employee
   Bob
