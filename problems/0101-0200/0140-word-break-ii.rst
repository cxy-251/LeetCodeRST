0140. Word Break II
===================

题目信息
--------

:题号: 0140
:难度: Hard
:主题: 动态规划、输出枚举、字符串构造
:原题: `LeetCode 0140 <https://leetcode.com/problems/word-break-ii/>`_
:访问状态: Available
:教学重点: 后缀答案状态、空串单位元、输出敏感复杂度

题目重述
--------

给定一个非空小写字符串 ``s`` 和一个由非空、互不重复小写单词组成的字典，返回所有能够完整组成 ``s`` 的
句子。句子中的相邻单词使用一个空格分隔，同一个字典词可以重复使用。答案顺序不影响语义；实现按字典遍历
顺序生成结果。

算法
----

令 ``sentences[i]`` 保存能够组成后缀 ``s[i:]`` 的全部句子。把终点状态设为
``sentences[n] = [""]``；其中空字符串不是最终答案，而是“后面已经没有单词”的组合单位元。

按 ``i`` 从右向左计算。对每个能与 ``s`` 从 ``i`` 开始的位置匹配的字典词 ``word``，令
``end = i + len(word)``，再遍历 ``sentences[end]``：

* 尾句为空时加入 ``word``；
* 尾句非空时加入 ``word + " " + tail``。

最终 ``sentences[0]`` 就是全部答案。后缀无解时对应列表为空，自然不会向前产生句子。

正确性
~~~~~~

对后缀长度做归纳。终点 ``n`` 只有一种合法完成方式：不再选择单词，内部用空字符串表示，因此基础状态正确。

假设所有更短后缀的列表都精确包含其合法句子。对位置 ``i``，任何由算法加入的结果都由一个确实匹配当前位置的
字典词和一个合法尾句组成，所以能够完整覆盖 ``s[i:]``。

反过来，任意合法句子都有唯一的第一个单词 ``word``。该单词必须匹配 ``s`` 从 ``i`` 开始的片段，剩余单词
形成 ``s[end:]`` 的合法尾句；根据归纳假设，这个尾句位于 ``sentences[end]``，算法会把两者组合。因此算法
不会遗漏任何答案。字典词互不重复，而句子的首词与后续 token 序列唯一确定一次构造路径，所以不会重复生成同一
句子。

复杂度
~~~~~~

设字符串长度为 ``n``，字典总字符数为 ``C``，``T`` 为所有后缀状态中实际物化的句子字符总量。
前缀匹配检查为 ``O(nC)``，构造并复制结果字符串为 ``O(T)``，总时间 ``O(nC + T)``；状态列表和字符串占
``O(n + T)`` 空间。最终答案本身可能指数级，任何完整枚举算法都无法避开对应输出成本。

C++ 平台签名按值接收 ``s``，另有 ``O(n)`` 输入副本。R 适配器的动态列表增长、``unlist`` 和字符串拼接会
产生额外容器复制，不能把通用的输出空间界直接解释成其累计分配量。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

   typedef struct {
       char **items;
       int size;
       int capacity;
   } StringList;

   static void free_list(StringList *list) {
       for (int index = 0; index < list->size; ++index) {
           free(list->items[index]);
       }
       free(list->items);
       list->items = NULL;
       list->size = 0;
       list->capacity = 0;
   }

   static bool reserve_one(StringList *list) {
       if (list->size < list->capacity) {
           return true;
       }
       int next_capacity = list->capacity == 0
           ? 4
           : list->capacity * 2;
       char **next = realloc(
           list->items,
           (size_t)next_capacity * sizeof(*next)
       );
       if (next == NULL) {
           return false;
       }
       list->items = next;
       list->capacity = next_capacity;
       return true;
   }

   static bool append_sentence(
       StringList *list,
       const char *word,
       size_t word_length,
       const char *tail
   ) {
       if (!reserve_one(list)) {
           return false;
       }

       size_t tail_length = strlen(tail);
       size_t sentence_length = word_length +
           (tail_length == 0 ? 0 : 1 + tail_length);
       char *sentence = malloc(sentence_length + 1);
       if (sentence == NULL) {
           return false;
       }

       memcpy(sentence, word, word_length);
       size_t cursor = word_length;
       if (tail_length != 0) {
           sentence[cursor++] = ' ';
           memcpy(sentence + cursor, tail, tail_length);
           cursor += tail_length;
       }
       sentence[cursor] = '\0';
       list->items[list->size++] = sentence;
       return true;
   }

   char **wordBreak(
       char *s,
       char **wordDict,
       int wordDictSize,
       int *returnSize
   ) {
       *returnSize = 0;
       size_t n = strlen(s);
       StringList *sentences = calloc(
           n + 1,
           sizeof(*sentences)
       );
       size_t *lengths = malloc(
           (size_t)wordDictSize * sizeof(*lengths)
       );
       if (sentences == NULL || lengths == NULL) {
           free(sentences);
           free(lengths);
           return NULL;
       }

       for (int index = 0; index < wordDictSize; ++index) {
           lengths[index] = strlen(wordDict[index]);
       }
       if (!append_sentence(&sentences[n], "", 0, "")) {
           for (size_t pos = 0; pos <= n; ++pos) {
               free_list(&sentences[pos]);
           }
           free(lengths);
           free(sentences);
           return NULL;
       }

       for (size_t start = n; start-- > 0;) {
           for (int index = 0; index < wordDictSize; ++index) {
               size_t word_length = lengths[index];
               size_t end = start + word_length;
               if (end > n ||
                   memcmp(
                       s + start,
                       wordDict[index],
                       word_length
                   ) != 0) {
                   continue;
               }

               for (int tail_index = 0;
                    tail_index < sentences[end].size;
                    ++tail_index) {
                   if (!append_sentence(
                           &sentences[start],
                           wordDict[index],
                           word_length,
                           sentences[end].items[tail_index]
                       )) {
                       for (size_t pos = 0; pos <= n; ++pos) {
                           free_list(&sentences[pos]);
                       }
                       free(lengths);
                       free(sentences);
                       return NULL;
                   }
               }
           }
       }

       char **answer = sentences[0].items;
       *returnSize = sentences[0].size;
       sentences[0].items = NULL;
       sentences[0].size = 0;
       sentences[0].capacity = 0;

       for (size_t pos = 0; pos <= n; ++pos) {
           free_list(&sentences[pos]);
       }
       free(lengths);
       free(sentences);
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   public:
       std::vector<std::string> wordBreak(
           std::string s,
           std::vector<std::string>& wordDict
       ) {
           std::vector<std::vector<std::string>> sentences(
               s.size() + 1
           );
           sentences[s.size()].push_back("");

           for (std::size_t start = s.size(); start-- > 0;) {
               for (const std::string& word : wordDict) {
                   std::size_t end = start + word.size();
                   if (end > s.size() ||
                       s.compare(start, word.size(), word) != 0) {
                       continue;
                   }
                   for (const std::string& tail : sentences[end]) {
                       sentences[start].push_back(
                           tail.empty()
                               ? word
                               : word + " " + tail
                       );
                   }
               }
           }
           return sentences[0];
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def wordBreak(
           self,
           s: str,
           wordDict: list[str],
       ) -> list[str]:
           sentences: list[list[str]] = [
               [] for _ in range(len(s) + 1)
           ]
           sentences[len(s)] = [""]

           for start in range(len(s) - 1, -1, -1):
               for word in wordDict:
                   end = start + len(word)
                   if end > len(s) or not s.startswith(word, start):
                       continue
                   for tail in sentences[end]:
                       sentences[start].append(
                           word if tail == "" else f"{word} {tail}"
                       )

           return sentences[0]

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       public List<String> wordBreak(
           String s,
           List<String> wordDict
       ) {
           List<List<String>> sentences = new ArrayList<>();
           for (int index = 0; index <= s.length(); ++index) {
               sentences.add(new ArrayList<>());
           }
           sentences.get(s.length()).add("");

           for (int start = s.length() - 1; start >= 0; --start) {
               for (String word : wordDict) {
                   int end = start + word.length();
                   if (end > s.length() ||
                       !s.startsWith(word, start)) {
                       continue;
                   }
                   for (String tail : sentences.get(end)) {
                       sentences.get(start).add(
                           tail.isEmpty()
                               ? word
                               : word + " " + tail
                       );
                   }
               }
           }
           return sentences.get(0);
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn word_break(
           s: String,
           word_dict: Vec<String>,
       ) -> Vec<String> {
           let source = s.as_bytes();
           let mut sentences = vec![Vec::<String>::new(); source.len() + 1];
           sentences[source.len()].push(String::new());

           for start in (0..source.len()).rev() {
               let mut current = Vec::<String>::new();
               for word in &word_dict {
                   let word_bytes = word.as_bytes();
                   let end = start + word_bytes.len();
                   if end > source.len()
                       || &source[start..end] != word_bytes
                   {
                       continue;
                   }

                   for tail in &sentences[end] {
                       if tail.is_empty() {
                           current.push(word.clone());
                       } else {
                           current.push(format!("{} {}", word, tail));
                       }
                   }
               }
               sentences[start] = current;
           }
           sentences.remove(0)
       }
   }

Go
~~

.. code-block:: go

   import "strings"

   func wordBreak(s string, wordDict []string) []string {
       sentences := make([][]string, len(s)+1)
       sentences[len(s)] = []string{""}

       for start := len(s) - 1; start >= 0; start-- {
           current := make([]string, 0)
           for _, word := range wordDict {
               end := start + len(word)
               if end > len(s) ||
                   !strings.HasPrefix(s[start:], word) {
                   continue
               }
               for _, tail := range sentences[end] {
                   if tail == "" {
                       current = append(current, word)
                   } else {
                       current = append(
                           current,
                           word+" "+tail,
                       )
                   }
               }
           }
           sentences[start] = current
       }
       return sentences[0]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function wordBreak(s: string, wordDict: string[]): string[] {
       const sentences: string[][] = Array.from(
           { length: s.length + 1 },
           () => [],
       );
       sentences[s.length].push("");

       for (let start = s.length - 1; start >= 0; start -= 1) {
           for (const word of wordDict) {
               const end = start + word.length;
               if (end > s.length || !s.startsWith(word, start)) {
                   continue;
               }
               for (const tail of sentences[end]) {
                   sentences[start].push(
                       tail === "" ? word : `${word} ${tail}`,
                   );
               }
           }
       }
       return sentences[0];
   }

C#
~~

.. code-block:: csharp

   using System;
   using System.Collections.Generic;

   public class Solution {
       public IList<string> WordBreak(
           string s,
           IList<string> wordDict
       ) {
           List<string>[] sentences =
               new List<string>[s.Length + 1];
           for (int index = 0; index <= s.Length; ++index) {
               sentences[index] = new List<string>();
           }
           sentences[s.Length].Add("");

           for (int start = s.Length - 1; start >= 0; --start) {
               foreach (string word in wordDict) {
                   int end = start + word.Length;
                   if (end > s.Length ||
                       string.CompareOrdinal(
                           s, start, word, 0, word.Length
                       ) != 0) {
                       continue;
                   }
                   foreach (string tail in sentences[end]) {
                       sentences[start].Add(
                           tail.Length == 0
                               ? word
                               : word + " " + tail
                       );
                   }
               }
           }
           return sentences[0];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function word_break_ii(
       s::String,
       word_dict::Vector{String},
   )::Vector{String}
       source = codeunits(s)
       words = [(word, codeunits(word)) for word in word_dict]
       n = length(source)
       sentences = [String[] for _ in 1:(n + 1)]
       push!(sentences[n + 1], "")

       for start0 in (n - 1):-1:0
           current = String[]
           for (word, bytes) in words
               end0 = start0 + length(bytes)
               end0 <= n || continue

               same = true
               for offset in 1:length(bytes)
                   if source[start0 + offset] != bytes[offset]
                       same = false
                       break
                   end
               end
               same || continue

               for tail in sentences[end0 + 1]
                   push!(
                       current,
                       isempty(tail)
                           ? word
                           : string(word, " ", tail),
                   )
               end
           end
           sentences[start0 + 1] = current
       end
       return sentences[1]
   end

R
~

.. code-block:: r

   word_break_ii <- function(s, word_dict) {
     n <- nchar(s, type = "bytes")
     sentences <- vector("list", n + 1L)
     for (index in seq_len(n + 1L)) {
       sentences[[index]] <- character(0)
     }
     sentences[[n + 1L]] <- ""

     for (start0 in seq.int(n - 1L, 0L, by = -1L)) {
       current <- list()
       count <- 0L
       for (word in word_dict) {
         word_length <- nchar(word, type = "bytes")
         end0 <- start0 + word_length
         if (end0 > n ||
             substr(s, start0 + 1L, end0) != word) {
           next
         }
         for (tail in sentences[[end0 + 1L]]) {
           count <- count + 1L
           current[[count]] <- if (tail == "") {
             word
           } else {
             paste(word, tail)
           }
         }
       }
       sentences[[start0 + 1L]] <- if (count == 0L) {
         character(0)
       } else {
         unlist(current, use.names = FALSE)
       }
     }
     sentences[[1L]]
   }

关键边界
--------

* 无合法切分时返回空列表，而不是包含空字符串的列表；
* 内部终点状态的 ``""`` 只用于避免句尾多出空格；
* 同一个字典词可以在一句话中多次出现；
* 多种首词都能匹配时必须完整保留全部分支；
* 复杂度必须计入全部输出字符串及中间后缀答案的物化成本。

验证
----

运行三个官方示例，并补充单词重复使用、单词整串命中和无解边界；Python 结果集合通过，C++ 严格编译并运行
相同样例。C 实现额外检查返回数组所有权和失败清理。其余语言完成输出快照、索引、空尾句和字符串构造静态
检查。未执行大规模随机枚举。

最小自检
--------

#. 为什么 ``sentences[n]`` 必须包含一个空字符串，而不能是空列表？
#. 为什么后缀列表为空时不会产生错误答案？
#. 为什么本题不能只写成与 0139 相同的布尔 DP？
#. ``T`` 为什么可能远大于最终答案列表的字符总量？
