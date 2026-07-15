0145. Binary Tree Postorder Traversal
=====================================

题目信息
--------

:题号: 0145
:难度: Easy
:主题: 二叉树、深度优先搜索、迭代遍历
:原题: `LeetCode 0145 <https://leetcode.com/problems/binary-tree-postorder-traversal/>`_
:访问状态: Available
:教学重点: 根右左逆序、栈展开、空树返回

题目重述
--------

给定二叉树根节点，按左子树、右子树、根节点的顺序返回全部节点值。空树返回空列表，算法不修改树结构。

算法
----

直接迭代后序遍历需要记录子树是否已经处理。这里使用等价的逆序构造：

#. 栈中先放根节点；
#. 每次弹出节点并记录其值，先压入左孩子，再压入右孩子；
#. 栈的后进先出使访问顺序成为“根、右、左”；
#. 最后反转记录，得到“左、右、根”。

正确性
~~~~~~

对任意节点，算法先记录该节点，再把左、右孩子依次压栈，因此右子树会先于左子树被展开。整个记录序列对每个
子树都满足“根、右、左”。反转完整序列后，每个局部次序同时变为“左、右、根”，恰好是后序遍历。每个节点
只入栈和出栈一次，所以不会遗漏或重复。

复杂度
~~~~~~

设树有 ``n`` 个节点、高度为 ``h``。时间 ``O(n)``。返回数组占 ``O(n)``；显式栈最坏占 ``O(n)``，在较平衡
树上通常为 ``O(h)``。C 的返回数组由调用者释放，分配失败时返回空并把 ``returnSize`` 置零。R 反复使用
``c`` 扩展向量，累计复制成本最坏可达 ``O(n^2)``，其余实现的追加为摊还线性。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   int *postorderTraversal(
       struct TreeNode *root,
       int *returnSize
   ) {
       *returnSize = 0;
       if (root == NULL) {
           return NULL;
       }

       size_t stack_capacity = 16;
       size_t stack_size = 0;
       struct TreeNode **stack = malloc(
           stack_capacity * sizeof(*stack)
       );
       size_t values_capacity = 16;
       int *values = malloc(values_capacity * sizeof(*values));
       if (stack == NULL || values == NULL) {
           free(stack);
           free(values);
           return NULL;
       }

       stack[stack_size++] = root;
       while (stack_size > 0) {
           struct TreeNode *node = stack[--stack_size];
           if ((size_t)*returnSize == values_capacity) {
               values_capacity *= 2;
               int *grown = realloc(
                   values,
                   values_capacity * sizeof(*values)
               );
               if (grown == NULL) {
                   free(stack);
                   free(values);
                   *returnSize = 0;
                   return NULL;
               }
               values = grown;
           }
           values[(*returnSize)++] = node->val;

           if (node->left != NULL) {
               if (stack_size == stack_capacity) {
                   stack_capacity *= 2;
                   struct TreeNode **grown = realloc(
                       stack,
                       stack_capacity * sizeof(*stack)
                   );
                   if (grown == NULL) {
                       free(stack);
                       free(values);
                       *returnSize = 0;
                       return NULL;
                   }
                   stack = grown;
               }
               stack[stack_size++] = node->left;
           }
           if (node->right != NULL) {
               if (stack_size == stack_capacity) {
                   stack_capacity *= 2;
                   struct TreeNode **grown = realloc(
                       stack,
                       stack_capacity * sizeof(*stack)
                   );
                   if (grown == NULL) {
                       free(stack);
                       free(values);
                       *returnSize = 0;
                       return NULL;
                   }
                   stack = grown;
               }
               stack[stack_size++] = node->right;
           }
       }
       free(stack);

       for (int left = 0, right = *returnSize - 1;
            left < right;
            ++left, --right) {
           int temporary = values[left];
           values[left] = values[right];
           values[right] = temporary;
       }
       return values;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   public:
       std::vector<int> postorderTraversal(TreeNode *root) {
           if (root == nullptr) return {};

           std::vector<TreeNode *> stack{root};
           std::vector<int> values;
           while (!stack.empty()) {
               TreeNode *node = stack.back();
               stack.pop_back();
               values.push_back(node->val);
               if (node->left != nullptr) stack.push_back(node->left);
               if (node->right != nullptr) stack.push_back(node->right);
           }
           std::reverse(values.begin(), values.end());
           return values;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def postorderTraversal(
           self,
           root: Optional[TreeNode],
       ) -> list[int]:
           if root is None:
               return []

           stack = [root]
           values: list[int] = []
           while stack:
               node = stack.pop()
               values.append(node.val)
               if node.left is not None:
                   stack.append(node.left)
               if node.right is not None:
                   stack.append(node.right)
           values.reverse()
           return values

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.ArrayList;
   import java.util.Collections;
   import java.util.Deque;
   import java.util.List;

   class Solution {
       public List<Integer> postorderTraversal(TreeNode root) {
           List<Integer> values = new ArrayList<>();
           if (root == null) return values;

           Deque<TreeNode> stack = new ArrayDeque<>();
           stack.push(root);
           while (!stack.isEmpty()) {
               TreeNode node = stack.pop();
               values.add(node.val);
               if (node.left != null) stack.push(node.left);
               if (node.right != null) stack.push(node.right);
           }
           Collections.reverse(values);
           return values;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn postorder_traversal(
           root: Option<Rc<RefCell<TreeNode>>>,
       ) -> Vec<i32> {
           let Some(root) = root else {
               return Vec::new();
           };

           let mut stack = vec![root];
           let mut values = Vec::new();
           while let Some(node) = stack.pop() {
               let borrowed = node.borrow();
               values.push(borrowed.val);
               if let Some(left) = borrowed.left.clone() {
                   stack.push(left);
               }
               if let Some(right) = borrowed.right.clone() {
                   stack.push(right);
               }
           }
           values.reverse();
           values
       }
   }

Go
~~

.. code-block:: go

   func postorderTraversal(root *TreeNode) []int {
       if root == nil {
           return []int{}
       }

       stack := []*TreeNode{root}
       values := make([]int, 0)
       for len(stack) > 0 {
           last := len(stack) - 1
           node := stack[last]
           stack = stack[:last]
           values = append(values, node.Val)
           if node.Left != nil {
               stack = append(stack, node.Left)
           }
           if node.Right != nil {
               stack = append(stack, node.Right)
           }
       }
       for left, right := 0, len(values)-1; left < right; left, right = left+1, right-1 {
           values[left], values[right] = values[right], values[left]
       }
       return values
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function postorderTraversal(root: TreeNode | null): number[] {
       if (root === null) return [];

       const stack: TreeNode[] = [root];
       const values: number[] = [];
       while (stack.length > 0) {
           const node = stack.pop()!;
           values.push(node.val);
           if (node.left !== null) stack.push(node.left);
           if (node.right !== null) stack.push(node.right);
       }
       values.reverse();
       return values;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<int> PostorderTraversal(TreeNode root) {
           List<int> values = new();
           if (root == null) return values;

           Stack<TreeNode> stack = new();
           stack.Push(root);
           while (stack.Count > 0) {
               TreeNode node = stack.Pop();
               values.Add(node.val);
               if (node.left != null) stack.Push(node.left);
               if (node.right != null) stack.Push(node.right);
           }
           values.Reverse();
           return values;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function postorder_traversal(
       root::Union{Nothing,TreeNode},
   )::Vector{Int}
       root === nothing && return Int[]

       stack = TreeNode[root]
       values = Int[]
       while !isempty(stack)
           node = pop!(stack)
           push!(values, node.val)
           node.left !== nothing && push!(stack, node.left)
           node.right !== nothing && push!(stack, node.right)
       end
       reverse!(values)
       return values
   end

R
~

.. code-block:: r

   postorder_traversal <- function(root) {
     if (is.null(root)) return(integer())

     stack <- list(root)
     values <- integer()
     while (length(stack) > 0L) {
       last <- length(stack)
       node <- stack[[last]]
       stack[[last]] <- NULL
       values <- c(values, node$val)
       if (!is.null(node$left)) stack[[length(stack) + 1L]] <- node$left
       if (!is.null(node$right)) stack[[length(stack) + 1L]] <- node$right
     }
     rev(values)
   }

关键边界
--------

* 空树返回空结果；
* 单节点树返回根值；
* 只含左链或右链时，反转前后的顺序都要正确；
* 压栈顺序必须是左后右弹出，才能形成根、右、左；
* 返回数组与树节点值相互独立，算法不修改树。

验证
----

运行空树、单节点、左右不对称树和链状树；Python、C 与 C++ 输出与递归后序基准一致。其余语言完成栈顺序、
空引用和反转语义静态检查。

最小自检
--------

#. 为什么记录根、右、左后整体反转会得到左、右、根？
#. 压入左孩子和右孩子的顺序颠倒会产生什么结果？
#. 返回数组和显式栈分别属于哪一类空间成本？
