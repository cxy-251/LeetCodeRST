0117. Populating Next Right Pointers in Each Node II
===================================================

题目信息
--------

:题号: 0117
:难度: Medium
:主题: 一般二叉树、层级链接、原地修改、常量空间进阶
:原题: `LeetCode 0117 <https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/>`_
:重点: 稀疏二叉树、同层右邻节点、层尾空指针

题目重述
--------

给定一棵普通二叉树的根节点 ``root``。每个节点除 ``left`` 和 ``right`` 外还有一个初始为 ``null`` 的 ``next`` 指针。请设置每个节点的 ``next``，使它指向同一层中紧邻的右侧非空节点；若该节点已是本层最右侧，则 ``next`` 应为 ``null``。树可以缺少任意左、右孩子，完成连接后返回原根节点。

树中节点数在 ``0..6000`` 范围内，节点值在 ``-100..100`` 范围内。仅使用常量额外空间是本题的进阶要求，不改变上述输出契约。

自建示例
--------

.. code-block:: text

   输入（层序）：root = [8,4,12,null,6,10,null,5,null,null,11]
   输出（使用 # 表示每层末尾）：[8,#,4,12,#,6,10,#,5,11,#]
   解释：第三层建立 6 -> 10；第四层建立 5 -> 11，连接会跨过不同父节点及其中的空孩子位置。

.. code-block:: text

   输入：root = []
   输出：[]
   解释：空树没有需要设置的 next 指针。

C++ 实现
--------

.. code-block:: cpp

   #include <queue>

   class Solution {
   private:
       Node* breadthFirst(Node* root) {
           if (!root) return nullptr;
           std::queue<Node*> queue;
           queue.push(root);
           while (!queue.empty()) {
               int count = queue.size();
               Node* previous = nullptr;
               while (count--) {
                   Node* node = queue.front(); queue.pop();
                   if (previous) previous->next = node;
                   previous = node;
                   if (node->left) queue.push(node->left);
                   if (node->right) queue.push(node->right);
               }
               previous->next = nullptr;
           }
           return root;
       }

       Node* nextLayerHeadTail(Node* root) {
           if (!root) return nullptr;
           root->next = nullptr;
           Node* level_start = root;
           while (level_start) {
               Node dummy(0);
               Node* tail = &dummy;
               for (Node* current = level_start; current;
                    current = current->next) {
                   if (current->left) {
                       tail->next = current->left;
                       tail = tail->next;
                   }
                   if (current->right) {
                       tail->next = current->right;
                       tail = tail->next;
                   }
               }
               tail->next = nullptr;
               level_start = dummy.next;
           }
           return root;
       }

   public:
       Node* connect(Node* root) {
           return nextLayerHeadTail(root);
       }
   };

题解
----

固定孩子位置的公式为什么失效
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

一般树中 ``current.left``、``current.right`` 或右侧父节点的孩子都可能为空。右侧最近节点可能位于若干父节点之后，
不能用固定字段一步定位。

当前层如何生成下一层
~~~~~~~~~~~~~~~~~~~~

处理当前层时，它已经由 ``next`` 串成链。沿该链从左到右扫描父节点，并对每个父节点按“左孩子、右孩子”的顺序取出非空孩子。这个序列恰好是下一层从左到右的全部节点。

下一层头尾状态
~~~~~~~~~~~~~~

使用虚拟头 ``dummy`` 和链尾 ``tail``：

.. code-block:: text

   tail.next = child
   tail = child

第一个孩子自动成为 ``dummy.next``，后续孩子依次接到链尾。整层结束后，``dummy.next`` 是下一层起点。

.. list-table::
   :header-rows: 1

   * - 扫描父节点
     - 发现孩子
     - 下一层链
   * - 4
     - 右孩子 6
     - ``6``
   * - 12
     - 左孩子 10
     - ``6 -> 10``
   * - 6、10
     - 左孩子 5、右孩子 11
     - ``5 -> 11``
   * - 层结束
     - 无
     - ``5 -> 11 -> null``

为什么空槽位会自然消失
~~~~~~~~~~~~~~~~~~~~~~

算法只追加非空孩子，空孩子不占队列位置，也不产生 ``next`` 节点。由于父节点和孩子访问顺序保持从左到右，跳过空槽位后相邻非空节点会直接连接。

如何覆盖错误旧链接
~~~~~~~~~~~~~~~~~~

根先显式写 ``next=null``。构造下一层时，每发现一个孩子都会由前一个链尾重新写入连接；扫描结束后再令最终 ``tail.next=null``。因此新遍历只沿本轮已建立的当前层链，不依赖旧污染值。

为什么只需要常数额外空间
~~~~~~~~~~~~~~~~~~~~~~~~

当前层节点本身已经通过 ``next`` 提供横向遍历通道。算法只保存 ``level_start``、``current``、``dummy`` 和 ``tail``，不保存节点数组或队列。虚拟节点位于栈上，不进入结果树。

为什么连接完整且顺序正确
~~~~~~~~~~~~~~~~~~~~~~~~

当前层按自然顺序扫描，每个父节点先追加左孩子后追加右孩子，因此所有下一层非空节点按从左到右顺序恰好追加一次。层尾被置空，形成完整链；随后同样处理下一层，直到没有孩子。

复杂度来源
~~~~~~~~~~

每个节点作为孩子追加一次，并作为某层父节点扫描一次，时间 ``O(n)``。BFS 需要 ``O(w)`` 队列；主解法除现有 ``next`` 字段外只用常数指针，额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   struct Node*connect(struct Node*root){if(!root)return NULL;root->next=NULL;for(struct Node*level=root;level;){struct Node dummy={0};struct Node*tail=&dummy;for(struct Node*cur=level;cur;cur=cur->next){if(cur->left){tail->next=cur->left;tail=tail->next;}if(cur->right){tail->next=cur->right;tail=tail->next;}}tail->next=NULL;level=dummy.next;}return root;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def connect(self, root):
           if root is None: return None
           root.next = None; level = root
           while level:
               head = tail = None; current = level
               while current:
                   for child in (current.left, current.right):
                       if child:
                           if tail: tail.next = child
                           else: head = child
                           tail = child
                   current = current.next
               if tail: tail.next = None
               level = head
           return root

Java
~~~~

.. code-block:: java

   class Solution {public Node connect(Node root){if(root==null)return null;root.next=null;for(Node level=root;level!=null;){Node head=null,tail=null;for(Node cur=level;cur!=null;cur=cur.next){Node[]children={cur.left,cur.right};for(Node child:children)if(child!=null){if(tail==null)head=child;else tail.next=child;tail=child;}}if(tail!=null)tail.next=null;level=head;}return root;}}

Rust
~~~~

.. code-block:: rust

   fn connect(root:Option<Rc<RefCell<Node>>>)->Option<Rc<RefCell<Node>>>{let Some(start)=root.clone()else{return None};start.borrow_mut().next=None;let mut level=Some(start);while let Some(first)=level{let mut head=None;let mut tail:Option<Rc<RefCell<Node>>>=None;let mut current=Some(first);while let Some(node)=current{let(left,right,next)={let b=node.borrow();(b.left.clone(),b.right.clone(),b.next.clone())};for child in[left,right].into_iter().flatten(){if let Some(t)=tail.as_ref(){t.borrow_mut().next=Some(child.clone())}else{head=Some(child.clone())}tail=Some(child);}current=next;}if let Some(t)=tail.as_ref(){t.borrow_mut().next=None}level=head;}root}

Go
~~

.. code-block:: go

   func connect(root *Node)*Node{if root==nil{return nil};root.Next=nil;for level:=root;level!=nil;{var head,tail *Node;for cur:=level;cur!=nil;cur=cur.Next{for _,child:=range []*Node{cur.Left,cur.Right}{if child!=nil{if tail==nil{head=child}else{tail.Next=child};tail=child}}};if tail!=nil{tail.Next=nil};level=head};return root}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function connect(root:Node|null):Node|null{if(!root)return null;root.next=null;for(let level:Node|null=root;level;){let head:Node|null=null,tail:Node|null=null;for(let cur:Node|null=level;cur;cur=cur.next)for(const child of[cur.left,cur.right])if(child){if(tail)tail.next=child;else head=child;tail=child;}if(tail)tail.next=null;level=head;}return root;}

C#
~~

.. code-block:: csharp

   public class Solution {public Node Connect(Node root){if(root==null)return null;root.next=null;for(var level=root;level!=null;){Node head=null,tail=null;for(var cur=level;cur!=null;cur=cur.next)foreach(var child in new[]{cur.left,cur.right})if(child!=null){if(tail==null)head=child;else tail.next=child;tail=child;}if(tail!=null)tail.next=null;level=head;}return root;}}

Julia
~~~~~

.. code-block:: julia

   function connect(root)
       root===nothing&&return nothing;root.next=nothing;level=root
       while level!==nothing
           head=nothing;tail=nothing;cur=level
           while cur!==nothing
               for child in (cur.left,cur.right)
                   child===nothing&&continue
                   tail===nothing ? (head=child) : (tail.next=child);tail=child
               end
               cur=cur.next
           end
           tail!==nothing&&(tail.next=nothing);level=head
       end
       root
   end

R
~

.. code-block:: r

   connect <- function(root){if(is.null(root))return(NULL);root$next<-NULL;level<-root;while(!is.null(level)){head<-tail<-NULL;cur<-level;while(!is.null(cur)){for(child in list(cur$left,cur$right))if(!is.null(child)){if(is.null(tail))head<-child else tail$next<-child;tail<-child};cur<-cur$next};if(!is.null(tail))tail$next<-NULL;level<-head};root}
