1944. Number of Visible People in a Queue
========================================

题目信息
--------

:题号: 1944
:难度: Hard
:主题: 单调栈、数组
:原题: `LeetCode 1944 <https://leetcode.com/problems/number-of-visible-people-in-a-queue/>`_
:重点: 中间每个人都必须严格矮于观察者与被观察者中的较矮者

题目重述
--------

队列中每个人向右看。统计每个人能够看到的右侧人数：两人之间的所有人都必须比这两人的较矮者更矮。

自建示例
--------

.. code-block:: text

   输入：heights = [5,1,2]
   输出：[2,1,0]
   解释：身高 5 的人可看到后两人，身高 1 的人可看到紧邻的 2。

.. code-block:: text

   输入：heights = [1,2,3]
   输出：[1,1,0]
   解释：每个人只能看到右侧紧邻的更高者。
