0129. Sum Root to Leaf Numbers
==============================

题目信息
--------

:题号: 0129
:难度: Medium
:主题: 二叉树、深度优先搜索、路径状态
:原题: `LeetCode 0129 <https://leetcode.com/problems/sum-root-to-leaf-numbers/>`_
:访问状态: Available
:教学重点: 十进制前缀累积、叶节点结算、只读遍历

题目重述
--------

二叉树每个节点保存一个十进制数字。每条根到叶路径按顺序组成一个整数，
返回所有根到叶整数之和。例如路径 ``1 -> 2 -> 3`` 表示 ``123``。
树非空，节点值位于 ``0`` 到 ``9``，输入树只读。

算法
----

深度优先遍历时携带当前前缀 ``prefix``。进入值为 ``digit`` 的节点后：

.. code-block:: text

   current = prefix * 10 + digit

若当前节点是叶节点，``current`` 就是一条完整路径对应的整数；否则递归计算左右子树并相加。
调用 ``dfs(node, prefix)`` 时，``prefix`` 始终表示从根到 ``node`` 父节点的数字序列。

正确性
~~~~~~

乘十为旧数字腾出个位，再加当前数字，因此 ``current`` 正确表示根到当前节点的路径。
叶节点贡献该完整整数。非叶节点的完整路径要么进入左子树，要么进入右子树，二者互不重叠；
递归结果相加恰好覆盖当前子树的全部根到叶路径。

复杂度
~~~~~~

每个节点访问一次，时间 ``O(n)``。递归栈 ``O(h)``，其中 ``h`` 是树高；输入树不修改。

核心语言实现
------------

C
~

.. code-block:: c

   struct TreeNode {
       int val;
       struct TreeNode *left;
       struct TreeNode *right;
   };

   static int dfs_sum(struct TreeNode *node, int prefix) {
       if (node == 0) {
           return 0;
       }
       int current = prefix * 10 + node->val;
       if (node->left == 0 && node->right == 0) {
           return current;
       }
       return dfs_sum(node->left, current) +
              dfs_sum(node->right, current);
   }

   int sumNumbers(struct TreeNode *root) {
       return dfs_sum(root, 0);
   }

C++
~~~

.. code-block:: cpp

   class Solution {
       int dfs(TreeNode* node, int prefix) {
           if (node == nullptr) {
               return 0;
           }
           int current = prefix * 10 + node->val;
           if (node->left == nullptr && node->right == nullptr) {
               return current;
           }
           return dfs(node->left, current) +
                  dfs(node->right, current);
       }

   public:
       int sumNumbers(TreeNode* root) {
           return dfs(root, 0);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def sumNumbers(self, root: TreeNode | None) -> int:
           def dfs(node: TreeNode | None, prefix: int) -> int:
               if node is None:
                   return 0
               current = prefix * 10 + node.val
               if node.left is None and node.right is None:
                   return current
               return dfs(node.left, current) + dfs(node.right, current)

           return dfs(root, 0)

Java
~~~~

.. code-block:: java

   class Solution {
       private int dfs(TreeNode node, int prefix) {
           if (node == null) {
               return 0;
           }
           int current = prefix * 10 + node.val;
           if (node.left == null && node.right == null) {
               return current;
           }
           return dfs(node.left, current) +
                  dfs(node.right, current);
       }

       public int sumNumbers(TreeNode root) {
           return dfs(root, 0);
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       fn dfs(
           node: &Option<Rc<RefCell<TreeNode>>>,
           prefix: i32,
       ) -> i32 {
           match node {
               None => 0,
               Some(handle) => {
                   let node = handle.borrow();
                   let current = prefix * 10 + node.val;
                   if node.left.is_none() && node.right.is_none() {
                       current
                   } else {
                       Self::dfs(&node.left, current) +
                           Self::dfs(&node.right, current)
                   }
               }
           }
       }

       pub fn sum_numbers(
           root: Option<Rc<RefCell<TreeNode>>>,
       ) -> i32 {
           Self::dfs(&root, 0)
       }
   }

Go
~~

.. code-block:: go

   func sumNumbers(root *TreeNode) int {
       var dfs func(*TreeNode, int) int
       dfs = func(node *TreeNode, prefix int) int {
           if node == nil {
               return 0
           }
           current := prefix*10 + node.Val
           if node.Left == nil && node.Right == nil {
               return current
           }
           return dfs(node.Left, current) +
               dfs(node.Right, current)
       }
       return dfs(root, 0)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sumNumbers(root: TreeNode | null): number {
       const dfs = (
           node: TreeNode | null,
           prefix: number,
       ): number => {
           if (node === null) return 0;
           const current = prefix * 10 + node.val;
           if (node.left === null && node.right === null) {
               return current;
           }
           return dfs(node.left, current) +
               dfs(node.right, current);
       };
       return dfs(root, 0);
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       private int Dfs(TreeNode node, int prefix) {
           if (node == null) return 0;
           int current = prefix * 10 + node.val;
           if (node.left == null && node.right == null) {
               return current;
           }
           return Dfs(node.left, current) +
                  Dfs(node.right, current);
       }

       public int SumNumbers(TreeNode root) {
           return Dfs(root, 0);
       }
   }

Julia
~~~~~

.. code-block:: julia

   mutable struct TreeNode
       val::Int
       left::Union{Nothing,TreeNode}
       right::Union{Nothing,TreeNode}
   end

   function sum_numbers(root::Union{Nothing,TreeNode})::Int
       function dfs(
           node::Union{Nothing,TreeNode},
           prefix::Int,
       )::Int
           node === nothing && return 0
           current = prefix * 10 + node.val
           if node.left === nothing && node.right === nothing
               return current
           end
           return dfs(node.left, current) +
                  dfs(node.right, current)
       end
       return dfs(root, 0)
   end

R
~

.. code-block:: r

   sum_numbers <- function(root) {
     dfs <- function(node, prefix) {
       if (is.null(node)) return(0)
       current <- prefix * 10 + node$val
       if (is.null(node$left) && is.null(node$right)) {
         return(current)
       }
       dfs(node$left, current) + dfs(node$right, current)
     }
     dfs(root, 0)
   }

关键边界
--------

* 单节点树直接返回根节点数字；
* 前导零自然保留路径语义，例如 ``0 -> 1`` 表示 ``1``；
* 只有左右孩子都为空时才结算；
* 前缀通过参数传递，不需要回溯恢复，也不会修改树节点。

最小自检
--------

#. 为什么更新公式是 ``prefix * 10 + digit``？
#. 为什么空子树返回 ``0``？
#. 为什么必须在真正叶节点处结算？
