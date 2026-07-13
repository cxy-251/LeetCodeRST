0107. Binary Tree Level Order Traversal II
==========================================

题目信息
--------

:题号: 0107
:难度: Medium
:主题: 二叉树、BFS、结果顺序
:原题: `LeetCode 0107 <https://leetcode.com/problems/binary-tree-level-order-traversal-ii/>`_
:访问状态: Available
:教学重点: 自顶向下扫描、最终反转

题目重述
--------

返回二叉树自底向上的层序遍历，每层内部仍从左到右。

自建示例
--------

.. code-block:: text

   输入：root = [3,9,20,null,null,15,7]
   输出：[[15,7],[9,20],[3]]

问题抽象
--------

先用标准 BFS 生成自顶向下各层，最后整体反转外层列表。

主解法：BFS 后反转层列表
----------------

思路
~~~~

BFS 后反转层列表。 自顶向下扫描、最终反转

核心状态与不变量
~~~~~~~~~~~~~~~~

先用标准 BFS 生成自顶向下各层，最后整体反转外层列表。

正确性依据
~~~~~~~~~~

标准 BFS 正确得到每个深度的层。反转只改变深度顺序，不改变层内顺序，因此结果恰为自底向上。

复杂度与语言边界
~~~~~~~~~~~~~~~~

BFS 时间 ``O(n)``，反转 ``O(L)``；队列 ``O(w)``；输出 ``O(n)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   int **levelOrderBottom(struct TreeNode *root, int *returnSize, int **returnColumnSizes) {
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
       for (int i = 0, j = *returnSize - 1; i < j; ++i, --j) {
           int *tmp_row = rows[i];
           rows[i] = rows[j];
           rows[j] = tmp_row;
           int tmp_col = cols[i];
           cols[i] = cols[j];
           cols[j] = tmp_col;
       }
       *returnColumnSizes = cols;
       return rows;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public: vector<vector<int>> levelOrderBottom(TreeNode* root) {
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
           reverse(ans.begin(), ans.end());
           return ans;
       }
   };
Python
~~~~~~

.. code-block:: python

   from collections import deque

   class Solution:

       def levelOrderBottom(self, root: Optional[TreeNode]) -> list[list[int]]:
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
           ans.reverse()
           return ans
Java
~~~~

.. code-block:: java

   class Solution {
       public List<List<Integer>> levelOrderBottom(TreeNode root) {
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
           Collections.reverse(ans);
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
       pub fn level_order_bottom(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<Vec<i32>> {
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
           ans.reverse();
           ans
       }
   }
Go
~~

.. code-block:: go

   func levelOrderBottom(root *TreeNode) [][]int {
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
   	for i, j := 0, len(ans)-1; i < j; i, j = i+1, j-1 {
   		ans[i], ans[j] = ans[j], ans[i]
   	}
   	return ans
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function levelOrderBottom(root: TreeNode | null): number[][] {
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
       ans.reverse();
       return ans;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<IList<int>> LevelOrderBottom(TreeNode root) {
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
           ans.Reverse();
           return ans;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function level_order_bottom(root::Union{TreeNode, Nothing})
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
       reverse!(ans)
       ans
   end
R
~

.. code-block:: r

   level_order_bottom <- function(root) {
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
       rev(ans)
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空树返回空列表。
* 反转外层，不能反转每层。

易错点
------

* 用前插层数组造成 ``O(L^2)``。
* 层内顺序也被反转。

本题新增知识
------------

* 自顶向下扫描、最终反转
* 题号 0107 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0102. Binary Tree Level Order Traversal <0102-binary-tree-level-order-traversal.rst>`_；

最小自检
--------

#. ``BFS 后反转层列表`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

标准 BFS 正确得到每个深度的层。反转只改变深度顺序，不改变层内顺序，因此结果恰为自底向上。
