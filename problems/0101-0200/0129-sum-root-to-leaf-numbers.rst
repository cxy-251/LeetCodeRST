0129. Sum Root to Leaf Numbers
==============================

题目信息
--------

:题号: 0129
:难度: Medium
:主题: 二叉树、深度优先搜索、路径状态
:原题: `LeetCode 0129 <https://leetcode.com/problems/sum-root-to-leaf-numbers/>`_
:访问状态: Available
:教学重点: 十进制前缀累积、叶节点结算、递归状态与只读遍历

题目重述
--------

二叉树的每个节点保存一个 ``0`` 到 ``9`` 的数字。每条从根到叶节点的路径按顺序组成一个十进制整数，
返回所有根到叶整数之和。

本文采用以下契约：

* 输入树非空，每个节点值位于 ``[0, 9]``；
* 叶节点定义为左右孩子都为空的节点；
* 路径中的前导零不改变数值，例如 ``0 -> 1 -> 2`` 表示 ``12``；
* 题目保证答案可以由平台返回整数类型表示；
* 遍历只读，不修改节点值或链接；
* ``TreeNode`` 由平台或仓库统一节点模型提供，本题不重复定义。

自建示例
--------

多条路径
~~~~~~~~

.. code-block:: text

       4
      / \
     9   0
    / \
   5   1

   4 -> 9 -> 5 = 495
   4 -> 9 -> 1 = 491
   4 -> 0     = 40
   输出：1026

前导零
~~~~~~

.. code-block:: text

       0
        \
         1
          \
           2

   路径数值为 12，输出：12

问题抽象
--------

递归遍历到节点时，只需知道根到它父节点已经形成的十进制前缀。若父前缀为 ``prefix``，当前数字为
``digit``，新的路径值为：

.. code-block:: text

   current = prefix * 10 + digit

这个状态足以继续向左右子树传播。只有到达真正叶节点时，``current`` 才代表一条完整根到叶路径并参与总和。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 递归 DFS + 前缀参数
     - ``O(n)``
     - ``O(h)``
     - 主解法；状态直接对应路径构造
   * - 显式栈保存节点与前缀
     - ``O(n)``
     - ``O(h)`` 至 ``O(n)``
     - 避免调用栈，状态更显式
   * - 先保存全部路径再转数字
     - ``O(n)`` 以上
     - ``O(nh)`` 最坏
     - 保留了不需要的路径载荷

这里 ``n`` 是节点数，``h`` 是树高。主解法不保存路径数组，只传递一个整数前缀。

主解法：递归累积十进制前缀
--------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

定义 ``dfs(node, prefix)``：返回以 ``node`` 为根的子树中，所有从整棵树根出发、经过 ``node`` 并最终到达
该子树叶节点的路径数值之和。

调用入口保持：

* ``prefix`` 恰好表示从整棵树根到 ``node`` 父节点的数字序列；
* ``current = prefix * 10 + node.val`` 恰好表示根到当前节点的数字序列；
* 当前调用只读取节点，不改变树；
* 空子树没有根到叶路径，对总和贡献 ``0``。

叶节点为何是结算点
~~~~~~~~~~~~~~~~~~

若只在空孩子处结算，一个叶节点会从左右两个空孩子重复贡献；若在任意单孩子为空时结算，又会把未结束路径
提前算入。只有左右孩子都为空时，根到当前节点的序列才是一条完整且唯一的根到叶路径。

正确性依据
~~~~~~~~~~

对以 ``node`` 为根的子树高度做结构归纳。

**空子树。** 空节点不包含任何根到叶路径，返回 ``0`` 正确。

**叶节点。** 更新后的 ``current`` 根据十进制位值规则准确表示根到该叶节点的数字。该子树只有这一条完整路径，
返回 ``current`` 正确。

**内部节点。** 任意经过当前节点的完整根到叶路径，下一步只能进入左子树或右子树，两类路径互斥且覆盖全部
可能。根据归纳假设，两个递归调用分别返回两类路径的准确总和，相加得到当前子树全部路径总和。

**无重复与无遗漏。** 树中每个非根节点只有一个父节点，每条根到叶路径在第一次分向左或右后属于唯一分支，
因此不会被两个递归分支重复计算；所有叶节点都可由根沿唯一父子链到达，因此不会遗漏。

**终止性。** 每次递归下降到严格更矮的子树，最终到达叶节点或空节点，调用必然结束。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 每个节点访问一次，时间复杂度 ``O(n)``；
* 递归栈深度 ``O(h)``，退化树最坏 ``O(n)``；
* 除调用栈和固定整数状态外不保存路径，核心额外空间 ``O(h)``；
* 返回值是整数，返回载荷 ``O(1)``；
* Rust 克隆 ``Rc`` 只增加引用计数，不复制子树；
* Julia 与 R 使用仓库统一的可变引用节点模型，函数只读取字段；
* 固定宽语言依赖题目保证，中间前缀和总和不会超出接口可表示范围。

核心语言实现
------------

以下代码复用平台提供的 ``TreeNode``，不在本题重复定义节点结构。

C
~

.. code-block:: c

   static int sum_from(
       const struct TreeNode *node,
       int prefix
   ) {
       if (node == NULL) {
           return 0;
       }

       int current = prefix * 10 + node->val;
       if (node->left == NULL && node->right == NULL) {
           return current;
       }
       return sum_from(node->left, current) +
           sum_from(node->right, current);
   }

   int sumNumbers(struct TreeNode *root) {
       return sum_from(root, 0);
   }

C++
~~~

.. code-block:: cpp

   class Solution {
       int sumFrom(TreeNode* node, int prefix) {
           if (node == nullptr) {
               return 0;
           }

           int current = prefix * 10 + node->val;
           if (node->left == nullptr && node->right == nullptr) {
               return current;
           }
           return sumFrom(node->left, current) +
               sumFrom(node->right, current);
       }

   public:
       int sumNumbers(TreeNode* root) {
           return sumFrom(root, 0);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def sumNumbers(self, root: TreeNode | None) -> int:
           def sum_from(
               node: TreeNode | None,
               prefix: int,
           ) -> int:
               if node is None:
                   return 0

               current = prefix * 10 + node.val
               if node.left is None and node.right is None:
                   return current
               return (
                   sum_from(node.left, current)
                   + sum_from(node.right, current)
               )

           return sum_from(root, 0)

Java
~~~~

.. code-block:: java

   class Solution {
       private int sumFrom(TreeNode node, int prefix) {
           if (node == null) {
               return 0;
           }

           int current = prefix * 10 + node.val;
           if (node.left == null && node.right == null) {
               return current;
           }
           return sumFrom(node.left, current) +
               sumFrom(node.right, current);
       }

       public int sumNumbers(TreeNode root) {
           return sumFrom(root, 0);
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       fn sum_from(
           node: &Option<Rc<RefCell<TreeNode>>>,
           prefix: i32,
       ) -> i32 {
           let Some(handle) = node else {
               return 0;
           };

           let current_node = handle.borrow();
           let current = prefix * 10 + current_node.val;
           if current_node.left.is_none() &&
              current_node.right.is_none() {
               return current;
           }
           Self::sum_from(&current_node.left, current) +
               Self::sum_from(&current_node.right, current)
       }

       pub fn sum_numbers(
           root: Option<Rc<RefCell<TreeNode>>>,
       ) -> i32 {
           Self::sum_from(&root, 0)
       }
   }

Go
~~

.. code-block:: go

   func sumNumbers(root *TreeNode) int {
       var sumFrom func(*TreeNode, int) int
       sumFrom = func(node *TreeNode, prefix int) int {
           if node == nil {
               return 0
           }

           current := prefix*10 + node.Val
           if node.Left == nil && node.Right == nil {
               return current
           }
           return sumFrom(node.Left, current) +
               sumFrom(node.Right, current)
       }
       return sumFrom(root, 0)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sumNumbers(root: TreeNode | null): number {
       const sumFrom = (
           node: TreeNode | null,
           prefix: number,
       ): number => {
           if (node === null) {
               return 0;
           }

           const current = prefix * 10 + node.val;
           if (node.left === null && node.right === null) {
               return current;
           }
           return sumFrom(node.left, current) +
               sumFrom(node.right, current);
       };
       return sumFrom(root, 0);
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       private int SumFrom(TreeNode node, int prefix) {
           if (node == null) {
               return 0;
           }

           int current = prefix * 10 + node.val;
           if (node.left == null && node.right == null) {
               return current;
           }
           return SumFrom(node.left, current) +
               SumFrom(node.right, current);
       }

       public int SumNumbers(TreeNode root) {
           return SumFrom(root, 0);
       }
   }

Julia
~~~~~

.. code-block:: julia

   function sum_numbers(
       root::Union{Nothing, TreeNode},
   )::Int
       function sum_from(
           node::Union{Nothing, TreeNode},
           prefix::Int,
       )::Int
           node === nothing && return 0

           current = prefix * 10 + node.val
           if node.left === nothing && node.right === nothing
               return current
           end
           return sum_from(node.left, current) +
               sum_from(node.right, current)
       end

       return sum_from(root, 0)
   end

R
~

.. code-block:: r

   sum_numbers <- function(root) {
     sum_from <- function(node, prefix) {
       if (is.null(node)) {
         return(0)
       }

       current <- prefix * 10 + node$val
       if (is.null(node$left) && is.null(node$right)) {
         return(current)
       }
       sum_from(node$left, current) +
         sum_from(node$right, current)
     }

     sum_from(root, 0)
   }

验证计划与证据
--------------

本次返工覆盖单节点、左右两条路径、只有单孩子、路径含零、根值为零和不平衡深树。Python 主实现实际运行
固定案例，并与“显式收集全部根到叶数字字符串后求和”的独立基准进行小规模随机树对拍。C、C++、Java、
Go 与 TypeScript 完成函数签名、叶节点条件和只读路径静态复核；Rust、C#、Julia、R 完成节点引用、空值和
递归状态静态检查。本次未声称十种语言全部实际运行。

关键边界
--------

* 单节点既是根也是叶，答案就是该数字；
* 只有一个孩子的节点不是叶节点；
* 空孩子贡献 ``0``，不能把当前前缀再次计入；
* 前导零不需要单独处理，十进制累积公式自然得到正确数值；
* 平台节点类型不得在本题重复定义；
* 深度等于 ``h`` 的递归会使用 ``O(h)`` 调用栈。

易错点
------

* 在每个节点都把 ``current`` 加入答案，会把未结束前缀当成完整路径；
* 在任意一个孩子为空时结算，会提前结束单孩子路径；
* 在两个空孩子递归返回时分别结算，会让每个叶节点重复两次；
* 使用全局可变前缀却没有回溯恢复，导致兄弟分支互相污染；
* 先拼接字符串再解析整数，增加不必要的路径载荷和转换成本；
* 重复声明 ``TreeNode``，破坏平台接口和仓库统一节点模型。

本题新增知识
------------

* 用整数前缀直接表示根到当前节点的十进制序列；
* 叶节点是递归路径的唯一结算点；
* 左右子树路径集合互斥，可直接相加。

本题强化知识
------------

* 树递归参数绑定当前路径状态，兄弟分支通过值传递天然隔离；
* 结构归纳证明递归遍历的完整性；
* 调用栈空间由树高而不是节点总数直接决定。

关联题目
--------

* `0112. Path Sum <0112-path-sum.rst>`_：传递剩余目标值，只判断是否存在路径；
* `0113. Path Sum II <0113-path-sum-ii.rst>`_：需要保存并快照完整路径；
* `0124. Binary Tree Maximum Path Sum <0124-binary-tree-maximum-path-sum.rst>`_：路径不再限定从根到叶，状态更复杂。

最小自检
--------

#. ``prefix`` 在进入 ``dfs(node, prefix)`` 时准确表示哪一段路径？
#. 为什么只有左右孩子都为空时才能结算？
#. 为什么左右递归结果可以直接相加而不会重复？
#. 本题为什么不需要路径数组或回溯删除操作？

答案要点
~~~~~~~~

#. 它表示根到当前节点父节点的数字序列；进入节点后再乘十并加入当前数字；
#. 此时路径才真正从根结束于叶，单孩子节点仍有未完成路径；
#. 树的左右子树节点集合分离，每条完整路径在当前节点后只进入其中一侧；
#. 前缀是按值传递的整数，兄弟调用各自获得独立状态，不保存具体节点序列。
