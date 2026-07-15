0144. Binary Tree Preorder Traversal
====================================

题目信息
--------

:题号: 0144
:难度: Easy
:主题: 二叉树、深度优先搜索、显式栈
:原题: `LeetCode 0144 <https://leetcode.com/problems/binary-tree-preorder-traversal/>`_
:访问状态: Available
:教学重点: 有序待访问前沿、先右后左压栈、工作空间与输出载荷

精确契约
--------

输入 ``root`` 是一棵合法二叉树的根节点，也可以为空。需要返回所有节点值的前序序列：对每棵非空子树，
先记录根节点，再完整遍历左子树，最后完整遍历右子树。空树返回空序列。

公开题面给出的节点数范围是 ``0`` 到 ``100``，节点值范围是 ``[-100, 100]``。作为“树”，输入还隐含：

* 从根可达的结构无环；
* 每个非根节点只有一个父节点；
* 左、右孩子不会让同一节点成为两个位置共享的子树。

这些前提使“不使用访问集合且每个节点只入栈一次”成立；若输入扩展为一般图或共享子树 DAG，就必须增加
访问状态，并重新定义重复到达节点时的输出语义。

函数返回节点值，不返回节点引用。遍历必须只读：调用前后每个节点的 ``val``、``left`` 和 ``right``
都保持不变。重复值允许出现，输出中的每一项对应一个结构位置，不能用值去重。

自建例子
--------

考虑下面这棵有重复值且左右不对称的树；字母表示节点身份，括号内是值：

.. code-block:: text

          A(4)
         /    \
      B(-1)   C(4)
        \      /
        D(2) E(0)

正确前序的身份顺序是 ``A, B, D, C, E``，返回值为 ``[4, -1, 2, 4, 0]``。两个值为 ``4`` 的节点
不能合并。若弹出 ``A`` 后先压左孩子、再压右孩子，右孩子 ``C`` 会先弹出，错误地得到
``A, C, E, B, D``。

空树返回 ``[]``；单节点树 ``A`` 返回 ``[A.val]``。只有左孩子或只有右孩子的链都按从根到叶的顺序返回，
但它们不足以暴露“双孩子时压栈顺序写反”的错误，所以主例必须同时包含左右子树。

问题抽象与解法选择
------------------

递归定义可以写成：

``Pre(u) = [u] + Pre(u.left) + Pre(u.right)``。

递归实现最直接，调用栈保存“左子树完成后还要处理右子树”的续点，时间 ``O(n)``、调用栈 ``O(h)``。
题目的进阶要求是迭代实现，因此需要把这些尚未处理的子树根显式保存下来。

还可以使用 Morris 前序遍历把工作空间降到 ``O(1)``，但它会暂时写入树中的空右指针，并要求所有路径
无条件恢复。当前题节点数很小，且契约强调输入只读；为了避免把临时拓扑修改和恢复义务引入主解，选择
显式栈。它与递归的子问题顺序直接对应，工作空间仍为树高数量级。

状态、顺序与核心不变量
----------------------

代码维护两个容器：

* ``values``：已经提交的前序值前缀；
* ``stack``：尚未访问子树的根。代码数组从底到顶存储，证明中把栈顶到栈底记作
  ``F0, F1, ..., Fk``。

循环入口的不变量是：

#. ``values`` 正好是完整前序序列已经提交的前缀；
#. 尚未提交的前序序列恰好是
   ``Pre(F0) + Pre(F1) + ... + Pre(Fk)``；
#. 各 ``Fi`` 所代表的子树两两不相交，并且与已提交节点集合不相交；
#. 树中的每个节点要么已经提交，要么恰好属于上述一个待访问子树。

这个不变量比“栈顶是下一个节点”更强：它同时规定了栈中所有待访问子树的次序，因此能够证明左子树会
完整先于右子树，而不只是证明左孩子恰好下一次先弹出。

迭代步骤
--------

若根非空，初始只把 ``root`` 压栈。每轮：

#. 弹出栈顶 ``node``，把 ``node.val`` 追加到 ``values``；
#. 若右孩子存在，先压入右孩子；
#. 若左孩子存在，再压入左孩子。

栈后进先出，所以压入后的栈顶到栈底顺序先出现左孩子，再出现右孩子，随后才是原来其余待访问子树。
空孩子不入栈，因为它既不产生输出，也不需要保存续点。

正确性证明
----------

引理一：循环不变量始终成立
~~~~~~~~~~~~~~~~~~~~~~~~~~

**初始化。** ``values`` 为空，栈顶到栈底只有 ``root``。尚未提交序列就是 ``Pre(root)``，全部节点恰好
属于这一棵待访问子树；若根为空则算法直接返回空序列，契约成立。

**保持。** 假设本轮弹出 ``F0 = u``。根据前序定义：

``Pre(u) = [u] + Pre(u.left) + Pre(u.right)``。

算法先提交 ``u``，再先压右孩子、后压左孩子，因此新的栈顶到栈底序列是
``u.left, u.right, F1, ...``，其中空孩子被省略。新的未提交序列正好成为
``Pre(u.left) + Pre(u.right) + Pre(F1) + ...``，与删除 ``Pre(u)`` 的首项后完全一致。

合法树的左右子树互不相交，且不包含 ``u``；所以提交 ``u`` 并把两个非空孩子作为新子树根，不会让节点
丢失、重复归属或进入两个待访问子树。四条不变量全部保持。

引理二：每个节点恰好提交一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

根节点只在初始化时入栈。每个非根节点只有一个父节点，并且只在该父节点弹出时、作为其某一个非空孩子
入栈一次。因此每个节点至多入栈一次。另一方面，不变量始终覆盖全部尚未提交节点；循环只有在栈空时结束，
所以结束时不存在尚未提交节点，每个节点至少提交一次。两者合并即为恰好一次。

引理三：算法终止且不修改输入树
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理二，最多有 ``n`` 次入栈和 ``n`` 次弹栈。每轮弹出一个此前未提交的节点，因此有限步后栈为空。
代码只读取 ``val``、``left``、``right`` 并修改局部栈与结果容器，从未给树节点字段赋值，输入树保持不变。

定理：返回序列是完整前序遍历
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

循环结束时栈为空。由引理一，尚未提交序列为空，``values`` 是完整前序序列的前缀，也就等于完整序列；
引理二排除了遗漏和重复，引理三保证终止与只读副作用。因此算法满足契约。

复杂度与资源成本
----------------

设节点数为 ``n``、树高为 ``h``，空树高度按 ``0`` 计：

* 每个节点入栈、出栈和记录各一次，时间为 ``O(n)``；
* 栈只保存当前深度优先路径各层尚待访问的兄弟子树根，同一深度至多贡献一个续点，峰值为 ``O(h)``；
* 返回序列必须物化 ``n`` 个整数，输出载荷为 ``Theta(n)``，不能藏进 ``O(h)`` 工作空间声明；
* 退化树有 ``h=n``，所以最坏工作空间为 ``O(n)``；平衡树的 ``h=O(log n)`` 只是特例；
* C 的动态数组容量按倍增策略可能略大于实际数量，但仍分别为 ``O(h)`` 栈容量和 ``O(n)`` 返回容量。

大多数语言直接把 ``values`` 作为返回容器。R 适配器先在 environment 中保存值槽位，再用 ``vapply``
物化返回整数向量；因此它除 ``O(h)`` 活跃栈槽位外，还有 ``O(n)`` 环境值槽位，并在物化时与返回向量
同时存在，峰值适配器空间为 ``O(n)``。在官方 ``n<=100`` 下，字符串键长度有固定上界；哈希 environment
查找按通常平均常数时间计，故 R 的通常时间仍为 ``O(n)``。
最坏查找界取决于 R 运行时 environment 的哈希实现，不把平均界写成无条件最坏界。

语言接口约定
------------

以下实现复用平台提供的 ``TreeNode``，不重复定义节点类型。C 成功返回的整数缓冲由调用者释放；空树和
分配失败都表现为 ``NULL`` 且 ``returnSize=0``，平台签名无法区分这两种情况。其余语言返回本语言的整数
序列容器。Julia 的节点是仓库统一可变引用节点，R 的节点是带 ``val``、``left``、``right`` 字段的
environment；本题只读它们。

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>

   static int grow_preorder_buffer(
       void **buffer,
       size_t *capacity,
       size_t element_size
   ) {
       size_t next_capacity;
       if (*capacity == 0) {
           next_capacity = 16;
       } else {
           if (*capacity > SIZE_MAX / 2) {
               return 0;
           }
           next_capacity = *capacity * 2;
       }
       if (next_capacity > SIZE_MAX / element_size) {
           return 0;
       }

       void *grown = realloc(
           *buffer,
           next_capacity * element_size
       );
       if (grown == NULL) {
           return 0;
       }
       *buffer = grown;
       *capacity = next_capacity;
       return 1;
   }

   int *preorderTraversal(
       struct TreeNode *root,
       int *returnSize
   ) {
       *returnSize = 0;
       if (root == NULL) {
           return NULL;
       }

       struct TreeNode **stack = NULL;
       size_t stack_size = 0;
       size_t stack_capacity = 0;
       int *values = NULL;
       size_t value_count = 0;
       size_t value_capacity = 0;

       if (!grow_preorder_buffer(
               (void **)&stack,
               &stack_capacity,
               sizeof(*stack)
           )) {
           return NULL;
       }
       stack[stack_size++] = root;

       while (stack_size > 0) {
           struct TreeNode *node = stack[--stack_size];

           if (value_count == value_capacity &&
               !grow_preorder_buffer(
                   (void **)&values,
                   &value_capacity,
                   sizeof(*values)
               )) {
               free(stack);
               free(values);
               return NULL;
           }
           values[value_count++] = node->val;

           if (node->right != NULL) {
               if (stack_size == stack_capacity &&
                   !grow_preorder_buffer(
                       (void **)&stack,
                       &stack_capacity,
                       sizeof(*stack)
                   )) {
                   free(stack);
                   free(values);
                   return NULL;
               }
               stack[stack_size++] = node->right;
           }
           if (node->left != NULL) {
               if (stack_size == stack_capacity &&
                   !grow_preorder_buffer(
                       (void **)&stack,
                       &stack_capacity,
                       sizeof(*stack)
                   )) {
                   free(stack);
                   free(values);
                   return NULL;
               }
               stack[stack_size++] = node->left;
           }
       }

       free(stack);
       *returnSize = (int)value_count;
       return values;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       std::vector<int> preorderTraversal(TreeNode *root) {
           std::vector<int> values;
           if (root == nullptr) {
               return values;
           }

           std::vector<TreeNode *> stack{root};
           while (!stack.empty()) {
               TreeNode *node = stack.back();
               stack.pop_back();
               values.push_back(node->val);

               if (node->right != nullptr) {
                   stack.push_back(node->right);
               }
               if (node->left != nullptr) {
                   stack.push_back(node->left);
               }
           }
           return values;
       }
   };

Python
~~~~~~

.. code-block:: python

   from typing import List, Optional


   class Solution:
       def preorderTraversal(
           self,
           root: Optional[TreeNode],
       ) -> List[int]:
           if root is None:
               return []

           values: List[int] = []
           stack = [root]
           while stack:
               node = stack.pop()
               values.append(node.val)

               if node.right is not None:
                   stack.append(node.right)
               if node.left is not None:
                   stack.append(node.left)

           return values

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.ArrayList;
   import java.util.Deque;
   import java.util.List;

   class Solution {
       public List<Integer> preorderTraversal(TreeNode root) {
           List<Integer> values = new ArrayList<>();
           if (root == null) {
               return values;
           }

           Deque<TreeNode> stack = new ArrayDeque<>();
           stack.push(root);
           while (!stack.isEmpty()) {
               TreeNode node = stack.pop();
               values.add(node.val);

               if (node.right != null) {
                   stack.push(node.right);
               }
               if (node.left != null) {
                   stack.push(node.left);
               }
           }
           return values;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn preorder_traversal(
           root: Option<Rc<RefCell<TreeNode>>>,
       ) -> Vec<i32> {
           let Some(root) = root else {
               return Vec::new();
           };

           let mut values = Vec::new();
           let mut stack = vec![root];
           while let Some(node) = stack.pop() {
               let (value, left, right) = {
                   let borrowed = node.borrow();
                   (
                       borrowed.val,
                       borrowed.left.clone(),
                       borrowed.right.clone(),
                   )
               };
               values.push(value);

               if let Some(right) = right {
                   stack.push(right);
               }
               if let Some(left) = left {
                   stack.push(left);
               }
           }
           values
       }
   }

Go
~~

.. code-block:: go

   func preorderTraversal(root *TreeNode) []int {
       if root == nil {
           return []int{}
       }

       values := make([]int, 0)
       stack := []*TreeNode{root}
       for len(stack) > 0 {
           last := len(stack) - 1
           node := stack[last]
           stack = stack[:last]
           values = append(values, node.Val)

           if node.Right != nil {
               stack = append(stack, node.Right)
           }
           if node.Left != nil {
               stack = append(stack, node.Left)
           }
       }
       return values
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function preorderTraversal(root: TreeNode | null): number[] {
       if (root === null) {
           return [];
       }

       const values: number[] = [];
       const stack: TreeNode[] = [root];
       while (stack.length > 0) {
           const node = stack.pop()!;
           values.push(node.val);

           if (node.right !== null) {
               stack.push(node.right);
           }
           if (node.left !== null) {
               stack.push(node.left);
           }
       }
       return values;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<int> PreorderTraversal(TreeNode root) {
           List<int> values = new List<int>();
           if (root == null) {
               return values;
           }

           Stack<TreeNode> stack = new Stack<TreeNode>();
           stack.Push(root);
           while (stack.Count > 0) {
               TreeNode node = stack.Pop();
               values.Add(node.val);

               if (node.right != null) {
                   stack.Push(node.right);
               }
               if (node.left != null) {
                   stack.Push(node.left);
               }
           }
           return values;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function preorder_traversal(
       root::Union{Nothing, TreeNode},
   )::Vector{Int}
       root === nothing && return Int[]

       values = Int[]
       stack = TreeNode[root]
       while !isempty(stack)
           node = pop!(stack)
           push!(values, node.val)

           node.right !== nothing && push!(stack, node.right)
           node.left !== nothing && push!(stack, node.left)
       end
       return values
   end

R
~

.. code-block:: r

   preorder_traversal <- function(root) {
     if (is.null(root)) {
       return(integer())
     }

     stack <- new.env(hash = TRUE, parent = emptyenv())
     values <- new.env(hash = TRUE, parent = emptyenv())
     top <- 1L
     count <- 0L
     assign("1", root, envir = stack)

     while (top > 0L) {
       key <- as.character(top)
       node <- get(key, envir = stack, inherits = FALSE)
       rm(list = key, envir = stack)
       top <- top - 1L

       count <- count + 1L
       assign(as.character(count), node$val, envir = values)

       if (!is.null(node$right)) {
         top <- top + 1L
         assign(as.character(top), node$right, envir = stack)
       }
       if (!is.null(node$left)) {
         top <- top + 1L
         assign(as.character(top), node$left, envir = stack)
       }
     }

     vapply(
       seq_len(count),
       function(index) {
         get(as.character(index), envir = values, inherits = FALSE)
       },
       integer(1L)
     )
   }

语言语义专项说明
----------------

* **C**：``realloc`` 只写入临时指针；任何栈或结果扩容失败都会释放两个缓冲并返回
  ``NULL``，``returnSize`` 保持为零。遍历期间未修改树，所以失败不会留下部分拓扑修改。官方上界保证
  最终 ``size_t`` 计数可安全转换为 ``int``，容量乘法仍显式检查 ``SIZE_MAX``。
* **C++/Java/C#/Go/Python/TypeScript**：栈保存节点引用，结果只复制小整数值。动态数组可能保留大于逻辑
  长度的容量，这属于对应容器的 ``O(h)`` 或 ``O(n)`` 峰值常数。
* **Rust**：内部块结束后不可变 ``RefCell`` 借用已经释放，再修改局部栈。克隆左右孩子的 ``Rc`` 只增加
  临时强引用计数，不复制 ``TreeNode``，遍历结束后这些栈句柄被释放。
* **Julia**：``TreeNode[root]`` 构造只含根引用的向量；``push!``、``pop!`` 操作引用，不复制子树。
* **R**：树节点与栈、值槽位分别是 environment。读取 ``node$left``、``node$right`` 不修改节点；
  删除栈槽位只删除临时引用。使用环境槽位避免了每轮 ``c`` 扩展向量的累计复制。

人工推演与静态审查
------------------

本题没有运行、编译或测试任何题解代码，也没有执行对拍、穷举、属性测试或 sanitizer。完成的是人工推演、
逐语言静态语义检查及仓库结构检查。

对主例按“栈顶在左”记录状态：

.. code-block:: text

   初始      stack=[A]       values=[]
   弹 A 后   stack=[B,C]     values=[4]
   弹 B 后   stack=[D,C]     values=[4,-1]
   弹 D 后   stack=[C]       values=[4,-1,2]
   弹 C 后   stack=[E]       values=[4,-1,2,4]
   弹 E 后   stack=[]        values=[4,-1,2,4,0]

题面示例 ``[1, null, 2, 3]`` 表示根 ``1`` 的右孩子为 ``2``、``2`` 的左孩子为 ``3``；人工按同一栈规则
得到 ``[1, 2, 3]``。另行核对了空树、单节点、纯左链、纯右链和重复值树。十语言逐项检查了公开签名、
空结果、字段名、
右先压左后压、结果类型和输入只读；C 专项检查了初始分配、两类扩容、临时 ``realloc`` 指针、全部失败清理
与返回所有权；Rust 专项检查了 ``Rc`` 克隆和借用块；R 专项检查了 environment 键、栈顶计数和一次性输出
物化。由于没有交给目标编译器或运行时，仍保留平台模板差异、导入版本、Rust 借用诊断以及 R/Julia 统一
节点定义不一致等剩余风险。

关键边界与失败方式
------------------

* 空树必须返回空容器，不能把空引用压栈后再读取字段；
* 先压左、后压右会让右子树先弹出，得到“根、右、左”而不是前序；
* 只证明“左孩子下一次先弹出”还不够，必须由前沿不变量保证整个左子树在右子树之前完成；
* 忽略合法树的无环、唯一父节点前提，却又不使用访问集合，在图或共享子树上会重复访问甚至不终止；
* 把栈统一写成 ``O(log n)`` 错把平衡树特例当成全部输入；退化树的 ``h=n``；
* 只报告 ``O(h)`` 而省略返回数组，会隐藏不可避免的 ``Theta(n)`` 输出载荷；
* C 若直接令 ``stack = realloc(stack, ...)``，失败时会丢失旧缓冲并泄漏；
* R 若以 ``stack <- c(stack, child)``、``values <- c(values, value)`` 逐轮扩展，会引入累计复制成本。

学习链
------

本题新增或强化：

* 用栈顶到栈底的子树序列表示递归的有序待访问前沿；
* 从 ``Pre(u)=[u]+Pre(left)+Pre(right)`` 推导逆序压栈，而不是背诵顺序；
* 区分 ``O(h)`` 遍历工作栈、``Theta(n)`` 输出载荷和语言适配器物化。

关联题目
~~~~~~~~

* `0094. Binary Tree Inorder Traversal <../0001-0100/0094-binary-tree-inorder-traversal.rst>`_：显式栈保存
  “访问左链后再提交根”的不同续点；
* `0102. Binary Tree Level Order Traversal <0102-binary-tree-level-order-traversal.rst>`_：队列前沿按层次顺序，
  峰值由树宽 ``w`` 而不是树高 ``h`` 决定；
* `0114. Flatten Binary Tree to Linked List <0114-flatten-binary-tree-to-linked-list.rst>`_：使用相同前序顺序，
  但会原地修改树拓扑，证明义务不同；
* `0145. Binary Tree Postorder Traversal <0145-binary-tree-postorder-traversal.rst>`_：改变压栈顺序并逆转记录，
  得到左、右、根顺序。

自检与答案
----------

#. **为什么必须先压右孩子、再压左孩子？**

   因为栈后进先出。这样栈顶到栈底的待访问子树顺序才是左、右、原其余前沿，与
   ``Pre(u)=[u]+Pre(left)+Pre(right)`` 一致。

#. **怎样证明不只是左孩子，而是整个左子树先于右子树？**

   前沿不变量把剩余序列写成各栈元素子树前序的串接。处理左子树时，它产生的新待访问子树都继续位于右子树
   根之上；直到左子树全部耗尽，右子树根才会成为栈顶。

#. **每个节点为什么恰好入栈一次？**

   根只由初始化入栈；每个非根节点有唯一父节点，只在父节点弹出时作为唯一一个孩子位置入栈一次。
   栈空时前沿不变量又保证没有遗漏节点。

#. **为什么栈是 ``O(h)`` 而不是无条件 ``O(n)``？**

   栈保存当前深度优先路径各层尚未处理的兄弟子树根，每层至多一个，故为 ``O(h)``；只有退化树中
   ``h=n`` 才达到线性。

#. **结果数组为什么不能算进同一个 ``O(h)``？**

   返回契约要求物化所有 ``n`` 个节点值，载荷始终是 ``Theta(n)``；工作栈描述算法为控制遍历顺序额外保存的
   状态，两者角色和峰值必须分别报告。
