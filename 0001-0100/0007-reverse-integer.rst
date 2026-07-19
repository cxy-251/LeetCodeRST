0007. Reverse Integer
=====================

题目信息
--------

:题号: 0007
:难度: Medium
:主题: 整数、逐位处理、溢出判断
:原题: `LeetCode 0007 <https://leetcode.com/problems/reverse-integer/>`_
:访问状态: Available
:教学重点: 截断除法、负数余数、压入前判溢出、固定宽度整数

题目重述
--------

给定一个 32 位有符号整数 ``x``，把十进制数字顺序反转后返回。负号保留在结果最前面，
反转后产生的前导零会自然消失。若反转结果超出 32 位有符号整数范围
``[-2^31, 2^31 - 1]``，返回 ``0``。

本题不能依赖“先放进更宽整数，最后再判断”的假设。更稳妥的做法是在每次把新数字
压入结果之前，确认下一步乘十和加法仍然位于 32 位范围内。

自建示例
--------

普通正数
~~~~~~~~

.. code-block:: text

   输入：x = 12030

   逐位弹出：0、3、0、2、1
   逐位压入：0 -> 3 -> 30 -> 302 -> 3021

   输出：3021

末尾的零在反转后成为前导零。整数没有前导零表示，因此结果为 ``3021``。

负数与截断除法
~~~~~~~~~~~~~~

.. code-block:: text

   输入：x = -408

   第一次：digit = -8，x = -40，reversed = -8
   第二次：digit =  0，x =  -4，reversed = -80
   第三次：digit = -4，x =   0，reversed = -804

   输出：-804

算法需要使用“向零截断”的整数除法。这样 ``-408 / 10`` 得到 ``-40``，余数为 ``-8``，
符号会随被除数保留，不需要先对 ``x`` 取绝对值。

溢出边界
~~~~~~~~

.. code-block:: text

   输入：x = 1534236469
   反转的数学结果：9646324351
   32 位最大值：   2147483647
   输出：0

问题抽象
--------

每轮从尚未处理的整数 ``x`` 中弹出最低位 ``digit``，再把它压入结果 ``reversed``：

.. math::

   digit = x \bmod 10

.. math::

   x = \operatorname{trunc}(x / 10)

.. math::

   reversed_{next} = reversed \times 10 + digit

其中 ``trunc`` 表示向零截断。循环结束时，原整数的数字被按从低位到高位的顺序依次
压入 ``reversed``，恰好形成十进制反转。

真正的难点不在数字反转，而在于：必须在执行
``reversed * 10 + digit`` 之前判断这一步是否会越过 32 位边界。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 取舍
   * - 逐位弹出并在压入前判溢出
     - ``O(d)``
     - ``O(1)``
     - 主解法；不依赖字符串，也不依赖更宽整数
   * - 转成字符串后反转
     - ``O(d)``
     - ``O(d)``
     - 写法直观，却绕开了整数除法、余数和溢出的核心训练
   * - 使用更宽整数累积后统一判断
     - ``O(d)``
     - ``O(1)``
     - 某些语言可行，但依赖平台存在足够宽且语义可靠的整数类型

``d`` 表示输入十进制数字个数。32 位整数最多只有 10 位，但保留 ``O(d)`` 更能表达
算法随数字位数增长的结构。

主解法：逐位弹出与压入前判溢出
------------------------------

状态含义
~~~~~~~~

循环开始时维护两个状态：

* ``x``：尚未处理的高位部分；
* ``reversed``：已经弹出的低位数字按反序组成的整数。

每轮执行三件事：

#. 用余数取得 ``x`` 的最低位 ``digit``；
#. 用向零截断除法从 ``x`` 删除最低位；
#. 确认 ``reversed * 10 + digit`` 安全后再更新结果。

溢出判断推导
~~~~~~~~~~~~

设：

.. math::

   INT\_MAX = 2147483647

.. math::

   INT\_MIN = -2147483648

正向边界
^^^^^^^^

当 ``reversed > INT_MAX / 10`` 时，再乘十必定越界。

当 ``reversed == INT_MAX / 10`` 时，前九位已经等于 ``214748364``，最后一位最多只能是
``7``。因此 ``digit > 7`` 也会越界。

负向边界
^^^^^^^^

当 ``reversed < INT_MIN / 10`` 时，再乘十必定越界。

当 ``reversed == INT_MIN / 10`` 时，前九位已经等于 ``-214748364``，最后一位最小只能是
``-8``。因此 ``digit < -8`` 也会越界。

检查必须发生在乘法之前。若先计算再判断，C、C++ 等语言中的有符号整数溢出已经发生，
结果可能失真，甚至触发未定义行为。

核心不变量
~~~~~~~~~~

假设循环已经处理了原整数最低的 ``k`` 位，则始终满足：

* ``reversed`` 等于这 ``k`` 位按出现顺序依次压入后形成的整数；
* ``x`` 等于原整数删除最低 ``k`` 位后的向零截断结果；
* ``reversed`` 始终位于 32 位有符号整数范围内；
* ``reversed`` 与 ``x`` 的符号处理完全由整数除法和余数完成，不需要单独保存符号。

正确性依据
~~~~~~~~~~

初始时尚未处理任何数字，``reversed = 0``，不变量成立。

每轮中，``digit = x % 10`` 取得当前最低位，向零截断的 ``x / 10`` 删除该最低位。
把 ``digit`` 压入 ``reversed`` 的末尾，相当于把已有结果左移一个十进制位，再补上新数字。
因此处理位数从 ``k`` 增加到 ``k + 1`` 后，前两个不变量继续成立。

压入前的四个边界条件精确覆盖了所有可能越过 ``INT_MIN`` 或 ``INT_MAX`` 的情况。
未触发边界条件时，下一状态必定位于 32 位范围内，因此第三个不变量也成立。

循环在 ``x == 0`` 时结束，说明原整数所有十进制位都已被弹出。此时 ``reversed`` 包含
全部数字的反向顺序。若中途发现下一步越界则返回 ``0``，与题目要求一致。

复杂度
~~~~~~

* 时间复杂度：``O(d)``，每轮删除一个十进制位；
* 空间复杂度：``O(1)``，只维护固定数量的整数变量。

核心语言实现
~~~~~~~~~~~~

C
^

.. code-block:: c

   #include <limits.h>

   int reverse(int x) {
       int reversed = 0;

       while (x != 0) {
           // C99 起整数除法向零截断，余数与被除数 x 同号。
           const int digit = x % 10;
           x /= 10;

           // 必须在乘十之前判断，避免有符号整数溢出的未定义行为。
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

C++
^^^

.. code-block:: cpp

   #include <climits>

   class Solution {
   public:
       int reverse(int x) {
           int reversed = 0;

           while (x != 0) {
               const int digit = x % 10;
               x /= 10;  // C++11 起有符号整数除法向零截断。

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
   };

Python
^^^^^^

.. code-block:: python

   class Solution:
       def reverse(self, x: int) -> int:
           int_min = -(2**31)
           int_max = 2**31 - 1
           reversed_number = 0

           while x != 0:
               # Python 的 // 对负数向下取整，不能直接用 x // 10。
               # abs 后整除再恢复符号，得到题目需要的向零截断商。
               quotient = abs(x) // 10
               quotient = quotient if x > 0 else -quotient
               digit = x - quotient * 10
               x = quotient

               if (
                   reversed_number > int_max // 10
                   or (
                       reversed_number == int_max // 10
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

Python 整数本身可以任意精度增长，所以这里显式执行 32 位边界检查，以保持题目要求和
其他固定宽度语言一致。负向阈值直接写成 ``-214748364``，避免 Python 的
``int_min // 10`` 得到向下取整的 ``-214748365``。

Java
^^^^

.. code-block:: java

   class Solution {
       public int reverse(int x) {
           int reversed = 0;

           while (x != 0) {
               int digit = x % 10;
               x /= 10;  // Java 整数除法向零截断。

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

               // Java int 溢出会回绕，因此更要保证检查先于计算。
               reversed = reversed * 10 + digit;
           }

           return reversed;
       }
   }

Rust
^^^^

.. code-block:: rust

   impl Solution {
       pub fn reverse(mut x: i32) -> i32 {
           let mut reversed: i32 = 0;

           while x != 0 {
               let digit = x % 10;
               x /= 10; // i32 除法向零截断，余数保留被除数符号。

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
^^

.. code-block:: go

   func reverse(x int) int {
       const intMin = -1 << 31
       const intMax = 1<<31 - 1
       reversed := 0

       for x != 0 {
           digit := x % 10
           x /= 10 // Go 的整数除法向零截断。

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

Go 的 ``int`` 宽度取决于目标平台。本实现显式使用 32 位上下界判断，因此无论平台
``int`` 是 32 位还是 64 位，返回语义都与题目一致。

TypeScript
^^^^^^^^^^

.. code-block:: typescript

   function reverse(x: number): number {
       const intMin = -(2 ** 31);
       const intMax = 2 ** 31 - 1;
       let reversed = 0;

       while (x !== 0) {
           // Math.trunc 明确执行向零截断，不能用 Math.floor 处理负数。
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

JavaScript 的 ``number`` 是双精度浮点数，不过所有 32 位整数及本算法检查前的中间值都能
被精确表示。不要使用位运算强制转成 32 位，因为位运算会先截断并掩盖溢出。

C#
^^

.. code-block:: csharp

   public class Solution {
       public int Reverse(int x) {
           int reversed = 0;

           while (x != 0) {
               int digit = x % 10;
               x /= 10; // C# 整数除法向零截断。

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
^^^^^

.. code-block:: julia

   function reverse_integer(x::Int)::Int
       int_min = Int(-2)^31
       int_max = Int(2)^31 - 1
       reversed = 0

       while x != 0
           # div(..., RoundToZero) 明确选择向零截断；rem 与该商保持恒等式。
           quotient = div(x, 10, RoundToZero)
           digit = rem(x, 10, RoundToZero)
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

Julia 的 ``Int`` 宽度随平台变化。本实现仍按 32 位边界判断，不把 64 位宿主整数当成题目
允许的结果范围。

R
^

.. code-block:: r

   reverse_integer <- function(x) {
     int_min <- -2147483648
     int_max <- 2147483647
     reversed <- 0

     while (x != 0) {
       # %/% 对负数向下取整，不符合题目需要；trunc 才是向零截断。
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

R 的默认 ``numeric`` 是双精度浮点数，32 位整数范围内的值可以精确表示。这里不用
``as.integer`` 保存 ``-2147483648``，因为 R 的普通整数类型还使用该值表示缺失值
``NA_integer_``。

关键边界与易错点
----------------

``x = 0``
~~~~~~~~~

循环不会执行，直接返回 ``0``。

末尾零
~~~~~~

``1200`` 依次弹出 ``0``、``0``、``2``、``1``，结果自然成为 ``21``。不需要单独删除
零，也不能把中间位置的零跳过。

最小 32 位整数
~~~~~~~~~~~~~~

``INT_MIN`` 的绝对值为 ``2147483648``，超出 32 位正数最大值。因此“先取绝对值，再统一
处理符号”的写法在 C、Java 等语言中会溢出。主解法始终保留负数，避免这个陷阱。

负数除法与余数
~~~~~~~~~~~~~~

不同语言的默认整除语义并不完全一致：

* C、C++、Java、Rust、Go、C# 的整数除法向零截断；
* Python 的 ``//`` 与 R 的 ``%/%`` 对负数向下取整；
* TypeScript 需要显式调用 ``Math.trunc``；
* Julia 应明确选择 ``RoundToZero``。

只要商改为向零截断，最低位都可以稳定表示为 ``digit = x - quotient * 10``。

先计算后判断
~~~~~~~~~~~~

下面的顺序是错误的：

.. code-block:: c

   reversed = reversed * 10 + digit;
   if (reversed > INT_MAX) {
       return 0;
   }

``reversed`` 本身已经是 ``int``，表达式越界后再比较来不及。正确顺序是先比较
``INT_MAX / 10``、``INT_MIN / 10`` 和最后一位阈值，再执行乘加。

硬编码边界数字
~~~~~~~~~~~~~~

``7`` 与 ``-8`` 不是任意常量。它们分别来自：

* ``INT_MAX = 2147483647`` 的末位；
* ``INT_MIN = -2147483648`` 的末位。

只有当 ``reversed`` 已经等于对应的十分之一阈值时，最后一位比较才需要生效。

新增与强化知识
--------------

新增
~~~~

* 用商和余数逐位拆分十进制整数；
* 在执行危险算术之前反推安全边界；
* 正负不对称的 32 位范围导致末位阈值分别为 ``7`` 与 ``-8``；
* Python、R、TypeScript、Julia 中显式实现向零截断除法。

强化
~~~~

* 算法不变量需要同时描述“已处理部分”和“未处理部分”；
* 固定宽度题目不能依赖宿主语言更宽的默认数值类型；
* 边界检查属于算法组成部分，不能留给运行时溢出后补救。

关联题目
--------

* `0009. Palindrome Number <0009-palindrome-number.rst>`_：同样使用整数逐位拆分，重点是
  判断前后数字关系。
* `0008. String to Integer (atoi) <0008-string-to-integer-atoi.rst>`_：同样需要在十进制
  累积时进行边界判断，输入来源从整数数字变为字符串字符。

最小自检
--------

#. 为什么不能对 ``INT_MIN`` 直接取绝对值后再处理？
#. 对 ``reversed = 214748364``，哪些 ``digit`` 可以安全压入？
#. 对 ``reversed = -214748364``，哪些 ``digit`` 可以安全压入？
#. Python 中为什么不能直接用 ``x // 10`` 删除负数的最低位？
#. 溢出判断为什么必须放在 ``reversed * 10 + digit`` 之前？

答案要点
~~~~~~~~

#. ``abs(INT_MIN) = 2147483648``，超出 32 位正数最大值；
#. ``digit <= 7``；
#. ``digit >= -8``；
#. ``//`` 对负数向下取整，不是向零截断，例如 ``-12 // 10 == -2``；
#. 乘加一旦先发生，固定宽度整数可能已经溢出，之后的比较无法恢复正确值。
