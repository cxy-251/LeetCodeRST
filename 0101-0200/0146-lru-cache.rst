0146. LRU Cache
===============

题目信息
--------

:题号: 0146. LRU 缓存
:难度: Medium
:主题: 设计、哈希表、双向链表、数据结构不变量
:原题: `LeetCode 0146 <https://leetcode.com/problems/lru-cache/>`_
:重点: 让哈希表回答键定位，让双向链表维护使用顺序，并保持两种结构对每个缓存项的一一对应

题目重述
--------

设计容量固定的最近最少使用缓存 ``LRUCache``：

* ``get(key)``：键存在时返回值，并把它更新为最近使用；不存在返回 ``-1``，顺序不变；
* ``put(key, value)``：已有键就更新值并刷新为最近使用；新键则插入。插入后超过容量时，删除最久没有被
  成功 ``get`` 或 ``put`` 的键。

两种操作都要求平均 ``O(1)`` 时间。容量至少为一。

自建示例
--------

.. code-block:: text

   LRUCache cache(2)
   put(4, 40)    顺序：[4]
   put(7, 70)    顺序：[7, 4]
   get(4) -> 40  顺序：[4, 7]
   put(9, 90)    顺序：[9, 4]，淘汰 7
   get(7) -> -1  顺序仍为 [9, 4]

容量为一时连续执行 ``put(3, 8)``、``put(3, 11)`` 只是更新同一条目，不应先淘汰再创建；随后
``get(3)`` 返回 ``11``。

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_map>

   class LRUCache {
   private:
       struct Node {
           int key;
           int value;
           Node* previous;
           Node* next;

           Node(int nodeKey, int nodeValue)
               : key(nodeKey),
                 value(nodeValue),
                 previous(nullptr),
                 next(nullptr) {}
       };

       int capacity_;
       std::unordered_map<int, Node*> index_;
       Node* mostRecentSentinel_;
       Node* leastRecentSentinel_;

       void detach(Node* node) {
           node->previous->next = node->next;
           node->next->previous = node->previous;
       }

       void insertAsMostRecent(Node* node) {
           node->previous = mostRecentSentinel_;
           node->next = mostRecentSentinel_->next;
           mostRecentSentinel_->next->previous = node;
           mostRecentSentinel_->next = node;
       }

       void markAsMostRecent(Node* node) {
           detach(node);
           insertAsMostRecent(node);
       }

   public:
       LRUCache(int capacity)
           : capacity_(capacity),
             mostRecentSentinel_(new Node(0, 0)),
             leastRecentSentinel_(new Node(0, 0)) {
           mostRecentSentinel_->next = leastRecentSentinel_;
           leastRecentSentinel_->previous = mostRecentSentinel_;
       }

       int get(int key) {
           auto found = index_.find(key);
           if (found == index_.end()) {
               return -1;
           }
           Node* node = found->second;
           markAsMostRecent(node);
           return node->value;
       }

       void put(int key, int value) {
           auto found = index_.find(key);
           if (found != index_.end()) {
               Node* node = found->second;
               node->value = value;
               markAsMostRecent(node);
               return;
           }

           Node* node = new Node(key, value);
           index_[key] = node;
           insertAsMostRecent(node);

           if (static_cast<int>(index_.size()) > capacity_) {
               Node* victim = leastRecentSentinel_->previous;
               detach(victim);
               index_.erase(victim->key);
               delete victim;
           }
       }

       ~LRUCache() {
           Node* node = mostRecentSentinel_;
           while (node != nullptr) {
               Node* next = node->next;
               delete node;
               node = next;
           }
       }
   };

题解
----

先列出每次操作真正需要什么
~~~~~~~~~~~~~~~~~~~~~~~~~~

``get`` 需要按键找到条目，并把它移到“最新”位置；``put`` 还需要在容量超限时立刻找到“最旧”条目。于是
至少有三类基本操作：

* 按键定位任意条目；
* 已知条目时从顺序中删除并移到最前；
* 直接取得并删除顺序末尾。

若只用哈希表，可给每个键附带递增时间戳，查找和刷新是平均 ``O(1)``，但淘汰时必须扫描所有条目寻找最小
时间戳，耗时 ``O(capacity)``。若只用按新旧排列的普通序列，末尾淘汰很快，按键查找和把中间条目移到
最前又需要线性扫描。单一结构各自只解决了一半问题。

组合结构怎样分工
~~~~~~~~~~~~~~~~

哈希表 ``index_`` 保存 ``key -> Node*``，负责平均常数时间定位。双向链表按使用时间排列，越靠近
``mostRecentSentinel_`` 越新，越靠近 ``leastRecentSentinel_`` 越旧。已知节点地址后，双向链表能通过
``previous``、``next`` 在常数时间摘除中间节点；单链表做不到，因为它还要寻找前驱。

两个哨兵不代表缓存项，只固定边界：

.. code-block:: text

   mostRecentSentinel
       <-> 最近使用项 <-> ... <-> 最久未使用项
       <-> leastRecentSentinel

空缓存时两个哨兵直接相连。插入首项、删除末项与处理中间节点使用完全相同的四个指针更新，不需要分别处理
空表、头节点和尾节点分支。

必须始终保持的三个不变量
~~~~~~~~~~~~~~~~~~~~~~~~

#. 每个真实缓存键在哈希表中出现一次，也在两个哨兵之间出现一次；``index_[key]`` 正好指向该链表节点；
#. ``mostRecentSentinel_->next`` 是最近成功访问的条目，``leastRecentSentinel_->previous`` 是最久未访问项；
#. 哈希表大小等于真实链表节点数，并且不超过容量（一次新插入的检查过程中可暂时多一）。

``detach`` 只接受真实节点，用两次跨接把它从当前位置删除；``insertAsMostRecent`` 把节点插到头哨兵之后。
``markAsMostRecent`` 组合两者，因此命中节点原本就在最前也无需特判：先摘除再插回，结果不变量不变。

``get`` 的分支意义
~~~~~~~~~~~~~~~~~

哈希未命中时返回 ``-1``，这次访问没有对应缓存项，不能改变新旧顺序。命中时先取得节点指针，移动到最新
位置，再返回值。移动与返回的先后在单线程结果上等价，但代码把“成功访问必刷新”集中在返回之前，不会
遗漏副作用。

对示例中的 ``get(4)``，原顺序 ``[7, 4]`` 先摘下 ``4`` 得到 ``[7]``，再插到头部得到 ``[4, 7]``；
随后淘汰依据已经正确改变。

``put`` 必须先区分覆盖与新增
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

已有键的 ``put`` 只更新现有节点的 ``value`` 并刷新位置，条目数不变，所以不能执行容量淘汰。新键才分配
节点、同时写入哈希并插到最新位置。若此时哈希大小超过容量，``leastRecentSentinel_->previous`` 就是唯一
应淘汰节点：先从链表摘除，再用节点内保存的 ``key`` 从哈希删除，最后释放节点。

删除必须同时作用于两种结构。只删哈希会让链表留下不可定位的旧节点；只删链表会让后续 ``get`` 取得悬空
或已淘汰节点。节点同时保存 ``key`` 和 ``value``，正是为了从表尾选中 victim 后能反向删除哈希项。

完整操作走读
~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 操作
     - 链表顺序（新到旧）
     - 哈希变化
   * - ``put(4, 40)``
     - ``[4]``
     - 增加 ``4 -> node4``
   * - ``put(7, 70)``
     - ``[7, 4]``
     - 增加键 ``7``
   * - ``get(4)``
     - ``[4, 7]``
     - 映射不变，只移动节点
   * - ``put(9, 90)``
     - 先 ``[9, 4, 7]``，再淘汰尾部成为 ``[9, 4]``
     - 增加 ``9``，删除 ``7``
   * - ``get(7)``
     - ``[9, 4]``
     - 未命中，不变

析构与边界状态
~~~~~~~~~~~~~~

析构函数沿 ``next`` 删除整条链，包括两个哨兵和所有尚存数据节点，防止手工 ``new`` 的内存泄漏。容量至少
为一，所以新插入后需要淘汰时，尾哨兵前必有真实节点；代码不会把哨兵当 victim。哨兵没有放入哈希，它们
的占位键值也不会与用户键冲突。

复杂度与方案选择
~~~~~~~~~~~~~~~~

哈希查找、插入和删除平均 ``O(1)``；已知节点的双向链表摘除、头插和尾部定位都是严格 ``O(1)``，所以
``get``、``put`` 均满足平均 ``O(1)``。空间为至多 ``capacity`` 个节点和哈希项，即 ``O(capacity)``。
主解采用哈希表与双向链表组合，因为它恰好覆盖三类所需操作；时间戳扫描与单序列方案只作为瓶颈推导，
没有额外认知收益值得保留第二份较长 C++ 实现。
