0168. Excel Sheet Column Title
==============================

题目信息
--------

:题号: 0168
:难度: Easy
:主题: 数学、进制转换、字符串
:原题: `LeetCode 0168 <https://leetcode.com/problems/excel-sheet-column-title/>`_
:重点: 一基列号、A 到 Z 映射、无零二十六进制、字符串返回

题目重述
--------

给定正整数 ``columnNumber``，返回 Excel 工作表中对应的列标题。列号从 ``1`` 开始：``1..26`` 分别对应 ``A..Z``；超过 ``Z`` 后继续使用多字符标题，例如 ``27`` 对应 ``AA``。

该表示法没有单独表示零的字符，因此不能直接按普通二十六进制处理。``columnNumber`` 在 ``1..2^31 - 1`` 范围内，返回值只由大写英文字母组成。

自建示例
--------

.. code-block:: text

   输入：columnNumber = 52
   输出："AZ"
   解释：第一轮完整覆盖 A 到 Z，第二组中第 26 个标题是 AZ。

.. code-block:: text

   输入：columnNumber = 703
   输出："AAA"
   解释：702 对应 ZZ，下一列进入三位标题并从 AAA 开始。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>

   class Solution {
   public:
       std::string convertToTitle(int columnNumber) {
           std::string reversed;
           while (columnNumber > 0) {
               --columnNumber;  // 把 1..26 映射为 0..25
               reversed.push_back(static_cast<char>('A' + columnNumber % 26));
               columnNumber /= 26;
           }
           std::reverse(reversed.begin(), reversed.end());
           return reversed;
       }
   };

题解
----

为什么普通取模会失败
~~~~~~~~~~~~~~~~~~~~

Excel 列名没有表示零的字符，``Z`` 对应 26 而非 0。每轮先减一，把当前最低位映射到 ``0..25``。

构造顺序
~~~~~~~~

取模得到最低位字符，先写入反向字符串，除以 26 继续处理高位，最后整体反转。

复杂度来源
~~~~~~~~~~

循环次数等于列名长度，时间和返回字符串空间均为 ``O(log_26 n)``。