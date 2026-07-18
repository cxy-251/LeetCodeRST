0173. Binary Search Tree Iterator
=================================

题目信息
--------

:题号: 0173
:难度: Medium
:主题: 二叉搜索树、迭代器、惰性中序遍历、显式栈
:原题: `LeetCode 0173 <https://leetcode.com/problems/binary-search-tree-iterator/>`_
:访问状态: Available
:教学重点: 递归续点栈、栈顶最小不变量、均摊 ``O(1)``、对象生命周期

精确契约
--------

构造一个二叉搜索树迭代器，支持：

* 构造时接收根节点；
* ``next`` 返回中序序列中的下一个最小值；
* ``hasNext`` 判断是否仍有未返回节点；
* 调用方只会在存在下一个元素时调用 ``next``；
* 输入满足 BST 左小右大的结构约束，键值互异，并在迭代器生命周期内保持不变。

题目要求迭代器不要预先保存完整中序序列。目标是额外空间 ``O(h)``，其中 ``h`` 为树高；
``next`` 单次最坏可以沿一条左链工作 ``O(h)``，整个遍历中每个节点只入栈、出栈一次，
因此均摊 ``O(1)``。

仓库适配器允许空根：构造后 ``hasNext`` 为假。平台提供 ``TreeNode``；Julia 与 R
复用仓库的引用节点模型。

示例与反例
----------

标准示例
~~~~~~~~

树 ``[7,3,15,null,null,9,20]`` 的中序序列是 ``3,7,9,15,20``。

构造时压入 ``7 -> 3`` 的最左路径，栈顶是 3：

#. ``next`` 返回 3，栈剩 7；
#. ``next`` 返回 7，并压入右子树 ``15 -> 9`` 的最左路径；
#. ``next`` 返回 9；
#. ``next`` 返回 15，并压入 20；
#. ``next`` 返回 20，之后 ``hasNext`` 为假。

纯左链
~~~~~~

``3 <- 2 <- 1``。构造时三节点全部入栈，随后按 ``1,2,3`` 弹出。空间达到树高 ``h``。

纯右链
~~~~~~

``1 -> 2 -> 3``。构造时只压入 1；每次弹出后再压入一个右孩子，栈深最多为 1。

单节点与空树
~~~~~~~~~~~~

单节点树构造后 ``hasNext`` 为真，一次 ``next`` 后为假。空树不压栈，始终没有下一元素。

错误的完整物化
~~~~~~~~~~~~~~

若构造时先生成完整中序数组，虽然 ``next`` 可以 ``O(1)``，额外空间却是 ``O(n)``，
没有满足题目的 ``O(h)`` 目标，也失去惰性迭代器的意义。

问题抽象与解法选择
------------------

递归中序遍历的控制流是：

``inorder(left) -> visit(root) -> inorder(right)``

显式栈保存递归调用中“左子树完成后还要访问根”的续点。辅助操作 ``pushLeft(node)``
沿 ``node`` 到最左后代逐个压栈。任意公共方法返回后：

* 栈顶节点的左侧工作已经完成，因此它是下一个应返回节点；
* 栈中更低位置保存尚未恢复的祖先续点；
* 尚未被发现的节点只位于某个待返回节点的右子树中。

``next`` 弹出栈顶并返回其值。弹出节点的左子树已经完成，根刚被访问，下一阶段只能是它的右子树；
因此只需对右孩子调用 ``pushLeft``，重新建立同一状态。

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 构造
     - ``next``
     - 空间
     - 取舍
   * - 惰性左链栈
     - ``O(h)``
     - 单次 ``O(h)``、均摊 ``O(1)``
     - ``O(h)``
     - 主解法
   * - 完整中序数组
     - ``O(n)``
     - ``O(1)``
     - ``O(n)``
     - 违反进阶空间目标
   * - Morris 线索遍历
     - ``O(1)`` 工作空间
     - 均摊 ``O(1)``
     - ``O(1)``
     - 会临时修改树；跨多次调用的恢复和释放复杂，不适合作为主接口

状态、不变量与实现映射
----------------------

递归续点不变量
~~~~~~~~~~~~~~

把普通递归中序遍历在即将访问某个节点前暂停。迭代器的栈等价于此时的递归调用栈：

* 每个栈元素是一帧尚未执行 ``visit(node)`` 的递归调用；
* 对栈顶帧，左递归已经完成，所以栈顶节点就是下一输出；
* 对更低帧，位于其左递归内部的续点由上方栈元素表示；
* 栈外但未返回的节点位于这些帧尚未进入的右子树中。

初始化时，``pushLeft(root)`` 模拟递归不断进入左子树，直到空节点返回，正好停在第一次 ``visit`` 之前。

``next`` 的状态转移
~~~~~~~~~~~~~~~~~~

设栈顶为 ``x``：

#. 弹出 ``x``，对应执行 ``visit(x)``；
#. 保存 ``x.val`` 作为本次返回值；
#. 对 ``x.right`` 执行 ``pushLeft``，对应进入右子树并持续递归左孩子；
#. 新栈再次停在下一个 ``visit`` 之前。

输入树是 BST，因此中序序列严格按非递减顺序；题目通常保证节点值唯一时就是严格递增。
算法本身只依赖树结构完成中序遍历，排序性质负责解释为什么输出是从小到大。

正确性证明
----------

引理一：``pushLeft(node)`` 后栈顶是该子树中最先应访问的节点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``pushLeft`` 依次压入 ``node``、其左孩子、左孙子，直到左指针为空。
最后压入的节点没有尚未进入的左孩子；
按中序定义，它在该子树中应最先访问。此前压入的祖先都必须等待各自左子树完成，因此位于它下方。

引理二：公共方法返回时递归续点不变量成立
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

构造后由引理一，栈正好表示从根连续进入左递归后的暂停状态，不变量成立。

假设调用 ``next`` 前不变量成立。栈顶 ``x`` 的左递归已经完成，弹出它等价于执行 ``visit(x)``。
中序遍历接下来进入 ``x.right``；对右孩子执行 ``pushLeft`` 又把控制流推进到该右子树第一次访问前。
其余较低栈帧没有改变，仍是等待中的祖先续点，所以不变量恢复。

引理三：每次 ``next`` 返回尚未返回节点中的最小值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由不变量，栈顶是递归中序遍历的下一访问节点。BST 的任意中序遍历按键值非递减输出，
因此该节点不大于所有之后才访问的未返回节点。``next`` 弹出并返回栈顶，所以返回当前最小值。

引理四：每个节点恰好返回一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

根只在构造时作为一个新子树入口；之后每个右孩子只在其父节点弹出后成为一次新子树入口。
树无环且每个非根节点只有一个父节点，因此每个节点最多被 ``pushLeft`` 压入一次。
每个已压入节点只由一次 ``next`` 弹出。递归续点不变量保证只要仍有未访问节点，栈就非空，
所以每个节点也最终会被压入和弹出一次，没有遗漏。

引理五：``hasNext`` 的返回值正确
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若栈非空，栈顶就是下一个合法节点，因此存在下一元素。若栈为空，递归续点不变量表明没有等待访问的根，
也没有尚未进入的右子树，因此全部节点已经返回。故检查栈是否为空与是否存在下一元素等价。

定理：迭代器按升序、不重不漏地返回 BST 全部节点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理三保证每次返回当前最小值，引理四保证每个节点恰好返回一次，引理五保证终止判断准确，故定理成立。

复杂度与语言成本
----------------

设树有 ``n`` 个节点，高度为 ``h``：

* 构造只压入根的最左路径，时间、空间均为 ``O(h)``；
* ``hasNext`` 只检查栈是否为空，时间 ``O(1)``；
* 一次 ``next`` 可能压入右子树整条左链，最坏 ``O(h)``；
* 整个遍历中每个节点入栈一次、出栈一次，总时间 ``O(n)``，所以 ``next`` 均摊 ``O(1)``；
* 栈始终表示一组递归续点，峰值 ``O(h)``，不保存完整输出；
* Rust 克隆 ``Rc`` 只增加引用计数，不复制子树；
* R 使用环境节点和环境栈帧维持引用语义，每个活跃帧对应一个栈节点，峰值 ``O(h)``；
* C 的动态数组按几何倍数扩容，已分配容量仍为 ``O(h)``。平台 ``next`` 没有错误返回通道，
  功能正确性以分配成功为前提；实现会记录扩容失败并阻止后续越界访问。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>

   typedef struct {
       struct TreeNode **stack;
       size_t size;
       size_t capacity;
       bool failed;
   } BSTIterator;

   static bool ensure_capacity(BSTIterator *obj, size_t required) {
       if (required <= obj->capacity) {
           return true;
       }
       if (required > SIZE_MAX / sizeof(*obj->stack)) {
           return false;
       }

       size_t next_capacity = obj->capacity == 0U ? 8U : obj->capacity;
       while (next_capacity < required) {
           if (next_capacity > SIZE_MAX / 2U) {
               next_capacity = required;
               break;
           }
           next_capacity *= 2U;
       }

       struct TreeNode **grown = realloc(
           obj->stack,
           next_capacity * sizeof(*grown)
       );
       if (grown == NULL) {
           return false;  // 旧指针仍由 obj->stack 持有
       }

       obj->stack = grown;
       obj->capacity = next_capacity;
       return true;
   }

   static bool push_left(BSTIterator *obj, struct TreeNode *node) {
       size_t count = 0U;
       for (struct TreeNode *cursor = node;
            cursor != NULL;
            cursor = cursor->left) {
           ++count;
       }

       if (count > SIZE_MAX - obj->size) {
           return false;
       }
       if (!ensure_capacity(obj, obj->size + count)) {
           return false;  // 预留失败前不修改栈内容
       }

       while (node != NULL) {
           obj->stack[obj->size++] = node;
           node = node->left;
       }
       return true;
   }

   BSTIterator *bSTIteratorCreate(struct TreeNode *root) {
       BSTIterator *obj = malloc(sizeof(*obj));
       if (obj == NULL) {
           return NULL;
       }

       obj->stack = NULL;
       obj->size = 0U;
       obj->capacity = 0U;
       obj->failed = false;

       if (!push_left(obj, root)) {
           free(obj->stack);
           free(obj);
           return NULL;
       }
       return obj;
   }

   int bSTIteratorNext(BSTIterator *obj) {
       if (obj == NULL || obj->failed || obj->size == 0U) {
           return 0;  // 官方调用合同不会进入此防御分支
       }

       struct TreeNode *node = obj->stack[--obj->size];
       if (!push_left(obj, node->right)) {
           obj->failed = true;
           obj->size = 0U;  // 平台接口无错误通道，阻止后续错误弹栈
       }
       return node->val;
   }

   bool bSTIteratorHasNext(BSTIterator *obj) {
       return obj != NULL && !obj->failed && obj->size > 0U;
   }

   void bSTIteratorFree(BSTIterator *obj) {
       if (obj == NULL) {
           return;
       }
       free(obj->stack);  // 树节点归调用方所有
       free(obj);
   }

C++
~~~

.. code-block:: cpp

   class BSTIterator {
   private:
       std::vector<TreeNode*> stack_;

       void pushLeft(TreeNode* node) {
           while (node != nullptr) {
               stack_.push_back(node);
               node = node->left;
           }
       }

   public:
       explicit BSTIterator(TreeNode* root) {
           pushLeft(root);
       }

       int next() {
           TreeNode* node = stack_.back();
           stack_.pop_back();
           pushLeft(node->right);
           return node->val;
       }

       bool hasNext() const {
           return !stack_.empty();
       }
   };

Python
~~~~~~

.. code-block:: python

   class BSTIterator:
       def __init__(self, root: Optional[TreeNode]):
           self._stack: list[TreeNode] = []
           self._push_left(root)

       def _push_left(self, node: Optional[TreeNode]) -> None:
           while node is not None:
               self._stack.append(node)
               node = node.left

       def next(self) -> int:
           node = self._stack.pop()
           self._push_left(node.right)
           return node.val

       def hasNext(self) -> bool:
           return bool(self._stack)

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.Deque;

   class BSTIterator {
       private final Deque<TreeNode> stack = new ArrayDeque<>();

       public BSTIterator(TreeNode root) {
           pushLeft(root);
       }

       private void pushLeft(TreeNode node) {
           while (node != null) {
               stack.push(node);
               node = node.left;
           }
       }

       public int next() {
           TreeNode node = stack.pop();
           pushLeft(node.right);
           return node.val;
       }

       public boolean hasNext() {
           return !stack.isEmpty();
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   struct BSTIterator {
       stack: Vec<Rc<RefCell<TreeNode>>>,
   }

   impl BSTIterator {
       fn new(root: Option<Rc<RefCell<TreeNode>>>) -> Self {
           let mut iterator = Self { stack: Vec::new() };
           iterator.push_left(root);
           iterator
       }

       fn push_left(&mut self, mut node: Option<Rc<RefCell<TreeNode>>>) {
           while let Some(current) = node {
               node = current.borrow().left.clone();
               self.stack.push(current);
           }
       }

       fn next(&mut self) -> i32 {
           let node = self.stack.pop().expect("next requires has_next");
           let (value, right) = {
               let borrowed = node.borrow();
               (borrowed.val, borrowed.right.clone())
           };
           self.push_left(right);
           value
       }

       fn has_next(&self) -> bool {
           !self.stack.is_empty()
       }
   }

Go
~~

.. code-block:: go

   type BSTIterator struct {
       stack []*TreeNode
   }

   func Constructor(root *TreeNode) BSTIterator {
       iterator := BSTIterator{stack: make([]*TreeNode, 0)}
       iterator.pushLeft(root)
       return iterator
   }

   func (this *BSTIterator) pushLeft(node *TreeNode) {
       for node != nil {
           this.stack = append(this.stack, node)
           node = node.Left
       }
   }

   func (this *BSTIterator) Next() int {
       last := len(this.stack) - 1
       node := this.stack[last]
       this.stack = this.stack[:last]
       this.pushLeft(node.Right)
       return node.Val
   }

   func (this *BSTIterator) HasNext() bool {
       return len(this.stack) > 0
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   class BSTIterator {
       private readonly stack: TreeNode[] = [];

       constructor(root: TreeNode | null) {
           this.pushLeft(root);
       }

       private pushLeft(node: TreeNode | null): void {
           while (node !== null) {
               this.stack.push(node);
               node = node.left;
           }
       }

       next(): number {
           const node = this.stack.pop() as TreeNode;
           this.pushLeft(node.right);
           return node.val;
       }

       hasNext(): boolean {
           return this.stack.length > 0;
       }
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class BSTIterator {
       private readonly Stack<TreeNode> stack = new Stack<TreeNode>();

       public BSTIterator(TreeNode root) {
           PushLeft(root);
       }

       private void PushLeft(TreeNode node) {
           while (node != null) {
               stack.Push(node);
               node = node.left;
           }
       }

       public int Next() {
           TreeNode node = stack.Pop();
           PushLeft(node.right);
           return node.val;
       }

       public bool HasNext() {
           return stack.Count > 0;
       }
   }

Julia
~~~~~

.. code-block:: julia

   mutable struct BSTIterator
       stack::Vector{TreeNode}
   end

   function push_left!(
       iterator::BSTIterator,
       node::Union{TreeNode, Nothing},
   )::Nothing
       current = node
       while current !== nothing
           push!(iterator.stack, current)
           current = current.left
       end
       return nothing
   end

   function BSTIterator(root::Union{TreeNode, Nothing})
       iterator = BSTIterator(TreeNode[])
       push_left!(iterator, root)
       return iterator
   end

   function next!(iterator::BSTIterator)::Int
       node = pop!(iterator.stack)
       push_left!(iterator, node.right)
       return node.val
   end

   has_next(iterator::BSTIterator)::Bool = !isempty(iterator.stack)

R
~

.. code-block:: r

   new_bst_iterator <- function(root) {
     iterator <- new.env(parent = emptyenv())
     iterator$top <- NULL

     push_left <- function(node) {
       current <- node
       while (!is.null(current)) {
         frame <- new.env(parent = emptyenv())
         frame$node <- current
         frame$next <- iterator$top
         iterator$top <- frame
         current <- current$left
       }
       invisible(NULL)
     }

     iterator$next <- function() {
       frame <- iterator$top
       iterator$top <- frame$next
       node <- frame$node
       push_left(node$right)
       node$val
     }

     iterator$has_next <- function() {
       !is.null(iterator$top)
     }

     push_left(root)
     iterator
   }

静态审查记录
------------

本题题解代码未运行、未编译、未对拍。完成了以下人工与静态检查：

* 标准树 ``[7,3,15,null,null,9,20]`` 的栈状态依次产生 ``3,7,9,15,20``；
* 空树构造不压栈；单节点一次弹出；纯左链构造压入全部路径；纯右链每次只增加一个节点；
* 所有实现都只在构造和弹出后调用 ``pushLeft``，没有提前物化完整中序数组；
* 十语言 ``hasNext`` 都只检查迭代器栈状态，不扫描树；
* Rust 在释放 ``RefCell`` 借用后再调用 ``push_left``，避免借用跨越可变访问；
* Julia 使用 ``mutable struct`` 保存持久栈；R 使用 ``environment`` 保存对象状态和链式栈帧；
* C 的 ``realloc`` 使用临时指针，扩容前先检查大小加法与容量乘法，构造失败释放对象与栈；
* C 的释放函数只释放迭代器资源，不释放调用方拥有的树节点；
* 每个节点只可能由根入口或唯一父节点的右子树入口压入一次，均摊分析与实现一致。

剩余风险：未在目标平台实际编译或执行。C 的平台签名不能向调用方报告 ``next`` 期间的内存失败；
实现以 ``failed`` 状态阻止后续访问，正常题目语义仍以分配成功为前提。

边界、失败路径与易错点
----------------------

* 栈中保存的是等待访问的节点引用，不拥有树节点；迭代期间不得释放或修改输入树；
* 构造时只压最左路径，不应遍历右子树；
* 弹出节点后必须进入其右子树，再压该右子树的最左路径；
* 只给 ``next`` 的总 ``O(n)`` 不够；应区分单次最坏 ``O(h)`` 与均摊 ``O(1)``；
* 预存完整中序数组会把工作空间变成 ``O(n)``；
* Rust 不应在持有 ``borrow()`` 的作用域内调用需要 ``&mut self`` 的方法；
* R 普通列表对象容易产生值复制，环境对象才能稳定保存跨调用的可变状态；
* C 在计算 ``size + count`` 前必须检查加法溢出，再把所需容量交给扩容函数；
* C 若直接把 ``realloc`` 结果覆盖旧指针，失败时会丢失原分配并泄漏。

知识更新与关联题目
------------------

新增
~~~~

* **惰性 BST 迭代器**：只展开当前消费所需的左链，把一次性遍历拆成多次调用；
* **迭代器级均摊证明**：单次可能沿左链工作，但每个树节点只承担一次入栈和出栈成本；
* **无重无漏入口证明**：根和各节点右子树形成唯一入口，保证每个节点恰好弹出一次。

强化
~~~~

* 复用 0094 的显式中序栈与递归续点不变量，本题把栈保存为跨调用对象状态；
* 复用 0144 的只读树节点引用栈，不复制或拥有输入树节点；
* 复用 0155 的持久可变栈对象、几何扩容和无错误通道资源限制；
* Rust 延续 0114 的短 ``RefCell`` 借用纪律，先取得值与右孩子句柄，再修改迭代器。

关联题目
~~~~~~~~

* 0094 Binary Tree Inorder Traversal：一次性中序遍历，本题把同一控制流拆成多次调用；
* 0098 Validate Binary Search Tree：使用 BST 中序有序性质；
* 0230 Kth Smallest Element in a BST：可用同一惰性中序在第 ``k`` 次弹栈停止；
* 0341 Flatten Nested List Iterator：另一类惰性迭代器与栈状态。

自检问题
--------

#. 为什么栈顶一定是下一个中序节点？
#. 弹出节点后为什么只需要处理它的右子树最左路径？
#. ``next`` 为什么是均摊 ``O(1)``，而不是每次严格 ``O(1)``？
#. 为什么完整中序数组不满足本题进阶要求？
#. C 版本为什么不能直接写 ``obj->stack = realloc(...)``？

答案要点
~~~~~~~~

#. 栈表示暂停的递归中序调用，栈顶帧的左递归已经完成，正等待访问根。
#. 中序在访问根后唯一的下一阶段是右子树，而右子树内部仍应先访问最左节点。
#. 单次可能压入 ``O(h)`` 节点；整个遍历每个节点只入栈一次，总压栈成本 ``O(n)``。
#. 它保存全部 ``n`` 个结果，额外空间是 ``O(n)``，失去惰性和 ``O(h)`` 目标。
#. 失败时 ``realloc`` 返回空指针；直接覆盖会丢失仍然有效的旧地址并造成泄漏。
