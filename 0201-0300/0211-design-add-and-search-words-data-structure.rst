0211. Design Add and Search Words Data Structure
================================================

题目信息
--------

:题号: 0211
:难度: Medium
:主题: Trie、通配符、深度优先搜索、设计
:原题: `LeetCode 0211 <https://leetcode.com/problems/design-add-and-search-words-data-structure/>`_
:重点: 点号恰好匹配一个字符、完整单词与前缀、跨调用状态、每个模式最多两个点号

题目重述
--------

设计一个 ``WordDictionary`` 类。``addWord(word)`` 把一个单词加入当前字典；``search(word)`` 判断字典中是否存在某个此前加入的完整单词与查询模式匹配。查询模式中的小写字母只能匹配相同字母，点号 ``.`` 可以匹配任意一个小写英文字母，但必须恰好消费一个字符。

加入的单词和查询模式长度均位于 ``[1, 25]``。``addWord`` 的参数只包含小写英文字母，``search`` 的参数只包含小写英文字母和点号；每个查询模式最多包含两个点号。两种方法的调用总数最多为 ``10^4``。同一个对象必须在连续调用之间保存全部已加入单词；只有匹配到完整单词时才返回 ``true``，仅匹配某个更长单词的前缀不能成立。

自建示例
--------

字母与点号共同匹配：

.. code-block:: text

   输入：依次调用 WordDictionary(), addWord("code"), addWord("cave"), search("c.de"), search("ca.."), search("c..t")
   输出：true, true, false
   解释：c.de 可以匹配 code，ca.. 可以匹配 cave；字典中没有长度为 4 且以 c 开头、以 t 结尾的单词。

前缀不能冒充完整单词：

.. code-block:: text

   输入：依次调用 WordDictionary(), addWord("rain"), search("ra.n"), search("rai")
   输出：true, false
   解释：ra.n 中的点号匹配 i，因此可匹配 rain；rai 只是 rain 的前缀，并未作为完整单词加入。

问题抽象与解法选择
------------------

``addWord`` 使用固定 26 子链接 Trie。``search`` 定义递归状态 ``dfs(node, index)``：
当前位于 ``node``，已经消费模式前缀 ``pattern[0:index]``，需要判断是否能从该节点匹配剩余后缀。

转移规则：

#. ``index == pattern.length``：返回 ``node.is_word``；
#. 当前字符是字母：只递归到对应子链接；链接缺失则返回假；
#. 当前字符是点号：对所有非空子链接递归，只要一个分支返回真就返回真；全部失败才返回假。

.. list-table::
   :header-rows: 1

   * - 方法
     - 添加
     - 搜索
     - 取舍
   * - Trie + 分支 DFS
     - ``O(L)``
     - ``O(M)`` 访问状态
     - 主解法；共享前缀并直接表达点号分支
   * - 保存字符串并逐个模式匹配
     - ``O(1)`` 或 ``O(L)``
     - ``O(WL)``
     - 每次搜索扫描全部单词
   * - 为所有通配模式预生成索引
     - 指数级模式数量
     - 可快
     - 添加成本与存储不可接受

``L`` 是当前字符串或模式长度，``W`` 是字典单词数，``M`` 是本次 DFS 实际访问的 ``(节点,模式位置)`` 状态数。

搜索状态与不变量
----------------

对递归调用 ``dfs(node,index)``，保持：

#. 从根到 ``node`` 的路径长度恰好为 ``index``；
#. 该路径逐位匹配模式前缀 ``pattern[0:index]``；
#. 字母位置使用相同字母边，点号位置使用任意一条存在的字母边；
#. 尚未消费的模式是 ``pattern[index:]``；
#. 搜索只读 Trie，不修改子链接或终止标记；
#. 每次递归都令 ``index`` 增加 1，因此点号恰好消费一个字符；
#. 当 ``index`` 到达模式长度时，只以 ``is_word`` 判定完整单词。

字母分支
~~~~~~~~

若当前字符为 ``c``，任何匹配单词在该位置都必须使用 ``c``。因此只需检查 ``children[c-'a']``；
该链接不存在时，不可能有匹配单词。

点号分支
~~~~~~~~

点号允许当前位置取任意一个小写字母。当前节点全部非空子链接恰好枚举所有可能字符。
对子链接递归时模式位置加一，确保每个分支只匹配一个字符。任一分支成功即可短路返回真。

终止条件
~~~~~~~~

消费完模式时不能仅返回真。当前路径可能只是更长单词的前缀。只有 ``node.is_word=true`` 才表示同长度完整单词存在。

正确性证明
----------

引理一：任何返回真的递归路径都对应一个合法模式匹配前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对 ``index`` 归纳。根节点对应空前缀。字母分支只沿同字母边，保持逐位相等；点号分支只选择一条实际字母边，
符合点号匹配任意单字符的语义。每次只前进一层并消费一位，所以到达的 Trie 路径与模式前缀长度始终相同。

引理二：字母转移不会遗漏匹配单词
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

模式字母 ``c`` 只能匹配单词同位置的 ``c``。Trie 中所有具有当前前缀且下一字符为 ``c`` 的单词都位于唯一的
``c`` 子树中，其他子树不可能匹配。因此只走一个分支既充分又必要。

引理三：点号转移恰好覆盖所有可能字符
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

点号可以匹配 26 个小写字母中的任意一个。算法遍历当前节点所有非空子链接；不存在的链接对应字典中没有该前缀，
无需递归。于是每个可能匹配字符都被覆盖，没有加入题意之外的零字符或多字符选择。

引理四：终止标记恰好区分完整单词
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

当 ``index=L`` 时，递归路径长度也为 ``L``。若 ``is_word=true``，该完整路径曾被加入，得到同长度匹配单词；
若为假，该路径至多是某个更长单词前缀，不能满足合同。

定理：search 返回真当且仅当存在匹配单词
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若算法返回真，存在一条递归路径通过字母或点号规则消费全部模式，并由引理四停在完整词终点，因此该单词匹配模式。
反之，设字典中存在匹配单词。逐位扫描：模式字母时引理二保证算法进入该单词分支；点号时引理三保证该分支被枚举。
最终到达该单词终点，``is_word=true``，算法必有一个分支返回真。充要性成立。

终止性
~~~~~~

每次递归都令 ``index`` 加一，最大深度为模式长度 ``L``。Trie 子链接有限，模式位置有限，搜索必然结束。

真实复杂度
----------

``addWord``
   扫描长度 ``L`` 的单词，时间 ``O(L)``；最多创建 ``L`` 个新节点。Trie 持久存储按总节点数 ``N`` 计，
   固定数组实现约为 ``O(26N)`` 指针槽位。

无点号搜索
   每层只走一个分支，时间 ``O(L)``，递归栈 ``O(L)``。

含点号搜索
   时间按实际访问状态数 ``M`` 计，即 ``O(M)``。在高分支 Trie 和连续点号模式下，``M`` 可接近深度不超过
   ``L`` 的全部可达节点，不能统一声称 ``O(L)``。粗略上界可写成 ``O(26^L)``，同时受实际 Trie 节点数 ``N`` 限制。

搜索额外空间
   递归深度最多 ``L``，调用栈 ``O(L)``；没有复制整棵 Trie。模式在 R 中通过 ``strsplit`` 物化字符向量，
   产生 ``O(L)`` 适配器空间；其他语言的字节或代码单元访问成本按各自实现说明。

C 资源策略
----------

C 平台 ``wordDictionaryAddWord`` 返回 ``void``，不能报告分配失败。本章沿用事务式缺失后缀：

#. 先沿已有路径找到第一个缺失字符；
#. 在主 Trie 外创建完整缺失链；
#. 全部分配成功后标记链尾，并一次把链头接入主树；
#. 任一分配失败时释放临时链，原对象保持不变；
#. ``wordDictionaryFree`` 递归释放全部节点。

该策略保持对象一致性，但调用者仍无法知道某次添加因资源不足没有生效。

C++ 实现
--------

.. code-block:: cpp

   class WordDictionary {
   private:
       struct Node {
           std::array<Node*, 26> child{};
           bool terminal = false;
       };

       Node* root_ = new Node();

       static void release(Node* node) {
           if (node == nullptr) return;
           for (Node* child : node->child) release(child);
           delete node;
       }

       bool match(const Node* node, const std::string& word,
                  std::size_t position) const {
           if (position == word.size()) return node->terminal;

           char character = word[position];
           if (character != '.') {
               int index = character - 'a';
               return node->child[index] != nullptr &&
                      match(node->child[index], word, position + 1);
           }

           for (const Node* child : node->child) {
               if (child != nullptr && match(child, word, position + 1)) {
                   return true;
               }
           }
           return false;
       }

   public:
       WordDictionary() = default;

       ~WordDictionary() { release(root_); }

       void addWord(std::string word) {
           Node* node = root_;
           for (char character : word) {
               int index = character - 'a';
               if (node->child[index] == nullptr) {
                   node->child[index] = new Node();
               }
               node = node->child[index];
           }
           node->terminal = true;
       }

       bool search(std::string word) const {
           return match(root_, word, 0);
       }
   };

代码分析
--------

普通字符查询只有一条可能路径，``.`` 则代表当前位置可以沿任意非空子链接继续。``match(node, position)`` 的状态同时记录 Trie 节点和查询串位置；到达串尾时只有终止标记为真才算完整单词，因而不会把某个单词的前缀误判为答案。

例如加入 ``"bad"``、``"dad"``、``"mad"`` 后，查询 ``".ad"`` 会分别尝试三个首字符并在 ``d`` 节点成功；查询 ``"b.."`` 能匹配 ``bad``，而查询 ``"ba"`` 在到达串尾时发现 ``a`` 不是终止节点，返回假。插入长度为 ``L`` 的单词需要 ``O(L)`` 时间；无通配符搜索为 ``O(L)``，含通配符时最坏会探索 ``26`` 个分支，时间取决于实际 Trie 状态数，粗略上界为 ``O(26^L)``，递归栈为 ``O(L)``。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>

   typedef struct WordNode {
       struct WordNode *children[26];
       bool is_word;
   } WordNode;

   typedef struct {
       WordNode *root;
   } WordDictionary;

   static WordNode *word_node_create(void) {
       return calloc(1, sizeof(WordNode));
   }

   static void word_node_free(WordNode *node) {
       if (node == NULL) return;
       for (int i = 0; i < 26; ++i) word_node_free(node->children[i]);
       free(node);
   }

   WordDictionary *wordDictionaryCreate(void) {
       WordDictionary *dictionary = malloc(sizeof(WordDictionary));
       if (dictionary == NULL) return NULL;
       dictionary->root = word_node_create();
       if (dictionary->root == NULL) {
           free(dictionary);
           return NULL;
       }
       return dictionary;
   }

   void wordDictionaryAddWord(WordDictionary *dictionary, char *word) {
       if (dictionary == NULL || dictionary->root == NULL || word == NULL) return;
       WordNode *current = dictionary->root;
       int position = 0;
       while (word[position] != '\0') {
           const int index = word[position] - 'a';
           if (current->children[index] == NULL) break;
           current = current->children[index];
           ++position;
       }
       if (word[position] == '\0') {
           current->is_word = true;
           return;
       }

       WordNode *chain_head = NULL;
       WordNode *chain_tail = NULL;
       const int attach_index = word[position] - 'a';
       while (word[position] != '\0') {
           WordNode *fresh = word_node_create();
           if (fresh == NULL) {
               word_node_free(chain_head);
               return;
           }
           if (chain_head == NULL) chain_head = fresh;
           else chain_tail->children[word[position] - 'a'] = fresh;
           chain_tail = fresh;
           ++position;
       }
       chain_tail->is_word = true;
       current->children[attach_index] = chain_head;
   }

   static bool search_from(const WordNode *node, const char *pattern, int position) {
       if (node == NULL) return false;
       if (pattern[position] == '\0') return node->is_word;
       if (pattern[position] == '.') {
           for (int i = 0; i < 26; ++i) {
               if (node->children[i] != NULL &&
                   search_from(node->children[i], pattern, position + 1)) {
                   return true;
               }
           }
           return false;
       }
       const int index = pattern[position] - 'a';
       return search_from(node->children[index], pattern, position + 1);
   }

   bool wordDictionarySearch(WordDictionary *dictionary, char *word) {
       return dictionary != NULL && dictionary->root != NULL && word != NULL &&
           search_from(dictionary->root, word, 0);
   }

   void wordDictionaryFree(WordDictionary *dictionary) {
       if (dictionary == NULL) return;
       word_node_free(dictionary->root);
       free(dictionary);
   }

C++
~~~

.. code-block:: cpp

   #include <array>
   #include <memory>
   #include <string>

   class WordDictionary {
       struct Node {
           std::array<std::unique_ptr<Node>, 26> children{};
           bool is_word = false;
       };
       Node root;

       static bool searchFrom(const Node* node, const std::string& pattern, std::size_t pos) {
           if (pos == pattern.size()) return node->is_word;
           const char ch = pattern[pos];
           if (ch == '.') {
               for (const auto& child : node->children) {
                   if (child && searchFrom(child.get(), pattern, pos + 1)) return true;
               }
               return false;
           }
           const auto& child = node->children[static_cast<std::size_t>(ch - 'a')];
           return child && searchFrom(child.get(), pattern, pos + 1);
       }

   public:
       void addWord(const std::string& word) {
           Node* current = &root;
           for (char ch : word) {
               auto& child = current->children[static_cast<std::size_t>(ch - 'a')];
               if (!child) child = std::make_unique<Node>();
               current = child.get();
           }
           current->is_word = true;
       }

       bool search(const std::string& word) const {
           return searchFrom(&root, word, 0);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Node:
       def __init__(self) -> None:
           self.children: list[Node | None] = [None] * 26
           self.is_word = False

   class WordDictionary:
       def __init__(self) -> None:
           self.root = Node()

       def addWord(self, word: str) -> None:
           current = self.root
           for ch in word:
               index = ord(ch) - ord("a")
               if current.children[index] is None:
                   current.children[index] = Node()
               current = current.children[index]
           current.is_word = True

       def search(self, word: str) -> bool:
           def dfs(node: Node, position: int) -> bool:
               if position == len(word):
                   return node.is_word
               ch = word[position]
               if ch == ".":
                   return any(child is not None and dfs(child, position + 1)
                              for child in node.children)
               child = node.children[ord(ch) - ord("a")]
               return child is not None and dfs(child, position + 1)
           return dfs(self.root, 0)

Java
~~~~

.. code-block:: java

   class WordDictionary {
       private static final class Node {
           Node[] children = new Node[26];
           boolean isWord;
       }

       private final Node root = new Node();

       public void addWord(String word) {
           Node current = root;
           for (int i = 0; i < word.length(); ++i) {
               int index = word.charAt(i) - 'a';
               if (current.children[index] == null) current.children[index] = new Node();
               current = current.children[index];
           }
           current.isWord = true;
       }

       public boolean search(String word) {
           return searchFrom(root, word, 0);
       }

       private boolean searchFrom(Node node, String pattern, int position) {
           if (position == pattern.length()) return node.isWord;
           char ch = pattern.charAt(position);
           if (ch == '.') {
               for (Node child : node.children) {
                   if (child != null && searchFrom(child, pattern, position + 1)) return true;
               }
               return false;
           }
           Node child = node.children[ch - 'a'];
           return child != null && searchFrom(child, pattern, position + 1);
       }
   }

Rust
~~~~

.. code-block:: rust

   struct Node {
       children: [Option<Box<Node>>; 26],
       is_word: bool,
   }

   impl Node {
       fn new() -> Self {
           Self { children: std::array::from_fn(|_| None), is_word: false }
       }
   }

   struct WordDictionary {
       root: Node,
   }

   impl WordDictionary {
       fn new() -> Self { Self { root: Node::new() } }

       fn add_word(&mut self, word: String) {
           let mut current = &mut self.root;
           for byte in word.bytes() {
               let index = (byte - b'a') as usize;
               current = current.children[index]
                   .get_or_insert_with(|| Box::new(Node::new()));
           }
           current.is_word = true;
       }

       fn search(&self, word: String) -> bool {
           fn dfs(node: &Node, pattern: &[u8], position: usize) -> bool {
               if position == pattern.len() { return node.is_word; }
               if pattern[position] == b'.' {
                   return node.children.iter().any(|child| {
                       child.as_deref().is_some_and(|next| dfs(next, pattern, position + 1))
                   });
               }
               let index = (pattern[position] - b'a') as usize;
               node.children[index].as_deref()
                   .is_some_and(|next| dfs(next, pattern, position + 1))
           }
           dfs(&self.root, word.as_bytes(), 0)
       }
   }

Go
~~

.. code-block:: go

   type wordNode struct {
       children [26]*wordNode
       isWord   bool
   }

   type WordDictionary struct {
       root *wordNode
   }

   func Constructor() WordDictionary {
       return WordDictionary{root: &wordNode{}}
   }

   func (dictionary *WordDictionary) AddWord(word string) {
       current := dictionary.root
       for i := 0; i < len(word); i++ {
           index := int(word[i] - 'a')
           if current.children[index] == nil { current.children[index] = &wordNode{} }
           current = current.children[index]
       }
       current.isWord = true
   }

   func (dictionary *WordDictionary) Search(word string) bool {
       var dfs func(*wordNode, int) bool
       dfs = func(node *wordNode, position int) bool {
           if position == len(word) { return node.isWord }
           if word[position] == '.' {
               for _, child := range node.children {
                   if child != nil && dfs(child, position+1) { return true }
               }
               return false
           }
           child := node.children[int(word[position]-'a')]
           return child != nil && dfs(child, position+1)
       }
       return dfs(dictionary.root, 0)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   class WordNode {
       children: Array<WordNode | null> = new Array(26).fill(null);
       isWord = false;
   }

   class WordDictionary {
       private readonly root = new WordNode();

       addWord(word: string): void {
           let current = this.root;
           for (let i = 0; i < word.length; i += 1) {
               const index = word.charCodeAt(i) - 97;
               if (current.children[index] === null) current.children[index] = new WordNode();
               current = current.children[index] as WordNode;
           }
           current.isWord = true;
       }

       search(word: string): boolean {
           const dfs = (node: WordNode, position: number): boolean => {
               if (position === word.length) return node.isWord;
               const code = word.charCodeAt(position);
               if (code === 46) {
                   return node.children.some(child => child !== null && dfs(child, position + 1));
               }
               const child = node.children[code - 97];
               return child !== null && dfs(child, position + 1);
           };
           return dfs(this.root, 0);
       }
   }

C#
~~

.. code-block:: csharp

   public class WordDictionary {
       private sealed class Node {
           public readonly Node[] Children = new Node[26];
           public bool IsWord;
       }

       private readonly Node root = new Node();

       public void AddWord(string word) {
           Node current = root;
           foreach (char ch in word) {
               int index = ch - 'a';
               if (current.Children[index] == null) current.Children[index] = new Node();
               current = current.Children[index];
           }
           current.IsWord = true;
       }

       public bool Search(string word) => SearchFrom(root, word, 0);

       private static bool SearchFrom(Node node, string pattern, int position) {
           if (position == pattern.Length) return node.IsWord;
           char ch = pattern[position];
           if (ch == '.') {
               foreach (Node child in node.Children) {
                   if (child != null && SearchFrom(child, pattern, position + 1)) return true;
               }
               return false;
           }
           Node next = node.Children[ch - 'a'];
           return next != null && SearchFrom(next, pattern, position + 1);
       }
   }

Julia
~~~~~

.. code-block:: julia

   mutable struct WordNode
       children::Vector{Union{Nothing, WordNode}}
       is_word::Bool
   end

   WordNode() = WordNode(Union{Nothing, WordNode}[nothing for _ in 1:26], false)

   mutable struct WordDictionary
       root::WordNode
   end

   WordDictionary() = WordDictionary(WordNode())

   function add_word!(dictionary::WordDictionary, word::String)
       current = dictionary.root
       for byte in codeunits(word)
           index = Int(byte - UInt8('a')) + 1
           child = current.children[index]
           if child === nothing
               child = WordNode()
               current.children[index] = child
           end
           current = child::WordNode
       end
       current.is_word = true
       return nothing
   end

   function search_word(dictionary::WordDictionary, pattern::String)::Bool
       bytes = codeunits(pattern)
       function dfs(node::WordNode, position::Int)::Bool
           position > length(bytes) && return node.is_word
           byte = bytes[position]
           if byte == UInt8('.')
               for child in node.children
                   child !== nothing && dfs(child::WordNode, position + 1) && return true
               end
               return false
           end
           index = Int(byte - UInt8('a')) + 1
           child = node.children[index]
           return child !== nothing && dfs(child::WordNode, position + 1)
       end
       return dfs(dictionary.root, 1)
   end

R
~

.. code-block:: r

   new_word_node <- function() {
     node <- new.env(parent = emptyenv())
     node$children <- vector("list", 26L)
     node$is_word <- FALSE
     node
   }

   new_word_dictionary <- function() {
     dictionary <- new.env(parent = emptyenv())
     dictionary$root <- new_word_node()
     dictionary
   }

   add_word <- function(dictionary, word) {
     chars <- strsplit(word, "", fixed = TRUE)[[1L]]
     current <- dictionary$root
     if (length(chars) > 0L) {
       for (ch in chars) {
         index <- utf8ToInt(ch) - utf8ToInt("a") + 1L
         child <- current$children[[index]]
         if (is.null(child)) {
           child <- new_word_node()
           current$children[[index]] <- child
         }
         current <- child
       }
     }
     current$is_word <- TRUE
     invisible(NULL)
   }

   search_word <- function(dictionary, pattern) {
     chars <- strsplit(pattern, "", fixed = TRUE)[[1L]]
     dfs <- function(node, position) {
       if (position > length(chars)) return(isTRUE(node$is_word))
       ch <- chars[[position]]
       if (identical(ch, ".")) {
         for (child in node$children) {
           if (!is.null(child) && dfs(child, position + 1L)) return(TRUE)
         }
         return(FALSE)
       }
       index <- utf8ToInt(ch) - utf8ToInt("a") + 1L
       child <- node$children[[index]]
       !is.null(child) && dfs(child, position + 1L)
     }
     dfs(dictionary$root, 1L)
   }

静态审查记录
------------

本章未运行、未编译、未对拍或测试任何题解代码。完成的静态检查包括：

* 人工推演 ``bad/dad/mad``、``pad``、``bad``、``.ad``、``b..``、连续点号、仅前缀、重复插入和空串扩展；
* 证明字母分支只覆盖相同字母、点号分支恰好覆盖一个任意字符、终止标记区分完整单词；
* 核对所有语言在每次递归时只消费一个模式字符；
* 核对含点号搜索按实际访问节点数报告，而非统一写成 ``O(L)``；
* 核对 C 的事务式插入、临时链失败释放、递归搜索和整树释放；
* 核对 Rust ``Box`` 所有权、Julia 可变节点、R environment 共享变异和托管语言对象回收；
* 核对 Julia ``codeunits`` 是包装视图，R ``strsplit`` 物化模式字符向量；
* 核对查询只读 Trie，重复加入不复制已有路径。

剩余风险：题解未经过目标平台编译或执行；C 的 ``void`` 添加接口不能报告资源失败；
递归实现受语言调用栈限制，运行时对象和固定 26 槽位的真实字节成本依赖平台。

关键易错点
----------

* 把点号当成可匹配零个或任意多个字符；
* 遇到点号只尝试第一个子链接；
* 模式消费完后直接返回真，不检查 ``is_word``；
* 对普通字母也遍历全部 26 个分支；
* 把所有搜索复杂度都写成 ``O(L)``；
* 添加单词时把每个前缀节点都标记为完整词；
* C 分配失败后留下半条路径，或不释放整棵 Trie；
* R 使用普通列表节点并假设深层赋值自动共享到调用者，而没有 environment 引用语义。

知识更新与关联题
----------------

* ``0208 Implement Trie``：提供路径、终止标记和对象生命周期基础；
* ``0211`` 新增模式位置递归状态、点号分支完备性和实际访问规模分析；
* ``0212 Word Search II``：把 Trie 与棋盘 DFS、路径剪枝结合；
* ``0044 Wildcard Matching``：``?`` 与 ``*`` 的字符串模式语义不同，不能套用本题点号规则；
* ``0010 Regular Expression Matching``：点号还与 ``*`` 组合，状态空间更复杂。

自检问题与答案
--------------

**问题 1：为什么点号递归必须把位置加一？**

点号匹配恰好一个字符。选择一条子边后已经消费了一个 Trie 字符和一个模式字符。

**问题 2：为什么模式结束还要检查 is_word？**

当前路径可能只是更长已加入单词的前缀；只有终止标记能证明同长度完整单词存在。

**问题 3：含点号搜索为什么不一定是 O(L)？**

每个点号可能展开多个子树，搜索会访问许多不同节点；时间应按实际访问状态数 ``M`` 计算。

**问题 4：为什么不需要 memo？**

Trie 是树，同一根到节点路径唯一；固定模式位置由节点深度决定，同一个 ``(节点,位置)`` 不会经不同路径重复到达。

**问题 5：C 的事务式插入解决了什么？**

它保证中途分配失败时不把半条新路径接入主树，使字典保持添加前的一致状态。
