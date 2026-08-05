0078. Subsets
=============

题目信息
--------

:题号: 0078
:难度: Medium
:主题: 回溯、位掩码、迭代扩展、幂集
:原题: `LeetCode 0078 <https://leetcode.com/problems/subsets/>`_
:重点: 从逐个元素二选一，推导到递增下标回溯与迭代倍增

题目重述
--------

给定一个元素互不相同的整数数组 ``nums``，返回由这些元素组成的全部子集。

每个元素在一个子集中最多使用一次。结果必须包含空集与全集，不能出现重复子集，
子集内部顺序和答案整体顺序均不限。

约束如下：

* ``1 <= nums.length <= 10``；
* ``-10 <= nums[i] <= 10``；
* ``nums`` 中所有元素互不相同。

自建示例
--------

.. code-block:: text

   输入：nums = [2,5,9]
   输出：[[],[2],[5],[9],[2,5],[2,9],[5,9],[2,5,9]]

三个元素分别可以选择或不选择，因此共有 ``2^3 = 8`` 个子集。

.. code-block:: text

   输入：nums = [-1,4]
   输出：[[],[-1],[4],[-1,4]]

空集同样是合法子集，负数不会改变枚举规则。

.. code-block:: text

   输入：nums = [7]
   输出：[[],[7]]

单个元素只有不选择与选择两种状态。

C++ 实现
--------

.. code-block:: cpp

   #include <cstddef>
   #include <vector>

   class Solution {
   private:
       std::vector<std::vector<int>> bitmaskEnumeration(
           const std::vector<int>& nums
       ) {
           const int n = static_cast<int>(nums.size());
           const int total = 1 << n;
           std::vector<std::vector<int>> result;
           result.reserve(total);

           for (int mask = 0; mask < total; ++mask) {
               std::vector<int> subset;
               for (int bit = 0; bit < n; ++bit) {
                   if ((mask & (1 << bit)) != 0) {
                       subset.push_back(nums[bit]);
                   }
               }
               result.push_back(subset);
           }
           return result;
       }

       void binaryDecisionDfs(
           const std::vector<int>& nums,
           int index,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           if (index == static_cast<int>(nums.size())) {
               result.push_back(path);
               return;
           }

           binaryDecisionDfs(nums, index + 1, path, result);

           path.push_back(nums[index]);
           binaryDecisionDfs(nums, index + 1, path, result);
           path.pop_back();
       }

       std::vector<std::vector<int>> binaryDecision(
           const std::vector<int>& nums
       ) {
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           result.reserve(1U << nums.size());
           binaryDecisionDfs(nums, 0, path, result);
           return result;
       }

       void increasingIndexDfs(
           const std::vector<int>& nums,
           int start,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           result.push_back(path);

           for (int index = start;
                index < static_cast<int>(nums.size());
                ++index) {
               path.push_back(nums[index]);
               increasingIndexDfs(nums, index + 1, path, result);
               path.pop_back();
           }
       }

       std::vector<std::vector<int>> increasingIndexBacktracking(
           const std::vector<int>& nums
       ) {
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           result.reserve(1U << nums.size());
           increasingIndexDfs(nums, 0, path, result);
           return result;
       }

       std::vector<std::vector<int>> iterativeExpansion(
           const std::vector<int>& nums
       ) {
           std::vector<std::vector<int>> result(1);
           result.reserve(1U << nums.size());

           for (int value : nums) {
               const std::size_t old_size = result.size();
               for (std::size_t index = 0; index < old_size; ++index) {
                   std::vector<int> next = result[index];
                   next.push_back(value);
                   result.push_back(next);
               }
           }
           return result;
       }

   public:
       std::vector<std::vector<int>> subsets(std::vector<int>& nums) {
           return increasingIndexBacktracking(nums);
       }
   };

题解
----

二元选择
~~~~~~~~

每个元素只有两种状态：加入子集，或不加入子集。``n`` 个独立的二元选择形成
``2^n`` 个结果，这也是答案数量无法进一步减少的原因。

位掩码直接把第 ``i`` 位解释为是否选择 ``nums[i]``。从 ``0`` 枚举到
``2^n-1``，每个二进制模式都唯一对应一个子集。该方法结构直接，但每个掩码都要重新扫描
全部 ``n`` 个位置。

二叉决策树
~~~~~~~~~~

递归也可直接表达二元选择。处理下标 ``index`` 时，先进入“不选择当前元素”的分支，
再把当前元素加入 ``path``，进入“选择当前元素”的分支。

只有处理完全部元素时才提交路径，因此二叉树的 ``2^n`` 个叶子分别对应全部子集。
选择分支返回后执行 ``pop_back``，恢复父节点的路径状态。

递增下标回溯
~~~~~~~~~~~~

另一种回溯方式把当前路径本身立即视为一个答案，再枚举下一项可以选择的下标。
``start`` 表示下一次选择的最小下标；选择 ``index`` 后递归到 ``index+1``，所以路径中的
输入下标始终严格递增。

空路径在根节点被提交，因此空集自然进入答案。每次增加一个元素后形成的新路径也立即提交，
所以内部节点和叶子节点都会产生子集。

唯一生成
~~~~~~~~

任意子集都有唯一的输入下标递增序列。递增下标回溯只沿这种规范顺序选择元素，
同一个集合不会以不同排列再次生成。

输入元素互不相同，因此不同的下标集合必然对应不同的值集合，无需排序或额外去重结构。

迭代倍增
~~~~~~~~

初始结果只含空集。处理新元素 ``value`` 时，已有子集分成两类：

* 不含 ``value`` 的旧子集；
* 在每个旧子集后加入 ``value`` 得到的新子集。

因此每处理一个元素，结果数量翻倍。循环开始时保存 ``old_size``，只复制本轮之前已经存在的
子集，避免继续遍历刚追加的新子集。

.. list-table::
   :header-rows: 1

   * - 已处理元素
     - 旧子集
     - 本轮新增
   * - 无
     - ``[]``
     - 无
   * - ``2``
     - ``[]``
     - ``[2]``
   * - ``2,5``
     - ``[]``, ``[2]``
     - ``[5]``, ``[2,5]``
   * - ``2,5,9``
     - 前四个子集
     - 前四个子集分别加入 ``9``

路径快照
~~~~~~~~

回溯过程始终复用同一个 ``path``。提交答案时必须复制当前内容；随后执行的选择和撤销只修改
工作路径，不会影响已保存的子集。

复杂度
~~~~~~

共有 ``2^n`` 个子集，所有子集包含的元素总数为 ``n * 2^(n-1)``，因此完整输出至少需要
``Theta(n * 2^n)`` 时间与输出空间。

四种方法的时间复杂度均为 ``O(n * 2^n)``。除返回结果外，位掩码和迭代方法的临时子集最长为
``O(n)``；两种递归方法的路径与调用栈为 ``O(n)``。
