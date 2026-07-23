0102. Binary Tree Level Order Traversal
=======================================

题目信息
--------

:题号: 0102
:难度: Medium
:主题: 二叉树、广度优先搜索、队列、二维输出
:原题: `LeetCode 0102 <https://leetcode.com/problems/binary-tree-level-order-traversal/>`_
:重点: 队列前沿、层大小快照、孩子入队顺序、独立行结果

题目重述
--------

给定二叉树的根节点 ``root``，返回节点值的层序遍历结果。结果按从根到叶的层次排列，每一层单独形成一个数组，层内节点值按从左到右的顺序排列。

自建示例
--------

.. code-block:: text

          3
        /   \
       9    20
           /  \
          15   7
   -> [[3],[9,20],[15,7]]

.. code-block:: text

          1
        /   \
       2     3
        \   /
         4 5
   -> [[1],[2,3],[4,5]]

第三层仍按父节点 2、3 的扩展顺序排列。

C++ 实现
--------

.. code-block:: cpp

   #include <queue>
   #include <vector>

   class Solution {
   private:
       void depthFirst(TreeNode* node, int depth,
                       std::vector<std::vector<int>>& result) {
           if (!node) return;
           if (depth == static_cast<int>(result.size())) result.push_back({});
           result[depth].push_back(node->val);
           depthFirst(node->left, depth + 1, result);
           depthFirst(node->right, depth + 1, result);
       }

       std::vector<std::vector<int>> twoQueues(TreeNode* root) {
           if (!root) return {};
           std::queue<TreeNode*> current, next;
           current.push(root);
           std::vector<std::vector<int>> result;
           while (!current.empty()) {
               std::vector<int> row;
               while (!current.empty()) {
                   TreeNode* node = current.front(); current.pop();
                   row.push_back(node->val);
                   if (node->left) next.push(node->left);
                   if (node->right) next.push(node->right);
               }
               result.push_back(std::move(row));
               std::swap(current,next);
           }
           return result;
       }

       std::vector<std::vector<int>> sizeSnapshot(TreeNode* root) {
           if (!root) return {};
           std::queue<TreeNode*> queue;
           queue.push(root);
           std::vector<std::vector<int>> result;
           while (!queue.empty()) {
               int level_size = queue.size();
               std::vector<int> row;
               row.reserve(level_size);
               for (int i = 0; i < level_size; ++i) {
                   TreeNode* node = queue.front(); queue.pop();
                   row.push_back(node->val);
                   if (node->left) queue.push(node->left);
                   if (node->right) queue.push(node->right);
               }
               result.push_back(std::move(row));
           }
           return result;
       }

   public:
       std::vector<std::vector<int>> levelOrder(TreeNode* root) {
           return sizeSnapshot(root);
       }
   };

题解
----

为什么需要广度优先前沿
~~~~~~~~~~~~~~~~~~~~

题目要求先完成深度较小的全部节点，再处理下一层。队列保存尚未访问的节点前沿，先进先出顺序使同层父节点按从左到右处理。

层大小快照保存什么
~~~~~~~~~~~~~~~~~~

每轮开始时，队列中已有的节点恰好属于当前层。保存 ``level_size`` 后只弹出这些节点；处理中加入的孩子位于队尾，属于下一层，不会混入当前行。

.. code-block:: text

   处理前：queue = [当前层]
   弹出 level_size 个节点，同时追加孩子
   处理后：queue = [下一层]

为什么孩子必须先左后右入队
~~~~~~~~~~~~~~~~~~~~~~~~

当前层父节点按从左到右出队。每个父节点先加入左孩子、再加入右孩子，便可保证下一层按父节点顺序以及同一父节点的左右顺序排列。稀疏树无需加入空节点占位。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 层
     - 处理前队列
     - 输出
     - 处理后队列
   * - 0
     - ``[3]``
     - ``[3]``
     - ``[9,20]``
   * - 1
     - ``[9,20]``
     - ``[9,20]``
     - ``[15,7]``
   * - 2
     - ``[15,7]``
     - ``[15,7]``
     - 空

为什么每行必须独立
~~~~~~~~~~~~~~~~~~

每轮创建新的 ``row``，完成后移动或复制进结果。若把同一个可变缓冲区反复加入结果后再清空，多种引用语义语言会让已有行一同变化。

DFS 为什么也能得到正确顺序
~~~~~~~~~~~~~~~~~~~~~~~~~~

先左后右的 DFS 可按深度追加到对应行。首次到达某深度时创建行，同层节点的访问顺序仍是从左到右。它需要递归栈，而 BFS 的状态更直接表达层边界。

复杂度来源
~~~~~~~~~~

每个节点入队、出队一次，时间 ``O(n)``。队列最大占 ``O(w)``，其中 ``w`` 是最大层宽；DFS 使用 ``O(h)`` 调用栈。返回结果包含 ``n`` 个值。

九语言实现
----------

C
~

.. code-block:: c

   int**levelOrder(struct TreeNode*root,int*returnSize,int**returnCols){if(!root){*returnSize=0;*returnCols=NULL;return NULL;}struct TreeNode**q=malloc(2001*sizeof(*q));int**out=malloc(2001*sizeof(*out));int*sizes=malloc(2001*sizeof(int));int head=0,tail=0,rows=0;q[tail++]=root;while(head<tail){int count=tail-head;int*row=malloc((size_t)count*sizeof(int));for(int i=0;i<count;i++){struct TreeNode*n=q[head++];row[i]=n->val;if(n->left)q[tail++]=n->left;if(n->right)q[tail++]=n->right;}out[rows]=row;sizes[rows++]=count;}free(q);*returnSize=rows;*returnCols=sizes;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def levelOrder(self, root):
           if root is None: return []
           queue, head, result = [root], 0, []
           while head < len(queue):
               end = len(queue); row = []
               while head < end:
                   node = queue[head]; head += 1; row.append(node.val)
                   if node.left: queue.append(node.left)
                   if node.right: queue.append(node.right)
               result.append(row)
           return result

Java
~~~~

.. code-block:: java

   class Solution {public List<List<Integer>> levelOrder(TreeNode root){List<List<Integer>>o=new ArrayList<>();if(root==null)return o;Queue<TreeNode>q=new ArrayDeque<>();q.add(root);while(!q.isEmpty()){int n=q.size();List<Integer>row=new ArrayList<>(n);for(int i=0;i<n;i++){TreeNode x=q.remove();row.add(x.val);if(x.left!=null)q.add(x.left);if(x.right!=null)q.add(x.right);}o.add(row);}return o;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn level_order(root:Option<Rc<RefCell<TreeNode>>>)->Vec<Vec<i32>>{let mut out=vec![];let mut q=VecDeque::new();if let Some(r)=root{q.push_back(r)}else{return out}while !q.is_empty(){let n=q.len();let mut row=Vec::with_capacity(n);for _ in 0..n{let x=q.pop_front().unwrap();let b=x.borrow();row.push(b.val);if let Some(l)=b.left.clone(){q.push_back(l)}if let Some(r)=b.right.clone(){q.push_back(r)}}out.push(row)}out}}

Go
~~

.. code-block:: go

   func levelOrder(root *TreeNode)[][]int{if root==nil{return nil};q:=[]*TreeNode{root};head:=0;out:=[][]int{};for head<len(q){end:=len(q);row:=make([]int,0,end-head);for head<end{x:=q[head];head++;row=append(row,x.Val);if x.Left!=nil{q=append(q,x.Left)};if x.Right!=nil{q=append(q,x.Right)}};out=append(out,row)};return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function levelOrder(root:TreeNode|null):number[][]{if(!root)return[];const q=[root],out:number[][]=[];let head=0;while(head<q.length){const end=q.length,row:number[]=[];while(head<end){const x=q[head++];row.push(x.val);if(x.left)q.push(x.left);if(x.right)q.push(x.right);}out.push(row);}return out;}

C#
~~

.. code-block:: csharp

   public class Solution {public IList<IList<int>> LevelOrder(TreeNode root){var o=new List<IList<int>>();if(root==null)return o;var q=new Queue<TreeNode>();q.Enqueue(root);while(q.Count>0){int n=q.Count;var row=new List<int>(n);for(int i=0;i<n;i++){var x=q.Dequeue();row.Add(x.val);if(x.left!=null)q.Enqueue(x.left);if(x.right!=null)q.Enqueue(x.right);}o.Add(row);}return o;}}

Julia
~~~~~

.. code-block:: julia

   function level_order(root)
       root===nothing&&return Vector{Vector{Int}}();q=Any[root];head=1;out=Vector{Vector{Int}}()
       while head<=length(q);last=length(q);row=Int[];while head<=last;x=q[head];head+=1;push!(row,x.val);x.left!==nothing&&push!(q,x.left);x.right!==nothing&&push!(q,x.right);end;push!(out,row);end;out
   end

R
~

.. code-block:: r

   level_order <- function(root){if(is.null(root))return(list());q<-list(root);head<-1L;out<-list();while(head<=length(q)){last<-length(q);row<-integer();while(head<=last){x<-q[[head]];head<-head+1L;row<-c(row,x$val);if(!is.null(x$left))q[[length(q)+1L]]<-x$left;if(!is.null(x$right))q[[length(q)+1L]]<-x$right};out[[length(out)+1L]]<-row};out}