0038. Count and Say
===================

题目信息
--------

:题号: 0038
:难度: Medium
:主题: 字符串、游程编码、迭代生成、输出敏感复杂度
:原题: `LeetCode 0038 <https://leetcode.com/problems/count-and-say/>`_
:教学重点: 最大连续段、双指针扫描、计数文本拼接、逐项归纳

题目重述
--------

序列第 1 项为 ``"1"``。第 ``k+1`` 项通过从左到右描述第 ``k`` 项中每个最大连续相同数字段得到。给定正整数 ``n``，返回第 ``n`` 项。

自建示例
--------

.. code-block:: text

   "111211" 分组为 "111"、"2"、"11"
   描述为 "31" + "12" + "21" = "311221"

两个由其他数字隔开的 ``1`` 段不能合并统计；规则描述的是连续段，不是全局频次。

C++ 实现
--------

.. code-block:: cpp

   #include <string>

   class Solution {
   private:
       std::string describe(const std::string& current) {
           std::string next;
           for (int start = 0; start < static_cast<int>(current.size());) {
               int end = start + 1;
               while (end < static_cast<int>(current.size()) && current[end] == current[start]) ++end;
               next += std::to_string(end - start);
               next.push_back(current[start]);
               start = end;
           }
           return next;
       }

       std::string recursiveGenerate(int n) {
           if (n == 1) return "1";
           return describe(recursiveGenerate(n - 1));
       }

       std::string manualBuffer(int n) {
           std::string current = "1";
           for (int step = 1; step < n; ++step) {
               std::string next;
               int start = 0;
               while (start < static_cast<int>(current.size())) {
                   int end = start;
                   while (end < static_cast<int>(current.size()) && current[end] == current[start]) ++end;
                   next.append(std::to_string(end - start));
                   next.push_back(current[start]);
                   start = end;
               }
               current.swap(next);
           }
           return current;
       }

       std::string iterativeDescribe(int n) {
           std::string current = "1";
           for (int step = 1; step < n; ++step) current = describe(current);
           return current;
       }

   public:
       std::string countAndSay(int n) {
           return iterativeDescribe(n);
       }
   };

题解
----

单次变换为什么是游程编码
~~~~~~~~~~~~~~~~~~~~~~~~

输入字符串被唯一划分为若干最大连续相同字符段。每段由字符和长度确定，编码为 ``十进制长度 + 字符``。例如连续三个 ``'1'`` 写成 ``"31"``。段必须最大化，否则同一输入会产生多种错误描述。

双指针如何划分连续段
~~~~~~~~~~~~~~~~~~~~

``start`` 指向未编码段首，``end`` 向右越过所有与 ``current[start]`` 相同的字符。半开区间 ``[start,end)`` 长度为 ``end-start``。追加计数和段字符后令 ``start=end``，因此每个输入字符恰好属于一个段。

.. list-table::
   :header-rows: 1

   * - ``start``
     - ``end``
     - 段
     - 输出追加
   * - 0
     - 3
     - ``111``
     - ``31``
   * - 3
     - 4
     - ``2``
     - ``12``
   * - 4
     - 6
     - ``11``
     - ``21``

为什么不能统计整个字符串的频次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``"121"`` 中虽然有两个 ``1``，它们不连续，正确描述是 ``"11" + "12" + "11"``。若使用全局哈希频次，会丢失段顺序与分隔关系，生成错误结果。

递归与迭代如何对应序列定义
~~~~~~~~~~~~~~~~~~~~~~~~~~

递归版本先求第 ``n-1`` 项，再执行一次 ``describe``，形式接近数学定义，但调用栈为 ``O(n)``。迭代从 ``"1"`` 开始，每轮只保留当前项和下一项，执行 ``n-1`` 次变换，状态更直接。

为什么迭代结果正确
~~~~~~~~~~~~~~~~~~

对项编号归纳：初始 ``current="1"`` 正确表示第 1 项。假设某轮开始时 ``current`` 是第 ``k`` 项；双指针把它完整且唯一地划分为最大连续段，并对每段追加准确长度与字符，所以 ``describe(current)`` 正是第 ``k+1`` 项。执行 ``n-1`` 轮后得到第 ``n`` 项。

缓冲区更新为什么不能原地覆盖当前项
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

输出长度与输入长度不同，且生成前部输出可能破坏后续尚未读取字符。使用独立 ``next`` 缓冲区完成整轮编码，再交换为 ``current``，能保证读取项在本轮保持不变。

复杂度来源
~~~~~~~~~~

设第 ``k`` 项长度为 ``L_k``。每次变换线性扫描当前项并写出下一项，总时间为 ``O(L_1+...+L_n)``；每轮只保存当前和下一字符串，工作空间 ``O(L_n)``。递归版本额外使用 ``O(n)`` 调用栈。

九语言实现
----------

C
~

.. code-block:: c

   char *countAndSay(int n) {
       char *current = malloc(2); strcpy(current, "1");
       for (int step = 1; step < n; ++step) {
           int length = (int)strlen(current), capacity = length * 3 + 16, used = 0;
           char *next = malloc((size_t)capacity);
           for (int start = 0; start < length;) {
               int end = start + 1; while (end < length && current[end] == current[start]) ++end;
               used += snprintf(next + used, (size_t)(capacity - used), "%d%c", end - start, current[start]);
               start = end;
           }
           next[used] = '\0'; free(current); current = next;
       }
       return current;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def countAndSay(self, n: int) -> str:
           current = "1"
           for _ in range(n - 1):
               parts = []
               start = 0
               while start < len(current):
                   end = start + 1
                   while end < len(current) and current[end] == current[start]:
                       end += 1
                   parts.append(str(end - start)); parts.append(current[start])
                   start = end
               current = "".join(parts)
           return current

Java
~~~~

.. code-block:: java

   class Solution {
       public String countAndSay(int n) {
           String current = "1";
           for (int step = 1; step < n; step++) {
               StringBuilder next = new StringBuilder();
               for (int start = 0; start < current.length();) {
                   int end = start + 1;
                   while (end < current.length() && current.charAt(end) == current.charAt(start)) end++;
                   next.append(end - start).append(current.charAt(start));
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
               let bytes = current.as_bytes(); let mut next = String::new(); let mut start = 0;
               while start < bytes.len() {
                   let mut end = start + 1; while end < bytes.len() && bytes[end] == bytes[start] { end += 1; }
                   next.push_str(&(end - start).to_string()); next.push(bytes[start] as char); start = end;
               }
               current = next;
           }
           current
       }
   }

Go
~~

.. code-block:: go

   func countAndSay(n int) string {
       current := "1"
       for step := 1; step < n; step++ {
           var next strings.Builder
           for start := 0; start < len(current); {
               end := start + 1
               for end < len(current) && current[end] == current[start] { end++ }
               next.WriteString(strconv.Itoa(end-start)); next.WriteByte(current[start]); start = end
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
               while (end < current.length && current[end] === current[start]) end++;
               parts.push(String(end - start), current[start]); start = end;
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
           for (int step = 1; step < n; step++) {
               var next = new System.Text.StringBuilder();
               for (int start = 0; start < current.Length;) {
                   int end = start + 1;
                   while (end < current.Length && current[end] == current[start]) end++;
                   next.Append(end - start).Append(current[start]); start = end;
               }
               current = next.ToString();
           }
           return current;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function count_and_say(n::Int)
       current = "1"
       for _ in 2:n
           chars = collect(current); io = IOBuffer(); start = 1
           while start <= length(chars)
               stop = start + 1
               while stop <= length(chars) && chars[stop] == chars[start]
                   stop += 1
               end
               print(io, stop - start, chars[start]); start = stop
           end
           current = String(take!(io))
       end
       current
   end

R
~

.. code-block:: r

   count_and_say <- function(n) {
     current <- "1"
     if (n >= 2L) for (step in 2:n) {
       chars <- strsplit(current, "", fixed = TRUE)[[1]]; parts <- character(); start <- 1L
       while (start <= length(chars)) {
         stop <- start + 1L
         while (stop <= length(chars) && chars[[stop]] == chars[[start]]) stop <- stop + 1L
         parts <- c(parts, as.character(stop - start), chars[[start]]); start <- stop
       }
       current <- paste(parts, collapse = "")
     }
     current
   }