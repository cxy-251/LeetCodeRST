0105. Construct Binary Tree from Preorder and Inorder Traversal
===============================================================

题目信息
--------

:题号: 0105
:难度: Medium
:主题: 二叉树、分治、前序遍历、中序遍历、哈希表
:原题: `LeetCode 0105 <https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/>`_
:重点: 前序确定根、中序划分左右子树、节点值互异

题目重述
--------

给定整数数组 ``preorder`` 和 ``inorder``，它们分别是一棵二叉树的前序遍历和中序遍历结果。请构造并返回这棵二叉树。两个数组长度相同、包含完全相同的节点值，所有节点值互不相同，并且输入保证来自同一棵有效二叉树，因此重建结果唯一。

数组长度在 ``1..3000`` 范围内，节点值在 ``-3000..3000`` 范围内。

自建示例
--------

.. code-block:: text

   输入：preorder = [8,4,2,6,12,10]
         inorder  = [2,4,6,8,10,12]
   输出（层序）：[8,4,12,2,6,10]
   解释：前序首元素 8 是根；8 在中序序列中把左侧 [2,4,6] 和右侧 [10,12] 分开，继续递归即可得到整棵树。

.. code-block:: text

   输入：preorder = [5,4,3]
         inorder  = [3,4,5]
   输出（层序）：[5,4,null,3]
   解释：每个根在中序序列中都位于当前区间最右侧，因此所有节点依次成为左孩子。

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       TreeNode* slicing(const std::vector<int>& preorder,
                         const std::vector<int>& inorder) {
           if (preorder.empty()) return nullptr;
           int root_value = preorder[0], split = 0;
           while (inorder[split] != root_value) ++split;
           std::vector<int> left_pre(preorder.begin()+1,preorder.begin()+1+split);
           std::vector<int> right_pre(preorder.begin()+1+split,preorder.end());
           std::vector<int> left_in(inorder.begin(),inorder.begin()+split);
           std::vector<int> right_in(inorder.begin()+split+1,inorder.end());
           return new TreeNode(root_value,slicing(left_pre,left_in),slicing(right_pre,right_in));
       }

       TreeNode* indexedRanges(const std::vector<int>& preorder, int pre_left,
                               int pre_right, int in_left, int in_right,
                               const std::unordered_map<int,int>& position) {
           if (pre_left > pre_right) return nullptr;
           int root_value = preorder[pre_left];
           int split = position.at(root_value);
           int left_size = split - in_left;
           TreeNode* root = new TreeNode(root_value);
           root->left = indexedRanges(preorder,pre_left+1,pre_left+left_size,
                                      in_left,split-1,position);
           root->right = indexedRanges(preorder,pre_left+left_size+1,pre_right,
                                       split+1,in_right,position);
           return root;
       }

       TreeNode* cursorBuild(const std::vector<int>& preorder, int& cursor,
                             int in_left, int in_right,
                             const std::unordered_map<int,int>& position) {
           if (in_left > in_right) return nullptr;
           int root_value = preorder[cursor++];
           int split = position.at(root_value);
           TreeNode* root = new TreeNode(root_value);
           root->left = cursorBuild(preorder,cursor,in_left,split-1,position);
           root->right = cursorBuild(preorder,cursor,split+1,in_right,position);
           return root;
       }

   public:
       TreeNode* buildTree(std::vector<int>& preorder, std::vector<int>& inorder) {
           std::unordered_map<int,int> position;
           for (int i = 0; i < static_cast<int>(inorder.size()); ++i)
               position[inorder[i]] = i;
           int cursor = 0;
           return cursorBuild(preorder,cursor,0,inorder.size()-1,position);
       }
   };

题解
----

前序和中序分别提供什么
~~~~~~~~~~~~~~~~~~~~

当前子树的前序首元素一定是根。根在中序区间中的唯一位置把节点集合划分为左子树值域和右子树值域。值互异使该位置唯一，从而树可以唯一重建。

为什么需要根位置哈希表
~~~~~~~~~~~~~~~~~~~~

若每个递归状态都在线性扫描中序数组找根，退化树最坏 ``O(n²)``。预先建立 ``value -> inorder index``，每次划分降为 ``O(1)`` 查询。

全局前序游标如何工作
~~~~~~~~~~~~~~~~~~~~

``cursor`` 指向尚未构造的下一个前序元素。进入非空中序区间时，该元素就是当前根；读取后递增游标。由于前序顺序是根、左、右，必须先递归构造左区间，再构造右区间。

.. list-table::
   :header-rows: 1

   * - 中序区间
     - 读取前序根
     - 划分
   * - ``[0,5]``
     - 8
     - 左 ``[0,2]``，右 ``[4,5]``
   * - ``[0,2]``
     - 4
     - 左 ``[0,0]``，右 ``[2,2]``
   * - ``[4,5]``
     - 12
     - 左 ``[4,4]``，右为空
   * - 单元素区间
     - 2、6、10
     - 叶节点

为什么不能先构造右子树
~~~~~~~~~~~~~~~~~~~~~~

读取根后，前序游标紧接着位于左子树的首元素。若先递归右区间，会把左子树节点错误地作为右根；
因此必须遵守前序的“根、左、右”消费顺序。

区间方法与游标方法的关系
~~~~~~~~~~~~~~~~~~~~~~~~

显式区间方法同时维护前序和中序边界，并用左子树长度计算右侧前序起点；游标方法让递归调用自然消费连续前序片段，只保留中序边界，状态更少。

为什么构造完整且唯一
~~~~~~~~~~~~~~~~~~~~

任意非空子树的根由前序首元素唯一确定，中序位置唯一决定左右节点集合。按区间长度归纳，算法分别重建唯一左右子树并挂接，因此得到唯一原树；每个前序元素只消费一次，不重不漏。

复杂度来源
~~~~~~~~~~

建立索引和构造树均为 ``O(n)``，哈希表使用 ``O(n)``，递归栈 ``O(h)``。返回树本身包含 ``n`` 个新节点。切片方法还会重复复制数组，最坏额外达到平方级工作。

九语言实现
----------

C
~

.. code-block:: c

   static struct TreeNode*build(int*pre,int*cursor,int l,int r,int*pos){if(l>r)return NULL;int v=pre[(*cursor)++],m=pos[v+3000];struct TreeNode*x=malloc(sizeof(*x));x->val=v;x->left=build(pre,cursor,l,m-1,pos);x->right=build(pre,cursor,m+1,r,pos);return x;}struct TreeNode*buildTree(int*pre,int n,int*in,int inN){int*pos=malloc(6001*sizeof(int));for(int i=0;i<n;i++)pos[in[i]+3000]=i;int cursor=0;struct TreeNode*root=build(pre,&cursor,0,n-1,pos);free(pos);return root;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def buildTree(self, preorder, inorder):
           position = {value:index for index,value in enumerate(inorder)}; cursor = 0
           def build(left, right):
               nonlocal cursor
               if left > right: return None
               value = preorder[cursor]; cursor += 1; split = position[value]
               root = TreeNode(value); root.left = build(left, split-1); root.right = build(split+1, right)
               return root
           return build(0, len(inorder)-1)

Java
~~~~

.. code-block:: java

   class Solution {int cursor;int[]pre;Map<Integer,Integer>pos=new HashMap<>();TreeNode build(int l,int r){if(l>r)return null;int v=pre[cursor++],m=pos.get(v);TreeNode x=new TreeNode(v);x.left=build(l,m-1);x.right=build(m+1,r);return x;}public TreeNode buildTree(int[]preorder,int[]inorder){pre=preorder;for(int i=0;i<inorder.length;i++)pos.put(inorder[i],i);return build(0,inorder.length-1);}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn build_tree(preorder:Vec<i32>,inorder:Vec<i32>)->Option<Rc<RefCell<TreeNode>>>{fn build(pre:&[i32],cursor:&mut usize,l:i32,r:i32,pos:&HashMap<i32,i32>)->Option<Rc<RefCell<TreeNode>>>{if l>r{return None}let v=pre[*cursor];*cursor+=1;let m=pos[&v];let mut x=TreeNode::new(v);x.left=build(pre,cursor,l,m-1,pos);x.right=build(pre,cursor,m+1,r,pos);Some(Rc::new(RefCell::new(x)))}let pos=inorder.iter().enumerate().map(|(i,&v)|(v,i as i32)).collect();let mut cursor=0usize;build(&preorder,&mut cursor,0,inorder.len()as i32-1,&pos)}}

Go
~~

.. code-block:: go

   func buildTree(preorder []int,inorder []int)*TreeNode{pos:=map[int]int{};for i,v:=range inorder{pos[v]=i};cursor:=0;var build func(int,int)*TreeNode;build=func(l,r int)*TreeNode{if l>r{return nil};v:=preorder[cursor];cursor++;m:=pos[v];x:=&TreeNode{Val:v};x.Left=build(l,m-1);x.Right=build(m+1,r);return x};return build(0,len(inorder)-1)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function buildTree(preorder:number[],inorder:number[]):TreeNode|null{const pos=new Map<number,number>();inorder.forEach((v,i)=>pos.set(v,i));let cursor=0;const build=(l:number,r:number):TreeNode|null=>{if(l>r)return null;const v=preorder[cursor++],m=pos.get(v)!;const x=new TreeNode(v);x.left=build(l,m-1);x.right=build(m+1,r);return x;};return build(0,inorder.length-1);}

C#
~~

.. code-block:: csharp

   public class Solution {int cursor;int[]pre;Dictionary<int,int>pos=new();TreeNode Build(int l,int r){if(l>r)return null;int v=pre[cursor++],m=pos[v];var x=new TreeNode(v);x.left=Build(l,m-1);x.right=Build(m+1,r);return x;}public TreeNode BuildTree(int[]preorder,int[]inorder){pre=preorder;for(int i=0;i<inorder.Length;i++)pos[inorder[i]]=i;return Build(0,inorder.Length-1);}}

Julia
~~~~~

.. code-block:: julia

   function build_tree(preorder,inorder)
       pos=Dict(v=>i for(i,v)in enumerate(inorder));cursor=Ref(1)
       function build(l,r);l>r&&return nothing;v=preorder[cursor[]];cursor[]+=1;m=pos[v];x=TreeNode(v);x.left=build(l,m-1);x.right=build(m+1,r);x;end
       build(1,length(inorder))
   end

R
~

.. code-block:: r

   build_tree <- function(preorder,inorder){pos<-setNames(seq_along(inorder),as.character(inorder));cursor<-1L;build<-function(l,r){if(l>r)return(NULL);v<-preorder[[cursor]];cursor<<-cursor+1L;m<-pos[[as.character(v)]];x<-new.env();x$val<-v;x$left<-build(l,m-1L);x$right<-build(m+1L,r);x};build(1L,length(inorder))}
