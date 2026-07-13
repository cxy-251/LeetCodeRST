0117. Populating Next Right Pointers in Each Node II
====================================================

题目信息
--------

:题号: 0117
:难度: Medium
:主题: 二叉树、层链、哑节点
:原题: `LeetCode 0117 <https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/>`_
:访问状态: Available
:教学重点: 任意稀疏孩子串联

题目重述
--------

给定任意二叉树，建立每层从左到右的 ``next`` 链。

自建示例
--------

.. code-block:: text

   输入：root = [1,2,3,4,5,null,7]
   输出：1->null，2->3->null，4->5->7->null

问题抽象
--------

沿当前层 ``next`` 链扫描，把每个非空左、右孩子依次追加到哑节点后的下一层链；扫描结束后切换到下一层头。

主解法：哑节点构造下一层
--------------

思路
~~~~

哑节点构造下一层。 任意稀疏孩子串联

核心状态与不变量
~~~~~~~~~~~~~~~~

沿当前层 ``next`` 链扫描，把每个非空左、右孩子依次追加到哑节点后的下一层链；扫描结束后切换到下一层头。

正确性依据
~~~~~~~~~~

当前层按从左到右扫描，孩子按父节点顺序和左后右追加，因此哑链恰是下一层从左到右的全部节点且无遗漏。逐层重复覆盖全树。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；额外空间 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   struct Node* connect(struct Node*root) {
       struct Node*level=root;
       while(level) {
           struct Node dummy= {
               0,NULL,NULL,NULL
           };
           struct Node*tail=&dummy;
           for(struct Node*p=level;p;p=p->next) {
               if(p->left) {
                   tail->next=p->left;
                   tail=tail->next;
               }
               if(p->right) {
                   tail->next=p->right;
                   tail=tail->next;
               }
           }
           level=dummy.next;
       }
       return root;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:Node*connect(Node*root) {
           Node*level=root;
           while(level) {
               Node dummy(0);
               Node*tail=&dummy;
               for(Node*p=level;p;p=p->next) {
                   if(p->left) {
                       tail->next=p->left;
                       tail=tail->next;
                   }
                   if(p->right) {
                       tail->next=p->right;
                       tail=tail->next;
                   }
               }
               level=dummy.next;
           }
           return root;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def connect(self, root: 'Node|None') -> 'Node|None':
           level = root
           while level:
               dummy = Node(0)
               tail = dummy
               p = level
               while p:
                   for child in (p.left, p.right):
                       if child:
                           tail.next = child
                           tail = child
                   p = p.next
               level = dummy.next
           return root
Java
~~~~

.. code-block:: java

   class Solution {
       public Node connect(Node root) {
           Node level=root;
           while(level!=null) {
               Node dummy=new Node(0),tail=dummy;
               for(Node p=level;p!=null;p=p.next) {
                   if(p.left!=null) {
                       tail.next=p.left;
                       tail=tail.next;
                   }
                   if(p.right!=null) {
                       tail.next=p.right;
                       tail=tail.next;
                   }
               }
               level=dummy.next;
           }
           return root;
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn connect(root:Option<Rc<RefCell<Node>>>)->Option<Rc<RefCell<Node>>> {
           let mut level=root.clone();
           while let Some(start)=level {
               let mut head:Option<Rc<RefCell<Node>>>=None;
               let mut tail:Option<Rc<RefCell<Node>>>=None;
               let mut p=Some(start);
               while let Some(n)=p {
                   let(children,next)= {
                       let b=n.borrow();
                       ([b.left.clone(),b.right.clone()],b.next.clone())
                   };
                   for child in children.into_iter().flatten() {
                       if let Some(t)=tail.clone() {
                           t.borrow_mut().next=Some(child.clone())
                       } else {
                           head=Some(child.clone())
                       }
                       tail=Some(child)
                   }
                   p=next;
               }
               level=head;
           }
           root
       }
   }
Go
~~

.. code-block:: go

   func connect(root *Node) *Node {
   	for level := root; level != nil; {
   		dummy := &Node{}
   		tail := dummy
   		for p := level; p != nil; p = p.Next {
   			if p.Left != nil {
   				tail.Next = p.Left
   				tail = tail.Next
   			}
   			if p.Right != nil {
   				tail.Next = p.Right
   				tail = tail.Next
   			}
   		}
   		level = dummy.Next
   	}
   	return root
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function connect(root: Node | null): Node | null {
       for (let level = root; level !== null;) {
           const dummy = new Node(0);
           let tail = dummy;
           for (let p: Node | null = level; p !== null; p = p.next) {
               if (p.left) {
                   tail.next = p.left;
                   tail = tail.next;
               }
               if (p.right) {
                   tail.next = p.right;
                   tail = tail.next;
               }
           }
           level = dummy.next;
       }
       return root;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public Node Connect(Node root) {
           for(Node level=root;level!=null;) {
               Node dummy=new Node(0),tail=dummy;
               for(Node p=level;p!=null;p=p.next) {
                   if(p.left!=null) {
                       tail.next=p.left;
                       tail=tail.next;
                   }
                   if(p.right!=null) {
                       tail.next=p.right;
                       tail=tail.next;
                   }
               }
               level=dummy.next;
           }
           return root;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function connect!(root::Union{Node,Nothing})
       level=root
       while level!==nothing
           dummy=Node(0)
           tail=dummy
           p=level
           while p!==nothing
               for child in (p.left,p.right)
                   if child!==nothing
                       tail.next=child
                       tail=child
                   end
               end
               p=p.next
           end
           level=dummy.next
       end
       root
   end
R
~

.. code-block:: r

   connect <- function(root) {
       level<-root
       while(!is.null(level)) {
           dummy<-new_node(0L)
           tail<-dummy
           p<-level
           while(!is.null(p)) {
               for(child in list(p$left,p$right))if(!is.null(child)) {
                   tail$next<-child
                   tail<-child
               }
               p<-p$next
           }
           level<-dummy$next
       }
       root
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 稀疏层可能只有一个孩子。
* 每轮必须重置哑节点和尾指针。

易错点
------

* 依赖完美树的跨父公式。
* 尾节点旧 next 未清理导致串入旧链。

本题新增知识
------------

* 任意稀疏孩子串联
* 题号 0117 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0116. Populating Next Right Pointers in Each Node <0116-populating-next-right-pointers-in-each-node.rst>`_；
* `0102. Binary Tree Level Order Traversal <0102-binary-tree-level-order-traversal.rst>`_；

最小自检
--------

#. ``哑节点构造下一层`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

当前层按从左到右扫描，孩子按父节点顺序和左后右追加，因此哑链恰是下一层从左到右的全部节点且无遗漏。逐层重复覆盖全树。
