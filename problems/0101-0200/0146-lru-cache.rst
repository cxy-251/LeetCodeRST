0146. LRU Cache
===============

题目信息
--------

:题号: 0146
:难度: Medium
:主题: 哈希表、双向链表、数据结构设计
:原题: `LeetCode 0146 <https://leetcode.com/problems/lru-cache/>`_
:访问状态: Available
:教学重点: 对象历史、map/list 双射、最近使用顺序、固定容量淘汰、资源闭合

题目与对象契约
--------------

构造一个容量为 ``capacity`` 的缓存对象。容量在对象整个生命周期内不变，并且题目保证它为正数。对象随后接收
两类调用：

``get(key)``
  若 ``key`` 不在缓存中，返回 ``-1``，缓存状态不变；若存在，返回当前值，并把该键刷新为“最近使用”。

``put(key, value)``
  若 ``key`` 已存在，覆盖它的值并刷新为最近使用，缓存项数不变；若不存在且尚有空位，插入新项；若不存在且
  已满，先淘汰唯一的最久未使用项，再插入新项。``put`` 没有普通返回值。

“使用”既包括成功的 ``get``，也包括任意 ``put``。失败的 ``get`` 没有访问到缓存项，不能改变使用顺序。题面
约束为 ``1 <= capacity <= 3000``、``0 <= key <= 10^4``、``0 <= value <= 10^5``，并且 ``get`` 与
``put`` 合计至多调用 ``2 * 10^5`` 次。因此返回值 ``-1`` 可以无歧义地表示未命中。两种操作都要求平均
``O(1)`` 时间；这排除了每次扫描全部缓存项的做法。

自建操作序列
~~~~~~~~~~~~

下面把双向链表从左到右写成 ``MRU -> LRU``，同时记录映射中的键集合。容量为二：

.. list-table::
   :header-rows: 1
   :widths: 24 18 28 18 12

   * - 调用
     - 返回
     - 链表顺序
     - 映射键集合
     - size
   * - 构造 ``LRUCache(2)``
     - —
     - 空
     - ``{}``
     - 0
   * - ``put(1, 10)``
     - —
     - ``1``
     - ``{1}``
     - 1
   * - ``put(2, 20)``
     - —
     - ``2 -> 1``
     - ``{1, 2}``
     - 2
   * - ``get(1)``
     - 10
     - ``1 -> 2``
     - ``{1, 2}``
     - 2
   * - ``put(1, 11)``
     - —
     - ``1 -> 2``
     - ``{1, 2}``
     - 2
   * - ``put(3, 30)``
     - —
     - ``3 -> 1``
     - ``{1, 3}``
     - 2
   * - ``get(2)``
     - -1
     - ``3 -> 1``
     - ``{1, 3}``
     - 2
   * - ``put(4, 40)``
     - —
     - ``4 -> 3``
     - ``{3, 4}``
     - 2

``get(1)`` 是这组操作的关键：它把 1 刷新到最前，因此后来插入 3 时应淘汰 2，而不是更早插入的 1。
这也给出一个能区分错误实现的反例：若成功 ``get`` 只返回值而不移动节点，``put(3, 30)`` 会错误淘汰 1。

问题抽象与解法取舍
------------------

缓存需要同时回答两个不同问题：

* “键是否存在、它的值在哪里？”需要按键直接定位；
* “当前最久未使用的是谁？”需要维护整个对象的访问先后关系。

只用哈希表能解决第一个问题，却不能在常数时间选出最久未使用项。给每项记录递增时间戳仍需扫描最小时间戳，
或再维护一个有序结构，使操作至少多出对数因子。只用链表虽然能在尾部找到淘汰者，却要线性扫描才能按键查找。

合适的组合是：

* 哈希表 ``positions`` 把每个有效键映射到它的唯一节点；
* 双向链表把有效节点严格按最近使用到最久使用排列；
* 两端哨兵让首节点、尾节点和中间节点共享同一套摘除与头插逻辑。

哈希表负责“直接找到节点”，双向链表负责“已知节点后常数次改边”。任何移动都必须复用原节点；更新已有键时
另建同键节点，会立即破坏键与节点的一一对应。任何淘汰也必须同时从链表和哈希表删除同一项。

状态、表示与不变量
------------------

指针或引用版本维护以下字段：

``capacity``
  固定正容量。

``size`` 或 ``positions.size``
  当前有效缓存项数。

``positions``
  键到真实节点的哈希映射。哨兵从不进入映射。

``head``、``tail``
  永久哨兵。真实节点位于二者之间，``head.next`` 是 MRU，``tail.prev`` 是 LRU。

每个真实节点
  保存 ``key``、``value``、``prev``、``next``。C 版本还保存哈希桶链指针；Rust 不保存自引用指针，而保存
  ``prev``、``next`` 的稳定整数索引及两个可选端点索引。

每次公开操作开始和结束时都保持下列不变量：

#. **map/list 双射**：映射中的键恰好是真实链表节点的键；每个键只映射到保存该键的唯一节点，链表中的每个
   真实节点也恰好被映射一次。
#. **顺序不变量**：从 ``head.next`` 到 ``tail.prev``（Rust 中从 ``most_recent`` 到 ``least_recent``）
   严格按最后一次成功使用时间从新到旧排列；未被本次操作访问的项保持相对次序。
#. **容量与计数不变量**：``0 <= size <= capacity``，并且 ``size`` 等于映射大小和真实节点数。
#. **拓扑不变量**：空表时 ``head.next == tail`` 且 ``tail.prev == head``；非空时相邻节点的正反指针一致，
   首节点前驱是 ``head``，尾节点后继是 ``tail``。从头向后有限步必达尾哨兵，不形成环。
#. **哨兵不变量**：两个哨兵不保存有效键、不进入哈希表、从不被摘除或淘汰。

构造后没有真实节点，映射为空，两个哨兵直接相邻，五条不变量显然成立。Rust 的 ``None`` 端点等价于两个外部
哨兵：``most_recent == None`` 与 ``least_recent == None`` 表示空表；节点的 ``prev == None`` 表示它是
MRU，``next == None`` 表示它是 LRU。

三个局部结构操作
~~~~~~~~~~~~~~~~

``detach(node)``
  前置条件是 ``node`` 为链表中的真实节点。记 ``p = node.prev``、``q = node.next``，只需写
  ``p.next = q`` 和 ``q.prev = p``，再清空节点自身的两条链接。原序列删除一个已知元素，其余节点相对次序
  不变；``p`` 与 ``q`` 被重新接成一致的相邻关系，因此不会断链或成环。

``push_front(node)``
  前置条件是 ``node`` 当前不在链表中。记原首节点为 ``first = head.next``，设置
  ``node.prev = head``、``node.next = first``、``first.prev = node``、``head.next = node``。节点成为唯一
  MRU，原链表顺序不变。空表时 ``first`` 就是尾哨兵，同一组写操作仍成立。

``remove_lru``
  只在缓存已满且正容量时调用，所以 ``tail.prev`` 必为真实节点。先保存该节点，再调用 ``detach``；返回的
  节点正是顺序不变量中的最后一项。实现还必须用它的旧键删除哈希记录，之后才能覆盖键或释放节点。

这些辅助操作都只读写常数个节点和边。它们不自行修改 ``size``：移动节点不改计数；只有公开的新增路径在
节点真正加入后递增，淘汰并复用节点时则保持不变。

算法的五条路径
--------------

``get`` 未命中
  哈希查找失败，立即返回 ``-1``，不改任何字段。

``get`` 命中
  哈希表直接给出节点，先保存值，再 ``detach``、``push_front``，最后返回保存的值。

``put`` 更新已有键
  覆盖节点值，然后摘除并头插同一个节点。不得增加 ``size``，也不得创建第二个同键节点。

``put`` 新键且未满
  创建一个节点，登记 ``key -> node``，头插并把 ``size`` 加一。C 从构造期节点池取下一个未用槽，Rust 向已
  预留足够容量的向量追加一个槽。

``put`` 新键且已满
  保存 ``tail.prev`` 的旧键，摘除 LRU 并删除旧键映射。随后可复用该节点或槽，写入新键值、登记新映射并
  头插；真实节点数不变。在会创建新对象的语言里，删除旧节点后创建并头插新节点也有相同抽象效果。

正确性证明
----------

**引理一：** ``detach`` 在前置条件成立时删除且只删除目标真实节点，并保持剩余链表的拓扑与相对顺序。

**证明：** 由拓扑不变量，目标节点有相邻前驱 ``p`` 和后继 ``q``，且原来有
``p.next = node``、``node.next = q``、``q.prev = node``、``node.prev = p``。把 ``p`` 与 ``q`` 互相连接后，
所有不涉及目标的边保持不变，跨越目标的新正反边一致。故目标不再可达，剩余节点仍按原顺序从头连到尾，且
没有新增回边。证毕。

**引理二：** ``push_front`` 把一个链外节点变成唯一 MRU，并保持原链表的拓扑与相对顺序。

**证明：** 新节点被精确插在头哨兵与原首节点之间，四条相关链接两两一致；原首节点之后的所有边不变。因此
新节点成为首个真实节点，原节点顺序不变，仍有限步到达尾哨兵。证毕。

**引理三：** 缓存非空时，``tail.prev`` 是且仅是最久未使用项。

**证明：** 顺序不变量规定链表由 MRU 向 LRU 排列，且 map/list 双射保证所有有效项恰好出现一次。因此最后一个
真实节点覆盖全部有效项中最后成功使用时间最早者；唯一键对应唯一节点，所以淘汰对象唯一。证毕。

**定理：** 算法对任意合法调用序列都满足 LRU Cache 对象契约，并在每次调用后保持全部不变量。

**证明：** 对已经处理的调用数归纳。构造状态已满足不变量。假设本次调用前不变量成立，分五种互斥路径：

#. ``get`` 未命中时，map/list 双射说明该键确实不存在；返回 ``-1`` 且状态不变，结论成立。
#. ``get`` 命中时，映射找到唯一正确节点。由引理一和引理二，摘除再头插使它成为 MRU，其他项相对顺序不变；
   映射、节点数、值和哨兵集合未变。因此返回正确值并保持所有不变量。
#. ``put`` 更新时，唯一节点的值被覆盖，随后同样成为 MRU。映射键集合与节点数不变，不会产生重复键，故契约
   与不变量成立。
#. 新键且未满时，新节点和新映射一一加入；由引理二它成为 MRU，旧节点顺序不变。三个计数同时加一，且原先
   ``size < capacity``，所以新 size 不超过容量。
#. 新键且已满时，由引理三选出的正是 LRU。摘除它并删除旧映射后，双射在剩余项上成立；把新键节点登记并
   头插后，双射恢复，新键为 MRU，旧项相对顺序不变。删除一项又加入一项，size 仍等于 capacity。

五种路径穷尽公开调用，故归纳成立。证毕。

真实复杂度
----------

设容量为 ``C``。在哈希操作平均 ``O(1)`` 的通常假设下，查找、插入和删除映射都是平均常数时间；已知节点的
摘除、头插与尾项选择只改常数条边。因此 ``get`` 和 ``put`` 的 **平均时间** 均为 ``O(1)``。若大量键落入同一
哈希桶，链式哈希或标准哈希容器的一次操作可能退化到 ``O(C)``；不能把最坏界无条件写成 ``O(1)``。

哈希表和链表至多保存 ``C`` 个有效项，辅助状态空间为 ``O(C)``。对象返回后没有随调用序列增长的访问历史、
时间戳日志或废弃节点池。C 的桶数组也是 ``O(C)``；Rust 的哈希表与向量均在构造期按 ``C`` 预留容量，满容
时复用 LRU 槽。托管语言的节点、字典桶和对象头会带来常数级额外内存，但不改变渐进空间界。

语言适配与失败语义
------------------

* C 的 ``put`` 返回 ``void``，无法报告一次中途分配失败。因此构造器把缓存对象、哈希桶数组和 ``C`` 个节点的
  池作为一个事务取得；任一分配失败就释放已取得资源并返回 ``NULL``。成功构造后，``get``、``put`` 不再申请
  内存，满容时复用 victim，``free`` 只需释放节点池、桶数组和对象。
* C++ 用 ``std::list`` 保存顺序，哈希表保存稳定的 list 迭代器；``splice`` 移动节点而不扫描。构造器
  ``reserve`` 容量以避免正常题目路径中的 rehash。
* Python、Java、Go、TypeScript、C# 和 Julia 用可变引用节点。Go 的两个哨兵是单独分配的指针，避免返回
  ``LRUCache`` 值时让哨兵内部指针指向被复制前的内嵌字段。
* Rust 不建立自引用结构，也不使用 ``unsafe``。哈希表保存 ``key -> usize``，向量槽保存前后索引；整数索引
  不受向量底层存储地址影响。向量只在未满时追加，满时复用 LRU 槽，所以所有活动索引始终小于
  ``nodes.len() <= capacity``。
* R 的 cache、节点和映射都用 environment，使函数内字段赋值对调用者可见。题目键是非负整数，
  ``as.character(key)`` 给出唯一环境名；每次查询显式设置 ``inherits = FALSE``，不会误查父环境。Julia 使用
  ``mutable struct`` 保存可变相邻引用。
* 托管语言或标准容器若发生宿主内存耗尽，通常抛异常或终止，这不属于题面普通输入结果；实现没有把这种失败
  伪装成一次成功的 ``put``。C 因为接口只能静默返回，才必须显式关闭构造后分配路径。

十语言实现
----------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdint.h>
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
       LRUNode *pool;
       LRUNode head;
       LRUNode tail;
   } LRUCache;

   static size_t lru_hash(const LRUCache *cache, int key) {
       uint32_t bits = (uint32_t)key;
       return (size_t)(bits * UINT32_C(2654435761))
              % cache->bucket_count;
   }

   static LRUNode *lru_find(LRUCache *cache, int key) {
       size_t bucket = lru_hash(cache, key);
       LRUNode *node = cache->buckets[bucket];
       while (node != NULL) {
           if (node->key == key) {
               return node;
           }
           node = node->hash_next;
       }
       return NULL;
   }

   static void lru_detach(LRUNode *node) {
       LRUNode *prev = node->prev;
       LRUNode *next = node->next;
       prev->next = next;
       next->prev = prev;
       node->prev = NULL;
       node->next = NULL;
   }

   static void lru_push_front(LRUCache *cache, LRUNode *node) {
       LRUNode *first = cache->head.next;
       node->prev = &cache->head;
       node->next = first;
       first->prev = node;
       cache->head.next = node;
   }

   static void lru_hash_insert(LRUCache *cache, LRUNode *node) {
       size_t bucket = lru_hash(cache, node->key);
       node->hash_next = cache->buckets[bucket];
       cache->buckets[bucket] = node;
   }

   static void lru_hash_remove(LRUCache *cache, LRUNode *node) {
       size_t bucket = lru_hash(cache, node->key);
       LRUNode **link = &cache->buckets[bucket];
       while (*link != NULL) {
           if (*link == node) {
               *link = node->hash_next;
               node->hash_next = NULL;
               return;
           }
           link = &(*link)->hash_next;
       }
   }

   LRUCache *lRUCacheCreate(int capacity) {
       if (capacity <= 0) {
           return NULL;
       }

       size_t cap = (size_t)capacity;
       if (cap > (SIZE_MAX - 1u) / 2u) {
           return NULL;
       }
       size_t bucket_count = cap * 2u + 1u;
       if (bucket_count > SIZE_MAX / sizeof(LRUNode *) ||
           cap > SIZE_MAX / sizeof(LRUNode)) {
           return NULL;
       }

       LRUCache *cache = (LRUCache *)calloc(1u, sizeof(*cache));
       if (cache == NULL) {
           return NULL;
       }

       cache->buckets = (LRUNode **)calloc(
           bucket_count,
           sizeof(*cache->buckets)
       );
       cache->pool = (LRUNode *)calloc(cap, sizeof(*cache->pool));
       if (cache->buckets == NULL || cache->pool == NULL) {
           free(cache->pool);
           free(cache->buckets);
           free(cache);
           return NULL;
       }

       cache->capacity = capacity;
       cache->bucket_count = bucket_count;
       cache->head.next = &cache->tail;
       cache->tail.prev = &cache->head;
       return cache;
   }

   int lRUCacheGet(LRUCache *cache, int key) {
       if (cache == NULL) {
           return -1;
       }
       LRUNode *node = lru_find(cache, key);
       if (node == NULL) {
           return -1;
       }
       int value = node->value;
       lru_detach(node);
       lru_push_front(cache, node);
       return value;
   }

   void lRUCachePut(LRUCache *cache, int key, int value) {
       if (cache == NULL) {
           return;
       }

       LRUNode *node = lru_find(cache, key);
       if (node != NULL) {
           node->value = value;
           lru_detach(node);
           lru_push_front(cache, node);
           return;
       }

       if (cache->size == cache->capacity) {
           node = cache->tail.prev;
           lru_detach(node);
           lru_hash_remove(cache, node);
       } else {
           node = &cache->pool[cache->size];
           ++cache->size;
       }

       node->key = key;
       node->value = value;
       lru_hash_insert(cache, node);
       lru_push_front(cache, node);
   }

   void lRUCacheFree(LRUCache *cache) {
       if (cache == NULL) {
           return;
       }
       free(cache->pool);
       free(cache->buckets);
       free(cache);
   }

C++
~~~

.. code-block:: cpp

   #include <cstddef>
   #include <iterator>
   #include <list>
   #include <unordered_map>
   #include <utility>

   class LRUCache {
       using Entry = std::pair<int, int>;
       using Iterator = std::list<Entry>::iterator;

       int capacity_;
       std::list<Entry> order_;
       std::unordered_map<int, Iterator> positions_;

   public:
       explicit LRUCache(int capacity) : capacity_(capacity) {
           positions_.reserve(static_cast<std::size_t>(capacity));
       }

       int get(int key) {
           auto found = positions_.find(key);
           if (found == positions_.end()) {
               return -1;
           }
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
               auto victim = std::prev(order_.end());
               positions_.erase(victim->first);
               victim->first = key;
               victim->second = value;
               order_.splice(order_.begin(), order_, victim);
           } else {
               order_.emplace_front(key, value);
           }
           positions_.emplace(key, order_.begin());
       }
   };

Python
~~~~~~

.. code-block:: python

   from typing import Dict, Optional


   class _Node:
       def __init__(self, key: int = 0, value: int = 0) -> None:
           self.key = key
           self.value = value
           self.prev: Optional["_Node"] = None
           self.next: Optional["_Node"] = None


   class LRUCache:
       def __init__(self, capacity: int):
           self.capacity = capacity
           self.nodes: Dict[int, _Node] = {}
           self.head = _Node()
           self.tail = _Node()
           self.head.next = self.tail
           self.tail.prev = self.head

       def _detach(self, node: _Node) -> None:
           prev = node.prev
           nxt = node.next
           prev.next = nxt
           nxt.prev = prev
           node.prev = None
           node.next = None

       def _push_front(self, node: _Node) -> None:
           first = self.head.next
           node.prev = self.head
           node.next = first
           first.prev = node
           self.head.next = node

       def get(self, key: int) -> int:
           node = self.nodes.get(key)
           if node is None:
               return -1
           value = node.value
           self._detach(node)
           self._push_front(node)
           return value

       def put(self, key: int, value: int) -> None:
           node = self.nodes.get(key)
           if node is not None:
               node.value = value
               self._detach(node)
               self._push_front(node)
               return

           if len(self.nodes) == self.capacity:
               node = self.tail.prev
               self._detach(node)
               del self.nodes[node.key]
               node.key = key
               node.value = value
           else:
               node = _Node(key, value)

           self.nodes[key] = node
           self._push_front(node)

Java
~~~~

.. code-block:: java

   import java.util.HashMap;
   import java.util.Map;

   class LRUCache {
       private static final class Node {
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
       private final Map<Integer, Node> nodes;
       private final Node head = new Node(0, 0);
       private final Node tail = new Node(0, 0);

       public LRUCache(int capacity) {
           this.capacity = capacity;
           this.nodes = new HashMap<>(capacity * 2);
           head.next = tail;
           tail.prev = head;
       }

       private void detach(Node node) {
           Node prev = node.prev;
           Node next = node.next;
           prev.next = next;
           next.prev = prev;
           node.prev = null;
           node.next = null;
       }

       private void pushFront(Node node) {
           Node first = head.next;
           node.prev = head;
           node.next = first;
           first.prev = node;
           head.next = node;
       }

       public int get(int key) {
           Node node = nodes.get(key);
           if (node == null) {
               return -1;
           }
           int value = node.value;
           detach(node);
           pushFront(node);
           return value;
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
               node = tail.prev;
               detach(node);
               nodes.remove(node.key);
               node.key = key;
               node.value = value;
           } else {
               node = new Node(key, value);
           }
           nodes.put(key, node);
           pushFront(node);
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
           let capacity = capacity as usize;
           Self {
               capacity,
               positions: HashMap::with_capacity(capacity),
               nodes: Vec::with_capacity(capacity),
               most_recent: None,
               least_recent: None,
           }
       }

       fn detach(&mut self, index: usize) {
           let prev = self.nodes[index].prev;
           let next = self.nodes[index].next;

           if let Some(prev_index) = prev {
               self.nodes[prev_index].next = next;
           } else {
               self.most_recent = next;
           }
           if let Some(next_index) = next {
               self.nodes[next_index].prev = prev;
           } else {
               self.least_recent = prev;
           }

           self.nodes[index].prev = None;
           self.nodes[index].next = None;
       }

       fn push_front(&mut self, index: usize) {
           let old_front = self.most_recent;
           self.nodes[index].prev = None;
           self.nodes[index].next = old_front;

           if let Some(front_index) = old_front {
               self.nodes[front_index].prev = Some(index);
           } else {
               self.least_recent = Some(index);
           }
           self.most_recent = Some(index);
       }

       fn get(&mut self, key: i32) -> i32 {
           let index = match self.positions.get(&key) {
               Some(&index) => index,
               None => return -1,
           };
           let value = self.nodes[index].value;
           self.detach(index);
           self.push_front(index);
           value
       }

       fn put(&mut self, key: i32, value: i32) {
           if let Some(&index) = self.positions.get(&key) {
               self.nodes[index].value = value;
               self.detach(index);
               self.push_front(index);
               return;
           }

           let index = if self.positions.len() == self.capacity {
               let victim = self.least_recent
                   .expect("positive full cache has an LRU node");
               let old_key = self.nodes[victim].key;
               self.detach(victim);
               self.positions.remove(&old_key);
               self.nodes[victim].key = key;
               self.nodes[victim].value = value;
               victim
           } else {
               let created = self.nodes.len();
               self.nodes.push(CacheNode {
                   key,
                   value,
                   prev: None,
                   next: None,
               });
               created
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
       head     *cacheNode
       tail     *cacheNode
   }

   func Constructor(capacity int) LRUCache {
       head := &cacheNode{}
       tail := &cacheNode{}
       head.next = tail
       tail.prev = head
       return LRUCache{
           capacity: capacity,
           nodes:    make(map[int]*cacheNode, capacity),
           head:     head,
           tail:     tail,
       }
   }

   func (cache *LRUCache) detach(node *cacheNode) {
       prev := node.prev
       next := node.next
       prev.next = next
       next.prev = prev
       node.prev = nil
       node.next = nil
   }

   func (cache *LRUCache) pushFront(node *cacheNode) {
       first := cache.head.next
       node.prev = cache.head
       node.next = first
       first.prev = node
       cache.head.next = node
   }

   func (cache *LRUCache) Get(key int) int {
       node, ok := cache.nodes[key]
       if !ok {
           return -1
       }
       value := node.value
       cache.detach(node)
       cache.pushFront(node)
       return value
   }

   func (cache *LRUCache) Put(key int, value int) {
       if node, ok := cache.nodes[key]; ok {
           node.value = value
           cache.detach(node)
           cache.pushFront(node)
           return
       }

       var node *cacheNode
       if len(cache.nodes) == cache.capacity {
           node = cache.tail.prev
           cache.detach(node)
           delete(cache.nodes, node.key)
           node.key = key
           node.value = value
       } else {
           node = &cacheNode{key: key, value: value}
       }
       cache.nodes[key] = node
       cache.pushFront(node)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   class CacheNode {
       key: number;
       value: number;
       prev: CacheNode | null = null;
       next: CacheNode | null = null;

       constructor(key = 0, value = 0) {
           this.key = key;
           this.value = value;
       }
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
           const prev = node.prev!;
           const next = node.next!;
           prev.next = next;
           next.prev = prev;
           node.prev = null;
           node.next = null;
       }

       private pushFront(node: CacheNode): void {
           const first = this.head.next!;
           node.prev = this.head;
           node.next = first;
           first.prev = node;
           this.head.next = node;
       }

       get(key: number): number {
           const node = this.nodes.get(key);
           if (node === undefined) {
               return -1;
           }
           const value = node.value;
           this.detach(node);
           this.pushFront(node);
           return value;
       }

       put(key: number, value: number): void {
           let node = this.nodes.get(key);
           if (node !== undefined) {
               node.value = value;
               this.detach(node);
               this.pushFront(node);
               return;
           }

           if (this.nodes.size === this.capacity) {
               node = this.tail.prev!;
               this.detach(node);
               this.nodes.delete(node.key);
               node.key = key;
               node.value = value;
           } else {
               node = new CacheNode(key, value);
           }
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
       private readonly Dictionary<int, Node> nodes;
       private readonly Node head = new Node();
       private readonly Node tail = new Node();

       public LRUCache(int capacity) {
           this.capacity = capacity;
           nodes = new Dictionary<int, Node>(capacity);
           head.Next = tail;
           tail.Prev = head;
       }

       private void Detach(Node node) {
           Node prev = node.Prev;
           Node next = node.Next;
           prev.Next = next;
           next.Prev = prev;
           node.Prev = null;
           node.Next = null;
       }

       private void PushFront(Node node) {
           Node first = head.Next;
           node.Prev = head;
           node.Next = first;
           first.Prev = node;
           head.Next = node;
       }

       public int Get(int key) {
           Node node;
           if (!nodes.TryGetValue(key, out node)) {
               return -1;
           }
           int value = node.Value;
           Detach(node);
           PushFront(node);
           return value;
       }

       public void Put(int key, int value) {
           Node node;
           if (nodes.TryGetValue(key, out node)) {
               node.Value = value;
               Detach(node);
               PushFront(node);
               return;
           }

           if (nodes.Count == capacity) {
               node = tail.Prev;
               Detach(node);
               nodes.Remove(node.Key);
               node.Key = key;
               node.Value = value;
           } else {
               node = new Node(key, value);
           }
           nodes[key] = node;
           PushFront(node);
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
       return LRUCache(
           capacity,
           Dict{Int,LRUNode}(),
           head,
           tail,
       )
   end

   function detach!(node::LRUNode)::Nothing
       prev = node.prev
       next = node.next
       prev.next = next
       next.prev = prev
       node.prev = nothing
       node.next = nothing
       return nothing
   end

   function push_front!(cache::LRUCache, node::LRUNode)::Nothing
       first = cache.head.next
       node.prev = cache.head
       node.next = first
       first.prev = node
       cache.head.next = node
       return nothing
   end

   function lru_get!(cache::LRUCache, key::Int)::Int
       haskey(cache.nodes, key) || return -1
       node = cache.nodes[key]
       value = node.value
       detach!(node)
       push_front!(cache, node)
       return value
   end

   function lru_put!(cache::LRUCache, key::Int, value::Int)::Nothing
       if haskey(cache.nodes, key)
           node = cache.nodes[key]
           node.value = value
           detach!(node)
           push_front!(cache, node)
           return nothing
       end

       if length(cache.nodes) == cache.capacity
           node = cache.tail.prev
           detach!(node)
           delete!(cache.nodes, node.key)
           node.key = key
           node.value = value
       else
           node = LRUNode(key, value, nothing, nothing)
       end
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
     cache$capacity <- as.integer(capacity)
     cache$size <- 0L
     cache$nodes <- new.env(hash = TRUE, parent = emptyenv())
     cache$head <- new_lru_node()
     cache$tail <- new_lru_node()
     cache$head$next <- cache$tail
     cache$tail$prev <- cache$head
     cache
   }

   lru_detach <- function(node) {
     prev <- node$prev
     next_node <- node$next
     prev$next <- next_node
     next_node$prev <- prev
     node$prev <- NULL
     node$next <- NULL
     invisible(NULL)
   }

   lru_push_front <- function(cache, node) {
     first <- cache$head$next
     node$prev <- cache$head
     node$next <- first
     first$prev <- node
     cache$head$next <- node
     invisible(NULL)
   }

   lru_get <- function(cache, key) {
     name <- as.character(key)
     if (!exists(name, envir = cache$nodes, inherits = FALSE)) {
       return(-1L)
     }
     node <- get(name, envir = cache$nodes, inherits = FALSE)
     value <- node$value
     lru_detach(node)
     lru_push_front(cache, node)
     value
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
       node <- cache$tail$prev
       lru_detach(node)
       rm(list = as.character(node$key), envir = cache$nodes)
       node$key <- key
       node$value <- value
     } else {
       node <- new_lru_node(key, value)
       cache$size <- cache$size + 1L
     }
     assign(name, node, envir = cache$nodes)
     lru_push_front(cache, node)
     invisible(NULL)
   }

静态审查证据
------------

本题按仓库策略只做人工推演和逐语言静态语义审查；没有运行、编译、对拍、穷举、属性测试或 sanitizer。以下是
实际核对过的证据，而不是运行结果。

操作级人工推演
~~~~~~~~~~~~~~

前面的容量二表覆盖了新增未满、``get`` 命中刷新、``put`` 更新、满容淘汰、淘汰后未命中和再次淘汰。逐步还核对
了哨兵邻接：空表为 ``head <-> tail``；一项时为 ``head <-> node <-> tail``；两项时首节点前驱始终是 head，
尾节点后继始终是 tail。每一步映射键集合都与链表键集合相同，size 分别为 0、1、2 且不超过容量。

容量一另作推演：``put(7, 70)`` 得 ``[7]``；``put(7, 71)`` 只覆盖并仍为 ``[7]``；``put(8, 80)`` 取出的
``tail.prev`` 必为 7，删除映射 7 并复用节点后得到 ``[8]``；随后 ``get(7) == -1``、``get(8) == 80``。
这同时覆盖重复 ``put``、唯一节点既是 MRU 又是 LRU、以及满容复用时 size 不变。

辅助操作逐边检查
~~~~~~~~~~~~~~~~

* 摘除首节点时 ``prev`` 是 head，摘除尾节点时 ``next`` 是 tail；哨兵保证两侧都存在，代码不会为边界另开一条
  容易漏改反向指针的路径。
* 头插到空表时 ``first`` 是 tail，写 ``first.prev = node`` 正好更新 ``tail.prev``；头插到非空表时只改变
  原首节点的前驱，其后继链不变。
* ``remove_lru`` 只出现在 ``size == capacity``，又因 capacity 为正，故 victim 不会是 head。所有实现都先用
  旧键移除映射，再覆盖 victim 的键。
* 移动已有节点不触碰映射和 size；新增未满同时增加一个节点与一个映射；满容路径一删一增。三类计数修改与
  map/list 双射一致。

逐语言语义检查
~~~~~~~~~~~~~~

* **C**：容量转 ``size_t`` 前已排除非正值；``2 * capacity + 1`` 与两个 ``calloc`` 的乘法先做溢出检查。
  构造失败释放已经取得的所有块。成功后 pool 槽只按 ``size`` 首次启用，size 达容量后只复用 LRU；桶删除使用
  指向链接的二级指针，能正确删除桶首或桶中节点。释放路径不逐节点 free，避免释放 pool 内部地址。
* **C++**：哈希值是 ``std::list<Entry>::iterator``；``splice`` 后该迭代器仍指向同一节点。满容时先取得
  ``prev(end)``，删除旧键后改写并移动同一 list 节点，最后登记新键；没有线性 ``remove`` 或查尾扫描。
* **Python / Java / TypeScript / C#**：查表结果是节点对象引用，摘除后对象身份不变。TypeScript 用
  ``undefined`` 判断 ``Map.get`` 未命中，而节点对象不可能是 undefined；各实现只在不变量已保证非空的 full
  路径解引用 ``tail.prev``。
* **Rust**：从 HashMap 复制出 ``usize`` 后才可变借用 ``self``，没有把映射借用跨过 ``detach``。修改前后邻居
  分成独立语句，借用作用域不重叠；无 ``unsafe``、裸指针或自引用。``with_capacity`` 预留至少 capacity，
  ``nodes.len`` 从不超过 capacity，复用槽的索引仍有效。
* **Go**：head 与 tail 是单独堆节点，返回 LRUCache 值不会复制自指哨兵拓扑。map 保存节点指针，指针接收者
  保证 ``Get``、``Put`` 对同一对象的顺序和映射修改持久化。
* **Julia**：``mutable struct`` 节点支持原位改写前后引用，``Dict{Int,LRUNode}`` 保存相同节点对象；适配器使用
  ``lru_get!`` 与 ``lru_put!``，避免无意扩展 Base 已导出的 ``get!``。
* **R**：environment 具有引用语义；映射环境的父环境为空且所有查找禁用继承。键域内整数的字符编码一一对应，
  victim 改键前按旧字符名删除，cache 的 size 字段只在未满新增时递增。

剩余风险
~~~~~~~~

静态审查不能替代编译器、运行时或平台判题。当前剩余风险主要是不同判题环境的语言版本、托管运行时的内存耗尽
行为，以及哈希碰撞导致的最坏时间退化；本文没有把这些未执行项写成“通过”。C、C++、Rust 等代码也未实际
编译，所有接口、类型、借用和资源结论均来自逐行静态检查。

关键边界与易错点
----------------

* 容量为一时，满容新键淘汰唯一真实节点，不能误选 head 哨兵。
* ``get`` 未命中不刷新任何项；``get`` 命中和 ``put`` 更新都必须刷新。
* 更新已有键不增加 size，也不能先按“满容”淘汰另一个键。
* 淘汰必须使用 victim 的旧键删除映射；先覆盖键会留下悬空旧映射。
* ``detach`` 只接受当前在链表中的真实节点；对哨兵或已摘除节点再次调用会破坏拓扑。
* 头插必须同时更新原首节点的 ``prev``。只写 next 链会让后续摘除访问错误前驱。
* 映射保存节点或稳定索引，不能保存会因容器移动而失效的临时地址。
* 复杂度结论依赖哈希平均界；使用链表扫描找键或扫描时间戳找最小值均不满足合同。
* C 构造器失败必须返回 ``NULL`` 且不泄漏；成功构造后 ``put`` 不应存在无法报告的分配失败分支。
* Rust 满容复用槽时必须先删除 old_key，且复制索引后再可变借用对象，不能用自引用裸指针绕过借用规则。

知识链与关联题目
----------------

本题把三条已有知识链合在一个有状态对象里：

* **哈希定位**：与按键去重、计数类题相同，哈希表把“找谁”降为平均常数时间；本题进一步要求哈希值指向可移动
  的节点身份，而不只是保存标量。
* **双向断接**：0138 强调节点身份与额外引用的对应，0143 强调原地断链和重连；本题要求哈希映射与双向拓扑在
  每条公开路径上同步保持。
* **顺序不变量**：链表位置不只是存储布局，而是对象全部历史的压缩表示。只保留当前从 MRU 到 LRU 的全序，
  就足以回答下一次淘汰，无需保存完整调用日志。

继续学习时可比较 LFU Cache：LRU 只有一维“最近时间”全序；LFU 还要维护频率分组及同频内的最近顺序，因此
不变量会从一条链表扩展为“频率到链表”的两层结构。

带答案自检
----------

#. **为什么只有哈希表仍不能完成平均 O(1) 淘汰？**

   哈希表能按给定键定位，却没有维护所有键的最近使用次序。若要从中找最久未使用项，仍需扫描全部项；双向
   链表把该项固定在尾部，并让已知节点常数时间移动到头部。

#. **为什么成功的 get 必须修改结构？**

   LRU 的“使用”包含读取。若 ``put(1)``、``put(2)`` 后 ``get(1)`` 不移动 1，下一次插入会错误淘汰 1，
   而正确最久未使用项是 2。

#. **满容插入时为什么必须先保存旧键？**

   哈希表仍以旧键指向 victim。若先把节点 ``key`` 覆盖成新键，再执行删除，就会删除错误条目或找不到旧条目，
   破坏 map/list 双射。

#. **双向链表相对单链表解决了哪一步？**

   哈希表给出任意节点后，双向节点直接知道前驱和后继，可常数时间摘除。单链表若只拿到节点，仍需从头寻找其
   前驱，最坏为线性时间。

#. **为何 Rust 的整数索引不是悬空引用？**

   索引表示向量中的逻辑槽号，不保存元素地址。向量只追加到 capacity，槽不删除；满容淘汰只改写同一槽，所以
   任一活动映射索引始终小于 ``nodes.len()``，且仍指向被映射的那个逻辑槽。

#. **C 为什么要在构造期分配整个节点池？**

   ``put`` 返回 ``void``，无法把节点分配失败报告给调用者。构造期一次性取得最多需要的 ``capacity`` 个节点，
   失败就让构造整体失败；成功后所有公开操作只复用已有内存，不会静默丢弃一次合法插入。
