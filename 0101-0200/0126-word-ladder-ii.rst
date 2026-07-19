0126. Word Ladder II
====================

题目信息
--------

:题号: 0126
:难度: Hard
:主题: 图、广度优先搜索、最短路径 DAG、回溯、字符串
:原题: `LeetCode 0126 <https://leetcode.com/problems/word-ladder-ii/>`_
:访问状态: Available
:教学重点: 最短层 BFS、同层多前驱、目标层收尾、输出敏感复杂度

题目重述
--------

给定两个不同的等长小写英文单词 ``beginWord`` 和 ``endWord``，以及一个单词列表 ``wordList``。
一次变换只能修改一个字符，变换后的单词必须存在于列表中；起点本身可以不在列表中。
返回从起点到终点的所有最短变换序列。若终点不在列表中，或不存在合法变换，返回空列表。

本文采用以下精确契约：

* 每个单词长度相同，长度 ``L`` 在 1 到 5 之间；
* 列表至多包含 500 个由 ``a`` 到 ``z`` 组成的单词；
* 官方输入中的列表单词互异，本文实现仍允许集合容器防御性去重；
* 每条输出序列包含起点和终点，相邻单词恰好相差一个位置；
* 只要求输出集合完整，序列之间的排列顺序没有语义要求；
* 输入字符串和列表只读，算法不改写调用者可观察的内容。

自建示例
--------

存在两条最短序列
~~~~~~~~~~~~~~~~

.. code-block:: text

   beginWord = "hit"
   endWord   = "cog"
   wordList  = ["hot", "dot", "dog", "lot", "log", "cog"]

   输出集合：
   ["hit", "hot", "dot", "dog", "cog"]
   ["hit", "hot", "lot", "log", "cog"]

两个答案共享前缀 ``hit -> hot``，之后在同一 BFS 层分叉，并在终点重新汇合。

终点缺失
~~~~~~~~

若列表不含 ``endWord``，任何合法序列都无法把终点作为最后一次变换结果，直接返回空列表。

较长路径不能混入
~~~~~~~~~~~~~~~~

.. code-block:: text

   beginWord = "aaa"
   endWord   = "bbb"
   wordList  = ["aab", "abb", "aba", "baa", "bab", "bbb"]

算法只记录从距离 ``d`` 指向距离 ``d + 1`` 的边。即使图中还存在绕路，回溯也不会生成非最短序列。

问题抽象
--------

把每个合法单词视为图节点。两个单词恰好相差一个字符时，它们之间存在无向边。
题目要求枚举从起点到终点的全部最短路径。

直接在 BFS 队列中保存完整路径会反复复制共享前缀，前沿可能在到达终点前就占用大量内存。
更稳定的分工是：

#. BFS 只计算最短距离，并为每个节点记录所有来自上一层的前驱；
#. 这些前驱边构成从终点反向指向起点的最短路径 DAG；
#. DFS 只沿该 DAG 回溯，物化最终答案。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - BFS 距离 + 多前驱 DAG + 回溯
     - 搜索期望 ``O(26 N L^2)``，另加输出载荷
     - ``O(N + E_s + D)``，另加返回结果
     - 主解法；共享前缀只存一次
   * - BFS 队列直接保存完整路径
     - 同样枚举邻居，但会反复复制路径
     - 前沿可接近大量部分路径总载荷
     - 逻辑直观，内存放大明显
   * - 建立全部两两邻接后再搜索
     - ``O(N^2 L)`` 加输出载荷
     - ``O(N^2)`` 最坏邻接空间
     - 可作为小规模独立基准

这里 ``N`` 是去重后的列表单词数，``L`` 是单词长度，``E_s`` 是被记录的最短层有向边数，
``D`` 是最短序列包含的单词数。

主解法：最短层 BFS 与前驱 DAG
-----------------------------

邻居生成
~~~~~~~~

对当前单词的每个位置，依次尝试 ``a`` 到 ``z`` 的 26 个字符，并跳过原字符。
候选存在于字典集合时，它就是一个真实图邻居。这样无需预先构造全图。

C 实现为了保持标准 C 接口与确定性，先对去重单词数组排序，再用二分查找候选；
其查找多一个 ``log N`` 因子。其余语言使用哈希集合，以下证明对两种成员查询都成立。

距离与前驱状态
~~~~~~~~~~~~~~

``distance[word]``
   起点到 ``word`` 的最少边数。首次发现节点时由 BFS 层次保证最短。

``parents[word]``
   所有满足 ``distance[parent] + 1 == distance[word]`` 的前驱。
   它不是任意相邻节点列表，只保留能出现在最短路径中的上一层边。

``target_distance``
   首次发现终点时确定的最短距离。确定后仍要处理队列中所有距离小于该值的节点，
   以收集同一终点层的其他合法前驱；距离达到目标层后即可停止。

首次发现与同层再次发现
~~~~~~~~~~~~~~~~~~~~~~

从距离 ``d`` 的 ``current`` 生成 ``candidate`` 时：

* 若候选尚未发现，设置距离为 ``d + 1``，记录 ``current`` 为首个前驱，并按需入队；
* 若候选已知距离恰好也是 ``d + 1``，追加 ``current``，保留另一条最短到达方式；
* 若候选距离更小，当前边会形成更长路径，忽略；
* BFS 不会产生比已知距离更短的再次发现。

不能在首次遇到终点时立刻结束整个 BFS。队列中可能仍有其他距离 ``d`` 的节点，
它们也能连接到距离 ``d + 1`` 的终点。本文只是不再扩展终点，并在队首进入目标层时停止。

为什么形成 DAG
~~~~~~~~~~~~~~

每条记录边都从距离 ``d + 1`` 的节点指向距离 ``d`` 的前驱。沿前驱边回溯时距离严格递减，
因此不可能出现环，最多经过 ``target_distance`` 次边就会到达起点。

核心不变量
~~~~~~~~~~

每次从队列取出节点前保持：

* 队列按非递减距离排列；
* 已出队节点的所有合法单字符邻居已经检查；
* ``distance`` 中每个值都是起点到该节点的真实最短距离；
* ``parents[v]`` 恰好包含目前已处理边中所有位于 ``v`` 上一最短层的前驱；
* 一旦确定目标距离，仍会完成目标上一层的全部节点，不会扩展目标层节点；
* 输入集合未被修改。

正确性依据
~~~~~~~~~~

**距离最短性。** BFS 按层处理。节点首次从距离 ``d`` 的节点发现时获得 ``d + 1``，
任何更短路径都必须让它在更早层被发现，产生矛盾。因此 ``distance`` 保存最短距离。

**前驱完整性。** 设 ``u -> v`` 是任意最短路径上的边，且 ``distance[u] = d``。
BFS 会处理所有距离小于目标距离的节点，所以会处理 ``u`` 并生成邻居 ``v``。
若 ``v`` 首次被发现则记录 ``u``；若已由另一前驱同层发现，距离仍为 ``d + 1``，也会追加 ``u``。
故所有最短路径边都会进入 ``parents``。

**前驱合法性。** 只有真实单字符邻居且距离正好增加一的边会被记录。
沿前驱边反向得到的序列每一步合法，距离每次减少一，最终长度等于最短距离。

**回溯完整且无非最短路径。** 任意最短序列的每条边都在前驱 DAG 中，DFS 会选择对应前驱组合，
所以该序列会被生成。反过来，DFS 只沿距离递减一的边，生成的每条序列都具有最短长度。

**无重复。** 字典节点去重；同一当前节点通过字符替换生成某个一跳邻居的方式唯一，
因此同一父子边只追加一次。DAG 中不同前驱选择序列对应不同单词序列。

**终止性。** BFS 至多首次发现并入队每个节点一次。DFS 每步距离严格减少，有限步后到达起点。

复杂度与输出下界
~~~~~~~~~~~~~~~~

设字母表大小 ``A = 26``，最短答案条数为 ``P``，每条包含 ``D`` 个单词。

* 哈希集合语言最多处理 ``N + 1`` 个节点；每个节点尝试 ``A L`` 个候选；
  构造与哈希长度为 ``L`` 的候选，期望搜索时间 ``O(A N L^2)``；
* C 的排序与二分版本为 ``O(N log N * L + A N L^2 log N)``；
* 记录的最短层边数为 ``E_s``，且每个节点一跳邻居至多 ``(A - 1)L``，
  所以前驱元数据为 ``O(E_s)``；
* 距离、队列和字典索引为 ``O(N)``，回溯工作路径与递归栈为 ``O(D)``；
* 枚举与复制结果至少需要 ``Theta(P D L)`` 时间和返回载荷，这是题目要求本身的下界；
* 多语言字符串候选通常产生短期 ``O(L)`` 物化；R 的队列追加和路径更新还会产生复制，
  其完整适配器成本高于核心图状态。

目标层停止边界
~~~~~~~~~~~~~~

发现终点后存在三个常见错误：

* 立即 ``return``：会漏掉队列中同层节点贡献的其他终点前驱；
* 继续扩展终点层：会探索不可能属于最短答案的更深节点；
* 在一层内部立刻删除新节点且拒绝同层再次到达：会漏掉多前驱。

本文用距离表区分“首次发现”和“同层再次发现”，并在队首距离达到目标距离时停止，
同时满足完整性与剪枝安全性。

核心语言实现
~~~~~~~~~~~~

C
^

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>
   
   typedef struct {
       int *data;
       int size;
       int capacity;
   } IntVector;
   
   typedef struct {
       char ***rows;
       int *columns;
       int size;
       int capacity;
       bool failed;
   } PathResult;
   
   static char *copy_string(const char *text) {
       size_t length = strlen(text);
       char *copy = malloc(length + 1);
       if (copy != NULL) {
           memcpy(copy, text, length + 1);
       }
       return copy;
   }
   
   static int compare_words(const void *left, const void *right) {
       const char *const *a = left;
       const char *const *b = right;
       return strcmp(*a, *b);
   }
   
   static int find_word(char **words, int word_count, const char *target) {
       int left = 0;
       int right = word_count;
       while (left < right) {
           int middle = left + (right - left) / 2;
           int order = strcmp(words[middle], target);
           if (order < 0) {
               left = middle + 1;
           } else {
               right = middle;
           }
       }
       if (left < word_count && strcmp(words[left], target) == 0) {
           return left;
       }
       return -1;
   }
   
   static bool push_int(IntVector *vector, int value) {
       if (vector->size == vector->capacity) {
           int new_capacity = vector->capacity == 0 ? 2 : vector->capacity * 2;
           int *new_data = realloc(
               vector->data,
               (size_t)new_capacity * sizeof(*new_data)
           );
           if (new_data == NULL) {
               return false;
           }
           vector->data = new_data;
           vector->capacity = new_capacity;
       }
       vector->data[vector->size++] = value;
       return true;
   }
   
   static bool reserve_paths(PathResult *result, int needed) {
       if (needed <= result->capacity) {
           return true;
       }
       int new_capacity = result->capacity == 0 ? 4 : result->capacity * 2;
       while (new_capacity < needed) {
           new_capacity *= 2;
       }
       char ***new_rows = malloc((size_t)new_capacity * sizeof(*new_rows));
       int *new_columns = malloc((size_t)new_capacity * sizeof(*new_columns));
       if (new_rows == NULL || new_columns == NULL) {
           free(new_rows);
           free(new_columns);
           return false;
       }
       if (result->size > 0) {
           memcpy(
               new_rows,
               result->rows,
               (size_t)result->size * sizeof(*new_rows)
           );
           memcpy(
               new_columns,
               result->columns,
               (size_t)result->size * sizeof(*new_columns)
           );
       }
       free(result->rows);
       free(result->columns);
       result->rows = new_rows;
       result->columns = new_columns;
       result->capacity = new_capacity;
       return true;
   }
   
   static void free_result(PathResult *result) {
       for (int row = 0; row < result->size; ++row) {
           for (int column = 0; column < result->columns[row]; ++column) {
               free(result->rows[row][column]);
           }
           free(result->rows[row]);
       }
       free(result->rows);
       free(result->columns);
       result->rows = NULL;
       result->columns = NULL;
       result->size = 0;
       result->capacity = 0;
   }
   
   static void save_path(
       char **words,
       const int *stack,
       int path_length,
       PathResult *result
   ) {
       if (result->failed || !reserve_paths(result, result->size + 1)) {
           result->failed = true;
           return;
       }
       char **row = calloc((size_t)path_length, sizeof(*row));
       if (row == NULL) {
           result->failed = true;
           return;
       }
       for (int index = 0; index < path_length; ++index) {
           int word_index = stack[path_length - 1 - index];
           row[index] = copy_string(words[word_index]);
           if (row[index] == NULL) {
               for (int used = 0; used < index; ++used) {
                   free(row[used]);
               }
               free(row);
               result->failed = true;
               return;
           }
       }
       result->rows[result->size] = row;
       result->columns[result->size] = path_length;
       ++result->size;
   }
   
   static void build_paths(
       int current,
       int begin_index,
       char **words,
       IntVector *parents,
       int *stack,
       int depth,
       PathResult *result
   ) {
       if (result->failed) {
           return;
       }
       stack[depth] = current;
       if (current == begin_index) {
           save_path(words, stack, depth + 1, result);
           return;
       }
       for (int index = 0; index < parents[current].size; ++index) {
           build_paths(
               parents[current].data[index],
               begin_index,
               words,
               parents,
               stack,
               depth + 1,
               result
           );
       }
   }
   
   char ***findLadders(
       char *beginWord,
       char *endWord,
       char **wordList,
       int wordListSize,
       int *returnSize,
       int **returnColumnSizes
   ) {
       *returnSize = 0;
       *returnColumnSizes = NULL;
   
       int capacity = wordListSize + 1;
       char **words = malloc((size_t)capacity * sizeof(*words));
       if (words == NULL) {
           return NULL;
       }
       int copied = 0;
       for (int index = 0; index < wordListSize; ++index) {
           words[copied] = copy_string(wordList[index]);
           if (words[copied] == NULL) {
               for (int used = 0; used < copied; ++used) {
                   free(words[used]);
               }
               free(words);
               return NULL;
           }
           ++copied;
       }
       words[copied] = copy_string(beginWord);
       if (words[copied] == NULL) {
           for (int used = 0; used < copied; ++used) {
               free(words[used]);
           }
           free(words);
           return NULL;
       }
       ++copied;
   
       qsort(words, (size_t)copied, sizeof(*words), compare_words);
       int word_count = 0;
       for (int index = 0; index < copied; ++index) {
           if (word_count == 0 || strcmp(words[index], words[word_count - 1]) != 0) {
               words[word_count++] = words[index];
           } else {
               free(words[index]);
           }
       }
   
       int begin_index = find_word(words, word_count, beginWord);
       int end_index = find_word(words, word_count, endWord);
       if (end_index < 0) {
           for (int index = 0; index < word_count; ++index) {
               free(words[index]);
           }
           free(words);
           return NULL;
       }
   
       int *distance = malloc((size_t)word_count * sizeof(*distance));
       int *queue = malloc((size_t)word_count * sizeof(*queue));
       IntVector *parents = calloc((size_t)word_count, sizeof(*parents));
       size_t word_length = strlen(beginWord);
       char *candidate = malloc(word_length + 1);
       if (distance == NULL || queue == NULL || parents == NULL || candidate == NULL) {
           free(distance);
           free(queue);
           free(parents);
           free(candidate);
           for (int index = 0; index < word_count; ++index) {
               free(words[index]);
           }
           free(words);
           return NULL;
       }
   
       for (int index = 0; index < word_count; ++index) {
           distance[index] = -1;
       }
       int head = 0;
       int tail = 0;
       int target_distance = -1;
       distance[begin_index] = 0;
       queue[tail++] = begin_index;
       bool failed = false;
   
       while (head < tail) {
           int current = queue[head++];
           int current_distance = distance[current];
           if (target_distance >= 0 && current_distance >= target_distance) {
               break;
           }
           memcpy(candidate, words[current], word_length + 1);
           for (size_t position = 0; position < word_length && !failed; ++position) {
               char original = candidate[position];
               for (char letter = 'a'; letter <= 'z'; ++letter) {
                   if (letter == original) {
                       continue;
                   }
                   candidate[position] = letter;
                   int next = find_word(words, word_count, candidate);
                   if (next < 0) {
                       continue;
                   }
                   int next_distance = current_distance + 1;
                   if (distance[next] == -1) {
                       distance[next] = next_distance;
                       if (!push_int(&parents[next], current)) {
                           failed = true;
                           break;
                       }
                       if (next == end_index) {
                           target_distance = next_distance;
                       } else {
                           queue[tail++] = next;
                       }
                   } else if (distance[next] == next_distance) {
                       if (!push_int(&parents[next], current)) {
                           failed = true;
                           break;
                       }
                   }
               }
               candidate[position] = original;
           }
       }
   
       PathResult result = {0};
       if (!failed && distance[end_index] >= 0) {
           int *stack = malloc((size_t)(distance[end_index] + 1) * sizeof(*stack));
           if (stack == NULL) {
               failed = true;
           } else {
               build_paths(
                   end_index,
                   begin_index,
                   words,
                   parents,
                   stack,
                   0,
                   &result
               );
               free(stack);
               failed = result.failed;
           }
       }
   
       for (int index = 0; index < word_count; ++index) {
           free(parents[index].data);
           free(words[index]);
       }
       free(distance);
       free(queue);
       free(parents);
       free(candidate);
       free(words);
   
       if (failed) {
           free_result(&result);
           return NULL;
       }
       *returnSize = result.size;
       *returnColumnSizes = result.columns;
       return result.rows;
   }

C++
^^^

.. code-block:: cpp

   #include <algorithm>
   #include <queue>
   #include <string>
   #include <unordered_map>
   #include <unordered_set>
   #include <vector>
   
   class Solution {
   public:
       std::vector<std::vector<std::string>> findLadders(
           std::string beginWord,
           std::string endWord,
           std::vector<std::string>& wordList
       ) {
           std::unordered_set<std::string> dictionary(
               wordList.begin(),
               wordList.end()
           );
           if (!dictionary.contains(endWord)) {
               return {};
           }
   
           std::unordered_map<std::string, int> distance;
           std::unordered_map<std::string, std::vector<std::string>> parents;
           std::queue<std::string> queue;
           distance[beginWord] = 0;
           queue.push(beginWord);
           int targetDistance = -1;
   
           while (!queue.empty()) {
               std::string current = queue.front();
               queue.pop();
               int currentDistance = distance[current];
               if (targetDistance >= 0 && currentDistance >= targetDistance) {
                   break;
               }
   
               std::string candidate = current;
               for (std::size_t position = 0; position < candidate.size(); ++position) {
                   char original = candidate[position];
                   for (char letter = 'a'; letter <= 'z'; ++letter) {
                       if (letter == original) {
                           continue;
                       }
                       candidate[position] = letter;
                       if (!dictionary.contains(candidate)) {
                           continue;
                       }
                       int nextDistance = currentDistance + 1;
                       auto found = distance.find(candidate);
                       if (found == distance.end()) {
                           distance[candidate] = nextDistance;
                           parents[candidate].push_back(current);
                           if (candidate == endWord) {
                               targetDistance = nextDistance;
                           } else {
                               queue.push(candidate);
                           }
                       } else if (found->second == nextDistance) {
                           parents[candidate].push_back(current);
                       }
                   }
                   candidate[position] = original;
               }
           }
   
           if (!distance.contains(endWord)) {
               return {};
           }
           std::vector<std::vector<std::string>> answer;
           std::vector<std::string> reversedPath;
           buildPaths(endWord, beginWord, parents, reversedPath, answer);
           return answer;
       }
   
   private:
       static void buildPaths(
           const std::string& current,
           const std::string& beginWord,
           const std::unordered_map<
               std::string,
               std::vector<std::string>
           >& parents,
           std::vector<std::string>& reversedPath,
           std::vector<std::vector<std::string>>& answer
       ) {
           reversedPath.push_back(current);
           if (current == beginWord) {
               answer.emplace_back(reversedPath.rbegin(), reversedPath.rend());
           } else {
               const auto& previous = parents.at(current);
               for (const std::string& parent : previous) {
                   buildPaths(parent, beginWord, parents, reversedPath, answer);
               }
           }
           reversedPath.pop_back();
       }
   };

Python
^^^^^^

.. code-block:: python

   from collections import defaultdict, deque
   
   
   class Solution:
       def findLadders(
           self,
           beginWord: str,
           endWord: str,
           wordList: list[str],
       ) -> list[list[str]]:
           dictionary = set(wordList)
           if endWord not in dictionary:
               return []
   
           distance = {beginWord: 0}
           parents: dict[str, list[str]] = defaultdict(list)
           queue = deque([beginWord])
           target_distance: int | None = None
   
           while queue:
               current = queue.popleft()
               current_distance = distance[current]
               if target_distance is not None and current_distance >= target_distance:
                   break
   
               letters = list(current)
               for position, original in enumerate(letters):
                   for code in range(ord("a"), ord("z") + 1):
                       letter = chr(code)
                       if letter == original:
                           continue
                       letters[position] = letter
                       candidate = "".join(letters)
                       if candidate not in dictionary:
                           continue
                       next_distance = current_distance + 1
                       if candidate not in distance:
                           distance[candidate] = next_distance
                           parents[candidate].append(current)
                           if candidate == endWord:
                               target_distance = next_distance
                           else:
                               queue.append(candidate)
                       elif distance[candidate] == next_distance:
                           parents[candidate].append(current)
                   letters[position] = original
   
           if endWord not in distance:
               return []
   
           answer: list[list[str]] = []
           reversed_path: list[str] = []
   
           def build(current: str) -> None:
               reversed_path.append(current)
               if current == beginWord:
                   answer.append(reversed(reversed_path.copy()))
                   answer[-1] = list(answer[-1])
               else:
                   for parent in parents[current]:
                       build(parent)
               reversed_path.pop()
   
           build(endWord)
           return answer

Java
^^^^

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.ArrayList;
   import java.util.HashMap;
   import java.util.HashSet;
   import java.util.List;
   import java.util.Map;
   import java.util.Set;
   
   class Solution {
       public List<List<String>> findLadders(
           String beginWord,
           String endWord,
           List<String> wordList
       ) {
           Set<String> dictionary = new HashSet<>(wordList);
           if (!dictionary.contains(endWord)) {
               return List.of();
           }
   
           Map<String, Integer> distance = new HashMap<>();
           Map<String, List<String>> parents = new HashMap<>();
           ArrayDeque<String> queue = new ArrayDeque<>();
           distance.put(beginWord, 0);
           queue.addLast(beginWord);
           int targetDistance = -1;
   
           while (!queue.isEmpty()) {
               String current = queue.removeFirst();
               int currentDistance = distance.get(current);
               if (targetDistance >= 0 && currentDistance >= targetDistance) {
                   break;
               }
   
               char[] candidate = current.toCharArray();
               for (int position = 0; position < candidate.length; ++position) {
                   char original = candidate[position];
                   for (char letter = 'a'; letter <= 'z'; ++letter) {
                       if (letter == original) {
                           continue;
                       }
                       candidate[position] = letter;
                       String next = new String(candidate);
                       if (!dictionary.contains(next)) {
                           continue;
                       }
                       int nextDistance = currentDistance + 1;
                       Integer knownDistance = distance.get(next);
                       if (knownDistance == null) {
                           distance.put(next, nextDistance);
                           parents.computeIfAbsent(
                               next,
                               key -> new ArrayList<>()
                           ).add(current);
                           if (next.equals(endWord)) {
                               targetDistance = nextDistance;
                           } else {
                               queue.addLast(next);
                           }
                       } else if (knownDistance == nextDistance) {
                           parents.get(next).add(current);
                       }
                   }
                   candidate[position] = original;
               }
           }
   
           if (!distance.containsKey(endWord)) {
               return List.of();
           }
           List<List<String>> answer = new ArrayList<>();
           ArrayList<String> reversedPath = new ArrayList<>();
           buildPaths(
               endWord,
               beginWord,
               parents,
               reversedPath,
               answer
           );
           return answer;
       }
   
       private void buildPaths(
           String current,
           String beginWord,
           Map<String, List<String>> parents,
           ArrayList<String> reversedPath,
           List<List<String>> answer
       ) {
           reversedPath.add(current);
           if (current.equals(beginWord)) {
               ArrayList<String> path = new ArrayList<>(reversedPath);
               java.util.Collections.reverse(path);
               answer.add(path);
           } else {
               for (String parent : parents.get(current)) {
                   buildPaths(parent, beginWord, parents, reversedPath, answer);
               }
           }
           reversedPath.remove(reversedPath.size() - 1);
       }
   }

Rust
^^^^

.. code-block:: rust

   use std::collections::{HashMap, HashSet, VecDeque};
   
   impl Solution {
       pub fn find_ladders(
           begin_word: String,
           end_word: String,
           word_list: Vec<String>,
       ) -> Vec<Vec<String>> {
           let dictionary: HashSet<String> = word_list.into_iter().collect();
           if !dictionary.contains(&end_word) {
               return Vec::new();
           }
   
           let mut distance: HashMap<String, usize> = HashMap::new();
           let mut parents: HashMap<String, Vec<String>> = HashMap::new();
           let mut queue = VecDeque::new();
           distance.insert(begin_word.clone(), 0);
           queue.push_back(begin_word.clone());
           let mut target_distance: Option<usize> = None;
   
           while let Some(current) = queue.pop_front() {
               let current_distance = distance[&current];
               if target_distance.is_some_and(|target| current_distance >= target) {
                   break;
               }
   
               let mut bytes = current.as_bytes().to_vec();
               for position in 0..bytes.len() {
                   let original = bytes[position];
                   for letter in b'a'..=b'z' {
                       if letter == original {
                           continue;
                       }
                       bytes[position] = letter;
                       let candidate = String::from_utf8(bytes.clone()).unwrap();
                       if !dictionary.contains(&candidate) {
                           continue;
                       }
                       let next_distance = current_distance + 1;
                       match distance.get(&candidate).copied() {
                           None => {
                               distance.insert(candidate.clone(), next_distance);
                               parents
                                   .entry(candidate.clone())
                                   .or_default()
                                   .push(current.clone());
                               if candidate == end_word {
                                   target_distance = Some(next_distance);
                               } else {
                                   queue.push_back(candidate);
                               }
                           }
                           Some(known) if known == next_distance => {
                               parents
                                   .entry(candidate)
                                   .or_default()
                                   .push(current.clone());
                           }
                           _ => {}
                       }
                   }
                   bytes[position] = original;
               }
           }
   
           if !distance.contains_key(&end_word) {
               return Vec::new();
           }
           let mut answer = Vec::new();
           let mut reversed_path = Vec::new();
           Self::build_paths(
               &end_word,
               &begin_word,
               &parents,
               &mut reversed_path,
               &mut answer,
           );
           answer
       }
   
       fn build_paths(
           current: &str,
           begin_word: &str,
           parents: &HashMap<String, Vec<String>>,
           reversed_path: &mut Vec<String>,
           answer: &mut Vec<Vec<String>>,
       ) {
           reversed_path.push(current.to_owned());
           if current == begin_word {
               answer.push(reversed_path.iter().rev().cloned().collect());
           } else if let Some(previous) = parents.get(current) {
               for parent in previous {
                   Self::build_paths(
                       parent,
                       begin_word,
                       parents,
                       reversed_path,
                       answer,
                   );
               }
           }
           reversed_path.pop();
       }
   }

Go
^^

.. code-block:: go

   func findLadders(
       beginWord string,
       endWord string,
       wordList []string,
   ) [][]string {
       dictionary := make(map[string]bool, len(wordList))
       for _, word := range wordList {
           dictionary[word] = true
       }
       if !dictionary[endWord] {
           return [][]string{}
       }
   
       distance := map[string]int{beginWord: 0}
       parents := make(map[string][]string)
       queue := []string{beginWord}
       head := 0
       targetDistance := -1
   
       for head < len(queue) {
           current := queue[head]
           head++
           currentDistance := distance[current]
           if targetDistance >= 0 && currentDistance >= targetDistance {
               break
           }
   
           candidate := []byte(current)
           for position, original := range candidate {
               for letter := byte('a'); letter <= byte('z'); letter++ {
                   if letter == original {
                       continue
                   }
                   candidate[position] = letter
                   next := string(candidate)
                   if !dictionary[next] {
                       continue
                   }
                   nextDistance := currentDistance + 1
                   knownDistance, found := distance[next]
                   if !found {
                       distance[next] = nextDistance
                       parents[next] = append(parents[next], current)
                       if next == endWord {
                           targetDistance = nextDistance
                       } else {
                           queue = append(queue, next)
                       }
                   } else if knownDistance == nextDistance {
                       parents[next] = append(parents[next], current)
                   }
               }
               candidate[position] = original
           }
       }
   
       if _, found := distance[endWord]; !found {
           return [][]string{}
       }
       answer := make([][]string, 0)
       reversedPath := make([]string, 0, distance[endWord]+1)
       var build func(string)
       build = func(current string) {
           reversedPath = append(reversedPath, current)
           if current == beginWord {
               path := make([]string, len(reversedPath))
               for index := range reversedPath {
                   path[len(path)-1-index] = reversedPath[index]
               }
               answer = append(answer, path)
           } else {
               for _, parent := range parents[current] {
                   build(parent)
               }
           }
           reversedPath = reversedPath[:len(reversedPath)-1]
       }
       build(endWord)
       return answer
   }

TypeScript
^^^^^^^^^^

.. code-block:: typescript

   function findLadders(
       beginWord: string,
       endWord: string,
       wordList: string[],
   ): string[][] {
       const dictionary = new Set(wordList);
       if (!dictionary.has(endWord)) {
           return [];
       }
   
       const distance = new Map<string, number>([[beginWord, 0]]);
       const parents = new Map<string, string[]>();
       const queue: string[] = [beginWord];
       let head = 0;
       let targetDistance: number | undefined;
   
       while (head < queue.length) {
           const current = queue[head++];
           const currentDistance = distance.get(current)!;
           if (
               targetDistance !== undefined
               && currentDistance >= targetDistance
           ) {
               break;
           }
   
           const letters = current.split("");
           for (let position = 0; position < letters.length; position++) {
               const original = letters[position];
               for (let code = 97; code <= 122; code++) {
                   const letter = String.fromCharCode(code);
                   if (letter === original) {
                       continue;
                   }
                   letters[position] = letter;
                   const candidate = letters.join("");
                   if (!dictionary.has(candidate)) {
                       continue;
                   }
                   const nextDistance = currentDistance + 1;
                   const knownDistance = distance.get(candidate);
                   if (knownDistance === undefined) {
                       distance.set(candidate, nextDistance);
                       parents.set(candidate, [current]);
                       if (candidate === endWord) {
                           targetDistance = nextDistance;
                       } else {
                           queue.push(candidate);
                       }
                   } else if (knownDistance === nextDistance) {
                       parents.get(candidate)!.push(current);
                   }
               }
               letters[position] = original;
           }
       }
   
       if (!distance.has(endWord)) {
           return [];
       }
       const answer: string[][] = [];
       const reversedPath: string[] = [];
   
       const build = (current: string): void => {
           reversedPath.push(current);
           if (current === beginWord) {
               answer.push([...reversedPath].reverse());
           } else {
               for (const parent of parents.get(current)!) {
                   build(parent);
               }
           }
           reversedPath.pop();
       };
       build(endWord);
       return answer;
   }

C#
^^

.. code-block:: csharp

   using System;
   using System.Collections.Generic;
   
   public class Solution {
       public IList<IList<string>> FindLadders(
           string beginWord,
           string endWord,
           IList<string> wordList
       ) {
           var dictionary = new HashSet<string>(wordList);
           if (!dictionary.Contains(endWord)) {
               return new List<IList<string>>();
           }
   
           var distance = new Dictionary<string, int> {
               [beginWord] = 0,
           };
           var parents = new Dictionary<string, List<string>>();
           var queue = new Queue<string>();
           queue.Enqueue(beginWord);
           int? targetDistance = null;
   
           while (queue.Count > 0) {
               string current = queue.Dequeue();
               int currentDistance = distance[current];
               if (
                   targetDistance.HasValue
                   && currentDistance >= targetDistance.Value
               ) {
                   break;
               }
   
               char[] candidate = current.ToCharArray();
               for (int position = 0; position < candidate.Length; position++) {
                   char original = candidate[position];
                   for (char letter = 'a'; letter <= 'z'; letter++) {
                       if (letter == original) {
                           continue;
                       }
                       candidate[position] = letter;
                       string next = new string(candidate);
                       if (!dictionary.Contains(next)) {
                           continue;
                       }
                       int nextDistance = currentDistance + 1;
                       if (!distance.TryGetValue(next, out int knownDistance)) {
                           distance[next] = nextDistance;
                           parents[next] = new List<string> { current };
                           if (next == endWord) {
                               targetDistance = nextDistance;
                           } else {
                               queue.Enqueue(next);
                           }
                       } else if (knownDistance == nextDistance) {
                           parents[next].Add(current);
                       }
                   }
                   candidate[position] = original;
               }
           }
   
           var answer = new List<IList<string>>();
           if (!distance.ContainsKey(endWord)) {
               return answer;
           }
           var reversedPath = new List<string>();
           BuildPaths(
               endWord,
               beginWord,
               parents,
               reversedPath,
               answer
           );
           return answer;
       }
   
       private static void BuildPaths(
           string current,
           string beginWord,
           Dictionary<string, List<string>> parents,
           List<string> reversedPath,
           List<IList<string>> answer
       ) {
           reversedPath.Add(current);
           if (current == beginWord) {
               var path = new List<string>(reversedPath);
               path.Reverse();
               answer.Add(path);
           } else {
               foreach (string parent in parents[current]) {
                   BuildPaths(
                       parent,
                       beginWord,
                       parents,
                       reversedPath,
                       answer
                   );
               }
           }
           reversedPath.RemoveAt(reversedPath.Count - 1);
       }
   }

Julia
^^^^^

.. code-block:: julia

   function find_ladders(
       begin_word::String,
       end_word::String,
       word_list::Vector{String},
   )::Vector{Vector{String}}
       dictionary = Set(word_list)
       end_word in dictionary || return Vector{Vector{String}}()
   
       distance = Dict{String, Int}(begin_word => 0)
       parents = Dict{String, Vector{String}}()
       queue = String[begin_word]
       head = 1
       target_distance = nothing
   
       while head <= length(queue)
           current = queue[head]
           head += 1
           current_distance = distance[current]
           if target_distance !== nothing && current_distance >= target_distance
               break
           end
   
           bytes = Vector{UInt8}(codeunits(current))
           for position in eachindex(bytes)
               original = bytes[position]
               for letter in UInt8('a'):UInt8('z')
                   letter == original && continue
                   bytes[position] = letter
                   candidate = String(copy(bytes))
                   candidate in dictionary || continue
                   next_distance = current_distance + 1
                   if !haskey(distance, candidate)
                       distance[candidate] = next_distance
                       parents[candidate] = String[current]
                       if candidate == end_word
                           target_distance = next_distance
                       else
                           push!(queue, candidate)
                       end
                   elseif distance[candidate] == next_distance
                       push!(parents[candidate], current)
                   end
               end
               bytes[position] = original
           end
       end
   
       haskey(distance, end_word) || return Vector{Vector{String}}()
       answer = Vector{Vector{String}}()
       reversed_path = String[]
   
       function build(current::String)
           push!(reversed_path, current)
           if current == begin_word
               push!(answer, reverse(copy(reversed_path)))
           else
               for parent in parents[current]
                   build(parent)
               end
           end
           pop!(reversed_path)
       end
   
       build(end_word)
       return answer
   end

R
^

.. code-block:: r

   find_ladders <- function(begin_word, end_word, word_list) {
     dictionary <- unique(word_list)
     if (!(end_word %in% dictionary)) {
       return(list())
     }
   
     distance <- new.env(hash = TRUE, parent = emptyenv())
     parents <- new.env(hash = TRUE, parent = emptyenv())
     assign(begin_word, 0L, envir = distance)
     queue <- begin_word
     head <- 1L
     target_distance <- NA_integer_
   
     while (head <= length(queue)) {
       current <- queue[[head]]
       head <- head + 1L
       current_distance <- get(current, envir = distance, inherits = FALSE)
       if (!is.na(target_distance) && current_distance >= target_distance) {
         break
       }
   
       bytes <- charToRaw(current)
       for (position in seq_along(bytes)) {
         original <- bytes[[position]]
         for (code in utf8ToInt("abcdefghijklmnopqrstuvwxyz")) {
           letter <- as.raw(code)
           if (identical(letter, original)) {
             next
           }
           bytes[[position]] <- letter
           candidate <- rawToChar(bytes)
           if (!(candidate %in% dictionary)) {
             next
           }
           next_distance <- current_distance + 1L
           if (!exists(candidate, envir = distance, inherits = FALSE)) {
             assign(candidate, next_distance, envir = distance)
             assign(candidate, current, envir = parents)
             if (identical(candidate, end_word)) {
               target_distance <- next_distance
             } else {
               queue <- c(queue, candidate)
             }
           } else if (
             get(candidate, envir = distance, inherits = FALSE)
               == next_distance
           ) {
             previous <- get(candidate, envir = parents, inherits = FALSE)
             assign(candidate, c(previous, current), envir = parents)
           }
         }
         bytes[[position]] <- original
       }
     }
   
     if (!exists(end_word, envir = distance, inherits = FALSE)) {
       return(list())
     }
   
     state <- new.env(parent = emptyenv())
     state$path <- character()
     state$answer <- list()
   
     build <- function(current) {
       state$path <- c(state$path, current)
       if (identical(current, begin_word)) {
         state$answer[[length(state$answer) + 1L]] <- rev(state$path)
       } else {
         previous <- get(current, envir = parents, inherits = FALSE)
         for (parent in previous) {
           build(parent)
         }
       }
       state$path <- state$path[-length(state$path)]
     }
   
     build(end_word)
     state$answer
   }


语言与资源边界
~~~~~~~~~~~~~~

* C 返回 ``char ***``、每行列数和行数；每条路径与每个字符串都独立分配，调用者负责逐层释放。
  分配失败与无解都只能通过平台签名表现为空结果，代码在失败路径释放已建结果和全部元数据；
* C++、Java、C#、Go、TypeScript 与 Python 的结果行都是独立容器，不共享之后会修改的路径缓冲；
* Rust 的字节变换依赖题目限定的小写 ASCII，``from_utf8`` 的 ``unwrap`` 由该契约直接支撑；
* Julia 的 ``String(copy(bytes))`` 物化候选；零基算法位置由 ``eachindex`` 适配为一基索引；
* R 用哈希 ``environment`` 保存距离和前驱，另用环境保存递归共享路径与答案；
  ``c`` 追加队列和路径会复制向量，因此 R 适配器的峰值成本不能写成纯 ``O(N + E_s)``；
* 哈希容器复杂度是期望语义；恶意碰撞下的最坏复杂度由目标运行库决定。

验证证据
--------

本题实现使用以下独立检查：

* RST 解析无警告，十种核心语言代码块各一个，全部行不超过 100 个字符；
* Python 与显式两两建图的独立基准对拍 3000 组随机小字典，并覆盖终点缺失、无解、
  多条最短路径和起点不在列表；
* C 与 C++ 使用严格警告、ASan、UBSan，各对拍 500 组随机小字典；
* Java、Go、TypeScript 各编译运行并对拍 500 组随机小字典；
* Rust、C#、Julia、R 完成接口、所有权、字符单位、递归共享状态和分隔符静态检查；
* 运行验证均把答案规范化为路径集合，不依赖哈希容器导致的输出顺序。

知识更新
--------

``algorithm.shortest_path_predecessor_dag``
   BFS 只保存距离和同层多前驱，把全部最短路径压缩为有向无环图，再输出敏感地回溯。

``boundary.bfs_finish_target_parent_layer``
   首次发现终点后完成其上一层全部节点，既收齐所有最短前驱，也不扩展目标层。

``proof.distance_strictly_decreases_in_backtracking``
   前驱边使距离每步减一，直接给出回溯合法性、无环性、最短性与终止性证书。

``complexity.enumeration_output_payload``
   多路径问题必须把结果条数、每条长度和字符串载荷单独计入，不能只报告 BFS 图状态。

关联题目
--------

* ``0127. Word Ladder``：只求最短长度，可以省略多前驱与路径枚举；
* ``0133. Clone Graph``：图遍历之外还需要维护节点身份映射；
* ``0210. Course Schedule II``：同样使用有向图，但目标是拓扑序而非最短路径 DAG。

最小自检
--------

#. 为什么首次发现 ``endWord`` 时不能立即返回？
#. 一个候选已在更早层发现时，为什么当前边必须忽略？
#. 前驱 DAG 为什么不会成环？
#. 若答案数量指数增长，为什么任何完整输出算法都无法保持多项式总时间？
