0111. Minimum Depth of Binary Tree
==================================

题目信息
--------

:题号: 0111
:难度: Easy
:主题: 二叉树、广度优先搜索、叶节点、最短根到叶路径
:原题: `LeetCode 0111 <https://leetcode.com/problems/minimum-depth-of-binary-tree/>`_
:访问状态: Available
:教学重点: 叶节点判定、BFS 首个叶节点、单孩子边界、前沿空间

题目重述
--------

给定一棵二叉树，返回从根节点到最近叶节点的最短路径所包含的节点数。叶节点必须同时没有左孩子和右孩子。
空树的最小深度为 0。

函数只读节点，不修改值或父子链接。

自建示例
--------

普通树
~~~~~~

.. code-block:: text

          3
        /   \
       9    20
           /  \
          15   7

节点 ``9`` 是第一层出现的叶节点，路径 ``3 -> 9`` 含 2 个节点，因此输出 ``2``。

只有一个孩子
~~~~~~~~~~~~

.. code-block:: text

       1
        \
         2
          \
           3

根和节点 ``2`` 都不是叶节点，最小深度是 ``3``，不能把缺失左孩子的深度 0 当成一条合法根到叶路径。

空树
~~~~

.. code-block:: text

   root = null
   输出：0

问题抽象
--------

目标是找到深度最小的叶节点。广度优先搜索按深度从小到大访问节点，因此第一次遇到叶节点时，其深度就是全局
最小深度。

队列保存当前尚未访问的节点。每轮先保存当前层节点数，只处理这一层；处理完仍未找到叶节点时，深度加 1。

.. code-block:: text

   初始：queue = [root], depth = 1
   每轮：处理当前层全部节点
   若某节点 left == null 且 right == null：返回 depth
   否则把非空孩子加入下一层

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 按层 BFS，首个叶节点返回
     - 最坏 ``O(n)``
     - ``O(w)``
     - 主解法；最短路径语义直接对应
   * - 递归计算最小深度
     - ``O(n)``
     - ``O(h)``
     - 必须单独处理只有一个孩子的节点
   * - 错误递推 ``1 + min(left, right)``
     - —
     - —
     - 缺失孩子会制造非法深度 0 路径

这里 ``w`` 是搜索过程中同时存活的最大前沿宽度，``h`` 是树高。

主解法：按层 BFS
----------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

维护：

* ``queue``：尚未处理的节点，按深度递增、同层从左到右排列；
* ``depth``：当前层节点从根开始计算的节点数；
* ``level_size``：本轮开始时属于当前层的节点数量。

每轮开始时：

* 队列前 ``level_size`` 个节点恰好是深度 ``depth`` 的全部节点；
* 所有更浅节点已经处理且都不是叶节点；
* 队列中不存在比当前层更浅的节点；
* 当前层处理时加入的孩子都属于下一层。

第一次叶节点为什么最短
~~~~~~~~~~~~~~~~~~~~~~

BFS 的层序保证所有深度小于 ``depth`` 的节点已经检查过。若当前节点是叶节点，它提供一条长度为 ``depth`` 的
合法根到叶路径。任何尚未处理节点都位于当前层后部或更深层，不可能产生更短路径，因此可以立即返回。

叶节点边界
~~~~~~~~~~

只有 ``left == null`` 且 ``right == null`` 才是叶节点。只有一个孩子的节点仍需要沿非空孩子继续搜索。

错误递归：

.. code-block:: text

   1 + min(depth(left), depth(right))

在只有右孩子时会得到 ``1 + min(0, depth(right)) == 1``，把不存在的左路径误认为合法。BFS 通过只把非空孩子
入队，自然避开这一错误。

正确性依据
~~~~~~~~~~

对 BFS 层数做归纳。

**基础情况。** 空树返回 0 正确。非空树初始队列只含根，``depth = 1``，队列正好是第一层全部节点。

**归纳步骤。** 假设某轮队列快照恰好包含深度 ``d`` 的全部节点。算法逐个检查它们。若无叶节点，则每个非空
孩子都位于深度 ``d + 1``；父节点按层处理且孩子只入队一次，因此下一轮队列恰好包含深度 ``d + 1`` 的全部
节点。

**最优性。** 第一次遇到叶节点时，所有更浅层均已确认没有叶节点，所以当前深度是最小合法深度。

**终止性。** 有限树中每个节点最多入队一次。树至少有一个叶节点，非空输入最终一定返回。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 最坏情况下最近叶节点位于最后一层，需要访问全部 ``n`` 个节点，时间 ``O(n)``；
* 若浅层存在叶节点，算法只访问到该层，实际工作可能显著少于 ``n``；
* 抽象队列活动前沿为 ``O(w)``；
* C 实现先计数节点并一次性分配队列，额外计数扫描仍是 ``O(n)``，计数调用栈 ``O(h)``；分配失败时非空树
  返回 0，平台整数接口无法进一步区分资源失败；
* Go 和 TypeScript 使用数组加头下标，已处理引用仍可能保留到函数返回，适配器峰值可达 ``O(n)``；
* R 使用环境槽位保存队列，避免列表头删除和反复拼接的累计复制。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   static size_t count_nodes(const struct TreeNode *root) {
       if (root == NULL) {
           return 0;
       }
       return 1 + count_nodes(root->left) + count_nodes(root->right);
   }

   int minDepth(struct TreeNode *root) {
       if (root == NULL) {
           return 0;
       }

       const size_t node_count = count_nodes(root);
       struct TreeNode **queue = malloc(node_count * sizeof(*queue));
       if (queue == NULL) {
           return 0;
       }

       size_t head = 0;
       size_t tail = 0;
       int depth = 1;
       queue[tail++] = root;

       while (head < tail) {
           const size_t level_size = tail - head;
           for (size_t i = 0; i < level_size; ++i) {
               struct TreeNode *node = queue[head++];
               if (node->left == NULL && node->right == NULL) {
                   free(queue);
                   return depth;
               }
               if (node->left != NULL) {
                   queue[tail++] = node->left;
               }
               if (node->right != NULL) {
                   queue[tail++] = node->right;
               }
           }
           ++depth;
       }

       free(queue);
       return 0;
   }

C++
~~~

.. code-block:: cpp

   #include <queue>

   class Solution {
   public:
       int minDepth(TreeNode* root) {
           if (root == nullptr) {
               return 0;
           }

           std::queue<TreeNode*> queue;
           queue.push(root);
           int depth = 1;

           while (!queue.empty()) {
               int levelSize = static_cast<int>(queue.size());
               for (int i = 0; i < levelSize; ++i) {
                   TreeNode* node = queue.front();
                   queue.pop();
                   if (node->left == nullptr && node->right == nullptr) {
                       return depth;
                   }
                   if (node->left != nullptr) {
                       queue.push(node->left);
                   }
                   if (node->right != nullptr) {
                       queue.push(node->right);
                   }
               }
               ++depth;
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

           queue = deque([root])
           depth = 1
           while queue:
               for _ in range(len(queue)):
                   node = queue.popleft()
                   if node.left is None and node.right is None:
                       return depth
                   if node.left is not None:
                       queue.append(node.left)
                   if node.right is not None:
                       queue.append(node.right)
               depth += 1
           return 0

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.Queue;

   class Solution {
       public int minDepth(TreeNode root) {
           if (root == null) {
               return 0;
           }

           Queue<TreeNode> queue = new ArrayDeque<>();
           queue.offer(root);
           int depth = 1;

           while (!queue.isEmpty()) {
               int levelSize = queue.size();
               for (int i = 0; i < levelSize; ++i) {
                   TreeNode node = queue.remove();
                   if (node.left == null && node.right == null) {
                       return depth;
                   }
                   if (node.left != null) {
                       queue.offer(node.left);
                   }
                   if (node.right != null) {
                       queue.offer(node.right);
                   }
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
           let Some(root_node) = root else {
               return 0;
           };

           let mut queue = VecDeque::new();
           queue.push_back(root_node);
           let mut depth = 1;

           while !queue.is_empty() {
               let level_size = queue.len();
               for _ in 0..level_size {
                   let node = queue.pop_front().expect("层大小来自队列快照");
                   let node_ref = node.borrow();
                   let is_leaf = node_ref.left.is_none() && node_ref.right.is_none();
                   let left = node_ref.left.clone();
                   let right = node_ref.right.clone();
                   drop(node_ref);

                   if is_leaf {
                       return depth;
                   }
                   if let Some(left_node) = left {
                       queue.push_back(left_node);
                   }
                   if let Some(right_node) = right {
                       queue.push_back(right_node);
                   }
               }
               depth += 1;
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

       queue := []*TreeNode{root}
       head := 0
       depth := 1

       for head < len(queue) {
           levelSize := len(queue) - head
           for i := 0; i < levelSize; i++ {
               node := queue[head]
               head++
               if node.Left == nil && node.Right == nil {
                   return depth
               }
               if node.Left != nil {
                   queue = append(queue, node.Left)
               }
               if node.Right != nil {
                   queue = append(queue, node.Right)
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
       if (root === null) {
           return 0;
       }

       const queue: TreeNode[] = [root];
       let head = 0;
       let depth = 1;

       while (head < queue.length) {
           const levelSize = queue.length - head;
           for (let i = 0; i < levelSize; i++) {
               const node = queue[head++];
               if (node.left === null && node.right === null) {
                   return depth;
               }
               if (node.left !== null) {
                   queue.push(node.left);
               }
               if (node.right !== null) {
                   queue.push(node.right);
               }
           }
           depth++;
       }
       return 0;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public int MinDepth(TreeNode root) {
           if (root == null) {
               return 0;
           }

           var queue = new Queue<TreeNode>();
           queue.Enqueue(root);
           int depth = 1;

           while (queue.Count > 0) {
               int levelSize = queue.Count;
               for (int i = 0; i < levelSize; ++i) {
                   TreeNode node = queue.Dequeue();
                   if (node.left == null && node.right == null) {
                       return depth;
                   }
                   if (node.left != null) {
                       queue.Enqueue(node.left);
                   }
                   if (node.right != null) {
                       queue.Enqueue(node.right);
                   }
               }
               ++depth;
           }
           return 0;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function min_depth(root::Union{TreeNode, Nothing})::Int
       root === nothing && return 0

       queue = TreeNode[root]
       head = 1
       depth = 1

       while head <= length(queue)
           level_size = length(queue) - head + 1
           for _ in 1:level_size
               node = queue[head]
               head += 1
               if node.left === nothing && node.right === nothing
                   return depth
               end
               node.left !== nothing && push!(queue, node.left)
               node.right !== nothing && push!(queue, node.right)
           end
           depth += 1
       end
       return 0
   end

R
~

.. code-block:: r

   min_depth <- function(root) {
     if (is.null(root)) {
       return(0L)
     }

     queue <- new.env(hash = TRUE, parent = emptyenv())
     queue[["1"]] <- root
     head <- 1L
     tail <- 1L
     depth <- 1L

     while (head <= tail) {
       level_size <- tail - head + 1L
       for (i in seq_len(level_size)) {
         node <- queue[[as.character(head)]]
         rm(list = as.character(head), envir = queue)
         head <- head + 1L

         if (is.null(node$left) && is.null(node$right)) {
           return(depth)
         }
         if (!is.null(node$left)) {
           tail <- tail + 1L
           queue[[as.character(tail)]] <- node$left
         }
         if (!is.null(node$right)) {
           tail <- tail + 1L
           queue[[as.character(tail)]] <- node$right
         }
       }
       depth <- depth + 1L
     }
     0L
   }

验证计划与证据
--------------

* 固定用例覆盖空树、单节点、只有左孩子、只有右孩子、浅层叶节点和最深层才出现叶节点；
* 随机生成树，与正确处理单孩子的递归基准对拍；
* 验证返回深度对应某条真实根到叶路径，并且不存在更短叶路径；
* 调用前后序列化输入树，确认没有修改；
* C/C++ 使用严格警告、ASan 和 UBSan；有运行时的语言执行固定与随机用例；
* Rust、C#、Julia、R 缺少运行时时记录队列、借用、一基索引和环境槽位静态检查。

关键边界
--------

* 叶节点必须两个孩子都为空；
* 空树返回 0，非空树返回值至少为 1；
* 只有一个孩子时，缺失方向不能参与最小值；
* Go/TypeScript 数组加头下标的峰值空间可能达到 ``O(n)``；
* C 非空输入返回 0 还可能表示队列分配失败，平台接口无法携带错误码。

易错点
------

* 把任意缺少一个孩子的节点当成叶节点；
* 使用 ``1 + min(leftDepth, rightDepth)`` 却不处理单孩子；
* 在当前层处理过程中动态读取不断增长的队列长度，把下一层混入当前层；
* 使用 Python 列表 ``pop(0)`` 或 JavaScript ``shift()``，导致反复搬移；
* 只写最坏 ``O(n)``，遗漏 BFS 在浅层叶节点处可以提前返回。

本题新增知识
------------

* BFS 第一次遇到目标状态即可证明最短深度；
* 叶节点的双空条件与单孩子反例；
* 最短路径搜索的层前沿不变量。

本题强化知识
------------

* `0102. Binary Tree Level Order Traversal
  <0102-binary-tree-level-order-traversal.rst>`_ 的层大小快照；
* BFS 工作前沿与语言适配器峰值空间分开计费；
* 树只读遍历和跨语言节点引用模型。

关联题目
--------

* `0104. Maximum Depth of Binary Tree <0104-maximum-depth-of-binary-tree.rst>`_：最长根到叶路径；
* `层序遍历题 0102
  <0102-binary-tree-level-order-traversal.rst>`_：完整层序输出与首个目标短路。

最小自检
--------

#. 为什么只有一个孩子的节点不是叶节点？
#. BFS 第一次遇到叶节点时，为什么可以立即返回？
#. Go 和 TypeScript 的队列为何可能保留 ``O(n)`` 引用？
#. C 的分配失败与合法返回值之间有什么接口限制？

答案要点
~~~~~~~~

BFS 按深度递增检查节点。每轮队列快照是同一深度的全部节点，第一次遇到左右孩子都为空的节点时，所有更浅层
已经确认没有叶节点，因此当前深度最小。最坏时间 ``O(n)``，抽象前沿空间 ``O(w)``。
