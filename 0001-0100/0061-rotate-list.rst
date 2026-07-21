0061. Rotate List
=================

题目信息
--------

:题号: 0061
:难度: Medium
:主题: 单链表、模运算、临时成环、断链
:原题: `LeetCode 0061 <https://leetcode.com/problems/rotate-list/>`_
:教学重点: 有效旋转次数、新尾位置、节点守恒、链接更新顺序

题目重述
--------

给定单链表 ``head`` 和非负整数 ``k``，把链表向右旋转 ``k`` 次。一次右旋把当前尾节点移动到最前方。只能重连节点，不应修改节点值；空链表、单节点和整圈旋转都应直接保持原结构。

自建示例
--------

.. code-block:: text

   1 -> 2 -> 3 -> 4 -> 5, k = 2
   4 -> 5 -> 1 -> 2 -> 3

.. code-block:: text

   0 -> 1 -> 2, k = 8
   8 % 3 = 2 -> 1 -> 2 -> 0

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       ListNode* rotateOneByOne(ListNode* head, int k) {
           if (!head || !head->next) return head;
           while (k-- > 0) {
               ListNode* previous = nullptr;
               ListNode* tail = head;
               while (tail->next) { previous = tail; tail = tail->next; }
               previous->next = nullptr;
               tail->next = head;
               head = tail;
           }
           return head;
       }

       ListNode* splitWithTwoPointers(ListNode* head, int k) {
           if (!head || !head->next) return head;
           int length = 0;
           for (ListNode* node = head; node; node = node->next) ++length;
           int shift = k % length;
           if (shift == 0) return head;
           ListNode* fast = head;
           for (int step = 0; step < shift; ++step) fast = fast->next;
           ListNode* slow = head;
           while (fast->next) { fast = fast->next; slow = slow->next; }
           ListNode* new_head = slow->next;
           slow->next = nullptr;
           fast->next = head;
           return new_head;
       }

       ListNode* makeCycleAndCut(ListNode* head, int k) {
           if (!head || !head->next) return head;
           int length = 1;
           ListNode* tail = head;
           while (tail->next) { tail = tail->next; ++length; }
           int shift = k % length;
           if (shift == 0) return head;
           tail->next = head;
           int steps_to_new_tail = length - shift - 1;
           ListNode* new_tail = head;
           while (steps_to_new_tail-- > 0) new_tail = new_tail->next;
           ListNode* new_head = new_tail->next;
           new_tail->next = nullptr;
           return new_head;
       }

   public:
       ListNode* rotateRight(ListNode* head, int k) {
           return makeCycleAndCut(head, k);
       }
   };

题解
----

为什么逐次右旋会重复扫描
~~~~~~~~~~~~~~~~~~~~~~

每次把尾节点移到头部，都要重新找到尾节点和它的前驱，单次 ``O(n)``。执行 ``k`` 次最坏为 ``O(kn)``，且 ``k`` 可能远大于链表长度。

有效旋转次数为何是 k % n
~~~~~~~~~~~~~~~~~~~~~~~~

长度为 ``n`` 的链表右旋 ``n`` 次会恢复原顺序。设 ``shift = k % n``，只需处理余数；``shift == 0`` 时任何断链和成环都没有必要。

旋转等价于在哪里切开
~~~~~~~~~~~~~~~~~~~~

右旋 ``shift`` 位后，原链表最后 ``shift`` 个节点成为前缀。因此新尾是原链表第 ``n-shift-1`` 个零基节点，新头是它的下一个节点。

.. code-block:: text

   原链表：A -> B
   A 长度 n-shift，B 长度 shift
   结果：B -> A

为什么临时成环简化链接
~~~~~~~~~~~~~~~~~~~~

先令原尾 ``tail->next = head``，链表成为一个包含全部节点的环。此时只需找到新尾并把它的 ``next`` 断开；断开位置之后自然是新头。相比先断再接，成环法不会暂时丢失后半段入口。

状态跟踪
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 状态
     - 位置
     - 链接动作
   * - 长度
     - ``n = 5``
     - ``shift = 2``
   * - 临时环
     - 尾节点 5
     - ``5.next = 1``
   * - 新尾
     - 下标 ``5-2-1 = 2``，节点 3
     - 新头为节点 4
   * - 断环
     - 节点 3
     - ``3.next = null``
   * - 结果
     - 节点 4
     - ``4->5->1->2->3``

双指针方法为何等价
~~~~~~~~~~~~~~~~~~

让 ``fast`` 先领先 ``shift`` 个节点，再同时移动到 ``fast`` 到达旧尾。此时 ``slow`` 恰好位于新尾，距离关系与 ``n-shift-1`` 完全相同。该方法不临时成环，但需要先计算长度才能取模。

节点为什么不重不漏
~~~~~~~~~~~~~~~~~~

成环前所有节点构成一条链；连接尾到头只增加一条边，没有创建或删除节点。随后断开环上的一条边，仍得到包含全部 ``n`` 个节点的一条链。每个节点入度和出度关系仅在旧尾、新尾、旧头三处调整。

链接更新顺序为何重要
~~~~~~~~~~~~~~~~~~~~

必须先保存 ``new_head = new_tail->next``，再令 ``new_tail->next = nullptr``。若先断开而没有保存新头，后半段入口会丢失；若成环后忘记断开，返回结构会永久成环。

复杂度来源
~~~~~~~~~~

逐次右旋为 ``O(kn)``。双指针和成环法都扫描常数遍，时间 ``O(n)``、额外空间 ``O(1)``。Rust 实现把节点所有权暂存到数组后重新链接，时间和额外空间均为 ``O(n)``，但复用原节点对象。

九语言实现
----------

C
~

.. code-block:: c

   struct ListNode* rotateRight(struct ListNode*head,int k){if(!head||!head->next)return head;int n=1;struct ListNode*tail=head;while(tail->next){tail=tail->next;n++;}int shift=k%n;if(!shift)return head;tail->next=head;struct ListNode*newTail=head;for(int i=0;i<n-shift-1;i++)newTail=newTail->next;struct ListNode*newHead=newTail->next;newTail->next=NULL;return newHead;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def rotateRight(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
           if not head or not head.next: return head
           length, tail = 1, head
           while tail.next: tail = tail.next; length += 1
           shift = k % length
           if shift == 0: return head
           tail.next = head
           new_tail = head
           for _ in range(length - shift - 1): new_tail = new_tail.next
           new_head = new_tail.next; new_tail.next = None
           return new_head

Java
~~~~

.. code-block:: java

   class Solution {public ListNode rotateRight(ListNode head,int k){if(head==null||head.next==null)return head;int n=1;ListNode tail=head;while(tail.next!=null){tail=tail.next;n++;}int shift=k%n;if(shift==0)return head;tail.next=head;ListNode newTail=head;for(int i=0;i<n-shift-1;i++)newTail=newTail.next;ListNode newHead=newTail.next;newTail.next=null;return newHead;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn rotate_right(mut head:Option<Box<ListNode>>,k:i32)->Option<Box<ListNode>>{let mut nodes=Vec::new();while let Some(mut node)=head{head=node.next.take();nodes.push(node);}let n=nodes.len();if n==0{return None}let shift=k as usize%n;if shift>0{let mut suffix=nodes.split_off(n-shift);suffix.extend(nodes);nodes=suffix;}let mut result=None;for mut node in nodes.into_iter().rev(){node.next=result;result=Some(node);}result}}

Go
~~

.. code-block:: go

   func rotateRight(head *ListNode,k int)*ListNode{if head==nil||head.Next==nil{return head};n,tail:=1,head;for tail.Next!=nil{tail=tail.Next;n++};shift:=k%n;if shift==0{return head};tail.Next=head;newTail:=head;for i:=0;i<n-shift-1;i++{newTail=newTail.Next};newHead:=newTail.Next;newTail.Next=nil;return newHead}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function rotateRight(head:ListNode|null,k:number):ListNode|null{if(!head||!head.next)return head;let n=1,tail=head;while(tail.next){tail=tail.next;n++;}const shift=k%n;if(!shift)return head;tail.next=head;let newTail=head;for(let i=0;i<n-shift-1;i++)newTail=newTail.next!;const newHead=newTail.next;newTail.next=null;return newHead;}

C#
~~

.. code-block:: csharp

   public class Solution {public ListNode RotateRight(ListNode head,int k){if(head==null||head.next==null)return head;int n=1;ListNode tail=head;while(tail.next!=null){tail=tail.next;n++;}int shift=k%n;if(shift==0)return head;tail.next=head;ListNode newTail=head;for(int i=0;i<n-shift-1;i++)newTail=newTail.next;ListNode newHead=newTail.next;newTail.next=null;return newHead;}}

Julia
~~~~~

.. code-block:: julia

   function rotate_right(head,k)
       (head===nothing||head.next===nothing)&&return head
       n=1;tail=head
       while tail.next!==nothing;tail=tail.next;n+=1;end
       shift=k%n;shift==0&&return head;tail.next=head;newtail=head
       for _ in 1:n-shift-1;newtail=newtail.next;end
       newhead=newtail.next;newtail.next=nothing;newhead
   end

R
~

.. code-block:: r

   rotate_right <- function(values,k){n<-length(values);if(n<=1L)return(values);shift<-k%%n;if(shift==0L)return(values);c(tail(values,shift),head(values,n-shift))}
