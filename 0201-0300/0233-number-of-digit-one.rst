0233. Number of Digit One
=========================

题目信息
--------

:题号: 0233
:难度: Hard
:主题: 数学、数位统计、十进制
:原题: `LeetCode 0233 <https://leetcode.com/problems/number-of-digit-one/>`_
:重点: 闭区间 0 到 n、统计数字出现次数而非含 1 的整数个数、前导零不计

题目重述
--------

给定非负整数 ``n``，统计从 ``0`` 到 ``n`` 的所有十进制整数表示中，数字字符 ``1`` 一共出现了多少次，并返回总次数。统计范围包含两个端点。

``n`` 位于 ``[0, 10^9]``。同一个整数中出现多个 ``1`` 时需要分别计数，例如 ``11`` 贡献两次；前导零不属于整数的通常十进制表示，不能参与统计。数字 ``0`` 自身不包含 ``1``。

自建示例
--------

一个数可以贡献多次：

.. code-block:: text

   输入：n = 15
   输出：8
   解释：1、10、12、13、14、15 各贡献一次，11 贡献两次，总计 8 次。

零边界：

.. code-block:: text

   输入：n = 0
   输出：0
   解释：区间中只有整数 0，它的十进制表示不含数字 1。

按十进制位统计
--------------

固定一个位权 ``factor``（``1,10,100,...``），把 ``n`` 拆成：

.. code-block:: text

   high = n / (factor * 10)
   cur  = (n / factor) % 10
   low  = n % factor

统计 ``0..n`` 中该位出现数字 1 的次数。完整的高位循环贡献 ``high * factor``；
当前位分别有三种情况：

* ``cur == 0``：当前高位组合还没有完整走过 1，贡献 ``high * factor``；
* ``cur == 1``：完整循环之外还覆盖低位 ``0..low``，贡献 ``high * factor + low + 1``；
* ``cur > 1``：当前高位组合已经完整经过一次 1，贡献 ``(high + 1) * factor``。

前导零不会被误计入：当某个更高位还没有出现时，``high`` 的完整循环数量自然为 0；
``n=0`` 时所有位权都超过 ``n``，答案为 0。

以 ``n=15`` 为例，个位 ``cur=5`` 贡献 2（数字 1、11 的个位），十位 ``cur=1``、``low=5`` 贡献 6，
总数为 8。每个位独立统计，再把贡献相加即可。

正确性说明
----------

在固定位权上，连续的 ``factor*10`` 个整数会完整经历一次该位从 0 到 9 的循环，数字 1 出现恰好
``factor`` 次；``high`` 计数这些完整循环。余下部分由 ``cur`` 决定：当前位小于 1 时尚未进入额外一轮，
等于 1 时只覆盖低位到 ``low``，大于 1 时整轮已经完成。三种情况互斥且覆盖 ``0..n``，所以所有位次数字 1
都被计数一次。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int countDigitOne(int n) {
           long long answer = 0;
           for (long long factor = 1; factor <= n; factor *= 10) {
               const long long high = n / (factor * 10);
               const long long current = (n / factor) % 10;
               const long long low = n % factor;

               if (current == 0) {
                   answer += high * factor;
               } else if (current == 1) {
                   answer += high * factor + low + 1;
               } else {
                   answer += (high + 1) * factor;
               }
           }
           return static_cast<int>(answer);
       }
   };

代码分析
--------

位权每次乘 10，循环次数为十进制位数，时间复杂度为 ``O(log n)``，额外空间为 ``O(1)``。
中间计算使用 ``long long``，避免 ``factor*10`` 或贡献项在窄整数类型中提前溢出；``n=0`` 时循环自然跳过。
