0141. Linked List Cycle
=======================

题目信息
--------

:题号: 0141
:难度: Easy
:主题: 链表、双指针
:原题: `LeetCode 0141 <https://leetcode.com/problems/linked-list-cycle/>`_
:访问状态: Available
:教学重点: 快慢指针相遇

题目重述
--------

判断单链表是否存在环，不修改链表。

自建示例
--------

.. code-block:: text

   输入：head = [3,2,0,-4], pos = 1
   输出：true

   输入：head = [1], pos = -1
   输出：false

问题抽象
--------

慢指针每次走一步，快指针每次走两步；若相遇则存在环，快指针到空则无环。

主解法：Floyd 快慢指针
----------------

思路
~~~~

Floyd 快慢指针。 快慢指针相遇

核心状态与不变量
~~~~~~~~~~~~~~~~

慢指针每次走一步，快指针每次走两步；若相遇则存在环，快指针到空则无环。

正确性依据
~~~~~~~~~~

无环时快指针沿有限链最终到空。存在环时两指针进入环后，相对速度为 1，有限个环位置上必相遇。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；空间 ``O(1)``。节点比较必须按身份而非值。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   bool hasCycle(struct ListNode*head) {
       struct ListNode*slow=head,*fast=head;
       while(fast&&fast->next) {
           slow=slow->next;
           fast=fast->next->next;
           if(slow==fast)return true;
       }
       return false;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:bool hasCycle(ListNode*h) {
           ListNode*s=h,*f=h;
           while(f&&f->next) {
               s=s->next;
               f=f->next->next;
               if(s==f)return true;
           }
           return false;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def hasCycle(self, head: Optional[ListNode]) -> bool:
           slow = fast = head
           while fast and fast.next:
               slow = slow.next
               fast = fast.next.next
               if slow is fast:
                   return True
           return False
Java
~~~~

.. code-block:: java

   public class Solution {
       public boolean hasCycle(ListNode h) {
           ListNode s=h,f=h;
           while(f!=null&&f.next!=null) {
               s=s.next;
               f=f.next.next;
               if(s==f)return true;
           }
           return false;
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn has_cycle(head:Option<Rc<RefCell<ListNode>>>)->bool {
           let(mut s,mut f)=(head.clone(),head);
           loop {
               s=s.and_then(|n|n.borrow().next.clone());
               f=f.and_then(|n|n.borrow().next.clone()).and_then(|n|n.borrow().next.clone());
               match(&s,&f) {
                   (Some(a),Some(b))if Rc::ptr_eq(a,b)=>return true,(_,None)=>return false,_=> {
                   }
               }
           }
       }
   }
Go
~~

.. code-block:: go

   func hasCycle(h *ListNode) bool {
   	s, f := h, h
   	for f != nil && f.Next != nil {
   		s = s.Next
   		f = f.Next.Next
   		if s == f {
   			return true
   		}
   	}
   	return false
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function hasCycle(h: ListNode | null): boolean {
       let s = h, f = h;
       while (f && f.next) {
           s = s!.next;
           f = f.next.next;
           if (s === f)
               return true;
       }
       return false;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public bool HasCycle(ListNode h) {
           ListNode s=h,f=h;
           while(f!=null&&f.next!=null) {
               s=s.next;
               f=f.next.next;
               if(s==f)return true;
           }
           return false;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function has_cycle(head)::Bool
       s=head
       f=head
       while f!==nothing&&f.next!==nothing
           s=s.next
           f=f.next.next
           s===f&&return true
       end
       false
   end
R
~

.. code-block:: r

   has_cycle <- function(head) {
       s<-head
       f<-head
       while(!is.null(f)&&!is.null(f$next)) {
           s<-s$next
           f<-f$next$next
           if(identical(s,f))return(TRUE)
       }
       FALSE
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空链表和单个无环节点返回 false。
* 自环节点会相遇。

易错点
------

* 比较节点值，重复值会误判。
* 快指针解引用前未检查两层空值。

本题新增知识
------------

* 快慢指针相遇
* 题号 0141 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0142. Linked List Cycle II <0142-linked-list-cycle-ii.rst>`_；

最小自检
--------

#. ``Floyd 快慢指针`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

无环时快指针沿有限链最终到空。存在环时两指针进入环后，相对速度为 1，有限个环位置上必相遇。
