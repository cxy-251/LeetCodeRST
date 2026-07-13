0100. Same Tree
===============

题目信息
--------

:题号: 0100
:难度: Easy
:主题: 二叉树、递归、结构比较
:原题: `LeetCode 0100 <https://leetcode.com/problems/same-tree/>`_
:访问状态: Available
:教学重点: 成对递归状态、空节点对称基例、结构和值同时相等、短路终止

题目重述
--------

给定两棵二叉树 ``p`` 和 ``q``，判断它们是否完全相同。完全相同要求对应位置同时存在或同时为空，
并且所有对应非空节点的值相等。

仅有相同的节点值集合或相同遍历序列都不够；左右孩子位置也必须一致。两棵输入树都只读。

自建示例
--------

.. code-block:: text

   p:      1          q:      1
          / \                / \
         2   3              2   3

   输出：true

.. code-block:: text

   p:  1              q:  1
        \                /
         2              2

   输出：false

两棵树值相同，但节点 ``2`` 位于不同孩子方向，结构不相同。

问题抽象
--------

递归状态 ``same(p, q)`` 比较两个对应位置：

* 两者都为空：该位置相同；
* 只有一个为空：结构不同；
* 两者都非空：当前值必须相同，并递归比较左孩子对和右孩子对。

.. code-block:: text

   same(p, q) =
       p.val == q.val
       AND same(p.left, q.left)
       AND same(p.right, q.right)

布尔短路使算法在发现第一个差异时立即结束。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 成对递归比较
     - ``O(n)``
     - ``O(h)``
     - 主解法；直接对应结构归纳定义
   * - 显式栈保存节点对
     - ``O(n)``
     - ``O(h)``
     - 避免调用栈，状态更长
   * - 序列化后比较字符串
     - ``O(n)``
     - ``O(n)``
     - 必须保留空节点标记，产生额外中间结果

这里 ``n`` 是最坏情况下需要比较的节点对数量，``h`` 是较深树的高度。

主解法：对应位置成对递归
------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

每次调用只回答一个问题：以 ``p`` 和 ``q`` 为根的两棵子树是否完全相同。进入非空递归分支时：

* 两个根节点都存在；
* 当前层只比较根值；
* 左右子树的结构和值分别交给两个同定义子问题；
* 函数从不交叉比较 ``p.left`` 与 ``q.right``。

空节点基例同时承担结构检查。``p == null`` 与 ``q == null`` 必须作为一对判断，不能只忽略空位置。

正确性依据
~~~~~~~~~~

对两棵子树的最大高度做结构归纳。

**基础情况。** 两者都为空时没有节点和值差异，返回真；只有一个为空时根位置已经不同，返回假。

**归纳步骤。** 两者都非空时，整棵子树相同当且仅当根值相同、左子树相同且右子树相同。递归调用按
归纳假设正确判断两个更矮子树，三个条件的逻辑与正好等价于完整相同。

**无遗漏。** 每个对应非空节点对最多比较一次；任意结构差异都会在某个“一个为空、一个非空”的位置
暴露，任意值差异都会在对应根比较时暴露。

**终止性。** 每次递归下降到孩子，子树高度严格减小，最终到达空节点。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 最坏两棵树完全相同，需要比较全部 ``n`` 个节点对，时间 ``O(n)``；
* 第一个差异出现后短路返回，实际访问量可能更少；
* 调用栈深度为 ``O(h)``，退化树最坏 ``O(n)``；
* 返回值为布尔量，没有结果容器；
* Rust 在不可变借用期间克隆孩子 ``Rc`` 引用，递归不修改树；
* Julia 和 R 使用引用节点模型，但函数只读字段，不改变节点或链接。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>

   bool isSameTree(struct TreeNode *p, struct TreeNode *q) {
       if (p == NULL || q == NULL) {
           return p == q;
       }
       return p->val == q->val &&
           isSameTree(p->left, q->left) &&
           isSameTree(p->right, q->right);
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       bool isSameTree(TreeNode* p, TreeNode* q) {
           if (p == nullptr || q == nullptr) {
               return p == q;
           }
           return p->val == q->val &&
               isSameTree(p->left, q->left) &&
               isSameTree(p->right, q->right);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isSameTree(
           self,
           p: Optional[TreeNode],
           q: Optional[TreeNode],
       ) -> bool:
           if p is None or q is None:
               return p is q
           return (
               p.val == q.val
               and self.isSameTree(p.left, q.left)
               and self.isSameTree(p.right, q.right)
           )

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isSameTree(TreeNode p, TreeNode q) {
           if (p == null || q == null) {
               return p == q;
           }
           return p.val == q.val &&
               isSameTree(p.left, q.left) &&
               isSameTree(p.right, q.right);
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn is_same_tree(
           p: Option<Rc<RefCell<TreeNode>>>,
           q: Option<Rc<RefCell<TreeNode>>>,
       ) -> bool {
           match (p, q) {
               (None, None) => true,
               (Some(first), Some(second)) => {
                   let first_node = first.borrow();
                   let second_node = second.borrow();
                   first_node.val == second_node.val &&
                       Self::is_same_tree(
                           first_node.left.clone(),
                           second_node.left.clone(),
                       ) &&
                       Self::is_same_tree(
                           first_node.right.clone(),
                           second_node.right.clone(),
                       )
               }
               _ => false,
           }
       }
   }

Go
~~

.. code-block:: go

   func isSameTree(p *TreeNode, q *TreeNode) bool {
       if p == nil || q == nil {
           return p == q
       }
       return p.Val == q.Val &&
           isSameTree(p.Left, q.Left) &&
           isSameTree(p.Right, q.Right)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
       if (p === null || q === null) {
           return p === q;
       }
       return p.val === q.val &&
           isSameTree(p.left, q.left) &&
           isSameTree(p.right, q.right);
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsSameTree(TreeNode p, TreeNode q) {
           if (p == null || q == null) {
               return p == q;
           }
           return p.val == q.val &&
               IsSameTree(p.left, q.left) &&
               IsSameTree(p.right, q.right);
       }
   }

Julia
~~~~~

.. code-block:: julia

   function is_same_tree(
       p::Union{TreeNode, Nothing},
       q::Union{TreeNode, Nothing},
   )::Bool
       if p === nothing || q === nothing
           return p === q
       end
       return p.val == q.val &&
           is_same_tree(p.left, q.left) &&
           is_same_tree(p.right, q.right)
   end

R
~

.. code-block:: r

   is_same_tree <- function(p, q) {
     if (is.null(p) || is.null(q)) {
       return(is.null(p) && is.null(q))
     }
     p$val == q$val &&
       is_same_tree(p$left, q$left) &&
       is_same_tree(p$right, q$right)
   }

验证计划与证据
--------------

* 固定用例覆盖两棵空树、单边为空、相同树、值不同、左右方向不同和深链表树；
* Python 生成 50,000 组随机树对，与包含空标记的独立序列化基准对拍；
* 对随机树创建深复制，确认独立对象但结构和值相同时仍返回真；
* C、C++、Java、Go、TypeScript 完成随机属性测试；C、C++ 使用严格警告、ASan 和 UBSan；
* 调用前后序列化输入，确认两棵树均未修改。

Rust、C#、Julia 和 R 在当前环境完成空引用、递归签名和只读语义的静态检查。

易错点
------

* 只比较中序或前序值序列而不记录空位置，会把不同结构误判为相同；
* 两者任意一个为空时直接返回真；正确条件是两者必须同时为空；
* 只比较根值和左子树，遗漏右子树；
* 错把左子树与右子树交叉比较，实际判断成镜像关系；
* 在递归中修改节点以做访问标记，违反只读接口。

本题新增知识
------------

* 二叉树完全相同的成对递归定义；
* 空节点对称基例同时验证结构；
* 通过树高进行结构归纳证明。

本题强化知识
------------

* `0094` 建立的跨语言树节点引用模型；
* 树递归的 ``O(h)`` 调用栈边界；
* 布尔短路减少实际访问节点数。

关联题目
--------

* `0094. Binary Tree Inorder Traversal <0094-binary-tree-inorder-traversal.rst>`_：单树遍历与树高空间；
* `0098. Validate Binary Search Tree <0098-validate-binary-search-tree.rst>`_：检查单棵树的全局值约束；
* `0095. Unique Binary Search Trees II <0095-unique-binary-search-trees-ii.rst>`_：结构不同的树必须被区分。

最小自检
--------

#. 为什么两个遍历值序列相同仍不能保证树相同？
#. 两个空节点和单边空节点分别返回什么？
#. 正确性证明为什么适合使用树高归纳？
#. 最坏空间为什么由树高而不是节点总数直接决定？

答案要点
~~~~~~~~

#. 不记录空孩子位置时，不同结构可能产生相同值序列。
#. 两者都空返回真；只有一个为空返回假。
#. 每个递归子问题都是高度更小的左右子树，恰好满足归纳结构。
#. 同一时刻调用栈只保存一条根到当前节点的递归路径。
