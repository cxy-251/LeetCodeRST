0124. Binary Tree Maximum Path Sum
==================================

题目信息
--------

:题号: 0124
:难度: Hard
:主题: 二叉树、后序遍历、树形动态规划、路径端点
:原题: `LeetCode 0124
   <https://leetcode.com/problems/binary-tree-maximum-path-sum/>`_
:访问状态: Available
:教学重点: 向父节点返回单分支收益、节点处合并双分支路径、全负数初始化

题目重述
--------

给定一棵非空二叉树，每个节点保存一个整数。路径是由若干节点组成的连续序列，
相邻节点之间必须存在父子边；同一节点在一条路径中最多出现一次。路径可以从任意节点开始，
在任意节点结束，不要求经过根节点。返回所有非空路径中的最大节点值总和。

题目保证：

* 节点数量在 1 到 30000 之间；
* 节点值在 ``[-1000, 1000]``；
* 路径至少包含一个节点；
* 输入树结构与节点值只读，算法不改写左右孩子。

自建示例
--------

最佳路径穿过某个节点
~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

       -10
       /  \
      9   20
         /  \
        15   7

   最佳路径：15 -> 20 -> 7
   输出：42

最佳路径不经过根
~~~~~~~~~~~~~~~~

上例的最佳路径完全位于根节点 ``-10`` 的右子树，说明答案不能只计算从根向下的路径。

全为负数
~~~~~~~~

.. code-block:: text

       -3
       / \
     -5  -2

   输出：-2

路径必须非空，不能把“不选节点”的 ``0`` 当成最终答案。

单节点
~~~~~~

只有节点 ``[-8]`` 时，唯一合法路径就是该节点，返回 ``-8``。

问题抽象
--------

一条简单路径在树中存在唯一的最高节点。以这个最高节点为中心，路径最多包含：

* 从左孩子方向上来的一条向下链；
* 当前节点；
* 从右孩子方向上来的一条向下链。

两个子树贡献可以同时用于“在当前节点结束的完整候选路径”，但当前节点向父节点返回时，
只能选择其中一侧。若同时把左右分支返回给父节点，父节点继续连接后会在当前节点产生分叉，
不再是一条简单路径。

因此递归需要区分两个不同量：

``gain(node)``
   从 ``node`` 出发向下，只选择一条孩子分支时能够得到的最大路径和；这个值可以继续交给父节点。

``best``
   已处理节点中任意起点、任意终点的最大完整路径和；它可以在某个节点同时使用左右两侧，
   但不会继续向上返回。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 后序遍历 + 单分支收益
     - ``O(n)``
     - ``O(h)``
     - 主解法；每个节点同时完成返回状态与全局候选
   * - 枚举路径最高节点后重复求子树收益
     - 最坏 ``O(n^2)``
     - ``O(h)``
     - 重复扫描相同子树
   * - 把树转成无向图并枚举所有端点
     - 最坏 ``O(n^2)``
     - ``O(n)``
     - 只适合小树基准验证

这里 ``n`` 是节点数，``h`` 是树高。

主解法：后序树形动态规划
------------------------

为什么必须后序
~~~~~~~~~~~~~~

当前节点的决策依赖左右孩子的最佳向下收益。只有先完成两个子树，才能判断：

* 负贡献是否应该截断；
* 当前节点向父节点返回哪一侧；
* 当前节点能否作为完整路径的最高节点连接左右两侧。

因此递归顺序是左子树、右子树、当前节点。

状态与转移
~~~~~~~~~~

空孩子无法贡献节点，定义其返回收益为 ``0``。对非空节点：

.. code-block:: text

   left_gain = max(0, gain(node.left))
   right_gain = max(0, gain(node.right))

   through_node = node.val + left_gain + right_gain
   best = max(best, through_node)

   gain(node) = node.val + max(left_gain, right_gain)

对子树收益与 ``0`` 取较大值，表示负分支会降低路径总和，应在当前节点截断。
这个 ``0`` 只代表“当前完整路径不使用该孩子”，没有把空路径发布为答案。

返回状态为什么只能选一侧
~~~~~~~~~~~~~~~~~~~~~~~~

父节点通过一条父子边连接当前节点。若当前节点返回左右两侧之和，返回对象会包含两个向下端点；
父节点再加入后，当前节点的度数将变成 3，得到分叉结构。

返回 ``node.val + max(left_gain, right_gain)`` 后，子路径始终是一条以当前节点为上端点的链，
父节点可以安全把它接到更高位置。

完整候选为什么可以用两侧
~~~~~~~~~~~~~~~~~~~~~~~~

若最终路径的最高节点是当前节点，路径进入当前节点后最多向左、向右各延伸一次，
两侧不会在别处相交。``through_node`` 恰好覆盖：

* 只取当前节点；
* 当前节点加左链；
* 当前节点加右链；
* 左链、当前节点、右链。

因此它覆盖所有以当前节点为最高节点的合法路径。

全负数边界
~~~~~~~~~~

``left_gain`` 和 ``right_gain`` 可以截断为 0，但 ``best`` 必须初始化为负无穷或根节点值。
若把 ``best`` 初始化为 0，全负树会错误返回空路径的 0。

本文各语言使用对应的最小宽整数或负无穷初始化，并保证每个非空节点都会更新一次 ``best``。

核心不变量
~~~~~~~~~~

完成 ``gain(node)`` 后保持：

* 返回值等于所有“从 ``node`` 开始并只向下走一条分支”的非空路径最大和；
* ``best`` 等于当前整个已处理子树中所有非空简单路径的最大和；
* 负子树收益不会被强制接入更高路径；
* 返回状态没有分叉，完整候选可以在当前节点合并两侧；
* 输入节点值与左右指针未修改。

正确性依据
~~~~~~~~~~

对树结构进行归纳。

**空树辅助情况。** 空孩子返回 0，只表示父节点不选择该方向，不形成独立答案。

**归纳假设。** 假设左右子树返回了各自根节点开始的最大单分支收益，
并且 ``best`` 已覆盖两个子树内部的所有合法路径。

**返回状态正确。** 任意从当前节点开始向下的简单路径，离开当前节点后只能进入一个孩子，
否则会分叉。若选择左侧，最佳后缀由左子树归纳假设给出；右侧同理。
负后缀不如在当前节点结束，因此取 ``max(0, child_gain)``。转移得到所有合法单分支路径中的最大值。

**完整候选正确。** 任意以当前节点为最高节点的路径，在左右子树中各至多使用一条向下链。
归纳假设给出两侧最佳链，负链可以省略，所以 ``through_node`` 是这一组路径的最大值。

**完整性。** 任意非空路径要么完全位于左子树，要么完全位于右子树，
要么最高节点就是当前节点。前两类由归纳假设覆盖，后一类由 ``through_node`` 覆盖。

**最优性。** ``best`` 只由真实合法路径候选更新，不会超过真实最优值；所有合法路径又都被上述分类覆盖，
所以最终 ``best`` 与真实最优值相等。

**终止性。** 每次递归进入严格更小的子树，最终到达空孩子。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 每个节点访问一次，时间复杂度 ``O(n)``；
* 递归栈深度为树高，核心额外空间 ``O(h)``；最坏退化树为 ``O(n)``；
* 只返回一个整数，返回载荷 ``O(1)``；
* C、C++、Java、Rust、C# 使用较宽中间和，避免中间加法依赖平台 ``int``；
* 题目上界下最终答案绝对值不超过 ``30000000``，可安全转换为平台整数；
* Rust 克隆的是 ``Rc`` 共享引用，不复制整棵子树；
* R 使用显式审计的 ``<<-`` 更新闭包环境中的全局最佳值，递归节点仍通过参数传递。

核心语言实现
------------

C
~

.. code-block:: c

   #include <limits.h>

   struct TreeNode {
       int val;
       struct TreeNode *left;
       struct TreeNode *right;
   };

   static long long max_gain(
       struct TreeNode *node,
       long long *best
   ) {
       if (node == NULL) {
           return 0;
       }

       long long left = max_gain(node->left, best);
       long long right = max_gain(node->right, best);
       if (left < 0) {
           left = 0;
       }
       if (right < 0) {
           right = 0;
       }

       const long long through = (long long)node->val + left + right;
       if (through > *best) {
           *best = through;
       }

       return (long long)node->val + (left > right ? left : right);
   }

   int maxPathSum(struct TreeNode *root) {
       long long best = LLONG_MIN;
       (void)max_gain(root, &best);
       return (int)best;
   }

C 用指针参数发布全局最佳值；空孩子只返回 0，非空节点至少更新一次 ``best``。

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <limits>

   class Solution {
   private:
       long long best_ = std::numeric_limits<long long>::lowest();

       long long gain(TreeNode* node) {
           if (node == nullptr) {
               return 0;
           }

           const long long left = std::max(0LL, gain(node->left));
           const long long right = std::max(0LL, gain(node->right));
           best_ = std::max(best_, (long long)node->val + left + right);
           return (long long)node->val + std::max(left, right);
       }

   public:
       int maxPathSum(TreeNode* root) {
           gain(root);
           return static_cast<int>(best_);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxPathSum(self, root: TreeNode | None) -> int:
           best = float("-inf")

           def gain(node: TreeNode | None) -> int:
               nonlocal best
               if node is None:
                   return 0

               left = max(0, gain(node.left))
               right = max(0, gain(node.right))
               best = max(best, node.val + left + right)
               return node.val + max(left, right)

           gain(root)
           return int(best)

Java
~~~~

.. code-block:: java

   class Solution {
       private long best = Long.MIN_VALUE;

       private long gain(TreeNode node) {
           if (node == null) {
               return 0L;
           }

           long left = Math.max(0L, gain(node.left));
           long right = Math.max(0L, gain(node.right));
           best = Math.max(best, (long)node.val + left + right);
           return (long)node.val + Math.max(left, right);
       }

       public int maxPathSum(TreeNode root) {
           gain(root);
           return (int)best;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn max_path_sum(
           root: Option<Rc<RefCell<TreeNode>>>
       ) -> i32 {
           fn gain(
               node: Option<Rc<RefCell<TreeNode>>>,
               best: &mut i64,
           ) -> i64 {
               let Some(node_ref) = node else {
                   return 0;
               };

               let node = node_ref.borrow();
               let value = i64::from(node.val);
               let left_node = node.left.clone();
               let right_node = node.right.clone();
               drop(node);

               let left = gain(left_node, best).max(0);
               let right = gain(right_node, best).max(0);
               *best = (*best).max(value + left + right);
               value + left.max(right)
           }

           let mut best = i64::MIN;
           gain(root, &mut best);
           best as i32
       }
   }

先复制左右 ``Rc`` 再释放借用，递归时不会持有父节点的 ``RefCell`` 借用。

Go
~~

.. code-block:: go

   func maxPathSum(root *TreeNode) int {
       best := -int(^uint(0)>>1) - 1

       var gain func(*TreeNode) int
       gain = func(node *TreeNode) int {
           if node == nil {
               return 0
           }

           left := gain(node.Left)
           right := gain(node.Right)
           if left < 0 {
               left = 0
           }
           if right < 0 {
               right = 0
           }

           through := node.Val + left + right
           if through > best {
               best = through
           }
           if right > left {
               left = right
           }
           return node.Val + left
       }

       gain(root)
       return best
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxPathSum(root: TreeNode | null): number {
       let best = Number.NEGATIVE_INFINITY;

       const gain = (node: TreeNode | null): number => {
           if (node === null) {
               return 0;
           }

           const left = Math.max(0, gain(node.left));
           const right = Math.max(0, gain(node.right));
           best = Math.max(best, node.val + left + right);
           return node.val + Math.max(left, right);
       };

       gain(root);
       return best;
   }

C#
~~

.. code-block:: csharp

   using System;

   public class Solution {
       private long best = long.MinValue;

       private long Gain(TreeNode node) {
           if (node == null) {
               return 0L;
           }

           long left = Math.Max(0L, Gain(node.left));
           long right = Math.Max(0L, Gain(node.right));
           best = Math.Max(best, (long)node.val + left + right);
           return (long)node.val + Math.Max(left, right);
       }

       public int MaxPathSum(TreeNode root) {
           Gain(root);
           return (int)best;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function max_path_sum(root::Union{TreeNode, Nothing})::Int
       best = Ref(typemin(Int))

       function gain(node::Union{TreeNode, Nothing})::Int
           node === nothing && return 0

           left = max(0, gain(node.left))
           right = max(0, gain(node.right))
           best[] = max(best[], node.val + left + right)
           return node.val + max(left, right)
       end

       gain(root)
       return best[]
   end

``Ref`` 提供显式可变标量容器，递归闭包更新 ``best[]``，不修改树节点。

R
~

.. code-block:: r

   max_path_sum <- function(root) {
     best <- -Inf

     gain <- function(node) {
       if (is.null(node)) {
         return(0)
       }

       left <- max(0, gain(node$left))
       right <- max(0, gain(node$right))
       through <- node$val + left + right
       best <<- max(best, through)
       node$val + max(left, right)
     }

     gain(root)
     as.integer(best)
   }

R 的 ``<<-`` 明确写入词法外层的 ``best``；左右子树状态仍由返回值传递，不依赖调用者局部变量共享。

验证计划与证据
--------------

* 固定用例覆盖单节点、全负树、退化链、最佳路径只用一侧、最佳路径穿过内部节点和最佳路径不经过根；
* 独立基准把树转换为无向图，从每个起点 DFS 所有简单路径并取最大和；
* 随机生成小树，对比后序 DP 与图路径基准，并在调用前后序列化树确认输入未修改；
* Python 执行 3000 组随机树对拍；
* C/C++、Java、Go、TypeScript 执行固定与 500 组随机树对拍，C/C++ 使用严格警告和 sanitizers；
* Rust、C#、Julia、R 缺少运行时时，检查节点引用、空值、数值宽度、递归闭包和全负数初始化。

关键边界
--------

* 路径必须非空，``best`` 不能初始化为 0；
* 子树返回值可以为负，但接入父节点前应与 0 取较大值；
* 向父节点只能返回一侧，左右两侧只能在当前完整候选中同时使用；
* 退化树递归深度达到 ``n``，运行环境需要允许对应调用栈；
* 输入根非空，但辅助函数仍需要处理空孩子。

易错点
------

* 把答案写成根节点开始的最大向下路径；
* 返回 ``node.val + left + right`` 给父节点，制造分叉；
* 对全负树返回 0；
* 只更新返回收益，没有维护子树内部已经闭合的完整路径；
* 把负孩子收益强制加入当前路径；
* 声称空间 ``O(1)``，忽略递归栈 ``O(h)``。

本题新增知识
------------

* 树形 DP 同时维护“可向父节点延伸的状态”和“在当前节点闭合的答案”；
* 每条树路径存在唯一最高节点，可据此完成不重不漏的分类证明；
* 返回状态必须保持链形，完整候选才允许连接左右两支；
* 全负数输入要求答案状态代表非空对象。

本题强化知识
------------

* 后序遍历保证父节点在两个孩子状态完成后决策；
* 负贡献截断与最终答案初始化是两个不同边界；
* 复杂度需要计入递归栈和语言引用适配；
* 输入只读可以通过调用前后结构序列化验证。

关联题目
--------

* `0104. Maximum Depth of Binary Tree <0104-maximum-depth-of-binary-tree.rst>`_：后序返回单个子树摘要；
* `0112. Path Sum <0112-path-sum.rst>`_：根到叶路径约束与本题任意端点路径不同；
* `0113. Path Sum II <0113-path-sum-ii.rst>`_：显式保存路径载荷，本题只保留被支配后的最优收益；

最小自检
--------

#. 为什么当前节点可以在完整候选中同时使用左右收益，却不能把两侧都返回给父节点？
#. 为什么孩子收益可以与 0 取较大值，而全局答案不能从 0 开始？
#. 任意合法路径如何被唯一归类到某个节点的 ``through_node`` 候选？

答案要点
--------

#. 返回值必须是一条可继续连接的链；双分支只在当前节点闭合，继续向上会分叉。
#. 0 表示不使用某个负孩子；最终路径必须非空，所以全局答案必须由真实节点更新。
#. 取路径中最靠近根的节点作为唯一最高节点，路径左右部分分别落入其两个子树。
