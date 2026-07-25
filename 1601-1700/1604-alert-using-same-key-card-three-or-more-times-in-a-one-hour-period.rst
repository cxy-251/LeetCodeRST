1604. Alert Using Same Key-Card Three or More Times in a One Hour Period
=======================================================================

题目信息
--------

:题号: 1604
:难度: Medium
:主题: 字符串时间、排序、滑动窗口
:原题: `LeetCode 1604 <https://leetcode.com/problems/alert-using-same-key-card-three-or-more-times-in-a-one-hour-period/>`_
:重点: 同一员工任意三次刷卡若落在含端点的一小时窗口内则报警

题目重述
--------

给定员工姓名和对应的 ``HH:MM`` 刷卡时间。找出至少存在三次刷卡，且最早与最晚时间之差不超过 ``60`` 分钟的员工，按姓名字典序返回。

所有记录发生在同一天。

自建示例
--------

.. code-block:: text

   输入：keyName = ["amy","amy","amy","bob"], keyTime = ["09:00","09:30","10:00","12:00"]
   输出：["amy"]
   解释：Amy 的三次记录恰好覆盖 60 分钟，仍触发报警。

.. code-block:: text

   输入：keyName = ["lee","lee","lee"], keyTime = ["08:00","09:01","10:02"]
   输出：[]
   解释：任意三次记录的跨度均超过一小时。