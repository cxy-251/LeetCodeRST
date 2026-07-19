0138. Copy List with Random Pointer
===================================

题目信息
--------

:题号: 0138
:难度: Medium
:主题: 链表、哈希映射、对象身份、深拷贝
:原题: `LeetCode 0138 <https://leetcode.com/problems/copy-list-with-random-pointer/>`_
:访问状态: Available
:教学重点: 用原节点身份到新节点的双射分离“创建对象”和“复制关系”，并证明新旧对象图完全隔离

题目重述
--------

给定一条链表。每个节点除整数值 ``val`` 和后继 ``next`` 外，还有一个 ``random`` 引用；它可以指向链表中
任意节点，也可以为空。构造并返回整条链表的深拷贝。

深拷贝必须创建全新的节点集合，复制所有值、``next`` 和 ``random`` 关系；返回结构中的任何引用都不能指向
原链表节点。原链表在调用后保持不变。

精确契约与平台模型
------------------

* 链表包含 ``n`` 个节点，``0 <= n <= 1000``；``next`` 构成从 ``head`` 出发的有限无环链。
* ``-10^4 <= Node.val <= 10^4``，不同节点的值可以相同。
* 每个 ``random`` 要么为空，要么指向这条链中的某个节点；允许前向、后向和自引用。
* 平台实际传给函数的是头节点引用，不是题面展示用的 ``[val, random_index]`` 序列。
* C、C++、Python、Java、Rust、Go、TypeScript、C# 的 ``Node`` 由平台提供，字段语义为
  ``val``、``next``、``random``；代码不重复定义平台类型。
* Julia 和 R 使用本题首次建立的仓库随机链表引用模型：Julia 用 ``mutable struct``，R 用
  ``environment``。
* 成功返回后，副本节点由平台或语言运行时管理；算法不释放、不复用也不修改原节点。

自建示例：相同值不代表相同节点
------------------------------

设原链表有三个节点 ``A -> B -> C``：

.. code-block:: text

   节点：       A       B       C
   val：        4       4       9
   random：     C       A       C

副本必须包含三个不同的新节点 ``a -> b -> c``，并满足 ``a.random = c``、``b.random = a``、
``c.random = c``。虽然 ``A`` 与 ``B`` 的值相同，它们的身份不同，不能共用一个副本。这个例子同时覆盖
前向引用、后向引用、自引用和重复值。

空链表返回空。单节点 ``X`` 且 ``X.random = X`` 时，必须返回新节点 ``x``，令 ``x.random = x``，
而不能令它指回 ``X``。

问题抽象
--------

把原链表看成一个对象图：``next`` 和 ``random`` 都是有向边。需要建立映射

.. code-block:: text

   copy_of: 原节点身份 -> 唯一副本节点身份

并满足：

* 对每个原节点 ``u``，``copy_of[u].val = u.val``；
* 若 ``u.next = v``，则 ``copy_of[u].next = copy_of[v]``；
* 若 ``u.random = w``，则 ``copy_of[u].random = copy_of[w]``；
* 空边仍为空；所有 ``copy_of`` 的值都是新分配对象。

难点不在沿 ``next`` 找到节点，而在 ``random`` 可能指向尚未扫描到的后方节点，也可能回到已经扫描过的节点。
因此不能在第一次遇到一条边时临时猜测目标副本；应先把全部节点的身份映射建立完整，再复制边。

解法取舍
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 算法额外空间
     - 取舍
   * - 两遍扫描 + 身份映射
     - 期望 ``O(n)``
     - ``O(n)``
     - 主解；阶段边界清晰，十语言容易保持同一证明
   * - DFS/递归克隆对象图 + 映射
     - 期望 ``O(n)``
     - ``O(n)`` 映射与栈
     - 可行，但链长会形成额外递归深度
   * - 原链表中交织副本再拆分
     - ``O(n)``
     - ``O(1)`` 算法空间
     - 暂时改写原 ``next``；恢复与异常清理更复杂，跨语言所有权差异大
   * - 按节点值建立映射
     - 不适用
     - 不适用
     - 错误；重复值会合并不同节点身份

题目没有要求常量额外空间。主解选择身份映射，是因为它保持原链表全程只读，把对象创建和边复制分成两个可独立
证明的阶段；这比为了省映射而暂时破坏输入拓扑更适合教学和跨语言静态审查。

主解：先建双射，再复制两类边
--------------------------------

第一遍：创建全部副本
~~~~~~~~~~~~~~~~~~~~

沿 ``next`` 从 ``head`` 扫描。对每个原节点 ``u``：

#. 创建一个值为 ``u.val``、``next/random`` 暂为空的新节点；
#. 记录 ``copies[u] = new_node``。

第一遍处理完前 ``k`` 个节点后的不变量是：

* 映射的定义域恰好是前 ``k`` 个原节点；
* 每个映射值都是本次调用单独创建的新节点；
* 不同原节点对应不同副本，即使节点值相同；
* 已创建副本的值正确，边暂时为空；
* 原节点的三个字段都没有被修改。

第二遍：复制 ``next`` 与 ``random``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

第一遍结束后，所有合法非空边的目标都已经是映射键。再次沿原链表扫描，对每个原节点 ``u`` 设置：

.. code-block:: text

   copies[u].next = null if u.next is null else copies[u.next]
   copies[u].random = null if u.random is null else copies[u.random]

第二遍处理完前 ``k`` 个节点后的不变量是：

* 映射仍是原节点集合到副本集合的双射；
* 前 ``k`` 个副本的 ``next``、``random`` 已准确复制；
* 这些已写入的非空边只指向映射值，因此只指向新节点；
* 后续副本已经存在，即使边尚未填写，也可安全成为当前 ``random`` 的目标；
* 原链表仍然只读。

状态与代码变量映射
~~~~~~~~~~~~~~~~~~

* ``copies``：身份映射 ``copy_of``；C 使用指针键开放寻址表，Java/Julia 使用显式身份字典；
* ``node`` 或 ``current``：当前原节点，只沿原 ``next`` 前进；
* ``copy``：``copies[current]``，第二遍只写这个新对象；
* C 的 ``originals``/``created`` 与 R 的两个列表：保存按 ``next`` 顺序对应的原节点和副本，分别用于
  资源清理或身份查找；
* Rust 的原指针只作为哈希身份令牌，从不解引用裸指针。

正确性证明
----------

引理一：第一遍在原节点集合与副本节点集合之间建立双射。
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``next`` 构成含 ``n`` 个节点的有限链，所以第一遍恰好访问每个原节点一次。每次访问都创建一个此前不存在的
新对象并登记一次；不会为同一原节点重复创建，也不会让两个原节点共享一次分配。因此每个原节点恰有一个副本，
每个创建的副本也恰好对应一个原节点，映射是双射。创建时复制 ``val``，所以节点值已经保持。

引理二：第二遍准确保持全部 ``next`` 和 ``random`` 边。
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

处理任意原节点 ``u`` 时，若某条边为空，算法写入空；若边指向原节点 ``v``，契约保证 ``v`` 位于原链表，
由引理一 ``copies[v]`` 已存在且唯一。算法把对应副本边写成这个唯一对象。因此 ``u`` 的两类边都被准确映射。
第二遍访问全部原节点，故没有遗漏任何边，也没有添加题面之外的边。

引理三：返回结构与原链表没有节点身份共享。
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

返回头是 ``copies[head]``，由第一遍新建。根据第二遍写边规则，副本中的每条非空 ``next`` 或 ``random``
都取自 ``copies`` 的值；根据引理一，这些值全部是新对象。由返回头沿任意边可达的节点都不可能是原节点，
因此新旧结构完全隔离。

引理四：原链表在算法结束后保持不变。
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

两遍扫描都只读取原节点的 ``val``、``next``、``random``；所有赋值目标都是新节点、映射或辅助容器。
所以原节点字段和原有边从未改变。

定理：算法返回原链表的完整深拷贝。
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

空输入直接返回空，结论显然。非空输入中，引理一给出值保持的节点双射，引理二证明双射保持两类边，
引理三证明对象集合隔离，引理四证明没有破坏原输入。这四项正好覆盖深拷贝契约，因此返回值正确。

终止性
~~~~~~

两遍循环都只沿有限无环的原 ``next`` 链前进，每轮移动到下一个节点，至多执行 ``n`` 次。``random`` 只用于
常数次映射查询，不沿它递归或循环，所以自引用与随机边环不会影响终止。

复杂度、返回载荷与所有权
------------------------

对使用身份哈希映射的 C、C++、Python、Java、Rust、Go、TypeScript、C#、Julia 版本：

* 每个原节点被常数次访问，哈希查询期望 ``O(1)`` 时，总时间期望 ``O(n)``；
* 哈希严重碰撞时最坏查询可能退化，因此不声称无条件最坏 ``O(n)``；
* 映射和少量适配器数组占 ``O(n)`` 算法额外空间；
* 返回值必须包含 ``n`` 个新节点以及至多 ``2n-1`` 条非空引用，返回载荷为 ``Theta(n)``；
* 计入返回结构时，峰值空间仍为 ``O(n)``。

R 用 ``identical`` 在线性表中查找 ``random`` 目标身份，最坏每个节点扫描 ``n`` 个候选，时间
``O(n^2)``；两个辅助列表占 ``O(n)``，返回载荷仍为 ``Theta(n)``。这是 R 基础适配器的真实成本。

C 在成功时只释放映射和辅助数组，返回的新链表节点交给平台；任何中途分配失败都会逐个释放已经创建的副本。
C++ 用临时 ``unique_ptr`` 列表保证构造阶段异常时释放半成品，成功前再把节点所有权交给平台。托管语言由运行时
管理新对象；Rust 的 ``Rc`` 适配器若 ``random`` 形成强引用环，可能延长这些节点的生命周期，这是平台节点表示
本身的资源特性，不改变深拷贝结构正确性。

十语言实现
----------

C
~

``struct Node`` 由平台提供。哈希表容量保持为二的幂，节点数不超过表容量一半；裸指针只用于身份比较和哈希。

.. code-block:: c

   #include <stdint.h>
   #include <stdlib.h>

   struct PointerEntry {
       const struct Node *key;
       struct Node *copy;
   };

   static size_t pointer_hash(
       const struct Node *node,
       size_t mask
   ) {
       uintptr_t value = (uintptr_t)node;
       value ^= value >> 4;
       value ^= value >> 9;
       return (size_t)value & mask;
   }

   static void insert_pointer(
       struct PointerEntry *table,
       size_t mask,
       const struct Node *key,
       struct Node *copy
   ) {
       size_t slot = pointer_hash(key, mask);
       while (table[slot].key != NULL) {
           slot = (slot + 1U) & mask;
       }
       table[slot].key = key;
       table[slot].copy = copy;
   }

   static struct Node *find_copy(
       const struct PointerEntry *table,
       size_t mask,
       const struct Node *key
   ) {
       if (key == NULL) {
           return NULL;
       }

       size_t slot = pointer_hash(key, mask);
       while (table[slot].key != NULL) {
           if (table[slot].key == key) {
               return table[slot].copy;
           }
           slot = (slot + 1U) & mask;
       }
       return NULL;
   }

   static void free_created(
       struct Node **created,
       size_t count
   ) {
       for (size_t index = 0; index < count; ++index) {
           free(created[index]);
       }
   }

   struct Node *copyRandomList(struct Node *head) {
       if (head == NULL) {
           return NULL;
       }

       size_t count = 0U;
       for (const struct Node *node = head;
            node != NULL;
            node = node->next) {
           ++count;
       }

       if (count > SIZE_MAX / 2U ||
           count > SIZE_MAX / sizeof(struct Node *)) {
           return NULL;
       }

       size_t capacity = 1U;
       size_t target = count * 2U;
       while (capacity < target) {
           if (capacity > SIZE_MAX / 2U) {
               return NULL;
           }
           capacity *= 2U;
       }
       if (capacity > SIZE_MAX / sizeof(struct PointerEntry)) {
           return NULL;
       }

       const struct Node **originals = malloc(
           count * sizeof(*originals)
       );
       struct Node **created = malloc(
           count * sizeof(*created)
       );
       struct PointerEntry *table = calloc(
           capacity, sizeof(*table)
       );
       if (originals == NULL || created == NULL || table == NULL) {
           free(originals);
           free(created);
           free(table);
           return NULL;
       }

       size_t index = 0U;
       for (const struct Node *node = head;
            node != NULL;
            node = node->next) {
           struct Node *copy = malloc(sizeof(*copy));
           if (copy == NULL) {
               free_created(created, index);
               free(originals);
               free(created);
               free(table);
               return NULL;
           }

           copy->val = node->val;
           copy->next = NULL;
           copy->random = NULL;
           originals[index] = node;
           created[index] = copy;
           insert_pointer(table, capacity - 1U, node, copy);
           ++index;
       }

       for (index = 0U; index < count; ++index) {
           created[index]->next =
               index + 1U < count ? created[index + 1U] : NULL;
           created[index]->random = find_copy(
               table, capacity - 1U, originals[index]->random
           );

           if (originals[index]->random != NULL &&
               created[index]->random == NULL) {
               free_created(created, count);
               free(originals);
               free(created);
               free(table);
               return NULL;
           }
       }

       struct Node *answer = created[0];
       free(originals);
       free(created);
       free(table);
       return answer;
   }

C++
~~~

``Node`` 由平台提供。``unique_ptr`` 只在构造期间拥有副本；成功后调用 ``release`` 把所有权交给返回图。

.. code-block:: cpp

   #include <memory>
   #include <unordered_map>
   #include <vector>

   class Solution {
   public:
       Node* copyRandomList(Node* head) {
           if (head == nullptr) {
               return nullptr;
           }

           std::unordered_map<Node*, Node*> copies;
           std::vector<std::unique_ptr<Node>> owned;

           for (Node* node = head; node != nullptr; node = node->next) {
               auto copy = std::make_unique<Node>(node->val);
               copies.emplace(node, copy.get());
               owned.push_back(std::move(copy));
           }

           for (Node* node = head; node != nullptr; node = node->next) {
               Node* copy = copies.at(node);
               copy->next = node->next == nullptr
                   ? nullptr
                   : copies.at(node->next);
               copy->random = node->random == nullptr
                   ? nullptr
                   : copies.at(node->random);
           }

           Node* answer = copies.at(head);
           for (auto& copy : owned) {
               copy.release();
           }
           return answer;
       }
   };

Python
~~~~~~

平台节点在调用期间全部存活，``id(node)`` 因而是稳定且唯一的身份键；该写法不依赖 ``Node`` 是否可哈希。

.. code-block:: python

   class Solution:
       def copyRandomList(
           self,
           head: "Node | None",
       ) -> "Node | None":
           if head is None:
               return None

           copies: dict[int, Node] = {}
           node = head
           while node is not None:
               copies[id(node)] = Node(node.val)
               node = node.next

           node = head
           while node is not None:
               copy = copies[id(node)]
               copy.next = (
                   None if node.next is None
                   else copies[id(node.next)]
               )
               copy.random = (
                   None if node.random is None
                   else copies[id(node.random)]
               )
               node = node.next

           return copies[id(head)]

Java
~~~~

``IdentityHashMap`` 明确以 ``==`` 比较键，不受 ``Node.equals`` 是否覆写的影响。

.. code-block:: java

   import java.util.IdentityHashMap;
   import java.util.Map;

   class Solution {
       public Node copyRandomList(Node head) {
           if (head == null) {
               return null;
           }

           Map<Node, Node> copies = new IdentityHashMap<>();
           for (Node node = head; node != null; node = node.next) {
               copies.put(node, new Node(node.val));
           }

           for (Node node = head; node != null; node = node.next) {
               Node copy = copies.get(node);
               copy.next = node.next == null
                   ? null
                   : copies.get(node.next);
               copy.random = node.random == null
                   ? null
                   : copies.get(node.random);
           }
           return copies.get(head);
       }
   }

Rust
~~~~

原节点和副本沿用平台的 ``Rc<RefCell<Node>>`` 表示。原 ``Rc`` 的分配地址只作为哈希键；代码先结束不可变借用，
再可变借用副本，避免 ``RefCell`` 借用重叠。

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::HashMap;
   use std::rc::Rc;

   impl Solution {
       pub fn copy_random_list(
           head: Option<Rc<RefCell<Node>>>,
       ) -> Option<Rc<RefCell<Node>>> {
           let mut copies: HashMap<
               *const RefCell<Node>,
               Rc<RefCell<Node>>,
           > = HashMap::new();

           let mut current = head.clone();
           while let Some(original) = current {
               let (value, next) = {
                   let node = original.borrow();
                   (node.val, node.next.clone())
               };
               copies.insert(
                   Rc::as_ptr(&original),
                   Rc::new(RefCell::new(Node {
                       val: value,
                       next: None,
                       random: None,
                   })),
               );
               current = next;
           }

           current = head.clone();
           while let Some(original) = current {
               let key = Rc::as_ptr(&original);
               let copy = Rc::clone(copies.get(&key).unwrap());
               let (next, random) = {
                   let node = original.borrow();
                   (node.next.clone(), node.random.clone())
               };

               let copy_next = next.as_ref().map(|target| {
                   Rc::clone(copies.get(&Rc::as_ptr(target)).unwrap())
               });
               let copy_random = random.as_ref().map(|target| {
                   Rc::clone(copies.get(&Rc::as_ptr(target)).unwrap())
               });
               {
                   let mut node = copy.borrow_mut();
                   node.next = copy_next;
                   node.random = copy_random;
               }
               current = next;
           }

           head.as_ref().map(|root| {
               Rc::clone(copies.get(&Rc::as_ptr(root)).unwrap())
           })
       }
   }

Go
~~

Go 的指针可直接作为 ``map`` 键；读取不存在的 ``nil`` 键会得到零值 ``nil``，但这里仍显式区分空边。

.. code-block:: go

   func copyRandomList(head *Node) *Node {
       if head == nil {
           return nil
       }

       copies := make(map[*Node]*Node)
       for node := head; node != nil; node = node.Next {
           copies[node] = &Node{Val: node.Val}
       }

       for node := head; node != nil; node = node.Next {
           copy := copies[node]
           if node.Next != nil {
               copy.Next = copies[node.Next]
           }
           if node.Random != nil {
               copy.Random = copies[node.Random]
           }
       }
       return copies[head]
   }

TypeScript
~~~~~~~~~~

ECMAScript ``Map`` 的对象键按对象身份区分；辅助函数把 ``undefined`` 与题目中的合法 ``null`` 明确分开。

.. code-block:: typescript

   function copyRandomList(head: Node | null): Node | null {
       if (head === null) {
           return null;
       }

       const copies = new Map<Node, Node>();
       for (
           let node: Node | null = head;
           node !== null;
           node = node.next
       ) {
           copies.set(node, new Node(node.val));
       }

       const copyOf = (target: Node | null): Node | null => {
           if (target === null) {
               return null;
           }
           const copy = copies.get(target);
           if (copy === undefined) {
               throw new Error("pointer outside input list");
           }
           return copy;
       };

       for (
           let node: Node | null = head;
           node !== null;
           node = node.next
       ) {
           const copy = copyOf(node) as Node;
           copy.next = copyOf(node.next);
           copy.random = copyOf(node.random);
       }
       return copyOf(head);
   }

C#
~~

自定义比较器强制按引用身份比较键，避免平台节点未来覆写值相等后错误合并节点。

.. code-block:: csharp

   using System.Collections.Generic;
   using System.Runtime.CompilerServices;

   public class Solution {
       private sealed class NodeIdentityComparer : IEqualityComparer<Node> {
           public bool Equals(Node first, Node second) {
               return object.ReferenceEquals(first, second);
           }

           public int GetHashCode(Node node) {
               return RuntimeHelpers.GetHashCode(node);
           }
       }

       public Node CopyRandomList(Node head) {
           if (head == null) {
               return null;
           }

           var copies = new Dictionary<Node, Node>(
               new NodeIdentityComparer()
           );
           for (Node node = head; node != null; node = node.next) {
               copies[node] = new Node(node.val);
           }

           for (Node node = head; node != null; node = node.next) {
               Node copy = copies[node];
               copy.next = node.next == null
                   ? null
                   : copies[node.next];
               copy.random = node.random == null
                   ? null
                   : copies[node.random];
           }
           return copies[head];
       }
   }

Julia
~~~~~

``RandomNode`` 是仓库的 Julia 随机链表节点模型；``IdDict`` 使用 ``objectid`` 哈希和 ``===`` 相等。

.. code-block:: julia

   mutable struct RandomNode
       val::Int
       next::Union{Nothing,RandomNode}
       random::Union{Nothing,RandomNode}
   end

   RandomNode(val::Int) = RandomNode(val, nothing, nothing)

   function copy_random_list(
       head::Union{Nothing,RandomNode},
   )::Union{Nothing,RandomNode}
       head === nothing && return nothing

       copies = IdDict{RandomNode,RandomNode}()
       node = head
       while node !== nothing
           copies[node] = RandomNode(node.val)
           node = node.next
       end

       node = head
       while node !== nothing
           copy = copies[node]
           copy.next = if node.next === nothing
               nothing
           else
               copies[node.next]
           end
           copy.random = if node.random === nothing
               nothing
           else
               copies[node.random]
           end
           node = node.next
       end
       return copies[head]
   end

R
~

R 用 ``environment`` 表达可变节点身份。基础 R 没有直接把 environment 身份作为哈希键的标准接口，
所以适配器用 ``identical`` 在线性表中定位目标。

.. code-block:: r

   new_random_node <- function(val) {
     node <- new.env(parent = emptyenv())
     node$val <- val
     node$next <- NULL
     node$random <- NULL
     node
   }

   copy_random_list <- function(head) {
     if (is.null(head)) return(NULL)

     n <- 0L
     node <- head
     while (!is.null(node)) {
       n <- n + 1L
       node <- node$next
     }

     originals <- vector("list", n)
     copies <- vector("list", n)
     node <- head
     for (index in seq_len(n)) {
       originals[[index]] <- node
       copies[[index]] <- new_random_node(node$val)
       node <- node$next
     }

     find_copy <- function(target) {
       for (index in seq_len(n)) {
         if (identical(originals[[index]], target)) {
           return(copies[[index]])
         }
       }
       stop("pointer outside input list")
     }

     for (index in seq_len(n)) {
       copy <- copies[[index]]
       if (index < n) {
         copy$next <- copies[[index + 1L]]
       }
       target <- originals[[index]]$random
       if (!is.null(target)) {
         copy$random <- find_copy(target)
       }
     }
     copies[[1L]]
   }

语言适配、身份语义与失败路径
----------------------------

* **C**：指针地址只作为身份键；表负载不超过二分之一，空槽保证查找终止。所有失败路径释放辅助容器和已创建
  节点；成功后平台接管返回链表。
* **C++**：裸指针键按地址区分节点。``unique_ptr`` 暂存使 ``new``、哈希扩容或容器扩容抛异常时不会泄漏
  已创建节点；成功后显式交出所有权。
* **Python**：用 ``id`` 规避自定义 ``__eq__``/``__hash__`` 的影响。原节点在整个调用中仍由原链和局部引用
  保持存活，所以键不会因对象回收而复用。
* **Java**：``IdentityHashMap`` 用 ``==`` 而不是 ``equals`` 比较键，正适合拓扑保持的对象复制。
* **Rust**：``Rc::as_ptr`` 产生稳定身份键，裸指针不解引用；每次先把原字段克隆到局部变量、结束不可变借用，
  再借用副本写字段。强 ``Rc`` 随机边可以形成引用环，平台若要求自动回收需要把非拥有边设计成 ``Weak``，
  但那会改变既定 ``Node`` 接口。
* **Go、TypeScript**：指针或对象天然可作为身份键；TypeScript 必须区分映射缺失的 ``undefined`` 与合法空边
  ``null``。
* **C#**：``RuntimeHelpers.GetHashCode`` 配合 ``ReferenceEquals``，即使 ``Node`` 覆写值相等也保持身份语义。
* **Julia**：``IdDict`` 以 ``objectid`` 哈希、``===`` 比较，允许值相同且可变的节点分别成为键。
* **R**：``identical`` 对 environment 比较对象身份；线性查找保留正确语义，但必须如实计为最坏
  ``O(n^2)``。

身份容器语义可在 `Java IdentityHashMap 文档
<https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/IdentityHashMap.html>`_ 和
`Julia IdDict 文档 <https://docs.julialang.org/en/v1/base/collections/#Base.IdDict>`_ 中核对；Rust 的共享与动态
借用边界见 `Rc <https://doc.rust-lang.org/std/rc/struct.Rc.html>`_ 与
`RefCell <https://doc.rust-lang.org/std/cell/struct.RefCell.html>`_。

静态审查记录
------------

本题按现行策略完成了以下静态审查：

* 人工推演题目页面示例，以及空链表、单节点空 ``random``、自引用、前向、后向、随机边环和重复节点值；
* 逐阶段核对映射定义域、节点双射、``next/random`` 边保持、新旧对象隔离和原输入只读；
* 逐语言确认键是节点身份而不是 ``val``，并核对空引用、字段名、构造器、返回头和输出所有权；
* 专项检查 C 表容量、线性探测终止、乘法边界与全部失败清理，C++ 临时所有权，以及 Rust
  ``Rc<RefCell<_>>`` 借用时序；
* 专项核对 Java/C# 身份比较、TypeScript ``undefined``、Julia ``IdDict`` 和 R ``identical`` 的复杂度差异。

本轮没有运行或编译任何题解代码，没有执行示例、对拍、穷举、属性测试、sanitizer 或目标语言最小程序。
剩余风险主要是各平台真实 ``Node`` 模板、C/C++ 分配异常环境、Rust 节点接口和托管运行时细节未经动态确认；
文中只声明静态核对，不宣称运行通过。

关键边界与易错点
----------------

* 空输入返回空，不应创建哨兵副本。
* 映射键必须是身份；两个 ``val`` 相同的节点仍需两个不同副本。
* 第一遍必须创建全部副本后再复制 ``random``，否则前向目标可能尚不存在。
* 自引用必须指向副本自身，不能指回原节点。
* 深拷贝不仅要求序列化值相同，还要求所有返回节点都是新对象，任何副本边都不进入原链表。
* 不能只复制 ``next`` 而遗漏 ``random``，也不能沿 ``random`` 遍历来决定主链节点集合。
* 交织法若未完整恢复原 ``next``，即使返回副本看似正确也违反输入不变要求。
* C 失败时不能返回半构造链；C++ 成功交权前不能让临时所有者析构返回节点。
* R 的线性身份查找不是期望 ``O(1)`` 哈希，复杂度不能机械沿用其他九种语言。

学习链
------

本题强化了 `0133. Clone Graph <0133-clone-graph.rst>`_ 中“身份映射保持对象图”的思想，但利用原
``next`` 链先枚举全部节点，因此可以清楚分成建点和连边两遍。后续可以比较：

* 图深拷贝：必须在递归邻居前登记副本，以处理环；
* 带父指针或随机边的树复制：同样需要区分树的主遍历边和额外引用边；
* 链表交织技巧：用临时拓扑换取 ``O(1)`` 辅助空间，同时承担恢复和异常安全义务。

带答案自检
----------

**问：为什么映射不能使用 ``Node.val`` 作为键？**

答：契约允许不同节点具有相同值。值键会把这些节点合并成一个副本，破坏节点数量、``next`` 和 ``random``
关系；深拷贝需要按对象身份建立双射。

**问：为什么第一遍只复制值，不立即复制 ``random``？**

答：``random`` 可能指向主链后方尚未访问的节点。先创建全部副本，第二遍查询任何合法目标时映射都已完整。

**问：怎样证明副本没有偷偷指回原链表？**

答：返回头来自映射值；第二遍每条非空边也只写入映射值。映射值全部由第一遍新建，因此从返回头可达的全部
节点都属于新对象集合。

**问：为什么返回结构不计入算法额外空间？**

答：题目要求产生 ``n`` 个新节点，这部分是不可避免的输出载荷。复杂度应分别报告 ``O(n)`` 身份映射等工作
空间与 ``Theta(n)`` 返回对象，而不是把输出隐藏或重复计数。

**问：R 版本为什么是 ``O(n^2)``？**

答：每个非空 ``random`` 都可能用 ``identical`` 扫描最多 ``n`` 个原节点以定位身份；最多 ``n`` 次这样的
查找给出平方级最坏时间。它保持正确身份语义，但不是哈希常数查询。
