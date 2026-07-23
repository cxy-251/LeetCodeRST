0146. LRU Cache
===============

题目信息
--------

:题号: 0146
:难度: Medium
:主题: 哈希表、双向链表、数据结构设计
:原题: `LeetCode 0146 <https://leetcode.com/problems/lru-cache/>`_
:重点: 键定位、最近使用顺序、常数时间刷新、表尾淘汰

题目重述
--------

设计一个固定容量的 LRU 缓存。``get(key)`` 在键存在时返回对应值并把该键标记为最近使用，不存在时返回 ``-1``；``put(key, value)`` 更新已有键或插入新键，并把该键标记为最近使用。插入导致容量超限时，淘汰最久未使用的键。两种操作都要求平均 ``O(1)`` 时间。

自建示例
--------

.. code-block:: text

   capacity = 2，链表顺序写成 MRU -> LRU
   put(1,10) : 1
   put(2,20) : 2 -> 1
   get(1)    : 1 -> 2，返回 10
   put(3,30) : 3 -> 1，淘汰 2
   get(2)    : 未命中，返回 -1，顺序不变

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_map>

   class LRUCache {
       struct Node {
           int key, value;
           Node* previous;
           Node* next;
           Node(int k, int v): key(k), value(v), previous(nullptr), next(nullptr) {}
       };

       int capacity;
       std::unordered_map<int,Node*> index;
       Node* head;
       Node* tail;

       void detach(Node* node) {
           node->previous->next = node->next;
           node->next->previous = node->previous;
       }

       void addFront(Node* node) {
           node->next = head->next;
           node->previous = head;
           head->next->previous = node;
           head->next = node;
       }

       void touch(Node* node) {
           detach(node);
           addFront(node);
       }

   public:
       LRUCache(int capacity): capacity(capacity) {
           head = new Node(0,0);
           tail = new Node(0,0);
           head->next = tail;
           tail->previous = head;
       }

       int get(int key) {
           auto found = index.find(key);
           if (found == index.end()) return -1;
           touch(found->second);
           return found->second->value;
       }

       void put(int key, int value) {
           auto found = index.find(key);
           if (found != index.end()) {
               found->second->value = value;
               touch(found->second);
               return;
           }
           Node* node = new Node(key,value);
           index[key] = node;
           addFront(node);
           if (static_cast<int>(index.size()) > capacity) {
               Node* victim = tail->previous;
               detach(victim);
               index.erase(victim->key);
               delete victim;
           }
       }

       ~LRUCache() {
           Node* node = head;
           while (node) { Node* next = node->next; delete node; node = next; }
       }
   };

题解
----

为什么单一结构不够
~~~~~~~~~~~~~~~~~~

哈希表能按键常数时间定位，却不维护使用先后；普通链表能维护顺序，但按键查找需要线性扫描。组合后，映射值直接指向链表节点。

链表不变量
~~~~~~~~~~

两个哨兵之间保存全部缓存项：``head.next`` 是最近使用项，``tail.previous`` 是最久未使用项。每个缓存键在哈希表和链表中各出现一次，二者形成一一对应。

刷新与淘汰
~~~~~~~~~~

哈希表先得到节点地址；双向链表已知节点时可以常数时间摘除，再插到表头。所有成功访问都刷新表头，因此容量超限时删除 ``tail.previous`` 即可。失败的 ``get`` 不改变顺序。

复杂度来源
~~~~~~~~~~

哈希查找平均 ``O(1)``，链表摘除、插入和表尾定位都是 ``O(1)``；空间 ``O(capacity)``。线性序列或时间戳基准在刷新或淘汰时需要扫描缓存。

九语言实现
----------

C
~

.. code-block:: c

   typedef struct LNode{int key,value;struct LNode*prev,*next;}LNode;typedef struct{int cap,size;LNode**index,*head,*tail;}LRUCache;static void detach(LNode*n){n->prev->next=n->next;n->next->prev=n->prev;}static void front(LRUCache*c,LNode*n){n->next=c->head->next;n->prev=c->head;c->head->next->prev=n;c->head->next=n;}LRUCache*lRUCacheCreate(int cap){LRUCache*c=malloc(sizeof(*c));c->cap=cap;c->size=0;c->index=calloc(10001,sizeof(LNode*));c->head=calloc(1,sizeof(LNode));c->tail=calloc(1,sizeof(LNode));c->head->next=c->tail;c->tail->prev=c->head;return c;}int lRUCacheGet(LRUCache*c,int key){LNode*n=c->index[key];if(!n)return -1;detach(n);front(c,n);return n->value;}void lRUCachePut(LRUCache*c,int key,int value){LNode*n=c->index[key];if(n){n->value=value;detach(n);front(c,n);return;}n=malloc(sizeof(*n));n->key=key;n->value=value;c->index[key]=n;front(c,n);c->size++;if(c->size>c->cap){LNode*v=c->tail->prev;detach(v);c->index[v->key]=NULL;free(v);c->size--;}}void lRUCacheFree(LRUCache*c){LNode*n=c->head;while(n){LNode*next=n->next;free(n);n=next;}free(c->index);free(c);}

Python
~~~~~~

.. code-block:: python

   from collections import OrderedDict
   class LRUCache:
       def __init__(self, capacity): self.capacity=capacity; self.data=OrderedDict()
       def get(self, key):
           if key not in self.data: return -1
           self.data.move_to_end(key); return self.data[key]
       def put(self, key, value):
           if key in self.data: self.data.move_to_end(key)
           self.data[key]=value
           if len(self.data)>self.capacity: self.data.popitem(last=False)

Java
~~~~

.. code-block:: java

   class LRUCache {private final int cap;private final LinkedHashMap<Integer,Integer>data=new LinkedHashMap<>(16,0.75f,true);LRUCache(int capacity){cap=capacity;}public int get(int key){return data.getOrDefault(key,-1);}public void put(int key,int value){data.put(key,value);if(data.size()>cap){Iterator<Integer>it=data.keySet().iterator();it.next();it.remove();}}}

Rust
~~~~

.. code-block:: rust

   struct Node{key:i32,value:i32,prev:Option<usize>,next:Option<usize>}struct LRUCache{cap:usize,map:std::collections::HashMap<i32,usize>,nodes:Vec<Node>,head:Option<usize>,tail:Option<usize>}impl LRUCache{fn new(capacity:i32)->Self{Self{cap:capacity as usize,map:std::collections::HashMap::new(),nodes:vec![],head:None,tail:None}}fn detach(&mut self,i:usize){let(p,n)=(self.nodes[i].prev,self.nodes[i].next);if let Some(x)=p{self.nodes[x].next=n}else{self.head=n}if let Some(x)=n{self.nodes[x].prev=p}else{self.tail=p}}fn front(&mut self,i:usize){self.nodes[i].prev=None;self.nodes[i].next=self.head;if let Some(h)=self.head{self.nodes[h].prev=Some(i)}else{self.tail=Some(i)}self.head=Some(i)}fn get(&mut self,key:i32)->i32{let Some(&i)=self.map.get(&key)else{return -1};let value=self.nodes[i].value;self.detach(i);self.front(i);value}fn put(&mut self,key:i32,value:i32){if let Some(&i)=self.map.get(&key){self.nodes[i].value=value;self.detach(i);self.front(i);return}let i=if self.nodes.len()<self.cap{self.nodes.push(Node{key,value,prev:None,next:None});self.nodes.len()-1}else{let i=self.tail.unwrap();self.detach(i);self.map.remove(&self.nodes[i].key);self.nodes[i].key=key;self.nodes[i].value=value;i};self.front(i);self.map.insert(key,i);}}

Go
~~

.. code-block:: go

   type entry struct{key,value int;prev,next *entry};type LRUCache struct{cap int;items map[int]*entry;head,tail *entry};func Constructor(capacity int)LRUCache{h,t:=&entry{},&entry{};h.next=t;t.prev=h;return LRUCache{capacity,map[int]*entry{},h,t}};func(c *LRUCache)detach(n *entry){n.prev.next=n.next;n.next.prev=n.prev};func(c *LRUCache)front(n *entry){n.next=c.head.next;n.prev=c.head;c.head.next.prev=n;c.head.next=n};func(c *LRUCache)Get(key int)int{n:=c.items[key];if n==nil{return -1};c.detach(n);c.front(n);return n.value};func(c *LRUCache)Put(key,value int){if n:=c.items[key];n!=nil{n.value=value;c.detach(n);c.front(n);return};n:=&entry{key:key,value:value};c.items[key]=n;c.front(n);if len(c.items)>c.cap{v:=c.tail.prev;c.detach(v);delete(c.items,v.key)}}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   class LRUCache{private data=new Map<number,number>();constructor(private capacity:number){}get(key:number):number{if(!this.data.has(key))return -1;const value=this.data.get(key)!;this.data.delete(key);this.data.set(key,value);return value;}put(key:number,value:number):void{this.data.delete(key);this.data.set(key,value);if(this.data.size>this.capacity){const oldest=this.data.keys().next().value!;this.data.delete(oldest);}}}

C#
~~

.. code-block:: csharp

   public class LRUCache {readonly int cap;readonly Dictionary<int,LinkedListNode<(int key,int value)>>map=new();readonly LinkedList<(int key,int value)>order=new();public LRUCache(int capacity){cap=capacity;}public int Get(int key){if(!map.TryGetValue(key,out var n))return -1;order.Remove(n);order.AddFirst(n);return n.Value.value;}public void Put(int key,int value){if(map.TryGetValue(key,out var n)){n.Value=(key,value);order.Remove(n);order.AddFirst(n);return;}n=order.AddFirst((key,value));map[key]=n;if(map.Count>cap){var v=order.Last!;order.RemoveLast();map.Remove(v.Value.key);}}}

Julia
~~~~~

.. code-block:: julia

   mutable struct LNode;key::Int;value::Int;prev::Any;next::Any;end
   mutable struct LRUCache;cap::Int;map::Dict{Int,LNode};head::LNode;tail::LNode;end
   function LRUCache(cap);h=LNode(0,0,nothing,nothing);t=LNode(0,0,h,nothing);h.next=t;LRUCache(cap,Dict{Int,LNode}(),h,t);end
   detach!(n)=(n.prev.next=n.next;n.next.prev=n.prev)
   function front!(c,n);n.next=c.head.next;n.prev=c.head;c.head.next.prev=n;c.head.next=n;end
   function get!(c::LRUCache,key);haskey(c.map,key)||return -1;n=c.map[key];detach!(n);front!(c,n);n.value;end
   function put!(c::LRUCache,key,value);if haskey(c.map,key);n=c.map[key];n.value=value;detach!(n);front!(c,n);return;end;n=LNode(key,value,nothing,nothing);c.map[key]=n;front!(c,n);if length(c.map)>c.cap;v=c.tail.prev;detach!(v);delete!(c.map,v.key);end;end

R
~

.. code-block:: r

   new_lru <- function(cap){c<-new.env();c$cap<-cap;c$size<-0L;c$map<-new.env(hash=TRUE,parent=emptyenv());c$head<-NULL;c$tail<-NULL;c};detach<-function(c,n){if(is.null(n$prev))c$head<-n$next else n$prev$next<-n$next;if(is.null(n$next))c$tail<-n$prev else n$next$prev<-n$prev};front<-function(c,n){n$prev<-NULL;n$next<-c$head;if(!is.null(c$head))c$head$prev<-n else c$tail<-n;c$head<-n};lru_get<-function(c,key){k<-as.character(key);if(!exists(k,c$map,inherits=FALSE))return(-1L);n<-get(k,c$map);detach(c,n);front(c,n);n$value};lru_put<-function(c,key,value){k<-as.character(key);if(exists(k,c$map,inherits=FALSE)){n<-get(k,c$map);n$value<-value;detach(c,n);front(c,n);return(invisible(NULL))};n<-new.env();n$key<-key;n$value<-value;assign(k,n,c$map);front(c,n);c$size<-c$size+1L;if(c$size>c$cap){v<-c$tail;detach(c,v);rm(list=as.character(v$key),envir=c$map);c$size<-c$size-1L};invisible(NULL)}