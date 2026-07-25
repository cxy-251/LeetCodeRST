1701. Average Waiting Time
==========================

题目信息
--------

:题号: 1701
:难度: Medium
:主题: 模拟、队列时间
:原题: `LeetCode 1701 <https://leetcode.com/problems/average-waiting-time/>`_
:重点: 厨师一次只处理一位顾客，等待时间从到达到完成计算

题目重述
--------

顾客按到达时间排序，每项为 ``[arrival,time]``。厨师空闲时立即开始下一份订单，否则顾客等待。返回所有顾客从到达到完成的平均时间。

自建示例
--------

.. code-block:: text

   输入：customers = [[1,2],[2,5]]
   输出：4.0
   解释：两位顾客等待时间分别为 2 和 6。

.. code-block:: text

   输入：customers = [[5,3]]
   输出：3.0
   解释：唯一顾客无需排队，只等待制作时间。