0212. Word Search II
====================

题目信息
--------

:题号: 0212
:难度: Hard
:主题: Trie、二维棋盘、DFS、回溯、前缀剪枝
:原题: `LeetCode 0212 <https://leetcode.com/problems/word-search-ii/>`_
:访问状态: Available
:教学重点: Trie 与棋盘联合状态、路径内单格不可重复、结果去重、恢复与资源所有权

精确契约
--------

给定一个由小写英文字母组成的二维棋盘 ``board``，以及一个单词列表 ``words``，返回其中所有能在棋盘中找到的不同单词。

单词必须由一条连续路径拼出：

* 每步只能移动到上、下、左、右相邻格；
* 同一条路径中，同一个棋盘格最多使用一次；
* 不允许对角线移动；
* 不同搜索分支可以重新使用同一格，因此递归退出时必须恢复棋盘；
* 输出顺序不作要求；
* 同一单词即使有多条路径或在输入中重复，也只返回一次；
* 函数正常结束时棋盘内容与调用前相同。

官方字符域为 ``a`` 到 ``z``，单词非空。空棋盘、空列或空单词列表作为扩展边界返回空结果。

自建示例
--------

经典棋盘
~~~~~~~~

.. code-block:: text

   board = [
     [o, a, a, n],
     [e, t, a, e],
     [i, h, k, r],
     [i, f, l, v]
   ]
   words = ["oath", "pea", "eat", "rain"]
   result = ["oath", "eat"]

``oath`` 与 ``eat`` 都能通过四邻接路径组成；``pea`` 与 ``rain`` 无法完整延伸。

共享前缀
~~~~~~~~

.. code-block:: text

   board = [[a, b, c, d]]
   words = ["ab", "abc", "abcd"]
   result = ["ab", "abc", "abcd"]

找到 ``ab`` 后只能清除该终点的输出载荷，不能删除节点或 ``c`` 子链接，否则会漏掉更长单词。

同词多路径与重复输入
~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   board = [
     [a, b],
     [a, b]
   ]
   words = ["ab", "ab"]
   result = ["ab"]

同一个值可以从两行找到，也可以在输入中重复，结果仍只保留一次。

单格重复诱惑
~~~~~~~~~~~~

.. code-block:: text

   board = [[a, b]]
   words = ["aba"]
   result = []

``a -> b`` 后不能回到已经使用的第一个格。

对角线伪路径
~~~~~~~~~~~~

.. code-block:: text

   board = [
     [a, x],
     [x, b]
   ]
   words = ["ab"]
   result = []

两个字母只在对角线上相邻，不满足四邻接合同。

问题抽象与解法选择
------------------

逐个单词独立做棋盘 DFS 会反复搜索相同前缀。主解法先把全部单词放入 Trie，再从每个棋盘格启动联合 DFS：

* 棋盘路径给出当前字符序列；
* Trie 节点判断该序列是否仍是某个候选词前缀；
* 当前字符没有子链接时立即剪枝；
* 到达终止词索引时提交单词并清空索引；
* 当前格临时标记为已使用，递归退出后恢复。

.. list-table::
   :header-rows: 1

   * - 方法
     - 主要工作量
     - 额外存储
     - 取舍
   * - Trie + 棋盘 DFS
     - ``O(S + Q + Z)``
     - Trie、递归栈、输出
     - 主解法；共享前缀并及时剪枝
   * - 每个单词独立 DFS
     - 最坏接近 ``O(Wmn·3^L)``
     - 单词级递归栈
     - 相同前缀被反复搜索
   * - 枚举全部棋盘简单路径
     - 指数级
     - 巨量路径字符串
     - 先生成大量无关路径

``S`` 是输入单词字符总数，``Q`` 是联合 DFS 实际进入的合法状态数，``Z`` 是输出字符总量；
``m``、``n`` 是棋盘行列数，``L`` 是最大单词长度，``W`` 是单词数量。

Trie 节点模型
-------------

每个节点保存：

``children[26]``
   当前前缀追加某个小写字母后的子链接。

``word_index``
   当前路径若是尚未输出的完整单词，保存它在 ``words`` 中的索引；否则保存空哨兵。

重复单词插入时，终止节点只保留第一次出现的索引。第一次找到后清空 ``word_index``，后续路径仍能经过该节点，却不会重复输出。
清空终止索引不会删除任何节点或子链接，因此当前词作为前缀时，更长单词仍可继续搜索。

联合 DFS 状态与不变量
---------------------

递归状态可写成：

.. code-block:: text

   dfs(row, column, trie_parent, current_path_visited)

实现不复制访问集合，而把当前棋盘格临时改成不属于 ``a..z`` 的 ``#``。每个成功进入的调用保持：

#. 坐标位于棋盘内，当前格尚未在本路径使用；
#. 从起点到当前格的棋盘字符，与从 Trie 根到当前子节点的路径标签完全相同；
#. 路径只包含四邻接移动；
#. 路径中的格子互不重复；
#. 被 ``#`` 标记的格恰好属于当前递归路径；
#. Trie 只可能清除终止索引，不删除子链接；
#. 返回前恢复当前格，调用者看到的棋盘与调用前一致。

状态转移
~~~~~~~~

设当前字符为 ``c``，父 Trie 节点为 ``parent``：

#. 越界或当前格为 ``#`` 时返回；
#. ``parent.children[c]`` 不存在时返回；
#. 进入对应子节点；
#. 子节点带有终止索引时提交单词并清空索引；
#. 把当前格改成 ``#``；
#. 依次探索四个邻格；
#. 恢复原字符。

为什么 Trie 剪枝安全
~~~~~~~~~~~~~~~~~~~~

若当前路径追加 ``c`` 后没有 Trie 子链接，它已不是任何输入单词前缀。继续追加字符不能修复已经不匹配的前缀，因此立即返回不会漏解。

为什么必须恢复
~~~~~~~~~~~~~~

标记只属于当前路径。若不恢复，同一起点的兄弟分支、后续起点和其他单词都会错误失去该格。找到单词也不能提前跳过恢复；当前节点下还可能存在更长共享前缀单词。

正确性证明
----------

引理一：Trie 路径恰好表示输入单词前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

插入时逐字符复用或创建唯一子链接。对前缀长度归纳可知，从根到任一节点的标签组成唯一字符串；该节点存在当且仅当该字符串是某个输入单词的前缀。终止索引只放在完整单词末尾。

引理二：每个有效 DFS 状态都对应合法棋盘路径
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

起点只含一个未使用格。递归只进入四邻格，并在进入后标记当前格；已标记格不能再次进入。因此每个状态都对应四邻接且格子互不重复的路径。Trie 转移使用真实棋盘字符，所以两条路径标签一致。

引理三：Trie 剪枝不会排除答案
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

无对应子链接意味着当前字符串不是任何候选词前缀。任何更长字符串仍保留这一错误前缀，不能成为输入单词，因此该分支没有答案。

引理四：四方向展开覆盖全部合法延伸
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任意合法下一步只能是上、下、左、右中一个未使用且在界内的格。算法恰好枚举这四类，并拒绝越界或已标记格，所以既不加入非法移动，也不遗漏合法下一步。

引理五：每个提交结果都是真实单词
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

算法只在 Trie 终止节点提交。由引理二，当前路径可由棋盘合法拼出；由引理一，终止索引对应完整输入单词，因此输出没有伪结果。

引理六：每个真实答案都会被提交
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设单词 ``w`` 有一条合法棋盘路径。外层循环会从首格启动；``w`` 的每个前缀都在 Trie 中，不会被引理三剪枝；每个下一格由引理四枚举。到达末格时进入终止节点并提交 ``w``。

引理七：清空终止索引只去重
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

清空 ``word_index`` 不改变节点和子链接。同词再次到达时不再提交；更长单词仍能经过该节点进入后续子树，因此不会因去重漏掉共享前缀答案。

引理八：标记不会污染其他分支
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每个调用保存原字符，探索前写入 ``#``，全部子调用结束后恢复。对递归深度归纳，函数返回时棋盘与调用前相同，因此兄弟分支和不同起点相互独立。

定理：算法返回且仅返回棋盘中存在的不同输入单词
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理五保证无伪结果，引理六保证无遗漏，引理七保证去重且不破坏长词，引理八保证全部搜索共享同一原始棋盘。结论成立。

复杂度与真实资源
----------------

Trie 构建扫描全部单词字符，时间 ``O(S)``。设创建 ``N`` 个 Trie 节点，固定数组实现保存 ``26N`` 个链接槽位，持久存储为 ``O(26N)``，常简写为 ``O(N)``，但常数不可忽略。

搜索时间按实际进入状态数 ``Q`` 计，为 ``O(Q)``。忽略棋盘边界和 Trie 剪枝时，一个起点的第一步最多有 4 个方向，之后因前一格已使用，粗略最多 3 个方向，最大长度 ``L`` 的上界可写成 ``O(mn·4·3^(L-1))``。真实工作量同时受棋盘形状、Trie 前缀和最大路径长度限制。

递归深度最多 ``min(L,mn)``，调用栈 ``O(L)``；棋盘原地标记只需固定状态；输出载荷为 ``O(Z)``。C 和 Rust 复制结果字符串；R 建 Trie 时 ``strsplit`` 物化字符向量；Julia ``codeunits`` 在官方 ASCII 字符域上提供字节包装视图。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>
   #include <string.h>

   typedef struct TrieNode {
       struct TrieNode *children[26];
       int word_index;
   } TrieNode;

   typedef struct SearchContext {
       char **board;
       int rows;
       int columns;
       char **words;
       char **result;
       int result_count;
       bool failed;
   } SearchContext;

   static TrieNode *new_trie_node(void) {
       TrieNode *node = calloc(1, sizeof(TrieNode));
       if (node != NULL) node->word_index = -1;
       return node;
   }

   static void free_trie(TrieNode *node) {
       if (node == NULL) return;
       for (int i = 0; i < 26; ++i) free_trie(node->children[i]);
       free(node);
   }

   static bool valid_word(const char *word) {
       for (size_t i = 0; word[i] != '\0'; ++i) {
           if (word[i] < 'a' || word[i] > 'z') return false;
       }
       return true;
   }

   static bool insert_word(TrieNode *root, const char *word, int word_index) {
       if (word[0] == '\0') return true;
       if (!valid_word(word)) return false;

       TrieNode *current = root;
       size_t position = 0U;
       while (word[position] != '\0') {
           int index = word[position] - 'a';
           if (current->children[index] == NULL) break;
           current = current->children[index];
           ++position;
       }

       if (word[position] == '\0') {
           if (current->word_index < 0) current->word_index = word_index;
           return true;
       }

       int first_index = word[position] - 'a';
       TrieNode *head = NULL;
       TrieNode *tail = NULL;
       for (; word[position] != '\0'; ++position) {
           TrieNode *node = new_trie_node();
           if (node == NULL) {
               free_trie(head);
               return false;
           }
           if (head == NULL) {
               head = node;
           } else {
               int index = word[position] - 'a';
               tail->children[index] = node;
           }
           tail = node;
       }
       tail->word_index = word_index;
       current->children[first_index] = head;
       return true;
   }

   static char *copy_word(const char *word) {
       size_t length = strlen(word);
       char *copy = malloc(length + 1U);
       if (copy != NULL) memcpy(copy, word, length + 1U);
       return copy;
   }

   static void search_from(
       SearchContext *context,
       int row,
       int column,
       TrieNode *parent
   ) {
       if (context->failed || row < 0 || row >= context->rows ||
           column < 0 || column >= context->columns) return;

       char letter = context->board[row][column];
       if (letter == '#' || letter < 'a' || letter > 'z') return;
       TrieNode *node = parent->children[letter - 'a'];
       if (node == NULL) return;

       if (node->word_index >= 0) {
           char *copy = copy_word(context->words[node->word_index]);
           if (copy == NULL) {
               context->failed = true;
               return;
           }
           context->result[context->result_count++] = copy;
           node->word_index = -1;
       }

       context->board[row][column] = '#';
       search_from(context, row - 1, column, node);
       search_from(context, row + 1, column, node);
       search_from(context, row, column - 1, node);
       search_from(context, row, column + 1, node);
       context->board[row][column] = letter;
   }

   char **findWords(
       char **board,
       int boardSize,
       int *boardColSize,
       char **words,
       int wordsSize,
       int *returnSize
   ) {
       *returnSize = 0;
       if (boardSize <= 0 || wordsSize <= 0 || boardColSize == NULL ||
           boardColSize[0] <= 0) return NULL;

       int columns = boardColSize[0];
       for (int row = 0; row < boardSize; ++row) {
           if (boardColSize[row] != columns) return NULL;
       }
       if ((size_t)wordsSize > SIZE_MAX / sizeof(char *)) return NULL;

       TrieNode *root = new_trie_node();
       char **result = calloc((size_t)wordsSize, sizeof(char *));
       if (root == NULL || result == NULL) {
           free_trie(root);
           free(result);
           return NULL;
       }

       for (int i = 0; i < wordsSize; ++i) {
           if (!insert_word(root, words[i], i)) {
               free_trie(root);
               free(result);
               return NULL;
           }
       }

       SearchContext context = {
           board, boardSize, columns, words, result, 0, false
       };
       for (int row = 0; row < boardSize && !context.failed; ++row) {
           for (int column = 0; column < columns && !context.failed; ++column) {
               search_from(&context, row, column, root);
           }
       }

       free_trie(root);
       if (context.failed) {
           for (int i = 0; i < context.result_count; ++i) free(result[i]);
           free(result);
           return NULL;
       }
       if (context.result_count == 0) {
           free(result);
           return NULL;
       }
       *returnSize = context.result_count;
       return result;
   }

C 的返回数组和每个结果字符串都由调用者释放。Trie 在返回前释放，所以结果必须复制。缺失后缀先在主树外完整构造，分配失败会释放临时链，主 Trie 不留下半条路径。

C++
~~~

.. code-block:: cpp

   #include <array>
   #include <memory>
   #include <string>
   #include <vector>

   class Solution {
       struct TrieNode {
           std::array<std::unique_ptr<TrieNode>, 26> children{};
           int word_index = -1;
       };

       static void insert(TrieNode& root, const std::string& word, int index) {
           if (word.empty()) return;
           TrieNode* current = &root;
           for (char letter : word) {
               int child_index = letter - 'a';
               if (!current->children[child_index]) {
                   current->children[child_index] = std::make_unique<TrieNode>();
               }
               current = current->children[child_index].get();
           }
           if (current->word_index < 0) current->word_index = index;
       }

       static void dfs(
           std::vector<std::vector<char>>& board,
           int row,
           int column,
           TrieNode& parent,
           const std::vector<std::string>& words,
           std::vector<std::string>& result
       ) {
           int rows = static_cast<int>(board.size());
           int columns = static_cast<int>(board[0].size());
           if (row < 0 || row >= rows || column < 0 || column >= columns) return;
           char letter = board[row][column];
           if (letter == '#') return;
           TrieNode* node = parent.children[letter - 'a'].get();
           if (node == nullptr) return;

           if (node->word_index >= 0) {
               result.push_back(words[node->word_index]);
               node->word_index = -1;
           }
           board[row][column] = '#';
           dfs(board, row - 1, column, *node, words, result);
           dfs(board, row + 1, column, *node, words, result);
           dfs(board, row, column - 1, *node, words, result);
           dfs(board, row, column + 1, *node, words, result);
           board[row][column] = letter;
       }

   public:
       std::vector<std::string> findWords(
           std::vector<std::vector<char>>& board,
           std::vector<std::string>& words
       ) {
           if (board.empty() || board[0].empty() || words.empty()) return {};
           TrieNode root;
           for (int i = 0; i < static_cast<int>(words.size()); ++i) {
               insert(root, words[i], i);
           }
           std::vector<std::string> result;
           for (int row = 0; row < static_cast<int>(board.size()); ++row) {
               for (int column = 0;
                    column < static_cast<int>(board[0].size()); ++column) {
                   dfs(board, row, column, root, words, result);
               }
           }
           return result;
       }
   };

Python
~~~~~~

.. code-block:: python

   from typing import List, Optional


   class TrieNode:
       def __init__(self) -> None:
           self.children: List[Optional["TrieNode"]] = [None] * 26
           self.word_index = -1


   class Solution:
       def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
           if not board or not board[0] or not words:
               return []

           root = TrieNode()
           for word_index, word in enumerate(words):
               if not word:
                   continue
               current = root
               for letter in word:
                   index = ord(letter) - ord("a")
                   if current.children[index] is None:
                       current.children[index] = TrieNode()
                   current = current.children[index]
               if current.word_index < 0:
                   current.word_index = word_index

           rows, columns = len(board), len(board[0])
           result: List[str] = []

           def dfs(row: int, column: int, parent: TrieNode) -> None:
               if row < 0 or row >= rows or column < 0 or column >= columns:
                   return
               letter = board[row][column]
               if letter == "#":
                   return
               node = parent.children[ord(letter) - ord("a")]
               if node is None:
                   return
               if node.word_index >= 0:
                   result.append(words[node.word_index])
                   node.word_index = -1

               board[row][column] = "#"
               dfs(row - 1, column, node)
               dfs(row + 1, column, node)
               dfs(row, column - 1, node)
               dfs(row, column + 1, node)
               board[row][column] = letter

           for row in range(rows):
               for column in range(columns):
                   dfs(row, column, root)
           return result

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       private static final class TrieNode {
           final TrieNode[] children = new TrieNode[26];
           int wordIndex = -1;
       }

       public List<String> findWords(char[][] board, String[] words) {
           List<String> result = new ArrayList<>();
           if (board.length == 0 || board[0].length == 0 || words.length == 0) {
               return result;
           }
           TrieNode root = new TrieNode();
           for (int i = 0; i < words.length; ++i) {
               if (words[i].isEmpty()) continue;
               TrieNode current = root;
               for (int j = 0; j < words[i].length(); ++j) {
                   int index = words[i].charAt(j) - 'a';
                   if (current.children[index] == null) {
                       current.children[index] = new TrieNode();
                   }
                   current = current.children[index];
               }
               if (current.wordIndex < 0) current.wordIndex = i;
           }
           for (int row = 0; row < board.length; ++row) {
               for (int column = 0; column < board[0].length; ++column) {
                   dfs(board, row, column, root, words, result);
               }
           }
           return result;
       }

       private void dfs(
           char[][] board, int row, int column, TrieNode parent,
           String[] words, List<String> result
       ) {
           if (row < 0 || row >= board.length ||
               column < 0 || column >= board[0].length) return;
           char letter = board[row][column];
           if (letter == '#') return;
           TrieNode node = parent.children[letter - 'a'];
           if (node == null) return;
           if (node.wordIndex >= 0) {
               result.add(words[node.wordIndex]);
               node.wordIndex = -1;
           }
           board[row][column] = '#';
           dfs(board, row - 1, column, node, words, result);
           dfs(board, row + 1, column, node, words, result);
           dfs(board, row, column - 1, node, words, result);
           dfs(board, row, column + 1, node, words, result);
           board[row][column] = letter;
       }
   }

Rust
~~~~

.. code-block:: rust

   struct TrieNode {
       children: [Option<Box<TrieNode>>; 26],
       word_index: Option<usize>,
   }

   impl TrieNode {
       fn new() -> Self {
           Self {
               children: std::array::from_fn(|_| None),
               word_index: None,
           }
       }
   }

   impl Solution {
       pub fn find_words(
           mut board: Vec<Vec<char>>,
           words: Vec<String>,
       ) -> Vec<String> {
           if board.is_empty() || board[0].is_empty() || words.is_empty() {
               return Vec::new();
           }
           let mut root = TrieNode::new();
           for (word_index, word) in words.iter().enumerate() {
               if word.is_empty() { continue; }
               let mut current = &mut root;
               for byte in word.bytes() {
                   let index = (byte - b'a') as usize;
                   current = current.children[index]
                       .get_or_insert_with(|| Box::new(TrieNode::new()))
                       .as_mut();
               }
               if current.word_index.is_none() {
                   current.word_index = Some(word_index);
               }
           }

           let rows = board.len();
           let columns = board[0].len();
           let mut result = Vec::new();
           for row in 0..rows {
               for column in 0..columns {
                   Self::dfs(
                       &mut board, row as i32, column as i32,
                       &mut root, &words, &mut result,
                   );
               }
           }
           result
       }

       fn dfs(
           board: &mut Vec<Vec<char>>,
           row: i32,
           column: i32,
           parent: &mut TrieNode,
           words: &[String],
           result: &mut Vec<String>,
       ) {
           if row < 0 || column < 0 ||
               row as usize >= board.len() ||
               column as usize >= board[0].len() {
               return;
           }
           let r = row as usize;
           let c = column as usize;
           let letter = board[r][c];
           if letter == '#' { return; }
           let index = (letter as u8 - b'a') as usize;
           let Some(node) = parent.children[index].as_deref_mut() else {
               return;
           };

           if let Some(word_index) = node.word_index.take() {
               result.push(words[word_index].clone());
           }
           board[r][c] = '#';
           Self::dfs(board, row - 1, column, node, words, result);
           Self::dfs(board, row + 1, column, node, words, result);
           Self::dfs(board, row, column - 1, node, words, result);
           Self::dfs(board, row, column + 1, node, words, result);
           board[r][c] = letter;
       }
   }

Go
~~

.. code-block:: go

   type trieNode struct {
       children  [26]*trieNode
       wordIndex int
   }

   func newTrieNode() *trieNode {
       return &trieNode{wordIndex: -1}
   }

   func findWords(board [][]byte, words []string) []string {
       if len(board) == 0 || len(board[0]) == 0 || len(words) == 0 {
           return []string{}
       }
       root := newTrieNode()
       for wordIndex, word := range words {
           if len(word) == 0 { continue }
           current := root
           for i := 0; i < len(word); i++ {
               index := int(word[i] - 'a')
               if current.children[index] == nil {
                   current.children[index] = newTrieNode()
               }
               current = current.children[index]
           }
           if current.wordIndex < 0 { current.wordIndex = wordIndex }
       }

       rows, columns := len(board), len(board[0])
       result := make([]string, 0)
       var dfs func(int, int, *trieNode)
       dfs = func(row int, column int, parent *trieNode) {
           if row < 0 || row >= rows || column < 0 || column >= columns {
               return
           }
           letter := board[row][column]
           if letter == '#' { return }
           node := parent.children[int(letter-'a')]
           if node == nil { return }
           if node.wordIndex >= 0 {
               result = append(result, words[node.wordIndex])
               node.wordIndex = -1
           }
           board[row][column] = '#'
           dfs(row-1, column, node)
           dfs(row+1, column, node)
           dfs(row, column-1, node)
           dfs(row, column+1, node)
           board[row][column] = letter
       }

       for row := 0; row < rows; row++ {
           for column := 0; column < columns; column++ {
               dfs(row, column, root)
           }
       }
       return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   class TrieNode {
     children: Array<TrieNode | null> = Array<TrieNode | null>(26).fill(null);
     wordIndex = -1;
   }

   function findWords(board: string[][], words: string[]): string[] {
     if (board.length === 0 || board[0].length === 0 || words.length === 0) {
       return [];
     }
     const root = new TrieNode();
     for (let wordIndex = 0; wordIndex < words.length; wordIndex += 1) {
       const word = words[wordIndex];
       if (word.length === 0) continue;
       let current = root;
       for (let i = 0; i < word.length; i += 1) {
         const index = word.charCodeAt(i) - 97;
         if (current.children[index] === null) {
           current.children[index] = new TrieNode();
         }
         current = current.children[index] as TrieNode;
       }
       if (current.wordIndex < 0) current.wordIndex = wordIndex;
     }

     const rows = board.length;
     const columns = board[0].length;
     const result: string[] = [];
     const dfs = (row: number, column: number, parent: TrieNode): void => {
       if (row < 0 || row >= rows || column < 0 || column >= columns) return;
       const letter = board[row][column];
       if (letter === "#") return;
       const node = parent.children[letter.charCodeAt(0) - 97];
       if (node === null) return;
       if (node.wordIndex >= 0) {
         result.push(words[node.wordIndex]);
         node.wordIndex = -1;
       }
       board[row][column] = "#";
       dfs(row - 1, column, node);
       dfs(row + 1, column, node);
       dfs(row, column - 1, node);
       dfs(row, column + 1, node);
       board[row][column] = letter;
     };

     for (let row = 0; row < rows; row += 1) {
       for (let column = 0; column < columns; column += 1) {
         dfs(row, column, root);
       }
     }
     return result;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       private sealed class TrieNode {
           public readonly TrieNode[] Children = new TrieNode[26];
           public int WordIndex = -1;
       }

       public IList<string> FindWords(char[][] board, string[] words) {
           var result = new List<string>();
           if (board.Length == 0 || board[0].Length == 0 || words.Length == 0) {
               return result;
           }
           var root = new TrieNode();
           for (int wordIndex = 0; wordIndex < words.Length; ++wordIndex) {
               string word = words[wordIndex];
               if (word.Length == 0) continue;
               TrieNode current = root;
               foreach (char letter in word) {
                   int index = letter - 'a';
                   if (current.Children[index] == null) {
                       current.Children[index] = new TrieNode();
                   }
                   current = current.Children[index];
               }
               if (current.WordIndex < 0) current.WordIndex = wordIndex;
           }
           for (int row = 0; row < board.Length; ++row) {
               for (int column = 0; column < board[0].Length; ++column) {
                   Dfs(board, row, column, root, words, result);
               }
           }
           return result;
       }

       private static void Dfs(
           char[][] board, int row, int column, TrieNode parent,
           string[] words, List<string> result
       ) {
           if (row < 0 || row >= board.Length ||
               column < 0 || column >= board[0].Length) return;
           char letter = board[row][column];
           if (letter == '#') return;
           TrieNode node = parent.Children[letter - 'a'];
           if (node == null) return;
           if (node.WordIndex >= 0) {
               result.Add(words[node.WordIndex]);
               node.WordIndex = -1;
           }
           board[row][column] = '#';
           Dfs(board, row - 1, column, node, words, result);
           Dfs(board, row + 1, column, node, words, result);
           Dfs(board, row, column - 1, node, words, result);
           Dfs(board, row, column + 1, node, words, result);
           board[row][column] = letter;
       }
   }

Julia
~~~~~

.. code-block:: julia

   mutable struct WordTrieNode
       children::Vector{Union{Nothing,WordTrieNode}}
       word_index::Int

       function WordTrieNode()
           children = Union{Nothing,WordTrieNode}[nothing for _ in 1:26]
           new(children, 0)
       end
   end

   function find_words!(board::Matrix{Char}, words::Vector{String})
       isempty(board) && return String[]
       isempty(words) && return String[]

       root = WordTrieNode()
       for (word_index, word) in pairs(words)
           isempty(word) && continue
           current = root
           for byte in codeunits(word)
               index = Int(byte - UInt8('a')) + 1
               child = current.children[index]
               if child === nothing
                   child = WordTrieNode()
                   current.children[index] = child
               end
               current = child::WordTrieNode
           end
           current.word_index == 0 && (current.word_index = word_index)
       end

       rows, columns = size(board)
       result = String[]
       function dfs!(row::Int, column::Int, parent::WordTrieNode)
           if row < 1 || row > rows || column < 1 || column > columns
               return
           end
           letter = board[row, column]
           letter == '#' && return
           index = Int(UInt8(letter) - UInt8('a')) + 1
           child = parent.children[index]
           child === nothing && return
           node = child::WordTrieNode
           if node.word_index != 0
               push!(result, words[node.word_index])
               node.word_index = 0
           end
           board[row, column] = '#'
           dfs!(row - 1, column, node)
           dfs!(row + 1, column, node)
           dfs!(row, column - 1, node)
           dfs!(row, column + 1, node)
           board[row, column] = letter
       end

       for row in 1:rows, column in 1:columns
           dfs!(row, column, root)
       end
       result
   end

Julia 使用一基矩阵索引。函数名带 ``!`` 表明内部临时写棋盘；正常返回前会逐层恢复。

R
~

.. code-block:: r

   new_word_trie_node <- function() {
     node <- new.env(parent = emptyenv())
     node$children <- vector("list", 26L)
     node$word_index <- 0L
     node
   }

   find_words <- function(board, words) {
     if (length(board) == 0L || nrow(board) == 0L || ncol(board) == 0L ||
         length(words) == 0L) {
       return(character(0L))
     }

     root <- new_word_trie_node()
     for (word_index in seq_along(words)) {
       chars <- strsplit(words[[word_index]], "", fixed = TRUE)[[1L]]
       if (length(chars) == 0L) next
       current <- root
       for (letter in chars) {
         index <- utf8ToInt(letter) - utf8ToInt("a") + 1L
         child <- current$children[[index]]
         if (is.null(child)) {
           child <- new_word_trie_node()
           current$children[[index]] <- child
         }
         current <- child
       }
       if (current$word_index == 0L) current$word_index <- word_index
     }

     state <- new.env(parent = emptyenv())
     state$board <- board
     state$result <- character(length(words))
     state$result_count <- 0L
     rows <- nrow(board)
     columns <- ncol(board)

     dfs <- function(row, column, parent) {
       if (row < 1L || row > rows || column < 1L || column > columns) return(NULL)
       letter <- state$board[row, column]
       if (identical(letter, "#")) return(NULL)
       index <- utf8ToInt(letter) - utf8ToInt("a") + 1L
       node <- parent$children[[index]]
       if (is.null(node)) return(NULL)

       if (node$word_index != 0L) {
         state$result_count <- state$result_count + 1L
         state$result[[state$result_count]] <- words[[node$word_index]]
         node$word_index <- 0L
       }

       state$board[row, column] <- "#"
       dfs(row - 1L, column, node)
       dfs(row + 1L, column, node)
       dfs(row, column - 1L, node)
       dfs(row, column + 1L, node)
       state$board[row, column] <- letter
       NULL
     }

     for (row in seq_len(rows)) {
       for (column in seq_len(columns)) {
         dfs(row, column, root)
       }
     }

     if (state$result_count == 0L) {
       character(0L)
     } else {
       state$result[seq_len(state$result_count)]
     }
   }

R 使用 environment 保存 Trie 节点和递归共享状态。``state$board <- board`` 后的子赋值重新绑定 environment 内的矩阵，便携合同是不修改调用者变量；``#`` 不属于官方字符域，可安全作为临时标记。

静态审查记录
------------

本章未运行、未编译、未对拍、未穷举或测试任何题解代码。完成的静态检查包括：

* 人工推演经典棋盘、共享前缀、重复输入、同词多路径、单格重复诱惑、对角线伪路径和空输入；
* 证明 Trie 剪枝只排除不可能前缀，四方向展开覆盖全部合法下一步；
* 证明路径标记实施单格单次使用，递归恢复使兄弟分支与不同起点互不污染；
* 证明清除终止索引只去重，不删除共享节点或更长单词路径；
* 核对所有实现找到短词后仍继续搜索子树；
* 核对 C 事务式 Trie 插入、整树释放、结果字符串复制、失败清理和棋盘恢复；
* 核对 Rust 可变子节点借用与棋盘递归参数；
* 核对 C++/Java/Go/TypeScript/C# 的二维边界和哨兵恢复；
* 核对 Julia/R 一基索引、Julia ASCII ``codeunits`` 和 R environment 共享状态；
* 核对复杂度分开报告 Trie、实际 DFS 状态、递归栈和输出载荷。

剩余风险：十语言实现未经过目标平台编译或执行；递归深度受运行时调用栈限制；固定 26 槽节点的真实字节成本依赖对象布局；C 的 ``NULL/0`` 同时可能表示无结果或资源失败。

关键易错点
----------

* 为每个词独立搜索，却声称已合并前缀工作；
* 允许对角线移动；
* 使用全局 visited，导致格子被永久占用；
* 找到单词后不恢复当前格；
* 找到短词后删除整个 Trie 节点，遗漏长词；
* 不清除终止索引，导致重复输出；
* 清除索引后立即返回，遗漏当前节点下更长词；
* 把复杂度统一写成 ``O(mn)``；
* C 返回指向已释放 Trie 的字符串；
* R 使用普通嵌套列表并假设深层赋值具有共享引用语义。

知识更新与关联题
----------------

* ``0200 Number of Islands``：同为四邻接 DFS，但只处理连通分量；
* ``0208 Implement Trie``：提供路径、终止标记和生命周期基础；
* ``0211 Design Add and Search Words``：Trie 分支搜索，本题把模式位置替换为棋盘坐标与路径访问集合；
* ``0079 Word Search``：只搜索一个单词，不需要 Trie 合并候选前缀；
* ``0425 Word Squares``：Trie 前缀查询与组合搜索，约束不同。

自检问题与答案
--------------

**问题 1：为什么没有 Trie 子链接时可以停止？**

当前棋盘路径已经不是任何输入词前缀；继续追加字符不能修复已不匹配的前缀。

**问题 2：为什么发现单词后不能删除当前节点？**

当前词可能是更长词的前缀。只清空终止索引即可去重，节点和子链接仍供长词使用。

**问题 3：为什么标记必须恢复？**

访问限制只属于当前路径。恢复后兄弟分支和其他起点才能合法再次使用该格。

**问题 4：多条路径如何只输出一次？**

第一次到达终止节点后清空 ``word_index``，后续路径仍可经过节点，但不会再次提交。

**问题 5：为什么粗略上界含 ``4·3^(L-1)``？**

第一步最多四个方向；之后前一格已使用，忽略其他边界时最多剩三个新方向。Trie 剪枝通常显著降低实际工作量。

**问题 6：为什么不会漏掉真实单词路径？**

外层会选择其首格；每个单词前缀都在 Trie 中；DFS 枚举全部合法四邻格，所以会沿路径到达终止节点。
