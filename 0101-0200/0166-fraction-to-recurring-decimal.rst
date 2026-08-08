0166. Fraction to Recurring Decimal
===================================

题目信息
--------

:题号: 0166. 分数到小数
:难度: Medium
:主题: 哈希表、长除法、有限状态
:原题: `LeetCode 0166 <https://leetcode.com/problems/fraction-to-recurring-decimal/>`_
:重点: 将长除法的余数作为完整状态，用状态首次重复的位置界定循环节

题目重述
--------

给定两个 32 位有符号整数 ``numerator`` 和 ``denominator``，将分数
``numerator / denominator`` 转成十进制字符串。输入保证分母不为 0。

整数结果不保留小数点；有限小数写出完整小数部分；无限循环小数用一对圆括号包住循环节。
负号只出现在整个字符串最前面。

自建示例
--------

.. code-block:: text

   输入：numerator = 7, denominator = 12
   输出："0.58(3)"

   7 / 12 = 0.58333...，非循环前缀是 58，循环节是 3。

.. code-block:: text

   输入：numerator = 1, denominator = 6
   输出："0.1(6)"

   余数 4 第二次出现时，它第一次出现之前已经生成了非循环数字 1。

.. code-block:: text

   输入：numerator = -2147483648, denominator = -1
   输出："2147483648"

   结果为正，绝对值超出 32 位有符号整数，但可以由 64 位整数安全保存。

C++ 实现
--------

.. code-block:: cpp

   #include <cstddef>
   #include <string>
   #include <unordered_map>

   class Solution {
   public:
       std::string fractionToDecimal(int numerator, int denominator) {
           if (numerator == 0) {
               return "0";
           }

           long long dividend = numerator;
           long long divisor = denominator;
           bool negative = (dividend < 0) != (divisor < 0);
           if (dividend < 0) {
               dividend = -dividend;
           }
           if (divisor < 0) {
               divisor = -divisor;
           }

           std::string result;
           if (negative) {
               result.push_back('-');
           }
           result += std::to_string(dividend / divisor);

           long long remainder = dividend % divisor;
           if (remainder == 0) {
               return result;
           }

           result.push_back('.');
           std::unordered_map<long long, std::size_t> first_position;

           while (remainder != 0) {
               auto repeated = first_position.find(remainder);
               if (repeated != first_position.end()) {
                   result.insert(repeated->second, 1, '(');
                   result.push_back(')');
                   break;
               }

               first_position[remainder] = result.size();
               remainder *= 10;
               int digit = static_cast<int>(remainder / divisor);
               result.push_back(static_cast<char>('0' + digit));
               remainder %= divisor;
           }
           return result;
       }
   };

题解
----

浮点数不是题目的搜索空间
~~~~~~~~~~~~~~~~~~~~~~~~

直觉上可以先做浮点除法，再观察小数数字是否重复。但浮点数只保存有限精度：长循环会被
截断或舍入，某些有限小数也无法在二进制浮点中精确表示。输出要求的是精确的十进制结构，
所以不能从近似值反推循环节。

回到小学长除法：先得到整数部分；若余数非零，就把余数乘 10，商的一位写入答案，
再以新的余数继续。这个过程不会猜测数字，每一步都由整数运算精确确定。

为什么余数是完整状态
~~~~~~~~~~~~~~~~~~~~

固定正分母 ``divisor`` 后，下一位和下一余数完全由当前余数 ``remainder`` 决定：

.. code-block:: text

   expanded  = remainder * 10
   nextDigit = expanded / divisor
   nextState = expanded % divisor

因此过去生成过哪些数字并不影响未来；只要某个余数再次出现，从它开始的后续数字就会与
第一次出现时完全相同。长除法只有两种终局：

* 余数变为 0，后面不会再有非零小数位，结果有限；
* 某个非零余数重复，确定性状态转移从此进入循环。

非零余数只可能是 ``1..divisor-1``。即使暂时不知道循环何时开始，状态数有限也保证上述
两种情况必有一个发生。

位置表删除了什么重复工作
~~~~~~~~~~~~~~~~~~~~~~~~

若只用集合记录余数，可以知道“循环已经出现”，却不知道左括号应插在哪里。哈希表
``first_position[remainder]`` 同时记录该余数第一次出现时，下一位数字将在结果字符串中
写入的位置。

检查与记录必须发生在生成下一位之前：此时 ``remainder`` 描述的正是“将要生成的后缀”。
重复时在其首次位置插入 ``'('``，当前字符串尾部就是一个完整周期的末端，再追加
``')'``。每个新余数只处理一次，发现重复后不再重新生成已经确定的循环数字。

具体走读
~~~~~~~~

对 ``1 / 6``，整数部分和小数点先得到 ``"0."``：

.. code-block:: text

   当前余数  首次位置  生成数字  新余数  当前结果
   1         2         1         4       0.1
   4         3         6         4       0.16
   4         已出现于 3，不再生成数字

第二次见到余数 4 时，在位置 3 插入左括号并在末尾追加右括号，得到 ``"0.1(6)"``。
非循环前缀 1 没有被错误地放进括号。

对 ``7 / 12``，余数依次为 ``7 -> 10 -> 4 -> 4``，对应生成 ``5、8、3``。
余数 4 首次位置在数字 3 之前，所以结果为 ``"0.58(3)"``。若分子能被分母整除，
初始余数就是 0，代码在添加小数点之前返回。

符号与溢出边界
~~~~~~~~~~~~~~

符号只取决于分子、分母是否异号。代码先处理零分子，避免产生 ``"-0"``；随后先把两个
``int`` 提升为 ``long long``，再取相反数。若在 32 位中直接对 ``INT_MIN`` 取绝对值，
其正值无法表示，会产生溢出。

取绝对值后，余数小于 ``divisor``；两者都来自 32 位整数，因此 ``remainder * 10``
可以安全放在 ``long long`` 中。整数部分同样用 64 位计算，能够表示
``2147483648``。

复杂度
~~~~~~

设最终写出的小数数字数为 ``k``。每个不同余数只进入哈希表一次，时间复杂度为
``O(k)``，哈希表额外空间为 ``O(k)``；结果字符串本身也占 ``O(k)`` 空间。理论上
``k`` 不超过正分母可能产生的不同非零余数数量。
