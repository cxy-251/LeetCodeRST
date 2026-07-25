1825. Finding MK Average
========================

题目信息
--------

:题号: 1825
:难度: Hard
:主题: 设计、数据流、有序集合
:原题: `LeetCode 1825 <https://leetcode.com/problems/finding-mk-average/>`_
:重点: 仅保留最近 ``m`` 个元素，删除最小和最大各 ``k`` 个后求整数平均值

题目重述
--------

实现 ``MKAverage``。``addElement`` 向数据流追加元素；``calculateMKAverage`` 在元素不足 ``m`` 个时返回 -1，否则取最近 ``m`` 个元素，删除最小的 ``k`` 个和最大的 ``k`` 个，返回其余元素平均值的向下取整。

自建示例
--------

.. code-block:: text

   输入：m = 3, k = 1；依次 addElement(3), addElement(1), addElement(10), calculateMKAverage()
   输出：3
   解释：删除 1 和 10 后只剩 3。

.. code-block:: text

   输入：m = 4, k = 1；加入 [2,2,8,9] 后计算
   输出：5
   解释：删除一个 2 和 9，剩余 2 与 8 的平均值为 5。
