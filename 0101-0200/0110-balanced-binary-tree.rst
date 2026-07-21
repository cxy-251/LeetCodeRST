0110. Balanced Binary Tree
==========================

题目信息
--------

:题号: 0110
:难度: Easy
:主题: 二叉树、后序遍历、树高、提前失败
:原题: `LeetCode 0110 <https://leetcode.com/problems/balanced-binary-tree/>`_
:教学重点: 全树条件、后序高度、失败哨兵、短路传播

题目重述
--------

给定二叉树，判断它是否高度平衡。对树中每个节点，其左右子树高度差都必须不超过 1；不能只检查根节点。空树平衡，输入树只读。

自建示例
--------

.. code-block:: text

          3
        /   \
       9    20
           /  \
          15   7
   -> true

.. code-block:: text

              1
            /   \
           2     3
          /       \
         4         5
        /
       6

根的左右高度可能接近，但左子树内部节点已经失衡，必须返回 false。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <cmath>

   class Solution {
   private:
       int height(TreeNode* node) {
           if (!node) return 0;
           return 1 + std::max(height(node->left),height(node->right));
       }

       bool topDown(TreeNode* node) {
           if (!node) return true;
           return std::abs(height(node->left)-height(node->right)) <= 1 &&
                  topDown(node->left) && topDown(node->right);
       }

       int heightOrFailure(TreeNode* node) {
           if (!node) return 0;
           int left = heightOrFailure(node->left);
           if (left == -1) return -1;
           int right = heightOrFailure(node->right);
           if (right == -1) return -1;
           if (std::abs(left-right) > 1) return -1;
           return 1 + std::max(left,right);
       }

   public:
       bool isBalanced(TreeNode* root) {
           return heightOrFailure(root) != -1;
       }
   };

题解
----

为什么只检查根节点不够
~~~~~~~~~~~~~~~~~~~~

平衡是对每个节点的全树条件。根的左右高度差可能不超过 1，但某个深层子树内部已经失衡；因此必须遍历全部相关节点并检查各自左右高度。

自顶向下方法重复了什么
~~~~~~~~~~~~~~~~~~~~

直接在每个节点调用 ``height`` 求左右高度，再递归检查孩子，会反复计算同一子树高度。退化树中，根扫描 ``n`` 个节点，下一层又扫描 ``n-1`` 个，最坏 ``O(n²)``。

失败哨兵如何合并两个结果
~~~~~~~~~~~~~~~~~~~~~~~~

后序状态返回：

* 非负整数：当前子树平衡，并给出真实高度；
* ``-1``：当前子树或其后代已经失衡。

父节点先读取左右结果。任一侧为 ``-1`` 立即传播；否则检查高度差，合法时返回 ``1+max(left,right)``。

.. list-table::
   :header-rows: 1

   * - 节点
     - 左结果
     - 右结果
     - 返回
   * - 6
     - 0
     - 0
     - 1
   * - 4
     - 1
     - 0
     - 2
   * - 2
     - 2
     - 0
     - ``-1``
   * - 1
     - ``-1``
     - 未必继续计算
     - ``-1``

为什么后序遍历只计算一次
~~~~~~~~~~~~~~~~~~~~~~~~

节点高度依赖左右子树高度，所以在孩子完成后计算当前节点。每个节点只进入一个递归状态并向父节点返回一次高度或失败，不再单独调用高度函数。

为什么哨兵不会与合法高度冲突
~~~~~~~~~~~~~~~~~~~~~~~~~~

空树高度为 0，非空树高度至少为 1，所有合法高度都非负，因此 ``-1`` 可无歧义表示失败。该哨兵同时携带“是否平衡”和“若平衡则高度”两项信息。

为什么短路安全
~~~~~~~~~~~~~~

一旦某个后代失衡，包含它的任何祖先子树都不可能满足“每个节点平衡”的条件。祖先无需继续计算另一侧高度即可确定失败，提前返回不会遗漏可能恢复平衡的情况。

复杂度来源
~~~~~~~~~~

主解法每个节点访问一次，时间 ``O(n)``，递归栈 ``O(h)``。自顶向下基准最坏 ``O(n²)``。输入树不被修改。

九语言实现
----------

C
~

.. code-block:: c

   static int check(struct TreeNode*x){if(!x)return 0;int a=check(x->left);if(a<0)return -1;int b=check(x->right);if(b<0)return -1;if(a-b>1||b-a>1)return -1;return 1+(a>b?a:b);}bool isBalanced(struct TreeNode*root){return check(root)>=0;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isBalanced(self, root) -> bool:
           def check(node):
               if node is None: return 0
               left = check(node.left)
               if left < 0: return -1
               right = check(node.right)
               if right < 0 or abs(left-right) > 1: return -1
               return 1 + max(left,right)
           return check(root) >= 0

Java
~~~~

.. code-block:: java

   class Solution {int check(TreeNode x){if(x==null)return 0;int a=check(x.left);if(a<0)return -1;int b=check(x.right);if(b<0||Math.abs(a-b)>1)return -1;return 1+Math.max(a,b);}public boolean isBalanced(TreeNode root){return check(root)>=0;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn is_balanced(root:Option<Rc<RefCell<TreeNode>>>)->bool{fn check(x:Option<Rc<RefCell<TreeNode>>>)->i32{match x{None=>0,Some(n)=>{let b=n.borrow();let a=check(b.left.clone());if a<0{return -1}let c=check(b.right.clone());if c<0||(a-c).abs()>1{-1}else{1+a.max(c)}}}}check(root)>=0}}

Go
~~

.. code-block:: go

   func isBalanced(root *TreeNode)bool{var check func(*TreeNode)int;check=func(x *TreeNode)int{if x==nil{return 0};a:=check(x.Left);if a<0{return -1};b:=check(x.Right);if b<0||a-b>1||b-a>1{return -1};if a>b{return a+1};return b+1};return check(root)>=0}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isBalanced(root:TreeNode|null):boolean{const check=(x:TreeNode|null):number=>{if(!x)return 0;const a=check(x.left);if(a<0)return-1;const b=check(x.right);return b<0||Math.abs(a-b)>1?-1:1+Math.max(a,b);};return check(root)>=0;}

C#
~~

.. code-block:: csharp

   public class Solution {int Check(TreeNode x){if(x==null)return 0;int a=Check(x.left);if(a<0)return-1;int b=Check(x.right);return b<0||Math.Abs(a-b)>1?-1:1+Math.Max(a,b);}public bool IsBalanced(TreeNode root)=>Check(root)>=0;}

Julia
~~~~~

.. code-block:: julia

   function is_balanced(root)
       function check(x);x===nothing&&return 0;a=check(x.left);a<0&&return -1;b=check(x.right);b<0||abs(a-b)>1 ? -1 : 1+max(a,b);end
       check(root)>=0
   end

R
~

.. code-block:: r

   is_balanced <- function(root){check<-function(x){if(is.null(x))return(0L);a<-check(x$left);if(a<0L)return(-1L);b<-check(x$right);if(b<0L||abs(a-b)>1L)return(-1L);1L+max(a,b)};check(root)>=0L}
