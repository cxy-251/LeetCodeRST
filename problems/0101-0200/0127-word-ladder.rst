0127. Word Ladder
=================

题目信息
--------

:题号: 0127
:难度: Hard
:主题: 图、广度优先搜索、哈希集合、字符串
:原题: `LeetCode 0127 <https://leetcode.com/problems/word-ladder/>`_
:访问状态: Available
:教学重点: 隐式图建模、BFS 分层、邻居枚举、入队即标记

题目重述
--------

给定起始单词 ``beginWord``、目标单词 ``endWord`` 和字典 ``wordList``。一次变换只能修改一个字符，
变换后的单词必须存在于字典中。返回最短变换序列包含的单词数量；不存在合法序列时返回 ``0``。

本文采用以下契约：

* ``beginWord``、``endWord`` 和字典单词长度相同；
* 字符只包含小写英文字母；
* ``beginWord != endWord``；
* 字典单词互不重复，``beginWord`` 可以不在字典中；
* ``endWord`` 不在字典中时必定无解；
* 输入字符串和字典只读，返回值是序列中的单词数，不是边数。

自建示例
--------

可达示例
~~~~~~~~

.. code-block:: text

   beginWord = "hit"
   endWord   = "cog"
   wordList  = ["hot", "dot", "dog", "lot", "log", "cog"]

   hit -> hot -> dot -> dog -> cog
   输出：5

同层重复发现
~~~~~~~~~~~~

.. code-block:: text

   beginWord = "aaa"
   endWord   = "bbb"
   wordList  = ["aab", "aba", "abb", "bab", "bbb"]

``abb`` 可能被同一 BFS 层中的多个单词生成。它第一次入队时已经得到最短距离，后续发现不应再次入队。

终点缺失
~~~~~~~~

.. code-block:: text

   beginWord = "hit"
   endWord   = "cog"
   wordList  = ["hot", "dot", "dog"]
   输出：0

问题抽象
--------

把每个合法单词视为图节点。两个单词恰好有一个位置不同，当且仅当它们之间存在一条无权边。题目要求的
最短变换序列就是从 ``beginWord`` 到 ``endWord`` 的最短路径，返回值等于最短边数加一。

图不需要显式建出全部边。对于当前单词，逐个位置尝试 ``a`` 到 ``z``，即可枚举所有可能的一步邻居；只有
仍在未访问字典中的候选才进入队列。这种做法把邻接关系按需生成，避免预先比较所有单词对。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 单向 BFS + 字符替换
     - ``O(NL²)``
     - ``O(NL)``
     - 主解法；按需生成隐式图邻居
   * - 双向 BFS
     - 同阶，通常访问更少节点
     - ``O(NL)``
     - 常数更优，状态与证明更复杂
   * - 预建通配模式图
     - ``O(NL²)``
     - ``O(NL²)``
     - 用额外索引加速邻居查询
   * - 逐个扫描未访问单词
     - ``O(N²L)``
     - ``O(N)``
     - C 适配器；避免实现通用字符串哈希表

这里 ``N`` 是字典单词数，``L`` 是单词长度。主教学模型使用字符替换 BFS；C 版本采用逐词扫描邻居，
仍执行同一个 BFS 状态机，但邻居发现方式和复杂度不同，因此单独说明。

主解法：隐式图上的分层 BFS
--------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

维护：

* ``queue``：已经发现、等待按层处理的单词；
* ``unused``：尚未发现的字典单词；
* ``steps``：当前队首所在层对应的序列单词数，起点层为 ``1``；
* ``level_end`` 或当前层大小：冻结本轮边界，避免把新入队节点误当成本层节点。

每层开始时保持以下不变量：

#. 队列当前层中的每个单词，从起点到它的最短序列长度都等于 ``steps``；
#. ``unused`` 中只包含从未入队的字典单词；
#. 已经离开 ``unused`` 的单词都已获得唯一确定的最短距离；
#. 输入字典和字符串没有被修改。

若 ``beginWord`` 本身也出现在字典中，初始化时必须先把它从 ``unused`` 删除。否则某个邻居可能再次生成
起点，使起点被二次入队，破坏“``unused`` 只包含从未发现节点”的不变量。

邻居枚举为何完整
~~~~~~~~~~~~~~~~

若两个长度为 ``L`` 的单词恰好相差一个字符，那么一定存在唯一位置 ``i``，把当前单词的第 ``i`` 个字符
替换成目标字符后就得到该邻居。算法对每个位置尝试全部 26 个小写字母，因此每个真实邻居都会被生成；
跳过原字符只排除了没有发生变化的字符串。

入队即标记
~~~~~~~~~~

BFS 第一次发现节点时，发现它的父节点位于当前最浅层，所以得到的距离已经最短。候选入队后立即从
``unused`` 删除，既不会损失更短路径，也能阻止同层或更深层的重复入队。本题只求长度，不需要像 0126
那样保留同层多个前驱。

正确性依据
~~~~~~~~~~

**层距离正确。** 起点层的序列长度为 ``1``。假设当前层节点的最短序列长度均为 ``steps``，它们生成的
未访问邻居都通过一条边到达，因此这些邻居存在长度 ``steps + 1`` 的序列。任何更短序列都应在更早层发现
该邻居，与它仍在 ``unused`` 矛盾，所以新邻居的最短长度恰为 ``steps + 1``。

**邻居无遗漏。** 字符替换枚举覆盖当前节点的全部一字符差邻居；C 适配器逐一比较全部未访问单词，
``one_diff`` 同样准确判断该邻接关系。因此每条从起点出发的合法边都会在其源节点出队时被考虑。

**首次到达终点最优。** BFS 按最短距离递增处理节点。首次生成 ``endWord`` 时，它来自当前最浅层，
根据层距离不变量，返回的 ``steps + 1`` 不大于任何其他可行序列。

**无解返回正确。** 若队列耗尽仍未生成终点，则所有从起点可达的字典节点都已被处理；由邻居无遗漏，
不存在尚未探索的合法路径，返回 ``0``。

**终止性。** 每个字典单词最多入队一次，队列处理次数有限；每次邻居枚举也遍历有限位置和字符，算法必然终止。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 哈希集合版本中，每个单词最多出队一次；每次尝试 ``26L`` 个候选；构造或哈希长度为 ``L`` 的候选通常为
  ``O(L)``，总期望时间 ``O(NL²)``；
* 哈希集合、队列和字符串载荷共占 ``O(NL)``；单个可变字符缓冲为 ``O(L)``；
* C 版本对每个出队单词扫描至多 ``N`` 个未访问单词，每次比较 ``O(L)``，最坏时间 ``O(N²L)``，
  ``used`` 与队列额外空间 ``O(N)``；
* Rust、Go、TypeScript、Julia 和 R 的候选构造会物化新字符串，成本已计入 ``O(NL²)``；
* R 使用 ``queue <- c(queue, candidate)`` 扩展字符向量，最坏还会累计复制 ``O(N²)`` 个队列元素；
* C++ 代码只使用 C++17 API，以 ``find`` 代替 C++20 的 ``contains``；
* 所有字节级实现都依赖题目限定的小写 ASCII 字符域。

核心语言实现
------------

C
~

C 版本使用逐词扫描发现邻居。它与主解法共享 BFS 分层和入队即标记语义，只改变邻居索引方式。

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>
   #include <string.h>

   static bool one_diff(const char *first, const char *second) {
       int differences = 0;
       for (size_t index = 0; first[index] != '\0'; ++index) {
           if (first[index] != second[index] && ++differences > 1) {
               return false;
           }
       }
       return differences == 1;
   }

   int ladderLength(
       char *beginWord,
       char *endWord,
       char **wordList,
       int wordListSize
   ) {
       bool has_end = false;
       unsigned char *used = calloc((size_t)wordListSize, 1U);
       char **queue = malloc(
           (size_t)(wordListSize + 1) * sizeof(*queue)
       );
       if (used == NULL || queue == NULL) {
           free(used);
           free(queue);
           return 0;
       }

       for (int index = 0; index < wordListSize; ++index) {
           if (strcmp(wordList[index], endWord) == 0) {
               has_end = true;
           }
           if (strcmp(wordList[index], beginWord) == 0) {
               used[index] = 1U;
           }
       }
       if (!has_end) {
           free(used);
           free(queue);
           return 0;
       }

       int head = 0;
       int tail = 0;
       int steps = 1;
       queue[tail++] = beginWord;

       while (head < tail) {
           int level_end = tail;
           while (head < level_end) {
               char *current = queue[head++];
               for (int index = 0; index < wordListSize; ++index) {
                   if (used[index] ||
                       !one_diff(current, wordList[index])) {
                       continue;
                   }
                   if (strcmp(wordList[index], endWord) == 0) {
                       free(used);
                       free(queue);
                       return steps + 1;
                   }
                   used[index] = 1U;
                   queue[tail++] = wordList[index];
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
       int ladderLength(
           std::string beginWord,
           std::string endWord,
           std::vector<std::string>& wordList
       ) {
           std::unordered_set<std::string> unused(
               wordList.begin(),
               wordList.end()
           );
           if (unused.find(endWord) == unused.end()) {
               return 0;
           }
           unused.erase(beginWord);

           std::queue<std::string> queue;
           queue.push(beginWord);
           int steps = 1;

           while (!queue.empty()) {
               int level_size = static_cast<int>(queue.size());
               while (level_size-- > 0) {
                   std::string word = queue.front();
                   queue.pop();

                   for (std::size_t index = 0;
                        index < word.size();
                        ++index) {
                       char original = word[index];
                       for (char character = 'a';
                            character <= 'z';
                            ++character) {
                           if (character == original) {
                               continue;
                           }
                           word[index] = character;
                           if (word == endWord) {
                               return steps + 1;
                           }
                           if (unused.erase(word) != 0U) {
                               queue.push(word);
                           }
                       }
                       word[index] = original;
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
           self,
           beginWord: str,
           endWord: str,
           wordList: list[str],
       ) -> int:
           unused = set(wordList)
           if endWord not in unused:
               return 0
           unused.discard(beginWord)

           queue = deque([beginWord])
           steps = 1
           while queue:
               for _ in range(len(queue)):
                   characters = list(queue.popleft())
                   for index, original in enumerate(characters):
                       for code in range(ord("a"), ord("z") + 1):
                           character = chr(code)
                           if character == original:
                               continue
                           characters[index] = character
                           candidate = "".join(characters)
                           if candidate == endWord:
                               return steps + 1
                           if candidate in unused:
                               unused.remove(candidate)
                               queue.append(candidate)
                       characters[index] = original
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
           String beginWord,
           String endWord,
           List<String> wordList
       ) {
           Set<String> unused = new HashSet<>(wordList);
           if (!unused.contains(endWord)) {
               return 0;
           }
           unused.remove(beginWord);

           Queue<String> queue = new ArrayDeque<>();
           queue.add(beginWord);
           int steps = 1;

           while (!queue.isEmpty()) {
               int levelSize = queue.size();
               while (levelSize-- > 0) {
                   char[] characters = queue.remove().toCharArray();
                   for (int index = 0;
                        index < characters.length;
                        ++index) {
                       char original = characters[index];
                       for (char character = 'a';
                            character <= 'z';
                            ++character) {
                           if (character == original) {
                               continue;
                           }
                           characters[index] = character;
                           String candidate = new String(characters);
                           if (candidate.equals(endWord)) {
                               return steps + 1;
                           }
                           if (unused.remove(candidate)) {
                               queue.add(candidate);
                           }
                       }
                       characters[index] = original;
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
           let mut unused: HashSet<String> =
               word_list.into_iter().collect();
           if !unused.contains(&end_word) {
               return 0;
           }
           unused.remove(&begin_word);

           let mut queue = VecDeque::from([begin_word]);
           let mut steps = 1;
           while !queue.is_empty() {
               let level_size = queue.len();
               for _ in 0..level_size {
                   let mut bytes = queue.pop_front().unwrap().into_bytes();
                   for index in 0..bytes.len() {
                       let original = bytes[index];
                       for character in b'a'..=b'z' {
                           if character == original {
                               continue;
                           }
                           bytes[index] = character;
                           let candidate = String::from_utf8(
                               bytes.clone()
                           ).unwrap();
                           if candidate == end_word {
                               return steps + 1;
                           }
                           if unused.remove(&candidate) {
                               queue.push_back(candidate);
                           }
                       }
                       bytes[index] = original;
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

   func ladderLength(
       beginWord string,
       endWord string,
       wordList []string,
   ) int {
       unused := make(map[string]struct{}, len(wordList))
       for _, word := range wordList {
           unused[word] = struct{}{}
       }
       if _, exists := unused[endWord]; !exists {
           return 0
       }
       delete(unused, beginWord)

       queue := []string{beginWord}
       steps := 1
       for len(queue) > 0 {
           levelSize := len(queue)
           for count := 0; count < levelSize; count++ {
               characters := []byte(queue[0])
               queue = queue[1:]
               for index, original := range characters {
                   for character := byte('a');
                       character <= byte('z');
                       character++ {
                       if character == original {
                           continue
                       }
                       characters[index] = character
                       candidate := string(characters)
                       if candidate == endWord {
                           return steps + 1
                       }
                       if _, exists := unused[candidate]; exists {
                           delete(unused, candidate)
                           queue = append(queue, candidate)
                       }
                   }
                   characters[index] = original
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
       const unused = new Set<string>(wordList);
       if (!unused.has(endWord)) {
           return 0;
       }
       unused.delete(beginWord);

       const queue: string[] = [beginWord];
       let head = 0;
       let steps = 1;
       while (head < queue.length) {
           const levelEnd = queue.length;
           while (head < levelEnd) {
               const characters = queue[head++].split("");
               for (let index = 0;
                   index < characters.length;
                   index += 1) {
                   const original = characters[index];
                   for (let code = 97; code <= 122; code += 1) {
                       const character = String.fromCharCode(code);
                       if (character === original) {
                           continue;
                       }
                       characters[index] = character;
                       const candidate = characters.join("");
                       if (candidate === endWord) {
                           return steps + 1;
                       }
                       if (unused.delete(candidate)) {
                           queue.push(candidate);
                       }
                   }
                   characters[index] = original;
               }
           }
           steps += 1;
       }
       return 0;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public int LadderLength(
           string beginWord,
           string endWord,
           IList<string> wordList
       ) {
           var unused = new HashSet<string>(wordList);
           if (!unused.Contains(endWord)) {
               return 0;
           }
           unused.Remove(beginWord);

           var queue = new Queue<string>();
           queue.Enqueue(beginWord);
           int steps = 1;
           while (queue.Count > 0) {
               int levelSize = queue.Count;
               while (levelSize-- > 0) {
                   char[] characters = queue.Dequeue().ToCharArray();
                   for (int index = 0;
                        index < characters.Length;
                        ++index) {
                       char original = characters[index];
                       for (char character = 'a';
                            character <= 'z';
                            ++character) {
                           if (character == original) {
                               continue;
                           }
                           characters[index] = character;
                           string candidate = new string(characters);
                           if (candidate == endWord) {
                               return steps + 1;
                           }
                           if (unused.Remove(candidate)) {
                               queue.Enqueue(candidate);
                           }
                       }
                       characters[index] = original;
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
       delete!(unused, begin_word)

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
                   for character in UInt8('a'):UInt8('z')
                       character == original && continue
                       bytes[index] = character
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
     for (word in word_list) {
       assign(word, TRUE, envir = unused)
     }
     if (!exists(end_word, envir = unused, inherits = FALSE)) {
       return(0L)
     }
     if (exists(begin_word, envir = unused, inherits = FALSE)) {
       rm(list = begin_word, envir = unused)
     }

     queue <- begin_word
     head <- 1L
     steps <- 1L
     while (head <= length(queue)) {
       level_end <- length(queue)
       while (head <= level_end) {
         characters <- strsplit(
           queue[[head]],
           "",
           fixed = TRUE
         )[[1L]]
         head <- head + 1L

         for (index in seq_along(characters)) {
           original <- characters[[index]]
           for (character in letters) {
             if (character == original) next
             characters[[index]] <- character
             candidate <- paste0(characters, collapse = "")
             if (candidate == end_word) {
               return(steps + 1L)
             }
             if (exists(
               candidate,
               envir = unused,
               inherits = FALSE
             )) {
               rm(list = candidate, envir = unused)
               queue <- c(queue, candidate)
             }
           }
           characters[[index]] <- original
         }
       }
       steps <- steps + 1L
     }
     0L
   }

验证计划与证据
--------------

本次返工重新运行终点缺失、同层重复发现、起点位于字典、最短路径与较长路径竞争、单字符单词和无解图。
Python 主实现与显式建图 BFS 基准完成 500 组随机字典对拍，结果一致。C++ 主实现使用 C++17 严格警告编译
并运行代表案例。C、Java、Go、TypeScript 完成接口和层边界静态复核；Rust、C#、Julia、R 完成所有权、
索引、ASCII 与队列语义静态检查。未声称所有语言均已实际运行。

关键边界
--------

* ``endWord`` 不在字典中直接返回 ``0``；
* ``beginWord`` 不需要在字典中；若它在字典中，初始化时必须从未访问集合移除；
* 返回序列单词数，所以起点层是 ``1``；
* 必须跳过原字符，否则会生成当前单词自身；
* 候选必须在入队时标记，不能等到出队；
* 字符串按 ASCII 字节修改依赖小写英文字母契约；
* C 版本的分配失败与合法无解都只能返回 ``0``，这是平台签名无法区分的资源限制。

易错点
------

* 把返回值写成边数，导致所有可达答案少一；
* ``beginWord`` 位于字典时没有先移除，导致起点可能被二次入队；
* 只比较同一位置的字符，没有验证恰好一个位置不同；
* 生成候选后未恢复原字符，污染下一个位置的枚举；
* 访问标记延迟到出队，造成大量重复状态；
* 把 0126 的“同层多前驱”规则机械搬到本题，本题只求长度，不需要保存全部前驱。

本题新增知识
------------

* 隐式图：不预建边，通过状态变换按需生成邻居；
* BFS 层号与最短路径边数、序列节点数之间的转换；
* 入队即标记在只求最短距离时的安全性。

本题强化知识
------------

* 哈希集合同时承担成员查询和未访问集合；
* ASCII 字符缓冲的修改与恢复；
* 不同邻居索引方式会改变复杂度，但不改变 BFS 状态机。

关联题目
--------

* `0126. Word Ladder II <0126-word-ladder-ii.rst>`_：需要保留同层多个前驱，才能枚举全部最短路径；
* `0130. Surrounded Regions <0130-surrounded-regions.rst>`_：显式网格上的多源 BFS 与入队即标记；
* `0133. Clone Graph <0133-clone-graph.rst>`_：显式图节点身份与访问映射。

最小自检
--------

#. 为什么 ``steps`` 从 ``1`` 开始，而不是从 ``0`` 开始？
#. 为什么候选第一次入队后可以立即从 ``unused`` 删除？
#. ``beginWord`` 位于字典时为什么必须在初始化阶段删除？
#. C 版本为什么是 ``O(N²L)``，而其他哈希版本通常是 ``O(NL²)``？

答案要点
~~~~~~~~

#. 返回的是序列包含的单词数，起点本身已经占一个位置；
#. BFS 第一次发现节点时已经获得最短距离，后续同层或更深层发现不会更短；
#. 起点已经发现并进入队列，若仍留在 ``unused``，邻居可能再次生成它并破坏访问集合语义；
#. C 对每个出队节点扫描全部未访问单词并逐字符比较，哈希版本只枚举 ``26L`` 个候选并做集合查询。
