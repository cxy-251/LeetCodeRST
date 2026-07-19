0139. Word Break
================

题目信息
--------

:题号: 0139
:难度: Medium
:主题: 动态规划、位置图可达性、字符串匹配
:原题: `LeetCode 0139 <https://leetcode.com/problems/word-break/>`_
:访问状态: Available
:教学重点: 前缀状态、可达性传播、完整覆盖与字符坐标

精确契约
--------

给定一个非空字符串 ``s`` 和一个非空字典 ``wordDict``，判断能否把 ``s`` **完整** 切分为一个或多个
字典词。字典词都非空且互不重复，同一个词可以在切分中重复使用；只需返回布尔值，不需要返回具体切法。

题目保证 ``s`` 的长度不超过 300，字典至多有 1000 个词，每个词的长度不超过 20；输入只含小写英文字母。
这个字符域前提十分重要：十种实现虽然分别按字节、UTF-16 代码单元或宿主字符串坐标工作，但在本题输入上
这些坐标都与英文字母位置一致。代码不能据此被泛化成任意 Unicode 字符串切分器。

函数不应修改 ``s`` 或字典。C++ 平台接口按值接收 ``s``；Rust 接口消费两个拥有所有权的输入；C 在分配
失败时只能通过既有布尔返回值返回 ``false``，无法区分“无合法切分”和“资源不足”。

自建示例
--------

取 ``s = "mintmint"``，``wordDict = ["mint"]``。位置 0 匹配 ``"mint"`` 后到达位置 4，位置 4
又可以复用同一个词到达位置 8，所以答案为 ``true``。这说明字典不是只能消费一次的单词清单。

再取 ``s = "applepenx"``，``wordDict = ["apple", "pen"]``。虽然前 8 个字符可以切成
``"apple" + "pen"``，最后的 ``"x"`` 没有合法来源，所以答案为 ``false``。只找到一个可切分前缀
并不足够，目标必须是字符串末端。

问题抽象
--------

把字符串的 ``n + 1`` 个切分位置看成有向图顶点 ``0, 1, ..., n``。若某个字典词恰好等于
``s[start:end]``，就在 ``start`` 到 ``end`` 之间连一条边。由于字典词非空，每条边都严格向右。

题目于是变成：顶点 ``n`` 是否能从顶点 0 到达。没有必要真的建立全部边；只要从已经可达的位置尝试字典词，
就能在比较成功时即时发现下一顶点。

解法选择
--------

直接递归枚举每次选择的字典词会反复求解相同后缀；在大量前缀重叠时，递归树可能指数增长。记忆化搜索可以把
“某个位置能否到达终点”缓存下来，也是合格解法，但需要处理递归栈和各语言的字符串坐标。

本题采用自左向右的前缀动态规划。它只保存一个布尔数组，传播顺序与位置图的拓扑顺序一致，没有递归深度风险，
而且十语言都能用“不物化子串的定点比较”表达同一算法。

状态、转移与不变量
------------------

定义 ``reachable[i]``：前 ``i`` 个字符 ``s[0:i]`` 是否能由若干字典词完整组成。其合法下标为
``0..n``，并令 ``reachable[0] = true``，表示空前缀已经到达。

按 ``start = 0..n-1`` 处理：

#. 若 ``reachable[start]`` 为假，不从这里传播；
#. 否则逐个检查字典词 ``word``；
#. 只有当词长未越过末端，且 ``word`` 与 ``s`` 从 ``start`` 开始的字符完全相同时，才令
   ``reachable[start + len(word)] = true``。

循环不变量是：开始处理位置 ``start`` 时，所有不大于 ``start`` 的位置，其 ``reachable`` 值都准确表示
从 0 的可达性。代码中的布尔数组就是该状态；``start`` 是当前出发顶点，``end`` 是候选边的终点。因为所有边
严格向右，后续更新不会推翻已经处理位置的结论。

正确性证明
----------

**引理一：算法标记的每个位置都有合法切分。** 初始位置 0 对应空前缀。一次新标记只能从某个已经可达的
``start`` 出发，并且只在后续片段等于字典词 ``word`` 时发生。把这个词接在 ``s[0:start]`` 的合法切分后，
就得到 ``s[0:end]`` 的合法切分。因此按标记产生顺序归纳，所有真值都有合法来源，算法不会产生假阳性。

**引理二：每个存在合法切分的位置都会被标记。** 对合法切分所含的单词数归纳。零个词只对应位置 0，初始
已经标记。设某个前缀由 ``k > 0`` 个词组成，最后一个词从 ``start`` 延伸到 ``end``。前 ``k - 1`` 个词
构成 ``s[0:start]``，由归纳假设，``reachable[start]`` 会为真。由于 ``start < end``，算法处理
``start`` 时会检查字典中的最后一个词并标记 ``end``。所以合法可达位置不会遗漏。

由引理一和引理二，``reachable[n]`` 为真当且仅当整个 ``s`` 存在合法切分，返回值正确。外层循环有限，
字典有限，每次传播又严格向右，因此算法终止。

复杂度
------

设 ``n`` 为 ``s`` 的长度，字典共有 ``m`` 个词，全部词长之和为 ``C``。在最坏情况下，每个位置都可达，
并对全部字典字符做一次定点比较，时间为 ``O(nC)``。布尔状态占 ``O(n)`` 核心额外空间。

语言适配成本不能被这个核心界隐藏：

* C 预存 ``m`` 个词长，额外空间为 ``O(n + m)``；所有分配都有失败路径；
* C++ 的平台签名按值接收 ``s``，调用边界另有 ``O(n)`` 字符副本；
* Rust 直接借用已拥有字符串的字节，不建立子串；Go 的字符串切片只是共享底层字节的描述符；
* Java、TypeScript 和 C# 在本题中按 UTF-16 代码单元定位，并使用不物化候选子串的比较 API；
* Julia 的 ``codeunits`` 返回字节视图式包装，``words`` 向量保存 ``O(m)`` 个包装对象，不复制全部字符；
* R 的 ``utf8ToInt`` 会把 ``s`` 和所有字典词物化为整数向量，增加 ``O(n + C)`` 时间与空间，但之后的
  匹配不再反复创建 ``substr`` 结果。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>
   #include <string.h>

   bool wordBreak(char *s, char **wordDict, int wordDictSize) {
       size_t n = strlen(s);
       size_t count = (size_t)wordDictSize;
       if (n == SIZE_MAX ||
           count > SIZE_MAX / sizeof(size_t)) {
           return false;
       }

       bool *reachable = calloc(n + 1, sizeof(*reachable));
       size_t *lengths = malloc(count * sizeof(*lengths));
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
               if (length > n - start) {
                   continue;
               }
               size_t end = start + length;
               if (memcmp(s + start, wordDict[index], length) == 0) {
                   reachable[end] = true;
               }
           }
       }

       bool answer = reachable[n];
       free(lengths);
       free(reachable);
       return answer;
   }

返回值为 ``false`` 时，平台接口无法表达它究竟来自不可切分还是分配失败。函数不接管 ``s`` 和字典字符串，
只释放自己建立的数组。

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
                   if (word.size() > s.size() - start) {
                       continue;
                   }
                   std::size_t end = start + word.size();
                   if (s.compare(start, word.size(), word) == 0) {
                       reachable[end] = true;
                   }
               }
           }
           return reachable[s.size()];
       }
   };

``compare`` 在原字符串指定位置比较，不创建 ``substr``。``wordDict`` 被借用且不修改；``s`` 的按值副本来自
平台签名而不是算法状态。

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
                   if len(word) > len(s) - start:
                       continue
                   end = start + len(word)
                   if s.startswith(word, start):
                       reachable[end] = True

           return reachable[len(s)]

``startswith(word, start)`` 直接在给定位置比较，不需要 ``s[start:end]`` 切片。

Java
~~~~

.. code-block:: java

   import java.util.List;

   class Solution {
       public boolean wordBreak(String s, List<String> wordDict) {
           boolean[] reachable = new boolean[s.length() + 1];
           reachable[0] = true;

           for (int start = 0; start < s.length(); ++start) {
               if (!reachable[start]) {
                   continue;
               }
               for (String word : wordDict) {
                   if (word.length() > s.length() - start) {
                       continue;
                   }
                   int end = start + word.length();
                   if (s.startsWith(word, start)) {
                       reachable[end] = true;
                   }
               }
           }
           return reachable[s.length()];
       }
   }

Java 的下标和 ``startsWith`` 都使用 UTF-16 代码单元；小写英文约束使它们与题目字符位置一致。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn word_break(
           s: String,
           word_dict: Vec<String>,
       ) -> bool {
           let source = s.as_bytes();
           let mut reachable = vec![false; source.len() + 1];
           reachable[0] = true;

           for start in 0..source.len() {
               if !reachable[start] {
                   continue;
               }
               for word in &word_dict {
                   let bytes = word.as_bytes();
                   if bytes.len() > source.len() - start {
                       continue;
                   }
                   let end = start + bytes.len();
                   if &source[start..end] == bytes {
                       reachable[end] = true;
                   }
               }
           }
           reachable[source.len()]
       }
   }

接口消费 ``String`` 和 ``Vec<String>``，但循环只借用其中的字节切片；这些切片始终落在仍存活的输入上。

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
               if len(word) > len(s)-start {
                   continue
               }
               end := start + len(word)
               if strings.HasPrefix(s[start:], word) {
                   reachable[end] = true
               }
           }
       }
       return reachable[len(s)]
   }

``s[start:]`` 创建共享原字符串字节的切片描述符，不复制后缀；这里的字节下标依赖小写英文输入。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function wordBreak(s: string, wordDict: string[]): boolean {
       const reachable = new Array<boolean>(s.length + 1).fill(false);
       reachable[0] = true;

       for (let start = 0; start < s.length; start += 1) {
           if (!reachable[start]) continue;
           for (const word of wordDict) {
               if (word.length > s.length - start) continue;
               const end = start + word.length;
               if (s.startsWith(word, start)) {
                   reachable[end] = true;
               }
           }
       }
       return reachable[s.length];
   }

字符串长度和起点是 UTF-16 代码单元坐标；本题上界远低于 ``number`` 的安全整数边界。

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
                   if (word.Length > s.Length - start) continue;
                   int end = start + word.Length;
                   if (string.CompareOrdinal(
                           s, start, word, 0, word.Length
                       ) == 0) {
                       reachable[end] = true;
                   }
               }
           }
           return reachable[s.Length];
       }
   }

长度检查先于 ``CompareOrdinal``，保证比较区间有效；序数比较不会受区域性排序规则影响。

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
               matches_at(source, start0, word) || continue
               end0 = start0 + length(word)
               reachable[end0 + 1] = true
           end
       end
       return reachable[n + 1]
   end

算法位置保留零基 ``start0``，访问 Julia 容器时统一加一。``codeunits`` 是包装视图而不是字符数组副本；
``0:(n - 1)`` 在题目保证 ``n >= 1`` 时非空且递增。

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

   word_break <- function(s, word_dict) {
     source <- utf8ToInt(s)
     words <- lapply(word_dict, utf8ToInt)
     n <- length(source)
     reachable <- rep(FALSE, n + 1L)
     reachable[1L] <- TRUE

     for (start0 in seq_len(n) - 1L) {
       if (!reachable[start0 + 1L]) next
       for (word in words) {
         if (!matches_at(source, start0, word)) next
         end0 <- start0 + length(word)
         reachable[end0 + 1L] <- TRUE
       }
     }
     reachable[n + 1L]
   }

这是与平台语义等价的 R 适配器。``utf8ToInt`` 明确物化 Unicode 码点向量；小写英文使该表示与其余实现的
位置边界一致。``seq_len(n) - 1L`` 在非空输入上安全产生 ``0..n-1``。

关键边界与易错点
----------------

* 整个字符串本身就是一个字典词时，应由位置 0 直接传播到 ``n``；
* 同一个词可以从多个可达位置重复匹配，不能把字典词标记为“已使用”；
* 多种切分同时存在时，本题只需保留可达真值，不需要保存全部前驱；
* “某个前缀可达”不等于“整个字符串可达”，只能返回 ``reachable[n]``；
* 只有从可达起点发出的匹配才是合法边，不能仅凭局部子串在字典中就标记终点；
* C/C++ 等无符号长度计算先检查 ``word_length <= n - start``，避免先做可能溢出的加法；
* 代码的字节或 UTF-16 定位只因小写英文约束而等价，不是通用 Unicode 结论。

静态审查记录
------------

本次人工推演了官方三个示例的真假结果，并额外推演整串命中、单词复用、多条路径到达同一位置、只有前缀
可达四类边界。逐语言核对了平台签名、必要导入、起止坐标、定点匹配 API、输入所有权和返回类型；C 还核对了
容量乘法、``n + 1``、失败释放与布尔错误通道，Julia/R 核对了一基换算、迭代方向和字符物化。

按照仓库当前策略，以上十份题解代码均 **未运行、未编译、未测试**，也未做对拍、穷举或属性测试。剩余风险主要是
目标平台具体版本对签名或库 API 的细微差异，以及人工静态审查无法排除的拼写错误；本文不声称十语言已经运行
通过。

学习链与自检
------------

本题新增“字符串切分位置图”的建模，强化“布尔 DP 是 DAG 可达性压缩”的理解，并为 0140 的全部路径枚举建立
状态基础。0131/0132 同样按字符串边界切分，但分别保存全部回文分区或最少切割；比较三题能看出状态载荷如何
随输出目标变化。

#. ``reachable[i]`` 精确表示什么？
#. 为什么不能从一个不可达的 ``start`` 继续传播？
#. 如何证明合法切分的最后一个词一定会被检查？
#. 为什么各语言不同的字符坐标在本题仍表示同一位置？

答案要点
~~~~~~~~

#. 它表示前 ``i`` 个字符能否被字典词完整覆盖，不表示 ``s[i:]`` 是否可切分，也不记录切法数量。
#. 局部词匹配只能证明存在 ``start -> end`` 的边；若 0 到不了 ``start``，这条边不能构成从 0 出发的路径。
#. 去掉任意合法切分的最后一个词后得到更短的合法前缀；归纳保证其起点已可达，随后循环会枚举该末词。
#. 题面只允许小写英文字母，一个字节、一个 UTF-16 代码单元和一个 Unicode 码点的边界在这里重合。
