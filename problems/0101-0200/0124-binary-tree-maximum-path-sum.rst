0124. Binary Tree Maximum Path Sum
==================================

题目信息
--------

:题号: 0124
:难度: Hard
:主题: 二叉树、后序遍历、全局最优
:原题: `LeetCode 0124 <https://leetcode.com/problems/binary-tree-maximum-path-sum/>`_
:访问状态: Available
:教学重点: 单边增益与穿过节点路径

题目重述
--------

二叉树路径可从任意节点到任意节点，但不能重复节点。返回最大路径和。

自建示例
--------

.. code-block:: text

   输入：root = [-10,9,20,null,null,15,7]
   输出：42

问题抽象
--------

递归返回从当前节点向下延伸到一侧的最大增益；负增益截为 0。全局候选为 ``node.val + left_gain + right_gain``。

主解法：后序单边增益
------------

思路
~~~~

后序单边增益。 单边增益与穿过节点路径

核心状态与不变量
~~~~~~~~~~~~~~~~

递归返回从当前节点向下延伸到一侧的最大增益；负增益截为 0。全局候选为 ``node.val + left_gain + right_gain``。

正确性依据
~~~~~~~~~~

任何路径的最高节点唯一。以该节点为最高点时，左右各最多选择一条向下链，负链不选；算法在每个节点计算该唯一形态的最佳路径，覆盖所有路径。返回给父节点时只能选一侧以保持路径不分叉。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；调用栈 ``O(h)``；全局状态 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <limits.h>
   static int best;
   static int gain(struct TreeNode*n) {
       if(!n)return 0;
       int l=gain(n->left),r=gain(n->right);
       if(l<0)l=0;
       if(r<0)r=0;
       int through=n->val+l+r;
       if(through>best)best=through;
       return n->val+(l>r?l:r);
   }
   int maxPathSum(struct TreeNode*root) {
       best=INT_MIN;
       gain(root);
       return best;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       int best=INT_MIN;
       int gain(TreeNode*n) {
           if(!n)return 0;
           int l=max(0,gain(n->left)),r=max(0,gain(n->right));
           best=max(best,n->val+l+r);
           return n->val+max(l,r);
       }
       public:int maxPathSum(TreeNode*r) {
           gain(r);
           return best;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def maxPathSum(self, root: Optional[TreeNode]) -> int:
           best = -10 ** 30

           def gain(n):
               nonlocal best
               if n is None:
                   return 0
               l = max(0, gain(n.left))
               r = max(0, gain(n.right))
               best = max(best, n.val + l + r)
               return n.val + max(l, r)
           gain(root)
           return best
Java
~~~~

.. code-block:: java

   class Solution {
       int best=Integer.MIN_VALUE;
       public int maxPathSum(TreeNode r) {
           gain(r);
           return best;
       }
       int gain(TreeNode n) {
           if(n==null)return 0;
           int l=Math.max(0,gain(n.left)),rr=Math.max(0,gain(n.right));
           best=Math.max(best,n.val+l+rr);
           return n.val+Math.max(l,rr);
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;
   impl Solution {
       pub fn max_path_sum(root:Option<Rc<RefCell<TreeNode>>>)->i32 {
           fn g(n:Option<Rc<RefCell<TreeNode>>>,b:&mut i32)->i32 {
               let Some(x)=n else {
                   return 0
               };
               let x=x.borrow();
               let l=g(x.left.clone(),b).max(0);
               let r=g(x.right.clone(),b).max(0);
               *b=(*b).max(x.val+l+r);
               x.val+l.max(r)
           }
           let mut b=i32::MIN;
           g(root,&mut b);
           b
       }
   }
Go
~~

.. code-block:: go

   func maxPathSum(root *TreeNode) int {
   	best := -int(^uint(0)>>1) - 1
   	var g func(*TreeNode) int
   	g = func(n *TreeNode) int {
   		if n == nil {
   			return 0
   		}
   		l, r := g(n.Left), g(n.Right)
   		if l < 0 {
   			l = 0
   		}
   		if r < 0 {
   			r = 0
   		}
   		if n.Val+l+r > best {
   			best = n.Val + l + r
   		}
   		if l > r {
   			return n.Val + l
   		}
   		return n.Val + r
   	}
   	g(root)
   	return best
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxPathSum(root: TreeNode | null): number {
       let best = -Infinity;
       const g = (n: TreeNode | null): number => {
           if (!n)
               return 0;
           const l = Math.max(0, g(n.left)), r = Math.max(0, g(n.right));
           best = Math.max(best, n.val + l + r);
           return n.val + Math.max(l, r);
       };
       g(root);
       return best;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       int best=int.MinValue;
       public int MaxPathSum(TreeNode r) {
           Gain(r);
           return best;
       }
       int Gain(TreeNode n) {
           if(n==null)return 0;
           int l=Math.Max(0,Gain(n.left)),rr=Math.Max(0,Gain(n.right));
           best=Math.Max(best,n.val+l+rr);
           return n.val+Math.Max(l,rr);
       }
   }
Julia
~~~~~

.. code-block:: julia

   function max_path_sum(root)::Int
       best=Ref(typemin(Int))
       function g(n)
           n===nothing&&return 0
           l=max(0,g(n.left))
           r=max(0,g(n.right))
           best[]=max(best[],n.val+l+r)
           n.val+max(l,r)
       end
       g(root)
       best[]
   end
R
~

.. code-block:: r

   max_path_sum <- function(root) {
       best<- -Inf
       g<-function(n) {
           if(is.null(n))return(0)
           l<-max(0,g(n$left))
           r<-max(0,g(n$right))
           best<<-max(best,n$val+l+r)
           n$val+max(l,r)
       }
       g(root)
       as.integer(best)
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 节点值全负时答案是最大单节点，不能初始化为 0。
* 返回增益只能取一侧。

易错点
------

* 把左右增益之和返回父节点形成分叉。
* 忽略负值树。

本题新增知识
------------

* 单边增益与穿过节点路径
* 题号 0124 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0104. Maximum Depth of Binary Tree <0104-maximum-depth-of-binary-tree.rst>`_；
* `0129. Sum Root to Leaf Numbers <0129-sum-root-to-leaf-numbers.rst>`_；

最小自检
--------

#. ``后序单边增益`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

任何路径的最高节点唯一。以该节点为最高点时，左右各最多选择一条向下链，负链不选；算法在每个节点计算该唯一形态的最佳路径，覆盖所有路径。返回给父节点时只能选一侧以保持路径不分叉。
