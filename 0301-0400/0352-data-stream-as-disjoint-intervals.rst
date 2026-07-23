0352. Data Stream as Disjoint Intervals
=======================================

题目信息
--------

:题号: 0352
:难度: Hard
:主题: 设计、有序区间、数据流、状态维护
:原题: `LeetCode 0352 <https://leetcode.com/problems/data-stream-as-disjoint-intervals/>`_
:重点: 重复加入不改变结果、相邻整数合并为闭区间、区间按起点升序返回、对象跨调用保存状态

题目重述
--------

实现 ``SummaryRanges`` 数据结构。``addNum(value)`` 把一个非负整数加入数据流；``getIntervals()`` 返回当前已经加入的所有不同整数所组成的若干闭区间 ``[start, end]``。

返回的区间必须互不重叠、彼此不相邻，并按 ``start`` 严格升序排列。若某个整数被重复加入，已记录集合和区间结果都不发生变化。``value`` 位于 ``[0, 10^4]``，对对象的调用总数不超过 ``3 * 10^4``，其中 ``getIntervals`` 的调用次数不超过 ``100``。同一对象需要在连续调用之间保存已经接收的数据。

自建示例
--------

新值同时连接左右区间：

.. code-block:: text

   调用：addNum(2), addNum(4), getIntervals(), addNum(3), getIntervals()
   输出：[[2,2],[4,4]]，随后为 [[2,4]]
   解释：加入 3 之前，2 和 4 分属两个单点区间；3 同时与两侧相邻，因此三个整数合并成一个闭区间。

重复加入已有整数：

.. code-block:: text

   调用：addNum(7), addNum(8), addNum(7), getIntervals()
   输出：[[7,8]]
   解释：第二次加入 7 不会产生重复元素，也不会改变现有区间。
