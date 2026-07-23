0002. Add Two Numbers
=====================

题目信息
--------

:题号: 0002
:难度: Medium
:主题: 链表、模拟、进位、节点构造
:原题: `LeetCode 0002 <https://leetcode.com/problems/add-two-numbers/>`_
:重点: 逆序数位表示、逐位竖式加法、进位状态、哑节点、节点复用与新建

题目重述
--------

两个非空单链表 ``l1`` 和 ``l2`` 分别表示两个非负整数。每个节点保存一位十进制数字，
链表头部是最低位，沿 ``next`` 方向依次走向更高位。需要返回一个同样按低位到高位排列的
链表，表示两数之和。

每个输入链表包含 ``1`` 至 ``100`` 个节点，节点值位于 ``[0, 9]``。除数字 ``0`` 本身外，
输入表示的整数没有多余高位零。输入节点类型由 LeetCode 平台提供。

自建示例
--------

长度不同且连续进位：

.. code-block:: text

   输入：l1 = [8, 9, 9], l2 = [7]
   表示：998 + 7
   输出：[5, 0, 0, 1]
   表示：1005

该示例同时展示较短链表结束后的补零、连续进位以及最终新增最高位节点。

没有最终进位：

.. code-block:: text

   输入：l1 = [3, 4], l2 = [6, 5, 9]
   表示：43 + 956
   输出：[9, 9, 9]
   表示：999

该示例展示某一侧结束后，另一侧节点仍需继续参与计算。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <utility>

   // ListNode 由 LeetCode 平台提供。
   class Solution {
   private:
       ListNode* buildNewList(ListNode* l1, ListNode* l2) {
           ListNode dummy(0);
           ListNode* tail = &dummy;
           int carry = 0;

           while (l1 != nullptr || l2 != nullptr || carry != 0) {
               const int x = l1 == nullptr ? 0 : l1->val;
               const int y = l2 == nullptr ? 0 : l2->val;
               const int total = x + y + carry;

               tail->next = new ListNode(total % 10);
               tail = tail->next;
               carry = total / 10;  // 当前列产生的进位交给下一列

               if (l1 != nullptr) {
                   l1 = l1->next;
               }
               if (l2 != nullptr) {
                   l2 = l2->next;
               }
           }

           return dummy.next;
       }

       int length(ListNode* node) {
           int result = 0;
           while (node != nullptr) {
               ++result;
               node = node->next;
           }
           return result;
       }

       ListNode* reuseLongerList(ListNode* l1, ListNode* l2) {
           if (length(l1) < length(l2)) {
               std::swap(l1, l2);  // 让 l1 提供足够的结果节点
           }

           ListNode* const head = l1;
           ListNode* previous = nullptr;
           int carry = 0;

           while (l1 != nullptr) {
               const int y = l2 == nullptr ? 0 : l2->val;
               const int total = l1->val + y + carry;

               l1->val = total % 10;  // 复用较长链表的当前节点
               carry = total / 10;
               previous = l1;
               l1 = l1->next;

               if (l2 != nullptr) {
                   l2 = l2->next;
               }
           }

           if (carry != 0) {
               previous->next = new ListNode(carry);
           }

           return head;
       }

   public:
       ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
           return buildNewList(l1, l2);  // 主解法保留两个输入链表
       }
   };

题解
----

为什么逆序链表可以直接模拟竖式加法
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

十进制竖式加法从最低位开始：先计算个位，再把进位传给十位，随后继续向更高位推进。题目把
最低位放在链表头部，因此链表的自然遍历顺序与竖式加法的计算顺序完全一致：

.. code-block:: text

   l1: 个位 -> 十位 -> 百位 -> ...
   l2: 个位 -> 十位 -> 百位 -> ...
   计算: 当前列 -> 下一列 -> 更高列 -> ...

若最高位放在链表头部，就需要先走到链表末尾、反转链表或借助栈才能从最低位开始。本题的逆序
表示省去了这一步，使每个输入指针都只向前移动。

从整数字面值到逐节点状态
~~~~~~~~~~~~~~~~~~~~~~~~

直接把链表还原成普通整数再相加，会受固定宽度整数范围限制。每个链表最多包含 100 位数字，
远超常见 ``32`` 位或 ``64`` 位整数能够表示的范围。逐节点模拟只处理当前两位和一个进位，
所需数值始终很小。

处理某一列时，状态只有：

.. code-block:: text

   x      = l1 当前节点的数字，节点缺失时取 0
   y      = l2 当前节点的数字，节点缺失时取 0
   carry  = 前一列传来的进位
   total  = x + y + carry
   digit  = total % 10
   carry' = total / 10 的整数部分

节点值最大为 9，旧进位最大为 1，所以 ``total <= 19``，新进位仍然只可能是 0 或 1。
这说明跨列传递的全部历史信息可以压缩为一个整数 ``carry``。

为什么缺失节点可以按零处理
~~~~~~~~~~~~~~~~~~~~~~~~~~

两个数字位数不同时，较短链表会先到达空指针。竖式加法中，缺失的高位等价于该位置数字为零。
因此代码使用：

.. code-block:: text

   x = l1 为空 ? 0 : l1.val
   y = l2 为空 ? 0 : l2.val

这样，同一个循环既能处理两侧都有节点的列，也能处理只剩一侧节点的列。输入指针只在对应节点
存在时向后移动，较长链表的剩余节点会继续逐个参与计算。

主解法状态演化
~~~~~~~~~~~~~~

使用自建示例 ``l1 = [8, 9, 9]``、``l2 = [7]``：

.. list-table::
   :header-rows: 1

   * - 当前列
     - ``x``
     - ``y``
     - 旧 ``carry``
     - ``total``
     - 结果位
     - 新 ``carry``
     - 已构造结果
   * - 个位
     - 8
     - 7
     - 0
     - 15
     - 5
     - 1
     - ``5``
   * - 十位
     - 9
     - 0
     - 1
     - 10
     - 0
     - 1
     - ``5 -> 0``
   * - 百位
     - 9
     - 0
     - 1
     - 10
     - 0
     - 1
     - ``5 -> 0 -> 0``
   * - 千位
     - 0
     - 0
     - 1
     - 1
     - 1
     - 0
     - ``5 -> 0 -> 0 -> 1``

前三轮分别消费输入节点。两条输入链表都结束后，``carry`` 仍为 1，因此循环继续一轮，把进位
写成新的最高位节点。若循环条件只检查两个输入指针，结果会错误地变成 ``[5, 0, 0]``。

哑节点如何统一结果链表构造
~~~~~~~~~~~~~~~~~~~~~~~~~~

结果链表开始时还没有真实节点。若直接维护结果头指针，创建第一个节点时需要单独设置头部，
后续节点则追加到尾部。哑节点提供一个固定的前驱：

.. code-block:: text

   dummy -> 第一个结果节点 -> 第二个结果节点 -> ...
              ^
             tail 最终沿结果链表向后移动

每轮都执行同一组操作：

.. code-block:: text

   tail.next = 新节点
   tail = tail.next

哑节点本身不属于答案，最终返回 ``dummy.next``。它只存在于函数内部；C++ 主解法中的哑节点
位于栈上，而所有结果节点由 ``new`` 创建并通过 ``dummy.next`` 连成返回链表。

新建结果节点与复用输入节点
~~~~~~~~~~~~~~~~~~~~~~~~~~

``buildNewList`` 为每一位结果创建独立节点。两个输入链表的节点值和链接保持原状，返回链表与
输入没有共享节点。这种对象语义最清晰，也是九语言统一采用的主解法。

``reuseLongerList`` 先计算两条链表长度，让较长链表承担结果存储。它逐位覆盖该链表节点的
``val``，并在最终仍有进位时追加一个节点。由于结果最多比较长输入多一位，较长链表提供的节点
数量足够。该方案把除最终进位节点外的额外节点分配降为零，但会修改其中一条输入链表，并且
为了选择较长链表需要先遍历两次长度。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 除结果外空间
     - 节点分配
     - 输入状态
   * - 新建结果链表
     - ``O(max(m, n))``
     - ``O(1)``
     - ``max(m, n)`` 或 ``max(m, n) + 1`` 个
     - 两个输入保持原状
   * - 复用较长输入
     - ``O(m + n)``
     - ``O(1)``
     - 至多一个最终进位节点
     - 较长输入被改写为结果

主解法选择新建结果链表，因为它保持输入结构、节点身份和返回所有权清晰，能够直接映射到九种
语言。复用方案适合接口允许修改输入且需要减少节点分配的场景。

为什么每轮生成的节点就是对应数位
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

进入某轮时，结果链表已经保存所有处理完成的低位，``carry`` 等于这些低位向当前列产生的进位，
两个输入指针分别指向尚未处理的最低位节点。

当前列的真实和值只能由 ``x``、``y`` 和旧 ``carry`` 组成。``total % 10`` 是该列十进制结果位，
``total / 10`` 是唯一需要传给下一列的进位。追加结果节点后再推进输入指针，结果链表就多保存了
一个正确低位，新的 ``carry`` 也正好对应下一列，所以上述状态在下一轮继续成立。

循环条件包含 ``l1``、``l2`` 和 ``carry``。只要还有输入位或未写出的最高位进位，算法就继续；
三者都结束时，所有输入数位和最终进位均已写入结果。因此返回链表既没有遗漏数位，也不会添加
多余高位零。

复杂度来源
~~~~~~~~~~

设两个输入链表长度分别为 ``m`` 和 ``n``。

``buildNewList`` 每轮至少消费一个输入节点，输入结束后最多再处理一次最终进位，因此循环次数为
``max(m, n)`` 或 ``max(m, n) + 1``。每轮只执行常数次读取、加法、除余、节点创建和指针更新，
时间复杂度为 ``O(max(m, n))``。

返回链表包含 ``max(m, n)`` 或 ``max(m, n) + 1`` 个节点，结果空间为 ``O(max(m, n))``。
除返回节点外，只维护两个输入指针、一个尾指针、哑节点和 ``carry``，辅助空间为 ``O(1)``。

``reuseLongerList`` 先分别扫描两条链表求长度，再覆盖较长链表，访问节点总数仍为 ``O(m + n)``；
除可能追加的最终进位节点外只使用常数状态。

九语言实现
----------

C
~

C 版本创建独立结果节点。``free_list`` 只用于内存分配失败时回收本函数已经创建的部分结果；
成功返回后，结果链表由调用者或平台负责释放。

.. code-block:: c

   #include <stdlib.h>

   // struct ListNode 由 LeetCode 平台提供。
   static void free_list(struct ListNode* head) {
       while (head != NULL) {
           struct ListNode* next = head->next;
           free(head);
           head = next;
       }
   }

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
           const int total = x + y + carry;

           struct ListNode* node = malloc(sizeof(struct ListNode));
           if (node == NULL) {
               free_list(dummy.next);
               return NULL;
           }

           node->val = total % 10;
           node->next = NULL;
           tail->next = node;
           tail = node;
           carry = total / 10;  // 把当前列进位交给下一列

           if (l1 != NULL) {
               l1 = l1->next;
           }
           if (l2 != NULL) {
               l2 = l2->next;
           }
       }

       return dummy.next;
   }

Python
~~~~~~

.. code-block:: python

   from typing import Optional

   class Solution:
       def addTwoNumbers(
           self,
           l1: Optional[ListNode],
           l2: Optional[ListNode],
       ) -> Optional[ListNode]:
           dummy = ListNode(0)
           tail = dummy
           carry = 0

           while l1 is not None or l2 is not None or carry != 0:
               x = 0 if l1 is None else l1.val
               y = 0 if l2 is None else l2.val
               total = x + y + carry

               tail.next = ListNode(total % 10)
               tail = tail.next
               carry = total // 10  # 当前列产生的新进位

               if l1 is not None:
                   l1 = l1.next
               if l2 is not None:
                   l2 = l2.next

           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
           ListNode dummy = new ListNode(0);
           ListNode tail = dummy;
           int carry = 0;

           while (l1 != null || l2 != null || carry != 0) {
               int x = l1 == null ? 0 : l1.val;
               int y = l2 == null ? 0 : l2.val;
               int total = x + y + carry;

               tail.next = new ListNode(total % 10);
               tail = tail.next;
               carry = total / 10;  // Java 整数除法保留商的整数部分

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
~~~~

Rust 的平台签名把两个输入链表的所有权传入函数。下面只借用输入节点读取数字，并为结果创建新的
``Box<ListNode>``，因此结果节点与输入节点没有共享所有权。

.. code-block:: rust

   impl Solution {
       pub fn add_two_numbers(
           l1: Option<Box<ListNode>>,
           l2: Option<Box<ListNode>>,
       ) -> Option<Box<ListNode>> {
           let mut p1 = l1.as_ref();
           let mut p2 = l2.as_ref();
           let mut dummy = Box::new(ListNode::new(0));
           let mut tail = &mut dummy;
           let mut carry = 0;

           while p1.is_some() || p2.is_some() || carry != 0 {
               let x = p1.map_or(0, |node| node.val);
               let y = p2.map_or(0, |node| node.val);
               let total = x + y + carry;

               tail.next = Some(Box::new(ListNode::new(total % 10)));
               tail = tail.next.as_mut().unwrap();
               carry = total / 10;  // 当前列产生的新进位

               p1 = p1.and_then(|node| node.next.as_ref());
               p2 = p2.and_then(|node| node.next.as_ref());
           }

           dummy.next
       }
   }

Go
~~

.. code-block:: go

   func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
       dummy := &ListNode{}
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

           total := x + y + carry
           tail.Next = &ListNode{Val: total % 10}
           tail = tail.Next
           carry = total / 10 // 当前列产生的新进位
       }

       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function addTwoNumbers(
       l1: ListNode | null,
       l2: ListNode | null,
   ): ListNode | null {
       const dummy = new ListNode(0);
       let tail = dummy;
       let carry = 0;

       while (l1 !== null || l2 !== null || carry !== 0) {
           const x = l1 === null ? 0 : l1.val;
           const y = l2 === null ? 0 : l2.val;
           const total = x + y + carry;

           tail.next = new ListNode(total % 10);
           tail = tail.next;
           carry = Math.floor(total / 10); // 当前列产生的新进位

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
~~

.. code-block:: csharp

   public class Solution {
       public ListNode AddTwoNumbers(ListNode l1, ListNode l2) {
           var dummy = new ListNode(0);
           ListNode tail = dummy;
           int carry = 0;

           while (l1 != null || l2 != null || carry != 0) {
               int x = l1 == null ? 0 : l1.val;
               int y = l2 == null ? 0 : l2.val;
               int total = x + y + carry;

               tail.next = new ListNode(total % 10);
               tail = tail.next;
               carry = total / 10; // 当前列产生的新进位

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
~~~~~

Julia 没有 LeetCode 的统一节点接口，因此显式定义可变节点。``next`` 使用
``Union{Nothing, ListNode}`` 表达链表末尾。

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
           carry = total ÷ 10  # 当前列产生的新进位

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
~

R 使用环境表示带引用语义的可变节点。``assign`` 可以把 ``NULL`` 保存为 ``next`` 字段值；
直接使用 ``node$next <- NULL`` 会删除该绑定。

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
       dummy <- new_list_node(0L)
       tail <- dummy
       carry <- 0L

       while (!is.null(l1) || !is.null(l2) || carry != 0L) {
           x <- if (is.null(l1)) 0L else l1$val
           y <- if (is.null(l2)) 0L else l2$val
           total <- x + y + carry

           node <- new_list_node(total %% 10L)
           set_node_next(tail, node)
           tail <- node
           carry <- total %/% 10L # 当前列产生的新进位

           if (!is.null(l1)) {
               l1 <- node_next(l1)
           }
           if (!is.null(l2)) {
               l2 <- node_next(l2)
           }
       }

       node_next(dummy)
   }
