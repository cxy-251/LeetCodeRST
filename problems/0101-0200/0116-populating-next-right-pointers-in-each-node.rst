0116. Populating Next Right Pointers in Each Node
=================================================

题目信息
--------

:题号: 0116
:难度: Medium
:主题: 二叉树、完美二叉树、层链
:原题: `LeetCode 0116 <https://leetcode.com/problems/populating-next-right-pointers-in-each-node/>`_
:访问状态: Available
:教学重点: 利用已建立 next 链

题目重述
--------

给定完美二叉树，把每个节点的 ``next`` 指向同层右侧相邻节点；每层末尾指向空。

自建示例
--------

.. code-block:: text

   输入：root = [1,2,3,4,5,6,7]
   输出：各层 next 链为 1->null，2->3->null，4->5->6->7->null

问题抽象
--------

利用上一层已建立的 ``next`` 横向移动。连接 ``left.next=right``，若存在右邻父节点则 ``right.next=parent.next.left``。

主解法：O(1) 层链连接
---------------

思路
~~~~

O(1) 层链连接。 利用已建立 next 链

核心状态与不变量
~~~~~~~~~~~~~~~~

利用上一层已建立的 ``next`` 横向移动。连接 ``left.next=right``，若存在右邻父节点则 ``right.next=parent.next.left``。

正确性依据
~~~~~~~~~~

完美树保证每个非叶节点有两个孩子。处理某层时父层 next 链完整，因此每个同父和跨父相邻孩子都被连接一次；完成后下一层链完整。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；除指针变量外额外空间 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   struct Node* connect(struct Node*root) {
       if(!root)return NULL;
       for(struct Node*left=root;left->left;left=left->left) {
           for(struct Node*p=left;p;p=p->next) {
               p->left->next=p->right;
               if(p->next)p->right->next=p->next->left;
           }
       }
       return root;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:Node*connect(Node*root) {
           if(!root)return root;
           for(Node*left=root;left->left;left=left->left)for(Node*p=left;p;p=p->next) {
               p->left->next=p->right;
               if(p->next)p->right->next=p->next->left;
           }
           return root;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def connect(self, root: 'Node|None') -> 'Node|None':
           left = root
           while left and left.left:
               p = left
               while p:
                   p.left.next = p.right
                   if p.next:
                       p.right.next = p.next.left
                   p = p.next
               left = left.left
           return root
Java
~~~~

.. code-block:: java

   class Solution {
       public Node connect(Node root) {
           if(root==null)return null;
           for(Node left=root;left.left!=null;left=left.left)for(Node p=left;p!=null;p=p.next) {
               p.left.next=p.right;
               if(p.next!=null)p.right.next=p.next.left;
           }
           return root;
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn connect(root:Option<Rc<RefCell<Node>>>)->Option<Rc<RefCell<Node>>> {
           let mut left=root.clone();
           while let Some(l)=left.clone() {
               if l.borrow().left.is_none() {
                   break
               }
               let mut p=Some(l.clone());
               while let Some(n)=p {
                   let(next,leftc,rightc)= {
                       let b=n.borrow();
                       (b.next.clone(),b.left.clone().unwrap(),b.right.clone().unwrap())
                   };
                   leftc.borrow_mut().next=Some(rightc.clone());
                   if let Some(nx)=next.clone() {
                       rightc.borrow_mut().next=nx.borrow().left.clone();
                   }
                   p=next;
               }
               left=l.borrow().left.clone();
           }
           root
       }
   }
Go
~~

.. code-block:: go

   func connect(root *Node) *Node {
   	if root == nil {
   		return nil
   	}
   	for left := root; left.Left != nil; left = left.Left {
   		for p := left; p != nil; p = p.Next {
   			p.Left.Next = p.Right
   			if p.Next != nil {
   				p.Right.Next = p.Next.Left
   			}
   		}
   	}
   	return root
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function connect(root: Node | null): Node | null {
       if (!root)
           return null;
       for (let left = root; left.left !== null; left = left.left)
           for (let p: Node | null = left; p !== null; p = p.next) {
               p.left!.next = p.right;
               if (p.next)
                   p.right!.next = p.next.left;
           }
       return root;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public Node Connect(Node root) {
           if(root==null)return null;
           for(Node left=root;left.left!=null;left=left.left)for(Node p=left;p!=null;p=p.next) {
               p.left.next=p.right;
               if(p.next!=null)p.right.next=p.next.left;
           }
           return root;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function connect!(root::Union{Node,Nothing})
       root===nothing&&return nothing
       left=root
       while left.left!==nothing
           p=left
           while p!==nothing
               p.left.next=p.right
               p.next!==nothing&&(p.right.next=p.next.left)
               p=p.next
           end
           left=left.left
       end
       root
   end
R
~

.. code-block:: r

   connect <- function(root) {
       if(is.null(root))return(NULL)
       left<-root
       while(!is.null(left$left)) {
           p<-left
           while(!is.null(p)) {
               p$left$next<-p$right
               if(!is.null(p$next))p$right$next<-p$next$left
               p<-p$next
           }
           left<-left$left
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

* 空树或单节点直接返回。
* 仅适用于完美二叉树前提。

易错点
------

* 跨父节点忘记连接。
* 在普通二叉树上套用 ``next.left``。

本题新增知识
------------

* 利用已建立 next 链
* 题号 0116 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0117. Populating Next Right Pointers in Each Node II <0117-populating-next-right-pointers-in-each-node-ii.rst>`_；

最小自检
--------

#. ``O(1) 层链连接`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

完美树保证每个非叶节点有两个孩子。处理某层时父层 next 链完整，因此每个同父和跨父相邻孩子都被连接一次；完成后下一层链完整。
