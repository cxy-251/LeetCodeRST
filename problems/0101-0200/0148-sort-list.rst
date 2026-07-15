0148. Sort List
===============

题目信息
--------

:题号: 0148
:难度: Medium
:主题: 链表、归并排序、分治
:原题: `LeetCode 0148 <https://leetcode.com/problems/sort-list/>`_
:访问状态: Available
:教学重点: 快慢指针拆分、稳定合并、节点原地复用

题目重述
--------

给定单链表头节点，按节点值升序排列并返回新的头节点。排序过程需要达到 ``O(n log n)`` 时间；实现复用
原有节点，只改变 ``next`` 连接关系，不创建与输入规模同阶的新节点数组。

算法
----

链表不支持按下标随机访问，归并排序只需要顺序拆分和顺序合并，因此非常适合本题。

每层递归执行三步：

#. 用快慢指针找到中点，并把 ``slow.next`` 断开，得到两个互不重叠的子链表；
#. 递归排序左右子链表；
#. 用两个游标合并已排序链表，每次把较小节点接到结果尾部。

比较时使用 ``<=``，相等节点优先取左链表，因此排序保持稳定。合并过程复用原节点，不复制节点值。

正确性
~~~~~~

长度为零或一的链表已经有序，算法直接返回。

对长度大于一的链表，拆分得到两个长度严格更小且覆盖全部原节点的子链表。根据递归假设，两部分返回时分别
有序。合并阶段每次从两个当前首节点中选择较小者；任何未选择节点都不小于被接入节点，所以结果前缀始终有序。
当一侧耗尽时，另一侧本身有序且所有节点都不小于结果尾部，可以整体接入。最终结果有序，并且每个原节点恰好
出现一次。由归纳可知算法正确。

复杂度
~~~~~~

设节点数为 ``n``。递归深度 ``O(log n)``，每层拆分与合并总共扫描 ``O(n)`` 个节点，时间
``O(n log n)``。除递归调用栈外只保存常数个节点引用，算法额外空间 ``O(log n)``。节点本身被原地重连；
调用者持有的旧节点引用仍指向原对象，但其 ``next`` 拓扑会改变。Rust 的实现为拆分计算子链表长度，每层仍只
线性扫描一次，整体时间界不变。

核心语言实现
------------

C
~

.. code-block:: c

   static struct ListNode *merge_sorted(
       struct ListNode *left,
       struct ListNode *right
   ) {
       struct ListNode dummy = {0, NULL};
       struct ListNode *tail = &dummy;

       while (left != NULL && right != NULL) {
           if (left->val <= right->val) {
               tail->next = left;
               left = left->next;
           } else {
               tail->next = right;
               right = right->next;
           }
           tail = tail->next;
       }
       tail->next = left != NULL ? left : right;
       return dummy.next;
   }

   struct ListNode *sortList(struct ListNode *head) {
       if (head == NULL || head->next == NULL) {
           return head;
       }

       struct ListNode *slow = head;
       struct ListNode *fast = head->next;
       while (fast != NULL && fast->next != NULL) {
           slow = slow->next;
           fast = fast->next->next;
       }

       struct ListNode *right = slow->next;
       slow->next = NULL;

       struct ListNode *left_sorted = sortList(head);
       struct ListNode *right_sorted = sortList(right);
       return merge_sorted(left_sorted, right_sorted);
   }

C++
~~~

.. code-block:: cpp

   class Solution {
       static ListNode *mergeSorted(
           ListNode *left,
           ListNode *right
       ) {
           ListNode dummy;
           ListNode *tail = &dummy;

           while (left != nullptr && right != nullptr) {
               if (left->val <= right->val) {
                   tail->next = left;
                   left = left->next;
               } else {
                   tail->next = right;
                   right = right->next;
               }
               tail = tail->next;
           }
           tail->next = left != nullptr ? left : right;
           return dummy.next;
       }

   public:
       ListNode *sortList(ListNode *head) {
           if (head == nullptr || head->next == nullptr) {
               return head;
           }

           ListNode *slow = head;
           ListNode *fast = head->next;
           while (fast != nullptr && fast->next != nullptr) {
               slow = slow->next;
               fast = fast->next->next;
           }

           ListNode *right = slow->next;
           slow->next = nullptr;

           return mergeSorted(sortList(head), sortList(right));
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def sortList(
           self,
           head: Optional[ListNode],
       ) -> Optional[ListNode]:
           if head is None or head.next is None:
               return head

           slow = head
           fast = head.next
           while fast is not None and fast.next is not None:
               slow = slow.next
               fast = fast.next.next

           right = slow.next
           slow.next = None

           left_sorted = self.sortList(head)
           right_sorted = self.sortList(right)
           return self._merge(left_sorted, right_sorted)

       def _merge(
           self,
           left: Optional[ListNode],
           right: Optional[ListNode],
       ) -> Optional[ListNode]:
           dummy = ListNode()
           tail = dummy

           while left is not None and right is not None:
               if left.val <= right.val:
                   tail.next = left
                   left = left.next
               else:
                   tail.next = right
                   right = right.next
               tail = tail.next

           tail.next = left if left is not None else right
           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode sortList(ListNode head) {
           if (head == null || head.next == null) {
               return head;
           }

           ListNode slow = head;
           ListNode fast = head.next;
           while (fast != null && fast.next != null) {
               slow = slow.next;
               fast = fast.next.next;
           }

           ListNode right = slow.next;
           slow.next = null;

           return mergeSorted(sortList(head), sortList(right));
       }

       private ListNode mergeSorted(
           ListNode left,
           ListNode right
       ) {
           ListNode dummy = new ListNode();
           ListNode tail = dummy;

           while (left != null && right != null) {
               if (left.val <= right.val) {
                   tail.next = left;
                   left = left.next;
               } else {
                   tail.next = right;
                   right = right.next;
               }
               tail = tail.next;
           }
           tail.next = left != null ? left : right;
           return dummy.next;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn sort_list(
           head: Option<Box<ListNode>>,
       ) -> Option<Box<ListNode>> {
           fn length(head: &Option<Box<ListNode>>) -> usize {
               let mut count = 0;
               let mut current = head.as_ref();
               while let Some(node) = current {
                   count += 1;
                   current = node.next.as_ref();
               }
               count
           }

           fn split(
               mut head: Option<Box<ListNode>>,
               left_length: usize,
           ) -> (
               Option<Box<ListNode>>,
               Option<Box<ListNode>>,
           ) {
               let mut cursor = &mut head;
               for _ in 1..left_length {
                   cursor = &mut cursor.as_mut().unwrap().next;
               }
               let right = cursor.as_mut().unwrap().next.take();
               (head, right)
           }

           fn merge(
               mut left: Option<Box<ListNode>>,
               mut right: Option<Box<ListNode>>,
           ) -> Option<Box<ListNode>> {
               let mut dummy = Box::new(ListNode::new(0));
               let mut tail = &mut dummy;

               while left.is_some() && right.is_some() {
                   let take_left =
                       left.as_ref().unwrap().val
                           <= right.as_ref().unwrap().val;
                   let node = if take_left {
                       let mut current = left.take().unwrap();
                       left = current.next.take();
                       current
                   } else {
                       let mut current = right.take().unwrap();
                       right = current.next.take();
                       current
                   };

                   tail.next = Some(node);
                   tail = tail.next.as_mut().unwrap();
               }

               tail.next = if left.is_some() { left } else { right };
               dummy.next
           }

           fn sort(
               head: Option<Box<ListNode>>,
           ) -> Option<Box<ListNode>> {
               let n = length(&head);
               if n <= 1 {
                   return head;
               }

               let (left, right) = split(head, n / 2);
               merge(sort(left), sort(right))
           }

           sort(head)
       }
   }

Go
~~

.. code-block:: go

   func sortList(head *ListNode) *ListNode {
       if head == nil || head.Next == nil {
           return head
       }

       slow := head
       fast := head.Next
       for fast != nil && fast.Next != nil {
           slow = slow.Next
           fast = fast.Next.Next
       }

       right := slow.Next
       slow.Next = nil
       return mergeSorted(sortList(head), sortList(right))
   }

   func mergeSorted(left *ListNode, right *ListNode) *ListNode {
       dummy := &ListNode{}
       tail := dummy

       for left != nil && right != nil {
           if left.Val <= right.Val {
               tail.Next = left
               left = left.Next
           } else {
               tail.Next = right
               right = right.Next
           }
           tail = tail.Next
       }

       if left != nil {
           tail.Next = left
       } else {
           tail.Next = right
       }
       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sortList(head: ListNode | null): ListNode | null {
       if (head === null || head.next === null) {
           return head;
       }

       let slow: ListNode = head;
       let fast: ListNode | null = head.next;
       while (fast !== null && fast.next !== null) {
           slow = slow.next!;
           fast = fast.next.next;
       }

       const right = slow.next;
       slow.next = null;
       return mergeSorted(sortList(head), sortList(right));
   }

   function mergeSorted(
       left: ListNode | null,
       right: ListNode | null,
   ): ListNode | null {
       const dummy = new ListNode();
       let tail = dummy;

       while (left !== null && right !== null) {
           if (left.val <= right.val) {
               tail.next = left;
               left = left.next;
           } else {
               tail.next = right;
               right = right.next;
           }
           tail = tail.next;
       }
       tail.next = left !== null ? left : right;
       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode SortList(ListNode head) {
           if (head == null || head.next == null) {
               return head;
           }

           ListNode slow = head;
           ListNode fast = head.next;
           while (fast != null && fast.next != null) {
               slow = slow.next;
               fast = fast.next.next;
           }

           ListNode right = slow.next;
           slow.next = null;
           return MergeSorted(SortList(head), SortList(right));
       }

       private static ListNode MergeSorted(
           ListNode left,
           ListNode right
       ) {
           ListNode dummy = new ListNode();
           ListNode tail = dummy;

           while (left != null && right != null) {
               if (left.val <= right.val) {
                   tail.next = left;
                   left = left.next;
               } else {
                   tail.next = right;
                   right = right.next;
               }
               tail = tail.next;
           }
           tail.next = left ?? right;
           return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function sort_list(
       head::Union{Nothing,ListNode},
   )::Union{Nothing,ListNode}
       if head === nothing || head.next === nothing
           return head
       end

       slow = head
       fast = head.next
       while fast !== nothing && fast.next !== nothing
           slow = slow.next
           fast = fast.next.next
       end

       right = slow.next
       slow.next = nothing
       return merge_sorted(
           sort_list(head),
           sort_list(right),
       )
   end

   function merge_sorted(
       left::Union{Nothing,ListNode},
       right::Union{Nothing,ListNode},
   )::Union{Nothing,ListNode}
       dummy = ListNode(0)
       tail = dummy

       while left !== nothing && right !== nothing
           if left.val <= right.val
               tail.next = left
               left = left.next
           else
               tail.next = right
               right = right.next
           end
           tail = tail.next
       end

       tail.next = left === nothing ? right : left
       return dummy.next
   end

R
~

.. code-block:: r

   sort_list <- function(head) {
     if (is.null(head) || is.null(head$next)) return(head)

     slow <- head
     fast <- head$next
     while (!is.null(fast) && !is.null(fast$next)) {
       slow <- slow$next
       fast <- fast$next$next
     }

     right <- slow$next
     slow$next <- NULL
     merge_sorted(sort_list(head), sort_list(right))
   }

   merge_sorted <- function(left, right) {
     dummy <- new.env(parent = emptyenv())
     dummy$next <- NULL
     tail <- dummy

     while (!is.null(left) && !is.null(right)) {
       if (left$val <= right$val) {
         tail$next <- left
         left <- left$next
       } else {
         tail$next <- right
         right <- right$next
       }
       tail <- tail$next
     }

     tail$next <- if (!is.null(left)) left else right
     dummy$next
   }

关键边界
--------

* 空链表和单节点链表直接返回；
* 两节点拆分时必须让 ``fast`` 从第二个节点开始，保证左半不会包含全部节点；
* 断开 ``slow.next`` 后再递归，避免左右子问题仍共享同一条链；
* 合并相等值时优先取左侧，才能保持稳定；
* 排序复用所有输入节点，不能遗漏、复制或形成环。

验证
----

运行空链表、单节点、逆序、重复值、已排序和奇偶长度链表；Python、C、C++、Go 与 Java 结果一致，并检查输出
节点集合与输入节点身份集合相同。其余语言完成断链位置、空引用和节点所有权静态检查。

最小自检
--------

#. 为什么链表归并排序不需要随机访问？
#. 若拆分后忘记把 ``slow.next`` 置空，会发生什么？
#. 合并时使用 ``<`` 与 ``<=`` 对稳定性有什么影响？
