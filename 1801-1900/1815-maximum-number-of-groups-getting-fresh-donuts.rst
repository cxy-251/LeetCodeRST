1815. Maximum Number of Groups Getting Fresh Donuts
===================================================

题目信息
--------

:题号: 1815
:难度: Hard
:主题: 状态压缩、记忆化搜索
:原题: `LeetCode 1815 <https://leetcode.com/problems/maximum-number-of-groups-getting-fresh-donuts/>`_
:重点: 调整组的顺序，使尽可能多的组在当前批次无剩余时开始取餐

题目重述
--------

每批甜甜圈有 ``batchSize`` 个。可以任意调整顾客组顺序；当某组开始服务时上一批没有剩余，该组就是快乐组。返回快乐组的最大数量。

自建示例
--------

.. code-block:: text

   输入：batchSize = 3, groups = [1,2]
   输出：1
   解释：无论先服务哪组，只有第一组开始时没有剩余。

.. code-block:: text

   输入：batchSize = 3, groups = [3,6]
   输出：2
   解释：每组人数都是批量的整数倍，两组开始时都能获得新鲜批次。
