1353. Maximum Number of Events That Can Be Attended
===================================================

题目信息
--------

:题号: 1353
:难度: Medium
:主题: 区间、贪心、优先队列
:原题: `LeetCode 1353 <https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/>`_
:重点: 每个事件可在其起止日期闭区间内任选一天参加，每天最多参加一个事件；最大化参加数量

题目重述
--------

给定事件数组 ``events``，每个事件 ``[startDay,endDay]`` 可以在从开始日到结束日的任意一天参加，参加只占用该一天。

同一天最多参加一个事件，每个事件最多参加一次。请返回能够参加的最大事件数量。

``1 <= events.length <= 10^5``，``1 <= startDay <= endDay <= 10^5``。

自建示例
--------

优先参加更早结束的事件可保留后续机会：

.. code-block:: text

   输入：events = [[1,3],[1,1],[2,2]]
   输出：3
   解释：第 1 天参加 [1,1]，第 2 天参加 [2,2]，第 3 天参加 [1,3]。

所有事件只能在同一天参加：

.. code-block:: text

   输入：events = [[2,2],[2,2],[2,2]]
   输出：1
   解释：第 2 天最多参加一个事件。