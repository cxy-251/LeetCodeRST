0065. Valid Number
==================

题目信息
--------

:题号: 0065
:难度: Hard
:主题: 字符串、语法解析、有限状态机、扫描见证
:原题: `LeetCode 0065 <https://leetcode.com/problems/valid-number/>`_
:教学重点: 符号位置、底数数字、小数点、指数后数字见证

题目重述
--------

判断非空字符串是否完整表示合法十进制数。底数可带一个前导符号，可为整数或小数；指数部分可选，以 ``e`` 或 ``E`` 开始，指数可带符号但必须是整数且至少包含一个数字。字符串不接受空格或其他字符。

自建示例
--------

.. code-block:: text

   "-3.5E+2" -> true
   ".8"       -> true
   "7."       -> true

.. code-block:: text

   "12e-" -> false
   "."    -> false
   "4-2"  -> false
   "1e2.3"-> false

C++ 实现
--------

.. code-block:: cpp

   #include <cctype>
   #include <string>

   class Solution {
   private:
       bool parseDigits(const std::string& s, int& index) {
           int start = index;
           while (index < static_cast<int>(s.size()) && std::isdigit(static_cast<unsigned char>(s[index]))) ++index;
           return index > start;
       }

       bool grammarParser(const std::string& s) {
           int index = 0, n = s.size();
           if (index < n && (s[index] == '+' || s[index] == '-')) ++index;
           bool integer_digits = parseDigits(s, index);
           bool fraction_digits = false;
           if (index < n && s[index] == '.') {
               ++index;
               fraction_digits = parseDigits(s, index);
           }
           if (!integer_digits && !fraction_digits) return false;
           if (index < n && (s[index] == 'e' || s[index] == 'E')) {
               ++index;
               if (index < n && (s[index] == '+' || s[index] == '-')) ++index;
               if (!parseDigits(s, index)) return false;
           }
           return index == n;
       }

       enum class State { Start, Sign, Integer, PointOnly, Point, Fraction, Exp, ExpSign, ExpInteger, Invalid };

       bool finiteStateMachine(const std::string& s) {
           State state = State::Start;
           for (char ch : s) {
               bool digit = ch >= '0' && ch <= '9';
               switch (state) {
                   case State::Start:
                       state = digit ? State::Integer : (ch=='+'||ch=='-') ? State::Sign : ch=='.' ? State::PointOnly : State::Invalid; break;
                   case State::Sign:
                       state = digit ? State::Integer : ch=='.' ? State::PointOnly : State::Invalid; break;
                   case State::Integer:
                       state = digit ? State::Integer : ch=='.' ? State::Point : (ch=='e'||ch=='E') ? State::Exp : State::Invalid; break;
                   case State::PointOnly:
                       state = digit ? State::Fraction : State::Invalid; break;
                   case State::Point:
                   case State::Fraction:
                       state = digit ? State::Fraction : (ch=='e'||ch=='E') ? State::Exp : State::Invalid; break;
                   case State::Exp:
                       state = digit ? State::ExpInteger : (ch=='+'||ch=='-') ? State::ExpSign : State::Invalid; break;
                   case State::ExpSign:
                   case State::ExpInteger:
                       state = digit ? State::ExpInteger : State::Invalid; break;
                   default: return false;
               }
               if (state == State::Invalid) return false;
           }
           return state == State::Integer || state == State::Point ||
                  state == State::Fraction || state == State::ExpInteger;
       }

       bool witnessScan(const std::string& s) {
           bool seen_digit = false;
           bool seen_dot = false;
           bool seen_exp = false;
           bool digit_after_exp = true;
           for (int i = 0; i < static_cast<int>(s.size()); ++i) {
               char ch = s[i];
               if (ch >= '0' && ch <= '9') {
                   seen_digit = true;
                   if (seen_exp) digit_after_exp = true;
               } else if (ch == '+' || ch == '-') {
                   if (i > 0 && s[i - 1] != 'e' && s[i - 1] != 'E') return false;
               } else if (ch == '.') {
                   if (seen_dot || seen_exp) return false;
                   seen_dot = true;
               } else if (ch == 'e' || ch == 'E') {
                   if (seen_exp || !seen_digit) return false;
                   seen_exp = true;
                   digit_after_exp = false;
               } else {
                   return false;
               }
           }
           return seen_digit && digit_after_exp;
       }

   public:
       bool isNumber(std::string s) {
           return witnessScan(s);
       }
   };

题解
----

为什么不能依赖浮点解析库
~~~~~~~~~~~~~~~~~~~~~~

库函数可能接受空格、特殊值、十六进制、区域格式或溢出表示，其语法不一定与题目一致。题目只要求判断字符结构，不需要实际计算数值，也不存在舍入问题。

数字语法如何拆分
~~~~~~~~~~~~~~~~

完整形式可以写成：

.. code-block:: text

   [sign] (digits[.digits] | .digits | digits.) [e/E [sign] digits]

底数至少有一个数字；小数点只能位于底数；指数若出现，其前后都必须存在数字见证。

四个扫描状态分别证明什么
~~~~~~~~~~~~~~~~~~~~~~~~

``seen_digit`` 证明指数标记之前已有合法底数数字；``seen_dot`` 防止第二个小数点；``seen_exp`` 防止第二个指数并禁止指数中的点；``digit_after_exp`` 在读到指数时重置为假，只有后续数字才能恢复。

字符约束为何是局部的
~~~~~~~~~~~~~~~~~~~~

符号只合法于下标 0 或紧跟 ``e/E``；点只要求此前没点且尚未进入指数；指数要求此前见过数字且尚未出现指数。每个条件只依赖当前字符、前一字符和累计见证，因此一次扫描足够。

合法样例状态跟踪
~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 字符
     - 状态变化
     - 作用
   * - ``-``
     - 位于开头
     - 合法底数符号
   * - ``3``
     - ``seen_digit=true``
     - 建立底数数字见证
   * - ``.5``
     - ``seen_dot=true``
     - 合法小数部分
   * - ``E``
     - ``seen_exp=true``、``digit_after_exp=false``
     - 等待指数数字
   * - ``+2``
     - 符号紧跟 E，随后数字恢复见证
     - 最终接受

指数缺数字为什么必须在结尾拒绝
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

读到 ``e`` 时前缀可能完全合法，无法立即知道后面是否会出现数字。把 ``digit_after_exp`` 置为假，若扫描结束仍未恢复，就能拒绝 ``"1e"``、``"1e+"`` 等未完成形式。

点两侧为何只需一侧有数字
~~~~~~~~~~~~~~~~~~~~~~~~

``.8`` 的数字在点后，``7.`` 的数字在点前，都满足底数至少一个数字。单独的 ``.`` 没有任何数字，因此最终 ``seen_digit`` 为假。

有限状态机与见证扫描的关系
~~~~~~~~~~~~~~~~~~~~~~~~~~

状态机显式列出所有语法阶段，便于验证转移完整性；见证扫描把若干状态合并为布尔约束，代码更短。两者接受的终态都只有合法整数、小数和完整指数整数。

为什么完整字符串都被验证
~~~~~~~~~~~~~~~~~~~~~~~~

任何不属于数字、符号、点或指数标记的字符立即失败；每个合法字符又必须满足当前位置约束。扫描不跳过前后缀，结尾还检查底数与指数数字见证，因此只有完整合法字符串被接受。

复杂度来源
~~~~~~~~~~

三种方法都只扫描字符串常数遍，时间 ``O(n)``、额外空间 ``O(1)``。状态机的状态数固定，分段解析也只维护索引。

九语言实现
----------

C
~

.. code-block:: c

   bool isNumber(char*s){bool digit=false,dot=false,exp=false,after=true;for(int i=0;s[i];i++){char ch=s[i];if(ch>='0'&&ch<='9'){digit=true;if(exp)after=true;}else if(ch=='+'||ch=='-'){if(i>0&&s[i-1]!='e'&&s[i-1]!='E')return false;}else if(ch=='.'){if(dot||exp)return false;dot=true;}else if(ch=='e'||ch=='E'){if(exp||!digit)return false;exp=true;after=false;}else return false;}return digit&&after;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isNumber(self, s: str) -> bool:
           digit = dot = exp = False; after = True
           for i, ch in enumerate(s):
               if ch.isdigit(): digit = True; after = True if exp else after
               elif ch in "+-":
                   if i > 0 and s[i-1] not in "eE": return False
               elif ch == ".":
                   if dot or exp: return False
                   dot = True
               elif ch in "eE":
                   if exp or not digit: return False
                   exp, after = True, False
               else: return False
           return digit and after

Java
~~~~

.. code-block:: java

   class Solution {public boolean isNumber(String s){boolean digit=false,dot=false,exp=false,after=true;for(int i=0;i<s.length();i++){char ch=s.charAt(i);if(Character.isDigit(ch)){digit=true;if(exp)after=true;}else if(ch=='+'||ch=='-'){if(i>0&&s.charAt(i-1)!='e'&&s.charAt(i-1)!='E')return false;}else if(ch=='.'){if(dot||exp)return false;dot=true;}else if(ch=='e'||ch=='E'){if(exp||!digit)return false;exp=true;after=false;}else return false;}return digit&&after;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn is_number(s:String)->bool{let b=s.as_bytes();let(mut digit,mut dot,mut exp,mut after)=(false,false,false,true);for(i,&ch)in b.iter().enumerate(){if ch.is_ascii_digit(){digit=true;if exp{after=true}}else if ch==b'+'||ch==b'-'{if i>0&&b[i-1]!=b'e'&&b[i-1]!=b'E'{return false}}else if ch==b'.'{if dot||exp{return false}dot=true}else if ch==b'e'||ch==b'E'{if exp||!digit{return false}exp=true;after=false}else{return false}}digit&&after}}

Go
~~

.. code-block:: go

   func isNumber(s string)bool{digit,dot,exp,after:=false,false,false,true;for i:=0;i<len(s);i++{ch:=s[i];if ch>='0'&&ch<='9'{digit=true;if exp{after=true}}else if ch=='+'||ch=='-'{if i>0&&s[i-1]!='e'&&s[i-1]!='E'{return false}}else if ch=='.'{if dot||exp{return false};dot=true}else if ch=='e'||ch=='E'{if exp||!digit{return false};exp,after=true,false}else{return false}};return digit&&after}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isNumber(s:string):boolean{let digit=false,dot=false,exp=false,after=true;for(let i=0;i<s.length;i++){const ch=s[i];if(ch>="0"&&ch<="9"){digit=true;if(exp)after=true;}else if(ch==="+"||ch==="-"){if(i>0&&s[i-1]!=="e"&&s[i-1]!=="E")return false;}else if(ch==="."){if(dot||exp)return false;dot=true;}else if(ch==="e"||ch==="E"){if(exp||!digit)return false;exp=true;after=false;}else return false;}return digit&&after;}

C#
~~

.. code-block:: csharp

   public class Solution {public bool IsNumber(string s){bool digit=false,dot=false,exp=false,after=true;for(int i=0;i<s.Length;i++){char ch=s[i];if(char.IsDigit(ch)){digit=true;if(exp)after=true;}else if(ch=='+'||ch=='-'){if(i>0&&s[i-1]!='e'&&s[i-1]!='E')return false;}else if(ch=='.'){if(dot||exp)return false;dot=true;}else if(ch=='e'||ch=='E'){if(exp||!digit)return false;exp=true;after=false;}else return false;}return digit&&after;}}

Julia
~~~~~

.. code-block:: julia

   function is_number(s::String)
       chars=collect(s);digit=false;dot=false;exp=false;after=true
       for i in eachindex(chars);ch=chars[i];if isdigit(ch);digit=true;exp&&(after=true);elseif ch=='+'||ch=='-';i>1&&!(chars[i-1] in ('e','E'))&&return false;elseif ch=='.';(dot||exp)&&return false;dot=true;elseif ch=='e'||ch=='E';(exp||!digit)&&return false;exp=true;after=false;else;return false;end;end
       digit&&after
   end

R
~

.. code-block:: r

   is_number <- function(s){ch<-strsplit(s,"",fixed=TRUE)[[1L]];digit<-FALSE;dot<-FALSE;exp<-FALSE;after<-TRUE;for(i in seq_along(ch)){x<-ch[[i]];if(x>="0"&&x<="9"){digit<-TRUE;if(exp)after<-TRUE}else if(x%in%c("+","-")){if(i>1L&&!(ch[[i-1L]]%in%c("e","E")))return(FALSE)}else if(x=="."){if(dot||exp)return(FALSE);dot<-TRUE}else if(x%in%c("e","E")){if(exp||!digit)return(FALSE);exp<-TRUE;after<-FALSE}else return(FALSE)};digit&&after}
