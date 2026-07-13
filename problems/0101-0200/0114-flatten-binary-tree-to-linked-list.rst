0114. Flatten Binary Tree to Linked List
========================================

题目信息
--------

:题号: 0114
:难度: Medium
:主题: 二叉树、原地修改、后序遍历
:原题: `LeetCode 0114 <https://leetcode.com/problems/flatten-binary-tree-to-linked-list/>`_
:访问状态: Available
:教学重点: 返回尾节点、保持先序顺序

题目重述
--------

原地把二叉树展开为只使用右指针的单链，节点顺序等于原树先序遍历，所有左指针置空。

自建示例
--------

.. code-block:: text

   输入：root = [1,2,5,3,4,null,6]
   输出：右链 1 -> 2 -> 3 -> 4 -> 5 -> 6

问题抽象
--------

按右、左、根顺序递归，维护已经展开好的后继 ``prev``；当前节点右指向 ``prev``，左置空，再更新 ``prev``。

主解法：反向先序递归
------------

思路
~~~~

反向先序递归。 返回尾节点、保持先序顺序

核心状态与不变量
~~~~~~~~~~~~~~~~

按右、左、根顺序递归，维护已经展开好的后继 ``prev``；当前节点右指向 ``prev``，左置空，再更新 ``prev``。

正确性依据
~~~~~~~~~~

反向访问顺序是先序的逆序。处理当前节点时 ``prev`` 已是其先序后继链，因此重连后当前节点成为正确链头；归纳到根得到完整先序右链。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；递归栈 ``O(h)``；原地额外状态 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   static struct TreeNode *prev_node;
   static void visit(struct TreeNode *node) {
       if(!node)return;
       visit(node->right);
       visit(node->left);
       node->right=prev_node;
       node->left=NULL;
       prev_node=node;
   }
   void flatten(struct TreeNode *root) {
       prev_node=NULL;
       visit(root);
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       TreeNode*prev=nullptr;
       void dfs(TreeNode*n) {
           if(!n)return;
           dfs(n->right);
           dfs(n->left);
           n->right=prev;
           n->left=nullptr;
           prev=n;
       }
       public:void flatten(TreeNode*root) {
           dfs(root);
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def flatten(self, root: Optional[TreeNode]) -> None:
           prev = None

           def dfs(node):
               nonlocal prev
               if node is None:
                   return
               dfs(node.right)
               dfs(node.left)
               node.right = prev
               node.left = None
               prev = node
           dfs(root)
Java
~~~~

.. code-block:: java

   class Solution {
       private TreeNode prev;
       public void flatten(TreeNode root) {
           dfs(root);
       }
       private void dfs(TreeNode n) {
           if(n==null)return;
           dfs(n.right);
           dfs(n.left);
           n.right=prev;
           n.left=null;
           prev=n;
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;
   impl Solution {
       pub fn flatten(root:&mut Option<Rc<RefCell<TreeNode>>>) {
           fn dfs(node:Option<Rc<RefCell<TreeNode>>>,prev:&mut Option<Rc<RefCell<TreeNode>>>) {
               let Some(n)=node else {
                   return
               };
               let(right,left)= {
                   let b=n.borrow();
                   (b.right.clone(),b.left.clone())
               };
               dfs(right,prev);
               dfs(left,prev);
               {
                   let mut b=n.borrow_mut();
                   b.right=prev.clone();
                   b.left=None;
               }
               *prev=Some(n);
           }
           dfs(root.clone(),&mut None);
       }
   }
Go
~~

.. code-block:: go

   func flatten(root *TreeNode) {
   	var prev *TreeNode
   	var dfs func(*TreeNode)
   	dfs = func(n *TreeNode) {
   		if n == nil {
   			return
   		}
   		dfs(n.Right)
   		dfs(n.Left)
   		n.Right = prev
   		n.Left = nil
   		prev = n
   	}
   	dfs(root)
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function flatten(root: TreeNode | null): void {
       let prev: TreeNode | null = null;
       const dfs = (n: TreeNode | null) => {
           if (!n)
               return;
           dfs(n.right);
           dfs(n.left);
           n.right = prev;
           n.left = null;
           prev = n;
       };
       dfs(root);
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       TreeNode prev;
       public void Flatten(TreeNode root) {
           Dfs(root);
       }
       void Dfs(TreeNode n) {
           if(n==null)return;
           Dfs(n.right);
           Dfs(n.left);
           n.right=prev;
           n.left=null;
           prev=n;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function flatten!(root::Union{TreeNode,Nothing})
       prev=Ref{Union{TreeNode,Nothing}}(nothing)
       function dfs(n)
           n===nothing&&return
           dfs(n.right)
           dfs(n.left)
           n.right=prev[]
           n.left=nothing
           prev[]=n
       end
       dfs(root)
       nothing
   end
R
~

.. code-block:: r

   flatten_tree <- function(root) {
       state<-new.env(parent=emptyenv())
       state$prev<-NULL
       dfs<-function(n) {
           if(is.null(n))return()
           dfs(n$right)
           dfs(n$left)
           n$right<-state$prev
           n$left<-NULL
           state$prev<-n
       }
       dfs(root)
       invisible(NULL)
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空树无需修改。
* 更新当前节点前必须保存原孩子或先递归孩子。

易错点
------

* 先覆盖右指针导致原右子树丢失。
* 未清空左指针。

本题新增知识
------------

* 返回尾节点、保持先序顺序
* 题号 0114 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0144. Binary Tree Preorder Traversal <0144-binary-tree-preorder-traversal.rst>`_；

最小自检
--------

#. ``反向先序递归`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

反向访问顺序是先序的逆序。处理当前节点时 ``prev`` 已是其先序后继链，因此重连后当前节点成为正确链头；归纳到根得到完整先序右链。
