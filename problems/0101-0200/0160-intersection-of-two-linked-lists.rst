0160. Intersection of Two Linked Lists
======================================

题目信息
--------

:题号: 0160
:难度: Easy
:主题: 链表、双指针、节点身份、路程对齐
:原题: `LeetCode 0160 <https://leetcode.com/problems/intersection-of-two-linked-lists/>`_
:访问状态: Available
:教学重点: 换头序列、空哨兵、共享后缀、只读结构

精确契约
--------

输入是两个无环单链表的头节点 ``headA`` 与 ``headB``。官方数据满足：

* 两条链的长度分别为 ``m``、``n``，且 ``1 <= m,n <= 3*10^4``；
* 节点值在 ``[1,10^5]``；
* 整个可达结构中没有环；
* 两链要么完全不共享节点，要么从某个节点起共享同一条后缀。

函数返回第一个共享节点对象；若不存在，返回空引用。相交依据是 **节点身份相同**，
不是节点值相等。函数返回后，两条链必须保持原结构，不能改写 ``next`` 或节点值。

官方说明中的 ``intersectVal``、``skipA``、``skipB`` 只供自定义判题器构造结构，
并不是函数参数。算法只接收两个头节点。目标是 ``O(m+n)`` 时间与 ``O(1)`` 额外空间。

示例与反例
----------

中间节点相交
~~~~~~~~~~~~

A 的值序列为 ``[4,1,8,4,5]``，B 为 ``[5,6,1,8,4,5]``，其中值 8 对应的节点
及其后缀是同一批对象。函数返回这个值为 8 的共享节点，而不是更早出现的值 1。

前缀长度不同
~~~~~~~~~~~~~~

A 为 ``[1,9,1] + [2,4]``，B 为 ``[3] + [2,4]``，方括号 ``[2,4]`` 表示共享对象后缀。
两个独有前缀长度分别为 3 和 1，换头后会自动抵消长度差并返回共享的值 2 节点。

完全不相交
~~~~~~~~~~

A 为 ``[2,6,4]``，B 为 ``[1,5]``，所有节点对象都独立。两个指针走完组合路径后
同时成为空引用，函数返回空。

同值不同身份反例
~~~~~~~~~~~~~~~~

创建两个独立节点 ``a`` 与 ``b``，二者值都为 7、后继都为空。``a.val == b.val``，
但 ``a`` 与 ``b`` 位于不同内存对象中，答案必须为空。按值比较会错误报告相交。

头节点即交点
~~~~~~~~~~~~

若 ``headA`` 与 ``headB`` 本来就是同一对象，循环不应执行，直接返回该头节点。

问题抽象与解法选择
------------------

若把 A 的全部节点身份放进集合，再扫描 B，可以在 ``O(m+n)`` 时间找到交点，
但集合需要 ``O(m)`` 额外空间。先计算两链长度再让长链先走差值也能做到常数空间，
却需要显式的计数与对齐阶段。

换头双指针把“算长度差”隐含在路径中：

.. code-block:: text

   first : A 的节点 -> null -> B 的节点 -> null
   second: B 的节点 -> null -> A 的节点 -> null

指针每轮先接受当前节点的 ``next``；若当前为空，则切换到另一条链的头。
两条组合路径包含完全相同的两条链和一次中间空哨兵，只是顺序相反，
因此独有前缀长度差会在第二段抵消。

为什么相交后必共享整条后缀
~~~~~~~~~~~~~~~~~~~~~~~~~~

单链节点只有一个 ``next``。若两个头都能到达同一节点 ``c``，从 ``c`` 开始的下一节点选择唯一，
之后每个后继也唯一，所以两条路径从 ``c`` 起不能再次分叉。无环合同保证这条共享后缀有限。

状态与身份不变量
----------------

``first`` 和 ``second`` 始终是以下三类之一：A 中某节点、B 中某节点或空引用。
每轮同时前进一步：

.. code-block:: text

   first  = first 为空 ? headB : first.next
   second = second 为空 ? headA : second.next

循环条件比较对象身份。核心不变量是：执行 ``t`` 次更新后，``first`` 等于组合序列
``A,null,B,null`` 的第 ``t`` 个状态，``second`` 等于 ``B,null,A,null`` 的第 ``t`` 个状态，
除非二者已在更早状态身份相同而退出。

这里把初始头记作第 0 个状态。空哨兵是代码真实经过的状态，不是额外分配的节点。

正确性证明
----------

引理一：每个指针按定义枚举自己的组合序列
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对更新次数 ``t`` 归纳。初始时 ``first=headA``、``second=headB``，分别是各自序列首状态。
若当前是节点，更新读取唯一 ``next``，前进到本链下一状态；若当前为空，条件表达式把它切换到
另一条链的头，恰好越过中间空哨兵。故每轮保持组合序列映射。

算法只重绑定两个局部引用，没有写入任何节点字段，所以该枚举不会修改输入结构。

引理二：相交时两个指针会在首个共享节点对齐
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设 A 的独有前缀长度为 ``a``，B 的独有前缀长度为 ``b``，共享后缀长度为 ``c>=1``。
A 长 ``a+c``，B 长 ``b+c``。

若两个指针没有更早相遇，``first`` 走完 A 的 ``a+c`` 个节点，再经过一次空状态，
然后在 B 中走过 ``b`` 个独有节点，到达首个共享节点；更新次数为：

.. math::

   (a+c) + 1 + b = a+b+c+1

``second`` 对称地走完 B、空状态和 A 的独有前缀，到达同一对象，更新次数为：

.. math::

   (b+c) + 1 + a = a+b+c+1

所以二者至迟在该时刻身份相同。若 ``a=b``，它们会在第一次遍历时更早同时到达首个共享节点，
结论仍成立。

它们不可能首次在共享后缀的更晚节点相遇：若首次共同状态是后缀第 ``j>0`` 个节点，
那么前一轮二者都位于它在共享后缀中的同一个唯一前驱，已经相等，构成矛盾。
因此非空相遇点就是首个共享节点。

引理三：不相交时两个指针会同时到达空
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

不相交时设 A、B 长度为 ``m``、``n``。``first`` 的状态序列包含 A 的 ``m`` 个节点、
一个空状态、B 的 ``n`` 个节点，随后再次为空；``second`` 以相反顺序包含同样数量状态。

两者从头开始，执行 ``m+n+1`` 次更新后都位于末尾空状态，身份比较成立，循环退出并返回空。
无环保证每条链在有限步内到空，因此不存在无限停留或重复节点。

定理：算法返回第一个交点，或在无交点时返回空
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理一，循环忠实枚举两条组合身份序列。若相交，引理二保证首次非空相等状态是首个共享节点；
若不相交，引理三保证有限步后在空状态相等。循环只在身份相等时退出，返回 ``first``，
因此两种情况下都符合合同。引理一还证明链表结构保持不变。

复杂度与所有权成本
------------------

每次循环做常数次身份比较、空判断和引用前进。两个指针各至多经过两条链和空哨兵，
时间为 ``O(m+n)``。算法只保存 ``first``、``second`` 与两个头引用，额外空间 ``O(1)``；
没有哈希集合、节点复制或递归栈，返回载荷只是一个节点引用。

Rust 的教学适配器用 ``Rc<ListNode>`` 表达共享尾链。``Rc::clone`` 只调整引用计数，
不复制节点载荷；循环同时持有常数个额外 ``Rc``，所以仍是 ``O(1)`` 额外引用。
返回 ``Option<Rc<ListNode>>`` 会把一个共享所有权句柄交给调用者。

十语言实现
----------

C
~

.. code-block:: c

   #include <stddef.h>

   struct ListNode *getIntersectionNode(
       struct ListNode *headA,
       struct ListNode *headB
   ) {
       struct ListNode *first = headA;
       struct ListNode *second = headB;

       while (first != second) {
           first = first == NULL ? headB : first->next;
           second = second == NULL ? headA : second->next;
       }
       return first;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
           ListNode *first = headA;
           ListNode *second = headB;

           while (first != second) {
               first = first == nullptr ? headB : first->next;
               second = second == nullptr ? headA : second->next;
           }
           return first;
       }
   };

Python
~~~~~~

.. code-block:: python

   from typing import Optional

   class Solution:
       def getIntersectionNode(
           self,
           headA: Optional[ListNode],
           headB: Optional[ListNode],
       ) -> Optional[ListNode]:
           first = headA
           second = headB

           while first is not second:
               first = headB if first is None else first.next
               second = headA if second is None else second.next
           return first

Java
~~~~

.. code-block:: java

   public class Solution {
       public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
           ListNode first = headA;
           ListNode second = headB;

           while (first != second) {
               first = first == null ? headB : first.next;
               second = second == null ? headA : second.next;
           }
           return first;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::rc::Rc;

   #[derive(Debug)]
   struct ListNode {
       val: i32,
       next: Option<Rc<ListNode>>,
   }

   fn same_node(
       first: &Option<Rc<ListNode>>,
       second: &Option<Rc<ListNode>>,
   ) -> bool {
       match (first, second) {
           (Some(a), Some(b)) => Rc::ptr_eq(a, b),
           (None, None) => true,
           _ => false,
       }
   }

   fn get_intersection_node(
       head_a: Option<Rc<ListNode>>,
       head_b: Option<Rc<ListNode>>,
   ) -> Option<Rc<ListNode>> {
       let mut first = head_a.clone();
       let mut second = head_b.clone();

       while !same_node(&first, &second) {
           first = match first {
               Some(node) => node.next.clone(),
               None => head_b.clone(),
           };
           second = match second {
               Some(node) => node.next.clone(),
               None => head_a.clone(),
           };
       }
       first
   }

Go
~~

.. code-block:: go

   func getIntersectionNode(headA, headB *ListNode) *ListNode {
       first := headA
       second := headB

       for first != second {
           if first == nil {
               first = headB
           } else {
               first = first.Next
           }

           if second == nil {
               second = headA
           } else {
               second = second.Next
           }
       }
       return first
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function getIntersectionNode(
       headA: ListNode | null,
       headB: ListNode | null,
   ): ListNode | null {
       let first = headA;
       let second = headB;

       while (first !== second) {
           first = first === null ? headB : first.next;
           second = second === null ? headA : second.next;
       }
       return first;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode GetIntersectionNode(ListNode headA, ListNode headB) {
           ListNode first = headA;
           ListNode second = headB;

           while (!ReferenceEquals(first, second)) {
               first = first == null ? headB : first.next;
               second = second == null ? headA : second.next;
           }
           return first;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function get_intersection_node(
       head_a::Union{Nothing, ListNode},
       head_b::Union{Nothing, ListNode},
   )::Union{Nothing, ListNode}
       first = head_a
       second = head_b

       while first !== second
           first = first === nothing ? head_b : first.next
           second = second === nothing ? head_a : second.next
       end
       return first
   end

R
~

.. code-block:: r

   get_intersection_node <- function(head_a, head_b) {
     first <- head_a
     second <- head_b

     while (!identical(first, second)) {
       first <- if (is.null(first)) head_b else first$next_node
       second <- if (is.null(second)) head_a else second$next_node
     }
     first
   }

人工推演与静态审查
------------------

本题没有运行、编译或测试任何题解代码，也没有执行随机结构生成、身份集合对拍、
属性测试或目标语言最小程序。以下证据来自身份路径纸面推演、有限序列证明和逐语言静态审查。

前缀不同且相交的推演
~~~~~~~~~~~~~~~~~~~~

用 ``A0,A1`` 表示 A 的两个独有节点，``B0`` 表示 B 的一个独有节点，
共享后缀为 ``C0,C1``：

.. list-table::
   :header-rows: 1

   * - 更新次数
     - ``first``
     - ``second``
   * - 0
     - ``A0``
     - ``B0``
   * - 1
     - ``A1``
     - ``C0``
   * - 2
     - ``C0``
     - ``C1``
   * - 3
     - ``C1``
     - ``null``
   * - 4
     - ``null``
     - ``A0``
   * - 5
     - ``B0``
     - ``A1``
   * - 6
     - ``C0``
     - ``C0``

此处 ``a=2,b=1,c=2``，公式 ``a+b+c+1=6`` 与表一致，返回首个共享对象 ``C0``。

头相交、尾相交与不相交
~~~~~~~~~~~~~~~~~~~~~~

若两头身份相同，次数 0 即退出。若共享后缀只有尾节点，公式中的 ``c=1`` 仍成立。
对长度 3 与 2 的不相交链，两个指针在执行 ``3+2+1=6`` 次更新后同时为空；
中间可能在不同时间各自经过空，但只有末尾空状态同步。

同值不同身份
~~~~~~~~~~~~

两个值都为 7 的独立尾节点在 C/C++ 等语言中地址不同，在 Python 中 ``is`` 为假，
在 Rust 中 ``Rc::ptr_eq`` 为假。算法继续前进并最终在空引用相等，正确返回无交点。

逐语言静态语义审查
~~~~~~~~~~~~~~~~~~

* **C / C++ / Java / Go / TypeScript**：指针或对象引用比较使用身份；循环只读取
  ``next``/``Next``，没有字段写入或节点分配。空引用切换与正文序列一致。
* **Python**：使用 ``is not``，不会触发用户定义 ``__eq__`` 的值或结构比较；
  ``Optional`` 标注覆盖空返回。
* **Rust**：普通 ``Option<Box<ListNode>>`` 无法由两个头共同拥有同一尾链，故这里是
  显式 ``Rc`` 教学适配器。``Rc::ptr_eq`` 比较分配身份，``clone`` 只增加引用计数。
* **C#**：``ReferenceEquals`` 明确绕开潜在的 ``==`` 运算符重载；空引用也可参与身份比较。
* **Julia**：``!==``/``===`` 对可变节点对象比较身份，``nothing`` 分支在解引用前处理。
* **R**：节点需用环境表达引用身份；``identical`` 对同一环境为真，对字段相同但独立环境为假。
  普通列表的值复制/结构比较模型不适合直接表达本题共享节点身份。

剩余风险
~~~~~~~~

Rust、Julia 与 R 代码依赖本文说明的自定义共享节点表示，不保证能直接粘贴到没有对应模板的判题机。
C# 未开启可空引用注解，空返回在旧式模板中可用但可能产生现代编译器警告。所有证明依赖无环合同；
合同外环形结构可能让指针永不到空。没有运行或编译来消除这些平台接线风险。

关键边界与失败方式
------------------

* 两个头身份相同应在循环前立即返回，包括合同外两头都为空的情况。
* 节点值相等不代表对象相同；按 ``val`` 比较会产生假交点。
* 相交后共享的是对象和整个后缀，不是两条内容相同的独立后缀。
* 换头发生在指针当前为空时；把 ``null`` 状态从精确路程中省略会产生一步偏差。
* 每个指针只切换一次头；若到第二条链末尾又无限切回，合同外实现会循环。
* 算法只能重绑定局部指针，不能把尾节点接到另一头来制造对齐，否则会破坏输入并可能成环。
* 身份哈希集合解法正确但空间 ``O(m)``，不能作为 ``O(1)`` 空间实现报告。
* 无环条件是有限组合路径的终止证书，不能从有环链表外推本证明。
* Rust 的 ``Box`` 表示唯一拥有，不能伪造两个头共享同一 ``Box`` 尾链。

学习链与知识更新
----------------

本题把长度差对齐转化为路径重排：``A,null,B`` 与 ``B,null,A`` 包含相同总组成，
因此无需显式计算长度。真正的算法对象是节点身份序列，而不是节点值序列；
这也解释了为什么语言的所有权与引用模型属于正确性的一部分。

新增或强化的知识包括：

* 通过交换遍历起点消除两个前缀长度差；
* 把代码真实经过的空引用纳入精确状态序列和相遇时刻；
* 单链一旦共享节点，唯一 ``next`` 使其后缀永久共享；
* ``O(1)`` 空间允许常数个借用或引用计数句柄，但不允许随输入增长的身份集合；
* Rust 共享身份需要 ``Rc``/``Arc`` 一类共享所有权，而 ``Box`` 只表达唯一拥有；
* 可关联 `0141. Linked List Cycle <0141-linked-list-cycle.rst>`_ 的指针身份与有限性证明，
  以及 `0142. Linked List Cycle II <0142-linked-list-cycle-ii.rst>`_ 的路程对齐思想。

带答案自检
----------

#. **为什么不能比较节点值？**

   两条链可以包含值相同但对象不同的节点；相交要求从某个位置起引用同一节点对象。

#. **换头序列为什么要显式包含 ``null``？**

   代码在走完一条链后先到空，下一轮才切换到另一头；精确更新次数中两条路径都多出
   同一个空哨兵，虽然不影响渐进复杂度，却影响严谨的相遇公式。

#. **相交时何时对齐到首个共享节点？**

   若未更早相遇，两者分别走 ``a+c+1+b`` 与 ``b+c+1+a`` 次更新，
   都在 ``a+b+c+1`` 时到达共享后缀首节点。

#. **为什么不会首次在共享后缀的第二个节点相遇？**

   第二个及以后节点在共享后缀中有同一个前驱；若在那里同时出现，前一轮已经在共同前驱相遇。

#. **无交点时为什么终止？**

   无环使两条链有限；两个组合序列各含 ``m+n`` 个节点和中间空状态，
   执行 ``m+n+1`` 次更新后同时到末尾空状态。

#. **Rust 为什么改用 ``Rc``？**

   两个头需要同时拥有同一尾节点；``Box`` 只能有一个所有者，``Rc`` 才能表达共享所有权，
   ``Rc::ptr_eq`` 则提供节点身份比较。
