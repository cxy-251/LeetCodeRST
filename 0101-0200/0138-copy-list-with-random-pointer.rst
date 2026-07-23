0138. Copy List with Random Pointer
===================================

题目信息
--------

:题号: 0138
:难度: Medium
:主题: 链表、哈希映射、深拷贝、节点交织
:原题: `LeetCode 0138 <https://leetcode.com/problems/copy-list-with-random-pointer/>`_
:重点: 身份映射、随机引用、交织定位、原链恢复

题目重述
--------

链表节点包含 ``val``、``next`` 和 ``random`` 指针，其中 ``random`` 可以指向链表中的任意节点或为空。返回这条链表的深拷贝：每个副本节点都是全新对象，副本之间的 ``next`` 与 ``random`` 关系必须与原链表一致，并且副本链表中不能包含指向原节点的引用。

自建示例
--------

.. code-block:: text

   A(4) -> B(4) -> C(9)
   A.random=C, B.random=A, C.random=C

   副本 a,b,c 必须是三个不同新对象，并保持同样引用关系。

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_map>

   class Solution {
   private:
       Node* hashTwoPass(Node* head) {
           if (!head) return nullptr;
           std::unordered_map<Node*,Node*> copies;
           for (Node* p = head; p; p = p->next) copies[p] = new Node(p->val);
           for (Node* p = head; p; p = p->next) {
               copies[p]->next = p->next ? copies[p->next] : nullptr;
               copies[p]->random = p->random ? copies[p->random] : nullptr;
           }
           return copies[head];
       }

       Node* recursive(Node* node, std::unordered_map<Node*,Node*>& copies) {
           if (!node) return nullptr;
           if (copies.count(node)) return copies[node];
           Node* copy = new Node(node->val);
           copies[node] = copy;
           copy->next = recursive(node->next, copies);
           copy->random = recursive(node->random, copies);
           return copy;
       }

       Node* interleaving(Node* head) {
           if (!head) return nullptr;
           for (Node* p = head; p; p = p->next->next) {
               Node* copy = new Node(p->val);
               copy->next = p->next;
               p->next = copy;
           }
           for (Node* p = head; p; p = p->next->next)
               p->next->random = p->random ? p->random->next : nullptr;
           Node* copy_head = head->next;
           for (Node* p = head; p; ) {
               Node* copy = p->next;
               p->next = copy->next;
               copy->next = p->next ? p->next->next : nullptr;
               p = p->next;
           }
           return copy_head;
       }

   public:
       Node* copyRandomList(Node* head) {
           return interleaving(head);
       }
   };

题解
----

为什么按值复制不够
~~~~~~~~~~~~~~~~~~

节点值可以重复，``random`` 指向的是特定对象身份。必须建立“原节点对象 → 唯一副本对象”的对应关系，不能用值代替身份。

交织结构如何替代哈希表
~~~~~~~~~~~~~~~~~~~~~~

第一遍把每个副本插到原节点之后：

.. code-block:: text

   A -> a -> B -> b -> C -> c

于是任意原节点 ``X`` 的副本固定为 ``X.next``。若 ``A.random = C``，则 ``a.random = A.random.next = c``。

三阶段
~~~~~~

.. list-table::
   :header-rows: 1

   * - 阶段
     - 结构
   * - 创建并交织
     - ``old -> copy -> old -> copy``
   * - 复制 random
     - ``copy.random = old.random.next``
   * - 拆分
     - 恢复原链并串起副本链

拆分为何必须同时恢复两条链
~~~~~~~~~~~~~~~~~~~~~~~~~~

对每个原节点，先把 ``old.next`` 跳过副本恢复原后继；再让副本 ``next`` 指向下一原节点的副本。处理顺序保留了尚未读取的交织信息，最终原链与副本链完全分离。

为什么是深拷贝
~~~~~~~~~~~~~~

所有副本都由新分配产生；副本的 ``next`` 和 ``random`` 只指向交织结构中的其他副本。拆分后返回图不含任何原节点引用。

复杂度来源
~~~~~~~~~~

三次线性扫描，时间 ``O(n)``。交织法除新节点本身外只使用常数指针；哈希方法额外使用 ``O(n)`` 映射。

九语言实现
----------

C
~

.. code-block:: c

   struct Node*copyRandomList(struct Node*head){if(!head)return NULL;for(struct Node*p=head;p;p=p->next->next){struct Node*c=malloc(sizeof(struct Node));c->val=p->val;c->next=p->next;c->random=NULL;p->next=c;}for(struct Node*p=head;p;p=p->next->next)p->next->random=p->random?p->random->next:NULL;struct Node*out=head->next;for(struct Node*p=head;p;){struct Node*c=p->next;p->next=c->next;c->next=p->next?p->next->next:NULL;p=p->next;}return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def copyRandomList(self, head):
           if not head: return None
           p=head
           while p: copy=Node(p.val); copy.next=p.next; p.next=copy; p=copy.next
           p=head
           while p: p.next.random=p.random.next if p.random else None; p=p.next.next
           out=head.next; p=head
           while p:
               copy=p.next; p.next=copy.next; copy.next=p.next.next if p.next else None; p=p.next
           return out

Java
~~~~

.. code-block:: java

   class Solution {public Node copyRandomList(Node head){if(head==null)return null;for(Node p=head;p!=null;p=p.next.next){Node c=new Node(p.val);c.next=p.next;p.next=c;}for(Node p=head;p!=null;p=p.next.next)p.next.random=p.random==null?null:p.random.next;Node out=head.next;for(Node p=head;p!=null;){Node c=p.next;p.next=c.next;c.next=p.next==null?null:p.next.next;p=p.next;}return out;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn copy_random_list(head:Option<std::rc::Rc<std::cell::RefCell<Node>>>)->Option<std::rc::Rc<std::cell::RefCell<Node>>>{use std::{cell::RefCell,collections::HashMap,rc::Rc};let mut map:HashMap<usize,Rc<RefCell<Node>>>=HashMap::new();let mut p=head.clone();while let Some(x)=p{let key=Rc::as_ptr(&x)as usize;map.insert(key,Rc::new(RefCell::new(Node::new(x.borrow().val))));p=x.borrow().next.clone();}p=head.clone();while let Some(x)=p{let key=Rc::as_ptr(&x)as usize;let y=map[&key].clone();y.borrow_mut().next=x.borrow().next.as_ref().map(|n|map[&(Rc::as_ptr(n)as usize)].clone());y.borrow_mut().random=x.borrow().random.as_ref().map(|n|map[&(Rc::as_ptr(n)as usize)].clone());p=x.borrow().next.clone();}head.map(|x|map[&(Rc::as_ptr(&x)as usize)].clone())}}

Go
~~

.. code-block:: go

   func copyRandomList(head *Node)*Node{if head==nil{return nil};for p:=head;p!=nil;p=p.Next.Next{c:=&Node{Val:p.Val,Next:p.Next};p.Next=c};for p:=head;p!=nil;p=p.Next.Next{if p.Random!=nil{p.Next.Random=p.Random.Next}};out:=head.Next;for p:=head;p!=nil{c:=p.Next;p.Next=c.Next;if p.Next!=nil{c.Next=p.Next.Next}else{c.Next=nil};p=p.Next};return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function copyRandomList(head:Node|null):Node|null{if(!head)return null;for(let p:Node|null=head;p;p=p.next!.next){const c=new Node(p.val);c.next=p.next;p.next=c;}for(let p:Node|null=head;p;p=p.next!.next)p.next!.random=p.random?p.random.next:null;const out=head.next;for(let p:Node|null=head;p;){const c=p.next!;p.next=c.next;c.next=p.next?p.next.next:null;p=p.next;}return out;}

C#
~~

.. code-block:: csharp

   public class Solution {public Node CopyRandomList(Node head){if(head==null)return null;for(var p=head;p!=null;p=p.next.next){var c=new Node(p.val);c.next=p.next;p.next=c;}for(var p=head;p!=null;p=p.next.next)p.next.random=p.random==null?null:p.random.next;var result=head.next;for(var p=head;p!=null;){var c=p.next;p.next=c.next;c.next=p.next==null?null:p.next.next;p=p.next;}return result;}}

Julia
~~~~~

.. code-block:: julia

   function copy_random_list(head)
       head===nothing&&return nothing;copies=IdDict{Any,Any}();p=head
       while p!==nothing;copies[p]=RandomNode(p.val,nothing,nothing);p=p.next;end;p=head
       while p!==nothing;y=copies[p];y.next=p.next===nothing ? nothing : copies[p.next];y.random=p.random===nothing ? nothing : copies[p.random];p=p.next;end;copies[head]
   end

R
~

.. code-block:: r

   copy_random_list <- function(head){if(is.null(head))return(NULL);old<-list();copies<-list();p<-head;while(!is.null(p)){old[[length(old)+1L]]<-p;y<-new.env(parent=emptyenv());y$val<-p$val;y$next<-NULL;y$random<-NULL;copies[[length(copies)+1L]]<-y;p<-p$next};find<-function(x){if(is.null(x))return(0L);for(i in seq_along(old))if(identical(old[[i]],x))return(i);0L};for(i in seq_along(old)){j<-find(old[[i]]$next);k<-find(old[[i]]$random);copies[[i]]$next<-if(j)copies[[j]]else NULL;copies[[i]]$random<-if(k)copies[[k]]else NULL};copies[[1L]]}