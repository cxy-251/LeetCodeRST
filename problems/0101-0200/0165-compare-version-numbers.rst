0165. Compare Version Numbers
=============================

题目信息
--------

:题号: 0165
:难度: Medium
:主题: 字符串、双指针、数字段比较
:原题: `LeetCode 0165 <https://leetcode.com/problems/compare-version-numbers/>`_
:访问状态: Available
:教学重点: 前导零、缺失修订号、避免整数解析依赖

题目重述
--------

给定两个由十进制数字和点号组成的版本字符串。点号分隔修订号；比较时忽略每段前导零，较短字符串缺失
的后续修订号视为 ``0``。若第一个版本较小、相等或较大，分别返回 ``-1``、``0`` 或 ``1``。

算法
----

两个指针分别扫描版本字符串。每轮定位当前修订号的结束点，再跳过前导零，得到该段的“有效数字区间”。
比较顺序为：

#. 有效数字数量不同，位数更多的修订号更大；
#. 位数相同，逐字符按十进制字典序比较；
#. 当前段相等时移动到下一个修订号；
#. 某一侧已经结束时，把它当作有效长度为零的修订号。

该方法不把修订号解析成机器整数，因此即使某段很长，也不会发生整数溢出或浮点精度丢失。输入字符域只
包含 ASCII 数字与点号；Go、Rust、Julia 和 R 的字节级实现由这一契约支撑。

正确性
~~~~~~

去除前导零后，修订号的数值大小首先由有效十进制位数决定；位数相同的非负十进制整数，其数值顺序与
逐字符字典序相同。算法因此能正确比较每一对对应修订号。

全零修订号的有效长度为零，与缺失修订号采用相同表示。若当前修订号相等，版本大小只由后续第一个不同
修订号决定；双指针按顺序检查所有修订号，首次返回的差异就是整个版本的比较结果。若扫描结束仍无差异，
所有对应修订号都相等，返回 ``0`` 正确。

复杂度
~~~~~~

每个字符至多被结束点扫描、前导零扫描或等长比较访问常数次，时间复杂度为 ``O(n + m)``。C、Python、
Java、Go、TypeScript、C# 和 Julia 只保存索引，算法额外空间为 ``O(1)``；C++ 平台按值参数会复制两个
字符串，Rust 接口消费输入字符串；R 将两个 ASCII 字符串物化为整数向量，适配器额外空间为
``O(n + m)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <string.h>

   int compareVersion(char *version1, char *version2) {
       size_t length1 = strlen(version1);
       size_t length2 = strlen(version2);
       size_t position1 = 0;
       size_t position2 = 0;

       while (position1 < length1 || position2 < length2) {
           size_t end1 = position1;
           while (end1 < length1 && version1[end1] != '.') {
               ++end1;
           }
           size_t significant1 = position1;
           while (
               significant1 < end1 &&
               version1[significant1] == '0'
           ) {
               ++significant1;
           }

           size_t end2 = position2;
           while (end2 < length2 && version2[end2] != '.') {
               ++end2;
           }
           size_t significant2 = position2;
           while (
               significant2 < end2 &&
               version2[significant2] == '0'
           ) {
               ++significant2;
           }

           size_t digits1 = end1 - significant1;
           size_t digits2 = end2 - significant2;
           if (digits1 != digits2) {
               return digits1 < digits2 ? -1 : 1;
           }

           for (size_t offset = 0; offset < digits1; ++offset) {
               char left = version1[significant1 + offset];
               char right = version2[significant2 + offset];
               if (left != right) {
                   return left < right ? -1 : 1;
               }
           }

           position1 = end1 < length1 ? end1 + 1 : length1;
           position2 = end2 < length2 ? end2 + 1 : length2;
       }

       return 0;
   }

C++
~~~

.. code-block:: cpp

   #include <cstddef>
   #include <string>

   class Solution {
   public:
       int compareVersion(
           std::string version1,
           std::string version2
       ) {
           std::size_t position1 = 0;
           std::size_t position2 = 0;

           while (
               position1 < version1.size() ||
               position2 < version2.size()
           ) {
               const Segment left = readSegment(version1, position1);
               const Segment right = readSegment(version2, position2);

               if (left.length != right.length) {
                   return left.length < right.length ? -1 : 1;
               }
               for (
                   std::size_t offset = 0;
                   offset < left.length;
                   ++offset
               ) {
                   char first = version1[left.start + offset];
                   char second = version2[right.start + offset];
                   if (first != second) {
                       return first < second ? -1 : 1;
                   }
               }

               position1 = left.next;
               position2 = right.next;
           }

           return 0;
       }

   private:
       struct Segment {
           std::size_t start;
           std::size_t length;
           std::size_t next;
       };

       static Segment readSegment(
           const std::string& version,
           std::size_t position
       ) {
           std::size_t end = position;
           while (end < version.size() && version[end] != '.') {
               ++end;
           }

           std::size_t significant = position;
           while (
               significant < end &&
               version[significant] == '0'
           ) {
               ++significant;
           }

           return {
               significant,
               end - significant,
               end < version.size() ? end + 1 : version.size(),
           };
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def compareVersion(self, version1: str, version2: str) -> int:
           position1 = 0
           position2 = 0

           while position1 < len(version1) or position2 < len(version2):
               start1, digits1, position1 = self._read_segment(
                   version1,
                   position1,
               )
               start2, digits2, position2 = self._read_segment(
                   version2,
                   position2,
               )

               if digits1 != digits2:
                   return -1 if digits1 < digits2 else 1

               for offset in range(digits1):
                   first = version1[start1 + offset]
                   second = version2[start2 + offset]
                   if first != second:
                       return -1 if first < second else 1

           return 0

       @staticmethod
       def _read_segment(
           version: str,
           position: int,
       ) -> tuple[int, int, int]:
           end = position
           while end < len(version) and version[end] != ".":
               end += 1

           significant = position
           while significant < end and version[significant] == "0":
               significant += 1

           next_position = end + 1 if end < len(version) else len(version)
           return significant, end - significant, next_position

Java
~~~~

.. code-block:: java

   class Solution {
       public int compareVersion(String version1, String version2) {
           int position1 = 0;
           int position2 = 0;

           while (
               position1 < version1.length() ||
               position2 < version2.length()
           ) {
               Segment left = readSegment(version1, position1);
               Segment right = readSegment(version2, position2);

               if (left.length != right.length) {
                   return left.length < right.length ? -1 : 1;
               }
               for (int offset = 0; offset < left.length; offset++) {
                   char first = version1.charAt(left.start + offset);
                   char second = version2.charAt(right.start + offset);
                   if (first != second) {
                       return first < second ? -1 : 1;
                   }
               }

               position1 = left.next;
               position2 = right.next;
           }

           return 0;
       }

       private Segment readSegment(String version, int position) {
           int end = position;
           while (
               end < version.length() &&
               version.charAt(end) != '.'
           ) {
               end++;
           }

           int significant = position;
           while (
               significant < end &&
               version.charAt(significant) == '0'
           ) {
               significant++;
           }

           int next = end < version.length()
               ? end + 1
               : version.length();
           return new Segment(significant, end - significant, next);
       }

       private static final class Segment {
           private final int start;
           private final int length;
           private final int next;

           private Segment(int start, int length, int next) {
               this.start = start;
               this.length = length;
               this.next = next;
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn compare_version(version1: String, version2: String) -> i32 {
           let left = version1.as_bytes();
           let right = version2.as_bytes();
           let mut position1 = 0usize;
           let mut position2 = 0usize;

           while position1 < left.len() || position2 < right.len() {
               let (start1, digits1, next1) =
                   Self::read_segment(left, position1);
               let (start2, digits2, next2) =
                   Self::read_segment(right, position2);

               if digits1 != digits2 {
                   return if digits1 < digits2 { -1 } else { 1 };
               }

               for offset in 0..digits1 {
                   let first = left[start1 + offset];
                   let second = right[start2 + offset];
                   if first != second {
                       return if first < second { -1 } else { 1 };
                   }
               }

               position1 = next1;
               position2 = next2;
           }

           0
       }

       fn read_segment(
           version: &[u8],
           position: usize,
       ) -> (usize, usize, usize) {
           let mut end = position;
           while end < version.len() && version[end] != b'.' {
               end += 1;
           }

           let mut significant = position;
           while significant < end && version[significant] == b'0' {
               significant += 1;
           }

           let next = if end < version.len() {
               end + 1
           } else {
               version.len()
           };
           (significant, end - significant, next)
       }
   }

Go
~~

.. code-block:: go

   func compareVersion(version1 string, version2 string) int {
       position1 := 0
       position2 := 0

       for position1 < len(version1) || position2 < len(version2) {
           start1, digits1, next1 :=
               readVersionSegment(version1, position1)
           start2, digits2, next2 :=
               readVersionSegment(version2, position2)

           if digits1 < digits2 {
               return -1
           }
           if digits1 > digits2 {
               return 1
           }

           for offset := 0; offset < digits1; offset++ {
               first := version1[start1+offset]
               second := version2[start2+offset]
               if first < second {
                   return -1
               }
               if first > second {
                   return 1
               }
           }

           position1 = next1
           position2 = next2
       }

       return 0
   }

   func readVersionSegment(
       version string,
       position int,
   ) (int, int, int) {
       end := position
       for end < len(version) && version[end] != '.' {
           end++
       }

       significant := position
       for significant < end && version[significant] == '0' {
           significant++
       }

       next := len(version)
       if end < len(version) {
           next = end + 1
       }
       return significant, end - significant, next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function compareVersion(
       version1: string,
       version2: string,
   ): number {
       let position1 = 0;
       let position2 = 0;

       while (
           position1 < version1.length ||
           position2 < version2.length
       ) {
           const left = readVersionSegment(version1, position1);
           const right = readVersionSegment(version2, position2);

           if (left.length !== right.length) {
               return left.length < right.length ? -1 : 1;
           }
           for (let offset = 0; offset < left.length; offset++) {
               const first = version1[left.start + offset];
               const second = version2[right.start + offset];
               if (first !== second) {
                   return first < second ? -1 : 1;
               }
           }

           position1 = left.next;
           position2 = right.next;
       }

       return 0;
   }

   function readVersionSegment(
       version: string,
       position: number,
   ): { start: number; length: number; next: number } {
       let end = position;
       while (end < version.length && version[end] !== ".") {
           end++;
       }

       let significant = position;
       while (
           significant < end &&
           version[significant] === "0"
       ) {
           significant++;
       }

       return {
           start: significant,
           length: end - significant,
           next: end < version.length ? end + 1 : version.length,
       };
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int CompareVersion(string version1, string version2) {
           int position1 = 0;
           int position2 = 0;

           while (
               position1 < version1.Length ||
               position2 < version2.Length
           ) {
               Segment left = ReadSegment(version1, position1);
               Segment right = ReadSegment(version2, position2);

               if (left.Length != right.Length) {
                   return left.Length < right.Length ? -1 : 1;
               }
               for (int offset = 0; offset < left.Length; offset++) {
                   char first = version1[left.Start + offset];
                   char second = version2[right.Start + offset];
                   if (first != second) {
                       return first < second ? -1 : 1;
                   }
               }

               position1 = left.Next;
               position2 = right.Next;
           }

           return 0;
       }

       private static Segment ReadSegment(
           string version,
           int position
       ) {
           int end = position;
           while (end < version.Length && version[end] != '.') {
               end++;
           }

           int significant = position;
           while (
               significant < end &&
               version[significant] == '0'
           ) {
               significant++;
           }

           int next = end < version.Length
               ? end + 1
               : version.Length;
           return new Segment(significant, end - significant, next);
       }

       private readonly struct Segment {
           public int Start { get; }
           public int Length { get; }
           public int Next { get; }

           public Segment(int start, int length, int next) {
               Start = start;
               Length = length;
               Next = next;
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function compare_version(
       version1::String,
       version2::String,
   )::Int
       left = codeunits(version1)
       right = codeunits(version2)
       position1 = 1
       position2 = 1

       while position1 <= length(left) || position2 <= length(right)
           start1, digits1, next1 =
               read_version_segment(left, position1)
           start2, digits2, next2 =
               read_version_segment(right, position2)

           digits1 < digits2 && return -1
           digits1 > digits2 && return 1

           offset = 0
           while offset < digits1
               first = left[start1 + offset]
               second = right[start2 + offset]
               first < second && return -1
               first > second && return 1
               offset += 1
           end

           position1 = next1
           position2 = next2
       end

       return 0
   end

   function read_version_segment(
       version,
       position::Int,
   )::Tuple{Int, Int, Int}
       count = length(version)
       position > count && return (count + 1, 0, count + 1)

       stop = position
       while stop <= count && version[stop] != UInt8('.')
           stop += 1
       end

       significant = position
       while significant < stop && version[significant] == UInt8('0')
           significant += 1
       end

       next_position = stop <= count ? stop + 1 : count + 1
       return significant, stop - significant, next_position
   end

R
~

.. code-block:: r

   compare_version <- function(version1, version2) {
     left <- as.integer(charToRaw(version1))
     right <- as.integer(charToRaw(version2))
     position1 <- 1L
     position2 <- 1L

     while (
       position1 <= length(left) ||
       position2 <= length(right)
     ) {
       first <- read_version_segment(left, position1)
       second <- read_version_segment(right, position2)

       if (first$length < second$length) {
         return(-1L)
       }
       if (first$length > second$length) {
         return(1L)
       }

       offset <- 0L
       while (offset < first$length) {
         left_digit <- left[first$start + offset]
         right_digit <- right[second$start + offset]
         if (left_digit < right_digit) {
           return(-1L)
         }
         if (left_digit > right_digit) {
           return(1L)
         }
         offset <- offset + 1L
       }

       position1 <- first$next_position
       position2 <- second$next_position
     }

     0L
   }

   read_version_segment <- function(bytes, position) {
     count <- length(bytes)
     if (position > count) {
       return(list(
         start = count + 1L,
         length = 0L,
         next_position = count + 1L
       ))
     }

     stop <- position
     while (stop <= count && bytes[stop] != 46L) {
       stop <- stop + 1L
     }

     significant <- position
     while (significant < stop && bytes[significant] == 48L) {
       significant <- significant + 1L
     }

     list(
       start = significant,
       length = stop - significant,
       next_position = if (stop <= count) stop + 1L else count + 1L
     )
   }

关键边界
--------

* ``1.01`` 与 ``1.001`` 的当前修订号相等；
* ``1.0`` 与 ``1.0.0`` 中缺失修订号和全零修订号等价；
* 很长的修订号通过有效长度和字符比较，不依赖整数类型宽度；
* 全零段跳过前导零后有效长度为零；
* 两个指针必须独立推进，较短版本结束后仍需处理另一侧剩余段；
* Julia 使用 ``codeunits`` 轻量视图，R 明确物化 ASCII 整数向量。

验证
----

运行三个官方示例，以及缺失修订号、全零段、首次差异位于末尾和超长修订号案例。Python 额外生成 2000
对随机版本字符串，与使用任意精度整数逐段比较的独立基准对拍；C、C++、Go、Java 和 TypeScript 运行
代表案例，其余语言完成静态检查。

最小自检
--------

#. 去除前导零后，为什么应先比较有效位数？
#. 为什么缺失修订号可以与有效长度为零的修订号统一处理？
#. 直接解析为浮点数或固定宽整数分别会引入什么风险？
