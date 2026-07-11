0013. Roman to Integer
======================

题目信息
--------

:题号: 0013
:难度: Easy
:主题: 字符串、哈希映射、局部比较、罗马数字
:原题: `LeetCode 0013 <https://leetcode.com/problems/roman-to-integer/>`_
:访问状态: Available
:教学重点: 符号映射、减法对识别、局部贡献、单向扫描

题目重述
--------

给定一个有效的罗马数字字符串 ``s``，返回它表示的整数。

罗马数字中的基本符号及数值为：

.. code-block:: text

   I = 1    V = 5    X = 10    L = 50
   C = 100  D = 500  M = 1000

通常符号从大到小排列并相加。以下六种组合使用“较小符号写在较大符号前面”的减法规则：

* ``IV``、``IX``；
* ``XL``、``XC``；
* ``CD``、``CM``。

输入保证是合法罗马数字，因此不需要校验非法重复、非法减法组合或超出范围的形式。

自建示例
--------

全部相加
~~~~~~~~

.. code-block:: text

   输入："LVIII"
   贡献：50 + 5 + 1 + 1 + 1
   输出：58

包含多个减法对
~~~~~~~~~~~~~~

.. code-block:: text

   输入："MCMXCIV"
   贡献：1000 - 100 + 1000 - 10 + 100 - 1 + 5
   输出：1994

单字符
~~~~~~

.. code-block:: text

   输入："D"
   输出：500

相邻同值
~~~~~~~~

.. code-block:: text

   输入："III"
   每个 I 后面都没有更大符号，因此全部相加。
   输出：3

问题抽象
--------

把每个罗马字符映射为整数。扫描位置 ``i`` 时，只需比较当前值与下一个值：

* 若 ``value[i] < value[i + 1]``，当前字符是减法组合的左半部分，贡献为负；
* 否则当前字符贡献为正；
* 最后一个字符没有右邻居，直接相加。

例如 ``MCMXCIV``：

.. code-block:: text

   M   C   M   X   C   I   V
   +  -   +   -   +   -   +
   1000 -100 +1000 -10 +100 -1 +5

不需要先把 ``CM``、``XC``、``IV`` 切成子串；相邻大小关系已经编码了减法语义。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 取舍
   * - 从左到右比较相邻符号
     - ``O(n)``
     - ``O(1)``
     - 主解法；每个字符只检查一次，减法规则直接体现为符号贡献
   * - 从右到左维护最大值
     - ``O(n)``
     - ``O(1)``
     - 同样正确；当前值小于右侧最大值时做减法
   * - 逐个匹配六种减法子串
     - ``O(n)``
     - ``O(1)``
     - 条件分支较多，规则分散，容易遗漏边界

主解法：相邻符号决定正负贡献
----------------------------

状态含义
~~~~~~~~

算法维护：

* ``index``：当前字符位置；
* ``current``：当前符号对应的数值；
* ``next``：右侧相邻符号的数值；
* ``total``：已经处理字符的有符号贡献之和。

除最后一个字符外，每轮执行：

.. code-block:: text

   如果 current < next：
       total -= current
   否则：
       total += current

循环结束后，再把最后一个字符的值加入 ``total``。

为什么只比较下一个字符
~~~~~~~~~~~~~~~~~~~~~~

在合法罗马数字中，减法只发生在一个较小符号紧邻一个较大符号时，例如 ``IV`` 和 ``CM``。
因此当前字符是否应该取负，只由它与右邻居的大小关系决定。

``XIX`` 中：

* 第一个 ``X`` 后面是更小的 ``I``，贡献 ``+10``；
* ``I`` 后面是更大的 ``X``，贡献 ``-1``；
* 最后一个 ``X`` 贡献 ``+10``。

结果是 ``19``。

核心不变量
~~~~~~~~~~

处理位置 ``index`` 之前：

* ``total`` 等于所有已处理字符按照局部减法规则得到的贡献之和；
* 每个已处理字符只根据它与右邻居的关系确定一次正负号；
* 尚未处理的后缀保持原顺序，没有跳过或重复字符；
* 对于合法输入，每个减法组合的较小字符会被减去，较大字符会在后续被加上。

正确性依据
~~~~~~~~~~

合法罗马数字只包含两类局部结构：

#. 当前符号不小于右邻居，它属于普通加法序列，当前值应加入总和；
#. 当前符号小于右邻居，它是合法减法组合的左半部分，当前值应从后续较大值中扣除。

算法逐字符按这两类结构分配贡献。对于普通符号，贡献与罗马数字求值规则一致；对于减法对
``ab``，其中 ``value(a) < value(b)``，算法产生 ``-value(a) + value(b)``，恰好等于该组合
的数值。

最后一个字符不可能作为减法对左半部分，因为它没有右邻居，因此直接相加。所有字符都恰好
贡献一次，故 ``total`` 等于整个罗马数字表示的整数。

复杂度
~~~~~~

设字符串长度为 ``n``：

* 时间复杂度：``O(n)``；
* 额外空间复杂度：``O(1)``；
* 符号映射只有七项，是固定大小。

核心语言实现
------------

C
~

.. code-block:: c

   static int romanValue(char symbol) {
       switch (symbol) {
           case 'I': return 1;
           case 'V': return 5;
           case 'X': return 10;
           case 'L': return 50;
           case 'C': return 100;
           case 'D': return 500;
           case 'M': return 1000;
           default: return 0;
       }
   }

   int romanToInt(char* s) {
       int total = 0;

       for (int i = 0; s[i] != '\0'; ++i) {
           int current = romanValue(s[i]);
           int next = s[i + 1] == '\0' ? 0 : romanValue(s[i + 1]);

           // 当前值小于右邻居时，它是减法组合的左半部分。
           total += current < next ? -current : current;
       }

       return total;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
       int value(char symbol) {
           switch (symbol) {
               case 'I': return 1;
               case 'V': return 5;
               case 'X': return 10;
               case 'L': return 50;
               case 'C': return 100;
               case 'D': return 500;
               case 'M': return 1000;
           }
           return 0;
       }

   public:
       int romanToInt(string s) {
           int total = 0;

           for (int i = 0; i < static_cast<int>(s.size()); ++i) {
               int current = value(s[i]);
               int next = i + 1 < static_cast<int>(s.size())
                   ? value(s[i + 1])
                   : 0;
               total += current < next ? -current : current;
           }

           return total;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def romanToInt(self, s: str) -> int:
           values = {
               "I": 1,
               "V": 5,
               "X": 10,
               "L": 50,
               "C": 100,
               "D": 500,
               "M": 1000,
           }

           total = 0
           for index, symbol in enumerate(s):
               current = values[symbol]
               next_value = values[s[index + 1]] if index + 1 < len(s) else 0
               total += -current if current < next_value else current

           return total

Java
~~~~

.. code-block:: java

   class Solution {
       private int value(char symbol) {
           switch (symbol) {
               case 'I': return 1;
               case 'V': return 5;
               case 'X': return 10;
               case 'L': return 50;
               case 'C': return 100;
               case 'D': return 500;
               case 'M': return 1000;
               default: return 0;
           }
       }

       public int romanToInt(String s) {
           int total = 0;

           for (int i = 0; i < s.length(); ++i) {
               int current = value(s.charAt(i));
               int next = i + 1 < s.length()
                   ? value(s.charAt(i + 1))
                   : 0;
               total += current < next ? -current : current;
           }

           return total;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       fn value(symbol: u8) -> i32 {
           match symbol {
               b'I' => 1,
               b'V' => 5,
               b'X' => 10,
               b'L' => 50,
               b'C' => 100,
               b'D' => 500,
               b'M' => 1000,
               _ => 0,
           }
       }

       pub fn roman_to_int(s: String) -> i32 {
           let bytes = s.as_bytes();
           let mut total = 0;

           for index in 0..bytes.len() {
               let current = Self::value(bytes[index]);
               let next = if index + 1 < bytes.len() {
                   Self::value(bytes[index + 1])
               } else {
                   0
               };
               total += if current < next { -current } else { current };
           }

           total
       }
   }

Go
~~

.. code-block:: go

   func romanValue(symbol byte) int {
       switch symbol {
       case 'I':
           return 1
       case 'V':
           return 5
       case 'X':
           return 10
       case 'L':
           return 50
       case 'C':
           return 100
       case 'D':
           return 500
       case 'M':
           return 1000
       }
       return 0
   }

   func romanToInt(s string) int {
       total := 0

       for i := 0; i < len(s); i++ {
           current := romanValue(s[i])
           next := 0
           if i+1 < len(s) {
               next = romanValue(s[i+1])
           }
           if current < next {
               total -= current
           } else {
               total += current
           }
       }

       return total
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function romanValue(symbol: string): number {
       switch (symbol) {
           case "I": return 1;
           case "V": return 5;
           case "X": return 10;
           case "L": return 50;
           case "C": return 100;
           case "D": return 500;
           case "M": return 1000;
           default: return 0;
       }
   }

   function romanToInt(s: string): number {
       let total = 0;

       for (let i = 0; i < s.length; i += 1) {
           const current = romanValue(s[i]);
           const next = i + 1 < s.length ? romanValue(s[i + 1]) : 0;
           total += current < next ? -current : current;
       }

       return total;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       private int Value(char symbol) {
           switch (symbol) {
               case 'I': return 1;
               case 'V': return 5;
               case 'X': return 10;
               case 'L': return 50;
               case 'C': return 100;
               case 'D': return 500;
               case 'M': return 1000;
               default: return 0;
           }
       }

       public int RomanToInt(string s) {
           int total = 0;

           for (int i = 0; i < s.Length; ++i) {
               int current = Value(s[i]);
               int next = i + 1 < s.Length ? Value(s[i + 1]) : 0;
               total += current < next ? -current : current;
           }

           return total;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function roman_to_int(s::String)::Int
       values = Dict(
           'I' => 1,
           'V' => 5,
           'X' => 10,
           'L' => 50,
           'C' => 100,
           'D' => 500,
           'M' => 1000,
       )
       chars = collect(s)
       total = 0

       for index in eachindex(chars)
           current = values[chars[index]]
           next_value = if index < lastindex(chars)
               values[chars[index + 1]]
           else
               0
           end
           total += current < next_value ? -current : current
       end

       return total
   end

R
~

.. code-block:: r

   romanToInt <- function(s) {
       values <- c(
           I = 1,
           V = 5,
           X = 10,
           L = 50,
           C = 100,
           D = 500,
           M = 1000
       )
       chars <- strsplit(s, "", fixed = TRUE)[[1]]
       total <- 0

       for (i in seq_along(chars)) {
           current <- unname(values[[chars[[i]]]])
           next_value <- if (i < length(chars)) {
               unname(values[[chars[[i + 1]]]])
           } else {
               0
           }
           total <- total + if (current < next_value) -current else current
       }

       total
   }

关键边界与易错点
----------------

* 最后一个字符没有右邻居，必须按正贡献处理；使用 ``next = 0`` 可以统一逻辑；
* 当前值小于下一个值时只减当前值，较大符号仍会在下一轮正常加入；
* 输入保证合法，不要为本题额外实现完整罗马数字语法校验器；
* ``VIII`` 中连续的小值都应相加，不能把所有较小符号都减去；
* Rust 和 Go 可以安全按字节扫描，因为罗马数字符号全部是单字节 ASCII；
* R 的命名向量索引会保留名称，使用 ``unname`` 让中间值保持普通数值。

新增与强化知识
--------------

新增
~~~~

* **局部减法扫描**：相邻符号大小关系直接决定当前字符的正负贡献；
* **有符号符号贡献**：把组合解析转化为每个字符只贡献一次的线性求和；
* **固定字符映射**：七个符号可用 ``switch``、``match`` 或小型字典表达。

强化
~~~~

* 0008 的单向字符扫描再次出现，但本题没有停止状态和溢出钳制；
* 0012 的罗马片段编码在本题中被反向解析；
* ASCII 约束允许 Rust、Go 等语言按字节索引而不破坏字符边界。

关联题目
--------

* `0012. Integer to Roman <0012-integer-to-roman.rst>`_：把整数编码为规范罗马数字；
* `0008. String to Integer (atoi) <0008-string-to-integer-atoi.rst>`_：另一种字符串到整数解析，
  需要处理空格、符号、停止位置和边界钳制。

最小自检
--------

#. 为什么 ``IV`` 中 ``I`` 要减，而 ``VI`` 中 ``V`` 和 ``I`` 都要加？
#. 为什么比较右邻居就足以识别减法组合？
#. ``MCM`` 的逐字符贡献是什么？
#. 最后一个字符为什么可以直接相加？
#. 输入无效时，这个算法是否负责报错？

答案要点
~~~~~~~~

#. ``I < V`` 表示减法对；``V > I`` 属于普通降序相加；
#. 合法罗马数字的减法只由紧邻的“小在大前”结构产生；
#. ``+1000 - 100 + 1000 = 1900``；
#. 它没有右邻居，不可能作为减法组合左半部分；
#. 不负责；题目保证输入合法。
