0110. Balanced Binary Tree
==========================

题目信息
--------

:题号: 0110
:难度: Easy
:主题: 二叉树、后序遍历、树高、提前失败
:原题: `LeetCode 0110 <https://leetcode.com/problems/balanced-binary-tree/>`_
:访问状态: Available
:教学重点: 自底向上高度、失败哨兵、全树条件、短路终止

题目重述
--------

给定一棵二叉树，判断它是否高度平衡。高度平衡要求树中每一个节点的左右子树高度差都不超过 1，而不只是根节点
满足这一条件。

空树是平衡树。函数只读节点，不修改值、父子链接或节点身份。

自建示例
--------

平衡树
~~~~~~

.. code-block:: text

          3
        /   \
       9    20
           /  \
          15   7

根的左右高度分别为 1 和 2，差为 1；其他节点也满足条件，因此输出 ``true``。

根平衡但内部失衡
~~~~~~~~~~~~~~~~

.. code-block:: text

              1
            /   \
           2     3
          /       \
         4         5
        /           \
       6             7

根两侧高度相同，但节点 ``2`` 的左右高度差为 2，整棵树仍然不平衡。只检查根节点会误判。

退化链
~~~~~~

.. code-block:: text

   1 -> 2 -> 3 -> 4

连续四个右孩子形成高度差逐层扩大的链，输出 ``false``。

问题抽象
--------

平衡条件需要每个节点同时知道两件事：

* 左右子树是否已经平衡；
* 左右子树的高度是多少。

最直接的自顶向下方案是在每个节点先单独计算左右高度，再递归判断左右子树。这会让同一子树被重复扫描，退化树
最坏达到 ``O(n^2)``。

后序遍历可以一次返回完整摘要：子树平衡时返回高度，失衡时返回失败状态。父节点只处理一次两个子结果。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 后序返回高度或失败
     - ``O(n)``
     - ``O(h)``
     - 主解法；一次扫描并可提前终止
   * - 每个节点重新计算高度
     - 最坏 ``O(n^2)``
     - ``O(h)``
     - 重复遍历子树，不采用
   * - 显式后序栈加高度表
     - ``O(n)``
     - ``O(n)``
     - 避免调用栈，状态更复杂

这里 ``n`` 是节点数，``h`` 是树高。平衡树中 ``h = O(log n)``，但输入可能不平衡，因此最坏调用栈仍是
``O(n)``。

主解法：后序返回高度或失败
--------------------------

状态定义
~~~~~~~~

辅助函数 ``height_or_fail(node)`` 返回：

* 空节点返回高度 ``0``；
* 平衡子树返回其真实高度，值至少为 ``1``；
* 失衡子树返回 ``-1``。

``-1`` 不属于合法树高范围，因此不会与真实高度混淆。它不是节点值哨兵，而是辅助函数返回域中的显式失败状态。

对非空节点：

#. 递归得到左子树结果；若为 ``-1``，立即返回 ``-1``；
#. 递归得到右子树结果；若为 ``-1``，立即返回 ``-1``；
#. 若两者高度差大于 1，返回 ``-1``；
#. 否则返回 ``1 + max(left_height, right_height)``。

核心不变量
~~~~~~~~~~

每个辅助调用结束时满足：

* 返回非负数时，该数就是当前子树的精确高度，并且当前子树中所有节点都平衡；
* 返回 ``-1`` 时，当前子树内至少存在一个失衡节点；
* 函数不修改树；
* 任意节点最多被进入一次。

正确性依据
~~~~~~~~~~

对子树高度做结构归纳。

**基础情况。** 空树高度为 0，且按定义平衡，因此返回 0 正确。

**归纳步骤。** 对非空节点，按归纳假设，左右调用要么返回各自精确高度，要么准确报告该子树失衡。任一子树失衡时，
当前整棵子树必然失衡，向上传播 ``-1`` 合法。若左右都平衡，则当前子树平衡当且仅当高度差不超过 1；算法
正好检查这一条件。条件成立时，当前高度为较大子树高度加 1。

**完整性。** 任意失衡节点都会在其左右真实高度返回后被检测，随后失败状态沿祖先链传播到根；不会漏掉内部失衡。

**终止性。** 每次递归下降到严格更小的子树，有限树最终到空节点。短路只减少访问，不影响结论。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 最坏访问每个节点一次，时间 ``O(n)``；
* 首个失衡子树完成后可短路，实际访问量可能更少；
* 调用栈 ``O(h)``，退化树最坏 ``O(n)``；
* 返回值只是布尔量，没有结果容器；
* 固定宽语言的节点上界保证高度可放入 ``int``；
* Rust 的不可变借用需要在递归前克隆孩子 ``Rc`` 引用，克隆只增加引用计数；
* Julia/R 的节点具有引用语义，但实现只读取字段。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>

   static int height_or_fail(const struct TreeNode *root) {
       if (root == NULL) {
           return 0;
       }

       const int left = height_or_fail(root->left);
       if (left < 0) {
           return -1;
       }

       const int right = height_or_fail(root->right);
       if (right < 0 || abs(left - right) > 1) {
           return -1;
       }

       return 1 + (left > right ? left : right);
   }

   bool isBalanced(struct TreeNode *root) {
       return height_or_fail(root) >= 0;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <cstdlib>

   class Solution {
       int heightOrFail(TreeNode* root) {
           if (root == nullptr) {
               return 0;
           }

           const int left = heightOrFail(root->left);
           if (left < 0) {
               return -1;
           }

           const int right = heightOrFail(root->right);
           if (right < 0 || std::abs(left - right) > 1) {
               return -1;
           }
           return 1 + std::max(left, right);
       }

   public:
       bool isBalanced(TreeNode* root) {
           return heightOrFail(root) >= 0;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isBalanced(self, root: Optional[TreeNode]) -> bool:
           def height_or_fail(node: Optional[TreeNode]) -> int:
               if node is None:
                   return 0

               left = height_or_fail(node.left)
               if left < 0:
                   return -1

               right = height_or_fail(node.right)
               if right < 0 or abs(left - right) > 1:
                   return -1
               return 1 + max(left, right)

           return height_or_fail(root) >= 0

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isBalanced(TreeNode root) {
           return heightOrFail(root) >= 0;
       }

       private int heightOrFail(TreeNode root) {
           if (root == null) {
               return 0;
           }

           int left = heightOrFail(root.left);
           if (left < 0) {
               return -1;
           }

           int right = heightOrFail(root.right);
           if (right < 0 || Math.abs(left - right) > 1) {
               return -1;
           }
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
           fn height_or_fail(
               root: Option<Rc<RefCell<TreeNode>>>,
           ) -> Result<i32, ()> {
               let Some(node) = root else {
                   return Ok(0);
               };

               let node_ref = node.borrow();
               let left_node = node_ref.left.clone();
               let right_node = node_ref.right.clone();
               drop(node_ref);

               let left = height_or_fail(left_node)?;
               let right = height_or_fail(right_node)?;
               if (left - right).abs() > 1 {
                   return Err(());
               }
               Ok(1 + left.max(right))
           }

           height_or_fail(root).is_ok()
       }
   }

Rust 用 ``Result<i32, ()>`` 显式区分高度与失败，不需要数值哨兵。借用节点字段后先复制孩子 ``Rc`` 并结束借用，
再进入递归。

Go
~~

.. code-block:: go

   func isBalanced(root *TreeNode) bool {
       var heightOrFail func(*TreeNode) int
       heightOrFail = func(node *TreeNode) int {
           if node == nil {
               return 0
           }

           left := heightOrFail(node.Left)
           if left < 0 {
               return -1
           }

           right := heightOrFail(node.Right)
           if right < 0 || absInt(left-right) > 1 {
               return -1
           }
           if left > right {
               return left + 1
           }
           return right + 1
       }

       return heightOrFail(root) >= 0
   }

   func absInt(value int) int {
       if value < 0 {
           return -value
       }
       return value
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isBalanced(root: TreeNode | null): boolean {
       const heightOrFail = (node: TreeNode | null): number => {
           if (node === null) {
               return 0;
           }

           const left = heightOrFail(node.left);
           if (left < 0) {
               return -1;
           }

           const right = heightOrFail(node.right);
           if (right < 0 || Math.abs(left - right) > 1) {
               return -1;
           }
           return 1 + Math.max(left, right);
       };

       return heightOrFail(root) >= 0;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsBalanced(TreeNode root) {
           return HeightOrFail(root) >= 0;
       }

       private int HeightOrFail(TreeNode root) {
           if (root == null) {
               return 0;
           }

           int left = HeightOrFail(root.left);
           if (left < 0) {
               return -1;
           }

           int right = HeightOrFail(root.right);
           if (right < 0 || System.Math.Abs(left - right) > 1) {
               return -1;
           }
           return 1 + System.Math.Max(left, right);
       }
   }

Julia
~~~~~

.. code-block:: julia

   function is_balanced(root::Union{TreeNode, Nothing})::Bool
       function height_or_fail(node)
           node === nothing && return 0

           left = height_or_fail(node.left)
           left < 0 && return -1

           right = height_or_fail(node.right)
           (right < 0 || abs(left - right) > 1) && return -1
           return 1 + max(left, right)
       end

       return height_or_fail(root) >= 0
   end

R
~

.. code-block:: r

   is_balanced <- function(root) {
     height_or_fail <- function(node) {
       if (is.null(node)) {
         return(0L)
       }

       left <- height_or_fail(node$left)
       if (left < 0L) {
         return(-1L)
       }

       right <- height_or_fail(node$right)
       if (right < 0L || abs(left - right) > 1L) {
         return(-1L)
       }
       1L + max(left, right)
     }

     height_or_fail(root) >= 0L
   }

验证计划与证据
--------------

* 固定用例覆盖空树、单节点、完全平衡树、根平衡但内部失衡、左链和右链；
* 随机生成小树，与“对每个节点独立计算左右高度”的简单基准对拍；
* 对平衡结果同时核对辅助函数返回的高度等于独立高度；
* 调用前后序列化树，确认输入未修改；
* C/C++ 使用严格警告、ASan 和 UBSan；有运行时的语言执行固定与随机测试；
* Rust、C#、Julia、R 缺少运行时时记录接口、借用、空值和递归静态检查。

关键边界
--------

* 平衡条件必须对所有节点成立；
* 空树高度为 0，并且是平衡树；
* ``-1`` 只表示失败，合法高度永远非负；
* 输入可能已经不平衡，不能据此把递归栈写成 ``O(log n)``；
* 失败短路后未访问的另一侧子树不影响结论，因为当前子树已经确定失衡。

易错点
------

* 只比较根的左右高度；
* 每个节点重复调用独立 ``height``，造成 ``O(n^2)``；
* 发现左子树失衡后仍继续遍历整棵右子树，却声称有短路；
* 把空树高度定义混为边数和节点数，导致差值判断偏一；
* Rust 在持有 ``RefCell`` 借用时递归进入孩子，造成借用范围过长。

本题新增知识
------------

* 后序遍历把“高度”和“是否平衡”合并为单次子树摘要；
* 失败状态沿祖先链传播并安全短路；
* 全树性质不能只检查根节点。

本题强化知识
------------

* `0104. Maximum Depth of Binary Tree <0104-maximum-depth-of-binary-tree.rst>`_ 的高度递推；
* 树递归调用栈按实际输入高度计费；
* 不可变树遍历与 Rust ``Rc<RefCell<_>>`` 借用边界。

关联题目
--------

* `最大深度题 0104 <0104-maximum-depth-of-binary-tree.rst>`_：只返回高度；
* `0111. Minimum Depth of Binary Tree <0111-minimum-depth-of-binary-tree.rst>`_：树高定义中的叶节点边界。

最小自检
--------

#. 为什么辅助函数需要同时表达高度和失败？
#. 根节点高度差不超过 1，能否推出整棵树平衡？
#. 退化树中主解法和重复高度方案分别是什么复杂度？
#. Rust 为什么先克隆孩子引用再结束当前借用？

答案要点
~~~~~~~~

后序遍历先得到左右子树的平衡状态和真实高度。任一子树失衡或当前高度差超过 1 时返回失败，否则返回
``1 + max(left, right)``。每个节点最多访问一次，时间 ``O(n)``，调用栈 ``O(h)``。
