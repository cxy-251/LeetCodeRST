0165. Compare Version Numbers
=============================

题目信息
--------

:题号: 0165
:难度: Medium
:主题: 字符串、双指针、十进制规范化、无溢出比较
:原题: `LeetCode 0165 <https://leetcode.com/problems/compare-version-numbers/>`_
:访问状态: Available
:教学重点: 有效数字跨度、缺失零段、扫描进度、字符物化成本

精确契约
--------

输入 ``version1`` 与 ``version2`` 是两个合法版本字符串，满足：

* 每个字符串长度在 ``[1,500]``；
* 字符只包含 ASCII 数字 ``0..9`` 和点号 ``.``；
* 点号分隔非空修订号，每个修订号由一位或多位数字组成，可以有前导零。

比较时把每个修订号解释为忽略前导零后的非负十进制整数，从左到右比较对应修订号。
若一侧修订号较少，缺失的后续修订号按 0 处理。``version1`` 较小、相等、较大时，
分别返回 ``-1``、``0``、``1``。

算法不修改输入，也不把修订号解析成固定宽整数或浮点数；单段可能接近 500 位，
远超 ``int64``，但仍可通过数字字符跨度精确比较。

示例与反例
----------

官方示例一
~~~~~~~~~~

``version1="1.2"``、``version2="1.10"``。第一段都为 1，第二段 2 小于 10，返回 -1。
按字符串字典序比较会错误认为字符 ``'2'`` 大于 ``'1'``。

官方示例二
~~~~~~~~~~

``"1.01"`` 与 ``"1.001"`` 的第二段去掉前导零后都为 ``"1"``，返回 0。

官方示例三
~~~~~~~~~~

``"1.0"`` 与 ``"1.0.0"`` 相等。较短版本缺失的第三段按 0，等价于另一侧全零段。

超长修订号反例
~~~~~~~~~~~~~~

若一段含数百位十进制数字，``int``、``long`` 都会溢出，``double`` 也会丢失低位。
例如两个 200 位修订号只在最后一位不同，转浮点后可能相等；逐字符跨度比较仍能发现差异。

结束即判小的反例
~~~~~~~~~~~~~~~~

``"1"`` 与 ``"1.0.1"`` 在前两段等价，但第三段比较为缺失 0 与 1，第一个版本更小。
一侧字符串结束时立即返回较小会碰巧答对此例，却会把 ``"1"`` 与 ``"1.0.0"`` 错判为不等。

问题抽象与解法选择
------------------

``split('.')`` 后逐段转换为大整数写法直观，但十语言的大整数支持不同，分割还会物化子串和容器。
本题只需要比较，不需要得到修订号数值本身。

对每个当前修订号扫描出三个量：

* ``end``：当前段的半开结束位置，指向点号或字符串尾；
* ``significant``：跳过前导零后的首个有效数字位置；若全零则等于 ``end``；
* ``next``：下一段起点；有点号时为 ``end+1``，否则保持在字符串尾。

规范化后的有效跨度是 ``[significant,end)``，长度 ``digits=end-significant``。
比较两个修订号时：

#. 有效位数不同，位数多者数值更大；
#. 有效位数相同，逐位比较 ASCII 数字，首个不同字符较大者数值更大；
#. 当前段相等时，两个指针各自移动到 ``next``；
#. 已结束的一侧由读取器返回有效长度 0，统一表示缺失修订号值 0。

状态、不变量与进度度量
----------------------

``position1``、``position2`` 始终指向各自尚未比较的下一修订号首字符，或等于字符串长度。
每轮入口保持：

#. 两个位置之前的所有对应修订号已经数值相等；
#. 尚未返回时，整个版本关系只由当前位置起的后缀决定；
#. 已结束侧的后续修订号统一视为规范化空跨度，即数值 0；
#. 只要循环继续，至少一侧未结束，该侧读取后位置严格前进。

最后一条是终止证书。已结束侧的位置可以保持不变，但另一侧会越过一个非空合法段或到达字符串尾。
两字符串剩余未处理字符总数严格减少，有限轮后循环结束或提前发现差异。

读取器映射：

.. list-table::
   :header-rows: 1

   * - 段形态
     - 有效跨度
     - 数值含义
   * - ``"00120"``
     - ``"120"``
     - 120
   * - ``"000"``
     - 空跨度
     - 0
   * - 一侧已结束
     - 空跨度
     - 缺失修订号 0
   * - ``"10"``
     - ``"10"``
     - 10

正确性证明
----------

引理一：有效跨度与修订号数值等价
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

读取器只跳过当前段开头的字符 ``'0'``，不改变后续数字顺序。十进制前导零不改变数值；
若整段全零，跳过后得到空跨度，本文把它规范为数值 0。若位置已在字符串尾，
读取器同样给出空跨度，恰好实现缺失修订号按 0。

因此读取器返回的有效跨度与题目定义的修订号数值一一对应，只有数值 0 统一为长度 0。

引理二：位数和等长字典序正确比较非负十进制整数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

两个非零规范化十进制串都没有前导零。有效位数较多者至少为 ``10^(k-1)``，
而位数较少者小于该值，所以位数决定大小。

位数相同时，每一位权重从左到右严格递减；首个不同位置上，较大数字带来的正差
大于所有后续低位可能抵消的总和。因此数值顺序等于 ASCII 数字逐字符字典序。
两个长度 0 的规范化跨度都表示 0；一个长度 0、另一个非零时，位数规则也给出正确顺序。

引理三：首次不同修订号决定整个版本顺序
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

版本比较按修订号从左到右定义。循环不变量保证当前位置之前的所有段数值相等。
若当前两段由引理二判出大小，这就是首个不同修订号，后续段不再影响版本顺序，
立即返回 ``-1`` 或 ``1`` 正确。

若当前段相等，移动到下一段保持“已处理前缀相等”，不变量继续成立。

引理四：扫描必然终止且不漏尾部非零段
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

循环条件是至少一侧仍有未处理字符。合法段非空，所以未结束侧的 ``next`` 要么越过当前点号，
要么到达字符串尾，严格前进。已结束侧虽保持结束位置，却继续产生零段与另一侧对应。

因此剩余字符度量严格下降。若另一侧尾段全为零，它们逐段与缺失零段相等；若出现非零尾段，
位数规则立即返回差异。算法既不会死循环，也不会遗漏尾部。

定理：算法返回两个版本的正确比较结果
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理一证明每轮读取的跨度准确表示对应修订号；引理二证明单段比较正确；
引理三证明首次返回的差异就是版本顺序；引理四保证所有必要尾段都会被处理并最终终止。
若循环结束仍未返回，两侧所有显式或缺失修订号都数值相等，故版本相等并返回 0。

复杂度与字符串成本
------------------

设两字符串长度为 ``n``、``m``。每个字符至多参与段尾扫描、前导零扫描和一次等长比较，
总时间 ``O(n+m)``。核心状态只有位置和当前段三个边界，辅助空间 ``O(1)``，不创建子串。

语言接口成本需要单独列出：

* C++ 平台按值接收两个 ``string``，调用边界可能复制 ``O(n+m)`` 输入；核心扫描仍为常数状态；
* Rust 按值取得两个 ``String`` 所有权，``as_bytes`` 只是借用，不克隆字节；
* Java/TypeScript 的段描述对象每轮新建，只有常数个同时存活，但总分配次数与段数成正比；
* Julia ``codeunits`` 返回字符串代码单元包装，不物化 ``O(n)`` 副本；
* R ``utf8ToInt`` 为两个 ASCII 字符串各物化整数向量，适配器额外空间 ``O(n+m)``；
* 其他实现直接索引原字符串，返回载荷为常数整数。

十语言实现
----------

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

       private static Segment readSegment(
           String version,
           int position
       ) {
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
     left <- utf8ToInt(version1)
     right <- utf8ToInt(version2)
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

人工推演与静态审查
------------------

本题没有运行、编译或测试任何题解代码，也没有执行随机版本对拍、属性测试或目标语言最小程序。
以下证据来自逐段纸面推演、十进制顺序证明、进度度量和逐语言静态语义审查。

官方示例一推演
~~~~~~~~~~~~~~

``"1.2"`` 与 ``"1.10"``：

.. list-table::
   :header-rows: 1

   * - 轮次
     - 左有效跨度
     - 右有效跨度
     - 结果
   * - 1
     - ``"1"``，1 位
     - ``"1"``，1 位
     - 等长逐字相等，继续
   * - 2
     - ``"2"``，1 位
     - ``"10"``，2 位
     - 左位数少，返回 -1

官方等价示例
~~~~~~~~~~~~

``"1.01"`` 与 ``"1.001"`` 第二段分别跳过 1 个和 2 个前导零，有效跨度都为 ``"1"``。
``"1.0"`` 与 ``"1.0.0"`` 前两段相等；第三轮左侧已结束，产生长度 0 的缺失段，
右侧全零段也规范成长度 0，最终返回 0。

尾部非零与超长段
~~~~~~~~~~~~~~~~

``"1"`` 对 ``"1.0.1"`` 的第三轮比较空跨度与 ``"1"``，有效位数 ``0<1``，返回 -1。
对两个数百位、等长且只在末位不同的段，算法先确认位数相同，再扫描到末位返回；
没有任何机器数值解析或舍入。

逐语言静态语义审查
~~~~~~~~~~~~~~~~~~

* **C**：``strlen`` 后所有 ``size_t`` 差值均由有序半开边界产生；结束侧
  ``position=length`` 时得到长度 0，未结束侧继续推进。输入字符未修改。
* **C++ / Python**：辅助返回值只含索引，不创建子串；C++ 按值参数可能复制输入，
  Python 元组只有常数个同时存活，两个位置独立更新。
* **Java / TypeScript**：ASCII 数字在代码单元中保持顺序；每轮段对象只保存三个整数，
  已结束侧读取长度 0，合法非空段让另一侧严格前进。
* **Rust / Go**：ASCII 合同支撑字节索引；Rust ``as_bytes`` 借用被拥有字符串，
  Go 字符串直接按字节只读，二者都不切片或解析整数。
* **C#**：``readonly struct Segment`` 是值类型段描述，半开索引与正文一致；
  ``char`` 对 ASCII 数字的比较等同十进制位比较。
* **Julia**：``codeunits`` 是轻量 ``CodeUnits`` 包装；一基结束位置用 ``count+1``，
  已结束侧返回 ``(count+1,0,count+1)``，没有访问该虚拟位置。
* **R**：``utf8ToInt`` 物化 ASCII 码点整数向量；46/48 分别是点号/零，
  一基跨度只在 ``length>0`` 时读取，段描述列表为短命常数大小对象。

剩余风险
~~~~~~~~

静态审查没有确认各判题机语言版本、C++ 参数复制是否被优化、Java/TypeScript 短命对象的运行时分配，
或 Julia/R 自定义函数接线。实现依赖合法版本格式；连续点号、开头/结尾点号等合同外输入
没有单独报错。没有运行、编译或测试来消除这些平台风险。

关键边界与失败方式
------------------

* 原始段长度不能直接比较；前导零数量不同但数值可能相同。
* 固定宽整数会溢出，浮点数会把长修订号的低位差异舍入掉。
* 全零段跳过后有效长度必须是 0，才能与缺失修订号统一。
* 一侧结束后不能立即判小，必须继续检查另一侧剩余段是否全为零。
* 结束侧位置保持不变不会死循环，因为循环继续意味着另一侧未结束并严格前进。
* 等长有效数字只能逐字符比较首个差异，不能比较字符和或末位。
* 指针越过点号时要到 ``end+1``，到字符串尾时保持在尾；无条件加一会产生失控位置。
* ASCII 字节扫描由题面字符域支撑，不能无条件推广到任意 Unicode 数字和分隔符。
* ``split`` 解法若创建所有段和子串，仍可正确但必须报告 ``O(n+m)`` 额外物化，
  不能沿用本索引实现的核心 ``O(1)`` 空间说明。

学习链与知识更新
----------------

本题把“可能无限大的十进制整数比较”化为规范字符串比较：去掉前导零后，先看位数，再看等长字典序。
缺失修订号和全零修订号共享空跨度表示，使不同段数不需要补建数组。扫描器只输出边界，
避免了数值溢出与不必要子串物化。

新增或强化的知识包括：

* 用规范化有效跨度替代机器整数解析；
* 无前导零十进制串的顺序由位数和等长字典序完全决定；
* 缺失值可与规范零共享表示，从而统一尾部处理；
* 双指针终止可以用“至少一个未结束侧严格前进”的度量证明；
* 字符单位、输入所有权、短命对象和物化向量需要分语言计费；
* 可联系 `0043. Multiply Strings
  <../0001-0100/0043-multiply-strings.rst>`_：两题都处理超出机器整数的十进制文本，
  但本题只需比较，因而不必构造大整数结果。

带答案自检
----------

#. **为什么去零后先比较有效位数？**

   无前导零的非负十进制整数位数越多，最高数量级越大；位数不同无需逐位或解析数值。

#. **位数相同为什么可按字符比较？**

   ASCII 数字顺序与数位值顺序一致，首个不同的高位决定整个整数大小。

#. **全零段为什么规范成长度 0？**

   去掉所有前导零后没有有效数字，但其数值明确是 0；空跨度正好也能表示缺失修订号 0。

#. **一侧结束后循环为什么还要继续？**

   另一侧剩余段可能全为零，也可能首次出现非零；只有逐段与缺失零比较才能区分相等和大小。

#. **结束侧不前进为什么不会死循环？**

   循环继续时至少另一侧尚未结束，合法非空段保证它的 ``next`` 严格前进；
   两侧剩余字符总量因此下降。

#. **本方法怎样避免溢出？**

   它从不把整段转换成数值，只比较不超过 500 的有效长度和原字符串中的数字字符。
