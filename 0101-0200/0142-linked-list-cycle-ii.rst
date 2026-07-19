0142. Linked List Cycle II
==========================

题目信息
--------

:题号: 0142
:难度: Medium
:主题: 链表、Floyd 两阶段算法、模环长同余
:原题: `LeetCode 0142 <https://leetcode.com/problems/linked-list-cycle-ii/>`_
:访问状态: Available
:教学重点: 相遇步数、入口偏移、原节点身份返回与只读拓扑

精确契约
--------

给定可能含环的单链表头节点 ``head``。若存在环，返回从 ``head`` 沿 ``next`` 前进时第一次进入环的那个
**原节点对象**；若无环，返回空引用。不能返回相同值的新节点，不能返回普通环内相遇点，也不得修改任何
``next``。

题面中的 ``pos`` 仅供判题器描述尾节点连接到哪个零基节点，``-1`` 表示无环；它不传给函数。节点数位于
``[0, 10^4]``，节点值位于 ``[-10^5, 10^5]``。算法不读取节点值，也不需要知道入口在展示数组中的下标。

``ListNode`` 由平台提供。C/C++/Java/Go/TypeScript/C# 返回原节点引用，Python 返回原 ``ListNode`` 对象，
Julia/R 复用仓库的可变引用节点。与 0141 相同，Rust 使用
``Option<Rc<RefCell<ListNode>>>`` 循环对象适配器；普通 ``Option<Box<ListNode>>`` 的独占所有权链不能安全
表达回边。返回的 ``Rc`` 是入口分配的另一个共享句柄，不是节点深拷贝。

自建示例
--------

设链接为：

.. code-block:: text

   A -> B -> C -> D -> E
             ^         |
             +---------+

环入口是 ``C``。头到入口的步数 ``mu = 2``，环长 ``lambda = 3``。第一阶段位置如下：

.. code-block:: text

   轮数 t       0   1   2   3
   slow         A   B   C   D
   fast         A   C   E   D

两者在 ``D`` 相遇，而不是在入口 ``C``。第二阶段让 ``seeker`` 回到 ``A``，``slow`` 留在 ``D``：

.. code-block:: text

   同步步数 k   0   1   2
   seeker       A   B   C
   slow         D   E   C

二者前进 ``mu = 2`` 步后第一次在 ``C`` 相遇，返回的必须就是原对象 ``C``。

若链为 ``A(7) -> B(7) -> C(1) -> null``，虽然不同节点可能同值，快指针最终仍到达空引用，必须返回空。
值相等既不能证明相遇，也不能决定入口。

问题抽象与解法取舍
------------------

从 ``head`` 出发的确定性后继序列若含环，可唯一分成：

* 长度为 ``mu`` 的环外尾部 ``x(0), ..., x(mu-1)``；
* 长度为 ``lambda >= 1`` 的环，入口为 ``x(mu)``。

对任意 ``k >= mu``，``x(k)`` 的环内坐标是 ``(k - mu) mod lambda``。目标不是只证明某个重复，而是从
第一阶段的环内相遇步数推回坐标 0 的入口。

身份哈希集合也能完成：从头依次插入节点，第一次已经存在的对象就是入口，时间 ``O(n)``、额外空间
``O(n)``。它概念直接，却不满足题目追问的常量额外空间，并要求身份哈希。

主解采用 Floyd 两阶段算法：

#. 慢指针一步、快指针两步，找到任意环内身份相遇点；快指针遇空则无环；
#. 一个指针 ``seeker`` 回到 ``head``，另一个留在相遇点；两者都改为每轮一步，身份首次相同时返回该节点。

第二阶段看似神奇，实质由第一阶段相遇的步数同余决定。

阶段状态与代码映射
------------------

第一阶段沿用 0141 的步数状态。完成 ``t`` 轮时：

.. code-block:: text

   slow = x(t)
   fast = x(2t)

循环先检查 ``fast`` 和 ``fast.next``，再移动并比较身份。若守卫失败，直接返回空；若比较相同，就保存当前
``slow`` 作为相遇点。

第二阶段令 ``seeker = x(0)``，``slow`` 仍在相遇点。同步完成 ``k`` 轮时：

* ``seeker = x(k)``；
* ``slow`` 是从相遇点沿环前进 ``k`` 步的位置。

二者只重绑定局部引用。代码从不写入 ``next``，也从不创建替代节点；最终返回值直接来自 ``seeker`` 沿原链
到达的对象。

入口同余推导
------------

设第一阶段在慢指针走了 ``t > 0`` 步后相遇。相遇点位于环内，所以 ``t >= mu``。快指针共走 ``2t`` 步，
两次步数到达同一环内节点，它们之差必须是完整环长的整数倍：

.. code-block:: text

   2t - t = t = q * lambda
   因而 t ≡ 0 (mod lambda)

这里没有假设慢指针进入环后只走了不足一圈；整数 ``q`` 已经完整包含它与快指针可能绕过的所有整圈。

令 ``r`` 是入口到相遇点的零基环内偏移：

.. code-block:: text

   r ≡ t - mu (mod lambda),  0 <= r < lambda

于是：

.. code-block:: text

   mu + r ≡ mu + (t - mu)
          ≡ t
          ≡ 0 (mod lambda)

从相遇点再走 ``mu`` 步后的环内坐标是 ``r + mu ≡ 0``，恰好回到入口。与此同时，从头出发的
``seeker`` 走 ``mu`` 步也第一次到达入口。这就是第二阶段同步相遇的依据。

旧式写法 ``2(a+b) = a+b+k*lambda`` 若把 ``a+b`` 解释成慢指针总路程，会漏掉慢指针在相遇前已经走过的
整圈。使用总步数 ``t`` 和模坐标 ``r`` 可以避免把总路程、环内偏移与整圈数混为一谈。

正确性证明
----------

**引理一：第一阶段正确区分无环与有环。** 无环时沿 ``next`` 的有限路径不重复，快指针最终使守卫失败并
返回空；有环时，0141 的相对位移证明保证两个指针在有限轮内按身份相遇。第一阶段不按 ``val`` 判断，因此
重复值不影响结论。

**引理二：有环时第二阶段会在入口相遇。** 入口同余推导已经证明：从头和从第一阶段相遇点各前进
``mu`` 步，都到达入口。两指针每轮各走一步，所以最迟在第 ``mu`` 轮身份相同。

**引理三：第二阶段不会在入口之前提前相遇。** 若 ``mu > 0``，对任意 ``0 <= k < mu``，``seeker`` 仍在
不属于环的尾部，而 ``slow`` 从相遇点出发始终在环中，两者不可能是同一对象；第 ``mu`` 轮才同时到达入口。
若 ``mu = 0``，上式给出 ``r ≡ 0``，第一阶段相遇点本身就是头节点入口，第二阶段在零步时立即返回它。

**返回身份与副作用。** ``seeker`` 从 ``head`` 开始只沿原 ``next`` 前进，返回的就是原入口节点；算法没有
分配节点或按值构造替代品。两阶段都只读链接，所以输入拓扑保持不变。

由以上引理，无环时恰好返回空，有环时恰好返回原入口对象。第一阶段有限退出或相遇，第二阶段最多执行
``mu`` 轮，因此算法终止。

复杂度、返回载荷与适配器
------------------------

设可达不同节点数为 ``n``。有环时 ``n = mu + lambda``：第一阶段在 ``O(mu + lambda)`` 轮内相遇，第二
阶段执行 ``mu`` 轮，总时间 ``O(n)``。无环时快指针在 ``O(n)`` 次访问内遇空，仍为 ``O(n)``。

算法保存 ``slow``、``fast``、``seeker`` 和少量临时引用，核心额外空间 ``O(1)``。返回值只是一个入口引用，
没有 ``O(n)`` 结果载荷：

* C/C++ 不分配、不释放节点，返回借用的原指针；托管语言同样返回原对象引用；
* Rust 的 ``Rc::clone`` 只增加入口或后继分配的引用计数，不复制节点；同时存活的临时 ``Rc`` 数量为常数；
* 强 ``Rc`` 输入环自身不会自动回收，构造方仍需显式断环或使用适当的 ``Weak``/带外所有权设计；算法没有
  新增永久边，但返回的 ``Rc`` 会让入口强引用计数增加一；
* Julia 可变节点和 R ``environment`` 按引用返回；局部绑定更新不复制整条链。

十语言实现
----------

C
~

.. code-block:: c

   #include <stddef.h>

   struct ListNode *detectCycle(struct ListNode *head) {
       struct ListNode *slow = head;
       struct ListNode *fast = head;

       while (fast != NULL && fast->next != NULL) {
           slow = slow->next;
           fast = fast->next->next;
           if (slow == fast) {
               struct ListNode *seeker = head;
               while (seeker != slow) {
                   seeker = seeker->next;
                   slow = slow->next;
               }
               return seeker;
           }
       }
       return NULL;
   }

平台提供 ``struct ListNode``。返回指针别名原节点，调用者继续拥有整条链；函数没有可失败分配路径。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode* detectCycle(ListNode* head) {
           ListNode* slow = head;
           ListNode* fast = head;

           while (fast != nullptr && fast->next != nullptr) {
               slow = slow->next;
               fast = fast->next->next;
               if (slow == fast) {
                   ListNode* seeker = head;
                   while (seeker != slow) {
                       seeker = seeker->next;
                       slow = slow->next;
                   }
                   return seeker;
               }
           }
           return nullptr;
       }
   };

所有比较都是原始指针身份；返回值不是新节点，函数也不接管或释放平台节点。

Python
~~~~~~

.. code-block:: python

   from typing import Optional

   class Solution:
       def detectCycle(
           self,
           head: Optional[ListNode],
       ) -> Optional[ListNode]:
           slow = head
           fast = head

           while fast is not None and fast.next is not None:
               slow = slow.next
               fast = fast.next.next
               if slow is fast:
                   seeker = head
                   while seeker is not slow:
                       seeker = seeker.next
                       slow = slow.next
                   return seeker
           return None

``is`` 保证两阶段都按对象身份比较。第二阶段的非空解引用由“第一阶段已经在环内相遇”的不变量支撑。

Java
~~~~

.. code-block:: java

   public class Solution {
       public ListNode detectCycle(ListNode head) {
           ListNode slow = head;
           ListNode fast = head;

           while (fast != null && fast.next != null) {
               slow = slow.next;
               fast = fast.next.next;
               if (slow == fast) {
                   ListNode seeker = head;
                   while (seeker != slow) {
                       seeker = seeker.next;
                       slow = slow.next;
                   }
                   return seeker;
               }
           }
           return null;
       }
   }

Java 对节点引用使用 ``==``，不会调用可能按值定义的 ``equals``；返回对象来自原链。

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn detect_cycle(
           head: Option<Rc<RefCell<ListNode>>>,
       ) -> Option<Rc<RefCell<ListNode>>> {
           fn next(
               link: &Option<Rc<RefCell<ListNode>>>,
           ) -> Option<Rc<RefCell<ListNode>>> {
               link.as_ref()
                   .and_then(|node| node.borrow().next.clone())
           }

           let mut slow = head.clone();
           let mut fast = head.clone();

           loop {
               let fast_once = next(&fast);
               if fast_once.is_none() {
                   return None;
               }
               slow = next(&slow);
               fast = next(&fast_once);

               let met = match (&slow, &fast) {
                   (Some(slow_node), Some(fast_node)) => {
                       Rc::ptr_eq(slow_node, fast_node)
                   }
                   _ => false,
               };
               if met {
                   break;
               }
           }

           let mut seeker = head;
           loop {
               let same = match (&seeker, &slow) {
                   (Some(seeker_node), Some(slow_node)) => {
                       Rc::ptr_eq(seeker_node, slow_node)
                   }
                   _ => return None,
               };
               if same {
                   return seeker;
               }
               seeker = next(&seeker);
               slow = next(&slow);
           }
       }
   }

局部布尔 ``met``/``same`` 让不可变借用在重绑定链接前结束。返回 ``seeker`` 移动的是 ``Rc`` 句柄，仍指向
原入口分配；本签名是循环链接适配器，不是普通 ``Option<Box<ListNode>>`` 平台链表。

Go
~~

.. code-block:: go

   func detectCycle(head *ListNode) *ListNode {
       slow := head
       fast := head

       for fast != nil && fast.Next != nil {
           slow = slow.Next
           fast = fast.Next.Next
           if slow == fast {
               seeker := head
               for seeker != slow {
                   seeker = seeker.Next
                   slow = slow.Next
               }
               return seeker
           }
       }
       return nil
   }

Go 指针比较和返回都保留节点身份；局部变量移动不改写 ``Next``。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function detectCycle(head: ListNode | null): ListNode | null {
       let slow = head;
       let fast = head;

       while (fast !== null && fast.next !== null) {
           slow = slow!.next;
           fast = fast.next.next;
           if (slow === fast) {
               let seeker = head;
               while (seeker !== slow) {
                   seeker = seeker!.next;
                   slow = slow!.next;
               }
               return seeker;
           }
       }
       return null;
   }

``===`` 比较对象引用。非空断言只出现在 Floyd 不变量已经证明对应节点存在的路径上。

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode DetectCycle(ListNode head) {
           ListNode slow = head;
           ListNode fast = head;

           while (fast != null && fast.next != null) {
               slow = slow.next;
               fast = fast.next.next;
               if (object.ReferenceEquals(slow, fast)) {
                   ListNode seeker = head;
                   while (!object.ReferenceEquals(seeker, slow)) {
                       seeker = seeker.next;
                       slow = slow.next;
                   }
                   return seeker;
               }
           }
           return null;
       }
   }

``ReferenceEquals`` 不受节点类重载 ``==`` 或覆写值相等影响；平台签名继续使用其可空引用约定。

Julia
~~~~~

.. code-block:: julia

   function detect_cycle(
       head::Union{Nothing,ListNode},
   )::Union{Nothing,ListNode}
       slow = head
       fast = head

       while fast !== nothing && fast.next !== nothing
           slow = slow.next
           fast = fast.next.next
           if slow === fast
               seeker = head
               while seeker !== slow
                   seeker = seeker.next
                   slow = slow.next
               end
               return seeker
           end
       end
       return nothing
   end

``ListNode`` 是仓库可变引用节点，``===`` 对它执行身份比较。函数只读字段，没有一基索引换算或拓扑修改。

R
~

.. code-block:: r

   detect_cycle <- function(head) {
     slow <- head
     fast <- head

     while (!is.null(fast) && !is.null(fast$next)) {
       slow <- slow$next
       fast <- fast$next$next
       if (identical(slow, fast)) {
         seeker <- head
         while (!identical(seeker, slow)) {
           seeker <- seeker$next
           slow <- slow$next
         }
         return(seeker)
       }
     }
     NULL
   }

R 适配器节点是 ``environment``；``identical`` 比较环境身份。所有 ``<-`` 都只重绑定局部指针，没有对
``$next`` 赋值，返回的环境就是原入口对象。

语言身份语义与剩余平台差异
--------------------------

本题沿用 0141 核对的官方语义：Rust `Rc::ptr_eq
<https://doc.rust-lang.org/std/rc/struct.Rc.html#method.ptr_eq>`_ 比较同一分配；Julia `===
<https://docs.julialang.org/en/v1/base/base/#Core.:===>`_ 对可变对象按地址身份比较；C# 使用
`Object.ReferenceEquals
<https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/statements-expressions-operators/how-to-test-for-reference-equality-identity>`_；
R 使用 `identical <https://stat.ethz.ch/R-manual/R-devel/library/base/help/identical.html>`_。

Java ``==``、Python ``is``、Go/C/C++ 指针相等和 TypeScript 对对象的 ``===`` 同样表达引用身份。这里的共同
语义是“返回原入口对象”，不是要求各语言采用相同内存管理。Rust 强 ``Rc`` 环的回收限制仍属于适配器契约；
R/Julia 代码依赖仓库统一引用节点，具体在线判题平台若没有这两种语言模板，需要由调用方提供等价节点定义。

关键边界与易错点
----------------

* 空链表和任意无环链都返回空，不能进入第二阶段；
* 单节点自环时 ``mu = 0``、``lambda = 1``，返回该原节点；
* 环入口为头节点时，第二阶段可能零步相遇；
* 第一阶段相遇点通常不是入口，不能直接返回 ``slow``；
* 不同节点值可以相同，入口按身份而不是值确定；
* ``pos`` 不在函数参数中，不能依赖输入展示下标；
* 快指针两步访问之前必须短路检查 ``fast`` 和 ``fast.next``；
* 第二阶段两个指针都改为一步，若继续一快一慢就不再服从入口同余；
* 推导必须保留慢指针可能走过的整圈，不能把环内偏移 ``r`` 当成慢指针总路程；
* 返回的是借用/共享的原节点引用，不能创建同值替代节点，也不能修改 ``next`` 便于定位。

静态审查记录
------------

本次人工推演了题目页面三个示例，并额外推演空链表、单节点自环、入口为头、上面的长尾三节点环、两节点环、
重复值无环和第一阶段相遇点不等于入口。对每个有环场景分别列出 ``mu``、``lambda``、``t``、``r``，核对
``t ≡ 0``、``r ≡ t-mu`` 与第二阶段首次相遇；没有使用省略整圈的旧公式。

十语言静态审查覆盖平台签名、空返回、快指针守卫、节点身份、第二阶段非空前提、原对象返回和输入只读。专项
复核 Rust ``Rc<RefCell<_>>`` 的借用结束点、句柄移动与强环生命周期，C# ``ReferenceEquals``、Julia
``===`` 和 R ``identical`` 的身份语义。

按照仓库当前策略，以上题解代码均 **未运行、未编译、未测试**，没有执行示例、对拍、穷举、属性测试或
sanitizer。剩余风险主要是目标平台的具体 ``ListNode`` 字段/可空签名、Rust 是否提供循环链接适配器，以及
人工静态审查无法完全排除的语法拼写；本文不声称十语言已经运行通过。

学习链与自检
------------

0141 只利用相对速度得到“存在环”的布尔见证；本题进一步从相遇步数同余恢复入口身份。它强化了 0133/0138
中的对象身份、0141 的 Floyd 第一阶段，并为 0160“相交节点必须按同一对象判断”提供距离同步的先修经验。

#. 第一阶段相遇后，为什么慢指针步数 ``t`` 是环长 ``lambda`` 的倍数？
#. ``r ≡ t-mu`` 怎样推出从相遇点走 ``mu`` 步回到入口？
#. 为什么第二阶段在入口之前不会提前相遇？
#. 当入口就是 ``head`` 时，第二阶段为什么可以零步返回？
#. 返回一个新的同值节点为什么违反契约？

答案要点
~~~~~~~~

#. 相遇时快指针走 ``2t`` 步、慢指针走 ``t`` 步；同一环内节点的两个步数之差 ``t`` 必为完整环长倍数。
#. ``mu+r ≡ mu+t-mu ≡ t ≡ 0 (mod lambda)``，所以相遇点的坐标加 ``mu`` 后是入口坐标 0。
#. 在 ``k < mu`` 时，``seeker`` 仍在环外尾部，另一个指针始终在环内，两者身份不可能相同。
#. ``mu = 0`` 时 ``r ≡ t ≡ 0``，第一阶段相遇点已经是入口 ``head``，身份比较立即成立。
#. 题目要求返回原链表中第一次进入环的对象；新节点即使 ``val`` 相同，也没有原入口的身份和链接关系。
