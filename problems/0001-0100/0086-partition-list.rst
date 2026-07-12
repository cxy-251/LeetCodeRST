0086. Partition List
====================

题目信息
--------

:题号: 0086
:难度: Medium
:主题: 单链表、稳定分区、双链拼接
:原题: `LeetCode 0086 <https://leetcode.com/problems/partition-list/>`_
:访问状态: Available
:教学重点: 稳定双链、逐节点断开、节点守恒、Rust 所有权链尾

题目重述
--------

给定一条单链表 ``head`` 和整数 ``x``，重新排列节点，使所有值小于 ``x`` 的节点出现在其余节点
之前。两个分区内部必须保持节点在原链表中的相对顺序。

题目保证节点数不超过 200，节点值和 ``x`` 位于 ``[-200, 200]``。主实现只重连原节点，不复制
数据节点。

自建示例
--------

.. code-block:: text

   输入：1 -> 4 -> 3 -> 2 -> 5 -> 2, x = 3
   输出：1 -> 2 -> 2 -> 4 -> 3 -> 5

小于 3 的节点按原顺序为 ``1, 2, 2``，其余节点按原顺序为 ``4, 3, 5``。

问题抽象
--------

扫描原链表时，把节点稳定追加到两条链：

* ``before`` 保存值小于 ``x`` 的节点；
* ``after`` 保存值大于或等于 ``x`` 的节点；
* 每条链只在尾部追加，因此分区内部顺序自然保持；
* 扫描结束后，把 ``before`` 尾连接到 ``after`` 头。

处理每个节点时先保存原后继，再把当前节点的 ``next`` 置空。这一步使节点脱离旧拓扑，避免旧链接
把两个分区意外串接成环或带入尚未分类的后缀。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 两条稳定链尾插后拼接
     - ``O(n)``
     - ``O(1)``
     - 主解法；复用原节点
   * - 保存节点引用到两个数组
     - ``O(n)``
     - ``O(n)``
     - 下标直观，但没有必要保存全部节点
   * - 交换节点值
     - 不适用
     - 不适用
     - 会破坏节点身份和稳定顺序语义

主解法：稳定双链分区
--------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

每轮扫描开始时：

* ``before`` 恰好包含已扫描节点中值小于 ``x`` 的节点，顺序与原链表一致；
* ``after`` 恰好包含已扫描节点中值大于或等于 ``x`` 的节点，顺序与原链表一致；
* 两条链均正确以空链接结尾；
* ``head`` 指向尚未扫描后缀；
* 每个已扫描原节点恰好属于两条结果链之一。

取出当前节点后，先保存 ``next`` 并断开 ``current.next``。随后根据值把节点追加到对应尾部。尾插
不会改变同一分区中已有节点的顺序。

为什么必须断开当前节点
~~~~~~~~~~~~~~~~~~~~~~

当前节点的旧 ``next`` 仍指向原链表后继，而该后继可能最终属于另一分区。若直接尾插并继续移动，
中间状态可能保留跨分区旧边，最终拼接时可能形成错误后缀甚至环。

先断开后：

* 当前节点成为独立的单节点链；
* 尾插只增加一条受控链接；
* 两条分区链始终各自闭合；
* 最终只需执行一次 ``before_tail.next = after_head``。

稳定性与节点守恒
~~~~~~~~~~~~~~~~

节点按照原链表扫描顺序到达。每条分区链都只在尾部追加，因此两个同属一个分区的节点，先出现者
仍然位于后出现者之前。

每个循环恰好从未扫描后缀取出一个原节点，并把它加入且只加入一条分区链。算法不创建结果数据节点，
也不遗漏或重复任何原节点。哨兵节点只用于保存链头，不属于返回结果。

正确性依据
~~~~~~~~~~

**分区正确。** 小于 ``x`` 的节点只进入 ``before``，其余节点只进入 ``after``。拼接后前段全部
小于 ``x``，后段全部大于或等于 ``x``。

**稳定顺序正确。** 两条链按原扫描顺序尾插，同一分区内部相对顺序保持不变。

**节点守恒。** 每个原节点被取出一次、追加一次；返回链由全部原节点组成且没有复制。

**无环。** 节点追加前先断开旧后继，两条链始终以空链接结束；最终只从 ``before`` 尾连接到
``after`` 头，不存在返回边。

复杂度
~~~~~~

设链表长度为 ``n``：

* 每个节点访问一次，时间复杂度为 ``O(n)``；
* 常规指针语言只保存两个哨兵和两个尾指针，算法额外空间为 ``O(1)``；
* Rust 保存两条 ``Option<Box<ListNode>>`` 所有权链及其尾槽位，同样没有按 ``n`` 增长的容器；
* 返回链复用原节点，结果本身不计入算法额外空间。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>

   struct ListNode *partition(
       struct ListNode *head,
       int x
   ) {
       struct ListNode before_dummy = {0, NULL};
       struct ListNode after_dummy = {0, NULL};
       struct ListNode *before_tail = &before_dummy;
       struct ListNode *after_tail = &after_dummy;

       while (head != NULL) {
           struct ListNode *next = head->next;
           head->next = NULL;

           if (head->val < x) {
               before_tail->next = head;
               before_tail = head;
           } else {
               after_tail->next = head;
               after_tail = head;
           }
           head = next;
       }

       before_tail->next = after_dummy.next;
       return before_dummy.next;
   }


C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode* partition(ListNode* head, int x) {
           ListNode beforeDummy(0);
           ListNode afterDummy(0);
           ListNode* beforeTail = &beforeDummy;
           ListNode* afterTail = &afterDummy;

           while (head != nullptr) {
               ListNode* next = head->next;
               head->next = nullptr;

               if (head->val < x) {
                   beforeTail->next = head;
                   beforeTail = head;
               } else {
                   afterTail->next = head;
                   afterTail = head;
               }
               head = next;
           }

           beforeTail->next = afterDummy.next;
           return beforeDummy.next;
       }
   };


Python
~~~~~~

.. code-block:: python

   class Solution:
       def partition(
           self,
           head: Optional[ListNode],
           x: int,
       ) -> Optional[ListNode]:
           before_dummy = ListNode(0)
           after_dummy = ListNode(0)
           before_tail = before_dummy
           after_tail = after_dummy

           while head is not None:
               next_node = head.next
               head.next = None

               if head.val < x:
                   before_tail.next = head
                   before_tail = head
               else:
                   after_tail.next = head
                   after_tail = head

               head = next_node

           before_tail.next = after_dummy.next
           return before_dummy.next


Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode partition(ListNode head, int x) {
           ListNode beforeDummy = new ListNode(0);
           ListNode afterDummy = new ListNode(0);
           ListNode beforeTail = beforeDummy;
           ListNode afterTail = afterDummy;

           while (head != null) {
               ListNode next = head.next;
               head.next = null;

               if (head.val < x) {
                   beforeTail.next = head;
                   beforeTail = head;
               } else {
                   afterTail.next = head;
                   afterTail = head;
               }
               head = next;
           }

           beforeTail.next = afterDummy.next;
           return beforeDummy.next;
       }
   }


Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn partition(
           mut head: Option<Box<ListNode>>,
           x: i32,
       ) -> Option<Box<ListNode>> {
           let mut before: Option<Box<ListNode>> = None;
           let mut after: Option<Box<ListNode>> = None;
           let mut before_tail = &mut before;
           let mut after_tail = &mut after;

           while let Some(mut node) = head {
               head = node.next.take();

               if node.val < x {
                   *before_tail = Some(node);
                   before_tail =
                       &mut before_tail.as_mut().unwrap().next;
               } else {
                   *after_tail = Some(node);
                   after_tail =
                       &mut after_tail.as_mut().unwrap().next;
               }
           }

           *before_tail = after;
           before
       }
   }


Go
~~

.. code-block:: go

   func partition(head *ListNode, x int) *ListNode {
       beforeDummy := &ListNode{}
       afterDummy := &ListNode{}
       beforeTail := beforeDummy
       afterTail := afterDummy

       for head != nil {
           next := head.Next
           head.Next = nil

           if head.Val < x {
               beforeTail.Next = head
               beforeTail = head
           } else {
               afterTail.Next = head
               afterTail = head
           }
           head = next
       }

       beforeTail.Next = afterDummy.Next
       return beforeDummy.Next
   }


TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function partition(
       head: ListNode | null,
       x: number,
   ): ListNode | null {
       const beforeDummy = new ListNode(0);
       const afterDummy = new ListNode(0);
       let beforeTail = beforeDummy;
       let afterTail = afterDummy;

       while (head !== null) {
           const next = head.next;
           head.next = null;

           if (head.val < x) {
               beforeTail.next = head;
               beforeTail = head;
           } else {
               afterTail.next = head;
               afterTail = head;
           }
           head = next;
       }

       beforeTail.next = afterDummy.next;
       return beforeDummy.next;
   }


C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode Partition(ListNode head, int x) {
           ListNode beforeDummy = new ListNode(0);
           ListNode afterDummy = new ListNode(0);
           ListNode beforeTail = beforeDummy;
           ListNode afterTail = afterDummy;

           while (head != null) {
               ListNode next = head.next;
               head.next = null;

               if (head.val < x) {
                   beforeTail.next = head;
                   beforeTail = head;
               } else {
                   afterTail.next = head;
                   afterTail = head;
               }
               head = next;
           }

           beforeTail.next = afterDummy.next;
           return beforeDummy.next;
       }
   }


Julia
~~~~~

.. code-block:: julia

   function partition_list(
       head::Union{ListNode, Nothing},
       x::Int,
   )
       before_dummy = ListNode(0, nothing)
       after_dummy = ListNode(0, nothing)
       before_tail = before_dummy
       after_tail = after_dummy

       while head !== nothing
           next_node = head.next
           head.next = nothing

           if head.val < x
               before_tail.next = head
               before_tail = head
           else
               after_tail.next = head
               after_tail = head
           end
           head = next_node
       end

       before_tail.next = after_dummy.next
       return before_dummy.next
   end


R
~

.. code-block:: r

   partition_list <- function(head, x) {
     before_dummy <- new_list_node(0L)
     after_dummy <- new_list_node(0L)
     before_tail <- before_dummy
     after_tail <- after_dummy

     while (!is.null(head)) {
       next_node <- head$next
       head$next <- NULL

       if (head$val < x) {
         before_tail$next <- head
         before_tail <- head
       } else {
         after_tail$next <- head
         after_tail <- head
       }
       head <- next_node
     }

     before_tail$next <- after_dummy$next
     before_dummy$next
   }


语言边界说明
------------

* C、C++ 不创建或释放数据节点，被返回链继续复用；
* Python、Java、Go、TypeScript、C#、Julia 和 R 使用引用语义重连节点；
* Rust 每轮用 ``take`` 分离后继，把独占 ``Box`` 移入对应链尾槽位；
* Julia 复用可变 ``ListNode``；R 复用以 ``environment`` 表达引用语义的 ``new_list_node``；
* 所有实现都按节点身份分区，不通过交换节点值伪造结果。

对照解法：节点引用数组
----------------------

遍历链表并分别把两类节点引用放入数组，再按数组顺序重写 ``next``。该方法同样稳定且正确，时间为
``O(n)``，却需要 ``O(n)`` 额外空间。双链尾插直接在扫描过程中完成同样的顺序组织。

验证计划与证据
--------------

``运行验证``
   覆盖空链表、单节点、全部小于、全部不小于、交错分区、重复值和边界 ``x``。

``随机基准对拍``
   Python 根据原节点身份顺序构造两个列表再拼接；同时检查节点集合、节点数量、稳定顺序和最终无环。

``编译验证``
   C 使用 C17 严格警告、AddressSanitizer 与 UndefinedBehaviorSanitizer；C++ 使用 C++17；
   Java、Go 和 TypeScript 完成编译或严格类型检查。

``静态验证``
   Rust、C#、Julia 和 R 检查所有权、可变节点约定、链尾推进和最终拼接，不宣称运行通过。

关联题目
--------

* `0082. Remove Duplicates from Sorted List II
  <0082-remove-duplicates-from-sorted-list-ii.rst>`_
* `0083. Remove Duplicates from Sorted List
  <0083-remove-duplicates-from-sorted-list.rst>`_
* `0061. Rotate List <0061-rotate-list.rst>`_
