0400. Nth Digit
===============

题目信息
--------

:题号: 0400
:难度: Medium
:主题: 无限数字序列、一基位置、十进制分段、单个数字
:原题: `LeetCode 400 <https://leetcode.com/problems/nth-digit/>`_
:重点: 序列由所有正整数连续拼接、位置从 1 开始、返回所在整数中的一个十进制数字而不是整个整数

题目重述
--------

把所有正整数按自然顺序写出并首尾连接，得到无限数字序列：

.. code-block:: text

   1234567891011121314...

给定正整数 ``n``，返回该序列中第 ``n`` 个十进制数字。位置采用一基编号，因此第一个数字是整数 1 中的 ``1``，第十个数字是整数 10 的第一位 ``1``。

``n`` 位于 ``[1, 2^31-1]``。返回值是 ``0`` 到 ``9`` 之间的单个数字；当目标位置落在多位整数中时，需要返回该整数对应位置上的一位，而不是返回完整整数。

自建示例
--------

位置落在两位数内部：

.. code-block:: text

   输入：n = 15
   输出：2
   解释：前九位是 1 到 9；第 10 至 15 位依次来自 10、11、12，第 15 位是整数 12 的个位 2。

位置仍在一位数区间：

.. code-block:: text

   输入：n = 9
   输出：9
   解释：序列前九位正好是 1、2、...、9，第九位为 9。

按位数分段定位目标整数
------------------------

所有一位数贡献 ``9 * 1`` 位、所有两位数贡献 ``90 * 2`` 位、所有三位数贡献 ``900 * 3`` 位，依次类推。先从 ``n`` 中扣除完整位数段，直到目标落入某个固定位数的整数区间。

在当前段内，``(n - 1) / digits`` 告诉我们目标落在哪个整数，``(n - 1) % digits`` 告诉我们它是该整数的第几位。两个 ``-1`` 是把题目的一基位置转换成零基偏移。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findNthDigit(int n) {
           long long position = n;
           long long digits = 1;
           long long count = 9;
           long long start = 1;

           while (position > digits * count) {
               position -= digits * count;
               ++digits;
               count *= 10;
               start *= 10;
           }

           long long number = start + (position - 1) / digits;
           int offset = static_cast<int>((position - 1) % digits);
           return std::to_string(number)[offset] - '0';
       }
   };

代码分析
--------

每个完整位数段一次扣除，定位后只构造一个目标整数，不会拼接无限序列；使用 ``long long`` 保存段长度和位置，避免 ``digits * count`` 在 32 位范围附近溢出。位数段数量很少，时间和额外空间均为 ``O(log n)``。
