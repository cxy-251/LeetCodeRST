0677. Map Sum Pairs
===================

题目信息
--------

:题号: 0677
:难度: Medium
:主题: 设计、字符串键、前缀和值、覆盖旧值
:原题: `LeetCode 0677 <https://leetcode.com/problems/map-sum-pairs/>`_
:重点: insert 对已有键执行覆盖而非累加、sum 汇总所有以给定前缀开头的当前值、对象跨调用保存映射

题目重述
--------

实现 ``MapSum`` 数据结构。``insert(key, val)`` 保存字符串键 ``key`` 及整数值 ``val``；若该键此前已经存在，新值覆盖旧值。``sum(prefix)`` 返回当前所有以 ``prefix`` 开头的键所对应值的总和。

键与前缀只包含小写英文字母，长度位于 ``[1, 50]``；插入值位于 ``[1, 1000]``，``insert`` 与 ``sum`` 的总调用次数不超过 ``50``。前缀可以等于完整键，也可以比键短；没有匹配键时返回 ``0``。

自建示例
--------

多个键共享前缀并发生覆盖：

.. code-block:: text

   调用：insert("app",2), insert("apple",3), sum("ap"), insert("app",5), sum("app")
   输出：5, 8
   解释：首次查询得到 2+3=5；覆盖 app 的值后，前缀 app 匹配 app 和 apple，总和变为 5+3=8。

没有键匹配前缀：

.. code-block:: text

   调用：insert("cat",4), sum("dog")
   输出：0
   解释：当前不存在以 dog 开头的键，因此和值为 0。
