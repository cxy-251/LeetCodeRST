0025. Reverse Nodes in k-Group
==============================

题目信息
--------

:题号: 0025
:题名: Reverse Nodes in k-Group
:难度: Hard
:类型: Algorithms
:主题: 链表、递归、指针
:原题: `LeetCode 0025 <https://leetcode.com/problems/reverse-nodes-in-k-group/>`_

题目重述
--------

给定单链表头节点 ``head`` 和正整数 ``k``，从头开始把节点按连续的 ``k`` 个分组，并反转每个完整分组的节点顺序。末尾不足 ``k`` 个节点时保持原顺序。必须修改节点连接关系，不能只交换节点值。

自建示例
--------

.. code-block:: text

   输入：head = [1, 2, 3, 4, 5, 6, 7], k = 3
   输出：[3, 2, 1, 6, 5, 4, 7]

.. code-block:: text

   输入：head = [1, 2], k = 3
   输出：[1, 2]
   解释：节点数量不足一个完整分组。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       ListNode* arrayBlocks(ListNode* head, int k) {
           std::vector<ListNode*> nodes;
           for (ListNode* node = head; node != nullptr; node = node->next) nodes.push_back(node);
           for (int start = 0; start + k <= static_cast<int>(nodes.size()); start += k) {
               std::reverse(nodes.begin() + start, nodes.begin() + start + k);
           }
           for (int i = 1; i < static_cast<int>(nodes.size()); ++i) nodes[i - 1]->next = nodes[i];
           if (!nodes.empty()) nodes.back()->next = nullptr;
           return nodes.empty() ? nullptr : nodes[0];
       }

       ListNode* recursiveGroups(ListNode* head, int k) {
           ListNode* cursor = head;
           for (int count = 0; count < k; ++count) {
               if (cursor == nullptr) return head;
               cursor = cursor->next;
           }
           ListNode* previous = recursiveGroups(cursor, k);
           ListNode* current = head;
           for (int count = 0; count < k; ++count) {
               ListNode* next = current->next;
               current->next = previous;
               previous = current;
               current = next;
           }
           return previous;
       }

       ListNode* iterativeGroups(ListNode* head, int k) {
           ListNode dummy(0, head);
           ListNode* group_prev = &dummy;
           while (true) {
               ListNode* kth = group_prev;
               for (int step = 0; step < k && kth != nullptr; ++step) kth = kth->next;
               if (kth == nullptr) break;

               ListNode* group_next = kth->next;
               ListNode* old_start = group_prev->next;
               ListNode* previous = group_next;
               ListNode* current = old_start;
               while (current != group_next) {
                   ListNode* next = current->next;
                   current->next = previous;
                   previous = current;
                   current = next;
               }
               group_prev->next = kth;
               group_prev = old_start;
           }
           return dummy.next;
       }

   public:
       ListNode* reverseKGroup(ListNode* head, int k) {
           return iterativeGroups(head, k);
       }
   };

题解
----

数组分块为什么简单却失去原地链表优势
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

把所有节点放入数组后，可以按下标反转完整块再重建链接，时间 ``O(n)``，但额外保存 ``O(n)`` 个节点指针。链表
本身已经提供顺序关系，迭代主解法只需固定数量指针。

为什么必须先探测完整 k 节点组
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若边反转边计数，最后发现不足 ``k`` 个时必须把已经修改的后缀再次反转恢复。主解法先从 ``group_prev`` 向后走
``k`` 步；中途为空就直接结束，此时尚未修改任何链接，所以不完整后缀天然保留。

半开区间如何限定本组反转范围
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

探测成功后，``kth`` 是组末节点，``group_next = kth.next``。反转区间是
``[group_prev.next, group_next)``。令 ``previous = group_next``，循环到 ``current == group_next``，旧组头最终会
自动指向组后缀，不需要额外寻找新组尾。

一组链接变化
~~~~~~~~~~~~

.. code-block:: text

   group_prev -> 1 -> 2 -> 3 -> group_next
   group_prev -> 3 -> 2 -> 1 -> group_next

反转前保存 ``old_start = 1``。反转后 ``kth = 3`` 成为新组头，``old_start`` 成为新组尾；设置
``group_prev.next = kth``，再令 ``group_prev = old_start``。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 阶段
     - 已处理前缀
     - 当前后缀
     - 动作
   * - 初始
     - 空
     - 1,2,3,4,5
     - 探测到 3
   * - 第一组后
     - 3,2,1
     - 4,5
     - ``group_prev`` 位于 1
   * - 再探测
     - 3,2,1
     - 4,5
     - 不足 3 个，结束

为什么节点不会丢失、重复或成环
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

反转循环在改写 ``current.next`` 前保存原后继，每个本组节点恰好处理一次。初始前驱是组后缀，最后一条反向链接
自然接回后缀；组前驱再连接新组头，于是已处理前缀、当前组、未处理后缀重新形成一条链。各完整组互不重叠。

递归与迭代的空间差异
~~~~~~~~~~~~~~~~~~~~

递归方法先探测 ``k`` 个节点，再递归处理后缀，把后缀结果作为本组反转的初始前驱。时间仍为 ``O(n)``，调用栈
约 ``O(n/k)``。迭代方法每个节点在探测和反转中各访问常数次，总时间 ``O(n)``，额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   struct ListNode* reverseKGroup(struct ListNode* head, int k) {
       struct ListNode dummy={0,head};struct ListNode* group_prev=&dummy;
       for(;;){
           struct ListNode* kth=group_prev;for(int i=0;i<k&&kth;i++)kth=kth->next;if(!kth)break;
           struct ListNode* next_group=kth->next,*old_start=group_prev->next,*prev=next_group,*cur=old_start;
           while(cur!=next_group){struct ListNode* next=cur->next;cur->next=prev;prev=cur;cur=next;}
           group_prev->next=kth;group_prev=old_start;
       }
       return dummy.next;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def reverseKGroup(self, head, k):
           dummy=ListNode(0,head);group_prev=dummy
           while True:
               kth=group_prev
               for _ in range(k):
                   kth=kth.next
                   if kth is None:return dummy.next
               group_next=kth.next;old_start=group_prev.next;prev=group_next;cur=old_start
               while cur is not group_next:
                   nxt=cur.next;cur.next=prev;prev=cur;cur=nxt
               group_prev.next=kth;group_prev=old_start

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode reverseKGroup(ListNode head,int k){
           ListNode dummy=new ListNode(0,head),gp=dummy;
           while(true){ListNode kth=gp;for(int i=0;i<k&&kth!=null;i++)kth=kth.next;if(kth==null)break;
               ListNode gn=kth.next,old=gp.next,prev=gn,cur=old;
               while(cur!=gn){ListNode next=cur.next;cur.next=prev;prev=cur;cur=next;}
               gp.next=kth;gp=old;}
           return dummy.next;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn reverse_k_group(head: Option<Box<ListNode>>, k: i32) -> Option<Box<ListNode>> {
           fn solve(mut head: Option<Box<ListNode>>, k: usize) -> Option<Box<ListNode>> {
               let mut check=&head;for _ in 0..k{match check{Some(node)=>check=&node.next,None=>return head}}
               let mut rest=head.as_mut().unwrap();for _ in 1..k{rest=rest.next.as_mut().unwrap();}
               let suffix=rest.next.take();let mut previous=solve(suffix,k);let mut current=head;
               for _ in 0..k{let mut node=current.unwrap();current=node.next.take();node.next=previous;previous=Some(node);}
               previous
           }
           solve(head,k as usize)
       }
   }

Go
~~

.. code-block:: go

   func reverseKGroup(head *ListNode,k int)*ListNode{
       dummy:=&ListNode{Next:head};gp:=dummy
       for{ kth:=gp;for i:=0;i<k&&kth!=nil;i++{kth=kth.Next};if kth==nil{break}
           gn:=kth.Next;old:=gp.Next;prev:=gn;cur:=old
           for cur!=gn{next:=cur.Next;cur.Next=prev;prev=cur;cur=next}
           gp.Next=kth;gp=old }
       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function reverseKGroup(head:ListNode|null,k:number):ListNode|null{
       const dummy=new ListNode(0,head);let gp=dummy;
       while(true){let kth:ListNode|null=gp;for(let i=0;i<k&&kth!==null;i++)kth=kth.next;if(kth===null)break;
           const gn=kth.next,old=gp.next!;let prev=gn,cur:ListNode|null=old;
           while(cur!==gn){const next=cur!.next;cur!.next=prev;prev=cur;cur=next;}
           gp.next=kth;gp=old;}
       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode ReverseKGroup(ListNode head,int k){
           var dummy=new ListNode(0,head);var gp=dummy;
           while(true){var kth=gp;for(int i=0;i<k&&kth!=null;i++)kth=kth.next;if(kth==null)break;
               var gn=kth.next;var old=gp.next;var prev=gn;var cur=old;
               while(cur!=gn){var next=cur.next;cur.next=prev;prev=cur;cur=next;}
               gp.next=kth;gp=old;}
           return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function reverse_k_group(head,k)
       dummy=ListNode(0,head);gp=dummy
       while true
           kth=gp;for _ in 1:k;kth=kth===nothing ? nothing : kth.next;end;kth===nothing && break
           gn=kth.next;old=gp.next;prev=gn;cur=old
           while cur!==gn;next=cur.next;cur.next=prev;prev=cur;cur=next;end
           gp.next=kth;gp=old
       end
       dummy.next
   end

R
~

.. code-block:: r

   reverse_k_group <- function(head,k) {
       dummy<-new_list_node(0,head);gp<-dummy
       repeat {
           kth<-gp;for(i in seq_len(k)){kth<-kth$next;if(is.null(kth))break};if(is.null(kth))break
           gn<-kth$next;old<-gp$next;prev<-gn;cur<-old
           while(!identical(cur,gn)){next_node<-cur$next;cur$next<-prev;prev<-cur;cur<-next_node}
           gp$next<-kth;gp<-old
       }
       dummy$next
   }
