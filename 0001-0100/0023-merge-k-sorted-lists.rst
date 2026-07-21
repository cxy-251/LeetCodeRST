0023. Merge k Sorted Lists
==========================

题目信息
--------

:题号: 0023
:难度: Hard
:主题: 单链表、最小堆、K 路归并、分治
:原题: `LeetCode 0023 <https://leetcode.com/problems/merge-k-sorted-lists/>`_
:教学重点: 当前头节点候选集、堆顶全局最小性、后继入堆、归并树、总节点数复杂度

题目重述
--------

给定 ``k`` 条按非递减顺序排列的单链表，合并全部节点并返回一条非递减链表。主解法复用输入节点。设总节点数为
``N``，空链表不进入候选集合。

自建示例
--------

.. code-block:: text

   L0: 1 -> 4 -> 7
   L1: 2 -> 5 -> 8
   L2: 3 -> 6 -> 9
   初始候选: 1, 2, 3
   弹出顺序: 1, 2, 3, 4, 5, 6, 7, 8, 9

包含空链表时只加入非空头节点；相等值可按任意来源顺序输出，题目只要求值有序。

C++ 实现
--------

.. code-block:: cpp

   #include <queue>
   #include <vector>

   class Solution {
   private:
       ListNode* mergeTwo(ListNode* a, ListNode* b) {
           ListNode dummy(0);
           ListNode* tail = &dummy;
           while (a != nullptr && b != nullptr) {
               if (a->val <= b->val) { tail->next = a; a = a->next; }
               else { tail->next = b; b = b->next; }
               tail = tail->next;
           }
           tail->next = a != nullptr ? a : b;
           return dummy.next;
       }

       ListNode* sequential(std::vector<ListNode*> lists) {
           ListNode* merged = nullptr;
           for (ListNode* head : lists) merged = mergeTwo(merged, head);
           return merged;
       }

       ListNode* divideAndConquer(std::vector<ListNode*> lists) {
           if (lists.empty()) return nullptr;
           for (int interval = 1; interval < static_cast<int>(lists.size()); interval *= 2) {
               for (int i = 0; i + interval < static_cast<int>(lists.size()); i += 2 * interval) {
                   lists[i] = mergeTwo(lists[i], lists[i + interval]);
               }
           }
           return lists[0];
       }

       ListNode* heapMerge(const std::vector<ListNode*>& lists) {
           auto greater = [](ListNode* a, ListNode* b) { return a->val > b->val; };
           std::priority_queue<ListNode*, std::vector<ListNode*>, decltype(greater)> heap(greater);
           for (ListNode* head : lists) if (head != nullptr) heap.push(head);

           ListNode dummy(0);
           ListNode* tail = &dummy;
           while (!heap.empty()) {
               ListNode* node = heap.top();
               heap.pop();
               ListNode* next = node->next;
               tail->next = node;
               tail = node;
               if (next != nullptr) heap.push(next);
           }
           tail->next = nullptr;
           return dummy.next;
       }

   public:
       ListNode* mergeKLists(std::vector<ListNode*>& lists) {
           return heapMerge(lists);
       }
   };

题解
----

顺序两两归并为什么会重复搬运早期节点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

先合并前两条，再把结果与第三条合并，会让早期进入结果的节点在后续每次归并中再次被扫描。链表长度相近时，最坏
时间可接近 ``O(Nk)``。

归并树如何让每个节点只经历对数层
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

把链表两两配对形成归并树，每层所有归并处理的节点总数为 ``N``，层数为 ``ceil(log2 k)``，因此时间为
``O(N log k)``。它直接复用 0021 的双路归并。

为什么全局下一个节点只需在 k 个表头中寻找
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每条链表内部有序，尚未输出部分的最小值必然是当前头节点。任何更深节点都不小于本链表头，所以全局最小未处理
节点一定属于最多 ``k`` 个当前头节点。最小堆正好维护这个候选集合。

堆顶弹出与后继入堆如何恢复候选覆盖
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

弹出某条链表的头节点后，它的后继才成为该链表新的最小未处理节点。提前把后继放入堆没有必要；不把后继加入又会
失去该链表候选。每次弹出一个节点、加入至多一个后继，使每条未耗尽链表在堆中始终恰有一个候选。

主解法状态演化
~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 弹出
     - 加入后继
     - 堆中候选值
     - 结果尾部
   * - 1
     - 4
     - 2, 3, 4
     - 1
   * - 2
     - 5
     - 3, 4, 5
     - 2
   * - 3
     - 6
     - 4, 5, 6
     - 3
   * - 4
     - 7
     - 5, 6, 7
     - 4

为什么堆顶是全局最小未处理节点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

堆保存每条链表的最小未处理节点。任意未处理节点都不小于其所在链表的候选，而堆顶又不大于所有候选，因此没有
任何未处理节点小于堆顶。把堆顶追加到结果不会破坏非递减顺序。

节点链接与所有权
~~~~~~~~~~~~~~~~

在复用节点时先保存 ``next``，再把当前节点接到结果尾部，避免丢失原链表后缀。Rust 实现让堆只保存链表编号与
头值，实际节点仍在 ``lists[index]`` 中；弹出编号后用 ``take`` 取得节点所有权并放入结果。

复杂度来源
~~~~~~~~~~

每个节点恰好入堆、出堆一次，堆大小不超过 ``k``，时间 ``O(N log k)``，堆空间 ``O(k)``。分治方法时间相同；
顺序归并最坏 ``O(Nk)``。输出链表复用原节点，不计为额外空间。

九语言实现
----------

C
~

.. code-block:: c

   static void swap_node(struct ListNode** a, struct ListNode** b) { struct ListNode* t=*a; *a=*b; *b=t; }
   static void push(struct ListNode** h,int* n,struct ListNode* x) {
       int i=(*n)++; h[i]=x;
       while(i>0){int p=(i-1)/2;if(h[p]->val<=h[i]->val)break;swap_node(&h[p],&h[i]);i=p;}
   }
   static struct ListNode* pop(struct ListNode** h,int* n) {
       struct ListNode* root=h[0]; h[0]=h[--(*n)]; int i=0;
       for(;;){int l=2*i+1,r=l+1,s=i;if(l<*n&&h[l]->val<h[s]->val)s=l;if(r<*n&&h[r]->val<h[s]->val)s=r;if(s==i)break;swap_node(&h[i],&h[s]);i=s;}
       return root;
   }
   struct ListNode* mergeKLists(struct ListNode** lists,int k) {
       struct ListNode** heap=malloc((size_t)(k?k:1)*sizeof(*heap));int size=0;
       for(int i=0;i<k;++i)if(lists[i])push(heap,&size,lists[i]);
       struct ListNode dummy={0,NULL},*tail=&dummy;
       while(size){struct ListNode* x=pop(heap,&size);struct ListNode* next=x->next;tail->next=x;tail=x;if(next)push(heap,&size,next);}
       tail->next=NULL;free(heap);return dummy.next;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def mergeKLists(self, lists):
           import heapq
           heap = []
           for index, node in enumerate(lists):
               if node: heapq.heappush(heap, (node.val, index, node))
           dummy = tail = ListNode()
           while heap:
               _, index, node = heapq.heappop(heap)
               next_node = node.next
               tail.next = node; tail = node
               if next_node: heapq.heappush(heap, (next_node.val, index, next_node))
           tail.next = None
           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode mergeKLists(ListNode[] lists) {
           PriorityQueue<ListNode> heap=new PriorityQueue<>((a,b)->Integer.compare(a.val,b.val));
           for(ListNode node:lists) if(node!=null) heap.offer(node);
           ListNode dummy=new ListNode(0),tail=dummy;
           while(!heap.isEmpty()){ListNode node=heap.poll(),next=node.next;tail.next=node;tail=node;if(next!=null)heap.offer(next);}
           tail.next=null;return dummy.next;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn merge_k_lists(mut lists: Vec<Option<Box<ListNode>>>) -> Option<Box<ListNode>> {
           use std::cmp::Reverse; use std::collections::BinaryHeap;
           let mut heap: BinaryHeap<Reverse<(i32,usize)>>=BinaryHeap::new();
           for (i,node) in lists.iter().enumerate(){if let Some(x)=node.as_ref(){heap.push(Reverse((x.val,i)));}}
           let mut dummy=Box::new(ListNode::new(0)); let mut tail=&mut dummy;
           while let Some(Reverse((_,i)))=heap.pop(){
               let mut node=lists[i].take().unwrap(); lists[i]=node.next.take();
               if let Some(next)=lists[i].as_ref(){heap.push(Reverse((next.val,i)));}
               tail.next=Some(node); tail=tail.next.as_mut().unwrap();
           }
           dummy.next
       }
   }

Go
~~

.. code-block:: go

   type nodeHeap []*ListNode
   func (h nodeHeap) Len() int{return len(h)}; func(h nodeHeap)Less(i,j int)bool{return h[i].Val<h[j].Val}
   func(h nodeHeap)Swap(i,j int){h[i],h[j]=h[j],h[i]};func(h *nodeHeap)Push(x any){*h=append(*h,x.(*ListNode))}
   func(h *nodeHeap)Pop()any{old:=*h;n:=len(old);x:=old[n-1];*h=old[:n-1];return x}
   func mergeKLists(lists []*ListNode)*ListNode{
       h:=&nodeHeap{};heap.Init(h);for _,x:=range lists{if x!=nil{heap.Push(h,x)}}
       dummy:=&ListNode{};tail:=dummy
       for h.Len()>0{x:=heap.Pop(h).(*ListNode);next:=x.Next;tail.Next=x;tail=x;if next!=nil{heap.Push(h,next)}}
       tail.Next=nil;return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function mergeKLists(lists: Array<ListNode|null>): ListNode|null {
       const heap: ListNode[]=[];
       const push=(x:ListNode)=>{heap.push(x);for(let i=heap.length-1;i>0;){let p=(i-1)>>1;if(heap[p].val<=heap[i].val)break;[heap[p],heap[i]]=[heap[i],heap[p]];i=p;}};
       const pop=()=>{const root=heap[0],last=heap.pop()!;if(heap.length){heap[0]=last;for(let i=0;;){let l=i*2+1,r=l+1,s=i;if(l<heap.length&&heap[l].val<heap[s].val)s=l;if(r<heap.length&&heap[r].val<heap[s].val)s=r;if(s===i)break;[heap[i],heap[s]]=[heap[s],heap[i]];i=s;}}return root;};
       for(const x of lists)if(x)push(x);const dummy=new ListNode(),tailRef={node:dummy};
       while(heap.length){const x=pop(),next=x.next;tailRef.node.next=x;tailRef.node=x;if(next)push(next);}
       tailRef.node.next=null;return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode MergeKLists(ListNode[] lists) {
           var heap=new PriorityQueue<ListNode,int>();
           foreach(var x in lists) if(x!=null) heap.Enqueue(x,x.val);
           var dummy=new ListNode();var tail=dummy;
           while(heap.Count>0){var x=heap.Dequeue();var next=x.next;tail.next=x;tail=x;if(next!=null)heap.Enqueue(next,next.val);}
           tail.next=null;return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function merge_k_lists(lists)
       heap=Tuple{Int,Int}[]
       for (i,x) in pairs(lists); x!==nothing && push!(heap,(x.val,i)); end
       dummy=ListNode(0,nothing);tail=dummy
       while !isempty(heap)
           sort!(heap,by=first,rev=true);_,i=pop!(heap);x=lists[i];lists[i]=x.next
           tail.next=x;tail=x;lists[i]!==nothing && push!(heap,(lists[i].val,i))
       end
       tail.next=nothing;dummy.next
   end

R
~

.. code-block:: r

   merge_k_lists <- function(lists) {
       heap <- list()
       for (i in seq_along(lists)) if (!is.null(lists[[i]])) heap[[length(heap)+1L]] <- c(lists[[i]]$val,i)
       dummy <- new_list_node(0,NULL); tail <- dummy
       while (length(heap)>0L) {
           order_index <- which.min(vapply(heap,`[[`,numeric(1),1L)); entry <- heap[[order_index]]; heap[[order_index]] <- NULL
           i <- as.integer(entry[[2L]]); node <- lists[[i]]; lists[[i]] <- node$next; tail$next <- node; tail <- node
           if (!is.null(lists[[i]])) heap[[length(heap)+1L]] <- c(lists[[i]]$val,i)
       }
       tail$next <- NULL; dummy$next
   }
