0024. Swap Nodes in Pairs
=========================

题目信息
--------

:题号: 0024
:难度: Medium
:主题: 单链表、指针重连、虚拟头节点、局部变换
:原题: `LeetCode 0024 <https://leetcode.com/problems/swap-nodes-in-pairs/>`_
:重点: 交换节点身份、三条链接更新、组前驱推进、奇数后缀保留

题目重述
--------

给定单链表，每两个相邻节点组成一组并交换位置。必须修改链接，不能只交换节点值。节点数为奇数时，最后一个节点
保持原位；空链表和单节点链表原样返回。

自建示例
--------

.. code-block:: text

   1 -> 2 -> 3 -> 4 -> 5
   2 -> 1 -> 4 -> 3 -> 5

一组局部结构从 ``prev -> first -> second -> after`` 变为
``prev -> second -> first -> after``。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       ListNode* swapValues(ListNode* head) {
           for (ListNode* node = head; node != nullptr && node->next != nullptr;
                node = node->next->next) {
               std::swap(node->val, node->next->val);
           }
           return head; // 仅作错误语义对照：节点身份没有交换。
       }

       ListNode* recursiveSwap(ListNode* head) {
           if (head == nullptr || head->next == nullptr) return head;
           ListNode* second = head->next;
           head->next = recursiveSwap(second->next);
           second->next = head;
           return second;
       }

       ListNode* iterativeSwap(ListNode* head) {
           ListNode dummy(0, head);
           ListNode* prev = &dummy;
           while (prev->next != nullptr && prev->next->next != nullptr) {
               ListNode* first = prev->next;
               ListNode* second = first->next;
               ListNode* after = second->next;

               first->next = after;
               second->next = first;
               prev->next = second;

               prev = first;
           }
           return dummy.next;
       }

   public:
       ListNode* swapPairs(ListNode* head) {
           return iterativeSwap(head);
       }
   };

题解
----

为什么交换值不等于交换节点
~~~~~~~~~~~~~~~~~~~~~~~~~~

题目操作对象是链表节点。外部代码可能持有某个节点的引用，交换 ``val`` 只改变内容，节点在链中的位置和身份并未
变化，因此不符合契约。正确方法必须重写 ``next``。

递归如何把首对交换后连接剩余答案
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若至少有两个节点，第二个节点成为当前结果头，第一个节点成为本组尾。递归先得到从第三个节点开始的交换结果，再
令第一节点指向它，最后令第二节点指向第一节点。递归代码短，但调用栈为 ``O(n)``。

三条链接为什么必须按可恢复后缀的顺序更新
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

在修改任何链接前保存 ``after = second.next``。随后执行：

.. code-block:: text

   first.next = after
   second.next = first
   prev.next = second

第一条保证旧组头先连接后缀；第二条完成组内反向；第三条把已处理前缀接到新组头。若未保存 ``after``，修改后可能
丢失剩余链表。

虚拟头节点如何统一第一组
~~~~~~~~~~~~~~~~~~~~~~~~

第一组交换会改变真实头节点。虚拟节点让第一组也拥有普通前驱，所有组都通过 ``prev.next`` 重连，最终返回
``dummy.next``，无需单独处理头部。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - ``prev`` 后缀
     - 当前组
     - 重连后
     - 新 ``prev``
   * - 1,2,3,4,5
     - 1,2
     - 2,1,3,4,5
     - 1
   * - 3,4,5
     - 3,4
     - 2,1,4,3,5
     - 3
   * - 5
     - 不足两个
     - 保持 5
     - 结束

为什么每个完整节点对恰好交换一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

循环开始时，``prev`` 之前的前缀已经正确处理，``prev.next`` 是未处理后缀首节点。一次重连只涉及前两个节点，
完成后 ``prev`` 移到交换后的组尾 ``first``，所以下一轮从原第三个节点开始。各组互不重叠，最后不足两个节点时
循环停止，后缀链接从未被破坏。

复杂度来源
~~~~~~~~~~

迭代和递归都访问每个节点常数次，时间 ``O(n)``。迭代只使用固定指针，额外空间 ``O(1)``；递归栈为
``O(n)``。值交换虽也是 ``O(n)``，但语义错误，不能作为答案。

九语言实现
----------

C
~

.. code-block:: c

   struct ListNode* swapPairs(struct ListNode* head) {
       struct ListNode dummy = {0, head};
       struct ListNode* prev = &dummy;
       while (prev->next && prev->next->next) {
           struct ListNode* first = prev->next;
           struct ListNode* second = first->next;
           first->next = second->next;
           second->next = first;
           prev->next = second;
           prev = first;
       }
       return dummy.next;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def swapPairs(self, head):
           dummy = ListNode(0, head)
           prev = dummy
           while prev.next and prev.next.next:
               first = prev.next
               second = first.next
               first.next = second.next
               second.next = first
               prev.next = second
               prev = first
           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode swapPairs(ListNode head) {
           ListNode dummy=new ListNode(0,head),prev=dummy;
           while(prev.next!=null && prev.next.next!=null){
               ListNode first=prev.next,second=first.next;
               first.next=second.next;second.next=first;prev.next=second;prev=first;
           }
           return dummy.next;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn swap_pairs(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
           let mut dummy=Box::new(ListNode{val:0,next:head});
           let mut link=&mut dummy.next;
           while link.as_ref().and_then(|x|x.next.as_ref()).is_some() {
               let mut first=link.take().unwrap();
               let mut second=first.next.take().unwrap();
               first.next=second.next.take();
               second.next=Some(first);
               *link=Some(second);
               link=&mut link.as_mut().unwrap().next.as_mut().unwrap().next;
           }
           dummy.next
       }
   }

Go
~~

.. code-block:: go

   func swapPairs(head *ListNode) *ListNode {
       dummy:=&ListNode{Next:head};prev:=dummy
       for prev.Next!=nil && prev.Next.Next!=nil {
           first:=prev.Next;second:=first.Next
           first.Next=second.Next;second.Next=first;prev.Next=second;prev=first
       }
       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function swapPairs(head: ListNode|null): ListNode|null {
       const dummy=new ListNode(0,head);let prev=dummy;
       while(prev.next!==null && prev.next.next!==null){
           const first=prev.next,second=first.next!;
           first.next=second.next;second.next=first;prev.next=second;prev=first;
       }
       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode SwapPairs(ListNode head) {
           var dummy=new ListNode(0,head);var prev=dummy;
           while(prev.next!=null && prev.next.next!=null){
               var first=prev.next;var second=first.next;
               first.next=second.next;second.next=first;prev.next=second;prev=first;
           }
           return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function swap_pairs(head)
       dummy=ListNode(0,head);prev=dummy
       while prev.next!==nothing && prev.next.next!==nothing
           first=prev.next;second=first.next
           first.next=second.next;second.next=first;prev.next=second;prev=first
       end
       dummy.next
   end

R
~

.. code-block:: r

   swap_pairs <- function(head) {
       dummy <- new_list_node(0, head); prev <- dummy
       while (!is.null(prev$next) && !is.null(prev$next$next)) {
           first <- prev$next; second <- first$next
           first$next <- second$next; second$next <- first; prev$next <- second; prev <- first
       }
       dummy$next
   }
