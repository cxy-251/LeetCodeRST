0116. Populating Next Right Pointers in Each Node
=================================================

题目信息
--------

:题号: 0116
:难度: Medium
:主题: 完美二叉树、层级链接、原地修改、常量空间进阶
:原题: `LeetCode 0116 <https://leetcode.com/problems/populating-next-right-pointers-in-each-node/>`_
:重点: 同层右邻节点、层尾空指针、完美二叉树保证

题目重述
--------

给定一棵完美二叉树的根节点 ``root``。每个节点除 ``left`` 和 ``right`` 外还有一个初始为 ``null`` 的 ``next`` 指针。请设置每个节点的 ``next``，使它指向同一层中紧邻的右侧节点；每层最右侧节点的 ``next`` 必须保持为 ``null``。完成连接后返回原根节点。完美二叉树中，每个非叶节点恰有两个孩子，并且所有叶节点位于同一层。

树中节点数在 ``0..2^12 - 1`` 范围内，节点值在 ``-1000..1000`` 范围内。仅使用常量额外空间是本题的进阶要求，不改变上述输出契约。

自建示例
--------

.. code-block:: text

   输入（层序）：root = [10,4,16,2,6,14,18]
   输出（使用 # 表示每层末尾）：[10,#,4,16,#,2,6,14,18,#]
   解释：第二层建立 4 -> 16；第三层建立 2 -> 6 -> 14 -> 18，其中 6 -> 14 跨越了两个不同父节点。

.. code-block:: text

   输入：root = []
   输出：[]
   解释：空树没有需要连接的节点。

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

       void recursivePair(Node* left, Node* right) {
           if (!left || !right) return;
           left->next = right;
           recursivePair(left->left, left->right);
           recursivePair(left->right, right->left);
           recursivePair(right->left, right->right);
       }

       Node* constantSpace(Node* root) {
           if (!root) return nullptr;
           root->next = nullptr;
           for (Node* leftmost = root; leftmost->left;
                leftmost = leftmost->left) {
               for (Node* current = leftmost; current;
                    current = current->next) {
                   current->left->next = current->right;
                   current->right->next = current->next
                       ? current->next->left : nullptr;
               }
           }
           return root;
       }

   public:
       Node* connect(Node* root) {
           return constantSpace(root);
       }
   };

题解
----

下一层只有哪两类相邻关系
~~~~~~~~~~~~~~~~~~~~~~~~

对当前父节点 ``current``：

* 同父关系：``current.left.next = current.right``；
* 跨父关系：若 ``current.next`` 存在，``current.right.next = current.next.left``，否则当前右孩子是层尾，指向空。

完美树保证这些孩子都存在，无需搜索下一个非空孩子。

为什么能不用队列横向移动
~~~~~~~~~~~~~~~~~~~~~~~~

处理某层前，该层已经由 ``next`` 串成从左到右的链。沿 ``current = current.next`` 可访问全部父节点；处理完后，下一层的同父边和跨父边全部建立，成为下一轮横向通道。

.. list-table::
   :header-rows: 1

   * - 父节点
     - 同父连接
     - 跨父连接
   * - 1
     - ``2 -> 3``
     - ``3 -> null``
   * - 2
     - ``4 -> 5``
     - ``5 -> 6``
   * - 3
     - ``6 -> 7``
     - ``7 -> null``

外层为什么沿最左孩子下降
~~~~~~~~~~~~~~~~~~~~~~~~

完美树每个非叶节点都有左孩子。``leftmost`` 始终指向当前层最左节点；处理完整层后令 ``leftmost = leftmost.left``，正好进入下一层起点。到达叶层时 ``leftmost.left`` 为空，停止。

为什么必须主动写层尾空指针
~~~~~~~~~~~~~~~~~~~~~~~~~~

输入 ``next`` 可能含旧值。每个父节点的右孩子在没有右侧父节点时显式写为 ``nullptr``，根也先写为空，使结果不依赖旧链接。

递归节点对如何覆盖跨父关系
~~~~~~~~~~~~~~~~~~~~~~~~~~

递归可分别连接 ``left.left -> left.right``、``left.right -> right.left``、``right.left -> right.right``。中间调用正是跨越两棵兄弟子树的边。该方法结构清晰，但使用 ``O(h)`` 调用栈。

为什么连接完整且唯一
~~~~~~~~~~~~~~~~~~~~

同层任意相邻节点要么共享父节点，要么分别是相邻父节点的右孩子与左孩子。两类规则覆盖全部相邻对且互不重叠；每层最右节点单独连接空值，因此整层链完整。

复杂度来源
~~~~~~~~~~

每个非叶父节点处理常数次，时间 ``O(n)``。队列方法空间 ``O(w)``，递归方法 ``O(h)``；利用已有 ``next`` 链的主解法只使用常数个节点指针，额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   struct Node*connect(struct Node*root){if(!root)return NULL;root->next=NULL;for(struct Node*leftmost=root;leftmost->left;leftmost=leftmost->left)for(struct Node*cur=leftmost;cur;cur=cur->next){cur->left->next=cur->right;cur->right->next=cur->next?cur->next->left:NULL;}return root;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def connect(self, root):
           if root is None: return None
           root.next = None; leftmost = root
           while leftmost.left:
               current = leftmost
               while current:
                   current.left.next = current.right
                   current.right.next = current.next.left if current.next else None
                   current = current.next
               leftmost = leftmost.left
           return root

Java
~~~~

.. code-block:: java

   class Solution {public Node connect(Node root){if(root==null)return null;root.next=null;for(Node leftmost=root;leftmost.left!=null;leftmost=leftmost.left)for(Node cur=leftmost;cur!=null;cur=cur.next){cur.left.next=cur.right;cur.right.next=cur.next==null?null:cur.next.left;}return root;}}

Rust
~~~~

.. code-block:: rust

   fn connect(root:Option<Rc<RefCell<Node>>>)->Option<Rc<RefCell<Node>>>{let Some(start)=root.clone()else{return None};start.borrow_mut().next=None;let mut leftmost=Some(start);while let Some(level)=leftmost.clone(){let next_level=level.borrow().left.clone();if next_level.is_none(){break}let mut current=Some(level);while let Some(node)=current{let(left,right,next)={let b=node.borrow();(b.left.clone().unwrap(),b.right.clone().unwrap(),b.next.clone())};left.borrow_mut().next=Some(right.clone());right.borrow_mut().next=next.as_ref().and_then(|x|x.borrow().left.clone());current=next;}leftmost=next_level;}root}

Go
~~

.. code-block:: go

   func connect(root *Node)*Node{if root==nil{return nil};root.Next=nil;for leftmost:=root;leftmost.Left!=nil;leftmost=leftmost.Left{for cur:=leftmost;cur!=nil;cur=cur.Next{cur.Left.Next=cur.Right;if cur.Next!=nil{cur.Right.Next=cur.Next.Left}else{cur.Right.Next=nil}}};return root}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function connect(root:Node|null):Node|null{if(!root)return null;root.next=null;for(let leftmost=root;leftmost.left;leftmost=leftmost.left)for(let cur:Node|null=leftmost;cur;cur=cur.next){cur.left!.next=cur.right;cur.right!.next=cur.next?cur.next.left:null;}return root;}

C#
~~

.. code-block:: csharp

   public class Solution {public Node Connect(Node root){if(root==null)return null;root.next=null;for(var leftmost=root;leftmost.left!=null;leftmost=leftmost.left)for(var cur=leftmost;cur!=null;cur=cur.next){cur.left.next=cur.right;cur.right.next=cur.next==null?null:cur.next.left;}return root;}}

Julia
~~~~~

.. code-block:: julia

   function connect(root)
       root===nothing&&return nothing;root.next=nothing;leftmost=root
       while leftmost.left!==nothing
           cur=leftmost
           while cur!==nothing;cur.left.next=cur.right;cur.right.next=cur.next===nothing ? nothing : cur.next.left;cur=cur.next;end
           leftmost=leftmost.left
       end
       root
   end

R
~

.. code-block:: r

   connect <- function(root){if(is.null(root))return(NULL);root$next<-NULL;leftmost<-root;while(!is.null(leftmost$left)){cur<-leftmost;while(!is.null(cur)){cur$left$next<-cur$right;cur$right$next<-if(is.null(cur$next))NULL else cur$next$left;cur<-cur$next};leftmost<-leftmost$left};root}