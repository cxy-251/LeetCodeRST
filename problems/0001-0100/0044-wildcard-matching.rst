0044. Wildcard Matching
=======================

题目信息
--------

:题号: 0044
:难度: Hard
:主题: 字符串、贪心、双指针、受控回退
:原题: `LeetCode 0044 <https://leetcode.com/problems/wildcard-matching/>`_
:访问状态: Available
:教学重点: 问号单字符语义、星号任意长度语义、最近星号回退、完整匹配边界

题目重述
--------

给定字符串 ``s`` 和模式 ``p``，判断模式是否能够匹配整个字符串。

模式中只有两种特殊字符：

* ``?`` 恰好匹配一个任意字符；
* ``*`` 匹配任意长度的字符序列，也可以匹配空序列。

匹配必须覆盖 ``s`` 的全部字符和 ``p`` 的全部模式。普通字符只能匹配与自己相同的字符。

自建示例
--------

普通字符与问号
~~~~~~~~~~~~~~

.. code-block:: text

   s = "code"
   p = "c?de"
   结果：true

星号匹配多个字符
~~~~~~~~~~~~~~~~

.. code-block:: text

   s = "adceb"
   p = "*a*b"
   结果：true

   第一个 * 匹配空串，第二个 * 匹配 "dce"。

星号需要逐步扩张
~~~~~~~~~~~~~~~~

.. code-block:: text

   s = "abefcdgiescdfimde"
   p = "ab*cd?i*de"
   结果：true

无法完整匹配
~~~~~~~~~~~~

.. code-block:: text

   s = "acdcb"
   p = "a*c?b"
   结果：false

空串边界
~~~~~~~~

.. code-block:: text

   s = ""
   p = "***"
   结果：true

   s = ""
   p = "?"
   结果：false

问题抽象
--------

若模式当前位置是普通字符或 ``?``，当前字符串字符的处理方式是确定的：匹配成功后两个指针
同时前进。

``*`` 的长度起初无法确定。主解法采用延迟决定：

#. 第一次遇到 ``*`` 时，先让它匹配空串；
#. 保存这个最近星号的位置，以及它当前开始覆盖的字符串位置；
#. 后续发生失配时，让最近星号多吞掉一个字符，再从星号后面的模式重新尝试。

这样不需要枚举所有星号长度组合，只保留最近一个仍可扩张的星号作为回退点。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 最近星号贪心与受控回退
     - 最坏 ``O(|s| × |p|)``
     - ``O(1)``
     - 主解法；状态少，通常接近线性扫描
   * - 二维动态规划
     - ``O(|s| × |p|)``
     - ``O(|s| × |p|)``
     - 状态定义直接，空间较大
   * - 一维滚动动态规划
     - ``O(|s| × |p|)``
     - ``O(|p|)``
     - 复杂度上界稳定，代码与证明更机械
   * - 递归枚举星号长度
     - 指数级
     - 递归栈
     - 大量重复子问题，不可取

主解法：保存最近星号并逐步扩张
--------------------------------

状态含义
~~~~~~~~

维护四个位置：

* ``string_index``：下一个尚未匹配的字符串字符；
* ``pattern_index``：当前尝试的模式字符；
* ``star_index``：最近一次遇到的 ``*`` 在模式中的位置，尚未出现时为无效值；
* ``match_start``：最近星号当前匹配区间之后的字符串位置。

遇到星号时：

.. code-block:: text

   star_index = pattern_index
   match_start = string_index
   pattern_index += 1

这表示先尝试让星号匹配空串。

失配时的唯一修复动作
~~~~~~~~~~~~~~~~~~~~

当前字符无法直接匹配，而此前存在星号时：

.. code-block:: text

   pattern_index = star_index + 1
   match_start += 1
   string_index = match_start

含义是让最近星号比上一次多匹配一个字符串字符，然后重新尝试星号之后的模式。

为什么只回到最近星号
~~~~~~~~~~~~~~~~~~~~

最近星号之后、当前模式位置之前没有其他星号。这个模式片段此前已经按顺序与某段字符串对齐。
发生失配时，普通字符和 ``?`` 都没有长度选择；能够改变对齐位置的只有最近星号。

若某个完整匹配存在，最近星号要么保持当前长度，要么至少再多吞一个字符。当前长度已经导致
失配，所以把它增加一是仍未尝试的最小修复。算法按 ``0、1、2、...`` 的顺序枚举该星号的
覆盖长度，不会跳过可行长度。

遇到新的星号后，新的星号成为最近回退点。此前模式前缀已经匹配完成，未来需要增加的字符
可以由更靠后的星号吸收，无需重新枚举旧星号状态。

核心不变量
~~~~~~~~~~

主循环每次开始时：

* ``s[0:string_index]`` 已被当前模式前缀解释；
* 若 ``star_index`` 有效，模式 ``p[0:star_index]`` 已经固定匹配；
* 最近星号当前覆盖的字符串区间终点是 ``match_start``；
* ``pattern_index`` 总是从最近星号之后重新验证尚未固定的模式后缀；
* 星号尝试的覆盖长度单调增加，不会重复同一个长度。

字符串消耗完后，只允许模式中剩余的全部字符都是 ``*``。``?`` 和普通字符都必须消耗一个
字符串字符，因此不能被忽略。

正确性依据
~~~~~~~~~~

先考虑没有失配的步骤。普通字符相等或模式为 ``?`` 时，当前字符只能由当前模式字符消费，
两个指针同时前进是必要且正确的。遇到 ``*`` 时先尝试空串，保留了最短覆盖，不会提前吞掉
可能应由后续固定模式匹配的字符。

发生失配且没有历史星号时，模式前缀只由固定长度字符组成，不存在重新分配字符的方式，完整
匹配必然不存在。

发生失配且存在最近星号时，最近星号之后没有其他可变长度模式。当前对齐失败后，任何可能的
完整匹配都必须让该星号多覆盖至少一个字符。算法把覆盖长度增加一并重新验证，因此按递增顺序
检查了所有可能覆盖长度。若其中某个长度可行，算法会到达它；若字符串耗尽仍不可行，则不存在
其他长度。

最后，字符串全部匹配后，剩余星号都可取空串；若剩余模式包含普通字符或 ``?``，它们无法
在空字符串上匹配。由此返回值与完整匹配定义一致。

复杂度
~~~~~~

设字符串长度为 ``m``，模式长度为 ``n``：

* ``match_start`` 最多增加 ``m`` 次；
* 每次扩张星号后，星号后的固定模式片段可能被重新扫描；
* 因此最坏时间复杂度为 ``O(mn)``，常见输入中接近 ``O(m + n)``；
* 只保存四个索引，额外空间复杂度为 ``O(1)``。

不要把这一实现无条件写成严格 ``O(m + n)``。例如星号后的长固定片段反复在末尾失配时，
该片段会被多次扫描。

核心语言实现
------------

题目字符范围为小写英文字母、``?`` 和 ``*``，按字节或代码单元读取不会拆分多字节字符。

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>

   bool isMatch(char *s, char *p) {
       size_t string_index = 0;
       size_t pattern_index = 0;
       size_t star_index = (size_t)-1;
       size_t match_start = 0;

       while (s[string_index] != '\0') {
           if (p[pattern_index] == s[string_index] ||
               p[pattern_index] == '?') {
               ++string_index;
               ++pattern_index;
           } else if (p[pattern_index] == '*') {
               star_index = pattern_index;
               match_start = string_index;
               ++pattern_index;
           } else if (star_index != (size_t)-1) {
               pattern_index = star_index + 1;
               ++match_start;
               string_index = match_start;
           } else {
               return false;
           }
       }

       while (p[pattern_index] == '*') {
           ++pattern_index;
       }

       return p[pattern_index] == '\0';
   }

``(size_t)-1`` 作为无效星号位置，只用于相等比较，不参与数组访问。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       bool isMatch(string s, string p) {
           size_t stringIndex = 0;
           size_t patternIndex = 0;
           size_t starIndex = string::npos;
           size_t matchStart = 0;

           while (stringIndex < s.size()) {
               if (patternIndex < p.size() &&
                   (p[patternIndex] == '?' ||
                    p[patternIndex] == s[stringIndex])) {
                   ++stringIndex;
                   ++patternIndex;
               } else if (patternIndex < p.size() &&
                          p[patternIndex] == '*') {
                   starIndex = patternIndex;
                   matchStart = stringIndex;
                   ++patternIndex;
               } else if (starIndex != string::npos) {
                   patternIndex = starIndex + 1;
                   stringIndex = ++matchStart;
               } else {
                   return false;
               }
           }

           while (patternIndex < p.size() &&
                  p[patternIndex] == '*') {
               ++patternIndex;
           }

           return patternIndex == p.size();
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isMatch(self, s: str, p: str) -> bool:
           string_index = 0
           pattern_index = 0
           star_index = -1
           match_start = 0

           while string_index < len(s):
               if (
                   pattern_index < len(p)
                   and (
                       p[pattern_index] == "?"
                       or p[pattern_index] == s[string_index]
                   )
               ):
                   string_index += 1
                   pattern_index += 1
               elif (
                   pattern_index < len(p)
                   and p[pattern_index] == "*"
               ):
                   star_index = pattern_index
                   match_start = string_index
                   pattern_index += 1
               elif star_index != -1:
                   pattern_index = star_index + 1
                   match_start += 1
                   string_index = match_start
               else:
                   return False

           while pattern_index < len(p) and p[pattern_index] == "*":
               pattern_index += 1

           return pattern_index == len(p)

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isMatch(String s, String p) {
           int stringIndex = 0;
           int patternIndex = 0;
           int starIndex = -1;
           int matchStart = 0;

           while (stringIndex < s.length()) {
               if (patternIndex < p.length()
                       && (p.charAt(patternIndex) == '?'
                           || p.charAt(patternIndex)
                               == s.charAt(stringIndex))) {
                   ++stringIndex;
                   ++patternIndex;
               } else if (patternIndex < p.length()
                       && p.charAt(patternIndex) == '*') {
                   starIndex = patternIndex;
                   matchStart = stringIndex;
                   ++patternIndex;
               } else if (starIndex != -1) {
                   patternIndex = starIndex + 1;
                   stringIndex = ++matchStart;
               } else {
                   return false;
               }
           }

           while (patternIndex < p.length()
                   && p.charAt(patternIndex) == '*') {
               ++patternIndex;
           }

           return patternIndex == p.length();
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_match(s: String, p: String) -> bool {
           let string_bytes = s.as_bytes();
           let pattern_bytes = p.as_bytes();
           let mut string_index: usize = 0;
           let mut pattern_index: usize = 0;
           let mut star_index: Option<usize> = None;
           let mut match_start: usize = 0;

           while string_index < string_bytes.len() {
               if pattern_index < pattern_bytes.len()
                   && (pattern_bytes[pattern_index] == b'?'
                       || pattern_bytes[pattern_index]
                           == string_bytes[string_index])
               {
                   string_index += 1;
                   pattern_index += 1;
               } else if pattern_index < pattern_bytes.len()
                   && pattern_bytes[pattern_index] == b'*'
               {
                   star_index = Some(pattern_index);
                   match_start = string_index;
                   pattern_index += 1;
               } else if let Some(star) = star_index {
                   pattern_index = star + 1;
                   match_start += 1;
                   string_index = match_start;
               } else {
                   return false;
               }
           }

           while pattern_index < pattern_bytes.len()
               && pattern_bytes[pattern_index] == b'*'
           {
               pattern_index += 1;
           }

           pattern_index == pattern_bytes.len()
       }
   }

``Option<usize>`` 明确表达“尚未遇到星号”，避免使用可能被误访问的哨兵下标。

Go
~~

.. code-block:: go

   func isMatch(s string, p string) bool {
       stringIndex := 0
       patternIndex := 0
       starIndex := -1
       matchStart := 0

       for stringIndex < len(s) {
           if patternIndex < len(p) &&
               (p[patternIndex] == '?' ||
                   p[patternIndex] == s[stringIndex]) {
               stringIndex++
               patternIndex++
           } else if patternIndex < len(p) &&
               p[patternIndex] == '*' {
               starIndex = patternIndex
               matchStart = stringIndex
               patternIndex++
           } else if starIndex != -1 {
               patternIndex = starIndex + 1
               matchStart++
               stringIndex = matchStart
           } else {
               return false
           }
       }

       for patternIndex < len(p) && p[patternIndex] == '*' {
           patternIndex++
       }

       return patternIndex == len(p)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isMatch(s: string, p: string): boolean {
       let stringIndex = 0;
       let patternIndex = 0;
       let starIndex = -1;
       let matchStart = 0;

       while (stringIndex < s.length) {
           if (
               patternIndex < p.length
               && (
                   p[patternIndex] === "?"
                   || p[patternIndex] === s[stringIndex]
               )
           ) {
               stringIndex++;
               patternIndex++;
           } else if (
               patternIndex < p.length
               && p[patternIndex] === "*"
           ) {
               starIndex = patternIndex;
               matchStart = stringIndex;
               patternIndex++;
           } else if (starIndex !== -1) {
               patternIndex = starIndex + 1;
               matchStart++;
               stringIndex = matchStart;
           } else {
               return false;
           }
       }

       while (
           patternIndex < p.length
           && p[patternIndex] === "*"
       ) {
           patternIndex++;
       }

       return patternIndex === p.length;
   }

题目限定 ASCII 范围，因此 JavaScript UTF-16 代码单元下标与题目字符位置一致。

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsMatch(string s, string p) {
           int stringIndex = 0;
           int patternIndex = 0;
           int starIndex = -1;
           int matchStart = 0;

           while (stringIndex < s.Length) {
               if (patternIndex < p.Length
                       && (p[patternIndex] == '?'
                           || p[patternIndex] == s[stringIndex])) {
                   ++stringIndex;
                   ++patternIndex;
               } else if (patternIndex < p.Length
                       && p[patternIndex] == '*') {
                   starIndex = patternIndex;
                   matchStart = stringIndex;
                   ++patternIndex;
               } else if (starIndex != -1) {
                   patternIndex = starIndex + 1;
                   stringIndex = ++matchStart;
               } else {
                   return false;
               }
           }

           while (patternIndex < p.Length
                   && p[patternIndex] == '*') {
               ++patternIndex;
           }

           return patternIndex == p.Length;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function is_match(s::String, p::String)::Bool
       string_bytes = Vector{UInt8}(codeunits(s))
       pattern_bytes = Vector{UInt8}(codeunits(p))
       string_index = 1
       pattern_index = 1
       star_index = 0
       match_start = 1

       while string_index <= length(string_bytes)
           if pattern_index <= length(pattern_bytes) &&
              (pattern_bytes[pattern_index] == UInt8('?') ||
               pattern_bytes[pattern_index] == string_bytes[string_index])
               string_index += 1
               pattern_index += 1
           elseif pattern_index <= length(pattern_bytes) &&
                  pattern_bytes[pattern_index] == UInt8('*')
               star_index = pattern_index
               match_start = string_index
               pattern_index += 1
           elseif star_index != 0
               pattern_index = star_index + 1
               match_start += 1
               string_index = match_start
           else
               return false
           end
       end

       while pattern_index <= length(pattern_bytes) &&
             pattern_bytes[pattern_index] == UInt8('*')
           pattern_index += 1
       end

       return pattern_index > length(pattern_bytes)
   end

Julia 使用一基索引，因此无效星号位置取 ``0``，字符串结束位置表示为 ``length + 1``。

R
~

.. code-block:: r

   is_match <- function(s, p) {
     string_chars <- strsplit(s, "", fixed = TRUE)[[1L]]
     pattern_chars <- strsplit(p, "", fixed = TRUE)[[1L]]
     string_index <- 1L
     pattern_index <- 1L
     star_index <- 0L
     match_start <- 1L

     while (string_index <= length(string_chars)) {
       if (
         pattern_index <= length(pattern_chars) &&
         (
           pattern_chars[[pattern_index]] == "?" ||
           pattern_chars[[pattern_index]] ==
             string_chars[[string_index]]
         )
       ) {
         string_index <- string_index + 1L
         pattern_index <- pattern_index + 1L
       } else if (
         pattern_index <= length(pattern_chars) &&
         pattern_chars[[pattern_index]] == "*"
       ) {
         star_index <- pattern_index
         match_start <- string_index
         pattern_index <- pattern_index + 1L
       } else if (star_index != 0L) {
         pattern_index <- star_index + 1L
         match_start <- match_start + 1L
         string_index <- match_start
       } else {
         return(FALSE)
       }
     }

     while (
       pattern_index <= length(pattern_chars) &&
       pattern_chars[[pattern_index]] == "*"
     ) {
       pattern_index <- pattern_index + 1L
     }

     pattern_index > length(pattern_chars)
   }

R 与 Julia 都用一基索引；``length + 1`` 表示已经越过最后一个字符，并不执行数组访问。

关键边界
--------

* 两个输入都为空：匹配成功；
* 字符串为空：只有全部由 ``*`` 组成的模式可以成功；
* 模式为空而字符串非空：失败；
* 连续多个星号：语义等价于一个星号，算法仍可正确处理；
* 星号在模式末尾：它可以吞掉全部剩余字符串；
* 星号后存在固定长后缀：失配时需要逐步扩张星号；
* 匹配是整个字符串匹配，不能只找到某个子串就返回成功。

易错点
------

* 把 ``*`` 当成正则表达式中“重复前一个元素”的星号；本题星号独立匹配任意序列；
* 遇到 ``*`` 后直接吞掉全部剩余字符，导致后续固定模式无字符可匹配；
* 失配时回到星号本身而不移动字符串起点，形成无限循环；
* 字符串耗尽后直接返回成功，遗漏模式尾部普通字符或 ``?``；
* 在检查 ``pattern_index < length`` 之前访问模式字符；
* 无条件声称贪心实现严格线性，忽略固定后缀可能被重复扫描。

新增与强化知识
--------------

新增
~~~~

* 延迟决定可把不确定长度的星号先按空串处理；
* 最近星号与字符串锚点共同构成可恢复的贪心检查点；
* 受控回退与普通回溯不同，它只单调增加一个星号的覆盖长度；
* 算法的常见运行表现和严格最坏复杂度需要分开描述。

强化
~~~~

* 与 0010 Regular Expression Matching 区分两种完全不同的星号语义；
* 继续强化字符串下标单位与 ASCII 约束；
* 完整匹配必须同时消耗字符串和模式，尾部星号是唯一可忽略模式元素；
* 正确性证明需要说明贪心选择不会跳过任何星号覆盖长度。

关联题目
--------

* `0010. Regular Expression Matching <0010-regular-expression-matching.rst>`_：同为模式匹配，
  但 ``*`` 依附前一个模式元素，适合对比状态定义和转移语义。

最小自检
--------

#. 为什么遇到 ``*`` 时先让它匹配空串？
#. 发生失配后，``match_start`` 为什么只增加一？
#. 字符串已经耗尽时，模式中哪些字符仍可保留？
#. 最近星号之前的模式为什么不需要重新扫描？
#. 这一贪心实现的严格最坏时间复杂度为什么不是无条件线性？

答案要点
~~~~~~~~

#. 先保留最短覆盖，避免提前吞掉应由后续固定模式匹配的字符。
#. 算法按递增顺序枚举星号覆盖长度，一次增加一不会跳过可行长度。
#. 只允许剩余 ``*``，因为它们都可匹配空串。
#. 该前缀已经固定匹配；新失配的可变长度来源只有最近星号。
#. 星号扩张后，后面的固定模式片段可能从头重新扫描，最坏会重复多次。
