0013. Roman to Integer
======================

题目信息
--------

:题号: 0013
:难度: Easy
:主题: 字符串、哈希映射、顺序扫描
:原题: `LeetCode 0013 <https://leetcode.com/problems/roman-to-integer/>`_
:教学重点: 符号映射、减法组合、相邻次序、从右向左累计

题目重述
--------

给定一个合法罗马数字字符串，将它转换为整数。基本符号 ``I,V,X,L,C,D,M`` 分别表示
``1,5,10,50,100,500,1000``。通常符号从大到小排列并相加；较小符号位于较大符号左侧时表示减法，
例如 ``IV = 4``、``CM = 900``。

自建示例
--------

.. code-block:: text

   s = "MCMXLIV"
   M + CM + XL + IV = 1000 + 900 + 40 + 4 = 1944

.. code-block:: text

   s = "DCCLXXXIII"
   所有符号按非增顺序出现，逐个相加得到 783。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <unordered_map>

   class Solution {
   private:
       int value(char symbol) {
           switch (symbol) {
               case 'I': return 1;
               case 'V': return 5;
               case 'X': return 10;
               case 'L': return 50;
               case 'C': return 100;
               case 'D': return 500;
               default: return 1000;
           }
       }

       int compareNeighbors(const std::string& s) {
           int result = 0;
           for (int i = 0; i < static_cast<int>(s.size()); ++i) {
               const int current = value(s[i]);
               if (
                   i + 1 < static_cast<int>(s.size()) &&
                   current < value(s[i + 1])
               ) {
                   result -= current;
               } else {
                   result += current;
               }
           }
           return result;
       }

       int scanFromRight(const std::string& s) {
           int result = 0;
           int right_value = 0;

           for (int i = static_cast<int>(s.size()) - 1; i >= 0; --i) {
               const int current = value(s[i]);
               if (current < right_value) {
                   result -= current;
               } else {
                   result += current;
                   right_value = current;
               }
           }
           return result;
       }

   public:
       int romanToInt(std::string s) {
           return scanFromRight(s);
       }
   };

题解
----

普通相加为什么不足以解析罗马数字
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若所有符号都相加，``VI`` 得到 6，但 ``IV`` 会错误得到 6。差别来自相邻次序：较小值位于较大值左侧时，
它不是独立加数，而是从右侧较大值中扣除。

相邻字符判断如何识别减法符号
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

从左向右扫描时，若当前值小于下一字符值，就减去当前值；否则加上当前值。合法输入保证减法结构只出现在
允许组合中，因此不需要额外验证 ``I`` 能否放在 ``C`` 前。

从右向左为什么只需保存右侧基准值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

从最右字符开始扫描，维护 ``right_value``，表示右侧已经遇到的最大符号值：

* ``current < right_value``：当前符号处在一个更大符号左侧，应减去；
* ``current >= right_value``：当前符号是新的加法单位，应加上，并更新基准。

规范罗马数字中的加法段按非增顺序排列，减法符号一定小于它右侧对应单位。因此一个右侧最大值足以决定当前
符号的正负贡献。

状态演化
~~~~~~~~

对 ``MCMXLIV`` 从右向左扫描：

.. list-table::
   :header-rows: 1

   * - 字符
     - 当前值
     - 扫描前 ``right_value``
     - 动作
     - 累计结果
   * - ``V``
     - 5
     - 0
     - 加 5，更新基准
     - 5
   * - ``I``
     - 1
     - 5
     - 减 1
     - 4
   * - ``L``
     - 50
     - 5
     - 加 50，更新基准
     - 54
   * - ``X``
     - 10
     - 50
     - 减 10
     - 44
   * - ``M``
     - 1000
     - 50
     - 加 1000，更新基准
     - 1044
   * - ``C``
     - 100
     - 1000
     - 减 100
     - 944
   * - ``M``
     - 1000
     - 1000
     - 加 1000
     - 1944

为什么局部加减能恢复完整数值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每个符号在规范表示中只有两种角色：独立加法单位，或紧邻更大单位左侧的减法单位。从右向左扫描时，右侧
更大值已经可见，因此当前贡献可以立即确定。所有符号恰好处理一次，减法对 ``XY`` 被计算为 ``-X + Y``，
加法序列则全部为正贡献；两类结构覆盖整个字符串。

复杂度来源
~~~~~~~~~~

两种方法都扫描 ``n`` 个字符，每次执行常数次映射和比较，时间复杂度 ``O(n)``。只保存累计值和一个相邻值，
工作空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   static int roman_value(char c) {
       switch (c) {
           case 'I': return 1; case 'V': return 5; case 'X': return 10;
           case 'L': return 50; case 'C': return 100; case 'D': return 500;
           default: return 1000;
       }
   }

   int romanToInt(char* s) {
       int length = 0, result = 0, right_value = 0;
       while (s[length] != '\0') ++length;
       for (int i = length - 1; i >= 0; --i) {
           int current = roman_value(s[i]);
           if (current < right_value) result -= current;
           else { result += current; right_value = current; }
       }
       return result;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def romanToInt(self, s: str) -> int:
           values = {"I":1,"V":5,"X":10,"L":50,"C":100,"D":500,"M":1000}
           result = right_value = 0
           for symbol in reversed(s):
               current = values[symbol]
               if current < right_value:
                   result -= current
               else:
                   result += current
                   right_value = current
           return result

Java
~~~~

.. code-block:: java

   class Solution {
       private int value(char c) {
           return switch (c) {
               case 'I' -> 1; case 'V' -> 5; case 'X' -> 10;
               case 'L' -> 50; case 'C' -> 100; case 'D' -> 500;
               default -> 1000;
           };
       }
       public int romanToInt(String s) {
           int result = 0, rightValue = 0;
           for (int i = s.length() - 1; i >= 0; --i) {
               int current = value(s.charAt(i));
               if (current < rightValue) result -= current;
               else { result += current; rightValue = current; }
           }
           return result;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn roman_to_int(s: String) -> i32 {
           fn value(c: u8) -> i32 {
               match c { b'I'=>1,b'V'=>5,b'X'=>10,b'L'=>50,b'C'=>100,b'D'=>500,_=>1000 }
           }
           let mut result = 0;
           let mut right_value = 0;
           for &c in s.as_bytes().iter().rev() {
               let current = value(c);
               if current < right_value { result -= current; }
               else { result += current; right_value = current; }
           }
           result
       }
   }

Go
~~

.. code-block:: go

   func romanToInt(s string) int {
       values := map[byte]int{'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
       result, rightValue := 0, 0
       for i := len(s)-1; i >= 0; i-- {
           current := values[s[i]]
           if current < rightValue { result -= current } else {
               result += current; rightValue = current
           }
       }
       return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function romanToInt(s: string): number {
       const values: Record<string, number> = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
       let result = 0, rightValue = 0;
       for (let i = s.length - 1; i >= 0; --i) {
           const current = values[s[i]];
           if (current < rightValue) result -= current;
           else { result += current; rightValue = current; }
       }
       return result;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       private int Value(char c) => c switch {
           'I'=>1,'V'=>5,'X'=>10,'L'=>50,'C'=>100,'D'=>500,_=>1000
       };
       public int RomanToInt(string s) {
           int result = 0, rightValue = 0;
           for (int i = s.Length - 1; i >= 0; --i) {
               int current = Value(s[i]);
               if (current < rightValue) result -= current;
               else { result += current; rightValue = current; }
           }
           return result;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function roman_to_int(s::String)::Int
       values = Dict('I'=>1,'V'=>5,'X'=>10,'L'=>50,'C'=>100,'D'=>500,'M'=>1000)
       result = 0; right_value = 0
       for symbol in reverse(collect(s))
           current = values[symbol]
           if current < right_value
               result -= current
           else
               result += current; right_value = current
           end
       end
       result
   end

R
~

.. code-block:: r

   romanToInt <- function(s) {
       values <- c(I=1,V=5,X=10,L=50,C=100,D=500,M=1000)
       chars <- rev(strsplit(s, "", fixed = TRUE)[[1]])
       result <- 0; right_value <- 0
       for (symbol in chars) {
           current <- unname(values[[symbol]])
           if (current < right_value) result <- result - current
           else { result <- result + current; right_value <- current }
       }
       result
   }
