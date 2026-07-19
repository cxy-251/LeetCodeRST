0102. Binary Tree Level Order Traversal
=======================================

题目信息
--------

:题号: 0102
:难度: Medium
:主题: 二叉树、广度优先搜索、队列、二维输出
:原题: `LeetCode 0102 <https://leetcode.com/problems/binary-tree-level-order-traversal/>`_
:访问状态: Available
:教学重点: 队列前沿、层大小快照、二维结果独立性、输出敏感复杂度

题目重述
--------

给定一棵二叉树，按从根到叶的顺序返回每一层节点值。每一层单独形成一个数组，层内保持从左到右的顺序。
空树返回空结果。

平台输入是一棵合法无环二叉树，节点数不超过平台给出的有限上界，节点值可以为负数。函数只读树，不能为了
标记访问而修改节点，也不能把空孩子加入结果。输出顺序是契约的一部分：先返回深度小的层，同一深度中先返回
更靠左的节点。

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

   输出：[[3], [9, 20], [15, 7]]

稀疏树仍按位置从左到右
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

          1
        /   \
       2     3
        \   /
         4 5

   输出：[[1], [2, 3], [4, 5]]

节点 ``4`` 是 ``2`` 的右孩子，节点 ``5`` 是 ``3`` 的左孩子。层序遍历按父节点在上一层的顺序扩展孩子，
因此第三层仍然是 ``4`` 在 ``5`` 前面，不需要把空位置写入输出。

边界输入
~~~~~~~~

.. code-block:: text

   输入：root = null
   输出：[]

   输入：root = [8]
   输出：[[8]]

问题抽象
--------

深度优先搜索适合沿一条根到叶路径递归；本题要求先完成整层，再进入下一层，因此自然状态是广度优先搜索的
“待处理前沿”。

队列按从左到右的顺序保存尚未访问的节点。开始处理一层时，队列中已有的全部节点恰好属于当前层。记下此时的
队列长度 ``level_size``，只取出这 ``level_size`` 个节点，并把它们的非空左、右孩子依次加入队尾。新加入的
节点属于下一层，不会混入当前行。

.. code-block:: text

   处理前：queue = [当前层全部节点]
   处理时：弹出 level_size 个节点，依次追加 left、right
   处理后：queue = [下一层全部节点]

基础类型约定
------------

沿用 `0094` 的 ``TreeNode`` 引用模型。队列保存节点引用或指针，不复制子树：

* C/C++、Go 保存裸指针，不拥有节点；
* Python、Java、TypeScript、C# 保存对象引用；
* Rust 队列保存 ``Rc<RefCell<TreeNode>>``，克隆孩子只增加引用计数；
* Julia 队列保存可变节点引用；
* R 使用 ``environment`` 作为节点，并使用另一个环境实现队列槽位，避免反复扩展列表造成累计复制。

输出是二维结构。每一行必须独立拥有自己的值数组；不能把同一个可变行缓冲反复加入结果后再清空复用。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 队列按层广度优先搜索
     - ``O(n)``
     - ``O(w)``
     - 主解法；层边界与输出顺序直接对应
   * - 深度优先搜索并按深度写入结果
     - ``O(n)``
     - ``O(h)`` 栈加结果元数据
     - 需要首次到达深度时创建行，顺序依赖先左后右
   * - 每个深度重新扫描整棵树
     - 最坏 ``O(nh)``
     - ``O(h)``
     - 重复访问上层节点，不采用

``n`` 是节点数，``h`` 是树高，``w`` 是最大层宽。输出本身包含 ``n`` 个整数，返回载荷为 ``Theta(n)``。

主解法：队列按层广度优先搜索
----------------------------

思路
~~~~

将根节点加入队列。只要队列非空：

#. 读取当前队列长度作为 ``level_size``；
#. 创建长度为 ``level_size`` 的独立行；
#. 连续弹出 ``level_size`` 个节点，把值写入当前行；
#. 每个节点按“左孩子、右孩子”的顺序把非空孩子加入队尾；
#. 当前行完成后加入结果。

关键操作是“先保存层大小”。若循环条件直接使用不断增长的队列长度，当前层处理过程中加入的孩子也会被立刻
弹出，所有节点可能落入同一行。

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

维护：

* ``queue``：尚未访问的节点，按最终层序顺序排列；
* ``head`` 或队列头：下一个要处理的节点；
* ``level_size``：本轮开始时队列中属于当前层的节点数；
* ``row``：当前层已经写出的值；
* ``answer``：所有已完成层的独立行。

每轮外层循环开始时保持：

* ``answer`` 已经准确保存深度小于当前层的全部节点；
* 队列头到本轮快照末尾的节点恰好是当前层，顺序从左到右；
* 快照末尾之后没有当前层节点；
* 输入树中尚未入队的节点都位于更深层；
* 每个非根节点只会由其唯一父节点入队一次。

层内处理第 ``i`` 个节点时，``row[0..i)`` 已按从左到右写入，队尾新增的是下一层中该节点贡献的左、右孩子。
因为上一层父节点本身按从左到右出队，并且每个父节点先追加左孩子再追加右孩子，下一层的队列顺序自然正确。

正确性依据
~~~~~~~~~~

对输出层数做归纳。

**基础情况。** 空树没有节点，返回空结果正确。非空树开始时队列只含根，根是深度 0 的全部节点且顺序唯一，
第一轮输出 ``[root.val]`` 正确。

**归纳步骤。** 假设某轮开始时，队列快照中的 ``level_size`` 个节点恰好是深度 ``d`` 的全部节点，并按从左到右
排列。算法依次输出这些节点，因此第 ``d`` 行正确。对每个父节点先加入左孩子再加入右孩子，而父节点按从左到右
处理，所以形成的队列恰好是深度 ``d+1`` 的全部非空节点，顺序也从左到右。下一轮不变量成立。

**无遗漏与无重复。** 根节点初始入队一次；其他节点只有唯一父节点，并且父节点处理时恰好检查一次左右孩子，
所以每个节点恰好入队并输出一次。

**终止性。** 每轮至少弹出一个节点，每个节点最多入队一次。有限节点全部处理后队列为空，循环结束。

因此返回的每一行及行顺序都满足题目要求。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 每个节点入队、出队和写入结果各一次，时间复杂度 ``O(n)``；
* 队列最多保存一层及相邻下一层的部分节点，最坏 ``O(w)``，完全二叉树中 ``w`` 可达 ``O(n)``；
* 返回结果包含 ``n`` 个整数和 ``h`` 个行对象，返回载荷 ``Theta(n+h)``，通常简写为 ``Theta(n)``；
* 若把返回结果排除，主算法额外工作空间为 ``O(w)``；
* C 实现先递归统计节点数，以便一次性分配队列和外层结果，额外增加 ``O(h)`` 计数调用栈，但仍为
  ``O(n)`` 时间；
* Rust 的 ``Rc`` 克隆是 ``O(1)`` 引用计数操作；
* Go 和 TypeScript 使用数组加头下标，避免从数组头删除导致线性搬移；
* R 使用哈希环境保存队列槽位与结果行，最后一次性物化结果列表，避免反复 ``c`` 或增长列表的累计复制。

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

   static void free_rows(int **rows, int row_count) {
       for (int i = 0; i < row_count; ++i) {
           free(rows[i]);
       }
       free(rows);
   }

   int **levelOrder(
       struct TreeNode *root,
       int *returnSize,
       int **returnColumnSizes
   ) {
       *returnSize = 0;
       *returnColumnSizes = NULL;
       if (root == NULL) {
           return NULL;
       }

       const size_t node_count = count_nodes(root);
       struct TreeNode **queue = malloc(node_count * sizeof(*queue));
       int **rows = malloc(node_count * sizeof(*rows));
       int *columns = malloc(node_count * sizeof(*columns));
       if (queue == NULL || rows == NULL || columns == NULL) {
           free(queue);
           free(rows);
           free(columns);
           return NULL;
       }

       size_t head = 0;
       size_t tail = 0;
       int row_count = 0;
       queue[tail++] = root;

       while (head < tail) {
           const size_t level_size = tail - head;
           int *row = malloc(level_size * sizeof(*row));
           if (row == NULL) {
               free(queue);
               free(columns);
               free_rows(rows, row_count);
               return NULL;
           }

           for (size_t i = 0; i < level_size; ++i) {
               struct TreeNode *node = queue[head++];
               row[i] = node->val;
               if (node->left != NULL) {
                   queue[tail++] = node->left;
               }
               if (node->right != NULL) {
                   queue[tail++] = node->right;
               }
           }

           rows[row_count] = row;
           columns[row_count] = (int)level_size;
           ++row_count;
       }

       free(queue);
       *returnSize = row_count;
       *returnColumnSizes = columns;
       return rows;
   }

平台节点上界保证 ``node_count`` 和每层宽度可放入 ``int`` 返回元数据。任一分配失败时，函数释放已经完成的
每一行、外层数组和队列，并保持 ``returnSize == 0``、``returnColumnSizes == NULL``。成功时调用者负责释放
每一行、外层 ``rows`` 和 ``columns``；函数不释放树节点。

C++
~~~

.. code-block:: cpp

   #include <queue>
   #include <vector>

   class Solution {
   public:
       std::vector<std::vector<int>> levelOrder(TreeNode* root) {
           if (root == nullptr) {
               return {};
           }

           std::vector<std::vector<int>> answer;
           std::queue<TreeNode*> queue;
           queue.push(root);

           while (!queue.empty()) {
               const int levelSize = static_cast<int>(queue.size());
               std::vector<int> row;
               row.reserve(levelSize);

               for (int i = 0; i < levelSize; ++i) {
                   TreeNode* node = queue.front();
                   queue.pop();
                   row.push_back(node->val);

                   if (node->left != nullptr) {
                       queue.push(node->left);
                   }
                   if (node->right != nullptr) {
                       queue.push(node->right);
                   }
               }

               answer.push_back(std::move(row));
           }

           return answer;
       }
   };

``queue.size()`` 在本轮入队孩子前转换为有符号 ``int``；平台上界支撑该转换。``std::move`` 把当前行缓冲
转移给结果，下一轮创建新行，不共享可变存储。

Python
~~~~~~

.. code-block:: python

   from collections import deque


   class Solution:
       def levelOrder(
           self,
           root: Optional[TreeNode],
       ) -> list[list[int]]:
           if root is None:
               return []

           answer: list[list[int]] = []
           queue = deque([root])

           while queue:
               level_size = len(queue)
               row: list[int] = []

               for _ in range(level_size):
                   node = queue.popleft()
                   row.append(node.val)

                   if node.left is not None:
                       queue.append(node.left)
                   if node.right is not None:
                       queue.append(node.right)

               answer.append(row)

           return answer

``deque.popleft`` 是 ``O(1)``；若用普通列表 ``pop(0)``，每次都会搬移剩余引用，最坏时间会退化为
``O(n^2)``。每轮创建新的 ``row``，加入结果后不再修改。

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.ArrayList;
   import java.util.List;
   import java.util.Queue;

   class Solution {
       public List<List<Integer>> levelOrder(TreeNode root) {
           List<List<Integer>> answer = new ArrayList<>();
           if (root == null) {
               return answer;
           }

           Queue<TreeNode> queue = new ArrayDeque<>();
           queue.offer(root);

           while (!queue.isEmpty()) {
               int levelSize = queue.size();
               List<Integer> row = new ArrayList<>(levelSize);

               for (int i = 0; i < levelSize; ++i) {
                   TreeNode node = queue.remove();
                   row.add(node.val);

                   if (node.left != null) {
                       queue.offer(node.left);
                   }
                   if (node.right != null) {
                       queue.offer(node.right);
                   }
               }

               answer.add(row);
           }

           return answer;
       }
   }

``ArrayDeque`` 不接受 ``null``，代码只把非空孩子入队。``ArrayList`` 的整数会装箱为 ``Integer``，返回载荷
除了数值本身还包含列表和装箱对象开销，但渐进规模仍为 ``O(n)``。

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::VecDeque;
   use std::rc::Rc;

   impl Solution {
       pub fn level_order(
           root: Option<Rc<RefCell<TreeNode>>>,
       ) -> Vec<Vec<i32>> {
           let Some(root_node) = root else {
               return Vec::new();
           };

           let mut answer = Vec::new();
           let mut queue = VecDeque::new();
           queue.push_back(root_node);

           while !queue.is_empty() {
               let level_size = queue.len();
               let mut row = Vec::with_capacity(level_size);

               for _ in 0..level_size {
                   let node = queue.pop_front().expect("level is non-empty");
                   let node_ref = node.borrow();
                   row.push(node_ref.val);

                   if let Some(left) = node_ref.left.clone() {
                       queue.push_back(left);
                   }
                   if let Some(right) = node_ref.right.clone() {
                       queue.push_back(right);
                   }
               }

               answer.push(row);
           }

           answer
       }
   }

``level_size`` 来自非空队列快照，因此循环中的 ``pop_front`` 有不变量支撑。孩子 ``Rc`` 克隆只增加引用计数，
队列和返回行拥有各自的容器缓冲。

Go
~~

.. code-block:: go

   func levelOrder(root *TreeNode) [][]int {
       if root == nil {
           return [][]int{}
       }

       answer := make([][]int, 0)
       queue := []*TreeNode{root}
       head := 0

       for head < len(queue) {
           levelSize := len(queue) - head
           row := make([]int, levelSize)

           for i := 0; i < levelSize; i++ {
               node := queue[head]
               head++
               row[i] = node.Val

               if node.Left != nil {
                   queue = append(queue, node.Left)
               }
               if node.Right != nil {
                   queue = append(queue, node.Right)
               }
           }

           answer = append(answer, row)
       }

       return answer
   }

用 ``head`` 前移而不是 ``queue = queue[1:]`` 或从头删除。队列切片可能在函数结束前保留已处理节点引用；
渐进峰值仍为 ``O(n)``。每个 ``row`` 由 ``make`` 独立分配。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function levelOrder(root: TreeNode | null): number[][] {
       if (root === null) {
           return [];
       }

       const answer: number[][] = [];
       const queue: TreeNode[] = [root];
       let head = 0;

       while (head < queue.length) {
           const levelSize = queue.length - head;
           const row = new Array<number>(levelSize);

           for (let i = 0; i < levelSize; i++) {
               const node = queue[head++];
               row[i] = node.val;

               if (node.left !== null) {
                   queue.push(node.left);
               }
               if (node.right !== null) {
                   queue.push(node.right);
               }
           }

           answer.push(row);
       }

       return answer;
   }

JavaScript 数组 ``shift`` 是线性搬移；头下标使每个节点只读取一次。节点值只做复制，不涉及位运算或安全整数
边界问题。

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<IList<int>> LevelOrder(TreeNode root) {
           IList<IList<int>> answer = new List<IList<int>>();
           if (root == null) {
               return answer;
           }

           Queue<TreeNode> queue = new Queue<TreeNode>();
           queue.Enqueue(root);

           while (queue.Count > 0) {
               int levelSize = queue.Count;
               IList<int> row = new List<int>(levelSize);

               for (int i = 0; i < levelSize; ++i) {
                   TreeNode node = queue.Dequeue();
                   row.Add(node.val);

                   if (node.left != null) {
                       queue.Enqueue(node.left);
                   }
                   if (node.right != null) {
                       queue.Enqueue(node.right);
                   }
               }

               answer.Add(row);
           }

           return answer;
       }
   }

``Queue<T>`` 的入队和出队为摊还 ``O(1)``。每层新建 ``List<int>``，结果中的行不会共享后续可变缓冲。

Julia
~~~~~

.. code-block:: julia

   function level_order(
       root::Union{TreeNode, Nothing},
   )::Vector{Vector{Int}}
       root === nothing && return Vector{Vector{Int}}()

       answer = Vector{Vector{Int}}()
       queue = TreeNode[root]
       head = 1

       while head <= length(queue)
           level_size = length(queue) - head + 1
           row = Vector{Int}(undef, level_size)

           for i in 1:level_size
               node = queue[head]
               head += 1
               row[i] = node.val

               node.left !== nothing && push!(queue, node.left)
               node.right !== nothing && push!(queue, node.right)
           end

           push!(answer, row)
       end

       return answer
   end

代码直接使用 Julia 一基索引：``head`` 从 1 开始，未处理数量为 ``length(queue) - head + 1``。不使用
``popfirst!``，避免每次删除首元素产生线性搬移。

R
~

.. code-block:: r

   level_order <- function(root) {
     if (is.null(root)) {
       return(list())
     }

     queue <- new.env(hash = TRUE, parent = emptyenv())
     rows <- new.env(hash = TRUE, parent = emptyenv())
     head <- 1L
     tail <- 1L
     level_count <- 0L
     assign("1", root, envir = queue)

     while (head <= tail) {
       level_size <- tail - head + 1L
       row <- integer(level_size)

       for (i in seq_len(level_size)) {
         key <- as.character(head)
         node <- get(key, envir = queue, inherits = FALSE)
         rm(list = key, envir = queue)
         head <- head + 1L
         row[[i]] <- node$val

         if (!is.null(node$left)) {
           tail <- tail + 1L
           assign(as.character(tail), node$left, envir = queue)
         }
         if (!is.null(node$right)) {
           tail <- tail + 1L
           assign(as.character(tail), node$right, envir = queue)
         }
       }

       level_count <- level_count + 1L
       assign(as.character(level_count), row, envir = rows)
     }

     lapply(seq_len(level_count), function(i) {
       get(as.character(i), envir = rows, inherits = FALSE)
     })
   }

队列和临时行表使用环境绑定，避免 ``queue <- c(queue, child)`` 与反复增长结果列表带来的累计复制。最终
``lapply`` 创建返回列表，行向量本身不再修改。环境操作按平均 ``O(1)`` 哈希访问计，最坏复杂度依赖运行时
哈希实现。

对照解法：深度优先搜索按深度写入
--------------------------------

递归函数携带 ``depth``。第一次到达某个深度时创建新行，随后按“根、左、右”顺序把节点值加入
``answer[depth]``。因为所有左子树节点先于右子树同深度节点被访问，层内顺序仍然正确。

该方法时间 ``O(n)``，递归栈 ``O(h)``，返回载荷 ``Theta(n)``。它适合复用递归框架，但“层边界”隐藏在深度
索引中；对于后续需要逐层切换方向、计算层宽或连接同层节点的题目，队列状态更直接。

验证计划与证据
--------------

* Python 通过语法解析，并对 3,000 棵随机树与独立 DFS 按深度稳定分组基准对拍；输入树保持不变；
* C、C++ 通过严格警告编译，固定用例覆盖空树和三层树，并在 ASan、UBSan 下运行；
* C 固定用例实际检查空树返回元数据、二维行内容和成功路径释放；
* Java、Go、TypeScript 通过编译或严格类型检查，并运行空树与普通三层树用例；
* Rust、C#、Julia、R 完成队列层边界、容器独立性、括号与一基位置静态检查；
* 当前环境缺少 Rust、C#、Julia、R 运行时，因此不把静态检查写成运行验证。

关键边界
--------

* 空树返回空二维结果，不返回一行空数组；
* 单节点只产生一行；
* 退化树每层一个节点，队列宽度为 1，但层数为 ``n``；
* 完全树最后一层可能占全部节点的一半，队列空间达到 ``O(n)``；
* 稀疏树不输出空占位，层内顺序仍由父节点顺序和左右入队顺序决定；
* 同值节点不能通过集合去重，每个节点身份都必须单独输出；
* C 的空结果与分配失败都可能返回 ``NULL``，平台接口无法单独报告资源失败，正文必须明确该限制。

易错点
------

* 在层内循环中持续读取当前队列长度，导致下一层节点混入当前行；
* 先入队右孩子再入队左孩子，层内顺序被反转；
* 使用列表 ``pop(0)``、JavaScript ``shift`` 或 Julia ``popfirst!``，把线性 BFS 写成最坏平方时间；
* 复用同一个 ``row``，清空后导致历史结果也被修改；
* C 分配某一行失败时只释放外层数组，泄漏之前已经完成的行；
* 把返回二维结果算入“额外工作空间”后又在总空间中重复计算。

本题新增知识
------------

* 广度优先搜索的队列前沿；
* 通过队列长度快照固定当前层边界；
* 父节点顺序与左右入队顺序共同保证下一层从左到右；
* 二维输出中每一行的独立所有权。

本题强化知识
------------

* `0094` 的跨语言树节点引用模型；
* 树输入的无环、唯一父节点前提；
* 工作空间、返回载荷与语言容器物化成本分层；
* C 多缓冲分配的整体成功或整体清理。

关联题目
--------

* `0103. Binary Tree Zigzag Level Order Traversal
  <0103-binary-tree-zigzag-level-order-traversal.rst>`_：复用层边界，只改变行内写入位置；
* `0104. Maximum Depth of Binary Tree <0104-maximum-depth-of-binary-tree.rst>`_：层数与最大深度的关系；
* `0094. Binary Tree Inorder Traversal
  <../0001-0100/0094-binary-tree-inorder-traversal.rst>`_：显式栈 DFS 与队列 BFS 的状态差异。

最小自检
--------

#. 为什么必须在处理当前层前保存 ``level_size``？
#. 下一层的从左到右顺序由哪两个顺序共同保证？
#. 输出空间为什么至少是 ``Theta(n)``，工作队列为什么写成 ``O(w)``？
#. 普通数组从头删除为什么可能破坏线性复杂度？
#. C 的某一行分配失败时，需要释放哪些已经获得的资源？

答案要点
~~~~~~~~

层开始时的队列快照恰好包含当前层全部节点；固定处理这部分节点，孩子只进入下一轮。父节点按从左到右出队，
每个父节点先追加左孩子再追加右孩子，所以新前沿顺序正确。所有节点恰好入队一次，时间 ``O(n)``；工作队列
按最大宽度 ``O(w)`` 计，二维返回结果包含全部 ``n`` 个值。数组头删会搬移元素。C 失败时必须释放队列、列长度
数组、外层行指针以及所有已完成行。
