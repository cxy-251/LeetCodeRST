0101. Symmetric Tree
====================

题目信息
--------

:题号: 0101
:难度: Easy
:主题: 二叉树、递归、结构比较
:原题: `LeetCode 0101 <https://leetcode.com/problems/symmetric-tree/>`_
:访问状态: Available
:教学重点: 镜像位置成对递归、交叉方向、结构归纳、短路终止

题目重述
--------

给定一棵二叉树，判断它是否关于根节点所在的竖直轴镜像对称。对称不只要求左右两边出现相同的值，
还要求每个节点的左孩子位置与另一侧对应节点的右孩子位置匹配，右孩子位置与另一侧的左孩子位置匹配。

平台树满足普通二叉树约束：每个非根节点只有一个父节点，不存在环，也不存在被两个父节点共享的子树。
输入树只读；算法不能交换节点、修改 ``val`` 或临时改变父子链接。官方输入非空，本题实现额外支持空树，
并把空树视为对称。

自建示例
--------

完整镜像
~~~~~~~~

.. code-block:: text

          1
        /   \
       2     2
      / \   / \
     3   4 4   3

   输出：true

根的左右子树中，``3`` 与 ``3``、``4`` 与 ``4`` 分别位于镜像位置。

值相同但方向错误
~~~~~~~~~~~~~~~~

.. code-block:: text

          1
        /   \
       2     2
        \     \
         3     3

   输出：false

两侧都有值为 ``3`` 的节点，但左侧 ``3`` 是右孩子，镜像位置应当是右子树根的左孩子，而那里为空。
这组输入能够区分“按层只比较值”与真正的结构镜像比较。

只有一侧为空
~~~~~~~~~~~~

.. code-block:: text

          1
        /   \
       2     null

   输出：false

问题抽象
--------

`0100. Same Tree <../0001-0100/0100-same-tree.rst>`_ 比较的是两个位置是否同向相同：

.. code-block:: text

   same(a, b):
       a.left  对 b.left
       a.right 对 b.right

本题比较的是两个位置是否互为镜像：

.. code-block:: text

   mirror(a, b):
       a.left  对 b.right
       a.right 对 b.left

因此根节点本身不需要与另一个根比较，只需要判断 ``mirror(root.left, root.right)``。每次递归调用保存一对
应该位于同一镜像位置的节点引用；空节点不能省略，因为“一个为空、一个非空”正是结构不对称的直接见证。

基础类型约定
------------

平台提供 ``TreeNode``，包含整数 ``val``、左孩子 ``left`` 和右孩子 ``right``。本题沿用 `0094` 建立的
跨语言引用模型：C/C++ 使用节点指针，托管语言使用对象引用，Rust 使用
``Option<Rc<RefCell<TreeNode>>>``，Julia 使用可变节点引用，R 使用 ``environment`` 节点。

函数只读取节点。Rust 中 ``Rc::clone`` 只增加引用计数，不复制整棵子树；R 读取环境字段也不会复制子树。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 镜像节点对递归
     - ``O(n)``
     - ``O(h)``
     - 主解法；直接对应镜像结构定义
   * - 队列保存镜像节点对
     - ``O(n)``
     - ``O(w)``
     - 避免递归深度，显式保存空位置与节点对
   * - 分别遍历左右子树后比较序列
     - ``O(n)``
     - ``O(n)``
     - 必须使用相反遍历方向并保留空标记，表达更间接

这里 ``n`` 是节点数，``h`` 是树高，``w`` 是某一时刻队列中保存的镜像位置对数量。

主解法：镜像节点对递归
----------------------

思路
~~~~

把“整棵树是否对称”拆成“两个子树根是否互为镜像”。对任意节点对 ``(a, b)``：

* 两者都为空：该镜像位置匹配；
* 只有一个为空：结构已经不匹配；
* 两者都非空但值不同：当前镜像位置不匹配；
* 两者都非空且值相同：继续检查外侧孩子 ``(a.left, b.right)`` 和内侧孩子
  ``(a.right, b.left)``。

这两个递归分支缺一不可。只检查外侧会漏掉靠近中轴的差异；只检查内侧会漏掉远离中轴的差异。
逻辑与使用短路求值，任意一组镜像位置失败后，不再访问剩余子树。

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

递归状态 ``mirror(a, b)`` 的含义是：判断以 ``a`` 和 ``b`` 为根的两棵子树，在把其中一棵沿竖直轴翻转后
是否完全相同。

每次进入非空分支时保持以下不变量：

* ``a`` 与 ``b`` 位于整棵树的一对镜像位置；
* 当前层只需要比较 ``a.val`` 与 ``b.val``；
* ``a`` 的外侧左子树只能与 ``b`` 的外侧右子树匹配；
* ``a`` 的内侧右子树只能与 ``b`` 的内侧左子树匹配；
* 函数从不修改节点，因此其他递归分支看到的拓扑始终是原树。

以第一个示例为例，调用关系是：

.. code-block:: text

   mirror(左 2, 右 2)
       ├── mirror(左 3, 右 3)   # 外侧
       │     ├── mirror(null, null)
       │     └── mirror(null, null)
       └── mirror(左 4, 右 4)   # 内侧
             ├── mirror(null, null)
             └── mirror(null, null)

若把第二行误写成 ``mirror(a.left, b.left)``，算法就退化成同向比较，无法识别镜像关系。

正确性依据
~~~~~~~~~~

对 ``a``、``b`` 两棵子树的最大高度做结构归纳。

**基础情况。** 两棵子树都为空时，它们没有节点、值或方向差异，互为镜像。只有一棵为空时，一个根位置存在
节点而另一个不存在，结构不可能镜像。

**归纳步骤。** 假设算法能正确判断高度小于当前值的所有子树对。当前 ``a``、``b`` 都非空时，两棵子树
互为镜像，当且仅当：

#. 根值相等；
#. ``a.left`` 与 ``b.right`` 互为镜像；
#. ``a.right`` 与 ``b.left`` 互为镜像。

两个孩子子问题的高度都严格减小，递归结果按归纳假设正确。算法返回的三个条件逻辑与，正好等价于当前两棵
子树互为镜像。

**完整性。** 任意结构不对称最终都会下降到某一对“一个为空、一个非空”的镜像位置；任意值不对称会在对应
非空节点对比较时暴露。算法检查外侧与内侧全部镜像位置，不会遗漏。

**终止性。** 每次递归都下降到孩子，子树高度严格减小，最终到达空节点。

根节点本身位于对称轴上，所以整棵树对称当且仅当 ``root.left`` 与 ``root.right`` 互为镜像。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 最坏情况下树完全对称，需要访问全部 ``n`` 个节点，时间复杂度为 ``O(n)``；
* 首个差异出现后逻辑短路，实际访问节点可能少于 ``n``；
* 递归调用栈深度为 ``O(h)``，平衡树约为 ``O(log n)``，退化树最坏 ``O(n)``；
* 返回值是一个布尔量，没有结果容器；
* Rust 为了在递归前结束 ``RefCell`` 借用，会复制四个孩子的 ``Rc`` 句柄，单次为 ``O(1)``，不复制节点；
* Julia 与 R 直接递归读取引用节点，额外空间仍由调用栈决定；
* 输入树保持不变，调用者持有的所有节点引用在返回后仍然有效。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>

   static bool are_mirrors(
       const struct TreeNode *left,
       const struct TreeNode *right
   ) {
       if (left == NULL || right == NULL) {
           return left == right;
       }

       return left->val == right->val &&
           are_mirrors(left->left, right->right) &&
           are_mirrors(left->right, right->left);
   }

   bool isSymmetric(struct TreeNode *root) {
       return root == NULL || are_mirrors(root->left, root->right);
   }

``const`` 只约束本文件中的辅助函数不修改节点；平台公开签名仍保持 ``struct TreeNode *``。没有动态分配，
也没有资源失败路径。

C++
~~~

.. code-block:: cpp

   class Solution {
       bool areMirrors(const TreeNode* left, const TreeNode* right) {
           if (left == nullptr || right == nullptr) {
               return left == right;
           }

           return left->val == right->val &&
               areMirrors(left->left, right->right) &&
               areMirrors(left->right, right->left);
       }

   public:
       bool isSymmetric(TreeNode* root) {
           return root == nullptr ||
               areMirrors(root->left, root->right);
       }
   };

辅助函数接收 ``const TreeNode*``，明确当前实现只读树。指针本身不拥有节点，函数不会释放任何内存。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isSymmetric(self, root: Optional[TreeNode]) -> bool:
           def are_mirrors(
               left: Optional[TreeNode],
               right: Optional[TreeNode],
           ) -> bool:
               if left is None or right is None:
                   return left is right

               return (
                   left.val == right.val
                   and are_mirrors(left.left, right.right)
                   and are_mirrors(left.right, right.left)
               )

           return root is None or are_mirrors(root.left, root.right)

嵌套函数只捕获自身，不保存可变外部状态。Python 默认递归深度可能小于极端退化树高度；平台约束下通常可用，
通用工程环境若允许非常深的树，应改用显式队列版本。

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isSymmetric(TreeNode root) {
           return root == null || areMirrors(root.left, root.right);
       }

       private boolean areMirrors(TreeNode left, TreeNode right) {
           if (left == null || right == null) {
               return left == right;
           }

           return left.val == right.val &&
               areMirrors(left.left, right.right) &&
               areMirrors(left.right, right.left);
       }
   }

对象引用按值传递，复制引用不会复制子树。方法没有对象字段，因此同一个 ``Solution`` 实例重复调用不会残留状态。

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn is_symmetric(
           root: Option<Rc<RefCell<TreeNode>>>,
       ) -> bool {
           fn are_mirrors(
               left: Option<Rc<RefCell<TreeNode>>>,
               right: Option<Rc<RefCell<TreeNode>>>,
           ) -> bool {
               match (left, right) {
                   (None, None) => true,
                   (Some(left_node), Some(right_node)) => {
                       let left_ref = left_node.borrow();
                       let left_value = left_ref.val;
                       let left_outer = left_ref.left.clone();
                       let left_inner = left_ref.right.clone();
                       drop(left_ref);

                       let right_ref = right_node.borrow();
                       let right_value = right_ref.val;
                       let right_inner = right_ref.left.clone();
                       let right_outer = right_ref.right.clone();
                       drop(right_ref);

                       left_value == right_value &&
                           are_mirrors(left_outer, right_outer) &&
                           are_mirrors(left_inner, right_inner)
                   }
                   _ => false,
               }
           }

           match root {
               None => true,
               Some(node) => {
                   let node_ref = node.borrow();
                   let left = node_ref.left.clone();
                   let right = node_ref.right.clone();
                   drop(node_ref);
                   are_mirrors(left, right)
               }
           }
       }
   }

递归前显式结束 ``RefCell`` 借用，避免借用跨越递归调用。``clone`` 只复制 ``Rc`` 句柄并增加引用计数；
树节点和值没有被深复制。

Go
~~

.. code-block:: go

   func isSymmetric(root *TreeNode) bool {
       var areMirrors func(*TreeNode, *TreeNode) bool

       areMirrors = func(left, right *TreeNode) bool {
           if left == nil || right == nil {
               return left == right
           }

           return left.Val == right.Val &&
               areMirrors(left.Left, right.Right) &&
               areMirrors(left.Right, right.Left)
       }

       return root == nil || areMirrors(root.Left, root.Right)
   }

递归闭包保存的是函数引用，没有共享路径或结果容器。节点指针只读，垃圾回收器负责节点生命周期。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isSymmetric(root: TreeNode | null): boolean {
       const areMirrors = (
           left: TreeNode | null,
           right: TreeNode | null,
       ): boolean => {
           if (left === null || right === null) {
               return left === right;
           }

           return left.val === right.val &&
               areMirrors(left.left, right.right) &&
               areMirrors(left.right, right.left);
       };

       return root === null || areMirrors(root.left, root.right);
   }

严格空值检查使 ``null`` 分支与非空分支分离。算法不使用位运算，节点值不会触发 JavaScript 32 位转换。

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsSymmetric(TreeNode root) {
           return root == null || AreMirrors(root.left, root.right);
       }

       private bool AreMirrors(TreeNode left, TreeNode right) {
           if (left == null || right == null) {
               return left == right;
           }

           return left.val == right.val &&
               AreMirrors(left.left, right.right) &&
               AreMirrors(left.right, right.left);
       }
   }

实现没有实例字段，重复调用不会受前一次结果影响。对象引用由运行时管理，函数不改变节点可达关系。

Julia
~~~~~

.. code-block:: julia

   function is_symmetric(
       root::Union{TreeNode, Nothing},
   )::Bool
       function are_mirrors(left, right)::Bool
           if left === nothing || right === nothing
               return left === right
           end

           return left.val == right.val &&
               are_mirrors(left.left, right.right) &&
               are_mirrors(left.right, right.left)
       end

       return root === nothing ||
           are_mirrors(root.left, root.right)
   end

Julia 直接传递节点引用，不复制子树。当前题没有零基坐标、范围或数组下标转换。

R
~

.. code-block:: r

   is_symmetric <- function(root) {
     are_mirrors <- function(left, right) {
       if (is.null(left) || is.null(right)) {
         return(is.null(left) && is.null(right))
       }

       left$val == right$val &&
         are_mirrors(left$left, right$right) &&
         are_mirrors(left$right, right$left)
     }

     is.null(root) || are_mirrors(root$left, root$right)
   }

R 节点是 ``environment``，字段读取保持引用语义。递归函数不依赖父调用帧中的局部向量修改，因此不会触发
R 递归闭包赋值的高风险语义。

对照解法：队列保存镜像节点对
----------------------------

可以把递归状态显式放入队列。初始加入 ``(root.left, root.right)``，每次取出一对节点并执行相同的三种空值
判断。非空且值相等时，依次加入 ``(left.left, right.right)`` 和 ``(left.right, right.left)``。

队列版本的正确性与递归版相同，因为队列中的每个元素仍然是一对镜像位置；区别只在于待处理状态保存在堆上
而不是调用栈中。最坏时间 ``O(n)``，队列空间 ``O(w)``。实现队列时必须允许一对中的某个位置为空，或者在
入队前把空值情况完整处理；只入队非空节点会丢失结构差异。

验证计划与证据
--------------

* Python 通过语法解析，并对 3,000 棵随机树与独立镜像序列化基准对拍；调用前后序列化一致；
* C、C++ 通过严格警告编译，固定用例覆盖空树、完整镜像、方向错误和单边为空，并在 ASan、UBSan 下运行；
* Java、Go、TypeScript 通过编译或严格类型检查，并运行对应固定用例；
* Rust、C#、Julia、R 完成函数签名、空值分支、递归方向、括号与引用语义静态检查；
* 当前环境缺少 Rust、C#、Julia、R 运行时，因此不声称这四种语言已经运行通过。

关键边界
--------

* 空树：本实现把它作为主动支持的扩展并返回真；
* 单节点：左右孩子同时为空，直接返回真；
* 相同值但孩子方向不同：必须返回假；
* 一侧缺失整条子树：在第一对单空位置立即返回假；
* 极端退化树：递归深度等于树高，可能触发宿主语言栈限制；
* 共享子树或有环结构不在二叉树输入契约内，当前算法没有访问集合。

易错点
------

* 把 ``left.left`` 与 ``right.left`` 比较，实际复用了 `0100` 的同向关系；
* 只比较每层值的多重集，忽略空位置和左右方向；
* 两个参数任意一个为空时直接返回真；正确条件是两者必须同时为空；
* 只检查外侧或只检查内侧，遗漏另一半结构；
* 用中序遍历值序列判断对称，没有空标记时不同结构可能产生相同序列；
* Rust 在持有 ``RefCell`` 借用时继续递归，容易引入不必要的动态借用冲突。

本题新增知识
------------

* 镜像关系的交叉成对递归状态；
* 外侧孩子与内侧孩子的方向对应；
* 以树高为度量的镜像结构归纳证明。

本题强化知识
------------

* `0100` 的空节点对称基例与短路终止；
* `0094` 建立的跨语言 ``TreeNode`` 引用模型；
* 树递归调用栈按高度 ``h`` 计费，而不是无条件写成 ``O(n)``。

关联题目
--------

* `0100. Same Tree <../0001-0100/0100-same-tree.rst>`_：同向节点对与本题交叉节点对的直接对照；
* `0094. Binary Tree Inorder Traversal
  <../0001-0100/0094-binary-tree-inorder-traversal.rst>`_：树高空间与显式栈；
* `0104. Maximum Depth of Binary Tree <0104-maximum-depth-of-binary-tree.rst>`_：用同一树高归纳框架计算数值结果。

最小自检
--------

#. ``mirror(a, b)`` 为什么比较 ``a.left`` 与 ``b.right``，而不是 ``b.left``？
#. 一个为空、一个非空为什么不能被当作“这一分支结束”？
#. 结构归纳中的基础情况和归纳步骤分别是什么？
#. Rust 的 ``Rc::clone`` 是否复制了整棵子树？
#. 递归版的工作空间为什么是 ``O(h)``，队列版为什么写成 ``O(w)``？

答案要点
~~~~~~~~

镜像关系要求左右方向互换：根值相等后，左侧外孩子只能对应右侧外孩子，左侧内孩子只能对应右侧内孩子。
空节点对负责暴露结构差异。递归每次下降到更矮子树，结构归纳证明两个交叉子问题都成立时且仅当当前子树对
互为镜像。``Rc::clone`` 只增加引用计数。递归栈同时只保存一条祖先路径，队列则保存当前尚未处理的镜像前沿。
