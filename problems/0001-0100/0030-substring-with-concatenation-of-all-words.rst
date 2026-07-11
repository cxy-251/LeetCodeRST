0030. Substring with Concatenation of All Words
===============================================

题目信息
--------

:题号: 0030
:难度: Hard
:主题: 字符串、哈希计数、固定步长滑动窗口、多偏移扫描
:原题: `LeetCode 0030 <https://leetcode.com/problems/substring-with-concatenation-of-all-words/>`_
:访问状态: Available
:教学重点: 等长单词分块、需求频次、窗口超量收缩、按余数类扫描、重复单词

题目重述
--------

给定字符串 ``s`` 和字符串数组 ``words``。``words`` 中每个单词长度相同，需要找出所有起点，
使得从该位置开始的连续子串恰好由 ``words`` 中全部单词各使用一次拼接而成。

单词顺序可以任意，重复单词必须按照出现次数使用。结果起点按零基下标返回，顺序不限。

自建示例
--------

两个不同单词
~~~~~~~~~~~~

.. code-block:: text

   s = "barfoothefoobarman"
   words = ["foo", "bar"]
   返回 [0, 9]

   s[0:6] = "barfoo"
   s[9:15] = "foobar"

包含重复单词
~~~~~~~~~~~~

.. code-block:: text

   s = "wordgoodgoodgoodbestword"
   words = ["word", "good", "best", "good"]
   返回 [8]

   起点 8 的分块为 ["good", "good", "best", "word"]。

无效单词切断窗口
~~~~~~~~~~~~~~~~

.. code-block:: text

   s = "fooXYZbarfoo"
   words = ["foo", "bar"]

   "XYZ" 不在需求表中，它会清空当前对齐窗口；后面的 "barfoo" 仍可形成答案 6。

没有足够长度
~~~~~~~~~~~~

.. code-block:: text

   s = "short"
   words = ["long", "word"]
   返回 []

问题抽象
--------

设：

* 单词长度为 ``w``；
* 单词数量为 ``k``；
* 目标子串总长度为 ``w × k``；
* ``need[word]`` 表示每个单词需要出现的次数。

因为所有单词等长，一个合法起点之后的切分边界已经确定。若起点是 ``offset``，后续只需要按
``w`` 步长读取：

.. code-block:: text

   offset, offset + w, offset + 2w, ...

起点对 ``w`` 取模后只有 ``w`` 种余数。算法分别扫描 ``offset = 0`` 到 ``w - 1``，每条扫描线
都把字符串看成一列等长“单词块”。

在每条扫描线上维护滑动窗口：

* ``seen[word]``：当前窗口中单词出现次数；
* ``left``：窗口最左单词块起点；
* ``right``：新读入单词块起点；
* ``count``：窗口中单词块总数。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 多偏移固定步长滑动窗口
     - 逻辑扫描 ``O(n)``
     - ``O(u)``
     - 主解法；重复单词和重叠答案都可在线处理
   * - 枚举每个字符起点并重建计数表
     - ``O(nk)`` 次单词检查
     - ``O(u)``
     - 大量相邻候选重复统计
   * - 对每个目标子串排序后比较
     - 至少 ``O(nk log k)``
     - ``O(k)``
     - 忽略固定词长窗口结构，分配开销高

``u`` 是 ``words`` 中不同单词数量。实际字符串切片和哈希仍需读取 ``w`` 个字符，因此若把字符
复制成本计入，语言实现的总字符工作量可写成 ``O(nw)``；在题目常用的定长单词模型中，窗口
操作数量是线性的。

主解法：按词长余数分组的滑动窗口
--------------------------------

为什么要扫描 w 个偏移
~~~~~~~~~~~~~~~~~~~~~~

同一窗口中的所有单词边界必须相差 ``w``。从起点 ``0`` 扫描只能覆盖下标模 ``w`` 为零的候选，
无法覆盖起点 ``1``、``2`` 等其他对齐方式。

将所有起点按 ``index mod w`` 分组后，每个字符位置恰好属于一条扫描线。总扫描块数量仍是线性，
不是 ``w`` 倍的完整字符串扫描。

读入一个新单词
~~~~~~~~~~~~~~

对当前位置单词块 ``word`` 分三种情况：

#. ``word`` 不在 ``need`` 中：任何包含它的窗口都不合法。清空 ``seen``，令 ``left`` 移到它之后；
#. ``word`` 合法且未超量：加入窗口，继续向右；
#. ``word`` 合法但 ``seen[word] > need[word]``：从左侧逐块移除，直到该单词不再超量。

只有“新读入的单词”可能刚刚超量，因此收缩条件只需检查当前 ``word`` 的频次。

发现完整窗口
~~~~~~~~~~~~

当 ``count == k`` 时，窗口包含恰好 ``k`` 个合法单词，并且所有频次都不超过需求。频次总和与
需求总和相同，因此每个单词频次必然都恰好等于需求，``left`` 是答案。

记录答案后立即移除最左单词并推进 ``left``。这样窗口可继续寻找与当前答案重叠的下一答案。

核心不变量
~~~~~~~~~~

每条偏移扫描线的每轮结束后：

* 窗口边界 ``left``、``right`` 与当前 ``offset`` 具有相同模 ``w`` 余数；
* 窗口只包含需求表中的单词；
* 对每个单词都有 ``seen[word] <= need[word]``；
* ``count`` 等于窗口内单词块数量；
* ``seen`` 的频次总和等于 ``count``；
* 所有以更早块为左端、且已被排除的窗口都不可能重新变成合法答案。

无效单词后的重置
~~~~~~~~~~~~~~~~

若读到不在需求表中的单词，任何跨过该块的连续拼接都包含非法单词。因此把 ``left`` 移到该块
之后不会漏解，旧窗口计数也可以全部清空。

超量收缩为何安全
~~~~~~~~~~~~~~~~

若当前 ``word`` 出现次数超过需求，任何仍包含窗口最左侧到“最早多余副本”之间全部内容的窗口
都不合法。逐块移动 ``left``，直到移除一个该单词副本，正好得到最靠左的重新合法窗口。

其他单词只会减少，不可能因为收缩而超量；所以不需要对所有键重复检查。

正确性依据
~~~~~~~~~~

任意合法答案起点具有唯一的 ``offset = start mod w``，因此一定会在对应扫描线中被访问。
扫描线按完整单词块读取，不会产生错位切分。

窗口遇到非法单词时，所有跨越它的候选均不合法，重置不会删除答案。窗口遇到某单词超量时，
任何保留全部多余副本的候选均不合法，左侧收缩只排除这些不可能候选。由此窗口始终保存当前
右端下最靠左的频次合法后缀。

当 ``count == k`` 时，窗口包含 ``k`` 个需求内单词，且每种频次不超过需求。两边总频次都是
``k``，所以所有单词频次必须逐项相等，窗口恰好是全部单词的一次排列。算法记录所有这种窗口，
因此无误报也无漏报。

复杂度
~~~~~~

设 ``n = len(s)``、单词长度为 ``w``、不同单词数为 ``u``：

* 每个对齐单词块最多被右指针加入一次、左指针移除一次；
* 哈希表窗口操作总数为 ``O(n / w)`` 个块，通常记为 ``O(n)``；
* 若字符串切片复制 ``w`` 个字符，字符工作量为 ``O(nw)``；使用视图或字节切片可降低分配；
* ``need`` 与 ``seen`` 保存至多 ``u`` 个键，额外空间为 ``O(u)``；
* C 实现的开放寻址表和计数数组同样为 ``O(u)``。

核心语言实现
------------

C
~

C 没有标准哈希表。下面用开放寻址把每个不同单词映射成整数编号，窗口只维护整数计数。
查找字符串块时直接哈希 ``s`` 中的 ``w`` 个字节，不创建临时字符串。

.. code-block:: c

   static uint64_t hash_bytes(const char *data, int length) {
       uint64_t hash = 1469598103934665603ULL;

       for (int i = 0; i < length; ++i) {
           hash ^= (unsigned char)data[i];
           hash *= 1099511628211ULL;
       }

       return hash;
   }

   static int lookup_word(
       const char *slice,
       char **words,
       int word_length,
       int *table,
       int capacity,
       int *representative
   ) {
       int position = (int)(
           hash_bytes(slice, word_length) & (uint64_t)(capacity - 1)
       );

       while (table[position] != 0) {
           int id = table[position] - 1;

           if (memcmp(
                   words[representative[id]],
                   slice,
                   (size_t)word_length
               ) == 0) {
               return id;
           }

           position = (position + 1) & (capacity - 1);
       }

       return -1;
   }

   int *findSubstring(
       char *s,
       char **words,
       int wordsSize,
       int *returnSize
   ) {
       *returnSize = 0;

       if (wordsSize == 0) {
           return NULL;
       }

       int text_length = (int)strlen(s);
       int word_length = (int)strlen(words[0]);
       int total_length = word_length * wordsSize;

       if (total_length > text_length) {
           return NULL;
       }

       int capacity = 1;
       while (capacity < wordsSize * 2) {
           capacity <<= 1;
       }

       int *table = calloc((size_t)capacity, sizeof(int));
       int *representative = malloc(
           (size_t)wordsSize * sizeof(int)
       );
       int *need = calloc((size_t)wordsSize, sizeof(int));
       int unique_count = 0;

       for (int i = 0; i < wordsSize; ++i) {
           int position = (int)(
               hash_bytes(words[i], word_length)
               & (uint64_t)(capacity - 1)
           );

           for (;;) {
               if (table[position] == 0) {
                   representative[unique_count] = i;
                   need[unique_count] = 1;
                   table[position] = unique_count + 1;
                   ++unique_count;
                   break;
               }

               int id = table[position] - 1;
               if (memcmp(
                       words[representative[id]],
                       words[i],
                       (size_t)word_length
                   ) == 0) {
                   ++need[id];
                   break;
               }

               position = (position + 1) & (capacity - 1);
           }
       }

       int *answer = malloc(
           (size_t)(text_length + 1) * sizeof(int)
       );
       int *seen = calloc((size_t)unique_count, sizeof(int));
       int *stamp = calloc((size_t)unique_count, sizeof(int));
       int epoch = 1;

       for (int offset = 0;
            offset < word_length && offset + total_length <= text_length;
            ++offset) {
           int left = offset;
           int count = 0;

           for (int right = offset;
                right + word_length <= text_length;
                right += word_length) {
               int id = lookup_word(
                   s + right,
                   words,
                   word_length,
                   table,
                   capacity,
                   representative
               );

               if (id < 0) {
                   left = right + word_length;
                   count = 0;
                   ++epoch;
                   continue;
               }

               if (stamp[id] != epoch) {
                   stamp[id] = epoch;
                   seen[id] = 0;
               }

               ++seen[id];
               ++count;

               while (seen[id] > need[id]) {
                   int left_id = lookup_word(
                       s + left,
                       words,
                       word_length,
                       table,
                       capacity,
                       representative
                   );
                   --seen[left_id];
                   left += word_length;
                   --count;
               }

               if (count == wordsSize) {
                   answer[(*returnSize)++] = left;

                   int left_id = lookup_word(
                       s + left,
                       words,
                       word_length,
                       table,
                       capacity,
                       representative
                   );
                   --seen[left_id];
                   left += word_length;
                   --count;
               }
           }

           ++epoch;
       }

       free(stamp);
       free(seen);
       free(need);
       free(representative);
       free(table);
       return answer;
   }

``stamp`` 与 ``epoch`` 让“清空窗口”变成常数操作：某个编号在当前 epoch 第一次访问时才把计数
视为零。需要包含 ``<stdint.h>``、``<string.h>``、``<stdlib.h>``。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> findSubstring(
           std::string s,
           std::vector<std::string>& words
       ) {
           std::vector<int> answer;
           int word_length = static_cast<int>(words[0].size());
           int word_count = static_cast<int>(words.size());
           int total_length = word_length * word_count;

           if (total_length > static_cast<int>(s.size())) {
               return answer;
           }

           std::unordered_map<std::string, int> need;
           for (const std::string& word : words) {
               ++need[word];
           }

           for (int offset = 0;
                offset < word_length;
                ++offset) {
               std::unordered_map<std::string, int> seen;
               int left = offset;
               int count = 0;

               for (int right = offset;
                    right + word_length <= static_cast<int>(s.size());
                    right += word_length) {
                   std::string word = s.substr(right, word_length);
                   auto needed = need.find(word);

                   if (needed == need.end()) {
                       seen.clear();
                       count = 0;
                       left = right + word_length;
                       continue;
                   }

                   ++seen[word];
                   ++count;

                   while (seen[word] > needed->second) {
                       std::string left_word = s.substr(
                           left,
                           word_length
                       );
                       --seen[left_word];
                       left += word_length;
                       --count;
                   }

                   if (count == word_count) {
                       answer.push_back(left);
                       std::string left_word = s.substr(
                           left,
                           word_length
                       );
                       --seen[left_word];
                       left += word_length;
                       --count;
                   }
               }
           }

           return answer;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def findSubstring(
           self,
           s: str,
           words: list[str],
       ) -> list[int]:
           word_length = len(words[0])
           word_count = len(words)
           total_length = word_length * word_count

           if total_length > len(s):
               return []

           need: dict[str, int] = {}
           for word in words:
               need[word] = need.get(word, 0) + 1

           answer: list[int] = []

           for offset in range(word_length):
               left = offset
               count = 0
               seen: dict[str, int] = {}

               for right in range(
                   offset,
                   len(s) - word_length + 1,
                   word_length,
               ):
                   word = s[right:right + word_length]

                   if word not in need:
                       seen.clear()
                       count = 0
                       left = right + word_length
                       continue

                   seen[word] = seen.get(word, 0) + 1
                   count += 1

                   while seen[word] > need[word]:
                       left_word = s[left:left + word_length]
                       seen[left_word] -= 1
                       left += word_length
                       count -= 1

                   if count == word_count:
                       answer.append(left)
                       left_word = s[left:left + word_length]
                       seen[left_word] -= 1
                       left += word_length
                       count -= 1

           return answer

Java
~~~~

.. code-block:: java

   class Solution {
       public List<Integer> findSubstring(
           String s,
           String[] words
       ) {
           List<Integer> answer = new ArrayList<>();
           int wordLength = words[0].length();
           int wordCount = words.length;
           int totalLength = wordLength * wordCount;

           if (totalLength > s.length()) {
               return answer;
           }

           Map<String, Integer> need = new HashMap<>();
           for (String word : words) {
               need.merge(word, 1, Integer::sum);
           }

           for (int offset = 0; offset < wordLength; ++offset) {
               Map<String, Integer> seen = new HashMap<>();
               int left = offset;
               int count = 0;

               for (int right = offset;
                    right + wordLength <= s.length();
                    right += wordLength) {
                   String word = s.substring(
                       right,
                       right + wordLength
                   );

                   if (!need.containsKey(word)) {
                       seen.clear();
                       count = 0;
                       left = right + wordLength;
                       continue;
                   }

                   seen.merge(word, 1, Integer::sum);
                   ++count;

                   while (seen.get(word) > need.get(word)) {
                       String leftWord = s.substring(
                           left,
                           left + wordLength
                       );
                       seen.put(leftWord, seen.get(leftWord) - 1);
                       left += wordLength;
                       --count;
                   }

                   if (count == wordCount) {
                       answer.add(left);
                       String leftWord = s.substring(
                           left,
                           left + wordLength
                       );
                       seen.put(leftWord, seen.get(leftWord) - 1);
                       left += wordLength;
                       --count;
                   }
               }
           }

           return answer;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::collections::HashMap;

   impl Solution {
       pub fn find_substring(
           s: String,
           words: Vec<String>,
       ) -> Vec<i32> {
           let text = s.as_bytes();
           let word_length = words[0].len();
           let word_count = words.len();
           let total_length = word_length * word_count;

           if total_length > text.len() {
               return Vec::new();
           }

           let mut need: HashMap<Vec<u8>, i32> = HashMap::new();
           for word in &words {
               *need.entry(word.as_bytes().to_vec()).or_insert(0) += 1;
           }

           let mut answer = Vec::new();

           for offset in 0..word_length {
               let mut seen: HashMap<&[u8], i32> = HashMap::new();
               let mut left = offset;
               let mut right = offset;
               let mut count = 0usize;

               while right + word_length <= text.len() {
                   let word = &text[right..right + word_length];
                   right += word_length;

                   let Some(&limit) = need.get(word) else {
                       seen.clear();
                       count = 0;
                       left = right;
                       continue;
                   };

                   *seen.entry(word).or_insert(0) += 1;
                   count += 1;

                   while seen.get(word).copied().unwrap_or(0) > limit {
                       let left_word = &text[left..left + word_length];
                       *seen.get_mut(left_word).unwrap() -= 1;
                       left += word_length;
                       count -= 1;
                   }

                   if count == word_count {
                       answer.push(left as i32);
                       let left_word = &text[left..left + word_length];
                       *seen.get_mut(left_word).unwrap() -= 1;
                       left += word_length;
                       count -= 1;
                   }
               }
           }

           answer
       }
   }

``need`` 拥有单词字节，``seen`` 借用 ``s`` 中的字节切片。切片按内容哈希和比较，不需要为每个
窗口块创建新 ``String``。题目限定小写英文字母，字节边界就是字符边界。

Go
~~

.. code-block:: go

   func findSubstring(s string, words []string) []int {
       wordLength := len(words[0])
       wordCount := len(words)
       totalLength := wordLength * wordCount

       if totalLength > len(s) {
           return []int{}
       }

       need := make(map[string]int)
       for _, word := range words {
           need[word]++
       }

       answer := make([]int, 0)

       for offset := 0; offset < wordLength; offset++ {
           seen := make(map[string]int)
           left := offset
           count := 0

           for right := offset;
               right+wordLength <= len(s);
               right += wordLength {
               word := s[right : right+wordLength]
               limit, ok := need[word]

               if !ok {
                   clear(seen)
                   count = 0
                   left = right + wordLength
                   continue
               }

               seen[word]++
               count++

               for seen[word] > limit {
                   leftWord := s[left : left+wordLength]
                   seen[leftWord]--
                   left += wordLength
                   count--
               }

               if count == wordCount {
                   answer = append(answer, left)
                   leftWord := s[left : left+wordLength]
                   seen[leftWord]--
                   left += wordLength
                   count--
               }
           }
       }

       return answer
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function findSubstring(s: string, words: string[]): number[] {
       const wordLength = words[0].length;
       const wordCount = words.length;
       const totalLength = wordLength * wordCount;

       if (totalLength > s.length) {
           return [];
       }

       const need = new Map<string, number>();
       for (const word of words) {
           need.set(word, (need.get(word) ?? 0) + 1);
       }

       const answer: number[] = [];

       for (let offset = 0; offset < wordLength; offset++) {
           const seen = new Map<string, number>();
           let left = offset;
           let count = 0;

           for (
               let right = offset;
               right + wordLength <= s.length;
               right += wordLength
           ) {
               const word = s.slice(right, right + wordLength);
               const limit = need.get(word);

               if (limit === undefined) {
                   seen.clear();
                   count = 0;
                   left = right + wordLength;
                   continue;
               }

               seen.set(word, (seen.get(word) ?? 0) + 1);
               count++;

               while ((seen.get(word) ?? 0) > limit) {
                   const leftWord = s.slice(
                       left,
                       left + wordLength,
                   );
                   seen.set(leftWord, seen.get(leftWord)! - 1);
                   left += wordLength;
                   count--;
               }

               if (count === wordCount) {
                   answer.push(left);
                   const leftWord = s.slice(
                       left,
                       left + wordLength,
                   );
                   seen.set(leftWord, seen.get(leftWord)! - 1);
                   left += wordLength;
                   count--;
               }
           }
       }

       return answer;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<int> FindSubstring(
           string s,
           string[] words
       ) {
           var answer = new List<int>();
           int wordLength = words[0].Length;
           int wordCount = words.Length;
           int totalLength = wordLength * wordCount;

           if (totalLength > s.Length) {
               return answer;
           }

           var need = new Dictionary<string, int>();
           foreach (string word in words) {
               need[word] = need.GetValueOrDefault(word) + 1;
           }

           for (int offset = 0; offset < wordLength; ++offset) {
               var seen = new Dictionary<string, int>();
               int left = offset;
               int count = 0;

               for (int right = offset;
                    right + wordLength <= s.Length;
                    right += wordLength) {
                   string word = s.Substring(right, wordLength);

                   if (!need.TryGetValue(word, out int limit)) {
                       seen.Clear();
                       count = 0;
                       left = right + wordLength;
                       continue;
                   }

                   seen[word] = seen.GetValueOrDefault(word) + 1;
                   ++count;

                   while (seen[word] > limit) {
                       string leftWord = s.Substring(
                           left,
                           wordLength
                       );
                       --seen[leftWord];
                       left += wordLength;
                       --count;
                   }

                   if (count == wordCount) {
                       answer.Add(left);
                       string leftWord = s.Substring(
                           left,
                           wordLength
                       );
                       --seen[leftWord];
                       left += wordLength;
                       --count;
                   }
               }
           }

           return answer;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function find_substring(s::String, words::Vector{String})
       word_length = ncodeunits(words[1])
       word_count = length(words)
       total_length = word_length * word_count
       text_length = ncodeunits(s)

       total_length > text_length && return Int[]

       need = Dict{String, Int}()
       for word in words
           need[word] = get(need, word, 0) + 1
       end

       answer = Int[]

       for offset in 0:(word_length - 1)
           seen = Dict{String, Int}()
           left = offset
           right = offset
           count = 0

           while right + word_length <= text_length
               word = s[(right + 1):(right + word_length)]
               right += word_length

               if !haskey(need, word)
                   empty!(seen)
                   count = 0
                   left = right
                   continue
               end

               seen[word] = get(seen, word, 0) + 1
               count += 1

               while seen[word] > need[word]
                   left_word = s[(left + 1):(left + word_length)]
                   seen[left_word] -= 1
                   left += word_length
                   count -= 1
               end

               if count == word_count
                   push!(answer, left)
                   left_word = s[(left + 1):(left + word_length)]
                   seen[left_word] -= 1
                   left += word_length
                   count -= 1
               end
           end
       end

       return answer
   end

题目只含小写英文字母，因此零基字节位置加一后可直接作为 Julia 字符串的一基索引。一般 Unicode
字符串不能假设任意字节位置都是合法字符边界。

R
~

.. code-block:: r

   find_substring <- function(s, words) {
     word_length <- nchar(words[[1]], type = "bytes")
     word_count <- length(words)
     total_length <- word_length * word_count
     text_length <- nchar(s, type = "bytes")

     if (total_length > text_length) {
       return(integer(0))
     }

     need <- new.env(hash = TRUE, parent = emptyenv())
     for (word in words) {
       old <- if (exists(word, need, inherits = FALSE)) {
         get(word, need, inherits = FALSE)
       } else {
         0L
       }
       assign(word, old + 1L, need)
     }

     answer <- integer(0)

     for (offset in 0:(word_length - 1L)) {
       seen <- new.env(hash = TRUE, parent = emptyenv())
       left <- offset
       right <- offset
       count <- 0L

       while (right + word_length <= text_length) {
         word <- substr(
           s,
           right + 1L,
           right + word_length
         )
         right <- right + word_length

         if (!exists(word, need, inherits = FALSE)) {
           seen <- new.env(hash = TRUE, parent = emptyenv())
           count <- 0L
           left <- right
           next
         }

         current <- if (exists(word, seen, inherits = FALSE)) {
           get(word, seen, inherits = FALSE)
         } else {
           0L
         }
         assign(word, current + 1L, seen)
         count <- count + 1L
         limit <- get(word, need, inherits = FALSE)

         while (get(word, seen, inherits = FALSE) > limit) {
           left_word <- substr(
             s,
             left + 1L,
             left + word_length
           )
           assign(
             left_word,
             get(left_word, seen, inherits = FALSE) - 1L,
             seen
           )
           left <- left + word_length
           count <- count - 1L
         }

         if (count == word_count) {
           answer <- c(answer, as.integer(left))
           left_word <- substr(
             s,
             left + 1L,
             left + word_length
           )
           assign(
             left_word,
             get(left_word, seen, inherits = FALSE) - 1L,
             seen
           )
           left <- left + word_length
           count <- count - 1L
         }
       }
     }

     answer
   }

关键边界
--------

* ``words`` 含重复值：必须比较频次，不能只使用集合；
* 总拼接长度大于 ``s``：立即返回空结果；
* ``s`` 中出现非法单词块：清空当前对齐窗口；
* 某个合法单词连续出现过多：只收缩到该单词频次恢复合法；
* 答案彼此重叠：记录后只移除最左一块，继续保留其余窗口内容；
* 起点不是单词长度的倍数：由其他 ``offset`` 扫描线负责；
* 多个单词内容相同：窗口长度仍必须达到 ``words`` 的总数量。

易错点
------

* 只扫描 ``offset = 0``，漏掉其他词长对齐方式；
* 用集合代替频次表，无法处理重复单词；
* 单词超量时直接清空窗口，丢失可复用后缀并降低效率；
* ``count == k`` 时未证明所有频次恰好相等；
* 记录答案后不移动左端，下一次读入必然让窗口长度超出；
* 无效单词后只清空计数，却没有把 ``left`` 移到该块之后；
* Julia、R 的一基字符串位置与题目零基答案混用；
* 把字符串切片视为常数成本，却在复杂度说明中忽略 ``w`` 个字符的复制或哈希。

新增与强化知识
--------------

新增
~~~~

* 等长分块问题可按起点对块长的余数拆成多条独立扫描线；
* 频次滑动窗口同时维护“成员合法”和“数量不超限”；
* 当前单词超量时，只需收缩到它恢复需求上限；
* 总频次相等加上逐项不超限，可以推出逐项完全相等；
* C 可把固定长度字符串映射为整数编号，让窗口只处理数组计数。

强化
~~~~

* 0003 的字符级滑动窗口推广为固定词长的块级滑动窗口；
* 0001、0003 中的哈希表继续承担需求与当前状态映射；
* 0028 的字符串索引单位问题在多语言切片中再次出现；
* “每个元素最多进入和离开窗口一次”是线性滑动窗口复杂度的核心依据。

最小自检
--------

#. 为什么需要分别扫描 ``0`` 到 ``w - 1`` 的偏移？
#. 新读入单词不在 ``need`` 中时，为什么可以直接清空窗口？
#. 为什么只检查新读入单词是否超量就足够？
#. ``count == k`` 且所有频次不超限，为什么能推出窗口完全匹配需求？
#. 记录一个答案后为什么要移除最左单词，而不是清空整个窗口？

答案要点
~~~~~~~~

#. 每个合法起点属于唯一的模 ``w`` 余数类，单条扫描线只能覆盖一种对齐。
#. 任何跨越非法单词块的拼接都包含需求外单词，不可能合法。
#. 其他单词频次在本轮没有增加，只有当前单词可能从合法变成超量。
#. 窗口与需求的频次总和同为 ``k``；若每项都不大于需求，总和相等时只能逐项相等。
#. 后续答案可能与当前答案重叠，保留其余 ``k - 1`` 个单词可以继续线性搜索。
