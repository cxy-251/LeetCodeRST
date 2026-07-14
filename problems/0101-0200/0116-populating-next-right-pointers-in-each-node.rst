0116. Populating Next Right Pointers in Each Node
=================================================

题目信息
--------

:题号: 0116
:难度: Medium
:主题: 完美二叉树、层级链接、原地修改、常数空间遍历
:原题: `LeetCode 0116
   <https://leetcode.com/problems/populating-next-right-pointers-in-each-node/>`_
:访问状态: Available
:教学重点: 同父连接、跨父连接、已建 next 链、层级不变量

题目重述
--------

给定一棵完美二叉树。每个节点除 ``val``、``left`` 和 ``right`` 外，还有一个 ``next`` 指针。
需要把每个节点的 ``next`` 指向同一层紧邻的右侧节点；若当前节点已经是该层最右节点，
则令 ``next`` 为空。返回原根节点。

完美二叉树满足：

* 每个非叶节点恰好有两个孩子；
* 所有叶节点位于同一深度。

函数必须原地写入现有节点的 ``next`` 字段，不创建替代树。本文算法会主动重写根和每层最右节点的
``next`` 为空，因此不依赖输入中的旧 ``next`` 值已经正确。

自建示例
--------

三层完美树
~~~~~~~~~~

.. code-block:: text

          1
        /   \
       2     3
      / \   / \
     4   5 6   7

   完成后：

   1 -> null
   2 -> 3 -> null
   4 -> 5 -> 6 -> 7 -> null

其中 ``5 -> 6`` 跨越了父节点 ``2`` 与 ``3`` 的边界。

单节点
~~~~~~

.. code-block:: text

   1 -> null

没有下一层需要处理，但根的 ``next`` 仍应为空。

空树
~~~~

.. code-block:: text

   root = null
   输出：null

问题抽象
--------

若当前层已经通过 ``next`` 串成链，就可以在不使用队列的情况下横向遍历所有父节点。
对当前父节点 ``current``，下一层只需要建立两类边：

.. code-block:: text

   current.left.next = current.right

   若 current.next 存在：
       current.right.next = current.next.left
   否则：
       current.right.next = null

第一条连接同一父节点的两个孩子。第二条把当前父节点的右孩子连接到右侧相邻父节点的左孩子。

处理完整层后，下一层已经形成从左到右的 ``next`` 链。外层循环移动到
``leftmost.left``，继续复用刚建立的链。

基础类型约定
------------

本题平台节点 ``Node`` 首次在仓库中加入 ``next`` 字段：

.. code-block:: text

   Node {
       val
       left
       right
       next
   }

四个节点字段都保存引用或空值。算法复用原节点，只修改 ``next``，不改变 ``left``、``right``、
节点值和节点身份。

C、C++、Python、Java、Go、TypeScript 和 C# 直接修改平台节点。Rust 使用
``Option<Rc<RefCell<Node>>>``；``Rc::clone`` 只复制句柄。Julia 适配器使用可变 ``NextNode``，
R 适配器使用 ``environment`` 节点，以保持调用者可观察的引用语义。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 复用上一层 ``next`` 链
     - ``O(n)``
     - ``O(1)``
     - 主解法；利用完美树结构
   * - BFS 队列
     - ``O(n)``
     - ``O(w)``
     - 适用于普通二叉树，但未利用已存在的 ``next`` 字段
   * - 递归连接相邻子树
     - ``O(n)``
     - ``O(h)``
     - 证明直观，依赖调用栈

这里 ``n`` 是节点数，``w`` 是最大层宽，``h`` 是树高。

主解法：复用上一层的 next 链
----------------------------

两层循环状态
~~~~~~~~~~~~

``leftmost`` 指向当前待处理父节点层的最左节点。``current`` 沿该层已经存在的 ``next`` 链移动。

外层循环开始时保持：

* ``leftmost`` 所在层的 ``next`` 链已经完整且以空值结束；
* ``leftmost`` 是该层最左节点；
* 更高层的 ``next`` 已经正确；
* ``leftmost`` 若有左孩子，则该层每个节点都有左右孩子。

内层循环处理完一个父节点后，其两个孩子的 ``next`` 都被确定。处理完整层后，
下一层从 ``leftmost.left`` 开始的链已经完整。

同父连接
~~~~~~~~

完美树保证非叶节点同时存在左右孩子，因此：

.. code-block:: text

   current.left.next = current.right

这条边永远存在，并且连接下一层中相邻的两个节点。

跨父连接
~~~~~~~~

若 ``current.next`` 指向同层右侧父节点，则下一层中紧跟
``current.right`` 的节点一定是 ``current.next.left``：

.. code-block:: text

   current.right.next = current.next.left

若 ``current`` 是该层最右父节点，下一层的 ``current.right`` 也是最右节点，
其 ``next`` 必须为空。代码显式写入空值，不依赖旧字段。

为什么可以不用队列
~~~~~~~~~~~~~~~~~~

处理根所在层时，根的 ``next`` 被设为空，当前层链显然正确。根建立第二层的连接。
随后第二层已经能通过 ``next`` 横向遍历，并建立第三层连接。

因此每次处理一层时，横向导航结构已经由上一轮准备完成。队列原本用于保存“同层下一个节点”，
现在这个信息就在节点自身的 ``next`` 中。

正确性依据
~~~~~~~~~~

按层数归纳。

**基础情况。** 根是第 0 层唯一节点。算法先令 ``root.next = null``，该层链接正确。
若根是叶节点，算法结束；否则根连接自己的左右孩子，并把右孩子连接为空，
第 1 层链接正确。

**归纳步骤。** 假设第 ``d`` 层已经按从左到右的顺序由 ``next`` 串联，并以空值结束。
内层循环因此会恰好访问该层每个父节点一次。对任意父节点：

* 左孩子通过同父边连接到右孩子；
* 若存在右侧父节点，右孩子通过跨父边连接到该父节点的左孩子；
* 若不存在右侧父节点，右孩子连接为空。

完美树的下一层顺序恰好由这些同父边和跨父边交替组成，所以第 ``d + 1`` 层全部相邻节点
都被连接，且最右节点以空值结束。

**节点覆盖与无误连。** 每个非根节点恰好是某个父节点的左孩子或右孩子。
左孩子的 ``next`` 在同父连接中写入一次；右孩子的 ``next`` 在跨父连接中写入一次。
目标唯一，不会遗漏或重复写入矛盾值。

**终止性。** 外层每次下降一层，叶层没有左孩子时停止。内层沿有限且以空值结束的
当前层链前进。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 每个非叶父节点在内层循环中访问一次，总时间 ``O(n)``；
* 只保存 ``leftmost``、``current`` 和少量临时引用，算法额外空间 ``O(1)``；
* 没有递归栈、队列或返回容器；
* 返回值是原根引用，不是新树；
* C/C++ 不分配或释放节点；
* Rust 仅克隆常数个 ``Rc`` 句柄，峰值句柄数量不随节点数增长；
* Julia 和 R 的字段赋值直接修改共享节点；
* 算法依赖完美树约束。普通二叉树可能缺少孩子，跨父目标也不一定是
  ``current.next.left``，应使用 0117 的通用链尾方法。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>

   struct Node *connect(struct Node *root) {
       if (root == NULL) {
           return NULL;
       }

       root->next = NULL;
       struct Node *leftmost = root;

       while (leftmost->left != NULL) {
           struct Node *current = leftmost;

           while (current != NULL) {
               current->left->next = current->right;
               current->right->next =
                   current->next == NULL
                       ? NULL
                       : current->next->left;
               current = current->next;
           }

           leftmost = leftmost->left;
       }

       return root;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       Node* connect(Node* root) {
           if (root == nullptr) {
               return nullptr;
           }

           root->next = nullptr;
           Node* leftmost = root;

           while (leftmost->left != nullptr) {
               Node* current = leftmost;

               while (current != nullptr) {
                   current->left->next = current->right;
                   current->right->next =
                       current->next == nullptr
                           ? nullptr
                           : current->next->left;
                   current = current->next;
               }

               leftmost = leftmost->left;
           }

           return root;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def connect(self, root: "Node | None") -> "Node | None":
           if root is None:
               return None

           root.next = None
           leftmost = root

           while leftmost.left is not None:
               current = leftmost

               while current is not None:
                   current.left.next = current.right
                   current.right.next = (
                       None
                       if current.next is None
                       else current.next.left
                   )
                   current = current.next

               leftmost = leftmost.left

           return root

Java
~~~~

.. code-block:: java

   class Solution {
       public Node connect(Node root) {
           if (root == null) {
               return null;
           }

           root.next = null;
           Node leftmost = root;

           while (leftmost.left != null) {
               Node current = leftmost;

               while (current != null) {
                   current.left.next = current.right;
                   current.right.next =
                       current.next == null
                           ? null
                           : current.next.left;
                   current = current.next;
               }

               leftmost = leftmost.left;
           }

           return root;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn connect(
           root: Option<Rc<RefCell<Node>>>,
       ) -> Option<Rc<RefCell<Node>>> {
           let Some(root_node) = root.as_ref() else {
               return None;
           };
           root_node.borrow_mut().next = None;

           let mut leftmost = root.clone();

           while let Some(level_start) = leftmost.clone() {
               let next_leftmost = level_start.borrow().left.clone();
               if next_leftmost.is_none() {
                   break;
               }

               let mut current = Some(level_start);

               while let Some(node) = current {
                   let (left, right, parent_next) = {
                       let node_ref = node.borrow();
                       (
                           node_ref.left.clone(),
                           node_ref.right.clone(),
                           node_ref.next.clone(),
                       )
                   };

                   let left = left.expect("perfect tree has a left child");
                   let right = right.expect("perfect tree has a right child");

                   left.borrow_mut().next = Some(Rc::clone(&right));

                   let cross = parent_next.as_ref().and_then(|parent| {
                       parent.borrow().left.clone()
                   });
                   right.borrow_mut().next = cross;

                   current = parent_next;
               }

               leftmost = next_leftmost;
           }

           root
       }
   }

借用只在读取三个字段的短作用域内存在，随后才分别可变借用孩子。
``Rc::clone`` 不复制节点，只增加引用计数。

Go
~~

.. code-block:: go

   func connect(root *Node) *Node {
       if root == nil {
           return nil
       }

       root.Next = nil
       leftmost := root

       for leftmost.Left != nil {
           current := leftmost

           for current != nil {
               current.Left.Next = current.Right
               if current.Next == nil {
                   current.Right.Next = nil
               } else {
                   current.Right.Next = current.Next.Left
               }
               current = current.Next
           }

           leftmost = leftmost.Left
       }

       return root
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function connect(root: Node | null): Node | null {
       if (root === null) {
           return null;
       }

       root.next = null;
       let leftmost: Node = root;

       while (leftmost.left !== null) {
           let current: Node | null = leftmost;

           while (current !== null) {
               current.left!.next = current.right;
               current.right!.next = (
                   current.next === null
                       ? null
                       : current.next.left
               );
               current = current.next;
           }

           leftmost = leftmost.left;
       }

       return root;
   }

非空断言只依赖完美树契约：进入外层循环后，当前层每个节点都有两个孩子。

C#
~~

.. code-block:: csharp

   public class Solution {
       public Node Connect(Node root) {
           if (root == null) {
               return null;
           }

           root.next = null;
           Node leftmost = root;

           while (leftmost.left != null) {
               Node current = leftmost;

               while (current != null) {
                   current.left.next = current.right;
                   current.right.next =
                       current.next == null
                           ? null
                           : current.next.left;
                   current = current.next;
               }

               leftmost = leftmost.left;
           }

           return root;
       }
   }

Julia
~~~~~

.. code-block:: julia

   mutable struct NextNode
       val::Int
       left::Union{NextNode, Nothing}
       right::Union{NextNode, Nothing}
       next::Union{NextNode, Nothing}
   end

   function connect_next(
       root::Union{NextNode, Nothing},
   )::Union{NextNode, Nothing}
       root === nothing && return nothing

       root.next = nothing
       leftmost = root

       while leftmost.left !== nothing
           current::Union{NextNode, Nothing} = leftmost

           while current !== nothing
               node = current::NextNode
               left = node.left::NextNode
               right = node.right::NextNode

               left.next = right
               right.next = (
                   node.next === nothing
                   ? nothing
                   : (node.next::NextNode).left
               )

               current = node.next
           end

           leftmost = (leftmost.left::NextNode)
       end

       return root
   end

``NextNode`` 是 Julia 的等价适配器。完美树契约支持对子字段使用类型断言，
字段赋值保持节点引用身份。

R
~

.. code-block:: r

   new_next_node <- function(
     val,
     left = NULL,
     right = NULL,
     next_node = NULL
   ) {
     node <- new.env(parent = emptyenv())
     node$val <- val
     node$left <- left
     node$right <- right
     node[["next"]] <- next_node
     node
   }

   connect_next <- function(root) {
     if (is.null(root)) {
       return(NULL)
     }

     root[["next"]] <- NULL
     leftmost <- root

     while (!is.null(leftmost$left)) {
       current <- leftmost

       while (!is.null(current)) {
         current$left[["next"]] <- current$right

         if (is.null(current[["next"]])) {
           current$right[["next"]] <- NULL
         } else {
           current$right[["next"]] <- current[["next"]]$left
         }

         current <- current[["next"]]
       }

       leftmost <- leftmost$left
     }

     root
   }

R 的 ``environment`` 字段赋值修改共享节点；返回 ``root`` 只是提供与平台一致的调用接口。

验证计划与证据
--------------

* 固定用例覆盖空树、单节点、两层树、三层树和更深完美树；
* 对每层从最左节点沿 ``next`` 遍历，验证节点顺序、节点数和最右空指针；
* 保存调用前的左右孩子和节点身份，调用后确认只修改 ``next``；
* 用 BFS 独立基准生成每层期望相邻关系，与主算法逐节点对拍；
* 随机生成不同高度和随机节点值的完美树；
* 在测试前填入故意错误的旧 ``next``，验证算法能够完整覆盖；
* C/C++ 使用严格警告、ASan 和 UBSan；
* Python、Java、Go、TypeScript 执行固定与随机高度用例；
* Rust、C#、Julia、R 缺少运行时时，只记录借用、空值和引用语义静态检查。

关键边界
--------

* 空树直接返回空；
* 单节点树只需保证根 ``next`` 为空；
* 每层最右节点必须显式连接为空；
* ``5 -> 6`` 一类跨父连接不能遗漏；
* 外层停止条件是当前层已经是叶层，即 ``leftmost.left`` 为空；
* 算法只适用于完美二叉树，不能直接用于 0117 的一般二叉树。

易错点
------

* 只连接 ``left.next = right``，遗漏跨父边；
* 把 ``right.next`` 错连到 ``current.next.right``；
* 用下一层尚未建好的 ``next`` 横向遍历；
* 没有把每层最右节点的 ``next`` 清空；
* 改写左右孩子或创建新节点，破坏原地契约；
* 在 Rust 中同时持有父节点不可变借用和孩子可变借用，触发运行时借用冲突。

本题新增知识
------------

* 完美二叉树的下一层相邻关系只包含同父边和跨父边；
* 已建立的 ``next`` 链可以替代 BFS 队列；
* 用层级归纳证明常数空间指针连接；
* 首次建立带 ``next`` 字段的跨语言节点接口。

本题强化知识
------------

* 原地修改必须保持节点身份和左右树拓扑；
* 每层最右边界需要显式空值；
* Rust ``RefCell`` 修改前缩短借用作用域；
* Julia 可变节点与 R 环境节点的引用语义。

关联题目
--------

* `0102. Binary Tree Level Order Traversal
  <0102-binary-tree-level-order-traversal.rst>`_：显式队列保存层级前沿；
* `0114. Flatten Binary Tree to Linked List
  <0114-flatten-binary-tree-to-linked-list.rst>`_：原地修改节点拓扑；
* ``0117. Populating Next Right Pointers in Each Node II``：取消完美树约束后的通用连接。

最小自检
--------

#. 下一层为什么只需要两类连接？
#. ``current.right`` 的跨父目标为什么是 ``current.next.left``？
#. 为什么处理当前层时，它的 ``next`` 链已经可用？
#. 算法在哪一步保证每层最右节点连接为空？
#. 该方法为什么不能直接用于普通二叉树？

答案要点
~~~~~~~~

先令根的 ``next`` 为空。外层以 ``leftmost`` 逐层下降，内层沿当前层已经建立的
``next`` 链横向移动。每个父节点连接 ``left -> right``，再连接
``right -> next_parent.left``；最右父节点把右孩子连接为空。上一层建立下一层，
所以无需队列。时间 ``O(n)``，额外空间 ``O(1)``。
