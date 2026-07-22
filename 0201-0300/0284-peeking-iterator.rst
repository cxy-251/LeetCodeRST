0284. Peeking Iterator
======================

题目信息
--------

:题号: 0284
:难度: Medium
:主题: 设计、迭代器、缓存
:原题: `LeetCode 0284 <https://leetcode.com/problems/peeking-iterator/>`_
:教学重点: 预取缓存、peek 不消费、跨调用状态

题目重述
--------

在已有 ``Iterator`` 接口上实现 ``PeekingIterator``，提供 ``peek()``、``next()``、``hasNext()``。``peek`` 返回下一个元素但不推进，``next`` 返回并消费下一个元素；平台保证读取时存在元素。对象需在连续调用间维护缓存与底层迭代器状态。

自建示例
--------

.. code-block:: text

   初始序列：[4,7]
   调用：peek(), peek(), next(), hasNext()
   输出：4, 4, 4, true
