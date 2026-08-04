1501. Countries You Can Safely Invest In
========================================

:题号: 1501
:题名: Countries You Can Safely Invest In
:类型: Database
:难度: Medium
:访问状态: Premium
:原题: `LeetCode 1501 <https://leetcode.com/problems/countries-you-can-safely-invest-in/>`_
:题面说明: 官方当前需要 Premium；以下题意与表结构依据可公开核对的题目资料整理。

题目重述
--------

数据库包含三张表：

* ``Person(id, name, phone_number)``：保存用户及电话号码，电话号码前三位是国家码；
* ``Country(name, country_code)``：保存国家名称和三位国家码；
* ``Calls(caller_id, callee_id, duration)``：保存每通电话的主叫、被叫和通话时长。

需要找出居民参与通话的平均时长严格大于全部通话平均时长的国家。结果只返回国家名称，顺序不限。

统计口径
--------

一通电话有主叫和被叫两名参与者，所以国家平均值的统计单位不是“唯一的一通电话”，而是“某位居民参与某通电话的一次记录”。

因此：

* 跨国电话会分别给两个国家贡献一条参与记录；
* 同国电话的两端都属于同一国家，会给该国家贡献两条参与记录；
* 重复通话和相同时长都必须保留，不能去重。

常见误区
--------

只统计主叫
~~~~~~~~~~

只连接 ``caller_id`` 会遗漏全部被叫参与记录，国家平均值不完整。

使用 ``UNION``
~~~~~~~~~~~~~~~~

``UNION`` 会删除重复的 ``(person_id, duration)``。同一个人可能参与多通相同时长的电话，因此这里必须使用 ``UNION ALL`` 保留每一次参与事件。

先按人求平均
~~~~~~~~~~~~

先求每个人的平均时长，再按国家平均，会让每个人拥有相同权重。只参与一通电话的人和参与一百通电话的人会被同等对待，不符合题目的统计口径。

同理，在单个国家内分别计算主叫平均值和被叫平均值后再取平均，也会在两类记录数量不同时改变权重。

关系展开与聚合
--------------

``Calls`` 的一行同时保存两个用户角色：

.. code-block:: text

   caller_id | callee_id | duration

后续连接和分组更适合处理“每行一个参与者”的结构，因此先把每通电话展开成两行：

.. code-block:: text

   caller_id -> person_id
   callee_id -> person_id

对应 SQL：

.. code-block:: sql

   SELECT caller_id AS person_id, duration
   FROM Calls

   UNION ALL

   SELECT callee_id AS person_id, duration
   FROM Calls

每通电话恰好生成主叫和被叫两条记录，所以不会漏掉任何一端；``UNION ALL`` 又会保留合法的重复通话。

展开后，通过 ``person_id = Person.id`` 找到用户，再使用电话号码前三位匹配国家码：

.. code-block:: sql

   c.country_code = LEFT(p.phone_number, 3)

国家码是固定长度字符串，并且可能包含前导零，直接按字符串比较最稳妥。

映射完成后，每一行都可以表示为：

.. code-block:: text

   country_code | country | duration

此时直接按国家分组并计算 ``AVG(duration)``，得到的就是该国全部居民参与记录的平均时长。

全局平均值直接从原始 ``Calls`` 计算：

.. code-block:: sql

   SELECT AVG(duration)
   FROM Calls

展开后的全局平均值与它相同，因为每通电话都被完整复制两次，总时长和记录数同时乘以二，平均值不会改变。

示例推演
--------

假设有两个国家和三名用户：

.. code-block:: text

   用户1：A国
   用户2：A国
   用户3：B国

通话记录为：

.. code-block:: text

   用户1 -> 用户3，时长 10
   用户2 -> 用户3，时长 20
   用户1 -> 用户2，时长 30

原始通话的全局平均值为：

.. code-block:: text

   (10 + 20 + 30) / 3 = 20

把每通电话展开为两名参与者后：

.. code-block:: text

   A国：10, 20, 30, 30
   B国：10, 20

第三通电话的两端都是 A 国居民，所以时长 ``30`` 在 A 国中出现两次。这正是“按居民参与记录统计”的含义。

.. code-block:: text

   A国平均值 = (10 + 20 + 30 + 30) / 4 = 22.5
   B国平均值 = (10 + 20) / 2 = 15

只有 A 国的平均值严格大于全局平均值 ``20``。

SQL 实现
--------

.. code-block:: sql

   WITH CallParticipants AS (
       SELECT caller_id AS person_id, duration
       FROM Calls

       UNION ALL

       SELECT callee_id AS person_id, duration
       FROM Calls
   )
   SELECT c.name AS country
   FROM CallParticipants AS cp
   JOIN Person AS p
     ON p.id = cp.person_id
   JOIN Country AS c
     ON c.country_code = LEFT(p.phone_number, 3)
   GROUP BY c.country_code, c.name
   HAVING AVG(cp.duration) > (
       SELECT AVG(duration)
       FROM Calls
   );

查询拆解
--------

``CallParticipants`` 将主叫和被叫统一为 ``person_id``，使后续只需要处理一种用户关系。

第一次连接通过用户主键确定参与者，第二次连接通过电话号码前三位确定国家。按 ``country_code`` 和 ``name`` 一起分组，可以避免仅依赖国家名称作为分组标识。

``AVG(cp.duration)`` 计算每个国家全部参与记录的平均时长。这个值在分组完成后才能判断，因此筛选条件写在 ``HAVING`` 中。

右侧标量子查询只返回一个全局平均值。题目要求严格大于，所以平均值相等的国家不会进入结果。

替代方案
--------

也可以直接将 ``Person`` 与 ``Calls`` 的两端匹配：

.. code-block:: sql

   p.id IN (calls.caller_id, calls.callee_id)

在主叫和被叫不是同一人的前提下，每通电话同样会匹配两名参与者。

这种写法更短，但把两个角色隐藏在一个连接条件中。``UNION ALL`` 明确展示了数据如何从“每行一通电话”转换成“每行一次参与记录”，更适合作为主解法。

执行代价
--------

设 ``Calls`` 有 ``m`` 行，展开阶段逻辑上产生 ``2m`` 条参与记录，后续连接和分组也围绕这些记录进行。

数据库的实际运行成本取决于连接算法、聚合算法、索引和统计信息，因此不宜简单写成固定的 ``O(m)`` 或 ``O(m log m)``。可以确定的是，中间参与记录的规模与通话数量线性相关。