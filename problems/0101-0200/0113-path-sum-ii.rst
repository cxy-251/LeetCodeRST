0113. Path Sum II
=================

题目信息
--------

:题号: 0113
:难度: Medium
:主题: 二叉树、回溯、路径快照
:原题: `LeetCode 0113 <https://leetcode.com/problems/path-sum-ii/>`_
:访问状态: Available
:教学重点: 路径共享状态与结果复制

题目重述
--------

返回所有节点和等于目标的根到叶路径，每条路径按根到叶顺序。

自建示例
--------

.. code-block:: text

   输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
   输出：[[5,4,11,2],[5,8,4,5]]

问题抽象
--------

维护当前路径和剩余目标。进入节点压入值，叶子命中时复制路径，离开节点弹出。

主解法：DFS 回溯
------------

思路
~~~~

DFS 回溯。 路径共享状态与结果复制

核心状态与不变量
~~~~~~~~~~~~~~~~

维护当前路径和剩余目标。进入节点压入值，叶子命中时复制路径，离开节点弹出。

正确性依据
~~~~~~~~~~

递归路径始终等于根到当前节点序列。叶子命中条件等价于路径和达标；DFS 访问每条根到叶路径，复制保证不同答案独立，回溯恢复父状态。

复杂度与语言边界
~~~~~~~~~~~~~~~~

遍历 ``O(n)``，复制输出总载荷为 ``O(S)``；调用栈和工作路径 ``O(h)``，结果 ``O(S)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   static void dfs(struct TreeNode*node,int target,int*path,int
       depth,int***rows,int**cols,int*size,int*cap) {
       if(!node)return;
       path[depth]=node->val;
       if(!node->left&&!node->right&&target==node->val) {
           if(*size==*cap) {
               *cap*=2;
               *rows=realloc(*rows,(size_t)*cap*sizeof(**rows));
               *cols=realloc(*cols,(size_t)*cap*sizeof(**cols));
           }
           int*copy=malloc((size_t)(depth+1)*sizeof(*copy));
           for(int i=0;i<=depth;i++)copy[i]=path[i];
           (*rows)[*size]=copy;
           (*cols)[*size]=depth+1;
           (*size)++;
           return;
       }
       dfs(node->left,target-node->val,path,depth+1,rows,cols,size,cap);
       dfs(node->right,target-node->val,path,depth+1,rows,cols,size,cap);
   }
   int** pathSum(struct TreeNode*root,int target,int*returnSize,int**returnColumnSizes) {
       int cap=8;
       int**rows=malloc((size_t)cap*sizeof(*rows));
       int*cols=malloc((size_t)cap*sizeof(*cols));
       int path[5000];
       *returnSize=0;
       dfs(root,target,path,0,&rows,&cols,returnSize,&cap);
       *returnColumnSizes=cols;
       return rows;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       vector<vector<int>>ans;
       vector<int>path;
       void dfs(TreeNode*n,int t) {
           if(!n)return;
           path.push_back(n->val);
           if(!n->left&&!n->right&&t==n->val)ans.push_back(path);
           else {
               dfs(n->left,t-n->val);
               dfs(n->right,t-n->val);
           }
           path.pop_back();
       }
       public:vector<vector<int>>pathSum(TreeNode*r,int t) {
           dfs(r,t);
           return ans;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def pathSum(self, root: Optional[TreeNode], targetSum: int) -> list[list[int]]:
           ans = []
           path = []

           def dfs(node, rest):
               if node is None:
                   return
               path.append(node.val)
               if node.left is None and node.right is None and (rest == node.val):
                   ans.append(path.copy())
               else:
                   dfs(node.left, rest - node.val)
                   dfs(node.right, rest - node.val)
               path.pop()
           dfs(root, targetSum)
           return ans
Java
~~~~

.. code-block:: java

   class Solution {
       List<List<Integer>>ans=new ArrayList<>();
       List<Integer>path=new ArrayList<>();
       public List<List<Integer>>pathSum(TreeNode r,int t) {
           dfs(r,t);
           return ans;
       }
       void dfs(TreeNode n,int t) {
           if(n==null)return;
           path.add(n.val);
           if(n.left==null&&n.right==null&&t==n.val)ans.add(new ArrayList<>(path));
           else {
               dfs(n.left,t-n.val);
               dfs(n.right,t-n.val);
           }
           path.remove(path.size()-1);
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;
   impl Solution {
       pub fn path_sum(root:Option<Rc<RefCell<TreeNode>>>,target:i32)->Vec<Vec<i32>> {
           fn dfs(node:Option<Rc<RefCell<TreeNode>>>,t:i32,path:&mut Vec<i32>,ans:&mut
               Vec<Vec<i32>>) {
               let Some(x)=node else {
                   return
               };
               let x=x.borrow();
               path.push(x.val);
               if x.left.is_none()&&x.right.is_none()&&t==x.val {
                   ans.push(path.clone())
               } else {
                   dfs(x.left.clone(),t-x.val,path,ans);
                   dfs(x.right.clone(),t-x.val,path,ans)
               }
               path.pop();
           }
           let mut a=vec![];
           dfs(root,target,&mut vec![],&mut a);
           a
       }
   }
Go
~~

.. code-block:: go

   func pathSum(root *TreeNode, target int) [][]int {
   	ans := [][]int{}
   	path := []int{}
   	var dfs func(*TreeNode, int)
   	dfs = func(n *TreeNode, t int) {
   		if n == nil {
   			return
   		}
   		path = append(path, n.Val)
   		if n.Left == nil && n.Right == nil && t == n.Val {
   			ans = append(ans, append([]int(nil), path...))
   		} else {
   			dfs(n.Left, t-n.Val)
   			dfs(n.Right, t-n.Val)
   		}
   		path = path[:len(path)-1]
   	}
   	dfs(root, target)
   	return ans
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function pathSum(root: TreeNode | null, target: number): number[][] {
       const ans: number[][] = [];
       const path: number[] = [];
       const dfs = (n: TreeNode | null, t: number) => {
           if (!n)
               return;
           path.push(n.val);
           if (!n.left && !n.right && t === n.val)
               ans.push([...path]);
           else {
               dfs(n.left, t - n.val);
               dfs(n.right, t - n.val);
           }
           path.pop();
       };
       dfs(root, target);
       return ans;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       IList<IList<int>>ans=new List<IList<int>>();
       List<int>path=new();
       public IList<IList<int>> PathSum(TreeNode r,int t) {
           Dfs(r,t);
           return ans;
       }
       void Dfs(TreeNode n,int t) {
           if(n==null)return;
           path.Add(n.val);
           if(n.left==null&&n.right==null&&t==n.val)ans.Add(new List<int>(path));
           else {
               Dfs(n.left,t-n.val);
               Dfs(n.right,t-n.val);
           }
           path.RemoveAt(path.Count-1);
       }
   }
Julia
~~~~~

.. code-block:: julia

   function path_sum(root,target::Int)
       ans=Vector{Vector{Int}}()
       path=Int[]
       function dfs(n,t)
           n===nothing&&return
           push!(path,n.val)
           if n.left===nothing&&n.right===nothing&&t==n.val
               push!(ans,copy(path))
           else
               dfs(n.left,t-n.val)
               dfs(n.right,t-n.val)
           end
           pop!(path)
       end
       dfs(root,target)
       ans
   end
R
~

.. code-block:: r

   path_sum <- function(root,target) {
       ans<-list()
       path<-integer()
       dfs<-function(n,t) {
           if(is.null(n))return()
           path<<-c(path,n$val)
           if(is.null(n$left)&&is.null(n$right)&&t==n$val)ans[[length(ans)+1L]]<<-path else {
               dfs(n$left,t-n$val)
               dfs(n$right,t-n$val)
           }
           path<<-path[-length(path)]
       }
       dfs(root,target)
       ans
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空树返回空列表。
* 多条答案不能共享可变路径容器。

易错点
------

* 把同一列表引用加入结果。
* 忘记回溯弹出。

本题新增知识
------------

* 路径共享状态与结果复制
* 题号 0113 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0112. Path Sum <0112-path-sum.rst>`_；
* `0129. Sum Root to Leaf Numbers <0129-sum-root-to-leaf-numbers.rst>`_；

最小自检
--------

#. ``DFS 回溯`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

递归路径始终等于根到当前节点序列。叶子命中条件等价于路径和达标；DFS 访问每条根到叶路径，复制保证不同答案独立，回溯恢复父状态。
