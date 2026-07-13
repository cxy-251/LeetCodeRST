0104. Maximum Depth of Binary Tree
==================================

题目信息
--------

:题号: 0104
:难度: Easy
:主题: 二叉树、递归、树高、后序汇总
:原题: `LeetCode 0104 <https://leetcode.com/problems/maximum-depth-of-binary-tree/>`_
:访问状态: Available
:教学重点: 空树深度基例、左右子树结果汇总、树高归纳、递归栈边界

题目重述
--------

给定一棵二叉树，返回从根节点到最远叶节点的最长路径所包含的节点数。空树深度为 0，只有根节点的树深度为 1。

输入是合法无环二叉树，每个非根节点只有一个父节点。函数只读节点，不改变值或父子链接。深度按“节点数”
计算，不按边数计算；因此非空树的答案至少为 1。

自建示例
--------

左右高度不同
~~~~~~~~~~~~

.. code-block:: text

          3
        /   \
       9    20
           /  \
          15   7
         /
        4

   输出：4

最长根到叶路径是 ``3 -> 20 -> 15 -> 4``，包含 4 个节点。

单节点与空树
~~~~~~~~~~~~

.. code-block:: text

   输入：root = [8]
   输出：1

   输入：root = null
   输出：0

退化树
~~~~~~

.. code-block:: text

   1
    \
     2
      \
       3

   输出：3

退化树用于提醒：递归调用栈深度可以达到节点数，不应把所有二叉树递归空间都写成 ``O(log n)``。

问题抽象
--------

对任意非空节点 ``node``，经过根到最远叶节点的路径一定先经过 ``node``，然后选择左子树或右子树中更深的一侧。
因此子问题可以定义为“以当前节点为根的子树最大深度”：

.. code-block:: text

   depth(null) = 0
   depth(node) = 1 + max(depth(node.left), depth(node.right))

这个递推是后序汇总：必须先得到两个孩子的深度，才能计算当前节点结果。当前题与 `0100`、`0101` 一样使用
树高归纳，但返回值从布尔判断变为整数汇总。

基础类型约定
------------

沿用 `0094` 的跨语言 ``TreeNode`` 引用模型。算法不需要父指针、访问集合或额外节点字段，因为题目保证树无环、
节点不共享。

Rust 需要在递归前从 ``RefCell`` 借用中克隆左右孩子的 ``Rc`` 句柄并结束借用；Julia 与 R 直接读取引用节点。
所有语言都不修改输入。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 后序递归计算树高
     - ``O(n)``
     - ``O(h)``
     - 主解法；递推定义最直接
   * - BFS 按层计数
     - ``O(n)``
     - ``O(w)``
     - 每完成一层深度加一，可复用 `0102` 队列
   * - DFS 显式栈保存 ``(node, depth)``
     - ``O(n)``
     - ``O(h)``
     - 避免调用栈，需要显式携带深度

``n`` 是节点数，``h`` 是树高，``w`` 是最大层宽。递归版在宽而浅的树上空间小，BFS 在深而窄的树上也可能
保持较小队列；两者最坏都可达到 ``O(n)``。

主解法：后序递归计算树高
------------------------

思路
~~~~

空节点不贡献路径节点，深度为 0。非空节点的最长路径必须从当前节点进入左右某一棵子树，因此先递归计算
``left_depth`` 与 ``right_depth``，取较大值后加上当前节点这一层。

不能把两个深度相加。``left_depth + right_depth + 1`` 表示经过当前节点连接左右两侧的路径节点数，属于“树的
直径”类问题；最大深度只能选择一条向下路径。

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

递归函数 ``depth(node)`` 的返回契约是：返回从 ``node`` 到其子树内最远叶节点的最长向下路径节点数；若
``node`` 为空则返回 0。

每次非空调用保持：

* ``left_depth`` 只描述左子树的最大深度；
* ``right_depth`` 只描述右子树的最大深度；
* 两个递归调用完成后，当前节点尚未计入任何一侧结果；
* ``1 + max(left_depth, right_depth)`` 选择一条合法向下路径并计入当前节点；
* 函数不依赖全局最大值或可变对象字段，重复调用互不影响。

对示例根节点 ``3``：

.. code-block:: text

   depth(9)  = 1
   depth(4)  = 1
   depth(15) = 1 + max(1, 0) = 2
   depth(20) = 1 + max(2, 1) = 3
   depth(3)  = 1 + max(1, 3) = 4

正确性依据
~~~~~~~~~~

对当前子树高度做结构归纳。

**基础情况。** 空树没有节点，也不存在根到叶路径，定义深度为 0。叶节点的两个孩子都为空，算法返回
``1 + max(0, 0) = 1``，与单节点路径一致。

**归纳步骤。** 假设递归能正确返回左右子树最大深度。任意从当前节点到叶节点的路径，离开当前节点后必须进入
左孩子或右孩子，不能同时进入两侧。进入左侧的最长后缀长度为 ``left_depth``，进入右侧的最长后缀长度为
``right_depth``。选择较大者并加上当前节点，得到当前子树的最长合法向下路径。不存在第三种路径方向，因此结果
完整且最优。

**终止性。** 每次递归下降到孩子，子树高度严格减小，最终到达空节点。

所以 ``depth(root)`` 等于整棵树最大深度。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 每个节点恰好进入一次递归调用，时间复杂度 ``O(n)``；
* 调用栈同时保存一条根到当前节点的路径，空间 ``O(h)``；
* 平衡树 ``h = O(log n)``，退化树 ``h = O(n)``；
* 返回值为单个整数，没有输出容器；
* Python、Java、Rust、Go、TypeScript、C#、Julia 和 R 的宿主调用栈都可能在极深树上受限；
* Rust 的孩子 ``Rc`` 克隆是 ``O(1)`` 句柄操作；
* R 使用双精度数值返回可安全表示平台树深度，若要求严格整数接口可在平台上转为整数，但极端通用输入需考虑
  R 整数上限；
* 输入节点和值均保持不变。

核心语言实现
------------

C
~

.. code-block:: c

   int maxDepth(struct TreeNode *root) {
       if (root == NULL) {
           return 0;
       }

       const int left_depth = maxDepth(root->left);
       const int right_depth = maxDepth(root->right);
       const int deeper = left_depth > right_depth
           ? left_depth
           : right_depth;
       return 1 + deeper;
   }

没有动态分配或所有权转移。平台节点上界保证深度及 ``1 + deeper`` 可放入 ``int``。

C++
~~~

.. code-block:: cpp

   #include <algorithm>

   class Solution {
   public:
       int maxDepth(TreeNode* root) {
           if (root == nullptr) {
               return 0;
           }

           return 1 + std::max(
               maxDepth(root->left),
               maxDepth(root->right)
           );
       }
   };

``std::max`` 的两个参数都必须求值，所以左右子树都会访问。函数不保存对象字段，重复调用没有状态污染。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxDepth(self, root: Optional[TreeNode]) -> int:
           if root is None:
               return 0

           left_depth = self.maxDepth(root.left)
           right_depth = self.maxDepth(root.right)
           return 1 + max(left_depth, right_depth)

显式保存两个子结果便于调试递推含义。Python 整数不会溢出，但递归深度仍受解释器栈限制。

Java
~~~~

.. code-block:: java

   class Solution {
       public int maxDepth(TreeNode root) {
           if (root == null) {
               return 0;
           }

           int leftDepth = maxDepth(root.left);
           int rightDepth = maxDepth(root.right);
           return 1 + Math.max(leftDepth, rightDepth);
       }
   }

方法只使用局部变量，不需要在公共入口清空对象字段。节点引用由运行时管理。

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn max_depth(
           root: Option<Rc<RefCell<TreeNode>>>,
       ) -> i32 {
           let Some(node) = root else {
               return 0;
           };

           let node_ref = node.borrow();
           let left = node_ref.left.clone();
           let right = node_ref.right.clone();
           drop(node_ref);

           1 + Self::max_depth(left).max(Self::max_depth(right))
       }
   }

递归前结束 ``RefCell`` 借用。``Rc`` 克隆不复制节点，返回 ``i32`` 与平台接口一致。

Go
~~

.. code-block:: go

   func maxDepth(root *TreeNode) int {
       if root == nil {
           return 0
       }

       leftDepth := maxDepth(root.Left)
       rightDepth := maxDepth(root.Right)
       if leftDepth > rightDepth {
           return 1 + leftDepth
       }
       return 1 + rightDepth
   }

节点指针只读。Go 的 ``int`` 宽度在平台环境足以容纳节点数量和深度。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxDepth(root: TreeNode | null): number {
       if (root === null) {
           return 0;
       }

       const leftDepth = maxDepth(root.left);
       const rightDepth = maxDepth(root.right);
       return 1 + Math.max(leftDepth, rightDepth);
   }

深度远低于 JavaScript ``number`` 安全整数上限。实现不使用 32 位位运算。

C#
~~

.. code-block:: csharp

   using System;

   public class Solution {
       public int MaxDepth(TreeNode root) {
           if (root == null) {
               return 0;
           }

           int leftDepth = MaxDepth(root.left);
           int rightDepth = MaxDepth(root.right);
           return 1 + Math.Max(leftDepth, rightDepth);
       }
   }

局部递归结果与平台 ``int`` 返回类型一致，函数没有可变实例状态。

Julia
~~~~~

.. code-block:: julia

   function max_depth(
       root::Union{TreeNode, Nothing},
   )::Int
       root === nothing && return 0

       left_depth = max_depth(root.left)
       right_depth = max_depth(root.right)
       return 1 + max(left_depth, right_depth)
   end

本题没有数组坐标，Julia 一基索引规则不参与。``Int`` 使用宿主字宽，平台树深度远小于上限。

R
~

.. code-block:: r

   max_depth <- function(root) {
     if (is.null(root)) {
       return(0)
     }

     left_depth <- max_depth(root$left)
     right_depth <- max_depth(root$right)
     1 + max(left_depth, right_depth)
   }

节点是 ``environment`` 引用。每个调用通过显式返回值传递子问题结果，不依赖父调用帧中的局部赋值共享。

对照解法：BFS 完成一层后深度加一
---------------------------------

复用 `0102` 的队列。每轮保存当前层大小并处理完整一层，然后令 ``depth += 1``。队列为空时，完成的层数就是
最大深度。

BFS 同样为 ``O(n)`` 时间，队列工作空间 ``O(w)``。它避免递归栈，适合宿主递归深度很小而树可能很深的环境；
递归版不需要存储整层，状态更短，也直接对应数学递推。

验证计划与证据
--------------

* Python 通过语法解析，并对 3,000 棵随机树与独立层序结果行数基准对拍；输入树保持不变；
* C、C++ 通过严格警告编译，固定用例覆盖空树、单节点和左右高度不同，并在 ASan、UBSan 下运行；
* Java、Go、TypeScript 通过编译或严格类型检查，并运行相同边界与普通用例；
* Rust、C#、Julia、R 完成递归签名、空树基例、左右汇总、括号和引用语义静态检查；
* 当前环境缺少 Rust、C#、Julia、R 运行时，因此不声称这四种语言已经运行通过。

关键边界
--------

* 空树深度为 0；
* 单节点深度为 1，说明题目按节点数而不是边数计；
* 只有一侧子树时必须选择非空侧，不能要求左右同时存在；
* 退化树递归空间为 ``O(n)``，可能超过语言默认栈；
* 节点值与深度无关，不能用值大小判断更深方向；
* 有环或共享节点的图结构不在输入契约内，否则递归可能重复访问或不终止。

易错点
------

* 把空树深度定义为 1，导致所有结果多一层；
* 返回 ``max(left, right)`` 而忘记当前节点的 ``+1``；
* 返回 ``left + right + 1``，实际计算了经过根的路径长度；
* 把平衡树的 ``O(log n)`` 栈深度错误外推到所有输入；
* 使用全局最大深度字段却未在重复调用前清空；
* Rust 让 ``RefCell`` 借用跨越递归调用，增加动态借用风险。

本题新增知识
------------

* 二叉树最大深度的后序递推；
* 从两个子问题中选择一条向下路径；
* 数值返回型树递归的结构归纳证明。

本题强化知识
------------

* `0100`、`0101` 使用的空节点基例与树高终止度量；
* `0102` 中层数与最大深度的等价关系；
* 树递归调用栈按实际高度 ``h`` 计费；
* 跨语言 ``TreeNode`` 引用模型和只读接口。

关联题目
--------

* `0102. Binary Tree Level Order Traversal
  <0102-binary-tree-level-order-traversal.rst>`_：BFS 行数等于最大深度；
* `0101. Symmetric Tree <0101-symmetric-tree.rst>`_：同一结构归纳框架返回布尔关系；
* `0100. Same Tree <../0001-0100/0100-same-tree.rst>`_：成对递归与单树数值递归的对照。

最小自检
--------

#. 为什么空节点深度定义为 0 后，叶节点会自然得到 1？
#. 为什么当前节点只能选择左右一侧，而不能把两个深度相加？
#. 正确性证明的归纳假设是什么？
#. 平衡树和退化树的递归空间分别是多少？
#. BFS 版本为什么可以用完成层数作为答案？

答案要点
~~~~~~~~

空节点不贡献路径节点，所以深度为 0；叶节点因此得到 ``1 + max(0, 0) = 1``。根到叶路径离开当前节点后
只能进入一个孩子，最长路径应选择较深子树并加当前节点。归纳假设是左右更矮子树的深度均计算正确。调用栈按
树高计，平衡树约 ``O(log n)``，退化树 ``O(n)``。BFS 每轮恰好完成一个深度层，队列清空时完成层数就是树高。
