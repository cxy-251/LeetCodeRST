0183. Customers Who Never Order
===============================

题目信息
--------

:题号: 0183. 从不订购的客户
:难度: Easy
:主题: Database、反连接、NOT EXISTS、NULL
:原题: `LeetCode 0183 <https://leetcode.com/problems/customers-who-never-order/>`_
:重点: 以 Customers 为候选全集，对每个客户证明不存在关联订单，而不是枚举未匹配行对

题目重述
--------

``Customers(id, name)`` 表保存客户；``Orders(id, customerId)`` 表保存订单，
``customerId`` 引用下单客户。

查询从未下过订单的客户姓名，将输出列命名为 ``Customers``。客户只要存在一条订单就不
能输出，结果顺序任意。

自建示例
--------

.. code-block:: text

   Customers:
   id | name
   1  | Hana
   2  | Luis
   3  | Mei
   4  | Tariq

   Orders:
   id | customerId
   11 | 1
   12 | 3
   13 | 1

   输出：
   Customers
   Luis
   Tariq

   Hana 有两条订单、Mei 有一条；Luis 与 Tariq 没有关联订单。

SQL 实现
--------

主解：存在性反查询
~~~~~~~~~~~~~~~~~~

.. code-block:: sql

   SELECT customer.name AS Customers
   FROM Customers AS customer
   WHERE NOT EXISTS (
       SELECT 1
       FROM Orders AS order_record
       WHERE order_record.customerId = customer.id
   );

等价方案：左反连接
~~~~~~~~~~~~~~~~~~

.. code-block:: sql

   SELECT customer.name AS Customers
   FROM Customers AS customer
   LEFT JOIN Orders AS order_record
       ON order_record.customerId = customer.id
   WHERE order_record.id IS NULL;

题解
----

目标是证明不存在
~~~~~~~~~~~~~~~~

查询的候选全集是 ``Customers`` 的每一行。对当前客户，问题不是找到某个特殊订单，而是
判断关联集合是否为空：

.. code-block:: text

   不存在 order_record，使 order_record.customerId = customer.id

逐个客户扫描整张 ``Orders`` 可以完成判断，但会重复搜索订单表。SQL 的反连接语义让
优化器负责建立索引查找或哈希结构，查询只需直接表达“不存在匹配”。

NOT EXISTS 的状态语义
~~~~~~~~~~~~~~~~~~~~~

相关子查询用当前 ``customer.id`` 检查订单：

* 找到第一条关联订单，``EXISTS`` 就为真，外层 ``NOT`` 为假，客户被排除；
* 扫描或查找结束仍没有关联行，``EXISTS`` 为假，``NOT EXISTS`` 为真，客户被输出。

``SELECT 1`` 表明只关心行是否存在，不读取订单内容，也不统计订单数量。Hana 有一条还是
两条订单都不会改变结论；存在性一旦成立，逻辑上就无需继续枚举她的其他订单。

每个客户在外层只出现一次，所以主解不需要 ``DISTINCT``。输出将 ``customer.name``
别名设为题目要求的 ``Customers``。

左连接如何表达同一反关系
~~~~~~~~~~~~~~~~~~~~~~~~~~

左连接从全部客户出发：有订单的客户与订单行匹配，没有订单的客户获得一条右侧列全为
``NULL`` 的扩展行。随后 ``WHERE order_record.id IS NULL`` 只保留未匹配扩展行，形成
“左表减去能够匹配右表的行”，也就是左反连接。

空值检查选择 ``order_record.id``，因为它是订单主键，真实订单行不可能为 ``NULL``；
一旦它为空，就能确定整条右侧记录来自左连接的缺失填充。检查一个本身允许为空的业务列
会把“匹配到但该列为空”与“根本没匹配到”混在一起。

有订单的客户可能在左连接中展开为多行，但这些行的订单主键都非空，会全部被过滤；无订单
客户只留下那一条空扩展行。因此等价方案也无需 ``DISTINCT``。相比之下，``NOT EXISTS``
更直接表达“找到任一订单即可淘汰”，所以选为主解。

为什么谨慎使用 NOT IN
~~~~~~~~~~~~~~~~~~~~~~

看似可以写 ``customer.id NOT IN (SELECT customerId FROM Orders)``。如果子查询结果中存在
``NULL``，SQL 三值逻辑会让“不等于所有值”变成未知，许多本应输出的客户也会被过滤。

即使当前表约束使 ``customerId`` 非空，``NOT EXISTS`` 仍更准确地绑定关联条件，不依赖
右列未来是否允许空值。若使用 ``NOT IN``，至少必须在子查询中显式排除 ``NULL``。

具体走读与执行代价
~~~~~~~~~~~~~~~~~~

Hana 的 id 1 在订单 11 处命中，立即排除；Luis 的 id 2 没有匹配，输出；Mei 的 id 3
命中订单 12，排除；Tariq 的 id 4 没有匹配，输出。

数据库通常会把 ``NOT EXISTS`` 改写为反连接。``Orders.customerId`` 有索引时，可以为每名
客户做存在性查找；也可以扫描订单建立哈希集合，再扫描客户。查询文本不承诺具体物理计划，
但只保留“没有任何关联订单”的客户这一不变量。
