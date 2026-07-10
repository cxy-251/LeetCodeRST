0008. String to Integer (atoi)
==============================

题目信息
--------

* 原题：`LeetCode 8 <https://leetcode.com/problems/string-to-integer-atoi/>`_
* 难度：Medium

题目重述
--------

读取字符串开头可表示为 32 位有符号整数的部分：先跳过前导空格，再读取可选正负号，随后连续读取十进制数字；遇到首个非数字字符立即停止。没有读到数字时返回 0，超出 32 位范围时截断到对应边界。

问题抽象
--------

解析过程只有四个阶段：跳过空格、读取符号、累积数字、停止。数字阶段维护非负绝对值 ``value``，在追加新数字前判断 ``value * 10 + digit`` 是否越界。

主解法：单次扫描与边界预检查
----------------------------

循环不变量：进入每次数字循环时，``value`` 等于已经读取的连续数字前缀所表示的绝对值；``index`` 指向下一个尚未处理字符。

正数最大绝对值为 ``2147483647``，负数允许到 ``2147483648``。因此根据符号选择 ``limit``，若 ``value > (limit - digit) / 10``，追加当前数字必然越界。

正确性依据
~~~~~~~~~~

空格和符号阶段严格按规则各执行一次。数字循环只消费连续数字，所以不会跨过第一个非法字符。十进制递推保持已读前缀的数值含义；预检查在真正计算前识别所有越界情况。最终乘以符号即可得到目标值。

复杂度
~~~~~~

时间复杂度为 ``O(n)``，额外空间复杂度为 ``O(1)``。

C
~

.. code-block:: c

   int myAtoi(char *s) {
       int i = 0, sign = 1;
       long limit, value = 0;
       while (s[i] == ' ') ++i;
       if (s[i] == '+' || s[i] == '-') sign = s[i++] == '-' ? -1 : 1;
       limit = sign == 1 ? 2147483647L : 2147483648L;
       while (s[i] >= '0' && s[i] <= '9') {
           int digit = s[i++] - '0';
           if (value > (limit - digit) / 10) return sign == 1 ? 2147483647 : (-2147483647 - 1);
           value = value * 10 + digit;
       }
       return (int)(sign * value);
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int myAtoi(string s) {
           int i = 0, sign = 1;
           while (i < s.size() && s[i] == ' ') ++i;
           if (i < s.size() && (s[i] == '+' || s[i] == '-')) sign = s[i++] == '-' ? -1 : 1;
           long long limit = sign == 1 ? INT_MAX : -(long long)INT_MIN, value = 0;
           while (i < s.size() && isdigit(static_cast<unsigned char>(s[i]))) {
               int digit = s[i++] - '0';
               if (value > (limit - digit) / 10) return sign == 1 ? INT_MAX : INT_MIN;
               value = value * 10 + digit;
           }
           return static_cast<int>(sign * value);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def myAtoi(self, s: str) -> int:
           i, n, sign, value = 0, len(s), 1, 0
           while i < n and s[i] == " ": i += 1
           if i < n and s[i] in "+-":
               sign = -1 if s[i] == "-" else 1
               i += 1
           limit = 2**31 - 1 if sign == 1 else 2**31
           while i < n and "0" <= s[i] <= "9":
               digit = ord(s[i]) - ord("0")
               if value > (limit - digit) // 10:
                   return 2**31 - 1 if sign == 1 else -(2**31)
               value = value * 10 + digit
               i += 1
           return sign * value

Java
~~~~

.. code-block:: java

   class Solution {
       public int myAtoi(String s) {
           int i = 0, sign = 1; long value = 0;
           while (i < s.length() && s.charAt(i) == ' ') i++;
           if (i < s.length() && (s.charAt(i) == '+' || s.charAt(i) == '-')) sign = s.charAt(i++) == '-' ? -1 : 1;
           long limit = sign == 1 ? Integer.MAX_VALUE : -(long)Integer.MIN_VALUE;
           while (i < s.length() && Character.isDigit(s.charAt(i))) {
               int digit = s.charAt(i++) - '0';
               if (value > (limit - digit) / 10) return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
               value = value * 10 + digit;
           }
           return (int)(sign * value);
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn my_atoi(s: String) -> i32 {
           let bytes = s.as_bytes(); let mut i = 0; let mut sign: i64 = 1; let mut value: i64 = 0;
           while i < bytes.len() && bytes[i] == b' ' { i += 1; }
           if i < bytes.len() && (bytes[i] == b'+' || bytes[i] == b'-') { if bytes[i] == b'-' { sign = -1; } i += 1; }
           let limit = if sign == 1 { i32::MAX as i64 } else { -(i32::MIN as i64) };
           while i < bytes.len() && bytes[i].is_ascii_digit() {
               let digit = (bytes[i] - b'0') as i64;
               if value > (limit - digit) / 10 { return if sign == 1 { i32::MAX } else { i32::MIN }; }
               value = value * 10 + digit; i += 1;
           }
           (sign * value) as i32
       }
   }

Go
~~

.. code-block:: go

   func myAtoi(s string) int {
       i, sign, value := 0, 1, 0
       for i < len(s) && s[i] == ' ' { i++ }
       if i < len(s) && (s[i] == '+' || s[i] == '-') { if s[i] == '-' { sign = -1 }; i++ }
       limit := 1<<31 - 1; if sign == -1 { limit = 1 << 31 }
       for i < len(s) && s[i] >= '0' && s[i] <= '9' {
           digit := int(s[i] - '0'); if value > (limit-digit)/10 { if sign == 1 { return 1<<31 - 1 }; return -1 << 31 }
           value = value*10 + digit; i++
       }
       return sign * value
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function myAtoi(s: string): number {
       let i = 0, sign = 1, value = 0;
       while (i < s.length && s[i] === " ") i++;
       if (i < s.length && (s[i] === "+" || s[i] === "-")) sign = s[i++] === "-" ? -1 : 1;
       const limit = sign === 1 ? 2 ** 31 - 1 : 2 ** 31;
       while (i < s.length && s[i] >= "0" && s[i] <= "9") {
           const digit = s.charCodeAt(i++) - 48;
           if (value > Math.floor((limit - digit) / 10)) return sign === 1 ? 2 ** 31 - 1 : -(2 ** 31);
           value = value * 10 + digit;
       }
       return sign * value;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int MyAtoi(string s) {
           int i = 0, sign = 1; long value = 0;
           while (i < s.Length && s[i] == ' ') i++;
           if (i < s.Length && (s[i] == '+' || s[i] == '-')) sign = s[i++] == '-' ? -1 : 1;
           long limit = sign == 1 ? int.MaxValue : -(long)int.MinValue;
           while (i < s.Length && char.IsDigit(s[i])) {
               int digit = s[i++] - '0'; if (value > (limit - digit) / 10) return sign == 1 ? int.MaxValue : int.MinValue;
               value = value * 10 + digit;
           }
           return (int)(sign * value);
       }
   }

Julia
~~~~~

.. code-block:: julia

   function my_atoi(s::String)::Int
       chars = collect(s); i = 1; sign = 1; value = 0
       while i <= length(chars) && chars[i] == ' '; i += 1; end
       if i <= length(chars) && chars[i] in ['+', '-']; sign = chars[i] == '-' ? -1 : 1; i += 1; end
       limit = sign == 1 ? 2^31 - 1 : 2^31
       while i <= length(chars) && isdigit(chars[i])
           digit = Int(chars[i] - '0'); value > (limit - digit) ÷ 10 && return sign == 1 ? 2^31 - 1 : -2^31
           value = value * 10 + digit; i += 1
       end
       return sign * value
   end

R
~

.. code-block:: r

   my_atoi <- function(s) {
     chars <- strsplit(s, "", fixed = TRUE)[[1]]; i <- 1; sign <- 1; value <- 0
     while (i <= length(chars) && chars[i] == " ") i <- i + 1
     if (i <= length(chars) && chars[i] %in% c("+", "-")) { if (chars[i] == "-") sign <- -1; i <- i + 1 }
     limit <- if (sign == 1) 2^31 - 1 else 2^31
     while (i <= length(chars) && grepl("^[0-9]$", chars[i])) {
       digit <- utf8ToInt(chars[i]) - utf8ToInt("0")
       if (value > floor((limit - digit) / 10)) return(if (sign == 1) 2^31 - 1 else -2^31)
       value <- value * 10 + digit; i <- i + 1
     }
     sign * value
   }

易错点
------

* 只跳过最前面的 ASCII 空格，数字读取开始后不能再忽略空白。
* 符号后必须紧接数字；连续符号不会构成合法整数。
* 负数边界的绝对值比正数上界大 1。

自检
----

#. 为什么 ``"  -42abc"`` 在 ``a`` 处停止？
#. 为什么限制值要随符号变化？
#. ``"+-12"`` 为什么返回 0？

答案要点：数字必须连续；``INT_MIN`` 的绝对值是 ``2147483648``；读取第一个符号后，第二个符号不是数字。