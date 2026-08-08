0046. Permutations
==================

题目信息
--------

:题号: 0046. 全排列
:难度: Medium
:主题: 数组、回溯、排列、原地交换
:原题: `LeetCode 0046 <https://leetcode.com/problems/permutations/>`_
:重点: 从路径成员检查，推导到已用标记，再把未使用集合编码为数组后缀

题目重述
--------

给定一个元素互不相同的整数数组 ``nums``，返回它的所有排列。

每个排列必须包含全部输入元素，并且每个元素恰好出现一次。答案可以按任意顺序返回。

``nums`` 的长度位于 ``[1, 6]``，元素位于 ``[-10, 10]``，并且所有元素互不相同。

自建示例
--------

三个元素：

.. code-block:: text

   输入：nums = [1, 2, 3]
   输出：
   [[1, 2, 3],
    [1, 3, 2],
    [2, 1, 3],
    [2, 3, 1],
    [3, 1, 2],
    [3, 2, 1]]

第一位有 3 种选择；固定第一位后，第二位有 2 种选择；最后一位只能放剩余元素，所以共有
``3 x 2 x 1 = 6`` 个排列。

单个元素：

.. code-block:: text

   输入：nums = [-4]
   输出：[[-4]]

长度为 1 时，唯一排列就是数组本身。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       void scanPathDfs(
           const std::vector<int>& nums,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           if (path.size() == nums.size()) {
               result.push_back(path);
               return;
           }

           for (int value : nums) {
               if (std::find(path.begin(), path.end(), value) != path.end()) {
                   continue;
               }
               path.push_back(value);
               scanPathDfs(nums, path, result);
               path.pop_back();
           }
       }

       std::vector<std::vector<int>> scanCurrentPath(
           const std::vector<int>& nums
       ) {
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           scanPathDfs(nums, path, result);
           return result;
       }

       void usedArrayDfs(
           const std::vector<int>& nums,
           std::vector<char>& used,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           if (path.size() == nums.size()) {
               result.push_back(path);
               return;
           }

           for (int index = 0; index < static_cast<int>(nums.size()); ++index) {
               if (used[index]) {
                   continue;
               }
               used[index] = true;
               path.push_back(nums[index]);
               usedArrayDfs(nums, used, path, result);
               path.pop_back();
               used[index] = false;
           }
       }

       std::vector<std::vector<int>> usedArray(
           const std::vector<int>& nums
       ) {
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           std::vector<char> used(nums.size(), false);
           usedArrayDfs(nums, used, path, result);
           return result;
       }

       void swapDfs(
           std::vector<int>& nums,
           int position,
           std::vector<std::vector<int>>& result
       ) {
           if (position == static_cast<int>(nums.size())) {
               result.push_back(nums);
               return;
           }

           for (int candidate = position;
                candidate < static_cast<int>(nums.size());
                ++candidate) {
               std::swap(nums[position], nums[candidate]);
               swapDfs(nums, position + 1, result);
               std::swap(nums[position], nums[candidate]);
           }
       }

       std::vector<std::vector<int>> swapBacktracking(
           std::vector<int> nums
       ) {
           std::vector<std::vector<int>> result;
           swapDfs(nums, 0, result);
           return result;
       }

   public:
       std::vector<std::vector<int>> permute(std::vector<int>& nums) {
           return swapBacktracking(nums);
       }
   };

题解
----

位置选择树
~~~~~~~~~~

排列按位置从左向右构造。路径长度为 ``position`` 时，前 ``position`` 个位置已经确定，当前层需要从尚未使用的
元素中选择一个放入下一位置。

输入元素互不相同，因此每条完整选择序列对应一个唯一排列。各层候选数依次为 ``n, n-1, ..., 1``，叶节点数量为
``n!``。全部叶节点都必须输出，优化重点只能放在“未使用元素”的表示和查询上。

路径成员检查
~~~~~~~~~~~~

``scanCurrentPath`` 每次考虑一个值时，都在 ``path`` 中查找它是否已经出现。未出现时将其加入路径，递归结束后再
删除末尾元素，使下一个兄弟分支从相同父状态开始。

这种写法直接对应题意，也不会遗漏排列。它的问题是同一条路径会被反复线性扫描，深度越大，成员检查越昂贵。

已用标记
~~~~~~~~

输入下标固定，可以令 ``used[index]`` 表示 ``nums[index]`` 是否已经进入当前路径。选择下标时执行：

.. code-block:: text

   used[index] = true
   path.push_back(nums[index])

递归返回后执行相反操作：

.. code-block:: text

   path.pop_back()
   used[index] = false

进入任意递归层时，``path`` 中的元素与 ``used`` 中为真的下标始终一一对应。路径长度达到 ``n`` 时，所有下标都被
使用一次，因此得到合法排列；每层枚举全部未使用下标，所以任意目标排列的逐位置选择都不会被跳过。

前缀后缀不变量
~~~~~~~~~~~~~~

``used`` 数组只是把输入分成“已使用”和“未使用”两组。交换回溯直接把这两组编码在数组中：

.. code-block:: text

   nums[0:position]   已确定的排列前缀
   nums[position:n]  尚未使用的候选集合

在第 ``position`` 层，循环把后缀中的每个候选依次交换到 ``position``。交换后，该元素进入已确定前缀，其余元素仍
留在未使用后缀；下一层只处理 ``position + 1``。

递归返回后必须执行同一次交换恢复数组。恢复后，兄弟分支重新看到相同的前缀和候选集合，因此搜索树各分支彼此独立。
这一“选择—递归—撤销”过程始终保持前缀与后缀的分界。

任意目标排列在当前位置指定一个唯一元素。该元素必定位于当前后缀中，循环会把它交换到当前位置；逐层继续即可到达
该排列。两个不同排列存在最早的不同位置，并会在该层选择不同候选，因此进入不同分支。输入值互不相同，同一层无需
额外去重。

状态演化
~~~~~~~~

对 ``[1, 2, 3]``，生成前缀 ``[2, 1]`` 的过程为：

.. list-table::
   :header-rows: 1

   * - 当前层
     - 交换
     - 已确定前缀
     - 未使用后缀
   * - ``position = 0``
     - 下标 0 与 1
     - ``[2]``
     - ``[1, 3]``
   * - ``position = 1``
     - 下标 1 与 1
     - ``[2, 1]``
     - ``[3]``
   * - ``position = 2``
     - 下标 2 与 2
     - ``[2, 1, 3]``
     - ``[]``

记录叶节点后，先恢复第二层，再恢复第一层，随后才能生成其他前缀对应的排列。

代码演进
~~~~~~~~

``scanCurrentPath`` 直接在当前路径中检查成员，语义最直观，但每次候选判断都需要线性搜索。

``usedArray`` 用布尔数组把成员查询降为常数时间，并显式维护路径与已用集合。

``swapBacktracking`` 进一步把已用集合编码为数组前缀，把未用集合编码为数组后缀，不再需要额外标记。公开入口采用该
方法。参数按值传入，因此生成过程中不会修改调用者持有的原数组。

复杂度分析
~~~~~~~~~~

输出共有 ``n!`` 个排列，每个排列包含 ``n`` 个元素，仅复制答案就需要 ``O(n * n!)`` 时间和输出空间。

路径扫描方法还为候选执行线性成员检查，粗略上界为 ``O(n^2 * n!)``。布尔标记与交换回溯的候选判断为常数，
考虑答案复制后，时间均为 ``O(n * n!)``。

交换回溯的递归深度为 ``n``，除结果外额外空间为 ``O(n)``；布尔数组方法维护路径和标记，工作空间同样为
``O(n)``。
