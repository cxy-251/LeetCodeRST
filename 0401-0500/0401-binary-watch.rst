0401. Binary Watch
==================

题目信息
--------

:题号: 0401
:难度: Easy
:主题: 二进制手表、合法时间、亮灯计数、结果枚举
:原题: `LeetCode 0401 <https://leetcode.com/problems/binary-watch/>`_
:重点: 4 个小时灯与 6 个分钟灯分别计数、恰好点亮指定数量、分钟固定两位、结果顺序不限

题目重述
--------

二进制手表使用 4 个 LED 表示小时、6 个 LED 表示分钟。给定整数 ``turnedOn``，返回所有恰好有 ``turnedOn`` 个 LED 亮起时能够表示的合法时间。

小时必须位于 ``0..11``，分钟必须位于 ``0..59``。输出格式为 ``"h:mm"``：小时不能补前导零，分钟必须恰好两位。``turnedOn`` 位于 ``[0, 10]``，结果可以按任意顺序返回；不合法的小时或分钟组合不能出现在答案中。

自建示例
--------

没有灯亮起：

.. code-block:: text

   输入：turnedOn = 0
   输出：["0:00"]
   解释：所有小时灯和分钟灯都熄灭时，唯一能够表示的合法时间是 0:00。

亮灯数超过任何合法时间所需数量：

.. code-block:: text

   输入：turnedOn = 9
   输出：[]
   解释：合法小时最多只能同时点亮 3 个小时灯，合法分钟最多只能同时点亮 5 个分钟灯，因此不存在恰好点亮 9 个灯的合法时间。

直接枚举有限的合法时间
------------------------

小时只有 ``0..11`` 共 12 种，分钟只有 ``0..59`` 共 60 种，总共 720 个候选。对每个候选分别统计小时和分钟的二进制置位数，二者之和等于 ``turnedOn`` 时才加入答案。枚举比构造灯的组合更直接，因为它天然排除了小时超过 11、分钟超过 59 的编码。

格式化时小时直接转为十进制，分钟不足两位就在前面补一个 ``0``；亮灯数为 0 或超过可用灯数的边界都由同一套枚举自然处理。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<std::string> readBinaryWatch(int turnedOn) {
           std::vector<std::string> result;
           for (int hour = 0; hour < 12; ++hour) {
               for (int minute = 0; minute < 60; ++minute) {
                   if (__builtin_popcount(hour)
                       + __builtin_popcount(minute) != turnedOn) {
                       continue;
                   }
                   std::string time = std::to_string(hour) + ":";
                   if (minute < 10) time += "0";
                   time += std::to_string(minute);
                   result.push_back(time);
               }
           }
           return result;
       }
   };

代码分析
--------

小时的 4 位和分钟的 6 位互不混淆，置位数相加正好对应 LED 总数；输出格式只在分钟部分补零，不会把小时写成 ``00``。候选数固定为 720，时间复杂度为 ``O(12 * 60)``，额外空间为 ``O(1)``（不计返回结果）。
