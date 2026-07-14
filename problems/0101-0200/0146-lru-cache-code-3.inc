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
