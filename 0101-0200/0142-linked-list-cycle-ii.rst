0142. Linked List Cycle II
==========================

题目信息
--------

:题号: 0142
:难度: Medium
:主题: 链表、Floyd 快慢指针、环入口、对象身份
:原题: `LeetCode 0142 <https://leetcode.com/problems/linked-list-cycle-ii/>`_
:重点: 返回环入口节点、无环返回空、``pos`` 非函数参数、不修改链表

题目重述
--------

给定一条可能含环的单链表头节点 ``head``。若链表存在环，返回从链表头沿 ``next`` 首次进入环时的那个节点对象；若不存在环，返回 ``null``。测试描述中的 ``pos`` 只表示链表尾节点连接到哪个零基位置，不是函数参数。判断和返回必须依据节点身份，且不能修改链表结构。

链表节点数在 ``0..10^4`` 范围内，节点值在 ``-10^5..10^5`` 范围内，``pos`` 为 ``-1`` 或有效节点下标。

自建示例
--------

.. code-block:: text

   输入：head = [9,4,7,2,5], pos = 2
   输出：返回值为 7 的节点对象
   解释：尾节点 5 的 next 指向下标 2 的节点 7，因此 7 是从链表头首次进入环的位置。

.. code-block:: text

   输入：head = [1,2,3], pos = -1
   输出：null
   解释：尾节点指向 null，链表不存在环。

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

       ListNode* floydEntry(ListNode* head) {
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
           return floydEntry(head);
       }
   };

题解
----

两个阶段
~~~~~~~~

#. 快慢指针相遇，证明存在环；
#. 一个指针回到头，另一个留在相遇点，两者同速前进，再次相遇处就是入口。

距离等式
~~~~~~~~

设头到入口距离为 ``mu``，环长为 ``lambda``，第一次相遇时慢指针在环内前进 ``x``。快指针比慢指针多走整数圈：

.. code-block:: text

   2(mu+x) = mu+x+k*lambda
   mu+x = k*lambda
   mu = k*lambda-x

因此从相遇点再走 ``mu`` 步，等价于绕若干圈后回到入口。

.. list-table::
   :header-rows: 1

   * - 指针
     - 第二阶段起点
     - 前进距离
     - 终点
   * - seeker
     - 链表头
     - ``mu``
     - 环入口
   * - slow
     - 第一次相遇点
     - ``mu``
     - 环入口

无环为何安全返回空
~~~~~~~~~~~~~~~~~~

第一阶段每轮移动快指针前检查 ``fast`` 与 ``fast.next``。任一为空都说明沿链最终到达末端，不可能存在环。

为什么返回的是入口对象
~~~~~~~~~~~~~~~~~~~~~~

第二阶段比较的是指针身份。两者首次相等时，seeker 恰走完头到入口的非环前缀，slow 也恰到入口；返回该对象而不是节点值。

复杂度来源
~~~~~~~~~~

两阶段总移动次数均为 ``O(n)``，额外空间 ``O(1)``。哈希身份集合方法更直观，但需要 ``O(n)`` 空间。

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

   impl Solution {pub fn detect_cycle(head:Link)->Link{fn next(x:&Link)->Link{x.as_ref().and_then(|n|n.borrow().next.clone())}let(mut slow,mut fast)=(head.clone(),head.clone());loop{slow=next(&slow);fast=next(&next(&fast));match(&slow,&fast){(Some(a),Some(b))if std::rc::Rc::ptr_eq(a,b)=>break,(None,_)|(_,None)=>return None,_=>{}}}let mut seek=head;loop{match(&seek,&slow){(Some(a),Some(b))if std::rc::Rc::ptr_eq(a,b)=>return seek,_=>{seek=next(&seek);slow=next(&slow);}}}}}

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

   public class Solution {public ListNode DetectCycle(ListNode head){var slow=head;var fast=head;do{if(fast==null||fast.next==null)return null;slow=slow.next;fast=fast.next.next;}while(!object.ReferenceEquals(slow,fast));var seek=head;while(!object.ReferenceEquals(seek,slow)){seek=seek.next;slow=slow.next;}return seek;}}

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