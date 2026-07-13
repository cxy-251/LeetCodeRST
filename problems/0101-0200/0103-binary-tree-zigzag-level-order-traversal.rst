0103. Binary Tree Zigzag Level Order Traversal
==============================================

题目信息
--------

:题号: 0103
:难度: Medium
:主题: 二叉树、广度优先搜索、队列、方向映射
:原题: `LeetCode 0103 <https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/>`_
:访问状态: Available
:教学重点: 复用层序前沿、逻辑顺序与物理写入位置、避免整行反转

题目重述
--------

给定一棵二叉树，按层返回节点值。第 0 层从左到右，第 1 层从右到左，第 2 层再次从左到右，之后每层交替。
空树返回空结果。

树是合法无环二叉树，输入只读。层与层之间仍按根到叶的深度顺序返回；只有每一行内部的输出方向交替。
节点入队顺序不属于输出，可以始终保持“父节点从左到右、先左孩子后右孩子”，从而复用普通层序遍历的正确
前沿。

自建示例
--------

普通锯齿层序
~~~~~~~~~~~~

.. code-block:: text

          3
        /   \
       9    20
           /  \
          15   7

   普通层序：[[3], [9, 20], [15, 7]]
   锯齿层序：[[3], [20, 9], [15, 7]]

只有第二层的写出方向改变，第三层恢复从左到右。

方向变化不能改变下一层前沿
~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

          1
        /   \
       2     3
      / \   / \
     4   5 6   7

   输出：[[1], [3, 2], [4, 5, 6, 7]]

第二层虽然输出为 ``[3, 2]``，生成第三层队列时仍应先扩展父节点 ``2``，再扩展父节点 ``3``。若为了输出
反向而从右到左处理父节点，第三层很容易错误地变成 ``[7, 6, 5, 4]`` 或破坏后续层顺序。

边界输入
~~~~~~~~

.. code-block:: text

   输入：root = null
   输出：[]

   输入：root = [5]
   输出：[[5]]

问题抽象
--------

`0102. Binary Tree Level Order Traversal <0102-binary-tree-level-order-traversal.rst>`_ 已建立一个稳定的
BFS 前沿：每轮队列快照包含当前层全部节点，顺序从左到右。本题不需要改变这个遍历状态，只需要改变当前行中
每个值的目标位置。

设当前层长度为 ``k``，按队列顺序取出的第 ``i`` 个节点使用零基坐标 ``i``：

.. code-block:: text

   从左到右：target = i
   从右到左：target = k - 1 - i

因此遍历顺序始终从左到右，孩子入队顺序始终先左后右；方向只控制 ``row[target]``。这样可以在线性时间内直接
构造目标行，无需先追加再反转。

基础类型约定
------------

沿用 `0102` 的 ``TreeNode`` 与二维输出约定。队列保存节点引用，不复制子树；结果中的每一行独立分配。

Julia 使用一基位置，若层内循环变量为 ``i in 1:k``，反向目标位置应写成 ``k - i + 1``，不能直接照搬
零基公式。R 同样使用一基向量位置。TypeScript、Go 使用数组加头下标，避免从队头删除的线性搬移。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - BFS 加目标位置映射
     - ``O(n)``
     - ``O(w)``
     - 主解法；不反转行，也不改变队列顺序
   * - BFS 后对奇数层反转
     - ``O(n)``
     - ``O(w)``
     - 简单可靠，但每个奇数层增加一次原地反转扫描
   * - 双端队列按方向弹出并改变孩子入队端
     - ``O(n)``
     - ``O(w)``
     - 状态分支多，孩子方向容易写错
   * - DFS 按深度写入双端容器
     - ``O(n)``
     - ``O(h)`` 栈加结果
     - 需要每层头插或双端行结构

``n`` 是节点数，``w`` 是最大层宽，``h`` 是树高。无论采用哪种方法，返回结果都必须写出全部 ``n`` 个值。

主解法：稳定 BFS 前沿加方向映射
-------------------------------

思路
~~~~

队列逻辑与 `0102` 完全相同：

#. 保存当前层节点数 ``level_size``；
#. 创建固定长度行 ``row``；
#. 按队列从左到右取出当前层节点；
#. 根据 ``left_to_right`` 计算目标位置；
#. 始终先把左孩子、再把右孩子加入队尾；
#. 当前层完成后翻转方向标志。

方向标志只影响“值写到行的哪个槽位”，不影响“哪个节点先被扩展”。这把输出视图与搜索前沿分离，减少了
需要证明的状态分支。

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

除 `0102` 的队列层不变量外，新增两个状态：

* ``left_to_right``：当前层是否按从左到右写出；
* ``target``：当前节点值在固定长度 ``row`` 中的唯一目标位置。

每轮开始时：

* 队列快照仍按树的自然从左到右顺序保存当前层；
* ``left_to_right`` 与当前深度奇偶一致：偶数层为真，奇数层为假；
* ``row`` 长度等于当前层节点数，每个槽位恰好会被写一次；
* 当前层处理不会改变下一层节点的自然顺序。

处理零基位置 ``i`` 时，正向映射为 ``i``，反向映射为 ``k-1-i``。两个映射都把集合
``{0, 1, ..., k-1}`` 双射到自身，因此不会出现越界、重复写入或未写槽位。

正确性依据
~~~~~~~~~~

由 `0102` 的证明，队列每轮恰好按从左到右顺序给出当前层全部节点，且孩子入队后形成下一层正确前沿。
只需证明行内映射与方向要求一致。

**偶数层。** ``left_to_right`` 为真，第 ``i`` 个自然顺序节点写入 ``row[i]``，所以行与从左到右顺序相同。

**奇数层。** ``left_to_right`` 为假，第 ``i`` 个自然顺序节点写入 ``row[k-1-i]``。最左节点写到最右槽，
最右节点写到最左槽，任意两个自然位置的相对顺序都被反转，因此行从右到左。

**槽位完整性。** ``i -> i`` 与 ``i -> k-1-i`` 都是有限下标集合上的双射，所以每个节点值写入唯一槽位，
每个槽位也恰好接收一个值。

**方向交替。** 每完成一层只翻转一次布尔标志，初始第 0 层为真，因此第 ``d`` 层方向与 ``d`` 的奇偶一致。

**终止性与节点覆盖。** 队列部分与 `0102` 相同，每个节点入队和出队一次，有限节点处理完后结束。

所以算法返回的行顺序、层顺序和节点覆盖都符合锯齿层序要求。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 每个节点入队、出队并写入一个目标槽位一次，时间 ``O(n)``；
* 目标位置计算是 ``O(1)``，主解法不执行整行反转；
* 队列工作空间 ``O(w)``；
* 返回结果包含 ``n`` 个整数与 ``h`` 个行容器，返回载荷 ``Theta(n+h)``；
* C 先统计节点数以一次性分配队列和外层元数据，增加 ``O(h)`` 递归栈；
* Julia 与 R 的反向位置使用一基公式 ``k-i+1``；
* R 继续使用环境队列和环境行表，避免反复增长列表的累计复制；
* 输入树只读，方向切换不通过交换节点或修改父子链接实现。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
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

   int **zigzagLevelOrder(
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
       bool left_to_right = true;
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
               const size_t target = left_to_right
                   ? i
                   : level_size - 1 - i;
               row[target] = node->val;

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
           left_to_right = !left_to_right;
       }

       free(queue);
       *returnSize = row_count;
       *returnColumnSizes = columns;
       return rows;
   }

C 仍保持事务式分配与清理。反向目标 ``level_size - 1 - i`` 只在 ``i < level_size`` 时计算，不会发生
无符号下溢。成功返回后调用者拥有每一行、外层数组和列长度数组。

C++
~~~

.. code-block:: cpp

   #include <queue>
   #include <vector>

   class Solution {
   public:
       std::vector<std::vector<int>> zigzagLevelOrder(TreeNode* root) {
           if (root == nullptr) {
               return {};
           }

           std::vector<std::vector<int>> answer;
           std::queue<TreeNode*> queue;
           bool leftToRight = true;
           queue.push(root);

           while (!queue.empty()) {
               const int levelSize = static_cast<int>(queue.size());
               std::vector<int> row(levelSize);

               for (int i = 0; i < levelSize; ++i) {
                   TreeNode* node = queue.front();
                   queue.pop();
                   const int target = leftToRight
                       ? i
                       : levelSize - 1 - i;
                   row[target] = node->val;

                   if (node->left != nullptr) {
                       queue.push(node->left);
                   }
                   if (node->right != nullptr) {
                       queue.push(node->right);
                   }
               }

               answer.push_back(std::move(row));
               leftToRight = !leftToRight;
           }

           return answer;
       }
   };

固定长度 ``vector`` 使每个目标槽位可直接赋值。方向标志不参与孩子入队，避免把输出方向传播到搜索状态。

Python
~~~~~~

.. code-block:: python

   from collections import deque


   class Solution:
       def zigzagLevelOrder(
           self,
           root: Optional[TreeNode],
       ) -> list[list[int]]:
           if root is None:
               return []

           answer: list[list[int]] = []
           queue = deque([root])
           left_to_right = True

           while queue:
               level_size = len(queue)
               row = [0] * level_size

               for i in range(level_size):
                   node = queue.popleft()
                   target = i if left_to_right else level_size - 1 - i
                   row[target] = node.val

                   if node.left is not None:
                       queue.append(node.left)
                   if node.right is not None:
                       queue.append(node.right)

               answer.append(row)
               left_to_right = not left_to_right

           return answer

预分配行后按目标下标写入，避免 ``insert(0, value)`` 的线性搬移，也避免奇数层完成后再次 ``reverse`` 扫描。

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.ArrayList;
   import java.util.Arrays;
   import java.util.List;
   import java.util.Queue;

   class Solution {
       public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
           List<List<Integer>> answer = new ArrayList<>();
           if (root == null) {
               return answer;
           }

           Queue<TreeNode> queue = new ArrayDeque<>();
           boolean leftToRight = true;
           queue.offer(root);

           while (!queue.isEmpty()) {
               int levelSize = queue.size();
               Integer[] row = new Integer[levelSize];

               for (int i = 0; i < levelSize; ++i) {
                   TreeNode node = queue.remove();
                   int target = leftToRight ? i : levelSize - 1 - i;
                   row[target] = node.val;

                   if (node.left != null) {
                       queue.offer(node.left);
                   }
                   if (node.right != null) {
                       queue.offer(node.right);
                   }
               }

               answer.add(Arrays.asList(row));
               leftToRight = !leftToRight;
           }

           return answer;
       }
   }

``Integer[]`` 支持按下标写入，再由 ``Arrays.asList`` 形成固定长度列表视图。数组不会在加入结果后修改，因此
历史行稳定；整数装箱与行数组都属于返回载荷。

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::VecDeque;
   use std::rc::Rc;

   impl Solution {
       pub fn zigzag_level_order(
           root: Option<Rc<RefCell<TreeNode>>>,
       ) -> Vec<Vec<i32>> {
           let Some(root_node) = root else {
               return Vec::new();
           };

           let mut answer = Vec::new();
           let mut queue = VecDeque::new();
           let mut left_to_right = true;
           queue.push_back(root_node);

           while !queue.is_empty() {
               let level_size = queue.len();
               let mut row = vec![0; level_size];

               for i in 0..level_size {
                   let node = queue.pop_front().expect("level is non-empty");
                   let node_ref = node.borrow();
                   let target = if left_to_right {
                       i
                   } else {
                       level_size - 1 - i
                   };
                   row[target] = node_ref.val;

                   if let Some(left) = node_ref.left.clone() {
                       queue.push_back(left);
                   }
                   if let Some(right) = node_ref.right.clone() {
                       queue.push_back(right);
                   }
               }

               answer.push(row);
               left_to_right = !left_to_right;
           }

           answer
       }
   }

``level_size`` 非零且 ``i`` 严格小于它，反向下标不会下溢。``Rc`` 克隆只复制引用句柄，输入节点保持不变。

Go
~~

.. code-block:: go

   func zigzagLevelOrder(root *TreeNode) [][]int {
       if root == nil {
           return [][]int{}
       }

       answer := make([][]int, 0)
       queue := []*TreeNode{root}
       head := 0
       leftToRight := true

       for head < len(queue) {
           levelSize := len(queue) - head
           row := make([]int, levelSize)

           for i := 0; i < levelSize; i++ {
               node := queue[head]
               head++
               target := i
               if !leftToRight {
                   target = levelSize - 1 - i
               }
               row[target] = node.Val

               if node.Left != nil {
                   queue = append(queue, node.Left)
               }
               if node.Right != nil {
                   queue = append(queue, node.Right)
               }
           }

           answer = append(answer, row)
           leftToRight = !leftToRight
       }

       return answer
   }

行切片固定长度并独立分配。队列使用头下标，不从切片头部删除，也不因方向改变而反向扩展孩子。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function zigzagLevelOrder(root: TreeNode | null): number[][] {
       if (root === null) {
           return [];
       }

       const answer: number[][] = [];
       const queue: TreeNode[] = [root];
       let head = 0;
       let leftToRight = true;

       while (head < queue.length) {
           const levelSize = queue.length - head;
           const row = new Array<number>(levelSize);

           for (let i = 0; i < levelSize; i++) {
               const node = queue[head++];
               const target = leftToRight
                   ? i
                   : levelSize - 1 - i;
               row[target] = node.val;

               if (node.left !== null) {
                   queue.push(node.left);
               }
               if (node.right !== null) {
                   queue.push(node.right);
               }
           }

           answer.push(row);
           leftToRight = !leftToRight;
       }

       return answer;
   }

``new Array(levelSize)`` 初始包含空槽，但本轮双射保证全部槽位在加入结果前恰好写一次。严格类型检查可发现
可能遗漏的节点空值分支。

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<IList<int>> ZigzagLevelOrder(TreeNode root) {
           IList<IList<int>> answer = new List<IList<int>>();
           if (root == null) {
               return answer;
           }

           Queue<TreeNode> queue = new Queue<TreeNode>();
           bool leftToRight = true;
           queue.Enqueue(root);

           while (queue.Count > 0) {
               int levelSize = queue.Count;
               int[] row = new int[levelSize];

               for (int i = 0; i < levelSize; ++i) {
                   TreeNode node = queue.Dequeue();
                   int target = leftToRight ? i : levelSize - 1 - i;
                   row[target] = node.val;

                   if (node.left != null) {
                       queue.Enqueue(node.left);
                   }
                   if (node.right != null) {
                       queue.Enqueue(node.right);
                   }
               }

               answer.Add(row);
               leftToRight = !leftToRight;
           }

           return answer;
       }
   }

数组实现 ``IList<int>``，加入结果后不再修改。队列状态与输出方向相互独立。

Julia
~~~~~

.. code-block:: julia

   function zigzag_level_order(
       root::Union{TreeNode, Nothing},
   )::Vector{Vector{Int}}
       root === nothing && return Vector{Vector{Int}}()

       answer = Vector{Vector{Int}}()
       queue = TreeNode[root]
       head = 1
       left_to_right = true

       while head <= length(queue)
           level_size = length(queue) - head + 1
           row = Vector{Int}(undef, level_size)

           for i in 1:level_size
               node = queue[head]
               head += 1
               target = left_to_right ? i : level_size - i + 1
               row[target] = node.val

               node.left !== nothing && push!(queue, node.left)
               node.right !== nothing && push!(queue, node.right)
           end

           push!(answer, row)
           left_to_right = !left_to_right
       end

       return answer
   end

反向位置使用一基公式 ``level_size - i + 1``。``1:level_size`` 在当前层非空时有效；代码不依赖
``a:b`` 自动递减的错误假设。

R
~

.. code-block:: r

   zigzag_level_order <- function(root) {
     if (is.null(root)) {
       return(list())
     }

     queue <- new.env(hash = TRUE, parent = emptyenv())
     rows <- new.env(hash = TRUE, parent = emptyenv())
     head <- 1L
     tail <- 1L
     level_count <- 0L
     left_to_right <- TRUE
     assign("1", root, envir = queue)

     while (head <= tail) {
       level_size <- tail - head + 1L
       row <- integer(level_size)

       for (i in seq_len(level_size)) {
         key <- as.character(head)
         node <- get(key, envir = queue, inherits = FALSE)
         rm(list = key, envir = queue)
         head <- head + 1L
         target <- if (left_to_right) i else level_size - i + 1L
         row[[target]] <- node$val

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
       left_to_right <- !left_to_right
     }

     lapply(seq_len(level_count), function(i) {
       get(as.character(i), envir = rows, inherits = FALSE)
     })
   }

R 的目标位置同样是一基公式。方向变量在当前函数帧的 ``while`` 循环中普通重绑定，不涉及递归闭包或
``<<-``。环境队列避免头删与增长列表的累计复制。

对照解法：完成一行后原地反转
------------------------------

最直接的改写是复用 `0102`：始终按自然顺序追加当前行，若当前层方向为右到左，再对该行执行原地反转。

该方法仍为 ``O(n)`` 时间，因为所有被反转行的元素总数不超过 ``n``；工作空间不变。它的优点是代码更短，
缺点是每个奇数层多一次扫描。主解法通过目标位置双射把“反转”融合到第一次写入中，更适合讲清逻辑顺序与
物理存储位置的分离。

验证计划与证据
--------------

* Python 通过语法解析，并对 3,000 棵随机树与“普通层序后反转奇数层”的独立基准对拍；输入树保持不变；
* C、C++ 通过严格警告编译，固定用例检查三层方向切换，并在 ASan、UBSan 下运行；
* Java、Go、TypeScript 通过编译或严格类型检查，并运行空树与普通三层树用例；
* 静态检查确认零基反向位置为 ``k-1-i``，Julia、R 一基位置为 ``k-i+1``；
* Rust、C#、Julia、R 完成接口、方向翻转时机、括号和引用语义静态检查；当前环境未运行这四种语言。

关键边界
--------

* 空树返回空结果；
* 单节点只经历初始正向层，不发生多余方向问题；
* 每层只有一个节点时，正向与反向行相同，但方向标志仍需正常翻转；
* 节点值可以重复，目标位置由节点顺序决定，不能按值排序或去重；
* 极宽层需要 ``O(w)`` 队列和一行 ``O(w)`` 输出缓冲；
* Julia、R 的反向位置必须使用一基公式；
* 输入有环或共享子树不属于题目契约，当前 BFS 没有访问集合。

易错点
------

* 为了右到左输出而反向处理父节点，导致下一层自然顺序被破坏；
* 奇数层先右孩子后左孩子入队，后续层方向错乱；
* 目标位置写成 ``level_size - i`` 的零基表达，造成越界；
* Julia/R 直接照搬 ``k-1-i``，忽略一基位置；
* 对每个值执行头插，单层最坏变成平方时间；
* 方向标志在处理每个节点后翻转，而不是每层完成后翻转；
* C 反向下标使用无符号类型时，在空层或错误循环边界下发生下溢。

本题新增知识
------------

* 搜索前沿顺序与输出视图顺序分离；
* 正反方向的目标位置双射；
* 将整行反转融合为一次写入的状态设计。

本题强化知识
------------

* `0102` 的队列长度快照和下一层前沿不变量；
* 二维结果行的独立所有权；
* Julia 与 R 的一基位置换算；
* 数组头删、头插和整行复制的真实成本。

关联题目
--------

* `0102. Binary Tree Level Order Traversal
  <0102-binary-tree-level-order-traversal.rst>`_：本题完整复用的 BFS 前沿；
* `0104. Maximum Depth of Binary Tree <0104-maximum-depth-of-binary-tree.rst>`_：层数与树高；
* `0094. Binary Tree Inorder Traversal
  <../0001-0100/0094-binary-tree-inorder-traversal.rst>`_：遍历控制状态的显式保存。

最小自检
--------

#. 为什么锯齿方向不应该改变孩子入队顺序？
#. 零基和一基的反向目标位置分别是什么？
#. 目标位置映射为什么不会重复写槽位？
#. 主解法与“奇数层反转”在复杂度上有什么实际差异？
#. 方向标志应在何时翻转？

答案要点
~~~~~~~~

队列必须始终维护树的自然层序前沿，方向只属于输出视图。零基反向位置是 ``k-1-i``，一基位置是
``k-i+1``；它们都是当前层下标集合上的双射，所以每个槽位恰好写一次。两种方案渐进时间都为 ``O(n)``，
目标位置写入省去奇数层的第二次扫描。方向标志在一整层完成后翻转一次。
