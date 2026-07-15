0142. Linked List Cycle II
==========================

题目信息
--------

:题号: 0142
:难度: Medium
:主题: 链表、Floyd 判圈、距离同余
:原题: `LeetCode 0142 <https://leetcode.com/problems/linked-list-cycle-ii/>`_
:访问状态: Available
:教学重点: 相遇点到入口的距离关系、身份返回、常数空间

题目重述
--------

给定一个可能含环的单链表，返回环的入口节点；无环时返回空。入口是从头节点沿 ``next`` 前进时第一次进入
循环的节点。必须返回原链表中的节点对象，不能创建替代节点，也不能修改链表。

算法
----

先使用快慢指针寻找环内相遇点。若快指针到达空引用，链表无环。

相遇后令新指针 ``seeker`` 从头节点出发，同时让 ``seeker`` 和相遇点处的 ``slow`` 每轮各前进一步。
它们第一次相遇的位置就是环入口。

距离关系
~~~~~~~~

设头节点到环入口的距离为 ``a``，入口到第一次相遇点的环内距离为 ``b``，环长为 ``c``。相遇时快指针
路程是慢指针的两倍，因此

``2(a+b) = a+b+kc``，从而 ``a = kc-b``。

``kc-b`` 等于从相遇点继续前进到入口的距离再加若干整圈。因此从头前进 ``a`` 步与从相遇点前进
``a`` 步会同时到达入口。

正确性
~~~~~~

第一阶段由 0141 的快慢指针结论保证：无环时返回空，有环时必定在环内相遇。

第二阶段中，``seeker`` 从头开始，距离入口为 ``a``；``slow`` 从相遇点开始，根据上面的同余关系，前进
``a`` 步也会到达入口。两者每轮同步前进，所以会在入口相遇。入口之前 ``seeker`` 尚未进入环，不可能与
环内的 ``slow`` 指向同一节点，因此第一次相遇恰好是入口。

复杂度
~~~~~~

设可达不同节点数为 ``n``。两阶段总时间 ``O(n)``，算法只保存固定数量的节点引用，额外空间 ``O(1)``。
返回值是原节点引用，不产生节点副本。Rust、C#、Julia 和 R 都显式使用对象身份比较。

核心语言实现
------------

C
~

.. code-block:: c

   struct ListNode *detectCycle(struct ListNode *head) {
       struct ListNode *slow = head;
       struct ListNode *fast = head;

       do {
           if (fast == NULL || fast->next == NULL) {
               return NULL;
           }
           slow = slow->next;
           fast = fast->next->next;
       } while (slow != fast);

       struct ListNode *seeker = head;
       while (seeker != slow) {
           seeker = seeker->next;
           slow = slow->next;
       }
       return seeker;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode *detectCycle(ListNode *head) {
           ListNode *slow = head;
           ListNode *fast = head;

           do {
               if (fast == nullptr || fast->next == nullptr) {
                   return nullptr;
               }
               slow = slow->next;
               fast = fast->next->next;
           } while (slow != fast);

           ListNode *seeker = head;
           while (seeker != slow) {
               seeker = seeker->next;
               slow = slow->next;
           }
           return seeker;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def detectCycle(
           self,
           head: Optional[ListNode],
       ) -> Optional[ListNode]:
           slow = head
           fast = head

           while True:
               if fast is None or fast.next is None:
                   return None
               slow = slow.next
               fast = fast.next.next
               if slow is fast:
                   break

           seeker = head
           while seeker is not slow:
               seeker = seeker.next
               slow = slow.next
           return seeker

Java
~~~~

.. code-block:: java

   public class Solution {
       public ListNode detectCycle(ListNode head) {
           ListNode slow = head;
           ListNode fast = head;

           do {
               if (fast == null || fast.next == null) {
                   return null;
               }
               slow = slow.next;
               fast = fast.next.next;
           } while (slow != fast);

           ListNode seeker = head;
           while (seeker != slow) {
               seeker = seeker.next;
               slow = slow.next;
           }
           return seeker;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn detect_cycle(
           head: Option<Rc<RefCell<ListNode>>>,
       ) -> Option<Rc<RefCell<ListNode>>> {
           fn next(
               node: &Option<Rc<RefCell<ListNode>>>,
           ) -> Option<Rc<RefCell<ListNode>>> {
               node.as_ref()
                   .and_then(|current| current.borrow().next.clone())
           }

           let mut slow = head.clone();
           let mut fast = head.clone();

           loop {
               let fast_once = next(&fast);
               if fast_once.is_none() {
                   return None;
               }
               slow = next(&slow);
               fast = next(&fast_once);

               match (&slow, &fast) {
                   (Some(slow_node), Some(fast_node))
                       if Rc::ptr_eq(slow_node, fast_node) =>
                   {
                       break;
                   }
                   (_, None) => return None,
                   _ => {}
               }
           }

           let mut seeker = head;
           while let (Some(seeker_node), Some(slow_node)) =
               (&seeker, &slow)
           {
               if Rc::ptr_eq(seeker_node, slow_node) {
                   return seeker;
               }
               seeker = next(&seeker);
               slow = next(&slow);
           }
           None
       }
   }

Go
~~

.. code-block:: go

   func detectCycle(head *ListNode) *ListNode {
       slow := head
       fast := head

       for {
           if fast == nil || fast.Next == nil {
               return nil
           }
           slow = slow.Next
           fast = fast.Next.Next
           if slow == fast {
               break
           }
       }

       seeker := head
       for seeker != slow {
           seeker = seeker.Next
           slow = slow.Next
       }
       return seeker
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function detectCycle(head: ListNode | null): ListNode | null {
       let slow = head;
       let fast = head;

       while (true) {
           if (fast === null || fast.next === null) {
               return null;
           }
           slow = slow!.next;
           fast = fast.next.next;
           if (slow === fast) {
               break;
           }
       }

       let seeker = head;
       while (seeker !== slow) {
           seeker = seeker!.next;
           slow = slow!.next;
       }
       return seeker;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode DetectCycle(ListNode head) {
           ListNode slow = head;
           ListNode fast = head;

           do {
               if (fast == null || fast.next == null) {
                   return null;
               }
               slow = slow.next;
               fast = fast.next.next;
           } while (!object.ReferenceEquals(slow, fast));

           ListNode seeker = head;
           while (!object.ReferenceEquals(seeker, slow)) {
               seeker = seeker.next;
               slow = slow.next;
           }
           return seeker;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function detect_cycle(
       head::Union{Nothing,ListNode},
   )::Union{Nothing,ListNode}
       slow = head
       fast = head

       while true
           if fast === nothing || fast.next === nothing
               return nothing
           end
           slow = slow.next
           fast = fast.next.next
           slow === fast && break
       end

       seeker = head
       while seeker !== slow
           seeker = seeker.next
           slow = slow.next
       end
       return seeker
   end

R
~

.. code-block:: r

   detect_cycle <- function(head) {
     slow <- head
     fast <- head

     repeat {
       if (is.null(fast) || is.null(fast$next)) return(NULL)
       slow <- slow$next
       fast <- fast$next$next
       if (identical(slow, fast)) break
     }

     seeker <- head
     while (!identical(seeker, slow)) {
       seeker <- seeker$next
       slow <- slow$next
     }
     seeker
   }

关键边界
--------

* 空链表和无环链表返回空；
* 单节点自环的入口就是该节点；
* 环入口可以是头节点，也可以位于链表中部；
* 返回节点必须与原链表入口具有相同对象身份；
* 第一阶段相遇点通常不是入口，不能直接返回；
* 算法不改变任何 ``next`` 指针。

验证
----

运行无环、头节点入环、中部入环、单节点自环和两节点环；Python、C 与 C++ 返回的节点身份均正确。
其余语言完成空引用、身份比较和两阶段步进静态检查。

最小自检
--------

#. 相遇点为什么通常不等于环入口？
#. ``a = kc-b`` 如何推出两个指针会在入口相遇？
#. 为什么第二阶段第一次相遇不会发生在入口之前？
