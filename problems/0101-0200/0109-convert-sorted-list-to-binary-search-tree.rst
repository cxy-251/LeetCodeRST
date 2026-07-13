0109. Convert Sorted List to Binary Search Tree
===============================================

题目信息
--------

:题号: 0109
:难度: Medium
:主题: 链表、二叉搜索树、分治、中序模拟
:原题: `LeetCode 0109 <https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/>`_
:访问状态: Available
:教学重点: 链表顺序游标、中序构造、节点数量分治、引用与所有权

题目重述
--------

给定一个按非递减顺序排列的单链表，构造一棵高度平衡的二叉搜索树并返回根节点。链表可以为空，也允许出现
重复值。高度平衡仍指任意节点左右子树高度差不超过 1。

链表只支持从当前节点沿 ``next`` 向后移动，不能像数组那样在 ``O(1)`` 时间读取中点。函数需要保持输入链表
的逻辑值序列；C、C++、Python、Java、Go、TypeScript、C#、Julia 和 R 的实现不修改链表链接。Rust 平台
入口按值接收链表，本文实现只借用节点读取值，函数结束后输入所有权自然释放。

自建示例
--------

普通输入
~~~~~~~~

.. code-block:: text

   head = -10 -> -3 -> 0 -> 5 -> 9

              0
            /   \
          -3     9
          /     /
        -10    5

输出树的中序遍历仍是 ``[-10, -3, 0, 5, 9]``，并且每个节点左右高度差不超过 1。

偶数长度与重复值
~~~~~~~~~~~~~~~~

.. code-block:: text

   head = 1 -> 1 -> 2 -> 3

选择哪一个中间位置都允许。本文按左子树大小 ``size / 2`` 构造，因此当前根对应第 3 个值 ``2``。
重复值仍保持中序非递减；题目要求的是合法 BST 结构，不要求值严格互异。

空链表
~~~~~~

.. code-block:: text

   head = null
   输出：null

问题抽象
--------

数组版本 `0108. Convert Sorted Array to Binary Search Tree
<0108-convert-sorted-array-to-binary-search-tree.rst>`_ 可以直接读取区间中点。链表若在每层使用快慢指针寻找中点，
每个递归层都会重复扫描子链表，最坏总时间达到 ``O(n log n)``。

更好的观察来自二叉搜索树的中序遍历：

.. code-block:: text

   左子树 -> 根 -> 右子树

这与有序链表从左到右的值顺序完全一致。于是先统计节点总数，再用 ``build(size)`` 按中序顺序构造：

#. 递归构造 ``size / 2`` 个节点组成的左子树；
#. 当前链表游标指向根值，创建根并把游标前进一格；
#. 递归构造剩余节点组成的右子树。

算法从不需要随机访问中点；链表游标只单向前进一次。

基础类型约定
------------

平台提供 ``ListNode`` 和 ``TreeNode``：

* ``ListNode`` 含整数值和 ``next``；
* ``TreeNode`` 含整数值、``left`` 和 ``right``；
* Julia 使用仓库统一的可变节点；
* R 用 ``environment`` 表达节点引用，并使用显式状态环境保存共享游标；
* Rust 链表是 ``Option<Box<ListNode>>``，树是 ``Option<Rc<RefCell<TreeNode>>>``。

返回树节点全部新建，不与链表节点共享身份。链表节点不会被重连到树中。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 计数后中序模拟
     - ``O(n)``
     - ``O(log n)`` 调用栈
     - 主解法；游标只前进一次
   * - 每层快慢指针找中点
     - ``O(n log n)``
     - ``O(log n)`` 调用栈
     - 不修改链表，但重复扫描
   * - 复制到数组再调用 0108
     - ``O(n)``
     - ``O(n)`` 数组加 ``O(log n)`` 栈
     - 简单可靠，但增加线性适配器空间
   * - 断链后快慢指针分治
     - ``O(n log n)``
     - ``O(log n)`` 调用栈
     - 会修改输入拓扑，不采用

主解法：计数后中序模拟
----------------------

状态定义
~~~~~~~~

先扫描链表得到 ``n``。递归函数 ``build(size)`` 与共享游标 ``current`` 保持：

* 调用开始时，``current`` 指向当前子树中序序列的第一个链表节点；
* 调用恰好消费连续 ``size`` 个链表节点；
* 返回树的中序遍历等于这 ``size`` 个值；
* 调用结束时，``current`` 指向紧随该片段之后的节点；
* 返回树高度平衡。

令：

.. code-block:: text

   left_size  = size // 2
   right_size = size - left_size - 1

左、右节点数至多相差 1。先调用 ``build(left_size)`` 后，游标已经越过全部左子树值，恰好停在根值。读取根后
前进一步，再构造右子树。

为什么必须先构造左子树
~~~~~~~~~~~~~~~~~~~~~~

链表游标按中序顺序移动。当前子树的根不是片段第一个值，而是左子树片段之后的值。若先创建根，游标仍指向
最小值，会把最小值错误放到根位置。数组方案可以随机读取中点，链表方案必须让递归消费顺序与中序遍历一致。

具体推演
~~~~~~~~

以 5 个节点为例：

.. list-table::
   :header-rows: 1

   * - 调用
     - 左侧消费
     - 根值
     - 右侧消费
   * - ``build(5)``
     - ``build(2)`` 消费 ``-10, -3``
     - ``0``
     - ``build(2)`` 消费 ``5, 9``
   * - 左侧 ``build(2)``
     - ``build(1)`` 消费 ``-10``
     - ``-3``
     - ``build(0)``
   * - 右侧 ``build(2)``
     - ``build(1)`` 消费 ``5``
     - ``9``
     - ``build(0)``

游标始终只向后移动，没有回退或重复扫描。

正确性依据
~~~~~~~~~~

对 ``size`` 做归纳。

**基础情况。** ``size = 0`` 时返回空树，不消费链表节点，不变量成立。``size = 1`` 时左、右大小均为 0，
当前节点成为根并前进一格，得到单节点平衡 BST。

**归纳步骤。** 对 ``size > 1``，左调用按归纳假设消费前 ``left_size`` 个值并构造平衡 BST。由于链表非递减，
这些值都不大于随后根值。读取根并前进后，右调用消费后 ``right_size`` 个值，它们都不小于根值。因此组合后
中序顺序与原链表片段一致，满足题目允许重复值的 BST 顺序。左右规模至多相差 1，递归构造的高度至多相差 1，
当前树平衡。

**完整性与无重复。** 左侧、根、右侧消费数量之和恰好是 ``size``，共享游标每次读取后只前进一次，所以每个
链表节点值恰好用于一个树节点。

**输入副作用。** 除 Rust 入口按值接收后自然释放外，其余实现只读取 ``next``，不重连链表。返回树节点全部
独立创建。

**终止性。** 每次递归参数变为严格更小的左右规模，最终到 0。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 第一次扫描计数 ``O(n)``，构造阶段每个节点再访问一次，总时间 ``O(n)``；
* 构造出的树平衡，递归深度 ``O(log n)``；
* 返回树载荷 ``Theta(n)``；
* C 的辅助函数使用 ``struct ListNode **current`` 共享游标；树节点分配失败时释放已经构造的左右子树；
* C++ 使用指针引用，Java/C# 使用对象字段，Python/Go/TypeScript 使用词法闭包；
* Rust 使用带生命周期的只读节点引用作为游标，``Rc`` 只用于新树；
* Julia 使用 ``Ref``，R 使用显式 ``environment``，避免把父调用帧中的普通局部重绑定误认为递归共享状态。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>

   static void free_tree(struct TreeNode *root) {
       if (root == NULL) {
           return;
       }
       free_tree(root->left);
       free_tree(root->right);
       free(root);
   }

   static size_t list_length(const struct ListNode *head) {
       size_t length = 0;
       for (const struct ListNode *node = head; node != NULL; node = node->next) {
           ++length;
       }
       return length;
   }

   static struct TreeNode *build_balanced(
       const struct ListNode **current,
       size_t size,
       bool *ok
   ) {
       if (!*ok || size == 0) {
           return NULL;
       }

       const size_t left_size = size / 2;
       struct TreeNode *left = build_balanced(current, left_size, ok);
       if (!*ok || *current == NULL) {
           free_tree(left);
           *ok = false;
           return NULL;
       }

       struct TreeNode *root = malloc(sizeof(*root));
       if (root == NULL) {
           free_tree(left);
           *ok = false;
           return NULL;
       }

       root->val = (*current)->val;
       *current = (*current)->next;
       root->left = left;
       root->right = build_balanced(
           current,
           size - left_size - 1,
           ok
       );

       if (!*ok) {
           free_tree(root);
           return NULL;
       }
       return root;
   }

   struct TreeNode *sortedListToBST(struct ListNode *head) {
       const size_t size = list_length(head);
       const struct ListNode *current = head;
       bool ok = true;
       struct TreeNode *root = build_balanced(&current, size, &ok);
       return ok ? root : NULL;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
       ListNode* current = nullptr;

       TreeNode* build(int size) {
           if (size == 0) {
               return nullptr;
           }

           const int leftSize = size / 2;
           TreeNode* left = build(leftSize);

           auto* root = new TreeNode(current->val);
           current = current->next;
           root->left = left;
           root->right = build(size - leftSize - 1);
           return root;
       }

   public:
       TreeNode* sortedListToBST(ListNode* head) {
           int size = 0;
           for (ListNode* node = head; node != nullptr; node = node->next) {
               ++size;
           }
           current = head;
           return build(size);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def sortedListToBST(
           self,
           head: Optional[ListNode],
       ) -> Optional[TreeNode]:
           size = 0
           node = head
           while node is not None:
               size += 1
               node = node.next

           current = head

           def build(count: int) -> Optional[TreeNode]:
               nonlocal current
               if count == 0:
                   return None

               left_size = count // 2
               left = build(left_size)

               root = TreeNode(current.val)
               current = current.next
               root.left = left
               root.right = build(count - left_size - 1)
               return root

           return build(size)

Java
~~~~

.. code-block:: java

   class Solution {
       private ListNode current;

       public TreeNode sortedListToBST(ListNode head) {
           int size = 0;
           for (ListNode node = head; node != null; node = node.next) {
               ++size;
           }
           current = head;
           return build(size);
       }

       private TreeNode build(int size) {
           if (size == 0) {
               return null;
           }

           int leftSize = size / 2;
           TreeNode left = build(leftSize);

           TreeNode root = new TreeNode(current.val);
           current = current.next;
           root.left = left;
           root.right = build(size - leftSize - 1);
           return root;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn sorted_list_to_bst(
           head: Option<Box<ListNode>>,
       ) -> Option<Rc<RefCell<TreeNode>>> {
           fn length(mut node: Option<&ListNode>) -> usize {
               let mut size = 0;
               while let Some(current) = node {
                   size += 1;
                   node = current.next.as_deref();
               }
               size
           }

           fn build<'a>(
               current: &mut Option<&'a ListNode>,
               size: usize,
           ) -> Option<Rc<RefCell<TreeNode>>> {
               if size == 0 {
                   return None;
               }

               let left_size = size / 2;
               let left = build(current, left_size);

               let node = current.take().expect("节点数量来自同一链表");
               *current = node.next.as_deref();
               let root = Rc::new(RefCell::new(TreeNode::new(node.val)));
               root.borrow_mut().left = left;
               root.borrow_mut().right = build(
                   current,
                   size - left_size - 1,
               );
               Some(root)
           }

           let size = length(head.as_deref());
           let mut current = head.as_deref();
           build(&mut current, size)
       }
   }

Go
~~

.. code-block:: go

   func sortedListToBST(head *ListNode) *TreeNode {
       size := 0
       for node := head; node != nil; node = node.Next {
           size++
       }

       current := head
       var build func(int) *TreeNode
       build = func(count int) *TreeNode {
           if count == 0 {
               return nil
           }

           leftSize := count / 2
           left := build(leftSize)

           root := &TreeNode{Val: current.Val}
           current = current.Next
           root.Left = left
           root.Right = build(count - leftSize - 1)
           return root
       }

       return build(size)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sortedListToBST(head: ListNode | null): TreeNode | null {
       let size = 0;
       for (let node = head; node !== null; node = node.next) {
           size++;
       }

       let current = head;
       const build = (count: number): TreeNode | null => {
           if (count === 0) {
               return null;
           }

           const leftSize = Math.floor(count / 2);
           const left = build(leftSize);

           const root = new TreeNode(current!.val);
           current = current!.next;
           root.left = left;
           root.right = build(count - leftSize - 1);
           return root;
       };

       return build(size);
   }

``current!`` 由“初始计数与同一链表一致、每次调用恰好消费 ``count`` 个节点”的不变量支撑，不是无条件忽略
``null``。

C#
~~

.. code-block:: csharp

   public class Solution {
       private ListNode current;

       public TreeNode SortedListToBST(ListNode head) {
           int size = 0;
           for (ListNode node = head; node != null; node = node.next) {
               ++size;
           }
           current = head;
           return Build(size);
       }

       private TreeNode Build(int size) {
           if (size == 0) {
               return null;
           }

           int leftSize = size / 2;
           TreeNode left = Build(leftSize);

           var root = new TreeNode(current.val);
           current = current.next;
           root.left = left;
           root.right = Build(size - leftSize - 1);
           return root;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function sorted_list_to_bst(head::Union{ListNode, Nothing})
       size = 0
       node = head
       while node !== nothing
           size += 1
           node = node.next
       end

       current = Ref{Union{ListNode, Nothing}}(head)

       function build(count::Int)
           count == 0 && return nothing

           left_size = count ÷ 2
           left = build(left_size)

           node = something(current[])
           current[] = node.next
           root = TreeNode(node.val)
           root.left = left
           root.right = build(count - left_size - 1)
           return root
       end

       return build(size)
   end

``Ref`` 保存共享游标槽位；普通局部变量 ``current = current.next`` 只会重绑定当前函数作用域，不能表达这里的跨递归
共享状态。

R
~

.. code-block:: r

   sorted_list_to_bst <- function(head) {
     size <- 0L
     node <- head
     while (!is.null(node)) {
       size <- size + 1L
       node <- node$next
     }

     state <- new.env(parent = emptyenv())
     state$current <- head

     build <- function(count) {
       if (count == 0L) {
         return(NULL)
       }

       left_size <- count %/% 2L
       left <- build(left_size)

       node <- state$current
       state$current <- node$next
       root <- new_tree_node(node$val)
       root$left <- left
       root$right <- build(count - left_size - 1L)
       root
     }

     build(size)
   }

R 使用显式环境保存游标。这样每个递归调用都读取同一个 ``state$current`` 槽位，不依赖调用者帧，也不需要
``<<-`` 搜索父绑定。

验证计划与证据
--------------

* 固定用例覆盖空链表、单节点、偶数长度、奇数长度、重复值、全负数和 20,000 节点输入；
* 随机生成非递减数组并转成链表，验证返回树中序遍历等于原序列；
* 递归检查每个节点左右高度差不超过 1；
* 对不修改输入的语言在调用前后序列化链表，确认值与 ``next`` 顺序不变；
* 与“复制到数组后按中点构造”的独立基准比较中序序列、节点数和平衡性；
* C/C++ 使用严格警告、ASan 和 UBSan；有运行时的其余语言执行固定与随机用例；
* Rust、C#、Julia、R 缺少运行时时只记录静态接口、生命周期、共享状态和空值检查。

关键边界
--------

* 空链表的计数为 0，构造函数不能读取当前游标；
* 重复值允许出现，验证 BST 时使用中序非递减，不使用严格递增；
* 递归深度由构造出的平衡树决定，是 ``O(log n)``；
* 输入链表节点与返回树节点身份独立；
* Rust 的参数按值传入，调用者不能在调用后继续使用原链表，这是平台所有权接口本身的语义。

易错点
------

* 每层使用快慢指针找中点，却仍把复杂度写成 ``O(n)``；
* 在构造左子树前读取当前节点，把最小值放到根；
* 右子树大小写成 ``size - left_size``，重复多构造一个节点；
* R 使用普通局部重绑定假设子调用能看到父调用的 ``current``；
* C 分配根失败时遗漏释放已经完成的左子树。

本题新增知识
------------

* 用中序遍历顺序把链表单向扫描转化为平衡 BST 构造；
* ``build(size)`` 的精确消费数量不变量；
* 共享链表游标在十语言中的闭包、引用、字段和环境表达。

本题强化知识
------------

* `数组版本 0108
  <0108-convert-sorted-array-to-binary-search-tree.rst>`_ 的平衡规模划分；
* 返回树载荷与递归栈分开计费；
* R 递归共享状态必须使用显式可变容器或经过审计的外层绑定。

关联题目
--------

* `数组中点构造题 0108
  <0108-convert-sorted-array-to-binary-search-tree.rst>`_：随机访问中点与单向游标的对照；
* `0094. Binary Tree Inorder Traversal
  <../0001-0100/0094-binary-tree-inorder-traversal.rst>`_：中序顺序是本题构造消费顺序。

最小自检
--------

#. 为什么先统计长度后，链表游标只需要向前移动一次？
#. ``build(size)`` 调用完成后，游标应该停在哪里？
#. 为什么构造左子树必须发生在读取根值之前？
#. R 的共享游标为什么使用 ``environment``？
#. Rust 实现是否修改了链表节点？调用后为什么仍不能使用原链表？

答案要点
~~~~~~~~

``build(size)`` 先消费 ``size // 2`` 个值构造左子树，此时游标恰好指向根值；读取并前进一步后，再消费剩余
值构造右子树。每个链表节点只访问一次，时间 ``O(n)``；左右规模至多相差 1，调用栈 ``O(log n)``，返回树
``Theta(n)``。
