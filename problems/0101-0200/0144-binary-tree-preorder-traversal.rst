0144. Binary Tree Preorder Traversal
====================================

题目信息
--------

:题号: 0144
:难度: Easy
:主题: 二叉树、栈、遍历
:原题: `LeetCode 0144 <https://leetcode.com/problems/binary-tree-preorder-traversal/>`_
:访问状态: Available
:教学重点: 根左 右顺序

题目重述
--------

返回二叉树前序遍历值序列：根、左、右。

自建示例
--------

.. code-block:: text

   输入：root = [1,null,2,3]
   输出：[1,2,3]

问题抽象
--------

根入栈；每次弹出访问，先压右孩子再压左孩子，使左孩子先处理。

主解法：显式栈前序
-----------

思路
~~~~

显式栈前序。 根左 右顺序

核心状态与不变量
~~~~~~~~~~~~~~~~

根入栈；每次弹出访问，先压右孩子再压左孩子，使左孩子先处理。

正确性依据
~~~~~~~~~~

栈顶始终是下一个前序节点。访问根后，右后左入栈保证左子树完整处理后才处理右子树；归纳覆盖所有节点一次。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；栈 ``O(h)`` 到 ``O(n)``，输出 ``O(n)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   int*preorderTraversal(struct TreeNode*r,int*returnSize) {
       *returnSize=0;
       if(!r)return NULL;
       int cap=32;
       int*out=malloc((size_t)cap*sizeof(*out));
       struct TreeNode**st=malloc((size_t)cap*sizeof(*st));
       int top=0;
       st[top++]=r;
       while(top) {
           struct TreeNode*n=st[--top];
           if(*returnSize==cap) {
               cap*=2;
               out=realloc(out,(size_t)cap*sizeof(*out));
               st=realloc(st,(size_t)cap*sizeof(*st));
           }
           out[(*returnSize)++]=n->val;
           if(n->right)st[top++]=n->right;
           if(n->left)st[top++]=n->left;
       }
       free(st);
       return out;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:vector<int>preorderTraversal(TreeNode*r) {
           vector<int>a;
           if(!r)return a;
           stack<TreeNode*>s;
           s.push(r);
           while(!s.empty()) {
               auto*n=s.top();
               s.pop();
               a.push_back(n->val);
               if(n->right)s.push(n->right);
               if(n->left)s.push(n->left);
           }
           return a;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def preorderTraversal(self, root: Optional[TreeNode]) -> list[int]:
           if root is None:
               return []
           st = [root]
           ans = []
           while st:
               n = st.pop()
               ans.append(n.val)
               if n.right:
                   st.append(n.right)
               if n.left:
                   st.append(n.left)
           return ans
Java
~~~~

.. code-block:: java

   class Solution {
       public List<Integer>preorderTraversal(TreeNode r) {
           List<Integer>a=new ArrayList<>();
           if(r==null)return a;
           ArrayDeque<TreeNode>s=new ArrayDeque<>();
           s.push(r);
           while(!s.isEmpty()) {
               TreeNode n=s.pop();
               a.add(n.val);
               if(n.right!=null)s.push(n.right);
               if(n.left!=null)s.push(n.left);
           }
           return a;
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;
   impl Solution {
       pub fn preorder_traversal(root:Option<Rc<RefCell<TreeNode>>>)->Vec<i32> {
           let mut a=vec![];
           let mut s=vec![];
           if let Some(r)=root {
               s.push(r)
           }
           while let Some(n)=s.pop() {
               let n=n.borrow();
               a.push(n.val);
               if let Some(x)=n.right.clone() {
                   s.push(x)
               }
               if let Some(x)=n.left.clone() {
                   s.push(x)
               }
           }
           a
       }
   }
Go
~~

.. code-block:: go

   func preorderTraversal(r *TreeNode) []int {
   	if r == nil {
   		return nil
   	}
   	s := []*TreeNode{r}
   	a := []int{}
   	for len(s) > 0 {
   		n := s[len(s)-1]
   		s = s[:len(s)-1]
   		a = append(a, n.Val)
   		if n.Right != nil {
   			s = append(s, n.Right)
   		}
   		if n.Left != nil {
   			s = append(s, n.Left)
   		}
   	}
   	return a
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function preorderTraversal(r: TreeNode | null): number[] {
       if (!r)
           return [];
       const s = [r], a: number[] = [];
       while (s.length) {
           const n = s.pop()!;
           a.push(n.val);
           if (n.right)
               s.push(n.right);
           if (n.left)
               s.push(n.left);
       }
       return a;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<int> PreorderTraversal(TreeNode r) {
           var a=new List<int>();
           if(r==null)return a;
           var s=new Stack<TreeNode>();
           s.Push(r);
           while(s.Count>0) {
               var n=s.Pop();
               a.Add(n.val);
               if(n.right!=null)s.Push(n.right);
               if(n.left!=null)s.Push(n.left);
           }
           return a;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function preorder_traversal(r)
       r===nothing&&return Int[]
       s=TreeNode[r]
       a=Int[]
       while !isempty(s)
           n=pop!(s)
           push!(a,n.val)
           n.right!==nothing&&push!(s,n.right)
           n.left!==nothing&&push!(s,n.left)
       end
       a
   end
R
~

.. code-block:: r

   preorder_traversal <- function(r) {
       if(is.null(r))return(integer())
       s<-list(r)
       a<-integer()
       while(length(s)>0L) {
           n<-s[[length(s)]]
           s<-s[-length(s)]
           a<-c(a,n$val)
           if(!is.null(n$right))s[[length(s)+1L]]<-n$right
           if(!is.null(n$left))s[[length(s)+1L]]<-n$left
       }
       a
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空树返回空数组。
* 压栈顺序与访问顺序相反。

易错点
------

* 先压左再压右导致根右左。
* 重复访问节点。

本题新增知识
------------

* 根左 右顺序
* 题号 0144 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0145. Binary Tree Postorder Traversal <0145-binary-tree-postorder-traversal.rst>`_；
* `0094. Binary Tree Inorder Traversal <../0001-0100/0094-binary-tree-inorder-traversal.rst>`_；

最小自检
--------

#. ``显式栈前序`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

栈顶始终是下一个前序节点。访问根后，右后左入栈保证左子树完整处理后才处理右子树；归纳覆盖所有节点一次。
