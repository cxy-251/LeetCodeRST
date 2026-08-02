0227. Basic Calculator II
=========================

题目信息
--------

:题号: 0227
:难度: Medium
:主题: 字符串、表达式、栈、数学
:原题: `LeetCode 0227 <https://leetcode.com/problems/basic-calculator-ii/>`_
:重点: 乘除优先于加减、整数除法向零截断、空格、无括号

题目重述
--------

给定一个合法的算术表达式字符串 ``s``，计算并返回表达式的整数结果。表达式由非负十进制整数、空格以及 ``+``、``-``、``*``、``/`` 四种二元运算符组成，不含括号。乘法和除法的优先级高于加法和减法；同一优先级按从左到右结合。

字符串长度位于 ``[1, 3 * 10^5]``。题目保证表达式合法，表达式中的每个整数及最终结果都适合 32 位有符号整数。整数除法必须向零截断，例如 ``7 / 3`` 的结果为 ``2``。不能使用把字符串直接作为表达式执行的内置求值函数。

自建示例
--------

乘除先计算：

.. code-block:: text

   输入：s = "18-5*3+7/2"
   输出：6
   解释：先得到 5*3=15 和 7/2=3，再按从左到右计算 18-15+3=6。

除法丢弃小数部分：

.. code-block:: text

   输入：s = "20/3-8"
   输出：-2
   解释：20/3 向零截断为 6，因此最终结果为 6-8=-2。

保留尚未合并的最后一项
----------------------

表达式没有括号，乘除只需要在当前加减项内部立即计算；加减遇到时可以把前一项提交到总和。
维护三个状态：

``result``
   已经确定不会再与后续乘除相连的项之和。

``last_term``
   当前加减段中最后一项，可能是正数或负数，等待与下一个乘除运算结合。

``number`` 与 ``op``
   正在读取的数字，以及它前面的运算符。

读到下一个运算符时，根据 ``op`` 更新：``+`` 把 ``last_term`` 加入 ``result`` 并令最后一项为正数，
``-`` 同样提交并令最后一项为负数，``*`` 或 ``/`` 只改写 ``last_term``。字符串末尾设置一个虚拟分隔点，
确保最后一个数字也被处理。

正确性说明
----------

在扫描每个运算符前，``result + last_term + number`` 表示已读前缀的值，其中 ``last_term`` 尚未与
当前数字结合。加减会结束当前高优先级项，因此先提交旧项；乘除只修改该项，正好实现乘除优先。
除法使用 C++ 对整数的向零截断语义，符合题目定义。扫描结束后再提交最后一项，得到完整表达式值。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int calculate(const std::string& s) {
           long long result = 0;
           long long last_term = 0;
           long long number = 0;
           char op = '+';

           for (int i = 0; i <= static_cast<int>(s.size()); ++i) {
               const char ch = (i == static_cast<int>(s.size())) ? '+' : s[i];
               if (ch >= '0' && ch <= '9') {
                   number = number * 10 + (ch - '0');
                   continue;
               }
               if (ch == ' ') continue;

               switch (op) {
                   case '+':
                       result += last_term;
                       last_term = number;
                       break;
                   case '-':
                       result += last_term;
                       last_term = -number;
                       break;
                   case '*':
                       last_term *= number;
                       break;
                   case '/':
                       last_term /= number;
                       break;
               }
               number = 0;
               op = ch;
           }

           return static_cast<int>(result + last_term);
       }
   };

代码分析
--------

空格不触发结算；虚拟末尾运算符只用于触发最后一次更新，不会影响 ``result + last_term`` 的最终组合。
每个字符只扫描一次，时间复杂度为 ``O(|s|)``，除固定数量的累加状态外空间为 ``O(1)``。
使用 ``long long`` 保存中间项，并依赖题目保证最终结果适合 ``int``。
