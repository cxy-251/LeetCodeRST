0133. Clone Graph
=================

题目信息
--------

:题号: 0133. 克隆图
:难度: Medium
:主题: 图、深度优先搜索、广度优先搜索、对象映射
:原题: `LeetCode 0133 <https://leetcode.com/problems/clone-graph/>`_
:重点: 用原节点身份建立唯一副本映射，先登记再展开邻居，从而同时处理环、共享节点和深拷贝

题目重述
--------

给定连通无向图中的一个节点 ``node``，返回整张图的深拷贝。每个原节点都要对应一个新创建的节点，值相同；
原图中的每条邻接关系都要在副本节点之间重建。返回图不能包含任何指向原节点的引用。输入为空时返回
``nullptr``。

自建示例
--------

* 三角形 ``1 -- 2 -- 3 -- 1``：副本也必须形成三角形，但三个节点都使用新地址；
* 若 ``1`` 和 ``2`` 都邻接 ``3``，两个副本的邻接表必须指向同一个 ``clone(3)``，不能各创建一份；
* ``node = nullptr``：图为空，直接返回空指针。

C++ 实现
--------

.. code-block:: cpp

   #include <queue>
   #include <unordered_map>

   class Solution {
   private:
       Node* cloneWithDfs(
           Node* original,
           std::unordered_map<Node*, Node*>& copies
       ) {
           if (original == nullptr) {
               return nullptr;
           }
           auto found = copies.find(original);
           if (found != copies.end()) {
               return found->second;
           }

           Node* copy = new Node(original->val);
           copies[original] = copy;
           for (Node* originalNeighbor : original->neighbors) {
               copy->neighbors.push_back(
                   cloneWithDfs(originalNeighbor, copies)
               );
           }
           return copy;
       }

       Node* cloneWithBfs(Node* node) {
           if (node == nullptr) {
               return nullptr;
           }

           std::unordered_map<Node*, Node*> copies;
           std::queue<Node*> pending;
           copies[node] = new Node(node->val);
           pending.push(node);

           while (!pending.empty()) {
               Node* original = pending.front();
               pending.pop();
               for (Node* originalNeighbor : original->neighbors) {
                   if (!copies.count(originalNeighbor)) {
                       copies[originalNeighbor] =
                           new Node(originalNeighbor->val);
                       pending.push(originalNeighbor);
                   }
                   copies[original]->neighbors.push_back(
                       copies[originalNeighbor]
                   );
               }
           }
           return copies[node];
       }

   public:
       Node* cloneGraph(Node* node) {
           std::unordered_map<Node*, Node*> copies;
           return cloneWithDfs(node, copies);
       }
   };

题解
----

深拷贝需要同时复制节点与关系
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若只新建入口节点，再把原邻接表直接赋给它，返回图中的边仍指向原节点，只是浅拷贝。若对每条邻接引用都
无条件递归创建新节点，问题又变成沿所有图路径展开：无向边会让 ``1 -> 2`` 之后立刻沿 ``2 -> 1`` 返回，
形成无限递归；即使图无环，两个路径汇合到同一节点时也会创建两份副本，破坏共享关系。

真正需要维持的不变量是：每个原节点对象恰好对应一个副本对象。于是核心状态不是“哪些值见过”，而是
``copies[original] = copy`` 的对象身份映射。原节点只作为遍历和哈希键使用，所有新边都必须连接映射右侧的
副本。

为什么不能把 ``val`` 当作通用身份
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

当前题目数据可能保证节点值唯一，但深拷贝的结构语义由节点对象决定，而不是标签决定。若扩展输入允许两个
不同节点拥有相同值，按值建表会错误地把它们合并。使用 ``Node*`` 作为键直接表达“这是同一个原对象”，
也让算法不依赖偶然的值域约束。

递归主解：先登记节点，再复制边
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``cloneWithDfs`` 对首次遇到的 ``original`` 分成两个阶段：先分配只带相同 ``val`` 的空副本并写入映射，
再依次处理原邻接表。这个顺序是环处理的关键，而不只是实现细节。

以三角形 ``1 -> 2 -> 3 -> 1`` 为例：

.. list-table::
   :header-rows: 1

   * - 当前调用
     - 映射变化
     - 邻居处理
   * - ``clone(1)``
     - 先登记 ``1 -> copy1``
     - 递归到 ``2``
   * - ``clone(2)``
     - 先登记 ``2 -> copy2``
     - 遇到 ``1`` 时直接取得 ``copy1``，再继续 ``3``
   * - ``clone(3)``
     - 先登记 ``3 -> copy3``
     - 遇到 ``1``、``2`` 都复用已有副本

如果登记发生在递归邻居之后，从 ``2`` 回到 ``1`` 时映射中还没有 ``1``，递归无法终止。现在每个节点首次
出现时创建一次，后续出现立即返回同一指针，既是访问标记，也是共享副本查询。

边与邻接顺序怎样恢复
~~~~~~~~~~~~~~~~~~~~

对原节点邻接表中的每个 ``originalNeighbor``，递归返回其唯一副本，再追加到当前 ``copy->neighbors``。
因此每条原邻接项产生一条对应的副本邻接项；遍历顺序与原表相同，共享邻居通过映射落到同一对象。无向边
会在两个端点的邻接表中各处理一次，这正是输入表示中的两条邻接记录，不应额外去重。

显式队列替代方案
~~~~~~~~~~~~~~~~

``cloneWithBfs`` 把递归帧换成队列。节点第一次作为邻居被发现时，立即创建副本、登记映射并把原节点入队；
无论邻居是新发现还是已有，随后都把 ``copies[originalNeighbor]`` 接到当前副本的邻接表。这里“必要时创建”
必须先于“建立当前边”，否则新邻居还没有可连接的副本。

BFS 与 DFS 产生的对象地址和访问顺序不同，但都遵守同一映射不变量，复制后的图结构等价。BFS 避免递归
深度风险，代价是显式队列；DFS 更贴近“取得邻居副本并返回”的递归定义。公开入口选择 DFS，BFS 作为
遍历机制上的等价替代保留，认知增量在于展示创建状态与待展开状态可以分离。

为什么结果确实是深拷贝
~~~~~~~~~~~~~~~~~~~~~~

每个映射值都由 ``new Node`` 创建，不是原指针；每次追加邻接关系也只追加映射值。由入口可达的每个原节点
都会被遍历并建立映射，图又保证连通，所以整个图都被复制。原节点没有写操作，也不会出现在返回结构中；
修改副本值或邻接表不会改变原图。

复杂度分析
~~~~~~~~~~

每个节点只创建并展开一次，每条邻接表记录只读取和追加一次，时间 ``O(V + E)``。映射使用 ``O(V)``
空间；DFS 递归栈最坏 ``O(V)``，BFS 队列最坏同为 ``O(V)``。新建的副本图属于返回结果，不计工作空间。
