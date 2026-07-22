0262. Trips and Users
=====================

题目信息
--------

:题号: 0262
:难度: Hard
:类型: Database
:主题: SQL、多表连接、条件聚合、日期分组
:原题: `LeetCode 262 <https://leetcode.com/problems/trips-and-users/>`_
:教学重点: 同时过滤被封禁的乘客和司机，再按日期统计有效订单中的取消比例。

题目重述
--------

``Trips`` 表记录行程、乘客、司机、状态和请求日期，``Users`` 表记录用户是否被封禁。统计 ``2013-10-01`` 至 ``2013-10-03`` 期间每天的取消率，只计算乘客和司机都未被封禁的行程。

取消包括 ``cancelled_by_driver`` 和 ``cancelled_by_client``。取消率等于有效行程中的取消行程数除以有效行程总数，结果四舍五入到两位小数，并输出 ``Day`` 与 ``Cancellation Rate``。

自建示例
--------

.. code-block:: text

   Users:
   users_id | banned | role
   1        | No     | client
   2        | Yes    | client
   10       | No     | driver
   11       | No     | driver

   Trips:
   id | client_id | driver_id | status                | request_at
   1  | 1         | 10        | completed             | 2013-10-01
   2  | 1         | 11        | cancelled_by_driver   | 2013-10-01
   3  | 2         | 10        | cancelled_by_client   | 2013-10-01

   第 3 条行程的乘客被封禁，因此不进入统计。
   有效行程共 2 条，其中 1 条取消，结果为：

   Day        | Cancellation Rate
   2013-10-01 | 0.50
