0147. Insertion Sort List
=========================

题目信息
--------

:题号: 0147
:难度: Medium
:主题: 链表、插入排序
:原题: `LeetCode 0147 <https://leetcode.com/problems/insertion-sort-list/>`_
:访问状态: Available
:教学重点: 已排序前缀与哑节点

题目重述
--------

使用插入排序对单链表升序排序，重连节点而不是复制值。

自建示例
--------

.. code-block:: text

   输入：head = [4,2,1,3]
   输出：[1,2,3,4]

问题抽象
--------

依次取原链当前节点，在哑节点后的已排序链中找到第一个大于它的位置并插入。

主解法：哑节点插入排序
-------------

思路
~~~~

哑节点插入排序。 已排序前缀与哑节点

核心状态与不变量
~~~~~~~~~~~~~~~~

依次取原链当前节点，在哑节点后的已排序链中找到第一个大于它的位置并插入。

正确性依据
~~~~~~~~~~

循环前哑节点后链表已排序且包含已处理节点。插入位置前值不大于当前、后值大于当前，因此插入后仍排序；每个原节点恰处理一次且身份保留。

复杂度与语言边界
~~~~~~~~~~~~~~~~

最坏时间 ``O(n^2)``；空间 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   struct ListNode*insertionSortList(struct ListNode*h) {
       struct ListNode dummy= {
           0,NULL
       };
       while(h) {
           struct ListNode*n=h->next,*p=&dummy;
           while(p->next&&p->next->val<=h->val)p=p->next;
           h->next=p->next;
           p->next=h;
           h=n;
       }
       return dummy.next;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:ListNode*insertionSortList(ListNode*h) {
           ListNode d;
           while(h) {
               ListNode*n=h->next,*p=&d;
               while(p->next&&p->next->val<=h->val)p=p->next;
               h->next=p->next;
               p->next=h;
               h=n;
           }
           return d.next;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def insertionSortList(self, head: Optional[ListNode]) -> Optional[ListNode]:
           dummy = ListNode()
           cur = head
           while cur:
               nxt = cur.next
               pre = dummy
               while pre.next and pre.next.val <= cur.val:
                   pre = pre.next
               cur.next = pre.next
               pre.next = cur
               cur = nxt
           return dummy.next
Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode insertionSortList(ListNode h) {
           ListNode d=new ListNode();
           while(h!=null) {
               ListNode n=h.next,p=d;
               while(p.next!=null&&p.next.val<=h.val)p=p.next;
               h.next=p.next;
               p.next=h;
               h=n;
           }
           return d.next;
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn insertion_sort_list(mut head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
           fn insert(sorted: Option<Box<ListNode>>, mut node: Box<ListNode>) ->
               Option<Box<ListNode>> {
               match sorted {
                   None => Some(node), Some(first) if node.val <= first.val => {
                       node.next = Some(first);
                       Some(node)
                   }
                   Some(mut first) => {
                       first.next = insert(first.next.take(), node);
                       Some(first)
                   }
               }
           }
           let mut sorted = None;
           while let Some(mut node) = head {
               head = node.next.take();
               sorted = insert(sorted, node);
           }
           sorted
       }
   }
Go
~~

.. code-block:: go

   func insertionSortList(h *ListNode) *ListNode {
   	d := &ListNode{}
   	for h != nil {
   		n := h.Next
   		p := d
   		for p.Next != nil && p.Next.Val <= h.Val {
   			p = p.Next
   		}
   		h.Next = p.Next
   		p.Next = h
   		h = n
   	}
   	return d.Next
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function insertionSortList(h: ListNode | null): ListNode | null {
       const d = new ListNode();
       while (h) {
           const n = h.next;
           let p = d;
           while (p.next && p.next.val <= h.val)
               p = p.next;
           h.next = p.next;
           p.next = h;
           h = n;
       }
       return d.next;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode InsertionSortList(ListNode h) {
           var d=new ListNode();
           while(h!=null) {
               var n=h.next;
               var p=d;
               while(p.next!=null&&p.next.val<=h.val)p=p.next;
               h.next=p.next;
               p.next=h;
               h=n;
           }
           return d.next;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function insertion_sort_list(h)
       d=ListNode(0)
       while h!==nothing
           n=h.next
           p=d
           while p.next!==nothing&&p.next.val<=h.val
               p=p.next
           end
           h.next=p.next
           p.next=h
           h=n
       end
       d.next
   end
R
~

.. code-block:: r

   insertion_sort_list <- function(h) {
       d<-new_list_node(0L)
       while(!is.null(h)) {
           n<-h$next
           p<-d
           while(!is.null(p$next)&&p$next$val<=h$val)p<-p$next
           h$next<-p$next
           p$next<-h
           h<-n
       }
       d$next
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空链表和单节点直接返回。
* 相等元素插在已有相等元素之后可保持稳定。

易错点
------

* 搜索插入点时丢失当前节点的原 next。
* 修改节点值而非重连。

本题新增知识
------------

* 已排序前缀与哑节点
* 题号 0147 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0148. Sort List <0148-sort-list.rst>`_；

最小自检
--------

#. ``哑节点插入排序`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

循环前哑节点后链表已排序且包含已处理节点。插入位置前值不大于当前、后值大于当前，因此插入后仍排序；每个原节点恰处理一次且身份保留。
