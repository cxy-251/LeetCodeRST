1376. Time Needed to Inform All Employees
=========================================

题目信息
--------

:题号: 1376
:难度: Medium
:主题: 树、深度优先搜索、组织层级
:原题: `LeetCode 1376 <https://leetcode.com/problems/time-needed-to-inform-all-employees/>`_
:重点: 经理在收到消息后用 ``informTime[i]`` 分钟同时通知全部直属下属；总时间为总部负责人到最慢叶员工路径上的时间和

题目重述
--------

公司有 ``n`` 名员工，``manager[i]`` 表示员工 ``i`` 的直属经理，``headID`` 是没有经理的总部负责人。组织关系保证构成一棵树。

负责人在时间零收到消息。经理收到消息后，需要 ``informTime[i]`` 分钟才能让所有直属下属同时收到。请返回所有员工都收到消息所需的最少时间。

``1 <= n <= 10^5``，负责人对应 ``manager`` 值为 ``-1``，叶员工通知时间为 ``0``。

自建示例
--------

最深管理链决定总时间：

.. code-block:: text

   输入：n = 4, headID = 0, manager = [-1,0,0,2], informTime = [2,0,3,0]
   输出：5
   解释：员工 1 在两分钟后收到；员工 2 在两分钟后收到，再用三分钟通知员工 3。

只有负责人时无需通知：

.. code-block:: text

   输入：n = 1, headID = 0, manager = [-1], informTime = [0]
   输出：0
   解释：唯一员工在时间零已知消息。