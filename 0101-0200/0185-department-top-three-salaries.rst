0185. Department Top Three Salaries
===================================

题目信息
--------

:题号: 0185. 部门工资前三高的所有员工
:难度: Hard
:主题: Database、窗口函数、分区密集排名、并列保留
:原题: `LeetCode 0185 <https://leetcode.com/problems/department-top-three-salaries/>`_
:重点: 在每个部门内按不同薪资等级密集排名，筛选前三等级而不是每部门前三行

题目重述
--------

``Employee(id, name, salary, departmentId)`` 保存员工，``Department(id, name)`` 保存部门。
查询每个部门中薪资位于前三个 **不同薪资等级** 的所有员工。

相同薪资共享一个等级，第三等级的全部并列员工都要保留。输出列依次命名为
``Department``、``Employee``、``Salary``；部门不足三个不同薪资等级时，输出该部门
全部员工。结果顺序任意。

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

   三个不同等级是 12000、10500、9200；第二等级的两名员工都保留。

SQL 实现
--------

.. code-block:: sql

   WITH ranked_employee AS (
       SELECT
           name,
           salary,
           departmentId,
           DENSE_RANK() OVER (
               PARTITION BY departmentId
               ORDER BY salary DESC
           ) AS salary_rank
       FROM Employee
   )
   SELECT
       department.name AS Department,
       employee.name AS Employee,
       employee.salary AS Salary
   FROM ranked_employee AS employee
   INNER JOIN Department AS department
       ON department.id = employee.departmentId
   WHERE employee.salary_rank <= 3;

题解
----

“前三”指等级而不是三行
~~~~~~~~~~~~~~~~~~~~~~

如果把每个部门按薪资降序后只取三名员工，示例会取 Ana、Bo、Cy，反而漏掉第三个不同薪资
等级 9200 的 Dev。重复薪资占用了行位置，却不应占用新等级。

原始定义可以改写为：某员工属于前三等级，当且仅当本部门严格高于其薪资的不同值不超过
两个。为每名员工执行相关子查询并 ``COUNT(DISTINCT salary)`` 可以判断，但同部门员工会
反复扫描、去重几乎相同的更高薪资集合。

窗口函数一次建立部门内顺序，给每条员工行附上其薪资等级，不再为每人重新计数。

为什么必须分区
~~~~~~~~~~~~~~

``PARTITION BY departmentId`` 把员工拆成互不影响的部门窗口。每个分区的排名都从 1 重新
开始；Research 的 9200 只与 Research 员工比较，不会被其他部门的高薪挤出前三。

窗口没有使用部门名称分区，因为稳定身份是 ``departmentId``。不同部门可能同名，若按
名称分区会错误合并；名称只在最后连接时用于展示。

为什么选择 DENSE_RANK
~~~~~~~~~~~~~~~~~~~~~~

对示例薪资 ``12000、10500、10500、9200、8700``：

.. code-block:: text

   函数          产生的名次
   ROW_NUMBER     1,2,3,4,5
   RANK           1,2,2,4,5
   DENSE_RANK     1,2,2,3,4

``ROW_NUMBER`` 让两个 10500 占不同名次，筛选前三行会漏掉 Dev；``RANK`` 虽让并列者同名次，
却按并列行数留下空洞，9200 变为第 4。``DENSE_RANK`` 同时满足并列同名次、后续等级连续，
与“不同薪资等级”的定义完全一致。

``ORDER BY salary DESC`` 让最高薪资密集名次为 1，随后每遇到一个更低的不同值才加一。
筛选 ``salary_rank <= 3`` 因而保留前三个不同薪资值对应的所有原始员工行。

查询阶段如何分工
~~~~~~~~~~~~~~~~

公共表表达式 ``ranked_employee`` 保留每名员工的姓名、薪资、部门 id，并附加部门内密集
名次。它不去重员工，所以第三等级无论有多少并列者都会保留。

外层查询完成两件事：用 ``salary_rank <= 3`` 删除第四等级及以后员工；按
``department.id = employee.departmentId`` 连接部门名称。最后投影题目指定三列并设置
别名，不需要 ``DISTINCT``。

若某部门只有一个或两个不同薪资等级，所有员工的密集名次自然都不超过 3，整部门都会
输出，无需额外分支。没有员工的部门没有可排名、可输出的员工，也不会产生结果行。

具体走读
~~~~~~~~

Research 分区从高到低扫描：Ana 的 12000 得到 1；Bo、Cy 的排序键相同，都得到 2；
Dev 的 9200 是第三个新值，得到 3；Emi 的 8700 得到 4。外层只删除 Emi，再把
``departmentId = 1`` 映射为 Research。

窗口中的排序只定义排名，不保证最终结果展示顺序；题目允许任意顺序，因此外层没有
``ORDER BY``。若需要稳定展示，应另行写外层排序，不能依赖窗口处理顺序。

执行代价
~~~~~~~~

数据库需要按 ``departmentId`` 分组并在分区内按 ``salary DESC`` 建立顺序，无合适索引时
通常为 ``O(n log n)``，随后窗口扫描和部门连接近似线性。复合索引
``(departmentId, salary)`` 可能帮助有序读取。相比逐员工相关子查询，部门内等级只在一次
窗口流程中计算。
