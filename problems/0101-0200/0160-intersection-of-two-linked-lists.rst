0160. Intersection of Two Linked Lists
======================================

题目信息
--------

:题号: 0160
:难度: Easy
:主题: 链表、双指针、节点身份
:原题: `LeetCode 0160 <https://leetcode.com/problems/intersection-of-two-linked-lists/>`_
:访问状态: Available
:教学重点: 指针换头、路程对齐、引用身份而非节点值

题目重述
--------

给定两个无环单链表的头节点。两个链表可能从某个节点开始共享同一条后缀，也可能完全独立。返回第一个共享
节点；不存在时返回空。相交的判断依据是节点对象身份相同，节点值相等不代表相交。算法不能修改链表结构。

算法
----

使用两个指针。``first`` 从 A 出发，到达空位置后改从 B 的头开始；``second`` 从 B 出发，到达空位置后
改从 A 的头开始。两者各自走过 ``A + B`` 的完整组合路径，因此不同前缀长度被自动抵消。它们最终在首个
共享节点相遇；没有共享后缀时则同时到达空位置。

Rust 的 ``Box`` 不能表达两个头共同拥有同一后缀，因此适配器用不可变 ``Rc<ListNode>`` 表达共享节点，
并通过 ``Rc::ptr_eq`` 比较身份。其他语言直接使用平台节点引用或指针。

正确性
~~~~~~

设 A 的独有前缀长度为 ``a``，B 的独有前缀长度为 ``b``，共享后缀长度为 ``c``。若链表相交，
``first`` 到达交点前走 ``a + c + b`` 步，``second`` 走 ``b + c + a`` 步，两者路程相同，因此在交点
同时出现。共享后缀中的第一个共同节点就是首次身份相等的位置。若不相交，两条组合路径长度都为 ``m+n``，
两个指针最终同时成为空。循环每次推进一个位置，因此必然终止。

复杂度
~~~~~~

设两链长度为 ``m`` 和 ``n``。每个指针最多遍历两条链各一次，时间复杂度为 ``O(m+n)``，额外工作空间为
``O(1)``。Rust 的 ``Rc`` 克隆只调整引用计数，不复制节点载荷；循环中同时存活的额外引用仍为常数个。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>

   struct ListNode *getIntersectionNode(
       struct ListNode *headA,
       struct ListNode *headB
   ) {
       struct ListNode *first = headA;
       struct ListNode *second = headB;

       while (first != second) {
           first = first == NULL ? headB : first->next;
           second = second == NULL ? headA : second->next;
       }
       return first;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
           ListNode *first = headA;
           ListNode *second = headB;

           while (first != second) {
               first = first == nullptr ? headB : first->next;
               second = second == nullptr ? headA : second->next;
           }
           return first;
       }
   };

Python
~~~~~~

.. code-block:: python

   from typing import Optional

   class Solution:
       def getIntersectionNode(
           self,
           headA: Optional[ListNode],
           headB: Optional[ListNode],
       ) -> Optional[ListNode]:
           first = headA
           second = headB

           while first is not second:
               first = headB if first is None else first.next
               second = headA if second is None else second.next
           return first

Java
~~~~

.. code-block:: java

   public class Solution {
       public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
           ListNode first = headA;
           ListNode second = headB;

           while (first != second) {
               first = first == null ? headB : first.next;
               second = second == null ? headA : second.next;
           }
           return first;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::rc::Rc;

   #[derive(Debug)]
   struct ListNode {
       val: i32,
       next: Option<Rc<ListNode>>,
   }

   fn same_node(
       first: &Option<Rc<ListNode>>,
       second: &Option<Rc<ListNode>>,
   ) -> bool {
       match (first, second) {
           (Some(a), Some(b)) => Rc::ptr_eq(a, b),
           (None, None) => true,
           _ => false,
       }
   }

   fn get_intersection_node(
       head_a: Option<Rc<ListNode>>,
       head_b: Option<Rc<ListNode>>,
   ) -> Option<Rc<ListNode>> {
       let mut first = head_a.clone();
       let mut second = head_b.clone();

       while !same_node(&first, &second) {
           first = match first {
               Some(node) => node.next.clone(),
               None => head_b.clone(),
           };
           second = match second {
               Some(node) => node.next.clone(),
               None => head_a.clone(),
           };
       }
       first
   }

Go
~~

.. code-block:: go

   func getIntersectionNode(headA, headB *ListNode) *ListNode {
       first := headA
       second := headB

       for first != second {
           if first == nil {
               first = headB
           } else {
               first = first.Next
           }

           if second == nil {
               second = headA
           } else {
               second = second.Next
           }
       }
       return first
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function getIntersectionNode(
       headA: ListNode | null,
       headB: ListNode | null,
   ): ListNode | null {
       let first = headA;
       let second = headB;

       while (first !== second) {
           first = first === null ? headB : first.next;
           second = second === null ? headA : second.next;
       }
       return first;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode GetIntersectionNode(ListNode headA, ListNode headB) {
           ListNode first = headA;
           ListNode second = headB;

           while (!ReferenceEquals(first, second)) {
               first = first == null ? headB : first.next;
               second = second == null ? headA : second.next;
           }
           return first;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function get_intersection_node(
       head_a::Union{Nothing, ListNode},
       head_b::Union{Nothing, ListNode},
   )::Union{Nothing, ListNode}
       first = head_a
       second = head_b

       while first !== second
           first = first === nothing ? head_b : first.next
           second = second === nothing ? head_a : second.next
       end
       return first
   end

R
~

.. code-block:: r

   get_intersection_node <- function(head_a, head_b) {
     first <- head_a
     second <- head_b

     while (!identical(first, second)) {
       first <- if (is.null(first)) head_b else first$next_node
       second <- if (is.null(second)) head_a else second$next_node
     }
     first
   }

关键边界
--------

* 两个头本身是同一节点时应立即返回该节点；
* 节点值相同但对象不同不能判为相交；
* 一条链为空时，两指针仍会在空位置相遇；
* 相交后整条后缀必须共享，题目无环前提保证不会再次分叉；
* 实现只改变局部指针，不断链、不复制节点、不修改值。

验证
----

运行头节点相交、中间相交、只有尾节点相交、值相同但身份不同和完全不相交案例。Python 另生成 500 组
不同前缀与共享后缀组合，对比显式身份集合基准；C、C++、Go、Java 和 TypeScript 运行代表案例，其余语言
完成静态检查。

最小自检
--------

#. 为什么两个指针各换一次头就能抵消不同前缀长度？
#. 没有交点时，循环为什么仍然一定终止？
#. Rust 为什么不能用两个 ``Option<Box<ListNode>>`` 表达共享尾链？
