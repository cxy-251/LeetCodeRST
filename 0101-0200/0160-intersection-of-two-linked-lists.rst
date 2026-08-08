0160. Intersection of Two Linked Lists
======================================

题目信息
--------

:题号: 0160. 相交链表
:难度: Easy
:主题: 链表、双指针、路径对齐、对象身份
:原题: `LeetCode 0160 <https://leetcode.com/problems/intersection-of-two-linked-lists/>`_
:重点: 将共享后缀前的长度差抵消，使两指针同步进入交点；比较节点地址而不是值，且不修改链表

题目重述
--------

给定两条无环单链表 ``headA``、``headB``，返回它们开始共享的第一个节点对象；若没有共享节点，返回
``nullptr``。一旦两链在某节点相交，该节点之后的整个 ``next`` 后缀都相同。相同节点值不代表相交，不得
修改原链表，进阶目标为 ``O(1)`` 额外空间。

自建示例
--------

* A 的独立前缀为 ``7 -> 2``，B 的独立前缀为 ``9 -> 6 -> 1``，二者都连接到同一对象后缀
  ``4 -> 8``：返回共享节点 ``4``；
* A 为 ``3 -> 5 -> 7``，B 为另一批独立节点 ``1 -> 5 -> 9``：虽然都有值 ``5``，仍返回空；
* 两个头指针本来就相同：第一个共享节点就是头；任一链为空时没有非空交点。

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_set>

   class Solution {
   private:
       ListNode* rememberFirstList(
           ListNode* headA,
           ListNode* headB
       ) {
           std::unordered_set<ListNode*> nodesInA;
           for (ListNode* node = headA;
                node != nullptr;
                node = node->next) {
               nodesInA.insert(node);
           }
           for (ListNode* node = headB;
                node != nullptr;
                node = node->next) {
               if (nodesInA.count(node)) {
                   return node;
               }
           }
           return nullptr;
       }

       int listLength(ListNode* head) {
           int length = 0;
           while (head != nullptr) {
               ++length;
               head = head->next;
           }
           return length;
       }

       ListNode* alignExplicitLengths(
           ListNode* headA,
           ListNode* headB
       ) {
           int lengthA = listLength(headA);
           int lengthB = listLength(headB);

           while (lengthA > lengthB) {
               headA = headA->next;
               --lengthA;
           }
           while (lengthB > lengthA) {
               headB = headB->next;
               --lengthB;
           }
           while (headA != headB) {
               headA = headA->next;
               headB = headB->next;
           }
           return headA;
       }

       ListNode* alignBySwitchingPaths(
           ListNode* headA,
           ListNode* headB
       ) {
           ListNode* first = headA;
           ListNode* second = headB;

           while (first != second) {
               first = first == nullptr ? headB : first->next;
               second = second == nullptr ? headA : second->next;
           }
           return first;
       }

   public:
       ListNode* getIntersectionNode(
           ListNode* headA,
           ListNode* headB
       ) {
           return alignBySwitchingPaths(headA, headB);
       }
   };

题解
----

相交判断的对象是节点身份
~~~~~~~~~~~~~~~~~~~~~~~~

两链相交表示某一时刻两个 ``next`` 引用指向同一个 ``ListNode`` 对象，从此因为每个节点只有一个后继，
后缀全部共享。两个独立节点即使 ``val`` 相同，也不会让链的结构合并。因此所有方案都比较指针地址，不比较
节点值。

最直接的 ``rememberFirstList`` 把 A 中全部地址放入集合，再沿 B 找第一个命中地址。B 的遍历顺序保证首次
命中就是交点，时间 ``O(m+n)``；但集合保存 ``O(m)`` 个地址，没有利用共享部分一定是完整后缀的结构。

显式对齐长度为何有效
~~~~~~~~~~~~~~~~~~~~

设 A、B 在交点前的独立前缀长度分别为 ``a``、``b``，共享后缀长度为 ``c``。总长度是 ``a+c`` 与
``b+c``，差值正好是 ``a-b``。先让较长链的指针走过长度差，两指针到链尾的剩余距离相等，也就分别位于
长度相同的独立前缀起点；此后同步前进，若有交点会同时到达它。

``alignExplicitLengths`` 先扫描两链求长度，再推进较长一侧，最后比较地址。若无交点，两指针会同步走到
``nullptr``，循环也会终止并返回空。这已经达到 ``O(1)`` 空间，但要显式计算和修改两个长度计数。

路径切换怎样自动补齐差值
~~~~~~~~~~~~~~~~~~~~~~~~

让 ``first`` 先走 A，走到空后改从 B 头开始；``second`` 先走 B，再改从 A 头开始。若有交点：

.. code-block:: text

   first 到交点前走：  (a + c) + b = a + b + c
   second 到交点前走： (b + c) + a = a + b + c

第一段中的 ``c`` 是从交点走到链尾的共享后缀；换头后再走另一链的独立前缀。两根指针都经历一次 A 路径
和一次 B 路径，只是顺序相反，原有长度差自然抵消；到第二次进入共享后缀时，它们同时落在交点。

如果没有共享后缀，可视为 ``c=0``。两者各走完 ``m+n`` 个节点后同时成为 ``nullptr``；由于循环比较也把
两个空指针视为相等，正常结束，无需额外“无交点”计数器。

具体走读不同独立前缀
~~~~~~~~~~~~~~~~~~~~

对 ``A = A1 -> A2 -> C1 -> C2``、
``B = B1 -> B2 -> B3 -> C1 -> C2``：

.. list-table::
   :header-rows: 1

   * - 指针
     - 第一条路径
     - 换头后的补偿
     - 对齐位置
   * - ``first``
     - 走完 ``A1,A2,C1,C2``
     - 再走 ``B1,B2,B3``
     - ``C1``
   * - ``second``
     - 走完 ``B1,B2,B3,C1,C2``
     - 再走 ``A1,A2``
     - ``C1``

两个指针第一次经过 ``C1`` 的时刻可能不同，不能在那里单独停下；交换路径后消除前缀差，才会在同一轮比较
中相等。

切换发生在空指针而不是尾节点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

更新写成 ``pointer == nullptr ? otherHead : pointer->next``。指针先从尾节点走到空，下一轮才切换到另一头；
两侧遵守同一计步规则，长度等式包含完整链长。若在尾节点直接跳头，会少计空边界并使推导与实现不一致，
容易出现一轮偏差。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开入口采用路径切换法：每个指针至多遍历 A、B 各一次，时间 ``O(m+n)``，只用两个指针，空间 ``O(1)``；
不写任何节点字段。显式长度对齐同样满足上界，状态更直观；路径切换把两次长度扫描和差值推进压缩进统一
游标规则。地址集合保留为从“首次重复身份”定义出发的基线，代价是线性空间。
