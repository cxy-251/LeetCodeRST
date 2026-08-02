0415. Add Strings
=================

题目信息
--------

:题号: 0415
:难度: Easy
:主题: 非负整数字符串、十进制加法、进位、禁止整体转换
:原题: `LeetCode 0415 <https://leetcode.com/problems/add-strings/>`_
:重点: 输入可能远超内置整数范围、不能直接转为整数或使用大整数库、返回规范十进制和

题目重述
--------

给定两个表示非负整数的十进制字符串 ``num1`` 和 ``num2``，返回它们相加后的十进制字符串。

两个字符串长度均位于 ``[1, 10^4]``，只包含数字；除字符串 ``"0"`` 外不会含前导零。不能把完整字符串直接转换为整数，也不能使用专门的大整数运算库。结果应使用普通十进制写法，除零本身外不含前导零。

自建示例
--------

连续产生进位：

.. code-block:: text

   输入：num1 = "999"，num2 = "7"
   输出："1006"
   解释：个位 9 + 7 产生进位，进位继续传递到更高位，最终新增最高位 1。

两个零相加：

.. code-block:: text

   输入：num1 = "0"，num2 = "0"
   输出："0"
   解释：结果使用单个字符 0，不能返回空字符串或含前导零的形式。

从末位模拟进位
----------------

字符串加法与手算相同，从两个字符串的末位开始，每一位加上当前进位，写入结果的末尾，再把指针向左移动。较短字符串缺少的高位按 0 处理；循环结束后若仍有进位，再追加一个 ``1``，最后反转结果。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::string addStrings(std::string num1, std::string num2) {
           int i = static_cast<int>(num1.size()) - 1;
           int j = static_cast<int>(num2.size()) - 1;
           int carry = 0;
           std::string result;
           while (i >= 0 || j >= 0 || carry != 0) {
               int sum = carry;
               if (i >= 0) sum += num1[i--] - '0';
               if (j >= 0) sum += num2[j--] - '0';
               result.push_back(static_cast<char>('0' + sum % 10));
               carry = sum / 10;
           }
           std::reverse(result.begin(), result.end());
           return result;
       }
   };

代码分析
--------

每一位只依赖两个当前数字和一个进位，不会把完整字符串转换为固定宽度整数；输入为零时循环仍会写出一个 ``0``。设两串最大长度为 ``n``，时间复杂度为 ``O(n)``，额外空间为 ``O(n)``。
