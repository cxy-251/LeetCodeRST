0145. Binary Tree Postorder Traversal
=====================================

题目信息
--------

:题号: 0145
:难度: Easy
:主题: 二叉树、深度优先搜索、显式栈、序列反转
:原题: `LeetCode 0145 <https://leetcode.com/problems/binary-tree-postorder-traversal/>`_
:访问状态: Available
:教学重点: 根右左中间序列、子树分解证明、原地反转与输出物化

精确契约
--------

输入 ``root`` 是一棵合法二叉树的根节点，也可以为空。需要返回所有节点值的后序序列：对每棵非空子树，
先完整遍历左子树，再完整遍历右子树，最后记录根节点。空树返回空序列。

公开题面的节点数范围是 ``0`` 到 ``100``，节点值范围是 ``[-100, 100]``。合法树无环，每个非根节点
有且只有一个父节点，左右孩子不共享同一子树。若结构扩展为图或 DAG，当前“不使用访问集合”的实现将不再
具有唯一访问和终止保证。

函数返回值序列，不返回节点引用。遍历必须只读，不能为了标记访问状态而修改 ``val``、``left`` 或
``right``。重复值来自不同结构位置，都必须保留；最终反转的是临时记录序列，不是树节点、节点值字段或树边。

自建例子
--------

沿用字母区分节点身份，考虑：

.. code-block:: text

          A(4)
         /    \
      B(-1)   C(4)
        \      /
        D(2) E(0)

正确后序身份顺序为 ``D, B, E, C, A``，返回值是 ``[2, -1, 0, 4, 4]``。主算法先生成的中间身份序列是
``A, C, E, B, D``，也就是“根、右、左”；整体反转后才得到目标顺序。

如果误用前序题的压栈顺序，先压右孩子再压左孩子，就会记录“根、左、右”序列
``A, B, D, C, E``；反转后成为 ``E, C, D, B, A``，这是“右、左、根”，左右子树次序错误。

空树返回 ``[]``，单节点树返回根值。纯左链和纯右链的后序都是叶到根；它们可以检查反转是否执行，却不能
区分左右子树顺序，因此仍需要含双孩子的不对称例子。

问题抽象与解法选择
------------------

后序递归定义为：

``Post(u) = Post(u.left) + Post(u.right) + [u]``。

直接递归天然在两个子调用完成后提交根，时间 ``O(n)``、调用栈 ``O(h)``，但题目的进阶要求是迭代实现。
迭代方案主要有三类：

* 一个栈加 ``last_visited``，在弹栈前区分右子树是否已经完成。它直接提交后序，但状态分支较多；
* 两个栈：第一个展开节点，第二个保存反向结果。逻辑直观，却额外保存 ``Theta(n)`` 个节点引用；
* 一个节点栈生成“根、右、左”的值序列，再在返回容器内整体反转。

选择第三种。返回契约本来就必须物化 ``n`` 个值，把这同一个容器作为中间记录并原地反转，不需要第二个
节点栈。核心仍只有 ``O(h)`` 个待访问子树根。

中间序列与栈前沿不变量
----------------------

定义镜像前序序列：

``Mirror(u) = [u] + Mirror(u.right) + Mirror(u.left)``。

代码维护：

* ``values``：已经提交的 ``Mirror(root)`` 前缀；
* ``stack``：尚未访问子树的根。证明中把栈顶到栈底写成 ``F0, F1, ..., Fk``。

生成阶段每轮入口保持：

#. ``values`` 是完整 ``Mirror(root)`` 已提交的前缀；
#. 尚未提交序列恰好为 ``Mirror(F0) + Mirror(F1) + ... + Mirror(Fk)``；
#. 各前沿子树两两不相交，并与已提交节点集合不相交；
#. 每个原节点要么已经提交，要么恰好属于一个前沿子树。

为了让右子树成为下一段，弹出节点后必须先压左孩子、再压右孩子。栈后进先出，新的栈顶到栈底才会是
“右、左、原其余前沿”。这与 ``0144`` 的压栈顺序恰好相反。

算法步骤
--------

若根为空，直接返回空序列。否则：

#. 把根压入节点栈；
#. 每轮弹出 ``node``，把 ``node.val`` 追加到 ``values``；
#. 先压入非空左孩子，再压入非空右孩子；
#. 栈空后，在 ``values`` 内原地反转全部元素并返回。

R 适配器保持相同生成阶段，但值先写入 environment 槽位；最后按键 ``count, count-1, ..., 1`` 一次性
物化返回向量，语义等于读取 ``reverse(values)``，同时避免先物化正序向量再由 ``rev`` 复制第二份向量。

正确性证明
----------

引理一：生成阶段恰好得到 ``Mirror(root)``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**初始化。** 非空输入下，``values`` 为空，前沿只有 ``root``，尚未提交序列正是
``Mirror(root)``；全部节点属于这一待访问子树。

**保持。** 假设本轮弹出 ``F0=u``。根据定义：

``Mirror(u) = [u] + Mirror(u.right) + Mirror(u.left)``。

算法先提交 ``u``，然后先压左孩子、后压右孩子。省略空孩子后，新栈顶到栈底为
``u.right, u.left, F1, ...``，所以新的未提交序列恰好是
``Mirror(u.right) + Mirror(u.left) + Mirror(F1) + ...``。合法树的左右子树互不相交且不含 ``u``，
节点分区也保持。

**终止。** 根只在初始化时入栈，每个非根节点只在其唯一父节点弹出时入栈一次，所以最多处理 ``n`` 轮。
栈空时，不变量说明没有未提交节点，``values = Mirror(root)``，每个节点值恰好记录一次。

引理二：``reverse(Mirror(u)) = Post(u)``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对子树高度做结构归纳。

**空树。** ``Mirror(null)`` 与 ``Post(null)`` 都为空，等式成立。

**非空树。** 假设等式对 ``u.left`` 与 ``u.right`` 成立。序列整体反转会反转各段内容并颠倒段次序，因此：

.. code-block:: text

   reverse(Mirror(u))
   = reverse([u] + Mirror(right) + Mirror(left))
   = reverse(Mirror(left)) + reverse(Mirror(right)) + [u]
   = Post(left) + Post(right) + [u]
   = Post(u)

最后一步就是后序定义。因此等式对 ``u`` 成立。注意这证明的是完整子树段的次序，不是把“根、右、左”
三个词机械倒写。

引理三：算法只读输入且反转阶段安全终止
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

生成阶段只读取节点字段并修改局部栈和值容器。反转阶段只交换 ``values`` 中对称位置的整数，不访问或修改
任何树节点。每次交换让左右边界各向内移动一步，至多执行 ``floor(n/2)`` 次，因此有限终止。

定理：算法返回完整后序遍历
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理一证明生成阶段得到每个原节点恰好一次的 ``Mirror(root)``；引理二证明其整体反转等于目标
``Post(root)``；引理三保证反转合法、算法终止且输入树不变。故返回值满足契约。

复杂度与资源成本
----------------

设节点数为 ``n``、树高为 ``h``：

* 生成阶段每个节点入栈、出栈和记录一次，反转再扫描一半结果，总时间 ``O(n)``；
* 节点栈保存深度优先路径各层尚待访问的兄弟子树根，同一深度至多一个，峰值 ``O(h)``；
* ``values`` 是必须返回的 ``Theta(n)`` 输出载荷，生成阶段直接复用它，不另建第二节点栈；
* 原地反转只用常数个下标或临时整数，因此核心额外工作空间仍为 ``O(h)``；
* 退化树的 ``h=n``，平衡树才有 ``h=O(log n)``，不能无条件把栈写成对数空间。

C 的栈和返回数组使用倍增容量，分别保持 ``O(h)`` 与 ``O(n)`` 容量。R 的 environment 值槽位是
``O(n)`` 适配器中间物化，最终 ``vapply`` 再创建 ``Theta(n)`` 返回向量，峰值为 ``O(n)``；它不反复
``c`` 追加，也不先建立正序向量再调用 ``rev``。官方 ``n<=100`` 使环境字符串键长度有固定上界，在哈希
查找通常平均常数时间的口径下，R 通常时间为 ``O(n)``。
最坏查找界仍取决于 R 运行时 environment 的哈希实现。

语言接口约定
------------

代码复用平台提供的 ``TreeNode``。C 成功返回的整数缓冲由调用者释放；空树或任一分配失败都返回
``NULL`` 且 ``returnSize=0``，两者受平台签名限制无法区分。Rust 的树节点是
``Option<Rc<RefCell<TreeNode>>>``；Julia 使用仓库统一引用节点，R 使用带三个字段的 environment。
所有实现都只读取树。

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>

   static int grow_postorder_buffer(
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

   int *postorderTraversal(
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

       if (!grow_postorder_buffer(
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
               !grow_postorder_buffer(
                   (void **)&values,
                   &value_capacity,
                   sizeof(*values)
               )) {
               free(stack);
               free(values);
               return NULL;
           }
           values[value_count++] = node->val;

           if (node->left != NULL) {
               if (stack_size == stack_capacity &&
                   !grow_postorder_buffer(
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
           if (node->right != NULL) {
               if (stack_size == stack_capacity &&
                   !grow_postorder_buffer(
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
       }
       free(stack);

       for (size_t left = 0, right = value_count - 1;
            left < right;
            ++left, --right) {
           int temporary = values[left];
           values[left] = values[right];
           values[right] = temporary;
       }

       *returnSize = (int)value_count;
       return values;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   public:
       std::vector<int> postorderTraversal(TreeNode *root) {
           std::vector<int> values;
           if (root == nullptr) {
               return values;
           }

           std::vector<TreeNode *> stack{root};
           while (!stack.empty()) {
               TreeNode *node = stack.back();
               stack.pop_back();
               values.push_back(node->val);

               if (node->left != nullptr) {
                   stack.push_back(node->left);
               }
               if (node->right != nullptr) {
                   stack.push_back(node->right);
               }
           }
           std::reverse(values.begin(), values.end());
           return values;
       }
   };

Python
~~~~~~

.. code-block:: python

   from typing import List, Optional


   class Solution:
       def postorderTraversal(
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

               if node.left is not None:
                   stack.append(node.left)
               if node.right is not None:
                   stack.append(node.right)

           values.reverse()
           return values

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.ArrayList;
   import java.util.Collections;
   import java.util.Deque;
   import java.util.List;

   class Solution {
       public List<Integer> postorderTraversal(TreeNode root) {
           List<Integer> values = new ArrayList<>();
           if (root == null) {
               return values;
           }

           Deque<TreeNode> stack = new ArrayDeque<>();
           stack.push(root);
           while (!stack.isEmpty()) {
               TreeNode node = stack.pop();
               values.add(node.val);

               if (node.left != null) {
                   stack.push(node.left);
               }
               if (node.right != null) {
                   stack.push(node.right);
               }
           }
           Collections.reverse(values);
           return values;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn postorder_traversal(
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

               if let Some(left) = left {
                   stack.push(left);
               }
               if let Some(right) = right {
                   stack.push(right);
               }
           }
           values.reverse();
           values
       }
   }

Go
~~

.. code-block:: go

   func postorderTraversal(root *TreeNode) []int {
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

           if node.Left != nil {
               stack = append(stack, node.Left)
           }
           if node.Right != nil {
               stack = append(stack, node.Right)
           }
       }

       for left, right := 0, len(values)-1; left < right; left, right = left+1, right-1 {
           values[left], values[right] = values[right], values[left]
       }
       return values
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function postorderTraversal(root: TreeNode | null): number[] {
       if (root === null) {
           return [];
       }

       const values: number[] = [];
       const stack: TreeNode[] = [root];
       while (stack.length > 0) {
           const node = stack.pop()!;
           values.push(node.val);

           if (node.left !== null) {
               stack.push(node.left);
           }
           if (node.right !== null) {
               stack.push(node.right);
           }
       }
       values.reverse();
       return values;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<int> PostorderTraversal(TreeNode root) {
           List<int> values = new List<int>();
           if (root == null) {
               return values;
           }

           Stack<TreeNode> stack = new Stack<TreeNode>();
           stack.Push(root);
           while (stack.Count > 0) {
               TreeNode node = stack.Pop();
               values.Add(node.val);

               if (node.left != null) {
                   stack.Push(node.left);
               }
               if (node.right != null) {
                   stack.Push(node.right);
               }
           }
           values.Reverse();
           return values;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function postorder_traversal(
       root::Union{Nothing, TreeNode},
   )::Vector{Int}
       root === nothing && return Int[]

       values = Int[]
       stack = TreeNode[root]
       while !isempty(stack)
           node = pop!(stack)
           push!(values, node.val)

           node.left !== nothing && push!(stack, node.left)
           node.right !== nothing && push!(stack, node.right)
       end
       reverse!(values)
       return values
   end

R
~

.. code-block:: r

   postorder_traversal <- function(root) {
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

       if (!is.null(node$left)) {
         top <- top + 1L
         assign(as.character(top), node$left, envir = stack)
       }
       if (!is.null(node$right)) {
         top <- top + 1L
         assign(as.character(top), node$right, envir = stack)
       }
     }

     vapply(
       seq.int(from = count, to = 1L, by = -1L),
       function(index) {
         get(as.character(index), envir = values, inherits = FALSE)
       },
       integer(1L)
     )
   }

语言语义专项说明
----------------

* **C**：两个缓冲都用临时 ``realloc`` 指针扩容；任何失败路径释放栈与结果，``returnSize`` 仍为零。
  非空根保证反转前 ``value_count>=1``，所以 ``value_count-1`` 不会发生无符号下溢。官方上界也保证
  ``size_t`` 到 ``int`` 的最终转换安全。
* **C++/Python/Java/Rust/TypeScript/C#/Julia**：各自的 ``reverse``、``Collections.reverse`` 或
  ``reverse!`` 都在已有结果容器中交换元素，不创建第二个节点栈。动态数组容量仍属于输出容器峰值。
* **Rust**：孩子 ``Rc`` 在一个短不可变借用块中克隆；块结束后借用释放。克隆只增加引用计数，不复制节点，
  ``values.reverse()`` 只修改独立的整数向量。
* **Go**：手写双下标交换；非空根保证结果长度至少一，但即使长度为零，``right=-1`` 也只参与有符号
  ``int`` 循环条件，不会读取数组。
* **Julia**：``reverse!(values)`` 修改的是新建返回向量，不是输入树。栈元素仍是共享节点引用。
* **R**：非空根保证生成阶段至少记录根，故 ``count>=1``，递减 ``seq.int`` 的起点不小于终点，方向合法。
  逆序读取环境槽位直接物化最终向量，避免反复 ``c`` 追加和额外 ``rev`` 副本。

人工推演与静态审查
------------------

本题没有运行、编译或测试任何题解代码，也没有执行对拍、穷举、属性测试或 sanitizer。实际完成的是人工
序列推导、逐语言静态语义检查和仓库结构检查。

主例的生成阶段按“栈顶在左”推演：

.. code-block:: text

   初始      stack=[A]       values=[]
   弹 A 后   stack=[C,B]     values=[4]
   弹 C 后   stack=[E,B]     values=[4,4]
   弹 E 后   stack=[B]       values=[4,4,0]
   弹 B 后   stack=[D]       values=[4,4,0,-1]
   弹 D 后   stack=[]        values=[4,4,0,-1,2]
   整体反转                  [2,-1,0,4,4]

题面示例 ``[1, null, 2, 3]`` 的镜像前序记录为 ``[1, 2, 3]``，人工整体反转得到后序
``[3, 2, 1]``。另外核对了空树、单节点、纯左链、纯右链和重复值树，并以
``reverse([u]+Mirror(R)+Mirror(L))`` 的分段等式审查左右次序。十语言逐项核对了公开签名、空结果、
先左后右压栈、原地结果反转和只读树语义；C 专项核对双缓冲初始分配、每次扩容和失败清理；Rust 核对
``Rc`` 克隆与借用块；R 核对 environment、合法递减 ``seq.int`` 和一次输出物化。未交给目标编译器或
运行时，仍保留平台模板、库版本、Rust 借用诊断、C 宏可用性以及 R/Julia 节点定义差异等剩余风险。

关键边界与失败方式
------------------

* 空树必须在压栈前返回，否则会弹出空节点并读取字段；
* 生成镜像前序时必须先压左、后压右；复制 ``0144`` 的先右后左会在最终反转后交换左右子树；
* 忘记最后反转，只会返回根、右、左中间序列；
* 只把三个词倒过来不能证明一般树正确，必须反转完整子树段并用结构归纳；
* 两栈方案若仍把第二个 ``Theta(n)`` 节点栈说成 ``O(h)``，会低报工作空间；
* 把平衡树的 ``O(log n)`` 高度外推到退化树是错误的；
* C 直接覆盖 ``realloc`` 的旧指针会在失败时泄漏；任一缓冲失败都必须同时清理；
* R 每轮 ``values <- c(values, node$val)`` 的累计复制最坏为平方级，不能继续宣称线性时间；
* 反转树节点的 ``val`` 或重连孩子边并不是“反转遍历序列”，会违反只读契约。

学习链
------

本题新增或强化：

* 通过改变孩子压栈顺序生成镜像前序 ``root-right-left``；
* 用“反转串接会同时反转段内和段间顺序”完成后序结构归纳；
* 复用返回容器承载中间序列，区分 ``O(h)`` 栈、``Theta(n)`` 输出与适配器复制。

关联题目
~~~~~~~~

* `0094. Binary Tree Inorder Traversal <../0001-0100/0094-binary-tree-inorder-traversal.rst>`_：直接迭代中序
  通过保存左链延迟提交根；
* `0100. Same Tree <../0001-0100/0100-same-tree.rst>`_：使用树高结构归纳，但状态是对应节点对；
* `0144. Binary Tree Preorder Traversal <0144-binary-tree-preorder-traversal.rst>`_：相同显式栈前沿，
  压栈顺序相反且无需反转输出；
* `0114. Flatten Binary Tree to Linked List <0114-flatten-binary-tree-to-linked-list.rst>`_：修改树拓扑，
  与本题只读输出序列形成对照。

自检与答案
----------

#. **为什么先压左孩子、再压右孩子？**

   栈后进先出，使右子树先完整展开，生成 ``root-right-left``。最终整体反转才会把它变成
   ``left-right-root``。

#. **为什么整体反转一般树也正确，而不只是三个节点的树？**

   ``Mirror(u)=[u]+Mirror(R)+Mirror(L)``。反转串接后得到
   ``reverse(Mirror(L))+reverse(Mirror(R))+[u]``；对子树应用归纳假设，正是
   ``Post(L)+Post(R)+[u]``。

#. **每个节点为什么不会遗漏或重复？**

   根只初始化入栈一次；合法树中每个非根节点有唯一父节点，只在父节点弹出时入栈一次。栈空时前沿不变量
   保证没有剩余子树。

#. **为什么主解工作栈是 ``O(h)``？**

   深度优先展开时，栈只保存当前路径各层尚待处理的兄弟子树根，每层至多一个；退化树才使 ``h=n``。

#. **R 为什么不使用 ``c`` 追加再 ``rev``？**

   逐轮 ``c`` 会反复复制增长中的向量，累计最坏平方级。环境槽位通常常数时间写入，最后按递减键顺序一次
   物化最终向量，同时避免额外正序向量和 ``rev`` 副本。
