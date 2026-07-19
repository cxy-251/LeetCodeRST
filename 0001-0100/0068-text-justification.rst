0068. Text Justification
========================

题目信息
--------

:题号: 0068
:难度: Hard
:主题: 字符串、贪心、文本排版、空间分配
:原题: `LeetCode 0068 <https://leetcode.com/problems/text-justification/>`_
:访问状态: Available
:教学重点: 最大装行、空格商余分配、左侧优先、末行特例、固定宽输出

题目重述
--------

给定一个按原顺序排列的非空单词数组 ``words`` 和正整数 ``maxWidth``，把所有单词分成若干行。
每个单词必须完整保留且只能出现一次，行内单词顺序不能改变，每一行最终都必须恰好包含
``maxWidth`` 个字符。

普通行需要两端对齐：在相邻单词之间分配全部空格，并让左侧间隔在无法平均分配时比右侧间隔多
一个空格。最后一行只使用单个空格分隔单词，再在行尾补空格。只有一个单词的行也采用左对齐。

题目保证：

* ``1 <= words.length <= 300``；
* ``1 <= words[i].length <= 20``；
* ``1 <= maxWidth <= 100``；
* 每个单词长度不超过 ``maxWidth``；
* 单词由 ASCII 英文字母和符号组成，不包含空格。

主实现不修改输入单词。输出行顺序与输入顺序一致，每一行长度严格等于 ``maxWidth``。

自建示例
--------

普通两端对齐
~~~~~~~~~~~~

.. code-block:: text

   输入：words = ["clean", "layout", "needs", "balanced", "spaces"]
         maxWidth = 16
   输出：
   [
     "clean     layout",
     "needs   balanced",
     "spaces          "
   ]

第一行两个单词共占 ``11`` 个字符，所以中间放置 ``5`` 个空格。最后一行只左对齐。

无法平均分配
~~~~~~~~~~~~

.. code-block:: text

   输入：words = ["a", "bb", "ccc", "dddd"]
         maxWidth = 11
   输出：
   [
     "a   bb  ccc",
     "dddd       "
   ]

第一行需要分配 ``5`` 个空格到两个间隔，商为 ``2``、余数为 ``1``，因此左侧间隔放 ``3`` 个
空格，右侧间隔放 ``2`` 个。

单词独占一行
~~~~~~~~~~~~

.. code-block:: text

   输入：words = ["abcdefgh", "i", "j"]
         maxWidth = 8
   输出：
   [
     "abcdefgh",
     "i j     "
   ]

第一行虽然不是最后一行，但只有一个单词，无法创建单词间隔，因此按左对齐处理。

问题抽象
--------

每一行分成两个决策：

#. 从当前单词开始，尽量装入最多单词；
#. 根据该行是否为最后一行、是否只有一个单词，选择对应的空格分配规则。

设当前行包含半开区间 ``[start, end)`` 的单词，单词字符总数为 ``letters``，单词数量为
``count = end - start``。加入新单词时，至少还需要一个分隔空格。因此可以继续装入的条件是：

.. code-block:: text

   letters + next_word_length + 已有单词数量 <= maxWidth

因为已有单词数量正好等于加入新单词后需要的最少间隔数。

普通行的空格总数为：

.. code-block:: text

   total_spaces = maxWidth - letters
   gaps = count - 1
   base = total_spaces / gaps
   extra = total_spaces % gaps

前 ``extra`` 个间隔使用 ``base + 1`` 个空格，其余间隔使用 ``base`` 个空格。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 贪心最大装行并按商余分配空格
     - ``O(S + L × maxWidth)``
     - ``O(maxWidth)`` 临时行空间
     - 主解法；直接对应题目规则
   * - 预先枚举全部合法断行再动态规划
     - 至少 ``O(N²)``
     - 至少 ``O(N)``
     - 本题要求每行尽量装满，断行位置已经由贪心唯一决定

其中 ``N`` 是单词数，``S`` 是全部单词字符数，``L`` 是输出行数。输出本身包含
``L × maxWidth`` 个字符。

主解法：最大装行与商余空格分配
------------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

外层循环维护：

* ``start`` 是下一行尚未处理的第一个单词；
* ``end`` 是当前行候选区间的右边界；
* ``letters`` 是 ``words[start:end]`` 的单词字符总数；
* ``words[0:start]`` 已经完整且按原顺序写入先前输出行。

扩展 ``end`` 时，算法始终保留至少一个空格作为相邻单词分隔。扩展结束后：

* 当前区间使用最少单空格时不超过 ``maxWidth``；
* 若仍有下一个单词，把它连同必需的一个新间隔加入后会超过 ``maxWidth``。

这就是“当前行包含最多连续单词”的不变量。

为什么最大装行是安全的
~~~~~~~~~~~~~~~~~~~~~~

题目要求从左到右保持单词顺序，并在每一行尽量装入最多单词。若下一个单词连同最少的单个分隔空格
仍能放入，提前换行会违反最大装行要求；若加入后超过宽度，则任何合法排版都不能把该单词放到当前行，
因为普通对齐只会增加空格，不会减少到零。

因此贪心扫描得到的 ``end`` 正是当前行唯一合法的最大右边界。

普通行如何分配空格
~~~~~~~~~~~~~~~~~~

普通行至少有两个单词。``total_spaces`` 个空格必须全部进入 ``gaps`` 个间隔。整数除法给出：

.. code-block:: text

   total_spaces = base × gaps + extra
   0 <= extra < gaps

让前 ``extra`` 个间隔多一个空格后，所有间隔之和正好是 ``total_spaces``；任意两个间隔的大小之差
最多为一，并且较大的间隔全部位于左侧，满足题意。

最后一行与单词独占行
~~~~~~~~~~~~~~~~~~~~

最后一行不执行均匀分配，只在单词之间写一个空格，再把剩余位置填在行尾。单词独占行没有间隔，
除单词之外的全部位置也只能填在行尾。两种情况可以共用同一个左对齐分支。

正确性依据
~~~~~~~~~~

**断行完整且合法。** 每轮从 ``start`` 开始选择最大可容纳的连续前缀。该区间按最少单空格已经不超过
宽度，而下一个单词无法加入，所以断行位置合法且符合最大装行要求。随后令 ``start = end``，每个单词
恰好进入一行，顺序不变且无遗漏。

**普通行宽度正确。** 普通行写入全部 ``letters`` 个单词字符和恰好 ``total_spaces`` 个空格，总长度为
``letters + maxWidth - letters = maxWidth``。商余分配保证左侧间隔优先多一个空格。

**左对齐行正确。** 最后一行或单词独占行先使用单空格连接单词，再补齐剩余尾部空格，所以单词顺序、
分隔规则和固定宽度同时满足。

**终止性。** 每轮至少包含当前 ``start`` 单词，因此 ``end > start``，更新后 ``start`` 严格增加。
单词数量有限，循环必然结束。

复杂度
~~~~~~

设单词数为 ``N``、全部单词字符数为 ``S``、输出行数为 ``L``：

* 每个单词在装行阶段被检查常数次，构造阶段复制一次；
* 每行最终写出恰好 ``maxWidth`` 个字符；
* 时间复杂度为 ``O(S + L × maxWidth)``，也就是线性于输入字符与输出载荷；
* 除返回结果外，每次只构造一行，算法临时空间为 ``O(maxWidth)``；
* 返回结果本身占 ``O(L × maxWidth)`` 字符空间；
* C 的结果指针数组最多保存 ``N`` 行，属于返回结构的元数据。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>
   #include <string.h>

   static void free_lines(char **lines, int count) {
       for (int index = 0; index < count; ++index) {
           free(lines[index]);
       }
       free(lines);
   }

   static char *build_line(
       char **words,
       int start,
       int end,
       int letters,
       int max_width,
       bool is_last
   ) {
       char *line = malloc((size_t)max_width + 1);
       if (line == NULL) {
           return NULL;
       }

       const int count = end - start;
       int write = 0;

       if (is_last || count == 1) {
           for (int index = start; index < end; ++index) {
               if (index > start) {
                   line[write++] = ' ';
               }
               const size_t length = strlen(words[index]);
               memcpy(line + write, words[index], length);
               write += (int)length;
           }
           while (write < max_width) {
               line[write++] = ' ';
           }
       } else {
           const int gaps = count - 1;
           const int total_spaces = max_width - letters;
           const int base = total_spaces / gaps;
           const int extra = total_spaces % gaps;

           for (int index = start; index < end; ++index) {
               const size_t length = strlen(words[index]);
               memcpy(line + write, words[index], length);
               write += (int)length;

               if (index + 1 < end) {
                   int spaces = base;
                   if (index - start < extra) {
                       ++spaces;
                   }
                   while (spaces-- > 0) {
                       line[write++] = ' ';
                   }
               }
           }
       }

       line[max_width] = '\0';
       return line;
   }

   char **fullJustify(
       char **words,
       int wordsSize,
       int maxWidth,
       int *returnSize
   ) {
       *returnSize = 0;
       char **result = malloc((size_t)wordsSize * sizeof(*result));
       if (result == NULL) {
           return NULL;
       }

       int start = 0;
       while (start < wordsSize) {
           int end = start + 1;
           int letters = (int)strlen(words[start]);

           while (end < wordsSize) {
               const int next_length = (int)strlen(words[end]);
               const int minimum = letters + next_length + (end - start);
               if (minimum > maxWidth) {
                   break;
               }
               letters += next_length;
               ++end;
           }

           char *line = build_line(
               words,
               start,
               end,
               letters,
               maxWidth,
               end == wordsSize
           );
           if (line == NULL) {
               free_lines(result, *returnSize);
               *returnSize = 0;
               return NULL;
           }

           result[(*returnSize)++] = line;
           start = end;
       }
       return result;
   }

结果外层数组最多包含 ``wordsSize`` 个指针，每行分配 ``maxWidth + 1`` 字节并包含终止符。任一行分配
失败时，已经完成的行与外层数组整体释放；调用者成功获得结果后负责逐行释放。

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <utility>
   #include <vector>

   class Solution {
   public:
       std::vector<std::string> fullJustify(
           const std::vector<std::string>& words,
           int maxWidth
       ) {
           const std::size_t width = static_cast<std::size_t>(maxWidth);
           std::vector<std::string> result;
           std::size_t start = 0;

           while (start < words.size()) {
               std::size_t end = start + 1;
               std::size_t letters = words[start].size();

               while (end < words.size()) {
                   const std::size_t minimum =
                       letters + words[end].size() + (end - start);
                   if (minimum > width) {
                       break;
                   }
                   letters += words[end].size();
                   ++end;
               }

               const std::size_t count = end - start;
               std::string line;
               line.reserve(width);

               if (end == words.size() || count == 1) {
                   for (std::size_t index = start; index < end; ++index) {
                       if (index > start) {
                           line.push_back(' ');
                       }
                       line += words[index];
                   }
                   line.append(width - line.size(), ' ');
               } else {
                   const std::size_t gaps = count - 1;
                   const std::size_t totalSpaces = width - letters;
                   const std::size_t base = totalSpaces / gaps;
                   const std::size_t extra = totalSpaces % gaps;

                   for (std::size_t index = start; index < end; ++index) {
                       line += words[index];
                       if (index + 1 < end) {
                           const std::size_t gap =
                               base + ((index - start) < extra ? 1 : 0);
                           line.append(gap, ' ');
                       }
                   }
               }

               result.push_back(std::move(line));
               start = end;
           }
           return result;
       }
   };

``std::string::append(count, ' ')`` 直接追加指定数量的空格。约束保证 ``maxWidth`` 为正，转为
``std::size_t`` 安全；输入以常量引用借用，不被修改。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def fullJustify(self, words: list[str], maxWidth: int) -> list[str]:
           result: list[str] = []
           start = 0

           while start < len(words):
               end = start + 1
               letters = len(words[start])

               while end < len(words):
                   minimum = letters + len(words[end]) + (end - start)
                   if minimum > maxWidth:
                       break
                   letters += len(words[end])
                   end += 1

               count = end - start
               if end == len(words) or count == 1:
                   line = " ".join(words[start:end])
                   line += " " * (maxWidth - len(line))
               else:
                   gaps = count - 1
                   total_spaces = maxWidth - letters
                   base, extra = divmod(total_spaces, gaps)
                   parts: list[str] = []

                   for offset, word in enumerate(words[start:end - 1]):
                       gap = base + (1 if offset < extra else 0)
                       parts.append(word)
                       parts.append(" " * gap)
                   parts.append(words[end - 1])
                   line = "".join(parts)

               result.append(line)
               start = end

           return result

切片只用于当前行，所有切片元素仍引用原字符串；``join`` 创建最终行。每行最多 ``maxWidth`` 个字符，
峰值临时空间为一行规模。

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       public List<String> fullJustify(String[] words, int maxWidth) {
           List<String> result = new ArrayList<>();
           int start = 0;

           while (start < words.length) {
               int end = start + 1;
               int letters = words[start].length();

               while (end < words.length) {
                   int minimum = letters + words[end].length() + end - start;
                   if (minimum > maxWidth) {
                       break;
                   }
                   letters += words[end].length();
                   ++end;
               }

               int count = end - start;
               StringBuilder line = new StringBuilder(maxWidth);

               if (end == words.length || count == 1) {
                   for (int index = start; index < end; ++index) {
                       if (index > start) {
                           line.append(' ');
                       }
                       line.append(words[index]);
                   }
                   while (line.length() < maxWidth) {
                       line.append(' ');
                   }
               } else {
                   int gaps = count - 1;
                   int totalSpaces = maxWidth - letters;
                   int base = totalSpaces / gaps;
                   int extra = totalSpaces % gaps;

                   for (int index = start; index < end; ++index) {
                       line.append(words[index]);
                       if (index + 1 < end) {
                           int spaces = base + (index - start < extra ? 1 : 0);
                           line.append(" ".repeat(spaces));
                       }
                   }
               }

               result.add(line.toString());
               start = end;
           }
           return result;
       }
   }

``String.repeat`` 需要 Java 11。``StringBuilder`` 以固定宽度作为初始容量，最后 ``toString`` 创建独立
不可变结果字符串。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn full_justify(words: Vec<String>, max_width: i32) -> Vec<String> {
           let width = max_width as usize;
           let mut result = Vec::new();
           let mut start = 0usize;

           while start < words.len() {
               let mut end = start + 1;
               let mut letters = words[start].len();

               while end < words.len() {
                   let minimum = letters + words[end].len() + (end - start);
                   if minimum > width {
                       break;
                   }
                   letters += words[end].len();
                   end += 1;
               }

               let count = end - start;
               let mut line = String::with_capacity(width);

               if end == words.len() || count == 1 {
                   for index in start..end {
                       if index > start {
                           line.push(' ');
                       }
                       line.push_str(&words[index]);
                   }
                   line.extend(std::iter::repeat(' ').take(width - line.len()));
               } else {
                   let gaps = count - 1;
                   let total_spaces = width - letters;
                   let base = total_spaces / gaps;
                   let extra = total_spaces % gaps;

                   for index in start..end {
                       line.push_str(&words[index]);
                       if index + 1 < end {
                           let gap = base + if index - start < extra { 1 } else { 0 };
                           line.extend(std::iter::repeat(' ').take(gap));
                       }
                   }
               }

               result.push(line);
               start = end;
           }
           result
       }
   }

``repeat(...).take(count)`` 使用稳定迭代器接口追加空格。输入字符串为 ASCII，因此
``String::len`` 的字节数等于题目字符数；函数消费 ``words`` 的所有权。

Go
~~

.. code-block:: go

   package main

   import "strings"

   func fullJustify(words []string, maxWidth int) []string {
       result := make([]string, 0)
       start := 0

       for start < len(words) {
           end := start + 1
           letters := len(words[start])

           for end < len(words) {
               minimum := letters + len(words[end]) + end - start
               if minimum > maxWidth {
                   break
               }
               letters += len(words[end])
               end++
           }

           count := end - start
           var line strings.Builder
           line.Grow(maxWidth)

           if end == len(words) || count == 1 {
               for index := start; index < end; index++ {
                   if index > start {
                       line.WriteByte(' ')
                   }
                   line.WriteString(words[index])
               }
               line.WriteString(strings.Repeat(" ", maxWidth-line.Len()))
           } else {
               gaps := count - 1
               totalSpaces := maxWidth - letters
               base := totalSpaces / gaps
               extra := totalSpaces % gaps

               for index := start; index < end; index++ {
                   line.WriteString(words[index])
                   if index+1 < end {
                       gap := base
                       if index-start < extra {
                           gap++
                       }
                       line.WriteString(strings.Repeat(" ", gap))
                   }
               }
           }

           result = append(result, line.String())
           start = end
       }
       return result
   }

``strings.Builder`` 按字节构造字符串；ASCII 契约保证字节长度等于题目字符宽度。调用 ``String`` 后不再
修改该 builder，满足其生命周期要求。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function fullJustify(words: string[], maxWidth: number): string[] {
       const result: string[] = [];
       let start = 0;

       while (start < words.length) {
           let end = start + 1;
           let letters = words[start].length;

           while (end < words.length) {
               const minimum = letters + words[end].length + end - start;
               if (minimum > maxWidth) {
                   break;
               }
               letters += words[end].length;
               end += 1;
           }

           const count = end - start;
           let line: string;

           if (end === words.length || count === 1) {
               line = words.slice(start, end).join(" ");
               line += " ".repeat(maxWidth - line.length);
           } else {
               const gaps = count - 1;
               const totalSpaces = maxWidth - letters;
               const base = Math.floor(totalSpaces / gaps);
               const extra = totalSpaces % gaps;
               const parts: string[] = [];

               for (let index = start; index < end; index += 1) {
                   parts.push(words[index]);
                   if (index + 1 < end) {
                       const gap = base + (index - start < extra ? 1 : 0);
                       parts.push(" ".repeat(gap));
                   }
               }
               line = parts.join("");
           }

           result.push(line);
           start = end;
       }
       return result;
   }

ASCII 契约使 JavaScript 的 UTF-16 ``length`` 与题目字符宽度一致。实现不使用位运算，所有长度都远低于
``Number.MAX_SAFE_INTEGER``。

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;
   using System.Text;

   public class Solution {
       public IList<string> FullJustify(string[] words, int maxWidth) {
           var result = new List<string>();
           int start = 0;

           while (start < words.Length) {
               int end = start + 1;
               int letters = words[start].Length;

               while (end < words.Length) {
                   int minimum = letters + words[end].Length + end - start;
                   if (minimum > maxWidth) {
                       break;
                   }
                   letters += words[end].Length;
                   ++end;
               }

               int count = end - start;
               var line = new StringBuilder(maxWidth);

               if (end == words.Length || count == 1) {
                   for (int index = start; index < end; ++index) {
                       if (index > start) {
                           line.Append(' ');
                       }
                       line.Append(words[index]);
                   }
                   line.Append(' ', maxWidth - line.Length);
               } else {
                   int gaps = count - 1;
                   int totalSpaces = maxWidth - letters;
                   int baseSpaces = totalSpaces / gaps;
                   int extra = totalSpaces % gaps;

                   for (int index = start; index < end; ++index) {
                       line.Append(words[index]);
                       if (index + 1 < end) {
                           int gap = baseSpaces + (index - start < extra ? 1 : 0);
                           line.Append(' ', gap);
                       }
                   }
               }

               result.Add(line.ToString());
               start = end;
           }
           return result;
       }
   }

``StringBuilder.Append(char, count)`` 直接写入重复空格，避免先创建临时空格字符串。输入字符串数组只读，
返回列表中的字符串互相独立。

Julia
~~~~~

.. code-block:: julia

   function fullJustify(words::Vector{String}, maxWidth::Int)::Vector{String}
       result = String[]
       start = 1

       while start <= length(words)
           next_index = start + 1
           letters = ncodeunits(words[start])

           while next_index <= length(words)
               minimum = letters + ncodeunits(words[next_index]) +
                   (next_index - start)
               if minimum > maxWidth
                   break
               end
               letters += ncodeunits(words[next_index])
               next_index += 1
           end

           count = next_index - start
           buffer = IOBuffer()

           if next_index > length(words) || count == 1
               for index in start:(next_index - 1)
                   if index > start
                       write(buffer, ' ')
                   end
                   write(buffer, words[index])
               end
               written = position(buffer)
               write(buffer, repeat(" ", maxWidth - written))
           else
               gaps = count - 1
               total_spaces = maxWidth - letters
               base = total_spaces ÷ gaps
               extra = total_spaces % gaps

               for index in start:(next_index - 1)
                   write(buffer, words[index])
                   if index + 1 < next_index
                       gap = base + ((index - start) < extra ? 1 : 0)
                       write(buffer, repeat(" ", gap))
                   end
               end
           end

           push!(result, String(take!(buffer)))
           start = next_index
       end
       return result
   end

``ncodeunits`` 与 ``IOBuffer`` 都按 UTF-8 字节计数；ASCII 契约使字节宽度等于题目字符宽度。一基区间
``start:(next_index-1)`` 在这里始终非空，因为每行至少包含一个单词。

R
~

.. code-block:: r

   fullJustify <- function(words, maxWidth) {
     result <- character(length(words))
     line_count <- 0L
     start <- 1L

     while (start <= length(words)) {
       next_index <- start + 1L
       letters <- nchar(words[start], type = "bytes")

       while (next_index <= length(words)) {
         minimum <- letters + nchar(words[next_index], type = "bytes") +
           next_index - start
         if (minimum > maxWidth) {
           break
         }
         letters <- letters + nchar(words[next_index], type = "bytes")
         next_index <- next_index + 1L
       }

       count <- next_index - start
       is_last <- next_index > length(words)

       if (is_last || count == 1L) {
         line <- paste(words[start:(next_index - 1L)], collapse = " ")
         line <- paste0(line, strrep(" ", maxWidth - nchar(line, type = "bytes")))
       } else {
         gaps <- count - 1L
         total_spaces <- maxWidth - letters
         base <- total_spaces %/% gaps
         extra <- total_spaces %% gaps
         parts <- character(2L * count - 1L)
         write <- 1L

         for (index in start:(next_index - 1L)) {
           parts[write] <- words[index]
           write <- write + 1L
           if (index + 1L < next_index) {
             gap <- base + as.integer(index - start < extra)
             parts[write] <- strrep(" ", gap)
             write <- write + 1L
           }
         }
         line <- paste0(parts, collapse = "")
       }

       line_count <- line_count + 1L
       result[line_count] <- line
       start <- next_index
     }

     result[seq_len(line_count)]
   }

R 预分配最多 ``length(words)`` 条结果，并为普通行预分配片段向量，避免循环中反复扩展字符向量。
``nchar(type="bytes")`` 由 ASCII 契约支撑。

对照解法：枚举断行位置
----------------------

可以把每个单词边界视为候选换行点，再用动态规划选择排版代价最小的方案。这适用于普通段落排版中的
“最小参差度”等目标。本题已经明确要求每行尽量装入最多单词，断行位置由可容纳条件唯一确定，动态规划
不会改善答案，只增加状态和成本。

验证计划与证据
--------------

* 固定用例覆盖普通两端对齐、无法平均分配、最后一行、单词独占行和宽度恰好填满；
* Python 与独立参考格式化器对拍随机 ASCII 单词和随机合法宽度；
* C、C++、Java、Go 和 TypeScript 编译并运行固定用例；
* C 使用严格警告、AddressSanitizer 和 UndefinedBehaviorSanitizer；
* Rust、C#、Julia、R 在缺少运行时时进行索引、长度、空格数量与返回所有权静态检查。

关键边界
--------

* 每个单词长度不超过 ``maxWidth``，所以每轮至少能装入一个单词；
* 最后一行无论包含多少单词都只使用单空格；
* 非末行只有一个单词时不能除以零，必须走左对齐分支；
* 普通行的全部剩余宽度都必须进入单词间隔，不能留尾部空格；
* 所有实现都依赖 ASCII 宽度，不把 Unicode 字形显示宽度误当成字符串长度。

易错点
------

* 装行条件漏掉新增单词前的必需间隔，会让一行超过宽度；
* 把余数空格放到右侧间隔，违反左侧优先规则；
* 最后一行仍执行均匀分配，会产生错误输出；
* 单词独占行计算 ``count - 1`` 后做除法，会出现除零；
* 只检查字符总数而不检查每行最终固定宽度，容易遗漏尾部补空格；
* C 分配某一行失败后若不释放先前行，会泄漏部分结果。

本题新增知识
------------

* 最大装行的贪心边界；
* 使用整数商与余数完成近似均匀分配；
* 左侧间隔优先吸收余数；
* 同一算法中的普通行、末行和单词独占行三类构造规则。

本题强化知识
------------

* 输出载荷必须计入复杂度；
* 固定宽缓冲区的容量和终止符；
* ASCII 字节长度与多语言字符串长度边界；
* C 多行结果的事务式失败清理。

关联题目
--------

* `0058. Length of Last Word <0058-length-of-last-word.rst>`_：两题都依赖精确的 ASCII 空格语义；本题
  还需要主动构造固定数量的空格。
* `0067. Add Binary <0067-add-binary.rst>`_：两题都先推导结果长度上界，再选择反向或预分配的字符串
  构造策略；本题的输出长度按行固定。

最小自检
--------

#. 装入下一个单词时为什么要额外计算 ``end - start``？
#. 普通行的 ``base`` 和 ``extra`` 分别表示什么？
#. 为什么前 ``extra`` 个间隔需要多一个空格？
#. 最后一行和单词独占行为什么共用左对齐分支？
#. 本题复杂度为什么必须包含 ``L × maxWidth``？

答案要点
~~~~~~~~

#. 加入新单词后需要的最少间隔数等于当前已有单词数量。
#. ``base`` 是每个间隔的基础空格数，``extra`` 是无法平均分配的余数。
#. 题目要求较大的间隔位于左侧。
#. 两者都不执行多间隔均匀分配，只需单空格连接并在行尾补齐。
#. 算法必须实际生成这些输出字符，输出载荷无法省略。
