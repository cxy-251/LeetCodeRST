0405. Convert a Number to Hexadecimal
=====================================

题目信息
--------

:题号: 0405
:难度: Easy
:主题: 32 位整数、十六进制、补码、小写表示
:原题: `LeetCode 0405 <https://leetcode.com/problems/convert-a-number-to-hexadecimal/>`_
:重点: 负数使用 32 位二进制补码、结果不带负号、字母使用小写、非零结果不含前导零

题目重述
--------

给定一个 32 位有符号整数 ``num``，返回它的十六进制字符串表示。十六进制数字 ``10..15`` 必须使用小写字母 ``a..f``，且不能调用直接完成整数进制转换的内置方法。

``num`` 位于 ``[-2^31, 2^31-1]``。非负数按其普通数值表示；负数按照 32 位二进制补码解释，所以结果不带负号，并由最多 8 个十六进制字符组成。数字 0 返回 ``"0"``，其他结果不能有前导零。

自建示例
--------

正数包含十六进制字母：

.. code-block:: text

   输入：num = 47
   输出："2f"
   解释：47 = 2 * 16 + 15，最低位 15 使用小写字母 f 表示。

负数使用补码：

.. code-block:: text

   输入：num = -2
   输出："fffffffe"
   解释：-2 的 32 位补码为 0xfffffffe，因此返回八位十六进制表示且不带负号。

按无符号补码逐个取四位
------------------------

把输入转换为 ``uint32_t`` 后，负数会按 32 位模意义保留其补码位模式，正数的位模式不变。每次取最低四位作为一个十六进制数字，再无符号右移四位；循环结束后反转收集结果。这样负数会自然产生最多 8 位，而不会出现负号。

0 是唯一需要单独处理的空循环结果；十六进制字符表采用小写 ``a..f``，从高位反转后也不会产生前导零。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::string toHex(int num) {
           if (num == 0) return "0";
           const std::string digits = "0123456789abcdef";
           uint32_t value = static_cast<uint32_t>(num);
           std::string result;
           while (value != 0) {
               result.push_back(digits[value & 0xF]);
               value >>= 4;
           }
           std::reverse(result.begin(), result.end());
           return result;
       }
   };

代码分析
--------

无符号类型保证右移补零，32 位补码的负数最终在第 8 个十六进制数字后结束；每轮固定处理四个位。时间复杂度为 ``O(1)``（最多 8 轮），额外空间为 ``O(1)``（不计返回字符串）。
