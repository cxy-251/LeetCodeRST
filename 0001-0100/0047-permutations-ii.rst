0047. Permutations II
=====================

题目信息
--------

:题号: 0047
:难度: Medium
:主题: 数组、回溯、排序、同层去重
:原题: `LeetCode 0047 <https://leetcode.com/problems/permutations-ii/>`_
:重点: 从生成全部下标排列后去重，推导到直接删除等值候选产生的重复子树

题目重述
--------

给定一个可能包含重复值的整数数组 ``nums``，返回所有不同的排列。

每个输入位置在一个排列中必须恰好使用一次。不同下标上的元素即使数值相同，在搜索时仍是两个元素；但若最终得到的
数值序列完全相同，只能保留一个答案。答案顺序不限。

``nums`` 的长度位于 ``[1, 8]``，元素位于 ``[-10, 10]``。

自建示例
--------

两个相同值：

.. code-block:: text

   输入：nums = [2, 2, 3]
   输出：[[2, 2, 3], [2, 3, 2], [3, 2, 2]]

两个 ``2`` 来自不同下标，但交换它们不会改变数值序列，因此只有三种不同排列。

全部相同：

.. code-block:: text

   输入：nums = [4, 4, 4]
   输出：[[4, 4, 4]]

虽然三个下标可以形成 ``3!`` 种下标排列，数值排列只有一种。

没有重复值：

.. code-block:: text

   输入：nums = [1, 3, 5]
   输出数量：6

此时不会触发等值去重，问题退化为普通全排列。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <set>
   #include <unordered_set>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       void generateAll(
           std::vector<int>& nums,
           int position,
           std::set<std::vector<int>>& unique
       ) {
           if (position == static_cast<int>(nums.size())) {
               unique.insert(nums);
               return;
           }

           for (int candidate = position;
                candidate < static_cast<int>(nums.size());
                ++candidate) {
               std::swap(nums[position], nums[candidate]);
               generateAll(nums, position + 1, unique);
               std::swap(nums[position], nums[candidate]);
           }
       }

       std::vector<std::vector<int>> generateThenDeduplicate(
           std::vector<int> nums
       ) {
           std::set<std::vector<int>> unique;
           generateAll(nums, 0, unique);
           return {unique.begin(), unique.end()};
       }

       void swapWithLevelSet(
           std::vector<int>& nums,
           int position,
           std::vector<std::vector<int>>& result
       ) {
           if (position == static_cast<int>(nums.size())) {
               result.push_back(nums);
               return;
           }

           std::unordered_set<int> chosenValues;
           for (int candidate = position;
                candidate < static_cast<int>(nums.size());
                ++candidate) {
               if (!chosenValues.insert(nums[candidate]).second) {
                   continue;
               }
               std::swap(nums[position], nums[candidate]);
               swapWithLevelSet(nums, position + 1, result);
               std::swap(nums[position], nums[candidate]);
           }
       }

       std::vector<std::vector<int>> levelSetBacktracking(
           std::vector<int> nums
       ) {
           std::vector<std::vector<int>> result;
           swapWithLevelSet(nums, 0, result);
           return result;
       }

       void sortedUsedBacktracking(
           const std::vector<int>& nums,
           std::vector<char>& used,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           if (path.size() == nums.size()) {
               result.push_back(path);
               return;
           }

           for (int index = 0;
                index < static_cast<int>(nums.size());
                ++index) {
               if (used[index]) {
                   continue;
               }
               if (index > 0 &&
                   nums[index] == nums[index - 1] &&
                   !used[index - 1]) {
                   continue;
               }

               used[index] = true;
               path.push_back(nums[index]);
               sortedUsedBacktracking(nums, used, path, result);
               path.pop_back();
               used[index] = false;
           }
       }

       std::vector<std::vector<int>> sortedCanonicalOrder(
           std::vector<int> nums
       ) {
           std::sort(nums.begin(), nums.end());
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           std::vector<char> used(nums.size(), false);
           sortedUsedBacktracking(nums, used, path, result);
           return result;
       }

   public:
       std::vector<std::vector<int>> permuteUnique(
           std::vector<int>& nums
       ) {
           return sortedCanonicalOrder(nums);
       }
   };

题解
----

先生成所有下标排列
~~~~~~~~~~~~~~~~~~

最直接的方法与普通全排列相同：第 ``position`` 位从尚未放入前缀的下标中任选一个，通过交换固定当前位置，递归生成
后续位置。

问题在于搜索区分下标，不区分数值。把 ``[2a, 2b, 3]`` 的两个 ``2`` 视为不同元素时，会生成：

.. code-block:: text

   [2a, 2b, 3]
   [2b, 2a, 3]

两条路径的下标顺序不同，最终数值序列却都是 ``[2, 2, 3]``。把所有叶子放入 ``set`` 可以得到正确答案，但重复
排列已经完整生成，连同它们之前的整棵搜索路径都没有节省。

重复的不只是叶子
~~~~~~~~~~~~~~~~

固定相同前缀与当前位置时，若候选 ``2a`` 和 ``2b`` 的值相同，选择任意一个放入当前位置后：

* 新前缀的数值相同；
* 剩余元素的数值多重集合相同；
* 后续能够形成的数值排列集合也完全相同。

因此两个分支不是只在最后碰巧得到相同叶子，而是从分支入口开始就是等价子树。最有效的去重位置应在当前层选择候选
时，而不是在叶子处。

每层集合如何删除重复子树
~~~~~~~~~~~~~~~~~~~~~~~~

``swapWithLevelSet`` 在每一层创建 ``chosenValues``。某个数值第一次作为当前位置候选时进入搜索；同层再次遇到相同
数值时直接跳过。

以 ``[2a, 2b, 3]`` 的根层为例：

.. list-table::
   :header-rows: 1

   * - 候选
     - 本层集合
     - 动作
   * - ``2a``
     - ``{}``
     - 首次选择数值 2，搜索以 2 开头的全部排列
   * - ``2b``
     - ``{2}``
     - 同层已经选择过数值 2，跳过整棵等价子树
   * - ``3``
     - ``{2}``
     - 首次选择数值 3，保留该分支

集合必须是“每层一个”，不能在整个递归过程中共用。根层选择过数值 2，不代表第二层不能再选择另一个 2；否则
``[2, 2, 3]`` 会被错误删除。

排序如何取代每层哈希集合
~~~~~~~~~~~~~~~~~~~~~~~~

另一种方法先排序，使相同值相邻，再使用 ``used[index]`` 表示原数组下标是否已经进入当前路径。

对于相邻的两个相同值，规定一个规范顺序：在任意路径中，必须先使用较早下标的副本，再使用较晚下标的副本。于是
选择 ``nums[index]`` 前，若满足：

.. code-block:: text

   nums[index] == nums[index - 1]
   used[index - 1] == false

说明较早的相同副本仍未使用。此时选择后一个副本，会启动与选择前一个副本完全相同的同层分支，应当跳过。

为什么前一个副本已使用时必须允许当前值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

仍以排序后的 ``[2a, 2b, 3]`` 为例。

根层准备选择 ``2b`` 时，``2a`` 尚未使用，因此 ``2b`` 被跳过，只保留以 ``2a`` 开头的规范分支。

进入第二层后，路径已经是 ``[2a]``，此时 ``used[2a] == true``。选择 ``2b`` 表示在更深位置使用第二个副本，得到
合法前缀 ``[2, 2]``，必须允许。

.. list-table::
   :header-rows: 1

   * - 路径
     - 准备选择
     - 前一个等值副本状态
     - 结果
   * - ``[]``
     - ``2b``
     - ``2a`` 未使用
     - 跳过等价根分支
   * - ``[2a]``
     - ``2b``
     - ``2a`` 已使用
     - 允许组合两个相同值

这正是条件使用 ``!used[index - 1]``，而不是只看到相邻值相等就无条件跳过的原因。

为什么规范顺序不会遗漏排列
~~~~~~~~~~~~~~~~~~~~~~~~~~

任意一个合法数值排列中，相同值的各个位置没有身份差别。可以把它们依次分配给排序后从左到右的相同值下标，得到唯一
的规范下标序列。

这个规范序列在选择后一个相同副本时，前一个副本一定已经出现在路径中，因此不会触发跳过条件。于是每个不同数值排列
至少保留一条路径。

反过来，任何不遵守顺序、在前一个相同副本尚未使用时先选择后一个副本的路径，最终只会生成某条规范路径已经生成的
数值排列。删除这些路径不会减少答案集合。

三种方法删除工作的时机
~~~~~~~~~~~~~~~~~~~~~~

#. ``generateThenDeduplicate`` 生成全部下标排列，只在叶子集合中删除重复答案；
#. ``levelSetBacktracking`` 在每层用哈希集合删除等值候选产生的重复子树；
#. ``sortedCanonicalOrder`` 排序后固定相同值下标的使用顺序，不再为每层创建集合。

公开入口采用第三种方法。它把“同层是否已经选择过这个值”转换成相邻值与 ``used`` 状态的关系，去重判断为常数操作。

复杂度分析
~~~~~~~~~~

设数组长度为 ``n``，各不同数值的出现次数为 ``c_1, c_2, ...``，不同排列数量为：

.. math::

   P=\frac{n!}{c_1!c_2!\cdots}

输出每个排列需要复制 ``n`` 个元素，因此仅输出就需要 ``O(Pn)`` 时间和空间。排序需要 ``O(n\log n)``；主方法的
递归栈、路径与 ``used`` 数组均为 ``O(n)`` 工作空间，不计答案存储。

事后集合方法仍遍历 ``n!`` 个下标排列，并承担集合插入与排列比较成本；两种同层去重方法只展开能够产生不同数值前缀
的分支，重复值越多，节省越明显。
