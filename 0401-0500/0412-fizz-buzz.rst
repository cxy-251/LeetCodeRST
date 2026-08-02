0412. Fizz Buzz
===============

题目信息
--------

:题号: 0412
:难度: Easy
:主题: 一基序列、整除条件、字符串输出、条件优先级
:原题: `LeetCode 0412 <https://leetcode.com/problems/fizz-buzz/>`_
:重点: 按整数 ``1..n`` 生成结果、同时整除 3 和 5 时输出 ``FizzBuzz``、其余数字转成十进制字符串

题目重述
--------

给定正整数 ``n``，返回长度为 ``n`` 的字符串数组 ``answer``。数组下标 ``i-1`` 对应整数 ``i``，其中 ``i`` 从 1 到 ``n``。

若 ``i`` 同时能被 3 和 5 整除，写入 ``"FizzBuzz"``；仅能被 3 整除时写入 ``"Fizz"``；仅能被 5 整除时写入 ``"Buzz"``；否则写入 ``i`` 的十进制字符串。``n`` 位于 ``[1, 10^4]``。

自建示例
--------

尚未出现 5 的倍数：

.. code-block:: text

   输入：n = 8
   输出：["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8"]
   解释：3 和 6 分别只被 3 整除，5 只被 5 整除，其余位置保留数字字符串。

同时满足两个整除条件：

.. code-block:: text

   输入：n = 16
   输出的第 15 项："FizzBuzz"
   解释：15 同时是 3 和 5 的倍数，因此不能只输出 Fizz 或 Buzz。

先判断同时满足的组合
----------------------

按 ``1..n`` 顺序处理每个整数。3 和 5 的公倍数必须先判断，否则会被前面的单独 ``Fizz`` 或 ``Buzz`` 分支提前截走；其他情况再分别判断 3、5，最后把整数转换为字符串。数组下标 ``i-1`` 对应数字 ``i``。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<std::string> fizzBuzz(int n) {
           std::vector<std::string> result;
           result.reserve(n);
           for (int value = 1; value <= n; ++value) {
               if (value % 15 == 0) {
                   result.push_back("FizzBuzz");
               } else if (value % 3 == 0) {
                   result.push_back("Fizz");
               } else if (value % 5 == 0) {
                   result.push_back("Buzz");
               } else {
                   result.push_back(std::to_string(value));
               }
           }
           return result;
       }
   };

代码分析
--------

``value % 15 == 0`` 同时覆盖 3 和 5 的条件，其他分支互斥且顺序明确。每个整数只处理一次，时间复杂度为 ``O(n)``（不计字符串输出长度），额外空间为 ``O(1)``（不计返回数组）。
