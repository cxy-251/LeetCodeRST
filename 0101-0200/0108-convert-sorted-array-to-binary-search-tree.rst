0108. Convert Sorted Array to Binary Search Tree
================================================

题目信息
--------

:题号: 0108
:难度: Easy
:主题: 二叉搜索树、分治、数组区间、高度平衡
:原题: `LeetCode 0108 <https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/>`_
:重点: 严格递增数组、高度平衡、多个合法结果

题目重述
--------

给定一个按严格递增顺序排列的整数数组 ``nums``，构造并返回一棵高度平衡的二叉搜索树。树的中序遍历必须与 ``nums`` 完全一致；高度平衡表示任意节点的左右子树高度差不超过 ``1``。满足这些条件的树可能不唯一，返回任意一种合法结构即可。

数组长度在 ``1..10^4`` 范围内，元素值在 ``-10^4..10^4`` 范围内。

自建示例
--------

.. code-block:: text

   输入：nums = [-8,-2,1,5,11,16]
   输出（层序，合法答案之一）：[1,-8,11,null,-2,5,16]
   解释：该树的中序遍历为原数组；每个节点的左右子树高度差都不超过 1。

.. code-block:: text

   输入：nums = [3,9]
   输出（层序，合法答案之一）：[3,null,9]
   解释：选择 3 或 9 作为根都能得到高度平衡的二叉搜索树，因此答案不唯一。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       TreeNode* slicing(std::vector<int> values) {
           if (values.empty()) return nullptr;
           int middle = (values.size() - 1) / 2;
           std::vector<int> left(values.begin(),values.begin()+middle);
           std::vector<int> right(values.begin()+middle+1,values.end());
           return new TreeNode(values[middle],slicing(left),slicing(right));
       }

       TreeNode* closedRange(const std::vector<int>& nums, int left, int right) {
           if (left > right) return nullptr;
           int middle = left + (right - left) / 2;
           TreeNode* root = new TreeNode(nums[middle]);
           root->left = closedRange(nums,left,middle-1);
           root->right = closedRange(nums,middle+1,right);
           return root;
       }

       TreeNode* halfOpen(const std::vector<int>& nums, int begin, int end) {
           if (begin >= end) return nullptr;
           int middle = begin + (end - begin - 1) / 2;
           return new TreeNode(nums[middle],halfOpen(nums,begin,middle),
                               halfOpen(nums,middle+1,end));
       }

   public:
       TreeNode* sortedArrayToBST(std::vector<int>& nums) {
           return closedRange(nums,0,nums.size()-1);
       }
   };

题解
----

为什么中点适合作为根
~~~~~~~~~~~~~~~~~~

数组严格递增。选择中点后，左区间所有值都小于根，右区间所有值都大于根，天然满足 BST 条件；同样性质递归应用于两个子区间。

左右规模为何平衡
~~~~~~~~~~~~~~~

长度为 ``length`` 的连续区间取中点后，左右元素数量分别是 ``floor((length-1)/2)`` 和 ``ceil((length-1)/2)``，差最多 1。递归构造的两侧高度也最多相差 1。

.. list-table::
   :header-rows: 1

   * - 区间
     - 中点根
     - 左右区间
   * - ``[0,5]``
     - 1（值 -2）
     - ``[0,0]``、``[2,5]``
   * - ``[2,5]``
     - 3（值 5）
     - ``[2,2]``、``[4,5]``
   * - ``[4,5]``
     - 4（值 11）
     - 空、``[5,5]``

为什么每个节点都平衡
~~~~~~~~~~~~~~~~~~~~

对区间长度归纳。长度 0 或 1 显然平衡；较长区间的两个子区间规模差最多 1，按归纳假设各自平衡，其高度由近似对半规模决定，差不超过 1，因此当前根也平衡。

偶数长度为何有两个答案
~~~~~~~~~~~~~~~~~~~~~~

偶数区间有左右两个中间元素。选任意一个都会使左右规模差为 1，且保持有序划分，所以可能返回不同结构但都满足题意。固定左中点使同一实现的输出结构确定。

切片方法浪费什么
~~~~~~~~~~~~~~~~

复制左右数组后递归逻辑直观，但每层都搬移元素，最坏产生 ``O(n log n)`` 总复制。传递原数组的索引区间只创建树节点。

为什么中序遍历恢复原数组
~~~~~~~~~~~~~~~~~~~~~~~~

递归先构造左区间，再访问中点根，最后构造右区间，恰好按数组下标递增顺序访问每个元素，因此输出一定是包含全部输入值的 BST。

复杂度来源
~~~~~~~~~~

每个元素创建一个节点，时间 ``O(n)``；平衡递归深度 ``O(log n)``。返回树使用 ``O(n)`` 节点，除此之外只需递归栈。

九语言实现
----------

C
~

.. code-block:: c

   static struct TreeNode*build(int*nums,int l,int r){if(l>r)return NULL;int m=l+(r-l)/2;struct TreeNode*x=malloc(sizeof(*x));x->val=nums[m];x->left=build(nums,l,m-1);x->right=build(nums,m+1,r);return x;}struct TreeNode*sortedArrayToBST(int*nums,int n){return build(nums,0,n-1);}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def sortedArrayToBST(self, nums):
           def build(left, right):
               if left > right: return None
               middle = left + (right-left)//2
               return TreeNode(nums[middle], build(left,middle-1), build(middle+1,right))
           return build(0, len(nums)-1)

Java
~~~~

.. code-block:: java

   class Solution {int[]nums;TreeNode build(int l,int r){if(l>r)return null;int m=l+(r-l)/2;TreeNode x=new TreeNode(nums[m]);x.left=build(l,m-1);x.right=build(m+1,r);return x;}public TreeNode sortedArrayToBST(int[]nums){this.nums=nums;return build(0,nums.length-1);}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn sorted_array_to_bst(nums:Vec<i32>)->Option<Rc<RefCell<TreeNode>>>{fn build(a:&[i32],l:i32,r:i32)->Option<Rc<RefCell<TreeNode>>>{if l>r{return None}let m=l+(r-l)/2;let mut x=TreeNode::new(a[m as usize]);x.left=build(a,l,m-1);x.right=build(a,m+1,r);Some(Rc::new(RefCell::new(x)))}build(&nums,0,nums.len()as i32-1)}}

Go
~~

.. code-block:: go

   func sortedArrayToBST(nums []int)*TreeNode{var build func(int,int)*TreeNode;build=func(l,r int)*TreeNode{if l>r{return nil};m:=l+(r-l)/2;return &TreeNode{Val:nums[m],Left:build(l,m-1),Right:build(m+1,r)}};return build(0,len(nums)-1)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sortedArrayToBST(nums:number[]):TreeNode|null{const build=(l:number,r:number):TreeNode|null=>{if(l>r)return null;const m=l+Math.floor((r-l)/2);return new TreeNode(nums[m],build(l,m-1),build(m+1,r));};return build(0,nums.length-1);}

C#
~~

.. code-block:: csharp

   public class Solution {int[]nums;TreeNode Build(int l,int r){if(l>r)return null;int m=l+(r-l)/2;return new TreeNode(nums[m],Build(l,m-1),Build(m+1,r));}public TreeNode SortedArrayToBST(int[]nums){this.nums=nums;return Build(0,nums.Length-1);}}

Julia
~~~~~

.. code-block:: julia

   function sorted_array_to_bst(nums)
       function build(l,r);l>r&&return nothing;m=l+(r-l)÷2;TreeNode(nums[m],build(l,m-1),build(m+1,r));end
       build(1,length(nums))
   end

R
~

.. code-block:: r

   sorted_array_to_bst <- function(nums){build<-function(l,r){if(l>r)return(NULL);m<-l+(r-l)%/%2L;x<-new.env();x$val<-nums[[m]];x$left<-build(l,m-1L);x$right<-build(m+1L,r);x};build(1L,length(nums))}
