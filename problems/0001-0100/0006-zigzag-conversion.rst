0006. Zigzag Conversion
=======================

题目信息
--------

:题号: 0006
:难度: Medium
:主题: 字符串、周期、索引映射
:原题: `LeetCode 0006 <https://leetcode.com/problems/zigzag-conversion/>`_
:访问状态: Available
:教学重点: 周期长度、竖列字符、斜线字符、首尾行边界

题目重述
--------

把字符串按指定行数沿竖直向下、斜向上、再次竖直向下的路径排列。最后按从上到下、
每行从左到右的顺序读取字符，返回得到的新字符串。

自建示例
--------

.. code-block:: text

   输入：s = "ABCDEFGHIJK", numRows = 4

   排列：
   A     G
   B   F H
   C E   I K
   D     J

   输出："AGBFHCEIKDJ"

问题抽象
--------

Z 字形路径会重复。若行数为 ``r``，从第一行下降到最后一行需要 ``r - 1`` 步，
再回到第一行又需要 ``r - 1`` 步，所以一个完整周期长度为：

.. math::

   cycle = 2r - 2

按输出行逐行读取时，每个周期至少提供一个竖列字符；中间行还可能提供一个斜线
字符。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 定位
   * - 周期索引直接读取
     - ``O(n)``
     - ``O(1)`` 辅助空间
     - 主解法
   * - 按路径模拟并维护每行缓冲区
     - ``O(n)``
     - ``O(n)``
     - 对照解法

主解法：周期索引
----------------

思路
~~~~

对每一行 ``row``，竖列字符的 0 基下标依次是：

.. math::

   row,\ row + cycle,\ row + 2 \cdot cycle,\ldots

对于第一行和最后一行，每个周期只有这个竖列字符。对于中间行，每个周期还包含一个
斜线字符，其下标为：

.. math::

   diagonal = index + cycle - 2 \cdot row

斜线下标仍在字符串范围内时，将它追加在当前竖列字符之后。

周期示意
~~~~~~~~

.. mermaid::

   flowchart TD
       R0["第 0 行：周期起点"]
       R1["中间行：竖列字符 + 斜线字符"]
       RL["最后一行：周期中点"]
       R0 --> R1 --> RL --> R1

中间行在下降路径和上升路径中各出现一次，因此每个周期通常读取两个字符。第一行
和最后一行位于转向点，只读取一次。

核心不变量
~~~~~~~~~~

处理某一行时：

* ``index`` 始终指向该行在下降竖列上的字符；
* ``diagonal`` 只在中间行计算；
* 同一周期内先追加竖列字符，再追加斜线字符，保持从左到右顺序；
* 每个原字符串位置恰好属于一行，并且只被追加一次。

正确性依据
~~~~~~~~~~

Z 字形路径每 ``cycle`` 个字符回到第一行，因此相同余数结构会重复。第 ``row`` 行
的下降字符固定出现在 ``row + k * cycle``。中间行在上升阶段再次经过，对应位置与
当前下降字符相距 ``cycle - 2 * row``。

算法逐行枚举这两类位置，顺序与图形中每行从左到右的读取顺序一致。首尾行跳过斜线
位置，避免重复转向点，因此每个字符恰好输出一次。

复杂度
~~~~~~

* 时间复杂度：``O(n)``；
* 除返回字符串外，辅助空间：``O(1)``；
* 构造返回字符串本身需要 ``O(n)`` 空间。

核心语言实现
~~~~~~~~~~~~

C
^

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
           for (int index = row; index < length; index += cycle) {
               result[write++] = s[index];

               const int diagonal = index + cycle - 2 * row;
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

C++
^^^

.. code-block:: cpp

   class Solution {
   public:
       std::string convert(std::string s, int numRows) {
           if (numRows == 1 || numRows >= s.size()) {
               return s;
           }

           const int cycle = 2 * numRows - 2;
           std::string result;
           result.reserve(s.size());

           for (int row = 0; row < numRows; ++row) {
               for (int index = row; index < s.size(); index += cycle) {
                   result.push_back(s[index]);

                   const int diagonal = index + cycle - 2 * row;
                   if (
                       row > 0 &&
                       row < numRows - 1 &&
                       diagonal < s.size()
                   ) {
                       result.push_back(s[diagonal]);
                   }
               }
           }

           return result;
       }
   };

Python
^^^^^^

.. code-block:: python

   class Solution:
       def convert(self, s: str, numRows: int) -> str:
           if numRows == 1 or numRows >= len(s):
               return s

           cycle = 2 * numRows - 2
           result: list[str] = []

           for row in range(numRows):
               for index in range(row, len(s), cycle):
                   result.append(s[index])

                   diagonal = index + cycle - 2 * row
                   if (
                       0 < row < numRows - 1
                       and diagonal < len(s)
                   ):
                       result.append(s[diagonal])

           return "".join(result)

Java
^^^^

.. code-block:: java

   class Solution {
       public String convert(String s, int numRows) {
           if (numRows == 1 || numRows >= s.length()) {
               return s;
           }

           int cycle = 2 * numRows - 2;
           StringBuilder result = new StringBuilder(s.length());

           for (int row = 0; row < numRows; row++) {
               for (int index = row; index < s.length(); index += cycle) {
                   result.append(s.charAt(index));

                   int diagonal = index + cycle - 2 * row;
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
^^^^

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
               let mut index = row;
               while index < bytes.len() {
                   result.push(bytes[index]);

                   let diagonal = index + cycle - 2 * row;
                   if row > 0 && row + 1 < rows && diagonal < bytes.len() {
                       result.push(bytes[diagonal]);
                   }

                   index += cycle;
               }
           }

           // 本题字符范围允许按 UTF-8 字节重新组成字符串。
           String::from_utf8(result).expect("输入和输出都保持有效 UTF-8")
       }
   }

Go
^^

.. code-block:: go

   func convert(s string, numRows int) string {
       if numRows == 1 || numRows >= len(s) {
           return s
       }

       cycle := 2*numRows - 2
       result := make([]byte, 0, len(s))

       for row := 0; row < numRows; row++ {
           for index := row; index < len(s); index += cycle {
               result = append(result, s[index])

               diagonal := index + cycle - 2*row
               if row > 0 && row < numRows-1 && diagonal < len(s) {
                   result = append(result, s[diagonal])
               }
           }
       }

       return string(result)
   }

TypeScript
^^^^^^^^^^

.. code-block:: typescript

   function convert(s: string, numRows: number): string {
       if (numRows === 1 || numRows >= s.length) {
           return s;
       }

       const cycle = 2 * numRows - 2;
       const result: string[] = [];

       for (let row = 0; row < numRows; row += 1) {
           for (let index = row; index < s.length; index += cycle) {
               result.push(s[index]);

               const diagonal = index + cycle - 2 * row;
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
^^

.. code-block:: csharp

   public class Solution {
       public string Convert(string s, int numRows) {
           if (numRows == 1 || numRows >= s.Length) {
               return s;
           }

           int cycle = 2 * numRows - 2;
           var result = new StringBuilder(s.Length);

           for (int row = 0; row < numRows; row++) {
               for (int index = row; index < s.Length; index += cycle) {
                   result.Append(s[index]);

                   int diagonal = index + cycle - 2 * row;
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
^^^^^

.. code-block:: julia

   function zigzag_convert(s::String, num_rows::Int)::String
       chars = collect(s)
       if num_rows == 1 || num_rows >= length(chars)
           return s
       end

       cycle = 2 * num_rows - 2
       result = Char[]
       sizehint!(result, length(chars))

       # row 和 index 使用 0 基算法坐标，访问 chars 时再加 1。
       for row in 0:(num_rows - 1)
           index = row
           while index < length(chars)
               push!(result, chars[index + 1])

               diagonal = index + cycle - 2 * row
               if (
                   row > 0 &&
                   row < num_rows - 1 &&
                   diagonal < length(chars)
               )
                   push!(result, chars[diagonal + 1])
               end

               index += cycle
           end
       end

       return String(result)
   end

R
^

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
           index <- row
           while (index < length_s) {
               result[[write]] <- chars[[index + 1L]]
               write <- write + 1L

               diagonal <- index + cycle - 2L * row
               if (
                   row > 0L &&
                   row < num_rows - 1L &&
                   diagonal < length_s
               ) {
                   result[[write]] <- chars[[diagonal + 1L]]
                   write <- write + 1L
               }

               index <- index + cycle
           }
       }

       paste(result, collapse = "")
   }

字符单位说明
~~~~~~~~~~~~

C、C++、Rust 和 Go 的实现按字节处理；Java、TypeScript 和 C# 按 UTF-16 代码单元
处理；Python、Julia 与 R 更接近按 Unicode 字符处理。周期算法只依赖离散字符位置，
先把输入切分成统一字符单位后仍然适用。

对照解法：逐行模拟
------------------

另一种写法为每一行创建缓冲区，并维护当前行 ``row`` 和移动方向 ``direction``。
到达第一行或最后一行时反转方向，把当前字符追加到对应行，最后连接所有行。

该写法直观地还原绘制过程，适合第一次理解题意。周期索引省去多个行缓冲区，并且
直接按最终输出顺序读取字符，因此作为本题主解法。

易错点
------

* ``numRows == 1`` 时周期为 0，必须提前返回；
* 行数不少于字符串长度时，排列结果与原字符串相同；
* 第一行和最后一行没有额外斜线字符；
* 中间行的斜线下标可能超出字符串末尾，需要检查范围；
* Julia 和 R 使用 0 基算法坐标计算，再转换为 1 基数组下标；
* C 返回的新字符串由调用者或平台负责释放。

本题新增知识
------------

* 路径模拟可以转化为周期索引映射；
* 中间行在一个周期中出现两次，首尾行只出现一次；
* 0 基行号让斜线公式 ``cycle - 2 * row`` 保持统一；
* 输出顺序可以直接决定遍历顺序，避免先构造完整二维图形。

本题强化知识
------------

* 字符串构造优先使用可追加缓冲区；
* Julia 和 R 再次练习算法坐标与语言下标之间的转换。

最小自检
--------

#. 为什么周期长度是 ``2 * numRows - 2``？
#. 为什么第一行和最后一行不能追加斜线字符？
#. 中间行的斜线位置为什么是 ``index + cycle - 2 * row``？

答案要点
~~~~~~~~

#. 路径从第一行走到最后一行再返回第一行，各需要 ``numRows - 1`` 步；
#. 它们是路径转向点，下降位置和上升位置重合，追加两次会重复字符；
#. 一个周期内，上升位置与该行下降位置关于周期中点对称。
