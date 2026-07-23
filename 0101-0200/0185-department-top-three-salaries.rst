0185. Department Top Three Salaries
===================================

题目信息
--------

:题号: 0185
:难度: Hard
:主题: Database、分区稠密排名、并列保留
:原题: `LeetCode 185 <https://leetcode.com/problems/department-top-three-salaries/>`_
:重点: 按部门分区、前三个不同薪资等级、相同薪资同名次、全部并列员工

题目重述
--------

``Employee`` 表包含员工的 ``id``、``name``、``salary`` 和 ``departmentId``；``Department`` 表包含部门 ``id`` 与 ``name``。编写查询，返回每个部门中薪资位于前三个**不同薪资等级**的所有员工。

薪资等级按部门内部从高到低计算，相同薪资共享同一个等级，因此处于第三个薪资等级的并列员工必须全部保留。结果列命名为 ``Department``、``Employee`` 和 ``Salary``；部门不足三个不同薪资等级时，输出该部门所有员工。结果行顺序没有要求。

自建示例
--------

.. code-block:: text

   Department:
   id | name
   1  | Research

   Employee:
   id | name | salary | departmentId
   1  | Ana  | 12000  | 1
   2  | Bo   | 10500  | 1
   3  | Cy   | 10500  | 1
   4  | Dev  | 9200   | 1
   5  | Emi  | 8700   | 1

   输出：
   Department | Employee | Salary
   Research   | Ana      | 12000
   Research   | Bo       | 10500
   Research   | Cy       | 10500
   Research   | Dev      | 9200

   解释：三个不同薪资等级是 12000、10500、9200；Bo 与 Cy 在第二等级并列，均须输出，第四等级 8700 被排除。