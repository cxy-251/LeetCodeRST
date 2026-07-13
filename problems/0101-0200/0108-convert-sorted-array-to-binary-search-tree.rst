0108. Convert Sorted Array to Binary Search Tree
================================================

题目信息
--------

:题号: 0108
:难度: Easy
:主题: 二叉搜索树、分治、平衡树、数组区间
:原题: `LeetCode 0108 <https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/>`_
:访问状态: Available
:教学重点: 中点选根、区间递归、平衡性证明、返回树所有权

题目重述
--------

给定一个严格递增的整数数组 ``nums``，构造一棵高度平衡的二叉搜索树并返回根节点。

二叉搜索树要求任意节点左子树中的值都小于该节点，右子树中的值都大于该节点。高度平衡要求任意节点的左右
子树高度差不超过 1。平台保证数组非空、值互异且已按升序排列。函数不能修改 ``nums``，返回树的每个节点
都需要新建。

当区间长度为偶数时，中间位置有两个候选。选择左中点或右中点都能得到合法高度平衡树；本文统一选择
``left + (right - left) / 2`` 对应的下中点，十种语言保持同一选择。

自建示例
--------

奇数长度
~~~~~~~~

.. code-block:: text

   nums = [-10, -3, 0, 5, 9]

              0
            /   \
          -3     9
          /     /
        -10    5

根选择中点值 ``0``。左右区间长度都为 2，递归继续选择各自中点。

偶数长度
~~~~~~~~

.. code-block:: text

   nums = [1, 2, 3, 4]

          3
        /   \
       2     4
      /
     1

半开区间 ``[0, 4)`` 的中点为 ``2``，因此根值是 ``nums[2] == 3``。若选择值 ``2`` 作为根也合法，
输出不要求唯一。

单元素
~~~~~~

.. code-block:: text

   nums = [7]
   输出：只有根节点 7

问题抽象
--------

有序数组已经提供了二叉搜索树需要的全局顺序。对任意半开区间 ``[left, right)``：

* 选择中点 ``middle`` 作为根；
* ``[left, middle)`` 中的值全部更小，只能进入左子树；
* ``[middle + 1, right)`` 中的值全部更大，只能进入右子树。

每次都把当前区间拆成长度至多相差 1 的两部分，因此不仅满足搜索树顺序，也直接控制树高。

基础类型约定
------------

沿用 `0094. Binary Tree Inorder Traversal
<../0001-0100/0094-binary-tree-inorder-traversal.rst>`_ 建立的 ``TreeNode`` 模型。平台提供节点类型：

* C/C++ 返回新分配节点指针；
* Python、Java、Go、TypeScript、C# 返回对象引用；
* Rust 使用 ``Option<Rc<RefCell<TreeNode>>>``；
* Julia 使用仓库统一的可变 ``TreeNode``；
* R 使用 ``new_tree_node`` 创建 ``environment`` 节点。

输入数组只读。成功返回后，树节点由调用者或目标语言运行时持有；数组与树不共享可变载荷。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 中点分治
     - ``O(n)``
     - ``O(log n)`` 调用栈
     - 主解法；顺序与平衡同时由区间划分保证
   * - 依次插入普通 BST
     - 最坏 ``O(n^2)``
     - 最坏 ``O(n)``
     - 升序插入会退化成右链
   * - 先构造完全树形再填值
     - ``O(n)``
     - ``O(n)``
     - 状态更复杂，没有教学收益

这里 ``n`` 是数组长度。返回树本身含 ``n`` 个新节点，返回载荷为 ``Theta(n)``，不计入算法工作空间。

主解法：中点分治
----------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

递归函数 ``build(left, right)`` 负责构造数组半开区间 ``nums[left:right]`` 对应的树，并保持：

* 返回树的中序遍历恰好等于 ``nums[left:right]``；
* 返回树中的每个值只出现一次；
* 返回树高度平衡；
* 空区间返回空节点；
* 调用不修改输入数组。

非空区间取：

.. code-block:: text

   middle = left + (right - left) // 2

   root.left  = build(left, middle)
   root.right = build(middle + 1, right)

使用 ``left + (right - left) / 2`` 避免在更大整数域中直接计算 ``left + right`` 的潜在溢出。当前题数组长度
较小，但保持这一写法可以复用到更大的索引问题。

平衡性为什么成立
~~~~~~~~~~~~~~~~

设当前区间长度为 ``k``。去掉中点后，左、右区间长度分别是：

.. code-block:: text

   left_size  = floor(k / 2)
   right_size = k - 1 - left_size

两者之差最多为 1。递归对子区间应用同一规则，因此每个节点的左右子树节点数尽可能接近。更强地，两个子区间
对应树的高度也至多相差 1：长度落在同一对相邻的二进制规模区间内，递归层数只能相同或相差一层。

正确性依据
~~~~~~~~~~

对区间长度 ``k`` 做归纳。

**基础情况。** ``k = 0`` 时返回空树，中序序列为空且平衡；``k = 1`` 时创建单节点树，搜索树性质和平衡性
显然成立。

**归纳步骤。** 对长度 ``k > 1`` 的区间，中点左侧值全部小于根值，右侧值全部大于根值。按归纳假设，左右
递归分别构造合法且平衡的二叉搜索树。把它们接到中点根节点后，整棵树满足二叉搜索树顺序。左右区间长度至多
相差 1，递归得到的高度至多相差 1，因此当前根也满足高度平衡。

**完整性与无重复。** 当前中点只用于根，左右半开区间互不相交且并集加根恰好覆盖原区间，所以每个数组元素
恰好创建一个节点。

**终止性。** 每次递归区间长度严格减小，最终到达空区间。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 每个数组元素恰好创建一个节点，时间复杂度 ``O(n)``；
* 平衡划分使递归深度为 ``O(log n)``；
* 返回树含 ``n`` 个节点，返回载荷 ``Theta(n)``；
* C 在节点分配失败时释放当前调用已经完成的左右子树，并返回空指针；平台接口无法把资源失败与合法空树统一
  区分，但官方输入非空，因此顶层 ``NULL`` 可视为失败；
* Rust 的 ``Rc`` 创建新节点，数组仅被不可变借用；
* Julia 和 R 使用一基数组，递归区间改为闭区间，正文中的零基半开坐标会显式换算。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>

   static void free_tree(struct TreeNode *root) {
       if (root == NULL) {
           return;
       }
       free_tree(root->left);
       free_tree(root->right);
       free(root);
   }

   static struct TreeNode *build_range(
       const int *nums,
       size_t left,
       size_t right,
       bool *ok
   ) {
       if (!*ok || left >= right) {
           return NULL;
       }

       const size_t middle = left + (right - left) / 2;
       struct TreeNode *root = malloc(sizeof(*root));
       if (root == NULL) {
           *ok = false;
           return NULL;
       }

       root->val = nums[middle];
       root->left = build_range(nums, left, middle, ok);
       root->right = build_range(nums, middle + 1, right, ok);

       if (!*ok) {
           free_tree(root);
           return NULL;
       }
       return root;
   }

   struct TreeNode *sortedArrayToBST(int *nums, int numsSize) {
       bool ok = true;
       struct TreeNode *root = build_range(
           nums,
           0,
           (size_t)numsSize,
           &ok
       );
       return ok ? root : NULL;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
       TreeNode* build(
           const std::vector<int>& nums,
           int left,
           int right
       ) {
           if (left >= right) {
               return nullptr;
           }

           const int middle = left + (right - left) / 2;
           auto* root = new TreeNode(nums[middle]);
           root->left = build(nums, left, middle);
           root->right = build(nums, middle + 1, right);
           return root;
       }

   public:
       TreeNode* sortedArrayToBST(std::vector<int>& nums) {
           return build(nums, 0, static_cast<int>(nums.size()));
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def sortedArrayToBST(
           self,
           nums: list[int],
       ) -> Optional[TreeNode]:
           def build(left: int, right: int) -> Optional[TreeNode]:
               if left >= right:
                   return None

               middle = left + (right - left) // 2
               root = TreeNode(nums[middle])
               root.left = build(left, middle)
               root.right = build(middle + 1, right)
               return root

           return build(0, len(nums))

Java
~~~~

.. code-block:: java

   class Solution {
       public TreeNode sortedArrayToBST(int[] nums) {
           return build(nums, 0, nums.length);
       }

       private TreeNode build(int[] nums, int left, int right) {
           if (left >= right) {
               return null;
           }

           int middle = left + (right - left) / 2;
           TreeNode root = new TreeNode(nums[middle]);
           root.left = build(nums, left, middle);
           root.right = build(nums, middle + 1, right);
           return root;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn sorted_array_to_bst(
           nums: Vec<i32>,
       ) -> Option<Rc<RefCell<TreeNode>>> {
           fn build(
               nums: &[i32],
               left: usize,
               right: usize,
           ) -> Option<Rc<RefCell<TreeNode>>> {
               if left >= right {
                   return None;
               }

               let middle = left + (right - left) / 2;
               let root = Rc::new(RefCell::new(TreeNode::new(nums[middle])));
               root.borrow_mut().left = build(nums, left, middle);
               root.borrow_mut().right = build(nums, middle + 1, right);
               Some(root)
           }

           build(&nums, 0, nums.len())
       }
   }

Go
~~

.. code-block:: go

   func sortedArrayToBST(nums []int) *TreeNode {
       var build func(int, int) *TreeNode
       build = func(left, right int) *TreeNode {
           if left >= right {
               return nil
           }

           middle := left + (right-left)/2
           root := &TreeNode{Val: nums[middle]}
           root.Left = build(left, middle)
           root.Right = build(middle+1, right)
           return root
       }

       return build(0, len(nums))
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sortedArrayToBST(nums: number[]): TreeNode | null {
       const build = (left: number, right: number): TreeNode | null => {
           if (left >= right) {
               return null;
           }

           const middle = left + Math.floor((right - left) / 2);
           const root = new TreeNode(nums[middle]);
           root.left = build(left, middle);
           root.right = build(middle + 1, right);
           return root;
       };

       return build(0, nums.length);
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public TreeNode SortedArrayToBST(int[] nums) {
           return Build(nums, 0, nums.Length);
       }

       private TreeNode Build(int[] nums, int left, int right) {
           if (left >= right) {
               return null;
           }

           int middle = left + (right - left) / 2;
           var root = new TreeNode(nums[middle]);
           root.left = Build(nums, left, middle);
           root.right = Build(nums, middle + 1, right);
           return root;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function sorted_array_to_bst(nums::Vector{Int})
       function build(left::Int, right::Int)
           left > right && return nothing

           middle = left + (right - left) ÷ 2
           root = TreeNode(nums[middle])
           root.left = build(left, middle - 1)
           root.right = build(middle + 1, right)
           return root
       end

       return build(1, length(nums))
   end

Julia 使用一基闭区间 ``[left, right]``。中点公式仍然避免直接相加两个端点；空区间条件改为
``left > right``。

R
~

.. code-block:: r

   sorted_array_to_bst <- function(nums) {
     build <- function(left, right) {
       if (left > right) {
         return(NULL)
       }

       middle <- left + (right - left) %/% 2L
       root <- new_tree_node(nums[[middle]])
       root$left <- build(left, middle - 1L)
       root$right <- build(middle + 1L, right)
       root
     }

     build(1L, length(nums))
   }

R 同样使用一基闭区间。递归只读取 ``nums``，没有跨调用共享的可变游标。

验证计划与证据
--------------

* 固定用例覆盖单元素、奇数长度、偶数长度、全负数和长度为 10,000 的严格递增数组；
* 随机生成严格递增数组，检查返回树中序遍历等于原数组；
* 对每个返回节点递归检查左右子树高度差不超过 1；
* 检查节点数量等于数组长度、节点身份互异且输入数组未修改；
* C/C++ 使用严格警告、ASan 和 UBSan；有运行时的其余语言执行固定与随机用例；
* Rust、C#、Julia、R 缺少运行时时只记录静态接口与索引检查。

关键边界
--------

* 偶数长度有两个合法中点，输出树不唯一；验证必须检查性质，不能只比较一种序列化结果；
* 空区间不读取 ``nums[middle]``；
* 返回空间是新树，不是数组视图；
* 递归栈是 ``O(log n)``，因为当前算法主动平分区间，不是所有树递归都自动具有这一空间界。

易错点
------

* 升序依次插入普通 BST，得到高度 ``n`` 的退化树；
* 把右区间写成 ``[middle, right)``，导致中点被重复使用并无限递归；
* 验证时要求唯一树形，错误拒绝另一种合法中点选择；
* C 分配失败后直接返回，泄漏已经构造的子树；
* Julia/R 直接照搬零基半开区间，产生偏一或越界。

本题新增知识
------------

* 利用有序数组中点同时保证 BST 顺序与高度平衡；
* 半开区间中点分治的覆盖与无重复证明；
* 非唯一输出使用性质验证而不是固定序列化比较。

本题强化知识
------------

* `0104. Maximum Depth of Binary Tree <0104-maximum-depth-of-binary-tree.rst>`_ 的树高定义；
* 跨语言 ``TreeNode`` 引用模型；
* 返回树载荷与递归工作空间分开计费。

关联题目
--------

* `0109. Convert Sorted List to Binary Search Tree
  <0109-convert-sorted-list-to-binary-search-tree.rst>`_：顺序来源改为链表，随机访问消失；
* `0098. Validate Binary Search Tree
  <../0001-0100/0098-validate-binary-search-tree.rst>`_：用中序严格递增刻画 BST。

最小自检
--------

#. 为什么取中点后左右子树高度差一定不超过 1？
#. 偶数长度时选择另一个中点会破坏正确性吗？
#. 为什么递归栈是 ``O(log n)``，返回树却是 ``Theta(n)``？
#. C 的失败路径需要释放哪些对象？

答案要点
~~~~~~~~

中点左侧全部更小、右侧全部更大，因此满足 BST 顺序；两个子区间长度至多相差 1，递归继续平分，故每个节点
左右高度差不超过 1。每个下标只进入一个区间并创建一个节点，时间 ``O(n)``，调用栈 ``O(log n)``，返回树
``Theta(n)``。
