0203. Remove Linked List Elements
=================================

题目信息
--------

:题号: 0203
:难度: Easy
:主题: 单链表、节点删除、指针重接
:原题: `LeetCode 0203 <https://leetcode.com/problems/remove-linked-list-elements/>`_
:重点: 删除所有匹配节点、头尾和连续匹配、返回新头节点、保留相对顺序

题目重述
--------

给定单链表头节点 ``head`` 和整数 ``val``，删除链表中每一个节点值等于 ``val`` 的节点，并返回删除完成后的链表头节点。匹配节点可能位于头部、尾部或中间，也可能连续出现；所有匹配节点都必须移除。

链表节点数位于 ``[0, 10^4]``，节点值和 ``val`` 均位于 ``[1, 50]``。未删除节点在结果链表中的相对顺序保持不变。若原头节点被删除，返回值应指向新的首节点；若全部节点都被删除或输入为空，返回空引用。

自建示例
--------

头尾及中间都有匹配值：

.. code-block:: text

   输入：head = [5, 2, 5, 3, 5]，val = 5
   输出：[2, 3]
   解释：三个值为 5 的节点全部删除，剩余节点仍按 2、3 的原顺序连接。

没有节点需要删除：

.. code-block:: text

   输入：head = [4, 4, 1]，val = 2
   输出：[4, 4, 1]
   解释：链表中没有值为 2 的节点，因此结果中的值序列与输入相同。

问题抽象与解法选择
------------------

删除链表节点的核心操作是修改“指向当前节点的链接”。对于中间节点，
这个链接是前驱的 ``next``；对于头节点，这个链接是外部变量 ``head``。
如果分别处理，会产生头部循环和主体循环两套边界逻辑。

在原头之前放置一个虚拟头节点 ``dummy``：

.. code-block:: text

   dummy -> head -> ...

这样原头也变成了 ``dummy.next`` 指向的普通后继。维护前驱 ``previous``：
* 检查 ``previous.next``；
* 若其值等于 ``val``，令 ``previous.next = previous.next.next``，但 ``previous`` 不前进；
* 否则令 ``previous = previous.next``；
* 最终返回 ``dummy.next``。

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 核心额外空间
     - 取舍
   * - 虚拟头 + 前驱指针
     - ``O(n)``
     - ``O(1)``
     - 主解法；头部与中间删除统一
   * - 先循环删除头部，再处理主体
     - ``O(n)``
     - ``O(1)``
     - 正确但分支重复，容易遗漏连续头节点
   * - 递归过滤
     - ``O(n)``
     - ``O(n)`` 调用栈
     - 表达简洁，长链表有栈深风险
   * - 创建全新链表复制保留值
     - ``O(n)``
     - ``O(n)``
     - 破坏节点复用与身份语义

状态与连接不变量
----------------

主循环维护 ``previous``，当前候选节点为 ``previous.next``。每轮开始时保持：

* 从 ``dummy.next`` 到 ``previous`` 的所有节点都已经检查且值不等于 ``val``；
* 这些已保留节点保持原链表中的相对顺序；
* ``previous.next`` 是尚未检查后缀的第一个节点，或为空；
* 已删除节点不再能从 ``dummy.next`` 到达；
* 尚未检查后缀内部的连接仍保持原顺序；
* 保留前缀最后节点 ``previous`` 与未检查后缀之间只有一条 ``next`` 连接，不会产生断链或环。

删除分支
~~~~~~~~

设 ``candidate=previous.next`` 且值匹配：

.. code-block:: text

   previous -> candidate -> successor

执行：

.. code-block:: text

   previous.next = successor

删除后 ``previous`` 仍是已确认保留前缀的最后节点，
``successor`` 变成新的首个未检查节点。由于 ``successor`` 也可能匹配，前驱不能前进。

保留分支
~~~~~~~~

若 ``candidate.val != val``，它应保留。执行 ``previous=candidate`` 后，
该节点加入已确认前缀，新的 ``previous.next`` 指向下一个未检查节点。

正确性证明
----------

引理一：虚拟头把头部删除转化为普通后继删除
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

原头节点始终由 ``dummy.next`` 引用。删除原头时执行的仍是
``previous.next=candidate.next``，其中 ``previous`` 恰好是 ``dummy``。
因此不需要修改独立的外部头变量，也不需要为头部连续匹配设计另一套循环。

引理二：删除分支准确移除当前节点且不丢失后缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

删除前 ``candidate=previous.next``，``successor=candidate.next``。
把 ``previous.next`` 改为 ``successor`` 后，从虚拟头出发不再能到达 ``candidate``，
所以它被移除；同时 ``successor`` 及其后缀仍由 ``previous`` 引用，
因此没有丢失任何尚未检查节点。除这一条连接外，其他连接不变，不会重排保留节点。

引理三：保留分支把一个非目标节点加入正确前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若 ``candidate.val != val``，契约要求保留它。前驱移动到 ``candidate`` 后，
已确认前缀增加该节点；它在原链表中紧跟旧前缀，因此相对顺序正确。
它的 ``next`` 未修改，仍指向尚未检查后缀。

引理四：循环不变量始终成立
~~~~~~~~~~~~~~~~~~~~~~~~~~

初始时 ``previous=dummy``，已检查真实节点前缀为空，
``dummy.next=head`` 指向完整未检查链表，不变量成立。

若当前节点匹配，由引理二删除后前驱不变，新 ``previous.next`` 指向剩余未检查后缀首节点，
不变量继续成立。若不匹配，由引理三将它加入已确认前缀，不变量也成立。

引理五：每个原节点恰好检查一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

未检查后缀的首节点每轮都会被处理。匹配时该节点被移除，
后缀首节点前进到其后继；不匹配时前驱移动到该节点，下一候选也变成其后继。
两种情况都使当前节点永久离开“未检查”集合，且不会重新进入，
所以每个原节点恰好检查一次。

定理：算法返回删除全部目标值后的链表
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

循环结束时 ``previous.next`` 为空，即未检查后缀为空。由循环不变量，
``dummy.next`` 可达的所有真实节点都已检查且值不等于 ``val``，顺序与原链表一致；
由引理二，所有匹配节点在被检查时都已移除。故返回 ``dummy.next`` 正好满足契约。

无环与终止性
~~~~~~~~~~~~

算法只把前驱的 ``next`` 指向原本位于当前节点之后的 ``successor``，
从不指回更早节点，因此不会创建环。由引理五，每轮永久处理一个原节点，
有限节点处理完后循环终止。

人工指针推演
------------

头部连续删除
~~~~~~~~~~~~

对 ``7 -> 7 -> 2``，``val=7``：

.. code-block:: text

   dummy -> 7a -> 7b -> 2
   previous=dummy

   删除 7a：dummy -> 7b -> 2，previous 仍为 dummy
   删除 7b：dummy -> 2，previous 仍为 dummy
   保留 2：previous 移到 2

返回 ``dummy.next``，即节点 2。

中间连续删除
~~~~~~~~~~~~

对 ``1 -> 4a -> 4b -> 2``，先保留 1，使 ``previous`` 指向 1。
删除 4a 后 ``previous`` 仍指向 1，下一候选立即是 4b；
再删除 4b，最后连接成 ``1 -> 2``。

全部删除
~~~~~~~~

虚拟头本身不属于结果。每个真实节点都被重接跳过后，``dummy.next`` 变为空，正确返回空链表。

所有权与语言边界
----------------

* C：本实现明确假设调用方把节点所有权交给函数。删除节点前保存后继，
  重接后调用 ``free(candidate)``；保留节点和虚拟头栈对象不释放。
  若某个平台统一管理节点内存，应去掉 ``free`` 并同步修改所有权说明；
* C++：示例只重接指针，不主动 ``delete``，因为在线评测通常没有声明函数拥有节点分配权；
  实际工程应由明确的所有者释放不可达节点；
* Python、Java、Go、TypeScript、C#、Julia 与 R：删除后节点若无其他引用，
  将由运行时垃圾回收；算法本身只负责连接语义；
* Rust：``Option<Box<ListNode>>`` 表达唯一所有权。
  实现反复取得“当前链接槽位”中的 ``Box``；删除时把 ``node.next`` 移回槽位，
  旧 ``Box`` 离开作用域自动释放；保留时把节点放回槽位，
  再把槽位引用推进到其 ``next``；
* R：节点使用 ``environment``，重新赋值 ``next`` 会修改共享节点对象；
  函数返回新的真实头。若外部仍持有被删除节点引用，
  该节点不会立即回收，但已不在返回链中；
* Julia：可变节点按引用共享，函数会修改保留节点的 ``next`` 连接；
* 所有实现只创建一个虚拟头，不复制保留节点。

复杂度
------

* 每个原节点恰好检查一次，时间复杂度 ``O(n)``；
* 除虚拟头、前驱和临时候选外，核心额外空间 ``O(1)``；
* Rust 的 ``Box`` 所有权移动和托管语言的引用赋值都是每节点常数操作；
* C 删除节点时逐个释放，总释放次数等于删除节点数；
* 返回链表复用原有保留节点，返回载荷不是新分配的 ``O(n)`` 容器。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       ListNode* removeElements(ListNode* head, int val) {
           ListNode dummy(0);
           dummy.next = head;
           ListNode* previous = &dummy;

           while (previous->next != nullptr) {
               if (previous->next->val == val) {
                   previous->next = previous->next->next;
               } else {
                   previous = previous->next;
               }
           }
           return dummy.next;
       }
   };

代码分析
--------

``previous`` 始终指向已经确认保留的节点，并检查它后面的第一个尚未处理节点。遇到目标值时只把前驱的 ``next`` 越过该节点；不移动 ``previous``，是因为新的后继仍可能连续含有目标值。遇到非目标值才前进，因此每个节点恰好检查一次。虚拟头把“删除原头节点”和“删除中间节点”统一成同一条重连规则。

例如 ``1 -> 6 -> 6 -> 3``、目标值为 ``6`` 时，第一次删除后仍检查虚拟头后的第二个 ``6``，第二次删除后再保留 ``3``，结果为 ``1 -> 3``。代码只重连节点，不复制保留节点；时间复杂度为 ``O(n)``，除固定的虚拟头和指针外额外空间为 ``O(1)``。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdlib.h>

   struct ListNode *removeElements(struct ListNode *head, int val) {
       struct ListNode dummy = {0, head};
       struct ListNode *previous = &dummy;

       while (previous->next != NULL) {
           struct ListNode *candidate = previous->next;
           if (candidate->val == val) {
               struct ListNode *successor = candidate->next;
               previous->next = successor;
               free(candidate);
           } else {
               previous = candidate;
           }
       }

       return dummy.next;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode* removeElements(ListNode* head, int val) {
           ListNode dummy(0, head);
           ListNode* previous = &dummy;

           while (previous->next != nullptr) {
               if (previous->next->val == val) {
                   previous->next = previous->next->next;
               } else {
                   previous = previous->next;
               }
           }

           return dummy.next;
       }
   };

Python
~~~~~~

.. code-block:: python

   from typing import Optional

   class Solution:
       def removeElements(
           self,
           head: Optional[ListNode],
           val: int,
       ) -> Optional[ListNode]:
           dummy = ListNode(0, head)
           previous = dummy

           while previous.next is not None:
               if previous.next.val == val:
                   previous.next = previous.next.next
               else:
                   previous = previous.next

           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode removeElements(ListNode head, int val) {
           ListNode dummy = new ListNode(0, head);
           ListNode previous = dummy;

           while (previous.next != null) {
               if (previous.next.val == val) {
                   previous.next = previous.next.next;
               } else {
                   previous = previous.next;
               }
           }

           return dummy.next;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn remove_elements(
           head: Option<Box<ListNode>>,
           val: i32,
       ) -> Option<Box<ListNode>> {
           let mut dummy = Box::new(ListNode { val: 0, next: head });
           let mut link = &mut dummy.next;

           while let Some(mut node) = link.take() {
               if node.val == val {
                   *link = node.next.take();
               } else {
                   *link = Some(node);
                   link = &mut link.as_mut().unwrap().next;
               }
           }

           dummy.next
       }
   }

Go
~~

.. code-block:: go

   func removeElements(head *ListNode, val int) *ListNode {
       dummy := &ListNode{Val: 0, Next: head}
       previous := dummy

       for previous.Next != nil {
           if previous.Next.Val == val {
               previous.Next = previous.Next.Next
           } else {
               previous = previous.Next
           }
       }

       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function removeElements(
       head: ListNode | null,
       val: number,
   ): ListNode | null {
       const dummy = new ListNode(0, head);
       let previous: ListNode = dummy;

       while (previous.next !== null) {
           if (previous.next.val === val) {
               previous.next = previous.next.next;
           } else {
               previous = previous.next;
           }
       }

       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode RemoveElements(ListNode head, int val) {
           ListNode dummy = new ListNode(0, head);
           ListNode previous = dummy;

           while (previous.next != null) {
               if (previous.next.val == val) {
                   previous.next = previous.next.next;
               } else {
                   previous = previous.next;
               }
           }

           return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function remove_elements(
       head::Union{Nothing,ListNode},
       target::Int,
   )::Union{Nothing,ListNode}
       dummy = ListNode(0, head)
       previous = dummy

       while previous.next !== nothing
           candidate = previous.next::ListNode
           if candidate.val == target
               previous.next = candidate.next
           else
               previous = candidate
           end
       end

       return dummy.next
   end

R
~

.. code-block:: r

   remove_elements <- function(head, target) {
     dummy <- new_list_node(0, head)
     previous <- dummy

     while (!is.null(previous$next)) {
       candidate <- previous$next
       if (candidate$val == target) {
         previous$next <- candidate$next
       } else {
         previous <- candidate
       }
     }

     dummy$next
   }

静态审查记录
------------

本章未运行、未编译、未对拍题解代码，只执行以下静态审查：

* 人工推演头部连续删除、中间连续删除、尾节点删除、全部删除、无匹配和空链表；
* 核对删除分支不推进 ``previous``，保留分支才推进；
* 核对每种实现最终返回虚拟头的后继，而不是虚拟头本身；
* 核对 C 在重接前保存后继，重接后释放且不再访问已释放节点；
* 核对 Rust 先 ``take`` 当前链接槽位，删除时移动 ``node.next``，保留时放回节点后才取得下一槽位；
* 核对 R/Julia 没有重复声明平台节点外壳，修改的是共享节点连接，外部必须使用返回的新头；
* 核对所有实现不复制保留节点、不改变节点值、不创建反向连接。

剩余风险：代码未在目标平台编译。C 的 ``free`` 依赖“函数拥有节点”的明确假设；
若评测框架保留独立节点所有权或统一释放，需要采用只重接不释放的适配版本。

关键错误模式
------------

* 只用 ``if`` 删除一次头节点，遗漏连续头部匹配；
* 删除当前节点后仍让前驱前进，跳过新的 ``previous.next``；
* 返回原 ``head`` 而不是 ``dummy.next``，导致头部删除失效；
* C 释放节点后再读取其 ``next``，形成 use-after-free；
* C 不明确所有权就任意 ``free`` 或完全忽略删除节点释放语义；
* Rust 同时持有 ``link`` 的可变借用并移动其中的 ``Box``，导致所有权代码无法成立；
* 创建新节点复制保留值，却仍声称原地重接和 ``O(1)`` 空间。

知识更新与关联题目
------------------

* ``0083 Remove Duplicates from Sorted List``：根据相邻值删除重复节点；
* ``0141 Linked List Cycle``：只读快慢指针，不修改连接；
* ``0202 Happy Number``：在隐式函数图上使用 Floyd；
* “可变链接槽位”是 Rust 链表编辑的重要模型：
  关注拥有 ``Option<Box<Node>>`` 的位置，而不是仅关注节点引用。

自检问题与答案
--------------

问题一：为什么删除分支不能推进 ``previous``？
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

答案：重接后 ``previous.next`` 已变成原候选的后继，它仍未检查且可能继续匹配。推进会跳过这个节点。

问题二：虚拟头解决了什么边界？
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

答案：它让原头也成为某个前驱的 ``next``，
因此删除原头和删除中间节点使用完全相同的重接操作，连续头删无需单独逻辑。

问题三：C 为什么必须先重接再释放？
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

答案：重接需要读取候选节点的 ``next``。一旦释放候选，
再访问其字段就是未定义行为；应先保存并连接后继，再释放候选。

问题四：算法是否保持保留节点的身份和顺序？
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

答案：保持。算法不创建保留节点副本，只跳过目标节点；保留节点之间仍按原先先后关系连接。
