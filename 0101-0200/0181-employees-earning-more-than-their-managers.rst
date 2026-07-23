0181. Employees Earning More Than Their Managers
================================================

题目信息
--------

:题号: 0181
:难度: Easy
:主题: Database、自连接、层级关系
:原题: `LeetCode 181 <https://leetcode.com/problems/employees-earning-more-than-their-managers/>`_
:重点: managerId 指向同表员工、直属经理、薪资严格大于、输出员工姓名

题目重述
--------

``Employee`` 表包含员工的 ``id``、``name``、``salary`` 和 ``managerId``。``managerId`` 为 ``NULL`` 表示该员工没有经理，否则它引用同一张表中直属经理的 ``id``。

编写查询，返回薪资严格高于其直属经理的员工姓名，并把结果列命名为 ``Employee``。没有经理的员工无法进行比较，不应出现在结果中；员工薪资与经理相等也不满足条件。结果行顺序没有要求。

自建示例
--------

.. code-block:: text

   Employee:
   id | name  | salary | managerId
   1  | Nora  | 9000   | NULL
   2  | Ivan  | 9500   | 1
   3  | Priya | 9000   | 1
   4  | Omar  | 8200   | 2

   输出：
   Employee
   Ivan

   解释：Ivan 的直属经理 Nora 薪资为 9000，而 Ivan 为 9500；Priya 只与经理同薪，Omar 的薪资低于经理 Ivan。