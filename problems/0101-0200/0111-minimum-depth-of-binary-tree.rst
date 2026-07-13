0111. Minimum Depth of Binary Tree
==================================

题目信息
--------

:题号: 0111
:难度: Easy
:主题: 二叉树、BFS、最短路径
:原题: `LeetCode 0111 <https://leetcode.com/problems/minimum-depth-of-binary-tree/>`_
:访问状态: Available
:教学重点: 首次叶子即最短深度

题目重述
--------

返回根到最近叶子的节点数。叶子必须左右孩子都为空；空树深度为 0。

自建示例
--------

.. code-block:: text

   输入：root = [3,9,20,null,null,15,7]
   输出：2

   输入：root = [2,null,3,null,4]
   输出：3

问题抽象
--------

按层 BFS，节点连同深度入队；第一次弹出的叶子深度就是答案。

主解法：BFS 首个叶子
--------------

思路
~~~~

BFS 首个叶子。 首次叶子即最短深度

核心状态与不变量
~~~~~~~~~~~~~~~~

按层 BFS，节点连同深度入队；第一次弹出的叶子深度就是答案。

正确性依据
~~~~~~~~~~

BFS 按非递减深度处理节点。首个满足左右孩子都为空的节点是所有叶子中深度最小者，因此返回值正确。

复杂度与语言边界
~~~~~~~~~~~~~~~~

最坏时间 ``O(n)``；队列 ``O(w)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   typedef struct {
       struct TreeNode *node;
       int depth;
   }
   Item;
   int minDepth(struct TreeNode *root) {
       if (root == NULL) return 0;
       int cap = 32, head = 0, tail = 0;
       Item *q = malloc((size_t)cap * sizeof(*q));
       q[tail++] = (Item) {
           root, 1
       };
       while (head < tail) {
           Item cur = q[head++];
           if (!cur.node->left && !cur.node->right) {
               free(q);
               return cur.depth;
           }
           if (tail + 2 > cap) {
               cap *= 2;
               q = realloc(q, (size_t)cap * sizeof(*q));
           }
           if (cur.node->left) q[tail++] = (Item) {
               cur.node->left, cur.depth + 1
           };
           if (cur.node->right) q[tail++] = (Item) {
               cur.node->right, cur.depth + 1
           };
       }
       free(q);
       return 0;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public: int minDepth(TreeNode* root) {
           if (!root) return 0;
           queue<pair<TreeNode*,int>> q;
           q.push({root,1});
           while (!q.empty()) {
               auto [node, depth] = q.front();
               q.pop();
               if (!node->left && !node->right) return depth;
               if (node->left) q.push({node->left, depth+1});
               if (node->right) q.push({node->right, depth+1});
           }
           return 0;
       }
   };
Python
~~~~~~

.. code-block:: python

   from collections import deque

   class Solution:

       def minDepth(self, root: Optional[TreeNode]) -> int:
           if root is None:
               return 0
           q = deque([(root, 1)])
           while q:
               node, depth = q.popleft()
               if node.left is None and node.right is None:
                   return depth
               if node.left:
                   q.append((node.left, depth + 1))
               if node.right:
                   q.append((node.right, depth + 1))
           return 0
Java
~~~~

.. code-block:: java

   class Solution {
       public int minDepth(TreeNode root) {
           if (root == null) return 0;
           ArrayDeque<TreeNode> q = new ArrayDeque<>();
           q.add(root);
           int depth = 1;
           while (!q.isEmpty()) {
               for (int size = q.size(); size > 0; --size) {
                   TreeNode node = q.remove();
                   if (node.left == null && node.right == null) return depth;
                   if (node.left != null) q.add(node.left);
                   if (node.right != null) q.add(node.right);
               }
               ++depth;
           }
           return 0;
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::VecDeque;
   use std::rc::Rc;
   impl Solution {
       pub fn min_depth(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
           let mut q = VecDeque::new();
           if let Some(root)=root {
               q.push_back((root,1));
           } else {
               return 0;
           }
           while let Some((node,d))=q.pop_front() {
               let node=node.borrow();
               if node.left.is_none() && node.right.is_none() {
                   return d;
               }
               if let Some(x)=node.left.clone() {
                   q.push_back((x,d+1));
               }
               if let Some(x)=node.right.clone() {
                   q.push_back((x,d+1));
               }
           }
           0
       }
   }
Go
~~

.. code-block:: go

   func minDepth(root *TreeNode) int {
   	if root == nil {
   		return 0
   	}
   	q := []*TreeNode{root}
   	depth := 1
   	for len(q) > 0 {
   		size := len(q)
   		for i := 0; i < size; i++ {
   			node := q[0]
   			q = q[1:]
   			if node.Left == nil && node.Right == nil {
   				return depth
   			}
   			if node.Left != nil {
   				q = append(q, node.Left)
   			}
   			if node.Right != nil {
   				q = append(q, node.Right)
   			}
   		}
   		depth++
   	}
   	return 0
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minDepth(root: TreeNode | null): number {
       if (root === null)
           return 0;
       const q: Array<[
           TreeNode,
           number
       ]> = [[root, 1]];
       let head = 0;
       while (head < q.length) {
           const [node, depth] = q[head++];
           if (node.left === null && node.right === null)
               return depth;
           if (node.left)
               q.push([node.left, depth + 1]);
           if (node.right)
               q.push([node.right, depth + 1]);
       }
       return 0;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int MinDepth(TreeNode root) {
           if (root == null) return 0;
           var q = new Queue<(TreeNode,int)>();
           q.Enqueue((root,1));
           while (q.Count > 0) {
               var (node,d)=q.Dequeue();
               if (node.left==null && node.right==null) return d;
               if (node.left!=null) q.Enqueue((node.left,d+1));
               if (node.right!=null) q.Enqueue((node.right,d+1));
           }
           return 0;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function min_depth(root::Union{TreeNode, Nothing})::Int
       root === nothing && return 0
       q = Tuple{TreeNode,Int}[(root,1)]
       head=1
       while head <= length(q)
           node, depth = q[head]
           head += 1
           node.left === nothing && node.right === nothing && return depth
           node.left !== nothing && push!(q,(node.left,depth+1))
           node.right !== nothing && push!(q,(node.right,depth+1))
       end
       0
   end
R
~

.. code-block:: r

   min_depth <- function(root) {
       if (is.null(root)) return(0L)
       q <- list(list(node=root,depth=1L))
       head <- 1L
       while (head <= length(q)) {
           item <- q[[head]]
           head <- head + 1L
           node <- item$node
           if (is.null(node$left) && is.null(node$right)) return(item$depth)
           if (!is.null(node$left)) q[[length(q)+1L]] <- list(node=node$left,depth=item$depth+1L)
           if (!is.null(node$right)) q[[length(q)+1L]] <- list(node=node$right,depth=item$depth+1L)
       }
       0L
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空树返回 0。
* 只有一个孩子的节点不是叶子。

易错点
------

* 递归写成 ``1 + min(left,right)`` 会把缺失孩子的 0 当成最短路径。
* 遇到任意空孩子就返回。

本题新增知识
------------

* 首次叶子即最短深度
* 题号 0111 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0104. Maximum Depth of Binary Tree <0104-maximum-depth-of-binary-tree.rst>`_；
* `0112. Path Sum <0112-path-sum.rst>`_；

最小自检
--------

#. ``BFS 首个叶子`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

BFS 按非递减深度处理节点。首个满足左右孩子都为空的节点是所有叶子中深度最小者，因此返回值正确。
