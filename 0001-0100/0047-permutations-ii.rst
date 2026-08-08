0047. Permutations II
=====================

题目信息
--------

:题号: 0047. 全排列 II
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

下标排列基线
~~~~~~~~~~~~

普通全排列按位置逐层选择尚未使用的下标。交换回溯把数组分成已确定前缀和候选后缀，每层把一个候选交换到当前位置，
递归返回后再交换恢复。

当输入含重复值时，这棵树区分下标，却不区分最终数值序列。把 ``[2a, 2b, 3]`` 的两个 ``2`` 视为不同元素，会同时
生成：

.. code-block:: text

   [2a, 2b, 3]
   [2b, 2a, 3]

两条下标排列不同，数值排列却相同。``generateThenDeduplicate`` 在叶子处把结果放入 ``set``，能够得到正确答案，
但重复分支已经完整展开。

等价子树
~~~~~~~~

固定当前数值前缀和待填写位置后，若两个候选值相同，选择其中任意一个都会得到：

* 相同的新数值前缀；
* 相同的剩余数值多重集合；
* 相同的后续数值排列集合。

重复因此从当前层入口就已经产生，不必等到叶子再处理。去重目标不是禁止相同值出现多次，而是让同一递归层的某个
数值只作为当前位置候选一次。

每层候选集合
~~~~~~~~~~~~

``swapWithLevelSet`` 在每层建立独立的 ``chosenValues``。数值第一次出现时保留分支；同层再次遇到相同值时跳过整棵
等价子树。

对 ``[2a, 2b, 3]`` 的根层：

.. list-table::
   :header-rows: 1

   * - 候选
     - 本层已选数值
     - 动作
   * - ``2a``
     - ``{}``
     - 保留所有以数值 2 开头的排列
   * - ``2b``
     - ``{2}``
     - 跳过等价根分支
   * - ``3``
     - ``{2}``
     - 保留所有以数值 3 开头的排列

集合必须属于当前层。根层选择过数值 ``2``，不代表更深层不能再选择另一个 ``2``；否则合法排列
``[2, 2, 3]`` 会被删除。

排序规范顺序
~~~~~~~~~~~~

排序后，相同值在原数组中的下标相邻。``used[index]`` 表示该下标是否已经进入当前路径。对于一组相同值，规定它们在
任意路径中按排序后的下标顺序使用：较早副本尚未使用时，不允许先选择较晚副本。

对应条件为：

.. code-block:: cpp

   if (index > 0 &&
       nums[index] == nums[index - 1] &&
       !used[index - 1]) {
       continue;
   }

当 ``nums[index]`` 与前一个值相同，且前一个副本尚未进入路径时，二者都位于当前层的候选集合中。选择后一个副本会
产生与选择前一个副本相同的数值前缀和剩余多重集合，因此直接跳过。

若前一个副本已经使用，当前副本位于更深层，必须允许选择。以 ``[2a, 2b, 3]`` 为例：

.. code-block:: text

   路径 []：    2a 未使用，跳过 2b 作为首元素
   路径 [2a]： 2a 已使用，允许 2b 作为第二个元素

这一区别既删除同层等价分支，又保留组合多个相同值的合法路径。

同层规范选择不变量
~~~~~~~~~~~~~~~~~~

进入任意递归层时，``path`` 保存已经确定的数值前缀，``used`` 准确标记对应下标。循环只允许每组尚未使用的相同值中
最靠前的副本作为本层代表。

任意合法数值排列都可以把其中相同值的各次出现，依次分配给排序后从左到右的等值下标。这个规范下标序列在选择较后
副本时，较早副本一定已经出现在路径中，因此不会被去重条件删除，算法不会遗漏答案。

反过来，若两条保留路径生成相同数值排列，观察它们第一次使用不同下标的位置。两个下标上的值必须相同，并且都在
同一递归层候选中。较后的副本在较早副本尚未使用时应被跳过，与路径被保留矛盾。因此每个数值排列只生成一次。

代码演进
~~~~~~~~

``generateThenDeduplicate`` 生成全部下标排列，只在叶子集合中删除重复结果。

``levelSetBacktracking`` 在每层用哈希集合阻止同值候选进入等价子树。

``sortedCanonicalOrder`` 通过排序和 ``used`` 状态固定等值副本的使用顺序，将同层集合判断压缩为常数条件。公开入口
采用该方法。

复杂度分析
~~~~~~~~~~

设数组长度为 ``n``，各不同数值的出现次数为 ``c_1, c_2, ...``，不同排列数量为：

.. math::

   P=\frac{n!}{c_1!c_2!\cdots}

输出每个排列需要复制 ``n`` 个元素，仅输出就需要 ``O(Pn)`` 时间和空间。排序需要 ``O(n\log n)``；主方法的
递归栈、路径与 ``used`` 数组均为 ``O(n)`` 工作空间，不计答案存储。

事后集合方法仍遍历 ``n!`` 个下标排列，并承担集合插入与排列比较成本；两种同层去重方法只展开能够产生不同数值前缀
的分支，重复值越多，节省越明显。
