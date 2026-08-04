1501. Countries You Can Safely Invest In
========================================

:题号: 1501
:题名: Countries You Can Safely Invest In
:类型: Database
:难度: Medium
:主题: SQL、公共表表达式、UNION ALL、关系展开、分组聚合、HAVING
:原题: `LeetCode 1501 <https://leetcode.com/problems/countries-you-can-safely-invest-in/>`_
:教学重点: 双端参与者展开、电话号码国家码映射、国家平均通话时长、全局平均值比较

题目重述
--------

数据库包含三张表：

* ``Person`` 保存用户编号、姓名和电话号码；电话号码前三位是国家码；
* ``Country`` 保存国家名称和对应的三位国家码；
* ``Calls`` 保存每通电话的主叫用户、被叫用户和通话时长。

需要找出所有满足以下条件的国家：该国居民参与的通话，其平均通话时长严格大于全部通话的平均时长。结果只返回国家名称，顺序不限。

这里的“居民参与的通话”同时包括主叫和被叫。一通跨国电话会分别计入两个国家；一通同国电话的两名参与者都属于同一国家，因此会为该国贡献两条参与记录。

关系结构
--------

``Calls`` 的一行同时包含两个用户角色：

* ``caller_id``：主叫；
* ``callee_id``：被叫。

而后续连接 ``Person`` 和按国家分组时，希望每一行只对应一个用户。因此首先要把一行通话转换成两行统一结构：

.. code-block:: text

   (caller_id, duration)  -> (person_id, duration)
   (callee_id, duration)  -> (person_id, duration)

转换后，每一行都表示“某个用户参与了一通持续 ``duration`` 秒的电话”。后续只需要按 ``person_id`` 连接用户，再由电话号码前三位连接国家。

容易出错的直接做法
------------------

只统计主叫
~~~~~~~~~~

若直接使用 ``Calls.caller_id`` 连接 ``Person``，所有只作为被叫出现的通话都会被遗漏，得到的国家平均值不完整。

用 ``OR`` 同时连接两端
~~~~~~~~~~~~~~~~~~~~~~

可以写成：

.. code-block:: sql

   JOIN Person p
     ON p.id = calls.caller_id
     OR p.id = calls.callee_id

这种写法虽然表达了双端关系，但把两个不同角色塞进一个连接条件，后续聚合口径不直观，执行器也较难利用普通等值连接。先展开为统一的 ``person_id`` 关系更清楚。

错误使用 ``UNION``
~~~~~~~~~~~~~~~~~~~

展开两端时必须使用 ``UNION ALL``，不能使用 ``UNION``。

``UNION`` 会执行去重。假设同一用户参与了两通时长相同的电话，两条 ``(person_id, duration)`` 记录可能被合并，从而少算真实通话。题目需要保留每一次参与事件，因此不能去重。

算法推导
--------

第一步：展开每通电话的两个参与者
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

建立公共表表达式 ``CallParticipants``：

.. code-block:: sql

   SELECT caller_id AS person_id, duration
   FROM Calls

   UNION ALL

   SELECT callee_id AS person_id, duration
   FROM Calls

若 ``Calls`` 有 ``m`` 行，展开后一定有 ``2m`` 行。每通电话的时长被保留两次，分别对应主叫和被叫。

第二步：把参与者映射到国家
~~~~~~~~~~~~~~~~~~~~~~~~~~

先通过 ``person_id = Person.id`` 找到电话号码，再取电话号码前三位与 ``Country.country_code`` 匹配：

.. code-block:: sql

   c.country_code = LEFT(p.phone_number, 3)

国家码是字符串，可能带有前导零，例如 ``051``，因此不能先转换成整数。

第三步：按国家计算平均通话时长
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

展开后的每行表示一次居民参与事件。按国家分组后：

.. code-block:: sql

   AVG(cp.duration)

就是该国所有居民参与记录的平均通话时长。

同国通话会在同一国家中出现两次，这是正确的：电话两端分别对应两名居民的参与记录。跨国通话则在两个国家中各出现一次。

第四步：与全局平均值比较
~~~~~~~~~~~~~~~~~~~~~~~~

全部通话的平均时长可以直接在原始 ``Calls`` 表上计算：

.. code-block:: sql

   SELECT AVG(duration)
   FROM Calls

也可以在展开表上计算。因为每一通电话都被完整复制两次，分子和分母同时乘以二，平均值不变：

.. code-block:: text

   (2 * 所有通话时长之和) / (2 * 通话数量)
   = 所有通话时长之和 / 通话数量

因此直接读取 ``Calls`` 更简单。

第五步：使用 HAVING 筛选国家
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

国家平均值必须在分组完成后才能判断，所以条件应写在 ``HAVING`` 中，而不是 ``WHERE`` 中：

.. code-block:: sql

   HAVING AVG(cp.duration) > (SELECT AVG(duration) FROM Calls)

题目要求严格大于，平均值相等的国家不能返回。

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
   GROUP BY c.name
   HAVING AVG(cp.duration) > (
       SELECT AVG(duration)
       FROM Calls
   );

代码分析
--------

``CallParticipants`` 将 ``Calls`` 中的主叫列和被叫列纵向合并，统一命名为 ``person_id``。使用 ``UNION ALL`` 保留所有重复参与记录。

主查询先连接 ``Person``，确定每条参与记录属于哪个用户；再根据电话号码前三位连接 ``Country``，确定该用户所属国家。

``GROUP BY c.name`` 把同一国家的全部参与记录放入一组。``AVG(cp.duration)`` 计算该国居民参与通话的平均时长。

``HAVING`` 中的标量子查询只产生一个全局平均值。只有国家平均值严格更大时，该国家才会保留在结果中。

正确性说明
----------

**引理一：** ``CallParticipants`` 恰好包含每通电话的全部参与事件。

对于 ``Calls`` 中任意一行，第一部分产生一条主叫参与记录，第二部分产生一条被叫参与记录。``UNION ALL`` 不删除任何行，因此每通电话恰好产生两条记录，没有遗漏，也没有额外记录。

**引理二：** 每条参与记录会被分配到对应用户的国家。

参与记录中的 ``person_id`` 通过用户主键连接到唯一的 ``Person`` 行；电话号码前三位再连接到对应的 ``Country.country_code``。因此记录被归入该参与者所属的国家。

**引理三：** 每个国家分组中的平均值等于该国居民参与通话的平均时长。

根据引理一和引理二，国家分组包含且只包含该国居民的全部通话参与记录。对这些记录的 ``duration`` 求平均，正好得到题目要求的国家平均值。

**引理四：** ``AVG(Calls.duration)`` 等于全部参与记录的平均通话时长。

每通电话在参与记录中出现两次，所以总时长与记录数都变为原来的两倍，平均值保持不变。

由以上引理，``HAVING`` 比较的左侧是每个国家的正确平均值，右侧是正确的全局平均值，因此查询返回且只返回平均通话时长严格高于全局平均值的国家。

自建示例
--------

有两个国家：

.. code-block:: text

   Country
   A国  111
   B国  222

三名用户：

.. code-block:: text

   Person
   id=1  phone_number=111-0000001
   id=2  phone_number=111-0000002
   id=3  phone_number=222-0000003

三通电话：

.. code-block:: text

   Calls
   1 -> 3   duration=10
   2 -> 3   duration=20
   1 -> 2   duration=30

全部通话的平均时长为：

.. code-block:: text

   (10 + 20 + 30) / 3 = 20

展开参与者后：

.. code-block:: text

   A国：10, 20, 30, 30
   B国：10, 20

第三通电话的两端都是 A 国居民，所以时长 ``30`` 在 A 国中出现两次。

.. code-block:: text

   A国平均值 = (10 + 20 + 30 + 30) / 4 = 22.5
   B国平均值 = (10 + 20) / 2 = 15

只有 A 国的平均值严格大于全局平均值 ``20``，因此结果为：

.. code-block:: text

   +---------+
   | country |
   +---------+
   | A国     |
   +---------+

复杂度与执行代价
----------------

设 ``Calls`` 有 ``m`` 行。

* ``UNION ALL`` 逻辑上生成 ``2m`` 条参与记录；
* 两次等值连接和一次分组都处理线性数量的记录；
* 在主键索引、哈希连接或合适执行计划下，典型时间代价接近 ``O(m)``；若分组需要排序，最坏可能达到 ``O(m log m)``；
* 中间关系最多保存 ``2m`` 条记录，空间代价为 ``O(m)``。

``Person.id`` 和 ``Country.country_code`` 通常是键，可以直接支持连接。由于查询对 ``phone_number`` 使用 ``LEFT``，普通电话号码索引不一定能直接用于国家码匹配；在真实系统中可以额外保存规范化的国家码列，但本题无需改变表结构。
