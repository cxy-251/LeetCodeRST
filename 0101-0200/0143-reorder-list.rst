0143. Reorder List
==================

题目信息
--------

:题号: 0143
:难度: Medium
:主题: 链表、快慢指针、原地反转、拓扑重连
:原题: `LeetCode 0143 <https://leetcode.com/problems/reorder-list/>`_
:访问状态: Available
:教学重点: 等价切分、三阶段节点守恒、尾节点终止、独占所有权重连

精确契约
--------

给定一条包含 ``m`` 个节点的单链表：

``L0 -> L1 -> ... -> L(m-1)``

需要把同一批节点原地重连成：

``L0 -> L(m-1) -> L1 -> L(m-2) -> ...``

这里的下标表示节点在输入链中的位置，而不是节点值。公开题面的有效输入满足
``1 <= m <= 5 * 10^4``、``1 <= Node.val <= 1000``，输入链无环。函数没有结果载荷；
调用者通过原来的头节点观察修改后的拓扑。

契约中有三个容易被返回序列掩盖的要求：

* 必须保留每个原节点的身份，只能修改 ``next``；
* 不能交换或重写 ``val``，也不能新建一条同值链表替代原链；
* 最终链必须仍然恰好包含 ``m`` 个节点，且尾节点的 ``next`` 为空。

自建例子
--------

**奇数长度。** 设五个节点依次为 ``A(10)、B(20)、C(30)、D(40)、E(50)``。重排结果是
``A -> E -> B -> D -> C``。中间节点 ``C`` 最终留在尾部。

**偶数长度与重复值。** 设 ``A、B、C、D`` 的值都等于 ``7``。输出必须按节点身份成为
``A -> D -> B -> C``。只看值会得到 ``7 -> 7 -> 7 -> 7``，无法验证是否真的移动了节点；
这正说明实现和审查都必须追踪对象身份而不是比较 ``val``。

**最短输入。** 单节点 ``A`` 和双节点 ``A -> B`` 的目标顺序与输入相同，不需要改边。

问题抽象与解法选择
------------------

目标顺序是在输入的左端、右端轮流取节点。单链表不能从尾部向前走，因此真正的困难不是“交替”，
而是怎样以常量工作空间取得 ``L(m-1)、L(m-2), ...``。

可以考虑三类方案：

* 把全部节点引用放入数组，再用双指针重连。它直观，但节点引用数组占 ``O(m)`` 额外空间；
* 递归到链尾后从两端向中间连接。递归栈最坏为 ``O(m)``，而且左右指针的停止条件较难审计；
* 把链切成前后两段，反转后半段，再交替合并。反转把“从右端向左取”变成从新表头向后取，
  全程只需要固定数量的节点引用。

本题采用第三种方案。它不是三个互不相关的技巧：切分必须交付两条互不相交且正确终止的链，
反转必须保持第二段节点集合，合并才能在不丢节点、不重复节点的前提下得到目标顺序。

状态与三阶段接口
----------------

令 ``a = ceil(m / 2)``、``b = floor(m / 2)``。算法维护以下状态：

* ``slow``：切分完成时指向前半段最后一个节点 ``L(a-1)``；
* ``second``：切分后指向后半段 ``L(a) -> ... -> L(m-1)`` 的表头；
* ``previous``：反转阶段已经反转好的前缀表头；
* ``first`` 与 ``second``：合并阶段两条尚未消费链的表头；
* ``first_next`` 与 ``second_next``：改边前保存的两条剩余链入口。

三阶段的输入输出约定是：

#. **切分**把一条长度 ``m`` 的链变成互不相交的 ``F`` 与 ``S``，长度分别为 ``a`` 和 ``b``；
#. **反转**把 ``S`` 变成 ``R = L(m-1) -> ... -> L(a)``，不改变其中节点身份；
#. **交替合并**依次从 ``F``、``R`` 各消费一个节点。因为 ``b <= a <= b + 1``，第二段一定先耗尽。

算法步骤
--------

切分
~~~~

令 ``slow = head``、``fast = head.next``。每轮让 ``slow`` 前进一步、``fast`` 前进两步，循环条件先确认
``fast`` 和 ``fast.next`` 都存在。循环停止后，``slow`` 恰好位于 ``L(a-1)``。

先保存 ``second = slow.next``，再执行 ``slow.next = null``。这一断边不是清理细节，而是切分阶段的
后置条件：之后的第一段和第二段节点集合不相交，两条链都以空引用结束。

反转第二段
~~~~~~~~~~

反转循环每轮先保存 ``following = second.next``，再令 ``second.next = previous``，最后推进
``previous`` 和 ``second``。保存后继必须发生在改边之前，否则尚未处理的后缀会失去入口。

交替合并
~~~~~~~~

令 ``first`` 指向 ``F``，``second`` 指向反转后的 ``R``。只要 ``second`` 非空，就按以下顺序执行：

#. 保存 ``first_next`` 与 ``second_next``；
#. 连接 ``first.next = second``；
#. 连接 ``second.next = first_next``；
#. 把两个游标分别推进到已保存的后继。

循环只以第二段是否耗尽为条件。前半段从不短于后半段，所以访问 ``first`` 时它必然存在；
奇数长度多出的中点节点已经是第一段尾节点，会自然成为最终尾部。

正确性证明
----------

引理一：切分长度正确
~~~~~~~~~~~~~~~~~~~~

把输入节点按零基下标编号。初始化时 ``slow`` 在 ``L0``，``fast`` 在 ``L1``。完成 ``t`` 轮后，
只要对应节点存在，``slow`` 在 ``L(t)``，``fast`` 在 ``L(2t+1)``。

* 若 ``m = 2q``，循环最后完成 ``q-1`` 轮，``slow`` 位于 ``L(q-1)``。断边后两段长度都是 ``q``；
* 若 ``m = 2q+1``，循环最后完成 ``q`` 轮，``slow`` 位于 ``L(q)``。两段长度分别为 ``q+1`` 和 ``q``。

所以两种情况下 ``slow`` 都在 ``L(a-1)``，切分长度分别为 ``a`` 与 ``b``。原链只有一条从
``L(a-1)`` 到 ``L(a)`` 的跨段边；清空 ``slow.next`` 后，这条边被删除，故两段互不相交且都正确终止。

引理二：反转保持第二段节点集合并得到逆序
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

反转循环开始时保持不变量：

* ``previous`` 是原第二段已处理前缀的逆序链；
* ``second`` 是尚未处理后缀的原序链；
* 两条链不相交，它们的节点并集恰好是原第二段，且两条链都无环。

初始时已处理前缀为空，不变量成立。每轮先保存 ``following``，再把当前 ``second`` 节点从未处理后缀
移到 ``previous`` 表头；它的旧后继已保存在 ``following``，新后继指向一条无环且不含它的已处理链，
所以节点不丢失、不重复，也不会形成环。循环终止时未处理后缀为空，于是 ``previous`` 恰好为
``L(m-1) -> L(m-2) -> ... -> L(a)``。

引理三：交替合并产生目标前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

把前半段记为 ``F0, F1, ...``，其中 ``Fi = Li``；把反转后的第二段记为 ``R0, R1, ...``，
其中 ``Ri = L(m-1-i)``。合并第 ``i`` 轮开始时保持：

* 已连接前缀为 ``F0, R0, F1, R1, ..., F(i-1), R(i-1)``；
* ``first`` 指向 ``Fi``，``second`` 指向 ``Ri``；
* 两条未消费后缀与已连接前缀的节点集合两两不交，三者并集仍是全部原节点。

第 ``i`` 轮在改边前保存两个后继，然后连接 ``Fi -> Ri -> F(i+1)``。因此新前缀恰好增加
``Fi, Ri``，游标推进到下一对未消费节点，节点分区没有变化，不变量保持。

引理四：最终尾部为空且不会形成环
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

第二段有 ``b`` 个节点，合并恰好执行 ``b`` 轮。若 ``m = 2q``，最后一轮连接
``L(q-1) -> L(q) -> null``；若 ``m = 2q+1``，最后一轮连接 ``L(q-1) -> L(q+1) -> L(q)``，
而 ``L(q).next`` 已在切分时成为空引用。

由引理三，最终序列中每个原节点恰好出现一次；由上述尾部分析，序列最后以空引用结束。
一条从头可达、节点不重复且以空引用结束的有限单链不可能含环。

定理：算法满足重排契约
~~~~~~~~~~~~~~~~~~~~~~

引理一给出正确且不相交的两段；引理二把后半段变为从原链右端向左的顺序；引理三证明交替合并的
节点次序正是 ``L0, L(m-1), L1, L(m-2), ...``；引理四证明链正确终止且无环。整个过程中只改写
``next``，没有改写 ``val`` 或创建替代节点，所以节点身份、节点数量与节点值全部守恒，契约成立。

复杂度与资源成本
----------------

普通指针实现寻找切分点、反转和合并各访问至多线性数量的节点，总时间 ``O(m)``。算法只保存固定数量的
节点引用，核心额外空间为 ``O(1)``；没有递归栈，也没有与 ``m`` 成比例的节点引用数组。输出就是被修改的
输入链，不另计输出容器。

Rust 实现为了满足 ``Option<Box<ListNode>>`` 的独占所有权，先只读统计长度，再沿可变“链接槽位”切分；
随后用 ``take`` 依次移动原 ``Box`` 节点，并通过尾槽位重建交替链。它比快慢指针版本多一次线性扫描，
渐进时间仍为 ``O(m)``，同时只持有固定数量的 ``Option``、``Box`` 和可变借用，额外空间仍为 ``O(1)``。
移动 ``Box`` 只转移所有权，不复制节点载荷，也不增加引用计数。

语言接口约定
------------

以下代码假设平台已经提供 ``ListNode`` 定义。C、C++、Java、Go、TypeScript、C# 直接修改平台节点；
Python 的返回值为 ``None``，Julia 用 ``Nothing`` 表达无结果载荷。R 示例约定每个节点是带 ``val``、
``next`` 字段的 environment；``invisible(head)`` 只是调用便利，修改通过原 environment 身份对调用者可见。

C
~

.. code-block:: c

   void reorderList(struct ListNode *head) {
       if (head == NULL || head->next == NULL) {
           return;
       }

       struct ListNode *slow = head;
       struct ListNode *fast = head->next;
       while (fast != NULL && fast->next != NULL) {
           slow = slow->next;
           fast = fast->next->next;
       }

       struct ListNode *second = slow->next;
       slow->next = NULL;

       struct ListNode *previous = NULL;
       while (second != NULL) {
           struct ListNode *following = second->next;
           second->next = previous;
           previous = second;
           second = following;
       }

       struct ListNode *first = head;
       second = previous;
       while (second != NULL) {
           struct ListNode *first_next = first->next;
           struct ListNode *second_next = second->next;
           first->next = second;
           second->next = first_next;
           first = first_next;
           second = second_next;
       }
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       void reorderList(ListNode *head) {
           if (head == nullptr || head->next == nullptr) {
               return;
           }

           ListNode *slow = head;
           ListNode *fast = head->next;
           while (fast != nullptr && fast->next != nullptr) {
               slow = slow->next;
               fast = fast->next->next;
           }

           ListNode *second = slow->next;
           slow->next = nullptr;

           ListNode *previous = nullptr;
           while (second != nullptr) {
               ListNode *following = second->next;
               second->next = previous;
               previous = second;
               second = following;
           }

           ListNode *first = head;
           second = previous;
           while (second != nullptr) {
               ListNode *first_next = first->next;
               ListNode *second_next = second->next;
               first->next = second;
               second->next = first_next;
               first = first_next;
               second = second_next;
           }
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def reorderList(self, head: Optional[ListNode]) -> None:
           if head is None or head.next is None:
               return

           slow = head
           fast = head.next
           while fast is not None and fast.next is not None:
               slow = slow.next
               fast = fast.next.next

           second = slow.next
           slow.next = None

           previous = None
           while second is not None:
               following = second.next
               second.next = previous
               previous = second
               second = following

           first = head
           second = previous
           while second is not None:
               first_next = first.next
               second_next = second.next
               first.next = second
               second.next = first_next
               first = first_next
               second = second_next

Java
~~~~

.. code-block:: java

   class Solution {
       public void reorderList(ListNode head) {
           if (head == null || head.next == null) {
               return;
           }

           ListNode slow = head;
           ListNode fast = head.next;
           while (fast != null && fast.next != null) {
               slow = slow.next;
               fast = fast.next.next;
           }

           ListNode second = slow.next;
           slow.next = null;

           ListNode previous = null;
           while (second != null) {
               ListNode following = second.next;
               second.next = previous;
               previous = second;
               second = following;
           }

           ListNode first = head;
           second = previous;
           while (second != null) {
               ListNode firstNext = first.next;
               ListNode secondNext = second.next;
               first.next = second;
               second.next = firstNext;
               first = firstNext;
               second = secondNext;
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn reorder_list(head: &mut Option<Box<ListNode>>) {
           fn reverse(
               mut list: Option<Box<ListNode>>,
           ) -> Option<Box<ListNode>> {
               let mut reversed = None;
               while let Some(mut node) = list.take() {
                   list = node.next.take();
                   node.next = reversed;
                   reversed = Some(node);
               }
               reversed
           }

           let mut length = 0usize;
           let mut cursor = head.as_ref();
           while let Some(node) = cursor {
               length += 1;
               cursor = node.next.as_ref();
           }
           if length <= 2 {
               return;
           }

           let first_length = (length + 1) / 2;
           let second = {
               let mut split_link = &mut *head;
               for _ in 1..first_length {
                   split_link = &mut split_link
                       .as_mut()
                       .expect("length guarantees this node")
                       .next;
               }
               split_link
                   .as_mut()
                   .expect("the first half is nonempty")
                   .next
                   .take()
           };

           let mut first = head.take();
           let mut second = reverse(second);
           let mut result = None;

           {
               let mut tail_link = &mut result;
               while let Some(mut first_node) = first.take() {
                   first = first_node.next.take();
                   *tail_link = Some(first_node);
                   tail_link = &mut tail_link
                       .as_mut()
                       .expect("a first node was just appended")
                       .next;

                   if let Some(mut second_node) = second.take() {
                       second = second_node.next.take();
                       *tail_link = Some(second_node);
                       tail_link = &mut tail_link
                           .as_mut()
                           .expect("a second node was just appended")
                           .next;
                   }
               }

               // 由两段长度关系可知此处 second 必为空。
               *tail_link = second;
           }

           *head = result;
       }
   }

Go
~~

.. code-block:: go

   func reorderList(head *ListNode) {
       if head == nil || head.Next == nil {
           return
       }

       slow, fast := head, head.Next
       for fast != nil && fast.Next != nil {
           slow = slow.Next
           fast = fast.Next.Next
       }

       second := slow.Next
       slow.Next = nil

       var previous *ListNode
       for second != nil {
           following := second.Next
           second.Next = previous
           previous = second
           second = following
       }

       first := head
       second = previous
       for second != nil {
           firstNext := first.Next
           secondNext := second.Next
           first.Next = second
           second.Next = firstNext
           first = firstNext
           second = secondNext
       }
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function reorderList(head: ListNode | null): void {
       if (head === null || head.next === null) {
           return;
       }

       let slow: ListNode = head;
       let fast: ListNode | null = head.next;
       while (fast !== null && fast.next !== null) {
           slow = slow.next!;
           fast = fast.next.next;
       }

       let second: ListNode | null = slow.next;
       slow.next = null;

       let previous: ListNode | null = null;
       while (second !== null) {
           const following: ListNode | null = second.next;
           second.next = previous;
           previous = second;
           second = following;
       }

       let first: ListNode | null = head;
       second = previous;
       while (second !== null) {
           const firstNode: ListNode = first!;
           const firstNext: ListNode | null = firstNode.next;
           const secondNext: ListNode | null = second.next;
           firstNode.next = second;
           second.next = firstNext;
           first = firstNext;
           second = secondNext;
       }
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public void ReorderList(ListNode head) {
           if (head == null || head.next == null) {
               return;
           }

           ListNode slow = head;
           ListNode fast = head.next;
           while (fast != null && fast.next != null) {
               slow = slow.next;
               fast = fast.next.next;
           }

           ListNode second = slow.next;
           slow.next = null;

           ListNode previous = null;
           while (second != null) {
               ListNode following = second.next;
               second.next = previous;
               previous = second;
               second = following;
           }

           ListNode first = head;
           second = previous;
           while (second != null) {
               ListNode firstNext = first.next;
               ListNode secondNext = second.next;
               first.next = second;
               second.next = firstNext;
               first = firstNext;
               second = secondNext;
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function reorder_list!(head::Union{Nothing, ListNode})::Nothing
       if head === nothing || head.next === nothing
           return nothing
       end

       slow = head
       fast = head.next
       while fast !== nothing && fast.next !== nothing
           slow = slow.next
           fast = fast.next.next
       end

       second = slow.next
       slow.next = nothing

       previous = nothing
       while second !== nothing
           following = second.next
           second.next = previous
           previous = second
           second = following
       end

       first = head
       second = previous
       while second !== nothing
           first_next = first.next
           second_next = second.next
           first.next = second
           second.next = first_next
           first = first_next
           second = second_next
       end

       return nothing
   end

R
~

.. code-block:: r

   reorder_list <- function(head) {
     if (is.null(head) || is.null(head$next)) {
       return(invisible(head))
     }

     slow <- head
     fast <- head$next
     while (!is.null(fast) && !is.null(fast$next)) {
       slow <- slow$next
       fast <- fast$next$next
     }

     second <- slow$next
     slow$next <- NULL

     previous <- NULL
     while (!is.null(second)) {
       following <- second$next
       second$next <- previous
       previous <- second
       second <- following
     }

     first <- head
     second <- previous
     while (!is.null(second)) {
       first_next <- first$next
       second_next <- second$next
       first$next <- second
       second$next <- first_next
       first <- first_next
       second <- second_next
     }

     invisible(head)
   }

语言语义专项说明
----------------

* **C/C++**：函数只重连平台拥有的节点，不分配、释放或复制节点；调用者仍负责节点生命周期。
* **Python/Java/Go/TypeScript/C#**：局部变量复制的是节点引用，字段赋值修改同一对象。合并前同时保存
  两段后继，避免第一次赋值覆盖继续遍历所需的边。
* **Rust**：输入是无环的 ``Option<Box<ListNode>>`` 独占链。``Option::take`` 把槽位中的所有权移出并
  留下 ``None``；反转和尾槽位拼接始终移动原 ``Box``，没有 ``Rc``、``unsafe`` 或节点克隆。
  ``result`` 只是新的根所有权槽位，不是额外链表副本。重建循环每轮先追加一个 ``Fi``，再在存在时追加
  一个 ``Ri``；偶数长度正好追加 ``b`` 对，奇数长度最后再追加中点 ``Fb``，所以它与正文的交替顺序等价。
  每个待追加节点都先把旧 ``next`` ``take`` 为空，``tail_link`` 又始终指向结果链当前的空尾槽位，因而
  Rust 的替代控制流同样保持节点分区并保证最终无环。
* **Julia**：统一节点模型必须是 ``mutable struct``；``=== nothing`` 判断空引用，字段赋值对共享节点可见。
* **R**：普通 list 的写时复制语义不适合作为此处的节点身份模型。实现要求节点为 environment，赋值
  ``node$next <- ...`` 才会沿原对象身份原地改边。

人工推演与静态审查
------------------

本题按仓库策略没有运行、编译或测试任何题解代码，也没有进行对拍、穷举、属性测试或 sanitizer。
以下是本轮实际完成的人工推演与静态语义审查，不把它们表述为运行通过。

**偶数四节点。** ``A -> B -> C -> D`` 中，快慢指针把 ``slow`` 停在 ``B``；断边得到
``A -> B`` 与 ``C -> D``，反转后为 ``D -> C``。两轮合并依次得到
``A -> D -> B``、``A -> D -> B -> C``，最后 ``C.next`` 为空。

**奇数五节点。** ``A -> B -> C -> D -> E`` 切成 ``A -> B -> C`` 与 ``D -> E``；反转后
第二段为 ``E -> D``。两轮合并得到 ``A -> E -> B -> D -> C``，中点 ``C`` 没有被第二段覆盖，
且它在切分阶段已经成为空尾。

**最短与重复值。** 对 ``m=1``、``m=2``，提前返回与目标顺序一致；对四个值都相同的节点，人工审查按
``A、B、C、D`` 身份追踪，确认输出身份顺序而不是仅核对值序列。

**逐语言静态核对。** 已逐项检查十种实现的公开返回形态、空引用守卫、字段名、切分断边、反转前保存后继、
合并前保存两段后继以及无额外节点分配。Rust 路径专项核对了 ``Box`` 的移动边界、``take`` 后槽位为空、
切分借用在 ``head.take()`` 前结束，以及尾槽位每次只指向当前空 ``next``；R 路径按 environment 引用对象
解释原地可见性。由于没有交给目标编译器或运行时，仍保留拼写、平台模板差异、Rust 借用检查器版本诊断和
R/Julia 节点定义不一致等剩余风险。

关键边界与失败方式
------------------

* 快指针若从 ``head`` 出发却沿用同一循环和切分写法，偶数长度的前半段可能多一个节点；
* 不执行 ``slow.next = null``，第一段会保留跨段旧边，反转或合并后可能出现回边和环；
* 反转时先覆盖 ``second.next`` 再保存后继，会永久丢失尚未处理的后缀；
* 合并时不同时保存 ``first_next``、``second_next``，第一次改边可能破坏下一轮入口；
* 以 ``val`` 交换代替节点重连，在重复值输入上尤其难以察觉，但直接违反身份契约；
* 以“每阶段都是线性”代替阶段接口证明，无法排除切分重叠、反转丢节点或最终尾部未清空；
* Rust 使用 ``Rc<RefCell<_>>`` 会把本题独占无环链改成共享内部可变图，改变平台类型和所有权成本；
* R 若用普通 list 节点而不采用 environment，局部字段更新可能受到写时复制影响，不能直接声称原地可见。

学习链
------

本题在知识账本中新增或强化三组能力：

* **切分—反转—合并**：把“从两端交替取”转换为两条只能向前遍历的链；
* **拓扑节点守恒证明**：每阶段都显式交付节点分区、连通性、无环性和尾部终止条件；
* **所有权替代控制流**：Rust 不机械翻译多可变指针，而用长度、``take`` 与尾槽位表达相同算法。

关联题目
~~~~~~~~

* `0114. Flatten Binary Tree to Linked List <0114-flatten-binary-tree-to-linked-list.rst>`_：同样要求原地改边，
  需要证明节点身份、可达性和无环性；
* `0141. Linked List Cycle <0141-linked-list-cycle.rst>`_：只读检测环，帮助区分“检查拓扑”与本题“修改拓扑”；
* `0142. Linked List Cycle II <0142-linked-list-cycle-ii.rst>`_：返回原节点身份，但其循环对象模型不能直接移植到
  本题的 ``Option<Box<ListNode>>`` 无环独占链；
* `0147. Insertion Sort List <0147-insertion-sort-list.rst>`_：后续继续练习断链、保存后继和原节点重连。

自检与答案
----------

#. **为什么快指针从 ``head.next`` 开始？**

   这样循环结束时，偶数长度前半段与后半段等长，奇数长度前半段恰好多一个中点；统一得到
   ``ceil(m/2)`` 与 ``floor(m/2)`` 的切分。

#. **为什么反转前必须断开 ``slow.next``？**

   断边使两段成为互不相交、各自以空引用结束的链。若保留跨段旧边，后续改向可能让节点再次指回已连接部分，
   破坏节点分区并形成环。

#. **怎样证明合并时 ``first`` 不会先为空？**

   切分后第一段长度为 ``ceil(m/2)``，第二段长度为 ``floor(m/2)``。每轮两段各消费一个节点，因此只要
   ``second`` 非空，``first`` 必然也非空。

#. **Rust 的 ``result`` 是否意味着使用了 ``O(m)`` 新空间？**

   不是。``result`` 只是一个根槽位；每次从 ``first`` 或 ``second`` 中 ``take`` 出原 ``Box`` 并挂到尾槽位，
   没有复制节点或分配引用数组，活跃辅助状态数量为常数。

#. **仅验证输出值序列为什么不够？**

   契约要求重连原节点且不改值。同值节点可能掩盖交换 ``val``、复制节点或重复使用节点等错误，必须同时核对
   节点身份集合、节点数量、顺序、尾部空引用和无环性。
