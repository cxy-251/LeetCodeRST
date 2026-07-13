0103. Binary Tree Zigzag Level Order Traversal
==============================================

题目信息
--------

:题号: 0103
:难度: Medium
:主题: 二叉树、BFS、双端顺序
:原题: `LeetCode 0103 <https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/>`_
:访问状态: Available
:教学重点: 层序遍历与奇偶方向映射

题目重述
--------

按层遍历二叉树，偶数层从左到右，奇数层从右到左，返回各层值。

自建示例
--------

.. code-block:: text

   输入：root = [3,9,20,null,null,15,7]
   输出：[[3],[20,9],[15,7]]

问题抽象
--------

仍按正常 BFS 从左到右取节点；在长度固定的层数组中，偶数层写入下标 ``i``，奇数层写入 ``level_size-1-i``。

主解法：BFS 加目标下标
---------------

思路
~~~~

BFS 加目标下标。 层序遍历与奇偶方向映射

核心状态与不变量
~~~~~~~~~~~~~~~~

仍按正常 BFS 从左到右取节点；在长度固定的层数组中，偶数层写入下标 ``i``，奇数层写入 ``level_size-1-i``。

正确性依据
~~~~~~~~~~

BFS 保证本轮节点按从左到右排列。目标下标映射在偶数层保持顺序，在奇数层形成精确逆序，且每个下标写入一次；所有层依次处理后得到要求序列。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；队列 ``O(w)``；当前层数组 ``O(w)``，最终输出 ``O(n)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   int **zigzagLevelOrder(struct TreeNode *root, int *returnSize, int **returnColumnSizes) {
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
               row[((*returnSize) & 1) ? count - 1 - i : i] = node->val;
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
       public: vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
           vector<vector<int>> ans;
           if (!root) return ans;
           queue<TreeNode*> q;
           q.push(root);
           while (!q.empty()) {
               int n = q.size();
               vector<int> level(n);
               while (n--) {
                   TreeNode* node = q.front();
                   q.pop();
                   level[(ans.size() & 1) ? n : (int)level.size() - 1 - n] = node->val;
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

       def zigzagLevelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:
           if root is None:
               return []
           q = deque([root])
           ans = []
           reverse = False
           while q:
               size = len(q)
               level = [0] * size
               for i in range(size):
                   node = q.popleft()
                   level[size - 1 - i if reverse else i] = node.val
                   if node.left:
                       q.append(node.left)
                   if node.right:
                       q.append(node.right)
               ans.append(level)
               reverse = not reverse
           return ans
Java
~~~~

.. code-block:: java

   class Solution {
       public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
           List<List<Integer>> ans = new ArrayList<>();
           if (root == null) return ans;
           ArrayDeque<TreeNode> q = new ArrayDeque<>();
           q.add(root);
           boolean reverse = false;
           while (!q.isEmpty()) {
               int size = q.size();
               Integer[] level = new Integer[size];
               for (int i = 0; i < size; ++i) {
                   TreeNode node = q.remove();
                   level[reverse ? size - 1 - i : i] = node.val;
                   if (node.left != null) q.add(node.left);
                   if (node.right != null) q.add(node.right);
               }
               ans.add(Arrays.asList(level));
               reverse = !reverse;
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
       pub fn zigzag_level_order(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<Vec<i32>> {
           let mut ans = Vec::new();
           let mut q = VecDeque::new();
           if let Some(root) = root {
               q.push_back(root);
           } else {
               return ans;
           }
           let mut reverse = false;
           while !q.is_empty() {
               let size = q.len();
               let mut level = vec![0;
               size];
               for i in 0..size {
                   let node = q.pop_front().unwrap();
                   let node = node.borrow();
                   let j = if reverse {
                       size - 1 - i
                   } else {
                       i
                   };
                   level[j] = node.val;
                   if let Some(x) = node.left.clone() {
                       q.push_back(x);
                   }
                   if let Some(x) = node.right.clone() {
                       q.push_back(x);
                   }
               }
               ans.push(level);
               reverse = !reverse;
           }
           ans
       }
   }
Go
~~

.. code-block:: go

   func zigzagLevelOrder(root *TreeNode) [][]int {
   	if root == nil {
   		return nil
   	}
   	q := []*TreeNode{root}
   	ans := [][]int{}
   	reverse := false
   	for len(q) > 0 {
   		size := len(q)
   		level := make([]int, size)
   		for i := 0; i < size; i++ {
   			node := q[0]
   			q = q[1:]
   			j := i
   			if reverse {
   				j = size - 1 - i
   			}
   			level[j] = node.Val
   			if node.Left != nil {
   				q = append(q, node.Left)
   			}
   			if node.Right != nil {
   				q = append(q, node.Right)
   			}
   		}
   		ans = append(ans, level)
   		reverse = !reverse
   	}
   	return ans
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function zigzagLevelOrder(root: TreeNode | null): number[][] {
       if (root === null)
           return [];
       const q: TreeNode[] = [root];
       let head = 0;
       let reverse = false;
       const ans: number[][] = [];
       while (head < q.length) {
           const size = q.length - head;
           const level = Array<number>(size);
           for (let i = 0; i < size; i++) {
               const node = q[head++];
               level[reverse ? size - 1 - i : i] = node.val;
               if (node.left)
                   q.push(node.left);
               if (node.right)
                   q.push(node.right);
           }
           ans.push(level);
           reverse = !reverse;
       }
       return ans;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<IList<int>> ZigzagLevelOrder(TreeNode root) {
           var ans = new List<IList<int>>();
           if (root == null) return ans;
           var q = new Queue<TreeNode>();
           q.Enqueue(root);
           bool reverse = false;
           while (q.Count > 0) {
               int size = q.Count;
               int[] level = new int[size];
               for (int i = 0; i < size; ++i) {
                   var node = q.Dequeue();
                   level[reverse ? size - 1 - i : i] = node.val;
                   if (node.left != null) q.Enqueue(node.left);
                   if (node.right != null) q.Enqueue(node.right);
               }
               ans.Add(level);
               reverse = !reverse;
           }
           return ans;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function zigzag_level_order(root::Union{TreeNode, Nothing})
       root === nothing && return Vector{Vector{Int}}()
       q = TreeNode[root]
       head = 1
       ans = Vector{Vector{Int}}()
       reverse = false
       while head <= length(q)
           size = length(q) - head + 1
           level = Vector{Int}(undef, size)
           for i in 1:size
               node = q[head]
               head += 1
               level[reverse ? size - i + 1 : i] = node.val
               node.left !== nothing && push!(q, node.left)
               node.right !== nothing && push!(q, node.right)
           end
           push!(ans, level)
           reverse = !reverse
       end
       ans
   end
R
~

.. code-block:: r

   zigzag_level_order <- function(root) {
       if (is.null(root)) return(list())
       q <- list(root)
       head <- 1L
       ans <- list()
       reverse <- FALSE
       while (head <= length(q)) {
           size <- length(q) - head + 1L
           level <- integer(size)
           for (i in seq_len(size)) {
               node <- q[[head]]
               head <- head + 1L
               j <- if (reverse) size - i + 1L else i
               level[[j]] <- node$val
               if (!is.null(node$left)) q[[length(q) + 1L]] <- node$left
               if (!is.null(node$right)) q[[length(q) + 1L]] <- node$right
           }
           ans[[length(ans) + 1L]] <- level
           reverse <- !reverse
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

* 单节点层反转后不变。
* 方向只影响写入位置，不影响孩子入队顺序。

易错点
------

* 奇数层反向入队，容易破坏下一层的自然左右次序。
* 用前插构造逆序导致一层最坏平方时间。

本题新增知识
------------

* 层序遍历与奇偶方向映射
* 题号 0103 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0102. Binary Tree Level Order Traversal <0102-binary-tree-level-order-traversal.rst>`_；
* `0107. Binary Tree Level Order Traversal II <0107-binary-tree-level-order-traversal-ii.rst>`_；

最小自检
--------

#. ``BFS 加目标下标`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

BFS 保证本轮节点按从左到右排列。目标下标映射在偶数层保持顺序，在奇数层形成精确逆序，且每个下标写入一次；所有层依次处理后得到要求序列。
