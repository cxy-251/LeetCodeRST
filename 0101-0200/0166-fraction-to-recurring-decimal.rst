0166. Fraction to Recurring Decimal
===================================

题目信息
--------

:题号: 0166
:难度: Medium
:主题: 哈希表、长除法、字符串
:原题: `LeetCode 0166 <https://leetcode.com/problems/fraction-to-recurring-decimal/>`_
:重点: 符号处理、整数部分、循环小数、重复余数定位

题目重述
--------

给定两个 32 位有符号整数 ``numerator`` 和 ``denominator``，把分数 ``numerator / denominator`` 转换为十进制字符串。输入保证 ``denominator`` 不为 ``0``。

若结果为整数，字符串中不出现小数点；若小数部分有限，完整写出所有小数位；若小数部分无限循环，用一对圆括号包围最短循环节。负号只放在整个结果最前面，零统一表示为 ``"0"``。

自建示例
--------

.. code-block:: text

   输入：numerator = 7, denominator = 12
   输出："0.58(3)"
   解释：7 / 12 = 0.58333...，非循环前缀是 58，最短循环节是 3。

.. code-block:: text

   输入：numerator = 22, denominator = -15
   输出："-1.4(6)"
   解释：分子与分母异号，所以结果为负；22 / 15 = 1.4666...。

C++ 实现
--------

.. code-block:: cpp

   #include <cstdlib>
   #include <string>
   #include <unordered_map>

   class Solution {
   public:
       std::string fractionToDecimal(int numerator, int denominator) {
           if (numerator == 0) return "0";

           long long dividend = numerator;
           long long divisor = denominator;
           std::string result;
           if ((dividend < 0) != (divisor < 0)) result.push_back('-');
           dividend = std::llabs(dividend);
           divisor = std::llabs(divisor);

           result += std::to_string(dividend / divisor);
           long long remainder = dividend % divisor;
           if (remainder == 0) return result;

           result.push_back('.');
           std::unordered_map<long long, int> position;
           while (remainder != 0) {
               auto found = position.find(remainder);
               if (found != position.end()) {
                   result.insert(found->second, 1, '(');
                   result.push_back(')');
                   break;
               }
               position[remainder] = result.size();
               remainder *= 10;
               result.push_back(static_cast<char>('0' + remainder / divisor));
               remainder %= divisor;
           }
           return result;
       }
   };

题解
----

为什么余数决定后续
~~~~~~~~~~~~~~~~~~

长除法中，只要当前余数相同，之后产生的数字序列就完全相同。因此余数首次出现位置就是循环节左括号位置。

符号与溢出处理
~~~~~~~~~~~~~~

先把分子分母提升到 ``long long`` 再取绝对值，才能安全处理 ``INT_MIN``。符号只由两者是否异号决定。

复杂度来源
~~~~~~~~~~

不同非零余数最多 ``|denominator|-1`` 个；时间和哈希空间都与小数展开长度成正比。