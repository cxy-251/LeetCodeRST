0127. Word Ladder
=================

题目信息
--------

:题号: 0127
:难度: Hard
:主题: 图、广度优先搜索、哈希集合、字符串
:原题: `LeetCode 0127 <https://leetcode.com/problems/word-ladder/>`_
:访问状态: Available
:教学重点: BFS 分层、入队即标记、最短变换长度

题目重述
--------

给定 ``beginWord``、``endWord`` 和 ``wordList``。每次只能修改一个字符，修改后的单词必须在列表中。
返回最短变换序列包含的单词数量；无法到达时返回 ``0``。起点可以不在列表中，终点必须在列表中，
输入只读。

.. code-block:: text

   hit -> hot -> dot -> dog -> cog
   最短序列包含 5 个单词，所以返回 5。

算法
----

把单词视为图节点，恰好相差一个字符的两个单词之间有边。BFS 从起点按层扩展：

#. 将列表放入 ``unused``；
#. 终点不在集合中时返回 ``0``；
#. 队列初始只有起点，``steps = 1``；
#. 对每个位置尝试 ``a`` 到 ``z``；
#. 首次生成终点时返回 ``steps + 1``；
#. 其他未访问候选在入队时立即从 ``unused`` 删除。

入队即删除很重要：BFS 首次发现节点时已经得到最短距离，同层其他父节点再次发现它不会更短。
若等到出队才删除，队列会积累重复节点。

正确性
~~~~~~

BFS 按距离递增处理节点，首次生成终点时得到的层数最小。每个未访问候选第一次被发现时入队，
所以不会遗漏任何可达节点；之后再次发现只能来自相同或更深层，删除安全。每个列表单词至多入队一次，
算法必然终止。

复杂度
~~~~~~

设列表有 ``N`` 个单词，单词长度为 ``L``。哈希集合版本尝试 ``26L`` 个候选，
构造候选通常需要 ``O(L)``，总时间 ``O(26NL^2)``，空间 ``O(NL)``。
C 版本直接扫描未访问列表，时间 ``O(N^2L)``，空间 ``O(N)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>
   #include <string.h>

   static bool one_diff(const char *a, const char *b) {
       int diff = 0;
       for (size_t i = 0; a[i] != '\0'; ++i) {
           diff += a[i] != b[i];
           if (diff > 1) return false;
       }
       return diff == 1;
   }

   int ladderLength(char *beginWord, char *endWord,
                    char **wordList, int wordListSize) {
       int *used = calloc((size_t)wordListSize, sizeof(*used));
       char **queue = malloc((size_t)(wordListSize + 1) * sizeof(*queue));
       if (used == NULL || queue == NULL) {
           free(used);
           free(queue);
           return 0;
       }

       bool has_end = false;
       for (int i = 0; i < wordListSize; ++i) {
           has_end = has_end || strcmp(wordList[i], endWord) == 0;
           if (strcmp(wordList[i], beginWord) == 0) used[i] = 1;
       }
       if (!has_end) {
           free(used);
           free(queue);
           return 0;
       }

       int head = 0, tail = 0, steps = 1;
       queue[tail++] = beginWord;
       while (head < tail) {
           int level_end = tail;
           while (head < level_end) {
               char *current = queue[head++];
               for (int i = 0; i < wordListSize; ++i) {
                   if (used[i] || !one_diff(current, wordList[i])) continue;
                   if (strcmp(wordList[i], endWord) == 0) {
                       free(used);
                       free(queue);
                       return steps + 1;
                   }
                   used[i] = 1;
                   queue[tail++] = wordList[i];
               }
           }
           ++steps;
       }
       free(used);
       free(queue);
       return 0;
   }

C++
~~~

.. code-block:: cpp

   #include <queue>
   #include <string>
   #include <unordered_set>
   #include <vector>

   class Solution {
   public:
       int ladderLength(std::string beginWord, std::string endWord,
                        std::vector<std::string>& wordList) {
           std::unordered_set<std::string> unused(wordList.begin(), wordList.end());
           if (!unused.contains(endWord)) return 0;

           std::queue<std::string> queue;
           queue.push(beginWord);
           int steps = 1;
           while (!queue.empty()) {
               int size = static_cast<int>(queue.size());
               while (size-- > 0) {
                   std::string word = queue.front();
                   queue.pop();
                   for (std::size_t i = 0; i < word.size(); ++i) {
                       char original = word[i];
                       for (char ch = 'a'; ch <= 'z'; ++ch) {
                           if (ch == original) continue;
                           word[i] = ch;
                           if (word == endWord) return steps + 1;
                           if (unused.erase(word)) queue.push(word);
                       }
                       word[i] = original;
                   }
               }
               ++steps;
           }
           return 0;
       }
   };

Python
~~~~~~

.. code-block:: python

   from collections import deque

   class Solution:
       def ladderLength(
           self, beginWord: str, endWord: str, wordList: list[str]
       ) -> int:
           unused = set(wordList)
           if endWord not in unused:
               return 0

           queue = deque([beginWord])
           steps = 1
           while queue:
               for _ in range(len(queue)):
                   chars = list(queue.popleft())
                   for index, original in enumerate(chars):
                       for code in range(97, 123):
                           ch = chr(code)
                           if ch == original:
                               continue
                           chars[index] = ch
                           candidate = "".join(chars)
                           if candidate == endWord:
                               return steps + 1
                           if candidate in unused:
                               unused.remove(candidate)
                               queue.append(candidate)
                       chars[index] = original
               steps += 1
           return 0

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.HashSet;
   import java.util.List;
   import java.util.Queue;
   import java.util.Set;

   class Solution {
       public int ladderLength(
           String beginWord, String endWord, List<String> wordList
       ) {
           Set<String> unused = new HashSet<>(wordList);
           if (!unused.contains(endWord)) return 0;

           Queue<String> queue = new ArrayDeque<>();
           queue.add(beginWord);
           int steps = 1;
           while (!queue.isEmpty()) {
               int size = queue.size();
               while (size-- > 0) {
                   char[] chars = queue.remove().toCharArray();
                   for (int i = 0; i < chars.length; ++i) {
                       char original = chars[i];
                       for (char ch = 'a'; ch <= 'z'; ++ch) {
                           if (ch == original) continue;
                           chars[i] = ch;
                           String candidate = new String(chars);
                           if (candidate.equals(endWord)) return steps + 1;
                           if (unused.remove(candidate)) queue.add(candidate);
                       }
                       chars[i] = original;
                   }
               }
               ++steps;
           }
           return 0;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::collections::{HashSet, VecDeque};

   impl Solution {
       pub fn ladder_length(
           begin_word: String,
           end_word: String,
           word_list: Vec<String>,
       ) -> i32 {
           let mut unused: HashSet<String> = word_list.into_iter().collect();
           if !unused.contains(&end_word) {
               return 0;
           }

           let mut queue = VecDeque::from([begin_word]);
           let mut steps = 1;
           while !queue.is_empty() {
               let size = queue.len();
               for _ in 0..size {
                   let mut bytes = queue.pop_front().unwrap().into_bytes();
                   for i in 0..bytes.len() {
                       let original = bytes[i];
                       for ch in b'a'..=b'z' {
                           if ch == original {
                               continue;
                           }
                           bytes[i] = ch;
                           let candidate = String::from_utf8(bytes.clone()).unwrap();
                           if candidate == end_word {
                               return steps + 1;
                           }
                           if unused.remove(&candidate) {
                               queue.push_back(candidate);
                           }
                       }
                       bytes[i] = original;
                   }
               }
               steps += 1;
           }
           0
       }
   }

Go
~~

.. code-block:: go

   func ladderLength(beginWord string, endWord string, wordList []string) int {
       unused := make(map[string]struct{}, len(wordList))
       for _, word := range wordList {
           unused[word] = struct{}{}
       }
       if _, ok := unused[endWord]; !ok {
           return 0
       }

       queue := []string{beginWord}
       steps := 1
       for len(queue) > 0 {
           size := len(queue)
           for i := 0; i < size; i++ {
               chars := []byte(queue[0])
               queue = queue[1:]
               for index, original := range chars {
                   for ch := byte('a'); ch <= byte('z'); ch++ {
                       if ch == original {
                           continue
                       }
                       chars[index] = ch
                       candidate := string(chars)
                       if candidate == endWord {
                           return steps + 1
                       }
                       if _, ok := unused[candidate]; ok {
                           delete(unused, candidate)
                           queue = append(queue, candidate)
                       }
                   }
                   chars[index] = original
               }
           }
           steps++
       }
       return 0
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function ladderLength(
       beginWord: string,
       endWord: string,
       wordList: string[],
   ): number {
       const unused = new Set(wordList);
       if (!unused.has(endWord)) return 0;

       const queue = [beginWord];
       let head = 0;
       let steps = 1;
       while (head < queue.length) {
           const levelEnd = queue.length;
           while (head < levelEnd) {
               const chars = queue[head++].split("");
               for (let index = 0; index < chars.length; index++) {
                   const original = chars[index];
                   for (let code = 97; code <= 122; code++) {
                       const ch = String.fromCharCode(code);
                       if (ch === original) continue;
                       chars[index] = ch;
                       const candidate = chars.join("");
                       if (candidate === endWord) return steps + 1;
                       if (unused.delete(candidate)) queue.push(candidate);
                   }
                   chars[index] = original;
               }
           }
           steps++;
       }
       return 0;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int LadderLength(
           string beginWord, string endWord, IList<string> wordList
       ) {
           var unused = new HashSet<string>(wordList);
           if (!unused.Contains(endWord)) return 0;

           var queue = new Queue<string>();
           queue.Enqueue(beginWord);
           int steps = 1;
           while (queue.Count > 0) {
               int size = queue.Count;
               while (size-- > 0) {
                   char[] chars = queue.Dequeue().ToCharArray();
                   for (int i = 0; i < chars.Length; ++i) {
                       char original = chars[i];
                       for (char ch = 'a'; ch <= 'z'; ++ch) {
                           if (ch == original) continue;
                           chars[i] = ch;
                           string candidate = new string(chars);
                           if (candidate == endWord) return steps + 1;
                           if (unused.Remove(candidate)) queue.Enqueue(candidate);
                       }
                       chars[i] = original;
                   }
               }
               ++steps;
           }
           return 0;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function ladder_length(
       begin_word::String,
       end_word::String,
       word_list::Vector{String},
   )::Int
       unused = Set(word_list)
       end_word in unused || return 0

       queue = String[begin_word]
       head = 1
       steps = 1
       while head <= length(queue)
           level_end = length(queue)
           while head <= level_end
               bytes = collect(codeunits(queue[head]))
               head += 1
               for index in eachindex(bytes)
                   original = bytes[index]
                   for ch in UInt8('a'):UInt8('z')
                       ch == original && continue
                       bytes[index] = ch
                       candidate = String(copy(bytes))
                       candidate == end_word && return steps + 1
                       if candidate in unused
                           delete!(unused, candidate)
                           push!(queue, candidate)
                       end
                   end
                   bytes[index] = original
               end
           end
           steps += 1
       end
       return 0
   end

R
~

.. code-block:: r

   ladder_length <- function(begin_word, end_word, word_list) {
     unused <- new.env(hash = TRUE, parent = emptyenv())
     for (word in word_list) assign(word, TRUE, envir = unused)
     if (!exists(end_word, envir = unused, inherits = FALSE)) return(0L)

     queue <- begin_word
     head <- 1L
     steps <- 1L
     while (head <= length(queue)) {
       level_end <- length(queue)
       while (head <= level_end) {
         chars <- strsplit(queue[[head]], "", fixed = TRUE)[[1L]]
         head <- head + 1L
         for (index in seq_along(chars)) {
           original <- chars[[index]]
           for (candidate_char in letters) {
             if (candidate_char == original) next
             chars[[index]] <- candidate_char
             candidate <- paste0(chars, collapse = "")
             if (candidate == end_word) return(steps + 1L)
             if (exists(candidate, envir = unused, inherits = FALSE)) {
               rm(list = candidate, envir = unused)
               queue <- c(queue, candidate)
             }
           }
           chars[[index]] <- original
         }
       }
       steps <- steps + 1L
     }
     return(0L)
   }

关键边界
--------

* 终点不在列表中时返回 ``0``；
* 起点不必加入集合；
* 跳过原字符；
* 候选入队时立即删除；
* 返回的是单词数量，所以初始 ``steps`` 为 ``1``；
* 本题只求长度，不保存 0126 的多前驱 DAG。

知识更新
--------

0126 需要保留同层多前驱以枚举全部最短路径；0127 只求最短长度，节点首次入队后即可永久标记访问。

最小自检
--------

#. 为什么首次发现终点可以立即返回？
#. 为什么应在入队时删除候选？
#. 初始 ``steps`` 为什么是 ``1``？
