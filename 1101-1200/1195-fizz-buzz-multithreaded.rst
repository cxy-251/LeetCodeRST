1195. Fizz Buzz Multithreaded
=============================

题目信息
--------

:题号: 1195
:难度: Medium
:主题: 并发、四线程同步、FizzBuzz
:原题: `LeetCode 1195 <https://leetcode.com/problems/fizz-buzz-multithreaded/>`_
:重点: 四个线程分别负责 ``fizz``、``buzz``、``fizzbuzz`` 和普通数字；输出必须按 ``1`` 到 ``n`` 的顺序完整生成

题目重述
--------

实现 ``FizzBuzz`` 类，同一对象由四个线程共享。``fizz`` 线程输出能被 ``3`` 整除但不能被 ``5`` 整除的位置；``buzz`` 线程输出能被 ``5`` 整除但不能被 ``3`` 整除的位置；``fizzbuzz`` 线程输出同时被 ``3`` 和 ``5`` 整除的位置；``number`` 线程输出其余整数。

请同步四个线程，使最终按照整数 ``1`` 到 ``n`` 的顺序输出标准 FizzBuzz 序列。

``1 <= n <= 50``。

自建示例
--------

同时包含 fizz 和 buzz：

.. code-block:: text

   输入：n = 5
   输出："12fizz4buzz"
   解释：1、2、4 由 number 线程输出，3 由 fizz 输出，5 由 buzz 输出，顺序必须与整数递增顺序一致。

只有一个普通数字：

.. code-block:: text

   输入：n = 1
   输出："1"
   解释：范围内只有数字 1，仅 number 线程需要输出。