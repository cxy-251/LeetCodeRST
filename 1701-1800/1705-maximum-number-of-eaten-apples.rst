1705. Maximum Number of Eaten Apples
====================================

题目信息
--------

:题号: 1705
:难度: Medium
:主题: 贪心、优先队列
:原题: `LeetCode 1705 <https://leetcode.com/problems/maximum-number-of-eaten-apples/>`_
:重点: 每天最多吃一个苹果，不同批次按各自腐烂日期失效

题目重述
--------

第 ``i`` 天长出 ``apples[i]`` 个苹果，该批苹果在 ``days[i]`` 天后腐烂。每天至多吃一个未腐烂苹果，返回最多能吃多少个。

自建示例
--------

.. code-block:: text

   输入：apples = [1,2,0], days = [2,2,0]
   输出：3
   解释：前三天每天吃一个，所有被吃苹果均未过期。

.. code-block:: text

   输入：apples = [0,0], days = [0,0]
   输出：0
   解释：没有苹果产生。