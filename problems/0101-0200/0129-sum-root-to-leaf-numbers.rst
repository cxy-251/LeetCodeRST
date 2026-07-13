0129. Sum Root to Leaf Numbers
==============================

题目信息
--------

:题号: 0129
:难度: Medium
:主题: 二叉树、DFS、数位累积
:原题: `LeetCode 0129 <https://leetcode.com/problems/sum-root-to-leaf-numbers/>`_
:访问状态: Available
:教学重点: 前缀乘十加当前值

题目重述
--------

树节点值为 0 到 9，每条根到叶路径表示一个十进制数，返回所有路径数之和。

自建示例
--------

.. code-block:: text

   输入：root = [1,2,3]
   输出：25
   解释：12 + 13 = 25

问题抽象
--------

递归参数 ``value`` 是到父节点的数值；进入节点后更新为 ``value*10+node.val``，叶子返回该值，内部节点返回左右和。

主解法：DFS 前缀值
-------------

思路
~~~~

DFS 前缀值。 前缀乘十加当前值

核心状态与不变量
~~~~~~~~~~~~~~~~

递归参数 ``value`` 是到父节点的数值；进入节点后更新为 ``value*10+node.val``，叶子返回该值，内部节点返回左右和。

正确性依据
~~~~~~~~~~

十进制拼接递推准确表示当前根到节点路径。每个叶子恰对应一条路径并贡献一次；内部求和覆盖左右互斥叶子集合。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；调用栈 ``O(h)``。中间乘法按平台保证范围选择足够宽整数。

核心语言实现
------------

C
~

.. code-block:: c

   static int dfs(struct TreeNode*n,int v) {
       if(!n)return 0;
       v=v*10+n->val;
       if(!n->left&&!n->right)return v;
       return dfs(n->left,v)+dfs(n->right,v);
   }
   int sumNumbers(struct TreeNode*root) {
       return dfs(root,0);
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       int dfs(TreeNode*n,int v) {
           if(!n)return 0;
           v=v*10+n->val;
           if(!n->left&&!n->right)return v;
           return dfs(n->left,v)+dfs(n->right,v);
       }
       public:int sumNumbers(TreeNode*r) {
           return dfs(r,0);
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def sumNumbers(self, root: Optional[TreeNode]) -> int:

           def dfs(n, v):
               if n is None:
                   return 0
               v = v * 10 + n.val
               return v if n.left is None and n.right is None else dfs(n.left, v) + dfs(n.right, v)
           return dfs(root, 0)
Java
~~~~

.. code-block:: java

   class Solution {
       public int sumNumbers(TreeNode r) {
           return dfs(r,0);
       }
       int dfs(TreeNode n,int v) {
           if(n==null)return 0;
           v=v*10+n.val;
           if(n.left==null&&n.right==null)return v;
           return dfs(n.left,v)+dfs(n.right,v);
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;
   impl Solution {
       pub fn sum_numbers(root:Option<Rc<RefCell<TreeNode>>>)->i32 {
           fn d(n:Option<Rc<RefCell<TreeNode>>>,v:i32)->i32 {
               let Some(x)=n else {
                   return 0
               };
               let x=x.borrow();
               let v=v*10+x.val;
               if x.left.is_none()&&x.right.is_none() {
                   v
               } else {
                   d(x.left.clone(),v)+d(x.right.clone(),v)
               }
           }
           d(root,0)
       }
   }
Go
~~

.. code-block:: go

   func sumNumbers(root *TreeNode) int {
   	var d func(*TreeNode, int) int
   	d = func(n *TreeNode, v int) int {
   		if n == nil {
   			return 0
   		}
   		v = v*10 + n.Val
   		if n.Left == nil && n.Right == nil {
   			return v
   		}
   		return d(n.Left, v) + d(n.Right, v)
   	}
   	return d(root, 0)
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sumNumbers(root: TreeNode | null): number {
       const d = (n: TreeNode | null, v: number): number => {
           if (!n)
               return 0;
           v = v * 10 + n.val;
           return !n.left && !n.right ? v : d(n.left, v) + d(n.right, v);
       };
       return d(root, 0);
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int SumNumbers(TreeNode r)=>D(r,0);
       int D(TreeNode n,int v) {
           if(n==null)return 0;
           v=v*10+n.val;
           if(n.left==null&&n.right==null)return v;
           return D(n.left,v)+D(n.right,v);
       }
   }
Julia
~~~~~

.. code-block:: julia

   function sum_numbers(root)::Int
       d(n,v)=n===nothing ? 0 : ((x=v*10+n.val)
       n.left===nothing&&n.right===nothing ? x : d(n.left,x)+d(n.right,x))
       d(root,0)
   end
R
~

.. code-block:: r

   sum_numbers <- function(root) {
       d<-function(n,v) {
           if(is.null(n))return(0L)
           v<-v*10L+n$val
           if(is.null(n$left)&&is.null(n$right))v else d(n$left,v)+d(n$right,v)
       }
       d(root,0L)
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空树返回 0。
* 前导零路径按数值自然处理。

易错点
------

* 把节点值按位数权重从叶向上重复计算。
* 在内部节点也加入前缀。

本题新增知识
------------

* 前缀乘十加当前值
* 题号 0129 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0112. Path Sum <0112-path-sum.rst>`_；
* `0124. Binary Tree Maximum Path Sum <0124-binary-tree-maximum-path-sum.rst>`_；

最小自检
--------

#. ``DFS 前缀值`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

十进制拼接递推准确表示当前根到节点路径。每个叶子恰对应一条路径并贡献一次；内部求和覆盖左右互斥叶子集合。
