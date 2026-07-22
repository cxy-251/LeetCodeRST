0141. Linked List Cycle
=======================

题目信息
--------

:题号: 0141
:难度: Easy
:主题: 链表、Floyd 快慢指针、对象身份
:原题: `LeetCode 0141 <https://leetcode.com/problems/linked-list-cycle/>`_
:教学重点: 身份重复、快慢指针、安全守卫、环内相对速度

题目重述
--------

给定一条可能含环的单链表，判断从 ``head`` 沿 ``next`` 前进时是否会再次到达某个已经到达过的节点对象。节点值可以重复，判断依据必须是节点身份；函数不能改写 ``val`` 或 ``next``。

自建示例
--------

.. code-block:: text

   A -> B -> C -> D
        ^         |
        +---------+

   slow: A B C D
   fast: A C B D

快慢指针最终在 ``D`` 相遇。相遇点不要求是环入口；若链表无环，快指针会先到达空引用。

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_set>

   class Solution {
   private:
       bool identitySet(ListNode* head) {
           std::unordered_set<ListNode*> visited;
           for (ListNode* node = head; node; node = node->next)
               if (!visited.insert(node).second) return true;
           return false;
       }

       bool floyd(ListNode* head) {
           ListNode* slow = head;
           ListNode* fast = head;
           while (fast && fast->next) {
               slow = slow->next;
               fast = fast->next->next;
               if (slow == fast) return true;
           }
           return false;
       }

   public:
       bool hasCycle(ListNode* head) {
           return floyd(head);
       }
   };

题解
----

为什么比较节点身份
~~~~~~~~~~~~~~~~~~

环表示同一个节点对象被再次到达。两个不同节点即使 ``val`` 相同，也不构成环；因此哈希集合存节点地址，快慢指针比较指针身份。

无环时为什么必然停止
~~~~~~~~~~~~~~~~~~~~

快指针每轮前进两步。有限无环链的末端是空引用，所以某轮开始时 ``fast`` 或 ``fast.next`` 必为空，循环安全结束。

有环时为什么必然相遇
~~~~~~~~~~~~~~~~~~~~

慢指针进入环后，快指针也在环内。每轮快指针相对慢指针前进一步；若环长为 ``lambda``，相对位置按模 ``lambda`` 依次变化，最多 ``lambda`` 轮就会变为零。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 额外空间
   * - 身份哈希集合
     - ``O(n)``
     - ``O(n)``
   * - Floyd 快慢指针
     - ``O(n)``
     - ``O(1)``

九语言实现
----------

C
~

.. code-block:: c

   bool hasCycle(struct ListNode*head){struct ListNode*slow=head,*fast=head;while(fast&&fast->next){slow=slow->next;fast=fast->next->next;if(slow==fast)return true;}return false;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def hasCycle(self, head):
           slow = fast = head
           while fast and fast.next:
               slow, fast = slow.next, fast.next.next
               if slow is fast: return True
           return False

Java
~~~~

.. code-block:: java

   public class Solution {public boolean hasCycle(ListNode head){ListNode slow=head,fast=head;while(fast!=null&&fast.next!=null){slow=slow.next;fast=fast.next.next;if(slow==fast)return true;}return false;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn has_cycle(head:Link)->bool{fn next(x:&Link)->Link{x.as_ref().and_then(|n|n.borrow().next.clone())}let mut slow=head.clone();let mut fast=head;loop{slow=next(&slow);fast=next(&next(&fast));match(&slow,&fast){(Some(a),Some(b))if std::rc::Rc::ptr_eq(a,b)=>return true,(None,_)|(_,None)=>return false,_=>{}}}}}

Go
~~

.. code-block:: go

   func hasCycle(head *ListNode)bool{slow,fast:=head,head;for fast!=nil&&fast.Next!=nil{slow=slow.Next;fast=fast.Next.Next;if slow==fast{return true}};return false}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function hasCycle(head:ListNode|null):boolean{let slow=head,fast=head;while(fast&&fast.next){slow=slow!.next;fast=fast.next.next;if(slow===fast)return true;}return false;}

C#
~~

.. code-block:: csharp

   public class Solution {public bool HasCycle(ListNode head){var slow=head;var fast=head;while(fast!=null&&fast.next!=null){slow=slow.next;fast=fast.next.next;if(object.ReferenceEquals(slow,fast))return true;}return false;}}

Julia
~~~~~

.. code-block:: julia

   function has_cycle(head)
       slow=head;fast=head
       while fast!==nothing&&fast.next!==nothing
           slow=slow.next;fast=fast.next.next
           slow===fast&&return true
       end
       false
   end

R
~

.. code-block:: r

   has_cycle <- function(head){slow<-head;fast<-head;while(!is.null(fast)&&!is.null(fast$next)){slow<-slow$next;fast<-fast$next$next;if(identical(slow,fast))return(TRUE)};FALSE}