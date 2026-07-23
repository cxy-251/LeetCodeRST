0142. Linked List Cycle II
==========================

题目信息
--------

:题号: 0142
:难度: Medium
:主题: 链表、Floyd 两阶段算法、模同余
:原题: `LeetCode 0142 <https://leetcode.com/problems/linked-list-cycle-ii/>`_
:重点: 环内相遇、入口距离、同步前进、返回原节点身份

题目重述
--------

给定一条可能含环的单链表。若有环，返回从 ``head`` 出发第一次进入环的节点；若无环则返回空。不得修改链表。环入口按节点身份确定，不是按节点值判断，也不一定是快慢指针第一次相遇的位置。

自建示例
--------

.. code-block:: text

   A -> B -> C -> D -> E
             ^         |
             +---------+

   第一阶段：slow 与 fast 在 D 相遇
   第二阶段：A/D -> B/E -> C/C

入口是 ``C``，而第一阶段相遇点是 ``D``。

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_set>

   class Solution {
   private:
       ListNode* identitySet(ListNode* head) {
           std::unordered_set<ListNode*> visited;
           for (ListNode* node = head; node; node = node->next)
               if (!visited.insert(node).second) return node;
           return nullptr;
       }

       ListNode* floyd(ListNode* head) {
           ListNode* slow = head;
           ListNode* fast = head;
           do {
               if (!fast || !fast->next) return nullptr;
               slow = slow->next;
               fast = fast->next->next;
           } while (slow != fast);

           ListNode* seeker = head;
           while (seeker != slow) {
               seeker = seeker->next;
               slow = slow->next;
           }
           return seeker;
       }

   public:
       ListNode* detectCycle(ListNode* head) {
           return floyd(head);
       }
   };

题解
----

第一阶段得到什么
~~~~~~~~~~~~~~~~

设头到入口距离为 ``mu``，环长为 ``lambda``。慢指针相遇时走了 ``t`` 步，快指针走了 ``2t`` 步。两者在环内同一位置，所以：

.. code-block:: text

   2t - t = k * lambda
   t = k * lambda

相遇点到入口还差多少
~~~~~~~~~~~~~~~~~~~~

慢指针相遇位置的环内偏移是 ``(t-mu) mod lambda``。由于 ``t`` 是环长整数倍，从相遇点再走 ``mu`` 步恰好回到入口。

为什么同步指针第一次相遇就是入口
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

让 ``seeker`` 从头出发，另一个指针留在相遇点；两者每轮都走一步。经过 ``mu`` 步，前者第一次到入口，后者也从相遇点走到入口。环外路径没有重复节点，因此不可能更早相遇。

复杂度来源
~~~~~~~~~~

身份集合方法为 ``O(n)`` 时间、``O(n)`` 空间；Floyd 两阶段每个指针只走线性步数，时间 ``O(n)``、额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   struct ListNode*detectCycle(struct ListNode*head){struct ListNode*slow=head,*fast=head;do{if(!fast||!fast->next)return NULL;slow=slow->next;fast=fast->next->next;}while(slow!=fast);struct ListNode*seek=head;while(seek!=slow){seek=seek->next;slow=slow->next;}return seek;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def detectCycle(self, head):
           slow = fast = head
           while fast and fast.next:
               slow, fast = slow.next, fast.next.next
               if slow is fast: break
           else: return None
           seeker = head
           while seeker is not slow: seeker, slow = seeker.next, slow.next
           return seeker

Java
~~~~

.. code-block:: java

   public class Solution {public ListNode detectCycle(ListNode head){ListNode slow=head,fast=head;do{if(fast==null||fast.next==null)return null;slow=slow.next;fast=fast.next.next;}while(slow!=fast);ListNode seek=head;while(seek!=slow){seek=seek.next;slow=slow.next;}return seek;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn detect_cycle(head:Link)->Link{fn next(x:&Link)->Link{x.as_ref().and_then(|n|n.borrow().next.clone())}let mut slow=head.clone();let mut fast=head.clone();loop{slow=next(&slow);fast=next(&next(&fast));match(&slow,&fast){(Some(a),Some(b))if std::rc::Rc::ptr_eq(a,b)=>break,(None,_)|(_,None)=>return None,_=>{}}}let mut seek=head;loop{match(&seek,&slow){(Some(a),Some(b))if std::rc::Rc::ptr_eq(a,b)=>return seek,_=>{seek=next(&seek);slow=next(&slow);}}}}}

Go
~~

.. code-block:: go

   func detectCycle(head *ListNode)*ListNode{slow,fast:=head,head;for{if fast==nil||fast.Next==nil{return nil};slow=slow.Next;fast=fast.Next.Next;if slow==fast{break}};seek:=head;for seek!=slow{seek=seek.Next;slow=slow.Next};return seek}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function detectCycle(head:ListNode|null):ListNode|null{let slow=head,fast=head;do{if(!fast||!fast.next)return null;slow=slow!.next;fast=fast.next.next;}while(slow!==fast);let seek=head;while(seek!==slow){seek=seek!.next;slow=slow!.next;}return seek;}

C#
~~

.. code-block:: csharp

   public class Solution {public ListNode DetectCycle(ListNode head){var slow=head;var fast=head;do{if(fast==null||fast.next==null)return null;slow=slow.next;fast=fast.next.next;}while(!ReferenceEquals(slow,fast));var seek=head;while(!ReferenceEquals(seek,slow)){seek=seek.next;slow=slow.next;}return seek;}}

Julia
~~~~~

.. code-block:: julia

   function detect_cycle(head)
       slow=head;fast=head
       while true
           (fast===nothing||fast.next===nothing)&&return nothing
           slow=slow.next;fast=fast.next.next;slow===fast&&break
       end
       seek=head
       while seek!==slow;seek=seek.next;slow=slow.next;end
       seek
   end

R
~

.. code-block:: r

   detect_cycle <- function(head){slow<-head;fast<-head;repeat{if(is.null(fast)||is.null(fast$next))return(NULL);slow<-slow$next;fast<-fast$next$next;if(identical(slow,fast))break};seek<-head;while(!identical(seek,slow)){seek<-seek$next;slow<-slow$next};seek}