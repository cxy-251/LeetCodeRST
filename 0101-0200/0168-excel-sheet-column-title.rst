0168. Excel Sheet Column Title
==============================

题目信息
--------

:题号: 0168
:难度: Easy
:主题: 数学、进制转换、字符串
:原题: `LeetCode 0168 <https://leetcode.com/problems/excel-sheet-column-title/>`_
:教学重点: 无零二十六进制、先减一再取模、逆序构造

题目重述
--------

把正整数列号转换为 Excel 列标题。

自建示例
--------

.. code-block:: text

   1 -> "A"
   26 -> "Z"
   28 -> "AB"

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
~~~~~~~~~~

Excel 列名没有表示零的字符，``Z`` 对应 26 而非 0。每轮先减一，把当前最低位映射到 ``0..25``。

构造顺序
~~~~

取模得到最低位字符，先写入反向字符串，除以 26 继续处理高位，最后整体反转。

复杂度来源
~~~~~

循环次数等于列名长度，时间和返回字符串空间均为 ``O(log_26 n)``。
