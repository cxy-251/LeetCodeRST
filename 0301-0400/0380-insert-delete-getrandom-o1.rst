0380. Insert Delete GetRandom O(1)
=================================

题目信息
--------

:题号: 0380
:难度: Medium
:主题: 设计、集合、随机返回、平均常数时间
:原题: `LeetCode 0380 <https://leetcode.com/problems/insert-delete-getrandom-o1/>`_
:重点: 集合不允许重复值、插入删除返回是否改变集合、随机返回现有元素且概率相等、三种操作平均 O(1)

题目重述
--------

实现 ``RandomizedSet`` 类。``insert(val)`` 在 ``val`` 不存在时把它加入集合并返回 ``true``，已存在时不改变集合并返回 ``false``；``remove(val)`` 在 ``val`` 存在时删除它并返回 ``true``，不存在时返回 ``false``；``getRandom()`` 从当前集合中随机返回一个元素。

``getRandom`` 调用时集合保证非空，并且当前每个元素被返回的概率必须相同。三个操作都要求平均时间复杂度为 ``O(1)``。``val`` 位于 32 位有符号整数范围内，对对象的调用总数不超过 ``2 * 10^5``；同一对象需要在连续调用之间保存集合状态。

自建示例
--------

插入、重复插入与删除：

.. code-block:: text

   调用：insert(4), insert(9), insert(4), remove(4), getRandom()
   输出：true, true, false, true, 9
   解释：第二次插入 4 不改变集合；删除 4 后只剩 9，因此随机调用必须返回 9。

随机结果必须来自现有集合：

.. code-block:: text

   调用：insert(-2), insert(7), getRandom()
   输出：前两次为 true；最后一次可以是 -2 或 7
   解释：两个现有元素应具有相同被选概率，不能返回集合之外的值。
