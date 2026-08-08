0181. Employees Earning More Than Their Managers
================================================

题目信息
--------

:题号: 0181. 超过经理收入的员工
:难度: Easy
:主题: Database、自连接、层级关系
:原题: `LeetCode 0181 <https://leetcode.com/problems/employees-earning-more-than-their-managers/>`_
:重点: 为同一张 Employee 表建立员工与经理两个角色，先按直属关系配对再比较薪资

题目重述
--------

``Employee(id, name, salary, managerId)`` 表保存员工。``managerId`` 为 ``NULL`` 表示没有
经理，否则引用同表中直属经理的 ``id``。

查询薪资严格高于直属经理的员工姓名，并把输出列命名为 ``Employee``。无经理的员工不
参与比较，结果顺序任意。

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

   Ivan 高于直属经理 Nora；Priya 与经理同薪，不满足“严格高于”。

SQL 实现
--------

.. code-block:: sql

   SELECT employee.name AS Employee
   FROM Employee AS employee
   INNER JOIN Employee AS manager
       ON employee.managerId = manager.id
   WHERE employee.salary > manager.salary;

题解
----

比较对象必须先配对
~~~~~~~~~~~~~~~~~~

只查看一条 ``Employee`` 记录，可以看到员工薪资和 ``managerId``，却看不到经理薪资；
经理信息位于同一张表的另一行。若枚举任意两行再比较薪资，会产生大量没有管理关系的组合，
例如把 Ivan 与 Omar 比较没有题目意义。

真正的搜索空间是每名有经理员工对应的唯一关系边：

.. code-block:: text

   employee.managerId -> manager.id

先沿这条边找到直属经理，才能比较一对具有业务含义的薪资。相关子查询可以为每个员工单独
查经理，但自连接一次性把“员工行”和“经理行”放进同一结果行，后续条件更直接。

同表的两个角色
~~~~~~~~~~~~~~

查询把 ``Employee`` 引用两次，并分别命名为 ``employee``、``manager``。别名不是为了
缩短拼写，而是区分同一列在关系中的角色：

* ``employee.managerId`` 是关系边的起点；
* ``manager.id`` 是被引用的经理主键；
* ``employee.salary`` 与 ``manager.salary`` 才是需要比较的两个值。

若误写成 ``employee.id = manager.id``，每行只会与自己配对，薪资不可能严格大于自身；
若不限定关系直接交叉连接，则员工可能因高于任意无关人员而被错误输出。

为什么使用内连接
~~~~~~~~~~~~~~~~

题目只关心有直属经理且可以完成比较的员工。``INNER JOIN`` 只保留
``employee.managerId = manager.id`` 的配对：顶层经理的 ``managerId`` 为 ``NULL``，
无法与任何 ``id`` 相等，会在连接阶段自然消失。

使用左连接后再写 ``employee.salary > manager.salary`` 也会过滤空经理行，因为与
``NULL`` 比较不会为真；但那是先构造无经理扩展行再删除。内连接直接表达“经理必须存在”
的业务条件，保留的状态更准确。

严格比较与投影
~~~~~~~~~~~~~~

连接完成后，每行同时具有员工和其直属经理的薪资。``WHERE employee.salary >
manager.salary`` 使用严格大于：相等薪资不满足条件，不能写成 ``>=``。

最终只投影 ``employee.name``，并按题目要求别名为 ``Employee``。不需要 ``DISTINCT``：
``manager.id`` 是主键，每个 ``managerId`` 最多匹配一个经理，因此一名员工最多生成一条
配对行。多个员工同名时仍代表不同记录，擅自去重反而可能改变结果行数。

具体走读
~~~~~~~~

Ivan 的 ``managerId = 1`` 与 Nora 的 ``id = 1`` 匹配，配对薪资为 9500、9000，严格
比较通过，输出 Ivan。Priya 匹配到同一经理，但 9000 不大于 9000；Omar 匹配到 Ivan，
8200 不大于 9500。Nora 没有经理，在内连接阶段已被排除。

执行代价
~~~~~~~~

逻辑上每名员工沿 ``managerId`` 完成一次主键查找，再比较两个标量。``manager.id`` 作为
主键通常已有索引，优化器可以用索引嵌套循环；也可能根据数据规模选择哈希连接。无论物理
计划如何，自连接只保留直属关系边，不枚举无关员工对。
