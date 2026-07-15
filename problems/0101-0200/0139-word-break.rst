0139. Word Break
================

题目信息
--------

:题号: 0139
:难度: Medium
:主题: 动态规划、前缀可达性、字符串匹配
:原题: `LeetCode 0139 <https://leetcode.com/problems/word-break/>`_
:访问状态: Available
:教学重点: 可达前缀、状态传播、重复使用字典词

题目重述
--------

给定一个非空小写字符串 ``s`` 和一个由非空、互不重复小写单词组成的字典，判断能否把 ``s`` 完整切分为
一个或多个字典词。字典中的同一个单词可以重复使用，只需返回是否存在合法切分。

算法
----

令 ``reachable[i]`` 表示前 ``i`` 个字符能否由字典词完整组成，初始 ``reachable[0] = true``。

从左到右枚举起点 ``start``。只有 ``reachable[start]`` 为真时，才尝试把每个字典词接在这个前缀之后；
若单词与 ``s`` 从 ``start`` 开始的片段相同，就把 ``reachable[start + len(word)]`` 设为真。最终返回
``reachable[n]``。

这种写法直接从已证实可达的前缀向后传播，不会在不可达位置继续展开无效分支。

正确性
~~~~~~

初始空前缀可由零个单词组成，所以 ``reachable[0]`` 正确。

每次算法从一个可达前缀 ``s[:start]`` 出发，并只在后续片段等于某个字典词时标记新终点。因此每个被标记的
``reachable[end]`` 都对应一个合法切分，算法不会产生假阳性。

反过来，设 ``s[:end]`` 存在合法切分，其最后一个单词从 ``start`` 开始。切分的前半部分
``s[:start]`` 也合法；按终点递增顺序处理时，``reachable[start]`` 已经被标记，算法会检查最后一个单词并
标记 ``reachable[end]``。因此所有合法可达前缀都会被发现，``reachable[n]`` 与题目答案等价。

复杂度
~~~~~~

设字符串长度为 ``n``，字典全部单词长度之和为 ``C``。每个可达起点至多比较全部字典字符，时间
``O(nC)``；布尔数组占 ``O(n)`` 额外空间。C++ 平台签名按值接收 ``s``，还会产生 ``O(n)`` 输入副本。
R 的 ``substr`` 会物化比较片段，累计分配量可能达到 ``O(nC)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

   bool wordBreak(char *s, char **wordDict, int wordDictSize) {
       size_t n = strlen(s);
       bool *reachable = calloc(n + 1, sizeof(*reachable));
       size_t *lengths = malloc(
           (size_t)wordDictSize * sizeof(*lengths)
       );
       if (reachable == NULL || lengths == NULL) {
           free(reachable);
           free(lengths);
           return false;
       }

       for (int index = 0; index < wordDictSize; ++index) {
           lengths[index] = strlen(wordDict[index]);
       }

       reachable[0] = true;
       for (size_t start = 0; start < n; ++start) {
           if (!reachable[start]) {
               continue;
           }
           for (int index = 0; index < wordDictSize; ++index) {
               size_t length = lengths[index];
               size_t end = start + length;
               if (end <= n &&
                   memcmp(s + start, wordDict[index], length) == 0) {
                   reachable[end] = true;
               }
           }
       }

       bool answer = reachable[n];
       free(lengths);
       free(reachable);
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   public:
       bool wordBreak(
           std::string s,
           std::vector<std::string>& wordDict
       ) {
           std::vector<char> reachable(s.size() + 1, false);
           reachable[0] = true;

           for (std::size_t start = 0; start < s.size(); ++start) {
               if (!reachable[start]) {
                   continue;
               }
               for (const std::string& word : wordDict) {
                   std::size_t end = start + word.size();
                   if (end <= s.size() &&
                       s.compare(start, word.size(), word) == 0) {
                       reachable[end] = true;
                   }
               }
           }
           return reachable[s.size()];
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def wordBreak(self, s: str, wordDict: list[str]) -> bool:
           reachable = [False] * (len(s) + 1)
           reachable[0] = True

           for start in range(len(s)):
               if not reachable[start]:
                   continue
               for word in wordDict:
                   end = start + len(word)
                   if end <= len(s) and s.startswith(word, start):
                       reachable[end] = True

           return reachable[len(s)]

Java
~~~~

.. code-block:: java

   import java.util.List;

   class Solution {
       public boolean wordBreak(String s, List<String> wordDict) {
           boolean[] reachable = new boolean[s.length() + 1];
           reachable[0] = true;

           for (int start = 0; start < s.length(); ++start) {
               if (!reachable[start]) continue;
               for (String word : wordDict) {
                   int end = start + word.length();
                   if (end <= s.length() && s.startsWith(word, start)) {
                       reachable[end] = true;
                   }
               }
           }
           return reachable[s.length()];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn word_break(
           s: String,
           word_dict: Vec<String>,
       ) -> bool {
           let source = s.as_bytes();
           let words: Vec<&[u8]> = word_dict
               .iter()
               .map(|word| word.as_bytes())
               .collect();
           let mut reachable = vec![false; source.len() + 1];
           reachable[0] = true;

           for start in 0..source.len() {
               if !reachable[start] {
                   continue;
               }
               for word in &words {
                   let end = start + word.len();
                   if end <= source.len()
                       && &source[start..end] == *word
                   {
                       reachable[end] = true;
                   }
               }
           }
           reachable[source.len()]
       }
   }

Go
~~

.. code-block:: go

   import "strings"

   func wordBreak(s string, wordDict []string) bool {
       reachable := make([]bool, len(s)+1)
       reachable[0] = true

       for start := 0; start < len(s); start++ {
           if !reachable[start] {
               continue
           }
           for _, word := range wordDict {
               end := start + len(word)
               if end <= len(s) &&
                   strings.HasPrefix(s[start:], word) {
                   reachable[end] = true
               }
           }
       }
       return reachable[len(s)]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function wordBreak(s: string, wordDict: string[]): boolean {
       const reachable = new Array<boolean>(s.length + 1).fill(false);
       reachable[0] = true;

       for (let start = 0; start < s.length; start += 1) {
           if (!reachable[start]) continue;
           for (const word of wordDict) {
               const end = start + word.length;
               if (end <= s.length && s.startsWith(word, start)) {
                   reachable[end] = true;
               }
           }
       }
       return reachable[s.length];
   }

C#
~~

.. code-block:: csharp

   using System;
   using System.Collections.Generic;

   public class Solution {
       public bool WordBreak(string s, IList<string> wordDict) {
           bool[] reachable = new bool[s.Length + 1];
           reachable[0] = true;

           for (int start = 0; start < s.Length; ++start) {
               if (!reachable[start]) continue;
               foreach (string word in wordDict) {
                   int end = start + word.Length;
                   if (end <= s.Length &&
                       string.CompareOrdinal(
                           s, start, word, 0, word.Length
                       ) == 0) {
                       reachable[end] = true;
                   }
               }
           }
           return reachable[s.Length];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function word_break(
       s::String,
       word_dict::Vector{String},
   )::Bool
       source = codeunits(s)
       words = [codeunits(word) for word in word_dict]
       n = length(source)
       reachable = falses(n + 1)
       reachable[1] = true

       for start0 in 0:(n - 1)
           reachable[start0 + 1] || continue
           for word in words
               length_word = length(word)
               end0 = start0 + length_word
               end0 <= n || continue

               same = true
               for offset in 1:length_word
                   if source[start0 + offset] != word[offset]
                       same = false
                       break
                   end
               end
               same && (reachable[end0 + 1] = true)
           end
       end
       return reachable[n + 1]
   end

R
~

.. code-block:: r

   word_break <- function(s, word_dict) {
     n <- nchar(s, type = "bytes")
     reachable <- rep(FALSE, n + 1L)
     reachable[1L] <- TRUE

     for (start0 in seq.int(0L, n - 1L)) {
       if (!reachable[start0 + 1L]) next
       for (word in word_dict) {
         word_length <- nchar(word, type = "bytes")
         end0 <- start0 + word_length
         if (end0 <= n &&
             substr(s, start0 + 1L, end0) == word) {
           reachable[end0 + 1L] <- TRUE
         }
       }
     }
     reachable[n + 1L]
   }

关键边界
--------

* 整个字符串本身就是一个字典词；
* 同一个字典词允许重复使用；
* 多种切分同时存在时只需返回真；
* 某个前缀可切分但剩余后缀不可切分时必须返回假；
* 字典词非空，因此每次状态传播都会严格向右推进。

验证
----

运行三个官方示例，并补充单词重复使用、整串命中和只有前缀可达的边界；Python 结果通过，C++ 严格编译并
运行相同样例。其余语言完成接口、索引、字节边界与空状态静态检查。未执行大规模随机对拍。

最小自检
--------

#. ``reachable[i]`` 精确表示什么？
#. 为什么只能从已经可达的 ``start`` 继续传播？
#. 如何证明任意合法切分的最后一个单词一定会被算法检查到？
