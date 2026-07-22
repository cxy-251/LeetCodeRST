0295. Find Median from Data Stream
=================================

题目信息
--------

:题号: 0295
:难度: Hard
:主题: 设计、数据流、堆、排序
:原题: `LeetCode 0295 <https://leetcode.com/problems/find-median-from-data-stream/>`_
:教学重点: 双堆分区、规模平衡、中位数精度

题目重述
--------

实现 ``MedianFinder`` 类：``addNum(int num)`` 向数据流加入整数，``findMedian()`` 返回当前全部元素的中位数。奇数个元素返回中间值，偶数个返回两个中间值平均数。平台保证查询前至少加入一个数；对象需跨调用维护状态，调用总数最多约 ``5 * 10^4``。

自建示例
--------

.. code-block:: text

   操作：addNum(5), addNum(1), findMedian(), addNum(9), findMedian()
   输出：3.0, 5.0
