0107. Binary Tree Level Order Traversal II
==========================================

题目信息
--------

:题号: 0107
:难度: Medium
:主题: 二叉树、广度优先搜索、深度优先搜索、结果顺序
:原题: `LeetCode 0107 <https://leetcode.com/problems/binary-tree-level-order-traversal-ii/>`_
:教学重点: 自然层序前沿、外层反转、层内顺序保持、结果移动成本

题目重述
--------

给定二叉树，按从最深层到根层返回每一层节点值。每层内部仍从左到右，仅层的排列顺序反转。空树返回空结果，输入树只读。

自建示例
--------

.. code-block:: text

          3
        /   \
       9    20
           /  \
          15   7

   普通层序：[[3],[9,20],[15,7]]
   目标结果：[[15,7],[9,20],[3]]

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <deque>
   #include <queue>
   #include <vector>

   class Solution {
   private:
       void depthRows(TreeNode* node, int depth,
                      std::vector<std::vector<int>>& rows) {
           if (!node) return;
           if (depth == static_cast<int>(rows.size())) rows.push_back({});
           rows[depth].push_back(node->val);
           depthRows(node->left, depth + 1, rows);
           depthRows(node->right, depth + 1, rows);
       }

       std::vector<std::vector<int>> frontInsertion(TreeNode* root) {
           if (!root) return {};
           std::queue<TreeNode*> queue; queue.push(root);
           std::deque<std::vector<int>> rows;
           while (!queue.empty()) {
               int size = queue.size(); std::vector<int> row;
               for (int i = 0; i < size; ++i) {
                   TreeNode* node = queue.front(); queue.pop();
                   row.push_back(node->val);
                   if (node->left) queue.push(node->left);
                   if (node->right) queue.push(node->right);
               }
               rows.push_front(std::move(row));
           }
           return {rows.begin(),rows.end()};
       }

       std::vector<std::vector<int>> bfsThenReverse(TreeNode* root) {
           if (!root) return {};
           std::queue<TreeNode*> queue; queue.push(root);
           std::vector<std::vector<int>> result;
           while (!queue.empty()) {
               int size = queue.size(); std::vector<int> row;
               row.reserve(size);
               for (int i = 0; i < size; ++i) {
                   TreeNode* node = queue.front(); queue.pop();
                   row.push_back(node->val);
                   if (node->left) queue.push(node->left);
                   if (node->right) queue.push(node->right);
               }
               result.push_back(std::move(row));
           }
           std::reverse(result.begin(),result.end());
           return result;
       }

   public:
       std::vector<std::vector<int>> levelOrderBottom(TreeNode* root) {
           return bfsThenReverse(root);
       }
   };

题解
----

为什么先生成普通层序
~~~~~~~~~~~~~~~~~~

遍历要求与第 102 题完全相同：队列前沿按深度递增，层内从左到右。变化只在最终层顺序，因此复用普通 BFS 可以隔离遍历正确性与输出重排。

只反转外层意味着什么
~~~~~~~~~~~~~~~~~~~~

结果是二维数组。目标把 ``[level0,level1,...,levelLast]`` 变为相反层序，但每个 ``level`` 内部不变。对每行调用反转会错误地改变左右顺序。

.. code-block:: text

   reverse([[3],[9,20],[15,7]])
   = [[15,7],[9,20],[3]]

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - BFS 轮次
     - 新行
     - 自然结果
   * - 0
     - ``[3]``
     - ``[[3]]``
   * - 1
     - ``[9,20]``
     - ``[[3],[9,20]]``
   * - 2
     - ``[15,7]``
     - ``[[3],[9,20],[15,7]]``
   * - 结束
     - 反转外层
     - ``[[15,7],[9,20],[3]]``

为什么最终反转优于数组头插
~~~~~~~~~~~~~~~~~~~~~~~~~~

若底层容器是动态数组，每发现一层就插到索引 0 会搬移已有层引用，退化为 ``O(h²)`` 层移动。先尾插再一次反转只需 ``O(h)``。双端队列头插也可保持线性，但增加容器转换。

DFS 如何适配
~~~~~~~~~~~~

DFS 先按深度写入自然行，再反转外层即可。先左后右保证层内顺序；BFS 更直接保存当前层边界，DFS 使用 ``O(h)`` 调用栈。

为什么结果完整
~~~~~~~~~~~~~~

普通 BFS 每个节点恰好加入其深度对应行。外层反转是层下标的双射，只改变层位置，不改变任何行内容，因此节点不重不漏且满足自底向上顺序。

复杂度来源
~~~~~~~~~~

遍历时间 ``O(n)``，外层反转 ``O(h)``，总时间 ``O(n)``。BFS 工作空间 ``O(w)``，返回结果包含全部节点值。

九语言实现
----------

C
~

.. code-block:: c

   int**levelOrderBottom(struct TreeNode*root,int*returnSize,int**returnCols){if(!root){*returnSize=0;*returnCols=NULL;return NULL;}struct TreeNode**q=malloc(2001*sizeof(*q));int**out=malloc(2001*sizeof(*out));int*sizes=malloc(2001*sizeof(int));int h=0,t=0,rows=0;q[t++]=root;while(h<t){int n=t-h;int*row=malloc((size_t)n*sizeof(int));for(int i=0;i<n;i++){struct TreeNode*x=q[h++];row[i]=x->val;if(x->left)q[t++]=x->left;if(x->right)q[t++]=x->right;}out[rows]=row;sizes[rows++]=n;}for(int i=0;i<rows/2;i++){int*j=out[i];out[i]=out[rows-1-i];out[rows-1-i]=j;int z=sizes[i];sizes[i]=sizes[rows-1-i];sizes[rows-1-i]=z;}free(q);*returnSize=rows;*returnCols=sizes;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def levelOrderBottom(self, root):
           if root is None: return []
           queue, head, result = [root], 0, []
           while head < len(queue):
               end = len(queue); row = []
               while head < end:
                   node = queue[head]; head += 1; row.append(node.val)
                   if node.left: queue.append(node.left)
                   if node.right: queue.append(node.right)
               result.append(row)
           result.reverse(); return result

Java
~~~~

.. code-block:: java

   class Solution {public List<List<Integer>> levelOrderBottom(TreeNode root){List<List<Integer>>o=new ArrayList<>();if(root==null)return o;Queue<TreeNode>q=new ArrayDeque<>();q.add(root);while(!q.isEmpty()){int n=q.size();List<Integer>row=new ArrayList<>(n);for(int i=0;i<n;i++){TreeNode x=q.remove();row.add(x.val);if(x.left!=null)q.add(x.left);if(x.right!=null)q.add(x.right);}o.add(row);}Collections.reverse(o);return o;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn level_order_bottom(root:Option<Rc<RefCell<TreeNode>>>)->Vec<Vec<i32>>{let mut q=VecDeque::new();if let Some(r)=root{q.push_back(r)}else{return vec![]}let mut o=vec![];while !q.is_empty(){let n=q.len();let mut row=vec![];for _ in 0..n{let x=q.pop_front().unwrap();let b=x.borrow();row.push(b.val);if let Some(l)=b.left.clone(){q.push_back(l)}if let Some(r)=b.right.clone(){q.push_back(r)}}o.push(row)}o.reverse();o}}

Go
~~

.. code-block:: go

   func levelOrderBottom(root *TreeNode)[][]int{if root==nil{return nil};q:=[]*TreeNode{root};head:=0;out:=[][]int{};for head<len(q){end:=len(q);row:=[]int{};for head<end{x:=q[head];head++;row=append(row,x.Val);if x.Left!=nil{q=append(q,x.Left)};if x.Right!=nil{q=append(q,x.Right)}};out=append(out,row)};for i,j:=0,len(out)-1;i<j;i,j=i+1,j-1{out[i],out[j]=out[j],out[i]};return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function levelOrderBottom(root:TreeNode|null):number[][]{if(!root)return[];const q=[root],out:number[][]=[];let head=0;while(head<q.length){const end=q.length,row:number[]=[];while(head<end){const x=q[head++];row.push(x.val);if(x.left)q.push(x.left);if(x.right)q.push(x.right);}out.push(row);}return out.reverse();}

C#
~~

.. code-block:: csharp

   public class Solution {public IList<IList<int>> LevelOrderBottom(TreeNode root){var o=new List<IList<int>>();if(root==null)return o;var q=new Queue<TreeNode>();q.Enqueue(root);while(q.Count>0){int n=q.Count;var row=new List<int>();for(int i=0;i<n;i++){var x=q.Dequeue();row.Add(x.val);if(x.left!=null)q.Enqueue(x.left);if(x.right!=null)q.Enqueue(x.right);}o.Add(row);}o.Reverse();return o;}}

Julia
~~~~~

.. code-block:: julia

   function level_order_bottom(root)
       root===nothing&&return Vector{Vector{Int}}();q=Any[root];head=1;out=Vector{Vector{Int}}()
       while head<=length(q);last=length(q);row=Int[];while head<=last;x=q[head];head+=1;push!(row,x.val);x.left!==nothing&&push!(q,x.left);x.right!==nothing&&push!(q,x.right);end;push!(out,row);end;reverse!(out);out
   end

R
~

.. code-block:: r

   level_order_bottom <- function(root){if(is.null(root))return(list());q<-list(root);head<-1L;out<-list();while(head<=length(q)){last<-length(q);row<-integer();while(head<=last){x<-q[[head]];head<-head+1L;row<-c(row,x$val);if(!is.null(x$left))q[[length(q)+1L]]<-x$left;if(!is.null(x$right))q[[length(q)+1L]]<-x$right};out[[length(out)+1L]]<-row};rev(out)}
