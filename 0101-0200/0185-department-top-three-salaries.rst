0185. Department Top Three Salaries
===================================

题目信息
--------

:题号: 0185
:难度: Hard
:类型: Database
:主题: SQL、分区稠密排名、并列保留
:原题: `LeetCode 185 <https://leetcode.com/problems/department-top-three-salaries/>`_
:教学重点: 按部门分区对薪资做降序稠密排名，并筛选排名不超过三的记录。

题目重述
--------

返回每个部门薪资处于前三个不同薪资等级的员工。相同薪资共享一个等级，因此并列员工都要保留。结果列为 ``Department``、``Employee``、``Salary``。

自建示例
--------

.. code-block:: text

   某部门薪资:
   Alice 100
   Bob   90
   Carol 90
   David 80
   Eve   70

   前三个不同薪资为 100、90、80，因此返回 Alice、Bob、Carol、David。
