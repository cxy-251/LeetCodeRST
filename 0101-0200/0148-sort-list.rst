0148. Sort List
===============

题目信息
--------

:题号: 0148
:难度: Medium
:主题: 链表、归并排序、迭代
:原题: `LeetCode 0148 <https://leetcode.com/problems/sort-list/>`_
:访问状态: Available
:教学重点: 定长 run 切分、稳定合并、逐轮节点覆盖、常量核心工作空间

精确契约
--------

输入是一条可空、无环的单链表 ``head``，节点数 ``n`` 在 ``0..50000`` 内；每个节点含范围为
``[-100000, 100000]`` 的整数 ``val`` 和后继 ``next``。返回一条满足以下条件的链：

* 节点值按非递减顺序排列；
* 输入中的每个节点对象恰好出现一次，没有复制、遗漏或额外的结果节点；
* 只重写原节点的 ``next``，返回值可能不是原 ``head``；
* 目标时间为 ``O(n log n)``，核心额外工作空间为 ``O(1)``。

最后一条排除了以递归自顶向下归并作为主实现：它的算法思路正确，但会使用 ``O(log n)`` 调用栈。本文采用
非递归、自底向上的归并排序。稳定性并非题目判断结果的必要条件，但本文额外保证：输入中值相等的节点保持原相对
次序。这样也能把 ``<=`` 的比较方向和节点身份一起纳入证明。

自建示例
--------

多轮 run 示例
~~~~~~~~~~~~~~

给五个节点加身份标签：

``A(4) -> B(2) -> C(1) -> D(3) -> E(2) -> NULL``。

``width`` 表示本轮每条输入 run 的最大长度。

* ``width = 1``：依次合并 ``[A4] + [B2]``、``[C1] + [D3]``、``[E2] + []``，得到
  ``B2 -> A4 | C1 -> D3 | E2``；
* ``width = 2``：合并 ``[B2,A4] + [C1,D3]``，尾部 ``[E2]`` 没有配对的右 run，得到
  ``C1 -> B2 -> D3 -> A4 | E2``；
* ``width = 4``：合并 ``[C1,B2,D3,A4] + [E2]``，得到
  ``C1 -> B2 -> E2 -> D3 -> A4``。

竖线只表示某轮结束后的 run 边界，不存进链表。``B(2)`` 在 ``E(2)`` 之前，说明跨 run 遇到相等值时必须先取
左 run 的节点。五节点同时覆盖了奇数尾 run、空右 run、末轮两侧长度不等和三次宽度翻倍。

为什么不能只交换值
~~~~~~~~~~~~~~~~~~~~

设输入为 ``X(3) -> Y(1)``，调用者还持有节点 ``X`` 的引用。若只交换 ``val``，返回值序列虽然是 ``1,3``，
但节点 ``X`` 的值被改写；本文的契约是重连原节点，正确身份顺序应为 ``Y -> X``。因此人工审查必须追踪节点身份
和边，而不能只核对值序列。

问题抽象与解法取舍
------------------

数组归并通常需要辅助数组，而链表已经用 ``next`` 表达顺序：只要切断两条有序 run，再把较小的首节点接到输出尾，
就能原地复用节点。真正需要解决的不是“怎样比较”，而是四个结构问题：

#. 怎样在不知道随机下标的情况下得到长度至多 ``width`` 的独立 run；
#. 怎样合并时既返回有序链，又立即知道它的真实尾节点；
#. 怎样保证一轮内旧前缀、当前 runs 和剩余后缀始终不重叠；
#. 怎样逐轮扩大有序块而不用递归栈。

自底向上归并先扫描一次得到 ``n``。第 ``k`` 轮令 ``width = 2^k``，把当前链依次切成两条长度至多
``width`` 的有序 run，稳定合并后追加到新输出。轮末每条有序 run 的最大长度变为 ``2 * width``。当
``width >= n`` 时，整条链至多只有一条 run，排序完成。

其他方案的取舍如下：

* 插入排序能原地重连，但一般输入需要 ``O(n^2)`` 时间；
* 把节点或值放进数组再排序，容易实现，却需要 ``O(n)`` 额外空间，并可能破坏节点身份契约；
* 自顶向下归并时间正确、代码较短，但递归栈不是严格常量空间；
* 堆排序难以利用单链表，只为访问堆下标就要另建节点引用数组。

状态、操作与代码变量
------------------

一轮归并维护以下状态：

``n``
   初次扫描得到的节点总数，之后不变。

``width``
   当前输入 run 的最大长度，从 1 开始逐轮翻倍。

``current`` / ``source``
   尚未切分后缀的入口。每次先从这里取 ``left``，再取 ``right``。

``left``、``right``
   已断开、互不相交且各自有序的两条 run；右 run 可以为空。

``dummy.next`` 与 ``tail``
   普通语言中本轮已经合并完的输出前缀及其真实尾节点。保存本轮输入入口后先清空 ``dummy.next``，所以该前缀
   初始为空。dummy 只是一枚固定哨兵，不属于结果。

``result`` 与 ``output``
   Rust 中对应输出根槽和尾部空链接槽。``output`` 总是指向“下一个节点应该放入的位置”，因此无需 dummy
   ``Box`` 或再次扫描寻找尾部。

两个辅助操作承担清晰的局部合同：

``split_run(head, width)``
   从 ``head`` 起保留至多 ``width`` 个节点作为一条 run，令该 run 的尾 ``next`` 为空，返回剩余后缀入口。
   空 ``head`` 返回空。

``merge_runs(left, right, tail)``
   消费两条已断开的有序 run，把节点逐个接到 ``tail`` 后，返回合并结果的真实尾节点。相等时取 ``left``。
   Rust 版本返回新的尾部空槽，而不是节点指针。

算法步骤
--------

#. 顺链计数得到 ``n``；若 ``n`` 为 0 或 1，外层循环自然不执行。
#. 令 ``width = 1``。
#. 新建固定 dummy，使其 ``next`` 指向当前链头；每轮先令 ``current = dummy.next``，再清空 ``dummy.next``
   作为输出根槽，并令 ``tail = dummy``。
#. 当 ``current`` 非空时：

   #. ``left = current``，调用一次 ``split_run`` 得到 ``right``；
   #. 再对 ``right`` 调用 ``split_run``，得到新的 ``current``；
   #. 稳定合并 ``left``、``right`` 到 ``tail`` 后面，并把 ``tail`` 更新为真实尾。

#. 本轮结束后令头为 ``dummy.next``，把 ``width`` 翻倍，开始下一轮。
#. 当 ``width >= n`` 时返回当前头。

实现把两条 run 的剩余节点也逐个消费，因此合并结束时已经持有真实尾，不会“先整体接上，再沿剩余链找尾”。这既
让尾部合同直接可证，也避免隐蔽的二次遍历。

核心不变量
----------

run 切分不变量
~~~~~~~~~~~~~~

在 ``split_run(head, width)`` 的游标前进过程中，游标位于当前 run 已保留前缀的最后一个节点；已走节点数不超过
``width``。循环因已保留 ``width`` 个节点或遇到原链尾而停止。保存 ``tail.next`` 后将其清空，于是返回时：

* 左侧 run 长度在 ``1..width`` 内，内部次序未变，尾边为空；
* 返回后缀恰从原链下一个节点开始；
* run 与后缀不共享节点，也不存在跨边。

稳定合并不变量
~~~~~~~~~~~~~~

每次比较前，本次合并已经接入的局部输出段非递减，包含且只包含两条 run 中已消费的节点；若该局部段非空，
其尾值不大于两条未消费首节点。更早完成的输出只是一串有序 runs，不要求跨 run 边界整体有序，且本次合并不会
改写它。``left`` 和 ``right`` 仍各自有序且互不相交。选择较小首节点接入后这些性质保持；相等时选择左侧节点，
保持跨 run 的相等身份次序。每步严格消费一个节点，所以必然终止，返回的 ``tail`` 是最后接入节点且
``tail.next`` 为空。

单轮分区不变量
~~~~~~~~~~~~~~

一轮任意时刻，原节点集合被精确分成四部分：

#. 已合并输出前缀；
#. 当前 ``left`` 未消费部分；
#. 当前 ``right`` 未消费部分；
#. ``current`` 指向的未处理后缀。

四部分两两不交，并集是全部原节点。切分只移动分界并清空跨边；合并只从左右部分各取一个节点追加到输出。因此
节点不会遗漏或重复。输出只从尾部接入不在输出中的节点，尾槽在接入前为空，所以不会形成环。

宽度不变量
~~~~~~~~~~

``width = w`` 的一轮开始时，链可按当前位置连续划分为长度至多 ``w`` 的有序 runs。第一轮 ``w=1`` 时每个
单节点 run 天然有序。合并相邻两条 run 后，每条输出 run 有序且长度至多 ``2w``，所以把宽度翻倍后不变量成立。

正确性证明
----------

引理一：``split_run`` 满足切分合同
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若输入为空，返回空显然正确。否则游标从首节点开始，至多再前进 ``width-1`` 次，并在原链提前结束时停止，因此
保留长度是 ``min(width, 原剩余长度)``。游标只沿原 ``next`` 前进，没有改变内部顺序。最后先保存游标的旧
``next``，再把该边置空；故保留 run 与返回后缀分别精确覆盖原链的前、后两段，二者不交且没有跨边。引理成立。

引理二：``merge_runs`` 返回稳定有序、节点守恒且尾部准确的链
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由稳定合并不变量，每步接入的节点不大于两个 run 此后仍可选择的任何首节点，所以输出前缀始终非递减。每步只从
某一 run 移走其首节点并接入一次，节点集合守恒；有限节点数每步减一，循环终止。若值相等，左节点先接入，结合
每条 run 内部次序未变，合并稳定。最后一次接入后，两条 run 都空，代码把尾边保持为空并返回该尾；故有序性、
稳定性、节点守恒和真实尾合同全部成立。

引理三：一轮精确覆盖全部节点，并产生长度至多 ``2 * width`` 的有序 runs
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理一，每次两次切分从未处理后缀取出相邻且互不相交的左右 runs，并让 ``current`` 严格前进到其后；短尾只会
使右 run 为空，不会丢失节点。由引理二，这两条 run 被完整合并并追加到输出真实尾。单轮分区不变量归纳保证每个
原节点恰好从未处理后缀进入一次输入 run，再进入一次输出，且始终连成一条无环链。两条输入 run 各长至多
``width``，所以输出 run 长至多 ``2 * width``。引理成立。

引理四：外层循环终止时整链有序
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

宽度从 1 开始，每轮乘 2。题目规模有限，且约束上界使这里的整数类型足以表示所有中间宽度；当 ``n > 1`` 时，
经过 ``ceil(log2 n)`` 轮就有 ``width >= n``。根据宽度不变量，此时整条长度为 ``n`` 的链至多是一条有序 run。
``n`` 为 0 或 1 时无需任何一轮，链本来有序。

定理：算法满足题目契约
~~~~~~~~~~~~~~~~~~~~~~

引理四给出最终非递减顺序；引理三给出全部原节点恰好出现一次、连通、无环且尾边为空；引理二给出稳定性。算法只
重写这些节点的 ``next``，没有创建与 ``n`` 同阶的结果结构。因此返回链满足完整契约。

复杂度与真实语言成本
--------------------

计数扫描耗时 ``O(n)``。每一轮中，切分游标合计走过 ``O(n)`` 个节点，合并又恰好消费 ``n`` 个节点，因此一轮
是 ``O(n)``；宽度翻倍产生 ``ceil(log2 n)`` 轮，总时间 ``O(n log n)``。

普通语言保存计数、宽度和常数个节点引用，并只建立一个固定 dummy，核心额外空间 ``O(1)``。dummy 不进入结果；
C/C++ 在栈上构造它，托管语言至多额外分配一个对象。Rust 不分配 dummy，根槽、两条 run 和尾槽都是常数个
``Option``/引用，节点 ``Box`` 被移动而不克隆。因此所有实现都没有递归栈、节点数组或同规模新链，核心额外空间
为 ``O(1)``。判题框架已有的输入节点、返回链和运行时元数据不计入算法工作空间。

十语言实现
----------

平台已提供各语言的 ``ListNode`` 定义；下面不重复声明。全部实现复用原节点，且辅助合并逐个消费剩余 run 以直接
得到尾部。

C
~

.. code-block:: c

   static struct ListNode *split_run(
       struct ListNode *head,
       int width
   ) {
       if (head == NULL) {
           return NULL;
       }

       struct ListNode *tail = head;
       for (int length = 1;
            length < width && tail->next != NULL;
            ++length) {
           tail = tail->next;
       }

       struct ListNode *rest = tail->next;
       tail->next = NULL;
       return rest;
   }

   static struct ListNode *merge_runs(
       struct ListNode *left,
       struct ListNode *right,
       struct ListNode *tail
   ) {
       while (left != NULL || right != NULL) {
           if (right == NULL ||
               (left != NULL && left->val <= right->val)) {
               struct ListNode *next = left->next;
               tail->next = left;
               left = next;
           } else {
               struct ListNode *next = right->next;
               tail->next = right;
               right = next;
           }
           tail = tail->next;
       }
       tail->next = NULL;
       return tail;
   }

   struct ListNode *sortList(struct ListNode *head) {
       int n = 0;
       for (struct ListNode *node = head;
            node != NULL;
            node = node->next) {
           ++n;
       }

       struct ListNode dummy = {0, head};
       for (int width = 1; width < n; width *= 2) {
           struct ListNode *tail = &dummy;
           struct ListNode *current = dummy.next;
           dummy.next = NULL;

           while (current != NULL) {
               struct ListNode *left = current;
               struct ListNode *right = split_run(left, width);
               current = split_run(right, width);
               tail = merge_runs(left, right, tail);
           }
       }
       return dummy.next;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
       static ListNode *splitRun(ListNode *head, int width) {
           if (head == nullptr) {
               return nullptr;
           }
           ListNode *tail = head;
           for (int length = 1;
                length < width && tail->next != nullptr;
                ++length) {
               tail = tail->next;
           }
           ListNode *rest = tail->next;
           tail->next = nullptr;
           return rest;
       }

       static ListNode *mergeRuns(
           ListNode *left,
           ListNode *right,
           ListNode *tail
       ) {
           while (left != nullptr || right != nullptr) {
               if (right == nullptr ||
                   (left != nullptr && left->val <= right->val)) {
                   ListNode *next = left->next;
                   tail->next = left;
                   left = next;
               } else {
                   ListNode *next = right->next;
                   tail->next = right;
                   right = next;
               }
               tail = tail->next;
           }
           tail->next = nullptr;
           return tail;
       }

   public:
       ListNode *sortList(ListNode *head) {
           int n = 0;
           for (ListNode *node = head;
                node != nullptr;
                node = node->next) {
               ++n;
           }

           ListNode dummy(0);
           dummy.next = head;
           for (int width = 1; width < n; width *= 2) {
               ListNode *tail = &dummy;
               ListNode *current = dummy.next;
               dummy.next = nullptr;
               while (current != nullptr) {
                   ListNode *left = current;
                   ListNode *right = splitRun(left, width);
                   current = splitRun(right, width);
                   tail = mergeRuns(left, right, tail);
               }
           }
           return dummy.next;
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
           n = 0
           node = head
           while node is not None:
               n += 1
               node = node.next

           dummy = ListNode(0, head)
           width = 1
           while width < n:
               tail = dummy
               current = dummy.next
               dummy.next = None
               while current is not None:
                   left = current
                   right = self._split_run(left, width)
                   current = self._split_run(right, width)
                   tail = self._merge_runs(left, right, tail)
               width *= 2
           return dummy.next

       def _split_run(
           self,
           head: Optional[ListNode],
           width: int,
       ) -> Optional[ListNode]:
           if head is None:
               return None
           tail = head
           length = 1
           while length < width and tail.next is not None:
               tail = tail.next
               length += 1
           rest = tail.next
           tail.next = None
           return rest

       def _merge_runs(
           self,
           left: Optional[ListNode],
           right: Optional[ListNode],
           tail: ListNode,
       ) -> ListNode:
           while left is not None or right is not None:
               if right is None or (
                   left is not None and left.val <= right.val
               ):
                   next_node = left.next
                   tail.next = left
                   left = next_node
               else:
                   next_node = right.next
                   tail.next = right
                   right = next_node
               tail = tail.next
           tail.next = None
           return tail

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode sortList(ListNode head) {
           int n = 0;
           for (ListNode node = head; node != null; node = node.next) {
               ++n;
           }

           ListNode dummy = new ListNode(0, head);
           for (int width = 1; width < n; width *= 2) {
               ListNode tail = dummy;
               ListNode current = dummy.next;
               dummy.next = null;
               while (current != null) {
                   ListNode left = current;
                   ListNode right = splitRun(left, width);
                   current = splitRun(right, width);
                   tail = mergeRuns(left, right, tail);
               }
           }
           return dummy.next;
       }

       private ListNode splitRun(ListNode head, int width) {
           if (head == null) {
               return null;
           }
           ListNode tail = head;
           for (int length = 1;
                length < width && tail.next != null;
                ++length) {
               tail = tail.next;
           }
           ListNode rest = tail.next;
           tail.next = null;
           return rest;
       }

       private ListNode mergeRuns(
           ListNode left,
           ListNode right,
           ListNode tail
       ) {
           while (left != null || right != null) {
               if (right == null ||
                   (left != null && left.val <= right.val)) {
                   ListNode next = left.next;
                   tail.next = left;
                   left = next;
               } else {
                   ListNode next = right.next;
                   tail.next = right;
                   right = next;
               }
               tail = tail.next;
           }
           tail.next = null;
           return tail;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn sort_list(
           mut head: Option<Box<ListNode>>,
       ) -> Option<Box<ListNode>> {
           fn take_run(
               source: &mut Option<Box<ListNode>>,
               width: usize,
           ) -> Option<Box<ListNode>> {
               let mut run = source.take();
               if run.is_none() {
                   return None;
               }

               {
                   let mut tail = run
                       .as_mut()
                       .expect("non-empty run has a first node");
                   for _ in 1..width {
                       if tail.next.is_none() {
                           break;
                       }
                       tail = tail
                           .next
                           .as_mut()
                           .expect("next was checked as present");
                   }
                   *source = tail.next.take();
               }
               run
           }

           fn merge_runs<'a>(
               mut left: Option<Box<ListNode>>,
               mut right: Option<Box<ListNode>>,
               mut output: &'a mut Option<Box<ListNode>>,
           ) -> &'a mut Option<Box<ListNode>> {
               while left.is_some() || right.is_some() {
                   let take_left = match (left.as_ref(), right.as_ref()) {
                       (Some(left_node), Some(right_node)) => {
                           left_node.val <= right_node.val
                       }
                       (Some(_), None) => true,
                       (None, Some(_)) => false,
                       (None, None) => unreachable!(),
                   };

                   let node = if take_left {
                       let mut node = left
                           .take()
                           .expect("left was selected as non-empty");
                       left = node.next.take();
                       node
                   } else {
                       let mut node = right
                           .take()
                           .expect("right was selected as non-empty");
                       right = node.next.take();
                       node
                   };

                   *output = Some(node);
                   output = &mut output
                       .as_mut()
                       .expect("the output slot was just filled")
                       .next;
               }
               output
           }

           let mut n = 0_usize;
           let mut cursor = head.as_ref();
           while let Some(node) = cursor {
               n += 1;
               cursor = node.next.as_ref();
           }

           let mut width = 1_usize;
           while width < n {
               let mut source = head.take();
               let mut result = None;
               {
                   let mut output = &mut result;
                   while source.is_some() {
                       let left = take_run(&mut source, width);
                       let right = take_run(&mut source, width);
                       output = merge_runs(left, right, output);
                   }
               }
               head = result;
               width *= 2;
           }
           head
       }
   }

Go
~~

.. code-block:: go

   func sortList(head *ListNode) *ListNode {
       n := 0
       for node := head; node != nil; node = node.Next {
           n++
       }

       dummy := &ListNode{Val: 0, Next: head}
       for width := 1; width < n; width *= 2 {
           tail := dummy
           current := dummy.Next
           dummy.Next = nil
           for current != nil {
               left := current
               right := splitRun(left, width)
               current = splitRun(right, width)
               tail = mergeRuns(left, right, tail)
           }
       }
       return dummy.Next
   }

   func splitRun(head *ListNode, width int) *ListNode {
       if head == nil {
           return nil
       }
       tail := head
       for length := 1; length < width && tail.Next != nil; length++ {
           tail = tail.Next
       }
       rest := tail.Next
       tail.Next = nil
       return rest
   }

   func mergeRuns(left *ListNode, right *ListNode, tail *ListNode) *ListNode {
       for left != nil || right != nil {
           if right == nil || (left != nil && left.Val <= right.Val) {
               next := left.Next
               tail.Next = left
               left = next
           } else {
               next := right.Next
               tail.Next = right
               right = next
           }
           tail = tail.Next
       }
       tail.Next = nil
       return tail
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sortList(head: ListNode | null): ListNode | null {
       let n = 0;
       for (let node = head; node !== null; node = node.next) {
           ++n;
       }

       const dummy = new ListNode(0, head);
       for (let width = 1; width < n; width *= 2) {
           let tail = dummy;
           let current = dummy.next;
           dummy.next = null;
           while (current !== null) {
               const left = current;
               const right = splitRun(left, width);
               current = splitRun(right, width);
               tail = mergeRuns(left, right, tail);
           }
       }
       return dummy.next;
   }

   function splitRun(
       head: ListNode | null,
       width: number,
   ): ListNode | null {
       if (head === null) {
           return null;
       }
       let tail = head;
       let length = 1;
       while (length < width && tail.next !== null) {
           tail = tail.next;
           ++length;
       }
       const rest = tail.next;
       tail.next = null;
       return rest;
   }

   function mergeRuns(
       left: ListNode | null,
       right: ListNode | null,
       tail: ListNode,
   ): ListNode {
       while (left !== null || right !== null) {
           if (
               right === null ||
               (left !== null && left.val <= right.val)
           ) {
               const next = left!.next;
               tail.next = left;
               left = next;
           } else {
               const next = right.next;
               tail.next = right;
               right = next;
           }
           tail = tail.next!;
       }
       tail.next = null;
       return tail;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode SortList(ListNode head) {
           int n = 0;
           for (ListNode node = head; node != null; node = node.next) {
               ++n;
           }

           ListNode dummy = new ListNode(0, head);
           for (int width = 1; width < n; width *= 2) {
               ListNode tail = dummy;
               ListNode current = dummy.next;
               dummy.next = null;
               while (current != null) {
                   ListNode left = current;
                   ListNode right = SplitRun(left, width);
                   current = SplitRun(right, width);
                   tail = MergeRuns(left, right, tail);
               }
           }
           return dummy.next;
       }

       private static ListNode SplitRun(ListNode head, int width) {
           if (head == null) {
               return null;
           }
           ListNode tail = head;
           for (int length = 1;
                length < width && tail.next != null;
                ++length) {
               tail = tail.next;
           }
           ListNode rest = tail.next;
           tail.next = null;
           return rest;
       }

       private static ListNode MergeRuns(
           ListNode left,
           ListNode right,
           ListNode tail
       ) {
           while (left != null || right != null) {
               if (right == null ||
                   (left != null && left.val <= right.val)) {
                   ListNode next = left.next;
                   tail.next = left;
                   left = next;
               } else {
                   ListNode next = right.next;
                   tail.next = right;
                   right = next;
               }
               tail = tail.next;
           }
           tail.next = null;
           return tail;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function split_run!(
       head::Union{Nothing,ListNode},
       width::Int,
   )::Union{Nothing,ListNode}
       head === nothing && return nothing
       tail = head
       length = 1
       while length < width && tail.next !== nothing
           tail = tail.next
           length += 1
       end
       rest = tail.next
       tail.next = nothing
       return rest
   end

   function merge_runs!(
       left::Union{Nothing,ListNode},
       right::Union{Nothing,ListNode},
       tail::ListNode,
   )::ListNode
       while left !== nothing || right !== nothing
           if right === nothing ||
              (left !== nothing && left.val <= right.val)
               next_node = left.next
               tail.next = left
               left = next_node
           else
               next_node = right.next
               tail.next = right
               right = next_node
           end
           tail = tail.next
       end
       tail.next = nothing
       return tail
   end

   function sort_list!(
       head::Union{Nothing,ListNode},
   )::Union{Nothing,ListNode}
       n = 0
       node = head
       while node !== nothing
           n += 1
           node = node.next
       end

       dummy = ListNode(0, head)
       width = 1
       while width < n
           tail = dummy
           current = dummy.next
           dummy.next = nothing
           while current !== nothing
               left = current
               right = split_run!(left, width)
               current = split_run!(right, width)
               tail = merge_runs!(left, right, tail)
           end
           width *= 2
       end
       return dummy.next
   end

R
~

.. code-block:: r

   split_run <- function(head, width) {
     if (is.null(head)) return(NULL)
     tail <- head
     length <- 1L
     while (length < width && !is.null(tail$next)) {
       tail <- tail$next
       length <- length + 1L
     }
     rest <- tail$next
     tail$next <- NULL
     rest
   }

   merge_runs <- function(left, right, tail) {
     while (!is.null(left) || !is.null(right)) {
       if (is.null(right) ||
           (!is.null(left) && left$val <= right$val)) {
         next_node <- left$next
         tail$next <- left
         left <- next_node
       } else {
         next_node <- right$next
         tail$next <- right
         right <- next_node
       }
       tail <- tail$next
     }
     tail$next <- NULL
     tail
   }

   sort_list <- function(head) {
     n <- 0L
     node <- head
     while (!is.null(node)) {
       n <- n + 1L
       node <- node$next
     }

     dummy <- new_list_node(0L, head)
     width <- 1L
     while (width < n) {
       tail <- dummy
       current <- dummy$next
       dummy$next <- NULL
       while (!is.null(current)) {
         left <- current
         right <- split_run(left, width)
         current <- split_run(right, width)
         tail <- merge_runs(left, right, tail)
       }
       width <- width * 2L
     }
     dummy$next
   }

人工推演与静态审查
------------------

本题按仓库统一策略没有运行、编译或测试任何题解代码，也没有执行官方示例、对拍、穷举、属性测试、sanitizer
或目标语言最小程序。以下只记录实际完成的人工推演与逐语言静态语义核对。

五节点逐轮推演
~~~~~~~~~~~~~~

对 ``A4 -> B2 -> C1 -> D3 -> E2`` 逐段记录如下：

* ``width=1`` 第一段切出 ``left=[A]``、``right=[B]``、``rest=[C,D,E]``，合并为 ``[B,A]``，输出尾是
  A；第二段切出 ``[C]``、``[D]``、``[E]``，合并后尾是 D；第三段切出 ``[E]``、空右 run、空 rest，
  合并后尾是 E。输出身份集合仍为 ``{A,B,C,D,E}``。
* ``width=2`` 切出 ``left=[B,A]``、``right=[C,D]``、``rest=[E]``，合并为 ``[C,B,D,A]``，尾是 A；
  再处理 ``left=[E]``、空右 run，尾是 E。
* ``width=4`` 切出 ``left=[C,B,D,A]``、``right=[E]``、空 rest，稳定合并为 ``[C,B,E,D,A]``，尾是
  A。此时宽度翻为 8，不再进入下一轮。

每次切分都核对旧跨边已清空；每次合并后核对输出尾 ``next`` 为空、已输出集合与 rest 不交。最终 B 在 E 前，
值序列为 ``1,2,2,3,4``。

官方示例人工核对
~~~~~~~~~~~~~~~~

* ``[4,2,1,3]`` 在 ``width=1`` 后成为 ``[2,4] | [1,3]``，``width=2`` 后成为
  ``[1,2,3,4]``；
* ``[-1,5,3,4,0]`` 三轮依次成为 ``[-1,5] | [3,4] | [0]``、
  ``[-1,3,4,5] | [0]``、``[-1,0,3,4,5]``；
* 空输入计数为 0，外层循环不执行，返回空头。

这些是按代码状态做的纸面推演，不是执行结果。

边界推演
~~~~~~~~

* 空链和单节点的 ``n`` 分别为 0、1，``width < n`` 为假，直接返回；
* 两节点 ``2_A -> 1_B`` 在唯一一轮切成两个单节点，返回 ``B -> A``；
* 已排序链每次仍按稳定顺序重连，节点身份次序不变；
* 逆序五节点覆盖每次优先取右 run 首节点，但每步仍严格消费一个节点；
* ``2_A -> 2_B -> 1_C -> 2_D`` 最终为 ``C, A, B, D``，三个值为 2 的节点相对次序不变；
* 长度为 3、5 的奇数链末段都可能只有 left，第二次切分返回空，但 merge 仍交付真实尾；
* 短 run 中 ``tail.next`` 本来为空，重复写空不会读取越界，也不会使 ``current`` 回到已处理节点。

逐语言静态语义审查
~~~~~~~~~~~~~~~~~~

* **C / C++**：计数与宽度使用 ``int``，在题目规模上翻倍不溢出；dummy 位于栈上。分支短路保证只有非空
  ``left`` 或 ``right`` 被解引用；保存 ``next`` 后再重连，且无分配、释放或递归路径。
* **Python / Java / Go / TypeScript / C#**：dummy 只建立一次而不是每轮建立；函数返回 ``dummy.next`` 处理头
  变化。Go 使用命名字段；TypeScript 的非空断言分别有分支和刚接入节点作为见证；Java/C# 的空引用分支完整。
* **Rust**：``source.take()`` 把剩余链移入独占 run 并把根槽清空，``tail.next.take()`` 同时断边并把 rest 交回
  source；合并前再次 ``take`` 节点后继，使被接入的 ``Box`` 独立。``output`` 始终借用空的 ``Option`` 尾槽，
  填入后沿新节点的 ``next`` 取得下一空槽。代码没有 ``unsafe``、裸指针、``Rc``、``clone``、递归或 dummy Box。
* **Julia**：平台节点必须是允许修改 ``next`` 的可变结构；``!`` 标出原位重连，返回新头而不假定调用者的 head
  绑定自动更新。while 计数避免宽度为 1 时的空区间歧义。
* **R**：平台适配器把节点实现为 environment，``$next`` 赋值按身份可见；``new_list_node`` 只创建固定 dummy。
  ``next_node`` 避开 R 的 ``next`` 关键字，函数同样显式返回新头。

剩余风险
~~~~~~~~

静态审查不能替代各判题模板和编译器。剩余风险包括个别平台版本的 ``ListNode`` 构造器重载、Rust 借用检查器
对尾槽生命周期的实际诊断、Julia/R 统一节点定义是否已由宿主正确载入，以及宿主资源耗尽行为。本文明确没有运行、
编译或测试代码，也没有把任何语言写成“通过”。

关键边界与失败方式
------------------

* ``split_run`` 必须先保存 rest 再清空尾边；只返回下一个入口却不断边，会让左右 run 重叠。
* 第二次切分必须从 ``right`` 开始。若仍从 ``left`` 开始，会重复处理节点并可能成环。
* 短尾 run 可以没有 right；合并条件必须在读取 ``right.val`` 前短路空引用。
* 相等时用 ``<=`` 取左侧；改成 ``<`` 会使跨 run 的相等节点反序。
* 合并若把剩余 run 整体接上，却不把 ``tail`` 移到真实末尾，下一组合并会覆盖链中间的边。
* 每轮开始必须从当前链头重新切分，不能沿用上一轮已经失效的 run 边界引用。
* ``width`` 必须从 1 开始并严格翻倍；零宽会让切分不前进，固定宽度则永远不能得到整链有序。
* 若使用递归自顶向下版本，就应诚实计入 ``O(log n)`` 栈，不能声称严格 ``O(1)`` 额外空间。
* dummy 不属于输出；若返回 dummy 本身，会多出一个伪节点并违反节点集合守恒。
* 只检查输出值看不见节点复制、同值身份反转、尾边未空或环，必须同时检查身份和拓扑。

学习链与知识更新
----------------

本题把 0147 的“有序前缀插入”提升为“有序 runs 成倍合并”：链表插入排序强调搜索位置和局部三边重连，本题强调
定长切分、尾部合同和逐轮覆盖。与 0143 的联系是都必须在重排前主动断边，才能证明临时链之间不共享旧后继。

本题新增或强化的知识点是：

* 自底向上链表归并能同时达到 ``O(n log n)`` 时间和 ``O(1)`` 核心工作空间；
* 返回真实尾节点（或 Rust 的空尾槽）是避免隐藏尾扫描并维持单轮分区不变量的关键接口；
* ``Option::take`` 既转移 Rust 所有权又把原槽置空，适合表达“切出一段并交还剩余链”；
* 稳定性必须用带身份标签的重复值验证，单纯值序列不足以证明。

带答案自检
----------

#. **为什么第一轮的宽度可以从 1 开始？**

   单节点 run 天然有序，因此满足归并的输入前提。

#. **切出 left 后为什么必须把它的尾边清空？**

   否则 left 仍能到达 right/rest，两个输入 run 不独立；合并可能重复消费节点或形成环。

#. **为什么合并要返回真实尾，而不只返回新头？**

   下一对 runs 必须从当前输出末尾追加；若再扫描找尾会增加重复工作，若尾引用错误则会覆盖已有边。

#. **``<=`` 在哪里体现稳定性？**

   左右首值相等时先消费左 run；run 内本来稳定，逐轮归纳后全链稳定。

#. **怎样证明一轮不是 ``O(n * number_of_runs)``？**

   各次切分走过的 run 互不相交，各次合并消费的节点也互不相交；每个节点每轮只被常数次访问，总计 ``O(n)``。

#. **为什么循环结束后一定只有一条有序 run？**

   结束条件是 ``width >= n``，而宽度不变量保证链能划分为长度至多 width 的有序 runs；总长不超过 width，
   因而整链本身就是一条 run。

#. **Rust 的 ``output`` 为什么不会同时可变借用多个节点？**

   它始终只借用当前链尾的空 ``next`` 槽；填入一个独占 Box 后，借用沿该 Box 转到新的空 ``next``，旧槽不再使用。

#. **算法有没有额外创建节点？**

   普通语言只创建一个固定 dummy，Rust 连 dummy 都不创建；结果中的所有节点仍是输入节点，所以核心额外空间
   与 ``n`` 无关。
