0537. Complex Number Multiplication
===================================

题目信息
--------

:题号: 0537
:难度: Medium
:主题: 复数、字符串解析、实部虚部、固定输出格式
:原题: `LeetCode 0537 <https://leetcode.com/problems/complex-number-multiplication/>`_
:重点: 输入格式为 a+bi、实部虚部可为负数、使用 i²=-1、结果仍写成 real+imagi

题目重述
--------

给定两个表示复数的字符串 ``num1`` 和 ``num2``。每个字符串采用 ``"a+bi"`` 形式，其中 ``a`` 是实部，``b`` 是虚部系数，二者都可能为负整数。

计算两个复数的乘积，并以相同的 ``"real+imagi"`` 格式返回。虚数单位满足 ``i * i = -1``；即使虚部为负，分隔实部与虚部的字符仍保留为 ``+``，例如 ``"3+-2i"``。

自建示例
--------

实部和虚部均发生变化：

.. code-block:: text

   输入：num1 = "2+3i"，num2 = "-1+4i"
   输出："-14+5i"
   解释：实部为 2*(-1)-3*4=-14，虚部为 2*4+3*(-1)=5。

虚部结果为负：

.. code-block:: text

   输入：num1 = "0+-2i"，num2 = "3+0i"
   输出："0+-6i"
   解释：乘积的实部为 0，虚部系数为 -6，并按固定格式输出。

先解析两部分再套乘法公式
------------------------

分隔实部和虚部的 ``+`` 仍然存在，即使虚部为负时字符串形如 ``a+-bi``。找到这个分隔符后，前段是实部，去掉末尾 ``i`` 的后段是虚部。复数乘法遵循 ``(a+bi)(c+di) = (ac-bd) + (ad+bc)i``。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::pair<int, int> parse(const std::string& value) {
           int plus = static_cast<int>(value.find('+'));
           int real = std::stoi(value.substr(0, plus));
           int imaginary = std::stoi(
               value.substr(plus + 1, value.size() - plus - 2));
           return {real, imaginary};
       }

   public:
       std::string complexNumberMultiply(std::string num1,
                                         std::string num2) {
           auto first = parse(num1);
           auto second = parse(num2);
           int real = first.first * second.first -
                      first.second * second.second;
           int imaginary = first.first * second.second +
                           first.second * second.first;
           return std::to_string(real) + "+" +
                  std::to_string(imaginary) + "i";
       }
   };

代码分析
--------

解析保留实部、虚部的符号，公式中的 ``-bd`` 正确处理 ``i^2=-1``；输出始终重新插入 ``+``，因此负虚部会形成合法的 ``+-`` 格式。时间复杂度为 ``O(|num1|+|num2|)``，额外空间复杂度为 ``O(1)``（不计输出字符串）。
