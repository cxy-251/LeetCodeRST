0143. Reorder List
==================

题目信息
--------

:题号: 0143
:难度: Medium
:主题: 链表、快慢指针、反转、原地重连
:原题: `LeetCode 0143 <https://leetcode.com/problems/reorder-list/>`_
:重点: 原地重排、节点值不可修改、首尾交替、节点身份保持

题目重述
--------

给定单链表 ``L0 -> L1 -> ... -> Ln``，将它原地重排为 ``L0 -> Ln -> L1 -> L(n-1) -> L2 -> L(n-2) -> ...``。只能调整已有节点之间的 ``next`` 指针，不得修改节点值，也不得用新节点替换原节点。

链表节点数在 ``1..5 * 10^4`` 范围内，节点值在 ``1..1000`` 范围内。函数直接修改输入链表，不返回新的链表头。

自建示例
--------

.. code-block:: text

   输入：head = [8,3,5,1,9]
   输出：[8,9,3,1,5]
   解释：按首节点、尾节点、第二个节点、倒数第二个节点的顺序重新连接，原来的中间节点 5 留在末尾。

.. code-block:: text

   输入：head = [4,7,2,6]
   输出：[4,6,7,2]
   解释：四个原节点依次按 L0、L3、L1、L2 的顺序连接，节点值本身没有变化。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       void nodeArray(ListNode* head) {
           std::vector<ListNode*> nodes;
           for (ListNode* p = head; p; p = p->next) nodes.push_back(p);
           int left = 0, right = static_cast<int>(nodes.size()) - 1;
           while (left < right) {
               nodes[left++]->next = nodes[right];
               if (left == right) break;
               nodes[right--]->next = nodes[left];
           }
           nodes[left]->next = nullptr;
       }

       void splitReverseMerge(ListNode* head) {
           if (!head || !head->next) return;
           ListNode* slow = head;
           ListNode* fast = head;
           while (fast->next && fast->next->next) {
               slow = slow->next;
               fast = fast->next->next;
           }

           ListNode* second = slow->next;
           slow->next = nullptr;
           ListNode* reversed = nullptr;
           while (second) {
               ListNode* next = second->next;
               second->next = reversed;
               reversed = second;
               second = next;
           }

           ListNode* first = head;
           while (reversed) {
               ListNode* first_next = first->next;
               ListNode* second_next = reversed->next;
               first->next = reversed;
               reversed->next = first_next;
               first = first_next;
               reversed = second_next;
           }
       }

   public:
       void reorderList(ListNode* head) {
           splitReverseMerge(head);
       }
   };

题解
----

为什么先切分
~~~~~~~~~~~~

单链表不能从尾部向前访问。把链分成前后两段后，反转后半段即可按 ``Ln,L(n-1),...`` 的顺序向后读取。

中点位置
~~~~~~~~

循环条件 ``fast.next && fast.next.next`` 让 ``slow`` 停在前半段末尾。奇数长度时前半段多一个节点，正好让中间节点留在最终尾部；偶数长度时两段等长。

交织时为什么先保存后继
~~~~~~~~~~~~~~~~~~~~~~

每轮要同时改写两条链的 ``next``。必须先保存 ``first_next`` 和 ``second_next``，再连接 ``first -> second -> first_next``，否则未处理后缀会丢失。

节点与无环性
~~~~~~~~~~~~

切分先把 ``slow.next`` 置空，得到两条互不相交的有限链；反转不改变节点集合；合并每次各消费一个节点，且最终沿两条已终止链连接，因此不会重复、丢失或形成环。

复杂度来源
~~~~~~~~~~

三阶段均为线性扫描，总时间 ``O(n)``，C++ 主解只使用固定数量指针，额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   void reorderList(struct ListNode*head){if(!head||!head->next)return;struct ListNode*slow=head,*fast=head;while(fast->next&&fast->next->next){slow=slow->next;fast=fast->next->next;}struct ListNode*second=slow->next;slow->next=NULL;struct ListNode*rev=NULL;while(second){struct ListNode*n=second->next;second->next=rev;rev=second;second=n;}struct ListNode*first=head;while(rev){struct ListNode*a=first->next,*b=rev->next;first->next=rev;rev->next=a;first=a;rev=b;}}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def reorderList(self, head):
           if not head or not head.next: return
           slow=fast=head
           while fast.next and fast.next.next: slow,fast=slow.next,fast.next.next
           second=slow.next;slow.next=None;rev=None
           while second: second.next,rev,second=rev,second,second.next
           first=head
           while rev:
               a,b=first.next,rev.next;first.next=rev;rev.next=a;first,rev=a,b

Java
~~~~

.. code-block:: java

   class Solution {public void reorderList(ListNode head){if(head==null||head.next==null)return;ListNode slow=head,fast=head;while(fast.next!=null&&fast.next.next!=null){slow=slow.next;fast=fast.next.next;}ListNode second=slow.next;slow.next=null;ListNode rev=null;while(second!=null){ListNode n=second.next;second.next=rev;rev=second;second=n;}ListNode first=head;while(rev!=null){ListNode a=first.next,b=rev.next;first.next=rev;rev.next=a;first=a;rev=b;}}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn reorder_list(head:&mut Option<Box<ListNode>>){let mut slots=Vec::new();let mut cur=head.take();while let Some(mut node)=cur{cur=node.next.take();slots.push(Some(node));}if slots.is_empty(){return}let(mut left,mut right)=(0usize,slots.len()-1);let mut order=Vec::new();loop{order.push(slots[left].take().unwrap());if left==right{break}order.push(slots[right].take().unwrap());left+=1;right-=1;}let mut out=None;for mut node in order.into_iter().rev(){node.next=out;out=Some(node);}*head=out;}}

Go
~~

.. code-block:: go

   func reorderList(head *ListNode){if head==nil||head.Next==nil{return};slow,fast:=head,head;for fast.Next!=nil&&fast.Next.Next!=nil{slow=slow.Next;fast=fast.Next.Next};second:=slow.Next;slow.Next=nil;var rev *ListNode;for second!=nil{n:=second.Next;second.Next=rev;rev=second;second=n};first:=head;for rev!=nil{a,b:=first.Next,rev.Next;first.Next=rev;rev.Next=a;first,rev=a,b}}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function reorderList(head:ListNode|null):void{if(!head||!head.next)return;let slow=head,fast=head;while(fast.next&&fast.next.next){slow=slow.next!;fast=fast.next.next;}let second=slow.next;slow.next=null;let rev:ListNode|null=null;while(second){const n=second.next;second.next=rev;rev=second;second=n;}let first:ListNode|null=head;while(rev){const a=first!.next,b=rev.next;first!.next=rev;rev.next=a;first=a;rev=b;}}

C#
~~

.. code-block:: csharp

   public class Solution {public void ReorderList(ListNode head){if(head==null||head.next==null)return;var slow=head;var fast=head;while(fast.next!=null&&fast.next.next!=null){slow=slow.next;fast=fast.next.next;}var second=slow.next;slow.next=null;ListNode rev=null;while(second!=null){var n=second.next;second.next=rev;rev=second;second=n;}var first=head;while(rev!=null){var a=first.next;var b=rev.next;first.next=rev;rev.next=a;first=a;rev=b;}}}

Julia
~~~~~

.. code-block:: julia

   function reorder_list!(head)
       (head===nothing||head.next===nothing)&&return head
       slow=head;fast=head
       while fast.next!==nothing&&fast.next.next!==nothing;slow=slow.next;fast=fast.next.next;end
       second=slow.next;slow.next=nothing;rev=nothing
       while second!==nothing;n=second.next;second.next=rev;rev=second;second=n;end
       first=head
       while rev!==nothing;a=first.next;b=rev.next;first.next=rev;rev.next=a;first=a;rev=b;end
       head
   end

R
~

.. code-block:: r

   reorder_list <- function(head){if(is.null(head)||is.null(head$next))return(head);slow<-head;fast<-head;while(!is.null(fast$next)&&!is.null(fast$next$next)){slow<-slow$next;fast<-fast$next$next};second<-slow$next;slow$next<-NULL;rev<-NULL;while(!is.null(second)){n<-second$next;second$next<-rev;rev<-second;second<-n};first<-head;while(!is.null(rev)){a<-first$next;b<-rev$next;first$next<-rev;rev$next<-a;first<-a;rev<-b};head}