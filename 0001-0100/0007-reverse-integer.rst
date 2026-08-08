0007. Reverse Integer
=====================

题目信息
--------

:题号: 0007. 整数反转
:难度: Medium
:主题: 数学、整数、溢出边界
:原题: `LeetCode 0007 <https://leetcode.com/problems/reverse-integer/>`_
:重点: 从文本反转和宽整数累积，推导到纯 32 位逐位处理，并在危险乘加发生前判断溢出

题目重述
--------

给定一个 32 位有符号整数 ``x``，需要返回将其十进制数字顺序反转后的整数。负数只反转数字部分，负号仍保留在结果前；原整数末尾的零在反转后成为前导零，因此不会保留在整数结果中。

若反转后的数学结果超出 32 位有符号整数范围 ``[-2^31, 2^31 - 1]``，返回 ``0``。题目还要求不能依赖 64 位有符号或无符号整数保存中间结果。

自建示例
--------

* 普通正数：``x = 123``，依次取出 ``3``、``2``、``1``，返回 ``321``；
* 负数含零：``x = -408``，数字部分反转后返回 ``-804``；
* 末尾零：``x = 1200``，反转后的前导零被整数表示自动丢弃，返回 ``21``；
* 正向溢出：``x = 1534236469``，反转结果超过 ``INT_MAX``，返回 ``0``；
* 最小整数：``x = -2147483648``，不能先取绝对值，反转结果也越界，返回 ``0``；
* 零值：``x = 0``，返回 ``0``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <climits>
   #include <string>

   class Solution {
   private:
       int reverseAsString(int x) {
           std::string text = std::to_string(x);
           const int firstDigit = text.front() == '-' ? 1 : 0;
           std::reverse(text.begin() + firstDigit, text.end());
           const long long value = std::stoll(text);
           if (value < INT_MIN || value > INT_MAX) {
               return 0;
           }
           return static_cast<int>(value);
       }

       int reverseWithWideInteger(int x) {
           long long remaining = x;
           long long reversed = 0;
           while (remaining != 0) {
               const long long digit = remaining % 10;
               remaining /= 10;
               reversed = reversed * 10 + digit;
           }
           if (reversed < INT_MIN || reversed > INT_MAX) {
               return 0;
           }
           return static_cast<int>(reversed);
       }

       int reverseWithinInt(int x) {
           int reversed = 0;
           while (x != 0) {
               const int digit = x % 10;
               x /= 10;
               if (reversed > INT_MAX / 10 ||
                   (reversed == INT_MAX / 10 && digit > INT_MAX % 10)) {
                   return 0;
               }
               if (reversed < INT_MIN / 10 ||
                   (reversed == INT_MIN / 10 && digit < INT_MIN % 10)) {
                   return 0;
               }
               reversed = reversed * 10 + digit;
           }
           return reversed;
       }

   public:
       int reverse(int x) {
           return reverseWithinInt(x);
       }
   };

题解
----

文本反转
~~~~~~~~

最直观的方法是把整数转换为十进制字符串，跳过开头的负号，反转剩余字符，再把文本解析回整数。原数末尾的零会移动到文本数字部分开头，重新解析时自然消失。

``reverseAsString`` 直接对应题意，但需要 ``O(d)`` 字符串空间。更重要的是，反转后的文本可能已经超出 32 位范围，因此解析时仍需借助 ``long long``；它不能作为满足题目限制的主解法。

逐位转移
~~~~~~~~

字符串并非必要。十进制整数的最低位可以通过 ``digit = x % 10`` 取得，随后执行 ``x /= 10`` 删除该位。把取出的数字追加到结果末尾，则执行 ``reversed = reversed * 10 + digit``。

每轮完成一次明确的状态转移：输入少一个最低位，结果多一个新的最低位。循环结束时，原数字的各位已经按从低位到高位的顺序进入 ``reversed``，正好形成反转结果。

C++ 的有符号除法向零截断，余数与被除数同号。因此负数不需要单独提取符号：``-408 % 10`` 得到 ``-8``，后续数字依次为 ``0`` 和 ``-4``，累计结果自然成为 ``-804``。

这也避免了对 ``INT_MIN`` 取绝对值。``-2147483648`` 的正数绝对值是 ``2147483648``，已经超出 32 位有符号整数上界。

宽整数累积
~~~~~~~~~~

``reverseWithWideInteger`` 使用 ``long long`` 保存 ``remaining`` 和 ``reversed``，循环中可以直接执行乘十和加法，最后再判断结果是否位于 32 位范围。

这一步把字符串、解析和字符反转全部删除，只保留十进制数位转移。它的边界安全依赖更宽类型，而题目明确不允许用 64 位整数保存中间结果，因此还需要把越界判断移动到每次乘加之前。

乘加边界
~~~~~~~~

下一状态是 ``reversed * 10 + digit``。若先执行这条语句再检查，32 位有符号整数可能已经溢出，原数学结果也已经丢失。因此必须根据当前 ``reversed`` 预判下一次乘加是否安全。

正向上界分为三种情况：

* ``reversed > INT_MAX / 10`` 时，单独乘十就会越界；
* ``reversed < INT_MAX / 10`` 时，追加任意十进制位都安全；
* ``reversed == INT_MAX / 10`` 时，``digit`` 不能大于 ``INT_MAX % 10``，即 ``7``。

负向下界完全对应：

* ``reversed < INT_MIN / 10`` 时，乘十后会低于下界；
* ``reversed > INT_MIN / 10`` 时，追加当前负数位仍安全；
* ``reversed == INT_MIN / 10`` 时，``digit`` 不能小于 ``INT_MIN % 10``，即 ``-8``。

只有通过这两组检查后，``reversed = reversed * 10 + digit`` 才会执行。这样所有中间状态始终位于 32 位有符号整数范围内。

状态推演
~~~~~~~~

以 ``x = -408`` 为例：

.. list-table::
   :header-rows: 1

   * - 轮次
     - 原 ``x``
     - ``digit``
     - 新 ``x``
     - 原 ``reversed``
     - 新 ``reversed``
   * - 1
     - -408
     - -8
     - -40
     - 0
     - -8
   * - 2
     - -40
     - 0
     - -4
     - -8
     - -80
   * - 3
     - -4
     - -4
     - 0
     - -80
     - -804

对于 ``x = 1534236469``，处理到最后一个数字前，``reversed`` 已经是 ``964632435``。它大于 ``INT_MAX / 10``，算法在执行危险乘法前直接返回 ``0``。

代码演进
~~~~~~~~

``reverseAsString`` 按字符反转，代码需要字符串、负号起点、文本解析和额外空间。

``reverseWithWideInteger`` 把字符操作替换为取余、整除和乘加，字符串与解析过程消失，但增加了 64 位中间状态和最终范围检查。

``reverseWithinInt`` 保留相同的逐位转移，把最终检查前移到每次乘加之前。``long long`` 状态和循环后的范围判断同时消失，所有计算都在 ``int`` 中完成。

公开入口采用 ``reverseWithinInt``，因为它满足题目的存储限制，并且不会先触发有符号整数溢出再尝试补救。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要代价
   * - 字符串反转
     - ``O(d)``
     - ``O(d)``
     - 构造、反转并解析十进制文本
   * - 宽整数逐位累积
     - ``O(d)``
     - ``O(1)``
     - 使用 64 位中间结果后统一检查范围
   * - 纯 32 位逐位处理
     - ``O(d)``
     - ``O(1)``
     - 每次乘加前检查上下界

``d`` 是输入的十进制位数。32 位整数最多只有常数个十进制位，但保留 ``O(d)`` 更能表达算法随位数增长的工作量。

边界处理
~~~~~~~~

* ``x = 0`` 时循环不执行，初始结果 ``0`` 直接返回；
* 原数末尾的零先被取出，追加到初始结果时不产生有效高位，因此自然消失；
* 负数直接使用负余数累计，不取绝对值，可以安全处理 ``INT_MIN``；
* 上下界判断使用 ``INT_MAX % 10`` 和 ``INT_MIN % 10``，不依赖硬编码末位；
* 一旦下一次乘加会越界，立即返回 ``0``，不会执行未定义的有符号溢出。
