0146. LRU Cache
===============

题目信息
--------

:题号: 0146
:难度: Medium
:主题: 哈希表、双向链表、设计
:原题: `LeetCode 0146 <https://leetcode.com/problems/lru-cache/>`_
:访问状态: Available
:教学重点: O(1) 查找与最近使用顺序

题目重述
--------

实现固定容量 LRU 缓存：``get`` 返回值并标记为最近使用；``put`` 插入或更新，超容量时淘汰最久未使用键。两操作平均 ``O(1)``。

自建示例
--------

.. code-block:: text

   操作：LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2)
   输出：[null,null,null,1,null,-1]

问题抽象
--------

哈希表定位节点；带头尾哑节点的双向链表按最近使用到最久未使用排序。访问或更新把节点移到头部，淘汰尾部前节点。

主解法：哈希表加双向链表
--------------

思路
~~~~

哈希表加双向链表。 O(1) 查找与最近使用顺序

核心状态与不变量
~~~~~~~~~~~~~~~~

哈希表定位节点；带头尾哑节点的双向链表按最近使用到最久未使用排序。访问或更新把节点移到头部，淘汰尾部前节点。

正确性依据
~~~~~~~~~~

映射与链表始终一一对应。移动到头部准确记录最新访问；未访问节点相对顺序保持。容量超限时尾部前节点拥有最早最近访问时间，因此淘汰正确。

复杂度与语言边界
~~~~~~~~~~~~~~~~

``get``、``put`` 平均 ``O(1)``；存储 ``O(capacity)``。C 版本需明确节点分配与释放。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   typedef struct Entry {
       int key,value;
       struct Entry*prev,*next,*hnext;
   }
   Entry;
   typedef struct {
       int capacity,size,buckets;
       Entry**table;
       Entry head,tail;
   }
   LRUCache;
   static unsigned hash_key(LRUCache*c,int key) {
       return((unsigned)key*2654435761u)%(unsigned)c->buckets;
   }
   static Entry*find(LRUCache*c,int key) {
       for(Entry*p=c->table[hash_key(c,key)];p;p=p->hnext)if(p->key==key)return p;
       return NULL;
   }
   static void unlink_node(Entry*p) {
       p->prev->next=p->next;
       p->next->prev=p->prev;
   }
   static void front(LRUCache*c,Entry*p) {
       p->next=c->head.next;
       p->prev=&c->head;
       c->head.next->prev=p;
       c->head.next=p;
   }
   LRUCache*lRUCacheCreate(int capacity) {
       LRUCache*c=calloc(1,sizeof(*c));
       c->capacity=capacity;
       c->buckets=capacity*2+1;
       c->table=calloc((size_t)c->buckets,sizeof(*c->table));
       c->head.next=&c->tail;
       c->tail.prev=&c->head;
       return c;
   }
   int lRUCacheGet(LRUCache*c,int key) {
       Entry*p=find(c,key);
       if(!p)return-1;
       unlink_node(p);
       front(c,p);
       return p->value;
   }
   void lRUCachePut(LRUCache*c,int key,int value) {
       Entry*p=find(c,key);
       if(p) {
           p->value=value;
           unlink_node(p);
           front(c,p);
           return;
       }
       p=calloc(1,sizeof(*p));
       p->key=key;
       p->value=value;
       unsigned h=hash_key(c,key);
       p->hnext=c->table[h];
       c->table[h]=p;
       front(c,p);
       c->size++;
       if(c->size>c->capacity) {
           Entry*x=c->tail.prev;
           unlink_node(x);
           h=hash_key(c,x->key);
           Entry**q=&c->table[h];
           while(*q!=x)q=&(*q)->hnext;
           *q=x->hnext;
           free(x);
           c->size--;
       }
   }
   void lRUCacheFree(LRUCache*c) {
       Entry*p=c->head.next;
       while(p!=&c->tail) {
           Entry*n=p->next;
           free(p);
           p=n;
       }
       free(c->table);
       free(c);
   }
C++
~~~

.. code-block:: cpp

   class LRUCache {
       struct Node {
           int k,v;
           Node*prev,*next;
           Node(int k=0,int v=0):k(k),v(v),prev(nullptr),next(nullptr) {
           }
       };
       int cap;
       unordered_map<int,Node*>m;
       Node head,tail;
       void remove(Node*x) {
           x->prev->next=x->next;
           x->next->prev=x->prev;
       }
       void front(Node*x) {
           x->next=head.next;
           x->prev=&head;
           head.next->prev=x;
           head.next=x;
       }
       public:LRUCache(int capacity):cap(capacity) {
           head.next=&tail;
           tail.prev=&head;
       }
       int get(int k) {
           if(!m.count(k))return-1;
           Node*x=m[k];
           remove(x);
           front(x);
           return x->v;
       }
       void put(int k,int v) {
           if(m.count(k)) {
               Node*x=m[k];
               x->v=v;
               remove(x);
               front(x);
               return;
           }
           Node*x=new Node(k,v);
           m[k]=x;
           front(x);
           if(m.size()>(size_t)cap) {
               Node*y=tail.prev;
               remove(y);
               m.erase(y->k);
               delete y;
           }
       }
   };
Python
~~~~~~

.. code-block:: python

   class Node:

       def __init__(self, key=0, value=0):
           self.key = key
           self.value = value
           self.prev = None
           self.next = None

   class LRUCache:

       def __init__(self, capacity: int):
           self.capacity = capacity
           self.data = {}
           self.head = Node()
           self.tail = Node()
           self.head.next = self.tail
           self.tail.prev = self.head

       def _remove(self, node):
           node.prev.next = node.next
           node.next.prev = node.prev

       def _front(self, node):
           node.next = self.head.next
           node.prev = self.head
           self.head.next.prev = node
           self.head.next = node

       def get(self, key: int) -> int:
           if key not in self.data:
               return -1
           node = self.data[key]
           self._remove(node)
           self._front(node)
           return node.value

       def put(self, key: int, value: int) -> None:
           if key in self.data:
               node = self.data[key]
               node.value = value
               self._remove(node)
               self._front(node)
               return
           node = Node(key, value)
           self.data[key] = node
           self._front(node)
           if len(self.data) > self.capacity:
               old = self.tail.prev
               self._remove(old)
               del self.data[old.key]
Java
~~~~

.. code-block:: java

   class LRUCache {
       static class Node {
           int k,v;
           Node prev,next;
           Node() {
           }
           Node(int k,int v) {
               this.k=k;
               this.v=v;
           }
       }
       int cap;
       Map<Integer,Node>m=new HashMap<>();
       Node head=new Node(),tail=new Node();
       LRUCache(int capacity) {
           cap=capacity;
           head.next=tail;
           tail.prev=head;
       }
       void remove(Node x) {
           x.prev.next=x.next;
           x.next.prev=x.prev;
       }
       void front(Node x) {
           x.next=head.next;
           x.prev=head;
           head.next.prev=x;
           head.next=x;
       }
       public int get(int k) {
           Node x=m.get(k);
           if(x==null)return-1;
           remove(x);
           front(x);
           return x.v;
       }
       public void put(int k,int v) {
           Node x=m.get(k);
           if(x!=null) {
               x.v=v;
               remove(x);
               front(x);
               return;
           }
           x=new Node(k,v);
           m.put(k,x);
           front(x);
           if(m.size()>cap) {
               Node y=tail.prev;
               remove(y);
               m.remove(y.k);
           }
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::HashMap;
   use std::rc:: {
       Rc,Weak
   };
   struct LinkNode {
       key:i32,value:i32,prev:Weak<RefCell<LinkNode>>,next:Option<Rc<RefCell<LinkNode>>>
   }
   pub struct LRUCache {
       cap: usize, map: HashMap<i32, Rc<RefCell<LinkNode>>>, head: Rc<RefCell<LinkNode>>, tail:
           Rc<RefCell<LinkNode>>,
   }
   impl LRUCache {
       pub fn new(capacity:i32)->Self {
           let head=Rc::new(RefCell::new(LinkNode{key:0,value:0,prev:Weak::new(),next:None}));
           let tail=Rc::new(RefCell::new(LinkNode{key:0,value:0,prev:Rc::downgrade(&head),next:None}));
           head.borrow_mut().next=Some(tail.clone());
           Self {
               cap:capacity as usize,map:HashMap::new(),head,tail
           }
       }
       fn remove(&self,x:&Rc<RefCell<LinkNode>>) {
           let prev=x.borrow().prev.upgrade().unwrap();
           let next=x.borrow().next.clone().unwrap();
           prev.borrow_mut().next=Some(next.clone());
           next.borrow_mut().prev=Rc::downgrade(&prev);
       }
       fn front(&self,x:&Rc<RefCell<LinkNode>>) {
           let first=self.head.borrow().next.clone().unwrap();
           {
               let mut b=x.borrow_mut();
               b.prev=Rc::downgrade(&self.head);
               b.next=Some(first.clone());
           }
           first.borrow_mut().prev=Rc::downgrade(x);
           self.head.borrow_mut().next=Some(x.clone());
       }
       pub fn get(&mut self,key:i32)->i32 {
           let Some(x)=self.map.get(&key).cloned()else {
               return-1
           };
           let value=x.borrow().value;
           self.remove(&x);
           self.front(&x);
           value
       }
       pub fn put(&mut self,key:i32,value:i32) {
           if let Some(x)=self.map.get(&key).cloned() {
               x.borrow_mut().value=value;
               self.remove(&x);
               self.front(&x);
               return;
           }
           let x=Rc::new(RefCell::new(LinkNode{key,value,prev:Weak::new(),next:None}));
           self.front(&x);
           self.map.insert(key,x);
           if self.map.len()>self.cap {
               let old=self.tail.borrow().prev.upgrade().unwrap();
               let k=old.borrow().key;
               self.remove(&old);
               self.map.remove(&k);
           }
       }
   }
Go
~~

.. code-block:: go

   type entry struct {
       key   int
       value int
       prev  *entry
       next  *entry
   }

   type LRUCache struct {
       capacity int
       data     map[int]*entry
       head     *entry
       tail     *entry
   }

   func Constructor(capacity int) LRUCache {
       head := &entry{}
       tail := &entry{}
       head.next = tail
       tail.prev = head
       return LRUCache{
           capacity: capacity,
           data:     make(map[int]*entry),
           head:     head,
           tail:     tail,
       }
   }

   func (cache *LRUCache) remove(node *entry) {
       node.prev.next = node.next
       node.next.prev = node.prev
   }

   func (cache *LRUCache) moveToFront(node *entry) {
       node.next = cache.head.next
       node.prev = cache.head
       cache.head.next.prev = node
       cache.head.next = node
   }

   func (cache *LRUCache) Get(key int) int {
       node := cache.data[key]
       if node == nil {
           return -1
       }
       cache.remove(node)
       cache.moveToFront(node)
       return node.value
   }

   func (cache *LRUCache) Put(key int, value int) {
       if node := cache.data[key]; node != nil {
           node.value = value
           cache.remove(node)
           cache.moveToFront(node)
           return
       }
       node := &entry{key: key, value: value}
       cache.data[key] = node
       cache.moveToFront(node)
       if len(cache.data) > cache.capacity {
           oldest := cache.tail.prev
           cache.remove(oldest)
           delete(cache.data, oldest.key)
       }
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   class LRUNode {
       constructor(
           public key = 0,
           public value = 0,
           public prev: LRUNode | null = null,
           public next: LRUNode | null = null,
       ) {
       }
   }
   class LRUCache {
       private data = new Map<number, LRUNode>();
       private head = new LRUNode();
       private tail = new LRUNode();
       constructor(private capacity: number) {
           this.head.next = this.tail;
           this.tail.prev = this.head;
       }
       private remove(x: LRUNode) {
           x.prev!.next = x.next;
           x.next!.prev = x.prev;
       }
       private front(x: LRUNode) {
           x.next = this.head.next;
           x.prev = this.head;
           this.head.next!.prev = x;
           this.head.next = x;
       }
       get(k: number): number {
           const x = this.data.get(k);
           if (!x)
               return -1;
           this.remove(x);
           this.front(x);
           return x.value;
       }
       put(k: number, v: number): void {
           let x = this.data.get(k);
           if (x) {
               x.value = v;
               this.remove(x);
               this.front(x);
               return;
           }
           x = new LRUNode(k, v);
           this.data.set(k, x);
           this.front(x);
           if (this.data.size > this.capacity) {
               const old = this.tail.prev!;
               this.remove(old);
               this.data.delete(old.key);
           }
       }
   }
C#
~~

.. code-block:: csharp

   public class LRUCache {
       class Node {
           public int k,v;
           public Node prev,next;
           public Node(int k=0,int v=0) {
               this.k=k;
               this.v=v;
           }
       }
       int cap;
       Dictionary<int,Node>m=new();
       Node head=new(),tail=new();
       public LRUCache(int capacity) {
           cap=capacity;
           head.next=tail;
           tail.prev=head;
       }
       void Remove(Node x) {
           x.prev.next=x.next;
           x.next.prev=x.prev;
       }
       void Front(Node x) {
           x.next=head.next;
           x.prev=head;
           head.next.prev=x;
           head.next=x;
       }
       public int Get(int k) {
           if(!m.TryGetValue(k,out var x))return-1;
           Remove(x);
           Front(x);
           return x.v;
       }
       public void Put(int k,int v) {
           if(m.TryGetValue(k,out var x)) {
               x.v=v;
               Remove(x);
               Front(x);
               return;
           }
           x=new Node(k,v);
           m[k]=x;
           Front(x);
           if(m.Count>cap) {
               var old=tail.prev;
               Remove(old);
               m.Remove(old.k);
           }
       }
   }
Julia
~~~~~

.. code-block:: julia

   mutable struct LRUNode
       key::Int
       value::Int
       prev::Union{LRUNode,Nothing}
       next::Union{LRUNode,Nothing}
   end
   mutable struct LRUCache
       cap::Int
       data::Dict{Int,LRUNode}
       head::LRUNode
       tail::LRUNode
   end
   function LRUCache(cap::Int)
       h=LRUNode(0,0,nothing,nothing)
       t=LRUNode(0,0,h,nothing)
       h.next=t
       LRUCache(cap,Dict(),h,t)
   end
   remove!(x)=((x.prev.next=x.next)
   (x.next.prev=x.prev))
   front!(c,x)=((x.next=c.head.next)
   (x.prev=c.head)
   (c.head.next.prev=x)
   (c.head.next=x))
   function get!(c::LRUCache,k::Int)
       haskey(c.data,k)||return -1
       x=c.data[k]
       remove!(x)
       front!(c,x)
       x.value
   end
   function put!(c::LRUCache,k::Int,v::Int)
       if haskey(c.data,k)
           x=c.data[k]
           x.value=v
           remove!(x)
           front!(c,x)
           return
       end
       x=LRUNode(k,v,nothing,nothing)
       c.data[k]=x
       front!(c,x)
       if length(c.data)>c.cap
           old=c.tail.prev
           remove!(old)
           delete!(c.data,old.key)
       end
   end
R
~

.. code-block:: r

   new_lru <- function(capacity) {
       cache <- new.env(parent = emptyenv())
       cache$capacity <- capacity
       cache$data <- new.env(hash = TRUE, parent = emptyenv())
       cache$size <- 0L
       cache$head <- new.env(parent = emptyenv())
       cache$tail <- new.env(parent = emptyenv())
       cache$head$next <- cache$tail
       cache$tail$prev <- cache$head
       remove_node <- function(node) {
           node$prev$next <- node$next
           node$next$prev <- node$prev
       }
       add_front <- function(node) {
           node$next <- cache$head$next
           node$prev <- cache$head
           cache$head$next$prev <- node
           cache$head$next <- node
       }
       cache$get <- function(key) {
           node <- cache$data[[as.character(key)]]
           if (is.null(node)) return(-1L)
           remove_node(node)
           add_front(node)
           node$value
       }
       cache$put <- function(key, value) {
           name <- as.character(key)
           node <- cache$data[[name]]
           if (!is.null(node)) {
               node$value <- value
               remove_node(node)
               add_front(node)
               return(invisible(NULL))
           }
           node <- new.env(parent = emptyenv())
           node$key <- key
           node$value <- value
           cache$data[[name]] <- node
           cache$size <- cache$size + 1L
           add_front(node)
           if (cache$size > cache$capacity) {
               old <- cache$tail$prev
               remove_node(old)
               rm(list = as.character(old$key), envir = cache$data)
               cache$size <- cache$size - 1L
           }
           invisible(NULL)
       }
       cache
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 容量按题意为正。
* 更新已有键不能增加元素数。
* 淘汰时同时删除映射和链表节点。

易错点
------

* 使用单链表导致删除任意节点非 O(1)。
* 移动节点时未完整修复四个相邻指针。

本题新增知识
------------

* O(1) 查找与最近使用顺序
* 题号 0146 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0023. Merge k Sorted Lists <../0001-0100/0023-merge-k-sorted-lists.rst>`_；

最小自检
--------

#. ``哈希表加双向链表`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

映射与链表始终一一对应。移动到头部准确记录最新访问；未访问节点相对顺序保持。容量超限时尾部前节点拥有最早最近访问时间，因此淘汰正确。
