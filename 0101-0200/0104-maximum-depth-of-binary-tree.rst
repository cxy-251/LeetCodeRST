0104. Maximum Depth of Binary Tree
==================================

题目信息
--------

:题号: 0104
:难度: Easy
:主题: 二叉树、递归、广度优先搜索、树高
:原题: `LeetCode 0104 <https://leetcode.com/problems/maximum-depth-of-binary-tree/>`_
:教学重点: 空树基例、后序汇总、层数计数、递归栈边界

题目重述
--------

给定二叉树根节点，返回从根到最远叶节点的最长路径包含的节点数。空树深度为 0，单节点树深度为 1。输入树只读。

自建示例
--------

.. code-block:: text

          3
        /   \
       9    20
           /  \
          15   7
         /
        4
   -> 4

最长路径是 ``3 -> 20 -> 15 -> 4``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <queue>
   #include <utility>

   class Solution {
   private:
       void depthDfs(TreeNode* node, int depth, int& best) {
           if (!node) return;
           best = std::max(best, depth);
           depthDfs(node->left, depth + 1, best);
           depthDfs(node->right, depth + 1, best);
       }

       int levelBfs(TreeNode* root) {
           if (!root) return 0;
           std::queue<TreeNode*> queue; queue.push(root);
           int depth = 0;
           while (!queue.empty()) {
               int size = queue.size(); ++depth;
               for (int i = 0; i < size; ++i) {
                   TreeNode* node = queue.front(); queue.pop();
                   if (node->left) queue.push(node->left);
                   if (node->right) queue.push(node->right);
               }
           }
           return depth;
       }

       int postorderHeight(TreeNode* node) {
           if (!node) return 0;
           return 1 + std::max(postorderHeight(node->left),
                               postorderHeight(node->right));
       }

   public:
       int maxDepth(TreeNode* root) {
           return postorderHeight(root);
       }
   };

题解
----

路径问题如何变成子树高度
~~~~~~~~~~~~~~~~~~~~~~

从当前节点到最远叶节点的路径必然进入左子树或右子树中更深的一侧。因此定义 ``depth(node)`` 为以该节点为根的最大深度：

.. code-block:: text

   depth(null) = 0
   depth(node) = 1 + max(depth(node.left), depth(node.right))

为什么必须后序汇总
~~~~~~~~~~~~~~~~~~

当前节点答案依赖两个孩子的深度，必须先递归求出左右结果再计算根值。空孩子贡献 0，因此叶节点自然得到 ``1 + max(0,0) = 1``。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 节点
     - 左深度
     - 右深度
     - 当前深度
   * - 4
     - 0
     - 0
     - 1
   * - 15
     - 1
     - 0
     - 2
   * - 20
     - 2
     - 1
     - 3
   * - 3
     - 1
     - 3
     - 4

BFS 为什么也能计数
~~~~~~~~~~~~~~~~~

层序遍历每完成一层就令 ``depth++``。最后一批非空节点出队后，计数正好等于树的层数。BFS 不需要等待子树返回，但队列可能保存整层节点。

携带深度 DFS 的取舍
~~~~~~~~~~~~~~~~~~

另一种 DFS 在进入节点时携带当前深度并维护全局最大值。它与后序递归访问相同节点，后序写法直接返回子问题结果，不需要可变外部状态。

为什么答案不会遗漏
~~~~~~~~~~~~~~~~~~

任意根到叶路径在根处选择左或右一个分支。递推同时计算两侧并取最大，按树高归纳覆盖所有路径；较短一侧不会影响最长答案，可以安全舍弃。

复杂度来源
~~~~~~~~~~

每个节点访问一次，时间 ``O(n)``。递归空间 ``O(h)``，退化树最坏 ``O(n)``；BFS 队列空间 ``O(w)``，其中 ``w`` 是最大层宽。

九语言实现
----------

C
~

.. code-block:: c

   int maxDepth(struct TreeNode*root){if(!root)return 0;int a=maxDepth(root->left),b=maxDepth(root->right);return 1+(a>b?a:b);}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxDepth(self, root) -> int:
           if root is None: return 0
           return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))

Java
~~~~

.. code-block:: java

   class Solution {public int maxDepth(TreeNode root){return root==null?0:1+Math.max(maxDepth(root.left),maxDepth(root.right));}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn max_depth(root:Option<Rc<RefCell<TreeNode>>>)->i32{match root{None=>0,Some(x)=>{let b=x.borrow();1+Self::max_depth(b.left.clone()).max(Self::max_depth(b.right.clone()))}}}}

Go
~~

.. code-block:: go

   func maxDepth(root *TreeNode)int{if root==nil{return 0};a,b:=maxDepth(root.Left),maxDepth(root.Right);if a>b{return a+1};return b+1}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxDepth(root:TreeNode|null):number{return root?1+Math.max(maxDepth(root.left),maxDepth(root.right)):0;}

C#
~~

.. code-block:: csharp

   public class Solution {public int MaxDepth(TreeNode root)=>root==null?0:1+Math.Max(MaxDepth(root.left),MaxDepth(root.right));}

Julia
~~~~~

.. code-block:: julia

   max_depth(root)=root===nothing ? 0 : 1+max(max_depth(root.left),max_depth(root.right))

R
~

.. code-block:: r

   max_depth <- function(root){if(is.null(root))return(0L);1L+max(max_depth(root$left),max_depth(root$right))}
