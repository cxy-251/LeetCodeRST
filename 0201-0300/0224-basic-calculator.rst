0224. Basic Calculator
======================

题目信息
--------

:题号: 0224
:难度: Hard
:主题: 字符串、表达式、栈、递归
:原题: `LeetCode 0224 <https://leetcode.com/problems/basic-calculator/>`_
:重点: 加减法、嵌套括号、一元负号、空格、禁止内置求值器

题目重述
--------

给定一个合法的算术表达式字符串 ``s``，计算并返回其整数结果。表达式由数字、空格、加号 ``+``、减号 ``-``、左括号 ``(`` 和右括号 ``)`` 组成；整数均为非负十进制数，但减号可以作为一元负号使用。表达式不包含乘法或除法。

字符串长度位于 ``[1, 3 * 10^5]``。题目保证表达式合法，每个整数及最终结果都适合 32 位有符号整数；加号不会作为一元运算符出现，也不会出现两个连续的二元运算符。不能调用把字符串直接当作表达式执行的内置函数。

自建示例
--------

嵌套括号改变符号：

.. code-block:: text

   输入：s = "18-(6-(2+1))"
   输出：15
   解释：内层 2+1 等于 3，随后 6-3 等于 3，最终 18-3 等于 15。

一元负号作用于括号：

.. code-block:: text

   输入：s = "-(7-10)+4"
   输出：7
   解释：7-10 等于 -3，括号前的一元负号把它变为 3，再加 4 得到 7。

用栈保存括号外的上下文
----------------------

扫描表达式时，当前 ``result`` 和 ``sign`` 只描述最近一层括号中的部分结果。遇到左括号时，
把进入括号前的累计结果和括号整体应使用的符号压栈，然后从零开始计算括号内部；遇到右括号时，
先结算当前数字，再把括号结果乘以保存的符号并加回外层结果。

对每个数字只在读到下一个运算符、右括号或字符串末尾时结算。这样一元负号无需把负号和数字合成特殊词法：
它只把当前项的 ``sign`` 设为 ``-1``；若后面紧跟左括号，保存的负号就会作用于整个括号表达式。

状态转移可以写成：

.. code-block:: text

   '+' 或 '-': result += sign * number，清零 number，更新 sign
   '(':        保存 result 与 sign，result=0，sign=1
   ')':        结算 number，恢复 outer_result + outer_sign * result

正确性说明
----------

在任意时刻，栈中的每一帧都保存一个尚未结束的外层括号上下文；当前变量表示最内层已扫描部分。
数字结算时只加入当前层，二元加减的从左到右顺序被保留。右括号结算完整内层结果后一次性应用外层符号，
因此括号嵌套不会把符号错误地施加到单个数字或后续表达式上。表达式合法且最终读完后，结算剩余数字即得到总结果。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int calculate(const std::string& s) {
           std::stack<std::pair<long long, int>> context;
           long long result = 0;
           long long number = 0;
           int sign = 1;

           for (int i = 0; i < static_cast<int>(s.size()); ++i) {
               const char ch = s[i];
               if (std::isdigit(static_cast<unsigned char>(ch))) {
                   number = number * 10 + (ch - '0');
               } else if (ch == '+' || ch == '-') {
                   result += sign * number;
                   number = 0;
                   sign = (ch == '+') ? 1 : -1;
               } else if (ch == '(') {
                   context.push({result, sign});
                   result = 0;
                   number = 0;
                   sign = 1;
               } else if (ch == ')') {
                   result += sign * number;
                   number = 0;
                   const auto [outer_result, outer_sign] = context.top();
                   context.pop();
                   result = outer_result + outer_sign * result;
                   sign = 1;
               }
           }

           result += sign * number;
           return static_cast<int>(result);
       }
   };

代码分析
--------

空格被自然跳过；``std::isdigit`` 先转换为 ``unsigned char``，避免传入负的窄字符值。
每个括号只入栈、出栈一次，每个字符只扫描一次，时间复杂度为 ``O(|s|)``，额外空间为括号最大嵌套深度
``O(|s|)``。用 ``long long`` 保存中间累计值，再按题目合同返回 ``int``；代码不调用表达式求值器。
