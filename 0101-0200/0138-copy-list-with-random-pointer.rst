0138. Copy List with Random Pointer
===================================

题目信息
--------

:题号: 0138. 复制带随机指针的链表
:难度: Medium
:主题: 链表、深拷贝、节点映射、原地穿插
:原题: `LeetCode 0138 <https://leetcode.com/problems/copy-list-with-random-pointer/>`_
:重点: 先保证每个原节点有唯一副本，再复制两类引用；用相邻位置编码映射并在拆分时恢复原链

题目重述
--------

链表节点包含 ``val``、``next`` 和 ``random``。``next`` 指向下一个节点，``random`` 可以指向链表内任意
节点或为空。返回整条结构的深拷贝：每个原节点都对应一个全新副本，副本间的 ``next``、``random`` 关系
与原结构相同，返回结构中不能留下任何原节点引用。空链表返回 ``nullptr``。

自建示例
--------

.. code-block:: text

   next：   A(4) -> B(4) -> C(9) -> null
   random： A -> C，B -> A，C -> C

副本应为 ``a -> b -> c``，其中 ``a.random = c``、``b.random = a``、``c.random = c``。``A`` 与 ``B``
值相同，仍是两个不同对象，必须创建两个不同副本。若某节点 ``random = null``，对应副本也应指向空。

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_map>

   class Solution {
   private:
       Node* copyWithAddressMap(Node* head) {
           if (head == nullptr) {
               return nullptr;
           }

           std::unordered_map<Node*, Node*> copies;
           for (Node* original = head;
                original != nullptr;
                original = original->next) {
               copies[original] = new Node(original->val);
           }

           for (Node* original = head;
                original != nullptr;
                original = original->next) {
               Node* copy = copies[original];
               copy->next = original->next == nullptr
                   ? nullptr
                   : copies[original->next];
               copy->random = original->random == nullptr
                   ? nullptr
                   : copies[original->random];
           }
           return copies[head];
       }

       Node* copyByInterleaving(Node* head) {
           if (head == nullptr) {
               return nullptr;
           }

           for (Node* original = head; original != nullptr;) {
               Node* nextOriginal = original->next;
               Node* copy = new Node(original->val);
               original->next = copy;
               copy->next = nextOriginal;
               original = nextOriginal;
           }

           for (Node* original = head; original != nullptr;) {
               Node* copy = original->next;
               copy->random = original->random == nullptr
                   ? nullptr
                   : original->random->next;
               original = copy->next;
           }

           Node* copyHead = head->next;
           for (Node* original = head; original != nullptr;) {
               Node* copy = original->next;
               Node* nextOriginal = copy->next;
               original->next = nextOriginal;
               copy->next = nextOriginal == nullptr
                   ? nullptr
                   : nextOriginal->next;
               original = nextOriginal;
           }
           return copyHead;
       }

   public:
       Node* copyRandomList(Node* head) {
           return copyByInterleaving(head);
       }
   };

题解
----

为什么沿 ``next`` 复制还不够
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

仅沿 ``next`` 创建一条值相同的新链表，只解决了节点顺序。若随后写 ``copy->random = original->random``，
副本仍指向原节点，结果不是深拷贝；若按照 ``random`` 指向的值去找副本，重复值又会让目标身份不确定。

因此核心问题是把任意原节点引用翻译成它的唯一副本引用。``random`` 可能向前、向后、自指或为空，赋值时
不能假定目标已经沿扫描方向处理完成。

方案一：显式保存地址映射
~~~~~~~~~~~~~~~~~~~~~~~~

``copyWithAddressMap`` 第一遍只创建节点，得到完整的 ``original -> copy`` 哈希映射；第二遍才翻译
``next`` 与 ``random``。先完成全部创建很重要：当 ``A.random`` 指向链尾 ``C`` 时，即使当前还没扫描到
``C`` 的引用，映射中已经有 ``copy(C)``。

映射键必须是原节点地址，而不是 ``val``。它同时保证：每个原节点只创建一份副本、不同原节点即使同值也
不会合并、两条引用指向同一原节点时会落到同一个副本。

该方案时间 ``O(n)``、逻辑直接，但映射额外保存 ``O(n)`` 对地址。链表 ``next`` 的固定顺序还提供了更强
结构，可以把这张映射临时编码在指针位置中。

方案二：让副本紧跟自己的原节点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

第一遍在每个原节点后插入其副本：

.. code-block:: text

   原结构：A -> B -> C
   穿插后：A -> a -> B -> b -> C -> c

此时任意原节点 ``X`` 的副本都能用 ``X->next`` 在常数时间取得，原地址到副本地址的映射不再需要哈希表。
创建 ``a`` 时先保存 ``B`` 为 ``nextOriginal``，再改写 ``A.next``，保证扫描仍能跳到下一个原节点。

第二遍为何能复制任意 ``random``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

穿插完成后，所有原节点的副本都已存在。若 ``A.random = C``，那么 ``C.next`` 正是 ``c``，所以：

.. code-block:: text

   a.random = A.random == null ? null : A.random.next

自指同样成立：``C.random = C`` 会得到 ``c.random = C.next = c``。空指针必须单独保留为空，不能解引用。
第二遍每次从原节点取得紧邻副本，处理后通过 ``copy->next`` 跳到下一原节点；此时 ``copy->next`` 仍保持
第一遍保存的原后继。

第三遍必须同时恢复两条链
~~~~~~~~~~~~~~~~~~~~~~~~~~

穿插结构不是最终输出，也不能永久破坏调用者的原链。处理一组 ``original -> copy -> nextOriginal`` 时：

#. ``original->next = nextOriginal``，恢复原链的一条边；
#. 若下一原节点存在，``copy->next = nextOriginal->next``，连接到它的副本；否则副本链结束；
#. 移动到 ``nextOriginal``，继续处理尚未拆分的交织后缀。

顺序依赖尚未删除的邻接编码。取得 ``nextOriginal`` 后再改两个 ``next``，既不会丢失下一原节点，也能在它
仍与副本相邻时找到下一副本。

具体状态走读
~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 阶段
     - ``next`` 结构
     - 已确定的 ``random``
   * - 初始
     - ``A -> B -> C``
     - 只存在原节点引用
   * - 穿插
     - ``A -> a -> B -> b -> C -> c``
     - 副本尚未连接
   * - 随机指针复制
     - 交织结构保持
     - ``a -> c``、``b -> a``、``c -> c``
   * - 拆分
     - 原链 ``A -> B -> C``；副本链 ``a -> b -> c``
     - 全部只指向各自链内节点

主解选择、正确性与复杂度
~~~~~~~~~~~~~~~~~~~~~~~~

三遍扫描后，每个副本由 ``new Node`` 独立创建；其 ``next`` 指向下一原节点的紧邻副本，``random`` 指向
原随机目标的紧邻副本，因此两类边都与原结构一一对应且不含原引用。拆分还原了每条原 ``next`` 边，原链
保持不变。

公开入口采用穿插法：三次线性扫描，时间 ``O(n)``；除返回的新节点外只维护常数个指针，工作空间 ``O(1)``。
显式映射法同为 ``O(n)`` 时间、额外 ``O(n)`` 空间，代码更直接，也适合不能临时修改原结构的场景。穿插法
的代价正是复制期间会短暂改写原链，因此并非在所有并发或只读环境中都更合适。
