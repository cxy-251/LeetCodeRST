0108. Convert Sorted Array to Binary Search Tree
================================================

题目信息
--------

:题号: 0108
:难度: Easy
:主题: 二叉搜索树、分治
:原题: `LeetCode 0108 <https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/>`_
:访问状态: Available
:教学重点: 中点作为根、高度平衡

题目重述
--------

把严格递增数组转换为一棵高度平衡二叉搜索树，允许存在多种合法答案。

自建示例
--------

.. code-block:: text

   输入：nums = [-10,-3,0,5,9]
   输出：一种合法树 [0,-3,9,-10,null,5]

问题抽象
--------

对半开区间选择中点为根，左半构造左子树，右半构造右子树。

主解法：中点分治
----------

思路
~~~~

中点分治。 中点作为根、高度平衡

核心状态与不变量
~~~~~~~~~~~~~~~~

对半开区间选择中点为根，左半构造左子树，右半构造右子树。

正确性依据
~~~~~~~~~~

数组有序保证左半所有值小于根、右半所有值大于根，递归树满足 BST。两侧长度至多相差 1，递归保持高度差不超过 1。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；递归栈 ``O(log n)``；输出树 ``O(n)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   static struct TreeNode *build(const int *nums, int left, int right) {
       if (left >= right) return NULL;
       int mid = left + (right - left) / 2;
       struct TreeNode *root = malloc(sizeof(*root));
       root->val = nums[mid];
       root->left = build(nums, left, mid);
       root->right = build(nums, mid + 1, right);
       return root;
   }
   struct TreeNode *sortedArrayToBST(int *nums, int numsSize) {
       return build(nums, 0, numsSize);
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       TreeNode* build(const vector<int>& nums, int l, int r) {
           if (l >= r) return nullptr;
           int m = l + (r - l) / 2;
           auto* root = new TreeNode(nums[m]);
           root->left = build(nums, l, m);
           root->right = build(nums, m + 1, r);
           return root;
       }
       public: TreeNode* sortedArrayToBST(vector<int>& nums) {
           return build(nums, 0, nums.size());
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def sortedArrayToBST(self, nums: list[int]) -> Optional[TreeNode]:

           def build(left: int, right: int) -> Optional[TreeNode]:
               if left >= right:
                   return None
               mid = left + (right - left) // 2
               root = TreeNode(nums[mid])
               root.left = build(left, mid)
               root.right = build(mid + 1, right)
               return root
           return build(0, len(nums))
Java
~~~~

.. code-block:: java

   class Solution {
       public TreeNode sortedArrayToBST(int[] nums) {
           return build(nums, 0, nums.length);
       }
       private TreeNode build(int[] nums, int l, int r) {
           if (l >= r) return null;
           int m = l + (r - l) / 2;
           TreeNode root = new TreeNode(nums[m]);
           root.left = build(nums, l, m);
           root.right = build(nums, m + 1, r);
           return root;
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;
   impl Solution {
       pub fn sorted_array_to_bst(nums: Vec<i32>) -> Option<Rc<RefCell<TreeNode>>> {
           fn build(nums: &[i32]) -> Option<Rc<RefCell<TreeNode>>> {
               if nums.is_empty() {
                   return None;
               }
               let m = nums.len() / 2;
               let root = Rc::new(RefCell::new(TreeNode::new(nums[m])));
               root.borrow_mut().left = build(&nums[..m]);
               root.borrow_mut().right = build(&nums[m + 1..]);
               Some(root)
           }
           build(&nums)
       }
   }
Go
~~

.. code-block:: go

   func sortedArrayToBST(nums []int) *TreeNode {
       if len(nums) == 0 {
           return nil
       }
       middle := len(nums) / 2
       return &TreeNode{
           Val: nums[middle],
           Left: sortedArrayToBST(nums[:middle]),
           Right: sortedArrayToBST(nums[middle+1:]),
       }
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sortedArrayToBST(nums: number[]): TreeNode | null {
       const build = (l: number, r: number): TreeNode | null => {
           if (l >= r)
               return null;
           const m = l + Math.floor((r - l) / 2);
           const root = new TreeNode(nums[m]);
           root.left = build(l, m);
           root.right = build(m + 1, r);
           return root;
       };
       return build(0, nums.length);
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public TreeNode SortedArrayToBST(int[] nums) => Build(nums, 0, nums.Length);
       private TreeNode Build(int[] nums, int l, int r) {
           if (l >= r) return null;
           int m = l + (r - l) / 2;
           var root = new TreeNode(nums[m]);
           root.left = Build(nums, l, m);
           root.right = Build(nums, m + 1, r);
           return root;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function sorted_array_to_bst(nums::Vector{Int})
       function build(left::Int, right::Int)
           left > right && return nothing
           mid = left + (right - left) ÷ 2
           root = TreeNode(nums[mid])
           root.left = build(left, mid - 1)
           root.right = build(mid + 1, right)
           root
       end
       build(1, length(nums))
   end
R
~

.. code-block:: r

   sorted_array_to_bst <- function(nums) {
       build <- function(left, right) {
           if (left > right) return(NULL)
           mid <- left + (right - left) %/% 2L
           root <- new_tree_node(nums[[mid]])
           root$left <- build(left, mid - 1L)
           root$right <- build(mid + 1L, right)
           root
       }
       build(1L, length(nums))
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空数组返回空树。
* 偶数长度选择左中点或右中点都合法。

易错点
------

* 区间边界混用导致遗漏或无限递归。
* 复制子数组产生额外 ``O(n log n)`` 累计分配。

本题新增知识
------------

* 中点作为根、高度平衡
* 题号 0108 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0109. Convert Sorted List to Binary Search Tree <0109-convert-sorted-list-to-binary-search-tree.rst>`_；
* `0110. Balanced Binary Tree <0110-balanced-binary-tree.rst>`_；

最小自检
--------

#. ``中点分治`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

数组有序保证左半所有值小于根、右半所有值大于根，递归树满足 BST。两侧长度至多相差 1，递归保持高度差不超过 1。
