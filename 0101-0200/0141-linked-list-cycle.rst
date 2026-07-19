0141. Linked List Cycle
=======================

题目信息
--------

:题号: 0141
:难度: Easy
:主题: 链表、Floyd 快慢指针、对象身份
:原题: `LeetCode 0141 <https://leetcode.com/problems/linked-list-cycle/>`_
:访问状态: Available
:教学重点: 步数状态、相对位移、身份相遇与只读遍历

精确契约
--------

给定单链表的头节点 ``head``，判断从它开始反复沿 ``next`` 前进时，是否会再次到达某个已经到达过的
**同一节点对象**。有环返回 ``true``，否则返回 ``false``。链表可以为空；函数只读节点和链接，不得为了
标记访问状态而修改 ``val`` 或 ``next``。

题面用 ``pos`` 描述判题器把尾节点连接到哪个零基节点，``-1`` 表示不连接。``pos`` 不是函数参数，算法既
看不到它，也不能依赖节点在展示数组中的下标。节点数至多 ``10^4``，节点值位于 ``[-10^5, 10^5]``；本解法
完全不读取 ``val``，所以重复值和数值范围都不影响判断。

``ListNode`` 由平台提供。C/C++/Java/Go/TypeScript/C# 使用平台节点引用；Python 使用 ``Optional[ListNode]``。
Julia 复用仓库的可变引用节点，R 复用 ``environment`` 节点。普通 Rust ``Option<Box<ListNode>>`` 表示独占、
无回边的链，无法用安全所有权直接表达本题的环；Rust 代码因此明确采用
``Option<Rc<RefCell<ListNode>>>`` 循环对象适配器，其 ``next`` 字段也必须使用同一种链接类型。

自建示例
--------

设四个不同节点按身份记为 ``A、B、C、D``，链接为：

.. code-block:: text

   A -> B -> C -> D
        ^         |
        +---------+

即 ``D.next`` 指回 ``B``。从头出发的节点序列是 ``A, B, C, D, B, C, ...``，会重复到达对象 ``B``，
所以答案为真。快慢指针的前几轮位置为：

.. code-block:: text

   轮数       0   1   2   3
   slow       A   B   C   D
   fast       A   C   B   D

第 3 轮二者才在对象 ``D`` 相遇；相遇点不要求是环入口。

再看无环链 ``A(4) -> B(9) -> C(9) -> D(2) -> null``。第 1 轮 ``slow`` 在 ``B``，``fast`` 在
``C``，两个节点值同为 9，但身份不同，不能据此返回真。继续前进后快指针到达空引用，答案为假。

问题抽象与解法取舍
------------------

令 ``x(k)`` 表示从 ``head`` 沿 ``next`` 恰好前进 ``k`` 步所得的位置；若路径已经离开链表，则位置为
``null``。无环时，非空的 ``x(0), x(1), ...`` 全部互异。有环时存在两个结构参数：

``mu``
   从头到第一次进入环的步数，也就是环外尾部长；

``lambda``
   环中不同节点数，且 ``lambda >= 1``。

对所有 ``k >= mu``，``x(k)`` 的环内坐标是 ``(k - mu) mod lambda``。题目因此是判断这个确定性后继序列
是否会重复。

可以把每个到达过的节点身份放入哈希集合；第一次重复时返回真，时间 ``O(n)``、额外空间 ``O(n)``，但需要
十语言都提供可靠的身份哈希。修改节点值或临时断链虽可充当标记，却违反只读契约，也引入恢复失败风险。

主解采用 Floyd 快慢指针：``slow`` 每轮前进一步，``fast`` 每轮前进两步。它以相对速度制造环内相遇，保持
``O(1)`` 核心工作空间，而且不需要修改节点或保存访问集合。

状态、不变量与安全守卫
----------------------

初始化 ``slow = fast = head``。每轮开始先检查 ``fast`` 和 ``fast.next`` 都非空，再执行：

.. code-block:: text

   slow = slow.next
   fast = fast.next.next

随后只按节点身份比较二者。完成 ``k`` 轮且尚未返回时，核心步数不变量是：

.. code-block:: text

   slow = x(k)
   fast = x(2k)

循环守卫不仅保护 ``fast.next.next``：若 ``x(2k)`` 及其后继存在，那么较早的 ``x(k)`` 也必然存在，
所以 ``slow.next`` 同样安全。有环时从头可达路径永不遇到空引用；无环时守卫会在快指针无法再走两步时结束。

代码中的 ``slow``、``fast`` 分别对应这两个步数状态；C/C++/Go 的指针比较、Python 的 ``is``、Java 的
``==``、Rust 的 ``Rc::ptr_eq``、TypeScript/Julia 的 ``===``、C# 的 ``ReferenceEquals`` 与 R 的
``identical`` 都承担“同一节点对象”判定，而不是比较 ``val``。

正确性证明
----------

**引理一：算法返回真时链表一定有环。** 比较发生在第 ``k >= 1`` 轮之后。若 ``slow`` 与 ``fast`` 是同一
对象，则 ``x(k) = x(2k)``，即从头前进两个不同步数到达同一节点。此后确定性的 ``next`` 路径会重复，因而
存在环。节点值相等不会触发该结论，算法使用的正是身份比较，所以不会产生由重复值导致的假阳性。

**引理二：无环链表一定返回假。** 无环路径中的非空节点按前进步数互不重复，因此第 ``k >= 1`` 轮不可能有
``x(k) = x(2k)``。链表只有有限个节点，``fast`` 每轮前进两步，最终 ``fast`` 或 ``fast.next`` 为
``null``，循环安全结束并返回假。

**引理三：有环链表一定返回真。** 设环外长度为 ``mu``、环长为 ``lambda``。取不小于 ``mu`` 的最小正
``lambda`` 倍数 ``k``；它至多为 ``mu + lambda - 1``（``mu = 0`` 时可取 ``k = lambda``）。此时
``k`` 和 ``2k`` 都已在环中，并且

.. code-block:: text

   (2k - mu) - (k - mu) = k ≡ 0 (mod lambda)

所以 ``x(k) = x(2k)``。有环路径不会遇到空引用，算法必能执行到不晚于这一轮并按身份发现相遇。

由三个引理，算法返回真当且仅当链表有环。无环时有限路径使守卫终止；有环时引理三给出有限相遇轮数，因此
算法在两种输入上都会终止。遍历只读取 ``next``，没有改变输入拓扑。

复杂度与适配器成本
------------------

设 ``n`` 为从 ``head`` 可达的不同节点数；有环时 ``n = mu + lambda``。无环时快指针在 ``O(n)`` 次节点
访问内遇到空引用；有环时上面的相遇轮数是 ``O(mu + lambda) = O(n)``。总时间为 ``O(n)``。

核心算法始终只保存两个节点引用和少量控制状态，额外空间为 ``O(1)``，不包含输入节点本身：

* C/C++/Python/Java/Go/TypeScript/C#/Julia/R 都只复制或重绑定常数个引用，不复制节点；
* Rust 的 ``next`` 辅助函数克隆 ``Rc``，每次只增加同一分配的引用计数，常数个临时链接同时存活，因此算法
  工作空间仍为 ``O(1)``；它没有复制 ``ListNode``；
* 但强 ``Rc`` 组成的输入环不会仅靠引用计数自动回收。这个生命周期限制属于 Rust 循环对象适配器，而不是
  Floyd 算法新增的空间；构造方若需要释放输入，必须显式断环或采用带外所有者/``Weak`` 设计；
* R 的 ``environment`` 和 Julia 的可变节点按引用传递；局部赋值不会复制整条链。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>

   bool hasCycle(struct ListNode *head) {
       struct ListNode *slow = head;
       struct ListNode *fast = head;

       while (fast != NULL && fast->next != NULL) {
           slow = slow->next;
           fast = fast->next->next;
           if (slow == fast) {
               return true;
           }
       }
       return false;
   }

``ListNode`` 由平台提供。函数不分配、不释放节点，也不接管 ``head`` 的所有权；指针相等表示同一节点地址。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       bool hasCycle(ListNode* head) {
           ListNode* slow = head;
           ListNode* fast = head;

           while (fast != nullptr && fast->next != nullptr) {
               slow = slow->next;
               fast = fast->next->next;
               if (slow == fast) {
                   return true;
               }
           }
           return false;
       }
   };

原始指针只借用平台节点；没有 ``delete``，也不应释放由调用者持有的链表。

Python
~~~~~~

.. code-block:: python

   from typing import Optional

   class Solution:
       def hasCycle(self, head: Optional[ListNode]) -> bool:
           slow = head
           fast = head

           while fast is not None and fast.next is not None:
               slow = slow.next
               fast = fast.next.next
               if slow is fast:
                   return True
           return False

``is`` 检查对象身份；不能改用 ``slow.val == fast.val``，也不依赖 ``ListNode`` 是否实现值相等。

Java
~~~~

.. code-block:: java

   public class Solution {
       public boolean hasCycle(ListNode head) {
           ListNode slow = head;
           ListNode fast = head;

           while (fast != null && fast.next != null) {
               slow = slow.next;
               fast = fast.next.next;
               if (slow == fast) {
                   return true;
               }
           }
           return false;
       }
   }

对对象引用使用 ``==`` 比较的是是否引用同一节点，不调用可能按值定义的 ``equals``。

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn has_cycle(
           head: Option<Rc<RefCell<ListNode>>>,
       ) -> bool {
           fn next(
               link: &Option<Rc<RefCell<ListNode>>>,
           ) -> Option<Rc<RefCell<ListNode>>> {
               link.as_ref()
                   .and_then(|node| node.borrow().next.clone())
           }

           let mut slow = head.clone();
           let mut fast = head;

           loop {
               let fast_once = next(&fast);
               if fast_once.is_none() {
                   return false;
               }
               slow = next(&slow);
               fast = next(&fast_once);

               match (&slow, &fast) {
                   (Some(slow_node), Some(fast_node)) => {
                       if Rc::ptr_eq(slow_node, fast_node) {
                           return true;
                       }
                   }
                   _ => return false,
               }
           }
       }
   }

这是 ``Rc<RefCell<ListNode>>`` 循环链接适配器，不是普通 ``Box`` 平台签名。``borrow`` 在辅助函数返回前结束，
``clone`` 只复制 ``Rc`` 句柄；``Rc::ptr_eq`` 比较同一分配而不比较节点内容。

Go
~~

.. code-block:: go

   func hasCycle(head *ListNode) bool {
       slow := head
       fast := head

       for fast != nil && fast.Next != nil {
           slow = slow.Next
           fast = fast.Next.Next
           if slow == fast {
               return true
           }
       }
       return false
   }

Go 指针可直接按地址身份比较；函数只重绑定局部指针，不改写 ``Next``。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function hasCycle(head: ListNode | null): boolean {
       let slow = head;
       let fast = head;

       while (fast !== null && fast.next !== null) {
           slow = slow!.next;
           fast = fast.next.next;
           if (slow === fast) {
               return true;
           }
       }
       return false;
   }

对象上的 ``===`` 是引用身份比较。``slow!`` 由步数不变量支撑：快指针还能走两步时，慢指针必然非空。

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool HasCycle(ListNode head) {
           ListNode slow = head;
           ListNode fast = head;

           while (fast != null && fast.next != null) {
               slow = slow.next;
               fast = fast.next.next;
               if (object.ReferenceEquals(slow, fast)) {
                   return true;
               }
           }
           return false;
       }
   }

``ReferenceEquals`` 明确绕开节点类可能重载的 ``==`` 或覆写的值相等。签名沿用平台的可空引用约定。

Julia
~~~~~

.. code-block:: julia

   function has_cycle(
       head::Union{Nothing,ListNode},
   )::Bool
       slow = head
       fast = head

       while fast !== nothing && fast.next !== nothing
           slow = slow.next
           fast = fast.next.next
           slow === fast && return true
       end
       return false
   end

仓库 ``ListNode`` 是可变引用节点；Julia 对可变对象使用 ``===`` 按身份比较。算法没有数组下标换算或节点复制。

R
~

.. code-block:: r

   has_cycle <- function(head) {
     slow <- head
     fast <- head

     while (!is.null(fast) && !is.null(fast$next)) {
       slow <- slow$next
       fast <- fast$next$next
       if (identical(slow, fast)) return(TRUE)
     }
     FALSE
   }

R 适配器用 ``environment`` 表示 ``ListNode``。环境具有引用语义，``identical`` 能区分两个字段完全相同但
身份不同的节点；局部 ``<-`` 只重绑定指针变量，没有修改环境字段。

语言身份语义与平台限制
----------------------

Rust 标准库说明 `Rc::ptr_eq
<https://doc.rust-lang.org/std/rc/struct.Rc.html#method.ptr_eq>`_ 比较两个 ``Rc`` 是否指向同一分配，而
``Rc`` 自身的普通值相等可能转而比较内部值。Julia 文档说明 `===
<https://docs.julialang.org/en/v1/base/base/#Core.:===>`_ 对可变对象按地址身份比较；Microsoft 建议需要引用身份时
使用 `Object.ReferenceEquals
<https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/statements-expressions-operators/how-to-test-for-reference-equality-identity>`_；
R 的 `identical
<https://stat.ethz.ch/R-manual/R-devel/library/base/help/identical.html>`_ 为条件判断提供单一精确布尔结果。

这些 API 只解决“怎样比较同一对象”。Rust 能否安全表示输入环是另一层问题：``Box`` 的独占所有权拓扑不能
形成共享回边，故本文 Rust 签名是显式适配器。R/Julia 同样依赖仓库已经建立的引用节点模型，而不是把普通列表
或不可变值结构临时当作节点。

关键边界与易错点
----------------

* 空链表、单节点无环和任意有限无环链都应返回假；
* 单节点 ``next`` 指向自身时，第 1 轮移动后两个指针仍指向该节点，应返回真；
* 环入口可以是头节点，也可以在长尾之后；相遇点不要求等于入口；
* 不同节点允许拥有相同 ``val``，值比较会误报；
* 初始化时 ``slow == fast == head`` 不能直接返回真，必须至少完成一次不同速度的移动；
* ``fast`` 与 ``fast.next`` 的短路守卫必须在两步访问之前；
* ``pos`` 不属于接口，不能通过计数到某个输入下标判断；
* 临时改值、断链或增加访问字段都违反只读契约；
* Rust 强 ``Rc`` 输入环有回收限制，不能把“算法不分配”误写成“输入必自动释放”。

静态审查记录
------------

本次人工推演了题目页面的三个示例，并额外推演空链表、单节点无环、单节点自环、两节点环、长尾入环和上面的
重复值无环反例。按轮核对了 ``slow = x(k)``、``fast = x(2k)``、短路守卫和相遇身份；分别验证了无环
安全退出、有环有限相遇、只读副作用和终止性。

十语言静态审查覆盖平台签名、必要导入、空引用、两步访问顺序和身份 API。专项查阅了 Rust ``Rc`` 分配身份
与强环生命周期、C# 引用身份、Julia ``===`` 和 R ``identical`` 的官方语义，并把 Rust 签名明确限定为循环
对象适配器。

按照仓库当前策略，以上题解代码均 **未运行、未编译、未测试**，没有执行示例、对拍、穷举、属性测试或
sanitizer。剩余风险主要是各目标平台实际提供的 ``ListNode`` 字段命名与 Rust 循环链表模板差异，以及人工
静态审查无法完全排除的语法拼写；本文不声称十语言已经运行通过。

学习链与自检
------------

本题新增“确定性后继序列中的相对速度判环”，强化 0133/0138 的对象身份语义，并为 0142 从环内相遇恢复入口
提供第一阶段结论。它也与“访问集合判环”形成时间相同、空间不同的典型取舍。

#. 完成 ``k`` 轮后，``slow`` 和 ``fast`` 分别对应从头前进多少步？
#. 为什么有环时一定存在有限的 ``k`` 使两者相遇？
#. 为什么节点值相同不能证明有环？
#. 为什么初始化时两个指针都在 ``head`` 不能立刻返回真？
#. Rust 为什么需要 ``Rc<RefCell<_>>`` 等循环对象适配，而不能直接沿用普通 ``Box`` 链？

答案要点
~~~~~~~~

#. 分别是 ``x(k)`` 与 ``x(2k)``；守卫保证本轮所需的后继存在。
#. 取不小于尾长 ``mu`` 的某个环长 ``lambda`` 倍数 ``k``，两者环内坐标之差为 ``k mod lambda = 0``。
#. 契约允许不同节点保存相同值；环定义要求同一节点对象被再次到达。
#. 两个指针被初始化为同一引用只是算法起点，不是不同步数到达同一节点的见证；必须先按不同速度移动。
#. ``Box`` 表达独占所有权，安全链接不能回到已被拥有的节点；共享可变回边需要引用计数/内部可变性或其他明确
   的图结构适配。
