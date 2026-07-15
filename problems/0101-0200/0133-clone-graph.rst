0133. Clone Graph
=================

题目信息
--------

:题号: 0133
:难度: Medium
:主题: 图、深度优先搜索、对象身份、深拷贝
:原题: `LeetCode 0133 <https://leetcode.com/problems/clone-graph/>`_
:访问状态: Available
:教学重点: 原节点到副本的身份映射、先登记后递归、环与共享邻居

题目重述与精确契约
------------------

给定连通无向图中的一个节点，返回从该节点可达的整张图的深拷贝。副本必须保留每个节点的值、
邻接表内容和邻接顺序，但不能复用任何原图节点。

本文采用官方输入域：

* 图包含 ``0`` 至 ``100`` 个节点；空图用空节点引用表示；
* 非空图中节点值位于 ``1..100``，并且两两不同；
* 图连通，从入口节点可以访问全部节点；
* 官方输入没有重复边和自环，邻接表按给定顺序保存邻居；
* 平台提供可变 ``Node`` 类型，包含整数值和节点引用邻接表，代码不重复定义该平台类型；
* 返回图必须与原图结构同构，所有返回节点都必须是新对象；
* 原图只读，克隆过程不改写原节点的值、邻接表或连接关系；
* C 成功返回的节点与邻接数组由平台接管；托管语言由运行时管理对象生命周期。

主算法也能处理自环和多个路径指向同一邻居；这些是防御性扩展，不改变官方契约。

自建示例
--------

四节点环
~~~~~~~~

.. code-block:: text

   原图邻接表：
   1: [2, 4]
   2: [1, 3]
   3: [2, 4]
   4: [1, 3]

   返回图具有相同邻接表，但 clone(1) 到 clone(4)
   都不是原节点 1 到 4。

共享邻居不能重复克隆
~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   1: [2, 3]
   2: [1, 3]
   3: [1, 2]

从节点 ``1`` 经节点 ``2`` 和节点 ``3`` 都会遇到对方。映射必须让每个原节点只对应一个副本，
否则会得到重复节点，而不是三节点图。

空图与单节点
~~~~~~~~~~~~

空引用返回空引用。只有一个节点且邻接表为空时，返回一个值相同、邻接表为空的新节点。

问题抽象
--------

深拷贝不是复制邻接表中的整数，而是建立一个保持图结构的对象映射：

.. code-block:: text

   copy_of: 原节点身份 -> 唯一副本节点身份

对每条原邻接项 ``u -> v``，副本中都要出现
``copy_of[u] -> copy_of[v]``。图可能有环，也可能从多条路径抵达同一节点，所以“递归创建邻居”
必须配合身份映射；仅靠递归树不能表达共享节点与回边。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 工作状态
     - 定位
   * - DFS + 身份映射
     - 期望 ``O(V + A)``
     - 映射与递归栈
     - 主解法；直接对应递归克隆过程
   * - BFS + 身份映射
     - 期望 ``O(V + A)``
     - 映射与队列
     - 等价迭代方案，避免深递归
   * - 不记录映射的递归复制
     - 在环上不终止
     - 无去重状态
     - 错误方案
   * - 用节点值代替身份
     - 只在值唯一前提下可用
     - 值表
     - C、R 的官方约束适配器，不是通用图算法

这里 ``V`` 是可达节点数，``A`` 是全部邻接表长度之和；无向图无重复边时
``A = 2E``。

主解法：先登记副本，再递归邻居
--------------------------------

递归状态
~~~~~~~~

``clone(current)`` 返回原节点 ``current`` 的唯一副本。维护映射
``seen[original] = copy``：

#. 空节点直接返回空；
#. 若 ``current`` 已在 ``seen`` 中，返回已有副本；
#. 创建值相同、邻接表暂时为空的新节点；
#. **立即** 把原节点与副本写入 ``seen``；
#. 按原邻接表顺序递归克隆每个邻居，并追加到副本邻接表；
#. 返回已经填充的副本。

第三步与第四步不能交换到邻居递归之后。若边 ``u -> v`` 最终沿环回到 ``u``，
提前登记使再次遇到 ``u`` 时直接复用半构造副本，递归因而停止。

核心不变量
~~~~~~~~~~

每次进入 ``clone(current)`` 时保持：

* ``seen`` 中每个键都是已经发现的原节点，每个值都是单独分配的新节点；
* 一个原节点在 ``seen`` 中至多出现一次，因此至多创建一个副本；
* 已开始处理的原节点在递归邻居前已经登记，即使副本邻接表尚未填完也可安全复用；
* 已处理的每个邻接前缀都按原顺序映射到副本邻接表；
* 副本邻接表只保存映射得到的新节点，不保存原节点引用；
* 原节点及其邻接表始终只读。

正确性证明
----------

引理一：每个可达原节点恰有一个副本
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

某原节点第一次被发现时不在 ``seen`` 中，算法创建一个副本并立即登记。以后无论经多少条边再次访问，
都会命中同一映射值，不再创建对象。图连通且 DFS 遍历每个已发现节点的全部邻居，所以每个可达节点
最终都会被发现。由此原节点与副本节点建立一一对应。

引理二：全部邻接关系和顺序被保留
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

处理原节点 ``u`` 时，算法按顺序访问其每个邻居 ``v``，并把引理一确定的唯一
``copy_of[v]`` 追加到 ``copy_of[u]`` 的邻接表。没有跳过邻接项，也没有额外追加其他对象，
因此每个副本邻接表在长度、顺序和对应节点上都与原邻接表一致。

引理三：返回图与原图没有节点共享
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

映射值只来自当前调用中新建的节点；追加邻居时只追加这些映射值。入口返回值也是映射中的副本，
所以从返回入口可达的每个对象都是新对象，不可能是原节点。原图与副本图只具有结构对应关系，
没有可变节点身份共享。

定理：返回值是完整深拷贝
~~~~~~~~~~~~~~~~~~~~~~~~

引理一给出节点集合的双射，引理二证明该双射保持全部邻接项，引理三证明两个对象图相互独立。
节点值在创建副本时直接复制，因此返回图满足值、拓扑、邻接顺序和深拷贝的全部要求。

终止性与副作用
~~~~~~~~~~~~~~

每个可达节点只有第一次访问会继续递归；后续访问立即返回。可达节点有限，所以即使存在环，
递归也会终止。算法只读取原节点并写入新节点、映射和工作栈，不修改原图。

复杂度、所有权与语言差异
------------------------

每个节点创建一次，每个邻接项处理一次。哈希身份映射期望常数查询时：

* 时间复杂度为期望 ``O(V + A)``；
* 映射保存 ``V`` 对身份，DFS 栈最深 ``O(V)``；
* 返回图本身包含 ``V`` 个节点与 ``A`` 个邻接引用，载荷 ``Theta(V + A)``；
* 不计返回图时，核心辅助空间为 ``O(V)``；计入返回值的峰值为 ``O(V + A)``。

语言差异如下：

* C 和 R 利用官方“值位于 ``1..100`` 且唯一”的强前提，以值表或环境键代替身份哈希；
  若允许重复值，必须改用地址或显式对象标识；
* C 在任一分配失败时清理所有已经登记的副本，不能返回半构造图；
* Java 使用 ``IdentityHashMap``，明确按对象身份而不是可覆写的值相等比较；
* Rust 的映射键是原 ``Rc`` 的稳定地址；临时克隆邻居向量只增加引用计数，不复制原节点载荷；
* Go、TypeScript 和 Julia 的映射容器按指针或对象身份区分节点；
* C# 平台 ``Node`` 没有覆写值相等，默认字典键保持引用身份；
* Julia 与 R 在本题首次引入仓库的通用图节点表示：Julia 用可变节点，R 用
  ``environment`` 保留引用语义。

核心语言实现
------------

C
~

``struct Node`` 由平台提供。值表是官方唯一值约束下的适配器；失败时统一释放全部已登记副本。

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>

   typedef struct {
       struct Node *copies[101];
       bool failed;
   } CloneContext;

   static struct Node *clone_node(
       const struct Node *node,
       CloneContext *context
   ) {
       if (node == NULL || context->failed) {
           return NULL;
       }
       if (context->copies[node->val] != NULL) {
           return context->copies[node->val];
       }

       struct Node *copy = malloc(sizeof(*copy));
       if (copy == NULL) {
           context->failed = true;
           return NULL;
       }

       copy->val = node->val;
       copy->numNeighbors = node->numNeighbors;
       copy->neighbors = NULL;
       if (node->numNeighbors > 0) {
           copy->neighbors = malloc(
               (size_t)node->numNeighbors *
               sizeof(*copy->neighbors)
           );
           if (copy->neighbors == NULL) {
               free(copy);
               context->failed = true;
               return NULL;
           }
       }

       context->copies[node->val] = copy;
       for (int index = 0; index < node->numNeighbors; ++index) {
           copy->neighbors[index] = clone_node(
               node->neighbors[index],
               context
           );
           if (context->failed) {
               return NULL;
           }
       }
       return copy;
   }

   static void free_copies(CloneContext *context) {
       for (int value = 1; value <= 100; ++value) {
           if (context->copies[value] != NULL) {
               free(context->copies[value]->neighbors);
               free(context->copies[value]);
           }
       }
   }

   struct Node *cloneGraph(struct Node *node) {
       CloneContext context = {0};
       struct Node *answer = clone_node(node, &context);
       if (context.failed) {
           free_copies(&context);
           return NULL;
       }
       return answer;
   }

C++
~~~

``Node`` 由平台提供。映射作为一次公共调用的局部状态，重复调用同一 ``Solution`` 对象不会复用旧图。

.. code-block:: cpp

   #include <unordered_map>

   class Solution {
       static Node* cloneNode(
           Node* node,
           std::unordered_map<Node*, Node*>& seen
       ) {
           auto known = seen.find(node);
           if (known != seen.end()) {
               return known->second;
           }

           Node* copy = new Node(node->val);
           seen.emplace(node, copy);
           for (Node* neighbor : node->neighbors) {
               copy->neighbors.push_back(
                   cloneNode(neighbor, seen)
               );
           }
           return copy;
       }

   public:
       Node* cloneGraph(Node* node) {
           if (node == nullptr) {
               return nullptr;
           }
           std::unordered_map<Node*, Node*> seen;
           return cloneNode(node, seen);
       }
   };

Python
~~~~~~

平台节点沿用对象身份哈希；路径再次遇到同一对象时取得同一副本。

.. code-block:: python

   from typing import Dict, Optional


   class Solution:
       def cloneGraph(
           self,
           node: Optional["Node"],
       ) -> Optional["Node"]:
           seen: Dict["Node", "Node"] = {}

           def clone(current: "Node") -> "Node":
               if current in seen:
                   return seen[current]

               copy = Node(current.val)
               seen[current] = copy
               for neighbor in current.neighbors:
                   copy.neighbors.append(clone(neighbor))
               return copy

           return None if node is None else clone(node)

Java
~~~~

``IdentityHashMap`` 明确使用引用身份，避免未来平台节点若实现值相等方法时改变键语义。

.. code-block:: java

   import java.util.IdentityHashMap;
   import java.util.Map;

   class Solution {
       public Node cloneGraph(Node node) {
           if (node == null) {
               return null;
           }
           Map<Node, Node> seen = new IdentityHashMap<>();
           return cloneNode(node, seen);
       }

       private Node cloneNode(
           Node node,
           Map<Node, Node> seen
       ) {
           Node known = seen.get(node);
           if (known != null) {
               return known;
           }

           Node copy = new Node(node.val);
           seen.put(node, copy);
           for (Node neighbor : node.neighbors) {
               copy.neighbors.add(cloneNode(neighbor, seen));
           }
           return copy;
       }
   }

Rust
~~~~

原节点和副本都使用平台的 ``Rc<RefCell<Node>>`` 表示。复制 ``Rc`` 只增加引用计数；
递归前复制邻居引用向量，是为了结束对原节点的借用。

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::HashMap;
   use std::rc::Rc;

   impl Solution {
       pub fn clone_graph(
           node: Option<Rc<RefCell<Node>>>,
       ) -> Option<Rc<RefCell<Node>>> {
           fn clone_node(
               node: &Rc<RefCell<Node>>,
               seen: &mut HashMap<
                   *const RefCell<Node>,
                   Rc<RefCell<Node>>,
               >,
           ) -> Rc<RefCell<Node>> {
               let key = Rc::as_ptr(node);
               if let Some(copy) = seen.get(&key) {
                   return Rc::clone(copy);
               }

               let value = node.borrow().val;
               let copy = Rc::new(RefCell::new(Node {
                   val: value,
                   neighbors: Vec::new(),
               }));
               seen.insert(key, Rc::clone(&copy));

               let neighbors = node.borrow().neighbors.clone();
               for neighbor in neighbors {
                   let next = clone_node(&neighbor, seen);
                   copy.borrow_mut().neighbors.push(next);
               }
               copy
           }

           node.map(|root| {
               clone_node(&root, &mut HashMap::new())
           })
       }
   }

Go
~~

.. code-block:: go

   func cloneGraph(node *Node) *Node {
       if node == nil {
           return nil
       }

       seen := make(map[*Node]*Node)
       var clone func(*Node) *Node
       clone = func(current *Node) *Node {
           if known, ok := seen[current]; ok {
               return known
           }

           copy := &Node{
               Val: current.Val,
               Neighbors: make(
                   []*Node,
                   0,
                   len(current.Neighbors),
               ),
           }
           seen[current] = copy
           for _, neighbor := range current.Neighbors {
               copy.Neighbors = append(
                   copy.Neighbors,
                   clone(neighbor),
               )
           }
           return copy
       }

       return clone(node)
   }

TypeScript
~~~~~~~~~~

JavaScript ``Map`` 的对象键按身份比较；``undefined`` 不能与合法副本混淆，因为映射值始终是节点。

.. code-block:: typescript

   function cloneGraph(node: Node | null): Node | null {
       if (node === null) {
           return null;
       }

       const seen = new Map<Node, Node>();
       const clone = (current: Node): Node => {
           const known = seen.get(current);
           if (known !== undefined) {
               return known;
           }

           const copy = new Node(current.val);
           seen.set(current, copy);
           for (const neighbor of current.neighbors) {
               copy.neighbors.push(clone(neighbor));
           }
           return copy;
       };

       return clone(node);
   }

C#
~~

平台节点没有覆写值相等，``Dictionary<Node, Node>`` 因而按对象引用区分节点。

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public Node CloneGraph(Node node) {
           if (node == null) {
               return null;
           }
           var seen = new Dictionary<Node, Node>();
           return CloneNode(node, seen);
       }

       private Node CloneNode(
           Node node,
           Dictionary<Node, Node> seen
       ) {
           if (seen.TryGetValue(node, out Node known)) {
               return known;
           }

           Node copy = new Node(node.val);
           seen[node] = copy;
           foreach (Node neighbor in node.neighbors) {
               copy.neighbors.Add(CloneNode(neighbor, seen));
           }
           return copy;
       }
   }

Julia
~~~~~

本题首次给出仓库的 Julia 通用图节点表示；后续图题直接复用，不重复定义。
``IdDict`` 按对象身份保存原节点到副本的映射。

.. code-block:: julia

   mutable struct GraphNode
       val::Int
       neighbors::Vector{GraphNode}
   end

   GraphNode(val::Int) = GraphNode(val, GraphNode[])

   function clone_graph(
       node::Union{Nothing,GraphNode},
   )::Union{Nothing,GraphNode}
       node === nothing && return nothing
       seen = IdDict{GraphNode,GraphNode}()

       function clone(current::GraphNode)::GraphNode
           if haskey(seen, current)
               return seen[current]
           end

           copy = GraphNode(current.val)
           seen[current] = copy
           for neighbor in current.neighbors
               push!(copy.neighbors, clone(neighbor))
           end
           return copy
       end

       return clone(node)
   end

R
~

R 用 ``environment`` 表达可变节点。官方值唯一约束允许用值文本作环境键；
若扩展到重复值图，需要为环境对象建立真正的身份键。

.. code-block:: r

   new_graph_node <- function(val) {
     node <- new.env(parent = emptyenv())
     node$val <- val
     node$neighbors <- list()
     node
   }

   clone_graph <- function(node) {
     if (is.null(node)) {
       return(NULL)
     }
     seen <- new.env(hash = TRUE, parent = emptyenv())

     clone <- function(current) {
       key <- paste0("v", current$val)
       if (exists(key, envir = seen, inherits = FALSE)) {
         return(get(key, envir = seen, inherits = FALSE))
       }

       copy <- new_graph_node(current$val)
       assign(key, copy, envir = seen)
       copy$neighbors <- lapply(current$neighbors, clone)
       copy
     }

     clone(node)
   }

关键边界与易错点
----------------

* 空入口返回空，不创建占位节点；
* 必须在递归邻居之前登记副本，否则无向边和环会造成无限递归；
* 多条路径到达同一节点时必须复用同一副本，不能只复制出值相同的多个对象；
* 深拷贝检查必须比较对象身份和邻接关系，只比较节点值无法发现原节点被复用；
* 邻接表顺序属于当前接口的可观察结果，按原顺序追加；
* 映射状态必须属于一次公共调用；保存在对象字段却不清空会污染重复调用；
* C 的值表和 R 的值键依赖官方值唯一前提，不能冒充适用于重复值图的通用身份映射；
* Rust 必须在递归前结束对原节点邻接表的借用，否则会与递归中的借用冲突；
* 失败时不能返回部分克隆图；C 需要释放所有已经登记的新节点。

精简验证记录
------------

原生成阶段的算法实现已经过验证，本次返工不重复大规模随机对拍。本轮针对实际修改执行：

* 人工逐项核对空图、单节点、四节点环和多路径共享邻居；
* Python 运行上述固定结构，并同时检查值、邻接顺序、新旧节点身份不共享；
* C++17 主实现使用严格警告编译并运行代表图；
* C 的分配失败事务、Java/C# 的调用级映射、Rust 的借用与引用计数，以及
  Go、TypeScript、Julia、R 的身份键完成针对性静态检查；
* 单文件、十语言、无 include 指令和无题目分片检查通过。

这里没有把静态检查写成运行通过，也没有用测试数量替代身份双射证明。

知识更新
--------

``algorithm.graph_clone_memo_before_recursion``
   先创建空副本并登记，再递归邻居；半构造副本是切断环递归和保留共享节点的必要见证。

``proof.graph_clone_identity_bijection``
   原节点身份到唯一副本的映射建立节点双射，逐邻接项复制证明该双射保持图结构。

``boundary.graph_identity_not_business_value``
   通用图算法必须按对象身份建键；只有题目明确保证值唯一时，值表才是合法适配器。

关联题目
--------

* `0127. Word Ladder <0127-word-ladder.rst>`_：同样遍历图并记录已访问状态，但返回的是最短距离；
* `0130. Surrounded Regions <0130-surrounded-regions.rst>`_：
  在网格图中标记连通分量，不需要构造身份独立的新节点图；
* 后续链表与图复制题继续复用“先登记身份映射，再连接引用”的模式。

最小自检
--------

#. 为什么副本必须在递归邻居之前写入映射？
#. 节点值和邻接表值都相同，为什么仍不足以证明深拷贝？
#. 如何证明多个原邻接项指向同一节点时，副本图不会把它拆成多个对象？
#. C 和 R 为什么可以在本题用节点值作键，而通用实现不可以？

答案要点
~~~~~~~~

#. 环会再次访问当前节点；提前登记使再次访问直接复用半构造副本并终止该分支。
#. 深拷贝还要求对象身份独立；结果若引用原节点，值与序列化邻接表仍可能完全相同。
#. 同一原节点只在首次访问创建副本，后续所有邻接项都从映射取得同一个副本对象。
#. 官方保证值在固定范围内且两两唯一；重复值图会发生键冲突，必须改用真实身份。
