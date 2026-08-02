0021. Merge Two Sorted Lists
============================

题目信息
--------

:题号: 0021
:难度: Easy
:主题: 链表、归并、递归、双指针
:原题: `LeetCode 0021 <https://leetcode.com/problems/merge-two-sorted-lists/>`_
:重点: 两条非递减链表、保持全部节点值、返回有序结果头节点

题目重述
--------

给定两个分别按非递减顺序排列的单链表 ``list1`` 和 ``list2``，将两条链表中的全部节点值合并为一条同样按非递减顺序排列的链表，并返回结果链表的头节点。

两条链表的节点总数位于 ``[0, 50]``，每个节点值位于 ``[-100, 100]``。任一输入链表都可能为空；两个当前节点值相等时，它们在结果中的先后顺序不作要求。结果通过重新连接两条输入链表中的原节点得到，不要求复制节点。

自建示例
--------

包含重复值：

.. code-block:: text

   输入：list1 = [1, 3, 5], list2 = [1, 2, 6]
   输出：[1, 1, 2, 3, 5, 6]
   解释：结果保留两条链表中的全部节点值，并按非递减顺序排列。

一条链表为空：

.. code-block:: text

   输入：list1 = [], list2 = [-2, 0, 4]
   输出：[-2, 0, 4]
   解释：没有另一条链表需要合并，结果与非空链表相同。

两条链表都为空：

.. code-block:: text

   输入：list1 = [], list2 = []
   输出：[]
   解释：输入中没有节点，返回空链表。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       ListNode* recursiveMerge(ListNode* a, ListNode* b) {
           if (a == nullptr) return b;
           if (b == nullptr) return a;
           if (a->val <= b->val) {
               a->next = recursiveMerge(a->next, b);
               return a;
           }
           b->next = recursiveMerge(a, b->next);
           return b;
       }

       ListNode* iterativeMerge(ListNode* a, ListNode* b) {
           ListNode dummy(0);
           ListNode* tail = &dummy;
           while (a != nullptr && b != nullptr) {
               if (a->val <= b->val) {
                   tail->next = a;
                   a = a->next;
               } else {
                   tail->next = b;
                   b = b->next;
               }
               tail = tail->next;
           }
           tail->next = a != nullptr ? a : b;
           return dummy.next;
       }

       ListNode* copyValues(ListNode* a, ListNode* b) {
           ListNode dummy(0);
           ListNode* tail = &dummy;
           while (a != nullptr || b != nullptr) {
               int value;
               if (b == nullptr || (a != nullptr && a->val <= b->val)) {
                   value = a->val;
                   a = a->next;
               } else {
                   value = b->val;
                   b = b->next;
               }
               tail->next = new ListNode(value);
               tail = tail->next;
           }
           return dummy.next;
       }

   public:
       ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
           return iterativeMerge(list1, list2);
       }
   };

题解
----

为什么全局最小未处理节点只可能位于两个表头
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每条链表内部已经有序，因此一条链表尚未处理部分的最小值就是当前头节点。所有未处理节点的最小值只能是
``list1`` 与 ``list2`` 两个头节点中的较小者。选择它以后，只需推进对应链表，问题重新变成同样的两路归并。

递归如何把首节点选择交给更小后缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

递归方法先确定结果首节点。若 ``a.val <= b.val``，则 ``a`` 必须排在最前面，剩余部分是
``merge(a.next, b)``；另一种情况完全对称。递归表达直接，但调用栈最深可达 ``m+n``。

虚拟头节点如何统一第一次与后续追加
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

迭代方法令 ``tail`` 初始指向虚拟节点。无论当前选择哪一条链表的头节点，都执行
``tail.next = chosen``，再推进 ``tail``。这样结果头节点无需单独分支，最终返回 ``dummy.next``。

主解法状态演化
~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - ``a`` 头
     - ``b`` 头
     - 选择
     - 结果前缀
   * - 1(a)
     - 1(b)
     - 1(a)
     - 1(a)
   * - 3
     - 1(b)
     - 1(b)
     - 1(a), 1(b)
   * - 3
     - 2
     - 2
     - 1(a), 1(b), 2
   * - 3
     - 6
     - 3
     - 1(a), 1(b), 2, 3

为什么剩余链表可以一次接入
~~~~~~~~~~~~~~~~~~~~~~~~~~

循环结束时至少一条链表为空。另一条链表的剩余部分本身有序，并且其头节点不小于结果尾节点；否则它应在上一轮
被选择。因此直接令 ``tail.next`` 指向剩余链表不会破坏顺序，也不会遗漏节点。

为什么节点复用不会丢失或复制节点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每轮只把一个当前头节点从输入前缀转移到结果尾部，并在改写链接前推进原输入指针。已接入节点与两条未处理后缀
始终构成原节点集合的互斥划分。循环结束后整体接入唯一剩余后缀，因此每个节点恰好出现一次。

解法取舍与复杂度
~~~~~~~~~~~~~~~~

递归与迭代都执行 ``O(m+n)`` 次节点选择。递归需要 ``O(m+n)`` 栈空间；迭代只用 ``O(1)`` 指针。新建节点版本
同样是 ``O(m+n)`` 时间，却额外分配 ``O(m+n)`` 节点并失去对象身份，所以标准入口选择迭代复用节点。

九语言实现
----------

C
~

.. code-block:: c

   struct ListNode* mergeTwoLists(struct ListNode* a, struct ListNode* b) {
       struct ListNode dummy = {0, NULL};
       struct ListNode* tail = &dummy;
       while (a != NULL && b != NULL) {
           if (a->val <= b->val) { tail->next = a; a = a->next; }
           else { tail->next = b; b = b->next; }
           tail = tail->next;
       }
       tail->next = a != NULL ? a : b;
       return dummy.next;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def mergeTwoLists(self, a, b):
           dummy = ListNode()
           tail = dummy
           while a and b:
               if a.val <= b.val:
                   tail.next, a = a, a.next
               else:
                   tail.next, b = b, b.next
               tail = tail.next
           tail.next = a or b
           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode mergeTwoLists(ListNode a, ListNode b) {
           ListNode dummy = new ListNode(0), tail = dummy;
           while (a != null && b != null) {
               if (a.val <= b.val) { tail.next = a; a = a.next; }
               else { tail.next = b; b = b.next; }
               tail = tail.next;
           }
           tail.next = a != null ? a : b;
           return dummy.next;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn merge_two_lists(a: Option<Box<ListNode>>, b: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
           match (a, b) {
               (None, x) | (x, None) => x,
               (Some(mut x), Some(mut y)) => {
                   if x.val <= y.val {
                       x.next = Self::merge_two_lists(x.next.take(), Some(y)); Some(x)
                   } else {
                       y.next = Self::merge_two_lists(Some(x), y.next.take()); Some(y)
                   }
               }
           }
       }
   }

Go
~~

.. code-block:: go

   func mergeTwoLists(a, b *ListNode) *ListNode {
       dummy := &ListNode{}
       tail := dummy
       for a != nil && b != nil {
           if a.Val <= b.Val { tail.Next = a; a = a.Next } else { tail.Next = b; b = b.Next }
           tail = tail.Next
       }
       if a != nil { tail.Next = a } else { tail.Next = b }
       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function mergeTwoLists(a: ListNode | null, b: ListNode | null): ListNode | null {
       const dummy = new ListNode();
       let tail = dummy;
       while (a !== null && b !== null) {
           if (a.val <= b.val) { tail.next = a; a = a.next; }
           else { tail.next = b; b = b.next; }
           tail = tail.next;
       }
       tail.next = a ?? b;
       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode MergeTwoLists(ListNode a, ListNode b) {
           var dummy = new ListNode();
           var tail = dummy;
           while (a != null && b != null) {
               if (a.val <= b.val) { tail.next = a; a = a.next; }
               else { tail.next = b; b = b.next; }
               tail = tail.next;
           }
           tail.next = a ?? b;
           return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function merge_two_lists(a, b)
       dummy = ListNode(0, nothing)
       tail = dummy
       while a !== nothing && b !== nothing
           if a.val <= b.val; tail.next = a; a = a.next
           else; tail.next = b; b = b.next; end
           tail = tail.next
       end
       tail.next = a === nothing ? b : a
       dummy.next
   end

R
~

.. code-block:: r

   merge_two_lists <- function(a, b) {
       dummy <- new_list_node(0, NULL)
       tail <- dummy
       while (!is.null(a) && !is.null(b)) {
           if (a$val <= b$val) { tail$next <- a; a <- a$next }
           else { tail$next <- b; b <- b$next }
           tail <- tail$next
       }
       tail$next <- if (is.null(a)) b else a
       dummy$next
   }
