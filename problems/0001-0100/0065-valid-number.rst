0065. Valid Number
==================

题目信息
--------

:题号: 0065
:难度: Hard
:主题: 字符串、有限状态扫描、语法验证
:原题: `LeetCode 0065 <https://leetcode.com/problems/valid-number/>`_
:访问状态: Available
:教学重点: 局部语法约束、扫描状态、指数后的数字见证、ASCII 边界

题目重述
--------

给定一个非空字符串 ``s``，判断它是否完整表示一个合法十进制数。字符串只能由数字、正负号、
小数点以及字母 ``e`` 或 ``E`` 组成；不能忽略前导或尾随字符，也不接受空格。

合法形式由两部分组成：

* 底数可以是整数或小数，前面允许一个符号；
* 指数部分可选，以 ``e`` 或 ``E`` 开始，后面允许一个符号，但必须至少包含一个数字；
* 小数点只能出现在底数中，并且整个底数至少包含一个数字；
* 指数部分不允许小数点。

题目保证 ``1 <= s.length <= 20``。字符集合是 ASCII 子集，因此各语言可以按字节、UTF-16 代码单元
或字符扫描，位置与字符判断保持一致。

自建示例
--------

合法小数与指数
~~~~~~~~~~~~~~

.. code-block:: text

   输入：s = "-3.5E+2"
   输出：true
   解释：底数 -3.5 合法，指数 +2 也包含数字。

小数点两侧只需一侧有数字
~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：s = ".8"
   输出：true

   输入：s = "7."
   输出：true

指数缺少数字
~~~~~~~~~~~~

.. code-block:: text

   输入：s = "12e-"
   输出：false

符号位置错误
~~~~~~~~~~~~

.. code-block:: text

   输入：s = "4-2"
   输出：false

问题抽象
--------

不需要构造数值，也不需要处理浮点舍入。只需验证字符序列是否满足语法。扫描过程中维护四个布尔状态：

``seen_digit``
   到当前位置为止，底数或指数中是否已经见过数字。

``seen_dot``
   底数中是否已经见过小数点。

``seen_exp``
   是否已经进入指数部分。

``digit_after_exp``
   若出现过指数标记，其后是否已经见过数字。没有指数时初始化为 ``true``。

每种字符的合法条件如下：

* 数字始终可以读取，并更新数字见证；
* 正负号只允许出现在字符串开头，或紧跟 ``e`` / ``E``；
* 小数点只允许出现一次，并且必须位于指数之前；
* ``e`` / ``E`` 只允许出现一次，且它之前必须已经有数字；进入指数后，把
  ``digit_after_exp`` 设为 ``false``，等待后续数字恢复；
* 其他情况立即返回 ``false``。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 单向状态扫描
     - ``O(n)``
     - ``O(1)``
     - 主解法；状态直接对应语法约束
   * - 显式确定有限自动机
     - ``O(n)``
     - ``O(1)``
     - 状态表更形式化，但简单条件被拆成较多节点
   * - 正则表达式
     - 取决于引擎
     - 取决于引擎
     - 写法短，但隐藏状态与完整匹配边界
   * - 浮点解析 API
     - 取决于运行时
     - 取决于运行时
     - 各语言接受 NaN、Infinity、空白或后缀的规则不同

主解法：单向状态扫描
--------------------

核心不变量
~~~~~~~~~~

处理下标 ``index`` 之前：

* 已扫描前缀中的每个字符都位于其允许位置；
* ``seen_dot`` 与 ``seen_exp`` 准确记录相应标记是否出现；
* 若尚未出现指数，``seen_digit`` 表示底数已经拥有数字；
* 若已经出现指数，``digit_after_exp`` 表示指数部分已经拥有数字；
* 下标只向右移动，每个字符恰好检查一次。

为什么局部条件足够
~~~~~~~~~~~~~~~~~~

合法数字语法中，字符之间的依赖只有有限种：符号依赖前一个字符，小数点依赖是否出现过点和指数，
指数标记依赖此前数字以及是否已经出现过指数。无需保存完整前缀，只需保存这些有限状态。

扫描结束时同时要求 ``seen_digit`` 与 ``digit_after_exp`` 为真：前者排除 ``"."``、``"+"``、
``"e1"`` 等没有合法底数数字的输入；后者排除 ``"1e"`` 和 ``"1e-"`` 等指数未完成的输入。

正确性依据
~~~~~~~~~~

**合法性。** 算法只在规定位置接受符号，只在底数中接受至多一个小数点，只在已有底数数字后接受
至多一个指数标记，并要求指数后最终出现数字。因此返回 ``true`` 的字符串满足全部语法规则。

**完整性。** 任意合法字符串中的数字都会进入数字分支；底数的可选符号位于开头，指数符号紧跟
``e`` / ``E``；小数点至多一个且位于指数前；指数标记之前已有数字。每个合法字符都会通过对应条件，
扫描最终拥有底数数字和指数数字见证，因此算法不会拒绝合法字符串。

**终止性。** 下标每轮增加一次，输入长度有限，扫描必然结束。

复杂度
~~~~~~

设字符串长度为 ``n``：

* 每个字符执行常数次分类与状态更新，时间复杂度为 ``O(n)``；
* 只维护固定数量的布尔值和下标，算法额外空间为 ``O(1)``；
* Julia 和 R 的实现先取得 ASCII 码点或字节视图，需要 ``O(n)`` 辅助存储；其他实现直接扫描原字符串；
* 返回值是标量布尔值，不存在与输入规模相关的输出空间。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>

   bool isNumber(char *s) {
       bool seen_digit = false;
       bool seen_dot = false;
       bool seen_exp = false;
       bool digit_after_exp = true;

       for (size_t index = 0; s[index] != '\0'; ++index) {
           const char current = s[index];

           if (current >= '0' && current <= '9') {
               seen_digit = true;
               if (seen_exp) {
                   digit_after_exp = true;
               }
           } else if (current == '+' || current == '-') {
               // 符号只能位于开头，或紧跟指数标记。
               if (index != 0 && s[index - 1] != 'e' &&
                   s[index - 1] != 'E') {
                   return false;
               }
           } else if (current == '.') {
               if (seen_dot || seen_exp) {
                   return false;
               }
               seen_dot = true;
           } else if (current == 'e' || current == 'E') {
               if (seen_exp || !seen_digit) {
                   return false;
               }
               seen_exp = true;
               digit_after_exp = false;
           } else {
               return false;
           }
       }

       return seen_digit && digit_after_exp;
   }

C++
~~~

.. code-block:: cpp

   #include <string>

   class Solution {
   public:
       bool isNumber(const std::string& s) {
           bool seenDigit = false;
           bool seenDot = false;
           bool seenExp = false;
           bool digitAfterExp = true;

           for (std::size_t index = 0; index < s.size(); ++index) {
               const char current = s[index];

               if (current >= '0' && current <= '9') {
                   seenDigit = true;
                   if (seenExp) {
                       digitAfterExp = true;
                   }
               } else if (current == '+' || current == '-') {
                   if (index != 0 && s[index - 1] != 'e' &&
                       s[index - 1] != 'E') {
                       return false;
                   }
               } else if (current == '.') {
                   if (seenDot || seenExp) {
                       return false;
                   }
                   seenDot = true;
               } else if (current == 'e' || current == 'E') {
                   if (seenExp || !seenDigit) {
                       return false;
                   }
                   seenExp = true;
                   digitAfterExp = false;
               } else {
                   return false;
               }
           }

           return seenDigit && digitAfterExp;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isNumber(self, s: str) -> bool:
           seen_digit = False
           seen_dot = False
           seen_exp = False
           digit_after_exp = True

           for index, current in enumerate(s):
               if "0" <= current <= "9":
                   seen_digit = True
                   if seen_exp:
                       digit_after_exp = True
               elif current in "+-":
                   if index != 0 and s[index - 1] not in "eE":
                       return False
               elif current == ".":
                   if seen_dot or seen_exp:
                       return False
                   seen_dot = True
               elif current in "eE":
                   if seen_exp or not seen_digit:
                       return False
                   seen_exp = True
                   digit_after_exp = False
               else:
                   return False

           return seen_digit and digit_after_exp

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isNumber(String s) {
           boolean seenDigit = false;
           boolean seenDot = false;
           boolean seenExp = false;
           boolean digitAfterExp = true;

           for (int index = 0; index < s.length(); ++index) {
               char current = s.charAt(index);

               if (current >= '0' && current <= '9') {
                   seenDigit = true;
                   if (seenExp) {
                       digitAfterExp = true;
                   }
               } else if (current == '+' || current == '-') {
                   if (index != 0 && s.charAt(index - 1) != 'e' &&
                       s.charAt(index - 1) != 'E') {
                       return false;
                   }
               } else if (current == '.') {
                   if (seenDot || seenExp) {
                       return false;
                   }
                   seenDot = true;
               } else if (current == 'e' || current == 'E') {
                   if (seenExp || !seenDigit) {
                       return false;
                   }
                   seenExp = true;
                   digitAfterExp = false;
               } else {
                   return false;
               }
           }

           return seenDigit && digitAfterExp;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_number(s: String) -> bool {
           let bytes = s.as_bytes();
           let mut seen_digit = false;
           let mut seen_dot = false;
           let mut seen_exp = false;
           let mut digit_after_exp = true;

           for (index, &current) in bytes.iter().enumerate() {
               match current {
                   b'0'..=b'9' => {
                       seen_digit = true;
                       if seen_exp {
                           digit_after_exp = true;
                       }
                   }
                   b'+' | b'-' => {
                       if index != 0 && bytes[index - 1] != b'e' &&
                           bytes[index - 1] != b'E'
                       {
                           return false;
                       }
                   }
                   b'.' => {
                       if seen_dot || seen_exp {
                           return false;
                       }
                       seen_dot = true;
                   }
                   b'e' | b'E' => {
                       if seen_exp || !seen_digit {
                           return false;
                       }
                       seen_exp = true;
                       digit_after_exp = false;
                   }
                   _ => return false,
               }
           }

           seen_digit && digit_after_exp
       }
   }

Go
~~

.. code-block:: go

   func isNumber(s string) bool {
       seenDigit := false
       seenDot := false
       seenExp := false
       digitAfterExp := true

       for index := 0; index < len(s); index++ {
           current := s[index]

           if current >= '0' && current <= '9' {
               seenDigit = true
               if seenExp {
                   digitAfterExp = true
               }
           } else if current == '+' || current == '-' {
               if index != 0 && s[index-1] != 'e' && s[index-1] != 'E' {
                   return false
               }
           } else if current == '.' {
               if seenDot || seenExp {
                   return false
               }
               seenDot = true
           } else if current == 'e' || current == 'E' {
               if seenExp || !seenDigit {
                   return false
               }
               seenExp = true
               digitAfterExp = false
           } else {
               return false
           }
       }

       return seenDigit && digitAfterExp
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isNumber(s: string): boolean {
       let seenDigit = false;
       let seenDot = false;
       let seenExp = false;
       let digitAfterExp = true;

       for (let index = 0; index < s.length; index += 1) {
           const current = s[index];

           if (current >= "0" && current <= "9") {
               seenDigit = true;
               if (seenExp) {
                   digitAfterExp = true;
               }
           } else if (current === "+" || current === "-") {
               if (index !== 0 && s[index - 1] !== "e" &&
                   s[index - 1] !== "E") {
                   return false;
               }
           } else if (current === ".") {
               if (seenDot || seenExp) {
                   return false;
               }
               seenDot = true;
           } else if (current === "e" || current === "E") {
               if (seenExp || !seenDigit) {
                   return false;
               }
               seenExp = true;
               digitAfterExp = false;
           } else {
               return false;
           }
       }

       return seenDigit && digitAfterExp;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsNumber(string s) {
           bool seenDigit = false;
           bool seenDot = false;
           bool seenExp = false;
           bool digitAfterExp = true;

           for (int index = 0; index < s.Length; ++index) {
               char current = s[index];

               if (current >= '0' && current <= '9') {
                   seenDigit = true;
                   if (seenExp) {
                       digitAfterExp = true;
                   }
               } else if (current == '+' || current == '-') {
                   if (index != 0 && s[index - 1] != 'e' &&
                       s[index - 1] != 'E') {
                       return false;
                   }
               } else if (current == '.') {
                   if (seenDot || seenExp) {
                       return false;
                   }
                   seenDot = true;
               } else if (current == 'e' || current == 'E') {
                   if (seenExp || !seenDigit) {
                       return false;
                   }
                   seenExp = true;
                   digitAfterExp = false;
               } else {
                   return false;
               }
           }

           return seenDigit && digitAfterExp;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function isNumber(s::String)::Bool
       bytes = codeunits(s)
       seen_digit = false
       seen_dot = false
       seen_exp = false
       digit_after_exp = true

       for index in eachindex(bytes)
           current = bytes[index]

           if UInt8('0') <= current <= UInt8('9')
               seen_digit = true
               if seen_exp
                   digit_after_exp = true
               end
           elseif current == UInt8('+') || current == UInt8('-')
               if index != firstindex(bytes) &&
                   bytes[index - 1] != UInt8('e') &&
                   bytes[index - 1] != UInt8('E')
                   return false
               end
           elseif current == UInt8('.')
               if seen_dot || seen_exp
                   return false
               end
               seen_dot = true
           elseif current == UInt8('e') || current == UInt8('E')
               if seen_exp || !seen_digit
                   return false
               end
               seen_exp = true
               digit_after_exp = false
           else
               return false
           end
       end

       return seen_digit && digit_after_exp
   end

``codeunits`` 返回字符串的 UTF-8 代码单元视图；题目字符域是 ASCII，因此每个语法字符占一个字节，
``index - 1`` 不会落入多字节字符内部。

R
~

.. code-block:: r

   isNumber <- function(s) {
     bytes <- utf8ToInt(s)
     seen_digit <- FALSE
     seen_dot <- FALSE
     seen_exp <- FALSE
     digit_after_exp <- TRUE

     for (index in seq_along(bytes)) {
       current <- bytes[index]

       if (current >= utf8ToInt("0") && current <= utf8ToInt("9")) {
         seen_digit <- TRUE
         if (seen_exp) {
           digit_after_exp <- TRUE
         }
       } else if (current == utf8ToInt("+") || current == utf8ToInt("-")) {
         if (index != 1L && bytes[index - 1L] != utf8ToInt("e") &&
             bytes[index - 1L] != utf8ToInt("E")) {
           return(FALSE)
         }
       } else if (current == utf8ToInt(".")) {
         if (seen_dot || seen_exp) {
           return(FALSE)
         }
         seen_dot <- TRUE
       } else if (current == utf8ToInt("e") || current == utf8ToInt("E")) {
         if (seen_exp || !seen_digit) {
           return(FALSE)
         }
         seen_exp <- TRUE
         digit_after_exp <- FALSE
       } else {
         return(FALSE)
       }
     }

     seen_digit && digit_after_exp
   }

R 的 ``utf8ToInt`` 创建码点向量，因此空间为 ``O(n)``。输入只含 ASCII，码点判断与其他语言的字节判断
等价。

对照解法：显式有限状态机
------------------------

可以把“开始、符号、整数、小数点、小数、指数、指数符号、指数数字”建成显式状态表，并按字符类别转移。
该方法适合语法继续扩展时统一管理；当前规则使用四个布尔状态更紧凑，且每条约束直接出现在代码中。

验证计划与证据
--------------

* 正常用例覆盖整数、小数、带符号底数和带符号指数；
* 边界用例覆盖 ``"."``、``"3."``、``".3"``、``"1e"``、``"1e+"``、重复点和重复指数；
* Python 使用独立正则完整匹配器枚举短字符串对拍；
* C、C++、Java、Go 和 TypeScript 执行固定用例；
* Rust、C#、Julia、R 在缺少运行时时进行接口、索引与状态静态检查。

关键边界
--------

* ``"+"`` 和 ``"."`` 都没有数字，必须拒绝；
* ``"3."`` 与 ``".3"`` 合法，小数点两侧不要求同时有数字；
* 指数之前必须已有数字，指数之后也必须最终出现数字；
* 指数符号只能紧跟 ``e`` / ``E``，不能出现在指数数字之间；
* 输入不包含可忽略空格，算法要求完整消费整个字符串。

易错点
------

* 只记录“见过数字”却不重置指数后的数字见证，会错误接受 ``"1e"``；
* 允许小数点出现在指数后，会错误接受 ``"1e2.3"``；
* 用语言浮点解析 API 代替语法验证，可能接受题目之外的表示；
* 正则表达式若缺少完整匹配锚点，会把非法后缀忽略。

本题新增知识
------------

* 用有限布尔状态表达数字字面量语法；
* 指数标记将“后续必须出现数字”转化为待满足见证；
* 从局部字符位置约束证明完整语法。

本题强化知识
------------

* ASCII 字符域使字节、UTF-16 代码单元和码点扫描等价；
* 单向扫描的不变量与终止性；
* 不使用通用解析 API 代替题目专属契约。

关联题目
--------

* `0008. String to Integer (atoi) <0008-string-to-integer-atoi.rst>`_：两题都按阶段扫描数字字符串；
  0008 构造并钳制整数，本题只验证更丰富的语法。
* `0058. Length of Last Word <0058-length-of-last-word.rst>`_：两题都依赖精确 ASCII 字符契约，
  但本题需要维护跨字符的语法状态。

最小自检
--------

#. 为什么 ``seen_digit`` 不能替代 ``digit_after_exp``？
#. 小数点为什么不允许出现在指数之后？
#. 符号的两个合法位置分别是什么？
#. 哪些语言实现因预先转换字符序列而使用 ``O(n)`` 空间？
#. 哪些验证属于运行、对拍和静态检查？

答案要点
~~~~~~~~

#. ``"1e"`` 已见过底数数字，但指数部分没有数字，因此必须单独维护指数后的数字见证。
#. 指数被定义为整数，小数点只属于底数。
#. 字符串开头，以及紧跟 ``e`` / ``E``。
#. Julia 的 ``codeunits`` 是视图，不复制；R 的 ``utf8ToInt`` 创建 ``O(n)`` 向量。
#. 可用运行时执行固定用例，Python 与独立正则对拍，缺失运行时的语言只做静态检查。
