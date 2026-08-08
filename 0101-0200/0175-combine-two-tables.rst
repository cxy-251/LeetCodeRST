0175. Combine Two Tables
========================

题目信息
--------

:题号: 0175. 组合两个表
:难度: Easy
:主题: Database、外连接、NULL
:原题: `LeetCode 0175 <https://leetcode.com/problems/combine-two-tables/>`_
:重点: 先确定结果必须完整保留 Person，再用左连接补充可能缺失的地址属性

题目重述
--------

数据库包含两张表：

* ``Person(personId, lastName, firstName)`` 保存人员；``personId`` 是主键；
* ``Address(addressId, personId, city, state)`` 保存人员地址，并通过 ``personId`` 与
  ``Person`` 关联。

查询每个人的 ``firstName``、``lastName``、``city``、``state``。即使某人没有地址，
也必须保留该人员行，并让地址两列为 ``NULL``。结果顺序任意。

自建示例
--------

.. code-block:: text

   Person:
   personId | lastName | firstName
   10       | Chen     | Mira
   20       | Diaz     | Leo

   Address:
   addressId | personId | city   | state
   7         | 10       | Austin | TX

   输出：
   firstName | lastName | city   | state
   Mira      | Chen     | Austin | TX
   Leo       | Diaz     | NULL   | NULL

SQL 实现
--------

.. code-block:: sql

   SELECT
       person.firstName,
       person.lastName,
       address.city,
       address.state
   FROM Person AS person
   LEFT JOIN Address AS address
       ON address.personId = person.personId;

题解
----

先确定结果的主集合
~~~~~~~~~~~~~~~~~~

查询同时需要两类信息：姓名一定来自 ``Person``，地址可能来自 ``Address``。关键约束是
“没有地址的人仍要输出”，所以结果的主集合不是两表共同拥有的人员，而是
``Person`` 的全部行。

若先做笛卡尔积，再用 ``WHERE person.personId = address.personId`` 过滤，最终只剩匹配
成功的组合；没有地址的人根本没有可保留的组合。把它写成 ``INNER JOIN`` 虽然更直接，
语义仍相同，都会丢失 Leo 这一行。

左连接如何删除无效组合
~~~~~~~~~~~~~~~~~~~~~~

``LEFT JOIN`` 以左表的每一行为出发点：

* 在右表找到 ``personId`` 相等的行时，合并两侧列；
* 找不到时，不删除左表行，而是构造一条扩展行，将右表的列填为 SQL ``NULL``。

因此把 ``Person`` 放在 ``LEFT JOIN`` 左侧，正好编码“每个人必须出现”的不变量；
``Address`` 只负责补充可选属性。若交换两表位置，保留下来的将变成全部地址记录，无法保证
无地址人员出现在结果中。

关联条件为什么放在 ON
~~~~~~~~~~~~~~~~~~~~~~

``ON address.personId = person.personId`` 描述两张表中哪些行属于同一个人。数据库先按该
条件寻找地址，再执行左连接的保留规则。

本题没有额外筛选条件。若以后要限制右表属性，也要注意条件位置：把
``address.city = 'Austin'`` 放进 ``WHERE`` 会让地址为 ``NULL`` 的扩展行判断为未知并被
过滤，实际效果接近内连接；若仍要保留无地址人员，应把这类右表匹配条件放入 ``ON``。
这也是将关联语义与最终结果过滤分开的原因。

具体行走读
~~~~~~~~~~

对示例中的 Mira，左连接用 ``personId = 10`` 找到地址行，输出姓名与 ``Austin、TX``。
处理 Leo 时，右表不存在 ``personId = 20``；左连接仍生成结果行，姓名来自左表，
``address.city``、``address.state`` 取真正的数据库空值 ``NULL``，不是字符串
``"NULL"`` 或空字符串。

投影与顺序
~~~~~~~~~~

``SELECT`` 只投影题目指定的四列，列名沿用原字段名，无需额外别名。查询没有使用
``ORDER BY``，因为题目允许任意行顺序；依赖数据库当前扫描顺序既没有语义保证，也没有
必要。

执行代价由数据库优化器和索引决定。逻辑上必须读取全部 ``Person`` 行，并为每行完成
一次地址匹配；有 ``Address.personId`` 索引时可逐行查找，优化器也可能选择扫描两表并
构建哈希连接。无论物理计划如何，左表保留和 ``personId`` 相等匹配的关系保持不变。
