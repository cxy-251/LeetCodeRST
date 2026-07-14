0125. Valid Palindrome
======================

题目信息
--------

:题号: 0125
:难度: Easy
:主题: 字符串、双指针、ASCII、原地扫描
:原题: `LeetCode 0125 <https://leetcode.com/problems/valid-palindrome/>`_
:访问状态: Available
:教学重点: 跳过非字母数字字符、ASCII 大小写归一化、双指针不物化清洗结果

题目重述
--------

给定一个字符串，只保留 ASCII 英文字母和十进制数字，并把大写字母按 ASCII 规则转换为小写。
若处理后的字符序列从左向右与从右向左完全相同，返回 ``true``；否则返回 ``false``。

题目保证输入由可打印 ASCII 字符组成。本文实现只读原字符串，不构造完整清洗副本。

自建示例
--------

忽略标点与大小写
~~~~~~~~~~~~~~~~

.. code-block:: text

   输入："A man, a plan, a canal: Panama"
   清洗后："amanaplanacanalpanama"
   输出：true

数字也参与比较
~~~~~~~~~~~~~~

``"0P"`` 清洗后仍为 ``"0p"``，两端不同，返回 ``false``。

全部被忽略
~~~~~~~~~~

``"., !"`` 清洗后是空序列。空序列正读和反读相同，返回 ``true``。

单个有效字符
~~~~~~~~~~~~

``" 7 "`` 只留下一个数字，返回 ``true``。

问题抽象
--------

把清洗后的有效字符序列记作 ``t``。直接方法是先构造 ``t``，再比较 ``t`` 与其逆序。

完整清洗串并不是必要状态。只要维护原字符串中的左右下标：

#. 左指针向右跳过非 ASCII 字母数字字符；
#. 右指针向左执行同样跳过；
#. 两端都指向有效字符时，按 ASCII 小写形式比较；
#. 相同则同时向内移动，不同立即返回 ``false``。

每个字符最多被某个指针访问一次，因此可以在 ``O(1)`` 核心空间内完成判断。

ASCII 契约
----------

本文显式把有效字符定义为：

* ``'0'`` 到 ``'9'``；
* ``'A'`` 到 ``'Z'``；
* ``'a'`` 到 ``'z'``。

大写字母通过固定差值映射到小写。这样十种语言保持相同字符域，避免：

* C/C++ ``isalnum`` 受区域设置影响；
* Python ``str.isalnum``、Java/C# Unicode 分类接受非 ASCII 字母数字；
* 不同语言的 Unicode 大小写折叠产生多码点或文化规则差异。

题目输入是可打印 ASCII，因此按字节或 UTF-16 代码单元扫描都与题目字符一一对应。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 原字符串双指针
     - ``O(n)``
     - ``O(1)``
     - 主解法；不物化清洗结果
   * - 构造清洗字符串后反转比较
     - ``O(n)``
     - ``O(n)``
     - 直观基准；分配完整副本
   * - 递归比较有效字符
     - ``O(n)``
     - ``O(n)`` 栈
     - 没有必要的深度风险

主解法：跳过无效字符的双指针
------------------------------

核心不变量
~~~~~~~~~~

进入每轮外层循环时：

* ``left`` 左侧和 ``right`` 右侧的有效字符已经成对匹配；
* 尚未决定的有效字符全部位于闭区间 ``[left, right]``；
* 指针只向内移动，不会重新访问已经排除的字符；
* 输入字符串未被修改。

两个内层循环分别跳过无效字符。若跳过后 ``left >= right``，剩余有效字符数量为 0 或 1，
必然满足回文条件。否则比较归一化后的两端字符。

为什么可以忽略标点
~~~~~~~~~~~~~~~~~~

题目定义的目标序列本来就删除所有非字母数字字符。双指针跳过它们，等价于在清洗序列中移动一步，
不会改变任何有效字符的相对顺序。

为什么首次不匹配即可结束
~~~~~~~~~~~~~~~~~~~~~~~~

当前两端是尚未匹配序列的第一个和最后一个有效字符。回文定义要求它们相同；
若不同，任何更内层字符都无法修复这一对端点，因此可以立即返回 ``false``。

正确性依据
~~~~~~~~~~

设 ``t`` 是按题意清洗并转为 ASCII 小写后的序列。

**保持。** 左指针每次停在 ``t`` 中尚未比较的最左字符，右指针停在最右字符。
跳过操作只越过不属于 ``t`` 的原字符，因此不会漏掉或重排有效字符。

**不匹配。** 若两端归一化字符不同，它们就是 ``t`` 当前首尾，故 ``t`` 不可能是回文。

**匹配。** 若两端相同，删除这一对后，原序列是回文当且仅当剩余内部序列是回文。
指针同时向内移动，问题严格缩小并保持不变量。

**结束。** 当指针相遇或交叉时，所有有效字符已成对匹配，最多剩一个中心字符，因此 ``t`` 是回文。

**终止性。** 每次跳过或匹配都会使 ``left`` 增大或 ``right`` 减小，有限长度下必然结束。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 两个指针合计至多跨过每个输入字符一次，时间复杂度 ``O(n)``；
* 核心算法只保存下标和当前字符，额外空间 ``O(1)``；
* 返回布尔值，返回载荷 ``O(1)``；
* C、C++、Rust、Go、Julia 按 ASCII 字节判断；
* Java、TypeScript、C# 按代码单元读取，但题目 ASCII 输入保证每个字符占一个单元；
* Python 用 ``ord`` 实现显式 ASCII 判断，不调用 Unicode ``isalnum``；
* Julia ``codeunits`` 返回字符串代码单元视图，不物化 ``O(n)`` 副本；
* R 的 ``charToRaw`` 会物化 ``O(n)`` 原始字节，因此 R 适配器额外和峰值空间为 ``O(n)``，
  虽然双指针核心状态仍为 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <string.h>

   static bool is_ascii_alnum(unsigned char ch) {
       return (ch >= '0' && ch <= '9')
           || (ch >= 'A' && ch <= 'Z')
           || (ch >= 'a' && ch <= 'z');
   }

   static unsigned char ascii_lower(unsigned char ch) {
       if (ch >= 'A' && ch <= 'Z') {
           return (unsigned char)(ch + ('a' - 'A'));
       }
       return ch;
   }

   bool isPalindrome(char *s) {
       size_t left = 0;
       size_t right = strlen(s);

       while (left < right) {
           while (left < right
                  && !is_ascii_alnum((unsigned char)s[left])) {
               ++left;
           }
           while (left < right
                  && !is_ascii_alnum((unsigned char)s[right - 1])) {
               --right;
           }
           if (left >= right) {
               break;
           }

           if (ascii_lower((unsigned char)s[left])
               != ascii_lower((unsigned char)s[right - 1])) {
               return false;
           }
           ++left;
           --right;
       }

       return true;
   }

C 使用半开区间 ``[left, right)``，避免空字符串时计算 ``length - 1`` 产生无符号下溢。

C++
~~~

.. code-block:: cpp

   #include <string>

   class Solution {
   private:
       static bool isAsciiAlnum(unsigned char ch) {
           return (ch >= '0' && ch <= '9')
               || (ch >= 'A' && ch <= 'Z')
               || (ch >= 'a' && ch <= 'z');
       }

       static unsigned char asciiLower(unsigned char ch) {
           return ch >= 'A' && ch <= 'Z'
               ? static_cast<unsigned char>(ch + ('a' - 'A'))
               : ch;
       }

   public:
       bool isPalindrome(const std::string& s) {
           std::size_t left = 0;
           std::size_t right = s.size();

           while (left < right) {
               while (left < right
                      && !isAsciiAlnum((unsigned char)s[left])) {
                   ++left;
               }
               while (left < right
                      && !isAsciiAlnum((unsigned char)s[right - 1])) {
                   --right;
               }
               if (left >= right) {
                   break;
               }
               if (asciiLower((unsigned char)s[left])
                   != asciiLower((unsigned char)s[right - 1])) {
                   return false;
               }
               ++left;
               --right;
           }

           return true;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isPalindrome(self, s: str) -> bool:
           def is_ascii_alnum(ch: str) -> bool:
               code = ord(ch)
               return (
                   ord("0") <= code <= ord("9")
                   or ord("A") <= code <= ord("Z")
                   or ord("a") <= code <= ord("z")
               )

           def ascii_lower(ch: str) -> int:
               code = ord(ch)
               if ord("A") <= code <= ord("Z"):
                   return code + ord("a") - ord("A")
               return code

           left = 0
           right = len(s) - 1

           while left < right:
               while left < right and not is_ascii_alnum(s[left]):
                   left += 1
               while left < right and not is_ascii_alnum(s[right]):
                   right -= 1
               if left >= right:
                   break
               if ascii_lower(s[left]) != ascii_lower(s[right]):
                   return False
               left += 1
               right -= 1

           return True

Java
~~~~

.. code-block:: java

   class Solution {
       private boolean isAsciiAlnum(char ch) {
           return (ch >= '0' && ch <= '9')
               || (ch >= 'A' && ch <= 'Z')
               || (ch >= 'a' && ch <= 'z');
       }

       private char asciiLower(char ch) {
           if (ch >= 'A' && ch <= 'Z') {
               return (char)(ch + ('a' - 'A'));
           }
           return ch;
       }

       public boolean isPalindrome(String s) {
           int left = 0;
           int right = s.length() - 1;

           while (left < right) {
               while (left < right && !isAsciiAlnum(s.charAt(left))) {
                   ++left;
               }
               while (left < right && !isAsciiAlnum(s.charAt(right))) {
                   --right;
               }
               if (left >= right) {
                   break;
               }
               if (asciiLower(s.charAt(left))
                   != asciiLower(s.charAt(right))) {
                   return false;
               }
               ++left;
               --right;
           }

           return true;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_palindrome(s: String) -> bool {
           fn is_ascii_alnum(ch: u8) -> bool {
               ch.is_ascii_alphanumeric()
           }

           let bytes = s.as_bytes();
           let mut left = 0usize;
           let mut right = bytes.len();

           while left < right {
               while left < right && !is_ascii_alnum(bytes[left]) {
                   left += 1;
               }
               while left < right && !is_ascii_alnum(bytes[right - 1]) {
                   right -= 1;
               }
               if left >= right {
                   break;
               }

               if bytes[left].to_ascii_lowercase()
                   != bytes[right - 1].to_ascii_lowercase() {
                   return false;
               }
               left += 1;
               right -= 1;
           }

           true
       }
   }

Rust 的 ``as_bytes`` 借用原字符串存储，不复制内容；ASCII 方法与本文字符域一致。

Go
~~

.. code-block:: go

   func isPalindrome(s string) bool {
       isASCIIAlnum := func(ch byte) bool {
           return (ch >= '0' && ch <= '9') ||
               (ch >= 'A' && ch <= 'Z') ||
               (ch >= 'a' && ch <= 'z')
       }
       asciiLower := func(ch byte) byte {
           if ch >= 'A' && ch <= 'Z' {
               return ch + ('a' - 'A')
           }
           return ch
       }

       left, right := 0, len(s)-1
       for left < right {
           for left < right && !isASCIIAlnum(s[left]) {
               left++
           }
           for left < right && !isASCIIAlnum(s[right]) {
               right--
           }
           if left >= right {
               break
           }
           if asciiLower(s[left]) != asciiLower(s[right]) {
               return false
           }
           left++
           right--
       }
       return true
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isPalindrome(s: string): boolean {
       const isAsciiAlnum = (code: number): boolean => (
           (code >= 48 && code <= 57)
           || (code >= 65 && code <= 90)
           || (code >= 97 && code <= 122)
       );
       const asciiLower = (code: number): number => (
           code >= 65 && code <= 90 ? code + 32 : code
       );

       let left = 0;
       let right = s.length - 1;

       while (left < right) {
           while (left < right && !isAsciiAlnum(s.charCodeAt(left))) {
               left += 1;
           }
           while (left < right && !isAsciiAlnum(s.charCodeAt(right))) {
               right -= 1;
           }
           if (left >= right) {
               break;
           }
           if (asciiLower(s.charCodeAt(left))
               !== asciiLower(s.charCodeAt(right))) {
               return false;
           }
           left += 1;
           right -= 1;
       }

       return true;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       private static bool IsAsciiAlnum(char ch) {
           return (ch >= '0' && ch <= '9')
               || (ch >= 'A' && ch <= 'Z')
               || (ch >= 'a' && ch <= 'z');
       }

       private static char AsciiLower(char ch) {
           return ch >= 'A' && ch <= 'Z'
               ? (char)(ch + ('a' - 'A'))
               : ch;
       }

       public bool IsPalindrome(string s) {
           int left = 0;
           int right = s.Length - 1;

           while (left < right) {
               while (left < right && !IsAsciiAlnum(s[left])) {
                   ++left;
               }
               while (left < right && !IsAsciiAlnum(s[right])) {
                   --right;
               }
               if (left >= right) {
                   break;
               }
               if (AsciiLower(s[left]) != AsciiLower(s[right])) {
                   return false;
               }
               ++left;
               --right;
           }

           return true;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function is_palindrome(s::String)::Bool
       bytes = codeunits(s)
       left = 1
       right = length(bytes)

       is_ascii_alnum(ch::UInt8) =
           UInt8('0') <= ch <= UInt8('9') ||
           UInt8('A') <= ch <= UInt8('Z') ||
           UInt8('a') <= ch <= UInt8('z')

       ascii_lower(ch::UInt8) =
           UInt8('A') <= ch <= UInt8('Z') ? ch + 0x20 : ch

       while left < right
           while left < right && !is_ascii_alnum(bytes[left])
               left += 1
           end
           while left < right && !is_ascii_alnum(bytes[right])
               right -= 1
           end
           left >= right && break
           ascii_lower(bytes[left]) == ascii_lower(bytes[right]) ||
               return false
           left += 1
           right -= 1
       end

       return true
   end

``codeunits`` 是原字符串代码单元的包装视图；题目 ASCII 输入下每个字节就是一个字符。

R
~

.. code-block:: r

   is_palindrome <- function(s) {
     bytes <- as.integer(charToRaw(s))
     left <- 1L
     right <- length(bytes)

     is_ascii_alnum <- function(code) {
       (code >= 48L && code <= 57L) ||
         (code >= 65L && code <= 90L) ||
         (code >= 97L && code <= 122L)
     }
     ascii_lower <- function(code) {
       if (code >= 65L && code <= 90L) code + 32L else code
     }

     while (left < right) {
       while (left < right && !is_ascii_alnum(bytes[left])) {
         left <- left + 1L
       }
       while (left < right && !is_ascii_alnum(bytes[right])) {
         right <- right - 1L
       }
       if (left >= right) {
         break
       }
       if (ascii_lower(bytes[left]) != ascii_lower(bytes[right])) {
         return(FALSE)
       }
       left <- left + 1L
       right <- right - 1L
     }

     TRUE
   }

R 的 ``charToRaw`` 与 ``as.integer`` 物化字节向量，属于适配器 ``O(n)`` 空间，不应被核心双指针 ``O(1)`` 掩盖。

验证计划与证据
--------------

* 固定用例覆盖空清洗结果、单有效字符、大小写混合、数字、端点标点和首对有效字符不匹配；
* 独立基准显式过滤 ASCII 字母数字字符、统一小写，再比较序列与逆序；
* 对小字母表穷举短字符串，并随机生成可打印 ASCII 字符串与基准对拍；
* Python 执行 5000 组随机字符串和 3906 个穷举字符串；
* C/C++、Java、Go、TypeScript 执行固定与 1000 组随机对拍，C/C++ 使用严格警告和 sanitizers；
* Rust、C#、Julia、R 缺少运行时时，检查空串下标、ASCII 边界、代码单元语义和适配器物化。

关键边界
--------

* 全部字符无效时应返回 ``true``；
* 数字是有效字符，不能只保留英文字母；
* C/C++ 读取 ``char`` 前转换为 ``unsigned char``，避免负值参与字符判断；
* 半开区间实现需要在访问 ``right - 1`` 前保证 ``left < right``；
* 不使用各语言默认 Unicode ``isalnum`` 代替本文 ASCII 契约；
* 输入 ASCII 时按字节扫描安全，若扩展到任意 Unicode，必须重新定义规范化和字符边界。

易错点
------

* 只忽略空格，没有忽略其他标点；
* 忘记数字参与比较；
* 用语言默认 Unicode 字符分类，导致跨语言字符域不一致；
* 构造清洗副本后仍声称算法额外空间 ``O(1)``；
* C 空串使用无符号 ``length - 1`` 下溢；
* 指针跳过无效字符后未再次确认是否已经相遇。

本题新增知识
------------

* 双指针可以在原序列上模拟“过滤后的首尾访问”；
* 跨语言题目需要明确 ASCII 与 Unicode 字符分类契约；
* 半开区间能消除 C/C++ 空串右端点下溢；
* 核心算法空间与语言适配器物化需要分别报告。

本题强化知识
------------

* 单调向内指针保证线性总访问次数；
* 首尾首次不匹配即可依据回文定义提前结束；
* 输入只读不等于所有语言都没有输入适配分配；
* 标准库便利函数必须核对语义域，而不是只看函数名称。

关联题目
--------

* `0009. Palindrome Number <../0001-0100/0009-palindrome-number.rst>`_：数值域中的半反转回文判断；
* `0005. Longest Palindromic Substring
  <../0001-0100/0005-longest-palindromic-substring.rst>`_：连续回文区间与过滤后整串回文的状态不同。

最小自检
--------

#. 为什么双指针跳过标点不会改变清洗后有效字符的顺序？
#. 为什么本文不直接使用 Python ``isalnum`` 或 Java ``Character.isLetterOrDigit``？
#. 为什么 R 实现不能把完整额外空间写成 ``O(1)``？

答案要点
--------

#. 跳过的字符本来就不属于目标序列，剩余字符仍按原相对顺序被访问。
#. 这些 API 使用 Unicode 字符分类，本文为十语言一致性显式限定 ASCII。
#. ``charToRaw`` 和整数转换物化长度为 ``n`` 的向量，只有双指针状态本身是常数空间。
