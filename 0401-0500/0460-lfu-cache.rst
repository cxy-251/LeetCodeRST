0460. LFU Cache
===============

题目信息
--------

:题号: 0460
:难度: Hard
:主题: 缓存设计、访问频率、最久未使用、固定容量
:原题: `LeetCode 0460 <https://leetcode.com/problems/lfu-cache/>`_
:重点: ``get`` 和更新已有键都会增加频率、满容量时先淘汰最低频率、频率并列时淘汰最久未使用、操作平均 ``O(1)``

题目重述
--------

实现固定容量的 ``LFUCache``。``get(key)``：键存在时返回其值并把使用频率增加 1；键不存在时返回 ``-1``。``put(key, value)``：若键已存在，更新其值并把频率增加 1；若键不存在，则插入频率为 1 的新键。

插入新键前若缓存已满，先删除使用频率最低的键；若有多个键频率相同，则删除其中最久未使用的键。一次成功的 ``get`` 或对已有键的 ``put`` 都算一次使用，会更新并列淘汰所依据的新近程度。

``capacity`` 位于 ``[0, 10^4]``；键位于 ``[0, 10^5]``，值位于 ``[0, 10^9]``，总调用次数不超过 ``2 * 10^5``。容量为 0 时任何 ``put`` 都不能保存数据。``get`` 和 ``put`` 都要求平均 ``O(1)`` 时间。

自建示例
--------

频率较低的键先被淘汰：

.. code-block:: text

   初始：capacity = 2
   调用：put(1,10), put(2,20), get(1), put(3,30), get(2), get(3)
   查询输出：10、-1、30
   解释：get(1) 后键 1 的频率为 2，键 2 的频率仍为 1；插入键 3 时淘汰键 2。

容量为零：

.. code-block:: text

   初始：capacity = 0
   调用：put(5,50), get(5)
   查询输出：-1
   解释：零容量缓存不能保存任何键值对。

频率桶内用访问顺序解决并列
--------------------------

用一个按频率编号的双向链表集合保存键：同一频率的键位于同一个桶内，链表头是最近使用，尾部是最久未使用。哈希表把每个键映射到其值、频率和链表迭代器，因此可以在 ``O(1)`` 时间从旧桶删除并放入频率加一的新桶。

额外维护 ``minFrequency``。新键总是进入频率 1 的桶；淘汰时直接取最低频率桶的尾节点。若某频率桶被移空且它正是最低频率，就把最低频率提升到下一桶。

C++ 实现
--------

.. code-block:: cpp

   class LFUCache {
       struct Entry {
           int value;
           int frequency;
           std::list<int>::iterator position;
       };

       int capacity;
       int minFrequency = 0;
       std::unordered_map<int, Entry> entries;
       std::unordered_map<int, std::list<int>> buckets;

       void touch(int key) {
           Entry& entry = entries[key];
           int oldFrequency = entry.frequency;
           auto bucketIt = buckets.find(oldFrequency);
           bucketIt->second.erase(entry.position);
           if (bucketIt->second.empty()) {
               buckets.erase(bucketIt);
               if (minFrequency == oldFrequency) ++minFrequency;
           }

           ++entry.frequency;
           buckets[entry.frequency].push_front(key);
           entry.position = buckets[entry.frequency].begin();
       }

   public:
       LFUCache(int capacity) : capacity(capacity) {}

       int get(int key) {
           auto it = entries.find(key);
           if (it == entries.end()) return -1;
           touch(key);
           return entries[key].value;
       }

       void put(int key, int value) {
           if (capacity == 0) return;

           auto it = entries.find(key);
           if (it != entries.end()) {
               it->second.value = value;
               touch(key);
               return;
           }

           if (entries.size() == static_cast<size_t>(capacity)) {
               auto& leastUsed = buckets[minFrequency];
               int victim = leastUsed.back();
               leastUsed.pop_back();
               if (leastUsed.empty()) buckets.erase(minFrequency);
               entries.erase(victim);
           }

           buckets[1].push_front(key);
           entries[key] = {value, 1, buckets[1].begin()};
           minFrequency = 1;
       }
   };

代码分析
--------

频率哈希表定位桶，链表迭代器定位桶内节点，二者合起来使访问、升频和淘汰都不需要遍历。链表头插保证同频时最新访问在前，尾删正好淘汰最久未使用者；每个操作的平均时间复杂度为 ``O(1)``，空间复杂度为 ``O(capacity)``。
