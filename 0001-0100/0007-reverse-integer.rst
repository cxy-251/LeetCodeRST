0007. Reverse Integer
=====================

题目信息
--------

:题号: 0007
:难度: Medium
:主题: 整数、十进制位、向零截断、溢出判断
:原题: `LeetCode 0007 <https://leetcode.com/problems/reverse-integer/>`_
:教学重点: 十进制位弹出与压入、负数商余数、压入前边界判断、固定宽度整数语义

题目重述
--------

给定一个 32 位有符号整数 ``x``，返回其十进制数字顺序反转后的整数。负号继续位于结果最前面；
原整数末尾的零在反转后成为前导零，会自然消失。若反转结果超出区间
``[-2^31, 2^31 - 1]``，返回 ``0``。

题目要求主解法在没有 64 位整数存储能力的环境中完成，因此不能先把完整反转结果保存到更宽整数，
再在循环结束后统一判断。安全实现需要在每次执行 ``reversed * 10 + digit`` 之前确认下一状态仍位于
32 位范围内。

自建示例
--------

末尾零自然消失：

.. code-block:: text

   输入：x = 12030
   弹出顺序：0, 3, 0, 2, 1
   结果变化：0 -> 3 -> 30 -> 302 -> 3021
   输出：3021

负数使用同一套逐位过程：

.. code-block:: text

   输入：x = -408
   弹出顺序：-8, 0, -4
   结果变化：-8 -> -80 -> -804
   输出：-804

接近正向上界但仍然合法：

.. code-block:: text

   输入：x = 1463847412
   输出：2147483641

   2147483641 仍然不大于 2147483647。

反转过程中发现越界：

.. code-block:: text

   输入：x = 1534236469
   数学反转结果：9646324351
   输出：0

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
           const bool negative = text.front() == '-';

           std::reverse(
               text.begin() + (negative ? 1 : 0),
               text.end()
           );

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
               x /= 10;  // C++11 起，有符号整数除法向零截断

               if (
                   reversed > INT_MAX / 10 ||
                   (reversed == INT_MAX / 10 && digit > 7)
               ) {
                   return 0;
               }
               if (
                   reversed < INT_MIN / 10 ||
                   (reversed == INT_MIN / 10 && digit < -8)
               ) {
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

字符串转换如何直接表达数字反转
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``reverseAsString`` 把整数转换成十进制文本，保留开头的负号，只反转数字部分。文本 ``"-120"``
会变成 ``"-021"``，重新解析后自然得到 ``-21``。

这种方法与题意的表面描述最接近，但需要额外字符串空间，并依赖能够容纳反转结果的 ``long long``
完成解析和越界判断。它适合作为直观对照，不满足题目对主解法“不依赖 64 位整数”的约束。

宽整数为什么能把边界判断推迟到最后
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``reverseWithWideInteger`` 仍然使用整数运算，但把剩余输入和累计结果都提升为 ``long long``。因为任意
32 位整数最多有 10 个十进制数字，其反转后的数学值可以被常见 64 位有符号整数容纳，所以循环内可以
直接执行乘十和加法，最后再检查结果是否位于 32 位范围。

这种写法展示了逐位算法的核心结构，但安全性来自更宽整数，而不是来自算法自身的边界控制。题目明确
假设环境不能存储 64 位整数，因此标准入口不能选择这一方案。

从十进制位权推导逐位状态变化
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

主解法需要始终把状态保存在 32 位整数中。对当前尚未处理的整数 ``x``，定义向零截断商 ``q`` 和最低位
``digit``：

.. math::

   q = \operatorname{trunc}(x / 10)

.. math::

   digit = x - 10q

于是始终有：

.. math::

   x = 10q + digit

``digit`` 位于 ``[-9, 9]``，它就是 ``x`` 当前的最低十进制位。把 ``x`` 更新为 ``q``，等价于删除
最低位；把该数字追加到结果末尾，则执行：

.. math::

   reversed_{next} = 10 \cdot reversed + digit

每轮把输入的一位从 ``x`` 移入 ``reversed``，因此不需要保存数字数组，也不需要单独处理正负号。

向零截断为什么能统一处理正数和负数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对正数 ``408``：

.. code-block:: text

   q = 40, digit = 8

对负数 ``-408``，向零截断得到：

.. code-block:: text

   q = -40, digit = -8

两者都满足 ``x = 10 * q + digit``。负数弹出的每一位也为负，累计结果会自然保持负号：

.. code-block:: text

   0 * 10 + (-8) = -8
   -8 * 10 + 0   = -80
   -80 * 10 + (-4) = -804

这样可以直接处理 ``INT_MIN``。若先对输入取绝对值，``abs(-2147483648)`` 会变成 ``2147483648``，
它已经超出 32 位正数上界。

不同语言的默认整除语义并不完全相同。C、C++、Java、Rust、Go 和 C# 的整数除法向零截断；Python
的 ``//`` 与 R 的 ``%/%`` 对负数向下取整；TypeScript 需要 ``Math.trunc``；Julia 在本文中显式
使用 ``RoundToZero``。只要先得到向零截断商，都可以用 ``digit = x - quotient * 10`` 恢复最低位。

压入前边界如何从 32 位范围推导
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设：

.. math::

   INT\_MAX = 2147483647

.. math::

   INT\_MIN = -2147483648

下一状态为 ``10 * reversed + digit``。真正执行乘法前，先比较 ``reversed`` 与上下界除以 10 的商。

正向上界
^^^^^^^^

``INT_MAX / 10`` 向零截断为 ``214748364``。

* 若 ``reversed > 214748364``，乘十后已经超过上界；
* 若 ``reversed < 214748364``，即使追加最大数字 9 也不会超过上界；
* 若 ``reversed == 214748364``，最后一位最多只能是 ``7``。

因此正向越界条件为：

.. code-block:: text

   reversed > INT_MAX / 10
   或
   reversed == INT_MAX / 10 且 digit > 7

负向下界
^^^^^^^^

``INT_MIN / 10`` 向零截断为 ``-214748364``。

* 若 ``reversed < -214748364``，乘十后已经小于下界；
* 若 ``reversed > -214748364``，追加最小数字 -9 仍不会越过下界；
* 若 ``reversed == -214748364``，最后一位最小只能是 ``-8``。

因此负向越界条件为：

.. code-block:: text

   reversed < INT_MIN / 10
   或
   reversed == INT_MIN / 10 且 digit < -8

``7`` 和 ``-8`` 分别来自 ``2147483647`` 与 ``-2147483648`` 的最后一位。只有累计结果已经到达
十分之一边界时，最后一位比较才会生效。

普通负数的状态演化
~~~~~~~~~~~~~~~~~~

使用 ``x = -408``：

.. list-table::
   :header-rows: 1

   * - 轮次
     - 更新前 ``x``
     - 向零截断商
     - ``digit``
     - 更新前 ``reversed``
     - 更新后 ``reversed``
   * - 1
     - -408
     - -40
     - -8
     - 0
     - -8
   * - 2
     - -40
     - -4
     - 0
     - -8
     - -80
   * - 3
     - -4
     - 0
     - -4
     - -80
     - -804

第三轮后 ``x`` 变成 0，说明所有十进制位都已移动到结果中。

溢出输入在危险乘法前停止
~~~~~~~~~~~~~~~~~~~~~~~~

使用 ``x = 1534236469``。前九轮完成后：

.. code-block:: text

   x = 1
   reversed = 964632435

下一轮弹出 ``digit = 1``。此时 ``reversed > 214748364``，所以无需执行
``964632435 * 10 + 1`` 就可以确定结果会超过 ``INT_MAX``，直接返回 ``0``。

这一步顺序对于 C 和 C++ 尤其重要：若先让 32 位有符号整数发生溢出，再检查结果，原数学值已经丢失，
并且 C、C++ 的有符号溢出还可能产生未定义行为。

解法对比与主解法选择
~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 边界控制来源
   * - 字符串反转后解析
     - ``O(d)``
     - ``O(d)``
     - 更宽解析类型与最终范围检查
   * - 宽整数逐位累积
     - ``O(d)``
     - ``O(1)``
     - 64 位中间结果与最终范围检查
   * - 纯 32 位逐位处理
     - ``O(d)``
     - ``O(1)``
     - 每次乘加之前反推安全边界

``d`` 是输入的十进制位数。标准入口选择纯 32 位方案，因为它在每个中间状态都满足题目的存储约束，
也直接展示固定宽度算术中应如何在危险运算发生前控制边界。

为什么每轮恰好移动一个十进制位
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

向零截断商和余数满足 ``x = 10 * quotient + digit``，且 ``|digit| < 10``。因此 ``digit`` 唯一表示
当前最低位，``quotient`` 唯一表示删除该位后的剩余整数。

更新 ``reversed = reversed * 10 + digit`` 会把已有数字整体提升一个十进制位，再把刚弹出的最低位放到
个位。输入减少一位，结果增加一位，所以每轮恰好完成一次数字转移。

为什么四个比较覆盖全部溢出情况
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对正数边界，``reversed`` 与 ``INT_MAX / 10`` 的大小关系已经决定乘十后的数量级。只有两者相等时，
``digit`` 才能决定最终结果位于上界内还是上界外。负数边界完全对称，只是 32 位下界的末位为 ``-8``。

因此正向的“商过大、商相等且末位过大”和负向的“商过小、商相等且末位过小”覆盖了所有越界可能；
其余状态执行乘加必然安全。

为什么循环结束得到完整反转
~~~~~~~~~~~~~~~~~~~~~~~~~~

循环开始时，``x`` 保存尚未处理的高位部分，``reversed`` 保存已经弹出的低位按弹出顺序组成的整数。
每轮保持这一关系，并让 ``x`` 少一位。

当 ``x == 0`` 时，原整数已经没有未处理数字。所有数字均按“原最低位到原最高位”的顺序进入
``reversed``，正好构成完整反转。最先弹出的零只会让 ``0 * 10 + 0`` 仍为 0，所以原整数末尾零会
自然消失，中间位置的零仍会通过后续乘十保留。

复杂度来源
~~~~~~~~~~

字符串方法转换、反转和解析 ``d`` 个字符，时间复杂度 ``O(d)``，字符串占用 ``O(d)`` 工作空间。

两种整数方法每轮通过除以 10 删除一个十进制位，共执行 ``d`` 轮，时间复杂度 ``O(d)``。它们只维护
固定数量的整数变量，工作空间为 ``O(1)``。纯 32 位方案每轮增加常数次边界比较，不改变渐进复杂度。

九语言实现
----------

九语言统一实现纯 32 位逐位方案。所有实现都按“取得向零截断商和最低位 → 执行边界检查 → 安全后
乘十并追加”的顺序更新状态。宿主语言即使提供更宽整数或任意精度整数，也显式遵守 32 位结果范围。

C
~

.. code-block:: c

   #include <limits.h>

   int reverse(int x) {
       int reversed = 0;

       while (x != 0) {
           const int digit = x % 10;
           x /= 10;  // C99 起，有符号整数除法向零截断

           if (
               reversed > INT_MAX / 10 ||
               (reversed == INT_MAX / 10 && digit > 7)
           ) {
               return 0;
           }
           if (
               reversed < INT_MIN / 10 ||
               (reversed == INT_MIN / 10 && digit < -8)
           ) {
               return 0;
           }

           reversed = reversed * 10 + digit;
       }

       return reversed;
   }

Python
~~~~~~

Python 的 ``//`` 对负数向下取整。实现先对绝对值整除，再恢复商的符号，从而得到向零截断结果。

.. code-block:: python

   class Solution:
       def reverse(self, x: int) -> int:
           int_min = -(2**31)
           int_max = 2**31 - 1
           reversed_number = 0

           while x != 0:
               quotient = abs(x) // 10
               if x < 0:
                   quotient = -quotient
               digit = x - quotient * 10
               x = quotient

               if (
                   reversed_number > 214748364
                   or (
                       reversed_number == 214748364
                       and digit > 7
                   )
               ):
                   return 0
               if (
                   reversed_number < -214748364
                   or (
                       reversed_number == -214748364
                       and digit < -8
                   )
               ):
                   return 0

               reversed_number = reversed_number * 10 + digit

           return reversed_number

Java
~~~~

.. code-block:: java

   class Solution {
       public int reverse(int x) {
           int reversed = 0;

           while (x != 0) {
               int digit = x % 10;
               x /= 10; // Java 整数除法向零截断

               if (
                   reversed > Integer.MAX_VALUE / 10 ||
                   (reversed == Integer.MAX_VALUE / 10 && digit > 7)
               ) {
                   return 0;
               }
               if (
                   reversed < Integer.MIN_VALUE / 10 ||
                   (reversed == Integer.MIN_VALUE / 10 && digit < -8)
               ) {
                   return 0;
               }

               reversed = reversed * 10 + digit;
           }

           return reversed;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn reverse(mut x: i32) -> i32 {
           let mut reversed = 0_i32;

           while x != 0 {
               let digit = x % 10;
               x /= 10; // i32 除法向零截断

               if reversed > i32::MAX / 10
                   || (reversed == i32::MAX / 10 && digit > 7)
               {
                   return 0;
               }
               if reversed < i32::MIN / 10
                   || (reversed == i32::MIN / 10 && digit < -8)
               {
                   return 0;
               }

               reversed = reversed * 10 + digit;
           }

           reversed
       }
   }

Go
~~

Go 的 ``int`` 宽度取决于平台；代码使用明确的 32 位上下界，使返回语义不依赖宿主位宽。

.. code-block:: go

   func reverse(x int) int {
       const intMin = -1 << 31
       const intMax = 1<<31 - 1
       reversed := 0

       for x != 0 {
           digit := x % 10
           x /= 10 // Go 整数除法向零截断

           if reversed > intMax/10 ||
               (reversed == intMax/10 && digit > 7) {
               return 0
           }
           if reversed < intMin/10 ||
               (reversed == intMin/10 && digit < -8) {
               return 0
           }

           reversed = reversed*10 + digit
       }

       return reversed
   }

TypeScript
~~~~~~~~~~

TypeScript 使用 ``number``，但 32 位整数和检查前的中间状态都能被精确表示。``Math.trunc`` 明确提供
向零截断语义。

.. code-block:: typescript

   function reverse(x: number): number {
       const intMin = -(2 ** 31);
       const intMax = 2 ** 31 - 1;
       let reversed = 0;

       while (x !== 0) {
           const quotient = Math.trunc(x / 10);
           const digit = x - quotient * 10;
           x = quotient;

           if (
               reversed > Math.trunc(intMax / 10) ||
               (reversed === Math.trunc(intMax / 10) && digit > 7)
           ) {
               return 0;
           }
           if (
               reversed < Math.trunc(intMin / 10) ||
               (reversed === Math.trunc(intMin / 10) && digit < -8)
           ) {
               return 0;
           }

           reversed = reversed * 10 + digit;
       }

       return reversed;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int Reverse(int x) {
           int reversed = 0;

           while (x != 0) {
               int digit = x % 10;
               x /= 10; // C# 整数除法向零截断

               if (
                   reversed > int.MaxValue / 10 ||
                   (reversed == int.MaxValue / 10 && digit > 7)
               ) {
                   return 0;
               }
               if (
                   reversed < int.MinValue / 10 ||
                   (reversed == int.MinValue / 10 && digit < -8)
               ) {
                   return 0;
               }

               reversed = reversed * 10 + digit;
           }

           return reversed;
       }
   }

Julia
~~~~~

Julia 的 ``Int`` 宽度随平台变化。实现仍按 32 位边界检查，并显式选择向零截断。

.. code-block:: julia

   function reverse_integer(x::Int)::Int
       int_min = -2147483648
       int_max = 2147483647
       reversed = 0

       while x != 0
           quotient = div(x, 10, RoundToZero)
           digit = x - quotient * 10
           x = quotient

           if reversed > div(int_max, 10) ||
              (reversed == div(int_max, 10) && digit > 7)
               return 0
           end
           if reversed < div(int_min, 10, RoundToZero) ||
              (reversed == div(int_min, 10, RoundToZero) && digit < -8)
               return 0
           end

           reversed = reversed * 10 + digit
       end

       return reversed
   end

R
~

R 的 ``numeric`` 可以精确表示 32 位整数。``trunc`` 用于获得向零截断商；结果保持为 numeric，避免
``-2147483648`` 与 ``NA_integer_`` 的内部表示冲突。

.. code-block:: r

   reverse_integer <- function(x) {
       int_min <- -2147483648
       int_max <- 2147483647
       reversed <- 0

       while (x != 0) {
           quotient <- trunc(x / 10)
           digit <- x - quotient * 10
           x <- quotient

           if (
               reversed > trunc(int_max / 10) ||
               (reversed == trunc(int_max / 10) && digit > 7)
           ) {
               return(0)
           }
           if (
               reversed < trunc(int_min / 10) ||
               (reversed == trunc(int_min / 10) && digit < -8)
           ) {
               return(0)
           }

           reversed <- reversed * 10 + digit
       }

       reversed
   }
