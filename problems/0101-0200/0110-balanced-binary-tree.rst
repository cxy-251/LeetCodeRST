0110. Balanced Binary Tree
==========================

题目信息
--------

:题号: 0110
:难度: Easy
:主题: 二叉树、后序遍历、哨兵
:原题: `LeetCode 0110 <https://leetcode.com/problems/balanced-binary-tree/>`_
:访问状态: Available
:教学重点: 高度与失衡合并返回

题目重述
--------

判断二叉树是否高度平衡：每个节点左右子树高度差不超过 1。

自建示例
--------

.. code-block:: text

   输入：root = [3,9,20,null,null,15,7]
   输出：true

   输入：root = [1,2,2,3,3,null,null,4,4]
   输出：false

问题抽象
--------

后序函数返回子树高度；发现任一子树失衡或当前高度差超过 1 时返回 ``-1``。

主解法：后序高度与失败哨兵
---------------

思路
~~~~

后序高度与失败哨兵。 高度与失衡合并返回

核心状态与不变量
~~~~~~~~~~~~~~~~

后序函数返回子树高度；发现任一子树失衡或当前高度差超过 1 时返回 ``-1``。

正确性依据
~~~~~~~~~~

若返回非负值，归纳保证左右子树均平衡且高度正确；差值检查通过则当前树平衡。返回 ``-1`` 时存在已证明的失衡节点，向上传播不会丢失。

复杂度与语言边界
~~~~~~~~~~~~~~~~

最坏时间 ``O(n)``，发现失衡可提前结束；调用栈 ``O(h)``。

核心语言实现
------------

C
~

.. code-block:: c

   static int height(struct TreeNode *root) {
       if (root == NULL) return 0;
       int left = height(root->left);
       if (left < 0) return -1;
       int right = height(root->right);
       if (right < 0) return -1;
       int diff = left - right;
       if (diff < -1 || diff > 1) return -1;
       return 1 + (left > right ? left : right);
   }
   bool isBalanced(struct TreeNode *root) {
       return height(root) >= 0;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       int height(TreeNode* root) {
           if (!root) return 0;
           int l = height(root->left);
           if (l < 0) return -1;
           int r = height(root->right);
           if (r < 0 || abs(l-r) > 1) return -1;
           return 1 + max(l, r);
       }
       public: bool isBalanced(TreeNode* root) {
           return height(root) >= 0;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def isBalanced(self, root: Optional[TreeNode]) -> bool:

           def height(node: Optional[TreeNode]) -> int:
               if node is None:
                   return 0
               left = height(node.left)
               if left < 0:
                   return -1
               right = height(node.right)
               if right < 0 or abs(left - right) > 1:
                   return -1
               return 1 + max(left, right)
           return height(root) >= 0
Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isBalanced(TreeNode root) {
           return height(root) >= 0;
       }
       private int height(TreeNode node) {
           if (node == null) return 0;
           int left = height(node.left);
           if (left < 0) return -1;
           int right = height(node.right);
           if (right < 0 || Math.abs(left - right) > 1) return -1;
           return 1 + Math.max(left, right);
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;
   impl Solution {
       pub fn is_balanced(root: Option<Rc<RefCell<TreeNode>>>) -> bool {
           fn height(node: Option<Rc<RefCell<TreeNode>>>) -> i32 {
               let Some(node) = node else {
                   return 0;
               };
               let node = node.borrow();
               let l = height(node.left.clone());
               if l < 0 {
                   return -1;
               }
               let r = height(node.right.clone());
               if r < 0 || (l-r).abs() > 1 {
                   -1
               } else {
                   1 + l.max(r)
               }
           }
           height(root) >= 0
       }
   }
Go
~~

.. code-block:: go

   func isBalanced(root *TreeNode) bool {
   	var height func(*TreeNode) int
   	height = func(node *TreeNode) int {
   		if node == nil {
   			return 0
   		}
   		l := height(node.Left)
   		if l < 0 {
   			return -1
   		}
   		r := height(node.Right)
   		if r < 0 || l-r > 1 || r-l > 1 {
   			return -1
   		}
   		if l > r {
   			return l + 1
   		}
   		return r + 1
   	}
   	return height(root) >= 0
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isBalanced(root: TreeNode | null): boolean {
       const height = (node: TreeNode | null): number => {
           if (node === null)
               return 0;
           const l = height(node.left);
           if (l < 0)
               return -1;
           const r = height(node.right);
           return r < 0 || Math.abs(l - r) > 1 ? -1 : 1 + Math.max(l, r);
       };
       return height(root) >= 0;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsBalanced(TreeNode root) => Height(root) >= 0;
       private int Height(TreeNode node) {
           if (node == null) return 0;
           int l = Height(node.left);
           if (l < 0) return -1;
           int r = Height(node.right);
           return r < 0 || Math.Abs(l-r) > 1 ? -1 : 1 + Math.Max(l,r);
       }
   }
Julia
~~~~~

.. code-block:: julia

   function is_balanced(root::Union{TreeNode, Nothing})::Bool
       function height(node)
           node === nothing && return 0
           left = height(node.left)
           left < 0 && return -1
           right = height(node.right)
           right < 0 || abs(left - right) > 1 ? -1 : 1 + max(left, right)
       end
       height(root) >= 0
   end
R
~

.. code-block:: r

   is_balanced <- function(root) {
       height <- function(node) {
           if (is.null(node)) return(0L)
           left <- height(node$left)
           if (left < 0L) return(-1L)
           right <- height(node$right)
           if (right < 0L || abs(left - right) > 1L) -1L else 1L + max(left, right)
       }
       height(root) >= 0L
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空树平衡，高度为 0。
* ``-1`` 不在合法高度域中，可安全作为哨兵。

易错点
------

* 对每个节点重复计算高度导致 ``O(n^2)``。
* 只检查根的高度差。

本题新增知识
------------

* 高度与失衡合并返回
* 题号 0110 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0104. Maximum Depth of Binary Tree <0104-maximum-depth-of-binary-tree.rst>`_；

最小自检
--------

#. ``后序高度与失败哨兵`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

若返回非负值，归纳保证左右子树均平衡且高度正确；差值检查通过则当前树平衡。返回 ``-1`` 时存在已证明的失衡节点，向上传播不会丢失。
