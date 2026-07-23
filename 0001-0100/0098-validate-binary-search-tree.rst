0098. Validate Binary Search Tree
=================================

题目信息
--------

:题号: 0098
:难度: Medium
:主题: 二叉搜索树、中序遍历、递归边界、显式栈
:原题: `LeetCode 0098 <https://leetcode.com/problems/validate-binary-search-tree/>`_
:重点: 全局严格大小关系、重复值非法、祖先边界、中序严格递增

题目重述
--------

给定二叉树根节点 ``root``，判断它是否为合法二叉搜索树。任意节点左子树中的所有值都必须严格小于该节点值，右子树中的所有值都必须严格大于该节点值；重复值不合法。

树的节点数在 ``1..10^4`` 范围内，节点值处于 32 位有符号整数范围内。

自建示例
--------

.. code-block:: text

   输入（层序）：[8,3,10,null,null,6,12]
   输出：false

值 6 位于根节点 8 的右子树，却小于 8；仅检查它与直接父节点 10 的关系会漏掉这个全局错误。

.. code-block:: text

   输入（层序）：[8,3,10,1,6,9,12]
   输出：true

每个节点都满足来自所有祖先的严格上下界。

C++ 实现
--------

.. code-block:: cpp

   #include <climits>
   #include <vector>

   class Solution {
   private:
       bool parentChildOnly(TreeNode* node) {
           if (!node) return true;
           if (node->left && node->left->val >= node->val) return false;
           if (node->right && node->right->val <= node->val) return false;
           return parentChildOnly(node->left) && parentChildOnly(node->right);
       }

       bool rangeDfs(TreeNode* node, long long lower, long long upper) {
           if (!node) return true;
           if (node->val <= lower || node->val >= upper) return false;
           return rangeDfs(node->left, lower, node->val) &&
                  rangeDfs(node->right, node->val, upper);
       }

       bool inorderStack(TreeNode* root) {
           std::vector<TreeNode*> stack;
           TreeNode* previous = nullptr;
           while (root || !stack.empty()) {
               while (root) { stack.push_back(root); root = root->left; }
               root = stack.back(); stack.pop_back();
               if (previous && root->val <= previous->val) return false;
               previous = root;
               root = root->right;
           }
           return true;
       }

   public:
       bool isValidBST(TreeNode* root) {
           return inorderStack(root);
       }
   };

题解
----

父子比较为什么不足
~~~~~~~~~~~~~~~~

BST 条件约束整棵子树，不只是直接孩子。右子树中的所有后代都必须大于祖先根，左子树中的所有后代都必须小于祖先根。局部父子检查没有保存祖先边界，因此会把示例中的节点 3 误判为合法。

开区间递归如何传播全局约束
~~~~~~~~~~~~~~~~~~~~~~~~

递归状态 ``validate(node,lower,upper)`` 要求当前值严格位于开区间 ``(lower,upper)``：

* 进入左子树时，上界收紧为当前值；
* 进入右子树时，下界提升为当前值；
* 祖先产生的另一侧边界继续保留。

使用严格不等式会自然拒绝重复值。

中序遍历为何等价
~~~~~~~~~~~~~~~~

合法 BST 的中序顺序是严格递增序列，因为左子树全部更小、根位于中间、右子树全部更大。反过来，若整棵树的中序序列严格递增，则任意节点之前的左子树值都更小，之后的右子树值都更大，因此全局 BST 条件成立。

前驱状态保存什么
~~~~~~~~~~~~~~~~

显式栈按中序顺序逐个访问节点，``previous`` 保存直接中序前驱。若 ``current.val <= previous.val``，序列出现下降或重复，可立即失败。只检查相邻项足够，因为任意非严格递增序列必存在一对相邻违规元素。

状态演化
~~~~~~~~

示例中序序列为 ``1,5,3,4,6``：

.. list-table::
   :header-rows: 1

   * - 当前值
     - 前驱
     - 结果
   * - 1
     - 无
     - 建立前驱
   * - 5
     - 1
     - 递增
   * - 3
     - 5
     - ``3 <= 5``，立即失败

为什么不用数值哨兵
~~~~~~~~~~~~~~~~~~

若把前驱初始化为 ``INT_MIN``，首个真实节点也可能等于 ``INT_MIN``，第一次比较会错误失败。主实现用空节点指针表示“尚无前驱”；范围递归则用 64 位边界包围全部 32 位节点值。

为什么检测完整
~~~~~~~~~~~~~~

每个节点按中序访问一次。任何跨层违规都会破坏全局中序严格递增性，并在某个相邻位置暴露；重复值同样触发 ``<=``。若扫描完成未发现违规，全部对应约束都成立。

复杂度来源
~~~~~~~~~~

三种完整方法都访问每个节点一次，时间 ``O(n)``。递归边界法和显式栈法使用 ``O(h)`` 空间，``h`` 为树高；退化树最坏 ``O(n)``。

九语言实现
----------

C
~

.. code-block:: c

   bool isValidBST(struct TreeNode*root){struct TreeNode**st=malloc(10001*sizeof(*st)),*prev=NULL;int top=0;while(root||top){while(root){st[top++]=root;root=root->left;}root=st[--top];if(prev&&root->val<=prev->val){free(st);return false;}prev=root;root=root->right;}free(st);return true;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isValidBST(self, root) -> bool:
           stack=[];previous=None
           while root or stack:
               while root:stack.append(root);root=root.left
               root=stack.pop()
               if previous is not None and root.val<=previous:return False
               previous=root.val;root=root.right
           return True

Java
~~~~

.. code-block:: java

   class Solution {public boolean isValidBST(TreeNode root){Deque<TreeNode>s=new ArrayDeque<>();TreeNode prev=null;while(root!=null||!s.isEmpty()){while(root!=null){s.push(root);root=root.left;}root=s.pop();if(prev!=null&&root.val<=prev.val)return false;prev=root;root=root.right;}return true;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn is_valid_bst(root:Option<Rc<RefCell<TreeNode>>>)->bool{let mut stack=vec![];let mut cur=root;let mut prev=None;while cur.is_some()||!stack.is_empty(){while let Some(node)=cur{cur=node.borrow().left.clone();stack.push(node);}let node=stack.pop().unwrap();let value=node.borrow().val;if prev.is_some_and(|x|value<=x){return false}prev=Some(value);cur=node.borrow().right.clone();}true}}

Go
~~

.. code-block:: go

   func isValidBST(root *TreeNode)bool{stack:=[]*TreeNode{};var prev *TreeNode;for root!=nil||len(stack)>0{for root!=nil{stack=append(stack,root);root=root.Left};root=stack[len(stack)-1];stack=stack[:len(stack)-1];if prev!=nil&&root.Val<=prev.Val{return false};prev=root;root=root.Right};return true}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isValidBST(root:TreeNode|null):boolean{const stack:TreeNode[]=[];let previous:number|undefined;while(root||stack.length){while(root){stack.push(root);root=root.left;}root=stack.pop()!;if(previous!==undefined&&root.val<=previous)return false;previous=root.val;root=root.right;}return true;}

C#
~~

.. code-block:: csharp

   public class Solution {public bool IsValidBST(TreeNode root){var s=new Stack<TreeNode>();TreeNode prev=null;while(root!=null||s.Count>0){while(root!=null){s.Push(root);root=root.left;}root=s.Pop();if(prev!=null&&root.val<=prev.val)return false;prev=root;root=root.right;}return true;}}

Julia
~~~~~

.. code-block:: julia

   function is_valid_bst(root)
       stack=Any[];previous=nothing
       while root!==nothing||!isempty(stack)
           while root!==nothing;push!(stack,root);root=root.left;end
           root=pop!(stack);previous!==nothing&&root.val<=previous&&return false;previous=root.val;root=root.right
       end
       true
   end

R
~

.. code-block:: r

   is_valid_bst <- function(root){stack<-list();previous<-NULL;while(!is.null(root)||length(stack)>0L){while(!is.null(root)){stack[[length(stack)+1L]]<-root;root<-root$left};root<-stack[[length(stack)]];stack<-head(stack,-1L);if(!is.null(previous)&&root$val<=previous)return(FALSE);previous<-root$val;root<-root$right};TRUE}
