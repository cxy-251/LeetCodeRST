0100. Same Tree
===============

题目信息
--------

:题号: 0100
:难度: Easy
:主题: 二叉树、递归、结构比较、成对遍历
:原题: `LeetCode 0100 <https://leetcode.com/problems/same-tree/>`_
:重点: 对应位置、空节点结构、节点值相等、左右方向一致

题目重述
--------

给定两棵二叉树 ``p`` 和 ``q``，判断它们是否完全相同。完全相同要求每个对应位置同时为空或同时存在，并且所有对应非空节点的值相等；左右孩子方向也必须一致。

两棵树的节点数都在 ``0..100`` 范围内，节点值在 ``-10^4..10^4`` 范围内。

自建示例
--------

.. code-block:: text

   输入：
   p（层序）= [7,3,9,null,5]
   q（层序）= [7,3,9,5]

   输出：false

两棵树包含相同的节点值，但值 5 在 ``p`` 中是节点 3 的右孩子，在 ``q`` 中是左孩子，结构不同。

.. code-block:: text

   输入：
   p（层序）= [4,2,6]
   q（层序）= [4,2,6]

   输出：true

每个对应位置的结构和节点值都相同。

C++ 实现
--------

.. code-block:: cpp

   #include <queue>
   #include <string>

   class Solution {
   private:
       void serialize(TreeNode* node, std::string& output) {
           if (!node) { output += "#,"; return; }
           output += std::to_string(node->val) + ",";
           serialize(node->left, output);
           serialize(node->right, output);
       }

       bool recursivePair(TreeNode* first, TreeNode* second) {
           if (!first || !second) return first == second;
           return first->val == second->val &&
                  recursivePair(first->left, second->left) &&
                  recursivePair(first->right, second->right);
       }

       bool iterativePairs(TreeNode* first, TreeNode* second) {
           std::queue<std::pair<TreeNode*,TreeNode*>> queue;
           queue.push({first,second});
           while (!queue.empty()) {
               auto [a,b] = queue.front(); queue.pop();
               if (!a || !b) {
                   if (a != b) return false;
                   continue;
               }
               if (a->val != b->val) return false;
               queue.push({a->left,b->left});
               queue.push({a->right,b->right});
           }
           return true;
       }

   public:
       bool isSameTree(TreeNode* p, TreeNode* q) {
           return recursivePair(p,q);
       }
   };

题解
----

为什么只比较遍历值不够
~~~~~~~~~~~~~~~~~~~~

若序列化或遍历忽略空节点位置，不同结构可能产生相同值序列。例如一个节点是左孩子，另一个是右孩子时，简单前序值都可能是 ``1,2``。结构比较必须保留每个空位置，或直接成对比较对应节点。

成对递归状态保存什么
~~~~~~~~~~~~~~~~~~~~

``same(first,second)`` 只回答一个问题：以这两个对应位置为根的子树是否完全相同。每次调用有三个分支：

#. 两者都为空：当前位置相同，返回真；
#. 只有一个为空：结构不同，返回假；
#. 两者都非空：值必须相同，并继续比较左右同方向孩子。

.. code-block:: text

   same(a,b) =
       a.val == b.val
       AND same(a.left,  b.left)
       AND same(a.right, b.right)

为什么不能交叉比较孩子
~~~~~~~~~~~~~~~~~~~~~~

本题要求相同结构，不是镜像结构。左孩子必须对应左孩子，右孩子必须对应右孩子。交叉比较 ``a.left`` 与 ``b.right`` 会把第 101 题的镜像条件误用到本题。

空节点基例如何检查结构
~~~~~~~~~~~~~~~~~~~~~~

空节点不是可以忽略的“无数据”，而是树形的一部分。``first==nullptr`` 与 ``second==nullptr`` 必须成对判断；当一个为空、另一个非空时，即使其他节点值全部相同，也已经发现结构差异。

状态演化
~~~~~~~~

对反例：

.. list-table::
   :header-rows: 1

   * - 节点对
     - 判断
     - 结果
   * - ``(1,1)``
     - 值相同
     - 继续左右孩子
   * - ``(null,2)``
     - 只有一侧为空
     - 立即返回假
   * - 右孩子对
     - 不再访问
     - 布尔短路

为什么递归完整且无重复
~~~~~~~~~~~~~~~~~~~~~~

根节点对只比较一次，随后把问题拆为左右两个互不重叠的对应子树对。每个位置沿唯一父子路径到达，因此每个对应节点对最多访问一次；任意值差异会在非空根比较时暴露，任意结构差异会在空节点不对称时暴露。

序列化方法的条件
~~~~~~~~~~~~~~~~

可以分别前序序列化两棵树并比较字符串，但必须写入空标记和分隔符，避免结构丢失和多位数拼接歧义。它额外创建 ``O(n)`` 中间字符串；成对递归发现差异后可立即停止。

显式队列为何等价
~~~~~~~~~~~~~~~~

队列保存尚未比较的节点对。弹出后执行同样的三类空节点判断和值判断，再把左右同方向孩子对入队。它避免调用栈，但最宽一层可能保存 ``O(n)`` 对节点。

复杂度来源
~~~~~~~~~~

最坏两棵树完全相同，需要比较全部 ``n`` 个对应节点，时间 ``O(n)``。递归栈深度 ``O(h)``，``h`` 为较深树高度；队列最坏 ``O(n)``；序列化使用 ``O(n)`` 中间空间。发现首个差异时会短路提前结束。

九语言实现
----------

C
~

.. code-block:: c

   bool isSameTree(struct TreeNode*p,struct TreeNode*q){if(!p||!q)return p==q;return p->val==q->val&&isSameTree(p->left,q->left)&&isSameTree(p->right,q->right);}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isSameTree(self, p, q) -> bool:
           if p is None or q is None: return p is q
           return p.val == q.val and self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)

Java
~~~~

.. code-block:: java

   class Solution {public boolean isSameTree(TreeNode p,TreeNode q){if(p==null||q==null)return p==q;return p.val==q.val&&isSameTree(p.left,q.left)&&isSameTree(p.right,q.right);}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn is_same_tree(p:Option<Rc<RefCell<TreeNode>>>,q:Option<Rc<RefCell<TreeNode>>>)->bool{match(p,q){(None,None)=>true,(Some(a),Some(b))=>{let(x,y)=(a.borrow(),b.borrow());x.val==y.val&&Self::is_same_tree(x.left.clone(),y.left.clone())&&Self::is_same_tree(x.right.clone(),y.right.clone())},_=>false}}}

Go
~~

.. code-block:: go

   func isSameTree(p,q *TreeNode)bool{if p==nil||q==nil{return p==q};return p.Val==q.Val&&isSameTree(p.Left,q.Left)&&isSameTree(p.Right,q.Right)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isSameTree(p:TreeNode|null,q:TreeNode|null):boolean{if(!p||!q)return p===q;return p.val===q.val&&isSameTree(p.left,q.left)&&isSameTree(p.right,q.right);}

C#
~~

.. code-block:: csharp

   public class Solution {public bool IsSameTree(TreeNode p,TreeNode q){if(p==null||q==null)return p==q;return p.val==q.val&&IsSameTree(p.left,q.left)&&IsSameTree(p.right,q.right);}}

Julia
~~~~~

.. code-block:: julia

   function is_same_tree(p,q)
       (p===nothing||q===nothing)&&return p===q
       p.val==q.val&&is_same_tree(p.left,q.left)&&is_same_tree(p.right,q.right)
   end

R
~

.. code-block:: r

   is_same_tree <- function(p,q){if(is.null(p)||is.null(q))return(is.null(p)&&is.null(q));p$val==q$val&&is_same_tree(p$left,q$left)&&is_same_tree(p$right,q$right)}
