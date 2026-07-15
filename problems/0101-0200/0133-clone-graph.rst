0133. Clone Graph
=================

题目信息
--------

:题号: 0133
:难度: Medium
:主题: 图、深度优先搜索、哈希映射、对象身份
:原题: `LeetCode 0133 <https://leetcode.com/problems/clone-graph/>`_
:访问状态: Available
:教学重点: 先登记后递归、环处理、深拷贝验证

题目重述
--------

给定一个连通无向图中的某个节点，返回整个图的深拷贝。每个新节点必须保存相同的值和邻接关系，
同时不能复用任何原图节点。空输入返回空。

算法
----

维护映射 ``seen[original] = clone``。克隆节点 ``u`` 时：

#. 若 ``u`` 已在映射中，直接返回已有副本；
#. 创建 ``u`` 的空邻接表副本，并立即写入映射；
#. 递归克隆每个邻居，将结果加入副本邻接表；
#. 返回副本。

必须在递归邻居之前登记副本。图中存在环时，后续再次遇到 ``u`` 才能立即复用副本并停止递归。

正确性
~~~~~~

每个可达原节点第一次访问时创建且只创建一个副本，映射保证后续访问返回同一副本。对原图中的每条
邻接关系 ``u -> v``，处理 ``u`` 时都会把 ``clone(v)`` 加入 ``clone(u)`` 的邻接表，因此全部边被保留。
副本只指向映射中的新对象，不包含原节点引用，所以结果是结构等价的深拷贝。

复杂度
~~~~~~

设可达图有 ``V`` 个节点和 ``E`` 条邻接项。每个节点创建一次，每个邻接项处理一次，时间 ``O(V+E)``，
映射、递归栈和新图占 ``O(V+E)``。C 与 R 适配器利用题目保证的唯一 ``val`` 作为键；其余实现按对象身份
建立映射，通用算法不应假定节点值天然唯一。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>

   struct Node {
       int val;
       int numNeighbors;
       struct Node **neighbors;
   };

   static struct Node *clone_node(
       struct Node *node,
       struct Node *copies[101]
   ) {
       if (node == NULL) return NULL;
       if (copies[node->val] != NULL) return copies[node->val];

       struct Node *copy = malloc(sizeof(*copy));
       copy->val = node->val;
       copy->numNeighbors = node->numNeighbors;
       copy->neighbors = node->numNeighbors == 0
           ? NULL
           : malloc(
               (size_t)node->numNeighbors * sizeof(*copy->neighbors)
           );
       copies[node->val] = copy;

       for (int i = 0; i < node->numNeighbors; ++i) {
           copy->neighbors[i] =
               clone_node(node->neighbors[i], copies);
       }
       return copy;
   }

   struct Node *cloneGraph(struct Node *node) {
       struct Node *copies[101] = {0};
       return clone_node(node, copies);
   }

C++
~~~

.. code-block:: cpp

   #include <unordered_map>

   class Solution {
       std::unordered_map<Node*, Node*> seen;

       Node* clone(Node* node) {
           if (node == nullptr) return nullptr;
           auto known = seen.find(node);
           if (known != seen.end()) return known->second;

           Node* copy = new Node(node->val);
           seen[node] = copy;
           for (Node* neighbor : node->neighbors) {
               copy->neighbors.push_back(clone(neighbor));
           }
           return copy;
       }

   public:
       Node* cloneGraph(Node* node) {
           return clone(node);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def cloneGraph(self, node: "Node | None") -> "Node | None":
           seen: dict[Node, Node] = {}

           def clone(current: Node | None) -> Node | None:
               if current is None:
                   return None
               if current in seen:
                   return seen[current]

               copy = Node(current.val)
               seen[current] = copy
               copy.neighbors = [
                   clone(neighbor)
                   for neighbor in current.neighbors
               ]
               return copy

           return clone(node)

Java
~~~~

.. code-block:: java

   import java.util.IdentityHashMap;
   import java.util.Map;

   class Solution {
       private final Map<Node, Node> seen =
           new IdentityHashMap<>();

       public Node cloneGraph(Node node) {
           if (node == null) return null;
           if (seen.containsKey(node)) return seen.get(node);

           Node copy = new Node(node.val);
           seen.put(node, copy);
           for (Node neighbor : node.neighbors) {
               copy.neighbors.add(cloneGraph(neighbor));
           }
           return copy;
       }
   }

Rust
~~~~

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
                   return copy.clone();
               }

               let value = node.borrow().val;
               let copy = Rc::new(RefCell::new(Node {
                   val: value,
                   neighbors: Vec::new(),
               }));
               seen.insert(key, copy.clone());

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
       seen := make(map[*Node]*Node)

       var clone func(*Node) *Node
       clone = func(current *Node) *Node {
           if current == nil {
               return nil
           }
           if copy, ok := seen[current]; ok {
               return copy
           }

           copy := &Node{Val: current.Val}
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

.. code-block:: typescript

   function cloneGraph(node: Node | null): Node | null {
       const seen = new Map<Node, Node>();

       const clone = (current: Node | null): Node | null => {
           if (current === null) return null;
           const known = seen.get(current);
           if (known !== undefined) return known;

           const copy = new Node(current.val);
           seen.set(current, copy);
           copy.neighbors = current.neighbors.map(
               (neighbor) => clone(neighbor) as Node,
           );
           return copy;
       };

       return clone(node);
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       private readonly Dictionary<Node, Node> seen = new();

       public Node CloneGraph(Node node) {
           if (node == null) return null;
           if (seen.TryGetValue(node, out Node known)) {
               return known;
           }

           Node copy = new Node(node.val);
           seen[node] = copy;
           foreach (Node neighbor in node.neighbors) {
               copy.neighbors.Add(CloneGraph(neighbor));
           }
           return copy;
       }
   }

Julia
~~~~~

.. code-block:: julia

   mutable struct GraphNode
       val::Int
       neighbors::Vector{GraphNode}
   end

   GraphNode(val::Int) = GraphNode(val, GraphNode[])

   function clone_graph(
       node::Union{Nothing,GraphNode},
   )::Union{Nothing,GraphNode}
       seen = IdDict{GraphNode,GraphNode}()

       function clone(
           current::Union{Nothing,GraphNode},
       )::Union{Nothing,GraphNode}
           current === nothing && return nothing
           haskey(seen, current) && return seen[current]

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

.. code-block:: r

   new_graph_node <- function(val) {
     node <- new.env(parent = emptyenv())
     node$val <- val
     node$neighbors <- list()
     node
   }

   clone_graph <- function(node) {
     seen <- new.env(hash = TRUE, parent = emptyenv())

     clone <- function(current) {
       if (is.null(current)) return(NULL)
       key <- as.character(current$val)
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

关键边界
--------

* 空输入返回空；
* 单节点自环必须克隆成指向自身副本的环；
* 先登记副本，再递归邻居；
* 邻接表顺序按输入顺序保留；
* 深拷贝要求新旧图没有共享节点对象；
* 通用映射键应使用节点身份，而不是可能重复的业务值。

最小自检
--------

#. 为什么创建副本后必须立即放入映射？
#. 如何证明每个原节点只会创建一个副本？
#. 只比较节点值为什么不足以验证深拷贝？
