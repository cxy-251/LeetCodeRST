0143. Reorder List
==================

题目信息
--------

:题号: 0143
:难度: Medium
:主题: 链表、双指针、反转、合并
:原题: `LeetCode 0143 <https://leetcode.com/problems/reorder-list/>`_
:访问状态: Available
:教学重点: 中点切分、后半反转、交替合并

题目重述
--------

原地把 ``L0→L1→…→Ln`` 重排为 ``L0→Ln→L1→Ln-1→…``，不改变节点值。

自建示例
--------

.. code-block:: text

   输入：head = [1,2,3,4,5]
   输出：[1,5,2,4,3]

问题抽象
--------

快慢指针找到前半末尾；断开并反转后半；交替把后半节点插入前半节点之后。

主解法：三阶段原地重排
-------------

思路
~~~~

三阶段原地重排。 中点切分、后半反转、交替合并

核心状态与不变量
~~~~~~~~~~~~~~~~

快慢指针找到前半末尾；断开并反转后半；交替把后半节点插入前半节点之后。

正确性依据
~~~~~~~~~~

切分保留全部节点且两段不相交；反转使后半按尾到中顺序排列；交替合并严格产生目标索引序列。每次消费一个后半节点并保持剩余两链完整，最终无丢失和无环。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；空间 ``O(1)``。原节点身份保留，拓扑被修改。

核心语言实现
------------

C
~

.. code-block:: c

   static struct ListNode*rev(struct ListNode*h) {
       struct ListNode*p=NULL;
       while(h) {
           struct ListNode*n=h->next;
           h->next=p;
           p=h;
           h=n;
       }
       return p;
   }
   void reorderList(struct ListNode*h) {
       if(!h||!h->next)return;
       struct ListNode*s=h,*f=h;
       while(f->next&&f->next->next) {
           s=s->next;
           f=f->next->next;
       }
       struct ListNode*b=rev(s->next);
       s->next=NULL;
       for(struct ListNode*a=h;b;) {
           struct ListNode*an=a->next,*bn=b->next;
           a->next=b;
           b->next=an;
           a=an;
           b=bn;
       }
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:void reorderList(ListNode*h) {
           if(!h||!h->next)return;
           ListNode*s=h,*f=h;
           while(f->next&&f->next->next) {
               s=s->next;
               f=f->next->next;
           }
           ListNode*b=s->next;
           s->next=nullptr;
           ListNode*p=nullptr;
           while(b) {
               auto*n=b->next;
               b->next=p;
               p=b;
               b=n;
           }
           for(ListNode*a=h;p;) {
               auto*an=a->next;
               auto*pn=p->next;
               a->next=p;
               p->next=an;
               a=an;
               p=pn;
           }
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def reorderList(self, head: Optional[ListNode]) -> None:
           if not head or not head.next:
               return
           slow = fast = head
           while fast.next and fast.next.next:
               slow = slow.next
               fast = fast.next.next
           cur = slow.next
           slow.next = None
           prev = None
           while cur:
               nxt = cur.next
               cur.next = prev
               prev = cur
               cur = nxt
           a, b = (head, prev)
           while b:
               an, bn = (a.next, b.next)
               a.next = b
               b.next = an
               a, b = (an, bn)
Java
~~~~

.. code-block:: java

   class Solution {
       public void reorderList(ListNode h) {
           if(h==null||h.next==null)return;
           ListNode s=h,f=h;
           while(f.next!=null&&f.next.next!=null) {
               s=s.next;
               f=f.next.next;
           }
           ListNode b=s.next;
           s.next=null;
           ListNode p=null;
           while(b!=null) {
               ListNode n=b.next;
               b.next=p;
               p=b;
               b=n;
           }
           for(ListNode a=h;p!=null;) {
               ListNode an=a.next,pn=p.next;
               a.next=p;
               p.next=an;
               a=an;
               p=pn;
           }
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn reorder_list(head: &mut Option<Box<ListNode>>) {
           let mut n = 0usize;
           let mut p = head.as_ref();
           while let Some(node) = p {
               n += 1;
               p = node.next.as_ref();
           }
           if n < 3 {
               return;
           }
           let left_len = (n + 1) / 2;
           let mut left = head.take();
           let mut cut = &mut left;
           for _ in 1..left_len {
               cut = &mut cut.as_mut().unwrap().next;
           }
           let mut right = cut.as_mut().unwrap().next.take();
           let mut reversed = None;
           while let Some(mut node) = right {
               right = node.next.take();
               node.next = reversed;
               reversed = Some(node);
           }
           let mut dummy = Box::new(ListNode::new(0));
           let mut tail = &mut dummy;
           let mut a = left;
           let mut b = reversed;
           while let Some(mut first) = a {
               a = first.next.take();
               tail.next = Some(first);
               tail = tail.next.as_mut().unwrap();
               if let Some(mut second) = b {
                   b = second.next.take();
                   tail.next = Some(second);
                   tail = tail.next.as_mut().unwrap();
               }
           }
           *head = dummy.next.take();
       }
   }
Go
~~

.. code-block:: go

   func reorderList(head *ListNode) {
       if head == nil || head.Next == nil {
           return
       }
       slow, fast := head, head
       for fast.Next != nil && fast.Next.Next != nil {
           slow = slow.Next
           fast = fast.Next.Next
       }
       second := slow.Next
       slow.Next = nil
       var reversed *ListNode
       for second != nil {
           next := second.Next
           second.Next = reversed
           reversed = second
           second = next
       }
       first := head
       for reversed != nil {
           firstNext := first.Next
           secondNext := reversed.Next
           first.Next = reversed
           reversed.Next = firstNext
           first = firstNext
           reversed = secondNext
       }
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function reorderList(h: ListNode | null): void {
       if (!h || !h.next)
           return;
       let s = h, f = h;
       while (f.next && f.next.next) {
           s = s.next!;
           f = f.next.next;
       }
       let b = s.next;
       s.next = null;
       let p: ListNode | null = null;
       while (b) {
           const n = b.next;
           b.next = p;
           p = b;
           b = n;
       }
       let a: ListNode | null = h;
       while (p) {
           const firstNext: ListNode | null = a!.next;
           const secondNext: ListNode | null = p.next;
           a!.next = p;
           p.next = firstNext;
           a = firstNext;
           p = secondNext;
       }
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public void ReorderList(ListNode h) {
           if(h==null||h.next==null)return;
           ListNode s=h,f=h;
           while(f.next!=null&&f.next.next!=null) {
               s=s.next;
               f=f.next.next;
           }
           ListNode b=s.next;
           s.next=null,p=null;
           while(b!=null) {
               var n=b.next;
               b.next=p;
               p=b;
               b=n;
           }
           for(ListNode a=h;p!=null;) {
               var an=a.next;
               var pn=p.next;
               a.next=p;
               p.next=an;
               a=an;
               p=pn;
           }
       }
   }
Julia
~~~~~

.. code-block:: julia

   function reorder_list!(h)
       (h===nothing||h.next===nothing)&&return
       s=h
       f=h
       while f.next!==nothing&&f.next.next!==nothing
           s=s.next
           f=f.next.next
       end
       b=s.next
       s.next=nothing
       p=nothing
       while b!==nothing
           n=b.next
           b.next=p
           p=b
           b=n
       end
       a=h
       while p!==nothing
           an=a.next
           pn=p.next
           a.next=p
           p.next=an
           a=an
           p=pn
       end
       nothing
   end
R
~

.. code-block:: r

   reorder_list <- function(h) {
       if(is.null(h)||is.null(h$next))return(invisible(NULL))
       s<-h
       f<-h
       while(!is.null(f$next)&&!is.null(f$next$next)) {
           s<-s$next
           f<-f$next$next
       }
       b<-s$next
       s$next<-NULL
       p<-NULL
       while(!is.null(b)) {
           n<-b$next
           b$next<-p
           p<-b
           b<-n
       }
       a<-h
       while(!is.null(p)) {
           an<-a$next
           pn<-p$next
           a$next<-p
           p$next<-an
           a<-an
           p<-pn
       }
       invisible(NULL)
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 长度 0、1、2 时保持合法。
* 切分处必须断链。

易错点
------

* 未断开前半造成环。
* 合并时覆盖尚未保存的 next。

本题新增知识
------------

* 中点切分、后半反转、交替合并
* 题号 0143 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0092. Reverse Linked List II <../0001-0100/0092-reverse-linked-list-ii.rst>`_；
* `0148. Sort List <0148-sort-list.rst>`_；

最小自检
--------

#. ``三阶段原地重排`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

切分保留全部节点且两段不相交；反转使后半按尾到中顺序排列；交替合并严格产生目标索引序列。每次消费一个后半节点并保持剩余两链完整，最终无丢失和无环。
