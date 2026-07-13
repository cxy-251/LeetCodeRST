0102. Binary Tree Level Order Traversal
=======================================

题目信息
--------

:题号: 0102
:难度: Medium
:主题: 二叉树、广度优先搜索、队列
:原题: `LeetCode 0102 <https://leetcode.com/problems/binary-tree-level-order-traversal/>`_
:访问状态: Available
:教学重点: 按层冻结队列长度、输出快照

题目重述
--------

返回二叉树自顶向下的层序值列表，每层形成独立数组，空树返回空列表。

自建示例
--------

.. code-block:: text

   输入：root = [3,9,20,null,null,15,7]
   输出：[[3],[9,20],[15,7]]

问题抽象
--------

队列始终保存尚未处理的节点。每轮开始记录当前队列长度 ``level_size``，只弹出这批节点并把孩子追加到下一层。

主解法：按层 BFS
------------

思路
~~~~

按层 BFS。 按层冻结队列长度、输出快照

核心状态与不变量
~~~~~~~~~~~~~~~~

队列始终保存尚未处理的节点。每轮开始记录当前队列长度 ``level_size``，只弹出这批节点并把孩子追加到下一层。

正确性依据
~~~~~~~~~~

轮开始时队列前 ``level_size`` 个节点恰好是同一深度。处理它们会按从左到右顺序输出该层，并仅加入下一深度节点，因此不变量保持；队列为空时全部可达节点恰好处理一次。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；队列峰值为最大层宽 ``O(w)``；输出载荷 ``O(n)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   int **levelOrder(struct TreeNode *root, int *returnSize, int **returnColumnSizes) {
       *returnSize = 0;
       *returnColumnSizes = NULL;
       if (root == NULL) return NULL;
       int cap = 16, head = 0, tail = 0;
       struct TreeNode **q = malloc((size_t)cap * sizeof(*q));
       int rows_cap = 16;
       int **rows = malloc((size_t)rows_cap * sizeof(*rows));
       int *cols = malloc((size_t)rows_cap * sizeof(*cols));
       q[tail++] = root;
       while (head < tail) {
           int count = tail - head;
           if (*returnSize == rows_cap) {
               rows_cap *= 2;
               rows = realloc(rows, (size_t)rows_cap * sizeof(*rows));
               cols = realloc(cols, (size_t)rows_cap * sizeof(*cols));
           }
           int *row = malloc((size_t)count * sizeof(*row));
           for (int i = 0; i < count; ++i) {
               struct TreeNode *node = q[head++];
               row[i] = node->val;
               if (tail + 2 > cap) {
                   cap *= 2;
                   q = realloc(q, (size_t)cap * sizeof(*q));
               }
               if (node->left) q[tail++] = node->left;
               if (node->right) q[tail++] = node->right;
           }
           rows[*returnSize] = row;
           cols[*returnSize] = count;
           ++*returnSize;
       }
       free(q);
       *returnColumnSizes = cols;
       return rows;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public: vector<vector<int>> levelOrder(TreeNode* root) {
           vector<vector<int>> ans;
           if (!root) return ans;
           queue<TreeNode*> q;
           q.push(root);
           while (!q.empty()) {
               int n = q.size();
               vector<int> level;
               level.reserve(n);
               while (n--) {
                   TreeNode* node = q.front();
                   q.pop();
                   level.push_back(node->val);
                   if (node->left) q.push(node->left);
                   if (node->right) q.push(node->right);
               }
               ans.push_back(move(level));
           }
           return ans;
       }
   };
Python
~~~~~~

.. code-block:: python

   from collections import deque

   class Solution:

       def levelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:
           if root is None:
               return []
           q = deque([root])
           ans: list[list[int]] = []
           while q:
               level: list[int] = []
               for _ in range(len(q)):
                   node = q.popleft()
                   level.append(node.val)
                   if node.left:
                       q.append(node.left)
                   if node.right:
                       q.append(node.right)
               ans.append(level)
           return ans
Java
~~~~

.. code-block:: java

   class Solution {
       public List<List<Integer>> levelOrder(TreeNode root) {
           List<List<Integer>> ans = new ArrayList<>();
           if (root == null) return ans;
           ArrayDeque<TreeNode> q = new ArrayDeque<>();
           q.add(root);
           while (!q.isEmpty()) {
               int size = q.size();
               List<Integer> level = new ArrayList<>(size);
               for (int i = 0; i < size; ++i) {
                   TreeNode node = q.remove();
                   level.add(node.val);
                   if (node.left != null) q.add(node.left);
                   if (node.right != null) q.add(node.right);
               }
               ans.add(level);
           }
           return ans;
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::VecDeque;
   use std::rc::Rc;
   impl Solution {
       pub fn level_order(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<Vec<i32>> {
           let mut ans = Vec::new();
           let mut q = VecDeque::new();
           if let Some(root) = root {
               q.push_back(root);
           } else {
               return ans;
           }
           while !q.is_empty() {
               let size = q.len();
               let mut level = Vec::with_capacity(size);
               for _ in 0..size {
                   let node = q.pop_front().unwrap();
                   let node = node.borrow();
                   level.push(node.val);
                   if let Some(left) = node.left.clone() {
                       q.push_back(left);
                   }
                   if let Some(right) = node.right.clone() {
                       q.push_back(right);
                   }
               }
               ans.push(level);
           }
           ans
       }
   }
Go
~~

.. code-block:: go

   func levelOrder(root *TreeNode) [][]int {
   	if root == nil {
   		return nil
   	}
   	q := []*TreeNode{root}
   	ans := [][]int{}
   	for len(q) > 0 {
   		size := len(q)
   		level := make([]int, size)
   		for i := 0; i < size; i++ {
   			node := q[0]
   			q = q[1:]
   			level[i] = node.Val
   			if node.Left != nil {
   				q = append(q, node.Left)
   			}
   			if node.Right != nil {
   				q = append(q, node.Right)
   			}
   		}
   		ans = append(ans, level)
   	}
   	return ans
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function levelOrder(root: TreeNode | null): number[][] {
       if (root === null)
           return [];
       const q: TreeNode[] = [root];
       let head = 0;
       const ans: number[][] = [];
       while (head < q.length) {
           const size = q.length - head;
           const level: number[] = [];
           for (let i = 0; i < size; i++) {
               const node = q[head++];
               level.push(node.val);
               if (node.left)
                   q.push(node.left);
               if (node.right)
                   q.push(node.right);
           }
           ans.push(level);
       }
       return ans;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<IList<int>> LevelOrder(TreeNode root) {
           var ans = new List<IList<int>>();
           if (root == null) return ans;
           var q = new Queue<TreeNode>();
           q.Enqueue(root);
           while (q.Count > 0) {
               int size = q.Count;
               var level = new List<int>(size);
               for (int i = 0; i < size; ++i) {
                   var node = q.Dequeue();
                   level.Add(node.val);
                   if (node.left != null) q.Enqueue(node.left);
                   if (node.right != null) q.Enqueue(node.right);
               }
               ans.Add(level);
           }
           return ans;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function level_order(root::Union{TreeNode, Nothing})
       root === nothing && return Vector{Vector{Int}}()
       q = TreeNode[root]
       head = 1
       ans = Vector{Vector{Int}}()
       while head <= length(q)
           size = length(q) - head + 1
           level = Vector{Int}(undef, size)
           for i in 1:size
               node = q[head]
               head += 1
               level[i] = node.val
               node.left !== nothing && push!(q, node.left)
               node.right !== nothing && push!(q, node.right)
           end
           push!(ans, level)
       end
       ans
   end
R
~

.. code-block:: r

   level_order <- function(root) {
       if (is.null(root)) return(list())
       q <- list(root)
       head <- 1L
       ans <- list()
       while (head <= length(q)) {
           size <- length(q) - head + 1L
           level <- integer(size)
           for (i in seq_len(size)) {
               node <- q[[head]]
               head <- head + 1L
               level[[i]] <- node$val
               if (!is.null(node$left)) q[[length(q) + 1L]] <- node$left
               if (!is.null(node$right)) q[[length(q) + 1L]] <- node$right
           }
           ans[[length(ans) + 1L]] <- level
       }
       ans
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空树返回 ``[]``。
* 每层结果必须是独立快照。

易错点
------

* 在遍历过程中直接使用动态变化的队列长度。
* 复用同一个层数组导致历史结果被后续修改。

本题新增知识
------------

* 按层冻结队列长度、输出快照
* 题号 0102 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0107. Binary Tree Level Order Traversal II <0107-binary-tree-level-order-traversal-ii.rst>`_；
* `0103. Binary Tree Zigzag Level Order Traversal <0103-binary-tree-zigzag-level-order-traversal.rst>`_；

最小自检
--------

#. ``按层 BFS`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

轮开始时队列前 ``level_size`` 个节点恰好是同一深度。处理它们会按从左到右顺序输出该层，并仅加入下一深度节点，因此不变量保持；队列为空时全部可达节点恰好处理一次。
