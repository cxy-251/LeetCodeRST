1185. Day of the Week
=====================

题目信息
--------

:题号: 1185
:难度: Easy
:主题: 日期、公历、星期计算
:原题: `LeetCode 1185 <https://leetcode.com/problems/day-of-the-week/>`_
:重点: 输入是有效公历日期；返回完整英文星期名称，需正确处理闰年

题目重述
--------

给定整数 ``day``、``month`` 和 ``year``，表示一个有效公历日期。请返回该日期对应的星期名称。

返回值只能是 ``"Sunday"``、``"Monday"``、``"Tuesday"``、``"Wednesday"``、``"Thursday"``、``"Friday"`` 或 ``"Saturday"``。

``1971 <= year <= 2100``，月份和日期保证组成有效日期。

自建示例
--------

世纪闰年的第一天：

.. code-block:: text

   输入：day = 1, month = 1, year = 2000
   输出："Saturday"
   解释：2000 年 1 月 1 日是星期六。

范围起始年份的第一天：

.. code-block:: text

   输入：day = 1, month = 1, year = 1971
   输出："Friday"
   解释：1971 年 1 月 1 日是星期五。