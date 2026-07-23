0008. String to Integer (atoi)
==============================

题目信息
--------

:题号: 0008
:难度: Medium
:主题: 字符串、阶段扫描、有限状态机、十进制累积、边界钳制
:原题: `LeetCode 0008 <https://leetcode.com/problems/string-to-integer-atoi/>`_
:教学重点: 输入前缀语法、阶段不可回退、首个无效字符停止、符号相关边界、压入前钳制

题目重述
--------

给定字符串 ``s``，按照固定规则把它转换为 32 位有符号整数：

#. 从字符串开头跳过连续的普通空格 ``' '``；
#. 读取至多一个紧随其后的 ``'+'`` 或 ``'-'``；
#. 读取最长的连续十进制数字前缀；
#. 遇到第一个不属于当前数字前缀的字符时立即停止；
#. 没有读取到数字时返回 ``0``；
#. 数学结果超出 ``[-2^31, 2^31 - 1]`` 时，钳制到对应边界。

解析只接受上述前缀结构。数字前的其他字符、第二个符号、符号后的空格以及数字后的任意非数字字符
都会结束解析；算法不会越过停止位置继续寻找后面的数字。

自建示例
--------

空格、负号、前导零和停止字符同时出现：

.. code-block:: text

   输入：s = "   -001204x7"
   有效解析前缀："   -001204"
   首个停止字符：'x'
   输出：-1204

符号后没有数字：

.. code-block:: text

   输入：s = "  + 17"
   读取 '+' 后立即遇到空格，数字阶段没有读到任何数字。
   输出：0

正负方向分别发生钳制：

.. code-block:: text

   输入："91283472332"   输出：2147483647
   输入："-91283472332"  输出：-2147483648

C++ 实现
--------

.. code-block:: cpp

   #include <climits>
   #include <cstddef>
   #include <string>

   class Solution {
   private:
       enum class State {
           Start,
           Signed,
           Digits,
           End
       };

       bool wouldOverflow(
           long long value,
           int digit,
           long long limit
       ) {
           return value > limit / 10 ||
               (value == limit / 10 && digit > limit % 10);
       }

       int clampForSign(int sign) {
           return sign == 1 ? INT_MAX : INT_MIN;
       }

       int stagedScan(const std::string& s) {
           std::size_t index = 0;
           int sign = 1;
           long long value = 0;

           while (index < s.size() && s[index] == ' ') {
               ++index;
           }

           if (
               index < s.size() &&
               (s[index] == '+' || s[index] == '-')
           ) {
               sign = s[index] == '-' ? -1 : 1;
               ++index;
           }

           const long long limit =
               sign == 1 ? INT_MAX : -(long long)INT_MIN;

           while (
               index < s.size() &&
               s[index] >= '0' &&
               s[index] <= '9'
           ) {
               const int digit = s[index] - '0';

               if (wouldOverflow(value, digit, limit)) {
                   return clampForSign(sign);
               }

               value = value * 10 + digit;
               ++index;
           }

           return sign == 1
               ? static_cast<int>(value)
               : static_cast<int>(-value);
       }

       int finiteStateMachine(const std::string& s) {
           State state = State::Start;
           int sign = 1;
           long long value = 0;

           for (char current : s) {
               if (state == State::End) {
                   break;
               }

               if (state == State::Start) {
                   if (current == ' ') {
                       continue;
                   }
                   if (current == '+' || current == '-') {
                       sign = current == '-' ? -1 : 1;
                       state = State::Signed;
                       continue;
                   }
                   if (current >= '0' && current <= '9') {
                       state = State::Digits;
                   } else {
                       state = State::End;
                       continue;
                   }
               } else if (state == State::Signed) {
                   if (current >= '0' && current <= '9') {
                       state = State::Digits;
                   } else {
                       state = State::End;
                       continue;
                   }
               } else if (
                   state == State::Digits &&
                   (current < '0' || current > '9')
               ) {
                   state = State::End;
                   continue;
               }

               const int digit = current - '0';
               const long long limit =
                   sign == 1 ? INT_MAX : -(long long)INT_MIN;

               if (wouldOverflow(value, digit, limit)) {
                   return clampForSign(sign);
               }

               value = value * 10 + digit;
           }

           return sign == 1
               ? static_cast<int>(value)
               : static_cast<int>(-value);
       }

   public:
       int myAtoi(std::string s) {
           return stagedScan(s);
       }
   };

题解
----

输入不是任意数字搜索，而是固定前缀语法
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

本题不是在字符串中寻找第一个整数，而是识别从位置 0 开始的一段受限前缀。允许参与结果的字符顺序
只能是：

.. code-block:: text

   若干普通空格 -> 至多一个符号 -> 若干连续数字

其中数字部分可以为空，此时结果为 0。任意阶段遇到不符合当前位置规则的字符后，解析立即结束。

例如 ``"words 42"`` 的开头既不是空格、符号，也不是数字，所以结果为 0；``"12abc34"`` 在
``a`` 处停止，结果为 12，后面的 ``34`` 已经位于有效前缀之外。

显式阶段扫描如何对应语法
~~~~~~~~~~~~~~~~~~~~~~~~

``stagedScan`` 直接把规则拆成三个连续阶段。

第一阶段只跳过字符串开头的普通空格。循环结束后，``index`` 指向第一个非空格字符，或者字符串末尾。
第二阶段只检查当前位置一次；若它是正负号，就记录 ``sign`` 并把 ``index`` 前移一位。
第三阶段从当前位置开始连续读取数字，第一次遇到非数字时退出。

这些阶段共享同一个只增不减的 ``index``，因此已离开的阶段不会重新进入：

* 空格阶段结束后，不再接受空格；
* 符号阶段结束后，不再接受第二个符号；
* 数字阶段结束后，不再寻找新的数字段。

``"  + 17"`` 在符号之后遇到空格。此时空格阶段已经结束，该空格不属于数字，因此数字循环一次都不
执行，``value`` 保持 0，最终返回 0。

有限状态机如何表达同一规则
~~~~~~~~~~~~~~~~~~~~~~~~~~

``finiteStateMachine`` 把当前位置允许的字符写成四种状态：

.. list-table::
   :header-rows: 1

   * - 状态
     - 已处理前缀
     - 当前允许的输入
     - 下一状态
   * - ``Start``
     - 仍位于前导空格或首字符位置
     - 空格、符号、数字
     - ``Start``、``Signed``、``Digits`` 或 ``End``
   * - ``Signed``
     - 已读取一个符号
     - 只能读取数字
     - ``Digits`` 或 ``End``
   * - ``Digits``
     - 已读取至少一个数字
     - 继续读取数字
     - ``Digits`` 或 ``End``
   * - ``End``
     - 有效解析前缀已经结束
     - 不再消费结果字符
     - 保持 ``End``

显式阶段扫描按代码结构隐含状态；有限状态机把状态和转移显式命名。两种写法接受完全相同的前缀语言，
并使用相同的数字累积和边界检查。阶段扫描分支更少，因此作为标准入口的主解法；状态机更适合语法继续
扩展时维护，例如增加小数点、指数或更多空白规则。

十进制累积状态从哪里得到
~~~~~~~~~~~~~~~~~~~~~~~~

数字阶段已经读取的数字前缀设为 ``d_0 d_1 ... d_k``，其非负绝对值保存在 ``value`` 中。
读取下一个数字 ``digit`` 时，已有数字整体左移一个十进制位，再把新数字放在个位：

.. math::

   value_{next} = 10 \cdot value + digit

``value`` 始终保存绝对值，``sign`` 单独保存最终符号。这样正数与负数可以共用同一套数字循环，
差别只体现在允许的绝对值上限：

.. code-block:: text

   sign = +1: limit = 2147483647
   sign = -1: limit = 2147483648

负数绝对值上限多 1，来自 32 位有符号范围的不对称：
``INT_MIN = -2147483648``，``INT_MAX = 2147483647``。

为什么边界检查必须发生在乘十之前
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

直接计算 ``value * 10 + digit`` 后再判断，会让固定宽度整数先发生溢出。主解法反向判断下一次更新是否
安全。

若下一状态需要满足：

.. math::

   10 \cdot value + digit \le limit

则分两种情况比较：

.. code-block:: text

   value < limit / 10
       下一次追加必然安全

   value == limit / 10
       digit 必须不大于 limit % 10

因此越界条件是：

.. code-block:: text

   value > limit / 10
   或
   value == limit / 10 且 digit > limit % 10

正数边界的末位是 7，负数绝对值边界的末位是 8。代码在危险乘加之前执行比较；一旦命中，立即按
``sign`` 返回 ``INT_MAX`` 或 ``INT_MIN``。

主解法状态演化
~~~~~~~~~~~~~~

使用自建示例 ``s = "   -001204x7"``：

.. list-table::
   :header-rows: 1

   * - 位置
     - 字符
     - 当前阶段
     - ``sign``
     - 更新前 ``value``
     - 动作
     - 更新后 ``value``
   * - 0 至 2
     - 空格
     - 前导空格
     - 1
     - 0
     - 依次跳过
     - 0
   * - 3
     - ``-``
     - 符号
     - 1
     - 0
     - 设置 ``sign = -1``
     - 0
   * - 4
     - ``0``
     - 数字
     - -1
     - 0
     - 追加数字 0
     - 0
   * - 5
     - ``0``
     - 数字
     - -1
     - 0
     - 追加数字 0
     - 0
   * - 6
     - ``1``
     - 数字
     - -1
     - 0
     - 追加数字 1
     - 1
   * - 7
     - ``2``
     - 数字
     - -1
     - 1
     - 追加数字 2
     - 12
   * - 8
     - ``0``
     - 数字
     - -1
     - 12
     - 追加数字 0
     - 120
   * - 9
     - ``4``
     - 数字
     - -1
     - 120
     - 追加数字 4
     - 1204
   * - 10
     - ``x``
     - 数字结束
     - -1
     - 1204
     - 停止解析
     - 1204

停止后返回 ``sign * value = -1204``。位置 11 的 ``7`` 不再参与判断，因为有效数字前缀已经在
位置 10 结束。

溢出输入如何提前钳制
~~~~~~~~~~~~~~~~~~~~

处理 ``"91283472332"`` 时，累计到 ``912834723`` 后，下一个数字是 3。此时：

.. code-block:: text

   value = 912834723
   limit / 10 = 214748364

``value`` 已经大于边界的十分之一，下一次乘十必然超过 ``INT_MAX``，所以直接返回
``2147483647``。负数字符串使用 ``limit = 2147483648``，同样在构造越界绝对值之前返回
``-2147483648``。

解法对比与主解法选择
~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 语法表达方式
   * - 显式阶段扫描
     - ``O(n)``
     - ``O(1)``
     - 用顺序代码对应空格、符号和数字三个阶段
   * - 有限状态机
     - ``O(n)``
     - ``O(1)``
     - 用状态和转移显式表示允许的前缀语言

两种方法都只扫描一次字符串。主解法选择显式阶段扫描，因为当前语法只有三个线性阶段，代码更直接；
有限状态机保留为语法扩展时的结构化方案。

为什么阶段只向前推进
~~~~~~~~~~~~~~~~~~~~

每个阶段只消费自己允许的字符，并把 ``index`` 留在下一阶段的第一个候选字符上。阶段转换由已经消费
的前缀决定：

* 一旦遇到第一个非空格字符，前导空格区域已经完整确定；
* 一旦检查过可选符号，后续字符只能属于数字部分；
* 一旦数字连续性被打断，最长数字前缀已经完整确定。

因此回到早期阶段会改变题目定义的字符顺序，继续向后搜索则会跳过停止字符，两者都不属于当前解析规则。

为什么停止位置确定最终解析前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

数字阶段接受的集合只有 ``'0'`` 到 ``'9'``。遇到首个非数字字符时，当前位置之前已经形成从数字起点
开始的最长连续数字串；任何更后的数字都与它不连续。

所以 ``"12abc34"`` 的结果由 ``12`` 唯一确定，``a`` 之后的字符不再影响答案。若数字阶段尚未读取
任何字符，例如 ``"+-12"`` 或 ``"  + 17"``，``value`` 保持 0，返回值自然为 0。

为什么边界比较覆盖全部钳制情况
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``value`` 在每轮开始时满足 ``0 <= value <= limit``。比较 ``value`` 与 ``limit / 10`` 后：

* 大于十分之一边界时，任何数字都会越界；
* 小于十分之一边界时，即使追加 9 也仍在边界内；
* 等于十分之一边界时，只有末位数字决定是否越界。

这三个互斥情况覆盖全部非负 ``value``。正负方向通过不同 ``limit`` 复用同一证明，因此算法在首次
必然越界的位置立即返回正确边界；未触发时，更新后的 ``value`` 仍然满足范围约束。

复杂度来源
~~~~~~~~~~

显式阶段扫描中的空格循环、符号检查和数字循环共享同一个单调递增下标，每个字符最多被检查常数次，
时间复杂度为 ``O(n)``。有限状态机同样逐字符处理一次。两种方法只保存状态、下标、符号、累计值和
边界，工作空间均为 ``O(1)``。

九语言实现
----------

九语言统一实现显式阶段扫描。所有版本都只把普通空格 ``' '`` 视为可跳过的前导空格，使用 ASCII
数字范围判断，并在执行 ``value * 10 + digit`` 之前按符号相关的 ``limit`` 完成钳制检查。

C
~

.. code-block:: c

   #include <limits.h>
   #include <stddef.h>

   int myAtoi(char* s) {
       size_t index = 0;
       int sign = 1;
       long long value = 0;

       while (s[index] == ' ') {
           ++index;
       }

       if (s[index] == '+' || s[index] == '-') {
           sign = s[index] == '-' ? -1 : 1;
           ++index;
       }

       const long long limit =
           sign == 1 ? INT_MAX : -(long long)INT_MIN;

       while (s[index] >= '0' && s[index] <= '9') {
           const int digit = s[index] - '0';

           if (
               value > limit / 10 ||
               (value == limit / 10 && digit > limit % 10)
           ) {
               return sign == 1 ? INT_MAX : INT_MIN;
           }

           value = value * 10 + digit;
           ++index;
       }

       return sign == 1 ? (int)value : (int)-value;
   }

Python
~~~~~~

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

               if (
                   value > limit // 10
                   or (
                       value == limit // 10
                       and digit > limit % 10
                   )
               ):
                   return 2**31 - 1 if sign == 1 else -(2**31)

               value = value * 10 + digit
               index += 1

           return sign * value

Java
~~~~

.. code-block:: java

   class Solution {
       public int myAtoi(String s) {
           int index = 0;
           int sign = 1;
           long value = 0;

           while (index < s.length() && s.charAt(index) == ' ') {
               index++;
           }

           if (
               index < s.length() &&
               (s.charAt(index) == '+' || s.charAt(index) == '-')
           ) {
               sign = s.charAt(index) == '-' ? -1 : 1;
               index++;
           }

           long limit = sign == 1
               ? Integer.MAX_VALUE
               : -(long)Integer.MIN_VALUE;

           while (
               index < s.length() &&
               s.charAt(index) >= '0' &&
               s.charAt(index) <= '9'
           ) {
               int digit = s.charAt(index) - '0';

               if (
                   value > limit / 10 ||
                   (value == limit / 10 && digit > limit % 10)
               ) {
                   return sign == 1
                       ? Integer.MAX_VALUE
                       : Integer.MIN_VALUE;
               }

               value = value * 10 + digit;
               index++;
           }

           return sign == 1 ? (int)value : (int)-value;
       }
   }

Rust
~~~~

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

           if index < bytes.len()
               && (bytes[index] == b'+' || bytes[index] == b'-')
           {
               sign = if bytes[index] == b'-' { -1 } else { 1 };
               index += 1;
           }

           let limit = if sign == 1 {
               i32::MAX as i64
           } else {
               -(i32::MIN as i64)
           };

           while index < bytes.len() && bytes[index].is_ascii_digit() {
               let digit = (bytes[index] - b'0') as i64;

               if value > limit / 10
                   || (value == limit / 10 && digit > limit % 10)
               {
                   return if sign == 1 { i32::MAX } else { i32::MIN };
               }

               value = value * 10 + digit;
               index += 1;
           }

           (sign * value) as i32
       }
   }

Go
~~

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

           if value > limit/10 ||
               (value == limit/10 && digit > limit%10) {
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
~~~~~~~~~~

.. code-block:: typescript

   function myAtoi(s: string): number {
       let index = 0;
       let sign = 1;
       let value = 0;

       while (index < s.length && s[index] === " ") {
           index += 1;
       }

       if (
           index < s.length &&
           (s[index] === "+" || s[index] === "-")
       ) {
           sign = s[index] === "-" ? -1 : 1;
           index += 1;
       }

       const intMax = 2 ** 31 - 1;
       const intMin = -(2 ** 31);
       const limit = sign === 1 ? intMax : 2 ** 31;

       while (
           index < s.length &&
           s[index] >= "0" &&
           s[index] <= "9"
       ) {
           const digit =
               s.charCodeAt(index) - "0".charCodeAt(0);

           if (
               value > Math.floor(limit / 10) ||
               (
                   value === Math.floor(limit / 10) &&
                   digit > limit % 10
               )
           ) {
               return sign === 1 ? intMax : intMin;
           }

           value = value * 10 + digit;
           index += 1;
       }

       return sign * value;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int MyAtoi(string s) {
           int index = 0;
           long sign = 1;
           long value = 0;

           while (index < s.Length && s[index] == ' ') {
               index++;
           }

           if (
               index < s.Length &&
               (s[index] == '+' || s[index] == '-')
           ) {
               sign = s[index] == '-' ? -1 : 1;
               index++;
           }

           long limit = sign == 1
               ? int.MaxValue
               : -(long)int.MinValue;

           while (
               index < s.Length &&
               s[index] >= '0' &&
               s[index] <= '9'
           ) {
               long digit = s[index] - '0';

               if (
                   value > limit / 10 ||
                   (value == limit / 10 && digit > limit % 10)
               ) {
                   return sign == 1
                       ? int.MaxValue
                       : int.MinValue;
               }

               value = value * 10 + digit;
               index++;
           }

           return sign == 1 ? (int)value : (int)-value;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function my_atoi(s::String)::Int
       bytes = codeunits(s)
       index = 1
       sign = Int64(1)
       value = Int64(0)

       while index <= length(bytes) && bytes[index] == UInt8(' ')
           index += 1
       end

       if index <= length(bytes) &&
          (bytes[index] == UInt8('+') || bytes[index] == UInt8('-'))
           sign = bytes[index] == UInt8('-') ? Int64(-1) : Int64(1)
           index += 1
       end

       limit = sign == 1 ? Int64(2147483647) : Int64(2147483648)

       while (
           index <= length(bytes) &&
           UInt8('0') <= bytes[index] <= UInt8('9')
       )
           digit = Int64(bytes[index] - UInt8('0'))

           if value > div(limit, 10) ||
              (value == div(limit, 10) && digit > rem(limit, 10))
               return sign == 1 ? 2147483647 : -2147483648
           end

           value = value * 10 + digit
           index += 1
       end

       return Int(sign * value)
   end

R
~

.. code-block:: r

   myAtoi <- function(s) {
       chars <- strsplit(s, "", fixed = TRUE)[[1]]
       index <- 1L
       sign <- 1
       value <- 0
       length_s <- length(chars)

       while (index <= length_s && chars[[index]] == " ") {
           index <- index + 1L
       }

       if (
           index <= length_s &&
           chars[[index]] %in% c("+", "-")
       ) {
           sign <- if (chars[[index]] == "-") -1 else 1
           index <- index + 1L
       }

       int_max <- 2^31 - 1
       int_min <- -(2^31)
       limit <- if (sign == 1) int_max else 2^31

       while (index <= length_s) {
           code <- utf8ToInt(chars[[index]])
           if (code < utf8ToInt("0") || code > utf8ToInt("9")) {
               break
           }

           digit <- code - utf8ToInt("0")

           if (
               value > floor(limit / 10) ||
               (
                   value == floor(limit / 10) &&
                   digit > limit %% 10
               )
           ) {
               return(if (sign == 1) int_max else int_min)
           }

           value <- value * 10 + digit
           index <- index + 1L
       }

       sign * value
   }
