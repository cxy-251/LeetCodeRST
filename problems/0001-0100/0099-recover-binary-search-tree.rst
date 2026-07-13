0099. Recover Binary Search Tree
================================

题目信息
--------

:题号: 0099
:难度: Medium
:主题: 二叉搜索树、中序遍历、逆序对、原地修复
:原题: `LeetCode 0099 <https://leetcode.com/problems/recover-binary-search-tree/>`_
:访问状态: Available
:教学重点: 一次或两次下降、首尾错误节点、只交换值、结构保持

题目重述
--------

一棵原本合法的二叉搜索树中，恰好有两个不同节点的值被交换。请恢复这棵树，不改变任何节点链接或
树结构。题目保证存在这样的两个错误节点。

输入树由可变节点组成，函数原地交换两个节点值，不返回新树。

自建示例
--------

非相邻交换：

.. code-block:: text

   正确中序：1, 2, 3, 4
   错误中序：3, 2, 1, 4
   下降位置：3 > 2，2 > 1

应交换第一次下降左端 ``3`` 与最后一次下降右端 ``1``。

相邻交换：

.. code-block:: text

   正确中序：1, 2, 3
   错误中序：1, 3, 2

只有一次下降，交换该下降两端 ``3`` 与 ``2``。

问题抽象
--------

合法 BST 的中序序列严格递增。交换排序序列中的两个元素后：

* 若两个元素原本相邻，只产生一次下降；
* 若原本不相邻，产生两次下降；
* 第一个错误节点是第一次下降的左端；
* 第二个错误节点是最后一次下降的右端。

因此中序扫描时维护 ``previous``、``first`` 和 ``second``：

.. code-block:: text

   if previous.val > current.val:
       if first is unset:
           first = previous
       second = current

扫描结束后交换 ``first.val`` 和 ``second.val``。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 显式栈中序扫描并记录下降端点
     - ``O(n)``
     - ``O(h)``
     - 主解法；逻辑清晰且不依赖递归深度
   * - 递归中序扫描
     - ``O(n)``
     - ``O(h)`` 调用栈
     - 状态相同，控制流更隐式
   * - Morris 中序遍历
     - ``O(n)``
     - ``O(1)``
     - 满足进阶空间要求，但会临时建立线索链接
   * - 收集中序节点后排序查错
     - ``O(n log n)``
     - ``O(n)``
     - 保存了不必要的完整序列

主解法：中序下降端点定位
------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

中序遍历过程中：

* ``previous`` 是当前节点的直接中序前驱；
* ``first`` 尚未设置时，说明此前未观察到下降；
* 第一次下降时，``previous`` 一定是较早出现的错误大值；
* 每次下降都把 ``second`` 更新为当前较小值；
* 扫描结束时，``second`` 是最后一次下降的右端。

为什么端点规则同时覆盖两种情况
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设正确递增序列中交换了较小值 ``x`` 和较大值 ``y``，且 ``x < y``。

若二者相邻，错误局部只有 ``..., y, x, ...``，唯一下降两端正好是 ``y`` 和 ``x``。

若二者不相邻，``y`` 被移到较前位置后，会在某处大于其后继，形成第一次下降；``x`` 被移到较后位置
前，它的前驱会大于 ``x``，形成最后一次下降。中间可能只有这两次下降，端点仍是 ``y`` 与 ``x``。

为什么只交换值
~~~~~~~~~~~~~~

题目错误来自两个节点值互换，节点拓扑原本正确。重新连接节点不仅多余，还可能改变子树归属。最终仅
交换 ``first.val`` 与 ``second.val``，所有父子边、节点身份和树形都保持不变。

正确性依据
~~~~~~~~~~

**定位第一个错误节点。** 第一次下降之前序列仍递增；下降左端是首个被放到过早位置的较大交换值。

**定位第二个错误节点。** 相邻交换只有一次下降，右端就是较小错误值；非相邻交换的最后一次下降右端
是被放到过晚位置的较小值。持续更新 ``second`` 同时覆盖两种情况。

**修复充分。** 除这两个值外，其余中序元素相对位置和值都未改变；交换端点后恢复原严格递增序列，
由 0098 的充要关系可知树重新成为合法 BST。

**结构保持。** 算法只读取 ``left``、``right`` 并交换两个 ``val`` 字段，不修改任何链接。

**终止性。** 每个节点入栈、出栈一次，中序扫描有限。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 时间复杂度 ``O(n)``；
* 显式栈额外空间 ``O(h)``；
* 只交换两个整数值，树结构和节点集合不变；
* C 使用可增长栈；``void`` 接口无法报告极端分配失败，失败时保持树未完全修复并直接返回；
* Rust 保存 ``Rc`` 节点引用，扫描完成后分开读取和写入两个值，避免同时持有冲突的可变借用；
* R 和 Julia 节点具有引用语义，字段赋值会原地修改调用者持有的树。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   void recoverTree(struct TreeNode *root) {
       int capacity = 64;
       int size = 0;
       struct TreeNode **stack = malloc((size_t)capacity * sizeof(*stack));
       if (stack == NULL) {
           return;
       }

       struct TreeNode *current = root;
       struct TreeNode *previous = NULL;
       struct TreeNode *first = NULL;
       struct TreeNode *second = NULL;

       while (current != NULL || size > 0) {
           while (current != NULL) {
               if (size == capacity) {
                   const int next_capacity = capacity * 2;
                   struct TreeNode **grown = realloc(
                       stack,
                       (size_t)next_capacity * sizeof(*grown)
                   );
                   if (grown == NULL) {
                       free(stack);
                       return;
                   }
                   stack = grown;
                   capacity = next_capacity;
               }
               stack[size++] = current;
               current = current->left;
           }

           current = stack[--size];
           if (previous != NULL && previous->val > current->val) {
               if (first == NULL) {
                   first = previous;
               }
               second = current;
           }
           previous = current;
           current = current->right;
       }

       free(stack);
       if (first != NULL && second != NULL) {
           const int value = first->val;
           first->val = second->val;
           second->val = value;
       }
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       void recoverTree(TreeNode* root) {
           std::vector<TreeNode*> stack;
           TreeNode* current = root;
           TreeNode* previous = nullptr;
           TreeNode* first = nullptr;
           TreeNode* second = nullptr;

           while (current != nullptr || !stack.empty()) {
               while (current != nullptr) {
                   stack.push_back(current);
                   current = current->left;
               }

               current = stack.back();
               stack.pop_back();
               if (previous != nullptr && previous->val > current->val) {
                   if (first == nullptr) {
                       first = previous;
                   }
                   second = current;
               }
               previous = current;
               current = current->right;
           }

           if (first != nullptr && second != nullptr) {
               const int value = first->val;
               first->val = second->val;
               second->val = value;
           }
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def recoverTree(self, root: Optional[TreeNode]) -> None:
           stack: list[TreeNode] = []
           current = root
           previous: Optional[TreeNode] = None
           first: Optional[TreeNode] = None
           second: Optional[TreeNode] = None

           while current is not None or stack:
               while current is not None:
                   stack.append(current)
                   current = current.left

               current = stack.pop()
               if previous is not None and previous.val > current.val:
                   if first is None:
                       first = previous
                   second = current
               previous = current
               current = current.right

           if first is not None and second is not None:
               first.val, second.val = second.val, first.val

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.Deque;

   class Solution {
       public void recoverTree(TreeNode root) {
           Deque<TreeNode> stack = new ArrayDeque<>();
           TreeNode current = root;
           TreeNode previous = null;
           TreeNode first = null;
           TreeNode second = null;

           while (current != null || !stack.isEmpty()) {
               while (current != null) {
                   stack.push(current);
                   current = current.left;
               }

               current = stack.pop();
               if (previous != null && previous.val > current.val) {
                   if (first == null) {
                       first = previous;
                   }
                   second = current;
               }
               previous = current;
               current = current.right;
           }

           if (first != null && second != null) {
               int value = first.val;
               first.val = second.val;
               second.val = value;
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn recover_tree(root: &mut Option<Rc<RefCell<TreeNode>>>) {
           let mut stack: Vec<Rc<RefCell<TreeNode>>> = Vec::new();
           let mut current = root.clone();
           let mut previous: Option<Rc<RefCell<TreeNode>>> = None;
           let mut first: Option<Rc<RefCell<TreeNode>>> = None;
           let mut second: Option<Rc<RefCell<TreeNode>>> = None;

           while current.is_some() || !stack.is_empty() {
               while let Some(node) = current {
                   current = node.borrow().left.clone();
                   stack.push(node);
               }

               let node = stack.pop().expect("stack is non-empty");
               if let Some(previous_node) = &previous {
                   if previous_node.borrow().val > node.borrow().val {
                       if first.is_none() {
                           first = Some(previous_node.clone());
                       }
                       second = Some(node.clone());
                   }
               }
               previous = Some(node.clone());
               current = node.borrow().right.clone();
           }

           if let (Some(first_node), Some(second_node)) = (first, second) {
               let first_value = first_node.borrow().val;
               let second_value = second_node.borrow().val;
               first_node.borrow_mut().val = second_value;
               second_node.borrow_mut().val = first_value;
           }
       }
   }

Go
~~

.. code-block:: go

   func recoverTree(root *TreeNode) {
       stack := make([]*TreeNode, 0)
       current := root
       var previous *TreeNode
       var first *TreeNode
       var second *TreeNode

       for current != nil || len(stack) > 0 {
           for current != nil {
               stack = append(stack, current)
               current = current.Left
           }

           current = stack[len(stack)-1]
           stack = stack[:len(stack)-1]
           if previous != nil && previous.Val > current.Val {
               if first == nil {
                   first = previous
               }
               second = current
           }
           previous = current
           current = current.Right
       }

       if first != nil && second != nil {
           first.Val, second.Val = second.Val, first.Val
       }
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function recoverTree(root: TreeNode | null): void {
       const stack: TreeNode[] = [];
       let current = root;
       let previous: TreeNode | null = null;
       let first: TreeNode | null = null;
       let second: TreeNode | null = null;

       while (current !== null || stack.length > 0) {
           while (current !== null) {
               stack.push(current);
               current = current.left;
           }

           current = stack.pop()!;
           if (previous !== null && previous.val > current.val) {
               if (first === null) {
                   first = previous;
               }
               second = current;
           }
           previous = current;
           current = current.right;
       }

       if (first !== null && second !== null) {
           const value = first.val;
           first.val = second.val;
           second.val = value;
       }
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public void RecoverTree(TreeNode root) {
           var stack = new Stack<TreeNode>();
           TreeNode current = root;
           TreeNode previous = null;
           TreeNode first = null;
           TreeNode second = null;

           while (current != null || stack.Count > 0) {
               while (current != null) {
                   stack.Push(current);
                   current = current.left;
               }

               current = stack.Pop();
               if (previous != null && previous.val > current.val) {
                   if (first == null) {
                       first = previous;
                   }
                   second = current;
               }
               previous = current;
               current = current.right;
           }

           if (first != null && second != null) {
               int value = first.val;
               first.val = second.val;
               second.val = value;
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function recover_tree!(root::Union{TreeNode, Nothing})::Nothing
       stack = TreeNode[]
       current = root
       previous = nothing
       first = nothing
       second = nothing

       while current !== nothing || !isempty(stack)
           while current !== nothing
               push!(stack, current)
               current = current.left
           end

           current = pop!(stack)
           if previous !== nothing && previous.val > current.val
               if first === nothing
                   first = previous
               end
               second = current
           end
           previous = current
           current = current.right
       end

       if first !== nothing && second !== nothing
           first.val, second.val = second.val, first.val
       end
       return nothing
   end

R
~

.. code-block:: r

   recover_tree <- function(root) {
     stack <- list()
     size <- 0L
     current <- root
     previous <- NULL
     first <- NULL
     second <- NULL

     while (!is.null(current) || size > 0L) {
       while (!is.null(current)) {
         size <- size + 1L
         stack[[size]] <- current
         current <- current$left
       }

       current <- stack[[size]]
       stack[[size]] <- NULL
       size <- size - 1L
       if (!is.null(previous) && previous$val > current$val) {
         if (is.null(first)) {
           first <- previous
         }
         second <- current
       }
       previous <- current
       current <- current$right
     }

     if (!is.null(first) && !is.null(second)) {
       value <- first$val
       first$val <- second$val
       second$val <- value
     }
     invisible(root)
   }

验证计划与证据
--------------

* 构造不同形状的合法 BST，枚举任意两个节点交换，恢复后检查中序序列严格递增；
* 分别覆盖中序相邻交换和非相邻交换的一次、两次下降；
* 保存修复前的节点身份集合和左右孩子身份，确认调用后结构完全一致；
* Python 执行 30,000 组随机 BST 与随机交换；
* C、C++、Java、Go、TypeScript 完成随机恢复测试；C、C++ 使用严格警告、ASan 和 UBSan。

Rust、C#、Julia 和 R 在当前环境完成平台接口、引用语义和借用顺序的静态检查。

易错点
------

* 每次下降都覆盖 ``first``，会丢失非相邻交换的较大端点；
* 只在第一次下降设置 ``second``，会把非相邻交换修复成错误结果；
* 使用 ``>=`` 检测下降会把合法 BST 中不存在的重复情况混入本题保证；这里交换前后键仍互异，使用 ``>``；
* 交换节点链接而不是值会改变树结构；
* 扫描到第一次下降就提前返回，无法处理非相邻交换。

本题新增知识
------------

* 排序序列交换两元素后的一次或两次下降结构；
* 第一次下降左端与最后一次下降右端定位规则；
* 仅交换值即可保持 BST 拓扑。

本题强化知识
------------

* `0098` 的中序严格递增判定；
* `0094` 的显式栈中序遍历；
* 可变树接口中的节点身份和结构守恒。

关联题目
--------

* `0098. Validate Binary Search Tree <0098-validate-binary-search-tree.rst>`_：修复后应重新满足严格递增；
* `0094. Binary Tree Inorder Traversal <0094-binary-tree-inorder-traversal.rst>`_：提供扫描顺序；
* `0092. Reverse Linked List II <0092-reverse-linked-list-ii.rst>`_：同样原地修改并要求结构守恒证明。

最小自检
--------

#. 相邻交换为什么只产生一次中序下降？
#. 非相邻交换时为什么 ``first`` 只设置一次而 ``second`` 每次更新？
#. 修复后为什么无需再次调整任何树链接？
#. Morris 方法与本题主解法的主要取舍是什么？

答案要点
~~~~~~~~

#. 两个被交换值直接形成唯一的 ``y > x`` 邻接关系。
#. 第一次下降左端是较大错误值，最后一次下降右端才是较小错误值。
#. 原错误仅交换了值，拓扑始终正确；恢复严格中序序列即可恢复 BST。
#. Morris 把辅助空间降为常数，但需要临时修改并可靠恢复树链接。
