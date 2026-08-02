0208. Implement Trie (Prefix Tree)
==================================

题目信息
--------

:题号: 0208
:难度: Medium
:主题: Trie、前缀树、设计、字符串
:原题: `LeetCode 0208 <https://leetcode.com/problems/implement-trie-prefix-tree/>`_
:重点: 完整单词与前缀的区别、跨调用保存状态、共享前缀、小写字母字符域

题目重述
--------

设计一个 ``Trie``（前缀树）类。构造函数创建空对象；``insert(word)`` 把单词加入当前对象；``search(word)`` 仅在该完整单词此前被插入时返回 ``true``；``startsWith(prefix)`` 在至少有一个已插入单词以 ``prefix`` 开头时返回 ``true``。

``word`` 和 ``prefix`` 均只包含小写英文字母，长度位于 ``[1, 2000]``。对 ``insert``、``search`` 和 ``startsWith`` 的调用总数最多为 ``3 * 10^4``。同一个对象必须在连续调用之间保留全部插入结果；存在一条字符路径不等于该路径对应的字符串已经作为完整单词插入。

自建示例
--------

前缀存在但完整单词尚未插入：

.. code-block:: text

   输入：依次调用 Trie(), insert("stone"), search("sto"), startsWith("sto"), insert("sto"), search("sto")
   输出：false, true, true
   解释：插入 stone 后，sto 只是一条已有前缀路径；单独插入 sto 后，它的完整单词查询才返回 true。

共享前缀与缺失分支：

.. code-block:: text

   输入：依次调用 Trie(), insert("steam"), insert("step"), startsWith("ste"), search("stem")
   输出：true, false
   解释：两个已插入单词共享 ste 前缀，但路径 stem 并未作为完整单词插入。

问题抽象与解法选择
------------------

Trie 把一组字符串压缩为共享前缀的有根树。一个长度为 ``L`` 的操作只沿一条最多 ``L`` 层的路径移动：

* 插入时，缺哪个字符节点就创建哪个节点；
* 完整单词查询时，先确认整条路径存在，再检查终点 ``is_word``；
* 前缀查询时，只确认整条路径存在。

.. list-table::
   :header-rows: 1

   * - 方法
     - 单次操作时间
     - 总存储
     - 取舍
   * - 固定 26 子链接 Trie
     - ``O(L)``
     - ``O(26N)``
     - 主解法；字符下标直接，常数大但语义清晰
   * - 哈希子链接 Trie
     - 平均 ``O(L)``
     - ``O(N+E)``
     - 稀疏节点更省空间，但哈希常数与最坏界更复杂
   * - 线性字符串列表
     - 插入 ``O(1)`` 或 ``O(L)``
     - ``O(S)``
     - 查询可能扫描全部单词，不能体现前缀索引
   * - 排序数组加二分
     - 查询约 ``O(L log W)``
     - ``O(S)``
     - 静态集合可用，动态插入和对象操作合同不自然

这里 ``L`` 是当前参数长度，``N`` 是创建的 Trie 节点总数，``E=N-1`` 是实际子链接数量，
``S`` 是全部单词字符总量，``W`` 是单词数量。固定数组每个节点都保留 26 个槽位，所以实际内存常数不可忽略。

路径不变量
----------

设某个节点 ``v`` 从根可由字符序列 ``p`` 到达。任何已完成操作之后保持：

#. 从根到 ``v`` 的唯一路径标签恰好是 ``p``；
#. 每条非空子链接都对应父路径再追加一个确定字符；
#. 对非空 ``p``，Trie 中存在路径当且仅当 ``p`` 是某个成功插入单词的前缀；根节点对应的空路径始终存在；
#. ``v.is_word=true``，当且仅当完整字符串 ``p`` 曾成功插入；
#. 两个单词的公共前缀只对应一组共享节点，不因重复插入复制；
#. 查询操作不修改节点、子链接或终止标记。

根节点对应空前缀。题目合法的 ``prefix`` 非空，因此正式调用不会查询 ``startsWith("")``；若把 API 扩展到空前缀，
根节点始终存在，``startsWith("")`` 可定义为真，而根的 ``is_word`` 只有在允许并插入空串时才为真。

插入的状态变化
--------------

扫描字符 ``word[0], word[1], ...``，令 ``current`` 指向当前前缀节点：

#. 若对应子链接存在，沿链接继续；
#. 若链接缺失，创建初始化为“全部子链接为空、``is_word=false``”的新节点并连接；
#. 扫描结束后，只把终点 ``is_word`` 设为真。

中间节点不能全部标记为单词。例如插入 ``apple`` 时，``a``、``ap``、``app`` 和 ``appl`` 都只是前缀，
除非它们各自也被单独插入。

C 的事务式缺失后缀
~~~~~~~~~~~~~~~~~~

C 平台的 ``trieInsert`` 返回 ``void``，无法向调用者报告内存分配失败。若边扫描边把新节点接入主树，
中途失败会留下半条新路径，既没有形成目标单词，又改变了对象状态。

本章 C 适配器先找到第一个缺失字符，再在主树之外构造整条缺失后缀链：

#. 全部节点分配成功后，给链尾设置 ``is_word=true``；
#. 最后一步才把链头接到第一个缺失子链接；
#. 任一分配失败时释放尚未接入的链，原 Trie 完全不变；
#. 若整条路径本来就存在，只更新原终点标记，不需要分配。

这样 ``void`` 接口虽然仍无法告诉调用者“本次插入因资源不足未生效”，至少保证对象不会停留在半插入状态。

查询状态
--------

两种查询先执行同一个 ``walk(text)``：

* 从根开始逐字符寻找子链接；
* 任一链接缺失立即返回“路径不存在”；
* 全部字符走完后返回终点节点。

随后：

.. code-block:: text

   search(word)     = path_exists(word) AND terminal(word)
   startsWith(pref) = path_exists(pref)

这就是两种查询唯一的语义差别。

正确性证明
----------

引理一：成功插入后，新建路径与单词前缀一一对应
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对扫描字符数归纳。开始时 ``current`` 是根，对应空前缀。假设扫描前 ``i`` 个字符后，
``current`` 对应前缀 ``word[0:i]``。处理第 ``i`` 个字符时，算法沿已有的该字符子链接，
或创建并连接唯一的该字符子节点。新节点路径标签恰好是旧前缀再追加当前字符，
所以到达节点对应 ``word[0:i+1]``。归纳得到每个扫描位置都与对应前缀一致。

引理二：插入不会破坏既有单词
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

插入只会把空子链接变为新节点，或复用已有链接；不会删除、替换已有节点，也不会把任何 ``is_word=true`` 改为假。
因此此前单词的完整路径与终止标记保持不变。共享前缀上的节点被复用，其他分支不受影响。

引理三：插入结束后，且仅有目标终点被确认为完整单词
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

根据引理一，扫描结束时 ``current`` 对应完整 ``word``。算法把该节点 ``is_word`` 设为真，
所以目标单词可被完整查询。扫描中的中间节点没有被设置终止标记，因此仅作为路径出现的真前缀不会被误认成单词。
重复插入只重复写入同一个真值，语义不变。

引理四：``walk(text)`` 成功当且仅当 Trie 中存在该前缀路径
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若 ``walk`` 成功，它按每个字符依次经过非空链接，得到标签为 ``text`` 的路径。反过来，若路径存在，
每个对应子链接都非空，``walk`` 不会提前失败并最终到达路径终点。因此成功与路径存在等价。

引理五：``search`` 返回值正确
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理四，路径缺失时该字符串不可能已插入，返回假正确。路径存在时，由路径不变量与引理三，
终点 ``is_word`` 当且仅当完整字符串曾成功插入。因此 ``search`` 的路径检查加终止标记是充要条件。

引理六：``startsWith`` 返回值正确
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理四，路径存在当且仅当该字符序列是某个已插入单词的前缀；前缀本身是否是完整单词与题意无关。
所以 ``startsWith`` 只检查路径存在恰好满足合同。

定理：三种操作在任意合法调用序列中保持 Trie 合同
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

初始根节点满足路径不变量。引理一至三说明每次成功插入保持不变量并加入且只加入目标完整单词；
引理五和六说明两类查询在该状态上返回准确结果，且查询不变异状态。对调用次数归纳，
任意操作序列都满足合同。C 中失败的事务式插入不接入临时链，等价于该次操作未生效，也保持旧状态一致。

终止性
~~~~~~

每次操作都扫描有限长度字符串，每轮至少消费一个字符。节点构造和路径查询没有回退；
C 释放函数在有限节点树上递归访问每个节点一次，因此全部操作终止。

复杂度与资源成本
----------------

设当前操作字符串长度为 ``L``，Trie 当前共有 ``N`` 个节点：

* ``insert``、``search`` 与 ``startsWith`` 都扫描每个字符一次，时间 ``O(L)``；
* 单次成功插入最多创建 ``L`` 个节点，新增持久空间 ``O(L)``；
* 全部 Trie 的固定数组节点保存 ``26N`` 个子链接槽和 ``N`` 个终止标记，渐近空间 ``O(N)``，实际常数接近 26 个指针/引用槽每节点；
* 查询核心额外空间 ``O(1)``；没有递归搜索；
* C 事务式插入在提交前暂存最多 ``L`` 个新节点，失败时释放，成功后这些节点成为持久结构；
* C 的递归 ``trieFree`` 使用 ``O(H)`` 调用栈，``H`` 是最长路径长度；平台签名没有独立分配错误通道；
* C++ 的 ``unique_ptr``、Rust 的 ``Box`` 与托管语言对象引用都让每个实际节点独立分配，分配器和对象头会增加常数成本；
* Julia ``codeunits`` 返回字符串代码单元视图，不物化 ``O(L)`` 副本；官方 ASCII 下一个字节就是一个字符；
* R 每次调用 ``utf8ToInt`` 会物化 ``O(L)`` 整数向量，因此其适配器额外和峰值空间为 ``O(L)``，不只是路径游标的 ``O(1)``；
* R 用 environment 作为共享可变节点，修改子链接和终止标记对持有同一 Trie 根的调用者可见。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>

   typedef struct Trie {
       struct Trie *children[26];
       bool is_word;
   } Trie;

   void trieFree(Trie *obj);

   Trie *trieCreate(void) {
       return (Trie *)calloc(1, sizeof(Trie));
   }

   static Trie *trieWalk(Trie *obj, const char *text) {
       Trie *current = obj;

       if (current == NULL || text == NULL) {
           return NULL;
       }

       while (*text != '\0') {
           const int index = *text - 'a';
           current = current->children[index];
           if (current == NULL) {
               return NULL;
           }
           ++text;
       }

       return current;
   }

   void trieInsert(Trie *obj, char *word) {
       Trie *current = obj;
       const char *cursor = word;

       if (current == NULL || cursor == NULL) {
           return;
       }

       while (*cursor != '\0') {
           const int index = *cursor - 'a';
           if (current->children[index] == NULL) {
               break;
           }
           current = current->children[index];
           ++cursor;
       }

       if (*cursor == '\0') {
           current->is_word = true;
           return;
       }

       const char *build = cursor;
       Trie *chain_head = NULL;
       Trie *chain_tail = NULL;

       while (*build != '\0') {
           const int index = *build - 'a';
           Trie *node = (Trie *)calloc(1, sizeof(Trie));

           if (node == NULL) {
               trieFree(chain_head);
               return;
           }

           if (chain_head == NULL) {
               chain_head = node;
           } else {
               chain_tail->children[index] = node;
           }
           chain_tail = node;
           ++build;
       }

       chain_tail->is_word = true;
       current->children[*cursor - 'a'] = chain_head;
   }

   bool trieSearch(Trie *obj, char *word) {
       Trie *node = trieWalk(obj, word);
       return node != NULL && node->is_word;
   }

   bool trieStartsWith(Trie *obj, char *prefix) {
       return trieWalk(obj, prefix) != NULL;
   }

   void trieFree(Trie *obj) {
       if (obj == NULL) {
           return;
       }

       for (int index = 0; index < 26; ++index) {
           trieFree(obj->children[index]);
       }
       free(obj);
   }

C++ 
~~~

.. code-block:: cpp

   #include <array>
   #include <memory>
   #include <string>

   class Trie {
   private:
       struct Node {
           std::array<std::unique_ptr<Node>, 26> children{};
           bool is_word = false;
       };

       Node root_;

       const Node* walk(const std::string& text) const {
           const Node* current = &root_;
           for (const char character : text) {
               const std::size_t index =
                   static_cast<std::size_t>(character - 'a');
               if (!current->children[index]) {
                   return nullptr;
               }
               current = current->children[index].get();
           }
           return current;
       }

   public:
       Trie() = default;

       void insert(const std::string& word) {
           Node* current = &root_;
           for (const char character : word) {
               const std::size_t index =
                   static_cast<std::size_t>(character - 'a');
               if (!current->children[index]) {
                   current->children[index] = std::make_unique<Node>();
               }
               current = current->children[index].get();
           }
           current->is_word = true;
       }

       bool search(const std::string& word) const {
           const Node* node = walk(word);
           return node != nullptr && node->is_word;
       }

       bool startsWith(const std::string& prefix) const {
           return walk(prefix) != nullptr;
       }
   };

Python
~~~~~~

.. code-block:: python

   class TrieNode:
       def __init__(self) -> None:
           self.children: list[TrieNode | None] = [None] * 26
           self.is_word = False


   class Trie:
       def __init__(self) -> None:
           self.root = TrieNode()

       @staticmethod
       def _index(character: str) -> int:
           return ord(character) - ord("a")

       def insert(self, word: str) -> None:
           current = self.root
           for character in word:
               index = self._index(character)
               child = current.children[index]
               if child is None:
                   child = TrieNode()
                   current.children[index] = child
               current = child
           current.is_word = True

       def _walk(self, text: str) -> TrieNode | None:
           current = self.root
           for character in text:
               child = current.children[self._index(character)]
               if child is None:
                   return None
               current = child
           return current

       def search(self, word: str) -> bool:
           node = self._walk(word)
           return node is not None and node.is_word

       def startsWith(self, prefix: str) -> bool:
           return self._walk(prefix) is not None

Java
~~~~

.. code-block:: java

   class Trie {
       private static final class Node {
           private final Node[] children = new Node[26];
           private boolean isWord;
       }

       private final Node root;

       public Trie() {
           root = new Node();
       }

       public void insert(String word) {
           Node current = root;
           for (int position = 0; position < word.length(); ++position) {
               int index = word.charAt(position) - 'a';
               if (current.children[index] == null) {
                   current.children[index] = new Node();
               }
               current = current.children[index];
           }
           current.isWord = true;
       }

       private Node walk(String text) {
           Node current = root;
           for (int position = 0; position < text.length(); ++position) {
               int index = text.charAt(position) - 'a';
               current = current.children[index];
               if (current == null) {
                   return null;
               }
           }
           return current;
       }

       public boolean search(String word) {
           Node node = walk(word);
           return node != null && node.isWord;
       }

       public boolean startsWith(String prefix) {
           return walk(prefix) != null;
       }
   }

Rust
~~~~

.. code-block:: rust

   struct TrieNode {
       children: [Option<Box<TrieNode>>; 26],
       is_word: bool,
   }

   impl TrieNode {
       fn new() -> Self {
           Self {
               children: std::array::from_fn(|_| None),
               is_word: false,
           }
       }
   }

   struct Trie {
       root: TrieNode,
   }

   impl Trie {
       fn new() -> Self {
           Self {
               root: TrieNode::new(),
           }
       }

       fn insert(&mut self, word: String) {
           let mut current = &mut self.root;

           for byte in word.bytes() {
               let index = (byte - b'a') as usize;
               current = current.children[index]
                   .get_or_insert_with(|| Box::new(TrieNode::new()))
                   .as_mut();
           }

           current.is_word = true;
       }

       fn walk(&self, text: &str) -> Option<&TrieNode> {
           let mut current = &self.root;

           for byte in text.bytes() {
               let index = (byte - b'a') as usize;
               current = current.children[index].as_deref()?;
           }

           Some(current)
       }

       fn search(&self, word: String) -> bool {
           self.walk(&word).map_or(false, |node| node.is_word)
       }

       fn starts_with(&self, prefix: String) -> bool {
           self.walk(&prefix).is_some()
       }
   }

Go
~~

.. code-block:: go

   type trieNode struct {
       children [26]*trieNode
       isWord   bool
   }

   type Trie struct {
       root *trieNode
   }

   func Constructor() Trie {
       return Trie{root: &trieNode{}}
   }

   func (trie *Trie) Insert(word string) {
       current := trie.root

       for index := 0; index < len(word); index++ {
           childIndex := int(word[index] - 'a')
           if current.children[childIndex] == nil {
               current.children[childIndex] = &trieNode{}
           }
           current = current.children[childIndex]
       }

       current.isWord = true
   }

   func (trie *Trie) walk(text string) *trieNode {
       current := trie.root

       for index := 0; index < len(text); index++ {
           childIndex := int(text[index] - 'a')
           current = current.children[childIndex]
           if current == nil {
               return nil
           }
       }

       return current
   }

   func (trie *Trie) Search(word string) bool {
       node := trie.walk(word)
       return node != nil && node.isWord
   }

   func (trie *Trie) StartsWith(prefix string) bool {
       return trie.walk(prefix) != nil
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   class TrieNode {
       public readonly children: Array<TrieNode | null>;
       public isWord: boolean;

       constructor() {
           this.children = Array<TrieNode | null>(26).fill(null);
           this.isWord = false;
       }
   }

   class Trie {
       private readonly root: TrieNode;

       constructor() {
           this.root = new TrieNode();
       }

       insert(word: string): void {
           let current = this.root;

           for (let position = 0; position < word.length; position++) {
               const index = word.charCodeAt(position) - 97;
               let child = current.children[index];

               if (child === null) {
                   child = new TrieNode();
                   current.children[index] = child;
               }
               current = child;
           }

           current.isWord = true;
       }

       private walk(text: string): TrieNode | null {
           let current = this.root;

           for (let position = 0; position < text.length; position++) {
               const index = text.charCodeAt(position) - 97;
               const child = current.children[index];

               if (child === null) {
                   return null;
               }
               current = child;
           }

           return current;
       }

       search(word: string): boolean {
           const node = this.walk(word);
           return node !== null && node.isWord;
       }

       startsWith(prefix: string): boolean {
           return this.walk(prefix) !== null;
       }
   }

C#
~~

.. code-block:: csharp

   public class Trie {
       private sealed class TrieNode {
           public readonly TrieNode[] Children = new TrieNode[26];
           public bool IsWord;
       }

       private readonly TrieNode root = new TrieNode();

       public Trie() {
       }

       public void Insert(string word) {
           TrieNode current = root;

           for (int position = 0; position < word.Length; ++position) {
               int index = word[position] - 'a';
               if (current.Children[index] == null) {
                   current.Children[index] = new TrieNode();
               }
               current = current.Children[index];
           }

           current.IsWord = true;
       }

       private TrieNode Walk(string text) {
           TrieNode current = root;

           for (int position = 0; position < text.Length; ++position) {
               int index = text[position] - 'a';
               current = current.Children[index];
               if (current == null) {
                   return null;
               }
           }

           return current;
       }

       public bool Search(string word) {
           TrieNode node = Walk(word);
           return node != null && node.IsWord;
       }

       public bool StartsWith(string prefix) {
           return Walk(prefix) != null;
       }
   }

Julia
~~~~~

.. code-block:: julia

   mutable struct TrieNode
       children::Vector{Union{Nothing, TrieNode}}
       is_word::Bool
   end

   function TrieNode()
       children = Union{Nothing, TrieNode}[nothing for _ in 1:26]
       TrieNode(children, false)
   end

   mutable struct Trie
       root::TrieNode
   end

   Trie() = Trie(TrieNode())

   function char_index(byte::UInt8)::Int
       Int(byte) - Int(codeunit("a", 1)) + 1
   end

   function insert!(trie::Trie, word::AbstractString)::Nothing
       current = trie.root

       for byte in codeunits(word)
           index = char_index(byte)
           child = current.children[index]

           if isnothing(child)
               child = TrieNode()
               current.children[index] = child
           end
           current = child::TrieNode
       end

       current.is_word = true
       nothing
   end

   function walk(trie::Trie, text::AbstractString)::Union{Nothing, TrieNode}
       current = trie.root

       for byte in codeunits(text)
           child = current.children[char_index(byte)]
           if isnothing(child)
               return nothing
           end
           current = child::TrieNode
       end

       current
   end

   function search(trie::Trie, word::AbstractString)::Bool
       node = walk(trie, word)
       !isnothing(node) && (node::TrieNode).is_word
   end

   function starts_with(trie::Trie, prefix::AbstractString)::Bool
       !isnothing(walk(trie, prefix))
   end

R
~

.. code-block:: r

   new_trie_node <- function() {
     node <- new.env(parent = emptyenv())
     node$children <- vector("list", 26L)
     node$is_word <- FALSE
     node
   }

   new_trie <- function() {
     list(root = new_trie_node())
   }

   trie_codes <- function(text) {
     utf8ToInt(text)
   }

   trie_insert <- function(trie, word) {
     current <- trie$root
     codes <- trie_codes(word)
     a_code <- utf8ToInt("a")[[1L]]

     for (code in codes) {
       index <- code - a_code + 1L
       child <- current$children[[index]]

       if (is.null(child)) {
         child <- new_trie_node()
         current$children[[index]] <- child
       }
       current <- child
     }

     current$is_word <- TRUE
     invisible(NULL)
   }

   trie_walk <- function(trie, text) {
     current <- trie$root
     codes <- trie_codes(text)
     a_code <- utf8ToInt("a")[[1L]]

     for (code in codes) {
       index <- code - a_code + 1L
       current <- current$children[[index]]
       if (is.null(current)) {
         return(NULL)
       }
     }

     current
   }

   trie_search <- function(trie, word) {
     node <- trie_walk(trie, word)
     !is.null(node) && isTRUE(node$is_word)
   }

   trie_starts_with <- function(trie, prefix) {
     !is.null(trie_walk(trie, prefix))
   }

语言静态核对
------------

C
   ``Trie`` 同时承担根和普通节点；``calloc`` 把全部子链接与 ``is_word`` 初始化为零。事务式后缀只在完整分配后接入，
   失败会释放未接入链。``trieFree`` 释放完整对象图，但递归深度等于最长单词长度。

C++
   ``unique_ptr`` 表达子节点唯一所有权，父节点析构会递归释放整个子树。查询通过 ``const Node*`` 保证只读。

Python
   列表中保存节点对象引用。类型注解不改变运行时语义；对象图由垃圾回收器管理。

Java
   26 项数组默认填充 ``null``。内部节点类不捕获外部 ``Trie`` 实例，避免每个节点额外保存隐式外部引用。

Rust
   ``Option<Box<TrieNode>>`` 表达“链接缺失/唯一拥有子节点”；``get_or_insert_with`` 只在缺失时分配。
   ``walk`` 返回借用，不复制节点。``String`` 按值传入会移动字符串所有权，不会复制其缓冲区。

Go
   字符串按字节索引，符合官方小写 ASCII。数组字段随节点零值初始化，垃圾回收器管理节点生命周期。

TypeScript
   ``charCodeAt`` 在官方 ASCII 域内得到稳定 ``0..25`` 下标。数组是对象引用容器，节点和槽位都由运行时回收。

C#
   引用类型数组元素默认是 ``null``；代码在启用可空引用类型时可能产生静态警告，但运行时空值检查完整。
   节点对象由垃圾回收器管理。

Julia
   ``mutable struct`` 允许共享节点引用并原地更新链接。``codeunits`` 是代码单元包装器，不创建长度为 ``L`` 的副本；
   一基数组下标使用 ``+1``。官方 ASCII 保证一个字节对应一个字符。

R
   environment 具有引用语义，更新 ``children`` 和 ``is_word`` 对共享根可见。``utf8ToInt`` 每次物化整数向量；
   空字符串产生 ``integer(0)``，``for`` 循环自然执行零次。

静态审查记录
------------

本章未运行、未编译、未对拍或测试任何题解代码。已完成：

* 人工推演 ``apple/app``、重复插入、共享前缀、缺失分支和空字符串扩展；
* 对路径标签、节点存在与终止标记分别建立不变量；
* 证明插入、完整查询与前缀查询在任意调用序列中的正确性；
* 核对十语言字符下标都只在官方小写 ASCII 域内使用；
* 核对重复插入不创建新路径，中间前缀不会被误标为完整单词；
* 核对 C 在分配失败时不接入半条后缀，并提供完整释放函数；
* 核对 Rust ``Box``、C++ ``unique_ptr``、Julia 可变节点和 R environment 的引用/所有权；
* 核对 Julia ``codeunits`` 不被误报为 ``O(L)`` 物化；
* 核对 R ``utf8ToInt`` 的 ``O(L)`` 物化成本；
* 核对所有语言的查询都不修改 Trie 状态；
* 核对单题为一个自包含 RST，未使用 ``.inc`` 或 ``include``。

剩余风险：

* 题解未在目标平台编译或执行，平台版本、类型注解和语法仍存在静态审查无法消除的风险；
* 官方字符域之外的输入可能产生越界下标，当前实现不提供非法字符错误通道；
* C ``void`` 插入无法区分“插入成功”和“资源不足导致该次插入未生效”；
* C 递归释放的调用栈深度依赖最长单词；
* 各运行时节点对象头、分配器和垃圾回收成本依赖实现。

关键易错点
----------

* 只要路径存在就让 ``search`` 返回真，混淆完整单词与前缀；
* 让 ``startsWith`` 也检查 ``is_word``，错误拒绝真前缀；
* 插入时把每个中间节点都标成单词；
* 重复插入时创建平行副本而不是复用路径；
* C 边分配边接入，失败后留下半条未完成路径；
* 忘记释放 C 的所有子节点；
* 把固定 26 槽节点的总空间写成与节点数无关的 ``O(1)``；
* R 使用普通嵌套 list 并假设深层原地修改自动共享；
* Julia/R 忘记把零基字符偏移转换为一基数组下标；
* 对非 ASCII 输入仍声称所有语言使用相同“字符”。

知识更新与关联题
----------------

* ``0076 Minimum Window Substring``：同样利用固定字符域下标，但窗口保存频次，Trie 保存路径；
* ``0133 Clone Graph``：对象图、邻接引用与所有权成本；
* ``0211 Design Add and Search Words Data Structure``：在 Trie 上加入通配符分支搜索；
* ``0212 Word Search II``：把 Trie 与网格回溯结合以共享前缀剪枝；
* ``0648 Replace Words``：沿 Trie 寻找最短词根；
* ``0677 Map Sum Pairs``：Trie 节点继续保存前缀聚合值。

自检问题与答案
--------------

**问题 1：为什么节点存在仍不能证明单词存在？**

节点只证明该字符序列是某个已插入单词的前缀。只有终点 ``is_word=true`` 才证明该序列本身曾被完整插入。

**问题 2：插入 ``apple`` 后，为什么 ``startsWith("app")`` 为真而 ``search("app")`` 为假？**

``app`` 的三层路径已经为 ``apple`` 创建，所以前缀查询成功；第三层节点尚未标记为单词终点，所以完整查询失败。

**问题 3：重复插入为什么不会增加节点数？**

每个字符都先检查对应子链接。路径已经完整存在时不会创建节点，只把同一终点标记再次设为真。

**问题 4：C 为什么要在树外先构造缺失后缀？**

``trieInsert`` 没有错误返回值。树外构造允许分配失败时释放临时链并保持旧 Trie 不变，避免出现无法说明的半插入状态。

**问题 5：固定 26 子链接为什么仍是 ``O(N)`` 总空间？**

每个节点使用固定 26 个槽，单节点是常数，但共有 ``N`` 个节点，总槽位是 ``26N``，渐近上仍随 ``N`` 线性增长。

**问题 6：R 为什么不能只报告查询 ``O(1)`` 额外空间？**

算法游标本身是常数，但 ``utf8ToInt`` 会为长度 ``L`` 的参数创建整数向量，因此适配器额外和峰值空间是 ``O(L)``。
