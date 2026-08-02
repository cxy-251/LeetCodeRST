0112. Path Sum
==============

题目信息
--------

:题号: 0112
:难度: Easy
:主题: 二叉树、深度优先搜索、根到叶路径、短路
:原题: `LeetCode 0112 <https://leetcode.com/problems/path-sum/>`_
:重点: 完整根到叶路径、节点和、空树

题目重述
--------

给定二叉树根节点 ``root`` 和整数 ``targetSum``，判断是否存在一条从根节点开始、在某个叶节点结束的向下路径，使路径上所有节点值之和恰好等于 ``targetSum``。叶节点必须同时没有左孩子和右孩子；内部节点处的前缀和即使命中目标，也不算完整路径。空树返回 ``false``。

树中节点数在 ``0..5000`` 范围内，节点值与 ``targetSum`` 均在 ``-1000..1000`` 范围内。

自建示例
--------

.. code-block:: text

   输入：root = [6,2,9,1,4,-3,12], targetSum = 12
   输出：true
   解释：根到叶路径 6 -> 2 -> 4 的节点和为 12。

.. code-block:: text

   输入：root = [6,2,null,4], targetSum = 8
   输出：false
   解释：前缀 6 -> 2 的和为 8，但节点 2 还有孩子，不是叶节点；唯一完整路径的和为 12。

C++ 实现
--------

.. code-block:: cpp

   #include <stack>
   #include <utility>

   class Solution {
   private:
       bool prefixDfs(TreeNode* node, long long sum, long long target) {
           if (!node) return false;
           sum += node->val;
           if (!node->left && !node->right) return sum == target;
           return prefixDfs(node->left, sum, target) ||
                  prefixDfs(node->right, sum, target);
       }

       bool remainingDfs(TreeNode* node, long long remaining) {
           if (!node) return false;
           if (!node->left && !node->right) return remaining == node->val;
           remaining -= node->val;
           return remainingDfs(node->left, remaining) ||
                  remainingDfs(node->right, remaining);
       }

       bool iterative(TreeNode* root, long long target) {
           if (!root) return false;
           std::stack<std::pair<TreeNode*, long long>> stack;
           stack.push({root, target});
           while (!stack.empty()) {
               auto [node, remaining] = stack.top();
               stack.pop();
               if (!node->left && !node->right && remaining == node->val)
                   return true;
               long long next = remaining - node->val;
               if (node->right) stack.push({node->right, next});
               if (node->left) stack.push({node->left, next});
           }
           return false;
       }

   public:
       bool hasPathSum(TreeNode* root, int targetSum) {
           return remainingDfs(root, static_cast<long long>(targetSum));
       }
   };

题解
----

为什么状态可以只保存剩余目标
~~~~~~~~~~~~~~~~~~~~~~~~~~

进入节点前，``remaining`` 表示从当前节点到某个叶节点仍需得到的总和。选择当前节点后，孩子状态统一为 ``remaining - node.val``。历史路径无需保存，因为后续判断只依赖当前节点和剩余值。

叶节点为何是唯一成功位置
~~~~~~~~~~~~~~~~~~~~~~~~

题目要求完整根到叶路径。内部节点即使当前累计和已经等于目标，也不能停止；后续至少还要经过一个孩子。只有左右孩子都为空时，``remaining == node.val`` 才表示完整路径精确命中。

.. list-table::
   :header-rows: 1

   * - 节点
     - 进入前剩余
     - 传给孩子
   * - 6
     - 12
     - 6
   * - 2
     - 6
     - 4
   * - 4（叶）
     - 4
     - 精确命中

为什么不能按剩余值正负剪枝
~~~~~~~~~~~~~~~~~~~~~~~~~~

节点值允许为负数。剩余值变成负数后，后续负节点仍可能使路径和正确；剩余值为零时，后续正负节点也可能抵消。因此除空节点和叶节点判断外，没有基于符号的安全剪枝。

前缀和与剩余目标如何等价
~~~~~~~~~~~~~~~~~~~~~~~~

前缀法维护 ``sum + node.val``，叶节点比较 ``sum == target``；剩余法维护 ``target - 已经过节点和``，叶节点比较 ``remaining == node.val``。两者只是同一等式移项，剩余法状态更紧凑。

显式栈保存什么
~~~~~~~~~~~~~~

每个栈元素是 ``(node, remaining_before_node)``。压入孩子前扣除当前节点值，使每条分支拥有独立数值状态。树没有回边，不需要访问集合。

短路为什么安全
~~~~~~~~~~~~~~

布尔目标只要求存在一条路径。左子树返回真后，全局答案已经确定，右子树无需访问；逻辑或短路不会漏掉“更优”方案，因为本题没有比较大小。

数值宽度
~~~~~~~~

平台节点值和目标为 32 位整数，路径累加可能跨越中间边界。C++ 主实现使用 ``long long``，避免累计过程溢出。

复杂度来源
~~~~~~~~~~

最坏访问全部 ``n`` 个节点，时间 ``O(n)``。递归或显式栈保存一条或多条尚未处理路径，最坏空间 ``O(h)``；短路命中时可提前结束。

九语言实现
----------

C
~

.. code-block:: c

   static bool dfs(struct TreeNode*x,long long remain){if(!x)return false;if(!x->left&&!x->right)return remain==x->val;remain-=x->val;return dfs(x->left,remain)||dfs(x->right,remain);}bool hasPathSum(struct TreeNode*root,int targetSum){return dfs(root,targetSum);}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def hasPathSum(self, root, targetSum: int) -> bool:
           if root is None: return False
           if root.left is None and root.right is None: return targetSum == root.val
           remaining = targetSum - root.val
           return self.hasPathSum(root.left, remaining) or self.hasPathSum(root.right, remaining)

Java
~~~~

.. code-block:: java

   class Solution {boolean dfs(TreeNode x,long remain){if(x==null)return false;if(x.left==null&&x.right==null)return remain==x.val;remain-=x.val;return dfs(x.left,remain)||dfs(x.right,remain);}public boolean hasPathSum(TreeNode root,int targetSum){return dfs(root,targetSum);}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn has_path_sum(root:Option<Rc<RefCell<TreeNode>>>,target_sum:i32)->bool{fn dfs(x:Option<Rc<RefCell<TreeNode>>>,remain:i64)->bool{let Some(x)=x else{return false};let b=x.borrow();if b.left.is_none()&&b.right.is_none(){return remain==b.val as i64}let next=remain-b.val as i64;dfs(b.left.clone(),next)||dfs(b.right.clone(),next)}dfs(root,target_sum as i64)}}

Go
~~

.. code-block:: go

   func hasPathSum(root *TreeNode,targetSum int)bool{var dfs func(*TreeNode,int64)bool;dfs=func(x *TreeNode,remain int64)bool{if x==nil{return false};if x.Left==nil&&x.Right==nil{return remain==int64(x.Val)};remain-=int64(x.Val);return dfs(x.Left,remain)||dfs(x.Right,remain)};return dfs(root,int64(targetSum))}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function hasPathSum(root:TreeNode|null,targetSum:number):boolean{if(!root)return false;if(!root.left&&!root.right)return targetSum===root.val;const remain=targetSum-root.val;return hasPathSum(root.left,remain)||hasPathSum(root.right,remain);}

C#
~~

.. code-block:: csharp

   public class Solution {bool Dfs(TreeNode x,long remain){if(x==null)return false;if(x.left==null&&x.right==null)return remain==x.val;remain-=x.val;return Dfs(x.left,remain)||Dfs(x.right,remain);}public bool HasPathSum(TreeNode root,int targetSum)=>Dfs(root,targetSum);}

Julia
~~~~~

.. code-block:: julia

   function has_path_sum(root,target)
       root===nothing&&return false
       root.left===nothing&&root.right===nothing&&return target==root.val
       remain=target-root.val
       has_path_sum(root.left,remain)||has_path_sum(root.right,remain)
   end

R
~

.. code-block:: r

   has_path_sum <- function(root,target){if(is.null(root))return(FALSE);if(is.null(root$left)&&is.null(root$right))return(target==root$val);remain<-target-root$val;has_path_sum(root$left,remain)||has_path_sum(root$right,remain)}
