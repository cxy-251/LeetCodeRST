0184. Department Highest Salary
===============================

题目信息
--------

:题号: 0184
:难度: Medium
:主题: Database、分组最大值、并列保留
:原题: `LeetCode 184 <https://leetcode.com/problems/department-highest-salary/>`_
:重点: 按部门独立比较、最高薪资、并列员工全部保留、部门名称关联

题目重述
--------

``Employee`` 表包含员工的 ``id``、``name``、``salary`` 和 ``departmentId``；``Department`` 表包含部门 ``id`` 与 ``name``。``Employee.departmentId`` 引用员工所属部门。

编写查询，返回每个部门中薪资最高的所有员工，结果列依次命名为 ``Department``、``Employee`` 和 ``Salary``。若同一部门有多人并列最高，必须全部输出；不同部门的薪资只在各自部门内部比较。结果行顺序没有要求。

自建示例
--------

.. code-block:: text

   Department:
   id | name
   1  | Design
   2  | Support

   Employee:
   id | name  | salary | departmentId
   1  | Asha  | 8800   | 1
   2  | Ben   | 8800   | 1
   3  | Cora  | 7600   | 1
   4  | Diego | 6900   | 2
   5  | Elin  | 7200   | 2

   输出：
   Department | Employee | Salary
   Design     | Asha     | 8800
   Design     | Ben      | 8800
   Support    | Elin     | 7200

   解释：Design 部门的最高薪资 8800 由两人并列获得；Support 部门的最高薪资是 7200。