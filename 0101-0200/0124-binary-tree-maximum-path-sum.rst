0124. Binary Tree Maximum Path Sum
==================================

题目信息
--------

:题号: 0124
:难度: Hard
:主题: 二叉树、后序遍历、树形动态规划、路径端点
:原题: `LeetCode 0124 <https://leetcode.com/problems/binary-tree-maximum-path-sum/>`_
:重点: 单分支收益、双分支候选、负贡献截断、全负树

题目重述
--------

给定一棵非空二叉树，路径可以从任意节点开始和结束，相邻节点必须有父子边，同一节点不能重复。返回所有非空简单路径中的最大节点值总和。

自建示例
--------

.. code-block:: text

       -10
       /  \
      9   20
         /  \
        15   7
   -> 42，路径 15 -> 20 -> 7

.. code-block:: text

       -3
       / \
     -5  -2
   -> -2，路径不能为空。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <climits>
   #include <stack>
   #include <unordered_map>
   #include <utility>

   class Solution {
   private:
       int downward(TreeNode* node) {
           if (!node) return 0;
           return node->val + std::max({0, downward(node->left), downward(node->right)});
       }

       void enumerateHighest(TreeNode* node, int& best) {
           if (!node) return;
           int left = std::max(0, downward(node->left));
           int right = std::max(0, downward(node->right));
           best = std::max(best, node->val + left + right);
           enumerateHighest(node->left, best);
           enumerateHighest(node->right, best);
       }

       int postorderGain(TreeNode* node, int& best) {
           if (!node) return 0;
           int left = std::max(0, postorderGain(node->left, best));
           int right = std::max(0, postorderGain(node->right, best));
           best = std::max(best, node->val + left + right);
           return node->val + std::max(left, right);
       }

       int iterativePostorder(TreeNode* root) {
           std::stack<std::pair<TreeNode*, bool>> stack;
           std::unordered_map<TreeNode*, int> gain;
           stack.push({root, false});
           int best = INT_MIN;
           while (!stack.empty()) {
               auto [node, visited] = stack.top(); stack.pop();
               if (!node) continue;
               if (!visited) {
                   stack.push({node, true});
                   stack.push({node->right, false});
                   stack.push({node->left, false});
               } else {
                   int left = node->left ? std::max(0, gain[node->left]) : 0;
                   int right = node->right ? std::max(0, gain[node->right]) : 0;
                   best = std::max(best, node->val + left + right);
                   gain[node] = node->val + std::max(left, right);
               }
           }
           return best;
       }

   public:
       int maxPathSum(TreeNode* root) {
           int best = INT_MIN;
           postorderGain(root, best);
           return best;
       }
   };

题解
----

一条路径为何有唯一最高节点
~~~~~~~~~~~~~~~~~~~~~~~~~~

树中任意两端点之间的简单路径唯一。路径上深度最小的节点是唯一最高节点；从该节点看，路径最多由左侧一条向下链、当前节点、右侧一条向下链组成。

为什么需要两个不同量
~~~~~~~~~~~~~~~~~~~~

当前节点可以同时连接左右收益，形成在这里闭合的完整候选：

.. code-block:: text

   candidate = node.val + left_gain + right_gain

向父节点返回时只能选择一侧：

.. code-block:: text

   return_gain = node.val + max(left_gain, right_gain)

若同时把两侧返回，父节点继续连接后会在当前节点产生三叉结构，不再是一条路径。

负收益为什么截断为零
~~~~~~~~~~~~~~~~~~~~

子树向下收益为负时，把它接入路径只会降低总和。完整候选和向上收益都可选择不使用该孩子，因此取 ``max(0,gain)``。当前节点本身不能省略，因为返回状态和候选路径都必须非空。

.. list-table::
   :header-rows: 1

   * - 节点
     - 左收益
     - 右收益
     - 完整候选
     - 向上返回
   * - 15
     - 0
     - 0
     - 15
     - 15
   * - 7
     - 0
     - 0
     - 7
     - 7
   * - 20
     - 15
     - 7
     - 42
     - 35
   * - -10
     - 9
     - 35
     - 34
     - 25

全局答案为什么不能初始化为零
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

全负树的最佳路径是值最大的单节点。若 ``best=0``，会错误地选择空路径。初始化为最小整数，并在每个真实节点更新一次，保证结果非空。

后序遍历为何恰好满足依赖
~~~~~~~~~~~~~~~~~~~~~~~~

当前节点需要左右孩子的最大向下收益，必须先处理孩子。每个节点计算一次收益并更新一次全局候选，避免基准方法在每个最高节点重新扫描子树。

为什么覆盖全部路径
~~~~~~~~~~~~~~~~~~

任意路径按其唯一最高节点分类。处理该节点时，左右递归收益分别给出两侧可选的最佳向下链，算法生成的候选不小于该路径；候选本身又由真实树边组成，是合法路径。因此所有候选最大值等于全局最优。

复杂度来源
~~~~~~~~~~

重复计算向下收益的基准最坏 ``O(n²)``。后序主解法访问每个节点一次，时间 ``O(n)``，递归栈 ``O(h)``；显式后序使用 ``O(n)`` 收益表。

九语言实现
----------

C
~

.. code-block:: c

   static int best;static int gain(struct TreeNode*x){if(!x)return 0;int l=gain(x->left),r=gain(x->right);if(l<0)l=0;if(r<0)r=0;int candidate=x->val+l+r;if(candidate>best)best=candidate;return x->val+(l>r?l:r);}int maxPathSum(struct TreeNode*root){best=INT_MIN;gain(root);return best;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxPathSum(self, root) -> int:
           best = float("-inf")
           def gain(node):
               nonlocal best
               if node is None: return 0
               left, right = max(0, gain(node.left)), max(0, gain(node.right))
               best = max(best, node.val + left + right)
               return node.val + max(left, right)
           gain(root); return int(best)

Java
~~~~

.. code-block:: java

   class Solution {int best=Integer.MIN_VALUE;int gain(TreeNode x){if(x==null)return 0;int l=Math.max(0,gain(x.left)),r=Math.max(0,gain(x.right));best=Math.max(best,x.val+l+r);return x.val+Math.max(l,r);}public int maxPathSum(TreeNode root){gain(root);return best;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn max_path_sum(root:Option<Rc<RefCell<TreeNode>>>)->i32{fn gain(x:Option<Rc<RefCell<TreeNode>>>,best:&mut i32)->i32{match x{None=>0,Some(n)=>{let b=n.borrow();let l=gain(b.left.clone(),best).max(0);let r=gain(b.right.clone(),best).max(0);*best=(*best).max(b.val+l+r);b.val+l.max(r)}}}let mut best=i32::MIN;gain(root,&mut best);best}}

Go
~~

.. code-block:: go

   func maxPathSum(root *TreeNode)int{best:=-int(^uint(0)>>1)-1;var gain func(*TreeNode)int;gain=func(x *TreeNode)int{if x==nil{return 0};l,r:=gain(x.Left),gain(x.Right);if l<0{l=0};if r<0{r=0};if x.Val+l+r>best{best=x.Val+l+r};if l>r{return x.Val+l};return x.Val+r};gain(root);return best}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxPathSum(root:TreeNode|null):number{let best=-Infinity;const gain=(x:TreeNode|null):number=>{if(!x)return 0;const l=Math.max(0,gain(x.left)),r=Math.max(0,gain(x.right));best=Math.max(best,x.val+l+r);return x.val+Math.max(l,r);};gain(root);return best;}

C#
~~

.. code-block:: csharp

   public class Solution {int best=int.MinValue;int Gain(TreeNode x){if(x==null)return 0;int l=Math.Max(0,Gain(x.left)),r=Math.Max(0,Gain(x.right));best=Math.Max(best,x.val+l+r);return x.val+Math.Max(l,r);}public int MaxPathSum(TreeNode root){Gain(root);return best;}}

Julia
~~~~~

.. code-block:: julia

   function max_path_sum(root)
       best=Ref(typemin(Int))
       function gain(x);x===nothing&&return 0;l=max(0,gain(x.left));r=max(0,gain(x.right));best[]=max(best[],x.val+l+r);x.val+max(l,r);end
       gain(root);best[]
   end

R
~

.. code-block:: r

   max_path_sum <- function(root){best<--.Machine$integer.max;gain<-function(x){if(is.null(x))return(0L);l<-max(0L,gain(x$left));r<-max(0L,gain(x$right));best<<-max(best,x$val+l+r);x$val+max(l,r)};gain(root);best}