0114. Flatten Binary Tree to Linked List
=======================================

题目信息
--------

:题号: 0114
:难度: Medium
:主题: 二叉树、原地修改、前序遍历、指针重连
:原题: `LeetCode 0114 <https://leetcode.com/problems/flatten-binary-tree-to-linked-list/>`_
:教学重点: 节点身份复用、左子树尾节点、原右子树保存、无环重连

题目重述
--------

把二叉树原地改写为只使用 ``right`` 指针的链。链上顺序必须等于原树前序遍历，所有 ``left`` 最终为空，不能创建替代节点。公共接口不返回新根。

自建示例
--------

.. code-block:: text

          1
         / \
        2   5
       / \   \
      3   4   6

   修改后：1 -> 2 -> 3 -> 4 -> 5 -> 6

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       void collect(TreeNode* node, std::vector<TreeNode*>& nodes) {
           if (!node) return;
           nodes.push_back(node);
           collect(node->left, nodes);
           collect(node->right, nodes);
       }

       void collectThenRelink(TreeNode* root) {
           std::vector<TreeNode*> nodes;
           collect(root, nodes);
           for (int i = 0; i < static_cast<int>(nodes.size()); ++i) {
               nodes[i]->left = nullptr;
               nodes[i]->right = i + 1 < static_cast<int>(nodes.size())
                   ? nodes[i + 1] : nullptr;
           }
       }

       void reversePreorder(TreeNode* node, TreeNode*& next) {
           if (!node) return;
           reversePreorder(node->right, next);
           reversePreorder(node->left, next);
           node->right = next;
           node->left = nullptr;
           next = node;
       }

       void predecessorRelink(TreeNode* root) {
           TreeNode* current = root;
           while (current) {
               if (current->left) {
                   TreeNode* predecessor = current->left;
                   while (predecessor->right)
                       predecessor = predecessor->right;
                   predecessor->right = current->right;
                   current->right = current->left;
                   current->left = nullptr;
               }
               current = current->right;
           }
       }

   public:
       void flatten(TreeNode* root) {
           predecessorRelink(root);
       }
   };

题解
----

前序顺序要求怎样的局部结构
~~~~~~~~~~~~~~~~~~~~~~~~

当前节点之后必须先出现整棵左子树，再出现原右子树。若当前节点存在左孩子，应把左子树搬到 ``right``，并把原右子树接到左子树前序链的末尾。

三次重连的顺序
~~~~~~~~~~~~~~

设 ``predecessor`` 为左子树中沿 ``right`` 不断前进的最右节点：

.. code-block:: text

   predecessor.right = current.right
   current.right = current.left
   current.left = null

第一步必须先保存原右子树入口。若先覆盖 ``current.right``，原右子树会丢失。

.. list-table::
   :header-rows: 1

   * - 局部状态
     - ``current.right``
     - ``predecessor.right``
   * - 重连前
     - 原右子树 5
     - 空
   * - 左尾接旧右
     - 仍为 5
     - 5
   * - 左树搬到右侧
     - 左子树 2
     - 5
   * - 清空左边
     - 2
     - 5

为什么左子树最右节点是连接点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

左子树在后续迭代中会被展平成前序链。当前左子树的最右节点是这棵子树展平后最后到达的节点；把原右子树接到这里，得到“左子树完整前序 + 原右子树”的顺序。

为什么节点不会丢失或重复
~~~~~~~~~~~~~~~~~~~~~~~~

算法只改写三条已有指针，不创建或删除节点。原左子树成为当前节点右子树，原右子树由 ``predecessor.right`` 保留；两部分原本互不相交，因此节点集合保持不变。

为什么最终无环
~~~~~~~~~~~~~~

输入是树，左子树与原右子树不相交。``predecessor`` 位于左子树中，连接到原右子树不会指回左子树祖先；随后清空 ``current.left``，消除旧入口。每轮都把局部树改成单向前序连接，不会形成闭环。

逆前序递归如何工作
~~~~~~~~~~~~~~~~~~

按“右、左、根”顺序递归，并维护已经展平的后继 ``next``。处理当前节点时令 ``current.right = next``、``current.left = null``，再把 ``next`` 更新为当前节点。反向处理可在回溯时直接得到前序链。

为什么迭代最终覆盖全部节点
~~~~~~~~~~~~~~~~~~~~~~~~~~

每轮处理后，当前节点的 ``right`` 指向原前序序列中的下一个节点。令 ``current = current.right`` 会沿最终链继续；所有左子树都会在到达其父节点时被搬入右链，因此不会跳过节点。

复杂度来源
~~~~~~~~~~

收集后重连为 ``O(n)`` 时间、``O(n)`` 数组。逆前序递归为 ``O(n)`` 时间、``O(h)`` 栈。前驱重连使用 ``O(1)`` 额外空间，右链查找按整棵树摊还为 ``O(n)``。

九语言实现
----------

C
~

.. code-block:: c

   void flatten(struct TreeNode*root){for(struct TreeNode*cur=root;cur;cur=cur->right){if(cur->left){struct TreeNode*pre=cur->left;while(pre->right)pre=pre->right;pre->right=cur->right;cur->right=cur->left;cur->left=NULL;}}}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def flatten(self, root) -> None:
           current = root
           while current:
               if current.left:
                   predecessor = current.left
                   while predecessor.right: predecessor = predecessor.right
                   predecessor.right = current.right
                   current.right = current.left
                   current.left = None
               current = current.right

Java
~~~~

.. code-block:: java

   class Solution {public void flatten(TreeNode root){for(TreeNode cur=root;cur!=null;cur=cur.right){if(cur.left!=null){TreeNode pre=cur.left;while(pre.right!=null)pre=pre.right;pre.right=cur.right;cur.right=cur.left;cur.left=null;}}}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn flatten(root:&mut Option<Rc<RefCell<TreeNode>>>){fn visit(node:Option<Rc<RefCell<TreeNode>>>,next:&mut Option<Rc<RefCell<TreeNode>>>){let Some(node)=node else{return};let(right,left)={let b=node.borrow();(b.right.clone(),b.left.clone())};visit(right,next);visit(left,next);{let mut b=node.borrow_mut();b.left=None;b.right=next.clone();}*next=Some(node);}let start=root.clone();let mut next=None;visit(start,&mut next);*root=next;}}

Go
~~

.. code-block:: go

   func flatten(root *TreeNode){for cur:=root;cur!=nil;cur=cur.Right{if cur.Left!=nil{pre:=cur.Left;for pre.Right!=nil{pre=pre.Right};pre.Right=cur.Right;cur.Right=cur.Left;cur.Left=nil}}}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function flatten(root:TreeNode|null):void{for(let cur=root;cur;cur=cur.right){if(cur.left){let pre=cur.left;while(pre.right)pre=pre.right;pre.right=cur.right;cur.right=cur.left;cur.left=null;}}}

C#
~~

.. code-block:: csharp

   public class Solution {public void Flatten(TreeNode root){for(var cur=root;cur!=null;cur=cur.right){if(cur.left!=null){var pre=cur.left;while(pre.right!=null)pre=pre.right;pre.right=cur.right;cur.right=cur.left;cur.left=null;}}}}

Julia
~~~~~

.. code-block:: julia

   function flatten_tree(root)
       cur=root
       while cur!==nothing
           if cur.left!==nothing
               pre=cur.left
               while pre.right!==nothing;pre=pre.right;end
               pre.right=cur.right;cur.right=cur.left;cur.left=nothing
           end
           cur=cur.right
       end
       nothing
   end

R
~

.. code-block:: r

   flatten_tree <- function(root){cur<-root;while(!is.null(cur)){if(!is.null(cur$left)){pre<-cur$left;while(!is.null(pre$right))pre<-pre$right;pre$right<-cur$right;cur$right<-cur$left;cur$left<-NULL};cur<-cur$right};invisible(NULL)}
