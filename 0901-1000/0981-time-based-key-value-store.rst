0981. Time Based Key-Value Store
===============================

题目信息
--------

:题号: 0981
:难度: Medium
:主题: 设计题、键值历史、时间查询
:原题: `LeetCode 0981 <https://leetcode.com/problems/time-based-key-value-store/>`_
:重点: 同一键可以在不同时间保存多个值；``get`` 返回时间不晚于查询时刻的最新值，不存在时返回空字符串，所有 ``set`` 时间戳严格递增

题目重述
--------

实现 ``TimeMap`` 类，用于保存字符串键在不同时间对应的值。``set(key, value, timestamp)`` 在给定时间为 ``key`` 记录 ``value``；同一个键可以多次写入并保留历史记录。

``get(key, timestamp)`` 需要查找此前所有对该键的写入中，时间戳小于或等于查询时间的记录，并返回其中时间戳最大的那条记录的值。若该键没有符合条件的历史值，返回空字符串。所有 ``set`` 调用提供的时间戳保证严格递增。

键和值只包含小写英文字母和数字，长度均在 ``[1, 100]`` 范围内；``1 <= timestamp <= 10^7``，``set`` 与 ``get`` 的总调用次数不超过 ``2 * 10^5``。

自建示例
--------

查询两个写入时间之间的历史值：

.. code-block:: text

   输入：
   ["TimeMap","set","set","get","get","get"]
   [[],["color","red",5],["color","blue",10],["color",7],["color",10],["shape",12]]
   输出：[null,null,null,"red","blue",""]
   解释：时刻 7 能看到的最新 color 记录来自时刻 5；时刻 10 返回刚写入的 blue；shape 从未写入，因此返回空字符串。

查询时间早于该键的首次写入：

.. code-block:: text

   输入：
   ["TimeMap","set","get"]
   [[],["mode","dark",8],["mode",3]]
   输出：[null,null,""]
   解释：mode 的唯一历史记录位于时刻 8，查询时刻 3 没有时间不晚于它的记录，因此返回空字符串。