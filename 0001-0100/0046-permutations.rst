0046. Permutations
==================

题目信息
--------

:题号: 0046
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

每一层决定一个排列位置
~~~~~~~~~~~~~~~~~~~~~~

排列可以按位置从左到右构造。路径长度为 ``position`` 时，前 ``position`` 个位置已经确定，下一层要从尚未使用的
元素中选择一个放入当前位置。

输入元素互不相同，所以每条完整选择序列都对应一个不同排列。搜索树各层的候选数依次为：

.. code-block:: text

   第 0 位：n 个候选
   第 1 位：n - 1 个候选
   ...
   第 n - 1 位：1 个候选

叶节点数量因此为 ``n!``。问题不在于是否需要枚举这些叶节点，而在于如何高效表示“哪些元素尚未使用”。

直接在路径中检查是否已经选择
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最直接的方法每次考虑一个值时，都在 ``path`` 中查找它是否已经出现。若没有出现，就追加该值并递归；返回后删除
末尾值，让下一个兄弟分支从相同父路径开始。

这种写法完全符合定义，但同一个路径会被反复线性扫描。路径越深，成员检查越长；搜索树本身已经很大，再为每个候选
增加一次 ``O(n)`` 查找会产生不必要的重复工作。

布尔数组把成员检查降为常数时间
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

因为输入下标固定，可以令 ``used[index]`` 表示 ``nums[index]`` 是否已经进入当前路径。选择一个下标时同时执行：

.. code-block:: text

   used[index] = true
   path.push_back(nums[index])

递归返回后执行完全相反的撤销：

.. code-block:: text

   path.pop_back()
   used[index] = false

因此进入每层时，``path`` 中的元素与 ``used`` 中为真的下标始终一一对应。完整路径包含 ``n`` 个不同下标，必然是
输入数组的一个排列；每层又枚举全部未使用下标，所以任意排列对应的逐位置选择都不会被遗漏。

数组前后缀可以直接表达已用与未用
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``used`` 数组只是为了把输入分成两组：已进入排列前缀的元素，以及尚未使用的元素。交换回溯把这两组直接编码在
``nums`` 中：

.. code-block:: text

   nums[0:position]   已确定的排列前缀
   nums[position:n]  尚未使用的候选集合

在第 ``position`` 层，依次把后缀中的每个候选交换到 ``position``。交换完成后，该候选进入已确定前缀，其余元素
仍位于未使用后缀；下一层只需要处理 ``position + 1``。

这不是改变排列问题，而是把“选择某个未使用元素”改写成“把它交换到当前槽位”。布尔标记因此不再需要。

交换为什么必须撤销
~~~~~~~~~~~~~~~~~~

递归返回表示当前候选开头的全部排列已经生成。此时必须执行同一次交换，把数组恢复到进入该分支前的状态，否则下一
候选会在被修改过的后缀上继续搜索，兄弟分支就不再共享同一个候选集合。

例如对 ``[1, 2, 3]``：

.. list-table::
   :header-rows: 1

   * - 当前层
     - 交换
     - 已确定前缀
     - 未使用后缀
   * - ``position = 0``
     - 交换下标 0 与 1
     - ``[2]``
     - ``[1, 3]``
   * - ``position = 1``
     - 不交换
     - ``[2, 1]``
     - ``[3]``
   * - ``position = 2``
     - 不交换
     - ``[2, 1, 3]``
     - ``[]``

记录 ``[2, 1, 3]`` 后，先恢复第二层，再恢复第一层，才能继续生成以其他首元素开头的排列。

为什么交换方法不会重复
~~~~~~~~~~~~~~~~~~~~~~

任意目标排列在第 0 位指定一个唯一元素，交换回溯会在根层选择该元素；固定后，第 1 位又指定剩余后缀中的唯一元素，
依次继续即可到达该排列。

两个不同排列必然存在最早的不同位置。它们在该层选择不同候选，因此进入不同分支，不可能到达同一个叶节点。输入值
互不相同，所以同一层无需像含重复元素的排列问题那样额外去重。

边界情况
~~~~~~~~

* 长度为 1 时，根层只进行一次自身交换，下一层立即记录数组；
* 输入可能包含负数或零，它们只是普通且互不相同的值，不影响搜索结构；
* 公开入口把 ``nums`` 按值传给交换方法，因此生成过程中不会改变调用者持有的原数组；即使直接原地处理，只要每次
  交换都撤销，函数结束时数组也会恢复。

复杂度分析
~~~~~~~~~~

输出共有 ``n!`` 个排列，每个排列包含 ``n`` 个元素，仅复制答案就需要 ``O(n * n!)`` 时间和输出空间，这是任何
完整枚举算法都无法避免的下界。

路径扫描方法还会为候选执行线性成员检查，粗略上界为 ``O(n^2 * n!)``。布尔数组与交换回溯把候选判断降为常数；
考虑输出复制后，时间均为 ``O(n * n!)``。

交换回溯的递归深度为 ``n``，除结果外额外空间为 ``O(n)``；布尔数组方法还维护长度为 ``n`` 的路径和标记，渐进
工作空间同样为 ``O(n)``。
