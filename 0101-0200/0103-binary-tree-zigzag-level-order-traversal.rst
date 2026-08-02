0103. Binary Tree Zigzag Level Order Traversal
==============================================

题目信息
--------

:题号: 0103
:难度: Medium
:主题: 二叉树、广度优先搜索、队列、交替方向
:原题: `LeetCode 0103 <https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/>`_
:重点: 逐层输出、层内方向交替、空树结果

题目重述
--------

给定二叉树根节点 ``root``，返回节点值的锯齿形层序遍历结果。最上层按照从左到右的顺序输出，下一层改为从右到左，此后每深入一层就切换一次方向。每一层单独形成一个数组；空树返回空数组。

树中节点数在 ``0..2000`` 范围内，节点值在 ``-100..100`` 范围内。

自建示例
--------

.. code-block:: text

   输入：root = [8,4,12,2,6,10,14,null,3]
   输出：[[8],[12,4],[2,6,10,14],[3]]
   解释：第一层从左到右；第二层从右到左；第三层重新从左到右；第四层只有一个节点。

.. code-block:: text

   输入：root = []
   输出：[]
   解释：空树没有可输出的层。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <deque>
   #include <queue>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       std::vector<std::vector<int>> reverseOddRows(TreeNode* root) {
           if (!root) return {};
           std::queue<TreeNode*> queue; queue.push(root);
           std::vector<std::vector<int>> result;
           bool reverse = false;
           while (!queue.empty()) {
               int size = queue.size();
               std::vector<int> row;
               for (int i = 0; i < size; ++i) {
                   TreeNode* node = queue.front(); queue.pop();
                   row.push_back(node->val);
                   if (node->left) queue.push(node->left);
                   if (node->right) queue.push(node->right);
               }
               if (reverse) std::reverse(row.begin(), row.end());
               result.push_back(std::move(row)); reverse = !reverse;
           }
           return result;
       }

       std::vector<std::vector<int>> dequeRows(TreeNode* root) {
           if (!root) return {};
           std::queue<TreeNode*> queue; queue.push(root);
           std::vector<std::vector<int>> result;
           bool left_to_right = true;
           while (!queue.empty()) {
               int size = queue.size(); std::deque<int> row;
               for (int i = 0; i < size; ++i) {
                   TreeNode* node = queue.front(); queue.pop();
                   if (left_to_right) row.push_back(node->val); else row.push_front(node->val);
                   if (node->left) queue.push(node->left);
                   if (node->right) queue.push(node->right);
               }
               result.emplace_back(row.begin(), row.end());
               left_to_right = !left_to_right;
           }
           return result;
       }

       std::vector<std::vector<int>> targetPositions(TreeNode* root) {
           if (!root) return {};
           std::queue<TreeNode*> queue; queue.push(root);
           std::vector<std::vector<int>> result;
           bool left_to_right = true;
           while (!queue.empty()) {
               int size = queue.size();
               std::vector<int> row(size);
               for (int index = 0; index < size; ++index) {
                   TreeNode* node = queue.front(); queue.pop();
                   int target = left_to_right ? index : size - 1 - index;
                   row[target] = node->val;
                   if (node->left) queue.push(node->left);
                   if (node->right) queue.push(node->right);
               }
               result.push_back(std::move(row));
               left_to_right = !left_to_right;
           }
           return result;
       }

   public:
       std::vector<std::vector<int>> zigzagLevelOrder(TreeNode* root) {
           return targetPositions(root);
       }
   };

题解
----

为什么不能反向处理父节点
~~~~~~~~~~~~~~~~~~~~~~

锯齿要求只改变当前行的输出方向。若奇数层从右向左弹出父节点并据此生成孩子，下一层前沿也会被反转，必须增加复杂的入队规则才能恢复。稳定做法始终按普通 BFS 顺序处理节点。

目标位置如何计算
~~~~~~~~~~~~~~~~

当前层长度为 ``size``，按队列顺序取出的下标为 ``index``：

.. code-block:: text

   左到右：target = index
   右到左：target = size - 1 - index

因此方向状态只影响 ``row[target]``，孩子仍按先左后右加入队尾。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 层
     - 队列顺序
     - 目标下标
     - 输出
   * - 0
     - ``[8]``
     - ``[0]``
     - ``[8]``
   * - 1
     - ``[4,12]``
     - ``[1,0]``
     - ``[12,4]``
   * - 2
     - ``[2,6,10,14]``
     - ``[0,1,2,3]``
     - ``[2,6,10,14]``

为什么下一层仍保持自然顺序
~~~~~~~~~~~~~~~~~~~~~~~~

无论当前行写入方向如何，节点都按左到右出队，每个节点都先加入左孩子、再加入右孩子。因此队列中的下一层始终是普通层序顺序，方向切换不会污染遍历状态。

行反转与双端队列的取舍
~~~~~~~~~~~~~~~~~~~~~~

先生成普通行再反转最简单，但奇数层多一次扫描。双端队列可在反向层头插值，但需要额外容器。预分配行并映射目标位置只做一次写入，状态最少。

为什么不重不漏
~~~~~~~~~~~~~~

每个节点仍按标准 BFS 入队和出队一次。每层 ``target`` 是对 ``0..size-1`` 的双射，无论方向如何，每个槽位恰好写入一个节点值，因此行内不重复也不遗漏。

复杂度来源
~~~~~~~~~~

时间 ``O(n)``，队列和当前行最多使用 ``O(w)`` 工作空间。反转法的总反转元素数仍不超过 ``n``，渐进时间相同。

九语言实现
----------

C
~

.. code-block:: c

   int**zigzagLevelOrder(struct TreeNode*root,int*returnSize,int**returnCols){if(!root){*returnSize=0;*returnCols=NULL;return NULL;}struct TreeNode**q=malloc(2001*sizeof(*q));int**out=malloc(2001*sizeof(*out)),*sizes=malloc(2001*sizeof(int));int h=0,t=0,rows=0;bool forward=true;q[t++]=root;while(h<t){int n=t-h;int*row=malloc((size_t)n*sizeof(int));for(int i=0;i<n;i++){struct TreeNode*x=q[h++];row[forward?i:n-1-i]=x->val;if(x->left)q[t++]=x->left;if(x->right)q[t++]=x->right;}out[rows]=row;sizes[rows++]=n;forward=!forward;}free(q);*returnSize=rows;*returnCols=sizes;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def zigzagLevelOrder(self, root):
           if root is None: return []
           queue, head, result, forward = [root], 0, [], True
           while head < len(queue):
               end = len(queue); row = [0] * (end - head)
               for index in range(end - head):
                   node = queue[head]; head += 1
                   row[index if forward else len(row)-1-index] = node.val
                   if node.left: queue.append(node.left)
                   if node.right: queue.append(node.right)
               result.append(row); forward = not forward
           return result

Java
~~~~

.. code-block:: java

   class Solution {public List<List<Integer>> zigzagLevelOrder(TreeNode root){List<List<Integer>>o=new ArrayList<>();if(root==null)return o;Queue<TreeNode>q=new ArrayDeque<>();q.add(root);boolean f=true;while(!q.isEmpty()){int n=q.size();Integer[]row=new Integer[n];for(int i=0;i<n;i++){TreeNode x=q.remove();row[f?i:n-1-i]=x.val;if(x.left!=null)q.add(x.left);if(x.right!=null)q.add(x.right);}o.add(Arrays.asList(row));f=!f;}return o;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn zigzag_level_order(root:Option<Rc<RefCell<TreeNode>>>)->Vec<Vec<i32>>{let mut q=VecDeque::new();if let Some(r)=root{q.push_back(r)}else{return vec![]}let(mut o,mut f)=(vec![],true);while !q.is_empty(){let n=q.len();let mut row=vec![0;n];for i in 0..n{let x=q.pop_front().unwrap();let b=x.borrow();row[if f{i}else{n-1-i}]=b.val;if let Some(l)=b.left.clone(){q.push_back(l)}if let Some(r)=b.right.clone(){q.push_back(r)}}o.push(row);f=!f}o}}

Go
~~

.. code-block:: go

   func zigzagLevelOrder(root *TreeNode)[][]int{if root==nil{return nil};q:=[]*TreeNode{root};head:=0;out:=[][]int{};forward:=true;for head<len(q){end:=len(q);n:=end-head;row:=make([]int,n);for i:=0;i<n;i++{x:=q[head];head++;p:=i;if !forward{p=n-1-i};row[p]=x.Val;if x.Left!=nil{q=append(q,x.Left)};if x.Right!=nil{q=append(q,x.Right)}};out=append(out,row);forward=!forward};return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function zigzagLevelOrder(root:TreeNode|null):number[][]{if(!root)return[];const q=[root],out:number[][]=[];let head=0,forward=true;while(head<q.length){const end=q.length,n=end-head,row=Array(n);for(let i=0;i<n;i++){const x=q[head++];row[forward?i:n-1-i]=x.val;if(x.left)q.push(x.left);if(x.right)q.push(x.right);}out.push(row);forward=!forward;}return out;}

C#
~~

.. code-block:: csharp

   public class Solution {public IList<IList<int>> ZigzagLevelOrder(TreeNode root){var o=new List<IList<int>>();if(root==null)return o;var q=new Queue<TreeNode>();q.Enqueue(root);bool f=true;while(q.Count>0){int n=q.Count;int[]row=new int[n];for(int i=0;i<n;i++){var x=q.Dequeue();row[f?i:n-1-i]=x.val;if(x.left!=null)q.Enqueue(x.left);if(x.right!=null)q.Enqueue(x.right);}o.Add(row);f=!f;}return o;}}

Julia
~~~~~

.. code-block:: julia

   function zigzag_level_order(root)
       root===nothing&&return Vector{Vector{Int}}();q=Any[root];head=1;out=Vector{Vector{Int}}();forward=true
       while head<=length(q);last=length(q);n=last-head+1;row=zeros(Int,n);for i in 1:n;x=q[head];head+=1;row[forward ? i : n-i+1]=x.val;x.left!==nothing&&push!(q,x.left);x.right!==nothing&&push!(q,x.right);end;push!(out,row);forward=!forward;end;out
   end

R
~

.. code-block:: r

   zigzag_level_order <- function(root){if(is.null(root))return(list());q<-list(root);head<-1L;out<-list();forward<-TRUE;while(head<=length(q)){last<-length(q);n<-last-head+1L;row<-integer(n);for(i in seq_len(n)){x<-q[[head]];head<-head+1L;row[[if(forward)i else n-i+1L]]<-x$val;if(!is.null(x$left))q[[length(q)+1L]]<-x$left;if(!is.null(x$right))q[[length(q)+1L]]<-x$right};out[[length(out)+1L]]<-row;forward<-!forward};out}
