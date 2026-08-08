0182. Duplicate Emails
======================

题目信息
--------

:题号: 0182. 查找重复的电子邮箱
:难度: Easy
:主题: Database、分组、聚合过滤
:原题: `LeetCode 0182 <https://leetcode.com/problems/duplicate-emails/>`_
:重点: 将相同邮箱的多行压缩为一个分组状态，再用 HAVING 按组计数筛选重复值

题目重述
--------

``Person(id, email)`` 表保存非空电子邮箱。查询所有至少出现两次的邮箱，将输出列命名为
``Email``。

同一重复邮箱无论出现多少次都只输出一行；只出现一次的邮箱不输出。结果顺序任意。

自建示例
--------

.. code-block:: text

   Person:
   id | email
   1  | team@example.com
   2  | solo@example.com
   3  | team@example.com
   4  | news@example.com
   5  | news@example.com
   6  | news@example.com

   输出：
   Email
   team@example.com
   news@example.com

   team@example.com 出现两次，news@example.com 出现三次，二者各输出一次。

SQL 实现
--------

.. code-block:: sql

   SELECT email AS Email
   FROM Person
   GROUP BY email
   HAVING COUNT(*) > 1;

题解
----

逐行寻找伙伴会重复生成答案
~~~~~~~~~~~~~~~~~~~~~~~~~~

从一条人员记录出发，可以自连接 ``Person``，寻找 ``id`` 不同但 ``email`` 相同的另一行。
它能证明重复存在，却会把一组大小为 ``k`` 的重复邮箱展开成许多行对；同一邮箱还需要
``DISTINCT`` 才能恢复为一个结果。重复越多，产生的中间组合越多。

题目不关心哪些两行相等，只关心每个邮箱值对应多少行。因此更自然的原始对象不是行对，
而是“相同 ``email`` 的整组记录”。

分组同时完成去重与计数
~~~~~~~~~~~~~~~~~~~~~~

``GROUP BY email`` 把所有相同邮箱收进一个分组。分组之后，每个邮箱只剩一个逻辑结果
状态，``COUNT(*)`` 表示该组包含的原始行数：

.. code-block:: text

   team@example.com -> 2
   solo@example.com -> 1
   news@example.com -> 3

条件 ``COUNT(*) > 1`` 精确对应“至少出现两次”。通过条件的每个分组只投影一次分组键
``email``，所以无需再写 ``DISTINCT``；分组本身已经把重复行压缩成唯一邮箱。

为什么使用 HAVING
~~~~~~~~~~~~~~~~~~

``WHERE`` 在分组前筛选单条原始记录，此时还没有 ``COUNT(*)``，不能判断某个邮箱最终有
多少行。``HAVING`` 在 ``GROUP BY`` 产生组并计算聚合值之后筛选，正好处理组级条件：

.. code-block:: text

   FROM Person          读取原始行
   GROUP BY email       建立每个邮箱的组
   HAVING COUNT(*) > 1  保留重复组
   SELECT email         输出组键

把计数条件写进 ``WHERE`` 不只是语法位置错误，也反映了把“单行属性”和“分组统计”混为
一谈。

``COUNT(*)`` 的含义
~~~~~~~~~~~~~~~~~~

题目保证 ``email`` 非空，因此 ``COUNT(email)`` 与 ``COUNT(*)`` 在本题结果相同。
主解使用 ``COUNT(*)``，明确表达统计组内记录数，不让列的 ``NULL`` 规则参与推理。若邮箱
允许为空，还需先决定多个 ``NULL`` 是否应视为一个重复邮箱组；本题合同已排除该歧义。

具体走读
~~~~~~~~

示例分组后，``solo@example.com`` 的计数为 1，被 ``HAVING`` 删除；另外两组计数分别为
2、3，都通过条件。每组只产生一个 ``email`` 值，再通过 ``AS Email`` 满足输出列名。

查询没有 ``ORDER BY``，因为题目允许任意顺序。无索引时数据库可通过哈希或排序建立分组，
通常需要一次 ``O(n)`` 扫描并保存不同邮箱状态；邮箱索引可能帮助有序聚合。相比自连接，
分组不会生成二次规模的重复行对。
