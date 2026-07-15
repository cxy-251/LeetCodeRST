0151. Reverse Words in a String
===============================

题目信息
--------

:题号: 0151
:难度: Medium
:主题: 字符串、双指针
:原题: `LeetCode 0151 <https://leetcode.com/problems/reverse-words-in-a-string/>`_
:访问状态: Available
:教学重点: 从右向左提取单词、空格规范化、输出物化

题目重述
--------

输入由英文字母、数字和空格组成，其中至少包含一个单词。返回单词顺序翻转后的新字符串：忽略开头和结尾
空格，把相邻单词之间压缩为一个空格。单词内部字符顺序保持不变，输入字符串不需要被原地修改。

算法
----

从字符串末尾向前扫描。先跳过一段空格，再定位紧邻的完整单词，把该单词加入结果；之后继续从它左侧扫描。
除第一个输出单词外，每次写入前补一个空格。这样提取顺序天然就是原单词顺序的逆序，也不会把多余空格写入
结果。

不可变字符串语言可以把单词片段暂存到数组后统一 ``join``；C、C++、Java 等实现直接追加到结果缓冲。
这些写法共享同一个状态：未处理前缀、当前单词边界和已经按目标顺序写出的后缀单词。

正确性
~~~~~~

每次外层循环开始时，原字符串中当前扫描位置右侧的所有单词已经按从右到左的顺序写入结果，且相邻输出
单词之间恰有一个空格。跳过空格不会遗漏单词；随后向左找到的连续非空格区间恰好是尚未处理的最右单词。
把它追加后，不变量保持。扫描越过字符串左端时所有单词都已处理，写入顺序就是原顺序的逆序，空格规则也
由统一分隔符保证。

复杂度
~~~~~~

设字符串长度为 ``n``。扫描和写出各字符常数次，时间为 ``O(n)``。返回字符串载荷为 ``O(n)``；使用单词
数组的语言还需要 ``O(k)`` 个片段引用或对象，其中 ``k`` 是单词数。C 返回新分配字符串并由调用者释放；
C++ 的按值参数、Python 切片、Julia/R 字符物化会产生对应语言的额外副本。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

   char *reverseWords(char *s) {
       size_t length = strlen(s);
       char *result = malloc(length + 1U);
       if (result == NULL) {
           return NULL;
       }

       size_t write = 0U;
       ptrdiff_t end = (ptrdiff_t)length - 1;
       while (end >= 0) {
           while (end >= 0 && s[end] == ' ') {
               --end;
           }
           if (end < 0) {
               break;
           }

           ptrdiff_t start = end;
           while (start >= 0 && s[start] != ' ') {
               --start;
           }

           if (write > 0U) {
               result[write++] = ' ';
           }
           size_t word_length = (size_t)(end - start);
           memcpy(result + write, s + start + 1, word_length);
           write += word_length;
           end = start - 1;
       }

       result[write] = '\0';
       return result;
   }

C++
~~~

.. code-block:: cpp

   #include <string>

   class Solution {
   public:
       std::string reverseWords(std::string s) {
           std::string result;
           result.reserve(s.size());

           int end = static_cast<int>(s.size()) - 1;
           while (end >= 0) {
               while (end >= 0 && s[end] == ' ') {
                   --end;
               }
               if (end < 0) {
                   break;
               }

               int start = end;
               while (start >= 0 && s[start] != ' ') {
                   --start;
               }

               if (!result.empty()) {
                   result.push_back(' ');
               }
               result.append(
                   s,
                   static_cast<std::size_t>(start + 1),
                   static_cast<std::size_t>(end - start)
               );
               end = start - 1;
           }

           return result;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def reverseWords(self, s: str) -> str:
           words: list[str] = []
           end = len(s) - 1

           while end >= 0:
               while end >= 0 and s[end] == " ":
                   end -= 1
               if end < 0:
                   break

               start = end
               while start >= 0 and s[start] != " ":
                   start -= 1
               words.append(s[start + 1 : end + 1])
               end = start - 1

           return " ".join(words)

Java
~~~~

.. code-block:: java

   class Solution {
       public String reverseWords(String s) {
           StringBuilder result = new StringBuilder(s.length());
           int end = s.length() - 1;

           while (end >= 0) {
               while (end >= 0 && s.charAt(end) == ' ') {
                   end--;
               }
               if (end < 0) {
                   break;
               }

               int start = end;
               while (start >= 0 && s.charAt(start) != ' ') {
                   start--;
               }
               if (result.length() > 0) {
                   result.append(' ');
               }
               result.append(s, start + 1, end + 1);
               end = start - 1;
           }

           return result.toString();
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn reverse_words(s: String) -> String {
           let bytes = s.as_bytes();
           let mut words: Vec<&str> = Vec::new();
           let mut end = bytes.len();

           while end > 0 {
               while end > 0 && bytes[end - 1] == b' ' {
                   end -= 1;
               }
               if end == 0 {
                   break;
               }

               let mut start = end;
               while start > 0 && bytes[start - 1] != b' ' {
                   start -= 1;
               }
               words.push(&s[start..end]);
               end = start;
           }

           words.join(" ")
       }
   }

Go
~~

.. code-block:: go

   import "strings"

   func reverseWords(s string) string {
       words := make([]string, 0)
       end := len(s)

       for end > 0 {
           for end > 0 && s[end-1] == ' ' {
               end--
           }
           if end == 0 {
               break
           }

           start := end
           for start > 0 && s[start-1] != ' ' {
               start--
           }
           words = append(words, s[start:end])
           end = start
       }

       return strings.Join(words, " ")
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function reverseWords(s: string): string {
       const words: string[] = [];
       let end = s.length - 1;

       while (end >= 0) {
           while (end >= 0 && s[end] === " ") {
               end--;
           }
           if (end < 0) {
               break;
           }

           let start = end;
           while (start >= 0 && s[start] !== " ") {
               start--;
           }
           words.push(s.slice(start + 1, end + 1));
           end = start - 1;
       }

       return words.join(" ");
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public string ReverseWords(string s) {
           var words = new List<string>();
           int end = s.Length - 1;

           while (end >= 0) {
               while (end >= 0 && s[end] == ' ') {
                   end--;
               }
               if (end < 0) {
                   break;
               }

               int start = end;
               while (start >= 0 && s[start] != ' ') {
                   start--;
               }
               words.Add(s.Substring(start + 1, end - start));
               end = start - 1;
           }

           return string.Join(" ", words);
       }
   }

Julia
~~~~~

.. code-block:: julia

   function reverse_words(s::String)::String
       bytes = codeunits(s)
       words = String[]
       stop = length(bytes)

       while stop > 0
           while stop > 0 && bytes[stop] == UInt8(' ')
               stop -= 1
           end
           stop == 0 && break

           start = stop
           while start > 1 && bytes[start - 1] != UInt8(' ')
               start -= 1
           end
           push!(words, String(Vector{UInt8}(bytes[start:stop])))
           stop = start - 1
       end

       return join(words, " ")
   end

R
~

.. code-block:: r

   reverse_words <- function(s) {
     chars <- strsplit(s, "", fixed = TRUE)[[1L]]
     words <- vector("list", length(chars))
     count <- 0L
     stop <- length(chars)

     while (stop > 0L) {
       while (stop > 0L && chars[stop] == " ") {
         stop <- stop - 1L
       }
       if (stop == 0L) {
         break
       }

       start <- stop
       while (start > 1L && chars[start - 1L] != " ") {
         start <- start - 1L
       }
       count <- count + 1L
       words[[count]] <- paste0(chars[start:stop], collapse = "")
       stop <- start - 1L
     }

     if (count == 0L) "" else paste(unlist(words[seq_len(count)]), collapse = " ")
   }

关键边界
--------

* 开头、结尾和单词之间都可能出现多个空格；
* 只有一个单词时只需去除外围空格；
* 单词内部字符顺序不能翻转；
* 结果中不能保留重复空格或结尾空格；
* Rust、Go 和 Julia 的字节扫描依赖题目给出的 ASCII 字符域。

验证
----

运行三个官方示例，以及单词、全侧多空格、数字混合和长度一单词。Python、C、C++、Go、Java 与 TypeScript
输出一致；Rust、C#、Julia 和 R 完成索引、ASCII 边界、片段物化和空结果防御静态检查。

最小自检
--------

#. 为什么从右向左扫描后不需要再翻转结果数组？
#. 跳过空格与定位单词为什么必须分成两个阶段？
#. 输出长度为 ``O(n)`` 时，为什么不能把总空间写成 ``O(1)``？
