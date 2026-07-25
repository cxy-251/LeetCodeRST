1606. Find Servers That Handled Most Number of Requests
======================================================

题目信息
--------

:题号: 1606
:难度: Hard
:主题: 有序集合、优先队列、模拟
:原题: `LeetCode 1606 <https://leetcode.com/problems/find-servers-that-handled-most-number-of-requests/>`_
:重点: 第 ``i`` 个请求优先从 ``i mod k`` 开始寻找空闲服务器；全部忙时丢弃

题目重述
--------

有 ``k`` 台服务器。请求 ``i`` 在 ``arrival[i]`` 到达并占用服务器 ``load[i]`` 时间。按规则选择编号不小于 ``i mod k`` 的最小空闲服务器，若没有则从编号零循环寻找；全部忙时丢弃。返回处理请求数最多的服务器编号。

返回顺序不限。

自建示例
--------

.. code-block:: text

   输入：k = 2, arrival = [1,2,3], load = [2,2,2]
   输出：[0]
   解释：前两个请求分配给 0、1；第三个到达时服务器 0 已空闲，因此 0 共处理两次。

.. code-block:: text

   输入：k = 1, arrival = [1,2], load = [5,1]
   输出：[0]
   解释：第二个请求被丢弃，唯一服务器仍是最忙服务器。