0138. Copy List with Random Pointer
===================================

题目信息
--------

:题号: 0138
:难度: Medium
:主题: 链表、哈希映射、对象身份、深拷贝
:原题: `LeetCode 0138 <https://leetcode.com/problems/copy-list-with-random-pointer/>`_
:访问状态: Available
:教学重点: 原节点到副本的身份映射、两阶段建图、引用隔离

题目重述
--------

给定一条链表。每个节点包含整数 ``val``、指向下一个节点的 ``next``，以及可以指向链表中任意节点或空的
``random``。返回整条链表的深拷贝：副本节点的值、``next`` 和 ``random`` 关系与原链表一致，同时不能
复用任何原节点。空输入返回空，原链表保持不变。

算法
----

维护按对象身份索引的映射 ``copies[original] = clone``，执行两次扫描：

#. 第一次沿 ``next`` 遍历，为每个原节点创建只含 ``val`` 的副本并登记映射；
#. 第二次再次遍历，令每个副本的 ``next`` 和 ``random`` 分别指向映射中对应原引用的副本；
#. 返回头节点对应的副本。

第一次扫描先创建全部节点，第二次扫描时，无论 ``random`` 指向前方、后方、自身或空，对应副本都已经存在。

正确性
~~~~~~

第一次扫描为每个原节点创建且只创建一个副本，因此映射在原节点集合与副本节点集合之间建立一一对应。
第二次扫描处理任意原节点 ``u`` 时，把 ``copy(u).next`` 设为 ``copy(u.next)``，并把
``copy(u).random`` 设为 ``copy(u.random)``；空引用仍保持空。因此每条结构边都被保留。

所有写入副本字段的非空引用都来自映射值，映射值全部是新创建对象，副本图中不存在原节点引用。值和两类边
都保持，且对象集合互不共享，所以返回结果是深拷贝。

复杂度
~~~~~~

设链表有 ``n`` 个节点。使用身份哈希映射的实现执行两次扫描，期望时间 ``O(n)``；映射占 ``O(n)``
算法额外空间，新链表占 ``O(n)`` 返回空间。C 使用开放寻址指针表，最坏碰撞情况下查找可退化。
R 基础适配器用 ``identical`` 在线性表中定位对象身份，时间 ``O(n^2)``、额外空间 ``O(n)``，避免依赖
非标准的环境地址字符串。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdint.h>
   #include <stdlib.h>

   struct PointerEntry {
       const struct Node *key;
       int index;
   };

   static size_t pointer_hash(const struct Node *node, size_t mask) {
       uintptr_t value = (uintptr_t)node;
       value ^= value >> 17;
       value ^= value >> 9;
       return (size_t)value & mask;
   }

   static void insert_pointer(
       struct PointerEntry *table,
       size_t mask,
       const struct Node *key,
       int index
   ) {
       size_t slot = pointer_hash(key, mask);
       while (table[slot].key != NULL) {
           slot = (slot + 1U) & mask;
       }
       table[slot].key = key;
       table[slot].index = index;
   }

   static int find_pointer(
       const struct PointerEntry *table,
       size_t mask,
       const struct Node *key
   ) {
       size_t slot = pointer_hash(key, mask);
       while (table[slot].key != key) {
           slot = (slot + 1U) & mask;
       }
       return table[slot].index;
   }

   static void free_copies(struct Node **copies, int count) {
       for (int i = 0; i < count; ++i) {
           free(copies[i]);
       }
   }

   struct Node *copyRandomList(struct Node *head) {
       if (head == NULL) {
           return NULL;
       }

       int count = 0;
       for (struct Node *node = head; node != NULL; node = node->next) {
           ++count;
       }

       struct Node **originals =
           malloc((size_t)count * sizeof(*originals));
       struct Node **copies = malloc((size_t)count * sizeof(*copies));
       size_t capacity = 1U;
       while (capacity < (size_t)count * 2U) {
           capacity <<= 1U;
       }
       struct PointerEntry *table =
           calloc(capacity, sizeof(*table));

       if (originals == NULL || copies == NULL || table == NULL) {
           free(originals);
           free(copies);
           free(table);
           return NULL;
       }

       int index = 0;
       for (struct Node *node = head; node != NULL; node = node->next) {
           originals[index] = node;
           copies[index] = malloc(sizeof(*copies[index]));
           if (copies[index] == NULL) {
               free_copies(copies, index);
               free(originals);
               free(copies);
               free(table);
               return NULL;
           }
           copies[index]->val = node->val;
           copies[index]->next = NULL;
           copies[index]->random = NULL;
           insert_pointer(table, capacity - 1U, node, index);
           ++index;
       }

       for (int i = 0; i < count; ++i) {
           copies[i]->next = i + 1 < count ? copies[i + 1] : NULL;
           if (originals[i]->random != NULL) {
               int random_index = find_pointer(
                   table,
                   capacity - 1U,
                   originals[i]->random
               );
               copies[i]->random = copies[random_index];
           }
       }

       struct Node *answer = copies[0];
       free(originals);
       free(copies);
       free(table);
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <unordered_map>

   class Solution {
   public:
       Node* copyRandomList(Node* head) {
           if (head == nullptr) return nullptr;

           std::unordered_map<Node*, Node*> copies;
           for (Node* node = head; node != nullptr; node = node->next) {
               copies[node] = new Node(node->val);
           }
           for (Node* node = head; node != nullptr; node = node->next) {
               Node* copy = copies[node];
               copy->next =
                   node->next == nullptr ? nullptr : copies[node->next];
               copy->random =
                   node->random == nullptr ? nullptr : copies[node->random];
           }
           return copies[head];
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def copyRandomList(self, head: "Node | None") -> "Node | None":
           if head is None:
               return None

           copies: dict[Node, Node] = {}
           node = head
           while node is not None:
               copies[node] = Node(node.val)
               node = node.next

           node = head
           while node is not None:
               copy = copies[node]
               copy.next = copies.get(node.next)
               copy.random = copies.get(node.random)
               node = node.next

           return copies[head]

Java
~~~~

.. code-block:: java

   import java.util.IdentityHashMap;
   import java.util.Map;

   class Solution {
       public Node copyRandomList(Node head) {
           if (head == null) return null;

           Map<Node, Node> copies = new IdentityHashMap<>();
           for (Node node = head; node != null; node = node.next) {
               copies.put(node, new Node(node.val));
           }
           for (Node node = head; node != null; node = node.next) {
               Node copy = copies.get(node);
               copy.next = copies.get(node.next);
               copy.random = copies.get(node.random);
           }
           return copies.get(head);
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::HashMap;
   use std::rc::Rc;

   impl Solution {
       pub fn copy_random_list(
           head: Option<Rc<RefCell<Node>>>,
       ) -> Option<Rc<RefCell<Node>>> {
           let mut copies: HashMap<
               *const RefCell<Node>,
               Rc<RefCell<Node>>,
           > = HashMap::new();

           let mut current = head.clone();
           while let Some(node) = current {
               let key = Rc::as_ptr(&node);
               let value = node.borrow().val;
               copies.insert(
                   key,
                   Rc::new(RefCell::new(Node {
                       val: value,
                       next: None,
                       random: None,
                   })),
               );
               current = node.borrow().next.clone();
           }

           current = head.clone();
           while let Some(node) = current {
               let key = Rc::as_ptr(&node);
               let copy = copies.get(&key).unwrap().clone();
               let next = node.borrow().next.clone();
               let random = node.borrow().random.clone();

               copy.borrow_mut().next = next.as_ref().map(|target| {
                   copies.get(&Rc::as_ptr(target)).unwrap().clone()
               });
               copy.borrow_mut().random = random.as_ref().map(|target| {
                   copies.get(&Rc::as_ptr(target)).unwrap().clone()
               });
               current = next;
           }

           head.as_ref().map(|node| {
               copies.get(&Rc::as_ptr(node)).unwrap().clone()
           })
       }
   }

Go
~~

.. code-block:: go

   func copyRandomList(head *Node) *Node {
       if head == nil {
           return nil
       }

       copies := make(map[*Node]*Node)
       for node := head; node != nil; node = node.Next {
           copies[node] = &Node{Val: node.Val}
       }
       for node := head; node != nil; node = node.Next {
           copy := copies[node]
           copy.Next = copies[node.Next]
           copy.Random = copies[node.Random]
       }
       return copies[head]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function copyRandomList(head: Node | null): Node | null {
       if (head === null) return null;

       const copies = new Map<Node, Node>();
       for (let node: Node | null = head; node !== null; node = node.next) {
           copies.set(node, new Node(node.val));
       }
       for (let node: Node | null = head; node !== null; node = node.next) {
           const copy = copies.get(node) as Node;
           copy.next = node.next === null
               ? null
               : copies.get(node.next) as Node;
           copy.random = node.random === null
               ? null
               : copies.get(node.random) as Node;
       }
       return copies.get(head) as Node;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public Node CopyRandomList(Node head) {
           if (head == null) return null;

           var copies = new Dictionary<Node, Node>();
           for (Node node = head; node != null; node = node.next) {
               copies[node] = new Node(node.val);
           }
           for (Node node = head; node != null; node = node.next) {
               Node copy = copies[node];
               copy.next = node.next == null ? null : copies[node.next];
               copy.random =
                   node.random == null ? null : copies[node.random];
           }
           return copies[head];
       }
   }

Julia
~~~~~

.. code-block:: julia

   mutable struct RandomNode
       val::Int
       next::Union{Nothing,RandomNode}
       random::Union{Nothing,RandomNode}
   end

   RandomNode(val::Int) = RandomNode(val, nothing, nothing)

   function copy_random_list(
       head::Union{Nothing,RandomNode},
   )::Union{Nothing,RandomNode}
       head === nothing && return nothing

       copies = IdDict{RandomNode,RandomNode}()
       node = head
       while node !== nothing
           copies[node] = RandomNode(node.val)
           node = node.next
       end

       node = head
       while node !== nothing
           copy = copies[node]
           copy.next = node.next === nothing ? nothing : copies[node.next]
           copy.random =
               node.random === nothing ? nothing : copies[node.random]
           node = node.next
       end
       return copies[head]
   end

R
~

.. code-block:: r

   new_random_node <- function(val) {
     node <- new.env(parent = emptyenv())
     node$val <- val
     node$next <- NULL
     node$random <- NULL
     node
   }

   copy_random_list <- function(head) {
     if (is.null(head)) return(NULL)

     originals <- list()
     copies <- list()
     node <- head
     while (!is.null(node)) {
       originals[[length(originals) + 1L]] <- node
       copies[[length(copies) + 1L]] <- new_random_node(node$val)
       node <- node$next
     }

     find_index <- function(target) {
       if (is.null(target)) return(NA_integer_)
       for (index in seq_along(originals)) {
         if (identical(originals[[index]], target)) return(index)
       }
       stop("random must reference a node in the input list")
     }

     for (index in seq_along(originals)) {
       if (index < length(copies)) {
         copies[[index]]$next <- copies[[index + 1L]]
       }
       random_index <- find_index(originals[[index]]$random)
       if (!is.na(random_index)) {
         copies[[index]]$random <- copies[[random_index]]
       }
     }
     copies[[1L]]
   }

关键边界
--------

* 空链表返回空；
* ``random`` 可以为空、指向自身、指向前方或指向已经经过的节点；
* 映射键必须是节点身份，节点值可能重复；
* 深拷贝验证必须检查副本节点与原节点没有共享身份；
* 算法不修改原链表，调用结束后原有 ``next`` 与 ``random`` 关系保持不变；
* C 返回的新节点由调用者负责释放，分配失败时函数清理已创建副本并返回空。

验证
----

运行空链表、单节点自指、两节点交叉引用和含空 ``random`` 的官方形态样例；Python 运行通过，C++ 严格
编译并运行相同结构检查。其余语言完成接口、身份映射与空引用静态检查；R 适配器单独记录二次时间边界。
未执行随机结构生成。

最小自检
--------

#. 为什么映射必须以对象身份作为键？
#. 为什么第一次扫描只创建节点，第二次扫描才连接引用？
#. 如何验证结果不仅结构相同，而且确实没有共享原节点？
