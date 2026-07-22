0095. Unique Binary Search Trees II
===================================

题目信息
--------

:题号: 0095
:题名: Unique Binary Search Trees II
:难度: Medium
:类型: Algorithms
:主题: 二叉搜索树、分治、Catalan 结构、树构造
:原题: `LeetCode 0095 <https://leetcode.com/problems/unique-binary-search-trees-ii/>`_
:教学重点: 根值分治、左右区间笛卡尔积、空树占位、结果节点独立性

题目重述
--------

给定整数 ``n``，生成并返回所有由 ``1`` 到 ``n`` 这 ``n`` 个互不相同的值组成、结构彼此不同的二叉搜索树。每个值在一棵树中恰好使用一次，结果顺序不作要求。

自建示例
--------

``n=3`` 时共有五棵树。根为 1 时右侧有两种结构；根为 2 时左右各一种；根为 3 时左侧有两种，因此总数为 ``2+1+2=5``。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       TreeNode* cloneTree(TreeNode* node) {
           if (!node) return nullptr;
           return new TreeNode(node->val, cloneTree(node->left), cloneTree(node->right));
       }

       void destroy(TreeNode* node) {
           if (!node) return;
           destroy(node->left); destroy(node->right); delete node;
       }

       std::vector<TreeNode*> generate(int start, int end) {
           if (start > end) return {nullptr};
           std::vector<TreeNode*> result;
           for (int root_value = start; root_value <= end; ++root_value) {
               std::vector<TreeNode*> left = generate(start, root_value - 1);
               std::vector<TreeNode*> right = generate(root_value + 1, end);
               for (TreeNode* left_tree : left)
                   for (TreeNode* right_tree : right)
                       result.push_back(new TreeNode(
                           root_value, cloneTree(left_tree), cloneTree(right_tree)));
               for (TreeNode* tree : left) destroy(tree);
               for (TreeNode* tree : right) destroy(tree);
           }
           return result;
       }

       std::vector<TreeNode*> sharedTemplates(int start, int end) {
           if (start > end) return {nullptr};
           std::vector<TreeNode*> result;
           for (int root_value = start; root_value <= end; ++root_value)
               for (TreeNode* left : sharedTemplates(start, root_value - 1))
                   for (TreeNode* right : sharedTemplates(root_value + 1, end))
                       result.push_back(new TreeNode(root_value, left, right));
           return result;
       }

   public:
       std::vector<TreeNode*> generateTrees(int n) {
           return generate(1, n);
       }
   };

题解
----

为什么插入排列会重复结构
~~~~~~~~~~~~~~~~~~~~~~

可以枚举 ``1..n`` 的所有插入顺序并建立 BST，但不同排列可能得到同一结构。例如先插入某子树中的两个节点时，只要父子关系不变，多个顺序会汇聚到同一棵树。该方法至少枚举 ``n!`` 个排列，没有利用 BST 的值域约束。

根值如何拆分问题
~~~~~~~~~~~~~~~~

对连续值域 ``[start,end]`` 选择根 ``root_value`` 后：

.. code-block:: text

   左子树只能使用 [start, root_value-1]
   右子树只能使用 [root_value+1, end]

左右值域互不重叠且都严格小于或大于根。任意合法左树与任意合法右树都能组合成一棵合法 BST，因此固定根的结果是两个结果集的笛卡尔积。

空区间为什么返回一个 null
~~~~~~~~~~~~~~~~~~~~~~~~

空区间表示“这一侧没有子树”，它是一种合法选择。若返回空列表，叶节点的左结果数和右结果数都会为 0，笛卡尔积无法生成叶节点。返回 ``{nullptr}`` 使空侧贡献一个单位选择。

``n=3`` 的根分组
~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 根
     - 左区间结构数
     - 右区间结构数
     - 组合数
   * - 1
     - 1 个空树
     - 2
     - 2
   * - 2
     - 1
     - 1
     - 1
   * - 3
     - 2
     - 1 个空树
     - 2

为什么覆盖全部合法树
~~~~~~~~~~~~~~~~~~~~

任意非空 BST 都有唯一根值。BST 性质强制所有更小值位于左子树、更大值位于右子树；按区间长度归纳，算法能生成它的左右子树，并在该根值分支的笛卡尔积中组合出整棵树。

为什么不会产生重复结构
~~~~~~~~~~~~~~~~~~~~~~

不同根值产生的树根不同。根值相同时，若两个组合不同，则左结构或右结构至少一侧不同；递归结果本身无重复，笛卡尔积中的每一对也只访问一次，因此整树唯一。

为什么要深复制子树模板
~~~~~~~~~~~~~~~~~~~~

同一左树可能与多个右树组合。若直接把同一个节点对象挂到多个根下，结构虽然正确，却会共享可变子树。主实现把递归结果视为临时模板，每次组合都深复制左右模板；组合结束后销毁模板，使每棵最终结果拥有独立节点集合。

记忆化的取舍
~~~~~~~~~~~~

相同区间会重复生成，可缓存结构模板以减少构造工作。但直接复用缓存节点会引入共享；若最终仍要求独立树，需要在输出组合时深复制。由于 ``n<=8`` 且输出本身已经很大，直接分治更容易说明资源所有权。

复杂度来源
~~~~~~~~~~

结果数量是第 ``n`` 个 Catalan 数 ``C_n``，每棵树包含 ``n`` 个节点。仅构造独立输出就需要 ``Theta(n*C_n)`` 时间与返回空间；递归深度 ``O(n)``。模板深复制的成本与输出节点总量同阶。

九语言实现
----------

C
~

.. code-block:: c

   static struct TreeNode*clone(struct TreeNode*x){if(!x)return NULL;struct TreeNode*n=malloc(sizeof(*n));n->val=x->val;n->left=clone(x->left);n->right=clone(x->right);return n;}
   static void release(struct TreeNode*x){if(!x)return;release(x->left);release(x->right);free(x);}
   static struct TreeNode**gen(int l,int r,int*size){if(l>r){struct TreeNode**a=malloc(sizeof(*a));a[0]=NULL;*size=1;return a;}int cap=64,n=0;struct TreeNode**out=malloc(cap*sizeof(*out));for(int root=l;root<=r;root++){int ls,rs;struct TreeNode**left=gen(l,root-1,&ls),**right=gen(root+1,r,&rs);for(int i=0;i<ls;i++)for(int j=0;j<rs;j++){if(n==cap){cap*=2;out=realloc(out,cap*sizeof(*out));}struct TreeNode*x=malloc(sizeof(*x));x->val=root;x->left=clone(left[i]);x->right=clone(right[j]);out[n++]=x;}for(int i=0;i<ls;i++)release(left[i]);for(int j=0;j<rs;j++)release(right[j]);free(left);free(right);}*size=n;return out;}
   struct TreeNode**generateTrees(int n,int*returnSize){return gen(1,n,returnSize);}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def generateTrees(self, n: int):
           def clone(node):
               return None if node is None else TreeNode(node.val, clone(node.left), clone(node.right))
           def gen(left, right):
               if left > right: return [None]
               result = []
               for root in range(left, right + 1):
                   for a in gen(left, root - 1):
                       for b in gen(root + 1, right):
                           result.append(TreeNode(root, clone(a), clone(b)))
               return result
           return gen(1, n)

Java
~~~~

.. code-block:: java

   class Solution {TreeNode clone(TreeNode x){return x==null?null:new TreeNode(x.val,clone(x.left),clone(x.right));}List<TreeNode>gen(int l,int r){if(l>r)return new ArrayList<>(Arrays.asList((TreeNode)null));List<TreeNode>o=new ArrayList<>();for(int root=l;root<=r;root++)for(TreeNode a:gen(l,root-1))for(TreeNode b:gen(root+1,r))o.add(new TreeNode(root,clone(a),clone(b)));return o;}public List<TreeNode> generateTrees(int n){return gen(1,n);}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn generate_trees(n:i32)->Vec<Option<Rc<RefCell<TreeNode>>>>{fn clone_tree(x:&Option<Rc<RefCell<TreeNode>>>)->Option<Rc<RefCell<TreeNode>>>{x.as_ref().map(|node|{let b=node.borrow();Rc::new(RefCell::new(TreeNode{val:b.val,left:clone_tree(&b.left),right:clone_tree(&b.right)}))})}fn gen(l:i32,r:i32)->Vec<Option<Rc<RefCell<TreeNode>>>>{if l>r{return vec![None]}let mut o=vec![];for root in l..=r{for a in gen(l,root-1){for b in gen(root+1,r){o.push(Some(Rc::new(RefCell::new(TreeNode{val:root,left:clone_tree(&a),right:clone_tree(&b)}))))}}}o}gen(1,n)}}

Go
~~

.. code-block:: go

   func generateTrees(n int)[]*TreeNode{var clone func(*TreeNode)*TreeNode;clone=func(x *TreeNode)*TreeNode{if x==nil{return nil};return &TreeNode{Val:x.Val,Left:clone(x.Left),Right:clone(x.Right)}};var gen func(int,int)[]*TreeNode;gen=func(l,r int)[]*TreeNode{if l>r{return []*TreeNode{nil}};o:=[]*TreeNode{};for root:=l;root<=r;root++{for _,a:=range gen(l,root-1){for _,b:=range gen(root+1,r){o=append(o,&TreeNode{Val:root,Left:clone(a),Right:clone(b)})}}};return o};return gen(1,n)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function generateTrees(n:number):(TreeNode|null)[]{const clone=(x:TreeNode|null):TreeNode|null=>x?new TreeNode(x.val,clone(x.left),clone(x.right)):null;const gen=(l:number,r:number):(TreeNode|null)[]=>{if(l>r)return[null];const o:(TreeNode|null)[]=[];for(let root=l;root<=r;root++)for(const a of gen(l,root-1))for(const b of gen(root+1,r))o.push(new TreeNode(root,clone(a),clone(b)));return o;};return gen(1,n);}

C#
~~

.. code-block:: csharp

   public class Solution {TreeNode Clone(TreeNode x)=>x==null?null:new TreeNode(x.val,Clone(x.left),Clone(x.right));IList<TreeNode> Gen(int l,int r){if(l>r)return new List<TreeNode>{null};var o=new List<TreeNode>();for(int root=l;root<=r;root++)foreach(var a in Gen(l,root-1))foreach(var b in Gen(root+1,r))o.Add(new TreeNode(root,Clone(a),Clone(b)));return o;}public IList<TreeNode> GenerateTrees(int n)=>Gen(1,n);}

Julia
~~~~~

.. code-block:: julia

   function generate_trees(n)
       clone(x)=x===nothing ? nothing : TreeNode(x.val,clone(x.left),clone(x.right))
       function gen(l,r)
           l>r&&return Any[nothing];out=Any[]
           for root in l:r,a in gen(l,root-1),b in gen(root+1,r);push!(out,TreeNode(root,clone(a),clone(b)));end
           out
       end
       gen(1,n)
   end

R
~

.. code-block:: r

   generate_trees <- function(n){clone<-function(x){if(is.null(x))return(NULL);y<-new.env();y$val<-x$val;y$left<-clone(x$left);y$right<-clone(x$right);y};gen<-function(l,r){if(l>r)return(list(NULL));out<-list();for(root in l:r)for(a in gen(l,root-1L))for(b in gen(root+1L,r)){x<-new.env();x$val<-root;x$left<-clone(a);x$right<-clone(b);out[[length(out)+1L]]<-x};out};gen(1L,n)}
