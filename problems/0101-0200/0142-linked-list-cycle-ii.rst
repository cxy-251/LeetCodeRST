0142. Linked List Cycle II
==========================

题目信息
--------

:题号: 0142
:难度: Medium
:主题: 链表、双指针、数学证明
:原题: `LeetCode 0142 <https://leetcode.com/problems/linked-list-cycle-ii/>`_
:访问状态: Available
:教学重点: 相遇后从头同步

题目重述
--------

若链表有环，返回环入口节点；否则返回空。不修改链表。

自建示例
--------

.. code-block:: text

   输入：head = [3,2,0,-4], pos = 1
   输出：指向值 2 的入口节点

问题抽象
--------

先用快慢指针找环内相遇点；若相遇，将一个指针移回头节点，两者每次走一步，再次相遇处即入口。

主解法：Floyd 入口定位
----------------

思路
~~~~

Floyd 入口定位。 相遇后从头同步

核心状态与不变量
~~~~~~~~~~~~~~~~

先用快慢指针找环内相遇点；若相遇，将一个指针移回头节点，两者每次走一步，再次相遇处即入口。

正确性依据
~~~~~~~~~~

设头到入口距离为 ``a``，入口到第一次相遇为 ``b``，环长为 ``c``。相遇时快指针比慢指针多走整数圈，推出 ``a`` 与 ``c-b`` 同余；从头和相遇点同步前进会在入口首次相遇。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；空间 ``O(1)``。返回原节点身份。

核心语言实现
------------

C
~

.. code-block:: c

   struct ListNode*detectCycle(struct ListNode*h) {
       struct ListNode*s=h,*f=h;
       do {
           if(!f||!f->next)return NULL;
           s=s->next;
           f=f->next->next;
       }
       while(s!=f);
       s=h;
       while(s!=f) {
           s=s->next;
           f=f->next;
       }
       return s;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:ListNode*detectCycle(ListNode*h) {
           ListNode*s=h,*f=h;
           do {
               if(!f||!f->next)return nullptr;
               s=s->next;
               f=f->next->next;
           }
           while(s!=f);
           s=h;
           while(s!=f) {
               s=s->next;
               f=f->next;
           }
           return s;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
           slow = fast = head
           while fast and fast.next:
               slow = slow.next
               fast = fast.next.next
               if slow is fast:
                   break
           else:
               return None
           slow = head
           while slow is not fast:
               slow = slow.next
               fast = fast.next
           return slow
Java
~~~~

.. code-block:: java

   public class Solution {
       public ListNode detectCycle(ListNode h) {
           ListNode s=h,f=h;
           do {
               if(f==null||f.next==null)return null;
               s=s.next;
               f=f.next.next;
           }
           while(s!=f);
           s=h;
           while(s!=f) {
               s=s.next;
               f=f.next;
           }
           return s;
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn detect_cycle(head:Option<Rc<RefCell<ListNode>>>)->Option<Rc<RefCell<ListNode>>> {
           let(mut s,mut f)=(head.clone(),head.clone());
           let meet=loop {
               s=s.and_then(|n|n.borrow().next.clone());
               f=f.and_then(|n|n.borrow().next.clone()).and_then(|n|n.borrow().next.clone());
               match(&s,&f) {
                   (Some(a),Some(b))if Rc::ptr_eq(a,b)=>break a.clone(),(_,None)=>return None,_=> {
                   }
               }
           };
           let mut a=head;
           let mut b=Some(meet);
           while let(Some(x),Some(y))=(&a,&b) {
               if Rc::ptr_eq(x,y) {
                   return a
               }
               a=x.borrow().next.clone();
               b=y.borrow().next.clone();
           }
           None
       }
   }
Go
~~

.. code-block:: go

   func detectCycle(h *ListNode) *ListNode {
   	s, f := h, h
   	for {
   		if f == nil || f.Next == nil {
   			return nil
   		}
   		s = s.Next
   		f = f.Next.Next
   		if s == f {
   			break
   		}
   	}
   	s = h
   	for s != f {
   		s = s.Next
   		f = f.Next
   	}
   	return s
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function detectCycle(h: ListNode | null): ListNode | null {
       let s = h, f = h;
       do {
           if (!f || !f.next)
               return null;
           s = s!.next;
           f = f.next.next;
       } while (s !== f);
       s = h;
       while (s !== f) {
           s = s!.next;
           f = f!.next;
       }
       return s;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode DetectCycle(ListNode h) {
           ListNode s=h,f=h;
           do {
               if(f==null||f.next==null)return null;
               s=s.next;
               f=f.next.next;
           }
           while(s!=f);
           s=h;
           while(s!=f) {
               s=s.next;
               f=f.next;
           }
           return s;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function detect_cycle(head)
       s=head
       f=head
       while true
           (f===nothing||f.next===nothing)&&return nothing
           s=s.next
           f=f.next.next
           s===f&&break
       end
       s=head
       while s!==f
           s=s.next
           f=f.next
       end
       s
   end
R
~

.. code-block:: r

   detect_cycle <- function(head) {
       s<-head
       f<-head
       repeat {
           if(is.null(f)||is.null(f$next))return(NULL)
           s<-s$next
           f<-f$next$next
           if(identical(s,f))break
       }
       s<-head
       while(!identical(s,f)) {
           s<-s$next
           f<-f$next
       }
       s
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 无环返回空。
* 入口可以是头节点。

易错点
------

* 相遇后仍让快指针走两步。
* 返回相遇点而非入口。

本题新增知识
------------

* 相遇后从头同步
* 题号 0142 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0141. Linked List Cycle <0141-linked-list-cycle.rst>`_；

最小自检
--------

#. ``Floyd 入口定位`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

设头到入口距离为 ``a``，入口到第一次相遇为 ``b``，环长为 ``c``。相遇时快指针比慢指针多走整数圈，推出 ``a`` 与 ``c-b`` 同余；从头和相遇点同步前进会在入口首次相遇。
