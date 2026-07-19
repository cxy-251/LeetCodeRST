0029. Divide Two Integers
=========================

题目信息
--------

:题号: 0029
:难度: Medium
:主题: 整数、二进制倍增、贪心、溢出边界
:原题: `LeetCode 0029 <https://leetcode.com/problems/divide-two-integers/>`_
:访问状态: Available
:教学重点: 禁用乘除取模、倍增表、从大到小消去、向零截断、INT_MIN 特例

题目重述
--------

给定两个 32 位有符号整数 ``dividend`` 和 ``divisor``，计算整数商。不能使用乘法、除法和
取模运算符。

结果按“向零截断”处理：正数商向下取整，负数商向上取整。例如 ``7 / -3`` 返回 ``-2``。
若数学结果超过 32 位有符号整数上界，只返回 ``2147483647``。题目保证 ``divisor != 0``。

自建示例
--------

正数除法
~~~~~~~~

.. code-block:: text

   dividend = 43, divisor = 5
   返回 8
   因为 43 = 5 × 8 + 3

负数且向零截断
~~~~~~~~~~~~~~

.. code-block:: text

   dividend = -43, divisor = 5
   返回 -8

被除数绝对值更小
~~~~~~~~~~~~~~~~

.. code-block:: text

   dividend = 4, divisor = 9
   返回 0

唯一正向溢出
~~~~~~~~~~~~

.. code-block:: text

   dividend = -2147483648, divisor = -1
   数学结果 = 2147483648
   返回 2147483647

问题抽象
--------

逐次减去 ``divisor`` 可以得到商，但 ``2147483648 / 1`` 需要二十多亿次循环。

改为不断执行加法倍增：

.. code-block:: text

   divisor, divisor + divisor, 4 × divisor, 8 × divisor, ...

同时保存每个倍增值对应的商贡献：

.. code-block:: text

   值：      5, 10, 20, 40
   商贡献：  1,  2,  4,  8

对 ``43 / 5``，从最大倍增值向下选择：

.. code-block:: text

   43 - 40 = 3，商累加 8
   3 小于其余所有倍增值
   最终商为 8

这本质上是在构造商的二进制展开。实现只使用比较、加法和减法；“二倍”通过 ``value += value``
完成，没有使用乘法运算符。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 预计算倍增表后降序消去
     - ``O(log |q|)``
     - ``O(log |q|)``
     - 主解法；边界明确，十种语言都容易保持一致
   * - 每轮重新寻找最大倍数
     - ``O(log² |q|)``
     - ``O(1)``
     - 不存表，但重复构造相同倍数
   * - 逐次减去除数
     - ``O(|q|)``
     - ``O(1)``
     - 极端输入不可接受
   * - 位移长除法
     - 固定 32 轮
     - ``O(1)``
     - 高效，但 JavaScript 的 32 位有符号位运算需额外处理

主解法：倍增表与降序消去
------------------------

符号与绝对值
~~~~~~~~~~~~

结果为负，当且仅当两个输入符号不同。算法先记录符号，再在更宽的数值域中处理绝对值。

不能先在 32 位类型中计算 ``abs(INT_MIN)``。因为：

.. code-block:: text

   INT_MIN = -2147483648
   INT_MAX =  2147483647

正数 ``2147483648`` 无法放进 32 位有符号整数。固定宽度语言必须先提升到 64 位，再取相反数
或绝对值。

构建倍增表
~~~~~~~~~~

从 ``value = |divisor|``、``multiple = 1`` 开始。只要 ``value <= |dividend|``，保存这一对，
然后执行：

.. code-block:: text

   value += value
   multiple += multiple

为了避免“下一次倍增”越过当前被除数范围，使用：

.. code-block:: text

   value <= dividend_magnitude - value

它等价于 ``value + value <= dividend_magnitude``，同时避免先计算可能越界的和。

降序选择
~~~~~~~~

从最大倍增值向下遍历。若当前 ``value`` 不超过剩余被除数：

.. code-block:: text

   remainder -= value
   quotient += multiple

每个倍增值最多选择一次，因为它代表商二进制表示中的一个位。

核心不变量
~~~~~~~~~~

降序遍历每轮开始时：

* 原被除数绝对值等于 ``quotient × divisor_magnitude + remainder``；
* ``remainder >= 0``；
* 已处理的更大倍增值不可能再放入 ``remainder``；
* ``quotient`` 是已经确定的高位商贡献之和；
* 尚未处理的倍增值覆盖所有更低二进制位。

若当前倍增值可放入，减去它并累加对应商贡献，等式仍成立；若不可放入，该商位必须为零。

为何得到向零截断
~~~~~~~~~~~~~~~~

算法对绝对值计算非负整数商 ``floor(|dividend| / |divisor|)``，余数保持非负且小于除数。
最后只给整数商附加符号，没有根据余数继续远离零调整，因此：

* 同号时得到向下取整的正商；
* 异号时得到对应负值，也就是向零方向截断。

正确性依据
~~~~~~~~~~

倍增表第 ``i`` 项由前一项加自身得到，因此其值等于 ``|divisor|`` 的 ``2^i`` 倍，对应商贡献
也是 ``2^i``。降序遍历时，若某倍增值不超过剩余量，任何合法最大商都必须包含该二进制位；
否则舍弃它才不会让乘积超过被除数。

每次选择都保持
``|dividend| = quotient × |divisor| + remainder``。遍历结束后，所有正倍增值都大于
``remainder``，特别是最小倍增值 ``|divisor|`` 也大于余数。因此
``0 <= remainder < |divisor|``，``quotient`` 正是绝对值整数商。

最后根据输入符号决定正负，得到向零截断结果。唯一超过 ``INT_MAX`` 的合法数学结果是
``INT_MIN / -1``，显式钳制后满足题目接口。

复杂度
~~~~~~

设绝对值整数商为 ``q``：

* 倍增表长度为 ``O(log |q|)``；
* 构建和降序扫描各遍历一次，时间复杂度为 ``O(log |q|)``；
* 倍增表额外空间为 ``O(log |q|)``；
* 对 32 位输入，表长最多 32 项。

核心语言实现
------------

C
~

.. code-block:: c

   int divide(int dividend, int divisor) {
       if (dividend == INT_MIN && divisor == -1) {
           return INT_MAX;
       }

       bool negative = (dividend < 0) != (divisor < 0);
       int64_t remaining = dividend < 0
           ? -(int64_t)dividend
           : (int64_t)dividend;
       int64_t base = divisor < 0
           ? -(int64_t)divisor
           : (int64_t)divisor;

       int64_t values[32];
       int64_t multiples[32];
       int count = 0;
       int64_t value = base;
       int64_t multiple = 1;

       while (value <= remaining) {
           values[count] = value;
           multiples[count] = multiple;
           ++count;

           if (value > remaining - value) {
               break;
           }

           value += value;
           multiple += multiple;
       }

       int64_t quotient = 0;

       for (int i = count - 1; i >= 0; --i) {
           if (values[i] <= remaining) {
               remaining -= values[i];
               quotient += multiples[i];
           }
       }

       return negative ? (int)(-quotient) : (int)quotient;
   }

C 需要 ``<stdint.h>``、``<stdbool.h>`` 和 ``<limits.h>``。先转换为 ``int64_t`` 再取相反数，
避免在 32 位范围中处理 ``INT_MIN`` 的绝对值。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int divide(int dividend, int divisor) {
           if (dividend == INT_MIN && divisor == -1) {
               return INT_MAX;
           }

           bool negative = (dividend < 0) != (divisor < 0);
           long long remaining = std::llabs(
               static_cast<long long>(dividend)
           );
           long long base = std::llabs(
               static_cast<long long>(divisor)
           );

           std::vector<long long> values;
           std::vector<long long> multiples;

           for (long long value = base, multiple = 1;
                value <= remaining;) {
               values.push_back(value);
               multiples.push_back(multiple);

               if (value > remaining - value) {
                   break;
               }

               value += value;
               multiple += multiple;
           }

           long long quotient = 0;

           for (int i = static_cast<int>(values.size()) - 1;
                i >= 0;
                --i) {
               if (values[i] <= remaining) {
                   remaining -= values[i];
                   quotient += multiples[i];
               }
           }

           return static_cast<int>(negative ? -quotient : quotient);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def divide(self, dividend: int, divisor: int) -> int:
           int_min = -(1 << 31)
           int_max = (1 << 31) - 1

           if dividend == int_min and divisor == -1:
               return int_max

           negative = (dividend < 0) != (divisor < 0)
           remaining = abs(dividend)
           base = abs(divisor)
           values: list[int] = []
           multiples: list[int] = []
           value = base
           multiple = 1

           while value <= remaining:
               values.append(value)
               multiples.append(multiple)

               if value > remaining - value:
                   break

               value += value
               multiple += multiple

           quotient = 0

           for value, multiple in zip(
               reversed(values),
               reversed(multiples),
           ):
               if value <= remaining:
                   remaining -= value
                   quotient += multiple

           return -quotient if negative else quotient

Python 整数没有固定宽度溢出，但仍保留 32 位接口钳制规则，便于与其他语言对齐。

Java
~~~~

.. code-block:: java

   class Solution {
       public int divide(int dividend, int divisor) {
           if (dividend == Integer.MIN_VALUE && divisor == -1) {
               return Integer.MAX_VALUE;
           }

           boolean negative = (dividend < 0) != (divisor < 0);
           long remaining = Math.abs((long) dividend);
           long base = Math.abs((long) divisor);
           long[] values = new long[32];
           long[] multiples = new long[32];
           int count = 0;
           long value = base;
           long multiple = 1;

           while (value <= remaining) {
               values[count] = value;
               multiples[count] = multiple;
               ++count;

               if (value > remaining - value) {
                   break;
               }

               value += value;
               multiple += multiple;
           }

           long quotient = 0;

           for (int i = count - 1; i >= 0; --i) {
               if (values[i] <= remaining) {
                   remaining -= values[i];
                   quotient += multiples[i];
               }
           }

           return (int) (negative ? -quotient : quotient);
       }
   }

``Math.abs((long) dividend)`` 的转换顺序不能颠倒。若先对 ``int`` 调用 ``Math.abs``，
``Integer.MIN_VALUE`` 仍会溢出并保持负数。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn divide(dividend: i32, divisor: i32) -> i32 {
           if dividend == i32::MIN && divisor == -1 {
               return i32::MAX;
           }

           let negative = (dividend < 0) != (divisor < 0);
           let mut remaining = (dividend as i64).abs();
           let base = (divisor as i64).abs();
           let mut values: Vec<i64> = Vec::new();
           let mut multiples: Vec<i64> = Vec::new();
           let mut value = base;
           let mut multiple = 1i64;

           while value <= remaining {
               values.push(value);
               multiples.push(multiple);

               if value > remaining - value {
                   break;
               }

               value += value;
               multiple += multiple;
           }

           let mut quotient = 0i64;

           for index in (0..values.len()).rev() {
               if values[index] <= remaining {
                   remaining -= values[index];
                   quotient += multiples[index];
               }
           }

           if negative {
               (-quotient) as i32
           } else {
               quotient as i32
           }
       }
   }

Go
~~

.. code-block:: go

   func divide(dividend int, divisor int) int {
       const intMin = -1 << 31
       const intMax = 1<<31 - 1

       if dividend == intMin && divisor == -1 {
           return intMax
       }

       negative := (dividend < 0) != (divisor < 0)
       remaining := int64(dividend)
       base := int64(divisor)

       if remaining < 0 {
           remaining = -remaining
       }
       if base < 0 {
           base = -base
       }

       values := make([]int64, 0, 32)
       multiples := make([]int64, 0, 32)
       value := base
       multiple := int64(1)

       for value <= remaining {
           values = append(values, value)
           multiples = append(multiples, multiple)

           if value > remaining-value {
               break
           }

           value += value
           multiple += multiple
       }

       quotient := int64(0)

       for i := len(values) - 1; i >= 0; i-- {
           if values[i] <= remaining {
               remaining -= values[i]
               quotient += multiples[i]
           }
       }

       if negative {
           quotient = -quotient
       }
       return int(quotient)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function divide(dividend: number, divisor: number): number {
       const intMin = -2147483648;
       const intMax = 2147483647;

       if (dividend === intMin && divisor === -1) {
           return intMax;
       }

       const negative = (dividend < 0) !== (divisor < 0);
       let remaining = Math.abs(dividend);
       const base = Math.abs(divisor);
       const values: number[] = [];
       const multiples: number[] = [];
       let value = base;
       let multiple = 1;

       while (value <= remaining) {
           values.push(value);
           multiples.push(multiple);

           if (value > remaining - value) {
               break;
           }

           value += value;
           multiple += multiple;
       }

       let quotient = 0;

       for (let i = values.length - 1; i >= 0; i--) {
           if (values[i] <= remaining) {
               remaining -= values[i];
               quotient += multiples[i];
           }
       }

       return negative ? -quotient : quotient;
   }

JavaScript ``number`` 能精确表示所有 32 位整数及其倍增中间值。本实现避免 ``<< 31``，因为
JavaScript 位运算会先把操作数压缩成 32 位有符号整数。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int Divide(int dividend, int divisor) {
           if (dividend == int.MinValue && divisor == -1) {
               return int.MaxValue;
           }

           bool negative = (dividend < 0) != (divisor < 0);
           long remaining = Math.Abs((long) dividend);
           long baseValue = Math.Abs((long) divisor);
           long[] values = new long[32];
           long[] multiples = new long[32];
           int count = 0;
           long value = baseValue;
           long multiple = 1;

           while (value <= remaining) {
               values[count] = value;
               multiples[count] = multiple;
               ++count;

               if (value > remaining - value) {
                   break;
               }

               value += value;
               multiple += multiple;
           }

           long quotient = 0;

           for (int i = count - 1; i >= 0; --i) {
               if (values[i] <= remaining) {
                   remaining -= values[i];
                   quotient += multiples[i];
               }
           }

           return (int) (negative ? -quotient : quotient);
       }
   }

Julia
~~~~~

.. code-block:: julia

   function divide(dividend::Int, divisor::Int)::Int
       int_min = -2147483648
       int_max = 2147483647

       dividend == int_min && divisor == -1 && return int_max

       negative = (dividend < 0) != (divisor < 0)
       remaining = abs(Int64(dividend))
       base = abs(Int64(divisor))
       values = Int64[]
       multiples = Int64[]
       value = base
       multiple = Int64(1)

       while value <= remaining
           push!(values, value)
           push!(multiples, multiple)

           value > remaining - value && break

           value += value
           multiple += multiple
       end

       quotient = Int64(0)

       for index in length(values):-1:1
           if values[index] <= remaining
               remaining -= values[index]
               quotient += multiples[index]
           end
       end

       return Int(negative ? -quotient : quotient)
   end

R
~

.. code-block:: r

   divide_integers <- function(dividend, divisor) {
     int_min <- -2147483648
     int_max <- 2147483647

     if (dividend == int_min && divisor == -1) {
       return(int_max)
     }

     negative <- xor(dividend < 0, divisor < 0)
     remaining <- abs(as.numeric(dividend))
     base <- abs(as.numeric(divisor))
     values <- numeric(0)
     multiples <- numeric(0)
     value <- base
     multiple <- 1

     while (value <= remaining) {
       values <- c(values, value)
       multiples <- c(multiples, multiple)

       if (value > remaining - value) {
         break
       }

       value <- value + value
       multiple <- multiple + multiple
     }

     quotient <- 0

     if (length(values) > 0L) {
       for (index in rev(seq_along(values))) {
         if (values[[index]] <= remaining) {
           remaining <- remaining - values[[index]]
           quotient <- quotient + multiples[[index]]
         }
       }
     }

     if (negative) -quotient else quotient
   }

R 的整数最小值与 ``NA_integer_`` 表示有关，因此接口使用可精确容纳 32 位整数的双精度数值。
在 ``2^53`` 以内，R 的双精度整数运算仍然精确。

关键边界
--------

* ``INT_MIN / -1``：唯一正向溢出，必须返回 ``INT_MAX``；
* ``INT_MIN / 1``：结果正好是 ``INT_MIN``，不能误钳制；
* 除数为 ``INT_MIN``：只有被除数也为 ``INT_MIN`` 时商为 ``1``，其他情况为 ``0``；
* 被除数绝对值小于除数：倍增表为空，返回 ``0``；
* 除数为 ``1`` 或 ``-1``：表可能达到最大长度；
* 异号且存在余数：只附加负号，得到向零截断结果。

易错点
------

* 在 32 位类型中调用 ``abs(INT_MIN)``，结果溢出或仍为负数；
* 用 ``value + value <= remaining`` 判断后再发生窄类型溢出；
* 对负商根据余数再减一，错误地实现成向负无穷取整；
* JavaScript 使用 ``1 << 31`` 表示正数 ``2147483648``，实际得到负数；
* 倍增阶段没有限制上界，固定宽度语言中不断翻倍；
* 忘记显式处理唯一溢出组合；
* 使用了 ``/``、``%`` 或 ``*``，违反题目限制。

新增与强化知识
--------------

新增
~~~~

* 加法倍增表把整数商拆成二进制位贡献；
* 从最大倍数降序选择等价于贪心确定商的高位；
* ``value <= remaining - value`` 是“先判断、后倍增”的安全边界式；
* 向零截断可以通过先算绝对值整数商、最后附加符号得到。

强化
~~~~

* 0007、0008 的 32 位边界处理再次出现，但本题必须先提升类型再取绝对值；
* 0011、0015、0016 中“先扩宽再运算”的规则继续适用；
* 二进制分解并不要求直接使用位移，重复加法也能构造相同权重。

最小自检
--------

#. 为什么 ``abs(INT_MIN)`` 不能在 32 位有符号整数中计算？
#. 倍增表中的 ``multiple`` 表示什么？
#. 为什么从最大倍增值向下选择不会错过更大的商？
#. ``-7 / 3`` 为什么返回 ``-2`` 而不是 ``-3``？
#. 除 ``INT_MIN / -1`` 外，为什么不需要其他上界钳制？

答案要点
~~~~~~~~

#. ``2147483648`` 超过 ``INT_MAX``，必须先提升到更宽类型。
#. 当前倍增值等于多少份原除数，也就是该项对商的贡献。
#. 当前值可放入时，高位必须为一；不可放入时，高位只能为零，剩余低位继续精确表示余量。
#. 绝对值商是 ``2``，最后只附加负号，实现向零截断。
#. 32 位输入的其他商都落在 ``[-2147483648, 2147483647]`` 范围内。
