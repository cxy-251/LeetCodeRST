0006. Zigzag Conversion
=======================

题目信息
--------

:题号: 0006
:难度: Medium
:主题: 字符串、路径模拟、周期、索引映射
:原题: `LeetCode 0006 <https://leetcode.com/problems/zigzag-conversion/>`_
:重点: 行号往返、周期长度、竖列位置、斜线位置、按行读取顺序

题目重述
--------

给定字符串 ``s`` 和行数 ``numRows``。从第 0 行开始，字符先逐行向下放置；到达最后一行后，
沿斜线逐行向上；回到第 0 行后再次向下。完成排列后，按照第 0 行到最后一行、每行从左到右的
顺序读取全部字符并返回结果。

字符串长度位于 ``[1, 1000]``，``numRows`` 位于 ``[1, 1000]``。当 ``numRows = 1`` 或
``numRows`` 不小于字符串长度时，每个字符都保持原有相对顺序，结果就是原字符串。

自建示例
--------

完整周期与不完整尾部周期：

.. code-block:: text

   输入：s = "ABCDEFGHIJK", numRows = 4

   排列：
   A     G
   B   F H
   C E   I K
   D     J

   输出："AGBFHCEIKDJ"

周期长度为 6。下标 ``0`` 至 ``5`` 构成一个完整周期，下标 ``6`` 至 ``10`` 构成未完成的尾部
周期；尾部的 ``K`` 仍属于第 2 行的上升位置。

单行退化情况：

.. code-block:: text

   输入：s = "ABCDE", numRows = 1
   输出："ABCDE"

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   private:
       std::string simulateRows(
           const std::string& s,
           int num_rows
       ) {
           if (
               num_rows == 1 ||
               num_rows >= static_cast<int>(s.size())
           ) {
               return s;
           }

           std::vector<std::string> rows(num_rows);
           int row = 0;
           int step = 1;

           for (char ch : s) {
               rows[row].push_back(ch);

               if (row == 0) {
                   step = 1;   // 顶行之后只能向下
               } else if (row == num_rows - 1) {
                   step = -1;  // 末行之后只能向上
               }

               row += step;
           }

           std::string result;
           result.reserve(s.size());
           for (const std::string& current : rows) {
               result += current;
           }
           return result;
       }

       std::string readByCycle(
           const std::string& s,
           int num_rows
       ) {
           const int length = static_cast<int>(s.size());
           if (num_rows == 1 || num_rows >= length) {
               return s;
           }

           const int cycle = 2 * num_rows - 2;
           std::string result;
           result.reserve(s.size());

           for (int row = 0; row < num_rows; ++row) {
               for (
                   int vertical = row;
                   vertical < length;
                   vertical += cycle
               ) {
                   result.push_back(s[vertical]);

                   const int diagonal =
                       vertical + cycle - 2 * row;
                   if (
                       row > 0 &&
                       row < num_rows - 1 &&
                       diagonal < length
                   ) {
                       result.push_back(
                           s[diagonal]
                       );  // 中间行同一周期中的上升位置
                   }
               }
           }

           return result;
       }

   public:
       std::string convert(std::string s, int numRows) {
           return readByCycle(s, numRows);
       }
   };

题解
----

先按路径模拟字符所属行
~~~~~~~~~~~~~~~~~~~~~~

最直观的实现不需要真的创建带空格的二维图形，只需要为每一行准备一个字符串缓冲区。扫描输入时
维护两个状态：

.. code-block:: text

   row   = 当前字符应该写入的行
   step  = 下一次行号变化，向下为 +1，向上为 -1

当前字符写入 ``rows[row]`` 后：

* 位于第 0 行时，把 ``step`` 设为 ``+1``；
* 位于最后一行时，把 ``step`` 设为 ``-1``；
* 随后执行 ``row += step``，得到下一个字符所属行。

因此行号按照下面的序列往返：

.. code-block:: text

   0, 1, 2, ..., numRows - 1, numRows - 2, ..., 1, 0, 1, ...

``simulateRows`` 完全复现题目中的绘制路径。最后依次连接各行缓冲区，就得到按行读取结果。

行号与方向如何演化
~~~~~~~~~~~~~~~~~~

使用 ``s = "ABCDEFGHIJK"``、``numRows = 4``。此时一个周期包含 6 个位置：

.. list-table::
   :header-rows: 1

   * - 输入下标
     - 字符
     - 所属行
     - 周期内位置
     - 写入后方向
   * - 0
     - ``A``
     - 0
     - 0
     - 向下
   * - 1
     - ``B``
     - 1
     - 1
     - 向下
   * - 2
     - ``C``
     - 2
     - 2
     - 向下
   * - 3
     - ``D``
     - 3
     - 3
     - 转为向上
   * - 4
     - ``E``
     - 2
     - 4
     - 向上
   * - 5
     - ``F``
     - 1
     - 5
     - 向上
   * - 6
     - ``G``
     - 0
     - 0
     - 转为向下
   * - 7
     - ``H``
     - 1
     - 1
     - 向下
   * - 8
     - ``I``
     - 2
     - 2
     - 向下
   * - 9
     - ``J``
     - 3
     - 3
     - 转为向上
   * - 10
     - ``K``
     - 2
     - 4
     - 向上

这个表已经能够生成答案，但它还需要保存所有行缓冲区。主解法进一步利用行号序列的周期性，直接
按照最终输出顺序访问原字符串。

为什么周期长度是 ``2 * numRows - 2``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

令行数为 ``r``。从第 0 行向下走到第 ``r - 1`` 行，需要 ``r - 1`` 次行号变化；从最后一行
向上回到第 0 行，又需要 ``r - 1`` 次变化。因此回到与周期起点相同的行和方向之前，共经过：

.. math::

   cycle = (r - 1) + (r - 1) = 2r - 2

个字符位置。

例如 ``r = 4`` 时，周期内行号为：

.. code-block:: text

   周期位置：0  1  2  3  4  5
   所属行：  0  1  2  3  2  1

下一个位置 6 又回到第 0 行，开始相同轨迹。``numRows = 1`` 时公式会得到 0，因此该退化情况必须
在计算周期前直接返回。

从周期轨迹推导每一行的竖列位置
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

按最终答案读取时，外层循环固定一行 ``row``。每个周期的下降阶段都会在该行出现一次，它们的
下标为：

.. math::

   vertical = row + k \cdot cycle,\quad k = 0,1,2,\ldots

这些位置在图形中位于每个周期的竖直下降部分，所以代码把它们称为 ``vertical``。第一行的下标
是 ``0, cycle, 2 * cycle, ...``；最后一行则从 ``numRows - 1`` 开始，每次增加一个周期。

中间行的斜线位置从哪里得到
~~~~~~~~~~~~~~~~~~~~~~~~~~

中间行既在下降阶段出现一次，也在上升阶段出现一次。固定第 ``k`` 个周期和行 ``row``：

* 下降位置的周期内偏移是 ``row``；
* 上升位置关于周期末端对称，周期内偏移是 ``cycle - row``。

因此上升斜线位置是：

.. math::

   diagonal = k \cdot cycle + (cycle - row)

而当前下降位置为 ``vertical = k * cycle + row``，代入后得到代码使用的形式：

.. math::

   diagonal = vertical + cycle - 2 \cdot row

对于第 0 行，公式得到下一个周期的竖列位置；对于最后一行，公式得到当前竖列位置本身。它们都是
转向点，下降位置和上升位置重合，因此只有 ``0 < row < numRows - 1`` 的中间行追加斜线字符。

周期索引如何生成示例答案
~~~~~~~~~~~~~~~~~~~~~~~~

对于 ``numRows = 4``，``cycle = 6``：

.. list-table::
   :header-rows: 1

   * - 行
     - 竖列位置
     - 有效斜线位置
     - 本行读取顺序
     - 本行结果
   * - 0
     - ``0, 6``
     - 无
     - ``0, 6``
     - ``AG``
   * - 1
     - ``1, 7``
     - ``5``
     - ``1, 5, 7``
     - ``BFH``
   * - 2
     - ``2, 8``
     - ``4, 10``
     - ``2, 4, 8, 10``
     - ``CEIK``
   * - 3
     - ``3, 9``
     - 无
     - ``3, 9``
     - ``DJ``

依次连接四行得到 ``AGBFHCEIKDJ``。第二个周期没有走完，但范围检查仍会读取有效的下标 10，
并跳过超出字符串末尾的候选位置。

解法对比与主解法选择
~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 核心状态
   * - 路径模拟与行缓冲区
     - ``O(n)``
     - ``O(n)``
     - 当前行、移动方向、每行已写字符
   * - 周期索引直接读取
     - ``O(n)``
     - ``O(1)``
     - 当前行、竖列位置、斜线位置

两种方法都只处理每个输入字符一次。路径模拟更直接地表现绘制过程；周期索引直接按照最终答案的
顺序写入一个结果缓冲区，省去所有中间行字符串，因此作为九语言统一主解法。

为什么周期索引会覆盖每个字符且只覆盖一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任意输入下标 ``position`` 都可以唯一写成：

.. math::

   position = k \cdot cycle + offset,\quad 0 \le offset < cycle

若 ``offset <= numRows - 1``，该位置属于下降阶段，所在行就是 ``offset``，会被该行的竖列公式
枚举。若 ``offset > numRows - 1``，该位置属于上升阶段，所在行是 ``cycle - offset``，会被该
中间行的斜线公式枚举。

周期起点和周期中点分别对应第一行与最后一行，只由竖列公式读取；其他周期偏移只会匹配一个中间
行的一种位置。由于 ``k`` 和 ``offset`` 的分解唯一，每个输入字符恰好被追加一次。

为什么同一行先读竖列再读斜线
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对于中间行 ``row``，第 ``k`` 个周期中的两个位置为：

.. code-block:: text

   vertical_k = row + k * cycle
   diagonal_k = vertical_k + cycle - 2 * row

并且满足：

.. math::

   vertical_k < diagonal_k < vertical_{k+1}

第一个不等式来自 ``row < numRows - 1``，第二个来自 ``row > 0``。因此在同一行的图形中，当前
周期竖列字符位于左侧，斜线字符位于其右侧，下一个周期竖列字符更靠右。代码按
“竖列、斜线、下一竖列”的顺序追加，正好等于该行从左到右的读取顺序。

复杂度来源
~~~~~~~~~~

``simulateRows`` 扫描 ``n`` 个字符并最终连接总长度为 ``n`` 的行缓冲区，时间复杂度为 ``O(n)``。
各行合计保存 ``n`` 个字符，因此除返回结果外的工作空间为 ``O(n)``。

``readByCycle`` 的外层按行遍历，内层产生的竖列和斜线位置合计恰好覆盖 ``n`` 个输入位置。每次
只执行常数次索引计算和追加，时间复杂度为 ``O(n)``。除返回字符串本身的 ``O(n)`` 空间外，只
维护行号和少量整数，工作空间为 ``O(1)``。

九语言实现
----------

题目字符范围允许按单字节或语言基础字符单位处理。C、C++、Rust 和 Go 按字节访问；Java、
TypeScript 和 C# 按 UTF-16 代码单元访问；Python、Julia 与 R 按各自常见字符序列访问。所有
实现都使用同一周期、竖列和斜线公式。

C
~

C 版本为返回结果分配独立字符串；成功返回后由调用者或平台负责释放。

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   char* convert(char* s, int numRows) {
       const int length = (int)strlen(s);
       char* result = malloc((size_t)length + 1);
       if (result == NULL) {
           return NULL;
       }

       if (numRows == 1 || numRows >= length) {
           memcpy(result, s, (size_t)length + 1);
           return result;
       }

       const int cycle = 2 * numRows - 2;
       int write = 0;

       for (int row = 0; row < numRows; ++row) {
           for (
               int vertical = row;
               vertical < length;
               vertical += cycle
           ) {
               result[write++] = s[vertical];

               const int diagonal =
                   vertical + cycle - 2 * row;
               if (
                   row > 0 &&
                   row < numRows - 1 &&
                   diagonal < length
               ) {
                   result[write++] = s[diagonal];
               }
           }
       }

       result[write] = '\0';
       return result;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def convert(self, s: str, numRows: int) -> str:
           if numRows == 1 or numRows >= len(s):
               return s

           cycle = 2 * numRows - 2
           result: list[str] = []

           for row in range(numRows):
               for vertical in range(row, len(s), cycle):
                   result.append(s[vertical])

                   diagonal = vertical + cycle - 2 * row
                   if (
                       0 < row < numRows - 1
                       and diagonal < len(s)
                   ):
                       result.append(s[diagonal])

           return "".join(result)

Java
~~~~

.. code-block:: java

   class Solution {
       public String convert(String s, int numRows) {
           if (numRows == 1 || numRows >= s.length()) {
               return s;
           }

           int cycle = 2 * numRows - 2;
           StringBuilder result = new StringBuilder(s.length());

           for (int row = 0; row < numRows; row++) {
               for (
                   int vertical = row;
                   vertical < s.length();
                   vertical += cycle
               ) {
                   result.append(s.charAt(vertical));

                   int diagonal =
                       vertical + cycle - 2 * row;
                   if (
                       row > 0 &&
                       row < numRows - 1 &&
                       diagonal < s.length()
                   ) {
                       result.append(s.charAt(diagonal));
                   }
               }
           }

           return result.toString();
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn convert(s: String, num_rows: i32) -> String {
           let bytes = s.as_bytes();
           let rows = num_rows as usize;

           if rows == 1 || rows >= bytes.len() {
               return s;
           }

           let cycle = 2 * rows - 2;
           let mut result = Vec::with_capacity(bytes.len());

           for row in 0..rows {
               let mut vertical = row;
               while vertical < bytes.len() {
                   result.push(bytes[vertical]);

                   let diagonal = vertical + cycle - 2 * row;
                   if row > 0
                       && row + 1 < rows
                       && diagonal < bytes.len()
                   {
                       result.push(bytes[diagonal]);
                   }

                   vertical += cycle;
               }
           }

           // 题目字符范围允许按 UTF-8 字节重新组成字符串。
           String::from_utf8(result).expect("结果保持有效 UTF-8")
       }
   }

Go
~~

.. code-block:: go

   func convert(s string, numRows int) string {
       if numRows == 1 || numRows >= len(s) {
           return s
       }

       cycle := 2*numRows - 2
       result := make([]byte, 0, len(s))

       for row := 0; row < numRows; row++ {
           for vertical := row; vertical < len(s); vertical += cycle {
               result = append(result, s[vertical])

               diagonal := vertical + cycle - 2*row
               if row > 0 && row < numRows-1 && diagonal < len(s) {
                   result = append(result, s[diagonal])
               }
           }
       }

       return string(result)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function convert(s: string, numRows: number): string {
       if (numRows === 1 || numRows >= s.length) {
           return s;
       }

       const cycle = 2 * numRows - 2;
       const result: string[] = [];

       for (let row = 0; row < numRows; row += 1) {
           for (
               let vertical = row;
               vertical < s.length;
               vertical += cycle
           ) {
               result.push(s[vertical]);

               const diagonal = vertical + cycle - 2 * row;
               if (
                   row > 0 &&
                   row < numRows - 1 &&
                   diagonal < s.length
               ) {
                   result.push(s[diagonal]);
               }
           }
       }

       return result.join("");
   }

C#
~~

.. code-block:: csharp

   using System.Text;

   public class Solution {
       public string Convert(string s, int numRows) {
           if (numRows == 1 || numRows >= s.Length) {
               return s;
           }

           int cycle = 2 * numRows - 2;
           var result = new StringBuilder(s.Length);

           for (int row = 0; row < numRows; row++) {
               for (
                   int vertical = row;
                   vertical < s.Length;
                   vertical += cycle
               ) {
                   result.Append(s[vertical]);

                   int diagonal =
                       vertical + cycle - 2 * row;
                   if (
                       row > 0 &&
                       row < numRows - 1 &&
                       diagonal < s.Length
                   ) {
                       result.Append(s[diagonal]);
                   }
               }
           }

           return result.ToString();
       }
   }

Julia
~~~~~

.. code-block:: julia

   function zigzag_convert(s::String, num_rows::Int)::String
       chars = collect(s)
       length_s = length(chars)

       if num_rows == 1 || num_rows >= length_s
           return s
       end

       cycle = 2 * num_rows - 2
       result = Char[]
       sizehint!(result, length_s)

       # row 和 vertical 使用零基公式，访问 chars 时转换为一基下标。
       for row in 0:(num_rows - 1)
           vertical = row
           while vertical < length_s
               push!(result, chars[vertical + 1])

               diagonal = vertical + cycle - 2 * row
               if (
                   row > 0 &&
                   row < num_rows - 1 &&
                   diagonal < length_s
               )
                   push!(result, chars[diagonal + 1])
               end

               vertical += cycle
           end
       end

       return join(result)
   end

R
~

.. code-block:: r

   zigzag_convert <- function(s, num_rows) {
       chars <- strsplit(s, "", fixed = TRUE)[[1]]
       length_s <- length(chars)

       if (num_rows == 1L || num_rows >= length_s) {
           return(s)
       }

       cycle <- 2L * num_rows - 2L
       result <- character(length_s)
       write <- 1L

       for (row in 0:(num_rows - 1L)) {
           vertical <- row
           while (vertical < length_s) {
               result[[write]] <- chars[[vertical + 1L]]
               write <- write + 1L

               diagonal <- vertical + cycle - 2L * row
               if (
                   row > 0L &&
                   row < num_rows - 1L &&
                   diagonal < length_s
               ) {
                   result[[write]] <- chars[[diagonal + 1L]]
                   write <- write + 1L
               }

               vertical <- vertical + cycle
           }
       }

       paste(result, collapse = "")
   }
