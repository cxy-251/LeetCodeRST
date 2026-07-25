1450. Number of Students Doing Homework at a Given Time
=======================================================

题目信息
--------

:题号: 1450
:难度: Easy
:主题: 数组、区间包含、计数
:原题: `LeetCode 1450 <https://leetcode.com/problems/number-of-students-doing-homework-at-a-given-time/>`_
:重点: 学生在闭区间 ``[startTime[i], endTime[i]]`` 内做作业；统计查询时刻落入多少个区间

题目重述
--------

给定等长数组 ``startTime`` 和 ``endTime``，第 ``i`` 名学生从 ``startTime[i]`` 开始做作业，到 ``endTime[i]`` 结束，开始与结束时刻都算正在做作业。

给定 ``queryTime``，请返回该时刻正在做作业的学生数量。

``1 <= startTime.length == endTime.length <= 100``，``1 <= startTime[i] <= endTime[i] <= 1000``，``1 <= queryTime <= 1000``。

自建示例
--------

查询时刻等于开始或结束时刻都应计数：

.. code-block:: text

   输入：startTime = [1,2,3], endTime = [3,2,5], queryTime = 2
   输出：2
   解释：前两名学生的闭区间都包含时刻 2，第三名尚未开始。

查询时刻不属于任何区间时返回零：

.. code-block:: text

   输入：startTime = [1,4], endTime = [2,5], queryTime = 10
   输出：0
   解释：两名学生都已结束作业。