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
