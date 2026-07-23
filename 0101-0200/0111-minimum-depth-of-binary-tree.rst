0111. Minimum Depth of Binary Tree
==================================

题目信息
--------

:题号: 0111
:难度: Easy
:主题: 二叉树、广度优先搜索、叶节点、最短路径
:原题: `LeetCode 0111 <https://leetcode.com/problems/minimum-depth-of-binary-tree/>`_
:重点: 最近叶节点、单孩子节点、空树

题目重述
--------

给定二叉树根节点 ``root``，返回这棵树的最小深度。最小深度等于从根节点到最近叶节点的一条路径中包含的节点数量；叶节点必须同时没有左孩子和右孩子。空树的最小深度为 ``0``，单孩子节点不能把缺失的孩子位置视为叶节点。

树中节点数在 ``0..10^5`` 范围内，节点值在 ``-1000..1000`` 范围内。

自建示例
--------

.. code-block:: text

   输入：root = [6,2,9,null,4,8,12,null,null,7]
   输出：3
   解释：节点 4 和 12 都是深度为 3 的叶节点，根到最近叶节点的路径包含 3 个节点。

.. code-block:: text

   输入：root = [5,null,7,null,9]
   输出：3
   解释：节点 5 和 7 都只有右孩子，并不是叶节点；最近的叶节点是 9。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <queue>

   class Solution {
   private:
       int recursiveDepth(TreeNode* node) {
           if (!node) return 0;
           if (!node->left) return 1 + recursiveDepth(node->right);
           if (!node->right) return 1 + recursiveDepth(node->left);
           return 1 + std::min(recursiveDepth(node->left),
                               recursiveDepth(node->right));
       }

       int depthFirstWithBest(TreeNode* node, int depth, int& best) {
           if (!node || depth >= best) return best;
           if (!node->left && !node->right) {
               best = depth;
               return best;
           }
           depthFirstWithBest(node->left, depth + 1, best);
           depthFirstWithBest(node->right, depth + 1, best);
           return best;
       }

       int breadthFirst(TreeNode* root) {
           if (!root) return 0;
           std::queue<TreeNode*> queue;
           queue.push(root);
           int depth = 1;
           while (!queue.empty()) {
               int level_size = static_cast<int>(queue.size());
               for (int i = 0; i < level_size; ++i) {
                   TreeNode* node = queue.front();
                   queue.pop();
                   if (!node->left && !node->right) return depth;
                   if (node->left) queue.push(node->left);
                   if (node->right) queue.push(node->right);
               }
               ++depth;
           }
           return 0;
       }

   public:
       int minDepth(TreeNode* root) {
           return breadthFirst(root);
       }
   };

题解
----

为什么 ``min(left, right)`` 不能直接使用
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

空孩子的递归深度是 0，但空位置不是叶节点。若节点只有右孩子，直接计算 ``1 + min(0, right_depth)`` 会错误得到 1。单孩子节点只有一条合法根到叶方向，必须沿非空孩子继续。

递归状态如何处理三种节点
~~~~~~~~~~~~~~~~~~~~~~~~

* 空节点返回 0；
* 只有一个孩子时，返回 ``1 + 非空孩子深度``；
* 两个孩子都存在时，才返回 ``1 + min(left, right)``。

BFS 为什么更直接
~~~~~~~~~~~~~~~~

广度优先搜索按深度从小到大处理节点。某一层之前的所有节点已经确认不是叶节点，因此当前层第一次遇到真实叶节点时，不可能存在更浅答案，可以立即返回当前深度。

.. list-table::
   :header-rows: 1

   * - 深度
     - 处理前队列
     - 叶节点判断
   * - 1
     - ``[3]``
     - 根有孩子，继续
   * - 2
     - ``[9,20]``
     - 9 无左右孩子，立即返回 2

为什么必须保存层大小
~~~~~~~~~~~~~~~~~~~~

进入一轮时，队列中的全部节点属于同一深度。保存 ``level_size`` 后只弹出这些节点；处理中加入的孩子属于下一层。若直接依据不断增长的队列长度循环，深度边界会被破坏。

DFS 剪枝何时有效
~~~~~~~~~~~~~~~~

深度优先搜索可以维护当前已知最小叶深 ``best``。当当前深度已经不小于 ``best`` 时，继续向下只会得到更深路径，可停止该分支。它的效果依赖先访问到较浅叶节点的时机；BFS 则天然按最短深度推进。

为什么首个 BFS 叶节点一定最优
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

队列按层推进，深度严格不下降。当前节点是叶节点时，所有尚未出队节点深度不小于当前深度，所有尚未入队节点更深。因此当前根到叶路径长度就是全局最小值。

复杂度来源
~~~~~~~~~~

最坏需要访问全部 ``n`` 个节点，时间 ``O(n)``。BFS 保存最大层宽，空间 ``O(w)``；递归 DFS 使用 ``O(h)`` 调用栈。BFS 在浅层出现叶节点时可提前结束。

九语言实现
----------

C
~

.. code-block:: c

   int minDepth(struct TreeNode*root){if(!root)return 0;struct TreeNode**q=malloc(100001*sizeof(*q));int head=0,tail=0,depth=1;q[tail++]=root;while(head<tail){int count=tail-head;while(count--){struct TreeNode*x=q[head++];if(!x->left&&!x->right){free(q);return depth;}if(x->left)q[tail++]=x->left;if(x->right)q[tail++]=x->right;}depth++;}free(q);return 0;}

Python
~~~~~~

.. code-block:: python

   from collections import deque

   class Solution:
       def minDepth(self, root) -> int:
           if root is None: return 0
           queue, depth = deque([root]), 1
           while queue:
               for _ in range(len(queue)):
                   node = queue.popleft()
                   if node.left is None and node.right is None: return depth
                   if node.left: queue.append(node.left)
                   if node.right: queue.append(node.right)
               depth += 1
           return 0

Java
~~~~

.. code-block:: java

   class Solution {public int minDepth(TreeNode root){if(root==null)return 0;ArrayDeque<TreeNode>q=new ArrayDeque<>();q.add(root);int depth=1;while(!q.isEmpty()){int n=q.size();while(n-->0){TreeNode x=q.remove();if(x.left==null&&x.right==null)return depth;if(x.left!=null)q.add(x.left);if(x.right!=null)q.add(x.right);}depth++;}return 0;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn min_depth(root:Option<Rc<RefCell<TreeNode>>>)->i32{let Some(root)=root else{return 0};let mut q=VecDeque::from([root]);let mut depth=1;while !q.is_empty(){let n=q.len();for _ in 0..n{let node=q.pop_front().unwrap();let b=node.borrow();if b.left.is_none()&&b.right.is_none(){return depth}if let Some(x)=b.left.clone(){q.push_back(x)}if let Some(x)=b.right.clone(){q.push_back(x)}}depth+=1;}0}}

Go
~~

.. code-block:: go

   func minDepth(root *TreeNode)int{if root==nil{return 0};q:=[]*TreeNode{root};head,depth:=0,1;for head<len(q){end:=len(q);for head<end{x:=q[head];head++;if x.Left==nil&&x.Right==nil{return depth};if x.Left!=nil{q=append(q,x.Left)};if x.Right!=nil{q=append(q,x.Right)}};depth++};return 0}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minDepth(root:TreeNode|null):number{if(!root)return 0;const q:TreeNode[]=[root];let head=0,depth=1;while(head<q.length){const end=q.length;while(head<end){const x=q[head++];if(!x.left&&!x.right)return depth;if(x.left)q.push(x.left);if(x.right)q.push(x.right);}depth++;}return 0;}

C#
~~

.. code-block:: csharp

   public class Solution {public int MinDepth(TreeNode root){if(root==null)return 0;var q=new Queue<TreeNode>();q.Enqueue(root);int depth=1;while(q.Count>0){int n=q.Count;while(n-->0){var x=q.Dequeue();if(x.left==null&&x.right==null)return depth;if(x.left!=null)q.Enqueue(x.left);if(x.right!=null)q.Enqueue(x.right);}depth++;}return 0;}}

Julia
~~~~~

.. code-block:: julia

   function min_depth(root)
       root===nothing&&return 0
       q=Any[root];head=1;depth=1
       while head<=length(q)
           stop=length(q)
           while head<=stop
               x=q[head];head+=1
               x.left===nothing&&x.right===nothing&&return depth
               x.left!==nothing&&push!(q,x.left);x.right!==nothing&&push!(q,x.right)
           end
           depth+=1
       end
       0
   end

R
~

.. code-block:: r

   min_depth <- function(root){if(is.null(root))return(0L);q<-list(root);head<-1L;depth<-1L;while(head<=length(q)){stop<-length(q);while(head<=stop){x<-q[[head]];head<-head+1L;if(is.null(x$left)&&is.null(x$right))return(depth);if(!is.null(x$left))q[[length(q)+1L]]<-x$left;if(!is.null(x$right))q[[length(q)+1L]]<-x$right};depth<-depth+1L};0L}