0144. Binary Tree Preorder Traversal
====================================

题目信息
--------

:题号: 0144
:难度: Easy
:主题: 二叉树、深度优先搜索、显式栈
:原题: `LeetCode 0144 <https://leetcode.com/problems/binary-tree-preorder-traversal/>`_
:访问状态: Available
:教学重点: 根左右顺序、栈的逆序压入、输出空间区分

题目重述
--------

给定二叉树根节点，按前序顺序返回全部节点值：先访问当前节点，再遍历左子树，最后遍历右子树。空树返回
空序列，不能修改树结构。

算法
----

使用显式栈模拟递归。先把根节点压栈；每轮弹出栈顶节点并记录其值，然后先压入右孩子，再压入左孩子。

栈是后进先出结构，因此左孩子会先于右孩子被弹出，得到“根、左、右”的访问顺序。空孩子不入栈。

正确性
~~~~~~

每个非空节点只在其父节点被处理时压栈一次，根节点初始压栈，因此所有节点都会被访问且不会重复。

处理节点 ``u`` 时先输出 ``u``，再把右孩子和左孩子依次压栈。由于左孩子位于栈顶，整个左子树会按同样规则
在右子树之前完成。对每棵子树递归应用这一性质，输出顺序恰好是前序遍历。

复杂度
~~~~~~

设节点数为 ``n``、树高为 ``h``。每个节点压栈和出栈一次，时间 ``O(n)``。显式栈占 ``O(h)``，
最坏退化树为 ``O(n)``；返回数组占 ``O(n)``，不计入算法工作空间。C 动态扩容数组由调用者释放。
R 适配器使用哈希环境保存栈和输出槽位，最后物化整数向量。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   static int grow_buffer(
       void **buffer,
       size_t *capacity,
       size_t element_size
   ) {
       size_t next_capacity = *capacity == 0 ? 16 : *capacity * 2;
       void *next = realloc(
           *buffer,
           next_capacity * element_size
       );
       if (next == NULL) {
           return 0;
       }
       *buffer = next;
       *capacity = next_capacity;
       return 1;
   }

   int *preorderTraversal(
       struct TreeNode *root,
       int *returnSize
   ) {
       *returnSize = 0;
       if (root == NULL) {
           return NULL;
       }

       struct TreeNode **stack = NULL;
       size_t stack_size = 0;
       size_t stack_capacity = 0;
       int *values = NULL;
       size_t values_capacity = 0;

       if (!grow_buffer(
               (void **)&stack,
               &stack_capacity,
               sizeof(*stack)
           )) {
           return NULL;
       }
       stack[stack_size++] = root;

       while (stack_size > 0) {
           struct TreeNode *node = stack[--stack_size];

           if ((size_t)*returnSize == values_capacity &&
               !grow_buffer(
                   (void **)&values,
                   &values_capacity,
                   sizeof(*values)
               )) {
               free(stack);
               free(values);
               *returnSize = 0;
               return NULL;
           }
           values[(*returnSize)++] = node->val;

           if (node->right != NULL) {
               if (stack_size == stack_capacity &&
                   !grow_buffer(
                       (void **)&stack,
                       &stack_capacity,
                       sizeof(*stack)
                   )) {
                   free(stack);
                   free(values);
                   *returnSize = 0;
                   return NULL;
               }
               stack[stack_size++] = node->right;
           }
           if (node->left != NULL) {
               if (stack_size == stack_capacity &&
                   !grow_buffer(
                       (void **)&stack,
                       &stack_capacity,
                       sizeof(*stack)
                   )) {
                   free(stack);
                   free(values);
                   *returnSize = 0;
                   return NULL;
               }
               stack[stack_size++] = node->left;
           }
       }

       free(stack);
       return values;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       std::vector<int> preorderTraversal(TreeNode *root) {
           std::vector<int> values;
           if (root == nullptr) {
               return values;
           }

           std::vector<TreeNode *> stack{root};
           while (!stack.empty()) {
               TreeNode *node = stack.back();
               stack.pop_back();
               values.push_back(node->val);

               if (node->right != nullptr) {
                   stack.push_back(node->right);
               }
               if (node->left != nullptr) {
                   stack.push_back(node->left);
               }
           }
           return values;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def preorderTraversal(
           self,
           root: Optional[TreeNode],
       ) -> list[int]:
           if root is None:
               return []

           values: list[int] = []
           stack = [root]
           while stack:
               node = stack.pop()
               values.append(node.val)

               if node.right is not None:
                   stack.append(node.right)
               if node.left is not None:
                   stack.append(node.left)

           return values

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.ArrayList;
   import java.util.Deque;
   import java.util.List;

   class Solution {
       public List<Integer> preorderTraversal(TreeNode root) {
           List<Integer> values = new ArrayList<>();
           if (root == null) return values;

           Deque<TreeNode> stack = new ArrayDeque<>();
           stack.push(root);

           while (!stack.isEmpty()) {
               TreeNode node = stack.pop();
               values.add(node.val);

               if (node.right != null) stack.push(node.right);
               if (node.left != null) stack.push(node.left);
           }
           return values;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn preorder_traversal(
           root: Option<Rc<RefCell<TreeNode>>>,
       ) -> Vec<i32> {
           let mut values = Vec::new();
           let Some(root_node) = root else {
               return values;
           };

           let mut stack = vec![root_node];
           while let Some(node) = stack.pop() {
               let borrowed = node.borrow();
               values.push(borrowed.val);

               if let Some(right) = borrowed.right.clone() {
                   stack.push(right);
               }
               if let Some(left) = borrowed.left.clone() {
                   stack.push(left);
               }
           }
           values
       }
   }

Go
~~

.. code-block:: go

   func preorderTraversal(root *TreeNode) []int {
       if root == nil {
           return []int{}
       }

       values := make([]int, 0)
       stack := []*TreeNode{root}

       for len(stack) > 0 {
           last := len(stack) - 1
           node := stack[last]
           stack = stack[:last]
           values = append(values, node.Val)

           if node.Right != nil {
               stack = append(stack, node.Right)
           }
           if node.Left != nil {
               stack = append(stack, node.Left)
           }
       }
       return values
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function preorderTraversal(root: TreeNode | null): number[] {
       if (root === null) return [];

       const values: number[] = [];
       const stack: TreeNode[] = [root];

       while (stack.length > 0) {
           const node = stack.pop()!;
           values.push(node.val);

           if (node.right !== null) stack.push(node.right);
           if (node.left !== null) stack.push(node.left);
       }
       return values;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<int> PreorderTraversal(TreeNode root) {
           List<int> values = new();
           if (root == null) return values;

           Stack<TreeNode> stack = new();
           stack.Push(root);

           while (stack.Count > 0) {
               TreeNode node = stack.Pop();
               values.Add(node.val);

               if (node.right != null) stack.Push(node.right);
               if (node.left != null) stack.Push(node.left);
           }
           return values;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function preorder_traversal(
       root::Union{Nothing,TreeNode},
   )::Vector{Int}
       root === nothing && return Int[]

       values = Int[]
       stack = TreeNode[root]

       while !isempty(stack)
           node = pop!(stack)
           push!(values, node.val)

           node.right !== nothing && push!(stack, node.right)
           node.left !== nothing && push!(stack, node.left)
       end
       return values
   end

R
~

.. code-block:: r

   preorder_traversal <- function(root) {
     if (is.null(root)) return(integer())

     stack <- new.env(hash = TRUE, parent = emptyenv())
     values <- new.env(hash = TRUE, parent = emptyenv())
     top <- 1L
     count <- 0L
     assign("1", root, envir = stack)

     while (top > 0L) {
       key <- as.character(top)
       node <- get(key, envir = stack, inherits = FALSE)
       rm(list = key, envir = stack)
       top <- top - 1L

       count <- count + 1L
       assign(as.character(count), node$val, envir = values)

       if (!is.null(node$right)) {
         top <- top + 1L
         assign(as.character(top), node$right, envir = stack)
       }
       if (!is.null(node$left)) {
         top <- top + 1L
         assign(as.character(top), node$left, envir = stack)
       }
     }

     vapply(
       seq_len(count),
       function(index) {
         get(as.character(index), envir = values, inherits = FALSE)
       },
       integer(1L)
     )
   }

关键边界
--------

* 空树返回空序列；
* 单节点树只返回根值；
* 只有左链或只有右链时仍保持根到叶顺序；
* 必须先压右孩子再压左孩子；
* 栈保存节点引用，结果保存节点值；
* 遍历不修改 ``left`` 或 ``right``。

验证
----

运行空树、单节点、左右不对称树和退化链；Python、C 与 C++ 输出与递归基准一致。其余语言完成栈顺序、
空引用和返回容器静态检查。

最小自检
--------

#. 为什么压栈顺序必须是右孩子在前、左孩子在后？
#. 如何证明每个节点恰好入栈一次？
#. 显式栈空间与返回数组空间为什么要分开计算？
