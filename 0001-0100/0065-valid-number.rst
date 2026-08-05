0065. Valid Number
==================

题目信息
--------

:题号: 0065
:难度: Hard
:主题: 字符串、语法解析、有限状态机
:原题: `LeetCode 0065 <https://leetcode.com/problems/valid-number/>`_
:重点: 从分段匹配数字语法，推导到用有限见证变量完成一次扫描

题目重述
--------

给定字符串 ``s``，判断它是否完整表示一个合法十进制数。

底数可以是整数或小数，并允许一个可选的前导 ``+`` 或 ``-``。合法小数必须至少包含一个数字，因此
``"2."``、``".8"`` 和 ``"2.8"`` 都合法，单独的 ``"."`` 不合法。

底数后可以出现一个可选的指数部分。指数以 ``e`` 或 ``E`` 开始，后面可以有一个符号，并且必须包含至少
一个数字。指数只能是整数，不能包含小数点。

整个字符串都必须被上述语法消费，不能出现额外字符。约束为 ``1 <= s.length <= 20``，字符只可能是
英文字母、数字、加号、减号或小数点。

自建示例
--------

.. code-block:: text

   输入：s = "-.9e-2"
   输出：true

底数 ``-.9`` 至少包含一个数字，指数 ``-2`` 是带符号整数。

.. code-block:: text

   输入：s = "46.e3"
   输出：true

小数点前已有数字，所以 ``46.`` 是合法底数；指数 ``3`` 也完整。

.. code-block:: text

   输入：s = "1e+"
   输出：false

指数符号后没有数字，指数部分未完成。

.. code-block:: text

   输入：s = "1.2.3"
   输出：false

底数中只能出现一个小数点。

C++ 实现
--------

.. code-block:: cpp

   #include <string>

   class Solution {
   private:
       enum class State {
           Start,
           Sign,
           Integer,
           PointWithoutInteger,
           PointAfterInteger,
           Fraction,
           Exponent,
           ExponentSign,
           ExponentInteger,
           Invalid
       };

       bool isDigit(char ch) {
           return ch >= '0' && ch <= '9';
       }

       bool isSign(char ch) {
           return ch == '+' || ch == '-';
       }

       bool isExponent(char ch) {
           return ch == 'e' || ch == 'E';
       }

       bool parseDigits(const std::string& s, int& index) {
           const int start = index;
           while (index < static_cast<int>(s.size()) && isDigit(s[index])) {
               ++index;
           }
           return index > start;
       }

       bool grammarParser(const std::string& s) {
           int index = 0;
           const int length = static_cast<int>(s.size());

           if (index < length && isSign(s[index])) {
               ++index;
           }

           const bool integerDigits = parseDigits(s, index);
           bool fractionDigits = false;
           if (index < length && s[index] == '.') {
               ++index;
               fractionDigits = parseDigits(s, index);
           }

           if (!integerDigits && !fractionDigits) {
               return false;
           }

           if (index < length && isExponent(s[index])) {
               ++index;
               if (index < length && isSign(s[index])) {
                   ++index;
               }
               if (!parseDigits(s, index)) {
                   return false;
               }
           }

           return index == length;
       }

       bool finiteStateMachine(const std::string& s) {
           State state = State::Start;

           for (char ch : s) {
               const bool digit = isDigit(ch);

               switch (state) {
                   case State::Start:
                       if (digit) {
                           state = State::Integer;
                       } else if (isSign(ch)) {
                           state = State::Sign;
                       } else if (ch == '.') {
                           state = State::PointWithoutInteger;
                       } else {
                           state = State::Invalid;
                       }
                       break;

                   case State::Sign:
                       if (digit) {
                           state = State::Integer;
                       } else if (ch == '.') {
                           state = State::PointWithoutInteger;
                       } else {
                           state = State::Invalid;
                       }
                       break;

                   case State::Integer:
                       if (digit) {
                           state = State::Integer;
                       } else if (ch == '.') {
                           state = State::PointAfterInteger;
                       } else if (isExponent(ch)) {
                           state = State::Exponent;
                       } else {
                           state = State::Invalid;
                       }
                       break;

                   case State::PointWithoutInteger:
                       state = digit ? State::Fraction : State::Invalid;
                       break;

                   case State::PointAfterInteger:
                   case State::Fraction:
                       if (digit) {
                           state = State::Fraction;
                       } else if (isExponent(ch)) {
                           state = State::Exponent;
                       } else {
                           state = State::Invalid;
                       }
                       break;

                   case State::Exponent:
                       if (digit) {
                           state = State::ExponentInteger;
                       } else if (isSign(ch)) {
                           state = State::ExponentSign;
                       } else {
                           state = State::Invalid;
                       }
                       break;

                   case State::ExponentSign:
                   case State::ExponentInteger:
                       state = digit ? State::ExponentInteger : State::Invalid;
                       break;

                   case State::Invalid:
                       return false;
               }

               if (state == State::Invalid) {
                   return false;
               }
           }

           return state == State::Integer ||
                  state == State::PointAfterInteger ||
                  state == State::Fraction ||
                  state == State::ExponentInteger;
       }

       bool witnessScan(const std::string& s) {
           bool seenDigit = false;
           bool seenDot = false;
           bool seenExponent = false;
           bool digitAfterExponent = true;

           for (int index = 0; index < static_cast<int>(s.size()); ++index) {
               const char ch = s[index];

               if (isDigit(ch)) {
                   seenDigit = true;
                   if (seenExponent) {
                       digitAfterExponent = true;
                   }
               } else if (isSign(ch)) {
                   const bool atStart = index == 0;
                   const bool afterExponent =
                       index > 0 && isExponent(s[index - 1]);
                   if (!atStart && !afterExponent) {
                       return false;
                   }
               } else if (ch == '.') {
                   if (seenDot || seenExponent) {
                       return false;
                   }
                   seenDot = true;
               } else if (isExponent(ch)) {
                   if (seenExponent || !seenDigit) {
                       return false;
                   }
                   seenExponent = true;
                   digitAfterExponent = false;
               } else {
                   return false;
               }
           }

           return seenDigit && digitAfterExponent;
       }

   public:
       bool isNumber(std::string s) {
           return witnessScan(s);
       }
   };

题解
----

语法边界
~~~~~~~~

直接调用浮点解析库并不能稳定表达题目语法。通用库可能接受空格、特殊值、十六进制格式或区域化写法，而本题
只允许十进制底数和可选指数。任务也只要求验证字符结构，不需要生成实际浮点值。

合法形式可以压缩为：

.. code-block:: text

   [sign] (digits [.] [digits] | . digits) [e/E [sign] digits]

底数必须至少出现一个数字。指数部分若存在，指数标记前必须已经形成合法底数，标记后必须形成一个完整整数。

分段解析
~~~~~~~~

``grammarParser`` 直接按照语法顺序消费字符串：

#. 读取可选的底数符号；
#. 读取小数点前的数字；
#. 若出现小数点，再读取小数点后的数字；
#. 确认小数点两侧至少一侧包含数字；
#. 若出现指数标记，读取可选符号和至少一个指数数字；
#. 确认索引最终恰好到达字符串末尾。

``parseDigits`` 返回本次是否至少消费了一个数字。底数把点前和点后的两个结果合并，因此同时覆盖整数、普通
小数、前导点小数和尾随点小数。指数只接受 ``parseDigits`` 成功的结果，所以 ``"1e"`` 和 ``"1e+"``
都会失败。

状态机展开
~~~~~~~~~~

有限状态机把上述语法阶段显式列出。``PointWithoutInteger`` 表示小数点前没有数字，此状态必须读取数字才能
继续；``PointAfterInteger`` 表示小数点前已有数字，它本身已经是合法终态。

指数标记进入 ``Exponent`` 后，只能读取符号或数字。符号进入 ``ExponentSign``，随后又必须读取数字才能
到达接受状态 ``ExponentInteger``。因此未完成的符号和指数不会在字符串结束时被误判为合法。

接受状态只有四类：

.. code-block:: text

   Integer
   PointAfterInteger
   Fraction
   ExponentInteger

它们分别对应整数、尾随点小数、含小数位的小数和带完整指数的数字。

见证变量压缩
~~~~~~~~~~~~

状态机中的多个阶段可以压缩为四个布尔见证：

* ``seenDigit``：扫描前缀中已经出现数字；
* ``seenDot``：底数已经出现小数点；
* ``seenExponent``：已经进入指数部分；
* ``digitAfterExponent``：指数出现后已经读到至少一个数字。

数字为底数或指数建立数字见证。小数点要求此前没有点且尚未进入指数。指数要求此前已有数字且尚未出现指数，
随后把 ``digitAfterExponent`` 重置为假。符号只允许位于字符串开头或紧跟指数标记。

扫描不变量
~~~~~~~~~~

处理每个字符后，已扫描前缀若仍合法，就满足以下条件：

* 小数点至多一个，并且只属于底数；
* 指数标记至多一个，并且它之前已经出现数字；
* 每个符号都位于当前数字部分的起始位置；
* 若已经进入指数，``digitAfterExponent`` 精确表示指数是否已经完整。

这些条件只依赖当前字符、前一个字符和四个累计见证，所以无需回溯。任一字符违反条件时可以立即返回
``false``。

状态演化
~~~~~~~~

以 ``"-3.5E+2"`` 为例：

.. list-table::
   :header-rows: 1

   * - 字符
     - 状态变化
     - 含义
   * - ``-``
     - 位于下标 0
     - 合法底数符号
   * - ``3``
     - ``seenDigit = true``
     - 底数已有数字
   * - ``.``
     - ``seenDot = true``
     - 进入小数部分
   * - ``5``
     - 数字见证保持
     - 底数为 ``-3.5``
   * - ``E``
     - ``seenExponent = true``
     - ``digitAfterExponent = false``
   * - ``+``
     - 紧跟指数标记
     - 合法指数符号
   * - ``2``
     - ``digitAfterExponent = true``
     - 指数完整，最终接受

若字符串停在 ``E`` 或 ``E+``，``digitAfterExponent`` 会保持为假，最终检查便会拒绝这个未完成前缀。

方法关系
~~~~~~~~

分段解析最接近文法定义，状态机最适合完整展示所有合法阶段，见证扫描则把等价阶段合并成最少状态。三种方法
都检查完整字符串，公开入口调用 ``witnessScan``，因为它在保持语义清晰的同时只需一次线性扫描。

边界处理
~~~~~~~~

* ``"."`` 和 ``"+."`` 没有任何数字，最终由 ``seenDigit`` 拒绝；
* ``".8"`` 在点后建立数字见证，合法；
* ``"7."`` 在点前已有数字，合法；
* ``"e9"`` 在指数前没有数字，立即失败；
* ``"1e-"`` 缺少指数数字，最终由 ``digitAfterExponent`` 拒绝；
* ``"1e2.3"`` 在指数中出现小数点，由 ``seenExponent`` 拒绝；
* ``"--6"`` 的第二个符号既不在开头也不跟随指数，立即失败。

复杂度分析
~~~~~~~~~~

三种方法都只对长度为 ``n`` 的字符串进行常数遍扫描，时间复杂度为 ``O(n)``。它们只维护固定数量的索引、
状态或布尔变量，额外空间复杂度为 ``O(1)``。
