0012. Integer to Roman
======================

题目信息
--------

:题号: 0012
:难度: Medium
:主题: 字符串、贪心、查表、进制表示
:原题: `LeetCode 0012 <https://leetcode.com/problems/integer-to-roman/>`_
:教学重点: 罗马符号单位、减法组合、最大单位优先、规范表示唯一性

题目重述
--------

给定范围 ``1`` 到 ``3999`` 的整数，将它转换为规范罗马数字。基本符号为
``I, V, X, L, C, D, M``，分别表示 ``1, 5, 10, 50, 100, 500, 1000``。

通常从大到小相加；以下六种情况使用减法表示：``IV, IX, XL, XC, CD, CM``。

自建示例
--------

.. code-block:: text

   num = 2944
   2000 -> MM
    900 -> CM
     40 -> XL
      4 -> IV
   输出：MMCMXLIV

.. code-block:: text

   num = 3888
   3000 + 800 + 80 + 8
   输出：MMMDCCCLXXXVIII

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <string>

   class Solution {
   private:
       std::string byDecimalPlaces(int num) {
           static const std::array<std::string, 4> thousands{
               "", "M", "MM", "MMM"
           };
           static const std::array<std::string, 10> hundreds{
               "", "C", "CC", "CCC", "CD", "D",
               "DC", "DCC", "DCCC", "CM"
           };
           static const std::array<std::string, 10> tens{
               "", "X", "XX", "XXX", "XL", "L",
               "LX", "LXX", "LXXX", "XC"
           };
           static const std::array<std::string, 10> ones{
               "", "I", "II", "III", "IV", "V",
               "VI", "VII", "VIII", "IX"
           };

           return thousands[num / 1000] +
               hundreds[num / 100 % 10] +
               tens[num / 10 % 10] +
               ones[num % 10];
       }

       std::string greedy(int num) {
           static const std::array<int, 13> values{
               1000, 900, 500, 400,
               100, 90, 50, 40,
               10, 9, 5, 4, 1
           };
           static const std::array<std::string, 13> symbols{
               "M", "CM", "D", "CD",
               "C", "XC", "L", "XL",
               "X", "IX", "V", "IV", "I"
           };

           std::string result;
           for (int i = 0; i < static_cast<int>(values.size()); ++i) {
               while (num >= values[i]) {
                   num -= values[i];
                   result += symbols[i];
               }
           }
           return result;
       }

   public:
       std::string intToRoman(int num) {
           return greedy(num);
       }
   };

题解
----

按十进制位查表如何直接生成答案
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

输入最多四位。每个十进制位在罗马数字中都有十种规范写法，例如百位 ``0`` 到 ``9`` 对应空串、``C``、
``CC``、``CCC``、``CD``、``D``、``DC``、``DCC``、``DCCC``、``CM``。分别查出千、百、十、个位文本并连接，
即可得到答案。这种方法把所有局部规则预先展开，时间和额外工作量都是常数。

为什么减法组合必须作为独立单位
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若只使用 ``1, 5, 10, 50, 100, 500, 1000``，数字 4 会写成 ``IIII``，数字 9 会写成 ``VIIII``，不符合规范。
把 ``4, 9, 40, 90, 400, 900`` 与对应文本加入值表后，每一种允许的减法结构都成为可直接选择的单位，算法
不需要在输出后回头修正。

从大到小选择为什么是自然贪心
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

值表按降序排列。当前剩余值为 ``remaining`` 时，选择不超过它的最大单位 ``value``，追加对应符号并减去
``value``。任何更小单位组合若表示同样数值，只会使用更多字符，或形成不规范重复。由于值表已经包含全部合法
减法组合，最大单位就是规范表示在当前位置必须使用的前缀。

贪心状态演化
~~~~~~~~~~~~

对 ``2944``：

.. list-table::
   :header-rows: 1

   * - 剩余值
     - 选择值
     - 追加符号
     - 新剩余值
     - 当前结果
   * - 2944
     - 1000
     - ``M``
     - 1944
     - ``M``
   * - 1944
     - 1000
     - ``M``
     - 944
     - ``MM``
   * - 944
     - 900
     - ``CM``
     - 44
     - ``MMCM``
   * - 44
     - 40
     - ``XL``
     - 4
     - ``MMCMXL``
   * - 4
     - 4
     - ``IV``
     - 0
     - ``MMCMXLIV``

为什么最大单位选择不会破坏后续规范表示
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

罗马数字规范按数值从大到小书写。当前最大可用单位若不选择，只能用更小单位凑出同样或更大的前缀数值；
这会产生更长表示，或者跨越 ``5``、``10`` 的边界后形成禁止的重复。选择该单位后，剩余值严格减小，且后续
只能使用当前单位或更小单位，输出顺序持续合法。重复应用直到剩余值为零，得到唯一规范表示。

解法对比与复杂度
~~~~~~~~~~~~~~~~

按位查表执行四次索引和字符串连接，时间 ``O(1)``，表为常量。贪心值表只有 13 项；在题目范围内追加字符
数量有固定上界，时间和工作空间也可视为 ``O(1)``。若把输入范围推广，时间与输出长度成正比。

九语言实现
----------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   char* intToRoman(int num) {
       static const int values[] = {1000,900,500,400,100,90,50,40,10,9,5,4,1};
       static const char* symbols[] = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
       char* result = malloc(32);
       int write = 0;
       for (int i = 0; i < 13; ++i) {
           while (num >= values[i]) {
               num -= values[i];
               int length = (int)strlen(symbols[i]);
               memcpy(result + write, symbols[i], (size_t)length);
               write += length;
           }
       }
       result[write] = '\0';
       return result;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def intToRoman(self, num: int) -> str:
           pairs = [(1000,"M"),(900,"CM"),(500,"D"),(400,"CD"),
                    (100,"C"),(90,"XC"),(50,"L"),(40,"XL"),
                    (10,"X"),(9,"IX"),(5,"V"),(4,"IV"),(1,"I")]
           result = []
           for value, symbol in pairs:
               count, num = divmod(num, value)
               result.append(symbol * count)
           return "".join(result)

Java
~~~~

.. code-block:: java

   class Solution {
       public String intToRoman(int num) {
           int[] values = {1000,900,500,400,100,90,50,40,10,9,5,4,1};
           String[] symbols = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
           StringBuilder result = new StringBuilder();
           for (int i = 0; i < values.length; i++) {
               while (num >= values[i]) {
                   num -= values[i];
                   result.append(symbols[i]);
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
           let values = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
           let symbols = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
           let mut result = String::new();
           for i in 0..values.len() {
               while num >= values[i] {
                   num -= values[i];
                   result.push_str(symbols[i]);
               }
           }
           result
       }
   }

Go
~~

.. code-block:: go

   func intToRoman(num int) string {
       values := []int{1000,900,500,400,100,90,50,40,10,9,5,4,1}
       symbols := []string{"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"}
       var result strings.Builder
       for i, value := range values {
           for num >= value {
               num -= value
               result.WriteString(symbols[i])
           }
       }
       return result.String()
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function intToRoman(num: number): string {
       const values = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
       const symbols = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
       const result: string[] = [];
       for (let i = 0; i < values.length; ++i) {
           while (num >= values[i]) {
               num -= values[i];
               result.push(symbols[i]);
           }
       }
       return result.join("");
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public string IntToRoman(int num) {
           int[] values = {1000,900,500,400,100,90,50,40,10,9,5,4,1};
           string[] symbols = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
           var result = new System.Text.StringBuilder();
           for (int i = 0; i < values.Length; i++) {
               while (num >= values[i]) { num -= values[i]; result.Append(symbols[i]); }
           }
           return result.ToString();
       }
   }

Julia
~~~~~

.. code-block:: julia

   function int_to_roman(num::Int)::String
       values = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
       symbols = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]
       result = IOBuffer()
       for i in eachindex(values)
           while num >= values[i]
               num -= values[i]
               print(result, symbols[i])
           end
       end
       String(take!(result))
   end

R
~

.. code-block:: r

   intToRoman <- function(num) {
       values <- c(1000,900,500,400,100,90,50,40,10,9,5,4,1)
       symbols <- c("M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I")
       result <- character()
       for (i in seq_along(values)) {
           while (num >= values[[i]]) {
               num <- num - values[[i]]
               result <- c(result, symbols[[i]])
           }
       }
       paste(result, collapse = "")
   }
