0148. Sort List
===============

题目信息
--------

:题号: 0148
:难度: Medium
:主题: 链表、归并排序
:原题: `LeetCode 0148 <https://leetcode.com/problems/sort-list/>`_
:访问状态: Available
:教学重点: 断链分治与稳定合并

题目重述
--------

在 ``O(n log n)`` 时间内对链表升序排序，尽量使用常数额外节点空间。

自建示例
--------

.. code-block:: text

   输入：head = [4,2,1,3]
   输出：[1,2,3,4]

问题抽象
--------

快慢指针切成两半并断链，递归排序两半，再用哑节点稳定合并。

主解法：链表归并排序
------------

思路
~~~~

链表归并排序。 断链分治与稳定合并

核心状态与不变量
~~~~~~~~~~~~~~~~

快慢指针切成两半并断链，递归排序两半，再用哑节点稳定合并。

正确性依据
~~~~~~~~~~

分治使子链长度严格减小。归纳假设两半已排序；合并每次取较小头节点，保持输出有序并最终消费全部节点，因此结果排序且不丢节点。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n log n)``；递归栈 ``O(log n)``，合并指针 ``O(1)``；输出复用原节点。

核心语言实现
------------

C
~

.. code-block:: c

   static struct ListNode*merge(struct ListNode*a,struct ListNode*b) {
       struct ListNode d= {
           0,NULL
       }
       ,*t=&d;
       while(a&&b) {
           if(a->val<=b->val) {
               t->next=a;
               a=a->next;
           } else {
               t->next=b;
               b=b->next;
           }
           t=t->next;
       }
       t->next=a?a:b;
       return d.next;
   }
   struct ListNode*sortList(struct ListNode*h) {
       if(!h||!h->next)return h;
       struct ListNode*s=h,*f=h->next;
       while(f&&f->next) {
           s=s->next;
           f=f->next->next;
       }
       struct ListNode*b=s->next;
       s->next=NULL;
       return merge(sortList(h),sortList(b));
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       ListNode*merge(ListNode*a,ListNode*b) {
           ListNode d,*t=&d;
           while(a&&b) {
               if(a->val<=b->val) {
                   t->next=a;
                   a=a->next;
               } else {
                   t->next=b;
                   b=b->next;
               }
               t=t->next;
           }
           t->next=a?a:b;
           return d.next;
       }
       public:ListNode*sortList(ListNode*h) {
           if(!h||!h->next)return h;
           ListNode*s=h,*f=h->next;
           while(f&&f->next) {
               s=s->next;
               f=f->next->next;
           }
           ListNode*b=s->next;
           s->next=nullptr;
           return merge(sortList(h),sortList(b));
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:
           if head is None or head.next is None:
               return head
           slow, fast = (head, head.next)
           while fast and fast.next:
               slow = slow.next
               fast = fast.next.next
           right = slow.next
           slow.next = None
           a, b = (self.sortList(head), self.sortList(right))
           dummy = tail = ListNode()
           while a and b:
               if a.val <= b.val:
                   tail.next = a
                   a = a.next
               else:
                   tail.next = b
                   b = b.next
               tail = tail.next
           tail.next = a or b
           return dummy.next
Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode sortList(ListNode h) {
           if(h==null||h.next==null)return h;
           ListNode s=h,f=h.next;
           while(f!=null&&f.next!=null) {
               s=s.next;
               f=f.next.next;
           }
           ListNode b=s.next;
           s.next=null;
           return merge(sortList(h),sortList(b));
       }
       ListNode merge(ListNode a,ListNode b) {
           ListNode d=new ListNode(),t=d;
           while(a!=null&&b!=null) {
               if(a.val<=b.val) {
                   t.next=a;
                   a=a.next;
               } else {
                   t.next=b;
                   b=b.next;
               }
               t=t.next;
           }
           t.next=a!=null?a:b;
           return d.next;
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn sort_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
           fn length(mut p: &Option<Box<ListNode>>) -> usize {
               let mut n=0;
               while let Some(x)=p {
                   n+=1;
                   p=&x.next;
               }
               n
           }
           fn merge(a: Option<Box<ListNode>>, b: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
               match (a,b) {
                   (None,x)|(x,None)=>x, (Some(mut x),Some(y)) if x.val<=y.val => {
                       let next=x.next.take();
                       x.next=merge(next,Some(y));
                       Some(x)
                   }
                   (Some(x),Some(mut y)) => {
                       let next=y.next.take();
                       y.next=merge(Some(x),next);
                       Some(y)
                   }
               }
           }
           fn sort(mut head: Option<Box<ListNode>>, n: usize) -> Option<Box<ListNode>> {
               if n<=1 {
                   return head;
               }
               let left_n=n/2;
               let mut cut=&mut head;
               for _ in 1..left_n {
                   cut=&mut cut.as_mut().unwrap().next;
               }
               let right=cut.as_mut().unwrap().next.take();
               merge(sort(head,left_n),sort(right,n-left_n))
           }
           let n=length(&head);
           sort(head,n)
       }
   }
Go
~~

.. code-block:: go

   func sortList(h *ListNode) *ListNode {
   	if h == nil || h.Next == nil {
   		return h
   	}
   	s, f := h, h.Next
   	for f != nil && f.Next != nil {
   		s = s.Next
   		f = f.Next.Next
   	}
   	b := s.Next
   	s.Next = nil
   	return mergeList(sortList(h), sortList(b))
   }
   func mergeList(a, b *ListNode) *ListNode {
   	d := &ListNode{}
   	t := d
   	for a != nil && b != nil {
   		if a.Val <= b.Val {
   			t.Next = a
   			a = a.Next
   		} else {
   			t.Next = b
   			b = b.Next
   		}
   		t = t.Next
   	}
   	if a != nil {
   		t.Next = a
   	} else {
   		t.Next = b
   	}
   	return d.Next
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sortList(h: ListNode | null): ListNode | null {
       if (!h || !h.next)
           return h;
       let slow: ListNode = h;
       let fast: ListNode | null = h.next;
       while (fast && fast.next) {
           slow = slow.next!;
           fast = fast.next.next;
       }
       const second = slow.next;
       slow.next = null;
       return merge(sortList(h), sortList(second));
   }
   function merge(a: ListNode | null, b: ListNode | null): ListNode | null {
       const d = new ListNode();
       let t: ListNode = d;
       while (a && b) {
           if (a.val <= b.val) {
               t.next = a;
               a = a.next;
           }
           else {
               t.next = b;
               b = b.next;
           }
           t = t.next!;
       }
       t.next = a ?? b;
       return d.next;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode SortList(ListNode h) {
           if(h==null||h.next==null)return h;
           ListNode s=h,f=h.next;
           while(f!=null&&f.next!=null) {
               s=s.next;
               f=f.next.next;
           }
           var b=s.next;
           s.next=null;
           return Merge(SortList(h),SortList(b));
       }
       ListNode Merge(ListNode a,ListNode b) {
           var d=new ListNode();
           var t=d;
           while(a!=null&&b!=null) {
               if(a.val<=b.val) {
                   t.next=a;
                   a=a.next;
               } else {
                   t.next=b;
                   b=b.next;
               }
               t=t.next;
           }
           t.next=a??b;
           return d.next;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function sort_list(h)
       (h===nothing||h.next===nothing)&&return h
       s=h
       f=h.next
       while f!==nothing&&f.next!==nothing
           s=s.next
           f=f.next.next
       end
       b=s.next
       s.next=nothing
       merge_lists(sort_list(h),sort_list(b))
   end
   function merge_lists(a,b)
       d=ListNode(0)
       t=d
       while a!==nothing&&b!==nothing
           if a.val<=b.val
               t.next=a
               a=a.next
           else
               t.next=b
               b=b.next
           end
           t=t.next
       end
       t.next=a===nothing ? b : a
       d.next
   end
R
~

.. code-block:: r

   sort_list <- function(h) {
       if(is.null(h)||is.null(h$next))return(h)
       s<-h
       f<-h$next
       while(!is.null(f)&&!is.null(f$next)) {
           s<-s$next
           f<-f$next$next
       }
       b<-s$next
       s$next<-NULL
       merge<-function(a,b) {
           d<-new_list_node(0L)
           t<-d
           while(!is.null(a)&&!is.null(b)) {
               if(a$val<=b$val) {
                   t$next<-a
                   a<-a$next
               }
               else {
                   t$next<-b
                   b<-b$next
               }
               t<-t$next
           }
           t$next<-if(is.null(a))b else a
           d$next
       }
       merge(sort_list(h),sort_list(b))
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 切分必须保证两半都比原链短。
* 相等时优先左链保持稳定。

易错点
------

* 未断链导致递归不终止。
* 每层重新扫描尾部拼接造成额外平方成本。

本题新增知识
------------

* 断链分治与稳定合并
* 题号 0148 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0147. Insertion Sort List <0147-insertion-sort-list.rst>`_；
* `0023. Merge k Sorted Lists <../0001-0100/0023-merge-k-sorted-lists.rst>`_；

最小自检
--------

#. ``链表归并排序`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

分治使子链长度严格减小。归纳假设两半已排序；合并每次取较小头节点，保持输出有序并最终消费全部节点，因此结果排序且不丢节点。
