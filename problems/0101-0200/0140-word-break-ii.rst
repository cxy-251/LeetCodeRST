0140. Word Break II
===================

题目信息
--------

:题号: 0140
:难度: Hard
:主题: 动态规划、DAG 路径枚举、输出敏感分析
:原题: `LeetCode 0140 <https://leetcode.com/problems/word-break-ii/>`_
:访问状态: Available
:教学重点: 后缀答案状态、空串单位元、完整枚举与资源所有权

精确契约
--------

给定一个非空字符串 ``s`` 和一个非空字典 ``wordDict``，在 ``s`` 的若干字符边界插入单个空格，使每段都
是字典词，返回所有能够完整覆盖 ``s`` 的句子。字典词非空且互不重复，同一个词可以在一句中重复使用；答案
顺序不限。无解时返回空列表，而不是包含空字符串的列表。

题目保证 ``s`` 长度不超过 20，字典至多有 1000 个词，每个词长度不超过 10，所有输入只含小写英文字母；
生成数据还保证答案列表长度不超过 ``10^5``。这个上界并不把问题变成多项式规模：不同切分的数量仍可随
``s`` 的长度指数增长，而且实现还会保存多个后缀的中间答案。

十语言实现都不修改输入，并按字典遍历顺序生成句子。C 返回的外层 ``char **`` 和每个 ``char *`` 都转交
调用者释放；分配失败时返回 ``NULL`` 且 ``*returnSize = 0``，因此空答案与资源失败共享同一外部形态。

自建示例
--------

取 ``s = "aaaa"``，``wordDict = ["a", "aa"]``，完整答案是：

.. code-block:: text

   a a a a
   a a aa
   a aa a
   aa a a
   aa aa

例如后缀 ``"aa"`` 的两种句子会被前面的 ``"a"`` 和 ``"aa"`` 分支复用。这既说明同一个字典词可以
重复使用，也说明布尔可达状态不够：本题必须保留每条不同路径的文本载荷。

再取 ``s = "catsx"``，``wordDict = ["cat", "cats"]``。两个词都能形成合法前缀，但没有词覆盖末尾
``"x"``，所以答案是空列表。不能把尚未到达终点的前缀直接当成句子输出。

问题抽象
--------

仍把字符边界 ``0..n`` 看成有向无环图：若 ``word`` 等于 ``s[start:end]``，就有一条标记为该词的
``start -> end`` 边。0139 只问从 0 到 ``n`` 是否存在路径；本题要求枚举每条路径，并把边标签以空格连接。

显式深度优先搜索可以直接枚举路径，但若不缓存，会反复展开同一后缀。只缓存“能否到达终点”可以剪枝，却仍
需要重新枚举共享后缀。这里采用后缀答案动态规划：每个后缀的所有句子只构造一次，再由所有更早的首词组合。
代价是会物化最终路径之外的全部后缀答案，复杂度必须如实计入。

状态、转移与单位元
------------------

定义 ``sentences[i]``：能够完整覆盖后缀 ``s[i:n]`` 的 **全部且不重复** 的句子，合法下标为 ``0..n``。
代码中的外层列表就是这些状态，内层字符串必须是独立的结果快照，不能指向随后还会修改的路径缓冲区。

终点设为 ``sentences[n] = [""]``。这里的单个空字符串不是公开答案，而是组合单位元：当某个词恰好到达
末端时，它与唯一的“空尾句”组合成词本身，不增加尾随空格。如果把终点设为空列表，任何末词都没有可组合的
尾句，所有答案都会消失。

按 ``start = n-1, n-2, ..., 0`` 计算。对每个在 ``start`` 匹配的字典词 ``word``，令
``end = start + len(word)``，遍历已经完成的 ``sentences[end]``：

* ``tail`` 为空字符串时生成 ``word``；
* 否则生成 ``word + " " + tail``。

字典词非空，所以 ``end > start``；从右向左处理保证读取的后缀状态已经完整，且状态依赖不成环。最终返回
``sentences[0]``，内部的终点单位元不会出现在非空输入的公开答案中。

正确性证明
----------

对后缀长度从短到长归纳，证明每个 ``sentences[i]`` 恰好包含该后缀的全部合法句子，且没有重复。

**基础状态。** 在位置 ``n`` 已经没有待覆盖字符。内部只有一种完成方式——不再选择单词，因此
``sentences[n] = [""]`` 精确表示组合单位元。它不是把空字符串声明为题目的合法句子。

**合法性。** 假设所有 ``end > start`` 的状态都只含合法尾句。算法仅在 ``word`` 精确匹配
``s[start:end]`` 时组合；若尾句为空，``word`` 正好覆盖到末端；否则归纳假设保证 ``tail`` 完整覆盖
``s[end:n]``。两者用一个空格连接后恰好覆盖 ``s[start:n]``，每个 token 都来自字典。因此算法生成的结果
全部合法。

**完整性。** 任取覆盖 ``s[start:n]`` 的合法句子。它有确定的第一个 token ``word``；该词必然匹配
``s`` 在 ``start`` 开始的片段，余下 token 构成 ``s[end:n]`` 的合法尾句。由归纳假设，该尾句出现在
``sentences[end]`` 中；若没有余下 token，就对应终点状态的空字符串。算法枚举 ``word`` 时必然把这两部分
组合，所以没有合法句子被遗漏。

**无重复。** 输入词只含小写字母，输出分隔符是空格，所以一句输出按空格拆分后具有唯一 token 序列。若两次
构造产生同一句子，它们的首 token 必须相同。字典词互不重复，首词只会在字典循环中出现一次；归纳假设又保证
相同尾句在 ``sentences[end]`` 中只出现一次，因此同一路径不会被重复生成。

综上，归纳命题对所有位置成立，``sentences[0]`` 正是题目要求的结果。外层位置、字典和已物化尾句都是有限
集合，每条转移又严格走向更大的位置，所以计算终止。

输出敏感复杂度
--------------

设 ``n`` 为字符串长度，``m`` 为字典词数，全部词长之和为 ``C``。再定义：

``P``
   所有 ``sentences[i]`` 中物化的句子对象总数，包括内部终点单位元；

``T``
   所有后缀状态中物化的非空句子字符总量；

``P0`` 与 ``T0``
   最终 ``sentences[0]`` 的句子数与字符总量，即公开输出载荷。

每个位置最坏比较全部字典字符，匹配成本为 ``O(nC)``。每次组合都要创建长度与新句子相当的字符串，全部构造
成本为 ``O(T)``；容器追加的摊还成本为 ``O(P)``，而除终点单位元外每个句子至少有一个字符，所以可吸收到
``O(T + 1)``。总时间是 ``O(nC + T)``，状态与字符串占 ``O(n + T)`` 空间。

最终输出自身占 ``O(P0 + T0)``；若把输出排除在辅助空间之外，本算法仍可能保存
``O(n + (T - T0))`` 的后缀载荷。``T`` 可能大于 ``T0``，因为某个拥有大量切法的后缀未必能从位置 0 通过
字典词到达。任何完整枚举算法都至少支付最终输出成本，但并非都具有完全相同的中间物化量。

语言适配还带来以下实际成本：C 为每个后缀维护倍增指针数组并复制每条句子；C++ 平台签名按值复制
``s``；Rust 在句尾克隆字典词、在一般情况新建有容量的 ``String``；托管语言的字符串拼接同样创建新对象；
Julia 的 ``codeunits`` 只建立包装视图；R 会物化 ``O(n + C)`` 个码点整数，并在每个状态将分块列表
``unlist`` 成字符向量。R 的容器扁平化另有 ``O(P)`` 引用搬运，仍不能只写成最终答案大小。

十语言实现
----------

C
~

.. code-block:: c

   #include <limits.h>
   #include <stdbool.h>
   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>
   #include <string.h>

   typedef struct {
       char **items;
       size_t size;
       size_t capacity;
   } StringList;

   static void free_list(StringList *list) {
       for (size_t index = 0; index < list->size; ++index) {
           free(list->items[index]);
       }
       free(list->items);
       list->items = NULL;
       list->size = 0;
       list->capacity = 0;
   }

   static void free_states(StringList *states, size_t count) {
       for (size_t index = 0; index < count; ++index) {
           free_list(&states[index]);
       }
   }

   static bool reserve_one(StringList *list) {
       if (list->size < list->capacity) {
           return true;
       }

       size_t next_capacity;
       if (list->capacity == 0) {
           next_capacity = 4;
       } else {
           if (list->capacity > SIZE_MAX / 2) {
               return false;
           }
           next_capacity = list->capacity * 2;
       }
       if (next_capacity > SIZE_MAX / sizeof(*list->items)) {
           return false;
       }

       char **next = realloc(
           list->items,
           next_capacity * sizeof(*list->items)
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
       size_t tail_length = strlen(tail);
       size_t separator = tail_length == 0 ? 0 : 1;
       if (word_length > SIZE_MAX - separator) {
           return false;
       }
       size_t sentence_length = word_length + separator;
       if (tail_length > SIZE_MAX - sentence_length) {
           return false;
       }
       sentence_length += tail_length;
       if (sentence_length == SIZE_MAX || !reserve_one(list)) {
           return false;
       }

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
       if (returnSize == NULL || wordDictSize < 0) {
           return NULL;
       }
       *returnSize = 0;

       size_t n = strlen(s);
       size_t word_count = (size_t)wordDictSize;
       if (n == SIZE_MAX ||
           n + 1 > SIZE_MAX / sizeof(StringList) ||
           word_count > SIZE_MAX / sizeof(size_t)) {
           return NULL;
       }

       size_t state_count = n + 1;
       StringList *sentences = calloc(
           state_count,
           sizeof(*sentences)
       );
       size_t *lengths = word_count == 0
           ? NULL
           : malloc(word_count * sizeof(*lengths));
       if (sentences == NULL ||
           (word_count != 0 && lengths == NULL)) {
           free(sentences);
           free(lengths);
           return NULL;
       }

       for (int index = 0; index < wordDictSize; ++index) {
           lengths[index] = strlen(wordDict[index]);
       }
       if (!append_sentence(&sentences[n], "", 0, "")) {
           goto failure;
       }

       for (size_t start = n; start-- > 0;) {
           for (int index = 0; index < wordDictSize; ++index) {
               size_t word_length = lengths[index];
               if (word_length > n - start) {
                   continue;
               }
               size_t end = start + word_length;
               if (memcmp(
                       s + start,
                       wordDict[index],
                       word_length
                   ) != 0) {
                   continue;
               }

               for (size_t tail_index = 0;
                    tail_index < sentences[end].size;
                    ++tail_index) {
                   if (!append_sentence(
                           &sentences[start],
                           wordDict[index],
                           word_length,
                           sentences[end].items[tail_index]
                       )) {
                       goto failure;
                   }
               }
           }
       }

       if (sentences[0].size > INT_MAX) {
           goto failure;
       }
       char **answer = sentences[0].items;
       *returnSize = (int)sentences[0].size;
       sentences[0].items = NULL;
       sentences[0].size = 0;
       sentences[0].capacity = 0;
       free_states(sentences, state_count);
       free(lengths);
       free(sentences);
       return answer;

   failure:
       free_states(sentences, state_count);
       free(lengths);
       free(sentences);
       return NULL;
   }

``realloc`` 先写入临时指针，失败时旧列表仍可释放。任意中途失败都会释放所有已完成和部分完成的后缀；成功时
只把状态 0 的指针数组脱离，其他后缀连同终点空串全部释放。调用者最终负责释放返回的每个句子和外层数组。

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <utility>
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
                   if (word.size() > s.size() - start) {
                       continue;
                   }
                   std::size_t end = start + word.size();
                   if (s.compare(start, word.size(), word) != 0) {
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

           return std::move(sentences[0]);
       }
   };

每次 ``push_back`` 保存独立 ``std::string``。显式移动状态 0 避免在返回边界复制整份答案；按值参数 ``s``
仍是接口规定的输入副本。

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
               current: list[str] = []
               for word in wordDict:
                   if len(word) > len(s) - start:
                       continue
                   end = start + len(word)
                   if not s.startswith(word, start):
                       continue
                   for tail in sentences[end]:
                       current.append(
                           word if tail == "" else f"{word} {tail}"
                       )
               sentences[start] = current

           return sentences[0]

各状态由独立列表保存；不可变字符串可以安全共享输入词，但拼接后的句子是新的字符串对象。

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
               List<String> current = sentences.get(start);
               for (String word : wordDict) {
                   if (word.length() > s.length() - start) {
                       continue;
                   }
                   int end = start + word.length();
                   if (!s.startsWith(word, start)) {
                       continue;
                   }
                   for (String tail : sentences.get(end)) {
                       current.add(
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

``String`` 不可变，加入末词时可以复用字典对象；一般拼接会创建新字符串。所有坐标是 UTF-16 代码单元。

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
                   let bytes = word.as_bytes();
                   if bytes.len() > source.len() - start {
                       continue;
                   }
                   let end = start + bytes.len();
                   if &source[start..end] != bytes {
                       continue;
                   }

                   for tail in &sentences[end] {
                       if tail.is_empty() {
                           current.push(word.clone());
                       } else {
                           let mut sentence = String::with_capacity(
                               word.len() + 1 + tail.len()
                           );
                           sentence.push_str(word);
                           sentence.push(' ');
                           sentence.push_str(tail);
                           current.push(sentence);
                       }
                   }
               }
               sentences[start] = current;
           }

           sentences.into_iter().next().unwrap_or_default()
       }
   }

先在局部 ``current`` 中构造结果，避免一边可变借用 ``sentences[start]`` 一边不可变借用
``sentences[end]``。每个结果拥有自己的 ``String``；接口消费输入，但返回值不借用输入。

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
               if len(word) > len(s)-start {
                   continue
               }
               end := start + len(word)
               if !strings.HasPrefix(s[start:], word) {
                   continue
               }
               for _, tail := range sentences[end] {
                   if tail == "" {
                       current = append(current, word)
                   } else {
                       current = append(current, word+" "+tail)
                   }
               }
           }
           sentences[start] = current
       }
       return sentences[0]
   }

Go 字符串不可变；句尾分支可复用字典字符串，拼接分支分配新字符串。``s[start:]`` 共享原字节，不复制后缀。

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
           const current: string[] = [];
           for (const word of wordDict) {
               if (word.length > s.length - start) continue;
               const end = start + word.length;
               if (!s.startsWith(word, start)) continue;
               for (const tail of sentences[end]) {
                   current.push(
                       tail === "" ? word : `${word} ${tail}`,
                   );
               }
           }
           sentences[start] = current;
       }
       return sentences[0];
   }

``Array.from`` 的回调为每个状态建立独立数组，避免 ``fill([])`` 导致所有后缀共享同一个可变列表。字符串坐标是
UTF-16 代码单元，本题小写英文输入使其安全。

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
               List<string> current = sentences[start];
               foreach (string word in wordDict) {
                   if (word.Length > s.Length - start) continue;
                   int end = start + word.Length;
                   if (string.CompareOrdinal(
                           s, start, word, 0, word.Length
                       ) != 0) {
                       continue;
                   }
                   foreach (string tail in sentences[end]) {
                       current.Add(
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

每个数组槽位都显式建立新的 ``List<string>``；序数比较避开区域性规则，长度检查保证比较区间有效。

Julia
~~~~~

.. code-block:: julia

   function matches_at(source, start0::Int, word)::Bool
       word_length = length(word)
       word_length <= length(source) - start0 || return false
       for offset in 1:word_length
           source[start0 + offset] == word[offset] || return false
       end
       return true
   end

   function word_break_ii(
       s::String,
       word_dict::Vector{String},
   )::Vector{String}
       source = codeunits(s)
       word_bytes = [codeunits(word) for word in word_dict]
       n = length(source)
       sentences = [String[] for _ in 1:(n + 1)]
       push!(sentences[n + 1], "")

       for start0 in (n - 1):-1:0
           current = String[]
           for index in eachindex(word_dict)
               bytes = word_bytes[index]
               matches_at(source, start0, bytes) || continue
               end0 = start0 + length(bytes)
               word = word_dict[index]
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

算法位置使用零基 ``start0``，访问状态时加一。递减遍历显式使用步长 ``-1``；``codeunits`` 包装不复制
字符，生成的普通 ``String`` 则是不可变结果快照。

R
~

.. code-block:: r

   matches_at <- function(source, start0, word) {
     word_length <- length(word)
     if (word_length > length(source) - start0) return(FALSE)
     for (offset in seq_len(word_length)) {
       if (source[start0 + offset] != word[offset]) return(FALSE)
     }
     TRUE
   }

   word_break_ii <- function(s, word_dict) {
     source <- utf8ToInt(s)
     words <- lapply(word_dict, utf8ToInt)
     n <- length(source)
     sentences <- vector("list", n + 1L)
     for (index in seq_len(n + 1L)) {
       sentences[[index]] <- character(0)
     }
     sentences[[n + 1L]] <- ""

     for (start0 in seq.int(n - 1L, 0L, by = -1L)) {
       chunks <- vector("list", length(word_dict))
       for (index in seq_along(word_dict)) {
         word <- words[[index]]
         if (!matches_at(source, start0, word)) next
         end0 <- start0 + length(word)
         tails <- sentences[[end0 + 1L]]
         if (length(tails) == 0L) next

         word_text <- word_dict[[index]]
         chunks[[index]] <- vapply(
           tails,
           function(tail) {
             if (identical(tail, "")) {
               word_text
             } else {
               paste(word_text, tail)
             }
           },
           character(1L),
           USE.NAMES = FALSE
         )
       }

       current <- unlist(chunks, use.names = FALSE)
       sentences[[start0 + 1L]] <- if (is.null(current)) {
         character(0)
       } else {
         current
       }
     }
     sentences[[1L]]
   }

这是等价的 R 适配器。预分配 ``chunks`` 避免逐句扩展同一列表造成反复整体重建，再一次性扁平化当前状态；
``utf8ToInt`` 的输入物化和 ``unlist`` 的容器复制都已计入成本。题面保证 ``n >= 1``，递减序列的起点不小于
终点，并显式给出负步长。

关键边界与易错点
----------------

* 无解后缀对应空列表；只有终点状态是包含一个空字符串的列表；
* 末词与空尾句组合时不能附加空格，否则会产生尾随分隔符；
* 整个 ``s`` 是字典词时，这个词只是答案之一，仍要保留其他多词切分；
* 同一个字典词可在一条路径上重复出现，但字典自身互异保证每条标记边只枚举一次；
* 不能只保存 0139 的布尔可达性，因为它会合并需要分别输出的多条路径；
* 不能把 ``T0`` 当作全部成本：本实现还保存所有位置的后缀句子；
* 每次加入状态的必须是句子快照，不能复用随后继续 ``push/pop`` 的可变路径缓冲；
* C 的每次扩容、句长加法和部分构造都可能失败，成功返回前必须明确转移状态 0 的所有权；
* 字节、UTF-16 和码点坐标只在小写英文约束下重合，不能无条件推广到任意 Unicode。

静态审查记录
------------

本次逐后缀人工推演了官方三个示例，并额外推演单解、上面的五解共享后缀、同词复用、整串命中和无解边界；
逐项核对了终点单位元、首词匹配、尾句组合、输出顺序无要求以及合法性、完整性、无重复和终止性证明。

十语言静态审查覆盖平台签名、必要导入、字符坐标、独立状态容器、字符串快照和输出载荷。C 额外逐路径检查了
倍增溢出、句长乘加、``realloc`` 临时指针、任意中途失败的全状态清理、``INT_MAX`` 转换和成功返回所有权；
Rust 核对局部 ``current`` 的借用边界，TypeScript 核对数组别名，Julia/R 核对一基换算、递减方向、输入物化
与扁平化。

按照仓库当前策略，以上题解代码均 **未运行、未编译、未测试**，也未执行对拍、穷举、属性测试或 sanitizer。
剩余风险包括目标平台版本的签名/API 细节、极端输出下宿主分配器行为，以及人工审查仍可能遗漏的语法拼写；
本文不把静态推演表述为十语言运行通过。

学习链与自检
------------

本题在 0139 的位置图可达性上增加“枚举全部路径并物化标签”的载荷；与 0131 的回文分割同属路径枚举，与
0132 的最少切割形成“全部方案”和“最优数值”对照。核心新增知识是：DP 状态不仅能存真假或最值，也能存
完整答案集合，但这会把输出规模和快照所有权变成算法的一部分。

#. 为什么 ``sentences[n]`` 必须是 ``[""]``，而不是空列表？
#. 为什么算法生成的句子不会漏字符或使用非字典词？
#. 字典词互不重复怎样参与无重复证明？
#. 为什么复杂度要使用全部后缀物化量 ``T``，不能只用最终输出 ``T0``？
#. C 成功返回时，哪些对象留给调用者，哪些对象已经由函数释放？

答案要点
~~~~~~~~

#. 它表示“已经到达末端”的唯一组合方式，使末词能产生一条结果；空列表会让所有末词组合次数变成零。
#. 每次只接受与当前位置完全匹配的首词，再接上归纳上合法且完整覆盖剩余后缀的尾句。
#. 输出空格使 token 序列唯一；首 token 相同只能来自字典中的同一项，尾句又由归纳保证不重复。
#. 底向上的实现会为位置 1 到 ``n-1`` 也保存句子，其中一些位置可能从 0 不可达，因此这些字符不属于最终
   答案却真实占用构造时间和内存。
#. 状态 0 的外层指针数组及其中每个句子转交调用者；其他后缀、终点空串、词长数组和状态数组均已释放。
