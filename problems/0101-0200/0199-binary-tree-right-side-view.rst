0199. Binary Tree Right Side View
================================

题目信息
--------

:题号: 0199
:难度: Medium
:主题: 二叉树、广度优先搜索、层边界、队列
:原题: `LeetCode 0199 <https://leetcode.com/problems/binary-tree-right-side-view/>`_
:访问状态: Available
:教学重点: 层大小快照、从左到右队列顺序、最右节点提交、资源所有权

精确契约
--------

给定一棵二叉树，从树的右侧观察，返回从上到下能够看到的节点值：

* 每个深度恰好返回一个值；
* 该值属于这一层最靠右的非空节点；
* 空树返回空数组；
* 输入是一棵合法、无环、节点不共享的二叉树；
* 算法只读树，不修改节点和孩子指针；
* 输出顺序按深度从小到大。

“最靠右”由树结构和同层位置决定，不是节点值最大。右孩子为空时，该层的可见节点可能来自某个更靠左父节点的后代。

示例与反例
----------

标准稀疏树
~~~~~~~~~~

.. code-block:: text

          1
        /   \
       2     3
        \     \
         5     4

   按层从左到右： [1]、[2,3]、[5,4]
   右视图：       [1,3,4]

右侧分支提前结束
~~~~~~~~~~~~~~~~

.. code-block:: text

          1
        /   \
       2     3
      /
     4
    /
   5

   按层从左到右： [1]、[2,3]、[4]、[5]
   右视图：       [1,3,4,5]

不能只沿 ``right`` 指针向下走。第三、四层的可见节点来自左子树。

边界情况
~~~~~~~~

* 空树返回 ``[]``；
* 单节点树返回该节点值；
* 全左链与全右链都返回链上全部节点值；
* 节点值可以重复或为负，算法只依赖位置。

问题抽象与解法选择
------------------

右视图的核心不是“优先走右边”，而是对每个深度确定同层最右节点。广度优先搜索天然按层处理：

#. 队列在一轮开始时保存当前层全部节点；
#. 冻结当前层节点数 ``level_size``；
#. 只弹出这 ``level_size`` 个节点；
#. 按左孩子、右孩子的顺序把下一层节点加入队尾；
#. 本层最后一个弹出的节点就是当前层最右节点。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 核心工作空间
     - 取舍
   * - 分层 BFS，提交本层最后节点
     - ``O(n)``
     - ``O(w)``
     - 主解法；层边界与可见节点直接对应
   * - 先右后左 DFS，首次到达深度时提交
     - ``O(n)``
     - ``O(h)`` 递归栈
     - 也正确，但深树有递归深度风险
   * - 完整层序序列化后再提取
     - ``O(n)``
     - ``O(n)`` 加序列化结果
     - 保存了不需要的中间结构
   * - 只沿右孩子向下
     - 最多 ``O(h)``
     - ``O(1)``
     - 会遗漏右分支提前结束后的可见节点

这里 ``n`` 是节点数，``h`` 是树高，``w`` 是最大层宽。返回结果包含 ``h`` 个整数，属于输出载荷，不计入核心队列空间。

层队列状态与不变量
------------------

队列始终保存尚未处理的非空节点。根节点先入队。每轮外层循环开始时读取当前活动队列长度：

.. code-block:: text

   level_size = queue.size

随后恰好处理 ``level_size`` 个节点。这个快照不能随着孩子入队而改变。

外层循环开始时保持以下不变量：

* 队列前 ``level_size`` 个节点恰好是当前深度的全部非空节点；
* 这些节点按树中从左到右的顺序排列；
* 队列中不存在更浅的节点；
* 新入队的节点全部属于下一层；
* 已完成层已经各自向结果提交一个最右节点值；
* 每个已入队节点尚未被处理，输入树未修改。

层内处理顺序
~~~~~~~~~~~~

当前层节点从左到右出队。每个父节点先加入左孩子，再加入右孩子。由于父节点本身按从左到右处理，下一层所有孩子也按从左到右进入队列。

本层第 ``i`` 个节点出队后：

* 前 ``i+1`` 个当前层节点已经处理；
* 它们的非空孩子已经按下一层从左到右的相对顺序加入队尾；
* 尚未处理的当前层节点仍位于队列头部；
* 当 ``i == level_size-1`` 时，当前节点就是本层最右节点。

为什么必须冻结层大小
~~~~~~~~~~~~~~~~~~~~

若层内循环直接使用不断增长的队列长度，新加入的孩子会立即被当成当前层节点处理。层边界消失后，算法无法判断什么时候提交当前深度的结果，也不能保证每个深度只输出一个值。

正确性证明
----------

引理一：每轮开始时队列快照恰好是一层
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

初始时队列只含根节点，它恰好是深度 0 的全部节点。

假设某轮开始时，快照中的节点恰好是深度 ``d`` 的全部节点。算法只处理这批节点，并把每个节点的非空孩子加入队尾。树中深度 ``d+1`` 的每个节点都有且只有一个深度 ``d`` 的父节点，因此它会在父节点处理时恰好入队一次；没有其他节点能够进入下一层队列。处理完快照后，队列恰好保存深度 ``d+1`` 的全部节点。

引理二：队列中的同层节点始终从左到右排列
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

根节点顺序唯一。假设当前层父节点从左到右出队。对每个父节点，算法先加入左孩子再加入右孩子；更靠左父节点的所有孩子一定先于更靠右父节点的孩子入队。因此下一层非空节点保持树中的从左到右顺序。

引理三：本层最后出队节点就是右侧可见节点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

根据引理一，本轮快照包含当前深度全部非空节点；根据引理二，它们从左到右排列。快照中的最后一个节点因此是该层最靠右的非空节点。右侧观察时，同层更靠左节点会被更靠右节点遮挡，所以只提交最后节点值正确。

引理四：每个节点恰好处理一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

根节点只在初始化时入队一次。其他节点只有唯一父节点，并且父节点处理时仅检查一次左、右孩子，所以每个非根节点最多入队一次。每个非空孩子都会被加入队列，因此也不会遗漏。队列弹出后节点不会重新入队，所以每个节点恰好处理一次。

定理：算法返回完整且正确的右视图
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理一，每个非空深度形成一轮；由引理三，每轮提交的值恰好是该层最右节点；由引理四，没有节点或层被遗漏、重复。结果按轮次从根层到叶层追加，因此返回顺序也正确。

终止性
~~~~~~

树节点有限，每个节点只入队和出队一次。每轮至少处理一个节点；所有节点处理后队列为空，循环终止。

人工状态推演
------------

``[1,2,3,null,5,null,4]``
~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 层
     - 轮开始队列
     - ``level_size``
     - 本层最后节点
     - 下一层队列
   * - 0
     - ``[1]``
     - 1
     - 1
     - ``[2,3]``
   * - 1
     - ``[2,3]``
     - 2
     - 3
     - ``[5,4]``
   * - 2
     - ``[5,4]``
     - 2
     - 4
     - ``[]``

结果为 ``[1,3,4]``。

``[1,2,3,4,null,null,null,5]``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

层序为 ``[1]``、``[2,3]``、``[4]``、``[5]``，右视图为 ``[1,3,4,5]``。这说明当前层没有右侧节点时，左子树仍可能提供更深层的可见节点。

复杂度与语言成本
----------------

* 每个节点入队、出队和检查孩子各一次，时间复杂度 ``O(n)``；
* 活动队列最多保存相邻层前沿，峰值 ``O(w)``；
* 返回结果包含每层一个整数，输出载荷 ``O(h)``；
* C 使用动态循环队列与动态结果数组。扩容失败时释放队列和结果，通过 ``*returnSize=-1`` 区分资源失败与空树；
* C++、Python、Java、C# 使用标准队列或双端队列；
* Rust 队列保存 ``Rc<RefCell<TreeNode>>``，克隆只增加引用计数，借用在读取孩子后立即结束；
* Go、TypeScript、Julia 使用循环队列，避免头删搬移并保持已分配容量与活动宽度同阶；
* R 使用哈希环境保存活动队列槽位，弹出后删除槽位；结果也先写入环境，最后一次性物化，避免反复拼接造成累计复制；
* 所有实现都只读输入树。C、C++、Go 的队列不拥有节点；托管语言中的引用也不改变树的所有权关系。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>

   typedef struct {
       struct TreeNode **data;
       size_t capacity;
       size_t head;
       size_t size;
   } NodeQueue;

   static bool queue_init(NodeQueue *queue) {
       queue->capacity = 8;
       queue->head = 0;
       queue->size = 0;
       queue->data = malloc(queue->capacity * sizeof(*queue->data));
       return queue->data != NULL;
   }

   static void queue_destroy(NodeQueue *queue) {
       free(queue->data);
       queue->data = NULL;
       queue->capacity = 0;
       queue->head = 0;
       queue->size = 0;
   }

   static bool queue_grow(NodeQueue *queue) {
       if (queue->capacity > SIZE_MAX / 2) {
           return false;
       }
       size_t new_capacity = queue->capacity * 2;
       if (new_capacity > SIZE_MAX / sizeof(*queue->data)) {
           return false;
       }

       struct TreeNode **new_data =
           malloc(new_capacity * sizeof(*new_data));
       if (new_data == NULL) {
           return false;
       }

       for (size_t i = 0; i < queue->size; ++i) {
           new_data[i] =
               queue->data[(queue->head + i) % queue->capacity];
       }
       free(queue->data);
       queue->data = new_data;
       queue->capacity = new_capacity;
       queue->head = 0;
       return true;
   }

   static bool queue_push(NodeQueue *queue, struct TreeNode *node) {
       if (queue->size == queue->capacity && !queue_grow(queue)) {
           return false;
       }
       size_t index = (queue->head + queue->size) % queue->capacity;
       queue->data[index] = node;
       ++queue->size;
       return true;
   }

   static struct TreeNode *queue_pop(NodeQueue *queue) {
       struct TreeNode *node = queue->data[queue->head];
       queue->head = (queue->head + 1) % queue->capacity;
       --queue->size;
       return node;
   }

   static bool append_value(
       int **answer,
       size_t *capacity,
       size_t size,
       int value
   ) {
       if (size == *capacity) {
           size_t new_capacity = *capacity == 0 ? 8 : *capacity * 2;
           if (new_capacity < *capacity ||
               new_capacity > SIZE_MAX / sizeof(**answer)) {
               return false;
           }
           int *temporary =
               realloc(*answer, new_capacity * sizeof(**answer));
           if (temporary == NULL) {
               return false;
           }
           *answer = temporary;
           *capacity = new_capacity;
       }
       (*answer)[size] = value;
       return true;
   }

   int *rightSideView(struct TreeNode *root, int *returnSize) {
       *returnSize = 0;
       if (root == NULL) {
           return NULL;
       }

       NodeQueue queue;
       if (!queue_init(&queue)) {
           *returnSize = -1;
           return NULL;
       }
       if (!queue_push(&queue, root)) {
           queue_destroy(&queue);
           *returnSize = -1;
           return NULL;
       }

       int *answer = NULL;
       size_t answer_capacity = 0;
       size_t answer_size = 0;

       while (queue.size > 0) {
           size_t level_size = queue.size;
           int rightmost_value = 0;

           for (size_t i = 0; i < level_size; ++i) {
               struct TreeNode *node = queue_pop(&queue);
               rightmost_value = node->val;

               if (node->left != NULL &&
                   !queue_push(&queue, node->left)) {
                   free(answer);
                   queue_destroy(&queue);
                   *returnSize = -1;
                   return NULL;
               }
               if (node->right != NULL &&
                   !queue_push(&queue, node->right)) {
                   free(answer);
                   queue_destroy(&queue);
                   *returnSize = -1;
                   return NULL;
               }
           }

           if (!append_value(
                   &answer,
                   &answer_capacity,
                   answer_size,
                   rightmost_value)) {
               free(answer);
               queue_destroy(&queue);
               *returnSize = -1;
               return NULL;
           }
           ++answer_size;
       }

       queue_destroy(&queue);
       *returnSize = (int)answer_size;
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <queue>
   #include <vector>

   class Solution {
   public:
       std::vector<int> rightSideView(TreeNode* root) {
           if (root == nullptr) {
               return {};
           }

           std::queue<TreeNode*> queue;
           std::vector<int> answer;
           queue.push(root);

           while (!queue.empty()) {
               const std::size_t levelSize = queue.size();
               int rightmostValue = 0;

               for (std::size_t i = 0; i < levelSize; ++i) {
                   TreeNode* node = queue.front();
                   queue.pop();
                   rightmostValue = node->val;

                   if (node->left != nullptr) {
                       queue.push(node->left);
                   }
                   if (node->right != nullptr) {
                       queue.push(node->right);
                   }
               }
               answer.push_back(rightmostValue);
           }

           return answer;
       }
   };

Python
~~~~~~

.. code-block:: python

   from collections import deque
   from typing import Optional


   class Solution:
       def rightSideView(self, root: Optional[TreeNode]) -> list[int]:
           if root is None:
               return []

           queue = deque([root])
           answer: list[int] = []

           while queue:
               level_size = len(queue)
               rightmost_value = 0

               for _ in range(level_size):
                   node = queue.popleft()
                   rightmost_value = node.val

                   if node.left is not None:
                       queue.append(node.left)
                   if node.right is not None:
                       queue.append(node.right)

               answer.append(rightmost_value)

           return answer

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.ArrayList;
   import java.util.Deque;
   import java.util.List;

   class Solution {
       public List<Integer> rightSideView(TreeNode root) {
           List<Integer> answer = new ArrayList<>();
           if (root == null) {
               return answer;
           }

           Deque<TreeNode> queue = new ArrayDeque<>();
           queue.addLast(root);

           while (!queue.isEmpty()) {
               int levelSize = queue.size();
               int rightmostValue = 0;

               for (int i = 0; i < levelSize; i++) {
                   TreeNode node = queue.removeFirst();
                   rightmostValue = node.val;

                   if (node.left != null) {
                       queue.addLast(node.left);
                   }
                   if (node.right != null) {
                       queue.addLast(node.right);
                   }
               }
               answer.add(rightmostValue);
           }

           return answer;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::VecDeque;
   use std::rc::Rc;

   impl Solution {
       pub fn right_side_view(
           root: Option<Rc<RefCell<TreeNode>>>,
       ) -> Vec<i32> {
           let Some(root_node) = root else {
               return Vec::new();
           };

           let mut queue = VecDeque::new();
           let mut answer = Vec::new();
           queue.push_back(root_node);

           while !queue.is_empty() {
               let level_size = queue.len();
               let mut rightmost_value = 0;

               for _ in 0..level_size {
                   let node = queue.pop_front().unwrap();
                   let (value, left, right) = {
                       let borrowed = node.borrow();
                       (
                           borrowed.val,
                           borrowed.left.clone(),
                           borrowed.right.clone(),
                       )
                   };

                   rightmost_value = value;
                   if let Some(left_node) = left {
                       queue.push_back(left_node);
                   }
                   if let Some(right_node) = right {
                       queue.push_back(right_node);
                   }
               }
               answer.push(rightmost_value);
           }

           answer
       }
   }

Go
~~

.. code-block:: go

   type nodeQueue struct {
       data []*TreeNode
       head int
       size int
   }

   func newNodeQueue() *nodeQueue {
       return &nodeQueue{data: make([]*TreeNode, 8)}
   }

   func (q *nodeQueue) grow() {
       next := make([]*TreeNode, len(q.data)*2)
       for i := 0; i < q.size; i++ {
           next[i] = q.data[(q.head+i)%len(q.data)]
       }
       q.data = next
       q.head = 0
   }

   func (q *nodeQueue) push(node *TreeNode) {
       if q.size == len(q.data) {
           q.grow()
       }
       index := (q.head + q.size) % len(q.data)
       q.data[index] = node
       q.size++
   }

   func (q *nodeQueue) pop() *TreeNode {
       node := q.data[q.head]
       q.data[q.head] = nil
       q.head = (q.head + 1) % len(q.data)
       q.size--
       return node
   }

   func rightSideView(root *TreeNode) []int {
       if root == nil {
           return []int{}
       }

       queue := newNodeQueue()
       answer := make([]int, 0)
       queue.push(root)

       for queue.size > 0 {
           levelSize := queue.size
           rightmostValue := 0

           for i := 0; i < levelSize; i++ {
               node := queue.pop()
               rightmostValue = node.Val

               if node.Left != nil {
                   queue.push(node.Left)
               }
               if node.Right != nil {
                   queue.push(node.Right)
               }
           }
           answer = append(answer, rightmostValue)
       }

       return answer
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   class NodeQueue {
       private data: Array<TreeNode | undefined> = new Array(8);
       private head = 0;
       private count = 0;

       get size(): number {
           return this.count;
       }

       push(node: TreeNode): void {
           if (this.count === this.data.length) {
               const next = new Array<TreeNode | undefined>(
                   this.data.length * 2,
               );
               for (let i = 0; i < this.count; i++) {
                   next[i] = this.data[
                       (this.head + i) % this.data.length
                   ];
               }
               this.data = next;
               this.head = 0;
           }

           const index = (this.head + this.count) % this.data.length;
           this.data[index] = node;
           this.count++;
       }

       pop(): TreeNode {
           const node = this.data[this.head]!;
           this.data[this.head] = undefined;
           this.head = (this.head + 1) % this.data.length;
           this.count--;
           return node;
       }
   }

   function rightSideView(root: TreeNode | null): number[] {
       if (root === null) {
           return [];
       }

       const queue = new NodeQueue();
       const answer: number[] = [];
       queue.push(root);

       while (queue.size > 0) {
           const levelSize = queue.size;
           let rightmostValue = 0;

           for (let i = 0; i < levelSize; i++) {
               const node = queue.pop();
               rightmostValue = node.val;

               if (node.left !== null) {
                   queue.push(node.left);
               }
               if (node.right !== null) {
                   queue.push(node.right);
               }
           }
           answer.push(rightmostValue);
       }

       return answer;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<int> RightSideView(TreeNode root) {
           var answer = new List<int>();
           if (root == null) {
               return answer;
           }

           var queue = new Queue<TreeNode>();
           queue.Enqueue(root);

           while (queue.Count > 0) {
               int levelSize = queue.Count;
               int rightmostValue = 0;

               for (int i = 0; i < levelSize; i++) {
                   TreeNode node = queue.Dequeue();
                   rightmostValue = node.val;

                   if (node.left != null) {
                       queue.Enqueue(node.left);
                   }
                   if (node.right != null) {
                       queue.Enqueue(node.right);
                   }
               }
               answer.Add(rightmostValue);
           }

           return answer;
       }
   }

Julia
~~~~~

.. code-block:: julia

   mutable struct TreeNode
       val::Int
       left::Union{Nothing, TreeNode}
       right::Union{Nothing, TreeNode}
   end

   mutable struct NodeQueue
       data::Vector{Union{Nothing, TreeNode}}
       head::Int
       tail::Int
       size::Int
   end

   NodeQueue() = NodeQueue(fill(nothing, 8), 1, 1, 0)

   function grow!(queue::NodeQueue)
       old = queue.data
       next = fill(nothing, length(old) * 2)
       for index in 1:queue.size
           source = mod1(queue.head + index - 1, length(old))
           next[index] = old[source]
       end
       queue.data = next
       queue.head = 1
       queue.tail = queue.size + 1
   end

   function push_node!(queue::NodeQueue, node::TreeNode)
       if queue.size == length(queue.data)
           grow!(queue)
       end
       queue.data[queue.tail] = node
       queue.tail = mod1(queue.tail + 1, length(queue.data))
       queue.size += 1
   end

   function pop_node!(queue::NodeQueue)::TreeNode
       node = queue.data[queue.head]::TreeNode
       queue.data[queue.head] = nothing
       queue.head = mod1(queue.head + 1, length(queue.data))
       queue.size -= 1
       return node
   end

   function right_side_view(root::Union{Nothing, TreeNode})
       root === nothing && return Int[]

       queue = NodeQueue()
       answer = Int[]
       push_node!(queue, root)

       while queue.size > 0
           level_size = queue.size
           rightmost_value = 0

           for _ in 1:level_size
               node = pop_node!(queue)
               rightmost_value = node.val

               node.left !== nothing && push_node!(queue, node.left)
               node.right !== nothing && push_node!(queue, node.right)
           end
           push!(answer, rightmost_value)
       end

       return answer
   end

R
~

.. code-block:: r

   right_side_view <- function(root) {
     if (is.null(root)) {
       return(integer())
     }

     queue <- new.env(hash = TRUE, parent = emptyenv())
     head <- 1L
     tail <- 1L
     queue[["1"]] <- root

     result <- new.env(hash = TRUE, parent = emptyenv())
     result_size <- 0L

     while (head <= tail) {
       level_size <- tail - head + 1L
       rightmost_value <- 0L

       for (ignored in seq_len(level_size)) {
         key <- as.character(head)
         node <- queue[[key]]
         rm(list = key, envir = queue)
         head <- head + 1L
         rightmost_value <- node$val

         if (!is.null(node$left)) {
           tail <- tail + 1L
           queue[[as.character(tail)]] <- node$left
         }
         if (!is.null(node$right)) {
           tail <- tail + 1L
           queue[[as.character(tail)]] <- node$right
         }
       }

       result_size <- result_size + 1L
       result[[as.character(result_size)]] <- rightmost_value
     }

     vapply(
       seq_len(result_size),
       function(index) result[[as.character(index)]],
       integer(1)
     )
   }

静态审查记录
------------

本章未运行、未编译、未提交到在线判题，也未执行随机对拍、穷举或属性测试。完成的检查包括：

* 人工推演标准稀疏树、右分支提前结束、空树、单节点、全左链和全右链；
* 逐项证明层大小快照、同层从左到右顺序、最后节点可见性、无遗漏无重复和终止性；
* 核对十语言的空节点表示、字段名、结果容器与输入只读性；
* 专项检查 C 循环队列扩容、结果 ``realloc`` 临时指针、失败清理和 ``returnSize`` 区分；
* 专项检查 Rust 借用作用域，确保在孩子克隆后结束 ``Ref``；
* 专项检查 Go、TypeScript、Julia 循环队列，避免数组头删和已处理节点长期滞留；
* 专项检查 R 队列槽位删除与结果一次性物化。

剩余风险：这些实现只经过静态语义审查，目标语言编译器版本、平台预置节点定义和内存分配行为未通过实际运行确认。C 的 ``returnSize=-1`` 是资源失败扩展约定，正常在线判题输入不会依赖该分支。

关键边界与失败模式
------------------

* 忘记冻结 ``level_size``：孩子会混入当前层；
* 先右后左入队却仍提交最后节点：会得到本层最左节点；
* 只沿 ``right`` 指针：右支提前结束时遗漏左子树可见节点；
* 使用数组头删：部分语言中每次删除都需要搬移剩余元素；
* 把返回结果 ``O(h)`` 混入核心队列空间，错误声称总额外空间只有 ``O(w)``；
* C 扩容直接覆盖旧指针：失败时丢失原分配并泄漏；
* Rust 在持有 ``borrow()`` 时继续操作并再次借用同节点，可能触发运行时借用冲突。

知识更新与关联题目
------------------

* ``0102`` 层序遍历返回整层；本题复用同一层边界，只提交每层最后一个值；
* “先冻结前沿大小”是按层 BFS 的核心模式，也适用于层平均值、锯齿遍历和最小深度；
* 先右后左 DFS 的“首次到达深度”是另一种右视图不变量；
* 核心队列空间与输出载荷需要分别报告；
* 循环队列把活动前沿的空间维持在 ``O(w)``，避免头索引数组长期保留全部历史节点。

自检问题与答案
--------------

#. 为什么本层最后出队节点一定可见？

   因为队列快照包含该层全部节点且顺序从左到右，最后节点就是最靠右的非空节点。

#. 为什么入队顺序必须与提交规则配套？

   本章按左后右入队，因此最后出队是最右节点。若改成右后左，应提交本层第一个节点。

#. 队列为什么是 ``O(w)`` 而不是 ``O(h)``？

   队列同时保存的是一层及下一层部分节点，其峰值由最大层宽决定；树高决定结果长度和 DFS 栈深度。

#. 空树和资源失败如何在 C 中区分？

   空树返回 ``NULL`` 且 ``*returnSize=0``；动态分配失败返回 ``NULL`` 且 ``*returnSize=-1``。
