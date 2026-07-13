0107. Binary Tree Level Order Traversal II
==========================================

题目信息
--------

:题号: 0107
:难度: Medium
:主题: 二叉树、广度优先搜索、队列、结果顺序
:原题: `LeetCode 0107 <https://leetcode.com/problems/binary-tree-level-order-traversal-ii/>`_
:访问状态: Available
:教学重点: 复用自然 BFS、只反转外层、避免头插复制、二维结果独立性、适配器队列空间

题目重述
--------

给定一棵二叉树，按“从最深层到根层”的顺序返回每一层节点值。每一层内部仍保持从左到右，只有层与层之间的
顺序反转。

平台允许空树；节点总数不超过 ``2000``，节点值位于 ``[-1000, 1000]``。输入是一棵无环、
无共享子树的合法
二叉树，函数只读节点。空树返回空列表。

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

   自顶向下层序：[[3], [9, 20], [15, 7]]
   本题结果：      [[15, 7], [9, 20], [3]]

注意最深层仍是 ``[15, 7]``，不能变成 ``[7, 15]``。

稀疏树
~~~~~~

.. code-block:: text

           1
         /   \
        2     3
         \   /
          4 5

   输出：[[4, 5], [2, 3], [1]]

父节点按从左到右处理，并且每个父节点先加入左孩子再加入右孩子，所以第三层自然是 ``4`` 在 ``5`` 前面。

边界输入
~~~~~~~~

.. code-block:: text

   root = null
   输出：[]

   root = [8]
   输出：[[8]]

单节点树反转外层后仍只有一行。

问题抽象
--------

`0102. Binary Tree Level Order Traversal
<0102-binary-tree-level-order-traversal.rst>`_ 已经证明，队列按层 BFS 会得到：

.. code-block:: text

   levels = [depth_0, depth_1, ..., depth_last]

本题只要求把外层深度顺序改为：

.. code-block:: text

   [depth_last, ..., depth_1, depth_0]

每一行内部的节点顺序不变。因此主算法可以完全复用自然 BFS，最后原地反转外层行引用。反转的对象是
``answer`` 的行顺序，不是每一行中的整数顺序，也不是孩子入队顺序。

基础类型约定
------------

沿用 ``0102`` 的 ``TreeNode`` 与二维结果约定：

* 队列保存节点引用，不复制子树；
* 每一层使用独立行缓冲；
* 行加入结果后不再修改，避免多行共享同一个可变容器；
* 输入树只读，不增加访问标记；
* 最终反转只交换外层行对象或行指针。

C 返回 ``int **``、行数和每行长度；其他语言返回二维容器。返回值包含全部 ``n``
个节点值和 ``h`` 个行对象。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 自顶向下 BFS，最后反转外层
     - ``O(n + h)``
     - ``O(w)`` 核心队列
     - 主解法；直接复用 0102
   * - BFS 时把每层插到结果头部
     - 取决于容器
     - ``O(w)``
     - 数组头插可能累计 ``O(h^2)``
   * - DFS 按深度收集，再反转
     - ``O(n + h)``
     - ``O(h)`` 栈
     - 需要按深度创建行并保持先左后右
   * - 递归完成后把每层加入双端队列头部
     - ``O(n)``
     - ``O(h + w)``
     - 只有目标语言提供常数时间头插时自然

``n`` 是节点数，``h`` 是树高或层数，``w`` 是最大层宽。外层反转只交换 ``h`` 个行引用，
不复制每行内容。

主解法：自然 BFS 后反转外层
---------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

BFS 阶段维护：

* ``queue``：尚未访问节点的自然层序前沿；
* ``level_size``：本轮开始时属于当前层的节点数快照；
* ``row``：当前层从左到右写入的独立数组；
* ``answer``：已经完成的层，暂时按从根到叶顺序保存。

每轮开始时，队列前 ``level_size`` 个节点恰好是同一深度的全部节点，并且从左到右排列。处理时：

#. 依次弹出这 ``level_size`` 个节点；
#. 把节点值写到当前行；
#. 按左孩子、右孩子顺序把非空孩子加入队尾；
#. 当前行完成后加入 ``answer``。

新加入的孩子属于下一层，不会混入当前行。全部 BFS 完成后，``answer`` 等于
``[depth_0, depth_1, ..., depth_last]``。

为什么最后反转最合适
~~~~~~~~~~~~~~~~~~~~

若使用普通动态数组或列表在头部插入每一层，已有行引用可能每次都要整体向后搬移。共有
``h`` 层时，移动次数可能是：

.. code-block:: text

   0 + 1 + 2 + ... + (h - 1) = Theta(h^2)

先尾插再一次反转只需要 ``O(h)`` 次行引用交换。每行整数数组保持原对象，不发生逐元素反转或复制。

正确性依据
~~~~~~~~~~

正确性分为两个独立阶段。

**BFS 阶段。** 根据 ``0102`` 已建立的层前沿不变量，第一轮输出根层。若某轮队列快照是深度
``d`` 的全部节点，
按从左到右出队并先左后右加入孩子后，下一轮队列恰好是深度 ``d+1`` 的全部节点，
顺序仍从左到右。因此 BFS
结束时，``answer[i]`` 正好是深度 ``i`` 的节点值行。

**反转阶段。** 外层反转把索引 ``i`` 的行交换到 ``h-1-i``。该映射是层索引集合上的双射，
所以每一层恰好出现
一次，最深层移到首位，根层移到末位。反转只交换行对象，不改变行内元素顺序。

**无遗漏与无重复。** 根入队一次；每个非根节点只有一个父节点，
只会在父节点处理时入队一次，因此每个节点值
恰好写入一行一次。

**终止性。** 每个节点最多入队、出队一次。有限节点处理完后队列为空；
外层反转的左右下标每轮向中间移动，
至多执行 ``floor(h/2)`` 次。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* BFS 每个节点入队、出队和写入一次，时间 ``O(n)``；
* 外层反转交换 ``h`` 个行引用，时间 ``O(h)``，总时间 ``O(n + h) = O(n)``；
* 抽象队列的最大活动前沿为 ``O(w)``；
* 返回结果包含 ``n`` 个整数和 ``h`` 个行容器，返回载荷 ``Theta(n + h)``；
* 排除返回值后，标准队列实现的核心工作空间为 ``O(w)``；
* C 为一次性分配队列和外层元数据先递归统计节点数，队列容量为 ``O(n)``，另有 ``O(h)`` 计数栈；
* Go、TypeScript、Julia 使用数组加头下标，避免头删搬移，但底层数组峰值容量可达到 ``O(n)``；
* R 用哈希环境保存活动队列槽位，并在弹出后删除绑定；最终再按反向行号物化结果；
* Java 的整数装箱和各语言的行容器元数据属于返回载荷常数因子；
* 反转外层不会复制行中整数，也不会改变二维结果独立性。

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

   int **levelOrderBottom(
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

       for (int left = 0, right = row_count - 1;
            left < right;
            ++left, --right) {
           int *row = rows[left];
           rows[left] = rows[right];
           rows[right] = row;

           const int width = columns[left];
           columns[left] = columns[right];
           columns[right] = width;
       }

       *returnSize = row_count;
       *returnColumnSizes = columns;
       return rows;
   }

C 复用 ``0102`` 的精确预分配与失败清理。BFS 完成后同时交换 ``rows`` 与 ``columns``，
保证每个行指针仍与
正确长度配对。分配失败时保持 ``returnSize == 0`` 和 ``returnColumnSizes == NULL``。

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <queue>
   #include <utility>
   #include <vector>

   class Solution {
   public:
       std::vector<std::vector<int>> levelOrderBottom(TreeNode* root) {
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

           std::reverse(answer.begin(), answer.end());
           return answer;
       }
   };

``std::reverse`` 只交换外层 ``vector<int>`` 对象；行缓冲的所有权随对象移动，
不逐项复制整数。``std::queue``
保存活动节点指针。

Python
~~~~~~

.. code-block:: python

   from collections import deque
   from typing import Optional


   class Solution:
       def levelOrderBottom(
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

           answer.reverse()
           return answer

``deque.popleft`` 是常数时间。``answer.reverse()`` 原地交换外层列表中的行引用，额外空间 ``O(1)``；
每轮创建的新 ``row`` 保证历史结果独立。

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.ArrayList;
   import java.util.Collections;
   import java.util.List;
   import java.util.Queue;

   class Solution {
       public List<List<Integer>> levelOrderBottom(TreeNode root) {
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

           Collections.reverse(answer);
           return answer;
       }
   }

``Collections.reverse`` 修改外层 ``ArrayList`` 的元素顺序，不修改各行 ``ArrayList``。
``ArrayDeque`` 不接受
``null``，所以只把非空孩子加入队列。

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::VecDeque;
   use std::rc::Rc;

   impl Solution {
       pub fn level_order_bottom(
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
                   let node_ref = queue
                       .pop_front()
                       .expect("level_size comes from queue.len()");
                   let node = node_ref.borrow();
                   row.push(node.val);

                   if let Some(left) = node.left.clone() {
                       queue.push_back(left);
                   }
                   if let Some(right) = node.right.clone() {
                       queue.push_back(right);
                   }
               }

               answer.push(row);
           }

           answer.reverse();
           answer
       }
   }

``VecDeque`` 提供常数时间队首弹出。``expect`` 由刚保存的 ``level_size``
和队列不变量支撑；循环内只克隆孩子的
``Rc`` 引用，不复制子树。``Vec::reverse`` 只交换外层行向量。

Go
~~

.. code-block:: go

   func levelOrderBottom(root *TreeNode) [][]int {
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
   			queue[head] = nil
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

   	for left, right := 0, len(answer)-1; left < right; {
   		answer[left], answer[right] = answer[right], answer[left]
   		left++
   		right--
   	}
   	return answer
   }

数组加 ``head`` 避免 ``queue = queue[1:]`` 后频繁改变切片头。弹出时把旧槽位置为
``nil``，让已经处理的节点
引用可以更早释放；底层数组容量仍可能达到 ``O(n)``。最后只交换外层行切片。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function levelOrderBottom(root: TreeNode | null): number[][] {
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

       answer.reverse();
       return answer;
   }

数组加头下标避免 ``shift()`` 的线性搬移。该适配器会保留已处理槽位直到函数结束，所以队列数组峰值为
``O(n)``；``answer.reverse()`` 只反转外层行引用。

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<IList<int>> LevelOrderBottom(TreeNode root) {
           var answer = new List<IList<int>>();
           if (root == null) {
               return answer;
           }

           var queue = new Queue<TreeNode>();
           queue.Enqueue(root);

           while (queue.Count > 0) {
               int levelSize = queue.Count;
               var row = new List<int>(levelSize);

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

           answer.Reverse();
           return answer;
       }
   }

``Queue<TreeNode>`` 保存活动前沿，``List<IList<int>>.Reverse`` 只改变外层列表顺序。每层创建独立
``List<int>``。

Julia
~~~~~

.. code-block:: julia

   function level_order_bottom(
       root::Union{TreeNode, Nothing},
   )::Vector{Vector{Int}}
       root === nothing && return Vector{Vector{Int}}()

       answer = Vector{Vector{Int}}()
       queue = TreeNode[root]
       head = firstindex(queue)

       while head <= lastindex(queue)
           level_size = lastindex(queue) - head + 1
           row = Vector{Int}(undef, level_size)

           for index in eachindex(row)
               node = queue[head]
               head += 1
               row[index] = node.val

               node.left !== nothing && push!(queue, node.left)
               node.right !== nothing && push!(queue, node.right)
           end

           push!(answer, row)
       end

       reverse!(answer)
       return answer
   end

Julia 使用一基 ``head`` 和 ``lastindex(queue)`` 计算层大小。``reverse!``
原地反转外层向量；数组加头下标的
队列底层容量可达到 ``O(n)``，但不会产生头删搬移。

R
~

.. code-block:: r

   level_order_bottom <- function(root) {
     if (is.null(root)) {
       return(list())
     }

     queue <- new.env(hash = TRUE, parent = emptyenv())
     rows <- new.env(hash = TRUE, parent = emptyenv())
     head <- 1L
     tail <- 1L
     row_count <- 0L
     queue[["1"]] <- root

     while (head <= tail) {
       level_size <- tail - head + 1L
       row <- integer(level_size)

       for (index in seq_len(level_size)) {
         key <- as.character(head)
         node <- queue[[key]]
         rm(list = key, envir = queue)
         head <- head + 1L
         row[[index]] <- node$val

         if (!is.null(node$left)) {
           tail <- tail + 1L
           queue[[as.character(tail)]] <- node$left
         }
         if (!is.null(node$right)) {
           tail <- tail + 1L
           queue[[as.character(tail)]] <- node$right
         }
       }

       row_count <- row_count + 1L
       rows[[as.character(row_count)]] <- row
     }

     answer <- vector("list", row_count)
     for (index in seq_len(row_count)) {
       source <- row_count - index + 1L
       answer[[index]] <- rows[[as.character(source)]]
     }
     answer
   }

R 使用环境作为活动队列和行表。弹出节点后删除对应队列绑定，避免活动引用无限增长；最终按
``row_count - index + 1`` 读取行，直接生成自底向上列表，不对行内整数向量做反转。

对照解法：DFS 按深度收集
------------------------

深度优先搜索也可以把节点值追加到 ``answer[depth]``，先左后右保证每层内部顺序。
全部递归完成后再反转外层。

该方法的递归栈是 ``O(h)``，不需要 BFS 队列；它仍需保存二维输出。对于极深退化树，
递归深度可能成为运行时
限制，所以主解法继续使用 BFS，并与 ``0102``、``0103`` 保持统一知识链。

验证计划与证据
--------------

* Python 通过语法解析，并用 3000 棵随机树与独立 DFS 分层基准对拍；
* C、C++ 通过严格警告编译，并在 ASan、UBSan 下各运行 500 棵随机树；
* Java、Go、TypeScript 分别通过编译或严格类型检查，并各运行 500 棵随机树；
* 对拍同时检查外层自底向上、每层从左到右以及空树返回结构；
* Rust、C#、Julia、R 完成队列前沿、外层反转、一基索引、引用与作用域静态检查；
* 当前环境没有对应四种运行时，因此没有声称它们完成运行验证。

关键边界
--------

* 空树：返回空二维结果，不能返回包含一个空行的结果；
* 单节点：外层反转前后相同；
* 最深层有多个节点：只反转层顺序，不能反转该行；
* 稀疏树：空孩子不入队，非空孩子仍按父节点自然顺序排列；
* 行长度元数据：C 反转行指针时必须同步反转列长度；
* 队列适配器：数组加头下标避免线性头删，但可能保留 ``O(n)`` 容量。

易错点
------

* 对每一行执行反转，得到层内从右到左；
* 把右孩子先于左孩子入队，破坏层内顺序；
* 在数组头部反复插入行，隐藏 ``O(h^2)`` 搬移；
* C 只交换行指针，不交换 ``returnColumnSizes``；
* 使用普通数组 ``shift`` 或列表 ``pop(0)``，使队列操作退化；
* 多层复用同一个可变 ``row``，反转后所有行仍指向同一对象。

本题新增知识
------------

* 将输出顺序变化拆成“自然 BFS + 外层排列变换”；
* 外层反转只交换行引用，保持行内顺序与二维结果独立性；
* 数组头插与一次反转的 ``O(h^2)``、``O(h)`` 成本差异。

本题强化知识
------------

* `0102` 的层大小快照与自然 BFS 前沿不变量；
* `0103` 中“遍历顺序”和“输出排列”分离的思想；
* 最大层宽 ``w``、树高 ``h``、返回载荷 ``n+h`` 的空间分层；
* C 二维返回结果的事务式分配与元数据同步。

关联题目
--------

* `0102. Binary Tree Level Order Traversal
  <0102-binary-tree-level-order-traversal.rst>`_：自顶向下自然层序；
* `0103. Binary Tree Zigzag Level Order Traversal
  <0103-binary-tree-zigzag-level-order-traversal.rst>`_：保持队列自然顺序，只改变行写入位置；
* `0104. Maximum Depth of Binary Tree
  <0104-maximum-depth-of-binary-tree.rst>`_：树高与最深层定义。

最小自检
--------

#. 为什么本题不需要改变孩子入队顺序？
#. 反转外层为什么不会破坏每层从左到右？
#. 为什么尾插全部行后一次反转通常优于数组头插？
#. C 反转结果时还必须同步交换什么？
#. 抽象队列 ``O(w)`` 与部分语言适配器 ``O(n)`` 峰值应如何区分？

答案要点
~~~~~~~~

标准 BFS 正确产生从根到叶的独立层数组。最终只反转外层行引用，把深度 ``d`` 映射到 ``h-1-d``，每层内部
顺序保持不变。时间 ``O(n+h)``，返回载荷 ``Theta(n+h)``；标准活动队列 ``O(w)``，
部分数组加头下标适配器
峰值容量为 ``O(n)``。
