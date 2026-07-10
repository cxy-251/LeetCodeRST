0008. String to Integer (atoi)
==============================

题目信息
--------

:题号: 0008
:难度: Medium
:主题: 字符串、有限状态扫描、整数构造、溢出钳制
:原题: `LeetCode 0008 <https://leetcode.com/problems/string-to-integer-atoi/>`_
:访问状态: Available
:教学重点: 单向扫描、阶段边界、十进制累积、压入前判溢出、32 位钳制

题目重述
--------

给定一个字符串 ``s``，按照约定把它解释为 32 位有符号整数。

解析从字符串开头开始：先跳过连续空格，再读取至多一个正负号，随后读取连续十进制数字。
遇到第一个不属于当前数字部分的字符时立即停止。若没有读到任何数字，结果为 ``0``。
若数学结果小于 ``-2^31``，返回 ``-2^31``；若大于 ``2^31 - 1``，返回
``2^31 - 1``。

这里实现的是一个受限解析器。它不会在字符串中搜索数字，也不会接受小数点、指数、多个符号
或符号后的空格。

自建示例
--------

普通正数
~~~~~~~~

.. code-block:: text

   输入："   +2048rest"
   跳过空格后读取 '+'，再读取 2、0、4、8。
   遇到 'r' 时停止。
   输出：2048

符号后没有数字
~~~~~~~~~~~~~~

.. code-block:: text

   输入："  - 17"
   '-' 之后紧接空格，不属于数字。
   本次没有读到任何数字。
   输出：0

前导零与停止字符
~~~~~~~~~~~~~~~~

.. code-block:: text

   输入："00091.5"
   数字部分是 "00091"。
   遇到 '.' 时停止，小数部分不参与解析。
   输出：91

正向溢出
~~~~~~~~

.. code-block:: text

   输入："922337203685"
   在结果超过 2147483647 之前即可判断必然溢出。
   输出：2147483647

问题抽象
--------

一次有效解析由三个连续阶段组成：

#. 跳过前导空格；
#. 读取可选符号；
#. 读取最长连续数字前缀。

离开数字阶段后，后面的字符全部忽略。整个过程只需要一个从左到右移动且从不回退的下标。

读到数字 ``digit`` 时，十进制绝对值按下式更新：

.. math::

   value_{next} = value \times 10 + digit

为了避免先溢出再检查，更新之前比较：

.. math::

   value > \left\lfloor\frac{limit - digit}{10}\right\rfloor

其中正数的 ``limit`` 是 ``2147483647``，负数绝对值的 ``limit`` 是 ``2147483648``。
负数多出的一个单位来自 32 位补码范围不对称：最小值是 ``-2147483648``，最大值是
``2147483647``。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 取舍
   * - 单向扫描并在压入前判溢出
     - ``O(n)``
     - ``O(1)``
     - 主解法；精确控制停止位置与整数边界
   * - 正则表达式提取后转换
     - ``O(n)``
     - ``O(n)``
     - 依赖正则和转换库，隐藏了解析状态与溢出机制
   * - 直接调用语言内置整数解析
     - 取决于实现
     - 取决于实现
     - 各语言接受语法、报错和溢出行为不同，不能保证满足题目规则

主解法：单向扫描与压入前钳制
----------------------------

状态含义
~~~~~~~~

算法维护：

* ``index``：下一个尚未检查的字符位置；
* ``sign``：结果符号，取 ``1`` 或 ``-1``；
* ``value``：已经读取的数字前缀所表示的非负绝对值；
* ``limit``：当前符号允许的最大绝对值。

扫描顺序不能互换。空格只允许出现在最前面，符号只允许出现一次且必须位于数字之前。

停止条件
~~~~~~~~

进入数字阶段后，只要当前字符不在 ``'0'`` 到 ``'9'`` 之间就停止。停止后不再尝试恢复解析。
因此：

* ``"12abc34"`` 解析为 ``12``；
* ``"+-12"`` 解析为 ``0``；
* ``"  7 8"`` 解析为 ``7``；
* ``"words 42"`` 解析为 ``0``。

溢出判断
~~~~~~~~

设当前绝对值为 ``value``，新数字为 ``digit``，边界为 ``limit``。若

.. math::

   value > (limit - digit) / 10

则 ``value * 10 + digit`` 必然超过边界。代码使用整数除法完成比较，并且比较发生在乘法之前。

负数使用 ``2147483648`` 作为绝对值上限。最终若 ``sign == -1``，返回 ``-value``。
这样可以正确表示最小值，而不需要在固定宽度有符号整数中先构造无法表示的正数再取负。
在 C、C++、Java 等实现中，累积变量采用足够宽的 64 位整数，边界判断仍然在每次压入前执行。

核心不变量
~~~~~~~~~~

进入每轮数字处理前：

* ``s[0:index]`` 中允许参与解析的空格、符号和数字已经全部处理；
* ``value`` 等于已读取连续数字前缀的十进制绝对值；
* ``0 <= value <= limit``；
* ``index`` 从不回退，因此每个字符最多检查一次。

正确性依据
~~~~~~~~~~

前导空格循环恰好跳过字符串开头的连续空格。随后只检查当前位置的一次正负号，因此符号阶段
符合规则。

数字循环每次只接受一个十进制数字，并用 ``value * 10 + digit`` 把它追加到已有数字末尾。
由十进制位值定义，处理 ``k`` 个数字后，``value`` 恰好等于这 ``k`` 个字符组成的非负整数。

遇到首个非数字字符时循环结束。由于题目只允许最长连续数字前缀，停止位置准确，后续字符不应
参与结果。

压入前比较覆盖了所有超过 ``limit`` 的情况。若触发比较，按符号返回对应边界；若未触发，
新值仍在范围内，不变量继续成立。循环结束后施加符号，所得结果正是规则要求的 32 位整数。

复杂度
~~~~~~

* 时间复杂度：``O(n)``，下标只向右移动，每个字符最多检查一次；
* 空间复杂度：``O(1)``，只维护固定数量的标量状态。

核心语言实现
~~~~~~~~~~~~

C
^

.. code-block:: c

   #include <limits.h>
   #include <stddef.h>

   int myAtoi(char *s) {
       size_t index = 0;
       int sign = 1;
       long long value = 0;

       // 题目只要求跳过普通空格 ' '，不要擅自扩大为空白字符集合。
       while (s[index] == ' ') {
           ++index;
       }

       if (s[index] == '+' || s[index] == '-') {
           sign = s[index] == '-' ? -1 : 1;
           ++index;
       }

       const long long limit = sign == 1 ? INT_MAX : -(long long)INT_MIN;

       while (s[index] >= '0' && s[index] <= '9') {
           const int digit = s[index] - '0';

           // 在 value * 10 之前比较，避免依赖溢出后的错误结果。
           if (value > (limit - digit) / 10) {
               return sign == 1 ? INT_MAX : INT_MIN;
           }

           value = value * 10 + digit;
           ++index;
       }

       return sign == 1 ? (int)value : (int)-value;
   }

C++
^^^

.. code-block:: cpp

   #include <climits>
   #include <string>

   class Solution {
   public:
       int myAtoi(std::string s) {
           std::size_t index = 0;
           int sign = 1;
           long long value = 0;

           while (index < s.size() && s[index] == ' ') {
               ++index;
           }

           if (index < s.size() && (s[index] == '+' || s[index] == '-')) {
               sign = s[index] == '-' ? -1 : 1;
               ++index;
           }

           const long long limit = sign == 1 ? INT_MAX : -(long long)INT_MIN;

           while (index < s.size() && s[index] >= '0' && s[index] <= '9') {
               const int digit = s[index] - '0';
               if (value > (limit - digit) / 10) {
                   return sign == 1 ? INT_MAX : INT_MIN;
               }
               value = value * 10 + digit;
               ++index;
           }

           return sign == 1 ? static_cast<int>(value) : static_cast<int>(-value);
       }
   };

Python
^^^^^^

.. code-block:: python

   class Solution:
       def myAtoi(self, s: str) -> int:
           index = 0
           sign = 1
           value = 0
           length = len(s)

           while index < length and s[index] == " ":
               index += 1

           if index < length and s[index] in ("+", "-"):
               sign = -1 if s[index] == "-" else 1
               index += 1

           limit = 2**31 - 1 if sign == 1 else 2**31

           while index < length and "0" <= s[index] <= "9":
               digit = ord(s[index]) - ord("0")
               # Python 整数不会自然溢出，仍显式执行题目要求的 32 位钳制。
               if value > (limit - digit) // 10:
                   return 2**31 - 1 if sign == 1 else -(2**31)
               value = value * 10 + digit
               index += 1

           return sign * value

Java
^^^^

.. code-block:: java

   class Solution {
       public int myAtoi(String s) {
           int index = 0;
           int sign = 1;
           long value = 0;

           while (index < s.length() && s.charAt(index) == ' ') {
               index++;
           }

           if (index < s.length()
                   && (s.charAt(index) == '+' || s.charAt(index) == '-')) {
               sign = s.charAt(index) == '-' ? -1 : 1;
               index++;
           }

           long limit = sign == 1 ? Integer.MAX_VALUE : -(long) Integer.MIN_VALUE;

           while (index < s.length()) {
               char current = s.charAt(index);
               if (current < '0' || current > '9') {
                   break;
               }
               int digit = current - '0';
               if (value > (limit - digit) / 10) {
                   return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
               }
               value = value * 10 + digit;
               index++;
           }

           return sign == 1 ? (int) value : (int) -value;
       }
   }

Rust
^^^^

.. code-block:: rust

   impl Solution {
       pub fn my_atoi(s: String) -> i32 {
           let bytes = s.as_bytes();
           let mut index = 0usize;
           let mut sign = 1i64;
           let mut value = 0i64;

           while index < bytes.len() && bytes[index] == b' ' {
               index += 1;
           }

           if index < bytes.len() && (bytes[index] == b'+' || bytes[index] == b'-') {
               sign = if bytes[index] == b'-' { -1 } else { 1 };
               index += 1;
           }

           let limit = if sign == 1 { i32::MAX as i64 } else { 1i64 << 31 };

           while index < bytes.len() && bytes[index].is_ascii_digit() {
               let digit = (bytes[index] - b'0') as i64;
               if value > (limit - digit) / 10 {
                   return if sign == 1 { i32::MAX } else { i32::MIN };
               }
               value = value * 10 + digit;
               index += 1;
           }

           (sign * value) as i32
       }
   }

Go
^^

.. code-block:: go

   func myAtoi(s string) int {
       index := 0
       sign := int64(1)
       value := int64(0)

       for index < len(s) && s[index] == ' ' {
           index++
       }

       if index < len(s) && (s[index] == '+' || s[index] == '-') {
           if s[index] == '-' {
               sign = -1
           }
           index++
       }

       var limit int64 = 1<<31 - 1
       if sign == -1 {
           limit = 1 << 31
       }

       for index < len(s) && s[index] >= '0' && s[index] <= '9' {
           digit := int64(s[index] - '0')
           if value > (limit-digit)/10 {
               if sign == 1 {
                   return 1<<31 - 1
               }
               return -1 << 31
           }
           value = value*10 + digit
           index++
       }

       return int(sign * value)
   }

TypeScript
^^^^^^^^^^

.. code-block:: typescript

   function myAtoi(s: string): number {
       let index = 0;
       let sign = 1;
       let value = 0;

       while (index < s.length && s[index] === " ") {
           index++;
       }

       if (index < s.length && (s[index] === "+" || s[index] === "-")) {
           sign = s[index] === "-" ? -1 : 1;
           index++;
       }

       const intMax = 2 ** 31 - 1;
       const intMin = -(2 ** 31);
       const limit = sign === 1 ? intMax : 2 ** 31;

       while (index < s.length && s[index] >= "0" && s[index] <= "9") {
           const digit = s.charCodeAt(index) - "0".charCodeAt(0);
           // Number 能精确表示这里的边界；仍要在乘十前执行 32 位判断。
           if (value > Math.floor((limit - digit) / 10)) {
               return sign === 1 ? intMax : intMin;
           }
           value = value * 10 + digit;
           index++;
       }

       return sign * value;
   }

C#
^^

.. code-block:: csharp

   public class Solution {
       public int MyAtoi(string s) {
           int index = 0;
           long sign = 1;
           long value = 0;

           while (index < s.Length && s[index] == ' ') {
               index++;
           }

           if (index < s.Length && (s[index] == '+' || s[index] == '-')) {
               sign = s[index] == '-' ? -1 : 1;
               index++;
           }

           long limit = sign == 1 ? int.MaxValue : -(long)int.MinValue;

           while (index < s.Length && s[index] >= '0' && s[index] <= '9') {
               long digit = s[index] - '0';
               if (value > (limit - digit) / 10) {
                   return sign == 1 ? int.MaxValue : int.MinValue;
               }
               value = value * 10 + digit;
               index++;
           }

           return (int)(sign * value);
       }
   }

Julia
^^^^^

.. code-block:: julia

   function my_atoi(s::String)::Int
       bytes = codeunits(s)
       index = 1
       sign = Int64(1)
       value = Int64(0)

       # 本题语法只涉及 ASCII，按 UTF-8 字节扫描可直接识别空格、符号和数字。
       while index <= length(bytes) && bytes[index] == UInt8(' ')
           index += 1
       end

       if index <= length(bytes) &&
          (bytes[index] == UInt8('+') || bytes[index] == UInt8('-'))
           sign = bytes[index] == UInt8('-') ? Int64(-1) : Int64(1)
           index += 1
       end

       limit = sign == 1 ? Int64(2^31 - 1) : Int64(2^31)

       while index <= length(bytes) && UInt8('0') <= bytes[index] <= UInt8('9')
           digit = Int64(bytes[index] - UInt8('0'))
           if value > div(limit - digit, 10)
               return sign == 1 ? 2^31 - 1 : -(2^31)
           end
           value = value * 10 + digit
           index += 1
       end

       return Int(sign * value)
   end

R
^

.. code-block:: r

   myAtoi <- function(s) {
     chars <- strsplit(s, "", fixed = TRUE)[[1]]
     index <- 1L
     sign <- 1
     value <- 0
     length_s <- length(chars)

     while (index <= length_s && chars[index] == " ") {
       index <- index + 1L
     }

     if (index <= length_s && chars[index] %in% c("+", "-")) {
       sign <- if (chars[index] == "-") -1 else 1
       index <- index + 1L
     }

     int_max <- 2^31 - 1
     int_min <- -(2^31)
     limit <- if (sign == 1) int_max else 2^31

     while (index <= length_s && chars[index] >= "0" && chars[index] <= "9") {
       digit <- utf8ToInt(chars[index]) - utf8ToInt("0")
       # R 的 numeric 是双精度数；本题边界可精确表示，仍显式钳制到 32 位。
       if (value > floor((limit - digit) / 10)) {
         return(if (sign == 1) int_max else int_min)
       }
       value <- value * 10 + digit
       index <- index + 1L
     }

     sign * value
   }

关键边界
--------

* 空字符串或全空格字符串返回 ``0``；
* 单独的 ``+`` 或 ``-`` 返回 ``0``；
* 符号后立刻出现非数字字符返回 ``0``；
* 前导零参与扫描，却不改变数值；
* 数字后出现空格、字母、小数点或第二个符号时立即停止；
* ``2147483647`` 原样返回；更大的正数钳制到 ``2147483647``；
* ``-2147483648`` 原样返回；更小的负数钳制到 ``-2147483648``；
* 非 ASCII 字符不属于允许的数字 ``0`` 到 ``9``，会终止数字扫描。

易错点
------

#. 使用 ``trim`` 后再解析，会掩盖“数字后的空格应立即停止”的扫描语义；
#. 使用 ``parseInt``、``stoi`` 等库函数时，各语言对空白、前缀和异常的规则并不完全一致；
#. 看到第二个符号时不能重新开始解析；
#. 符号后不能再次跳过空格；
#. 先执行 ``value * 10 + digit`` 再检查，在固定宽度语言中可能已经溢出；
#. 负数边界的绝对值是 ``2147483648``，不能错误地与正数共用 ``2147483647``；
#. TypeScript 和 R 的数值类型虽能精确表示本题范围，接口仍要求显式模拟 32 位钳制。

新增与强化知识
--------------

本题新增：

* 把字符串解析拆成空格、符号、数字三个有序阶段；
* 用单调下标实现不回退的确定性扫描；
* 使用符号相关的绝对值上限统一正负溢出判断；
* 区分“停止解析”和“解析失败”：读过数字后遇到非法字符是正常停止。

本题强化 0007 的“压入前判溢出”。0007 把整数末位压入结果；0008 把字符数字压入十进制
累积值。二者都应在乘十之前证明下一状态安全。

关联题目
--------

* `0007. Reverse Integer <0007-reverse-integer.rst>`_：同样使用十进制逐位累积和压入前溢出判断。
* 0065. Valid Number：更完整的数字语法识别，需要更明确的状态机。

最小自检
--------

#. 为什么 ``"  - 17"`` 返回 ``0``，而不是 ``-17``？
#. 为什么负数的绝对值上限是 ``2147483648``？
#. 判断 ``value > (limit - digit) / 10`` 为什么必须放在乘十之前？
#. ``"12abc34"`` 的结果是什么，停止位置在哪里？
#. 整个算法为什么是 ``O(n)``，而不是 ``O(n^2)``？

答案要点
~~~~~~~~

#. 前导空格阶段已经结束，符号后的空格不是数字，且没有读到任何数字；
#. 32 位有符号范围不对称，最小值比最大值的绝对值大一；
#. 固定宽度整数可能在乘法发生时已经溢出，事后判断无法恢复正确值；
#. 结果是 ``12``，在第一个 ``a`` 处停止，后面的字符不再检查为数字；
#. 下标只向右移动，每个字符最多被检查常数次。