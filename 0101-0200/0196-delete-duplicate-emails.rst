0196. Delete Duplicate Emails
=============================

题目信息
--------

:题号: 0196. 删除重复的电子邮箱
:难度: Easy
:主题: Database、DELETE、自连接、最小主键保留
:原题: `LeetCode 0196 <https://leetcode.com/problems/delete-duplicate-emails/>`_
:重点: 把待删行定义为“存在同邮箱且 id 更小的见证行”，并只删除自连接中的较大 id 角色

题目重述
--------

``Person(id, email)`` 表中 ``id`` 是主键，``email`` 非空但可能重复。编写 ``DELETE`` 语句
直接修改原表，使每个邮箱只保留 ``id`` 最小的一行，删除同组所有较大 ``id`` 行。

题目要求执行删除，不是查询一份去重视图；删除后行顺序任意。

自建示例
--------

.. code-block:: text

   删除前 Person：
   id | email
   4  | a@example.com
   7  | b@example.com
   9  | a@example.com
   12 | a@example.com
   15 | b@example.com

   删除后 Person：
   id | email
   4  | a@example.com
   7  | b@example.com

SQL 实现
--------

.. code-block:: sql

   DELETE duplicate
   FROM Person AS duplicate
   INNER JOIN Person AS smaller
       ON smaller.email = duplicate.email
      AND smaller.id < duplicate.id;

题解
----

先描述保留集合，再取其补集
~~~~~~~~~~~~~~~~~~~~~~~~~~

按 ``email`` 分组并计算 ``MIN(id)`` 可以得到每组要保留的主键，但这只是查询结果。删除题
还要准确描述其补集：哪些原始行不属于保留集合。

一行应被删除，当且仅当存在另一行满足：

.. code-block:: text

   两行 email 相同
   且另一行 id 更小

组内最小 id 找不到这样的见证行，因此不会被选中；任意非最小行至少能与组内最小行配对，
因此一定被选中。这个存在性定义不需要先把 ``MIN(id)`` 物化为临时表。

同一张表的两个角色
~~~~~~~~~~~~~~~~~~

自连接把 ``Person`` 分成两个逻辑角色：

* ``duplicate`` 是候选待删行；
* ``smaller`` 是证明它不应保留的同邮箱较小 id 行。

连接条件必须同时比较邮箱与 id。只有 ``email`` 相等会把同组所有不等行双向配对，连最小
行也可能作为一侧出现；加入 ``smaller.id < duplicate.id`` 后，方向固定为从较小见证指向
较大待删行。

若不小心写成 ``smaller.id > duplicate.id``，``duplicate`` 角色会变成较小行，执行结果
将删除保留者；若使用 ``!=``，同组中的最小、最大行都会出现在某个有差异配对里，最终可能
整组被删。

DELETE 目标别名为何重要
~~~~~~~~~~~~~~~~~~~~~~~

MySQL 多表删除语法中的 ``DELETE duplicate`` 明确只删除 ``duplicate`` 别名代表的行。
``smaller`` 只用于连接和提供存在性证据，不是删除目标。

同一待删行可能匹配多个更小 id。例如 a@example.com 的 id 12 同时匹配 id 4、9，连接
中会出现两条组合；数据库按主键删除目标行，id 12 仍只被删除一次。重复见证不会造成额外
结果，也不需要 ``DISTINCT``。

具体走读
~~~~~~~~

a@example.com 组按 id 为 ``4、9、12``：

* id 4 没有更小同邮箱行，不进入 ``duplicate`` 删除集合；
* id 9 与 smaller id 4 匹配，被删除；
* id 12 与 smaller id 4、9 都匹配，被删除。

b@example.com 的 id 7 同理保留，id 15 因匹配更小的 7 被删除。删除完成后，每组至少有
最小行且至多有它一行，因此恰好保留一行。

为什么不用普通去重查询
~~~~~~~~~~~~~~~~~~~~~~

``SELECT DISTINCT email`` 只返回唯一邮箱文本，既不修改原表，也不决定应保留哪一个
``id``。``GROUP BY email`` 任意选择未聚合 id 也不可靠。主键最小规则必须出现在删除条件
中，才能让物理表最终满足题目状态。

也可以先构造 ``email -> MIN(id)`` 派生表，再删除所有 id 不等于最小值的行；在 MySQL 中
从正在修改的表读取子查询还可能需要额外派生层规避目标表限制。自连接直接受 MySQL 多表
``DELETE`` 支持，语义和实现都更紧凑，因此作为主解。

执行代价与安全边界
~~~~~~~~~~~~~~~~~~

逻辑上需要按邮箱寻找较小 id。``(email, id)`` 复合索引可帮助匹配，优化器也可能使用哈希
或其他连接计划。大重复组会产生多个见证配对，但删除目标按主键唯一。

这是有副作用的语句：在真实数据库中应在事务、备份和目标范围确认后执行；本题平台使用
受控测试表。题解静态推导只说明语句执行后的目标状态，不把 ``SELECT`` 结果误称为已完成
删除。
