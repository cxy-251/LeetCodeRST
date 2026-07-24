1115. Print FooBar Alternately
==============================

题目信息
--------

:题号: 1115
:难度: Medium
:主题: 并发、双线程同步、交替输出
:原题: `LeetCode 1115 <https://leetcode.com/problems/print-foobar-alternately/>`_
:重点: 两个线程共享同一对象；每轮必须先输出 ``foo`` 再输出 ``bar``，并完整重复 ``n`` 轮

题目重述
--------

同一个 ``FooBar`` 对象会交给两个线程。一个线程调用 ``foo(printFoo)``，负责输出 ``"foo"``；另一个线程调用 ``bar(printBar)``，负责输出 ``"bar"``。

请协调两个线程，使输出严格交替为 ``"foobar"`` 重复 ``n`` 次。不能出现连续两个 ``foo``、连续两个 ``bar``，也不能让某一轮的 ``bar`` 出现在对应 ``foo`` 之前。

``1 <= n <= 1000``。

自建示例
--------

重复三轮：

.. code-block:: text

   输入：n = 3
   输出："foobarfoobarfoobar"
   解释：每个 foo 后紧接一个 bar，共形成三组完整的 foobar。

重复四轮：

.. code-block:: text

   输入：n = 4
   输出："foobarfoobarfoobarfoobar"
   解释：线程实际调度顺序可以变化，但可观察输出必须始终保持四轮交替。