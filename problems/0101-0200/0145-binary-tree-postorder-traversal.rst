0145. Binary Tree Postorder Traversal
=====================================

题目信息
--------

:题号: 0145
:难度: Easy
:主题: 二叉树、栈、遍历
:原题: `LeetCode 0145 <https://leetcode.com/problems/binary-tree-postorder-traversal/>`_
:访问状态: Available
:教学重点: 单栈最后访问状态

题目重述
--------

返回二叉树后序遍历值序列：左、右、根。

自建示例
--------

.. code-block:: text

   输入：root = [1,null,2,3]
   输出：[3,2,1]

问题抽象
--------

沿左链入栈。查看栈顶：若右子树存在且未访问则转向右子树，否则访问栈顶并记录为 ``last``。

主解法：单栈加前驱指针
-------------

思路
~~~~

单栈加前驱指针。 单栈最后访问状态

核心状态与不变量
~~~~~~~~~~~~~~~~

沿左链入栈。查看栈顶：若右子树存在且未访问则转向右子树，否则访问栈顶并记录为 ``last``。

正确性依据
~~~~~~~~~~

节点只有在左子树已完成且右子树不存在或已由 ``last`` 标记完成时才弹出，因此访问次序满足左右根。每个节点有限次入栈查看并最终弹出。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；栈 ``O(h)``；输出 ``O(n)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   int*postorderTraversal(struct TreeNode*r,int*returnSize) {
       *returnSize=0;
       if(!r)return NULL;
       int cap=32;
       int*out=malloc((size_t)cap*sizeof(*out));
       struct TreeNode**st=malloc((size_t)cap*sizeof(*st));
       int top=0;
       struct TreeNode*cur=r,*last=NULL;
       while(cur||top) {
           if(cur) {
               if(top==cap) {
                   cap*=2;
                   st=realloc(st,(size_t)cap*sizeof(*st));
                   out=realloc(out,(size_t)cap*sizeof(*out));
               }
               st[top++]=cur;
               cur=cur->left;
           } else {
               struct TreeNode*peek=st[top-1];
               if(peek->right&&last!=peek->right)cur=peek->right;
               else {
                   out[(*returnSize)++]=peek->val;
                   last=peek;
                   top--;
               }
           }
       }
       free(st);
       return out;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:vector<int>postorderTraversal(TreeNode*r) {
           vector<int>a;
           stack<TreeNode*>s;
           TreeNode*cur=r,*last=nullptr;
           while(cur||!s.empty()) {
               if(cur) {
                   s.push(cur);
                   cur=cur->left;
               } else {
                   TreeNode*p=s.top();
                   if(p->right&&last!=p->right)cur=p->right;
                   else {
                       a.push_back(p->val);
                       last=p;
                       s.pop();
                   }
               }
           }
           return a;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def postorderTraversal(self, root: Optional[TreeNode]) -> list[int]:
           ans = []
           stack = []
           cur = root
           last = None
           while cur or stack:
               if cur:
                   stack.append(cur)
                   cur = cur.left
               else:
                   node = stack[-1]
                   if node.right and last is not node.right:
                       cur = node.right
                   else:
                       ans.append(node.val)
                       last = stack.pop()
           return ans
Java
~~~~

.. code-block:: java

   class Solution {
       public List<Integer>postorderTraversal(TreeNode r) {
           List<Integer>a=new ArrayList<>();
           ArrayDeque<TreeNode>s=new ArrayDeque<>();
           TreeNode cur=r,last=null;
           while(cur!=null||!s.isEmpty()) {
               if(cur!=null) {
                   s.push(cur);
                   cur=cur.left;
               } else {
                   TreeNode p=s.peek();
                   if(p.right!=null&&last!=p.right)cur=p.right;
                   else {
                       a.add(p.val);
                       last=s.pop();
                   }
               }
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
       pub fn postorder_traversal(root:Option<Rc<RefCell<TreeNode>>>)->Vec<i32> {
           let mut a=vec![];
           let mut s:Vec<Rc<RefCell<TreeNode>>>=vec![];
           let mut cur=root;
           let mut last:Option<Rc<RefCell<TreeNode>>>=None;
           while cur.is_some()||!s.is_empty() {
               if let Some(n)=cur {
                   cur=n.borrow().left.clone();
                   s.push(n);
               } else {
                   let p=s.last().unwrap().clone();
                   let right=p.borrow().right.clone();
                   let visited=match(&right,&last) {
                       (Some(x),Some(y))=>Rc::ptr_eq(x,y),(None,_)=>true,_=>false
                   };
                   if !visited {
                       cur=right
                   } else {
                       a.push(p.borrow().val);
                       last=s.pop();
                   }
               }
           }
           a
       }
   }
Go
~~

.. code-block:: go

   func postorderTraversal(r *TreeNode) []int {
   	a := []int{}
   	s := []*TreeNode{}
   	cur := r
   	var last *TreeNode
   	for cur != nil || len(s) > 0 {
   		if cur != nil {
   			s = append(s, cur)
   			cur = cur.Left
   		} else {
   			p := s[len(s)-1]
   			if p.Right != nil && last != p.Right {
   				cur = p.Right
   			} else {
   				a = append(a, p.Val)
   				last = p
   				s = s[:len(s)-1]
   			}
   		}
   	}
   	return a
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function postorderTraversal(r: TreeNode | null): number[] {
       const a: number[] = [], s: TreeNode[] = [];
       let cur = r, last: TreeNode | null = null;
       while (cur || s.length) {
           if (cur) {
               s.push(cur);
               cur = cur.left;
           }
           else {
               const p = s[s.length - 1];
               if (p.right && last !== p.right)
                   cur = p.right;
               else {
                   a.push(p.val);
                   last = s.pop()!;
               }
           }
       }
       return a;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<int> PostorderTraversal(TreeNode r) {
           var a=new List<int>();
           var s=new Stack<TreeNode>();
           TreeNode cur=r,last=null;
           while(cur!=null||s.Count>0) {
               if(cur!=null) {
                   s.Push(cur);
                   cur=cur.left;
               } else {
                   var p=s.Peek();
                   if(p.right!=null&&last!=p.right)cur=p.right;
                   else {
                       a.Add(p.val);
                       last=s.Pop();
                   }
               }
           }
           return a;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function postorder_traversal(r)
       a=Int[]
       s=TreeNode[]
       cur=r
       last=nothing
       while cur!==nothing||!isempty(s)
           if cur!==nothing
               push!(s,cur)
               cur=cur.left
           else
               p=s[end]
               if p.right!==nothing&&last!==p.right
                   cur=p.right
               else
                   push!(a,p.val)
                   last=pop!(s)
               end
           end
       end
       a
   end
R
~

.. code-block:: r

   postorder_traversal <- function(r) {
       a<-integer()
       s<-list()
       cur<-r
       last<-NULL
       while(!is.null(cur)||length(s)>0L) {
           if(!is.null(cur)) {
               s[[length(s)+1L]]<-cur
               cur<-cur$left
           }
           else {
               p<-s[[length(s)]]
               if(!is.null(p$right)&&!identical(last,p$right))cur<-p$right else {
                   a<-c(a,p$val)
                   last<-p
                   s<-s[-length(s)]
               }
           }
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

* 空树返回空。
* ``last`` 按节点身份比较。

易错点
------

* 没有已访问右子树标记会反复进入右子树。
* 简单反转前序时忘记额外结果反转成本与顺序。

本题新增知识
------------

* 单栈最后访问状态
* 题号 0145 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0144. Binary Tree Preorder Traversal <0144-binary-tree-preorder-traversal.rst>`_；
* `0094. Binary Tree Inorder Traversal <../0001-0100/0094-binary-tree-inorder-traversal.rst>`_；

最小自检
--------

#. ``单栈加前驱指针`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

节点只有在左子树已完成且右子树不存在或已由 ``last`` 标记完成时才弹出，因此访问次序满足左右根。每个节点有限次入栈查看并最终弹出。
