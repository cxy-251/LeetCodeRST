1462. Course Schedule IV
========================

题目信息
--------

:题号: 1462
:难度: Medium
:主题: 有向图、传递闭包、拓扑排序
:原题: `LeetCode 1462 <https://leetcode.com/problems/course-schedule-iv/>`_
:重点: 先修关系可以间接传递；对每个查询判断第一门课程是否为第二门课程的直接或间接先修课

题目重述
--------

有 ``numCourses`` 门课程，编号为 ``0`` 到 ``numCourses-1``。``prerequisites[i] = [a,b]`` 表示学习课程 ``b`` 前必须先完成课程 ``a``。

给定查询数组 ``queries``，对于每个 ``[u,v]``，判断课程 ``u`` 是否是课程 ``v`` 的直接或间接先修课。请按查询顺序返回布尔结果数组。

``2 <= numCourses <= 100``，查询数量不超过 ``10^4``，课程编号均合法。

自建示例
--------

先修关系可以沿多条边传递：

.. code-block:: text

   输入：numCourses = 3, prerequisites = [[0,1],[1,2]], queries = [[0,2],[2,0],[0,1]]
   输出：[true,false,true]
   解释：0 通过课程 1 间接成为课程 2 的先修课，反方向不成立。

没有任何先修关系时所有查询都为假：

.. code-block:: text

   输入：numCourses = 2, prerequisites = [], queries = [[0,1]]
   输出：[false]
   解释：课程 0 与课程 1 之间不存在依赖。