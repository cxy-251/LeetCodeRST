0133. Clone Graph
=================

题目信息
--------

:题号: 0133
:难度: Medium
:主题: 图、深度优先搜索、广度优先搜索、深拷贝
:原题: `LeetCode 0133 <https://leetcode.com/problems/clone-graph/>`_
:重点: 对象身份映射、先登记后遍历、环与共享邻居

题目重述
--------

给定连通无向图中的一个节点，返回整张可达图的深拷贝。每个原节点都必须对应一个全新的副本节点，副本保留相同的值和邻接关系，且返回图中的任何引用都不能指向原图节点。空入口返回空。

自建示例
--------

.. code-block:: text

   1: [2,4]
   2: [1,3]
   3: [2,4]
   4: [1,3]

   返回四个全新节点，仍保持相同邻接关系。

C++ 实现
--------

.. code-block:: cpp

   #include <queue>
   #include <unordered_map>

   class Solution {
   private:
       Node* dfs(Node* node, std::unordered_map<Node*,Node*>& copies) {
           if (!node) return nullptr;
           auto found = copies.find(node);
           if (found != copies.end()) return found->second;
           Node* copy = new Node(node->val);
           copies[node] = copy;
           for (Node* neighbor : node->neighbors)
               copy->neighbors.push_back(dfs(neighbor, copies));
           return copy;
       }

       Node* bfs(Node* node) {
           if (!node) return nullptr;
           std::unordered_map<Node*,Node*> copies;
           std::queue<Node*> queue;
           copies[node] = new Node(node->val);
           queue.push(node);
           while (!queue.empty()) {
               Node* current = queue.front(); queue.pop();
               for (Node* neighbor : current->neighbors) {
                   if (!copies.count(neighbor)) {
                       copies[neighbor] = new Node(neighbor->val);
                       queue.push(neighbor);
                   }
                   copies[current]->neighbors.push_back(copies[neighbor]);
               }
           }
           return copies[node];
       }

   public:
       Node* cloneGraph(Node* node) {
           std::unordered_map<Node*,Node*> copies;
           return dfs(node, copies);
       }
   };

题解
----

为什么值不能作为通用身份
~~~~~~~~~~~~~~~~~~~~~~~~

深拷贝要保持节点对象的一一对应。即使官方值唯一，算法本质仍应按原节点地址或引用建立映射；值相同的扩展输入也不能合并为同一副本。

为什么先登记再递归
~~~~~~~~~~~~~~~~~~

遇到原节点时先创建副本并写入映射，再递归邻居。若邻居通过环回到当前节点，映射已经存在，直接返回同一副本，递归不会无限循环。

.. list-table::
   :header-rows: 1

   * - 原节点
     - 动作
     - 映射状态
   * - 1
     - 创建 clone(1)
     - ``1 -> clone(1)``
   * - 2
     - 创建 clone(2)
     - 增加 ``2 -> clone(2)``
   * - 再遇到 1
     - 直接复用
     - 不创建重复节点

边如何复制
~~~~~~~~~~

对原节点邻接表中的每个邻居，递归取得对应副本，再按原顺序追加到当前副本邻接表。这样既保留边，也保留共享邻居和邻接顺序。

为什么实现是深拷贝
~~~~~~~~~~~~~~~~~~

每个原节点首次访问时都分配一个新对象；返回图中的每条边只连接映射值，即副本节点。原图节点仅作为哈希键和只读遍历对象，不会出现在返回结构中。

复杂度来源
~~~~~~~~~~

每个节点创建一次，每条邻接表边读取一次，时间 ``O(V+E)``，映射与递归栈或队列使用 ``O(V)`` 空间。

九语言实现
----------

C
~

.. code-block:: c

   struct Pair{struct Node*old,*copy;};static struct Node*find(struct Pair*p,int n,struct Node*x){for(int i=0;i<n;i++)if(p[i].old==x)return p[i].copy;return NULL;}static struct Node*clone(struct Node*x,struct Pair**pairs,int*size,int*cap){if(!x)return NULL;struct Node*seen=find(*pairs,*size,x);if(seen)return seen;if(*size==*cap){*cap*=2;*pairs=realloc(*pairs,(size_t)*cap*sizeof(struct Pair));}struct Node*y=malloc(sizeof(struct Node));y->val=x->val;y->numNeighbors=x->numNeighbors;y->neighbors=malloc((size_t)x->numNeighbors*sizeof(struct Node*));(*pairs)[(*size)++]=(struct Pair){x,y};for(int i=0;i<x->numNeighbors;i++)y->neighbors[i]=clone(x->neighbors[i],pairs,size,cap);return y;}struct Node*cloneGraph(struct Node*node){int size=0,cap=8;struct Pair*pairs=malloc((size_t)cap*sizeof(struct Pair));struct Node*out=clone(node,&pairs,&size,&cap);free(pairs);return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def cloneGraph(self, node):
           copies={}
           def dfs(x):
               if x is None: return None
               if x in copies: return copies[x]
               copies[x]=Node(x.val)
               copies[x].neighbors=[dfs(y) for y in x.neighbors]
               return copies[x]
           return dfs(node)

Java
~~~~

.. code-block:: java

   class Solution {Map<Node,Node>copies=new HashMap<>();public Node cloneGraph(Node node){if(node==null)return null;if(copies.containsKey(node))return copies.get(node);Node copy=new Node(node.val);copies.put(node,copy);for(Node next:node.neighbors)copy.neighbors.add(cloneGraph(next));return copy;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn clone_graph(node:Option<std::rc::Rc<std::cell::RefCell<Node>>>)->Option<std::rc::Rc<std::cell::RefCell<Node>>>{use std::{cell::RefCell,collections::HashMap,rc::Rc};fn dfs(x:Rc<RefCell<Node>>,m:&mut HashMap<usize,Rc<RefCell<Node>>>)->Rc<RefCell<Node>>{let key=Rc::as_ptr(&x)as usize;if let Some(y)=m.get(&key){return y.clone()}let y=Rc::new(RefCell::new(Node::new(x.borrow().val)));m.insert(key,y.clone());let neighbors=x.borrow().neighbors.clone();for n in neighbors{let c=dfs(n,m);y.borrow_mut().neighbors.push(c);}y}node.map(|x|dfs(x,&mut HashMap::new()))}}

Go
~~

.. code-block:: go

   func cloneGraph(node *Node)*Node{copies:=map[*Node]*Node{};var dfs func(*Node)*Node;dfs=func(x *Node)*Node{if x==nil{return nil};if y:=copies[x];y!=nil{return y};y:=&Node{Val:x.Val};copies[x]=y;for _,n:=range x.Neighbors{y.Neighbors=append(y.Neighbors,dfs(n))};return y};return dfs(node)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function cloneGraph(node:Node|null):Node|null{const copies=new Map<Node,Node>();const dfs=(x:Node|null):Node|null=>{if(!x)return null;if(copies.has(x))return copies.get(x)!;const y=new Node(x.val);copies.set(x,y);y.neighbors=x.neighbors.map(n=>dfs(n)!);return y;};return dfs(node);}

C#
~~

.. code-block:: csharp

   public class Solution {Dictionary<Node,Node>copies=new();public Node CloneGraph(Node node){if(node==null)return null;if(copies.TryGetValue(node,out var seen))return seen;var copy=new Node(node.val);copies[node]=copy;foreach(var next in node.neighbors)copy.neighbors.Add(CloneGraph(next));return copy;}}

Julia
~~~~~

.. code-block:: julia

   function clone_graph(node)
       node===nothing&&return nothing;copies=IdDict{Any,Any}()
       function dfs(x);haskey(copies,x)&&return copies[x];y=GraphNode(x.val,GraphNode[]);copies[x]=y;for n in x.neighbors;push!(y.neighbors,dfs(n));end;y;end
       dfs(node)
   end

R
~

.. code-block:: r

   clone_graph <- function(node){if(is.null(node))return(NULL);old<-list();copies<-list();find<-function(x){for(i in seq_along(old))if(identical(old[[i]],x))return(i);0L};dfs<-function(x){i<-find(x);if(i>0L)return(copies[[i]]);y<-new.env(parent=emptyenv());y$val<-x$val;y$neighbors<-list();old[[length(old)+1L]]<<-x;copies[[length(copies)+1L]]<<-y;for(n in x$neighbors)y$neighbors[[length(y$neighbors)+1L]]<-dfs(n);y};dfs(node)}