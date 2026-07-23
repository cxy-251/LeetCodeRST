0166. Fraction to Recurring Decimal
===================================

题目信息
--------

:题号: 0166
:难度: Medium
:主题: 哈希表、长除法、字符串
:原题: `LeetCode 0166 <https://leetcode.com/problems/fraction-to-recurring-decimal/>`_
:重点: 余数位置映射、循环节插入、符号与溢出

题目重述
--------

给定两个整数 ``numerator`` 和 ``denominator``，把分数转换为十进制字符串。若小数部分循环，用一对括号包住循环节；结果为整数时不保留小数点，负号只出现在字符串开头。输入保证分母不为 0。

自建示例
--------

.. code-block:: text

   numerator = 1, denominator = 2
   输出："0.5"

   numerator = 2, denominator = 3
   输出："0.(6)"

   numerator = 1, denominator = 6
   输出："0.1(6)"，只有 6 是循环节。

   numerator = -50, denominator = 8
   输出："-6.25"

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
