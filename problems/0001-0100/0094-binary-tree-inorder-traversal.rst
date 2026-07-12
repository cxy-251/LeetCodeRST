0094. Binary Tree Inorder Traversal
===================================

题目信息
--------

:题号: 0094
:难度: Easy
:主题: 二叉树、深度优先遍历、显式栈
:原题: `LeetCode 0094 <https://leetcode.com/problems/binary-tree-inorder-traversal/>`_
:访问状态: Available
:教学重点: 左链入栈、延迟访问、右子树切换、树高空间边界

题目重述
--------

给定二叉树根节点 ``root``，按中序顺序返回所有节点值。中序遍历对每个节点执行：先遍历左子树，
再访问当前节点，最后遍历右子树。

题目保证节点数 ``0..100``，节点值位于 ``[-100, 100]``。输入树只读，不修改节点或链接。

自建示例
--------

.. code-block:: text

       1
        \
         2
        /
       3

   输出：[1, 3, 2]

空树返回空数组。只有左链的树会按从最深节点到根节点的顺序输出。

基础类型约定
------------

平台 ``TreeNode`` 包含值 ``val``、左孩子 ``left`` 和右孩子 ``right``；孩子可以为空。C、C++、
Python、Java、Rust、Go、TypeScript 和 C# 使用平台类型。

本题首次进入二叉树范围，因此 Julia 使用 ``mutable struct TreeNode`` 保存可变引用语义；R 使用
``environment`` 节点，字段同样为 ``val``、``left``、``right``。这些适配器只表达平台节点，不复制树。

问题抽象
--------

递归中序遍历会在调用栈中保存“左子树完成后返回哪个节点”。迭代算法把这部分控制状态显式保存到栈：

#. 从 ``current`` 开始沿左孩子不断入栈；
#. 到达空位置后弹出最近尚未访问的祖先；
#. 输出该节点值；
#. 把 ``current`` 切换到其右孩子，再重复相同过程。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 显式栈迭代
     - ``O(n)``
     - ``O(h)``
     - 主解法；调用状态和访问时机完全显式
   * - 递归 DFS
     - ``O(n)``
     - ``O(h)`` 调用栈
     - 代码更短，深树依赖运行时栈
   * - Morris 线索遍历
     - ``O(n)``
     - ``O(1)``
     - 临时修改树链接，证明和恢复成本更高

其中 ``h`` 是树高，最坏为 ``n``。

主解法：显式栈模拟递归
----------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

外层循环开始时：

* ``result`` 保存已经完整访问的中序前缀；
* 栈中节点从下到上是一条祖先链，它们的左侧必要路径已经展开，但节点自身尚未访问；
* ``current`` 是下一条需要继续展开的子树根，或为空；
* 栈中任何节点都不会再次通过其他路径入栈，输入是树而不是共享子图。

内层循环把 ``current`` 及其全部左祖先依次入栈。到达空孩子后，栈顶是中序顺序中下一个必须访问的
节点：其左子树已经完成，节点自身和右子树尚未处理。

为什么弹栈后转向右子树
~~~~~~~~~~~~~~~~~~~~~~

访问栈顶节点后，中序定义要求立刻处理它的右子树。令 ``current = node.right``，下一轮先展开该右子树
的最左路径；若右子树为空，外层循环会继续弹出更高祖先。这恰好模拟递归函数从左调用返回、访问根、
再进入右调用的控制流。

正确性依据
~~~~~~~~~~

**访问顺序正确。** 节点只有在左链展开结束后才弹栈，因此其左子树先完成；弹栈后立即转向右子树，
因此根先于右子树。

**完整性。** 每个非空节点在首次成为 ``current`` 时入栈一次，并最终被弹出访问一次。

**无重复。** 树中每个非根节点只有一个父节点；算法只通过该父节点的左边或右边到达它一次。

**空树正确。** ``current`` 为空且栈为空，外层循环不执行，返回空结果。

**终止性。** 每个节点最多入栈和出栈各一次，有限节点全部弹出后两个循环条件同时为假。

复杂度与资源
~~~~~~~~~~~~

* 每个节点入栈、出栈和输出各一次，时间复杂度 ``O(n)``；
* 栈最多保存一条根到叶路径，额外空间 ``O(h)``；
* 返回数组包含 ``n`` 个整数，返回空间 ``Theta(n)``；
* 最坏退化链表树有 ``h = n``，平衡树有 ``h = O(log n)``；
* C 由 ``n <= 100`` 使用 100 项固定节点栈，结果数组动态增长；空树仍返回可释放的非空分配，
  分配失败以 ``NULL`` 区分；
* Rust 的 ``Rc<RefCell<TreeNode>>`` 克隆只增加节点引用计数，不复制子树；
* R 的结果向量逐项扩展可能产生复制，算法访问顺序仍为 ``O(n)``，语言适配器的累计复制最坏为
  ``O(n^2)``；题目上界为 100。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   int *inorderTraversal(struct TreeNode *root, int *returnSize) {
       *returnSize = 0;
       int capacity = 16;
       int *result = malloc((size_t)capacity * sizeof(*result));
       if (result == NULL) {
           return NULL;
       }

       struct TreeNode *stack[100];
       int stack_size = 0;
       struct TreeNode *current = root;

       while (current != NULL || stack_size > 0) {
           while (current != NULL) {
               stack[stack_size++] = current;
               current = current->left;
           }

           current = stack[--stack_size];
           if (*returnSize == capacity) {
               const int next_capacity = capacity * 2;
               int *grown = realloc(
                   result,
                   (size_t)next_capacity * sizeof(*grown)
               );
               if (grown == NULL) {
                   free(result);
                   *returnSize = 0;
                   return NULL;
               }
               result = grown;
               capacity = next_capacity;
           }
           result[(*returnSize)++] = current->val;
           current = current->right;
       }

       return result;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       std::vector<int> inorderTraversal(TreeNode* root) {
           std::vector<int> result;
           std::vector<TreeNode*> stack;
           TreeNode* current = root;

           while (current != nullptr || !stack.empty()) {
               while (current != nullptr) {
                   stack.push_back(current);
                   current = current->left;
               }

               current = stack.back();
               stack.pop_back();
               result.push_back(current->val);
               current = current->right;
           }

           return result;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def inorderTraversal(self, root: Optional[TreeNode]) -> list[int]:
           result: list[int] = []
           stack: list[TreeNode] = []
           current = root

           while current is not None or stack:
               while current is not None:
                   stack.append(current)
                   current = current.left

               current = stack.pop()
               result.append(current.val)
               current = current.right

           return result

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.ArrayList;
   import java.util.Deque;
   import java.util.List;

   class Solution {
       public List<Integer> inorderTraversal(TreeNode root) {
           List<Integer> result = new ArrayList<>();
           Deque<TreeNode> stack = new ArrayDeque<>();
           TreeNode current = root;

           while (current != null || !stack.isEmpty()) {
               while (current != null) {
                   stack.push(current);
                   current = current.left;
               }

               current = stack.pop();
               result.add(current.val);
               current = current.right;
           }

           return result;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn inorder_traversal(
           root: Option<Rc<RefCell<TreeNode>>>,
       ) -> Vec<i32> {
           let mut result = Vec::new();
           let mut stack: Vec<Rc<RefCell<TreeNode>>> = Vec::new();
           let mut current = root;

           while current.is_some() || !stack.is_empty() {
               while let Some(node) = current {
                   current = node.borrow().left.clone();
                   stack.push(node);
               }

               let node = stack.pop().unwrap();
               let borrowed = node.borrow();
               result.push(borrowed.val);
               current = borrowed.right.clone();
           }

           result
       }
   }

Go
~~

.. code-block:: go

   func inorderTraversal(root *TreeNode) []int {
       result := make([]int, 0)
       stack := make([]*TreeNode, 0)
       current := root

       for current != nil || len(stack) > 0 {
           for current != nil {
               stack = append(stack, current)
               current = current.Left
           }

           current = stack[len(stack)-1]
           stack = stack[:len(stack)-1]
           result = append(result, current.Val)
           current = current.Right
       }

       return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function inorderTraversal(root: TreeNode | null): number[] {
       const result: number[] = [];
       const stack: TreeNode[] = [];
       let current = root;

       while (current !== null || stack.length > 0) {
           while (current !== null) {
               stack.push(current);
               current = current.left;
           }

           current = stack.pop() as TreeNode;
           result.push(current.val);
           current = current.right;
       }

       return result;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<int> InorderTraversal(TreeNode root) {
           var result = new List<int>();
           var stack = new Stack<TreeNode>();
           TreeNode current = root;

           while (current != null || stack.Count > 0) {
               while (current != null) {
                   stack.Push(current);
                   current = current.left;
               }

               current = stack.Pop();
               result.Add(current.val);
               current = current.right;
           }

           return result;
       }
   }

Julia
~~~~~

.. code-block:: julia

   mutable struct TreeNode
       val::Int
       left::Union{TreeNode, Nothing}
       right::Union{TreeNode, Nothing}
   end

   function inorder_traversal(
       root::Union{TreeNode, Nothing},
   )::Vector{Int}
       result = Int[]
       stack = TreeNode[]
       current = root

       while current !== nothing || !isempty(stack)
           while current !== nothing
               push!(stack, current)
               current = current.left
           end

           current = pop!(stack)
           push!(result, current.val)
           current = current.right
       end

       return result
   end

R
~

.. code-block:: r

   new_tree_node <- function(val, left = NULL, right = NULL) {
     node <- new.env(parent = emptyenv())
     node$val <- as.integer(val)
     node$left <- left
     node$right <- right
     node
   }

   inorder_traversal <- function(root) {
     result <- integer()
     stack <- list()
     current <- root

     while (!is.null(current) || length(stack) > 0L) {
       while (!is.null(current)) {
         stack[[length(stack) + 1L]] <- current
         current <- current$left
       }

       current <- stack[[length(stack)]]
       stack[[length(stack)]] <- NULL
       result <- c(result, current$val)
       current <- current$right
     }

     result
   }

验证计划与证据
--------------

本批次执行：

* Python 对节点数 ``0..100`` 的随机树与独立递归中序基准对拍；
* C、C++、Java、Go、TypeScript 检查空树、单节点、完全树、纯左链和纯右链；
* C、C++ 通过严格警告、ASan 和 UBSan；
* 检查结果长度等于节点数，输入树链接在调用前后保持不变。

Rust、C#、Julia 和 R 在当前环境执行平台类型、引用、空值、索引和容器语义的静态检查。

关键边界
--------

* 空树不入栈，直接返回空结果；
* 纯左链需要先压入全部节点，再反向弹出；
* 纯右链的栈深度最多为 1；
* 输入是树，节点没有共享父节点或环；该前提支撑“一次到达一次访问”。

易错点
------

* 节点入栈时立即输出会得到前序遍历；
* 弹栈输出后忘记切换到右孩子，会遗漏全部右子树；
* 外层条件只写 ``current != null``，会在左链到底后过早结束；
* Rust 在持有 ``RefCell`` 可变借用时继续操作栈容易触发借用冲突，本题只使用短生命周期不可变借用；
* R 把节点表示为普通列表会产生值复制，仓库统一使用环境表达引用节点。

本题新增知识
------------

* 平台二叉树节点 ``TreeNode`` 与 Julia、R 引用语义适配器；
* 用显式栈保存“左子树返回后访问根”的递归续点；
* 中序遍历的左链展开、弹栈访问和右子树切换。

本题强化知识
------------

* 显式栈把递归调用状态转为可观察的数据结构；
* 工作空间由树高 ``h`` 决定，而不是总节点数在所有树形下都达到 ``n``；
* 返回空间与算法工作空间需要分别计量。

关联题目
--------

* `0071. Simplify Path <0071-simplify-path.rst>`_：使用显式栈保存尚未完成的结构状态；
* `0079. Word Search <0079-word-search.rst>`_：递归 DFS 与路径状态的另一种形式。

最小自检
--------

#. 栈中的节点为什么还不能立即输出？
#. 内层左链循环结束后，栈顶为什么是下一个中序节点？
#. 弹栈后为什么必须把 ``current`` 设置为右孩子？
#. 额外空间为什么写成 ``O(h)`` 而不是始终 ``O(n)``？

答案要点
~~~~~~~~

#. 它们的左子树尚未全部完成，中序要求先左后根。
#. 栈顶是最深的尚未访问祖先，它的左孩子路径已经走到空，左子树已完成。
#. 根访问后中序定义的下一阶段就是右子树，之后仍需先展开其最左路径。
#. 栈只保存当前祖先链，长度等于树高；只有退化树才达到 ``n``。
