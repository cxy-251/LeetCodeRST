0113. Path Sum II
=================

题目信息
--------

:题号: 0113
:难度: Medium
:主题: 二叉树、深度优先搜索、回溯、路径快照
:原题: `LeetCode 0113 <https://leetcode.com/problems/path-sum-ii/>`_
:重点: 根到叶限定、共享路径、结果复制、对称撤销

题目重述
--------

给定二叉树的根节点 ``root`` 和整数 ``targetSum``，返回所有节点值之和等于 ``targetSum`` 的根到叶路径。每条路径用沿途节点值组成的数组表示；叶节点是没有左孩子和右孩子的节点。

自建示例
--------

.. code-block:: text

             5
           /   \
          4     8
         /     / \
        11    13  4
       /  \      / \
      7    2    5   1

   targetSum = 22
   输出：[[5,4,11,2], [5,8,4,5]]

.. code-block:: text

   1 -> -2 -> 2
   targetSum = 1
   输出：[[1,-2,2]]

C++ 实现
--------

.. code-block:: cpp

   #include <stack>
   #include <tuple>
   #include <vector>

   class Solution {
   private:
       void copyPerBranch(TreeNode* node, long long remaining,
                          std::vector<int> path,
                          std::vector<std::vector<int>>& result) {
           if (!node) return;
           path.push_back(node->val);
           remaining -= node->val;
           if (!node->left && !node->right) {
               if (remaining == 0) result.push_back(std::move(path));
               return;
           }
           copyPerBranch(node->left, remaining, path, result);
           copyPerBranch(node->right, remaining, std::move(path), result);
       }

       void backtrack(TreeNode* node, long long remaining,
                      std::vector<int>& path,
                      std::vector<std::vector<int>>& result) {
           if (!node) return;
           path.push_back(node->val);
           remaining -= node->val;

           if (!node->left && !node->right) {
               if (remaining == 0) result.push_back(path);
           } else {
               backtrack(node->left, remaining, path, result);
               backtrack(node->right, remaining, path, result);
           }
           path.pop_back();
       }

       std::vector<std::vector<int>> iterative(TreeNode* root, long long target) {
           if (!root) return {};
           std::vector<std::vector<int>> result;
           std::stack<std::tuple<TreeNode*, long long, std::vector<int>>> stack;
           stack.push({root, target, {}});
           while (!stack.empty()) {
               auto [node, remaining, path] = std::move(stack.top());
               stack.pop();
               path.push_back(node->val);
               remaining -= node->val;
               if (!node->left && !node->right) {
                   if (remaining == 0) result.push_back(std::move(path));
                   continue;
               }
               if (node->right) stack.push({node->right, remaining, path});
               if (node->left) stack.push({node->left, remaining, std::move(path)});
           }
           return result;
       }

   public:
       std::vector<std::vector<int>> pathSum(TreeNode* root, int targetSum) {
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           backtrack(root, static_cast<long long>(targetSum), path, result);
           return result;
       }
   };

题解
----

与第 112 题相比增加了什么
~~~~~~~~~~~~~~~~~~~~~~~~

第 112 题只需返回是否存在路径，找到一条即可短路。本题必须恢复全部见证，因此每个递归状态除节点和剩余目标外，还要维护从根到当前节点的值序列。

共享路径的四步操作
~~~~~~~~~~~~~~~~~~

进入节点后执行：

#. ``path.push_back(node.val)``；
#. 扣除当前值并递归孩子；
#. 叶节点精确命中时复制 ``path`` 到结果；
#. 返回父层前 ``path.pop_back()``。

追加与撤销必须对称。这样左右兄弟分支共享同一缓冲区，却只看到属于自己的根到当前节点前缀。

.. list-table::
   :header-rows: 1

   * - 动作
     - ``path``
     - ``remaining``
   * - 进入 5
     - ``[5]``
     - 17
   * - 进入 4
     - ``[5,4]``
     - 13
   * - 进入 11
     - ``[5,4,11]``
     - 2
   * - 进入叶 2
     - ``[5,4,11,2]``
     - 0，复制快照
   * - 离开叶 2
     - ``[5,4,11]``
     - 父状态继续

为什么保存结果时必须复制
~~~~~~~~~~~~~~~~~~~~~~~~

``path`` 后续还会弹出和追加。若结果只保存同一个可变容器引用，回溯会同步修改已经记录的答案。``result.push_back(path)`` 创建独立值快照，使每条返回路径永久保持提交时内容。

为什么只能在叶节点提交
~~~~~~~~~~~~~~~~~~~~~~

路径必须结束于叶节点。内部节点即使扣除后剩余值为 0，后续仍必须沿某个孩子继续，因此不能提前保存。叶节点条件是左右孩子都为空。

负数为什么禁止按剩余值剪枝
~~~~~~~~~~~~~~~~~~~~~~~~~~

剩余目标小于零后，后续负值可能使其回到零；剩余目标为零后，后续正负值也可能抵消。只有结构边界和叶节点比较是安全判断。

逐分支复制与回溯的取舍
~~~~~~~~~~~~~~~~~~~~~~

逐分支复制写法简单，每次递归都携带独立路径，但一条深度为 ``h`` 的路径会被反复复制，增加工作。回溯只维护一份长度不超过 ``h`` 的缓冲区，只有生成答案时才复制。

为什么不重不漏
~~~~~~~~~~~~~~

DFS 对每个非空节点只沿唯一父路径到达。每个叶节点对应唯一根到叶路径，算法在该叶节点处精确检查一次，因此合法路径全部提交一次，不合法路径不会提交。

输出敏感复杂度
~~~~~~~~~~~~~~

遍历树需要 ``O(n)`` 时间。设所有返回路径总长度为 ``K``，复制结果需要 ``O(K)``，总时间 ``O(n+K)``。工作路径和递归栈为 ``O(h)``，返回结果占 ``O(K)``。

九语言实现
----------

C
~

.. code-block:: c

   static void dfs(struct TreeNode*x,long long remain,int*path,int depth,int***out,int**cols,int*size){if(!x)return;path[depth++]=x->val;remain-=x->val;if(!x->left&&!x->right){if(remain==0){int*row=malloc((size_t)depth*sizeof(int));memcpy(row,path,(size_t)depth*sizeof(int));(*out)[*size]=row;(*cols)[(*size)++]=depth;}return;}dfs(x->left,remain,path,depth,out,cols,size);dfs(x->right,remain,path,depth,out,cols,size);}int**pathSum(struct TreeNode*root,int target,int*returnSize,int**returnCols){int**out=malloc(5001*sizeof(int*));int*cols=malloc(5001*sizeof(int));int*path=malloc(5001*sizeof(int));int size=0;dfs(root,target,path,0,&out,&cols,&size);free(path);*returnSize=size;*returnCols=cols;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def pathSum(self, root, targetSum: int) -> list[list[int]]:
           result, path = [], []
           def dfs(node, remaining):
               if node is None: return
               path.append(node.val); remaining -= node.val
               if node.left is None and node.right is None:
                   if remaining == 0: result.append(path.copy())
               else:
                   dfs(node.left, remaining); dfs(node.right, remaining)
               path.pop()
           dfs(root, targetSum); return result

Java
~~~~

.. code-block:: java

   class Solution {List<List<Integer>>out=new ArrayList<>();List<Integer>path=new ArrayList<>();void dfs(TreeNode x,long remain){if(x==null)return;path.add(x.val);remain-=x.val;if(x.left==null&&x.right==null){if(remain==0)out.add(new ArrayList<>(path));}else{dfs(x.left,remain);dfs(x.right,remain);}path.remove(path.size()-1);}public List<List<Integer>> pathSum(TreeNode root,int targetSum){dfs(root,targetSum);return out;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn path_sum(root:Option<Rc<RefCell<TreeNode>>>,target_sum:i32)->Vec<Vec<i32>>{fn dfs(x:Option<Rc<RefCell<TreeNode>>>,remain:i64,path:&mut Vec<i32>,out:&mut Vec<Vec<i32>>){let Some(x)=x else{return};let b=x.borrow();path.push(b.val);let next=remain-b.val as i64;if b.left.is_none()&&b.right.is_none(){if next==0{out.push(path.clone())}}else{dfs(b.left.clone(),next,path,out);dfs(b.right.clone(),next,path,out)}path.pop();}let mut out=vec![];dfs(root,target_sum as i64,&mut vec![],&mut out);out}}

Go
~~

.. code-block:: go

   func pathSum(root *TreeNode,targetSum int)[][]int{out:=[][]int{};path:=[]int{};var dfs func(*TreeNode,int64);dfs=func(x *TreeNode,remain int64){if x==nil{return};path=append(path,x.Val);remain-=int64(x.Val);if x.Left==nil&&x.Right==nil{if remain==0{row:=append([]int(nil),path...);out=append(out,row)}}else{dfs(x.Left,remain);dfs(x.Right,remain)};path=path[:len(path)-1]};dfs(root,int64(targetSum));return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function pathSum(root:TreeNode|null,targetSum:number):number[][]{const out:number[][]=[],path:number[]=[];const dfs=(x:TreeNode|null,remain:number)=>{if(!x)return;path.push(x.val);remain-=x.val;if(!x.left&&!x.right){if(remain===0)out.push([...path]);}else{dfs(x.left,remain);dfs(x.right,remain);}path.pop();};dfs(root,targetSum);return out;}

C#
~~

.. code-block:: csharp

   public class Solution {List<IList<int>>o=new();List<int>p=new();void Dfs(TreeNode x,long remain){if(x==null)return;p.Add(x.val);remain-=x.val;if(x.left==null&&x.right==null){if(remain==0)o.Add(new List<int>(p));}else{Dfs(x.left,remain);Dfs(x.right,remain);}p.RemoveAt(p.Count-1);}public IList<IList<int>> PathSum(TreeNode root,int targetSum){Dfs(root,targetSum);return o;}}

Julia
~~~~~

.. code-block:: julia

   function path_sum(root,target)
       out=Vector{Vector{Int}}();path=Int[]
       function dfs(x,remain);x===nothing&&return;push!(path,x.val);remain-=x.val;if x.left===nothing&&x.right===nothing;remain==0&&push!(out,copy(path));else;dfs(x.left,remain);dfs(x.right,remain);end;pop!(path);end
       dfs(root,target);out
   end

R
~

.. code-block:: r

   path_sum <- function(root,target){out<-list();path<-integer();dfs<-function(x,remain){if(is.null(x))return();path<<-c(path,x$val);remain<-remain-x$val;if(is.null(x$left)&&is.null(x$right)){if(remain==0)out[[length(out)+1L]]<<-path}else{dfs(x$left,remain);dfs(x$right,remain)};path<<-path[-length(path)]};dfs(root,target);out}