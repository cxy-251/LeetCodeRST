0206. Reverse Linked List
=========================

题目信息
--------

:题号: 0206. 反转链表
:难度: Easy
:主题: 单链表、指针、递归、原地重接
:原题: `LeetCode 0206 <https://leetcode.com/problems/reverse-linked-list/>`_
:重点: 保存未处理后继后反转当前链接，维护已反转前缀与未处理后缀

题目重述
--------

给定单链表头节点 ``head``，把链表中的节点顺序完全反转并返回新的头节点。节点中的值不变，
只改变节点之间的 ``next`` 方向；空链表仍返回空指针，单节点链表仍返回该节点。

链表节点数为 ``0`` 到 ``5000``，节点值位于 ``[-5000, 5000]``。题目允许用迭代或递归实现，
返回值必须是原链表最后一个节点，而不是新建的值数组。

自建示例
--------

普通链表反转：

.. code-block:: text

   输入：head = [1, 2, 3, 4, 5]
   输出：[5, 4, 3, 2, 1]

重复值只改变节点顺序，不会合并节点：

.. code-block:: text

   输入：head = [4, 1, 4, 7]
   输出：[7, 4, 1, 4]

空链表不进入循环：

.. code-block:: text

   输入：head = []
   输出：[]

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       ListNode* reverseList(ListNode* head) {
           return reverseIteratively(head);
       }

   private:
       ListNode* reverseIteratively(ListNode* head) {
           ListNode* previous = nullptr;
           ListNode* current = head;

           while (current != nullptr) {
               ListNode* next = current->next;
               current->next = previous;
               previous = current;
               current = next;
           }
           return previous;
       }

       ListNode* reverseRecursively(ListNode* head) {
           if (head == nullptr || head->next == nullptr) return head;

           ListNode* newHead = reverseRecursively(head->next);
           head->next->next = head;
           head->next = nullptr;
           return newHead;
       }
   };

题解
----

原地反转的直接障碍
~~~~~~~~~~~~~~~~~~

把节点值复制到数组再倒序输出，可以得到正确的值序列，但它没有反转原链表的链接，也改变了
节点身份。逐个创建新节点同样把问题变成复制，额外保存了与节点数成正比的对象。

原地操作只能修改 ``next``。若当前链表片段是 ``previous`` 和 ``current``，最直接的想法是令
``current->next = previous``；但这会覆盖当前节点原本指向的未处理后继。后继一旦丢失，剩余节点
就无法再被访问。因此反转一个链接需要三个角色：已反转前缀、当前节点、修改前保存的后继。

迭代法维护两个边界
~~~~~~~~~~~~~~~~~~~~

初始化时：

.. code-block:: text

   previous = null
   current  = head -> ...

每轮先保存 ``next = current->next``，再把当前节点的链接反向指向 ``previous``。当前节点加入
已反转前缀后，``previous`` 前进到它，``current`` 则沿保存的 ``next`` 进入未处理后缀。

循环开始时保持以下不变量：

* ``previous`` 可达的链正好是原链表已经处理的前缀，顺序已完全反转；
* ``current`` 可达的链正好是尚未处理的原后缀，内部链接仍保持原方向；
* 两部分节点不相交，合并后仍包含全部原节点；
* 已反转链的尾节点指向空，当前轮不会从已处理部分回到未处理部分；
* 节点值不变，也没有复制或释放节点。

若提前覆盖 ``current->next``，第二条不变量立即失效；所以保存后继必须位于改写链接之前。

状态走读
~~~~~~~~

对 ``1 -> 2 -> 3``：

.. list-table::
   :header-rows: 1

   * - 阶段
     - previous
     - current
     - 本轮保存的 next
   * - 初始
     - 空
     - ``1 -> 2 -> 3``
     - 尚未读取
   * - 处理 1 后
     - ``1 -> null``
     - ``2 -> 3``
     - 2
   * - 处理 2 后
     - ``2 -> 1 -> null``
     - ``3``
     - 3
   * - 处理 3 后
     - ``3 -> 2 -> 1 -> null``
     - 空
     - 空

循环结束的判据是 ``current == nullptr``，因此 ``previous`` 已经是完整反转链的新头。

递归法把未处理后缀交给调用栈
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

递归版本把“反转从 ``head->next`` 开始的后缀”作为子问题。空节点或单节点是基例，自己已经是
反转结果的头。子调用返回后，``head->next`` 指向原来的后继链尾；令
``head->next->next = head``，就把当前节点接到后缀末端，再令 ``head->next = nullptr`` 切断
旧方向，避免形成环。

递归的结构更接近“先把后缀反转，再把当前节点接到尾部”，但调用栈保存了每一层尚未完成的节点。
题目明确要求可以实现两种方法，因此代码保留递归版本；公共入口选择迭代版本以使用常量额外空间。

代码分析
~~~~~~~~

``reverseIteratively`` 中 ``next`` 是唯一不能省略的临时状态；它保存的不是新节点，而是当前
链接被覆盖前的原后继。``previous`` 与 ``current`` 的移动顺序也必须在改写后完成，否则会把
当前节点再次当作未处理节点或丢失前缀。

``reverseRecursively`` 不需要额外的节点容器，但基例直接返回后缀头，回溯阶段只修改两条链接：
后继指向当前节点、当前节点指向空。两种方法都复用原节点，公共入口明确使用迭代主解；递归函数
保留的是栈空间与结构表达上的认知增量，而不是另一份逐行重复代码。

复杂度与边界
~~~~~~~~~~~~

迭代法每个节点处理一次，时间复杂度 ``O(n)``，额外空间 ``O(1)``；递归法同为 ``O(n)`` 时间，
调用栈额外空间 ``O(n)``。输入为空时 ``current`` 初始为空，返回 ``nullptr``；单节点时循环
执行一次后返回该节点；原头节点第一次被处理后指向空，自动成为反转结果的尾节点。

函数只重接原节点，不修改值、不创建新节点、不主动释放节点；节点生命周期仍由调用方或评测平台
管理。
