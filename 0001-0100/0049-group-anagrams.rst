0049. Group Anagrams
====================

题目信息
--------

:题号: 0049
:难度: Medium
:主题: 字符串、哈希表、字符频次、规范签名
:原题: `LeetCode 0049 <https://leetcode.com/problems/group-anagrams/>`_
:访问状态: Available
:教学重点: 字母重排等价关系、频次向量键、哈希分组、结果顺序无关

题目重述
--------

给定一个字符串数组，把互为字母异位词的字符串放入同一组并返回所有分组。

字母异位词由完全相同的字符及相同出现次数组成，只是排列顺序可能不同。例如 ``"eat"``、
``"tea"`` 和 ``"ate"`` 属于同一组；``"tan"`` 与它们不属于同一组。

题目不要求分组之间或组内字符串保持特定顺序。

自建示例
--------

普通分组
~~~~~~~~

.. code-block:: text

   输入：["eat", "tea", "tan", "ate", "nat", "bat"]
   一种输出：[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]

重复字符串
~~~~~~~~~~

.. code-block:: text

   输入：["ab", "ba", "ab"]
   输出：[["ab", "ba", "ab"]]

空字符串
~~~~~~~~

.. code-block:: text

   输入：["", "", "a"]
   一种输出：[["", ""], ["a"]]

单个字符串
~~~~~~~~~~

.. code-block:: text

   输入：["code"]
   输出：[["code"]]

问题抽象
--------

“互为字母异位词”是一种等价关系。每个等价类都需要一个唯一且与字符排列无关的规范表示：

.. code-block:: text

   "eat" -> [1, 0, 0, 0, 1, ..., 1, ...]
   "tea" -> [1, 0, 0, 0, 1, ..., 1, ...]

题目字符限定为小写英文字母，因此可以使用长度为 26 的频次数组：第 ``i`` 项表示
``'a' + i`` 的出现次数。两个字符串互为字母异位词，当且仅当它们的 26 项频次全部相等。

扫描每个字符串时：

#. 统计其 26 维频次签名；
#. 用签名查询哈希表；
#. 已存在时，把字符串追加到对应组；
#. 不存在时，新建一个组并登记签名。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 26 维频次签名 + 哈希表
     - ``O(L)`` 期望
     - ``O(L + 26G)``
     - 主解法；利用小写字母表，避免逐字符串排序
   * - 排序后的字符串作为键
     - ``O(Σ m_i log m_i)``
     - ``O(L)``
     - 通用且直观，单个长字符串需要排序
   * - 两两比较并建立分组
     - ``O(N² × M)``
     - 结果空间
     - 重复比较大量字符串，不适合大输入

其中 ``L`` 是所有字符串长度之和，``G`` 是最终分组数，``m_i`` 是第 ``i`` 个字符串长度。

主解法：频次向量作为等价类签名
--------------------------------

签名构造
~~~~~~~~

对字符串 ``word`` 建立 ``counts[26]``：

.. code-block:: text

   for character in word:
       counts[character - 'a'] += 1

频次数组本身可以直接作为键，也可以序列化为带分隔符的字符串：

.. code-block:: text

   1#0#0#0#1#...#1#...

必须保留分隔符。若直接拼接十进制数字，``[1, 11]`` 和 ``[11, 1]`` 可能形成相同文本。

核心不变量
~~~~~~~~~~

处理前 ``k`` 个输入字符串后：

* 哈希表中的每个键对应恰好一个结果组；
* 每个已处理字符串恰好出现在一个组中；
* 同一组内所有字符串具有相同频次签名；
* 不同组的频次签名不同；
* 每个组恰好包含已处理前缀中属于该签名的全部字符串。

处理下一个字符串时，只会追加到唯一匹配签名的已有组，或为一个新签名创建新组，因此不变量继续成立。

正确性依据
~~~~~~~~~~

**同组字符串一定互为字母异位词：** 算法只有在两个字符串的 26 项频次完全相等时，才把它们
放入同一组。频次相等表示每个字母的出现次数都相等，因此两者互为字母异位词。

**互为字母异位词的字符串一定同组：** 任意两个字母异位词对每个小写字母拥有相同出现次数，
所以构造出的频次签名相同。哈希表对相同键返回同一个组，它们必然被追加到同一组。

**每个字符串恰好出现一次：** 扫描每个输入元素时只执行一次追加；签名查询结果唯一，因此不会
遗漏，也不会加入多个组。

综上，结果组恰好是字母异位词等价关系的全部等价类。

复杂度
~~~~~~

设输入包含 ``N`` 个字符串，总字符数为 ``L``，最终分组数为 ``G``：

* 统计所有字符频次需要 ``O(L)``；
* 每个签名的哈希与比较最多处理 26 项，视为常数，整体期望时间 ``O(L + N)``，通常简写为
  ``O(L)``；
* 哈希表保存至多 ``G`` 个 26 维签名，结果保存全部字符串，额外空间为 ``O(L + 26G)``；
* C 实现使用开放寻址，容量保持低负载因子，期望查询为 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdint.h>
   #include <stdio.h>
   #include <stdlib.h>
   #include <string.h>

   typedef struct {
       char *key;
       int group_index;
   } SignatureEntry;

   static char *copy_string(const char *source) {
       size_t length = strlen(source) + 1;
       char *copy = malloc(length);
       memcpy(copy, source, length);
       return copy;
   }

   static uint64_t hash_string(const char *text) {
       uint64_t hash = 1469598103934665603ULL;
       while (*text != '\0') {
           hash ^= (unsigned char)*text++;
           hash *= 1099511628211ULL;
       }
       return hash;
   }

   static void build_signature(const char *word, char *buffer) {
       int counts[26] = {0};
       for (const char *cursor = word; *cursor != '\0'; ++cursor) {
           ++counts[*cursor - 'a'];
       }

       size_t offset = 0;
       for (int index = 0; index < 26; ++index) {
           int written = snprintf(
               buffer + offset,
               160 - offset,
               "%d#",
               counts[index]
           );
           offset += (size_t)written;
       }
   }

   char ***groupAnagrams(
       char **strs,
       int strsSize,
       int *returnSize,
       int **returnColumnSizes
   ) {
       if (strsSize == 0) {
           *returnSize = 0;
           *returnColumnSizes = NULL;
           return NULL;
       }

       int table_capacity = 1;
       while (table_capacity < strsSize * 2) {
           table_capacity <<= 1;
       }

       SignatureEntry *table = calloc(
           (size_t)table_capacity,
           sizeof(SignatureEntry)
       );
       char ***groups = malloc((size_t)strsSize * sizeof(char **));
       int *sizes = calloc((size_t)strsSize, sizeof(int));
       int *capacities = malloc((size_t)strsSize * sizeof(int));
       int group_count = 0;

       for (int word_index = 0; word_index < strsSize; ++word_index) {
           char signature[160];
           build_signature(strs[word_index], signature);

           size_t slot = (size_t)(
               hash_string(signature) & (uint64_t)(table_capacity - 1)
           );
           while (table[slot].key != NULL &&
                  strcmp(table[slot].key, signature) != 0) {
               slot = (slot + 1) & (size_t)(table_capacity - 1);
           }

           int group_index;
           if (table[slot].key == NULL) {
               group_index = group_count++;
               table[slot].key = copy_string(signature);
               table[slot].group_index = group_index;
               capacities[group_index] = 4;
               groups[group_index] = malloc(4 * sizeof(char *));
           } else {
               group_index = table[slot].group_index;
           }

           if (sizes[group_index] == capacities[group_index]) {
               capacities[group_index] *= 2;
               groups[group_index] = realloc(
                   groups[group_index],
                   (size_t)capacities[group_index] * sizeof(char *)
               );
           }
           groups[group_index][sizes[group_index]++] =
               copy_string(strs[word_index]);
       }

       for (int slot = 0; slot < table_capacity; ++slot) {
           free(table[slot].key);
       }
       free(table);
       free(capacities);

       *returnSize = group_count;
       *returnColumnSizes = sizes;
       return groups;
   }

签名缓冲区使用分隔符避免十进制计数歧义。返回结果中的每个字符串都被复制，调用者需要释放各字符串、
各组指针数组、外层数组和 ``returnColumnSizes``。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       vector<vector<string>> groupAnagrams(vector<string>& strs) {
           unordered_map<string, vector<string>> groups;

           for (const string& word : strs) {
               array<int, 26> counts{};
               for (char character : word) {
                   ++counts[character - 'a'];
               }

               string key;
               for (int count : counts) {
                   key += '#';
                   key += to_string(count);
               }
               groups[key].push_back(word);
           }

           vector<vector<string>> answer;
           answer.reserve(groups.size());
           for (auto& [key, group] : groups) {
               answer.push_back(move(group));
           }
           return answer;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
           groups: dict[tuple[int, ...], list[str]] = {}

           for word in strs:
               counts = [0] * 26
               for character in word:
                   counts[ord(character) - ord("a")] += 1

               key = tuple(counts)
               groups.setdefault(key, []).append(word)

           return list(groups.values())

Java
~~~~

.. code-block:: java

   class Solution {
       public List<List<String>> groupAnagrams(String[] strs) {
           Map<String, List<String>> groups = new HashMap<>();

           for (String word : strs) {
               int[] counts = new int[26];
               for (int index = 0; index < word.length(); ++index) {
                   ++counts[word.charAt(index) - 'a'];
               }

               StringBuilder key = new StringBuilder();
               for (int count : counts) {
                   key.append('#').append(count);
               }
               groups.computeIfAbsent(
                   key.toString(),
                   ignored -> new ArrayList<>()
               ).add(word);
           }

           return new ArrayList<>(groups.values());
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::collections::HashMap;

   impl Solution {
       pub fn group_anagrams(strs: Vec<String>) -> Vec<Vec<String>> {
           let mut groups: HashMap<[u16; 26], Vec<String>> =
               HashMap::new();

           for word in strs {
               let mut counts = [0_u16; 26];
               for byte in word.bytes() {
                   counts[(byte - b'a') as usize] += 1;
               }
               groups.entry(counts).or_default().push(word);
           }

           groups.into_values().collect()
       }
   }

``[u16; 26]`` 实现 ``Eq`` 和 ``Hash``，可以直接作为键。题目单个字符串长度远小于 ``u16`` 上限。

Go
~~

.. code-block:: go

   func groupAnagrams(strs []string) [][]string {
       groups := make(map[[26]int][]string)

       for _, word := range strs {
           var counts [26]int
           for index := 0; index < len(word); index++ {
               counts[word[index]-'a']++
           }
           groups[counts] = append(groups[counts], word)
       }

       answer := make([][]string, 0, len(groups))
       for _, group := range groups {
           answer = append(answer, group)
       }
       return answer
   }

Go 数组是可比较类型，因此 ``[26]int`` 可以直接作为 ``map`` 键；切片不能作为键。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function groupAnagrams(strs: string[]): string[][] {
       const groups = new Map<string, string[]>();

       for (const word of strs) {
           const counts = new Array<number>(26).fill(0);
           for (let index = 0; index < word.length; index++) {
               counts[word.charCodeAt(index) - 97]++;
           }

           const key = counts.join("#");
           const group = groups.get(key);
           if (group === undefined) {
               groups.set(key, [word]);
           } else {
               group.push(word);
           }
       }

       return [...groups.values()];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<IList<string>> GroupAnagrams(string[] strs) {
           Dictionary<string, IList<string>> groups = new();

           foreach (string word in strs) {
               int[] counts = new int[26];
               foreach (char character in word) {
                   ++counts[character - 'a'];
               }

               string key = string.Join("#", counts);
               if (!groups.TryGetValue(key, out IList<string>? group)) {
                   group = new List<string>();
                   groups[key] = group;
               }
               group.Add(word);
           }

           return groups.Values.ToList();
       }
   }

Julia
~~~~~

.. code-block:: julia

   function group_anagrams(words::Vector{String})
       groups = Dict{NTuple{26, Int}, Vector{String}}()

       for word in words
           counts = zeros(Int, 26)
           for byte in codeunits(word)
               counts[Int(byte - UInt8('a')) + 1] += 1
           end

           key = Tuple(counts)
           push!(get!(groups, key, String[]), word)
       end

       return collect(values(groups))
   end

题目只含小写 ASCII 字母，``codeunits`` 的每个字节就是一个完整字符。Julia 数组不可直接作为稳定哈希键，
转换为不可变 ``NTuple`` 后可按内容比较。

R
~

.. code-block:: r

   group_anagrams <- function(words) {
     groups <- new.env(hash = TRUE, parent = emptyenv())
     key_order <- character(0)

     for (word in words) {
       counts <- integer(26)
       bytes <- utf8ToInt(word)

       if (length(bytes) > 0L) {
         for (code in bytes) {
           position <- code - utf8ToInt("a") + 1L
           counts[[position]] <- counts[[position]] + 1L
         }
       }

       key <- paste(counts, collapse = "#")
       if (!exists(key, envir = groups, inherits = FALSE)) {
         assign(key, character(0), envir = groups)
         key_order <- c(key_order, key)
       }
       assign(
         key,
         c(get(key, envir = groups, inherits = FALSE), word),
         envir = groups
       )
     }

     lapply(
       key_order,
       function(key) get(key, envir = groups, inherits = FALSE)
     )
   }

R 的 ``environment`` 以字符串作为绑定名。额外保存 ``key_order``，避免依赖环境键的遍历顺序。

关键边界
--------

* 空输入数组：返回空分组列表；
* 空字符串：26 项频次全为零，所有空字符串归入同组；
* 重复字符串：每个输入元素都应保留，不能用集合去重；
* 单字符字符串：只有相同字符才能同组；
* 组和组内顺序：题目不要求固定顺序，哈希表遍历顺序不同仍然正确；
* 签名编码：十进制计数之间必须有分隔符，或直接使用定长数组/元组作为键。

易错点
------

* 只比较字符串长度；长度相同不代表字符频次相同；
* 用字符集合而非字符频次，错误地把 ``"aab"`` 与 ``"abb"`` 归为一组；
* 序列化计数时没有分隔符，造成不同频次向量键冲突；
* 把重复输入字符串去重，导致结果元素数量减少；
* 假设哈希表输出顺序固定，并据此判断答案；
* 在 Unicode 一般字符串上直接按字节减 ``'a'``；本题小写英文字母约束使该做法成立。

新增与强化知识
--------------

新增
~~~~

* 等价类分组可通过“规范签名 -> 成员列表”哈希映射实现；
* 固定小字母表允许使用频次向量替代排序后的字符串；
* 数组能否直接作为哈希键取决于语言的内容相等与可哈希规则；
* 序列化复合键必须消除字段边界歧义。

强化
~~~~

* 复用 0001 与 0030 的哈希分组和频次状态思想；
* 结果顺序无关时，哈希表遍历顺序不属于正确性条件；
* C 的开放寻址表需要保持低负载因子，并处理哈希冲突；
* 正确性证明应分别覆盖“同组必等价”和“等价必同组”。

最小自检
--------

#. 为什么 ``"aab"`` 和 ``"aba"`` 的签名相同？
#. 为什么只记录字符是否出现不够？
#. ``[1, 11]`` 与 ``[11, 1]`` 为什么不能直接拼成无分隔符文本？
#. 哈希表遍历得到的分组顺序与示例不同，是否算错误？
#. Go 为什么可以用 ``[26]int`` 作键，却不能用 ``[]int`` 作键？

答案要点
~~~~~~~~

#. 两者每个字母的出现次数完全相同，排列顺序不影响频次。
#. 字母异位词要求次数也相同；集合会丢失重复次数。
#. 两者都可能形成 ``"111"``，字段边界无法恢复。
#. 不算；题目允许任意顺序。
#. 固定长度数组可比较，切片包含动态引用语义，不可直接比较或哈希。
