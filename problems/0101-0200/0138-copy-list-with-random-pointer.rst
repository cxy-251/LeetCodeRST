0138. Copy List with Random Pointer
===================================

题目信息
--------

:题号: 0138
:难度: Medium
:主题: 链表、哈希映射、深复制
:原题: `LeetCode 0138 <https://leetcode.com/problems/copy-list-with-random-pointer/>`_
:访问状态: Available
:教学重点: 节点身份映射

题目重述
--------

链表节点除 ``next`` 外还有可指向任意节点或空的 ``random``。返回完全独立的深复制。

自建示例
--------

.. code-block:: text

   输入：[[7,null],[13,0],[11,4],[10,2],[1,0]]
   输出：值与 next/random 拓扑相同的新链表

问题抽象
--------

第一遍为每个原节点创建副本并建立身份映射；第二遍通过映射设置副本的 ``next`` 和 ``random``。

主解法：两遍哈希映射
------------

思路
~~~~

两遍哈希映射。 节点身份映射

核心状态与不变量
~~~~~~~~~~~~~~~~

第一遍为每个原节点创建副本并建立身份映射；第二遍通过映射设置副本的 ``next`` 和 ``random``。

正确性依据
~~~~~~~~~~

映射为每个原节点提供唯一副本。第二遍对每条可见引用映射到目标副本，因此所有拓扑保持；所有引用都指向新节点，故无共享。

复杂度与语言边界
~~~~~~~~~~~~~~~~

身份哈希实现时间和映射空间均 ``O(n)``；C 与 R 的无外部依赖适配器以线性身份表定位 random 目标，最坏时间 ``O(n^2)``。输出 ``O(n)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   struct Node*copyRandomList(struct Node*head) {
       if(!head)return NULL;
       int n=0;
       for(struct Node*p=head;p;p=p->next)n++;
       struct Node**o=malloc((size_t)n*sizeof(*o)),**c=malloc((size_t)n*sizeof(*c));
       int i=0;
       for(struct Node*p=head;p;p=p->next) {
           o[i]=p;
           c[i]=malloc(sizeof(**c));
           c[i]->val=p->val;
           i++;
       }
       for(i=0;i<n;i++) {
           c[i]->next=i+1<n?c[i+1]:NULL;
           c[i]->random=NULL;
           if(o[i]->random)for(int j=0;j<n;j++)if(o[j]==o[i]->random) {
               c[i]->random=c[j];
               break;
           }
       }
       struct Node*r=c[0];
       free(o);
       free(c);
       return r;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:Node*copyRandomList(Node*h) {
           unordered_map<Node*,Node*>m;
           for(Node*p=h;p;p=p->next)m[p]=new Node(p->val);
           for(Node*p=h;p;p=p->next) {
               m[p]->next=m[p->next];
               m[p]->random=m[p->random];
           }
           return m[h];
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def copyRandomList(self, head: 'Node|None') -> 'Node|None':
           m = {None: None}
           p = head
           while p:
               m[p] = Node(p.val)
               p = p.next
           p = head
           while p:
               m[p].next = m[p.next]
               m[p].random = m[p.random]
               p = p.next
           return m[head]
Java
~~~~

.. code-block:: java

   class Solution {
       public Node copyRandomList(Node h) {
           Map<Node,Node>m=new HashMap<>();
           m.put(null,null);
           for(Node p=h;p!=null;p=p.next)m.put(p,new Node(p.val));
           for(Node p=h;p!=null;p=p.next) {
               m.get(p).next=m.get(p.next);
               m.get(p).random=m.get(p.random);
           }
           return m.get(h);
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::HashMap;
   use std::rc::Rc;
   impl Solution {
       pub fn copy_random_list(head:Option<Rc<RefCell<Node>>>)->Option<Rc<RefCell<Node>>> {
           let mut orig=vec![];
           let mut p=head.clone();
           while let Some(n)=p {
               orig.push(n.clone());
               p=n.borrow().next.clone();
           }
           let copies: Vec<_> = orig .iter() .map(|n|
               Rc::new(RefCell::new(Node::new(n.borrow().val)))) .collect();
           let mut idx=HashMap::new();
           for(i,n)in orig.iter().enumerate() {
               idx.insert(Rc::as_ptr(n)as usize,i);
           }
           for i in 0..orig.len() {
               copies[i].borrow_mut().next=if i+1<copies.len() {
                   Some(copies[i+1].clone())
               } else {
                   None
               };
               if let Some(r)=orig[i].borrow().random.clone() {
                   copies[i].borrow_mut().random=Some(copies[idx[&(Rc::as_ptr(&r)as
                       usize)]].clone());
               }
           }
           copies.first().cloned()
       }
   }
Go
~~

.. code-block:: go

   func copyRandomList(h *Node) *Node {
   	m := map[*Node]*Node{nil: nil}
   	for p := h; p != nil; p = p.Next {
   		m[p] = &Node{Val: p.Val}
   	}
   	for p := h; p != nil; p = p.Next {
   		m[p].Next = m[p.Next]
   		m[p].Random = m[p.Random]
   	}
   	return m[h]
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function copyRandomList(h: Node | null): Node | null {
       const m = new Map<Node | null, Node | null>([[null, null]]);
       for (let p = h; p; p = p.next)
           m.set(p, new Node(p.val));
       for (let p = h; p; p = p.next) {
           m.get(p)!.next = m.get(p.next)!;
           m.get(p)!.random = m.get(p.random)!;
       }
       return m.get(h)!;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public Node CopyRandomList(Node h) {
           var m=new Dictionary<Node,Node>();
           for(var p=h;p!=null;p=p.next)m[p]=new Node(p.val);
           for(var p=h;p!=null;p=p.next) {
               m[p].next=p.next==null?null:m[p.next];
               m[p].random=p.random==null?null:m[p.random];
           }
           return h==null?null:m[h];
       }
   }
Julia
~~~~~

.. code-block:: julia

   function copy_random_list(head::Union{Node,Nothing})
       m=IdDict{Node,Node}()
       p=head
       while p!==nothing
           m[p]=Node(p.val)
           p=p.next
       end
       p=head
       while p!==nothing
           m[p].next=p.next===nothing ? nothing : m[p.next]
           m[p].random=p.random===nothing ? nothing : m[p.random]
           p=p.next
       end
       head===nothing ? nothing : m[head]
   end
R
~

.. code-block:: r

   copy_random_list <- function(head) {
       originals <- list()
       copies <- list()
       current <- head
       while (!is.null(current)) {
           originals[[length(originals) + 1L]] <- current
           copies[[length(copies) + 1L]] <- new_random_node(current$val)
           current <- current$next
       }
       find_index <- function(target) {
           if (is.null(target)) return(0L)
           for (i in seq_along(originals)) if (identical(originals[[i]], target)) return(i)
           stop("random target is outside the list")
       }
       for (i in seq_along(copies)) {
           copies[[i]]$next <- if (i < length(copies)) copies[[i + 1L]] else NULL
           random_index <- find_index(originals[[i]]$random)
           copies[[i]]$random <- if (random_index == 0L) NULL else copies[[random_index]]
       }
       if (length(copies) == 0L) NULL else copies[[1L]]
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空链表返回空。
* random 可指向自身、前驱或后继。

易错点
------

* 按值映射，值可能重复。
* 复制 next 后忘记 random。

本题新增知识
------------

* 节点身份映射
* 题号 0138 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0133. Clone Graph <0133-clone-graph.rst>`_；
* `0141. Linked List Cycle <0141-linked-list-cycle.rst>`_；

最小自检
--------

#. ``两遍哈希映射`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

映射为每个原节点提供唯一副本。第二遍对每条可见引用映射到目标副本，因此所有拓扑保持；所有引用都指向新节点，故无共享。
