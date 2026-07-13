0101. Symmetric Tree
====================

题目信息
--------

:题号: 0101
:难度: Easy
:主题: 二叉树、递归、队列
:原题: `LeetCode 0101 <https://leetcode.com/problems/symmetric-tree/>`_
:访问状态: Available
:教学重点: 镜像位置成对比较、空节点基例

题目重述
--------

判断一棵二叉树是否关于根节点左右镜像对称。树只读；对应镜像位置必须同时为空或值相等。

自建示例
--------

.. code-block:: text

   输入：root = [1,2,2,3,4,4,3]
   输出：true

   输入：root = [1,2,2,null,3,null,3]
   输出：false

问题抽象
--------

状态 ``mirror(a,b)`` 比较左子树中的 ``a`` 与右子树中的镜像位置 ``b``；非空时递归比较 ``a.left`` 对 ``b.right``、``a.right`` 对 ``b.left``。

主解法：镜像递归
----------

思路
~~~~

镜像递归。 镜像位置成对比较、空节点基例

核心状态与不变量
~~~~~~~~~~~~~~~~

状态 ``mirror(a,b)`` 比较左子树中的 ``a`` 与右子树中的镜像位置 ``b``；非空时递归比较 ``a.left`` 对 ``b.right``、``a.right`` 对 ``b.left``。

正确性依据
~~~~~~~~~~

空节点对同时为空时成立；只有一个为空或值不等时失败。非空且值相等时，两组更小镜像子树均成立当且仅当当前两棵子树镜像，因此结构归纳得到整棵树结论。

复杂度与语言边界
~~~~~~~~~~~~~~~~

设节点数为 ``n``、高度为 ``h``。每个节点最多访问一次，时间 ``O(n)``；递归栈 ``O(h)``，退化树为 ``O(n)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   static bool mirror(struct TreeNode *a, struct TreeNode *b) {
       if (a == NULL || b == NULL) return a == b;
       return a->val == b->val && mirror(a->left, b->right) && mirror(a->right, b->left);
   }
   bool isSymmetric(struct TreeNode *root) {
       return root == NULL || mirror(root->left, root->right);
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       bool mirror(TreeNode* a, TreeNode* b) {
           if (!a || !b) return a == b;
           return a->val == b->val && mirror(a->left, b->right) && mirror(a->right, b->left);
       }
       public: bool isSymmetric(TreeNode* root) {
           return !root || mirror(root->left, root->right);
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def isSymmetric(self, root: Optional[TreeNode]) -> bool:

           def mirror(a: Optional[TreeNode], b: Optional[TreeNode]) -> bool:
               if a is None or b is None:
                   return a is b
               return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)
           return root is None or mirror(root.left, root.right)
Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isSymmetric(TreeNode root) {
           return root == null || mirror(root.left, root.right);
       }
       private boolean mirror(TreeNode a, TreeNode b) {
           if (a == null || b == null) return a == b;
           return a.val == b.val && mirror(a.left, b.right) && mirror(a.right, b.left);
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;
   impl Solution {
       pub fn is_symmetric(root: Option<Rc<RefCell<TreeNode>>>) -> bool {
           fn mirror( a: Option<Rc<RefCell<TreeNode>>>, b: Option<Rc<RefCell<TreeNode>>>, ) -> bool
               {
               match (a, b) {
                   (None, None) => true, (Some(x), Some(y)) => {
                       let xb = x.borrow();
                       let yb = y.borrow();
                       xb.val == yb.val && mirror(xb.left.clone(), yb.right.clone()) &&
                           mirror(xb.right.clone(), yb.left.clone())
                   }
                   _ => false,
               }
           }
           match root {
               None => true, Some(node) => {
                   let node = node.borrow();
                   mirror(node.left.clone(), node.right.clone())
               }
           }
       }
   }
Go
~~

.. code-block:: go

   func isSymmetric(root *TreeNode) bool {
   	var mirror func(*TreeNode, *TreeNode) bool
   	mirror = func(a, b *TreeNode) bool {
   		if a == nil || b == nil {
   			return a == b
   		}
   		return a.Val == b.Val &&
   			mirror(a.Left, b.Right) && mirror(a.Right, b.Left)
   	}
   	return root == nil || mirror(root.Left, root.Right)
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isSymmetric(root: TreeNode | null): boolean {
       const mirror = (a: TreeNode | null, b: TreeNode | null): boolean => {
           if (a === null || b === null)
               return a === b;
           return a.val === b.val && mirror(a.left, b.right) && mirror(a.right, b.left);
       };
       return root === null || mirror(root.left, root.right);
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsSymmetric(TreeNode root) {
           return root == null || Mirror(root.left, root.right);
       }
       private bool Mirror(TreeNode a, TreeNode b) {
           if (a == null || b == null) return a == b;
           return a.val == b.val && Mirror(a.left, b.right) && Mirror(a.right, b.left);
       }
   }
Julia
~~~~~

.. code-block:: julia

   function is_symmetric(root::Union{TreeNode, Nothing})::Bool
       mirror(a, b) = if a === nothing || b === nothing
       a === b
   else
       a.val == b.val && mirror(a.left, b.right) && mirror(a.right, b.left)
   end
   return root === nothing || mirror(root.left, root.right)
   end
R
~

.. code-block:: r

   is_symmetric <- function(root) {
       mirror <- function(a, b) {
           if (is.null(a) || is.null(b)) return(is.null(a) && is.null(b))
           a$val == b$val && mirror(a$left, b$right) && mirror(a$right, b$left)
       }
       is.null(root) || mirror(root$left, root$right)
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空树按对称处理。
* 单节点树无需进入非空镜像比较。

易错点
------

* 把左右孩子同方向比较，实际判断成相同树。
* 只比较值而忽略一个为空一个非空。

本题新增知识
------------

* 镜像位置成对比较、空节点基例
* 题号 0101 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0100. Same Tree <../0001-0100/0100-same-tree.rst>`_；
* `0104. Maximum Depth of Binary Tree <0104-maximum-depth-of-binary-tree.rst>`_；

最小自检
--------

#. ``镜像递归`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

空节点对同时为空时成立；只有一个为空或值不等时失败。非空且值相等时，两组更小镜像子树均成立当且仅当当前两棵子树镜像，因此结构归纳得到整棵树结论。
