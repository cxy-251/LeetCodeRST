0101. Symmetric Tree
====================

题目信息
--------

:题号: 0101
:难度: Easy
:主题: 二叉树、递归、广度优先搜索、镜像结构
:原题: `LeetCode 0101 <https://leetcode.com/problems/symmetric-tree/>`_
:重点: 镜像节点对、交叉孩子、空节点结构检查

题目重述
--------

给定二叉树根节点 ``root``，判断整棵树是否关于根节点的中心轴镜像对称。对于任意一对镜像位置，两个位置必须同时为空，或同时存在且节点值相等；若节点存在，左侧节点的左子树必须与右侧节点的右子树互为镜像，左侧节点的右子树必须与右侧节点的左子树互为镜像。

树中节点数在 ``1..1000`` 范围内，节点值在 ``-100..100`` 范围内。

自建示例
--------

.. code-block:: text

   输入：root = [10,4,4,null,7,7,null]
   输出：true
   解释：两个值为 4 的节点互为镜像；左侧 4 的右孩子 7 与右侧 4 的左孩子 7 也处于镜像位置。

.. code-block:: text

   输入：root = [10,4,4,2,null,2,null]
   输出：false
   解释：左侧节点 4 的左孩子是 2，其镜像位置应是右侧节点 4 的右孩子，但该位置为空。

C++ 实现
--------

.. code-block:: cpp

   #include <queue>
   #include <string>
   #include <utility>

   class Solution {
   private:
       void serializeMirror(TreeNode* node, bool reverse, std::string& output) {
           if (!node) { output += "#,"; return; }
           output += std::to_string(node->val) + ",";
           if (!reverse) {
               serializeMirror(node->left, false, output);
               serializeMirror(node->right, false, output);
           } else {
               serializeMirror(node->right, true, output);
               serializeMirror(node->left, true, output);
           }
       }

       bool recursivePairs(TreeNode* left, TreeNode* right) {
           if (!left || !right) return left == right;
           return left->val == right->val &&
                  recursivePairs(left->left, right->right) &&
                  recursivePairs(left->right, right->left);
       }

       bool iterativePairs(TreeNode* left, TreeNode* right) {
           std::queue<std::pair<TreeNode*,TreeNode*>> queue;
           queue.push({left,right});
           while (!queue.empty()) {
               auto [a,b] = queue.front(); queue.pop();
               if (!a || !b) {
                   if (a != b) return false;
                   continue;
               }
               if (a->val != b->val) return false;
               queue.push({a->left,b->right});
               queue.push({a->right,b->left});
           }
           return true;
       }

   public:
       bool isSymmetric(TreeNode* root) {
           return !root || recursivePairs(root->left, root->right);
       }
   };

题解
----

为什么同向比较不够
~~~~~~~~~~~~~~~~~~

第 100 题比较相同树时使用 ``left-left`` 与 ``right-right``。镜像关系需要交叉方向：外侧孩子 ``left.left`` 对 ``right.right``，内侧孩子 ``left.right`` 对 ``right.left``。只比较每层值集合会丢失孩子方向。

镜像状态保存什么
~~~~~~~~~~~~~~~~

``mirror(a,b)`` 表示以 ``a``、``b`` 为根的两棵子树是否互为镜像。它只有三类情况：

#. 两者都为空，当前位置匹配；
#. 只有一个为空，结构不匹配；
#. 两者都非空，根值相等，并递归比较两组交叉孩子。

.. code-block:: text

   mirror(a,b) =
       a.val == b.val
       AND mirror(a.left,  b.right)
       AND mirror(a.right, b.left)

空节点为何不能忽略
~~~~~~~~~~~~~~~~~~

空位置是树结构的一部分。反例中左侧 3 位于右孩子位置，其镜像位置应是右子树根的左孩子；该位置为空，因此在节点对 ``(3,null)`` 处立即失败。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 节点对
     - 比较
     - 后续
   * - ``(2,2)``
     - 值相等
     - 加入外侧与内侧节点对
   * - ``(3,3)``
     - 值相等
     - 两组空孩子匹配
   * - ``(4,4)``
     - 值相等
     - 两组空孩子匹配
   * - 队列耗尽
     - 未发现差异
     - 返回真

为什么递归完整且无重复
~~~~~~~~~~~~~~~~~~~~~~

根的左右子树只通过一个镜像节点对进入。每个非空节点在镜像位置上最多参与一次比较；任意结构差异最终会形成“一空一非空”的节点对，任意值差异会在对应根比较时暴露，因此不会遗漏。

序列化与队列方法的取舍
~~~~~~~~~~~~~~~~~~~~~~

可以按普通方向序列化左子树、按反向方向序列化右子树并比较，但必须保留空标记，且会创建 ``O(n)`` 字符串。队列方法保存显式节点对，避免递归深度；递归方法最直接对应镜像定义。

复杂度来源
~~~~~~~~~~

最坏访问全部 ``n`` 个节点，时间 ``O(n)``。递归栈深度 ``O(h)``；队列最多保存 ``O(w)`` 个镜像节点对，其中 ``h`` 为树高，``w`` 为最大层宽。发现首个差异时短路返回。

九语言实现
----------

C
~

.. code-block:: c

   bool mirror(struct TreeNode*a,struct TreeNode*b){if(!a||!b)return a==b;return a->val==b->val&&mirror(a->left,b->right)&&mirror(a->right,b->left);}bool isSymmetric(struct TreeNode*root){return !root||mirror(root->left,root->right);}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isSymmetric(self, root) -> bool:
           def mirror(a, b):
               if a is None or b is None: return a is b
               return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)
           return root is None or mirror(root.left, root.right)

Java
~~~~

.. code-block:: java

   class Solution {boolean mirror(TreeNode a,TreeNode b){if(a==null||b==null)return a==b;return a.val==b.val&&mirror(a.left,b.right)&&mirror(a.right,b.left);}public boolean isSymmetric(TreeNode root){return root==null||mirror(root.left,root.right);}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn is_symmetric(root:Option<Rc<RefCell<TreeNode>>>)->bool{fn mirror(a:Option<Rc<RefCell<TreeNode>>>,b:Option<Rc<RefCell<TreeNode>>>)->bool{match(a,b){(None,None)=>true,(Some(x),Some(y))=>{let xb=x.borrow();let yb=y.borrow();xb.val==yb.val&&mirror(xb.left.clone(),yb.right.clone())&&mirror(xb.right.clone(),yb.left.clone())},_=>false}}match root{None=>true,Some(r)=>{let b=r.borrow();mirror(b.left.clone(),b.right.clone())}}}}

Go
~~

.. code-block:: go

   func isSymmetric(root *TreeNode)bool{var mirror func(*TreeNode,*TreeNode)bool;mirror=func(a,b *TreeNode)bool{if a==nil||b==nil{return a==b};return a.Val==b.Val&&mirror(a.Left,b.Right)&&mirror(a.Right,b.Left)};return root==nil||mirror(root.Left,root.Right)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isSymmetric(root:TreeNode|null):boolean{const mirror=(a:TreeNode|null,b:TreeNode|null):boolean=>{if(!a||!b)return a===b;return a.val===b.val&&mirror(a.left,b.right)&&mirror(a.right,b.left);};return !root||mirror(root.left,root.right);}

C#
~~

.. code-block:: csharp

   public class Solution {bool Mirror(TreeNode a,TreeNode b){if(a==null||b==null)return a==b;return a.val==b.val&&Mirror(a.left,b.right)&&Mirror(a.right,b.left);}public bool IsSymmetric(TreeNode root)=>root==null||Mirror(root.left,root.right);}

Julia
~~~~~

.. code-block:: julia

   function is_symmetric(root)
       mirror(a,b)=(a===nothing||b===nothing) ? a===b : a.val==b.val&&mirror(a.left,b.right)&&mirror(a.right,b.left)
       root===nothing||mirror(root.left,root.right)
   end

R
~

.. code-block:: r

   is_symmetric <- function(root){mirror<-function(a,b){if(is.null(a)||is.null(b))return(is.null(a)&&is.null(b));a$val==b$val&&mirror(a$left,b$right)&&mirror(a$right,b$left)};is.null(root)||mirror(root$left,root$right)}