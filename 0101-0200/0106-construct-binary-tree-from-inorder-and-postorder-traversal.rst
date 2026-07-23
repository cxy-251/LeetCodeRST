0106. Construct Binary Tree from Inorder and Postorder Traversal
================================================================

题目信息
--------

:题号: 0106
:难度: Medium
:主题: 二叉树、分治、中序遍历、后序遍历、哈希表
:原题: `LeetCode 0106 <https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/>`_
:重点: 后序尾根、反向游标、中序划分、先右后左构造

题目重述
--------

给定两个整数数组 ``inorder`` 和 ``postorder``，它们分别是一棵二叉树的中序遍历和后序遍历结果，请据此构造并返回这棵二叉树。树中节点值互不相同，两个数组包含相同的节点值，并且给出的遍历序列有效。

自建示例
--------

.. code-block:: text

   inorder   = [9,3,15,20,7]
   postorder = [9,15,7,20,3]

          3
        /   \
       9    20
           /  \
          15   7

.. code-block:: text

   inorder   = [1,2,3]
   postorder = [1,3,2]

读取根 2 后，反向游标先遇到右子树根 3。

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       TreeNode* slicing(const std::vector<int>& inorder,
                         const std::vector<int>& postorder) {
           if (inorder.empty()) return nullptr;
           int root_value = postorder.back(), split = 0;
           while (inorder[split] != root_value) ++split;
           std::vector<int> left_in(inorder.begin(),inorder.begin()+split);
           std::vector<int> right_in(inorder.begin()+split+1,inorder.end());
           std::vector<int> left_post(postorder.begin(),postorder.begin()+split);
           std::vector<int> right_post(postorder.begin()+split,postorder.end()-1);
           return new TreeNode(root_value,slicing(left_in,left_post),slicing(right_in,right_post));
       }

       TreeNode* indexedRanges(const std::vector<int>& postorder,
                               int post_left, int post_right,
                               int in_left, int in_right,
                               const std::unordered_map<int,int>& position) {
           if (post_left > post_right) return nullptr;
           int root_value = postorder[post_right];
           int split = position.at(root_value), left_size = split - in_left;
           TreeNode* root = new TreeNode(root_value);
           root->left = indexedRanges(postorder,post_left,post_left+left_size-1,
                                      in_left,split-1,position);
           root->right = indexedRanges(postorder,post_left+left_size,post_right-1,
                                       split+1,in_right,position);
           return root;
       }

       TreeNode* reverseCursor(const std::vector<int>& postorder, int& cursor,
                               int in_left, int in_right,
                               const std::unordered_map<int,int>& position) {
           if (in_left > in_right) return nullptr;
           int root_value = postorder[cursor--];
           int split = position.at(root_value);
           TreeNode* root = new TreeNode(root_value);
           root->right = reverseCursor(postorder,cursor,split+1,in_right,position);
           root->left = reverseCursor(postorder,cursor,in_left,split-1,position);
           return root;
       }

   public:
       TreeNode* buildTree(std::vector<int>& inorder, std::vector<int>& postorder) {
           std::unordered_map<int,int> position;
           for (int i = 0; i < static_cast<int>(inorder.size()); ++i)
               position[inorder[i]] = i;
           int cursor = postorder.size() - 1;
           return reverseCursor(postorder,cursor,0,inorder.size()-1,position);
       }
   };

题解
----

后序末元素为何是根
~~~~~~~~~~~~~~~~

后序遍历先完成左右子树，最后访问根，因此当前子树对应后序片段的末元素一定是根。根在中序区间中的唯一位置将节点集合分成左右两侧。

反向游标如何消费遍历
~~~~~~~~~~~~~~~~~~

``cursor`` 从后序末端向前移动。读取根后，反向顺序是根、右、左，所以当前游标紧邻右子树的最后访问节点。必须先构造右区间，再构造左区间。

.. list-table::
   :header-rows: 1

   * - 中序区间
     - 读取后序根
     - 下一步
   * - ``[0,4]``
     - 3
     - 先构造右 ``[2,4]``
   * - ``[2,4]``
     - 20
     - 先右 7，再左 15
   * - ``[0,0]``
     - 9
     - 叶节点

为什么先左会出错
~~~~~~~~~~~~~~~~

读取根 3 后，游标位于 20，它属于右子树。若先进入左区间，会把 20 错当作左根。该顺序与第 105 题的前序正向游标构成对偶：前序先左后右，反向后序先右后左。

哈希索引消除什么重复
~~~~~~~~~~~~~~~~~~~~

每次在线性中序片段中查找根会使退化树达到 ``O(n²)``。一次建立值到下标的映射后，每个节点只进行常数时间定位。

为什么构造完整且唯一
~~~~~~~~~~~~~~~~~~~~

每个非空状态的根由后序末端唯一决定，中序位置唯一决定左右节点集合。按区间长度归纳，反向游标依次消费右子树和左子树的全部节点，构造结果不重不漏并唯一。

复杂度来源
~~~~~~~~~~

时间 ``O(n)``，索引表 ``O(n)``，递归栈 ``O(h)``，返回树包含 ``n`` 个新节点。切片方法会产生额外数组复制。

九语言实现
----------

C
~

.. code-block:: c

   static struct TreeNode*build(int*post,int*cursor,int l,int r,int*pos){if(l>r)return NULL;int v=post[(*cursor)--],m=pos[v+3000];struct TreeNode*x=malloc(sizeof(*x));x->val=v;x->right=build(post,cursor,m+1,r,pos);x->left=build(post,cursor,l,m-1,pos);return x;}struct TreeNode*buildTree(int*in,int n,int*post,int postN){int*pos=malloc(6001*sizeof(int));for(int i=0;i<n;i++)pos[in[i]+3000]=i;int cursor=n-1;struct TreeNode*root=build(post,&cursor,0,n-1,pos);free(pos);return root;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def buildTree(self, inorder, postorder):
           position = {value:index for index,value in enumerate(inorder)}; cursor = len(postorder)-1
           def build(left, right):
               nonlocal cursor
               if left > right: return None
               value = postorder[cursor]; cursor -= 1; split = position[value]
               root = TreeNode(value); root.right = build(split+1, right); root.left = build(left, split-1)
               return root
           return build(0, len(inorder)-1)

Java
~~~~

.. code-block:: java

   class Solution {int cursor;int[]post;Map<Integer,Integer>pos=new HashMap<>();TreeNode build(int l,int r){if(l>r)return null;int v=post[cursor--],m=pos.get(v);TreeNode x=new TreeNode(v);x.right=build(m+1,r);x.left=build(l,m-1);return x;}public TreeNode buildTree(int[]inorder,int[]postorder){post=postorder;cursor=post.length-1;for(int i=0;i<inorder.length;i++)pos.put(inorder[i],i);return build(0,inorder.length-1);}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn build_tree(inorder:Vec<i32>,postorder:Vec<i32>)->Option<Rc<RefCell<TreeNode>>>{fn build(post:&[i32],cursor:&mut i32,l:i32,r:i32,pos:&HashMap<i32,i32>)->Option<Rc<RefCell<TreeNode>>>{if l>r{return None}let v=post[*cursor as usize];*cursor-=1;let m=pos[&v];let mut x=TreeNode::new(v);x.right=build(post,cursor,m+1,r,pos);x.left=build(post,cursor,l,m-1,pos);Some(Rc::new(RefCell::new(x)))}let pos=inorder.iter().enumerate().map(|(i,&v)|(v,i as i32)).collect();let mut cursor=postorder.len()as i32-1;build(&postorder,&mut cursor,0,inorder.len()as i32-1,&pos)}}

Go
~~

.. code-block:: go

   func buildTree(inorder []int,postorder []int)*TreeNode{pos:=map[int]int{};for i,v:=range inorder{pos[v]=i};cursor:=len(postorder)-1;var build func(int,int)*TreeNode;build=func(l,r int)*TreeNode{if l>r{return nil};v:=postorder[cursor];cursor--;m:=pos[v];x:=&TreeNode{Val:v};x.Right=build(m+1,r);x.Left=build(l,m-1);return x};return build(0,len(inorder)-1)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function buildTree(inorder:number[],postorder:number[]):TreeNode|null{const pos=new Map<number,number>();inorder.forEach((v,i)=>pos.set(v,i));let cursor=postorder.length-1;const build=(l:number,r:number):TreeNode|null=>{if(l>r)return null;const v=postorder[cursor--],m=pos.get(v)!;const x=new TreeNode(v);x.right=build(m+1,r);x.left=build(l,m-1);return x;};return build(0,inorder.length-1);}

C#
~~

.. code-block:: csharp

   public class Solution {int cursor;int[]post;Dictionary<int,int>pos=new();TreeNode Build(int l,int r){if(l>r)return null;int v=post[cursor--],m=pos[v];var x=new TreeNode(v);x.right=Build(m+1,r);x.left=Build(l,m-1);return x;}public TreeNode BuildTree(int[]inorder,int[]postorder){post=postorder;cursor=post.Length-1;for(int i=0;i<inorder.Length;i++)pos[inorder[i]]=i;return Build(0,inorder.Length-1);}}

Julia
~~~~~

.. code-block:: julia

   function build_tree(inorder,postorder)
       pos=Dict(v=>i for(i,v)in enumerate(inorder));cursor=Ref(length(postorder))
       function build(l,r);l>r&&return nothing;v=postorder[cursor[]];cursor[]-=1;m=pos[v];x=TreeNode(v);x.right=build(m+1,r);x.left=build(l,m-1);x;end
       build(1,length(inorder))
   end

R
~

.. code-block:: r

   build_tree <- function(inorder,postorder){pos<-setNames(seq_along(inorder),as.character(inorder));cursor<-length(postorder);build<-function(l,r){if(l>r)return(NULL);v<-postorder[[cursor]];cursor<<-cursor-1L;m<-pos[[as.character(v)]];x<-new.env();x$val<-v;x$right<-build(m+1L,r);x$left<-build(l,m-1L);x};build(1L,length(inorder))}