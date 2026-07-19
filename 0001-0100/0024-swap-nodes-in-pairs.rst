0024. Swap Nodes in Pairs
=========================

题目信息
--------

:题号: 0024
:难度: Medium
:主题: 单链表、指针重连、哑节点、局部变换
:原题: `LeetCode 0024 <https://leetcode.com/problems/swap-nodes-in-pairs/>`_
:访问状态: Available
:教学重点: 交换节点而非数值、三段链接重连、哑节点统一头部变化、成对推进

题目重述
--------

给定一条单链表，每两个相邻节点组成一组并交换它们的位置，返回交换后的链表头节点。

必须改变节点之间的链接关系，不能只交换节点中保存的数值。若链表节点数为奇数，最后一个
没有配对的节点保持原位。

自建示例
--------

普通偶数长度
~~~~~~~~~~~~

.. code-block:: text

   输入：1 -> 2 -> 3 -> 4
   输出：2 -> 1 -> 4 -> 3

奇数长度
~~~~~~~~

.. code-block:: text

   输入：1 -> 2 -> 3 -> 4 -> 5
   输出：2 -> 1 -> 4 -> 3 -> 5

不足一组
~~~~~~~~

.. code-block:: text

   输入：7
   输出：7

   输入：空链表
   输出：空链表

问题抽象
--------

每轮处理连续的两个节点：

.. code-block:: text

   prev -> first -> second -> after

交换后应变成：

.. code-block:: text

   prev -> second -> first -> after

因此一轮只需要重写三条链接：

#. ``first.next = after``；
#. ``second.next = first``；
#. ``prev.next = second``。

完成后，``first`` 已经成为这一组的尾节点，下一轮的前驱应更新为 ``first``。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 迭代重连相邻节点
     - ``O(n)``
     - ``O(1)``
     - 主解法；每轮只改三条链接，状态最直接
   * - 递归交换首对
     - ``O(n)``
     - ``O(n)`` 调用栈
     - 代码较短，但隐藏了组间连接关系
   * - 交换节点值
     - ``O(n)``
     - ``O(1)``
     - 不符合题目要求，因为节点身份没有交换

主解法：哑节点后的成对重连
--------------------------

状态含义
~~~~~~~~

算法维护：

* ``dummy``：固定哑节点，``dummy.next`` 始终是当前结果头；
* ``prev``：当前待交换节点对之前的节点；
* ``first``：当前组第一个节点；
* ``second``：当前组第二个节点；
* ``after``：当前组之后的未处理后缀。

只有 ``prev.next`` 和 ``prev.next.next`` 都存在时，当前组才完整。

为什么需要哑节点
~~~~~~~~~~~~~~~~

第一组交换后，原头节点不再是结果头。若直接从 ``head`` 开始，需要单独保存和修改新头。
哑节点把“修改头指针”转化为普通的 ``dummy.next`` 重连，使第一组和后续各组使用完全相同
的逻辑。

核心不变量
~~~~~~~~~~

每轮循环开始时：

* ``dummy.next`` 指向已经形成的完整结果链表；
* ``prev`` 之前的节点均已按两两交换规则处理完；
* ``prev.next`` 是尚未处理后缀的第一个节点；
* 已处理前缀与未处理后缀之间没有节点丢失或形成环。

一轮重连后，当前两个节点顺序被交换，``prev`` 移到组尾 ``first``，不变量继续成立。

正确性依据
~~~~~~~~~~

对任意完整节点对 ``first``、``second``，三次重连恰好得到
``prev -> second -> first -> after``。两个节点都仍在链表中，组前缀和组后缀也仍然连通，
因此这一轮既不会丢节点，也不会重复节点。

算法按原链表顺序依次处理互不重叠的相邻节点对。每个完整节点对恰好交换一次；若最终只剩
一个节点，循环条件失败，它已经作为上一组尾部连接的后缀保留原位。因此返回的链表满足题意。

复杂度
~~~~~~

设链表长度为 ``n``：

* 每个节点只被访问和重连常数次，时间复杂度为 ``O(n)``；
* 迭代版本只使用固定数量的指针，额外空间复杂度为 ``O(1)``。

核心语言实现
------------

以下代码复用仓库约定的 ``ListNode`` 类型，不在单题内重复定义。

C
~

.. code-block:: c

   struct ListNode *swapPairs(struct ListNode *head) {
       struct ListNode dummy = {0, head};
       struct ListNode *prev = &dummy;

       while (prev->next != NULL && prev->next->next != NULL) {
           struct ListNode *first = prev->next;
           struct ListNode *second = first->next;
           struct ListNode *after = second->next;

           first->next = after;
           second->next = first;
           prev->next = second;

           /* first 已成为本组尾节点，下一组从它之后开始。 */
           prev = first;
       }

       return dummy.next;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode* swapPairs(ListNode* head) {
           ListNode dummy(0, head);
           ListNode* prev = &dummy;

           while (prev->next != nullptr &&
                  prev->next->next != nullptr) {
               ListNode* first = prev->next;
               ListNode* second = first->next;

               first->next = second->next;
               second->next = first;
               prev->next = second;

               prev = first;
           }

           return dummy.next;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def swapPairs(
           self,
           head: Optional[ListNode],
       ) -> Optional[ListNode]:
           dummy = ListNode(0, head)
           prev = dummy

           while prev.next is not None and prev.next.next is not None:
               first = prev.next
               second = first.next

               first.next = second.next
               second.next = first
               prev.next = second

               # first 已经位于交换后节点对的末尾。
               prev = first

           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode swapPairs(ListNode head) {
           ListNode dummy = new ListNode(0, head);
           ListNode prev = dummy;

           while (prev.next != null && prev.next.next != null) {
               ListNode first = prev.next;
               ListNode second = first.next;

               first.next = second.next;
               second.next = first;
               prev.next = second;

               prev = first;
           }

           return dummy.next;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn swap_pairs(
           head: Option<Box<ListNode>>,
       ) -> Option<Box<ListNode>> {
           let mut dummy = Box::new(ListNode { val: 0, next: head });
           let mut link = &mut dummy.next;

           while link
               .as_ref()
               .and_then(|first| first.next.as_ref())
               .is_some()
           {
               let mut first = link.take().unwrap();
               let mut second = first.next.take().unwrap();

               first.next = second.next.take();
               second.next = Some(first);
               *link = Some(second);

               // link 继续指向交换后 first.next，也就是下一组入口。
               link = &mut link
                   .as_mut()
                   .unwrap()
                   .next
                   .as_mut()
                   .unwrap()
                   .next;
           }

           dummy.next
       }
   }

``link`` 的类型是 ``&mut Option<Box<ListNode>>``。通过 ``take`` 暂时取得节点所有权，完成重连
后再放回链表，可避免同时持有多个重叠可变借用。

Go
~~

.. code-block:: go

   func swapPairs(head *ListNode) *ListNode {
       dummy := &ListNode{Next: head}
       prev := dummy

       for prev.Next != nil && prev.Next.Next != nil {
           first := prev.Next
           second := first.Next

           first.Next = second.Next
           second.Next = first
           prev.Next = second

           prev = first
       }

       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function swapPairs(head: ListNode | null): ListNode | null {
       const dummy = new ListNode(0, head);
       let prev: ListNode = dummy;

       while (prev.next !== null && prev.next.next !== null) {
           const first = prev.next;
           const second = first.next!;

           first.next = second.next;
           second.next = first;
           prev.next = second;

           prev = first;
       }

       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode SwapPairs(ListNode head) {
           ListNode dummy = new ListNode(0, head);
           ListNode prev = dummy;

           while (prev.next != null && prev.next.next != null) {
               ListNode first = prev.next;
               ListNode second = first.next;

               first.next = second.next;
               second.next = first;
               prev.next = second;

               prev = first;
           }

           return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function swap_pairs(head::Union{ListNode, Nothing})
       dummy = ListNode(0, head)
       prev = dummy

       while prev.next !== nothing && prev.next.next !== nothing
           first = prev.next
           second = first.next

           first.next = second.next
           second.next = first
           prev.next = second

           prev = first
       end

       return dummy.next
   end

R
~

.. code-block:: r

   swap_pairs <- function(head) {
     dummy <- new_list_node(0, head)
     prev <- dummy

     while (!is.null(prev$next) && !is.null(prev$next$next)) {
       first <- prev$next
       second <- first$next

       first$next <- second$next
       second$next <- first
       prev$next <- second

       prev <- first
     }

     dummy$next
   }

R 的仓库级链表节点使用 ``environment`` 保存字段，因此修改 ``next`` 具有引用语义。

关键边界
--------

* 空链表或单节点链表：循环不执行，直接返回原链表；
* 两个节点：只交换一组；
* 奇数长度：最后一个节点没有配对，保持原位；
* 节点值相同：仍应交换节点链接，不能依赖值判断；
* 第一组：必须正确更新结果头，这正是哑节点解决的问题。

易错点
------

* 先覆盖 ``second.next``，却没有保存组后缀，导致后续节点丢失；
* 重连顺序错误形成 ``first <-> second`` 环；
* 一轮结束后把 ``prev`` 移到 ``second``，导致下一轮从错误位置开始；
* 只交换 ``val``，没有交换节点本身；
* 循环只检查一个节点存在，访问第二个节点时发生空引用。

新增与强化知识
--------------

新增
~~~~

* 局部链表变换可拆成“组前链接、组内链接、组后链接”三部分；
* 哑节点可把结果头变化统一为普通节点的 ``next`` 修改；
* Rust 可用“可变链接槽位” ``&mut Option<Box<Node>>`` 表达待替换的链表入口。

强化
~~~~

* 复用 0002、0019、0021、0023 中的单链表与哑节点模型；
* 指针更新前先保存仍会使用的后缀；
* 正确性证明应同时说明局部顺序正确和全链表节点守恒。

最小自检
--------

#. 为什么交换第一组时不需要单独修改 ``head``？
#. 一轮交换完成后，为什么 ``prev`` 必须移动到 ``first``？
#. 对 ``1 -> 2 -> 3``，三条链接分别怎样变化？
#. 若节点值都是 ``5``，算法是否仍然需要执行交换？

答案要点
~~~~~~~~

#. ``dummy.next`` 统一代表结果头，第一组和后续组没有分支差异。
#. 交换后 ``first`` 是当前组尾节点，它的 ``next`` 指向下一组入口。
#. 得到 ``dummy -> 2 -> 1 -> 3``，最后一个节点保持原位。
#. 需要；题目交换的是节点位置，而不是不同数值。
