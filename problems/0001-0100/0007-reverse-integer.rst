0007. Reverse Integer
=====================

题目信息
--------

* 原题：`LeetCode 7 <https://leetcode.com/problems/reverse-integer/>`_
* 难度：Medium

题目重述
--------

给定一个 32 位有符号整数，把十进制数字顺序反转。符号保持在最前面，反转后产生的前导零自然消失；若结果超出 ``[-2^31, 2^31 - 1]``，返回 ``0``。不能依赖 64 位整数保存最终结果。

例如 ``-120`` 反转为 ``-21``，``1534236469`` 因溢出返回 ``0``。

问题抽象
--------

每轮从 ``x`` 的末尾取出一个十进制数字 ``digit``，并把它追加到结果 ``result``：

``result = result * 10 + digit``。

真正的难点是：必须在执行乘法和加法之前判断下一步是否会越过 32 位边界。

主解法：逐位弹出并在运算前检查溢出
------------------------------------

循环不变量：每轮开始时，``result`` 恰好是已经弹出的低位数字按相反顺序组成的整数，``x`` 保存尚未处理的高位部分。

设上界为 ``INT_MAX``、下界为 ``INT_MIN``。追加正数字前，若
``result > INT_MAX / 10``，或相等且 ``digit > 7``，一定溢出；负数边界同理，最低个位是 ``-8``。

正确性依据
~~~~~~~~~~

每次整数除以 10 都移除当前最低位，余数得到同一个最低位；把该余数追加到 ``result`` 的末尾，正好完成一位反转。循环直到 ``x`` 变为 0，因此每个数字被处理一次。预检查覆盖了乘 10 后越界以及边界相等时个位越界两种情况，所以返回的非零结果始终位于 32 位范围内。

复杂度
~~~~~~

若输入有 ``d`` 位，时间复杂度为 ``O(d)``，额外空间复杂度为 ``O(1)``。

C
~

.. code-block:: c

   int reverse(int x) {
       const int max_value = 2147483647;
       const int min_value = (-2147483647 - 1);
       int result = 0;

       while (x != 0) {
           int digit = x % 10;
           x /= 10;  // C 的整数除法向 0 截断，符号能自然保留

           if (result > max_value / 10 ||
               (result == max_value / 10 && digit > 7)) {
               return 0;
           }
           if (result < min_value / 10 ||
               (result == min_value / 10 && digit < -8)) {
               return 0;
           }
           result = result * 10 + digit;
       }
       return result;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int reverse(int x) {
           int result = 0;
           while (x != 0) {
               const int digit = x % 10;
               x /= 10;
               if (result > INT_MAX / 10 ||
                   (result == INT_MAX / 10 && digit > 7)) return 0;
               if (result < INT_MIN / 10 ||
                   (result == INT_MIN / 10 && digit < -8)) return 0;
               result = result * 10 + digit;
           }
           return result;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def reverse(self, x: int) -> int:
           limit_max, limit_min = 2**31 - 1, -(2**31)
           sign = -1 if x < 0 else 1
           x = abs(x)
           result = 0

           while x:
               digit = x % 10
               x //= 10
               if result > (limit_max - digit) // 10:
                   return 0
               result = result * 10 + digit

           result *= sign
           return result if limit_min <= result <= limit_max else 0

Java
~~~~

.. code-block:: java

   class Solution {
       public int reverse(int x) {
           int result = 0;
           while (x != 0) {
               int digit = x % 10;
               x /= 10;
               if (result > Integer.MAX_VALUE / 10 ||
                   (result == Integer.MAX_VALUE / 10 && digit > 7)) return 0;
               if (result < Integer.MIN_VALUE / 10 ||
                   (result == Integer.MIN_VALUE / 10 && digit < -8)) return 0;
               result = result * 10 + digit;
           }
           return result;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn reverse(mut x: i32) -> i32 {
           let mut result: i32 = 0;
           while x != 0 {
               let digit = x % 10;
               x /= 10;
               // checked_mul / checked_add 把溢出转换为 None。
               result = match result.checked_mul(10).and_then(|v| v.checked_add(digit)) {
                   Some(value) => value,
                   None => return 0,
               };
           }
           result
       }
   }

Go
~~

.. code-block:: go

   func reverse(x int) int {
       const maxInt = 1<<31 - 1
       const minInt = -1 << 31
       result := 0
       for x != 0 {
           digit := x % 10
           x /= 10
           if result > maxInt/10 || result == maxInt/10 && digit > 7 {
               return 0
           }
           if result < minInt/10 || result == minInt/10 && digit < -8 {
               return 0
           }
           result = result*10 + digit
       }
       return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function reverse(x: number): number {
       const max = 2 ** 31 - 1;
       const min = -(2 ** 31);
       const sign = x < 0 ? -1 : 1;
       x = Math.abs(x);
       let result = 0;

       while (x > 0) {
           const digit = x % 10;
           x = Math.trunc(x / 10);
           result = result * 10 + digit;
       }
       result *= sign;
       return result < min || result > max ? 0 : result;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int Reverse(int x) {
           int result = 0;
           while (x != 0) {
               int digit = x % 10;
               x /= 10;
               try {
                   result = checked(result * 10 + digit);
               } catch (OverflowException) {
                   return 0;
               }
           }
           return result;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function reverse(x::Int)::Int
       value = Int32(x)
       result = Int32(0)
       while value != 0
           digit = rem(value, Int32(10))
           value = div(value, Int32(10))
           next = Int64(result) * 10 + digit
           if next < typemin(Int32) || next > typemax(Int32)
               return 0
           end
           result = Int32(next)
       end
       return Int(result)
   end

R
~

.. code-block:: r

   reverse <- function(x) {
     max_value <- 2^31 - 1
     min_value <- -2^31
     sign <- if (x < 0) -1 else 1
     x <- abs(x)
     result <- 0

     while (x > 0) {
       digit <- x %% 10
       x <- floor(x / 10)
       result <- result * 10 + digit
     }
     result <- result * sign
     if (result < min_value || result > max_value) 0 else result
   }

易错点
------

* 不能先反转到更宽整数再强转回 32 位，这绕开了题目的核心约束。
* 负数余数和整数除法在不同语言中语义不同；Python、TypeScript、R 版本先取绝对值以统一处理。
* 上界最后一位是 7，下界绝对值最后一位是 8，两个边界并不对称。

自检
----

#. 为什么必须在 ``result * 10`` 之前检查？
#. ``-120`` 的两个尾随零为什么不会出现在结果前面？
#. 当 ``result == INT_MAX / 10`` 时，还需要检查什么？

答案要点：乘法本身可能溢出；整数逐位弹出时零被追加在中间，最终高位零没有数值意义；还要比较待追加数字是否大于 7。