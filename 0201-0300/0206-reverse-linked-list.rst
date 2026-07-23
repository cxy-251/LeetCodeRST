0206. Reverse Linked List
=========================

题目信息
--------

:题号: 0206
:难度: Easy
:主题: 单链表、指针、递归
:原题: `LeetCode 0206 <https://leetcode.com/problems/reverse-linked-list/>`_
:重点: 反转节点顺序、返回新头节点、空链表与单节点、节点值保持不变

题目重述
--------

给定单链表的头节点 ``head``，把链表中的节点顺序完全反转，并返回反转后链表的头节点。原来的第一个节点应成为最后一个节点，原来的最后一个节点应成为新的头节点；各节点保存的值不发生改变。

链表节点数位于 ``[0, 5000]``，节点值位于 ``[-5000, 5000]``。空链表反转后仍返回空引用，单节点链表返回该节点。题目允许使用迭代或递归方法；函数的返回值是反转后链表的新入口。

自建示例
--------

含重复值的链表：

.. code-block:: text

   输入：head = [4, 1, 4, 7]
   输出：[7, 4, 1, 4]
   解释：反转的是节点出现顺序，重复值不会合并或删除。

空链表：

.. code-block:: text

   输入：head = []
   输出：[]
   解释：没有节点可供反转，因此返回空链表。

问题抽象与解法选择
------------------

把原链表分成两部分：

.. code-block:: text

   previous                 current
      |                        |
   已反转前缀             未处理后缀

每轮处理 ``current`` 指向的一个节点：

.. code-block:: text

   next_node = current.next
   current.next = previous
   previous = current
   current = next_node

第一行必须发生在覆盖 ``current.next`` 之前。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 核心额外空间
     - 取舍
   * - 三指针迭代原地反转
     - ``O(n)``
     - ``O(1)``
     - 主解法；状态直接对应已反转前缀与未处理后缀
   * - 递归反转
     - ``O(n)``
     - ``O(n)`` 调用栈
     - 证明简洁，但长链表有栈深风险
   * - 把节点放入数组后倒序重连
     - ``O(n)``
     - ``O(n)``
     - 保存了不必要的全部节点引用
   * - 创建新节点倒序复制
     - ``O(n)``
     - ``O(n)``
     - 改变节点身份，不满足原地复用契约

状态与核心不变量
----------------

维护三个角色：

``previous``
   已反转前缀的新头；尚未处理任何节点时为空。

``current``
   未处理后缀的首节点；后缀为空时循环结束。

``next_node``
   当前轮临时保存的原后继，防止覆盖 ``current.next`` 后丢失后缀。

每轮开始时保持：

#. ``previous`` 可达的节点恰好是原链表已处理前缀，顺序完全反转；
#. ``current`` 可达的节点恰好是尚未处理的原后缀，内部链接仍保持原方向；
#. 两部分节点集合不相交，合并后恰好是全部原节点；
#. ``previous`` 链无环，尾节点是原链表最早被处理的节点且指向空；
#. 除两条局部变量引用外，已反转前缀与未处理后缀之间没有链表边；
#. 节点值从未修改，也没有创建或释放数据节点。

单轮状态变化
~~~~~~~~~~~~

设当前局部结构为：

.. code-block:: text

   previous    current -> next_node -> 后缀其余部分

先保存 ``next_node=current.next``，再令 ``current.next=previous``。当前节点由未处理后缀
移到已反转前缀头部：

.. code-block:: text

   current -> previous -> 已反转前缀其余部分
   next_node -> 未处理后缀其余部分

最后令 ``previous=current``、``current=next_node``，进入下一轮。

为什么不能先改 current.next
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若先执行 ``current.next=previous``，原后继引用被覆盖。除非提前保存在另一个变量中，
程序将无法找到未处理后缀；返回链只包含已经处理的前缀，后续节点被逻辑丢失。

正确性证明
----------

引理一：初始化满足循环不变量
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

初始化 ``previous=null``、``current=head``。已处理前缀为空，空链显然反转正确且无环；
未处理后缀是完整原链表；两部分不相交并覆盖全部节点。输入合法无环，其他条件也成立。

引理二：每轮不会丢失未处理后缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

算法在修改链接前保存 ``next_node=current.next``。之后即使 ``current.next`` 改为
``previous``，原后继及其后缀仍由 ``next_node`` 引用。轮末把 ``current`` 设为
``next_node``，所以所有尚未处理节点仍可达。

引理三：每轮把恰好一个节点正确加入反转前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

当前节点原本是未处理后缀首节点。执行 ``current.next=previous`` 后，它指向已反转前缀
旧头，因此新前缀顺序等于“当前节点 + 旧前缀”，恰好是原已处理前缀再加入当前节点后的
逆序。其他前缀链接不变，所以反转关系正确。

引理四：单轮保持节点守恒与不相交
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

当前节点从未处理集合移出并加入已处理集合；由引理二，其原后继成为新后缀首节点。
没有复制或删除节点，因此两集合仍不相交，合并仍是全部原节点，而且每轮已处理节点数
恰好增加一。

引理五：算法不会创建环
~~~~~~~~~~~~~~~~~~~~~~

归纳假设旧 ``previous`` 链无环。当前节点在加入前属于与该链不相交的未处理后缀。
把它的唯一后继改为旧 ``previous`` 后，新前缀从一个新节点进入一条无环链，不存在从
旧前缀返回当前节点的边，因此仍无环。未处理后缀保留输入中的向前链接，也无环。

引理六：循环不变量始终成立
~~~~~~~~~~~~~~~~~~~~~~~~~~

引理一给出基础情况。假设某轮开始时不变量成立；引理二保证后缀不丢失，引理三保证
新前缀反转正确，引理四保证节点集合守恒，引理五保证无环，值和分配状态也未改变。
因此轮末不变量进入下一轮。

定理：算法返回完整反转链表
~~~~~~~~~~~~~~~~~~~~~~~~~~

循环结束时 ``current=null``，未处理后缀为空。由不变量，``previous`` 可达节点集合等于
全部原节点，顺序是完整原链表的逆序，且无环。第一轮把原头的 ``next`` 改为空，因此
它成为尾节点；最后处理的原尾成为 ``previous``，即新头。返回 ``previous`` 满足全部契约。

终止性
~~~~~~

由引理四，每轮把一个尚未处理节点永久移入已处理前缀。输入含有限个节点且无环，
执行 ``n`` 轮后 ``current`` 为空，循环终止。

人工指针推演
------------

两节点链表
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 时刻
     - ``previous``
     - ``current``
     - 保存后继
   * - 初始
     - ``null``
     - ``A -> B``
     - —
   * - 处理 A 后
     - ``A -> null``
     - ``B -> null``
     - ``B``
   * - 处理 B 后
     - ``B -> A -> null``
     - ``null``
     - ``null``

返回节点 ``B``。

五节点链表
~~~~~~~~~~

对 ``1 -> 2 -> 3 -> 4 -> 5``：

.. code-block:: text

   轮 0：previous = null，current = 1 -> 2 -> 3 -> 4 -> 5
   轮 1：previous = 1，current = 2 -> 3 -> 4 -> 5
   轮 2：previous = 2 -> 1，current = 3 -> 4 -> 5
   轮 3：previous = 3 -> 2 -> 1，current = 4 -> 5
   轮 4：previous = 4 -> 3 -> 2 -> 1，current = 5
   轮 5：previous = 5 -> 4 -> 3 -> 2 -> 1，current = null

重复值不会改变推演，因为算法从不比较 ``val``。

复杂度与所有权
--------------

* 每个节点恰好处理一次，每轮常数次引用操作，时间复杂度 ``O(n)``；
* 只保存 ``previous``、``current`` 和 ``next_node``，核心额外空间 ``O(1)``；
* 返回链表复用全部原节点，没有 ``O(n)`` 新输出容器；
* C/C++ 只改裸指针，不分配、不释放；节点生命周期仍由调用方或平台管理；
* Python、Java、Go、TypeScript、C#、Julia 与 R 只重接引用，不创建新数据节点；
* Rust 每轮从 ``Option<Box<ListNode>>`` 中移动一个 ``Box``，用 ``take`` 取走原后继，
  再把旧前缀所有权放入 ``node.next``；没有克隆节点；
* R 与 Julia 的节点是共享可变对象。外部若仍保存原头引用，会观察到它已成为
  ``next=null`` 的尾节点；调用者必须使用返回值取得新头；
* 算法会破坏原链表方向，这是题目要求的原地变异，不是只读操作。

平台节点模型
------------

十个实现都复用题目平台提供的 ``ListNode``，代码块不重复声明节点类型。统一适配约定是：
节点包含值字段和可修改的 ``next``；Julia 使用仓库统一的可变 ``ListNode``，R 使用统一的
``environment`` 节点并通过 ``node$next`` 重接。调用方负责按所在平台提供这一类型外壳。

十语言实现
----------

C
~

.. code-block:: c

   #include <stddef.h>

   struct ListNode *reverseList(struct ListNode *head) {
       struct ListNode *previous = NULL;
       struct ListNode *current = head;

       while (current != NULL) {
           struct ListNode *next_node = current->next;
           current->next = previous;
           previous = current;
           current = next_node;
       }
       return previous;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode* reverseList(ListNode* head) {
           ListNode* previous = nullptr;
           ListNode* current = head;

           while (current != nullptr) {
               ListNode* nextNode = current->next;
               current->next = previous;
               previous = current;
               current = nextNode;
           }
           return previous;
       }
   };

Python
~~~~~~

.. code-block:: python

   from typing import Optional

   class Solution:
       def reverseList(
           self,
           head: Optional[ListNode],
       ) -> Optional[ListNode]:
           previous = None
           current = head

           while current is not None:
               next_node = current.next
               current.next = previous
               previous = current
               current = next_node

           return previous

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode reverseList(ListNode head) {
           ListNode previous = null;
           ListNode current = head;

           while (current != null) {
               ListNode nextNode = current.next;
               current.next = previous;
               previous = current;
               current = nextNode;
           }
           return previous;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn reverse_list(
           head: Option<Box<ListNode>>,
       ) -> Option<Box<ListNode>> {
           let mut previous: Option<Box<ListNode>> = None;
           let mut current = head;

           while let Some(mut node) = current {
               current = node.next.take();
               node.next = previous;
               previous = Some(node);
           }
           previous
       }
   }

Go
~~

.. code-block:: go

   func reverseList(head *ListNode) *ListNode {
       var previous *ListNode
       current := head

       for current != nil {
           nextNode := current.Next
           current.Next = previous
           previous = current
           current = nextNode
       }
       return previous
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function reverseList(head: ListNode | null): ListNode | null {
       let previous: ListNode | null = null;
       let current: ListNode | null = head;

       while (current !== null) {
           const nextNode: ListNode | null = current.next;
           current.next = previous;
           previous = current;
           current = nextNode;
       }
       return previous;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode ReverseList(ListNode head) {
           ListNode previous = null;
           ListNode current = head;

           while (current != null) {
               ListNode nextNode = current.next;
               current.next = previous;
               previous = current;
               current = nextNode;
           }
           return previous;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function reverse_list(
       head::Union{Nothing, ListNode},
   )::Union{Nothing, ListNode}
       previous = nothing
       current = head

       while current !== nothing
           next_node = current.next
           current.next = previous
           previous = current
           current = next_node
       end
       return previous
   end

R
~

.. code-block:: r

   reverse_list <- function(head) {
     previous <- NULL
     current <- head

     while (!is.null(current)) {
       next_node <- current$next
       current$next <- previous
       previous <- current
       current <- next_node
     }
     previous
   }

静态审查记录
------------

本章没有运行、编译或测试题解代码。已执行的静态审查包括：

* 人工推演空链、单节点、两节点、五节点和重复值链表；
* 逐实现确认读取原后继发生在覆盖 ``next`` 之前；
* 逐实现确认循环结束返回 ``previous``，不是已经为空的 ``current``；
* C/C++ 不调用 ``malloc/free/new/delete``，没有改变节点所有权；
* Python、Java、Go、TypeScript、C# 都只修改平台节点的 ``next``；
* Rust 先 ``node.next.take()`` 取得未处理后缀，再移动 ``previous`` 进入 ``node.next``，
  不存在同时借用和移动同一字段；
* Julia 使用 ``!== nothing`` 判断可变节点引用，修改对调用者共享对象可见；
* R 使用 ``environment`` 节点保持引用语义，循环局部变量重绑定不复制链表；
* 所有实现都假设输入无环，并明确返回新头。

剩余风险是代码未经过目标平台编译器或运行时验证。Julia 与 R 依赖仓库统一平台节点
模型；具体平台若使用不同类型名或字段名，需要替换接口外壳，核心状态变化不变。

易错点
------

* 覆盖 ``current.next`` 后才尝试读取原后继；
* 只移动指针变量，没有真正修改节点的 ``next``；
* 循环结束返回 ``current``，此时它已经为空；
* 忘记把原头的 ``next`` 改为空，导致旧链接残留；
* 创建新链表后仍声称原地 ``O(1)``；
* C 擅自释放仍属于结果的节点；
* Rust 克隆节点值而不是移动 ``Box`` 所有权；
* 调用者忽略返回的新头，继续把原头当作入口。

知识更新与关联
--------------

* 链表原地变换的关键是先保存即将被覆盖的可达路径；
* ``0203`` 修改前驱的 ``next`` 以跳过节点，``0206`` 修改当前节点的 ``next`` 以反转方向；
* ``0092`` Reverse Linked List II 在局部区间外还要保存前后边界连接；
* ``0143`` Reorder List 组合了找中点、反转后半段和交替合并；
* ``0234`` Palindrome Linked List 可反转半条链比较，并需要明确是否恢复输入。

自检题
------

#. 为什么必须先保存 ``next_node``？
#. 循环开始时 ``previous`` 和 ``current`` 分别表示什么？
#. 为什么把 ``current.next`` 指向 ``previous`` 不会创建环？
#. Rust 为什么要对 ``node.next`` 调用 ``take``？
#. 反转后为什么必须使用返回值，而不能继续使用原 ``head``？

答案要点
--------

#. 覆盖 ``current.next`` 会破坏通向未处理后缀的原链接，必须先保存。
#. ``previous`` 是已反转前缀的新头，``current`` 是未处理后缀首节点。
#. 当前节点原先不在无环的已反转前缀中，新增边只从当前节点进入该前缀，没有返回当前节点的路径。
#. ``take`` 把后继所有权移出字段并留下 ``None``，允许随后安全地把旧前缀所有权写入该字段。
#. 原头已经成为尾节点；只有返回值指向原尾形成的新入口。
