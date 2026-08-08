0184. Department Highest Salary
===============================

题目信息
--------

:题号: 0184. 部门工资最高的员工
:难度: Medium
:主题: Database、分组最大值、连接、并列保留
:原题: `LeetCode 0184 <https://leetcode.com/problems/department-highest-salary/>`_
:重点: 先按部门压缩出最高薪资，再用部门与薪资双条件回连员工以恢复全部并列者

题目重述
--------

``Employee(id, name, salary, departmentId)`` 保存员工，``Department(id, name)`` 保存部门，
员工通过 ``departmentId`` 归属部门。

查询每个部门中薪资最高的所有员工，输出列依次命名为 ``Department``、``Employee``、
``Salary``。同部门若有多人并列最高，必须全部保留；结果顺序任意。

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

SQL 实现
--------

.. code-block:: sql

   SELECT
       department.name AS Department,
       employee.name AS Employee,
       employee.salary AS Salary
   FROM Employee AS employee
   INNER JOIN Department AS department
       ON department.id = employee.departmentId
   INNER JOIN (
       SELECT
           departmentId,
           MAX(salary) AS highest_salary
       FROM Employee
       GROUP BY departmentId
   ) AS highest
       ON highest.departmentId = employee.departmentId
      AND highest.highest_salary = employee.salary;

题解
----

全局最大值丢失了分区
~~~~~~~~~~~~~~~~~~~~

直接计算 ``MAX(salary)`` 只能得到整张员工表的最高薪资，可能只属于一个部门。题目要求
每个部门独立竞争，所以比较状态必须包含 ``departmentId``；不同部门即使薪资相同，也不
属于同一个排名集合。

按部门分组并计算 ``MAX(salary)`` 后，可以得到：

.. code-block:: text

   departmentId | highest_salary
   1            | 8800
   2            | 7200

这张派生表把每个部门的所有员工压缩成一个目标边界，删除了反复比较同部门薪资的工作。

聚合结果为什么还不是答案
~~~~~~~~~~~~~~~~~~~~~~~~

分组表只有部门 id 和最高薪资，不再保留员工身份。直接在同一 ``GROUP BY`` 查询中选择
``Employee.name``，在严格 SQL 模式下不合法；即使某些数据库允许，也只会任意挑选组内
一行，既不能保证该员工薪资最高，也会丢掉并列者。

因此聚合只负责回答“每个部门的最高薪资是多少”，随后必须回到原始 ``Employee`` 行，
回答“哪些员工恰好达到这个薪资”。这体现了两种不同粒度：部门级边界与员工级输出。

双条件回连保留全部并列者
~~~~~~~~~~~~~~~~~~~~~~~~

派生表 ``highest`` 与员工表的连接同时要求：

.. code-block:: text

   highest.departmentId = employee.departmentId
   highest.highest_salary = employee.salary

第一个条件确保使用本部门边界；第二个条件只保留达到边界的员工。若只按薪资连接，一个
部门的最高薪资可能误匹配另一个部门的同薪员工；若只按部门连接，则该部门所有员工都会
留下。

连接不是“每组取一行”，而是保留所有满足等值条件的原始行。Design 部门的 Asha、Ben
都满足 ``salary = 8800``，所以自然得到两行，无需 ``RANK`` 也无需特殊处理并列。

部门名称来自第三种粒度
~~~~~~~~~~~~~~~~~~~~~~

``Employee`` 只保存 ``departmentId``，题目输出需要部门名称，因此再按
``department.id = employee.departmentId`` 连接 ``Department``。三部分各司其职：

* 分组派生表给出部门级最高薪资；
* 原始员工表恢复达到最高值的全部员工；
* 部门表把 id 映射为展示名称。

最终投影明确设置 ``Department``、``Employee``、``Salary`` 三个列名。部门若没有员工，
不会出现在最高薪资派生表中，也就没有“工资最高的员工”可输出。

具体走读
~~~~~~~~

派生表先得到 Design 的 8800、Support 的 7200。回连 Employee 时，Asha、Ben 同时匹配
``(departmentId=1, salary=8800)``；Cora 薪资不等于边界被删除。Support 中只有 Elin
匹配 7200。最后连接 Department，把 1、2 转成 Design、Support。

方案取舍与执行代价
~~~~~~~~~~~~~~~~~~

也可以对员工使用 ``DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC)``
并筛选名次 1；窗口法为每名员工保留部门内排名，适合还要输出更多名次的场景。本题只需
最高边界，分组 ``MAX`` 加回连更直接，因此选为主解。

逻辑上需要一次按部门聚合和一次等值连接。无索引时通常是线性扫描加哈希状态；
``Employee(departmentId, salary)`` 复合索引可帮助分组或回连。查询不会为每名员工重复执行
一个相关最大值子查询，部门边界只计算一次。
