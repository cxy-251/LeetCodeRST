0098. Validate Binary Search Tree
=================================

题目信息
--------

:题号: 0098
:难度: Medium
:主题: 二叉搜索树、中序遍历、显式栈、严格有序性
:原题: `LeetCode 0098 <https://leetcode.com/problems/validate-binary-search-tree/>`_
:访问状态: Available
:教学重点: 中序严格递增、前驱状态、重复值判错、整数边界无哨兵

题目重述
--------

给定二叉树根节点 ``root``，判断整棵树是否为合法二叉搜索树。对每个节点，左子树中的所有值都必须
严格小于节点值，右子树中的所有值都必须严格大于节点值，并且左右子树本身也要满足相同规则。

重复值不合法。节点值可能位于 32 位有符号整数边界，因此不能把某个普通整数当作“尚无前驱”的
哨兵。输入树只读。

自建示例
--------

.. code-block:: text

       2
      / \
     1   3

   输出：true

.. code-block:: text

       5
      / \
     1   4
        / \
       3   6

   输出：false

节点 ``3`` 位于根 ``5`` 的右子树，却小于 ``5``。只比较父子节点会漏掉这个跨层约束。

问题抽象
--------

合法 BST 的中序遍历必须严格递增。反过来，若整棵二叉树的中序序列严格递增，则任意节点左子树中的
所有节点都在它之前访问，值都更小；右子树中的所有节点都在它之后访问，值都更大，所以整棵树合法。

因此可以复用 `0094` 的显式栈中序遍历，只增加一个“最近访问值”状态：

.. code-block:: text

   若 current_value <= previous_value：非法

比较必须使用 ``<=``，因为重复值同样违反严格 BST 定义。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 显式栈中序遍历并检查严格递增
     - ``O(n)``
     - ``O(h)``
     - 主解法；避免递归深度并复用 0094
   * - 递归携带开区间上下界
     - ``O(n)``
     - ``O(h)`` 调用栈
     - 定义直接，但要处理整数边界和深树
   * - Morris 中序遍历
     - ``O(n)``
     - ``O(1)``
     - 临时修改树链接，恢复证明更复杂

其中 ``h`` 是树高。

主解法：中序严格递增检查
------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

算法维护：

* ``stack``：左子树尚未完成返回的祖先续点；
* ``current``：下一条要展开的子树根；
* ``previous``：最近一个已经中序访问的节点值；
* ``has_previous``：是否已经访问过节点。

每次弹栈得到中序顺序中的下一个节点。在比较前，``previous`` 恰好是当前节点的直接中序前驱；若当前
值不严格大于它，整条中序序列不再严格递增，可以立即返回假。

为什么不能使用数值哨兵
~~~~~~~~~~~~~~~~~~~~~~

若把 ``previous`` 初始化为最小 32 位整数，根值恰好也是该最小值时，第一次比较会错误判定重复或
越界。使用独立布尔量 ``has_previous`` 表示状态是否存在，使任意合法整数都只作为数据参与比较。

正确性依据
~~~~~~~~~~

**必要性。** 合法 BST 的任意节点左侧全部值更小、右侧全部值更大。中序遍历先左、再根、后右，所以
访问序列必然严格递增。

**充分性。** 若全局中序序列严格递增，则任意节点左子树的所有值都出现在它之前，因而都更小；右子树
所有值都出现在它之后，因而都更大。递归地每个子树也满足相同性质。

**检测完整。** 非严格递增序列一定存在某对相邻元素满足后者小于或等于前者；算法逐对检查所有直接
中序前驱关系，因此不会漏掉跨层违规或重复值。

**终止性。** 每个节点入栈、出栈各一次，有限节点全部处理后循环结束。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 每个节点访问一次，时间复杂度 ``O(n)``；
* 栈最多保存一条祖先链，额外空间 ``O(h)``；
* 输入树不修改，布尔返回不计入工作空间；
* C 使用可增长节点栈；平台布尔接口无法区分合法 ``false`` 与极端分配失败，失败时返回 ``false``；
* 所有实现使用“是否存在前驱”标志，而不是扩大到 64 位后依赖数值哨兵；
* Rust 克隆 ``Rc`` 只增加引用计数，不复制树节点；Julia 与 R 复用 0094 的引用节点模型。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>

   bool isValidBST(struct TreeNode *root) {
       int capacity = 64;
       int size = 0;
       struct TreeNode **stack = malloc((size_t)capacity * sizeof(*stack));
       if (stack == NULL) {
           return false;
       }

       struct TreeNode *current = root;
       int previous = 0;
       bool has_previous = false;

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
                       return false;
                   }
                   stack = grown;
                   capacity = next_capacity;
               }
               stack[size++] = current;
               current = current->left;
           }

           current = stack[--size];
           if (has_previous && current->val <= previous) {
               free(stack);
               return false;
           }
           previous = current->val;
           has_previous = true;
           current = current->right;
       }

       free(stack);
       return true;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       bool isValidBST(TreeNode* root) {
           std::vector<TreeNode*> stack;
           TreeNode* current = root;
           int previous = 0;
           bool has_previous = false;

           while (current != nullptr || !stack.empty()) {
               while (current != nullptr) {
                   stack.push_back(current);
                   current = current->left;
               }

               current = stack.back();
               stack.pop_back();
               if (has_previous && current->val <= previous) {
                   return false;
               }
               previous = current->val;
               has_previous = true;
               current = current->right;
           }
           return true;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isValidBST(self, root: Optional[TreeNode]) -> bool:
           stack: list[TreeNode] = []
           current = root
           previous = 0
           has_previous = False

           while current is not None or stack:
               while current is not None:
                   stack.append(current)
                   current = current.left

               current = stack.pop()
               if has_previous and current.val <= previous:
                   return False
               previous = current.val
               has_previous = True
               current = current.right

           return True

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.Deque;

   class Solution {
       public boolean isValidBST(TreeNode root) {
           Deque<TreeNode> stack = new ArrayDeque<>();
           TreeNode current = root;
           int previous = 0;
           boolean hasPrevious = false;

           while (current != null || !stack.isEmpty()) {
               while (current != null) {
                   stack.push(current);
                   current = current.left;
               }

               current = stack.pop();
               if (hasPrevious && current.val <= previous) {
                   return false;
               }
               previous = current.val;
               hasPrevious = true;
               current = current.right;
           }
           return true;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn is_valid_bst(root: Option<Rc<RefCell<TreeNode>>>) -> bool {
           let mut stack: Vec<Rc<RefCell<TreeNode>>> = Vec::new();
           let mut current = root;
           let mut previous = 0;
           let mut has_previous = false;

           while current.is_some() || !stack.is_empty() {
               while let Some(node) = current {
                   current = node.borrow().left.clone();
                   stack.push(node);
               }

               let node = stack.pop().expect("stack is non-empty");
               let value = node.borrow().val;
               if has_previous && value <= previous {
                   return false;
               }
               previous = value;
               has_previous = true;
               current = node.borrow().right.clone();
           }
           true
       }
   }

Go
~~

.. code-block:: go

   func isValidBST(root *TreeNode) bool {
       stack := make([]*TreeNode, 0)
       current := root
       previous := 0
       hasPrevious := false

       for current != nil || len(stack) > 0 {
           for current != nil {
               stack = append(stack, current)
               current = current.Left
           }

           current = stack[len(stack)-1]
           stack = stack[:len(stack)-1]
           if hasPrevious && current.Val <= previous {
               return false
           }
           previous = current.Val
           hasPrevious = true
           current = current.Right
       }
       return true
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isValidBST(root: TreeNode | null): boolean {
       const stack: TreeNode[] = [];
       let current = root;
       let previous = 0;
       let hasPrevious = false;

       while (current !== null || stack.length > 0) {
           while (current !== null) {
               stack.push(current);
               current = current.left;
           }

           current = stack.pop()!;
           if (hasPrevious && current.val <= previous) {
               return false;
           }
           previous = current.val;
           hasPrevious = true;
           current = current.right;
       }
       return true;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public bool IsValidBST(TreeNode root) {
           var stack = new Stack<TreeNode>();
           TreeNode current = root;
           int previous = 0;
           bool hasPrevious = false;

           while (current != null || stack.Count > 0) {
               while (current != null) {
                   stack.Push(current);
                   current = current.left;
               }

               current = stack.Pop();
               if (hasPrevious && current.val <= previous) {
                   return false;
               }
               previous = current.val;
               hasPrevious = true;
               current = current.right;
           }
           return true;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function is_valid_bst(root::Union{TreeNode, Nothing})::Bool
       stack = TreeNode[]
       current = root
       previous = 0
       has_previous = false

       while current !== nothing || !isempty(stack)
           while current !== nothing
               push!(stack, current)
               current = current.left
           end

           current = pop!(stack)
           if has_previous && current.val <= previous
               return false
           end
           previous = current.val
           has_previous = true
           current = current.right
       end
       return true
   end

R
~

.. code-block:: r

   is_valid_bst <- function(root) {
     stack <- list()
     size <- 0L
     current <- root
     previous <- 0L
     has_previous <- FALSE

     while (!is.null(current) || size > 0L) {
       while (!is.null(current)) {
         size <- size + 1L
         stack[[size]] <- current
         current <- current$left
       }

       current <- stack[[size]]
       stack[[size]] <- NULL
       size <- size - 1L
       if (has_previous && current$val <= previous) {
         return(FALSE)
       }
       previous <- current$val
       has_previous <- TRUE
       current <- current$right
     }
     TRUE
   }

验证计划与证据
--------------

* 固定用例覆盖空树、单节点、合法平衡树、跨层违规、重复值和 32 位最小/最大值；
* Python 生成 50,000 棵随机二叉树，与独立开区间上下界递归基准对拍；
* C、C++、Java、Go、TypeScript 使用相同随机种子和基准语义执行属性测试；
* C、C++ 使用严格警告、ASan 和 UBSan；
* 检查调用前后树的结构和值完全不变。

Rust、C#、Julia 和 R 在当前环境缺少运行时，完成接口、借用、引用模型和整数边界的静态检查。

易错点
------

* 只检查 ``node.left.val < node.val < node.right.val`` 会漏掉祖先边界；
* 使用 ``<`` 而不是 ``<=`` 检测下降，会错误接受重复值；
* 用 ``INT_MIN``、``typemin(Int)`` 等普通数据值充当未初始化哨兵；
* 中序栈弹出后忘记转向右子树；
* 用无符号类型保存可能为负的节点值。

本题新增知识
------------

* BST 合法性与中序序列严格递增的充要关系；
* 使用独立存在标志表达“可选前驱”，避免整数哨兵碰撞；
* 通过相邻中序逆序检测全局祖先约束。

本题强化知识
------------

* `0094` 的显式栈中序控制流；
* 树高 ``h`` 决定辅助栈空间；
* 布尔接口中的内存分配失败契约需要显式说明。

关联题目
--------

* `0094. Binary Tree Inorder Traversal <0094-binary-tree-inorder-traversal.rst>`_：提供相同中序栈骨架；
* `0099. Recover Binary Search Tree <0099-recover-binary-search-tree.rst>`_：利用中序逆序定位两个错误节点；
* `0095. Unique Binary Search Trees II <0095-unique-binary-search-trees-ii.rst>`_：生成全部合法 BST。

最小自检
--------

#. 为什么严格递增中序序列足以证明整棵树是 BST？
#. 为什么只检查父子节点不充分？
#. 为什么需要 ``has_previous``，不能直接初始化为最小整数？
#. 重复值应该使用哪个比较条件判错？

答案要点
~~~~~~~~

#. 任意节点左子树全部出现在它之前、右子树全部出现在它之后；全局严格递增给出两侧严格大小关系。
#. 后代可能满足直接父子关系，却越过更高祖先允许的值域边界。
#. 节点本身可能等于任何普通整数哨兵；独立标志不会与数据域冲突。
#. 当前值 ``<=`` 前驱值时立即非法。
