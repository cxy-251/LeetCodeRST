0114. Flatten Binary Tree to Linked List
=======================================

题目信息
--------

:题号: 0114
:难度: Medium
:主题: 二叉树、原地修改、指针重连、前序遍历
:原题: `LeetCode 0114 <https://leetcode.com/problems/flatten-binary-tree-to-linked-list/>`_
:访问状态: Available
:教学重点: 前序顺序、左子树尾节点、原地拓扑保持、节点身份守恒

题目重述
--------

给定一棵二叉树，把它原地改写成一条只使用 ``right`` 指针连接的链：

* 链上节点顺序必须等于原树的前序遍历，即“根、左子树、右子树”；
* 每个节点的 ``left`` 最终都必须为空；
* 必须复用原来的节点，不能创建替代节点；
* 公共接口不返回新根，调用结束后调用者持有的原根就是链表头。

空树和单节点树无需修改。题目要求原地改变拓扑，因此调用后原来的父子关系不再保留，
外部保存的节点引用仍指向
同一批节点，但这些节点的 ``left`` 和 ``right`` 可能已经改变。

自建示例
--------

普通分支树
~~~~~~~~~~

.. code-block:: text

   修改前：

          1
         / \
        2   5
       / \   \
      3   4   6

   原前序：1, 2, 3, 4, 5, 6

   修改后：

   1 -> 2 -> 3 -> 4 -> 5 -> 6

所有箭头都是 ``right``，所有 ``left`` 都为空。

只有左孩子
~~~~~~~~~~

.. code-block:: text

       1
      /
     2
    /
   3

   修改后：1 -> 2 -> 3

该用例会检查每次把左子树搬到右侧后，旧右指针和左指针是否正确更新。

已经是右链
~~~~~~~~~~

.. code-block:: text

   1 -> 2 -> 3

算法不应创建节点，也不应改变节点顺序。

问题抽象
--------

前序遍历要求当前节点之后先出现整棵左子树，再出现原右子树。若当前节点存在左孩子，可以把局部结构：

.. code-block:: text

        current
        /     \
      left   old_right

改写为：

.. code-block:: text

        current
           \
           left ... predecessor -> old_right

其中 ``predecessor`` 是当前左子树沿 ``right`` 指针不断前进所到达的最右节点。执行三次重连：

.. code-block:: text

   predecessor.right = current.right
   current.right = current.left
   current.left = null

然后继续处理新的 ``current.right``。左子树内部尚未展开的左孩子会在后续迭代中
使用同一规则插入到自己的右链
之前，因此最终顺序仍是完整前序。

基础类型约定
------------

沿用 `0094. Binary Tree Inorder Traversal
<../0001-0100/0094-binary-tree-inorder-traversal.rst>`_ 建立的 ``TreeNode`` 引用模型。
本题不分配结果容器，
核心要求是保留节点身份并重写边。

C、C++、Python、Java、Go、TypeScript 和 C# 直接修改平台节点。Rust 使用
``Option<Rc<RefCell<TreeNode>>>``，``Rc::clone`` 只增加引用计数，不复制节点。
Julia 的 ``mutable struct``
和 R 的 ``environment`` 都具有可观察的引用语义；R 函数返回 ``invisible(root)``
只是调用便利，不是新的结果树。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 左子树最右节点原地拼接
     - ``O(n)``
     - ``O(1)``
     - 主解法；不需要栈或新节点
   * - 显式栈模拟前序
     - ``O(n)``
     - ``O(h)``
     - 先保存孩子再重连，证明更直接
   * - 递归返回子树尾节点
     - ``O(n)``
     - ``O(h)``
     - 依赖调用栈，语言共享状态更复杂

这里 ``n`` 是节点数，``h`` 是树高。主解法只保留 ``current``、``predecessor`` 和少量临时引用。

主解法：左子树最右节点原地拼接
--------------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

每轮循环开始时，``current`` 指向尚未完成局部展开的下一个节点，并保持：

* 从原根到 ``current`` 之前的 ``right`` 链已经等于原树前序遍历的已完成前缀；
* 已完成前缀中的节点 ``left`` 都为空；
* ``current`` 以及通过其左右链接可达的后缀包含所有尚未输出节点，每个节点恰好一次；
* 没有创建或释放树节点。

若 ``current.left`` 为空，当前节点后面本来就应进入 ``current.right``，直接向右移动即可。

若 ``current.left`` 非空，令 ``predecessor`` 为左子树沿右边不断前进的最后节点。先把原右子树挂到
``predecessor.right``，再把左子树整体搬到 ``current.right``，最后清空
``current.left``。这样当前节点后的第一个
节点立即变成原左子树根，同时原右子树仍然可达。

为什么连接到左子树最右节点
~~~~~~~~~~~~~~~~~~~~~~~~~~

当前左子树最终展开后，会形成一条前序右链。局部算法此刻只知道现有的右边界，不必预先完整展开左子树：把
``old_right`` 挂到当前右边界后，若边界节点以后还存在左孩子，后续迭代会把那棵左子树继续插入到
``old_right`` 之前。

例如左子树根 ``2`` 的右孩子是 ``4``，而 ``4`` 还有左孩子 ``3``。
第一次可能先连接 ``4 -> old_right``；
处理 ``4`` 时又把 ``3`` 插入 ``4`` 与 ``old_right`` 之间，
最终仍得到 ``2, 4, 3, old_right``，恰好是该局部树
的前序顺序。

边重连顺序
~~~~~~~~~~

三次写入的顺序不能随意交换：

#. 先保存或使用原 ``current.right``，把它接到 ``predecessor.right``；
#. 再令 ``current.right = current.left``；
#. 最后清空 ``current.left``。

若先覆盖 ``current.right`` 而没有保存旧值，原右子树会永久失去入口。
若忘记清空 ``left``，最终结构仍是树状，
不满足只使用右指针的链式契约。

节点身份与无环性
~~~~~~~~~~~~~~~~

算法只移动现有边：

* ``current.left`` 指向的子树原本与 ``current.right`` 子树不相交；
* ``predecessor`` 位于左子树内，且其 ``right`` 为空；
* 把原右子树接到该空槽位不会形成回到左子树祖先的边；
* 随后删除 ``current.left``，当前节点对左子树只保留新的 ``right`` 入口。

因此所有节点仍可达且没有重复，也不会形成环。

正确性依据
~~~~~~~~~~

证明循环不变量。

**初始化。** ``current`` 等于原根，已完成前缀为空；全部节点都位于待处理后缀中，不变量成立。

**保持。** 若左子树为空，前序中当前节点之后本来就是原右子树，向右移动会把当前节点加入已完成前缀。

若左子树非空，前序要求顺序为“当前节点、左子树、原右子树”。重连后 ``current.right`` 首先进入左子树，
``predecessor.right`` 保留原右子树入口。后续迭代会完整展开左子树，
再自然到达原右子树。当前节点的 ``left``
已经清空，所以把 ``current`` 加入完成前缀后不变量继续成立。

**节点覆盖。** 每轮不创建、不删除节点，只把原右子树从 ``current.right``
转移到左子树右边界，再把左子树入口
从 ``left`` 转移到 ``right``。可达节点集合和节点身份保持不变。

**终止性。** 每轮结束后 ``current`` 沿最终右链前进到下一个节点。
每个节点最多成为一次 ``current``，有限节点
最终到达空指针。

**最终结果。** 循环结束时没有待处理后缀，全部节点都位于从原根开始的右链；
循环保持条件保证该链等于原前序，
且每个已完成节点的 ``left`` 为空。因此满足题目要求。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 每个节点作为 ``current`` 访问一次；寻找 ``predecessor`` 时沿右边前进的边
  不会再次成为后续某次左子树右边界
  搜索的一部分，因此总扫描次数为 ``O(n)``；
* 总时间复杂度 ``O(n)``；
* 只使用常数个节点引用，算法额外空间 ``O(1)``；
* 没有返回容器，也没有新树节点；
* C/C++ 没有分配失败路径，函数不释放任何节点；
* Rust 同时只持有常数个 ``Rc`` 句柄，克隆句柄不复制树节点；借用在每次重新赋值前结束；
* R 的节点是 ``environment``，字段赋值直接修改调用者可观察的对象，不产生整棵树副本。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>

   void flatten(struct TreeNode *root) {
       struct TreeNode *current = root;

       while (current != NULL) {
           if (current->left != NULL) {
               struct TreeNode *predecessor = current->left;
               while (predecessor->right != NULL) {
                   predecessor = predecessor->right;
               }

               predecessor->right = current->right;
               current->right = current->left;
               current->left = NULL;
           }
           current = current->right;
       }
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       void flatten(TreeNode* root) {
           TreeNode* current = root;

           while (current != nullptr) {
               if (current->left != nullptr) {
                   TreeNode* predecessor = current->left;
                   while (predecessor->right != nullptr) {
                       predecessor = predecessor->right;
                   }

                   predecessor->right = current->right;
                   current->right = current->left;
                   current->left = nullptr;
               }
               current = current->right;
           }
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def flatten(self, root: Optional[TreeNode]) -> None:
           current = root

           while current is not None:
               if current.left is not None:
                   predecessor = current.left
                   while predecessor.right is not None:
                       predecessor = predecessor.right

                   predecessor.right = current.right
                   current.right = current.left
                   current.left = None

               current = current.right

Java
~~~~

.. code-block:: java

   class Solution {
       public void flatten(TreeNode root) {
           TreeNode current = root;

           while (current != null) {
               if (current.left != null) {
                   TreeNode predecessor = current.left;
                   while (predecessor.right != null) {
                       predecessor = predecessor.right;
                   }

                   predecessor.right = current.right;
                   current.right = current.left;
                   current.left = null;
               }
               current = current.right;
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn flatten(root: &mut Option<Rc<RefCell<TreeNode>>>) {
           let mut current = root.clone();

           while let Some(node) = current {
               let left = node.borrow().left.clone();
               if let Some(left_root) = left {
                   let mut predecessor = left_root;
                   loop {
                       let next = predecessor.borrow().right.clone();
                       let Some(next_node) = next else {
                           break;
                       };
                       predecessor = next_node;
                   }

                   let old_right = {
                       let mut node_ref = node.borrow_mut();
                       let old_right = node_ref.right.take();
                       node_ref.right = node_ref.left.take();
                       old_right
                   };
                   predecessor.borrow_mut().right = old_right;
               }

               current = node.borrow().right.clone();
           }
       }
   }

Rust 先结束对 ``predecessor`` 的不可变借用再移动句柄；对 ``node`` 的可变借用
限制在一个局部块内，随后才读取
新的 ``right``。``take`` 转移子引用，不复制节点载荷。

Go
~~

.. code-block:: go

   func flatten(root *TreeNode) {
       current := root

       for current != nil {
           if current.Left != nil {
               predecessor := current.Left
               for predecessor.Right != nil {
                   predecessor = predecessor.Right
               }

               predecessor.Right = current.Right
               current.Right = current.Left
               current.Left = nil
           }
           current = current.Right
       }
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function flatten(root: TreeNode | null): void {
       let current = root;

       while (current !== null) {
           if (current.left !== null) {
               let predecessor = current.left;
               while (predecessor.right !== null) {
                   predecessor = predecessor.right;
               }

               predecessor.right = current.right;
               current.right = current.left;
               current.left = null;
           }
           current = current.right;
       }
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public void Flatten(TreeNode root) {
           TreeNode current = root;

           while (current != null) {
               if (current.left != null) {
                   TreeNode predecessor = current.left;
                   while (predecessor.right != null) {
                       predecessor = predecessor.right;
                   }

                   predecessor.right = current.right;
                   current.right = current.left;
                   current.left = null;
               }
               current = current.right;
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function flatten!(root::Union{TreeNode, Nothing})::Nothing
       current = root

       while current !== nothing
           if current.left !== nothing
               predecessor = current.left
               while predecessor.right !== nothing
                   predecessor = predecessor.right
               end

               predecessor.right = current.right
               current.right = current.left
               current.left = nothing
           end
           current = current.right
       end
       return nothing
   end

Julia 的 ``TreeNode`` 是仓库统一的 ``mutable struct``。函数名带 ``!`` 明确调用后拓扑发生可观察修改。

R
~

.. code-block:: r

   flatten_tree <- function(root) {
     current <- root

     while (!is.null(current)) {
       if (!is.null(current$left)) {
         predecessor <- current$left
         while (!is.null(predecessor$right)) {
           predecessor <- predecessor$right
         }

         predecessor$right <- current$right
         current$right <- current$left
         current$left <- NULL
       }
       current <- current$right
     }
     invisible(root)
   }

R 的树节点是 ``environment``，字段更新对调用者可见。局部变量 ``current`` 和
``predecessor`` 只是节点引用的
重新绑定，不需要 ``<<-``。

对照解法：显式栈前序重连
------------------------

显式栈先压入原右孩子，再压入原左孩子，使左孩子先弹出。每次弹出节点时，
把上一个访问节点的 ``left`` 清空，
``right`` 指向当前节点。该方法同样复用原节点，时间 ``O(n)``，栈空间 ``O(h)``。

它的优势是前序顺序更直观；主解法的优势是常数额外空间。
无论使用哪种方法，都必须在覆盖旧边前保存尚未访问的
孩子引用。

验证计划与证据
--------------

* 固定用例覆盖空树、单节点、只有左孩子、只有右孩子、左右分支同时存在和多层交错结构；
* 修改前保存前序节点值序列与节点身份集合，修改后沿 ``right`` 链逐项比较；
* 检查每个链节点的 ``left`` 都为空；
* 使用节点身份集合确认没有新节点、丢失节点或重复节点；
* 使用访问集合或步数上限确认最终右链无环且长度恰好为原节点数；
* 随机生成树，与独立前序遍历结果对拍，并在调用后再次验证身份守恒；
* C/C++ 使用严格警告、ASan 和 UBSan；有运行时的语言执行固定与随机用例；
* Rust、C#、Julia、R 缺少运行时时记录借用范围、可变引用、环境字段更新和空值静态检查。

关键边界
--------

* 空树和单节点树安全结束；
* 覆盖 ``current.right`` 前必须保留原右子树入口；
* 左子树最右节点的 ``right`` 在连接前必须为空；
* 每次处理左子树后立即清空 ``current.left``；
* 不创建替代节点，不释放原节点；
* 外部节点引用仍然有效，但观察到的是修改后的拓扑。

易错点
------

* 先执行 ``current.right = current.left``，导致原右子树丢失；
* 把原右子树接到左子树根，而不是左子树的右边界；
* 忘记清空 ``left``，得到的仍不是单链；
* 递归方案在连接后没有返回准确尾节点，覆盖后续链；
* Rust 在持有 ``RefCell`` 借用时再次借用同一节点，引发运行时 panic；
* R 把节点误表示为普通列表并期待字段修改自动影响调用者。

本题新增知识
------------

* 用左子树右边界把局部前序顺序原地拼接；
* 原地树重连需要同时证明节点身份、可达性、无重复和无环；
* 常数空间算法仍需对边的累计扫描次数给出摊还证明。

本题强化知识
------------

* ``TreeNode`` 的跨语言引用语义；
* 覆盖指针前保存未处理后缀；
* Julia ``mutable struct`` 与 R ``environment`` 的可观察原地修改；
* Rust ``take``、短借用作用域和 ``Rc`` 句柄克隆。

关联题目
--------

* `0094. Binary Tree Inorder Traversal
  <../0001-0100/0094-binary-tree-inorder-traversal.rst>`_：统一树节点模型与遍历顺序；
* `0113. Path Sum II <0113-path-sum-ii.rst>`_：只读树上的路径回溯，与本题原地拓扑修改形成对照；
* `0099. Recover Binary Search Tree
  <../0001-0100/0099-recover-binary-search-tree.rst>`_：另一类保持节点身份的原地树修改。

最小自检
--------

#. 为什么原右子树要接到左子树的最右节点？
#. 三次指针写入为什么必须先处理原 ``right``？
#. 如何证明修改后没有丢节点、重复节点或环？
#. 主解法为什么是 ``O(n)``，而不是最坏 ``O(n^2)``？
#. Rust 和 R 实现分别依赖什么引用语义？

答案要点
~~~~~~~~

遍历 ``current``。若存在左子树，找到其沿 ``right`` 的最右节点，把原右子树接到该节点，再把左子树搬到
``current.right`` 并清空 ``current.left``。随后沿新的右链继续。
局部重连保持“根、左、右”的前序顺序，复用
全部原节点且不形成环；总时间 ``O(n)``，额外空间 ``O(1)``。
