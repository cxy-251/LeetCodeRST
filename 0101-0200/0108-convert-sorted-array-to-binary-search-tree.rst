0108. Convert Sorted Array to Binary Search Tree
================================================

题目信息
--------

:题号: 0108. 将有序数组转换为二叉搜索树
:难度: Easy
:主题: 二叉搜索树、分治、有序数组、高度平衡
:原题: `LeetCode 0108 <https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/>`_
:重点: 从有序区间确定根的可选位置，用中点同时满足 BST 划分与高度平衡，再以索引删除切片复制

题目重述
--------

给定一个严格递增的整数数组 ``nums``，构造一棵高度平衡的二叉搜索树并返回根节点。

二叉搜索树要求任意节点左子树中的值都小于当前值，右子树中的值都大于当前值；高度平衡要求每个节点的左右
子树高度差不超过 ``1``。树的中序遍历应恰好恢复 ``nums``。满足条件的结构可能不唯一，返回任意一种即可。

数组长度在 ``1..10^4`` 范围内，元素值在 ``-10^4..10^4`` 范围内。

自建示例
--------

* 偶数长度：``nums = [-8,-2,1,5,11,16]``，一种合法层序结果是 ``[1,-8,11,null,-2,5,16]``；
* 奇数长度：``nums = [2,4,6,8,10]``，选择 ``6`` 为根可得到左右各两个节点的平衡树；
* 两个元素：``nums = [3,9]``，``[3,null,9]`` 与 ``[9,3]`` 都合法；
* 单元素：``nums = [7]``，返回只含节点 ``7`` 的树。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       TreeNode* buildWithSlices(const std::vector<int>& values) {
           if (values.empty()) {
               return nullptr;
           }
           const int middle = static_cast<int>(values.size() - 1) / 2;
           const std::vector<int> leftValues(values.begin(), values.begin() + middle);
           const std::vector<int> rightValues(values.begin() + middle + 1, values.end());
           TreeNode* root = new TreeNode(values[middle]);
           root->left = buildWithSlices(leftValues);
           root->right = buildWithSlices(rightValues);
           return root;
       }

       TreeNode* buildFromRange(const std::vector<int>& nums, int left, int right) {
           if (left > right) {
               return nullptr;
           }
           const int middle = left + (right - left) / 2;
           TreeNode* root = new TreeNode(nums[middle]);
           root->left = buildFromRange(nums, left, middle - 1);
           root->right = buildFromRange(nums, middle + 1, right);
           return root;
       }

   public:
       TreeNode* sortedArrayToBST(std::vector<int>& nums) {
           return buildFromRange(nums, 0, static_cast<int>(nums.size()) - 1);
       }
   };

题解
----

根的选择空间
~~~~~~~~~~~~

对严格递增数组选择任意元素 ``nums[middle]`` 作为根时，它左侧的全部值都小于根，右侧的全部值都大于根。
只要分别用左右连续区间构造左右子树，BST 的大小关系就会自然成立，中序遍历也会按“左区间、中点、右区间”
恢复原数组。

因此 BST 条件本身没有唯一指定根。若每次选择区间端点，例如依次把递增元素插入普通 BST，所有节点会形成
单侧链；值顺序正确，却不满足高度平衡。新信息来自平衡要求：根必须让左右两侧的元素数量尽量接近。

中点分治
~~~~~~~~

选择当前连续区间的中点后，左右元素数之差最多为 ``1``。对左右区间继续做同样选择，每个子树也由近似
对半的区间构造。``buildWithSlices`` 直接把中点左右的值复制成两个新数组，再递归生成孩子。

这套构造同时保持三个不变量：

* 当前节点值来自区间中点；
* 左右递归只接收中点两侧的连续区间，因此所有值满足 BST 大小关系；
* 每次区间规模近似减半，因此左右递归树高最多相差一层。

最后一项不能只从“左右节点数差一”推断任意两棵树高度相近，而要结合递归也始终取中点。对区间长度归纳：
长度 ``0``、``1`` 显然平衡；更长区间的两侧规模为 ``floor((n - 1) / 2)`` 与
``ceil((n - 1) / 2)``，两侧都按同一规则构造，较大一侧最多比另一侧多进入一个规模层级，所以高度差不超过
``1``，当前根也平衡。

切片的重复搬运
~~~~~~~~~~~~~~

切片让“中点左右分别递归”非常直观，但数组从未改变，复制只是在重复描述边界。平衡分治的每一层合计复制
``O(n)`` 个元素，共有 ``O(log n)`` 层，因此总复制工作为 ``O(n log n)``；真正需要创建的输出节点只有
``n`` 个。

``buildFromRange`` 改为在原数组上传递闭区间 ``[left, right]``。空区间满足 ``left > right``；非空区间
计算 ``middle = left + (right - left) / 2``，再递归处理 ``[left, middle - 1]`` 与
``[middle + 1, right]``。左右数组副本全部消失，每个下标只在成为某个根时读取一次。

中点与多解
~~~~~~~~~~

奇数长度区间只有一个中点；偶数长度区间有两个居中的候选，选择任意一个都会使左右规模差为 ``1``。代码中
的整数除法固定选择左中点，使输出可预测，但题目并不要求特定层序结构。

以 ``[-8,-2,1,5,11,16]`` 为例，初始闭区间 ``[0,5]`` 选择下标 ``2``、值 ``1``；左区间 ``[0,1]``
选择值 ``-8``，右区间 ``[3,5]`` 选择值 ``11``。区间变化如下：

.. list-table::
   :header-rows: 1

   * - 区间
     - 中点值
     - 左区间
     - 右区间
   * - ``[0,5]``
     - 1
     - ``[0,1]``
     - ``[3,5]``
   * - ``[0,1]``
     - -8
     - 空
     - ``[1,1]``
   * - ``[3,5]``
     - 11
     - ``[3,3]``
     - ``[5,5]``

每个单元素区间生成叶节点；空区间返回 ``nullptr``。中序访问这些递归区间时，下标顺序仍为
``0,1,2,3,4,5``，所以既不会遗漏输入值，也不会产生额外值。

主解与复杂度
~~~~~~~~~~~~

公开入口采用索引区间方案，因为它保留中点分治的全部信息，同时删除数组切片。每个元素创建一个节点，时间
为 ``O(n)``；由于每次规模近似减半，递归栈为 ``O(log n)``。返回树本身使用 ``O(n)`` 节点空间，不计入
额外工作空间。切片方案的树同样平衡，但总复制时间为 ``O(n log n)``，峰值还需保存数组副本。
