0091. Decode Ways
=================

题目信息
--------

:题号: 0091
:难度: Medium
:主题: 字符串、动态规划、强制分隔、滚动状态
:原题: `LeetCode 0091 <https://leetcode.com/problems/decode-ways/>`_
:访问状态: Available
:教学重点: 零的强制配对、无零段分解、滚动 DP、固定宽中间值安全

题目重述
--------

数字 ``1`` 到 ``26`` 分别映射到字母 ``A`` 到 ``Z``。给定一个只包含十进制数字的非空字符串
``s``，返回把整个字符串划分为合法一位或两位编码的方案数量。

一位编码只能是 ``1..9``；两位编码只能是 ``10..26``。字符 ``0`` 不能单独解码。题目保证
``1 <= len(s) <= 100``，答案适合 32 位有符号整数。输入字符串只读。

自建示例
--------

.. code-block:: text

   输入：s = "11106"
   输出：2

合法划分只有：

.. code-block:: text

   1 | 1 | 10 | 6
   11 | 10 | 6

``0`` 强制与前面的 ``1`` 组成 ``10``，不能使用 ``1 | 0`` 或 ``06``。

零的边界
~~~~~~~~

.. code-block:: text

   "1010" -> 1
   "30"   -> 0
   "06"   -> 0

问题抽象
--------

普通滚动 DP 可以用前两个前缀计数决定当前计数。该题的关键边界是 ``0``：合法 ``0`` 必须与前一位
``1`` 或 ``2`` 组成唯一的 ``10`` 或 ``20``，并同时消费这两个字符。

因此每个合法零都会把字符串切开：零前一位属于强制双字符编码，不能再与更左字符组合；零之后也不会
与零左侧跨界组合。字符串可分解为若干个不含零的片段和若干个固定的 ``10`` / ``20``。总方案数等于
各无零片段方案数的乘积。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 先验证零，再分段执行滚动 DP
     - ``O(n)``
     - ``O(1)``
     - 主解法；额外闭合固定宽中间值安全
   * - 直接对完整字符串执行滚动 DP
     - ``O(n)``
     - ``O(1)``
     - 常见写法，但需要额外解释任意前缀计数的宽度
   * - 记忆化递归枚举一位与两位编码
     - ``O(n)``
     - ``O(n)``
     - 状态直观，但使用递归栈和缓存

主解法：零分段与段内滚动 DP
--------------------------

第一阶段：验证全部零
~~~~~~~~~~~~~~~~~~~~

扫描字符串。若 ``s[index] == '0'``，它的前一位必须存在且等于 ``'1'`` 或 ``'2'``。否则整个字符串
无法完整解码，立即返回 ``0``。

先完成该只读验证，再开始计数。这样含有非法零的字符串不会先积累一个巨大但最终无用的前缀计数。

第二阶段：强制配对切分
~~~~~~~~~~~~~~~~~~~~

合法零与前一位形成固定编码 ``10`` 或 ``20``。遇到零时：

* 计算从当前片段起点到“零的前一位之前”的无零片段方案数；
* 把该因子乘入总方案数；
* 跳过已经被强制配对消费的前一位和零；
* 从零之后开始新的无零片段。

空片段和单字符片段都只有一种解码方式，因此因子为 ``1``。

第三阶段：无零片段滚动 DP
~~~~~~~~~~~~~~~~~~~~~~~~

无零片段中的每个字符都能单独解码。维护：

.. code-block:: text

   previous_two = 当前字符之前两个位置的前缀方案数
   previous_one = 当前字符之前一个位置的前缀方案数

加入新字符时，单字符选择总是贡献 ``previous_one``。若相邻两位组成 ``11..26``，再贡献
``previous_two``：

.. code-block:: text

   current = previous_one
   if pair <= 26:
       current += previous_two

由于片段不含零，两位数最小为 ``11``，只需检查上界 ``26``。

为什么分段后可以相乘
~~~~~~~~~~~~~~~~~~~~

设某个零位于 ``index``。任何合法解码都必须把 ``s[index-1:index+1]`` 作为一个完整的 ``10`` 或
``20``。因此：

* 零左侧更早字符的最后一个编码不能使用 ``index-1``；
* 零右侧第一个编码不能跨过零；
* 强制双字符编码本身只有一种选择。

零两侧的解码选择彼此独立，组合数量等于左右方案数的乘积。对所有零重复应用该结论，就得到所有无零
片段方案数的乘积。

正确性依据
~~~~~~~~~~

**非法零判定正确。** ``0`` 只能出现在 ``10`` 或 ``20`` 中；其他前驱都无法形成合法一位或两位编码。

**片段 DP 正确。** 无零片段的最后一个编码只有两种可能：最后一位单独使用，或最后两位组成
``11..26``。两个集合互斥且覆盖全部方案，滚动转移正好求和。

**分段组合正确。** 每个零强制消费其前一位，阻断所有跨边界编码；独立片段方案通过笛卡尔积组合。

**完整性与唯一性。** 每个合法解码在每个无零片段内对应唯一 DP 选择，并包含全部固定 ``10`` /
``20``；反向组合任意片段方案也会得到唯一合法全串解码。

**终止性。** 验证和计数扫描都单调向右；段内循环也只遍历各字符一次。

复杂度与数值安全
~~~~~~~~~~~~~~~~

设字符串长度为 ``n``：

* 零验证扫描 ``O(n)``，分段计数总共再次访问 ``O(n)`` 个字符；
* 总时间复杂度为 ``O(n)``；
* 只保存常数个下标和滚动计数，工作空间为 ``O(1)``；
* 字符串由 ASCII 数字组成，各语言按字节或 UTF-16 代码单元访问都与字符位置一致；
* 对合法字符串，每个无零片段的 DP 计数单调不减，任一中间值不超过该片段最终因子；
* 各片段因子都至少为 1，部分乘积不超过最终答案；题目保证最终答案适合 32 位，因此固定宽语言的
  全部实际计数也适合 32 位；
* 对非法字符串，第一阶段在计数前返回 ``0``，不会依赖可能溢出的无用前缀状态。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <string.h>

   static int count_nonzero_segment(
       const char *digits,
       int start,
       int end
   ) {
       if (end - start <= 1) {
           return 1;
       }

       int previous_two = 1;
       int previous_one = 1;
       for (int index = start + 1; index < end; ++index) {
           int current = previous_one;
           const int pair =
               (digits[index - 1] - '0') * 10 + (digits[index] - '0');
           if (pair <= 26) {
               current += previous_two;
           }
           previous_two = previous_one;
           previous_one = current;
       }
       return previous_one;
   }

   int numDecodings(char *s) {
       const int length = (int)strlen(s);

       for (int index = 0; index < length; ++index) {
           if (s[index] == '0' &&
               (index == 0 || s[index - 1] < '1' || s[index - 1] > '2')) {
               return 0;
           }
       }

       int ways = 1;
       int start = 0;
       for (int index = 0; index < length; ++index) {
           if (s[index] == '0') {
               ways *= count_nonzero_segment(s, start, index - 1);
               start = index + 1;
           }
       }
       ways *= count_nonzero_segment(s, start, length);
       return ways;
   }

C++
~~~

.. code-block:: cpp

   #include <string>

   class Solution {
       static int countSegment(
           const std::string& digits,
           int start,
           int end
       ) {
           if (end - start <= 1) {
               return 1;
           }

           int previousTwo = 1;
           int previousOne = 1;
           for (int index = start + 1; index < end; ++index) {
               int current = previousOne;
               int pair =
                   (digits[index - 1] - '0') * 10 + (digits[index] - '0');
               if (pair <= 26) {
                   current += previousTwo;
               }
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       }

   public:
       int numDecodings(std::string s) {
           for (int index = 0; index < static_cast<int>(s.size()); ++index) {
               if (s[index] == '0' &&
                   (index == 0 || s[index - 1] < '1' || s[index - 1] > '2')) {
                   return 0;
               }
           }

           int ways = 1;
           int start = 0;
           for (int index = 0; index < static_cast<int>(s.size()); ++index) {
               if (s[index] == '0') {
                   ways *= countSegment(s, start, index - 1);
                   start = index + 1;
               }
           }
           ways *= countSegment(s, start, static_cast<int>(s.size()));
           return ways;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def numDecodings(self, s: str) -> int:
           def count_segment(start: int, end: int) -> int:
               if end - start <= 1:
                   return 1

               previous_two = 1
               previous_one = 1
               for index in range(start + 1, end):
                   current = previous_one
                   pair = int(s[index - 1:index + 1])
                   if pair <= 26:
                       current += previous_two
                   previous_two, previous_one = previous_one, current
               return previous_one

           for index, digit in enumerate(s):
               if digit == "0" and (
                   index == 0 or s[index - 1] not in {"1", "2"}
               ):
                   return 0

           ways = 1
           start = 0
           for index, digit in enumerate(s):
               if digit == "0":
                   ways *= count_segment(start, index - 1)
                   start = index + 1
           ways *= count_segment(start, len(s))
           return ways

Java
~~~~

.. code-block:: java

   class Solution {
       public int numDecodings(String s) {
           for (int index = 0; index < s.length(); ++index) {
               if (s.charAt(index) == '0' &&
                   (index == 0 || s.charAt(index - 1) < '1' ||
                    s.charAt(index - 1) > '2')) {
                   return 0;
               }
           }

           int ways = 1;
           int start = 0;
           for (int index = 0; index < s.length(); ++index) {
               if (s.charAt(index) == '0') {
                   ways *= countSegment(s, start, index - 1);
                   start = index + 1;
               }
           }
           ways *= countSegment(s, start, s.length());
           return ways;
       }

       private static int countSegment(String digits, int start, int end) {
           if (end - start <= 1) {
               return 1;
           }

           int previousTwo = 1;
           int previousOne = 1;
           for (int index = start + 1; index < end; ++index) {
               int current = previousOne;
               int pair =
                   (digits.charAt(index - 1) - '0') * 10 +
                   (digits.charAt(index) - '0');
               if (pair <= 26) {
                   current += previousTwo;
               }
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn num_decodings(s: String) -> i32 {
           fn count_segment(digits: &[u8], start: usize, end: usize) -> i32 {
               if end - start <= 1 {
                   return 1;
               }

               let mut previous_two = 1;
               let mut previous_one = 1;
               for index in (start + 1)..end {
                   let mut current = previous_one;
                   let pair =
                       (digits[index - 1] - b'0') * 10 + (digits[index] - b'0');
                   if pair <= 26 {
                       current += previous_two;
                   }
                   previous_two = previous_one;
                   previous_one = current;
               }
               previous_one
           }

           let digits = s.as_bytes();
           for index in 0..digits.len() {
               if digits[index] == b'0' &&
                   (index == 0 || digits[index - 1] < b'1' ||
                    digits[index - 1] > b'2') {
                   return 0;
               }
           }

           let mut ways = 1;
           let mut start = 0;
           for index in 0..digits.len() {
               if digits[index] == b'0' {
                   ways *= count_segment(digits, start, index - 1);
                   start = index + 1;
               }
           }
           ways * count_segment(digits, start, digits.len())
       }
   }

Go
~~

.. code-block:: go

   func numDecodings(s string) int {
       for index := 0; index < len(s); index++ {
           if s[index] == '0' &&
               (index == 0 || s[index-1] < '1' || s[index-1] > '2') {
               return 0
           }
       }

       countSegment := func(start int, end int) int {
           if end-start <= 1 {
               return 1
           }

           previousTwo := 1
           previousOne := 1
           for index := start + 1; index < end; index++ {
               current := previousOne
               pair := int(s[index-1]-'0')*10 + int(s[index]-'0')
               if pair <= 26 {
                   current += previousTwo
               }
               previousTwo = previousOne
               previousOne = current
           }
           return previousOne
       }

       ways := 1
       start := 0
       for index := 0; index < len(s); index++ {
           if s[index] == '0' {
               ways *= countSegment(start, index-1)
               start = index + 1
           }
       }
       return ways * countSegment(start, len(s))
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function numDecodings(s: string): number {
       for (let index = 0; index < s.length; index += 1) {
           if (
               s[index] === "0" &&
               (index === 0 || s[index - 1] < "1" || s[index - 1] > "2")
           ) {
               return 0;
           }
       }

       const countSegment = (start: number, end: number): number => {
           if (end - start <= 1) {
               return 1;
           }

           let previousTwo = 1;
           let previousOne = 1;
           for (let index = start + 1; index < end; index += 1) {
               let current = previousOne;
               const pair = Number(s.slice(index - 1, index + 1));
               if (pair <= 26) {
                   current += previousTwo;
               }
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       };

       let ways = 1;
       let start = 0;
       for (let index = 0; index < s.length; index += 1) {
           if (s[index] === "0") {
               ways *= countSegment(start, index - 1);
               start = index + 1;
           }
       }
       return ways * countSegment(start, s.length);
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int NumDecodings(string s) {
           for (int index = 0; index < s.Length; ++index) {
               if (s[index] == '0' &&
                   (index == 0 || s[index - 1] < '1' || s[index - 1] > '2')) {
                   return 0;
               }
           }

           int ways = 1;
           int start = 0;
           for (int index = 0; index < s.Length; ++index) {
               if (s[index] == '0') {
                   ways *= CountSegment(s, start, index - 1);
                   start = index + 1;
               }
           }
           ways *= CountSegment(s, start, s.Length);
           return ways;
       }

       private static int CountSegment(string digits, int start, int end) {
           if (end - start <= 1) {
               return 1;
           }

           int previousTwo = 1;
           int previousOne = 1;
           for (int index = start + 1; index < end; ++index) {
               int current = previousOne;
               int pair =
                   (digits[index - 1] - '0') * 10 + (digits[index] - '0');
               if (pair <= 26) {
                   current += previousTwo;
               }
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function num_decodings(s::String)::Int
       digits = codeunits(s)

       for index in eachindex(digits)
           if digits[index] == UInt8('0') &&
              (index == 1 || digits[index - 1] < UInt8('1') ||
               digits[index - 1] > UInt8('2'))
               return 0
           end
       end

       function count_segment(start::Int, stop::Int)::Int
           if stop - start <= 1
               return 1
           end

           previous_two = 1
           previous_one = 1
           for index in (start + 1):(stop - 1)
               current = previous_one
               pair =
                   Int(digits[index] - UInt8('0')) * 10 +
                   Int(digits[index + 1] - UInt8('0'))
               if pair <= 26
                   current += previous_two
               end
               previous_two = previous_one
               previous_one = current
           end
           return previous_one
       end

       ways = 1
       start = 0
       for index in eachindex(digits)
           if digits[index] == UInt8('0')
               ways *= count_segment(start, index - 2)
               start = index
           end
       end
       return ways * count_segment(start, length(digits))
   end

R
~

.. code-block:: r

   num_decodings <- function(s) {
     digits <- utf8ToInt(s) - utf8ToInt("0")
     length_s <- length(digits)

     for (index in seq_len(length_s)) {
       if (
         digits[index] == 0L &&
         (index == 1L || digits[index - 1L] < 1L || digits[index - 1L] > 2L)
       ) {
         return(0L)
       }
     }

     count_segment <- function(start, stop) {
       if (stop - start <= 1L) {
         return(1L)
       }

       previous_two <- 1L
       previous_one <- 1L
       for (index in seq.int(start + 2L, stop)) {
         current <- previous_one
         pair <- digits[index - 1L] * 10L + digits[index]
         if (pair <= 26L) {
           current <- current + previous_two
         }
         previous_two <- previous_one
         previous_one <- current
       }
       previous_one
     }

     ways <- 1L
     start <- 0L
     for (index in seq_len(length_s)) {
       if (digits[index] == 0L) {
         ways <- ways * count_segment(start, index - 2L)
         start <- index
       }
     }
     ways * count_segment(start, length_s)
   }

验证计划与证据
--------------

本批次执行：

* 固定用例覆盖 ``12``、``226``、``06``、``11106``、``2101``、``1010``、``27``、``10``、
  ``20`` 和 ``30``；
* Python 生成 30,000 个长度 ``1..16`` 的随机数字串，与独立记忆化枚举基准对拍；
* C、C++、Java、Go 和 TypeScript 各执行 10,000 组随机对拍；
* 使用 98 个 ``1`` 后接 ``30`` 的长度 100 字符串，验证非法零会在计数前返回 ``0``；
* C、C++ 通过严格警告、ASan 和 UBSan。

Rust、C#、Julia 和 R 在当前环境执行 ASCII、索引换算、段边界和固定宽计数的静态检查。

关键边界
--------

* 字符串首位为 ``0`` 时立即无解；
* ``10`` 和 ``20`` 只有一种解码，``30``、``00``、``06`` 无解；
* 零前一位被强制双字符编码消费，不能包含在左侧无零片段中；
* 无零片段为空或长度为 1 时方案数为 1；
* 主算法支持长度 100，不使用递归栈，也不构造子串集合。

易错点
------

* 把 ``0`` 当作普通单字符会错误接受 ``06``；
* 遇到零时只检查前一位，却忘记把前一位从左片段排除，会重复计算跨越强制配对的方案；
* 对无零片段检查两位编码时忘记 ``<= 26``，会错误接受 ``27``、``99``；
* 直接把“最终答案适合 32 位”外推到任意无效字符串的所有前缀计数，数值论证并不闭合；
* Julia 和 R 的一基位置需要与正文中的半开片段边界逐项换算。

本题新增知识
------------

* 合法零形成 ``10`` / ``20`` 强制编码，并把字符串分解为独立无零片段；
* 通过片段因子与最终答案的单调关系闭合固定宽中间计数安全；
* 无零数字片段的解码数使用两状态滚动 DP。

本题强化知识
------------

* 与 `0070. Climbing Stairs <0070-climbing-stairs.rst>`_ 相同的二阶滚动递推；
* ASCII 数字域支撑跨语言按字节或代码单元索引；
* 动态规划证明需要覆盖状态充分性、互斥转移、初始化和遍历顺序。

关联题目
--------

* `0070. Climbing Stairs <0070-climbing-stairs.rst>`_：同样由前两个状态决定当前计数；
* `0072. Edit Distance <0072-edit-distance.rst>`_：更一般的字符串前缀动态规划与滚动状态压缩。

最小自检
--------

#. 为什么每个合法零都会阻断左右两侧的编码选择？
#. 无零片段中为什么只检查两位数上界 ``26``？
#. 为什么片段计数与部分乘积都不会超过合法字符串的最终答案？
#. ``11106`` 的左片段为什么是前两个 ``1``，而不是前三个 ``1``？

答案要点
~~~~~~~~

#. 零必须与前一位组成固定 ``10`` 或 ``20``，前一位不能再参与左侧编码，零也不能参与右侧编码。
#. 两位都非零时最小值是 ``11``，下界自动满足，只需排除大于 ``26`` 的组合。
#. 片段内部计数单调不减；合法片段因子均至少为 1，任一部分乘积不超过全部因子的乘积。
#. 第三个 ``1`` 已经与 ``0`` 组成强制 ``10``，不能同时属于左侧自由片段。
