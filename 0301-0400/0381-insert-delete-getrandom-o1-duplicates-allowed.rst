0381. Insert Delete GetRandom O(1) - Duplicates allowed
=======================================================

题目信息
--------

:题号: 0381
:难度: Hard
:主题: 设计、多重集合、随机实例、平均常数时间
:原题: `LeetCode 0381 <https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed/>`_
:重点: 允许重复插入、删除时只移除一个实例、插入返回此前是否不存在、随机结果按实例等概率

题目重述
--------

实现 ``RandomizedCollection`` 类，它保存一个允许重复值的多重集合。``insert(val)`` 总会加入一个 ``val`` 实例，并在该值插入前不存在时返回 ``true``，此前已经存在一个或多个实例时返回 ``false``。``remove(val)`` 若存在该值，则删除其中任意一个实例并返回 ``true``；不存在时返回 ``false``。

``getRandom()`` 调用时集合保证非空，并从当前所有元素实例中等概率选择一个。因此某个值出现次数越多，它被返回的总概率越高。三种操作都要求平均时间复杂度为 ``O(1)``。``val`` 位于 32 位有符号整数范围内，对对象的调用总数不超过 ``2 * 10^5``，对象状态在连续调用之间保留。

自建示例
--------

重复插入影响返回值和随机概率：

.. code-block:: text

   调用：insert(5), insert(5), insert(8), getRandom()
   输出：true, false, true；随机结果为 5 或 8
   解释：集合包含两个 5 和一个 8，所以 5 被返回的概率为 2/3，8 的概率为 1/3。

一次删除只移除一个实例：

.. code-block:: text

   调用：remove(5), getRandom()
   输出：true；随机结果为 5 或 8，二者概率相同
   解释：删除后仍保留一个 5，集合现在含两个实例。
