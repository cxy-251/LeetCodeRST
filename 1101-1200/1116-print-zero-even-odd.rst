1116. Print Zero Even Odd
=========================

题目信息
--------

:题号: 1116
:难度: Medium
:主题: 并发、三线程同步、交替输出
:原题: `LeetCode 1116 <https://leetcode.com/problems/print-zero-even-odd/>`_
:重点: ``zero`` 线程只打印零，``odd`` 和 ``even`` 分别打印奇偶数；最终序列必须在每个 ``1..n`` 前打印一个零

题目重述
--------

实现 ``ZeroEvenOdd`` 类。同一个对象由三个线程共享：一个调用 ``zero(printNumber)``，一个调用 ``odd(printNumber)``，一个调用 ``even(printNumber)``。

请同步三个线程，使最终依次输出 ``0,1,0,2,0,3,...,0,n``。``zero`` 方法只能输出零；``odd`` 只能输出奇数；``even`` 只能输出偶数。总共调用打印函数 ``2n`` 次。

``1 <= n <= 1000``。

自建示例
--------

奇偶线程交替参与：

.. code-block:: text

   输入：n = 4
   输出："01020304"
   解释：每个正整数前都由 zero 线程输出一个 0，随后由对应奇数或偶数线程输出该整数。

只需输出第一个奇数：

.. code-block:: text

   输入：n = 1
   输出："01"
   解释：zero 输出 0 后，odd 输出 1；even 线程没有需要输出的数字。