1114. Print in Order
====================

题目信息
--------

:题号: 1114
:难度: Easy
:主题: 并发、线程同步、执行顺序
:原题: `LeetCode 1114 <https://leetcode.com/problems/print-in-order/>`_
:重点: 三个方法由不同线程异步调用；无论调度顺序如何，都必须保证 ``first``、``second``、``third`` 依次执行

题目重述
--------

同一个 ``Foo`` 对象会被三个线程共享：一个线程调用 ``first(printFirst)``，一个调用 ``second(printSecond)``，另一个调用 ``third(printThird)``。操作系统可能以任意顺序调度这些线程。

请实现同步机制，使 ``printSecond`` 只能在 ``printFirst`` 完成后执行，``printThird`` 只能在 ``printSecond`` 完成后执行，最终输出始终为 ``"firstsecondthird"``。

测试输入 ``nums`` 是 ``[1,2,3]`` 的一个排列，只用于描述三个线程的启动顺序。

自建示例
--------

第三个方法对应的线程最先启动：

.. code-block:: text

   输入：nums = [3,1,2]
   输出："firstsecondthird"
   解释：即使 third 对应线程先运行，也必须等待 first 和 second 依次完成。

第二个方法对应的线程最先启动：

.. code-block:: text

   输入：nums = [2,3,1]
   输出："firstsecondthird"
   解释：线程启动顺序不能改变三个打印回调的规定执行顺序。