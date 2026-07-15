0146. LRU Cache
===============

题目信息
--------

:题号: 0146
:难度: Medium
:主题: 哈希表、双向链表、数据结构设计
:原题: `LeetCode 0146 <https://leetcode.com/problems/lru-cache/>`_
:访问状态: Available
:教学重点: 哈希定位、最近使用顺序、常数时间淘汰

题目重述
--------

设计固定容量缓存，支持 ``get(key)`` 和 ``put(key, value)``。读取或更新已有键会把它标记为最近使用；插入新键
且容量已满时，删除最久未使用的键。不存在的键返回 ``-1``。题目要求两种操作平均 ``O(1)``。

算法
----

组合两个结构：

* 哈希表把键映射到对应节点，负责平均 ``O(1)`` 定位；
* 双向链表按使用时间排列，表头之后是最近使用节点，表尾之前是最久未使用节点。

``get`` 找不到键时返回 ``-1``；找到后把节点从原位置摘下并移动到表头。``put`` 更新已有节点时同样移动到
表头。插入新键且已满时，删除表尾前节点并同步删除哈希记录，再把新节点放到表头。

正确性
~~~~~~

链表不变量是：从表头到表尾的顺序严格表示从最近使用到最久未使用。每次成功 ``get`` 或 ``put`` 都把目标
节点移动到表头，所以它成为最新访问项，其余节点的相对顺序保持不变。容量满时，表尾前节点正是所有现存项中
最后一次访问最早者，删除它符合 LRU 规则。哈希表与链表节点一一对应，因此查找、更新和淘汰操作作用于同一项。

复杂度
~~~~~~

哈希查找、插入和删除平均 ``O(1)``；双向链表已知节点的摘除、头插和尾删均为 ``O(1)``，所以 ``get`` 和
``put`` 平均时间 ``O(1)``。缓存保存至多 ``capacity`` 个节点，空间 ``O(capacity)``。C 使用链式哈希桶，
极端碰撞时查找会退化；C++ 的 ``unordered_map`` 及其他哈希容器同样是平均界。Rust 使用固定索引节点池，
淘汰时复用槽位；R 使用哈希 environment，接口采用显式函数适配器。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   typedef struct LRUNode {
       int key;
       int value;
       struct LRUNode *prev;
       struct LRUNode *next;
       struct LRUNode *hash_next;
   } LRUNode;

   typedef struct {
       int capacity;
       int size;
       size_t bucket_count;
       LRUNode **buckets;
       LRUNode head;
       LRUNode tail;
   } LRUCache;

   static size_t lru_hash(LRUCache *cache, int key) {
       unsigned int bits = (unsigned int)key;
       return (size_t)(bits * 2654435761u) % cache->bucket_count;
   }

   static LRUNode *lru_find(LRUCache *cache, int key) {
       size_t bucket = lru_hash(cache, key);
       for (LRUNode *node = cache->buckets[bucket];
            node != NULL;
            node = node->hash_next) {
           if (node->key == key) return node;
       }
       return NULL;
   }

   static void lru_detach(LRUNode *node) {
       node->prev->next = node->next;
       node->next->prev = node->prev;
   }

   static void lru_push_front(LRUCache *cache, LRUNode *node) {
       node->next = cache->head.next;
       node->prev = &cache->head;
       cache->head.next->prev = node;
       cache->head.next = node;
   }

   static void lru_hash_insert(LRUCache *cache, LRUNode *node) {
       size_t bucket = lru_hash(cache, node->key);
       node->hash_next = cache->buckets[bucket];
       cache->buckets[bucket] = node;
   }

   static void lru_hash_remove(LRUCache *cache, LRUNode *node) {
       size_t bucket = lru_hash(cache, node->key);
       LRUNode **cursor = &cache->buckets[bucket];
       while (*cursor != NULL) {
           if (*cursor == node) {
               *cursor = node->hash_next;
               return;
           }
           cursor = &(*cursor)->hash_next;
       }
   }

   LRUCache *lRUCacheCreate(int capacity) {
       if (capacity <= 0) return NULL;
       LRUCache *cache = calloc(1, sizeof(*cache));
       if (cache == NULL) return NULL;

       cache->capacity = capacity;
       cache->bucket_count = (size_t)capacity * 2u + 1u;
       cache->buckets = calloc(
           cache->bucket_count,
           sizeof(*cache->buckets)
       );
       if (cache->buckets == NULL) {
           free(cache);
           return NULL;
       }
       cache->head.next = &cache->tail;
       cache->tail.prev = &cache->head;
       return cache;
   }

   int lRUCacheGet(LRUCache *cache, int key) {
       if (cache == NULL) return -1;
       LRUNode *node = lru_find(cache, key);
       if (node == NULL) return -1;
       lru_detach(node);
       lru_push_front(cache, node);
       return node->value;
   }

   void lRUCachePut(LRUCache *cache, int key, int value) {
       if (cache == NULL) return;
       LRUNode *known = lru_find(cache, key);
       if (known != NULL) {
           known->value = value;
           lru_detach(known);
           lru_push_front(cache, known);
           return;
       }

       if (cache->size == cache->capacity) {
           LRUNode *victim = cache->tail.prev;
           lru_detach(victim);
           lru_hash_remove(cache, victim);
           victim->key = key;
           victim->value = value;
           lru_hash_insert(cache, victim);
           lru_push_front(cache, victim);
           return;
       }

       LRUNode *node = calloc(1, sizeof(*node));
       if (node == NULL) return;
       node->key = key;
       node->value = value;
       lru_hash_insert(cache, node);
       lru_push_front(cache, node);
       ++cache->size;
   }

   void lRUCacheFree(LRUCache *cache) {
       if (cache == NULL) return;
       LRUNode *node = cache->head.next;
       while (node != &cache->tail) {
           LRUNode *next = node->next;
           free(node);
           node = next;
       }
       free(cache->buckets);
       free(cache);
   }

C++
~~~

.. code-block:: cpp

   #include <list>
   #include <unordered_map>
   #include <utility>

   class LRUCache {
       using Entry = std::pair<int, int>;
       int capacity_;
       std::list<Entry> order_;
       std::unordered_map<int, std::list<Entry>::iterator> positions_;

   public:
       explicit LRUCache(int capacity) : capacity_(capacity) {}

       int get(int key) {
           auto found = positions_.find(key);
           if (found == positions_.end()) return -1;
           order_.splice(order_.begin(), order_, found->second);
           return found->second->second;
       }

       void put(int key, int value) {
           auto found = positions_.find(key);
           if (found != positions_.end()) {
               found->second->second = value;
               order_.splice(order_.begin(), order_, found->second);
               return;
           }

           if (static_cast<int>(order_.size()) == capacity_) {
               positions_.erase(order_.back().first);
               order_.pop_back();
           }
           order_.emplace_front(key, value);
           positions_[key] = order_.begin();
       }
   };

Python
~~~~~~

.. code-block:: python

   class _Node:
       def __init__(self, key: int = 0, value: int = 0) -> None:
           self.key = key
           self.value = value
           self.prev: _Node | None = None
           self.next: _Node | None = None

   class LRUCache:
       def __init__(self, capacity: int):
           self.capacity = capacity
           self.nodes: dict[int, _Node] = {}
           self.head = _Node()
           self.tail = _Node()
           self.head.next = self.tail
           self.tail.prev = self.head

       def _detach(self, node: _Node) -> None:
           node.prev.next = node.next
           node.next.prev = node.prev

       def _push_front(self, node: _Node) -> None:
           node.next = self.head.next
           node.prev = self.head
           self.head.next.prev = node
           self.head.next = node

       def get(self, key: int) -> int:
           node = self.nodes.get(key)
           if node is None:
               return -1
           self._detach(node)
           self._push_front(node)
           return node.value

       def put(self, key: int, value: int) -> None:
           node = self.nodes.get(key)
           if node is not None:
               node.value = value
               self._detach(node)
               self._push_front(node)
               return

           if len(self.nodes) == self.capacity:
               victim = self.tail.prev
               self._detach(victim)
               del self.nodes[victim.key]

           node = _Node(key, value)
           self.nodes[key] = node
           self._push_front(node)

Java
~~~~

.. code-block:: java

   import java.util.HashMap;
   import java.util.Map;

   class LRUCache {
       private static class Node {
           int key;
           int value;
           Node prev;
           Node next;

           Node(int key, int value) {
               this.key = key;
               this.value = value;
           }
       }

       private final int capacity;
       private final Map<Integer, Node> nodes = new HashMap<>();
       private final Node head = new Node(0, 0);
       private final Node tail = new Node(0, 0);

       public LRUCache(int capacity) {
           this.capacity = capacity;
           head.next = tail;
           tail.prev = head;
       }

       private void detach(Node node) {
           node.prev.next = node.next;
           node.next.prev = node.prev;
       }

       private void pushFront(Node node) {
           node.next = head.next;
           node.prev = head;
           head.next.prev = node;
           head.next = node;
       }

       public int get(int key) {
           Node node = nodes.get(key);
           if (node == null) return -1;
           detach(node);
           pushFront(node);
           return node.value;
       }

       public void put(int key, int value) {
           Node node = nodes.get(key);
           if (node != null) {
               node.value = value;
               detach(node);
               pushFront(node);
               return;
           }

           if (nodes.size() == capacity) {
               Node victim = tail.prev;
               detach(victim);
               nodes.remove(victim.key);
           }
           Node created = new Node(key, value);
           nodes.put(key, created);
           pushFront(created);
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::collections::HashMap;

   struct CacheNode {
       key: i32,
       value: i32,
       prev: Option<usize>,
       next: Option<usize>,
   }

   struct LRUCache {
       capacity: usize,
       positions: HashMap<i32, usize>,
       nodes: Vec<CacheNode>,
       most_recent: Option<usize>,
       least_recent: Option<usize>,
   }

   impl LRUCache {
       fn new(capacity: i32) -> Self {
           Self {
               capacity: capacity as usize,
               positions: HashMap::new(),
               nodes: Vec::with_capacity(capacity as usize),
               most_recent: None,
               least_recent: None,
           }
       }

       fn detach(&mut self, index: usize) {
           let prev = self.nodes[index].prev;
           let next = self.nodes[index].next;
           match prev {
               Some(prev_index) => self.nodes[prev_index].next = next,
               None => self.most_recent = next,
           }
           match next {
               Some(next_index) => self.nodes[next_index].prev = prev,
               None => self.least_recent = prev,
           }
       }

       fn push_front(&mut self, index: usize) {
           self.nodes[index].prev = None;
           self.nodes[index].next = self.most_recent;
           if let Some(old_front) = self.most_recent {
               self.nodes[old_front].prev = Some(index);
           } else {
               self.least_recent = Some(index);
           }
           self.most_recent = Some(index);
       }

       fn get(&mut self, key: i32) -> i32 {
           let Some(&index) = self.positions.get(&key) else {
               return -1;
           };
           self.detach(index);
           self.push_front(index);
           self.nodes[index].value
       }

       fn put(&mut self, key: i32, value: i32) {
           if let Some(&index) = self.positions.get(&key) {
               self.nodes[index].value = value;
               self.detach(index);
               self.push_front(index);
               return;
           }

           let index = if self.positions.len() == self.capacity {
               let victim = self.least_recent.unwrap();
               let old_key = self.nodes[victim].key;
               self.detach(victim);
               self.positions.remove(&old_key);
               self.nodes[victim].key = key;
               self.nodes[victim].value = value;
               victim
           } else {
               self.nodes.push(CacheNode {
                   key,
                   value,
                   prev: None,
                   next: None,
               });
               self.nodes.len() - 1
           };

           self.positions.insert(key, index);
           self.push_front(index);
       }
   }

Go
~~

.. code-block:: go

   type cacheNode struct {
       key   int
       value int
       prev  *cacheNode
       next  *cacheNode
   }

   type LRUCache struct {
       capacity int
       nodes    map[int]*cacheNode
       head     cacheNode
       tail     cacheNode
   }

   func Constructor(capacity int) LRUCache {
       cache := LRUCache{
           capacity: capacity,
           nodes:    make(map[int]*cacheNode),
       }
       cache.head.next = &cache.tail
       cache.tail.prev = &cache.head
       return cache
   }

   func (cache *LRUCache) detach(node *cacheNode) {
       node.prev.next = node.next
       node.next.prev = node.prev
   }

   func (cache *LRUCache) pushFront(node *cacheNode) {
       node.next = cache.head.next
       node.prev = &cache.head
       cache.head.next.prev = node
       cache.head.next = node
   }

   func (cache *LRUCache) Get(key int) int {
       node, ok := cache.nodes[key]
       if !ok {
           return -1
       }
       cache.detach(node)
       cache.pushFront(node)
       return node.value
   }

   func (cache *LRUCache) Put(key int, value int) {
       if node, ok := cache.nodes[key]; ok {
           node.value = value
           cache.detach(node)
           cache.pushFront(node)
           return
       }

       if len(cache.nodes) == cache.capacity {
           victim := cache.tail.prev
           cache.detach(victim)
           delete(cache.nodes, victim.key)
       }
       node := &cacheNode{key: key, value: value}
       cache.nodes[key] = node
       cache.pushFront(node)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   class CacheNode {
       constructor(
           public key = 0,
           public value = 0,
           public prev: CacheNode | null = null,
           public next: CacheNode | null = null,
       ) {}
   }

   class LRUCache {
       private readonly nodes = new Map<number, CacheNode>();
       private readonly head = new CacheNode();
       private readonly tail = new CacheNode();

       constructor(private readonly capacity: number) {
           this.head.next = this.tail;
           this.tail.prev = this.head;
       }

       private detach(node: CacheNode): void {
           node.prev!.next = node.next;
           node.next!.prev = node.prev;
       }

       private pushFront(node: CacheNode): void {
           node.next = this.head.next;
           node.prev = this.head;
           this.head.next!.prev = node;
           this.head.next = node;
       }

       get(key: number): number {
           const node = this.nodes.get(key);
           if (node === undefined) return -1;
           this.detach(node);
           this.pushFront(node);
           return node.value;
       }

       put(key: number, value: number): void {
           const known = this.nodes.get(key);
           if (known !== undefined) {
               known.value = value;
               this.detach(known);
               this.pushFront(known);
               return;
           }

           if (this.nodes.size === this.capacity) {
               const victim = this.tail.prev!;
               this.detach(victim);
               this.nodes.delete(victim.key);
           }
           const node = new CacheNode(key, value);
           this.nodes.set(key, node);
           this.pushFront(node);
       }
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class LRUCache {
       private sealed class Node {
           public int Key;
           public int Value;
           public Node Prev;
           public Node Next;

           public Node(int key = 0, int value = 0) {
               Key = key;
               Value = value;
           }
       }

       private readonly int capacity;
       private readonly Dictionary<int, Node> nodes = new();
       private readonly Node head = new();
       private readonly Node tail = new();

       public LRUCache(int capacity) {
           this.capacity = capacity;
           head.Next = tail;
           tail.Prev = head;
       }

       private void Detach(Node node) {
           node.Prev.Next = node.Next;
           node.Next.Prev = node.Prev;
       }

       private void PushFront(Node node) {
           node.Next = head.Next;
           node.Prev = head;
           head.Next.Prev = node;
           head.Next = node;
       }

       public int Get(int key) {
           if (!nodes.TryGetValue(key, out Node node)) return -1;
           Detach(node);
           PushFront(node);
           return node.Value;
       }

       public void Put(int key, int value) {
           if (nodes.TryGetValue(key, out Node known)) {
               known.Value = value;
               Detach(known);
               PushFront(known);
               return;
           }

           if (nodes.Count == capacity) {
               Node victim = tail.Prev;
               Detach(victim);
               nodes.Remove(victim.Key);
           }
           Node created = new(key, value);
           nodes[key] = created;
           PushFront(created);
       }
   }

Julia
~~~~~

.. code-block:: julia

   mutable struct LRUNode
       key::Int
       value::Int
       prev::Union{Nothing,LRUNode}
       next::Union{Nothing,LRUNode}
   end

   mutable struct LRUCache
       capacity::Int
       nodes::Dict{Int,LRUNode}
       head::LRUNode
       tail::LRUNode
   end

   function LRUCache(capacity::Int)
       head = LRUNode(0, 0, nothing, nothing)
       tail = LRUNode(0, 0, head, nothing)
       head.next = tail
       return LRUCache(capacity, Dict{Int,LRUNode}(), head, tail)
   end

   function detach!(node::LRUNode)
       node.prev.next = node.next
       node.next.prev = node.prev
   end

   function push_front!(cache::LRUCache, node::LRUNode)
       node.next = cache.head.next
       node.prev = cache.head
       cache.head.next.prev = node
       cache.head.next = node
   end

   function get!(cache::LRUCache, key::Int)::Int
       haskey(cache.nodes, key) || return -1
       node = cache.nodes[key]
       detach!(node)
       push_front!(cache, node)
       return node.value
   end

   function put!(cache::LRUCache, key::Int, value::Int)::Nothing
       if haskey(cache.nodes, key)
           node = cache.nodes[key]
           node.value = value
           detach!(node)
           push_front!(cache, node)
           return nothing
       end

       if length(cache.nodes) == cache.capacity
           victim = cache.tail.prev
           detach!(victim)
           delete!(cache.nodes, victim.key)
       end
       node = LRUNode(key, value, nothing, nothing)
       cache.nodes[key] = node
       push_front!(cache, node)
       return nothing
   end

R
~

.. code-block:: r

   new_lru_node <- function(key = 0L, value = 0L) {
     node <- new.env(parent = emptyenv())
     node$key <- key
     node$value <- value
     node$prev <- NULL
     node$next <- NULL
     node
   }

   new_lru_cache <- function(capacity) {
     cache <- new.env(parent = emptyenv())
     cache$capacity <- capacity
     cache$nodes <- new.env(hash = TRUE, parent = emptyenv())
     cache$size <- 0L
     cache$head <- new_lru_node()
     cache$tail <- new_lru_node()
     cache$head$next <- cache$tail
     cache$tail$prev <- cache$head
     cache
   }

   lru_detach <- function(node) {
     node$prev$next <- node$next
     node$next$prev <- node$prev
   }

   lru_push_front <- function(cache, node) {
     node$next <- cache$head$next
     node$prev <- cache$head
     cache$head$next$prev <- node
     cache$head$next <- node
   }

   lru_get <- function(cache, key) {
     name <- as.character(key)
     if (!exists(name, envir = cache$nodes, inherits = FALSE)) return(-1L)
     node <- get(name, envir = cache$nodes, inherits = FALSE)
     lru_detach(node)
     lru_push_front(cache, node)
     node$value
   }

   lru_put <- function(cache, key, value) {
     name <- as.character(key)
     if (exists(name, envir = cache$nodes, inherits = FALSE)) {
       node <- get(name, envir = cache$nodes, inherits = FALSE)
       node$value <- value
       lru_detach(node)
       lru_push_front(cache, node)
       return(invisible(NULL))
     }

     if (cache$size == cache$capacity) {
       victim <- cache$tail$prev
       lru_detach(victim)
       rm(list = as.character(victim$key), envir = cache$nodes)
       cache$size <- cache$size - 1L
     }
     node <- new_lru_node(key, value)
     assign(name, node, envir = cache$nodes)
     lru_push_front(cache, node)
     cache$size <- cache$size + 1L
     invisible(NULL)
   }

关键边界
--------

* 容量为一时，每个新键都会淘汰旧键；
* 更新已有键不能增加缓存大小；
* ``get`` 也会刷新最近使用顺序；
* 淘汰时必须同时删除哈希记录和链表节点；
* 哨兵节点不进入哈希表，也永远不能被淘汰；
* C 分配失败时保留原缓存状态，释放函数回收全部节点和桶数组。

验证
----

运行官方容量二流程、容量一、更新已有键、读取刷新顺序和连续淘汰；Python、C、C++ 与 Rust 输出一致。
其余语言完成哈希与链表同步、哨兵边界和容量不变量静态检查。未执行大规模随机操作序列。

最小自检
--------

#. 为什么只使用哈希表无法确定最久未使用项？
#. 为什么双向链表删除已知节点是 ``O(1)``？
#. ``get`` 成功后若不移动节点，会在哪种操作序列中淘汰错误项？
