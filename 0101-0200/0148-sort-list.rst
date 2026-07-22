0148. Sort List
===============

题目信息
--------

:题号: 0148
:难度: Medium
:主题: 链表、归并排序、自底向上迭代
:原题: `LeetCode 0148 <https://leetcode.com/problems/sort-list/>`_
:教学重点: 定长 run、稳定合并、宽度翻倍、常量核心空间

题目重述
--------

把可空单链表按值非递减排序，要求 ``O(n log n)`` 时间。结果必须重用全部原节点，只修改 ``next``；C++ 主解采用自底向上归并，核心额外空间 ``O(1)``。

自建示例
--------

.. code-block:: text

   A4 -> B2 -> C1 -> D3 -> E2
   width=1: B2 A4 | C1 D3 | E2
   width=2: C1 B2 D3 A4 | E2
   width=4: C1 B2 E2 D3 A4

相等值时先取左 run，因而 ``B2`` 仍在 ``E2`` 之前。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       ListNode* arraySort(ListNode* head) {
           std::vector<ListNode*> nodes;
           for (ListNode* p=head; p; p=p->next) nodes.push_back(p);
           std::stable_sort(nodes.begin(),nodes.end(),[](ListNode* a,ListNode* b){return a->val<b->val;});
           for (int i=1;i<static_cast<int>(nodes.size());++i) nodes[i-1]->next=nodes[i];
           if (!nodes.empty()) nodes.back()->next=nullptr;
           return nodes.empty()?nullptr:nodes[0];
       }

       ListNode* split(ListNode* head, int size) {
           while (head && --size) head=head->next;
           if (!head) return nullptr;
           ListNode* second=head->next;
           head->next=nullptr;
           return second;
       }

       ListNode* merge(ListNode* left,ListNode* right,ListNode*& tail) {
           ListNode dummy(0),*current=&dummy;
           while (left&&right) {
               if (left->val<=right->val) {current->next=left;left=left->next;}
               else {current->next=right;right=right->next;}
               current=current->next;
           }
           current->next=left?left:right;
           while (current->next) current=current->next;
           tail=current;
           return dummy.next;
       }

       ListNode* bottomUp(ListNode* head) {
           int length=0;
           for (ListNode* p=head;p;p=p->next) ++length;
           ListNode dummy(0);dummy.next=head;
           for (int width=1;width<length;width*=2) {
               ListNode* previous=&dummy;
               ListNode* current=dummy.next;
               while (current) {
                   ListNode* left=current;
                   ListNode* right=split(left,width);
                   current=split(right,width);
                   ListNode* tail=nullptr;
                   previous->next=merge(left,right,tail);
                   previous=tail;
               }
           }
           return dummy.next;
       }

   public:
       ListNode* sortList(ListNode* head) {
           return bottomUp(head);
       }
   };

题解
----

为什么选择归并排序
~~~~~~~~~~~~~~~~~~

链表顺序访问和断链都是常数时间，归并只需比较两个表头；快速排序难以原地随机分区，插入排序最坏为 ``O(n²)``。归并天然适合链表。

每轮 run 不变量
~~~~~~~~~~~~~~

进入 ``width`` 轮时，链表由若干长度不超过 ``width`` 的有序 run 组成。每次切出相邻两段并稳定合并，轮末得到长度不超过 ``2*width`` 的有序 run。

切分为什么必须断链
~~~~~~~~~~~~~~~~~~

``split`` 找到 run 的最后节点，保存下一段表头后把 ``next`` 置空。若不断开，合并会越过当前边界读取后续节点，导致重复连接或环。

尾 run 如何处理
~~~~~~~~~~~~~~~~

节点数不一定是 ``2*width`` 的倍数。右 run 可能为空，或长度不足 ``width``；稳定合并把非空剩余链直接接上，因此无需特判。

为什么稳定
~~~~~~~~~~

两侧表头值相等时使用 ``<=`` 选择左 run。左 run 中的节点在输入顺序上早于右 run，所以跨 run 的相等节点保持原相对顺序。

复杂度来源
~~~~~~~~~~

宽度翻倍产生 ``O(log n)`` 轮，每轮访问全部节点，时间 ``O(n log n)``。C++ 主解仅使用固定数量指针，核心额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   static struct ListNode*split(struct ListNode*h,int n){while(h&&--n)h=h->next;if(!h)return NULL;struct ListNode*r=h->next;h->next=NULL;return r;}static struct ListNode*merge(struct ListNode*a,struct ListNode*b,struct ListNode**tail){struct ListNode dummy={0,NULL},*p=&dummy;while(a&&b){if(a->val<=b->val){p->next=a;a=a->next;}else{p->next=b;b=b->next;}p=p->next;}p->next=a?a:b;while(p->next)p=p->next;*tail=p;return dummy.next;}struct ListNode*sortList(struct ListNode*head){int n=0;for(struct ListNode*p=head;p;p=p->next)n++;struct ListNode dummy={0,head};for(int w=1;w<n;w*=2){struct ListNode*prev=&dummy,*cur=dummy.next;while(cur){struct ListNode*a=cur,*b=split(a,w);cur=split(b,w);struct ListNode*tail;prev->next=merge(a,b,&tail);prev=tail;}}return dummy.next;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def sortList(self, head):
           def merge(a,b):
               dummy=tail=ListNode()
               while a and b:
                   if a.val<=b.val: tail.next,a=a,a.next
                   else: tail.next,b=b,b.next
                   tail=tail.next
               tail.next=a or b
               return dummy.next
           def sort(node):
               if not node or not node.next:return node
               slow,fast=node,node.next
               while fast and fast.next:slow,fast=slow.next,fast.next.next
               right=slow.next;slow.next=None
               return merge(sort(node),sort(right))
           return sort(head)

Java
~~~~

.. code-block:: java

   class Solution {ListNode merge(ListNode a,ListNode b){ListNode d=new ListNode(),t=d;while(a!=null&&b!=null){if(a.val<=b.val){t.next=a;a=a.next;}else{t.next=b;b=b.next;}t=t.next;}t.next=a!=null?a:b;return d.next;}public ListNode sortList(ListNode h){if(h==null||h.next==null)return h;ListNode slow=h,fast=h.next;while(fast!=null&&fast.next!=null){slow=slow.next;fast=fast.next.next;}ListNode r=slow.next;slow.next=null;return merge(sortList(h),sortList(r));}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn sort_list(head:Option<Box<ListNode>>)->Option<Box<ListNode>>{fn len(h:&Option<Box<ListNode>>)->usize{let(mut n,mut p)=(0,h.as_ref());while let Some(x)=p{n+=1;p=x.next.as_ref()}n}fn split(mut h:Option<Box<ListNode>>,n:usize)->(Option<Box<ListNode>>,Option<Box<ListNode>>){if n==0{return(None,h)}let mut p=&mut h;for _ in 1..n{p=&mut p.as_mut().unwrap().next}let r=p.as_mut().unwrap().next.take();(h,r)}fn merge(a:Option<Box<ListNode>>,b:Option<Box<ListNode>>)->Option<Box<ListNode>>{match(a,b){(None,x)|(x,None)=>x,(Some(mut x),Some(mut y))=>if x.val<=y.val{x.next=merge(x.next.take(),Some(y));Some(x)}else{y.next=merge(Some(x),y.next.take());Some(y)}}}fn sort(h:Option<Box<ListNode>>)->Option<Box<ListNode>>{let n=len(&h);if n<2{return h}let(a,b)=split(h,n/2);merge(sort(a),sort(b))}sort(head)}}

Go
~~

.. code-block:: go

   func sortList(h *ListNode)*ListNode{if h==nil||h.Next==nil{return h};slow,fast:=h,h.Next;for fast!=nil&&fast.Next!=nil{slow=slow.Next;fast=fast.Next.Next};r:=slow.Next;slow.Next=nil;a,b:=sortList(h),sortList(r);d:=&ListNode{};t:=d;for a!=nil&&b!=nil{if a.Val<=b.Val{t.Next=a;a=a.Next}else{t.Next=b;b=b.Next};t=t.Next};if a!=nil{t.Next=a}else{t.Next=b};return d.Next}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sortList(h:ListNode|null):ListNode|null{if(!h||!h.next)return h;let slow=h,fast=h.next;while(fast&&fast.next){slow=slow.next!;fast=fast.next.next;}const r=slow.next;slow.next=null;let a=sortList(h),b=sortList(r),d=new ListNode(),t=d;while(a&&b){if(a.val<=b.val){t.next=a;a=a.next}else{t.next=b;b=b.next}t=t.next}t.next=a||b;return d.next;}

C#
~~

.. code-block:: csharp

   public class Solution {public ListNode SortList(ListNode h){if(h==null||h.next==null)return h;var slow=h;var fast=h.next;while(fast!=null&&fast.next!=null){slow=slow.next;fast=fast.next.next;}var r=slow.next;slow.next=null;return Merge(SortList(h),SortList(r));}ListNode Merge(ListNode a,ListNode b){var d=new ListNode();var t=d;while(a!=null&&b!=null){if(a.val<=b.val){t.next=a;a=a.next;}else{t.next=b;b=b.next;}t=t.next;}t.next=a??b;return d.next;}}

Julia
~~~~~

.. code-block:: julia

   function sort_list(h)
       (h===nothing||h.next===nothing)&&return h;slow=h;fast=h.next
       while fast!==nothing&&fast.next!==nothing;slow=slow.next;fast=fast.next.next;end
       r=slow.next;slow.next=nothing;a=sort_list(h);b=sort_list(r);d=ListNode(0,nothing);t=d
       while a!==nothing&&b!==nothing;if a.val<=b.val;t.next=a;a=a.next;else;t.next=b;b=b.next;end;t=t.next;end
       t.next=a===nothing ? b : a;d.next
   end

R
~

.. code-block:: r

   sort_list <- function(h){if(is.null(h)||is.null(h$next))return(h);slow<-h;fast<-h$next;while(!is.null(fast)&&!is.null(fast$next)){slow<-slow$next;fast<-fast$next$next};r<-slow$next;slow$next<-NULL;a<-sort_list(h);b<-sort_list(r);d<-new.env();d$next<-NULL;t<-d;while(!is.null(a)&&!is.null(b)){if(a$val<=b$val){t$next<-a;a<-a$next}else{t$next<-b;b<-b$next};t<-t$next};t$next<-if(is.null(a))b else a;d$next}