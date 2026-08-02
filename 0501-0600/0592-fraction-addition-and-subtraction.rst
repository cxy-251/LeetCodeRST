0592. Fraction Addition and Subtraction
=======================================

题目信息
--------

:题号: 0592
:难度: Medium
:主题: 分数表达式、加减运算、最简分数、符号处理
:原题: `LeetCode 0592 <https://leetcode.com/problems/fraction-addition-and-subtraction/>`_
:重点: 表达式由带符号分数组成、按从左到右求和、返回不可约的 numerator/denominator、零写成 0/1

题目重述
--------

给定一个只包含分数加法和减法的合法表达式 ``expression``。每一项都写成 ``numerator/denominator``，项前可以带 ``+`` 或 ``-``；若第一项没有符号，则视为正数。

计算整个表达式的结果，并返回格式为 ``"numerator/denominator"`` 的最简分数。分母必须为正，分子和分母需要约分到互质；若结果为零，返回 ``"0/1"``。

自建示例
--------

多项运算后仍需约分：

.. code-block:: text

   输入：expression = "1/2-1/3+1/6"
   输出："1/3"
   解释：结果为 1/2-1/3+1/6=1/3，已经是最简分数。

结果为零：

.. code-block:: text

   输入：expression = "-1/4+1/4"
   输出："0/1"
   解释：两项相互抵消，零按规定写成 0/1。

统一分母累加后约分
------------------

逐项读取可选符号、分子和分母。当前结果 ``numerator / denominator`` 加上新分数时，新的分子为 ``numerator * newDenominator + signedNumerator * denominator``，新的分母为两个分母之积；所有项处理完后用最大公约数约分。题目中的分母为正，因此结果分母也始终保持为正。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::string fractionAddition(std::string expression) {
           long long numerator = 0;
           long long denominator = 1;
           int i = 0;

           while (i < static_cast<int>(expression.size())) {
               int sign = 1;
               if (expression[i] == '+' || expression[i] == '-') {
                   sign = expression[i] == '-' ? -1 : 1;
                   ++i;
               }

               long long currentNumerator = 0;
               while (i < static_cast<int>(expression.size()) &&
                      std::isdigit(static_cast<unsigned char>(expression[i]))) {
                   currentNumerator = currentNumerator * 10 +
                                      expression[i] - '0';
                   ++i;
               }
               ++i;  // '/'
               long long currentDenominator = 0;
               while (i < static_cast<int>(expression.size()) &&
                      std::isdigit(static_cast<unsigned char>(expression[i]))) {
                   currentDenominator = currentDenominator * 10 +
                                        expression[i] - '0';
                   ++i;
               }

               numerator = numerator * currentDenominator +
                           sign * currentNumerator * denominator;
               denominator *= currentDenominator;
           }

           long long positiveNumerator = numerator >= 0 ? numerator : -numerator;
           long long divisor = std::gcd(positiveNumerator, denominator);
           numerator /= divisor;
           denominator /= divisor;
           return std::to_string(numerator) + "/" +
                  std::to_string(denominator);
       }
   };

代码分析
--------

每次合并都在同一个有理数状态上继续计算，符号只作用于当前分子；最后一次约分可同时处理正数、负数和零，零会得到 ``0/1``。设表达式包含 ``t`` 项、每项数字长度受输入限制，扫描时间为 ``O(n)``，只使用常数额外空间。
