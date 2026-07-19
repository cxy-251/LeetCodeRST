0038. Count and Say
===================

题目信息
--------

:题号: 0038
:难度: Medium
:主题: 字符串、游程编码、迭代生成、输出敏感复杂度
:原题: `LeetCode 0038 <https://leetcode.com/problems/count-and-say/>`_
:访问状态: Available
:教学重点: 连续相同字符分组、读指针扫描、计数与字符拼接、归纳式正确性

题目重述
--------

定义一个字符串序列：

* 第 1 项是 ``"1"``；
* 后续每一项都通过“描述前一项中连续相同数字的分组”得到。

例如 ``"1211"`` 可以分成 ``"1"``、``"2"``、``"11"``，因此描述为“一個 1、一个 2、
两个 1”，得到 ``"111221"``。

给定正整数 ``n``，返回这个序列的第 ``n`` 项。

自建示例
--------

前六项
~~~~~~

.. code-block:: text

   n = 1  -> "1"
   n = 2  -> "11"      # 一个 1
   n = 3  -> "21"      # 两个 1
   n = 4  -> "1211"    # 一个 2、一个 1
   n = 5  -> "111221"  # 一个 1、一个 2、两个 1
   n = 6  -> "312211"  # 三个 1、两个 2、一个 1

连续分组不能合并
~~~~~~~~~~~~~~~~

.. code-block:: text

   输入项："111211"
   分组："111"、"2"、"11"
   描述："31" + "12" + "21" = "311221"

首项
~~~~

.. code-block:: text

   n = 1
   返回 "1"

问题抽象
--------

单次变换是字符串的游程编码：把每个最大连续相同字符段 ``character × count`` 编码为
``decimal(count) + character``。

扫描字符串 ``current`` 时维护分组起点 ``start``：

#. 从 ``start`` 向右找到第一个不同字符，得到半开分组 ``[start, end)``；
#. 分组长度为 ``end - start``；
#. 向结果追加十进制计数和 ``current[start]``；
#. 令 ``start = end``，继续处理下一组。

完成一次变换后，重复执行，直到得到第 ``n`` 项。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 逐项迭代游程编码
     - ``O(L_1 + ... + L_n)``
     - ``O(L_n)``
     - 主解法；直接对应序列定义
   * - 递归生成前一项再编码
     - 相同数量级
     - 额外 ``O(n)`` 调用栈
     - 结构接近定义，但没有必要保留递归层
   * - 预存所有可能答案
     - 查询 ``O(1)``
     - 依赖硬编码
     - 隐藏算法，不适合作为教学主解法

其中 ``L_k`` 表示第 ``k`` 项的字符串长度。

主解法：迭代执行游程编码
------------------------

状态含义
~~~~~~~~

外层迭代维护：

* ``current``：已经正确生成的当前序列项；
* ``step``：还需要执行多少次描述变换。

单次变换维护：

* ``start``：当前尚未编码分组的第一个下标；
* ``end``：向右越过所有相同字符后的下标；
* ``next``：已编码完成的分组结果。

核心不变量
~~~~~~~~~~

单次扫描每轮开始时：

* ``current[0:start]`` 已按最大连续分组完整编码到 ``next``；
* ``start`` 是下一个未编码字符；
* ``current[start:end]`` 在扩展过程中全部等于 ``current[start]``；
* 已写入 ``next`` 的分组顺序与原字符串一致。

当 ``end`` 到达字符串末尾时，所有字符恰好属于一个已编码分组。

为什么必须按连续段计数
~~~~~~~~~~~~~~~~~~~~~~

描述的是相邻连续数字，而不是整个字符串中的总频次。例如 ``"121"`` 包含两个字符 ``'1'``，
它们被 ``'2'`` 隔开，因此必须描述为 ``"11" + "12" + "11"``，不能写成 ``"21"``。

正确性依据
~~~~~~~~~~

先证明一次变换正确。内层扫描把输入划分为若干互不重叠、按顺序排列的最大连续相同字符段。
对每段，算法追加准确的段长度和该段字符，因此输出正是题目对输入项的描述。

再对序列项编号做归纳。初始 ``current = "1"`` 正确表示第 1 项。假设某轮开始时
``current`` 是第 ``k`` 项，单次变换正确地产生对它的描述，因此得到第 ``k + 1`` 项。执行
``n - 1`` 次后，``current`` 必为第 ``n`` 项。

复杂度
~~~~~~

设第 ``k`` 项长度为 ``L_k``：

* 第 ``k`` 次变换线性扫描第 ``k`` 项并生成第 ``k + 1`` 项；
* 总时间复杂度为 ``O(L_1 + L_2 + ... + L_n)``；
* 每轮只保留当前项与下一项，额外空间复杂度为 ``O(L_n)``；
* 输出本身长度为 ``L_n``，因此至少需要 ``O(L_n)`` 写入工作。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdio.h>
   #include <stdlib.h>
   #include <string.h>

   static void append_text(
       char **buffer,
       size_t *length,
       size_t *capacity,
       const char *text
   ) {
       size_t text_length = strlen(text);
       while (*length + text_length + 1 > *capacity) {
           *capacity *= 2;
           *buffer = realloc(*buffer, *capacity);
       }

       memcpy(*buffer + *length, text, text_length);
       *length += text_length;
       (*buffer)[*length] = '\0';
   }

   char *countAndSay(int n) {
       char *current = malloc(2);
       current[0] = '1';
       current[1] = '\0';

       for (int step = 1; step < n; ++step) {
           size_t capacity = strlen(current) * 2 + 16;
           size_t length = 0;
           char *next = malloc(capacity);
           next[0] = '\0';

           for (size_t start = 0; current[start] != '\0';) {
               size_t end = start + 1;
               while (current[end] == current[start]) {
                   ++end;
               }

               char count_text[32];
               snprintf(
                   count_text,
                   sizeof(count_text),
                   "%zu",
                   end - start
               );
               append_text(&next, &length, &capacity, count_text);

               char character_text[2] = {current[start], '\0'};
               append_text(
                   &next,
                   &length,
                   &capacity,
                   character_text
               );
               start = end;
           }

           free(current);
           current = next;
       }

       return current;
   }

返回字符串由调用者负责释放。动态扩容避免依赖题目当前的 ``n`` 上限。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       std::string countAndSay(int n) {
           std::string current = "1";

           for (int step = 1; step < n; ++step) {
               std::string next;

               for (std::size_t start = 0;
                    start < current.size();) {
                   std::size_t end = start + 1;
                   while (end < current.size() &&
                          current[end] == current[start]) {
                       ++end;
                   }

                   next += std::to_string(end - start);
                   next.push_back(current[start]);
                   start = end;
               }

               current = std::move(next);
           }

           return current;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def countAndSay(self, n: int) -> str:
           current = "1"

           for _ in range(n - 1):
               parts: list[str] = []
               start = 0

               while start < len(current):
                   end = start + 1
                   while end < len(current) and current[end] == current[start]:
                       end += 1

                   parts.append(str(end - start))
                   parts.append(current[start])
                   start = end

               current = "".join(parts)

           return current

Java
~~~~

.. code-block:: java

   class Solution {
       public String countAndSay(int n) {
           String current = "1";

           for (int step = 1; step < n; ++step) {
               StringBuilder next = new StringBuilder();

               for (int start = 0; start < current.length();) {
                   int end = start + 1;
                   while (end < current.length() &&
                          current.charAt(end) == current.charAt(start)) {
                       ++end;
                   }

                   next.append(end - start);
                   next.append(current.charAt(start));
                   start = end;
               }

               current = next.toString();
           }

           return current;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn count_and_say(n: i32) -> String {
           let mut current = String::from("1");

           for _ in 1..n {
               let bytes = current.as_bytes();
               let mut next = String::new();
               let mut start = 0_usize;

               while start < bytes.len() {
                   let mut end = start + 1;
                   while end < bytes.len() && bytes[end] == bytes[start] {
                       end += 1;
                   }

                   next.push_str(&(end - start).to_string());
                   next.push(bytes[start] as char);
                   start = end;
               }

               current = next;
           }

           current
       }
   }

序列只包含 ASCII 数字，按字节扫描与按字符扫描等价。

Go
~~

.. code-block:: go

   import (
       "strconv"
       "strings"
   )

   func countAndSay(n int) string {
       current := "1"

       for step := 1; step < n; step++ {
           var next strings.Builder

           for start := 0; start < len(current); {
               end := start + 1
               for end < len(current) && current[end] == current[start] {
                   end++
               }

               next.WriteString(strconv.Itoa(end - start))
               next.WriteByte(current[start])
               start = end
           }

           current = next.String()
       }

       return current
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function countAndSay(n: number): string {
       let current = "1";

       for (let step = 1; step < n; step++) {
           const parts: string[] = [];

           for (let start = 0; start < current.length;) {
               let end = start + 1;
               while (end < current.length &&
                      current[end] === current[start]) {
                   end++;
               }

               parts.push(String(end - start));
               parts.push(current[start]);
               start = end;
           }

           current = parts.join("");
       }

       return current;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public string CountAndSay(int n) {
           string current = "1";

           for (int step = 1; step < n; ++step) {
               var next = new System.Text.StringBuilder();

               for (int start = 0; start < current.Length;) {
                   int end = start + 1;
                   while (end < current.Length &&
                          current[end] == current[start]) {
                       ++end;
                   }

                   next.Append(end - start);
                   next.Append(current[start]);
                   start = end;
               }

               current = next.ToString();
           }

           return current;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function count_and_say(n::Int)::String
       current = "1"

       for _ in 2:n
           bytes = codeunits(current)
           output = IOBuffer()
           start = 1

           while start <= length(bytes)
               stop = start + 1
               while stop <= length(bytes) && bytes[stop] == bytes[start]
                   stop += 1
               end

               print(output, stop - start)
               write(output, bytes[start])
               start = stop
           end

           current = String(take!(output))
       end

       return current
   end

Julia 使用一基字节位置；序列只含 ASCII 数字，因此 ``codeunits`` 可安全表示字符分组。

R
~

.. code-block:: r

   count_and_say <- function(n) {
     current <- "1"

     if (n >= 2L) {
       for (step in 2:n) {
         characters <- strsplit(current, "", fixed = TRUE)[[1L]]
         parts <- character(0)
         start <- 1L

         while (start <= length(characters)) {
           stop <- start + 1L
           while (stop <= length(characters) &&
                  characters[[stop]] == characters[[start]]) {
             stop <- stop + 1L
           }

           parts <- c(
             parts,
             as.character(stop - start),
             characters[[start]]
           )
           start <- stop
         }

         current <- paste0(parts, collapse = "")
       }
     }

     current
   }

关键边界
--------

* ``n = 1``：不执行变换，直接返回 ``"1"``；
* 整项只有一个分组：例如 ``"111"`` 变为 ``"31"``；
* 相同字符被其他字符隔开：必须形成不同分组；
* 分组到达字符串末尾：内层循环需要先检查边界再访问字符；
* 计数可能超过一位：必须追加完整十进制字符串，不能只追加一个数字字符。

易错点
------

* 统计全局字符频次，而不是连续分组长度；
* 只比较相邻两个字符，却忘记在分组结束时写出最后一组；
* 把 ``n`` 次变换写成 ``n - 1`` 次之外的数量，产生一位偏移；
* 直接在正在扫描的字符串上追加，导致输入与输出互相污染；
* 使用反复字符串拼接，在不可变字符串语言中产生大量中间副本；
* 把多位计数当成单个字符处理。

新增与强化知识
--------------

新增
~~~~

* 游程编码按最大连续相同段压缩或描述数据；
* 半开分组 ``[start, end)`` 让长度统一为 ``end - start``；
* 递归定义的序列可用迭代保存上一项，避免调用栈；
* 复杂度应按各轮真实字符串长度求和，而不是只写 ``O(n)``。

强化
~~~~

* 0014、0028 的顺序字符扫描在本题扩展为连续段扫描；
* 0006、0012 的增量字符串构造继续避免不可变字符串反复复制；
* 正确性证明可拆成“单次变换正确”和“对序列编号归纳”两层；
* C 需要明确动态字符串的容量、长度与所有权。

最小自检
--------

#. ``"1122331"`` 会被分成哪些连续段？
#. 为什么第 ``n`` 项只需要执行 ``n - 1`` 次变换？
#. 为什么不能先统计每种数字在整项中出现多少次？
#. 单次扫描为什么不会遗漏最后一个分组？
#. 总时间复杂度为什么不是简单的 ``O(n)``？

答案要点
~~~~~~~~

#. ``"11"``、``"22"``、``"33"``、``"1"``。
#. 初始字符串已经是第 1 项，每次变换只前进一项。
#. 题目描述连续分组，相同数字可能被其他数字隔开。
#. 每轮从一个有效 ``start`` 扩展到边界或不同字符，再立即写出该组。
#. 每项长度不同，工作量取决于所有已生成字符串的总长度。
