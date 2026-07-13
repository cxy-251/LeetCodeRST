0133. Clone Graph
=================

题目信息
--------

:题号: 0133
:难度: Medium
:主题: 图、DFS、哈希映射
:原题: `LeetCode 0133 <https://leetcode.com/problems/clone-graph/>`_
:访问状态: Available
:教学重点: 原节点身份到副本映射

题目重述
--------

给定连通无向图中的一个节点，返回深复制；副本节点和值和邻接关系相同，且不与原图共享节点。

自建示例
--------

.. code-block:: text

   输入：adjList = [[2,4],[1,3],[2,4],[1,3]]
   输出：结构相同但节点身份独立的图

问题抽象
--------

哈希表 ``clone[original]`` 保存已创建副本。首次见到节点先创建并登记，再递归克隆邻居并追加。

主解法：DFS 身份映射
--------------

思路
~~~~

DFS 身份映射。 原节点身份到副本映射

核心状态与不变量
~~~~~~~~~~~~~~~~

哈希表 ``clone[original]`` 保存已创建副本。首次见到节点先创建并登记，再递归克隆邻居并追加。

正确性依据
~~~~~~~~~~

先登记再递归能在环上命中已有副本并终止。每个原节点对应唯一副本，每条原邻接边被复制到对应副本边，因此结构和值保持且身份独立。

复杂度与语言边界
~~~~~~~~~~~~~~~~

主流身份哈希实现时间 ``O(V+E)``、空间 ``O(V)``；C 与 R 的无外部依赖适配器以线性身份表定位，最坏 ``O(V^2+E)``。输出图 ``O(V+E)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   static struct Node**orig,**copy;
   static int used,cap;
   static struct Node*clone(struct Node*n) {
       if(!n)return NULL;
       for(int i=0;i<used;i++)if(orig[i]==n)return copy[i];
       if(used==cap) {
           cap=cap?cap*2:16;
           orig=realloc(orig,(size_t)cap*sizeof(*orig));
           copy=realloc(copy,(size_t)cap*sizeof(*copy));
       }
       struct Node*x=malloc(sizeof(*x));
       x->val=n->val;
       x->numNeighbors=n->numNeighbors;
       x->neighbors=malloc((size_t)x->numNeighbors*sizeof(*x->neighbors));
       orig[used]=n;
       copy[used++]=x;
       for(int i=0;i<n->numNeighbors;i++)x->neighbors[i]=clone(n->neighbors[i]);
       return x;
   }
   struct Node*cloneGraph(struct Node*node) {
       orig=copy=NULL;
       used=cap=0;
       struct Node*r=clone(node);
       free(orig);
       free(copy);
       return r;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       unordered_map<Node*,Node*>m;
       public:Node*cloneGraph(Node*n) {
           if(!n)return nullptr;
           if(m.count(n))return m[n];
           Node*x=new Node(n->val);
           m[n]=x;
           for(Node*v:n->neighbors)x->neighbors.push_back(cloneGraph(v));
           return x;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def cloneGraph(self, node: 'Node|None') -> 'Node|None':
           clones = {}

           def clone(n):
               if n is None:
                   return None
               if n in clones:
                   return clones[n]
               x = Node(n.val)
               clones[n] = x
               x.neighbors = [clone(v) for v in n.neighbors]
               return x
           return clone(node)
Java
~~~~

.. code-block:: java

   class Solution {
       Map<Node,Node>m=new HashMap<>();
       public Node cloneGraph(Node n) {
           if(n==null)return null;
           if(m.containsKey(n))return m.get(n);
           Node x=new Node(n.val);
           m.put(n,x);
           for(Node v:n.neighbors)x.neighbors.add(cloneGraph(v));
           return x;
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::HashMap;
   use std::rc::Rc;
   impl Solution {
       pub fn clone_graph(node:Option<Rc<RefCell<Node>>>)->Option<Rc<RefCell<Node>>> {
           fn c(n:Rc<RefCell<Node>>,m:&mut HashMap<usize,Rc<RefCell<Node>>>)->Rc<RefCell<Node>> {
               let key=Rc::as_ptr(&n)as usize;
               if let Some(x)=m.get(&key) {
                   return x.clone()
               }
               let x=Rc::new(RefCell::new(Node::new(n.borrow().val)));
               m.insert(key,x.clone());
               let ns=n.borrow().neighbors.clone();
               x.borrow_mut().neighbors=ns.into_iter().map(|v|c(v,m)).collect();
               x
           }
           node.map(|n|c(n,&mut HashMap::new()))
       }
   }
Go
~~

.. code-block:: go

   func cloneGraph(node *Node) *Node {
   	m := map[*Node]*Node{}
   	var c func(*Node) *Node
   	c = func(n *Node) *Node {
   		if n == nil {
   			return nil
   		}
   		if x := m[n]; x != nil {
   			return x
   		}
   		x := &Node{Val: n.Val}
   		m[n] = x
   		for _, v := range n.Neighbors {
   			x.Neighbors = append(x.Neighbors, c(v))
   		}
   		return x
   	}
   	return c(node)
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function cloneGraph(node: Node | null): Node | null {
       const m = new Map<Node, Node>();
       const c = (n: Node | null): Node | null => {
           if (!n)
               return null;
           if (m.has(n))
               return m.get(n)!;
           const x = new Node(n.val);
           m.set(n, x);
           x.neighbors = n.neighbors.map(v => c(v)!);
           return x;
       };
       return c(node);
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       Dictionary<Node,Node>m=new();
       public Node CloneGraph(Node n) {
           if(n==null)return null;
           if(m.TryGetValue(n,out var x))return x;
           x=new Node(n.val);
           m[n]=x;
           foreach(var v in n.neighbors)x.neighbors.Add(CloneGraph(v));
           return x;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function clone_graph(node::Union{Node,Nothing})
       m=IdDict{Node,Node}()
       function c(n)
           n===nothing&&return nothing
           haskey(m,n)&&return m[n]
           x=Node(n.val)
           m[n]=x
           x.neighbors=[c(v) for v in n.neighbors]
           x
       end
       c(node)
   end
R
~

.. code-block:: r

   clone_graph <- function(node) {
       originals <- list()
       copies <- list()
       find_index <- function(target) {
           for (i in seq_along(originals)) if (identical(originals[[i]], target)) return(i)
           0L
       }
       clone <- function(current) {
           if (is.null(current)) return(NULL)
           index <- find_index(current)
           if (index > 0L) return(copies[[index]])
           copy <- new_graph_node(current$val)
           originals[[length(originals) + 1L]] <<- current
           copies[[length(copies) + 1L]] <<- copy
           copy$neighbors <- lapply(current$neighbors, clone)
           copy
       }
       clone(node)
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空输入返回空。
* 图可能含环、自环或重复邻居。

易错点
------

* 递归完成后才登记导致环无限递归。
* 按节点值做键，值不保证唯一。

本题新增知识
------------

* 原节点身份到副本映射
* 题号 0133 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0130. Surrounded Regions <0130-surrounded-regions.rst>`_；
* `0127. Word Ladder <0127-word-ladder.rst>`_；

最小自检
--------

#. ``DFS 身份映射`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

先登记再递归能在环上命中已有副本并终止。每个原节点对应唯一副本，每条原邻接边被复制到对应副本边，因此结构和值保持且身份独立。
