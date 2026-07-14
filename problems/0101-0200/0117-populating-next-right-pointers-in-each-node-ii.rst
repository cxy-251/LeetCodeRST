
0117. Populating Next Right Pointers in Each Node II
====================================================

题目信息
--------

:题号: 0117
:难度: Medium
:主题: 一般二叉树、层级链接、原地修改、常数空间遍历
:原题: `LeetCode 0117
   <https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/>`_
:访问状态: Available
:教学重点: 稀疏层压缩、下一层链尾、旧 next 覆盖、常数空间层序遍历

题目重述
--------

给定一棵任意二叉树。每个节点包含 ``val``、``left``、``right`` 和 ``next`` 四个字段。
需要把每个节点的 ``next`` 指向同层紧邻的右侧节点；若当前节点是该层最右节点，
则令 ``next`` 为空。返回原根节点。

与 0116 不同，本题不保证树是完美二叉树：节点可能只有左孩子、只有右孩子，
同一层也可能存在跨越多个空槽位的相邻节点。算法必须复用原节点，只修改 ``next``；
不能改变 ``left``、``right``、节点值或节点身份。

本文实现主动令根和每层链尾的 ``next`` 为空，因此即使输入节点带有错误旧链接，
结果也不依赖这些旧值。

自建示例
--------

跨越空槽位
~~~~~~~~~~

.. code-block:: text

          1
        /   \
       2     3
        \     \
         5     7

   完成后：

   1 -> null
   2 -> 3 -> null
   5 -> 7 -> null

``5 -> 7`` 既不是同父连接，也不能写成 ``parent.next.left``；中间父节点缺少孩子。

只有单侧孩子
~~~~~~~~~~~~

.. code-block:: text

       1
      /
     2
      \
       4

   完成后每层都只有一个节点，三个 next 均为 null。

旧链接污染
~~~~~~~~~~

若输入前把 ``2.next`` 错指向深层节点、把 ``7.next`` 指回 ``1``，算法仍需覆盖这些旧值，
最终每层只保留正确的从左到右链，并以空值结束。

空树
~~~~

``root = null`` 时返回 ``null``，不访问任何字段。

问题抽象
--------

处理某一层时，该层已经由 ``next`` 串成从左到右的链。沿这条链扫描父节点，
按“左孩子在前、右孩子在后”的顺序收集所有非空孩子，就能得到下一层的自然顺序。

与 BFS 队列不同，算法不保存整层节点。它只维护：

* ``next_head``：下一层遇到的第一个非空孩子；
* ``next_tail``：下一层已经连接好的链尾；
* ``current``：当前层沿 ``next`` 扫描的父节点。

每发现一个非空孩子 ``child``：

.. code-block:: text

   若 next_head 为空：
       next_head = child
   否则：
       next_tail.next = child

   next_tail = child

扫描完整层后令 ``next_tail.next = null``，再把 ``level_start`` 移到 ``next_head``。
空孩子被直接跳过，因此任意稀疏形状都被压缩成连续链。

基础类型约定
------------

沿用 `0116. Populating Next Right Pointers in Each Node
<0116-populating-next-right-pointers-in-each-node.rst>`_ 建立的 ``Node`` 模型：
``left``、``right``、``next`` 都是节点引用或空值。

C、C++、Python、Java、Go、TypeScript 和 C# 直接修改平台节点。Rust 使用
``Option<Rc<RefCell<Node>>>``；Julia 使用可变 ``NextNode``；R 使用 ``environment``。
所有适配器都返回原根引用，不创建替代树。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 当前层 next 链 + 下一层链尾
     - ``O(n)``
     - ``O(1)``
     - 主解法；适用于任意二叉树
   * - BFS 队列
     - ``O(n)``
     - ``O(w)``
     - 最直接，但没有复用节点中的 next 字段
   * - DFS 记录每层前驱
     - ``O(n)``
     - ``O(h)`` 或 ``O(h)`` 数组
     - 依赖递归深度和层状态

这里 ``n`` 是节点数，``w`` 是最大层宽，``h`` 是树高。

主解法：当前层导航与下一层链尾
------------------------------

层级状态与核心不变量
~~~~~~~~~~~~~~~~~~~~

每次外层循环开始时保持：

* ``level_start`` 是当前层最左节点，或为空表示全部层处理完毕；
* 当前层从 ``level_start`` 沿 ``next`` 恰好访问本层全部节点一次，并以空值结束；
* 更高层的 ``next`` 已经正确；
* ``left``、``right`` 和节点身份始终未改变。

扫描当前层过程中继续保持：

* ``next_head`` 是下一层已发现节点中的最左节点；
* 从 ``next_head`` 到 ``next_tail`` 的 ``next`` 链等于已扫描父节点孩子的自然层序；
* ``next_tail`` 是该链最后一个节点；
* 尚未扫描父节点的孩子还没有被要求进入结果链。

为什么孩子顺序正确
~~~~~~~~~~~~~~~~~~

二叉树下一层的从左到右顺序，等于当前层父节点从左到右排列后，
依次列出每个父节点的左孩子和右孩子，并删除空值。

内层循环正沿当前层正确的 ``next`` 链从左到右访问父节点；对每个父节点又先考察左孩子、
再考察右孩子。因此追加顺序与下一层自然顺序完全一致。空孩子不产生占位，也不会阻断跨空槽位连接。

为什么可以复用 next 导航
~~~~~~~~~~~~~~~~~~~~~~~~

算法读取的 ``current.next`` 属于当前层，它在上一轮外层循环结束时已经完整建立。
本轮只写孩子节点的 ``next``，即下一层字段，不会破坏当前层尚未完成的横向导航。

根层在开始前显式设置 ``root.next = null``，因此归纳起点成立。每轮结束时又显式清空新链尾，
下一轮读取到的链同样可靠。

不使用哑节点的原因
~~~~~~~~~~~~~~~~~~

常见实现每层创建一个临时哑节点。本文使用 ``next_head`` 与 ``next_tail`` 两个引用，
避免依赖平台 ``Node`` 构造器，也更直接地表达“第一次追加建立链头，后续追加只更新链尾”。
两种写法都只使用常数额外空间。

正确性依据
~~~~~~~~~~

按层数归纳。

**基础情况。** 根层最多只有根一个节点。算法显式令 ``root.next = null``，
因此第 0 层链接正确。空树直接返回。

**归纳步骤。** 假设当前第 ``d`` 层已经由 ``next`` 按从左到右顺序完整串联并以空值结束。
内层循环会恰好访问该层每个父节点一次。对每个父节点按左、右顺序追加非空孩子，
所以追加序列恰好是第 ``d + 1`` 层删除空槽位后的自然顺序。每次追加把前一链尾连到新孩子；
扫描结束后把最终链尾连到空值，因此下一层链接完整且边界正确。

**节点覆盖。** 每个非根节点恰好是某个父节点的左孩子或右孩子，且该父节点只被扫描一次，
所以每个节点恰好被追加一次，不会遗漏或重复。

**无误连。** 链尾只连接到追加序列中的下一个节点，追加序列已经证明等于层序，
因此任何 ``next`` 都不会跨层或跳过同层非空节点。

**拓扑保持。** 算法从不写 ``left`` 或 ``right``，只覆盖 ``next``，
所以原树节点集合、身份和父子拓扑保持不变。

**终止性。** 内层沿有限且以空值结束的当前层链前进；外层每次下降到下一层，
有限树最终得到空 ``next_head``。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 每个节点作为当前层节点被扫描一次，并作为孩子被追加一次，总时间 ``O(n)``；
* 只保存四个左右的节点引用，算法额外空间 ``O(1)``；
* 不包含递归栈、队列或返回容器；
* 返回值是原根引用；
* C/C++ 不分配或释放树节点；
* Rust 只持有常数个 ``Rc`` 句柄，克隆句柄不复制节点；
* Julia 和 R 的字段赋值修改共享节点；
* 各语言直接分别追加左右孩子，不为每个父节点构造临时孩子容器。

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
       struct Node *level_start = root;

       while (level_start != NULL) {
           struct Node *next_head = NULL;
           struct Node *next_tail = NULL;

           for (struct Node *current = level_start;
                current != NULL;
                current = current->next) {
               if (current->left != NULL) {
                   if (next_head == NULL) {
                       next_head = current->left;
                   } else {
                       next_tail->next = current->left;
                   }
                   next_tail = current->left;
               }

               if (current->right != NULL) {
                   if (next_head == NULL) {
                       next_head = current->right;
                   } else {
                       next_tail->next = current->right;
                   }
                   next_tail = current->right;
               }
           }

           if (next_tail != NULL) {
               next_tail->next = NULL;
           }
           level_start = next_head;
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
           Node* level_start = root;

           while (level_start != nullptr) {
               Node* next_head = nullptr;
               Node* next_tail = nullptr;

               for (Node* current = level_start;
                    current != nullptr;
                    current = current->next) {
                   append(current->left, next_head, next_tail);
                   append(current->right, next_head, next_tail);
               }

               if (next_tail != nullptr) {
                   next_tail->next = nullptr;
               }
               level_start = next_head;
           }

           return root;
       }

   private:
       static void append(
           Node* child,
           Node*& head,
           Node*& tail
       ) {
           if (child == nullptr) {
               return;
           }
           if (head == nullptr) {
               head = child;
           } else {
               tail->next = child;
           }
           tail = child;
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
           level_start = root

           while level_start is not None:
               next_head = None
               next_tail = None
               current = level_start

               while current is not None:
                   if current.left is not None:
                       if next_head is None:
                           next_head = current.left
                       else:
                           next_tail.next = current.left
                       next_tail = current.left

                   if current.right is not None:
                       if next_head is None:
                           next_head = current.right
                       else:
                           next_tail.next = current.right
                       next_tail = current.right

                   current = current.next

               if next_tail is not None:
                   next_tail.next = None
               level_start = next_head

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
           Node levelStart = root;

           while (levelStart != null) {
               Node nextHead = null;
               Node nextTail = null;

               for (Node current = levelStart;
                    current != null;
                    current = current.next) {
                   if (current.left != null) {
                       if (nextHead == null) {
                           nextHead = current.left;
                       } else {
                           nextTail.next = current.left;
                       }
                       nextTail = current.left;
                   }

                   if (current.right != null) {
                       if (nextHead == null) {
                           nextHead = current.right;
                       } else {
                           nextTail.next = current.right;
                       }
                       nextTail = current.right;
                   }
               }

               if (nextTail != null) {
                   nextTail.next = null;
               }
               levelStart = nextHead;
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

           let mut level_start = root.clone();

           while let Some(start) = level_start {
               let mut next_head: Option<Rc<RefCell<Node>>> = None;
               let mut next_tail: Option<Rc<RefCell<Node>>> = None;
               let mut current = Some(start);

               while let Some(node) = current {
                   let (left, right, next) = {
                       let node_ref = node.borrow();
                       (
                           node_ref.left.clone(),
                           node_ref.right.clone(),
                           node_ref.next.clone(),
                       )
                   };

                   for child in [left, right].into_iter().flatten() {
                       child.borrow_mut().next = None;
                       if let Some(tail) = next_tail.as_ref() {
                           tail.borrow_mut().next = Some(Rc::clone(&child));
                       } else {
                           next_head = Some(Rc::clone(&child));
                       }
                       next_tail = Some(child);
                   }

                   current = next;
               }

               level_start = next_head;
           }

           root
       }
   }

读取父节点三个字段的借用在元组构造后立即结束；随后才修改孩子的 ``next``，避免 ``RefCell`` 运行时借用冲突。

Go
~~

.. code-block:: go

   func connect(root *Node) *Node {
       if root == nil {
           return nil
       }

       root.Next = nil
       levelStart := root

       for levelStart != nil {
           var nextHead *Node
           var nextTail *Node

           for current := levelStart;
               current != nil;
               current = current.Next {
               children := [2]*Node{current.Left, current.Right}
               for _, child := range children {
                   if child == nil {
                       continue
                   }
                   if nextHead == nil {
                       nextHead = child
                   } else {
                       nextTail.Next = child
                   }
                   nextTail = child
               }
           }

           if nextTail != nil {
               nextTail.Next = nil
           }
           levelStart = nextHead
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
       let levelStart: Node | null = root;

       while (levelStart !== null) {
           let nextHead: Node | null = null;
           let nextTail: Node | null = null;
           let current: Node | null = levelStart;

           while (current !== null) {
               if (current.left !== null) {
                   if (nextHead === null) {
                       nextHead = current.left;
                   } else {
                       nextTail!.next = current.left;
                   }
                   nextTail = current.left;
               }

               if (current.right !== null) {
                   if (nextHead === null) {
                       nextHead = current.right;
                   } else {
                       nextTail!.next = current.right;
                   }
                   nextTail = current.right;
               }

               current = current.next;
           }

           if (nextTail !== null) {
               nextTail.next = null;
           }
           levelStart = nextHead;
       }

       return root;
   }

非空断言只出现在已经确认 ``nextTail`` 存在的分支中，不依赖树形完整性。

C#
~~

.. code-block:: csharp

   public class Solution {
       public Node Connect(Node root) {
           if (root == null) {
               return null;
           }

           root.next = null;
           Node levelStart = root;

           while (levelStart != null) {
               Node nextHead = null;
               Node nextTail = null;

               for (Node current = levelStart;
                    current != null;
                    current = current.next) {
                   if (current.left != null) {
                       if (nextHead == null) {
                           nextHead = current.left;
                       } else {
                           nextTail.next = current.left;
                       }
                       nextTail = current.left;
                   }

                   if (current.right != null) {
                       if (nextHead == null) {
                           nextHead = current.right;
                       } else {
                           nextTail.next = current.right;
                       }
                       nextTail = current.right;
                   }
               }

               if (nextTail != null) {
                   nextTail.next = null;
               }
               levelStart = nextHead;
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
       level_start::Union{NextNode, Nothing} = root

       while level_start !== nothing
           next_head::Union{NextNode, Nothing} = nothing
           next_tail::Union{NextNode, Nothing} = nothing
           current::Union{NextNode, Nothing} = level_start

           while current !== nothing
               node = current::NextNode
               if node.left !== nothing
                   child = node.left::NextNode
                   if next_head === nothing
                       next_head = child
                   else
                       (next_tail::NextNode).next = child
                   end
                   next_tail = child
               end

               if node.right !== nothing
                   child = node.right::NextNode
                   if next_head === nothing
                       next_head = child
                   else
                       (next_tail::NextNode).next = child
                   end
                   next_tail = child
               end

               current = node.next
           end

           if next_tail !== nothing
               (next_tail::NextNode).next = nothing
           end
           level_start = next_head
       end

       return root
   end

Julia 通过 ``Union{NextNode, Nothing}`` 表达空引用；类型断言只发生在已排除 ``nothing`` 之后。

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
     level_start <- root

     while (!is.null(level_start)) {
       next_head <- NULL
       next_tail <- NULL
       current <- level_start

       while (!is.null(current)) {
         if (!is.null(current$left)) {
           if (is.null(next_head)) {
             next_head <- current$left
           } else {
             next_tail[["next"]] <- current$left
           }
           next_tail <- current$left
         }

         if (!is.null(current$right)) {
           if (is.null(next_head)) {
             next_head <- current$right
           } else {
             next_tail[["next"]] <- current$right
           }
           next_tail <- current$right
         }

         current <- current[["next"]]
       }

       if (!is.null(next_tail)) {
         next_tail[["next"]] <- NULL
       }
       level_start <- next_head
     }

     root
   }

R 节点继续使用 ``environment``，字段赋值直接修改调用者持有的同一节点对象。

验证计划与证据
--------------

* 固定用例覆盖空树、单节点、只有左孩子、只有右孩子、跨多个空槽位和宽度不规则的树；
* 调用前给所有 ``next`` 填入故意错误的同层、跨层和成环引用，确认结果完整覆盖旧值；
* 用独立 BFS 收集每层节点，逐节点比较期望右邻居和实际 ``next``；
* 保存所有节点的 ``left``、``right`` 和对象身份，调用后确认父子拓扑未改变；
* 随机生成稀疏树，对 Python 执行 3000 组对拍；
* C/C++ 使用严格警告、ASan、UBSan 和 500 组随机树；
* Java、Go、TypeScript 执行固定与 500 组随机树；
* Rust、C#、Julia、R 缺少运行时时，只记录接口、空值、借用与引用语义静态检查。

关键边界
--------

* 空树直接返回；
* 根的旧 ``next`` 必须先清空；
* 下一层可能只有右孩子，不能用 ``leftmost.left`` 作为固定入口；
* 一整层可能产生零个孩子，此时 ``next_head`` 保持空并结束外层循环；
* 每层链尾必须显式写空，防止旧链接泄漏到下一轮；
* 当前层导航只能读取已经完成的 ``next``，不能沿正在构造的下一层链扫描父节点。

易错点
------

* 直接复制 0116 的 ``left.next = right`` 与 ``right.next = parent.next.left``，在缺孩子时失效；
* 只记住下一层头节点，没有链尾，导致每次追加都重新扫描整条链；
* 先修改当前层 ``next``，破坏内层循环导航；
* 忘记跳过空孩子，错误地让链中出现空槽位概念；
* 没有清空链尾，保留输入中的旧跨层指针；
* Rust 中在持有父节点借用时再可变借用孩子。

本题新增知识
------------

* 任意稀疏二叉树的下一层顺序是“父层顺序展开孩子后删除空值”；
* ``next_head`` 与 ``next_tail`` 可以常数空间构造未知形状的下一层链；
* 旧链接污染需要通过根初始化和每层链尾清空完整覆盖；
* 当前层读、下一层写的分层状态避免自我破坏。

本题强化知识
------------

* 复用已经建立的 ``next`` 链替代 BFS 队列；
* 原地修改需要保持节点身份和左右拓扑；
* Rust ``RefCell`` 借用应缩短到字段快照作用域；
* Julia 与 R 使用真正引用语义表达可观察修改。

关联题目
--------

* `0116. Populating Next Right Pointers in Each Node
  <0116-populating-next-right-pointers-in-each-node.rst>`_：完美树可直接写同父与跨父公式；
* `0102. Binary Tree Level Order Traversal
  <0102-binary-tree-level-order-traversal.rst>`_：显式队列保存层边界；
* `0114. Flatten Binary Tree to Linked List
  <0114-flatten-binary-tree-to-linked-list.rst>`_：另一种保持节点身份的原地拓扑修改。

最小自检
--------

#. 为什么 ``current.next`` 在本轮扫描中不会被孩子链接写入破坏？
#. 只有右孩子的父节点应怎样加入下一层？
#. 为什么扫描结束后必须执行 ``next_tail.next = null``？

答案要点
--------

#. 本轮读取当前层字段，只写下一层孩子字段；两层节点集合互不相同。
#. 与左孩子相同，按父层顺序在右孩子位置追加；空左孩子直接跳过。
#. 它覆盖旧链接并保证下一轮当前层链以空值结束，否则可能跨层或成环。
