0104. Maximum Depth of Binary Tree
==================================

题目信息
--------

:题号: 0104
:难度: Easy
:主题: 二叉树、递归、深度
:原题: `LeetCode 0104 <https://leetcode.com/problems/maximum-depth-of-binary-tree/>`_
:访问状态: Available
:教学重点: 子树高度递推

题目重述
--------

返回二叉树从根到最深叶子的节点数；空树深度为 0。

自建示例
--------

.. code-block:: text

   输入：root = [3,9,20,null,null,15,7]
   输出：3

问题抽象
--------

``depth(node)`` 表示以 ``node`` 为根的最大深度；空节点为 0，非空为 ``1 + max(left,right)``。

主解法：后序高度递归
------------

思路
~~~~

后序高度递归。 子树高度递推

核心状态与不变量
~~~~~~~~~~~~~~~~

``depth(node)`` 表示以 ``node`` 为根的最大深度；空节点为 0，非空为 ``1 + max(left,right)``。

正确性依据
~~~~~~~~~~

空树定义正确。非空树的任意根到叶路径先经过根，再进入某一孩子；最长路径长度正是 1 加两棵子树最大深度中的较大者。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；调用栈 ``O(h)``。

核心语言实现
------------

C
~

.. code-block:: c

   int maxDepth(struct TreeNode *root) {
       if (root == NULL) return 0;
       int left = maxDepth(root->left), right = maxDepth(root->right);
       return 1 + (left > right ? left : right);
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public: int maxDepth(TreeNode* root) {
           if (!root) return 0;
           return 1 + max(maxDepth(root->left), maxDepth(root->right));
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def maxDepth(self, root: Optional[TreeNode]) -> int:
           if root is None:
               return 0
           return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
Java
~~~~

.. code-block:: java

   class Solution {
       public int maxDepth(TreeNode root) {
           if (root == null) return 0;
           return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;
   impl Solution {
       pub fn max_depth(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
           match root {
               None => 0, Some(node) => {
                   let node = node.borrow();
                   1 + Self::max_depth(node.left.clone()).max(Self::max_depth(node.right.clone()))
               }
           }
       }
   }
Go
~~

.. code-block:: go

   func maxDepth(root *TreeNode) int {
   	if root == nil {
   		return 0
   	}
   	a, b := maxDepth(root.Left), maxDepth(root.Right)
   	if a > b {
   		return a + 1
   	}
   	return b + 1
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxDepth(root: TreeNode | null): number {
       if (root === null)
           return 0;
       return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int MaxDepth(TreeNode root) {
           if (root == null) return 0;
           return 1 + Math.Max(MaxDepth(root.left), MaxDepth(root.right));
       }
   }
Julia
~~~~~

.. code-block:: julia

   max_depth(root::Nothing) = 0
   max_depth(root::TreeNode) = 1 + max(max_depth(root.left), max_depth(root.right))
R
~

.. code-block:: r

   max_depth <- function(root) {
       if (is.null(root)) return(0L)
       1L + max(max_depth(root$left), max_depth(root$right))
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空树返回 0。
* 退化树可能触发深递归限制。

易错点
------

* 把边数当作节点数导致单节点返回 0。
* 只递归一侧。

本题新增知识
------------

* 子树高度递推
* 题号 0104 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0110. Balanced Binary Tree <0110-balanced-binary-tree.rst>`_；
* `0111. Minimum Depth of Binary Tree <0111-minimum-depth-of-binary-tree.rst>`_；

最小自检
--------

#. ``后序高度递归`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

空树定义正确。非空树的任意根到叶路径先经过根，再进入某一孩子；最长路径长度正是 1 加两棵子树最大深度中的较大者。
