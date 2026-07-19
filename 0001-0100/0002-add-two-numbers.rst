0002. Add Two Numbers
=====================

题目信息
--------

:题号: 0002
:难度: Medium
:主题: 链表、模拟、进位
:原题: `LeetCode 0002 <https://leetcode.com/problems/add-two-numbers/>`_
:访问状态: Available
:教学重点: 单链表、哑节点、逐位加法、进位状态

题目重述
--------

两个非空单链表分别表示两个非负整数。每个节点保存一位数字，最低位位于链表头部。
需要按相同的逆序形式返回两数之和。除数字 0 本身外，输入不会以多余的高位 0
结束。

自建示例
--------

.. code-block:: text

   输入：l1 = [7, 1, 6], l2 = [5, 9, 2]
   表示：617 + 295
   输出：[2, 1, 9]
   表示：912

基础类型约定
------------

LeetCode 在 C、C++、Python、Java、Rust、Go、TypeScript 和 C# 中提供链表节点
类型。代码只标注其来源，不在每种语言里重复声明。

节点包含当前数字 ``val`` 和指向后继节点的 ``next``。Julia 与 R 不属于平台
运行时，因此本题首次给出仓库统一节点约定；后续链表题直接复用。

.. mermaid::

   flowchart LR
       A["节点 val"] -->|"next"| B["后继节点"]
       B -->|"next"| C["后继节点"]
       C --> N["空引用"]

图中每个节点只保存一位数字。链表方向从低位走向高位，所以遍历顺序正好等于
手算加法从个位向高位推进的顺序。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 定位
   * - 同步遍历并维护进位
     - ``O(max(m, n))``
     - ``O(max(m, n))``
     - 主解法
   * - 先转整数再相加
     - 依赖整数位数
     - 依赖表示
     - 不适合任意长输入

主解法：同步遍历并维护进位
--------------------------

思路
~~~~

同时读取两个链表的当前数字。缺失节点按 0 处理，再加上上一位产生的进位
``carry``。当前结果位是 ``sum % 10``，新进位是 ``sum / 10`` 的整数部分。

使用哑节点（dummy node）作为结果链表的固定起点。它不属于答案，只负责统一
“创建第一个节点”和“追加后续节点”两种情况，最终返回 ``dummy.next``。

状态变化
~~~~~~~~

.. mermaid::

   flowchart LR
       X["l1 当前位 x"] --> S["sum = x + y + carry"]
       Y["l2 当前位 y"] --> S
       C["旧进位 carry"] --> S
       S --> D["结果位 sum % 10"]
       S --> NC["新进位 sum / 10"]

每次循环消费两个链表中至多一个节点，并生成一个结果节点。输入都结束后仍要检查
``carry``，因为最高位可能产生额外节点。

核心不变量
~~~~~~~~~~

进入每轮循环时：

* 结果链表已经保存所有处理完成的低位；
* ``carry`` 是这些低位向当前位传递的唯一未处理信息；
* ``l1`` 和 ``l2`` 指向下一对尚未计算的数字。

正确性依据
~~~~~~~~~~

十进制加法中，某一位只依赖该位的两个数字和低一位传来的进位。算法按照从低位
到高位的顺序处理节点，生成的结果位与手算加法完全一致。循环结束时两个输入均已
消费，若仍有进位则追加为最高位，因此结果没有遗漏。

复杂度
~~~~~~

设两个链表长度分别为 ``m`` 和 ``n``：

* 时间复杂度：``O(max(m, n))``；
* 结果链表空间：``O(max(m, n))``；
* 除返回结果外，辅助空间为 ``O(1)``。

核心语言实现
~~~~~~~~~~~~

C
^

.. code-block:: c

   #include <stdlib.h>

   // struct ListNode 由平台提供。
   struct ListNode* addTwoNumbers(
       struct ListNode* l1,
       struct ListNode* l2
   ) {
       struct ListNode dummy = {0, NULL};
       struct ListNode* tail = &dummy;
       int carry = 0;

       while (l1 != NULL || l2 != NULL || carry != 0) {
           const int x = l1 == NULL ? 0 : l1->val;
           const int y = l2 == NULL ? 0 : l2->val;
           const int sum = x + y + carry;

           struct ListNode* node = malloc(sizeof(struct ListNode));
           if (node == NULL) {
               return dummy.next;  // 题目环境通常不模拟分配失败
           }

           node->val = sum % 10;
           node->next = NULL;
           tail->next = node;
           tail = node;
           carry = sum / 10;

           if (l1 != NULL) {
               l1 = l1->next;
           }
           if (l2 != NULL) {
               l2 = l2->next;
           }
       }

       return dummy.next;
   }

C++
^^^

.. code-block:: cpp

   class Solution {
   public:
       ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
           ListNode dummy(0);  // ListNode 由平台提供
           ListNode* tail = &dummy;
           int carry = 0;

           while (l1 != nullptr || l2 != nullptr || carry != 0) {
               const int x = l1 == nullptr ? 0 : l1->val;
               const int y = l2 == nullptr ? 0 : l2->val;
               const int sum = x + y + carry;

               tail->next = new ListNode(sum % 10);
               tail = tail->next;
               carry = sum / 10;

               if (l1 != nullptr) {
                   l1 = l1->next;
               }
               if (l2 != nullptr) {
                   l2 = l2->next;
               }
           }

           return dummy.next;
       }
   };

Python
^^^^^^

.. code-block:: python

   class Solution:
       def addTwoNumbers(
           self,
           l1: Optional[ListNode],
           l2: Optional[ListNode],
       ) -> Optional[ListNode]:
           # ListNode 由平台提供；哑节点统一处理首次追加。
           dummy = ListNode(0)
           tail = dummy
           carry = 0

           while l1 is not None or l2 is not None or carry:
               x = 0 if l1 is None else l1.val
               y = 0 if l2 is None else l2.val
               total = x + y + carry

               tail.next = ListNode(total % 10)
               tail = tail.next
               carry = total // 10  # // 是向下取整除法

               if l1 is not None:
                   l1 = l1.next
               if l2 is not None:
                   l2 = l2.next

           return dummy.next

Java
^^^^

.. code-block:: java

   class Solution {
       public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
           ListNode dummy = new ListNode(0);  // ListNode 由平台提供
           ListNode tail = dummy;
           int carry = 0;

           while (l1 != null || l2 != null || carry != 0) {
               int x = l1 == null ? 0 : l1.val;
               int y = l2 == null ? 0 : l2.val;
               int sum = x + y + carry;

               tail.next = new ListNode(sum % 10);
               tail = tail.next;
               carry = sum / 10;

               if (l1 != null) {
                   l1 = l1.next;
               }
               if (l2 != null) {
                   l2 = l2.next;
               }
           }

           return dummy.next;
       }
   }

Rust
^^^^

.. code-block:: rust

   impl Solution {
       pub fn add_two_numbers(
           mut l1: Option<Box<ListNode>>,
           mut l2: Option<Box<ListNode>>,
       ) -> Option<Box<ListNode>> {
           // ListNode 由平台提供；Box 表示节点拥有后继节点。
           let mut dummy = Box::new(ListNode::new(0));
           let mut tail = &mut dummy;
           let mut carry = 0;

           while l1.is_some() || l2.is_some() || carry != 0 {
               let x = match l1.take() {
                   Some(mut node) => {
                       l1 = node.next.take();
                       node.val
                   }
                   None => 0,
               };

               let y = match l2.take() {
                   Some(mut node) => {
                       l2 = node.next.take();
                       node.val
                   }
                   None => 0,
               };

               let sum = x + y + carry;
               tail.next = Some(Box::new(ListNode::new(sum % 10)));
               tail = tail.next.as_mut().unwrap();
               carry = sum / 10;
           }

           dummy.next
       }
   }

Go
^^

.. code-block:: go

   func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
       dummy := &ListNode{} // ListNode 由平台提供
       tail := dummy
       carry := 0

       for l1 != nil || l2 != nil || carry != 0 {
           x, y := 0, 0
           if l1 != nil {
               x = l1.Val
               l1 = l1.Next
           }
           if l2 != nil {
               y = l2.Val
               l2 = l2.Next
           }

           sum := x + y + carry
           tail.Next = &ListNode{Val: sum % 10}
           tail = tail.Next
           carry = sum / 10
       }

       return dummy.Next
   }

TypeScript
^^^^^^^^^^

.. code-block:: typescript

   function addTwoNumbers(
       l1: ListNode | null,
       l2: ListNode | null,
   ): ListNode | null {
       const dummy = new ListNode(0); // ListNode 由平台提供
       let tail = dummy;
       let carry = 0;

       while (l1 !== null || l2 !== null || carry !== 0) {
           const x = l1 === null ? 0 : l1.val;
           const y = l2 === null ? 0 : l2.val;
           const sum = x + y + carry;

           tail.next = new ListNode(sum % 10);
           tail = tail.next;
           carry = Math.floor(sum / 10);

           if (l1 !== null) {
               l1 = l1.next;
           }
           if (l2 !== null) {
               l2 = l2.next;
           }
       }

       return dummy.next;
   }

C#
^^

.. code-block:: csharp

   public class Solution {
       public ListNode AddTwoNumbers(ListNode l1, ListNode l2) {
           var dummy = new ListNode(0); // ListNode 由平台提供
           ListNode tail = dummy;
           int carry = 0;

           while (l1 != null || l2 != null || carry != 0) {
               int x = l1 == null ? 0 : l1.val;
               int y = l2 == null ? 0 : l2.val;
               int sum = x + y + carry;

               tail.next = new ListNode(sum % 10);
               tail = tail.next;
               carry = sum / 10;

               if (l1 != null) {
                   l1 = l1.next;
               }
               if (l2 != null) {
                   l2 = l2.next;
               }
           }

           return dummy.next;
       }
   }

Julia
^^^^^

.. code-block:: julia

   mutable struct ListNode
       val::Int
       next::Union{Nothing, ListNode}
   end

   ListNode(val::Int) = ListNode(val, nothing)

   function add_two_numbers(
       l1::Union{Nothing, ListNode},
       l2::Union{Nothing, ListNode},
   )::Union{Nothing, ListNode}
       dummy = ListNode(0)
       tail = dummy
       carry = 0

       while l1 !== nothing || l2 !== nothing || carry != 0
           x = l1 === nothing ? 0 : l1.val
           y = l2 === nothing ? 0 : l2.val
           total = x + y + carry

           tail.next = ListNode(total % 10)
           tail = something(tail.next)
           carry = total ÷ 10  # ÷ 是整数除法运算符

           if l1 !== nothing
               l1 = l1.next
           end
           if l2 !== nothing
               l2 = l2.next
           end
       end

       return dummy.next
   end

R
^

.. code-block:: r

   new_list_node <- function(value, next_node = NULL) {
       node <- new.env(parent = emptyenv())
       assign("val", as.integer(value), envir = node)
       assign("next", next_node, envir = node)
       node
   }

   node_next <- function(node) {
       get("next", envir = node, inherits = FALSE)
   }

   set_node_next <- function(node, next_node) {
       assign("next", next_node, envir = node)
   }

   add_two_numbers <- function(l1, l2) {
       # environment 提供链表节点需要的引用语义。
       dummy <- new_list_node(0L)
       tail <- dummy
       carry <- 0L

       while (!is.null(l1) || !is.null(l2) || carry != 0L) {
           x <- if (is.null(l1)) 0L else l1$val
           y <- if (is.null(l2)) 0L else l2$val
           total <- x + y + carry

           next_node <- new_list_node(total %% 10L)
           set_node_next(tail, next_node)
           tail <- next_node
           carry <- total %/% 10L

           if (!is.null(l1)) {
               l1 <- node_next(l1)
           }
           if (!is.null(l2)) {
               l2 <- node_next(l2)
           }
       }

       node_next(dummy)
   }

对照思路：先转成整数
--------------------

可以先把两个链表还原为整数，相加后再拆成链表。这种方法受固定宽度整数上限限制，
也会掩盖链表逐节点处理和进位状态，因此不作为实现方案。大整数库虽然能绕过溢出，
仍然把题目核心工作交给了现成轮子。

易错点
------

* 循环条件必须包含 ``carry != 0``，否则可能丢失最高位；
* 两个链表长度不同时，缺失位置按 0 处理；
* 哑节点不属于答案，返回的是 ``dummy.next``；
* Rust 需要显式移动节点所有权，并用 ``take`` 取走后继；
* R 使用 ``assign`` 保存值为 ``NULL`` 的 ``next`` 绑定，避免 ``$<- NULL`` 删除绑定；
* C 版本创建的结果节点由调用者或平台负责释放。

本题新增知识
------------

* 单链表节点的字段、引用方向和遍历方式；
* 哑节点用于消除结果链表首次插入的分支；
* ``carry`` 是跨节点传递的最小状态；
* Rust 的 ``Option<Box<ListNode>>`` 所有权移动；
* Julia 的递归可变结构与 R 的环境引用语义。

本题强化知识
------------

* 条件表达式用于把缺失节点映射为数字 0；
* 整数取余得到当前位，整数除法得到下一位进位。

关联题目
--------

* `0001. Two Sum <0001-two-sum.rst>`_：上一题保存过去元素，本题保存跨位进位。

最小自检
--------

#. 为什么输入链表的逆序存储反而方便逐位加法？
#. 哑节点解决了结果链表构造中的哪个特殊分支？
#. 两个输入节点都为空时，为什么循环仍可能需要继续？

答案要点
~~~~~~~~

#. 手算加法从最低位开始，链表头部正好就是最低位；
#. 它让第一个结果节点和后续节点都通过 ``tail.next`` 追加；
#. 最高位计算后可能仍有进位，需要为该进位创建最后一个节点。
