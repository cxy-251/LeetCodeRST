0171. Excel Sheet Column Number
===============================

题目信息
--------

:题号: 0171
:难度: Easy
:主题: 数学、进制转换、字符串
:原题: `LeetCode 0171 <https://leetcode.com/problems/excel-sheet-column-number/>`_
:重点: 二十六进制累积、字符映射、溢出边界

题目重述
--------

给定由大写英文字母组成的 Excel 列标题 ``columnTitle``，返回对应的正整数列号。字母 ``A`` 到 ``Z`` 分别表示数位 1 到 26，例如 ``A`` 对应 1，``Z`` 对应 26，``AA`` 对应 27。

自建示例
--------

.. code-block:: text

   columnTitle = "A"  -> 1
   columnTitle = "Z"  -> 26
   columnTitle = "AA" -> 27
   columnTitle = "AB" -> 28
   columnTitle = "ZY" -> 701

C++ 实现
--------

.. code-block:: cpp

   #include <string>

   class Solution {
   private:
       int positionalExpansion(const std::string& title) {
           int result = 0;
           for (char character : title) {
               int digit = character - 'A' + 1;
               result = result * 26 + digit;
           }
           return result;
       }

       int rightToLeft(const std::string& title) {
           int result = 0;
           int weight = 1;
           for (int i = static_cast<int>(title.size()) - 1; i >= 0; --i) {
               result += (title[i] - 'A' + 1) * weight;
               weight *= 26;
           }
           return result;
       }

   public:
       int titleToNumber(std::string columnTitle) {
           return positionalExpansion(columnTitle);
       }
   };

题解
----

字符如何映射为数位
~~~~~~~~~~~~~~~~~~

Excel 列标题使用 ``A..Z`` 表示 ``1..26``，不存在零字符。因此每个字符的数值是 ``character - 'A' + 1``。

为什么可以从左向右累积
~~~~~~~~~~~~~~~~~~~~~~

读入新字符时，已有前缀整体左移一位，相当于乘以 26，再加上当前数位：

.. code-block:: text

   result = result * 26 + digit

例如 ``AB`` 的状态为 ``1``，随后变为 ``1 * 26 + 2 = 28``。

与普通二十六进制的区别
~~~~~~~~~~~~~~~~~~~~~~

普通进制允许最低数位为零；Excel 列标题每一位都在 ``1..26``。转换为数字时仍可使用位置权重，只需保持字符到数位的映射为一到二十六。

复杂度来源
~~~~~~~~~~

字符串中的每个字符只读取一次，时间 ``O(n)``，只维护累积值，额外空间 ``O(1)``。题目保证结果适合有符号 32 位整数。
