0023. Merge k Sorted Lists
==========================

题目信息
--------

:题号: 0023
:难度: Hard
:主题: 单链表、最小堆、K 路归并、分治
:原题: `LeetCode 0023 <https://leetcode.com/problems/merge-k-sorted-lists/>`_
:访问状态: Available
:教学重点: 候选头节点集合、堆不变量、节点复用、总节点数复杂度、K 路与双路归并关系

题目重述
--------

给定 ``k`` 条按非递减顺序排列的单链表，把所有节点合并为一条同样按非递减顺序排列的
链表并返回头节点。

设所有链表的节点总数为 ``N``。主解法使用最小堆保存每条尚未耗尽链表的当前头节点，每次
取出全局最小节点接到结果末尾，再把该节点原链表中的后继加入堆。

主解法复用输入节点，只重新连接 ``next``，不会为每个值创建新节点。

自建示例
--------

三路交错
~~~~~~~~

.. code-block:: text

   lists[0]：1 -> 4 -> 7
   lists[1]：2 -> 5 -> 8
   lists[2]：3 -> 6 -> 9

   初始堆候选：[1, 2, 3]
   依次弹出：1, 2, 3, 4, 5, 6, 7, 8, 9
   输出：1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9

包含空链表
~~~~~~~~~~

.. code-block:: text

   lists：[空, 1 -> 2, 空, 0 -> 3]
   初始堆只放入非空头节点 1 和 0
   输出：0 -> 1 -> 2 -> 3

相等值来自多条链表
~~~~~~~~~~~~~~~~~~

.. code-block:: text

   lists[0]：1 -> 1
   lists[1]：1
   lists[2]：1 -> 2
   输出值：1 -> 1 -> 1 -> 1 -> 2

题目只要求值有序。若堆比较只看节点值，相等节点之间的来源顺序可以任意。

只有一条链表
~~~~~~~~~~~~

.. code-block:: text

   lists：[2 -> 4 -> 6]
   输出：2 -> 4 -> 6

算法仍可执行；每次弹出一个节点后加入它的后继，堆大小始终不超过 1。

问题抽象
--------

每条链表内部有序，所以一条链表尚未输出节点中的最小值一定是它的当前头节点。全局下一个
最小节点因此只可能出现在最多 ``k`` 个当前头节点中。

问题可以抽象为重复执行：

#. 在所有非空链表的当前头节点中找最小值；
#. 输出该节点；
#. 用它的后继替换该链表的候选头节点。

若每次线性扫描 ``k`` 个头节点，时间复杂度为 ``O(Nk)``。最小堆把“找最小值”和“加入新
候选”都降为 ``O(log k)``，得到 ``O(N log k)``。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 当前头节点最小堆
     - ``O(N log k)``
     - ``O(k)``
     - 主解法；在线输出，候选集合语义直接
   * - 两两分治归并
     - ``O(N log k)``
     - ``O(log k)`` 递归栈或 ``O(1)`` 迭代状态
     - 复用 0021；常数小，适合强调归并树
   * - 每次扫描所有链表头
     - ``O(Nk)``
     - ``O(k)`` 或 ``O(1)``
     - 实现简单，``k`` 较大时重复比较过多
   * - 收集所有值后排序重建
     - ``O(N log N)``
     - ``O(N)``
     - 丢失每条输入链表已排序的信息，并创建不必要节点

主解法：最小堆维护当前头节点
----------------------------

状态含义
~~~~~~~~

算法维护：

* ``heap``：每条尚未耗尽链表至多一个当前头节点；
* ``dummy``：结果链表前的固定哑节点；
* ``tail``：结果链表最后一个已确认节点。

初始化时，把每条非空链表的头节点放入堆。之后重复：

.. code-block:: text

   node = 弹出堆顶最小节点
   next_node = node.next
   tail.next = node
   tail = node
   若 next_node 非空：压入堆

保存 ``next_node`` 或先把它从 ``node`` 中取出很重要，因为接入结果时会改写节点链接，不能
丢失原链表剩余部分。

为什么堆中每条链表只需一个节点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

一条链表内部有序。若当前头节点为 ``x``，它后面的任何节点都不小于 ``x``。在 ``x`` 尚未
输出前，后继不可能成为全局最小值，因此无需提前加入堆。

当 ``x`` 被弹出后，它的后继才成为该链表新的最小未处理节点。此时把后继加入堆，候选集合
重新覆盖所有尚未耗尽链表。

为什么堆顶是全局最小未处理节点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对每条非空链表，堆保存其最小未处理节点。任意未处理节点都位于某条链表中，并且不小于该
链表保存在堆中的头节点。

堆顶又是所有候选头节点中的最小者，所以没有任何未处理节点能比堆顶更小。把堆顶接到结果
尾部不会破坏有序性。

堆大小为什么不超过 ``k``
~~~~~~~~~~~~~~~~~~~~~~~~~~

每条链表在堆中至多贡献一个节点。弹出一个节点后，最多加入同一条链表的一个后继，所以堆中
候选数量始终等于尚未耗尽链表数，最大为 ``k``。

这也是每次堆操作为 ``O(log k)`` 而不是 ``O(log N)`` 的原因。

节点复用与链接安全
~~~~~~~~~~~~~~~~~~

主解法直接把弹出的节点接到结果链表。对拥有显式所有权的 Rust，应先执行：

.. code-block:: text

   next = node.next.take()
   把 node 接到结果
   把 next 加入堆

``take`` 让弹出节点暂时成为独立节点，避免一个节点同时通过原链表和结果链表被拥有。

对 C、C++、Java、Go 等引用或指针实现，可以先保存 ``next = node->next``，再把节点接到结果。
最终每个节点只出现一次，结果尾部链接会覆盖旧链接。为使终点明确，循环结束后可以设置
``tail.next = null``；在正确输入中最后节点原本也没有后继。

核心不变量
~~~~~~~~~~

每次弹出堆顶前：

* 结果链表从 ``dummy.next`` 到 ``tail`` 已经按非递减顺序排列；
* 结果恰好包含所有已弹出的节点，每个节点出现一次；
* 每条尚未耗尽链表的最小未处理节点恰好在堆中一次；
* 堆外的任何未处理节点都不小于其所在链表的堆中候选；
* ``tail`` 的值不大于堆中任何候选值；
* 堆大小不超过 ``k``。

正确性依据
~~~~~~~~~~

初始化时结果为空，每条非空链表的头节点进入堆。头节点是该链表最小节点，因此候选覆盖和
堆大小不变量成立。

假设某轮前不变量成立。堆顶是所有候选头节点中的最小值；每个其他未处理节点又不小于它所在
链表的候选，因此堆顶是全局最小未处理节点。把它接到结果尾部保持结果有序，也不会遗漏更小
节点。

弹出节点后，若它存在后继，该后继是原链表新的最小未处理节点，将其加入堆即可恢复候选覆盖；
若没有后继，该链表已经耗尽，不再需要候选。节点从堆转移到结果恰好一次，因此节点集合和
唯一性不变量保持。

堆为空时所有链表都已耗尽，否则某条非空链表应当仍有候选在堆中。于是所有 ``N`` 个节点都
已按全局非递减顺序接入结果，算法正确。

复杂度
~~~~~~

设链表数量为 ``k``，总节点数为 ``N``：

* 初始化最多压入 ``k`` 个头节点，时间为 ``O(k log k)``，也可用建堆降为 ``O(k)``；
* 每个节点恰好弹出一次，并且除各链表末节点外会触发一次后继压入；
* 堆大小始终不超过 ``k``，每次压入或弹出为 ``O(log k)``；
* 总时间复杂度为 ``O(N log k)``；
* 堆额外空间为 ``O(k)``，迭代结果链接只需 ``O(1)`` 其他指针；
* 当 ``k = 0`` 或 ``N = 0`` 时直接返回空链表。

核心语言实现
------------

以下实现默认平台提供 ``ListNode``。堆中只比较节点值；相等值无需稳定来源顺序。

C
~

.. code-block:: c

   #include <stdlib.h>

   static void heap_swap(struct ListNode** a, struct ListNode** b) {
       struct ListNode* temp = *a;
       *a = *b;
       *b = temp;
   }

   static void heap_push(
       struct ListNode** heap,
       int* size,
       struct ListNode* node
   ) {
       int index = (*size)++;
       heap[index] = node;

       while (index > 0) {
           int parent = (index - 1) / 2;
           if (heap[parent]->val <= heap[index]->val) {
               break;
           }
           heap_swap(&heap[parent], &heap[index]);
           index = parent;
       }
   }

   static struct ListNode* heap_pop(
       struct ListNode** heap,
       int* size
   ) {
       struct ListNode* root = heap[0];
       heap[0] = heap[--(*size)];
       int index = 0;

       while (1) {
           int left = index * 2 + 1;
           int right = left + 1;
           int smallest = index;

           if (left < *size &&
               heap[left]->val < heap[smallest]->val) {
               smallest = left;
           }
           if (right < *size &&
               heap[right]->val < heap[smallest]->val) {
               smallest = right;
           }
           if (smallest == index) {
               break;
           }
           heap_swap(&heap[index], &heap[smallest]);
           index = smallest;
       }
       return root;
   }

   struct ListNode* mergeKLists(
       struct ListNode** lists,
       int listsSize
   ) {
       if (listsSize == 0) {
           return NULL;
       }

       struct ListNode** heap = malloc(
           sizeof(struct ListNode*) * listsSize
       );
       int heap_size = 0;
       for (int i = 0; i < listsSize; ++i) {
           if (lists[i] != NULL) {
               heap_push(heap, &heap_size, lists[i]);
           }
       }

       struct ListNode dummy = {0, NULL};
       struct ListNode* tail = &dummy;

       while (heap_size > 0) {
           struct ListNode* node = heap_pop(heap, &heap_size);
           struct ListNode* next = node->next;
           tail->next = node;
           tail = node;

           if (next != NULL) {
               heap_push(heap, &heap_size, next);
           }
       }

       tail->next = NULL;
       free(heap);
       return dummy.next;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode* mergeKLists(vector<ListNode*>& lists) {
           auto greater_node = [](ListNode* left, ListNode* right) {
               return left->val > right->val;
           };
           priority_queue<
               ListNode*,
               vector<ListNode*>,
               decltype(greater_node)
           > heap(greater_node);

           for (ListNode* head : lists) {
               if (head != nullptr) {
                   heap.push(head);
               }
           }

           ListNode dummy(0);
           ListNode* tail = &dummy;
           while (!heap.empty()) {
               ListNode* node = heap.top();
               heap.pop();
               ListNode* next = node->next;

               tail->next = node;
               tail = node;
               if (next != nullptr) {
                   heap.push(next);
               }
           }

           tail->next = nullptr;
           return dummy.next;
       }
   };

Python
~~~~~~

.. code-block:: python

   import heapq
   from typing import Optional


   class Solution:
       def mergeKLists(
           self,
           lists: list[Optional[ListNode]],
       ) -> Optional[ListNode]:
           heap: list[tuple[int, int, ListNode]] = []
           serial = 0

           for head in lists:
               if head is not None:
                   # serial 避免值相等时让 heapq 比较 ListNode 对象。
                   heapq.heappush(heap, (head.val, serial, head))
                   serial += 1

           dummy = ListNode()
           tail = dummy
           while heap:
               _, _, node = heapq.heappop(heap)
               next_node = node.next
               tail.next = node
               tail = node

               if next_node is not None:
                   heapq.heappush(
                       heap,
                       (next_node.val, serial, next_node),
                   )
                   serial += 1

           tail.next = None
           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode mergeKLists(ListNode[] lists) {
           PriorityQueue<ListNode> heap = new PriorityQueue<>(
               (left, right) -> Integer.compare(left.val, right.val)
           );

           for (ListNode head : lists) {
               if (head != null) {
                   heap.offer(head);
               }
           }

           ListNode dummy = new ListNode(0);
           ListNode tail = dummy;
           while (!heap.isEmpty()) {
               ListNode node = heap.poll();
               ListNode next = node.next;
               tail.next = node;
               tail = node;

               if (next != null) {
                   heap.offer(next);
               }
           }

           tail.next = null;
           return dummy.next;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       fn heap_push(heap: &mut Vec<Box<ListNode>>, node: Box<ListNode>) {
           heap.push(node);
           let mut index = heap.len() - 1;

           while index > 0 {
               let parent = (index - 1) / 2;
               if heap[parent].val <= heap[index].val {
                   break;
               }
               heap.swap(parent, index);
               index = parent;
           }
       }

       fn heap_pop(heap: &mut Vec<Box<ListNode>>) -> Box<ListNode> {
           let last = heap.pop().unwrap();
           if heap.is_empty() {
               return last;
           }

           let root = std::mem::replace(&mut heap[0], last);
           let mut index = 0;
           loop {
               let left = index * 2 + 1;
               let right = left + 1;
               let mut smallest = index;

               if left < heap.len() &&
                   heap[left].val < heap[smallest].val {
                   smallest = left;
               }
               if right < heap.len() &&
                   heap[right].val < heap[smallest].val {
                   smallest = right;
               }
               if smallest == index {
                   break;
               }
               heap.swap(index, smallest);
               index = smallest;
           }
           root
       }

       pub fn merge_k_lists(
           lists: Vec<Option<Box<ListNode>>>,
       ) -> Option<Box<ListNode>> {
           let mut heap: Vec<Box<ListNode>> = Vec::new();
           for node in lists.into_iter().flatten() {
               Self::heap_push(&mut heap, node);
           }

           let mut dummy = Box::new(ListNode::new(0));
           let mut tail = &mut dummy;

           while !heap.is_empty() {
               let mut node = Self::heap_pop(&mut heap);
               let next = node.next.take();
               tail.next = Some(node);
               tail = tail.next.as_mut().unwrap();

               if let Some(next_node) = next {
                   Self::heap_push(&mut heap, next_node);
               }
           }

           dummy.next
       }
   }

Go
~~

.. code-block:: go

   import "container/heap"

   type nodeHeap []*ListNode

   func (heap nodeHeap) Len() int { return len(heap) }
   func (heap nodeHeap) Less(i int, j int) bool {
       return heap[i].Val < heap[j].Val
   }
   func (heap nodeHeap) Swap(i int, j int) {
       heap[i], heap[j] = heap[j], heap[i]
   }
   func (heap *nodeHeap) Push(value any) {
       *heap = append(*heap, value.(*ListNode))
   }
   func (heap *nodeHeap) Pop() any {
       old := *heap
       last := old[len(old)-1]
       *heap = old[:len(old)-1]
       return last
   }

   func mergeKLists(lists []*ListNode) *ListNode {
       candidates := &nodeHeap{}
       heap.Init(candidates)
       for _, head := range lists {
           if head != nil {
               heap.Push(candidates, head)
           }
       }

       dummy := &ListNode{}
       tail := dummy
       for candidates.Len() > 0 {
           node := heap.Pop(candidates).(*ListNode)
           next := node.Next
           tail.Next = node
           tail = node

           if next != nil {
               heap.Push(candidates, next)
           }
       }

       tail.Next = nil
       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
       const heap: ListNode[] = [];

       function push(node: ListNode): void {
           heap.push(node);
           let index = heap.length - 1;
           while (index > 0) {
               const parent = Math.floor((index - 1) / 2);
               if (heap[parent].val <= heap[index].val) {
                   break;
               }
               [heap[parent], heap[index]] = [heap[index], heap[parent]];
               index = parent;
           }
       }

       function pop(): ListNode {
           const root = heap[0];
           const last = heap.pop()!;
           if (heap.length > 0) {
               heap[0] = last;
               let index = 0;
               while (true) {
                   const left = index * 2 + 1;
                   const right = left + 1;
                   let smallest = index;

                   if (left < heap.length &&
                       heap[left].val < heap[smallest].val) {
                       smallest = left;
                   }
                   if (right < heap.length &&
                       heap[right].val < heap[smallest].val) {
                       smallest = right;
                   }
                   if (smallest === index) {
                       break;
                   }
                   [heap[index], heap[smallest]] =
                       [heap[smallest], heap[index]];
                   index = smallest;
               }
           }
           return root;
       }

       for (const head of lists) {
           if (head !== null) {
               push(head);
           }
       }

       const dummy = new ListNode();
       let tail = dummy;
       while (heap.length > 0) {
           const node = pop();
           const next = node.next;
           tail.next = node;
           tail = node;
           if (next !== null) {
               push(next);
           }
       }

       tail.next = null;
       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode MergeKLists(ListNode[] lists) {
           var heap = new PriorityQueue<ListNode, int>();
           foreach (ListNode head in lists) {
               if (head != null) {
                   heap.Enqueue(head, head.val);
               }
           }

           ListNode dummy = new ListNode();
           ListNode tail = dummy;
           while (heap.Count > 0) {
               ListNode node = heap.Dequeue();
               ListNode next = node.next;
               tail.next = node;
               tail = node;

               if (next != null) {
                   heap.Enqueue(next, next.val);
               }
           }

           tail.next = null;
           return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function merge_k_lists(lists)
       heap = Any[]

       function heap_push!(node)
           push!(heap, node)
           index = length(heap)
           while index > 1
               parent = index ÷ 2
               heap[parent].val <= heap[index].val && break
               heap[parent], heap[index] = heap[index], heap[parent]
               index = parent
           end
       end

       function heap_pop!()
           root = heap[1]
           last = pop!(heap)
           if !isempty(heap)
               heap[1] = last
               index = 1
               while true
                   left = index * 2
                   right = left + 1
                   smallest = index
                   if left <= length(heap) &&
                      heap[left].val < heap[smallest].val
                       smallest = left
                   end
                   if right <= length(heap) &&
                      heap[right].val < heap[smallest].val
                       smallest = right
                   end
                   smallest == index && break
                   heap[index], heap[smallest] = heap[smallest], heap[index]
                   index = smallest
               end
           end
           return root
       end

       for head in lists
           head !== nothing && heap_push!(head)
       end

       dummy = ListNode(0, nothing)
       tail = dummy
       while !isempty(heap)
           node = heap_pop!()
           next_node = node.next
           tail.next = node
           tail = node
           next_node !== nothing && heap_push!(next_node)
       end

       tail.next = nothing
       return dummy.next
   end

R
~

.. code-block:: r

   mergeKLists <- function(lists) {
       heap <- list()

       heap_push <- function(node) {
           heap[[length(heap) + 1]] <<- node
           index <- length(heap)
           while (index > 1) {
               parent <- index %/% 2
               if (heap[[parent]]$val <= heap[[index]]$val) break
               temp <- heap[[parent]]
               heap[[parent]] <<- heap[[index]]
               heap[[index]] <<- temp
               index <- parent
           }
       }

       heap_pop <- function() {
           root <- heap[[1]]
           last <- heap[[length(heap)]]
           heap[[length(heap)]] <<- NULL
           if (length(heap) > 0) {
               heap[[1]] <<- last
               index <- 1
               repeat {
                   left <- index * 2
                   right <- left + 1
                   smallest <- index
                   if (left <= length(heap) &&
                       heap[[left]]$val < heap[[smallest]]$val) {
                       smallest <- left
                   }
                   if (right <= length(heap) &&
                       heap[[right]]$val < heap[[smallest]]$val) {
                       smallest <- right
                   }
                   if (smallest == index) break
                   temp <- heap[[index]]
                   heap[[index]] <<- heap[[smallest]]
                   heap[[smallest]] <<- temp
                   index <- smallest
               }
           }
           root
       }

       for (head in lists) {
           if (!is.null(head)) heap_push(head)
       }

       dummy <- new_list_node(0)
       tail <- dummy
       while (length(heap) > 0) {
           node <- heap_pop()
           next_node <- node$next
           tail$next <- node
           tail <- node
           if (!is.null(next_node)) heap_push(next_node)
       }

       tail$next <- NULL
       dummy$next
   }

关键边界与易错点
----------------

* 初始化时只能压入非空头节点，不能把 ``null`` 放入比较堆；
* 堆中每条链表只保留当前头节点，提前压入整条链表会增加空间且破坏候选语义；
* 弹出节点后必须保存或取出 ``next``，再改写结果链接；
* Python 堆元素需要额外序号，避免值相等时比较没有顺序定义的 ``ListNode``；
* C/C++/Java 比较整数值时应使用安全比较，Java 不要用 ``left.val - right.val`` 防止溢出；
* Rust 不能把借用的节点放进结果，应移动 ``Box<ListNode>`` 所有权并用 ``take`` 分离后继；
* 堆操作复杂度是 ``O(log k)``，因为堆大小受链表数限制，不是总节点数；
* ``k = 0``、所有链表为空、只有一条链表都应自然得到正确结果；
* 若使用分治替代方案，必须保证每层链表两两归并且每个节点每层只处理一次。

新增与强化知识
--------------

新增
~~~~

* **K 路候选头集合**：每条有序来源只暴露当前最小未处理元素；
* **最小堆归并不变量**：堆顶是所有未处理节点的全局最小值；
* **总节点数分析**：用 ``N`` 表示所有链表节点总数，避免误写成 ``k*n``；
* **堆大小界限**：每条链表至多一个候选，因此额外空间为 ``O(k)``。

强化
~~~~

* 0021 的哑节点、尾指针和节点复用继续用于结果链表；
* 0004 的多有序来源思想在这里变成显式 K 路归并；
* Rust 的 ``Option<Box<ListNode>>`` 再次要求明确移动节点和后继所有权；
* 自定义二叉堆使用父子下标和局部交换维持完全二叉树顺序。

关联题目
--------

* `0021. Merge Two Sorted Lists <0021-merge-two-sorted-lists.rst>`_：K 路归并的双路基础；
* `0002. Add Two Numbers <0002-add-two-numbers.rst>`_：使用哑节点和尾指针构造链表结果；
* `0019. Remove Nth Node From End of List <0019-remove-nth-node-from-end-of-list.rst>`_：
  继续训练单链表链接与所有权处理。

最小自检
--------

#. 为什么全局最小未处理节点一定在各链表当前头节点中？
#. 一条链表的后继为什么要等当前头节点弹出后才进入堆？
#. 为什么时间复杂度是 ``O(N log k)``，不是 ``O(N log N)``？
#. Python 堆中的 ``serial`` 解决了什么问题？
#. Rust 实现为什么在把节点接入结果前执行 ``node.next.take()``？

答案要点
~~~~~~~~

#. 每条链表有序，任何后继都不小于它的当前头节点；
#. 当前头未输出前，后继不可能优先于它成为全局最小值；
#. 每个节点执行常数次堆操作，堆大小始终不超过链表数量 ``k``；
#. 值相等时元组继续比较第二项，避免比较不支持大小关系的节点对象；
#. 它把后继所有权从当前节点移出，使当前节点可独立进入结果，后继再作为新候选进入堆。