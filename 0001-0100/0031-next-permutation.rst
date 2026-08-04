0031. Next Permutation
======================

题目信息
--------

:题号: 0031
:难度: Medium
:主题: 数组、字典序、贪心、双指针
:原题: `LeetCode 0031 <https://leetcode.com/problems/next-permutation/>`_
:重点: 从枚举全部排列，推导到寻找最右可增加位置，并以最小增量重排后缀

题目重述
--------

给定整数数组 ``nums``，把它原地变换为由相同元素组成的下一个字典序排列。

比较两个等长数组时，从左向右找到第一个不同位置；该位置元素较大的数组字典序更大。若存在比当前排列更大的
排列，需要得到其中字典序最小的一个。若当前排列已经是全部排列中的最大值，则回绕到字典序最小的排列。

数组可以包含重复值，每个值的出现次数必须保持不变。算法必须直接修改 ``nums``，并且只使用 ``O(1)`` 额外
空间。数组长度位于 ``[1, 100]``，元素位于 ``[0, 100]``。

自建示例
--------

* 普通情况：``[1, 3, 5, 4, 2] -> [1, 4, 2, 3, 5]``；左侧的 ``1`` 保持不变，位置 ``1`` 从 ``3``
  增加为 ``4``，剩余元素采用最小顺序；
* 含重复值：``[1, 2, 2, 3] -> [1, 2, 3, 2]``，两个 ``2`` 都被保留；
* 后继不在相邻位置：``[2, 5, 4, 3, 1] -> [3, 1, 2, 4, 5]``，枢轴 ``2`` 应与后缀中的 ``3`` 交换；
* 已是最大排列：``[4, 3, 3, 1] -> [1, 3, 3, 4]``；
* 最小规模：``[7] -> [7]``，唯一排列同时是最大值与最小值。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       void generateUnique(
           const std::vector<int>& sorted,
           std::vector<char>& used,
           std::vector<int>& path,
           std::vector<std::vector<int>>& permutations
       ) {
           if (path.size() == sorted.size()) {
               permutations.push_back(path);
               return;
           }
           for (int index = 0; index < static_cast<int>(sorted.size()); ++index) {
               if (used[index]) {
                   continue;
               }
               if (index > 0 && sorted[index] == sorted[index - 1] && !used[index - 1]) {
                   continue;
               }
               used[index] = true;
               path.push_back(sorted[index]);
               generateUnique(sorted, used, path, permutations);
               path.pop_back();
               used[index] = false;
           }
       }

       void enumerateAll(std::vector<int>& nums) {
           const std::vector<int> original = nums;
           std::vector<int> sorted = nums;
           std::sort(sorted.begin(), sorted.end());

           std::vector<std::vector<int>> permutations;
           std::vector<char> used(sorted.size(), false);
           std::vector<int> path;
           path.reserve(sorted.size());
           generateUnique(sorted, used, path, permutations);

           const auto current = std::lower_bound(permutations.begin(), permutations.end(), original);
           if (current + 1 == permutations.end()) {
               nums = permutations.front();
           } else {
               nums = *(current + 1);
           }
       }

       void transformLocally(std::vector<int>& nums) {
           int pivot = static_cast<int>(nums.size()) - 2;
           while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) {
               --pivot;
           }

           if (pivot >= 0) {
               int successor = static_cast<int>(nums.size()) - 1;
               while (nums[successor] <= nums[pivot]) {
                   --successor;
               }
               std::swap(nums[pivot], nums[successor]);
           }

           std::reverse(nums.begin() + pivot + 1, nums.end());
       }

   public:
       void nextPermutation(std::vector<int>& nums) {
           transformLocally(nums);
       }
   };

题解
----

枚举全部唯一排列
~~~~~~~~~~~~~~~~

最直接的方法是生成 ``nums`` 中全部不同排列，按字典序排列，找到当前数组后取下一项；若当前位于末尾，则回到
第一项。``enumerateAll`` 先排序元素，再按升序选择每个位置，因此生成顺序本身就是字典序。

重复值需要在同一递归层跳过等价选择。条件
``sorted[index] == sorted[index - 1] && !used[index - 1]`` 表示前一个相同值尚未在当前路径中使用；此时选择后一个
副本只会生成与选择前一个副本完全相同的排列，所以直接跳过。

这套方法完整体现了题意，但排列数量最坏达到 ``n!``，每个排列还需要保存 ``n`` 个元素。真正需要的只有当前排列
之后的一项，生成其余排列是主要浪费。

字典序的首次变化
~~~~~~~~~~~~~~~~

要从当前排列得到一个更大的排列，必然存在一个最左侧首次变化位置。该位置之前的前缀完全相同，该位置的新值必须
更大；一旦这个位置确定，后面的元素只负责让结果尽可能小。

因此，要让增长幅度最小，应尽量让首次变化位置靠右。算法不需要探索全部排列，只需回答两个问题：

#. 最右侧哪个位置仍然能够增大；
#. 增大该位置后，如何让剩余后缀达到最小。

最长非递增后缀
~~~~~~~~~~~~~~~~

从右向左扫描，找到第一个满足 ``nums[pivot] < nums[pivot + 1]`` 的位置。``pivot`` 右侧形成最长非递增后缀。

非递增顺序是这些后缀元素能够组成的最大排列。例如后缀 ``[5, 4, 2]`` 已经比 ``[5, 2, 4]``、
``[4, 5, 2]`` 等其他排列更大。固定 ``pivot`` 左侧前缀后，无论怎样重排该后缀，都不可能得到比当前数组更大的
结果。

所以必须改变后缀左侧的 ``pivot``。它又是从右侧找到的第一个可增加位置，因此比它更靠右的位置全部无法单独
产生更大排列；选择它能保留最长的原前缀。

若扫描后 ``pivot == -1``，整个数组非递增，当前排列已经是全局最大值。此时只需把整个数组反转为非递减顺序，
得到全局最小排列并完成回绕。

最小更大后继
~~~~~~~~~~~~

找到枢轴后，需要用后缀中的一个严格更大值替换 ``nums[pivot]``。选择相等值不会增大排列；选择过大的值会在首次
变化位置造成不必要的字典序跳跃。因此必须选择后缀中严格大于枢轴值的最小元素。

后缀当前按非递增顺序排列。从数组末尾向左寻找，第一个满足 ``nums[successor] > nums[pivot]`` 的元素，就是后缀
中最小的严格更大值。重复值不会破坏这个结论：扫描会跨过所有小于或等于枢轴的元素，停在最靠右的可用值上。

交换后缀仍然非递增
~~~~~~~~~~~~~~~~~~~~

设枢轴值为 ``x``、选中的后继值为 ``y``，其中 ``y > x``。后继右侧的元素都小于或等于 ``x``，否则那里会存在
一个更靠右且仍大于 ``x`` 的候选；后继左侧的元素都大于或等于 ``y``，因为原后缀非递增。

把 ``y`` 换到枢轴后，``x`` 被放入后继位置。此时：

* 后继左侧最后一个值不小于 ``y``，也就大于 ``x``；
* 后继右侧第一个值不大于 ``x``。

因此交换后的整个后缀仍然非递增。这个性质意味着不需要重新排序后缀，只需整体反转，就能得到非递减顺序。

后缀必须降到最小
~~~~~~~~~~~~~~~~

枢轴位置已经完成最小幅度增加。固定新的前缀后，为得到字典序最小的完整结果，剩余元素必须按非递减顺序排列。
由于交换后的后缀仍非递增，``reverse`` 恰好把它变为最小排列，时间为线性且不需要额外数组。

以 ``[1, 3, 5, 4, 2]`` 为例：

.. list-table::
   :header-rows: 1

   * - 阶段
     - 状态
     - 依据
   * - 初始
     - ``[1, 3, 5, 4, 2]``
     - 后缀 ``[5, 4, 2]`` 非递增
   * - 枢轴
     - ``pivot = 1``，值为 ``3``
     - ``3 < 5``，这是最右可增加位置
   * - 后继
     - ``successor = 3``，值为 ``4``
     - ``4`` 是后缀中最小的严格更大值
   * - 交换
     - ``[1, 4, 5, 3, 2]``
     - 首次变化位置完成最小增加
   * - 反转
     - ``[1, 4, 2, 3, 5]``
     - 新前缀下的后缀达到最小

结果为何没有跳过排列
~~~~~~~~~~~~~~~~~~~~

任何比原数组更大的排列，其首次变化位置不可能位于 ``pivot`` 右侧，因为右侧后缀已经是固定前缀下的最大排列。
若首次变化位置位于 ``pivot`` 左侧，它保留的原前缀更短，字典序一定大于算法结果。

首次变化恰好位于 ``pivot`` 时，算法选择可用的最小更大值；选择其他更大值会得到更大的前缀。固定这个新前缀后，
算法又把后缀排列为最小值。因此不存在另一个排列严格位于原数组与算法结果之间。

代码演进
~~~~~~~~

``enumerateAll`` 显式生成全部唯一排列，保存完整搜索空间后再定位相邻项。它直接对应定义，但绝大部分排列与当前
答案无关。

``transformLocally`` 把字典序比较拆成“最长相同前缀、首次增大位置、最小剩余后缀”。最长非递增后缀确定最右
枢轴；从右寻找后继确定枢轴的最小增量；反转后缀则删除通用排序。公开入口采用这一原地线性方法。

复杂度分析
~~~~~~~~~~

设不同排列数量为 ``P``。枚举方法生成并保存每个长度为 ``n`` 的排列，时间与空间均为 ``O(Pn)``，最坏
``P = n!``。

原地方法寻找枢轴、寻找后继和反转后缀都只进行线性扫描，总时间复杂度为 ``O(n)``。除若干下标外不分配与输入
规模相关的存储，额外空间为 ``O(1)``。
