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

* ``Person(id, name, phone_number)``：保存用户及电话号码；电话号码格式为 ``xxx-yyyyyyy``，前三位 ``xxx`` 是国家码；
* ``Country(name, country_code)``：保存国家名称与三位国家码；
* ``Calls(caller_id, callee_id, duration)``：保存每通电话的主叫、被叫和通话时长，表中允许出现重复行。

需要返回所有满足下面条件的国家：

该国居民参与通话的平均时长，严格大于全部通话的平均时长。

结果只返回国家名称，顺序不限。

统计口径
--------

本题最容易误解的是“某个国家的通话平均时长”如何计算。

一通电话有两个参与者：主叫和被叫。因此：

* 跨国电话会分别给主叫国家和被叫国家贡献一条通话记录；
* 同国电话的两端都属于同一国家，会给该国家贡献两条通话记录；
* ``Calls`` 中的重复行代表真实存在的多次通话，不能去重。

所以后续聚合的基本单位不是“唯一的一通电话”，而是“某位居民参与某通电话的一次参与记录”。

直观做法与问题
--------------

只统计主叫
~~~~~~~~~~

若只把 ``caller_id`` 连接到 ``Person``，会遗漏所有被叫参与记录，国家平均值不完整。

分别统计主叫和被叫后再求两个平均值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

主叫平均值与被叫平均值的样本数量可能不同，不能简单地对两个平均值再取平均。正确做法是先把两类原始记录合并，再对完整样本求一次平均值。

使用 ``UNION`` 合并
~~~~~~~~~~~~~~~~~~~~

``UNION`` 会删除重复行。本题的 ``Calls`` 明确允许重复，而且同一个人也可能参与多通时长相同的电话。因此必须保留每条参与记录，应该使用 ``UNION ALL``。

先按人求平均，再按国家求平均
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

这种做法会让每个人拥有相同权重：只打过一通电话的人和打过一百通电话的人对国家平均值的影响一样。

题目要求的是该国全部通话参与记录的平均值，所以应直接按国家聚合所有参与记录。

核心转换
--------

``Calls`` 的一行同时保存两个角色：

.. code-block:: text

   caller_id | callee_id | duration

为了让后续连接和分组只处理一种用户列，把每通电话展开成两条统一结构：

.. code-block:: text

   person_id | duration

转换规则为：

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

若 ``Calls`` 有 ``m`` 行，展开后恰好有 ``2m`` 条参与记录。

算法推导
--------

第一步：展开电话两端
~~~~~~~~~~~~~~~~~~~~

使用 ``UNION ALL`` 把主叫和被叫转换为统一的 ``person_id``。

第二步：把参与者映射到国家
~~~~~~~~~~~~~~~~~~~~~~~~~~

先通过 ``person_id = Person.id`` 找到用户，再取电话号码前三位，与国家码匹配：

.. code-block:: sql

   Country.country_code = LEFT(Person.phone_number, 3)

国家码是固定长度字符串，并且可能包含前导零，所以直接进行字符串比较最稳妥。

第三步：按国家聚合
~~~~~~~~~~~~~~~~~~

展开后的每一行表示一次居民通话参与记录。按国家分组并计算：

.. code-block:: sql

   AVG(duration)

即可得到该国居民参与通话的平均时长。

第四步：计算全局平均值
~~~~~~~~~~~~~~~~~~~~~~

全部通话的平均时长直接由原始 ``Calls`` 表计算：

.. code-block:: sql

   SELECT AVG(duration)
   FROM Calls

也可以对展开后的 ``2m`` 条记录求平均。因为每通电话都完整复制了两次，总时长和记录数同时乘以二，所以平均值不变。

第五步：筛选国家
~~~~~~~~~~~~~~~~

国家平均值是聚合结果，因此使用 ``HAVING`` 与全局平均值比较：

.. code-block:: sql

   HAVING AVG(duration) > global_average

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
   ),
   CountryCalls AS (
       SELECT
           c.country_code,
           c.name AS country,
           cp.duration
       FROM CallParticipants AS cp
       JOIN Person AS p
         ON p.id = cp.person_id
       JOIN Country AS c
         ON c.country_code = LEFT(p.phone_number, 3)
   )
   SELECT country
   FROM CountryCalls
   GROUP BY country_code, country
   HAVING AVG(duration) > (
       SELECT AVG(duration)
       FROM Calls
   );

代码分析
--------

``CallParticipants``
~~~~~~~~~~~~~~~~~~~~

该公共表表达式完成最关键的关系展开：每通电话生成一条主叫参与记录和一条被叫参与记录。

必须使用 ``UNION ALL``，因为这里需要保留重复通话和重复时长，而不是求不同的 ``(person_id, duration)`` 组合。

``CountryCalls``
~~~~~~~~~~~~~~~~

该公共表表达式完成两次映射：

#. ``person_id`` 连接 ``Person.id``，确定参与者；
#. 电话号码前三位连接 ``Country.country_code``，确定参与者所属国家。

最终得到统一的：

.. code-block:: text

   country_code | country | duration

``GROUP BY`` 与 ``HAVING``
~~~~~~~~~~~~~~~~~~~~~~~~~~

按 ``country_code`` 和 ``country`` 一起分组，比只按国家名称分组更严谨。国家码在表结构中是唯一值，而国家名称未明确声明为唯一键。

``AVG(duration)`` 计算每个国家全部参与记录的平均时长；``HAVING`` 再将其与 ``Calls`` 的全局平均值比较。

正确性说明
----------

**引理一：展开结果恰好包含所有通话参与记录。**

对于 ``Calls`` 中任意一行，第一部分生成一条主叫记录，第二部分生成一条被叫记录。``UNION ALL`` 不删除任何记录，因此每通电话恰好生成两条参与记录，没有遗漏，也没有额外记录。

**引理二：每条参与记录被分配到正确国家。**

``person_id`` 通过 ``Person.id`` 找到唯一用户，电话号码前三位再匹配对应的 ``country_code``，因此每条参与记录都归入其参与者所属国家。

**引理三：每个国家的 ``AVG(duration)`` 是题目要求的国家平均值。**

根据引理一和引理二，一个国家分组中包含且只包含该国居民的全部通话参与记录。直接对这些记录的时长求平均，正好得到题目要求的平均通话时长。

**引理四：原始 ``Calls`` 的平均值等于全部参与记录的平均值。**

展开后，每通电话的时长出现两次，所以总时长和样本数都扩大两倍，平均值保持不变。

因此，查询返回且只返回国家平均通话时长严格大于全局平均通话时长的国家。

自建示例
--------

假设有两个国家：

.. code-block:: text

   A国：国家码 111
   B国：国家码 222

用户归属：

.. code-block:: text

   用户1：A国
   用户2：A国
   用户3：B国

通话记录：

.. code-block:: text

   用户1 -> 用户3，时长 10
   用户2 -> 用户3，时长 20
   用户1 -> 用户2，时长 30

全局平均值为：

.. code-block:: text

   (10 + 20 + 30) / 3 = 20

展开电话两端后：

.. code-block:: text

   A国：10, 20, 30, 30
   B国：10, 20

最后一通电话的两端都是 A 国居民，所以时长 ``30`` 在 A 国中出现两次。

.. code-block:: text

   A国平均值 = 22.5
   B国平均值 = 15

只有 A 国的平均值严格大于全局平均值 ``20``，因此结果只包含 A 国。

可选写法
--------

也可以直接把 ``Person`` 与 ``Calls`` 按下面的条件连接：

.. code-block:: sql

   p.id IN (calls.caller_id, calls.callee_id)

由于题目保证 ``caller_id != callee_id``，一通电话仍会匹配两名参与者，因此该写法在本题中也是正确的。

``UNION ALL`` 方案把“双端关系展开”明确写出来，更容易解释重复记录、统计口径和正确性，因此更适合作为主解法。

执行代价
--------

设 ``Calls``、``Person``、``Country`` 的行数分别为 ``m``、``p``、``c``。

* 电话展开阶段逻辑上产生 ``2m`` 条参与记录；
* 后续连接处理这些参与记录，并通过用户主键和国家码映射国家；
* 分组聚合的输入规模最多为 ``2m``；
* 实际运行代价取决于数据库选择哈希聚合还是排序聚合，以及连接列上的索引和统计信息。

因此不应把数据库查询武断地写成固定的 ``O(m)`` 或 ``O(m log m)``。更准确的描述是：该查询的逻辑中间结果规模与通话数线性相关，具体执行成本由数据库执行计划决定。