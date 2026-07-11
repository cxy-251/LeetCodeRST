0021. Merge Two Sorted Lists
============================

题目信息
--------

:题号: 0021
:难度: Easy
:主题: 单链表、双指针、哑节点、稳定归并
:原题: `LeetCode 0021 <https://leetcode.com/problems/merge-two-sorted-lists/>`_
:访问状态: Available
:教学重点: 头节点比较、尾指针追加、复用原节点、剩余链表整体接入

题目重述
--------

给定两个按非递减顺序排列的单链表 ``list1`` 和 ``list2``，把它们合并成一条同样按
非递减顺序排列的链表并返回头节点。

主解法直接复用输入链表中的节点，只改写 ``next`` 链接，不为每个值重新分配节点。
当两个当前节点值相等时，本文优先选择 ``list1``，使相等元素保持稳定的来源顺序。

自建示例
--------

普通交错
~~~~~~~~

.. code-block:: text

   list1：1 -> 3 -> 6
   list2：2 -> 4 -> 5
   输出： 1 -> 2 -> 3 -> 4 -> 5 -> 6

包含相等值
~~~~~~~~~~

.. code-block:: text

   list1：1(a) -> 2(a) -> 4
   list2：1(b) -> 2(b) -> 3
   输出： 1(a) -> 1(b) -> 2(a) -> 2(b) -> 3 -> 4

其中括号只用于说明节点来源。使用 ``<=`` 时，相等值先取 ``list1``，归并是稳定的。

一个链表为空
~~~~~~~~~~~~

.. code-block:: text

   list1：空
   list2：0 -> 7
   输出： 0 -> 7

无需进入比较循环，可以直接返回非空链表。

长度差异明显
~~~~~~~~~~~~

.. code-block:: text

   list1：1
   list2：2 -> 3 -> 4 -> 5

   比较一次后 list1 耗尽，剩余的 2 -> 3 -> 4 -> 5 可整体接到结果尾部。

问题抽象
--------

每个输入链表内部已经有序。设两个尚未处理的链表头分别为 ``p1`` 和 ``p2``，那么所有
未处理节点中的最小值一定是 ``p1.val`` 与 ``p2.val`` 中较小的一个。

因此每一步只需要：

#. 比较两个当前头节点；
#. 把较小节点接到结果链表末尾；
#. 让对应输入指针前进一步；
#. 让结果尾指针移动到刚接入的节点。

这与归并排序的“合并两个有序序列”阶段完全相同，只是数组下标改成了链表指针。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 迭代归并并复用节点
     - ``O(m + n)``
     - ``O(1)``
     - 主解法；状态直接、无递归栈、避免逐节点重新分配
   * - 递归归并
     - ``O(m + n)``
     - ``O(m + n)`` 递归栈
     - 代码短，但长链表会增加调用栈压力
   * - 收集值、排序、重建链表
     - ``O((m+n) log(m+n))``
     - ``O(m+n)``
     - 丢失输入已排序信息，也产生不必要的新节点

主解法：迭代稳定归并
--------------------

状态含义
~~~~~~~~

算法维护四个位置：

* ``list1``：第一条链表尚未处理部分的头节点；
* ``list2``：第二条链表尚未处理部分的头节点；
* ``dummy``：固定的哑节点，不属于最终数据，只用于统一结果头节点处理；
* ``tail``：结果链表的最后一个已确认节点。

初始时 ``tail`` 指向 ``dummy``。每次选择一个节点后执行：

.. code-block:: text

   tail.next = chosen
   tail = chosen

然后把 ``chosen`` 所属链表的头指针移动到后继节点。

为什么哑节点有用
~~~~~~~~~~~~~~~~

没有哑节点时，第一次追加必须单独决定结果头节点，后续追加才可以使用统一逻辑。哑节点提供
一个始终存在的前驱，使第一次和以后每次追加都写成 ``tail.next = chosen``。

最终真实头节点是 ``dummy.next``。哑节点只消除边界分支，不会进入返回结果。

为什么只比较两个头节点
~~~~~~~~~~~~~~~~~~~~~~

假设 ``list1.val <= list2.val``。因为 ``list1`` 内部有序，``list1`` 后面的节点都不小于
``list1.val``；因为 ``list2`` 内部有序，``list2`` 的所有未处理节点都不小于
``list2.val``，也就不小于 ``list1.val``。

所以 ``list1`` 当前头节点是所有未处理节点中的最小值，可以安全地接到结果末尾。另一种比较
结果完全对称。

剩余链表为什么能整体接入
~~~~~~~~~~~~~~~~~~~~~~~~

循环在至少一条链表为空时结束。非空链表的剩余部分本身有序，并且它的头节点不小于结果中
最后一个已接入值；否则它早已在上一轮比较中被选中。

因此可以一次执行：

.. code-block:: text

   tail.next = list1 或 list2

无需逐个继续扫描。总复杂度仍是 ``O(m+n)``，该写法减少了无意义的循环和链接操作。

核心不变量
~~~~~~~~~~

每轮比较开始时：

* ``dummy.next`` 到 ``tail`` 是已经处理完成的有序前缀；
* 该前缀恰好包含两个输入链表中所有已经越过的节点，没有遗漏也没有复制；
* ``list1`` 和 ``list2`` 分别指向各自尚未处理部分的最小节点；
* ``tail.val`` 不大于任一尚未处理节点的值；
* 除 ``tail.next`` 将在本轮被改写外，尚未处理部分仍保留原有相对顺序。

正确性依据
~~~~~~~~~~

初始时结果前缀为空，两个输入指针都位于各自最小节点，不变量成立。

若两条链表都非空，主解法选择两个头节点中较小者。根据输入有序性，该节点也是所有未处理
节点中的全局最小值，把它接到结果尾部不会破坏有序性。对应输入指针前进一位后，所有节点
仍被分成“已进入结果”和“两条尚未处理链表”三部分，没有丢失或重复，因此不变量保持。

循环结束时至少一条链表为空。另一条链表的剩余部分有序，且所有值都不小于当前结果尾部，
整体接入后仍然有序。每个输入节点最终恰好进入结果一次，所以返回链表包含全部节点，并且是
两个输入链表的正确归并。

稳定性
~~~~~~

比较使用 ``list1.val <= list2.val``。当值相等时先取第一条链表的节点：

* 同一输入链表内部的相对顺序从未改变；
* 两条链表之间的相等值按“第一条优先”形成确定顺序。

题目通常只检查值序列，不要求稳定性；明确选择 ``<=`` 仍能让行为可预测，也与稳定归并排序
保持一致。

复杂度
~~~~~~

设两条链表长度分别为 ``m`` 和 ``n``：

* 每个节点最多被比较、移动和链接一次，时间复杂度为 ``O(m+n)``；
* 迭代版本只维护固定数量的指针，额外空间复杂度为 ``O(1)``；
* 返回链表复用原节点，输出节点本身不计入额外空间。

核心语言实现
------------

以下代码默认使用平台提供的 ``ListNode``。Julia 与 R 继续使用仓库统一的可变引用节点约定。

C
~

.. code-block:: c

   struct ListNode* mergeTwoLists(
       struct ListNode* list1,
       struct ListNode* list2
   ) {
       struct ListNode dummy = {0, NULL};
       struct ListNode* tail = &dummy;

       while (list1 != NULL && list2 != NULL) {
           if (list1->val <= list2->val) {
               // 先保存并接入当前较小节点，再推进第一条链表。
               tail->next = list1;
               list1 = list1->next;
           } else {
               tail->next = list2;
               list2 = list2->next;
           }
           tail = tail->next;
       }

       // 至多一条链表还有剩余；它本身有序，可以整体接入。
       tail->next = (list1 != NULL) ? list1 : list2;
       return dummy.next;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
           ListNode dummy(0);
           ListNode* tail = &dummy;

           while (list1 != nullptr && list2 != nullptr) {
               if (list1->val <= list2->val) {
                   tail->next = list1;
                   list1 = list1->next;
               } else {
                   tail->next = list2;
                   list2 = list2->next;
               }
               tail = tail->next;
           }

           tail->next = list1 != nullptr ? list1 : list2;
           return dummy.next;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def mergeTwoLists(
           self,
           list1: Optional[ListNode],
           list2: Optional[ListNode],
       ) -> Optional[ListNode]:
           dummy = ListNode()
           tail = dummy

           while list1 is not None and list2 is not None:
               if list1.val <= list2.val:
                   tail.next = list1
                   list1 = list1.next
               else:
                   tail.next = list2
                   list2 = list2.next
               tail = tail.next

           tail.next = list1 if list1 is not None else list2
           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
           ListNode dummy = new ListNode(0);
           ListNode tail = dummy;

           while (list1 != null && list2 != null) {
               if (list1.val <= list2.val) {
                   tail.next = list1;
                   list1 = list1.next;
               } else {
                   tail.next = list2;
                   list2 = list2.next;
               }
               tail = tail.next;
           }

           tail.next = list1 != null ? list1 : list2;
           return dummy.next;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn merge_two_lists(
           mut list1: Option<Box<ListNode>>,
           mut list2: Option<Box<ListNode>>,
       ) -> Option<Box<ListNode>> {
           let mut dummy = Box::new(ListNode::new(0));
           let mut tail = &mut dummy;

           while list1.is_some() && list2.is_some() {
               let take_first = list1.as_ref().unwrap().val
                   <= list2.as_ref().unwrap().val;

               let node = if take_first {
                   // take 取得节点所有权；再把它的后继移回 list1。
                   let mut node = list1.take().unwrap();
                   list1 = node.next.take();
                   node
               } else {
                   let mut node = list2.take().unwrap();
                   list2 = node.next.take();
                   node
               };

               tail.next = Some(node);
               tail = tail.next.as_mut().unwrap();
           }

           tail.next = if list1.is_some() { list1 } else { list2 };
           dummy.next
       }
   }

Go
~~

.. code-block:: go

   func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
       dummy := &ListNode{}
       tail := dummy

       for list1 != nil && list2 != nil {
           if list1.Val <= list2.Val {
               tail.Next = list1
               list1 = list1.Next
           } else {
               tail.Next = list2
               list2 = list2.Next
           }
           tail = tail.Next
       }

       if list1 != nil {
           tail.Next = list1
       } else {
           tail.Next = list2
       }
       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function mergeTwoLists(
       list1: ListNode | null,
       list2: ListNode | null,
   ): ListNode | null {
       const dummy = new ListNode();
       let tail = dummy;

       while (list1 !== null && list2 !== null) {
           if (list1.val <= list2.val) {
               tail.next = list1;
               list1 = list1.next;
           } else {
               tail.next = list2;
               list2 = list2.next;
           }
           // 本轮已经保证 tail.next 非空。
           tail = tail.next;
       }

       tail.next = list1 !== null ? list1 : list2;
       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode MergeTwoLists(ListNode list1, ListNode list2) {
           ListNode dummy = new ListNode();
           ListNode tail = dummy;

           while (list1 != null && list2 != null) {
               if (list1.val <= list2.val) {
                   tail.next = list1;
                   list1 = list1.next;
               } else {
                   tail.next = list2;
                   list2 = list2.next;
               }
               tail = tail.next;
           }

           tail.next = list1 != null ? list1 : list2;
           return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function merge_two_lists(list1, list2)
       dummy = ListNode(0, nothing)
       tail = dummy

       while list1 !== nothing && list2 !== nothing
           if list1.val <= list2.val
               tail.next = list1
               list1 = list1.next
           else
               tail.next = list2
               list2 = list2.next
           end
           # ListNode 是 mutable struct，tail 与 tail.next 指向同一节点对象。
           tail = tail.next
       end

       tail.next = list1 !== nothing ? list1 : list2
       return dummy.next
   end

R
~

.. code-block:: r

   mergeTwoLists <- function(list1, list2) {
       dummy <- new_list_node(0)
       tail <- dummy

       while (!is.null(list1) && !is.null(list2)) {
           if (list1$val <= list2$val) {
               tail$next <- list1
               list1 <- list1$next
           } else {
               tail$next <- list2
               list2 <- list2$next
           }
           # environment 具有引用语义，修改 tail$next 会更新真实链表。
           tail <- tail$next
       }

       tail$next <- if (!is.null(list1)) list1 else list2
       dummy$next
   }

关键边界与易错点
----------------

* 两条链表都为空时，``dummy.next`` 仍为空，直接返回即可；
* 不要只移动 ``tail`` 而忘记移动被选中的输入指针，否则会形成死循环；
* 不要在接入节点前丢失它的后继；Rust 需要先用 ``take`` 显式转移所有权；
* 相等值使用 ``<=`` 或 ``<`` 都能得到正确值序列，二者决定跨链表的稳定顺序；
* 复用节点时不要再为每个值创建新节点，否则额外空间变成 ``O(m+n)``；
* 结果头节点是 ``dummy.next``，不能返回局部哑节点本身；
* 输入有序是双头比较成立的前提，算法不会主动验证或修复无序输入。

新增与强化知识
--------------

新增
~~~~

* **双路稳定归并**：两个有序来源只比较当前头部，每轮确认全局最小未处理节点；
* **尾指针追加**：``tail`` 始终指向结果最后一个节点，使链接操作保持 ``O(1)``；
* **剩余后缀整体接入**：一侧耗尽后，另一侧无需继续逐节点比较。

强化
~~~~

* 0002 与 0019 的哑节点技巧继续用于统一头节点边界；
* 复用原链表节点要求先保存或转移后继，再改写链接；
* Rust 的 ``Option<Box<ListNode>>`` 再次展示 ``take`` 与所有权移动；
* Julia 的可变结构和 R 的 environment 继续承担引用节点语义。

关联题目
--------

* `0002. Add Two Numbers <0002-add-two-numbers.rst>`_：同样用哑节点和尾指针构造结果链表；
* `0019. Remove Nth Node From End of List <0019-remove-nth-node-from-end-of-list.rst>`_：
  通过前驱链接修改单链表；
* `0023. Merge k Sorted Lists <0023-merge-k-sorted-lists.rst>`_：把双路归并扩展为 K 路归并。

最小自检
--------

#. 为什么两个当前头节点中的较小者一定是所有未处理节点的最小值？
#. 哑节点具体消除了哪一个特殊分支？
#. 一条链表耗尽后，为什么另一条链表可以整体接到结果尾部？
#. 使用 ``<=`` 与使用 ``<`` 的值结果相同，行为差异在哪里？
#. Rust 实现为什么要对节点和 ``next`` 分别调用 ``take``？

答案要点
~~~~~~~~

#. 每条剩余链表内部有序，任何后继都不小于当前头，因此全局最小值只可能出现在两个头部；
#. 它让第一次追加也拥有前驱，结果头节点无需单独初始化；
#. 剩余后缀本身有序，且其首值不小于已经确定的结果尾部；
#. 差异是相等值来自不同链表时的稳定来源顺序；
#. 第一次取得节点所有权，第二次把后继从该节点中移出并恢复为尚未处理链表。