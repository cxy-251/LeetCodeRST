0012. Integer to Roman
======================

题目信息
--------

:题号: 0012
:难度: Medium
:主题: 数学、字符串、贪心、罗马数字
:原题: `LeetCode 0012 <https://leetcode.com/problems/integer-to-roman/>`_
:访问状态: Available
:教学重点: 降序贪心、减法组合、规范表示、增量构造字符串

题目重述
--------

给定一个位于 ``1`` 到 ``3999`` 之间的整数 ``num``，把它转换为规范罗马数字。

罗马数字由 ``I``、``V``、``X``、``L``、``C``、``D``、``M`` 组成。通常从大值到
小值排列并相加；以下六种减法组合必须作为整体使用：

* ``IV = 4``；
* ``IX = 9``；
* ``XL = 40``；
* ``XC = 90``；
* ``CD = 400``；
* ``CM = 900``。

输出必须采用最常见的规范形式，不能用 ``IIII`` 表示 ``4``，也不能用 ``IL`` 表示
``49``。

自建示例
--------

普通组合
~~~~~~~~

.. code-block:: text

   输入：num = 58
   分解：50 + 5 + 3
   输出："LVIII"

包含多个减法组合
~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：num = 1994
   分解：1000 + 900 + 90 + 4
   输出："MCMXCIV"

边界最小值
~~~~~~~~~~

.. code-block:: text

   输入：num = 1
   输出："I"

边界最大值
~~~~~~~~~~

.. code-block:: text

   输入：num = 3999
   分解：3000 + 900 + 90 + 9
   输出："MMMCMXCIX"

问题抽象
--------

把所有合法的“原子罗马片段”按数值从大到小排列：

.. code-block:: text

   1000 M    900 CM    500 D    400 CD
    100 C     90 XC     50 L     40 XL
     10 X      9 IX      5 V      4 IV      1 I

每次选择不超过当前剩余值的最大片段，把对应符号追加到结果，并从剩余值中减去该片段。
由于表中已经显式包含六种减法组合，算法不需要在输出后再修正 ``IIII``、``VIIII`` 等
非规范形式。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 取舍
   * - 降序罗马片段贪心
     - ``O(k)``
     - ``O(k)``
     - 主解法；表驱动、规则集中，直接生成规范表示
   * - 按千百十个位分别查表
     - ``O(1)``
     - ``O(k)``
     - 同样高效，但把规则拆成四张位置表，泛化性较弱
   * - 先重复基本符号再做字符串替换
     - 取决于替换实现
     - ``O(k)``
     - 容易产生非法中间形式，规则分散且不必要

其中 ``k`` 是输出罗马数字的长度；在 ``1`` 到 ``3999`` 的约束内，``k`` 有固定上界。

主解法：降序片段贪心
--------------------

状态含义
~~~~~~~~

算法维护：

* ``remaining``：尚未编码的整数部分；
* ``index``：当前检查的罗马片段位置；
* ``result``：已经生成的规范前缀。

对每个片段 ``values[index]``，只要它不大于 ``remaining``，就追加对应符号并做减法：

.. code-block:: text

   result += symbols[index]
   remaining -= values[index]

当前片段不能继续使用时，才进入下一个更小的片段。

为什么减法组合必须进入表
~~~~~~~~~~~~~~~~~~~~~~~~

若表中只有 ``I``、``V``、``X``、``L``、``C``、``D``、``M``，贪心会把 ``4`` 写成
``IIII``、把 ``9`` 写成 ``VIIII``。把 ``IV``、``IX`` 等六个规范减法组合看作不可拆分
片段后，贪心首先选择 ``4`` 或 ``9``，自然得到规范形式。

核心不变量
~~~~~~~~~~

每次准备选择片段时：

* ``原始 num = 已输出片段的数值总和 + remaining``；
* ``result`` 中的片段按非增数值顺序排列；
* 所有比当前片段更大的片段都已使用到规范表示允许的最大次数；
* ``remaining`` 始终非负，并在每次追加后严格减小。

正确性依据
~~~~~~~~~~

片段表包含所有基本符号和所有允许的减法组合，因此任何规范罗马数字都能分解为表中片段，
并按数值非增顺序排列。

考虑算法当前检查的最大可用片段 ``v``。若 ``v <= remaining``，规范表示必须先消耗一个
``v``：改用更小片段只能表达同一数值的更长或非规范形式，而且不能在之后再放回更大的片段，
因为罗马数字要求整体按非增顺序排列。算法追加 ``v`` 后，问题缩小为把
``remaining - v`` 转换为规范罗马数字。

若 ``v > remaining``，任何规范表示都不能使用该片段，算法跳到下一项不会漏解。不断重复后
``remaining`` 变为 ``0``，不变量保证输出片段之和等于原整数；每一步又都选择规范片段并保持
非增顺序，所以结果正是规范罗马表示。

复杂度
~~~~~~

* 时间复杂度：``O(k)``，每次循环都会追加一个输出片段；
* 空间复杂度：``O(k)``，用于保存结果字符串；
* 片段表固定为 ``13`` 项，不随输入增长。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>

   char* intToRoman(int num) {
       static const int values[] = {
           1000, 900, 500, 400, 100, 90, 50,
           40, 10, 9, 5, 4, 1
       };
       static const char* symbols[] = {
           "M", "CM", "D", "CD", "C", "XC", "L",
           "XL", "X", "IX", "V", "IV", "I"
       };

       // 3999 的规范表示很短；32 字节为结果和结尾零留出充足空间。
       char* result = malloc(32);
       int length = 0;

       for (int i = 0; i < 13; ++i) {
           while (num >= values[i]) {
               const char* symbol = symbols[i];
               for (int j = 0; symbol[j] != '\0'; ++j) {
                   result[length++] = symbol[j];
               }
               num -= values[i];
           }
       }

       result[length] = '\0';
       return result;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       string intToRoman(int num) {
           static const int values[] = {
               1000, 900, 500, 400, 100, 90, 50,
               40, 10, 9, 5, 4, 1
           };
           static const string symbols[] = {
               "M", "CM", "D", "CD", "C", "XC", "L",
               "XL", "X", "IX", "V", "IV", "I"
           };

           string result;
           for (int i = 0; i < 13; ++i) {
               while (num >= values[i]) {
                   result += symbols[i];
                   num -= values[i];
               }
           }
           return result;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def intToRoman(self, num: int) -> str:
           values = [
               1000, 900, 500, 400, 100, 90, 50,
               40, 10, 9, 5, 4, 1,
           ]
           symbols = [
               "M", "CM", "D", "CD", "C", "XC", "L",
               "XL", "X", "IX", "V", "IV", "I",
           ]

           pieces: list[str] = []
           for value, symbol in zip(values, symbols):
               while num >= value:
                   pieces.append(symbol)
                   num -= value

           # 最后统一连接，避免在循环中反复复制不可变字符串。
           return "".join(pieces)

Java
~~~~

.. code-block:: java

   class Solution {
       public String intToRoman(int num) {
           int[] values = {
               1000, 900, 500, 400, 100, 90, 50,
               40, 10, 9, 5, 4, 1
           };
           String[] symbols = {
               "M", "CM", "D", "CD", "C", "XC", "L",
               "XL", "X", "IX", "V", "IV", "I"
           };

           StringBuilder result = new StringBuilder();
           for (int i = 0; i < values.length; ++i) {
               while (num >= values[i]) {
                   result.append(symbols[i]);
                   num -= values[i];
               }
           }
           return result.toString();
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn int_to_roman(mut num: i32) -> String {
           const VALUES: [i32; 13] = [
               1000, 900, 500, 400, 100, 90, 50,
               40, 10, 9, 5, 4, 1,
           ];
           const SYMBOLS: [&str; 13] = [
               "M", "CM", "D", "CD", "C", "XC", "L",
               "XL", "X", "IX", "V", "IV", "I",
           ];

           let mut result = String::new();
           for index in 0..VALUES.len() {
               while num >= VALUES[index] {
                   result.push_str(SYMBOLS[index]);
                   num -= VALUES[index];
               }
           }
           result
       }
   }

Go
~~

.. code-block:: go

   import "strings"

   func intToRoman(num int) string {
       values := [...]int{
           1000, 900, 500, 400, 100, 90, 50,
           40, 10, 9, 5, 4, 1,
       }
       symbols := [...]string{
           "M", "CM", "D", "CD", "C", "XC", "L",
           "XL", "X", "IX", "V", "IV", "I",
       }

       var result strings.Builder
       for i, value := range values {
           for num >= value {
               result.WriteString(symbols[i])
               num -= value
           }
       }
       return result.String()
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function intToRoman(num: number): string {
       const values = [
           1000, 900, 500, 400, 100, 90, 50,
           40, 10, 9, 5, 4, 1,
       ];
       const symbols = [
           "M", "CM", "D", "CD", "C", "XC", "L",
           "XL", "X", "IX", "V", "IV", "I",
       ];

       const pieces: string[] = [];
       for (let i = 0; i < values.length; i += 1) {
           while (num >= values[i]) {
               pieces.push(symbols[i]);
               num -= values[i];
           }
       }
       return pieces.join("");
   }

C#
~~

.. code-block:: csharp

   using System.Text;

   public class Solution {
       public string IntToRoman(int num) {
           int[] values = {
               1000, 900, 500, 400, 100, 90, 50,
               40, 10, 9, 5, 4, 1
           };
           string[] symbols = {
               "M", "CM", "D", "CD", "C", "XC", "L",
               "XL", "X", "IX", "V", "IV", "I"
           };

           var result = new StringBuilder();
           for (int i = 0; i < values.Length; ++i) {
               while (num >= values[i]) {
                   result.Append(symbols[i]);
                   num -= values[i];
               }
           }
           return result.ToString();
       }
   }

Julia
~~~~~

.. code-block:: julia

   function int_to_roman(num::Int)::String
       values = (
           1000, 900, 500, 400, 100, 90, 50,
           40, 10, 9, 5, 4, 1,
       )
       symbols = (
           "M", "CM", "D", "CD", "C", "XC", "L",
           "XL", "X", "IX", "V", "IV", "I",
       )

       io = IOBuffer()
       for index in eachindex(values)
           while num >= values[index]
               print(io, symbols[index])
               num -= values[index]
           end
       end
       return String(take!(io))
   end

R
~

.. code-block:: r

   intToRoman <- function(num) {
       values <- c(
           1000, 900, 500, 400, 100, 90, 50,
           40, 10, 9, 5, 4, 1
       )
       symbols <- c(
           "M", "CM", "D", "CD", "C", "XC", "L",
           "XL", "X", "IX", "V", "IV", "I"
       )

       # 最大输出长度很小，预分配可以避免循环中反复扩展向量。
       pieces <- character(16)
       size <- 0

       for (i in seq_along(values)) {
           while (num >= values[[i]]) {
               size <- size + 1
               pieces[[size]] <- symbols[[i]]
               num <- num - values[[i]]
           }
       }

       paste0(pieces[seq_len(size)], collapse = "")
   }

关键边界与易错点
----------------

* 必须把 ``4``、``9``、``40``、``90``、``400``、``900`` 六个减法组合放进降序表；
* 表必须严格按数值降序，否则较小片段会提前消耗剩余值；
* 同一片段可能连续使用，例如 ``3000`` 需要三个 ``M``，所以每项内部使用 ``while``；
* C 返回动态分配的字符串，调用方按平台约定接收；
* 不要把 ``49`` 写成 ``IL``；规范结果是 ``XLIX``；
* Python、TypeScript 等语言优先收集片段后统一连接，避免循环内反复复制字符串。

新增与强化知识
--------------

新增
~~~~

* **降序片段贪心**：把基本符号和减法组合统一为带权片段，每次取最大可用项；
* **规范令牌分解**：先规定合法原子片段，算法只在合法片段集合中组合；
* **表驱动编码**：数值与符号并列存储，使规则集中而不散落在条件分支中。

强化
~~~~

* 0005、0006 中的增量字符串构造再次出现；
* 0011 的贪心排除思想在本题中表现为“最大可用片段必须先使用”；
* 多语言并行数组必须保持相同长度与相同顺序。

关联题目
--------

* `0013. Roman to Integer <0013-roman-to-integer.rst>`_：执行相反方向的罗马数字解析；
* `0008. String to Integer (atoi) <0008-string-to-integer-atoi.rst>`_：同样把文本与整数联系起来，
  但需要处理停止条件和溢出钳制。

最小自检
--------

#. 为什么 ``900`` 必须作为 ``CM`` 整体进入表？
#. 为什么表必须按数值降序？
#. ``58`` 的贪心选择顺序是什么？
#. 为什么当前片段不能使用后，才可以进入更小片段？
#. 各语言为什么倾向使用可增长缓冲区或片段列表？

答案要点
~~~~~~~~

#. 否则只用基本符号会产生非规范的重复形式；
#. 降序保证大值先消耗，输出片段也保持合法顺序；
#. ``L``、``V``、``I``、``I``、``I``；
#. 更大片段已超过剩余值，当前片段又已使用到最大次数；
#. 避免不可变字符串在每次追加时复制已有内容。
