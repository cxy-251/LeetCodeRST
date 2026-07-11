0028. Find the Index of the First Occurrence in a String
===========================================================

题目信息
--------

:题号: 0028
:难度: Easy
:主题: 字符串、子串匹配、起点枚举、边界控制
:原题: `LeetCode 0028
        <https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/>`_
:访问状态: Available
:教学重点: 候选起点范围、逐字符验证、最早匹配、空模式边界

题目重述
--------

给定两个字符串 ``haystack`` 和 ``needle``，在 ``haystack`` 中寻找第一次完整出现
``needle`` 的起始位置。若存在，返回最小的零基下标；若不存在，返回 ``-1``。

本题关注的是连续子串。``needle`` 的字符必须在 ``haystack`` 中连续出现，字符顺序不能改变，
也不能跳过中间字符。

自建示例
--------

普通匹配
~~~~~~~~

.. code-block:: text

   输入：haystack = "abracadabra", needle = "cada"
   返回：4

   从下标 4 开始的连续四个字符是 "cada"。

存在多个匹配
~~~~~~~~~~~~

.. code-block:: text

   输入：haystack = "aaaaa", needle = "aa"
   返回：0

   下标 0、1、2、3 都能形成匹配，题目要求返回最早的 0。

没有匹配
~~~~~~~~

.. code-block:: text

   输入：haystack = "algorithm", needle = "rhythm"
   返回：-1

模式比文本长
~~~~~~~~~~~~

.. code-block:: text

   输入：haystack = "cat", needle = "catch"
   返回：-1

空模式
~~~~~~

.. code-block:: text

   输入：haystack = "abc", needle = ""
   返回：0

空字符串在任何字符串的开头都可以视为一次长度为 0 的匹配。当前 LeetCode 约束通常保证
``needle`` 非空，但实现保留这一通用字符串接口边界。

问题抽象
--------

设文本长度为 ``n``，模式长度为 ``m``。一个候选起点 ``start`` 合法，当且仅当：

* ``0 <= start``；
* ``start + m <= n``，模式不会越过文本末尾；
* 对每个 ``offset``，都有
  ``haystack[start + offset] == needle[offset]``。

因此问题可以拆成两层：

#. 按从小到大的顺序枚举所有合法候选起点；
#. 在每个起点逐字符验证整个模式是否相等。

第一个验证成功的起点就是答案。若所有候选都失败，则返回 ``-1``。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 起点枚举与逐字符验证
     - 最坏 ``O((n - m + 1) × m)``
     - ``O(1)``
     - 主解法；状态直接，适合建立字符串匹配边界
   * - 标准库查找
     - 依实现而定
     - 依实现而定
     - 工程写法简洁，但隐藏匹配过程
   * - KMP
     - ``O(n + m)``
     - ``O(m)``
     - 长文本和重复模式下更稳定，状态与证明更复杂
   * - Rabin–Karp
     - 平均 ``O(n + m)``
     - ``O(1)`` 或 ``O(m)``
     - 需要处理哈希碰撞与整数语义

本题主解法采用朴素匹配。它直接暴露候选起点、窗口边界和“第一次完整匹配”的含义，十种语言
都能使用相同状态。KMP 是重要的线性字符串匹配算法，后续出现需要高效模式匹配的题目时再完整
展开其前缀函数与回退不变量。

主解法：起点枚举与逐字符验证
--------------------------

状态含义
~~~~~~~~

算法维护两个位置：

* ``start``：当前尝试的候选起点；
* ``offset``：当前正在比较的模式内偏移；
* ``start + offset``：文本中与 ``needle[offset]`` 对齐的位置。

候选起点只需要枚举到 ``n - m``。若 ``start > n - m``，剩余文本长度小于 ``m``，不可能再
容纳完整模式。

核心不变量
~~~~~~~~~~

在验证某个 ``start`` 时，每次比较前保持：

* ``needle[0:offset]`` 已经与
  ``haystack[start:start + offset]`` 完全相等；
* ``0 <= offset <= m``；
* ``start + offset < n`` 在真正读取字符时成立。

若当前字符相等，增加 ``offset``，已匹配前缀延长一位。若字符不等，当前 ``start`` 不可能形成
完整匹配，立即结束该起点的验证。

当 ``offset == m`` 时，模式的全部字符都已匹配，当前起点成功。

为什么返回的是第一次出现
~~~~~~~~~~~~~~~~~~~~~~~~

``start`` 按 ``0, 1, 2, ...`` 递增。算法只有在完整验证 ``m`` 个字符相等后才返回。因此：

* 返回的起点一定是合法匹配；
* 在返回前的所有更小起点都已经验证失败；
* 当前返回值就是最小合法起点。

执行过程
~~~~~~~~

以 ``haystack = "mississippi"``、``needle = "issip"`` 为例：

.. list-table::
   :header-rows: 1

   * - ``start``
     - 比较过程
     - 结果
   * - 0
     - ``m`` 与 ``i`` 不同
     - 失败
   * - 1
     - ``issi`` 相同，随后 ``s`` 与 ``p`` 不同
     - 失败
   * - 2
     - ``s`` 与 ``i`` 不同
     - 失败
   * - 3
     - ``s`` 与 ``i`` 不同
     - 失败
   * - 4
     - ``issip`` 全部相同
     - 返回 4

这个例子说明，部分前缀匹配并不等于完整匹配。朴素算法在失配后把起点移动一位，重新从模式
开头验证。

正确性依据
~~~~~~~~~~

先证明算法返回的值正确。算法只在某个 ``start`` 的所有 ``m`` 对字符都相等时返回。此时
``haystack[start:start + m]`` 与 ``needle`` 完全相同，所以返回位置一定是一个合法匹配。

再证明返回位置最早。候选起点严格按递增顺序检查。若算法在 ``start`` 返回，则每个更小起点都
已经遇到至少一个失配字符，因此都不是合法匹配。于是 ``start`` 是最小合法起点。

最后证明返回 ``-1`` 正确。所有可能容纳模式的起点恰好是 ``0`` 到 ``n - m``。若这些起点都
验证失败，则不存在其他合法起点，所以模式没有出现在文本中。

复杂度
~~~~~~

设 ``n = len(haystack)``，``m = len(needle)``：

* 最多检查 ``n - m + 1`` 个候选起点；
* 每个起点最多比较 ``m`` 个字符；
* 最坏时间复杂度为 ``O((n - m + 1) × m)``，通常简写为 ``O(nm)``；
* 最好情况下每个起点首字符即失配，时间复杂度接近 ``O(n)``；
* 只使用固定数量的索引，额外空间复杂度为 ``O(1)``。

字符串字符单位
~~~~~~~~~~~~~~

本题公开约束使用小写英文字母，因此 UTF-8 字节、Unicode 标量值和用户感知字符的边界在输入
范围内一致。各语言实现可以安全按字节或代码单元索引。

一般 Unicode 文本不具备这个性质：

* UTF-8 中一个字符可能占多个字节；
* Java、TypeScript 和 C# 的字符串索引通常访问 UTF-16 代码单元；
* 用户感知的一个字符还可能由多个码点组合而成。

因此下面代码适用于本题 ASCII 约束，不应直接当作通用 Unicode 子串匹配接口。

核心语言实现
------------

C
~

.. code-block:: c

   int strStr(char *haystack, char *needle) {
       int n = 0;
       int m = 0;

       while (haystack[n] != '\0') {
           ++n;
       }
       while (needle[m] != '\0') {
           ++m;
       }

       if (m == 0) {
           return 0;
       }
       if (m > n) {
           return -1;
       }

       for (int start = 0; start <= n - m; ++start) {
           int offset = 0;

           while (offset < m &&
                  haystack[start + offset] == needle[offset]) {
               ++offset;
           }

           if (offset == m) {
               return start;
           }
       }

       return -1;
   }

C 字符串以 ``'\0'`` 结尾。先求长度后再使用 ``start <= n - m``，避免无符号长度相减产生
下溢；函数只读取输入缓冲区，不取得或释放其内存所有权。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int strStr(
           const std::string& haystack,
           const std::string& needle
       ) {
           if (needle.empty()) {
               return 0;
           }
           if (needle.size() > haystack.size()) {
               return -1;
           }

           const std::size_t last = haystack.size() - needle.size();

           for (std::size_t start = 0; start <= last; ++start) {
               std::size_t offset = 0;

               while (offset < needle.size() &&
                      haystack[start + offset] == needle[offset]) {
                   ++offset;
               }

               if (offset == needle.size()) {
                   return static_cast<int>(start);
               }
           }

           return -1;
       }
   };

``std::size_t`` 是无符号类型，所以必须先判断 ``needle.size() > haystack.size()``，再做长度
相减。题目长度范围保证成功下标可以转换为 ``int``。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def strStr(self, haystack: str, needle: str) -> int:
           n = len(haystack)
           m = len(needle)

           if m == 0:
               return 0

           for start in range(n - m + 1):
               offset = 0

               while (
                   offset < m
                   and haystack[start + offset] == needle[offset]
               ):
                   offset += 1

               if offset == m:
                   return start

           return -1

当 ``m > n`` 时，``range(n - m + 1)`` 为空，循环自然不执行。代码没有使用切片，避免每个
候选起点构造新的子串对象。

Java
~~~~

.. code-block:: java

   class Solution {
       public int strStr(String haystack, String needle) {
           int n = haystack.length();
           int m = needle.length();

           if (m == 0) {
               return 0;
           }

           for (int start = 0; start + m <= n; ++start) {
               int offset = 0;

               while (
                   offset < m
                   && haystack.charAt(start + offset)
                       == needle.charAt(offset)
               ) {
                   ++offset;
               }

               if (offset == m) {
                   return start;
               }
           }

           return -1;
       }
   }

使用 ``start + m <= n`` 直接表达窗口右边界。题目只含小写英文字母，``charAt`` 的 UTF-16
代码单元比较与题目字符比较一致。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn str_str(haystack: String, needle: String) -> i32 {
           let text = haystack.as_bytes();
           let pattern = needle.as_bytes();
           let n = text.len();
           let m = pattern.len();

           if m == 0 {
               return 0;
           }
           if m > n {
               return -1;
           }

           for start in 0..=n - m {
               let mut offset: usize = 0;

               while offset < m
                   && text[start + offset] == pattern[offset]
               {
                   offset += 1;
               }

               if offset == m {
                   return start as i32;
               }
           }

           -1
       }
   }

Rust 的 ``String`` 不能按整数直接索引，因为 UTF-8 字符宽度可变。本题是 ASCII 输入，所以
转换为字节切片后比较。先判断 ``m > n``，避免 ``usize`` 相减下溢。

Go
~~

.. code-block:: go

   func strStr(haystack string, needle string) int {
       n := len(haystack)
       m := len(needle)

       if m == 0 {
           return 0
       }
       if m > n {
           return -1
       }

       for start := 0; start <= n-m; start++ {
           offset := 0

           for offset < m &&
               haystack[start+offset] == needle[offset] {
               offset++
           }

           if offset == m {
               return start
           }
       }

       return -1
   }

Go 的字符串索引返回字节。当前 ASCII 约束下字节位置就是题目要求的字符位置；通用 UTF-8
文本应先明确返回字节下标还是字符下标。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function strStr(haystack: string, needle: string): number {
       const n = haystack.length;
       const m = needle.length;

       if (m === 0) {
           return 0;
       }

       for (let start = 0; start + m <= n; start++) {
           let offset = 0;

           while (
               offset < m
               && haystack[start + offset] === needle[offset]
           ) {
               offset++;
           }

           if (offset === m) {
               return start;
           }
       }

       return -1;
   }

TypeScript 的字符串下标访问 UTF-16 代码单元。题目 ASCII 约束下没有代理对或组合字符边界问题。
长度和下标使用 ``number``，当前范围远小于精确整数上限。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int StrStr(string haystack, string needle) {
           int n = haystack.Length;
           int m = needle.Length;

           if (m == 0) {
               return 0;
           }

           for (int start = 0; start + m <= n; ++start) {
               int offset = 0;

               while (
                   offset < m
                   && haystack[start + offset] == needle[offset]
               ) {
                   ++offset;
               }

               if (offset == m) {
                   return start;
               }
           }

           return -1;
       }
   }

C# 字符串索引返回 UTF-16 ``char``。本题小写英文字母均占一个代码单元，因此返回的零基位置与
题目定义一致。

Julia
~~~~~

.. code-block:: julia

   function find_first_occurrence(
       haystack::AbstractString,
       needle::AbstractString,
   )::Int
       text = codeunits(haystack)
       pattern = codeunits(needle)
       n = length(text)
       m = length(pattern)

       m == 0 && return 0
       m > n && return -1

       for start0 in 0:(n - m)
           offset0 = 0

           while offset0 < m &&
                 text[start0 + offset0 + 1] ==
                 pattern[offset0 + 1]
               offset0 += 1
           end

           offset0 == m && return start0
       end

       return -1
   end

Julia 字符串索引不是简单整数递增接口。题目为 ASCII，因此使用 ``codeunits`` 获得字节视图。
算法保留零基 ``start0`` 作为返回值，访问数组时统一加 1 映射到 Julia 一基索引。

R
~

.. code-block:: r

   find_first_occurrence <- function(haystack, needle) {
     text <- utf8ToInt(haystack)
     pattern <- utf8ToInt(needle)
     n <- length(text)
     m <- length(pattern)

     if (m == 0L) {
       return(0L)
     }
     if (m > n) {
       return(-1L)
     }

     for (start0 in 0:(n - m)) {
       offset0 <- 0L

       while (
         offset0 < m &&
         text[[start0 + offset0 + 1L]] ==
           pattern[[offset0 + 1L]]
       ) {
         offset0 <- offset0 + 1L
       }

       if (offset0 == m) {
         return(as.integer(start0))
       }
     }

     -1L
   }

``utf8ToInt`` 把字符串转换为 Unicode 码点向量。R 向量使用一基索引，因此访问位置加 1；
函数仍返回题目要求的零基下标。当前输入为 ASCII，一个码点对应一个题目字符。

工程写法：标准库查找
------------------

实际项目中，各语言通常提供成熟的子串查找 API，例如 C++ ``string::find``、Python
``str.find``、Java ``indexOf``、Rust ``find``、Go ``strings.Index``、TypeScript
``indexOf`` 和 C# ``IndexOf``。

这些 API 更短，也可能使用经过优化的内部算法。它们几乎完全隐藏了本题需要学习的候选起点与
逐字符验证，因此本题把手写匹配作为教学主线。使用标准库时还要确认两个接口细节：

* “未找到”返回 ``-1``、特殊常量还是可选值；
* 返回的是字节下标、代码单元下标、码点下标还是用户感知字符下标。

对照解法：KMP
-------------

KMP 先为 ``needle`` 构造最长相等真前后缀长度表。发生失配时，不把模式完全退回开头，而是
利用已经匹配部分的内部重复结构移动模式。文本指针不回退，因此总时间复杂度为 ``O(n + m)``。

KMP 的关键教学增量包括前缀函数定义、失配回退仍保持的匹配前缀不变量，以及为什么每次回退都
严格缩短候选前缀。本题约束较小，朴素算法更适合首次建立子串匹配模型，因此这里只保留方法
对照，不展开十语言实现。

关键边界
--------

* ``needle`` 为空时返回 0；
* ``needle`` 比 ``haystack`` 长时返回 ``-1``；
* 两个字符串相等时返回 0；
* 匹配只出现在文本末尾时，必须检查起点 ``n - m``；
* 多次出现时返回最小起点，不能继续覆盖答案；
* 部分前缀相等后失配，不代表当前起点成功；
* ``m > n`` 时，C++、Rust、Go 等无符号长度不能先计算 ``n - m``；
* 本题 ASCII 约束允许按字节或 UTF-16 代码单元比较，一般 Unicode 接口必须重新定义下标单位。

易错点
------

#. 把候选循环写成 ``start < n - m``，漏掉最后一个合法起点。
#. 只比较首字符，未验证模式剩余字符。
#. 发现部分匹配就返回，没有要求 ``offset == m``。
#. 找到匹配后仍继续扫描，最终返回后续位置而不是第一次出现。
#. 使用切片比较时忽略每次创建子串可能带来的额外分配。
#. 模式更长时直接做无符号 ``n - m``，产生下溢和巨大循环上界。
#. 把子序列匹配误当成子串匹配，允许跳过文本字符。
#. 在 Rust 中直接整数索引 ``String``，或在通用 Unicode 文本中混淆字节与字符下标。
#. Julia、R 访问一基数组时忘记加 1，返回时又未转换回零基位置。

新增与强化知识
--------------

新增
~~~~

* **候选起点上界**：完整模式只能从 ``0`` 到 ``n - m`` 开始。
* **对齐窗口验证**：固定起点后，以 ``offset`` 同时推进文本窗口和模式。
* **最早匹配证明**：递增枚举起点，使第一次成功天然等于最小合法下标。
* **子串下标单位**：字节、UTF-16 代码单元、码点与用户感知字符可能不同。

强化
~~~~

* 延续 0014 的逐位置字符串比较，但本题需要枚举多个对齐起点。
* 再次使用“首个失败边界”：某个起点首次失配即可排除该起点。
* 强化无符号长度相减前先判断大小的安全顺序。
* 强化 Julia、R 的一基访问与题目零基返回值之间的转换。
* 强化标准库工程写法与教学写法的职责分离。

关联题目
--------

* `0014. Longest Common Prefix <0014-longest-common-prefix.rst>`_：两题都逐位置比较字符串；
  0014 固定起点并寻找公共前缀，本题枚举文本中的多个对齐起点。
* `0010. Regular Expression Matching <0010-regular-expression-matching.rst>`_：两题都处理字符串
  匹配；0010 的模式包含 ``.`` 与 ``*``，需要状态搜索和记忆化，本题只做精确连续匹配。

最小自检
--------

#. 为什么最后一个候选起点是 ``n - m``，并且必须包含它？
#. 验证某个起点时，``offset`` 表示什么？
#. 为什么第一个完整匹配起点一定是最小答案？
#. 模式比文本长时，为什么应在长度相减前直接返回？
#. Rust 和 Go 为什么可以按字节比较本题输入？
#. Julia 代码为什么访问时加 1，返回时不加 1？
#. 朴素匹配与 KMP 的最坏时间复杂度分别是什么？

答案要点
--------

#. 从 ``start`` 开始需要连续放下 ``m`` 个字符，所以必须满足 ``start + m <= n``。
#. ``offset`` 是已经验证相等的模式前缀长度，也是下一对待比较字符的相对位置。
#. 起点递增枚举，返回前所有更小起点都已失败。
#. C++ ``size_t``、Rust ``usize`` 等是无符号类型，负结果会下溢。
#. 本题只含 ASCII 字符，每个字符占一个 UTF-8 字节；通用 Unicode 文本不成立。
#. Julia 数组一基访问，题目答案要求零基下标，因此内部访问与外部返回使用不同坐标。
#. 朴素匹配最坏 ``O(nm)``，KMP 为 ``O(n + m)``。
