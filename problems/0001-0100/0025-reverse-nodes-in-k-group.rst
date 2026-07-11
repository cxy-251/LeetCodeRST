0025. Reverse Nodes in k-Group
==============================

题目信息
--------

:题号: 0025
:难度: Hard
:主题: 单链表、分组反转、指针重连、边界探测
:原题: `LeetCode 0025 <https://leetcode.com/problems/reverse-nodes-in-k-group/>`_
:访问状态: Available
:教学重点: 先确认完整分组、半开区间反转、组前组后重连、不足 k 个保持原序

题目重述
--------

给定单链表头节点 ``head`` 和正整数 ``k``，从头开始每 ``k`` 个连续节点组成一组，并把每个
完整分组内部的节点顺序反转。

最后不足 ``k`` 个节点的后缀保持原顺序。只能修改节点链接，不能通过交换节点值完成任务。

自建示例
--------

每两个一组
~~~~~~~~~~

.. code-block:: text

   输入：1 -> 2 -> 3 -> 4 -> 5，k = 2
   输出：2 -> 1 -> 4 -> 3 -> 5

每三个一组
~~~~~~~~~~

.. code-block:: text

   输入：1 -> 2 -> 3 -> 4 -> 5，k = 3
   输出：3 -> 2 -> 1 -> 4 -> 5

刚好完整
~~~~~~~~

.. code-block:: text

   输入：1 -> 2 -> 3，k = 3
   输出：3 -> 2 -> 1

组大小为一
~~~~~~~~~~

.. code-block:: text

   输入：1 -> 2 -> 3，k = 1
   输出：1 -> 2 -> 3

问题抽象
--------

设当前完整分组为半开区间 ``[group_start, group_next)``：

.. code-block:: text

   group_prev -> a -> b -> c -> group_next
                  <--- k 个节点 --->

反转后应得到：

.. code-block:: text

   group_prev -> c -> b -> a -> group_next

一轮需要完成三个阶段：

#. 从 ``group_prev`` 向后走 ``k`` 步，确认完整分组并找到 ``kth``；
#. 以 ``group_next`` 作为反转初始前驱，反转半开区间；
#. 把旧组头接到下一组，把 ``group_prev`` 移到旧组头。

“先探测、后修改”十分重要。若未确认完整分组就开始反转，最后不足 ``k`` 个节点时还需要回滚。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 迭代探测并原地反转每组
     - ``O(n)``
     - ``O(1)``
     - 主解法；完整组判断和链接边界都显式
   * - 递归处理每组
     - ``O(n)``
     - ``O(n / k)`` 调用栈
     - 结构接近数学定义，深链表存在栈深风险
   * - 节点放入数组后分块倒序
     - ``O(n)``
     - ``O(n)``
     - 索引简单，但没有练习链表原地重连

主解法：完整组探测与半开区间反转
--------------------------------

状态含义
~~~~~~~~

迭代算法维护：

* ``dummy``：哑节点，统一第一组反转后的新头；
* ``group_prev``：当前分组之前的节点；
* ``kth``：从 ``group_prev`` 向后数第 ``k`` 个节点；
* ``group_next``：``kth.next``，当前分组之后的第一个节点；
* ``current``：反转过程中尚未处理的当前节点；
* ``previous``：反转后当前节点应指向的前驱。

分组探测
~~~~~~~~

令 ``kth = group_prev``，连续执行 ``k`` 次 ``kth = kth.next``：

* 若中途得到空指针，说明剩余节点少于 ``k``，整个算法结束；
* 若成功走完，``group_prev.next`` 到 ``kth`` 恰好有 ``k`` 个节点。

探测阶段不修改任何链接，因此不足一组时后缀天然保持原序。

为什么从 group_next 开始反转
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

普通链表反转常把 ``previous`` 初始化为空。这里应初始化为 ``group_next``：

.. code-block:: text

   previous = group_next
   current = group_prev.next

这样旧组头在反转完成后会自动指向组后缀，无需额外寻找和连接组尾。

反转循环使用半开区间条件 ``current != group_next``，保证只反转本组，不会越过边界。

组间重连
~~~~~~~~

反转前保存 ``old_start = group_prev.next``。反转后：

* ``kth`` 已成为新组头；
* ``old_start`` 已成为新组尾；
* 设置 ``group_prev.next = kth``；
* 设置 ``group_prev = old_start``，为下一组做好准备。

核心不变量
~~~~~~~~~~

每轮外层循环开始时：

* ``dummy.next`` 到 ``group_prev`` 是已经正确完成分组反转的前缀；
* ``group_prev.next`` 是尚未处理后缀的首节点；
* 已处理前缀中的每个完整 ``k`` 节点组都已反转；
* 节点没有丢失、重复或形成环；
* 尚未处理后缀保持原始顺序。

完成一个完整组后，处理前缀增加恰好 ``k`` 个节点，``group_prev`` 移到新组尾，不变量继续成立。

正确性依据
~~~~~~~~~~

分组探测成功时，``group_prev.next`` 到 ``kth`` 恰好包含 ``k`` 个连续节点。半开区间反转循环
逐个把当前节点的 ``next`` 指向 ``previous``，并在修改前保存原后继，因此每个节点恰好移动
一次且不会丢失。由于初始 ``previous`` 是 ``group_next``，反转后的组尾自动连接未处理后缀。

反转完成后，``kth`` 是原组最后节点，也是新组头；``old_start`` 是原组首节点，也是新组尾。
把 ``group_prev.next`` 指向 ``kth`` 后，已处理前缀、当前反转组和未处理后缀重新连成一条链。

算法对所有完整组重复上述过程。最终探测失败时，剩余节点数少于 ``k``，且探测没有修改链接，
所以该后缀保持原序。由此每个完整组都恰好反转一次，不完整后缀不变。

复杂度
~~~~~~

设链表长度为 ``n``：

* 每个节点在分组探测中访问一次，在反转中再访问一次，时间复杂度为 ``O(n)``；
* 主迭代实现只使用固定数量指针，额外空间复杂度为 ``O(1)``；
* 下方 Rust 安全所有权实现采用递归连接各组，调用栈为 ``O(n / k)``。

核心语言实现
------------

以下代码复用仓库约定的 ``ListNode`` 类型。题目保证 ``k >= 1``。

C
~

.. code-block:: c

   struct ListNode *reverseKGroup(
       struct ListNode *head,
       int k
   ) {
       struct ListNode dummy = {0, head};
       struct ListNode *group_prev = &dummy;

       for (;;) {
           struct ListNode *kth = group_prev;

           for (int step = 0; step < k && kth != NULL; ++step) {
               kth = kth->next;
           }

           if (kth == NULL) {
               break;
           }

           struct ListNode *group_next = kth->next;
           struct ListNode *previous = group_next;
           struct ListNode *current = group_prev->next;

           while (current != group_next) {
               struct ListNode *next = current->next;
               current->next = previous;
               previous = current;
               current = next;
           }

           /* 旧组头在反转后成为组尾。 */
           struct ListNode *old_start = group_prev->next;
           group_prev->next = kth;
           group_prev = old_start;
       }

       return dummy.next;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode* reverseKGroup(ListNode* head, int k) {
           ListNode dummy(0, head);
           ListNode* group_prev = &dummy;

           while (true) {
               ListNode* kth = group_prev;

               for (int step = 0; step < k && kth != nullptr;
                    ++step) {
                   kth = kth->next;
               }

               if (kth == nullptr) {
                   break;
               }

               ListNode* group_next = kth->next;
               ListNode* previous = group_next;
               ListNode* current = group_prev->next;

               while (current != group_next) {
                   ListNode* next = current->next;
                   current->next = previous;
                   previous = current;
                   current = next;
               }

               ListNode* old_start = group_prev->next;
               group_prev->next = kth;
               group_prev = old_start;
           }

           return dummy.next;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def reverseKGroup(
           self,
           head: Optional[ListNode],
           k: int,
       ) -> Optional[ListNode]:
           dummy = ListNode(0, head)
           group_prev = dummy

           while True:
               kth = group_prev

               for _ in range(k):
                   kth = kth.next
                   if kth is None:
                       return dummy.next

               group_next = kth.next
               previous = group_next
               current = group_prev.next

               while current is not group_next:
                   next_node = current.next
                   current.next = previous
                   previous = current
                   current = next_node

               old_start = group_prev.next
               group_prev.next = kth
               group_prev = old_start

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode reverseKGroup(ListNode head, int k) {
           ListNode dummy = new ListNode(0, head);
           ListNode groupPrev = dummy;

           while (true) {
               ListNode kth = groupPrev;

               for (int step = 0; step < k && kth != null; ++step) {
                   kth = kth.next;
               }

               if (kth == null) {
                   break;
               }

               ListNode groupNext = kth.next;
               ListNode previous = groupNext;
               ListNode current = groupPrev.next;

               while (current != groupNext) {
                   ListNode next = current.next;
                   current.next = previous;
                   previous = current;
                   current = next;
               }

               ListNode oldStart = groupPrev.next;
               groupPrev.next = kth;
               groupPrev = oldStart;
           }

           return dummy.next;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn reverse_k_group(
           head: Option<Box<ListNode>>,
           k: i32,
       ) -> Option<Box<ListNode>> {
           if k <= 1 {
               return head;
           }

           // 先只读检查当前后缀是否至少包含 k 个节点。
           let mut cursor = &head;
           for _ in 0..k {
               match cursor {
                   Some(node) => cursor = &node.next,
                   None => return head,
               }
           }

           let mut current = head;
           let mut reversed: Option<Box<ListNode>> = None;

           for _ in 0..k {
               let mut node = current.unwrap();
               current = node.next.take();
               node.next = reversed;
               reversed = Some(node);
           }

           let rest = Self::reverse_k_group(current, k);

           // 反转后的尾节点是原组头，把它接到递归结果。
           let mut tail_link = &mut reversed;
           while tail_link.as_ref().unwrap().next.is_some() {
               tail_link = &mut tail_link.as_mut().unwrap().next;
           }
           tail_link.as_mut().unwrap().next = rest;

           reversed
       }
   }

安全 Rust 版本先只读确认完整组，再取得节点所有权逐个反转。为了避免复杂的重叠可变借用，
它递归处理后缀，因此额外调用栈为 ``O(n / k)``；其余语言的实现是 ``O(1)`` 额外空间。

Go
~~

.. code-block:: go

   func reverseKGroup(head *ListNode, k int) *ListNode {
       dummy := &ListNode{Next: head}
       groupPrev := dummy

       for {
           kth := groupPrev

           for step := 0; step < k && kth != nil; step++ {
               kth = kth.Next
           }

           if kth == nil {
               break
           }

           groupNext := kth.Next
           previous := groupNext
           current := groupPrev.Next

           for current != groupNext {
               next := current.Next
               current.Next = previous
               previous = current
               current = next
           }

           oldStart := groupPrev.Next
           groupPrev.Next = kth
           groupPrev = oldStart
       }

       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function reverseKGroup(
       head: ListNode | null,
       k: number,
   ): ListNode | null {
       const dummy = new ListNode(0, head);
       let groupPrev: ListNode = dummy;

       while (true) {
           let kth: ListNode | null = groupPrev;

           for (let step = 0; step < k && kth !== null; step++) {
               kth = kth.next;
           }

           if (kth === null) {
               break;
           }

           const groupNext = kth.next;
           let previous: ListNode | null = groupNext;
           let current: ListNode | null = groupPrev.next;

           while (current !== groupNext) {
               const next: ListNode | null = current!.next;
               current!.next = previous;
               previous = current;
               current = next;
           }

           const oldStart = groupPrev.next!;
           groupPrev.next = kth;
           groupPrev = oldStart;
       }

       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode ReverseKGroup(ListNode head, int k) {
           ListNode dummy = new ListNode(0, head);
           ListNode groupPrev = dummy;

           while (true) {
               ListNode kth = groupPrev;

               for (int step = 0; step < k && kth != null; ++step) {
                   kth = kth.next;
               }

               if (kth == null) {
                   break;
               }

               ListNode groupNext = kth.next;
               ListNode previous = groupNext;
               ListNode current = groupPrev.next;

               while (current != groupNext) {
                   ListNode next = current.next;
                   current.next = previous;
                   previous = current;
                   current = next;
               }

               ListNode oldStart = groupPrev.next;
               groupPrev.next = kth;
               groupPrev = oldStart;
           }

           return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function reverse_k_group(
       head::Union{ListNode, Nothing},
       k::Int,
   )
       dummy = ListNode(0, head)
       group_prev = dummy

       while true
           kth = group_prev

           for _ in 1:k
               kth = kth.next
               kth === nothing && return dummy.next
           end

           group_next = kth.next
           previous = group_next
           current = group_prev.next

           while current !== group_next
               next_node = current.next
               current.next = previous
               previous = current
               current = next_node
           end

           old_start = group_prev.next
           group_prev.next = kth
           group_prev = old_start
       end
   end

R
~

.. code-block:: r

   reverse_k_group <- function(head, k) {
     dummy <- new_list_node(0, head)
     group_prev <- dummy

     repeat {
       kth <- group_prev

       for (step in seq_len(k)) {
         kth <- kth$next

         if (is.null(kth)) {
           return(dummy$next)
         }
       }

       group_next <- kth$next
       previous <- group_next
       current <- group_prev$next

       while (!identical(current, group_next)) {
         next_node <- current$next
         current$next <- previous
         previous <- current
         current <- next_node
       }

       old_start <- group_prev$next
       group_prev$next <- kth
       group_prev <- old_start
     }
   }

关键边界
--------

* ``k = 1``：每组只有一个节点，链表保持不变；
* 链表长度小于 ``k``：第一次探测失败，原链表直接返回；
* 链表长度恰为 ``k``：完整反转一次；
* 长度不是 ``k`` 的倍数：最后不足一组的后缀保持原序；
* 第一组反转：结果头变化，必须通过哑节点或等价机制更新；
* ``k`` 很大：探测仍为线性，不应先反转再回滚。

易错点
------

* 未先确认完整组就开始反转，导致不足 ``k`` 的后缀被错误修改；
* 用 ``current != NULL`` 作为内层条件，越过 ``group_next`` 反转了后续分组；
* 把 ``previous`` 初始化为空，忘记重新连接组尾和后缀；
* 反转后没有保存旧组头，无法确定下一轮的 ``group_prev``；
* 分组探测从 ``group_prev.next`` 开始却仍走 ``k`` 次，产生一位偏移；
* 通过交换节点值伪装节点反转，不符合题意。

新增与强化知识
--------------

新增
~~~~

* 链表区间可用半开边界 ``[start, end)`` 精确描述和反转；
* “先只读探测、再破坏性修改”可消除失败回滚；
* 把区间后继作为反转初始前驱，可让组尾自动连接后缀；
* 同一局部变换可以在迭代指针模型和所有权递归模型中表达。

强化
~~~~

* 0024 的两节点交换是本题在 ``k = 2`` 时的特例；
* 哑节点继续统一第一组和后续分组；
* 指针算法必须明确保存旧后继，避免覆盖后丢失链表；
* 正确性证明需要覆盖分组内部反转、组间连接和不完整后缀三部分。

最小自检
--------

#. 为什么必须在修改链接前确认当前后缀至少有 ``k`` 个节点？
#. 为什么内层反转把 ``previous`` 初始化为 ``group_next``？
#. 一组反转后，下一轮的 ``group_prev`` 应是哪一个节点？
#. 对 ``1 -> 2 -> 3 -> 4 -> 5`` 和 ``k = 3``，最后两个节点为什么不变？
#. 0024 与本题之间是什么关系？

答案要点
~~~~~~~~

#. 否则最后不足一组时已经破坏链接，需要额外回滚。
#. 这样旧组头反转为组尾后会直接指向未处理后缀。
#. 原组首节点；它在反转后成为当前组尾。
#. 探测第二组时只剩两个节点，未修改任何链接便结束。
#. 0024 等价于固定 ``k = 2`` 的分组反转。
