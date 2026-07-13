0112. Path Sum
==============

题目信息
--------

:题号: 0112
:难度: Easy
:主题: 二叉树、DFS、路径和
:原题: `LeetCode 0112 <https://leetcode.com/problems/path-sum/>`_
:访问状态: Available
:教学重点: 剩余目标沿根到叶递减

题目重述
--------

判断是否存在一条根到叶路径，其节点值之和等于目标。

自建示例
--------

.. code-block:: text

   输入：root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
   输出：true

问题抽象
--------

进入节点时从目标中减去节点值；到叶子时检查剩余值是否等于叶子值。

主解法：递归剩余和
-----------

思路
~~~~

递归剩余和。 剩余目标沿根到叶递减

核心状态与不变量
~~~~~~~~~~~~~~~~

进入节点时从目标中减去节点值；到叶子时检查剩余值是否等于叶子值。

正确性依据
~~~~~~~~~~

每次递归参数等于原目标减去路径上已处理节点和。到叶子时相等条件恰好等价于完整路径和为目标；左右分支逻辑或覆盖所有根到叶路径。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；递归栈 ``O(h)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   bool hasPathSum(struct TreeNode *root, int targetSum) {
       if (root == NULL) return false;
       if (!root->left && !root->right) return targetSum == root->val;
       return hasPathSum(root->left, targetSum-root->val) || hasPathSum(root->right,
           targetSum-root->val);
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public: bool hasPathSum(TreeNode* root,int target) {
           if(!root) return false;
           if(!root->left&&!root->right) return target==root->val;
           return hasPathSum(root->left,target-root->val)||hasPathSum(root->right,target-root->val);
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
           if root is None:
               return False
           if root.left is None and root.right is None:
               return targetSum == root.val
           rest = targetSum - root.val
           return self.hasPathSum(root.left, rest) or self.hasPathSum(root.right, rest)
Java
~~~~

.. code-block:: java

   class Solution {
       public boolean hasPathSum(TreeNode root,int target) {
           if(root==null) return false;
           if(root.left==null&&root.right==null) return target==root.val;
           return hasPathSum(root.left,target-root.val)||hasPathSum(root.right,target-root.val);
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;
   impl Solution {
       pub fn has_path_sum(root:Option<Rc<RefCell<TreeNode>>>, target:i32)->bool {
           let Some(node)=root else {
               return false
           };
           let node=node.borrow();
           if node.left.is_none()&&node.right.is_none() {
               return target==node.val;
           }
           Self::has_path_sum(node.left.clone(), target - node.val) ||
               Self::has_path_sum(node.right.clone(), target - node.val)
       }
   }
Go
~~

.. code-block:: go

   func hasPathSum(root *TreeNode, target int) bool {
   	if root == nil {
   		return false
   	}
   	if root.Left == nil && root.Right == nil {
   		return target == root.Val
   	}
   	return hasPathSum(root.Left, target-root.Val) || hasPathSum(root.Right, target-root.Val)
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function hasPathSum(root: TreeNode | null, target: number): boolean {
       if (root === null)
           return false;
       if (root.left === null && root.right === null)
           return target === root.val;
       return hasPathSum(root.left, target - root.val) || hasPathSum(root.right, target -
           root.val);
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public bool HasPathSum(TreeNode root,int target) {
           if(root==null)return false;
           if(root.left==null&&root.right==null)return target==root.val;
           return HasPathSum(root.left,target-root.val)||HasPathSum(root.right,target-root.val);
       }
   }
Julia
~~~~~

.. code-block:: julia

   has_path_sum(root::Nothing,target::Int)=false
   function has_path_sum(root::TreeNode,target::Int)::Bool
       root.left===nothing && root.right===nothing && return target==root.val
       has_path_sum(root.left,target-root.val)||has_path_sum(root.right,target-root.val)
   end
R
~

.. code-block:: r

   has_path_sum <- function(root,target) {
       if(is.null(root))return(FALSE)
       if(is.null(root$left)&&is.null(root$right))return(target==root$val)
       has_path_sum(root$left,target-root$val)||has_path_sum(root$right,target-root$val)
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空树无路径。
* 必须到叶子，不能在内部节点提前成功。

易错点
------

* 只要前缀和等于目标就返回真。
* 负数节点使基于大小的剪枝无效。

本题新增知识
------------

* 剩余目标沿根到叶递减
* 题号 0112 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0113. Path Sum II <0113-path-sum-ii.rst>`_；
* `0129. Sum Root to Leaf Numbers <0129-sum-root-to-leaf-numbers.rst>`_；

最小自检
--------

#. ``递归剩余和`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

每次递归参数等于原目标减去路径上已处理节点和。到叶子时相等条件恰好等价于完整路径和为目标；左右分支逻辑或覆盖所有根到叶路径。
