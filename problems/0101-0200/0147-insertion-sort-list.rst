0147. Insertion Sort List
=========================

题目信息
--------

:题号: 0147
:难度: Medium
:主题: 链表、插入排序、指针重连、所有权
:原题: `LeetCode 0147 <https://leetcode.com/problems/insertion-sort-list/>`_
:访问状态: Available
:教学重点: 已排序前缀、稳定插入、节点身份守恒、无环重连、Rust 所有权替代

精确契约
--------

输入是一条无环单链表的头节点。公开题面保证节点数 ``n`` 满足 ``1 <= n <= 5000``，节点值满足
``-5000 <= Node.val <= 5000``。需要使用插入排序按值非递减重排链表，并返回重排后的头节点。

本文还主动支持空链表扩展：输入空引用时返回空引用。该扩展不改变公开输入域中的算法行为。

排序的公开可观察结果包括：

* 从返回头开始，节点值非递减；
* 每个输入节点恰好出现一次，没有节点丢失、重复或形成环；
* 只改写 ``next``，不改写 ``val``，也不为输入节点创建替代节点；
* 局部 dummy 只简化表头插入，不属于返回链；
* 本文选择稳定插入：值相等的原节点保持输入相对次序。稳定性强化了实现性质，即使判题通常只比较值序列。

除 Rust 外，公开入口接收节点引用并返回可能变化的新头；调用者仍可通过原节点引用观察重连后的拓扑。Rust
入口按值取得 ``Option<Box<ListNode>>`` 的独占所有权，消费原根槽位并返回同一批 ``Box`` 节点组成的新链。

自建例子与反例
--------------

用字母标记节点身份，数字是节点值：

.. code-block:: text

   输入：A(4) -> B(2) -> C(1) -> D(3) -> E(2)
   输出：C(1) -> B(2) -> E(2) -> D(3) -> A(4)

逐轮把前 ``k`` 个输入节点整理成稳定有序前缀：

.. list-table::
   :header-rows: 1
   :widths: 12 14 22 34 28

   * - 轮次
     - current
     - 动作
     - 稳定有序前缀
     - 未处理后缀
   * - 初始
     - ``A(4)``
     - 首节点自然有序
     - ``A(4)``
     - ``B(2), C(1), D(3), E(2)``
   * - 1
     - ``B(2)``
     - 插到 A 前
     - ``B(2), A(4)``
     - ``C(1), D(3), E(2)``
   * - 2
     - ``C(1)``
     - 插到表头
     - ``C(1), B(2), A(4)``
     - ``D(3), E(2)``
   * - 3
     - ``D(3)``
     - 插到 B 与 A 之间
     - ``C(1), B(2), D(3), A(4)``
     - ``E(2)``
   * - 4
     - ``E(2)``
     - 跨过等值 B
     - ``C(1), B(2), E(2), D(3), A(4)``
     - 空

最后一轮能区分稳定与不稳定实现。搜索条件若写成 ``position.next.val < current.val``，E 会插到 B 前；值序列
仍是 ``1, 2, 2, 3, 4``，但等值节点身份顺序从 ``B, E`` 变成 ``E, B``。本文使用 ``<=`` 跨过已有等值
节点，保留 ``B`` 在 ``E`` 之前。

问题抽象与解法取舍
------------------

数组插入排序通常把当前元素暂存，再整体右移一段数组。单链表没有随机访问，也不需要移动节点载荷；真正对应的
操作是：从未处理后缀摘下第一个节点，再把它接到有序前缀中的正确链接槽位。

可以考虑三类方案：

.. list-table::
   :header-rows: 1
   :widths: 28 18 20 44

   * - 方法
     - 时间
     - 额外空间
     - 取舍
   * - 已排序前缀插入
     - 最坏 ``O(n²)``
     - ``O(1)``
     - 主解法；直接体现题目指定的插入排序并复用节点
   * - 复制值到数组后排序
     - 依排序库而定
     - ``O(n)``
     - 可能回写值或重建节点，掩盖节点身份与拓扑要求
   * - 链表归并排序
     - ``O(n log n)``
     - 递归版 ``O(log n)`` 栈
     - 更适合大规模排序，是 0148 的主题，但不再是本题指定的插入排序

普通指针版本保留原链作为一个整体，维护有序前缀尾 ``last_sorted``。Rust 若照搬“同时持有前缀内部游标、
前缀尾和整个链头”的多重可变引用，会与独占借用冲突；因此 Rust 改为逐个取出原 ``Box`` 节点，插入另一条
有序所有权链。两者处理节点的数学次序相同，但状态表示、最好输入和证明义务不能混写。

普通指针版：状态与不变量
------------------------

代码中的变量含义如下：

``dummy``
  局部哨兵，``dummy.next`` 始终是当前整条链的头。dummy 的值从不参与比较。

``last_sorted``
  已排序前缀的尾节点。它同时是已处理与未处理部分的边界。

``current``
  ``last_sorted.next``，即原输入中下一个尚未处理的节点。

``position``
  插入链接的前驱。目标是使 ``position.val <= current.val``，并让 ``position.next`` 是前缀中第一个值
  严格大于 ``current.val`` 的节点；当插在表头时，position 是 dummy。

设已经处理输入前 ``k`` 个节点，其中 ``1 <= k <= n``。每轮循环开始时保持：

#. 从 ``dummy.next`` 到 ``last_sorted`` 恰好由前 ``k`` 个输入节点组成，按值非递减，并且等值节点保持输入
   相对次序。
#. ``last_sorted.next`` 开始的后缀恰好由其余输入节点组成，仍按输入相对次序连接；若它为空，全部处理完毕。
#. 前缀与后缀节点集合不交，并集是全部输入节点；从 ``dummy.next`` 出发是一条包含全部输入节点、以空引用结束
   的无环单链。
#. ``last_sorted`` 是前缀最后一个节点；dummy 不是输入节点，也不会成为返回节点。

初始时非空链的首节点自己构成稳定有序前缀，``last_sorted = head``，其余节点仍是原后缀，所以不变量成立。

两条处理路径
~~~~~~~~~~~~

若 ``last_sorted.val <= current.val``，current 已经不小于有序前缀最大值。它原本就紧跟在前缀之后，保留原边
并令 ``last_sorted = current``，即可把前缀扩大一项。

否则有 ``current.val < last_sorted.val``，current 必须向前移动：

#. 从 dummy 开始，在有序前缀中跨过所有值 ``<= current.val`` 的节点；
#. 执行 ``last_sorted.next = current.next``，从未处理后缀摘除 current；
#. 执行 ``current.next = position.next``，保存插入点后的原前缀入口；
#. 执行 ``position.next = current``，把 current 接入前缀。

搬移后 ``last_sorted`` 不前进。它原来是前缀尾；current 被插到它之前，新前缀仍以 last_sorted 为尾，而新的
未处理后缀已经由第一条赋值接在 last_sorted 后。

为什么搜索解引用安全
~~~~~~~~~~~~~~~~~~~~

搜索循环看似没有显式检查 ``position.next`` 是否为空，但它只在搬移分支执行。该分支已知
``last_sorted.val > current.val``。有序前缀的最后一个节点 last_sorted 因而不满足 ``<= current.val``，搜索
最迟在比较 last_sorted 时停止，绝不会越过它或到达 current。于是每次读取 ``position.next.val`` 时
``position.next`` 都是前缀中的真实节点，非空断言由紧邻的不变量支撑。

三条改边的顺序同样不可交换。若先令 ``current.next = position.next``，未处理后缀入口会丢失；若在 current
仍可由 last_sorted 到达时先令 ``position.next = current``，可能让前缀形成回路。先让 last_sorted 绕过
current，再改 current 的后继，最后接入 position，才能让每个旧入口在被覆盖前已经保存或转移。

普通指针版正确性证明
--------------------

**引理一：快路径保持不变量。**

current 不小于 last_sorted，而 last_sorted 是非递减前缀的最大值，所以把 current 留在其后仍非递减。current
本来就是输入中第 ``k+1`` 个节点，位于所有已处理节点之后，等值时也自然在已有等值节点之后，因此稳定。只把
边界推进到 current，不改任何边；节点集合、后缀顺序、连通性和无环性全部保持。

**引理二：搬移路径找到唯一稳定插入边界。**

有序前缀中所有 ``<= current.val`` 的节点形成连续前段。搜索从 dummy 起逐个跨过这段，停下时
``position.next`` 是第一个值严格大于 current 的前缀节点；它必存在，因为 last_sorted 就是一个这样的节点。
因此插入后，current 的前驱值不大于它，后继值严格大于它，前缀仍非递减。搜索跨过了所有等值节点，所以新到
的 current 排在它们之后，稳定性保持。

**引理三：搬移路径保持节点身份、连通性与无环性。**

第一条赋值让 last_sorted 直接连接 current 的原后继，故未处理后缀除 current 外不丢失且顺序不变。此时
current 已不再从主链可达。第二条赋值让 current 指向插入点原后继；该前缀路径不含 current，并最终到达
last_sorted 后进入已经绕过 current 的后缀，所以不会成环。第三条赋值重新接入 current。没有创建、释放或
复制输入节点，故前缀增加且只增加 current，后缀减少且只减少 current，整链仍恰好覆盖全部原节点并以空引用
结束。

**定理：普通指针算法返回稳定非递减且身份守恒的链表。**

由初始状态和引理一、二、三，循环不变量归纳保持。两条路径每轮都把原输入的下一个节点纳入有序前缀，所以
已处理数严格增加；最多 ``n-1`` 轮后后缀为空，循环终止。此时前缀覆盖全部输入节点，按值非递减、稳定、无环
且以空引用结束。返回 ``dummy.next`` 排除了局部 dummy，因此满足契约。

Rust 所有权替代
--------------

Rust 平台链是 ``Option<Box<ListNode>>``。实现维护两个根槽位：

``sorted``
  已消费输入节点组成的稳定非递减所有权链。

``head``
  尚未消费的原输入后缀，仍保持输入顺序。

外层循环开始时，两条链节点集合不交，并集是全部原节点；sorted 恰好包含前 ``k`` 个输入节点，head 包含其余
节点。``head.take()`` 把首个 ``Box`` 从根槽位移出并留下 ``None``；随后 ``node.next.take()`` 把原后缀
重新交还给 head，同时让 node 成为独立单节点。这里移动的是 ``Box`` 所有权，不复制节点载荷。

``insert(sorted, node)`` 分两种情况：

* sorted 为空或首值严格大于 node 时，让 ``node.next = sorted``，node 成为新头；
* 否则从首节点开始，只要后继值 ``<= node.val`` 就推进可变游标。停下后先 ``take`` 游标后继到
  ``node.next``，再把 node 放进游标的 ``next`` 槽。

第二种情况同样跨过所有等值节点，所以稳定。游标始终沿一条独占无环链前进；被取出的后缀先归 node 所有，
node 再被放入唯一空出的链接槽，所有权系统使同一 ``Box`` 不可能同时出现在两个位置。

对外层已消费节点数归纳：初始 sorted 为空；每轮从 head 精确取出首节点并稳定插入 sorted，故两链分区和 sorted
有序性保持，已消费数加一。head 最终为空时，sorted 恰好由全部原 Box 节点组成，稳定有序且无环。全过程没有
``clone``、``Rc``、``unsafe`` 或新建 ListNode。

真实复杂度与资源成本
--------------------

普通指针版本有 ``n-1`` 轮。快路径为常数时间；搬移路径最多扫描当前有序前缀，故总时间上界 ``O(n²)``。
该界可以达到，例如：

.. code-block:: text

   1, 3, 2, 5, 4, 7, 6, ...

每个偶数值都只比当前最大值小，却大于此前几乎全部节点，搜索长度随前缀增长，总和为 ``Theta(n²)``。反过来，
已排序输入始终走快路径，严格递减输入的搜索每次立即停在表头；两者时间都是 ``Theta(n)``。所以不能机械地把
“逆序数组是插入排序最坏输入”搬到这个带表头搜索优化的链表控制流上。

Rust 每次从 sorted 头开始寻找插入点，单次最多扫描已消费链，最坏同样 ``Theta(n²)``。但输入分布对应关系
不同：非递减输入的第 ``k`` 个节点每次跨过全部 ``k-1`` 个已有节点，达到 ``Theta(n²)``；严格递减输入每次
头插，总时间 ``Theta(n)``。正文不会把普通版本在非递减输入上的线性快路径外推给 Rust。

所有实现的核心辅助状态都是常数个节点引用、根槽位或 ``Box`` 临时所有权，额外空间 ``O(1)``，没有递归栈。
输出直接复用输入的 ``n`` 个节点，不新建 ``Theta(n)`` 结果容器。C/C++ 的 dummy 是栈上局部节点；托管语言、
Julia 与 R 会创建一个常数大小的 dummy 对象或 environment。Rust 不需要 dummy，也不分配新链表节点。

语言接口与副作用
----------------

以下代码复用平台提供的 ``ListNode``，不在题内重复定义：

* C、C++、Python、Java、Go、TypeScript、C# 都返回新的头引用；dummy 值不参与排序，因而无需位于值域之外。
* C 只重连调用者拥有的节点，不分配或释放内存，没有分配失败路径；调用者仍负责最终链的生命周期。
* Python、Java、Go、TypeScript 与 C# 的局部变量保存节点引用，字段赋值修改原节点对象。宿主内存不足时创建
  常数大小 dummy 可能抛异常或终止，不属于普通题面输入结果。
* Rust 入口消费链根；``take`` 取走 ``Option`` 中的值并留下 ``None``，使断接与所有权转移显式发生。返回值
  是原 Box 节点的新根，不是复制链。
* Julia 的统一 ``ListNode`` 必须是 ``mutable struct``；函数名以 ``!`` 表示会改写链接，并返回可能变化的头。
* R 统一节点是 environment。字段修改对共享节点身份可见，但调用者的局部 head 绑定不会因函数内重绑定自动
  改成新表头，所以适配器必须返回并由调用者接收新头。

十语言实现
----------

C
~

.. code-block:: c

   struct ListNode *insertionSortList(struct ListNode *head) {
       if (head == NULL || head->next == NULL) {
           return head;
       }

       struct ListNode dummy = {0, head};
       struct ListNode *last_sorted = head;

       while (last_sorted->next != NULL) {
           struct ListNode *current = last_sorted->next;
           if (last_sorted->val <= current->val) {
               last_sorted = current;
               continue;
           }

           struct ListNode *position = &dummy;
           while (position->next->val <= current->val) {
               position = position->next;
           }

           last_sorted->next = current->next;
           current->next = position->next;
           position->next = current;
       }

       return dummy.next;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode* insertionSortList(ListNode* head) {
           if (head == nullptr || head->next == nullptr) {
               return head;
           }

           ListNode dummy(0, head);
           ListNode* lastSorted = head;

           while (lastSorted->next != nullptr) {
               ListNode* current = lastSorted->next;
               if (lastSorted->val <= current->val) {
                   lastSorted = current;
                   continue;
               }

               ListNode* position = &dummy;
               while (position->next->val <= current->val) {
                   position = position->next;
               }

               lastSorted->next = current->next;
               current->next = position->next;
               position->next = current;
           }

           return dummy.next;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def insertionSortList(
           self,
           head: Optional[ListNode],
       ) -> Optional[ListNode]:
           if head is None or head.next is None:
               return head

           dummy = ListNode(0, head)
           last_sorted = head

           while last_sorted.next is not None:
               current = last_sorted.next
               if last_sorted.val <= current.val:
                   last_sorted = current
                   continue

               position = dummy
               while position.next.val <= current.val:
                   position = position.next

               last_sorted.next = current.next
               current.next = position.next
               position.next = current

           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode insertionSortList(ListNode head) {
           if (head == null || head.next == null) {
               return head;
           }

           ListNode dummy = new ListNode(0, head);
           ListNode lastSorted = head;

           while (lastSorted.next != null) {
               ListNode current = lastSorted.next;
               if (lastSorted.val <= current.val) {
                   lastSorted = current;
                   continue;
               }

               ListNode position = dummy;
               while (position.next.val <= current.val) {
                   position = position.next;
               }

               lastSorted.next = current.next;
               current.next = position.next;
               position.next = current;
           }

           return dummy.next;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn insertion_sort_list(
           mut head: Option<Box<ListNode>>,
       ) -> Option<Box<ListNode>> {
           fn insert(
               mut sorted: Option<Box<ListNode>>,
               mut node: Box<ListNode>,
           ) -> Option<Box<ListNode>> {
               let insert_at_front = match sorted.as_ref() {
                   None => true,
                   Some(first) => first.val > node.val,
               };
               if insert_at_front {
                   node.next = sorted;
                   return Some(node);
               }

               let mut cursor = sorted
                   .as_mut()
                   .expect("the front-insertion case handled an empty list");
               loop {
                   let advance = match cursor.next.as_ref() {
                       Some(next) => next.val <= node.val,
                       None => false,
                   };
                   if !advance {
                       break;
                   }
                   cursor = cursor
                       .next
                       .as_mut()
                       .expect("advance requires a next node");
               }

               node.next = cursor.next.take();
               cursor.next = Some(node);
               sorted
           }

           let mut sorted = None;
           while let Some(mut node) = head.take() {
               head = node.next.take();
               sorted = insert(sorted, node);
           }
           sorted
       }
   }

Go
~~

.. code-block:: go

   func insertionSortList(head *ListNode) *ListNode {
       if head == nil || head.Next == nil {
           return head
       }

       dummy := &ListNode{Next: head}
       lastSorted := head

       for lastSorted.Next != nil {
           current := lastSorted.Next
           if lastSorted.Val <= current.Val {
               lastSorted = current
               continue
           }

           position := dummy
           for position.Next.Val <= current.Val {
               position = position.Next
           }

           lastSorted.Next = current.Next
           current.Next = position.Next
           position.Next = current
       }

       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function insertionSortList(head: ListNode | null): ListNode | null {
       if (head === null || head.next === null) {
           return head;
       }

       const dummy = new ListNode(0, head);
       let lastSorted: ListNode = head;

       while (lastSorted.next !== null) {
           const current: ListNode = lastSorted.next;
           if (lastSorted.val <= current.val) {
               lastSorted = current;
               continue;
           }

           let position: ListNode = dummy;
           while (position.next!.val <= current.val) {
               position = position.next!;
           }

           lastSorted.next = current.next;
           current.next = position.next;
           position.next = current;
       }

       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode InsertionSortList(ListNode head) {
           if (head == null || head.next == null) {
               return head;
           }

           ListNode dummy = new ListNode(0, head);
           ListNode lastSorted = head;

           while (lastSorted.next != null) {
               ListNode current = lastSorted.next;
               if (lastSorted.val <= current.val) {
                   lastSorted = current;
                   continue;
               }

               ListNode position = dummy;
               while (position.next.val <= current.val) {
                   position = position.next;
               }

               lastSorted.next = current.next;
               current.next = position.next;
               position.next = current;
           }

           return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function insertion_sort_list!(
       head::Union{Nothing,ListNode},
   )::Union{Nothing,ListNode}
       if head === nothing || head.next === nothing
           return head
       end

       dummy = ListNode(0, head)
       last_sorted = head

       while last_sorted.next !== nothing
           current = last_sorted.next
           if last_sorted.val <= current.val
               last_sorted = current
               continue
           end

           position = dummy
           while position.next.val <= current.val
               position = position.next
           end

           last_sorted.next = current.next
           current.next = position.next
           position.next = current
       end

       return dummy.next
   end

R
~

.. code-block:: r

   insertion_sort_list <- function(head) {
     if (is.null(head) || is.null(head$next)) {
       return(head)
     }

     dummy <- new_list_node(0L, head)
     last_sorted <- head

     while (!is.null(last_sorted$next)) {
       current <- last_sorted$next
       if (last_sorted$val <= current$val) {
         last_sorted <- current
         next
       }

       position <- dummy
       while (position$next$val <= current$val) {
         position <- position$next
       }

       last_sorted$next <- current$next
       current$next <- position$next
       position$next <- current
     }

     dummy$next
   }

人工推演与静态审查
------------------

本题按仓库统一策略没有运行、编译或测试任何题解代码，也没有执行官方示例、对拍、穷举、属性测试、
sanitizer 或目标语言最小程序。以下只记录实际完成的人工推演和逐语言静态语义核对。

操作级推演
~~~~~~~~~~

前面的五节点表逐轮记录了前缀、current、插入位置和未处理后缀。每轮之后还按身份核对集合始终是
``{A, B, C, D, E}``，前缀与后缀不交，返回链尾 ``A.next`` 最终为空。重复值 ``B(2)``、``E(2)`` 覆盖了
稳定性；C 插表头、D 插中间覆盖了两类搬移边界。

另外人工推演了以下结构：

* 空链与单节点直接返回，未读取空节点字段；
* ``1 -> 2 -> 3`` 每轮只推进 last_sorted，不改边；
* ``3 -> 2 -> 1`` 每轮搜索都在第一个真实节点处停止并头插，最终 ``1 -> 2 -> 3``；
* ``1 -> 3 -> 2 -> 5 -> 4`` 的两个搬移节点分别扫描越来越长的前缀，验证二次时间见证；
* ``2_A -> 2_B -> 1_C -> 2_D`` 最终身份序为 ``C, A, B, D``，三个等值节点相对次序不变。

逐赋值拓扑审查
~~~~~~~~~~~~~~

对搬移路径逐条核对：搜索由 ``last_sorted.val > current.val`` 保证不会越过前缀；
``last_sorted.next = current.next`` 保存并接回原后缀；``current.next = position.next`` 只指向不含 current 的
前缀路径；``position.next = current`` 最后恢复整链可达性。三步后 last_sorted 仍是前缀尾，每轮处理数增加一，
所以没有丢节点、重复节点、环或死循环。

逐语言语义审查
~~~~~~~~~~~~~~

* **C / C++**：空链和单节点在构造并使用 dummy 前返回；dummy 位于调用栈，不分配结果节点。所有读取
  ``position->next`` 的路径都有 last_sorted 停止见证，函数只改调用者节点的 ``next``。
* **Python / Java / Go / TypeScript / C#**：保存的是节点对象引用，搬移后返回 ``dummy.next`` 处理头变化。
  Go dummy 使用字段名初始化，避免依赖平台结构体字段顺序；C# 使用显式构造器名，不依赖 target-typed new。
  TypeScript 的两个非空断言只位于已经证明不会越过 lastSorted 的搜索循环。
* **Rust**：``head.take`` 与 ``node.next.take`` 分别清空原根槽和节点后继槽；两个 ``expect`` 都有紧邻布尔见证。
  可变 cursor 只沿 sorted 独占链移动，停止后先 take 后缀再放入 node；代码没有 ``unsafe``、``clone``、``Rc``
  或递归。普通版本的已排序快路径没有被错误外推到 Rust。
* **Julia**：统一可变节点允许原位字段赋值，返回的新头反映局部 dummy 后的真实根；比较使用节点值，不比较
  dummy 值。函数的 ``!`` 后缀准确提示链接副作用。
* **R**：节点和 dummy 都是 environment，``$next`` 赋值按身份修改；``next`` 关键字只用于快路径继续循环，
  没有被用作变量名。适配器返回新头，避免把环境字段可见性误解成调用者 head 绑定自动重定向。

剩余风险
~~~~~~~~

静态审查不能替代目标编译器、解释器或判题模板。当前剩余风险包括平台 ``ListNode`` 构造器在个别语言版本中的
具体可用重载、Rust 借用检查器的实际诊断、Julia/R 统一节点定义是否由调用环境正确载入，以及宿主内存耗尽
行为。本文明确没有运行或编译代码，也没有把这些项目写成“通过”。

关键边界与失败方式
------------------

* 官方输入非空；空链只作为主动支持扩展，必须在读取 ``head.next`` 前守卫。
* dummy 的值可能落在合法值域内，但算法从不比较 dummy.val，所以不依赖伪造的负无穷哨兵。
* 快路径相等时也要推进 last_sorted；否则循环不会前进。
* 搜索使用 ``<=`` 才会把新等值节点放到旧等值节点之后；使用 ``<`` 会失去稳定性。
* 只有搬移分支能保证 last_sorted 严格大于 current，从而支撑 ``position.next`` 非空；不能把搜索移到分支外。
* 摘除 current 前不能覆盖它的后继入口；接入 current 前又必须先让 last_sorted 绕过它。
* 搬移后 last_sorted 保持原位。若错误推进到 current，它已经位于前缀内部，不再是前缀尾。
* 仅比较输出值无法发现节点复制、值交换、同值身份反转或环；静态审查必须追踪身份和 next 边。
* 严格递减输入在本控制流中是线性头插，不是二次最坏见证；复杂度必须分析实际代码而非数组排序印象。
* Rust 若在节点仍由 head 拥有时尝试同时可变借用 sorted 与原链，会造成所有权冲突；先 ``take`` 成独立 Box
  再插入能关闭该路径。

学习链与关联题目
----------------

本题新增或强化三组能力：

* **已排序前缀不变量**：排序正确性不仅是最终非递减，还包括处理边界、未处理后缀原顺序和每轮严格进展；
* **拓扑式插入**：数组的搬移区间被替换为三个链接槽位，赋值顺序承担保存后缀和防环责任；
* **所有权替代算法**：Rust 通过消费输入根、分离单个 Box、返回有序根表达同一稳定插入语义，并重新计算复杂度。

关联题目：

* `0143. Reorder List <0143-reorder-list.rst>`_：同样要求保存后继、重连原节点并证明节点守恒和无环；
* `0148. Sort List <0148-sort-list.rst>`_：用归并排序把最坏时间降为 ``O(n log n)``，需要新的切分与合并证明；
* `0021. Merge Two Sorted Lists <../0001-0100/0021-merge-two-sorted-lists.rst>`_：有序链的稳定合并和尾链接槽位。

自检与答案
----------

#. **每轮开始时 last_sorted 精确表示什么？**

   它是由前 ``k`` 个输入节点组成的稳定有序前缀尾；它的 next 是下一个未处理原节点，或在全部完成时为空。

#. **为什么搬移分支的 position.next 一定非空？**

   进入该分支已经知道 ``last_sorted.val > current.val``。搜索只在有序前缀中跨过 ``<= current.val`` 的节点，
   最迟遇到 last_sorted 就会停止，因此不会走到空引用。

#. **为什么三条改边必须先让 last_sorted 绕过 current？**

   current.next 是未处理后缀的唯一入口。先用它更新 last_sorted.next 才保住后缀，并让 current 脱离主链；之后
   current 才能安全指向插入点并被接回，而不会丢后缀或成环。

#. **搜索条件为什么是小于等于，而不是严格小于？**

   处理节点按输入顺序到来。跨过所有已有等值节点后再插入，才能让较早出现的等值节点仍排在较晚节点之前，
   保持稳定性。

#. **这个链表版本的严格递减输入为什么不是最坏情况？**

   每个新节点都小于有序前缀首节点，position 在第一次比较就停止并头插，单轮为常数时间，总计线性。不断在
   长前缀尾部附近插入的交错上升序列才会让搜索长度累计成二次量级。

#. **Rust 的 sorted 是否是一条新复制链？**

   不是。``take`` 把原 ``Box`` 所有权移出旧槽并留下 None；insert 再把同一个 Box 放进 sorted 的唯一链接槽。
   没有克隆节点、复制 val 或分配另一批 ListNode。
