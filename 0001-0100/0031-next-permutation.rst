0031. Next Permutation
======================

题目信息
--------

:题号: 0031
:难度: Medium
:主题: 数组、字典序、贪心、双指针
:原题: `LeetCode 0031 <https://leetcode.com/problems/next-permutation/>`_
:重点: 从枚举全部排列，推导到定位最右可增加位置，并以最小增量重排后缀

题目重述
--------

给定整数数组 ``nums``，把它原地变换为由相同元素组成的下一个字典序排列。

比较两个等长数组时，从左向右找到第一个不同位置；该位置元素较大的数组字典序更大。若存在比当前排列更大的
排列，需要得到其中字典序最小的一个。若当前排列已经是全部排列中的最大值，则回绕到字典序最小的排列。

数组可以包含重复值，每个值的出现次数必须保持不变。算法必须直接修改 ``nums``，并且只使用 ``O(1)`` 额外
空间。数组长度位于 ``[1, 100]``，元素位于 ``[0, 100]``。

自建示例
--------

.. code-block:: text

   输入：[1, 3, 5, 4, 2]
   输出：[1, 4, 2, 3, 5]

位置 1 从 ``3`` 增加为后缀中最小的更大值 ``4``，其余元素按最小顺序排列。

.. code-block:: text

   输入：[1, 2, 2, 3]
   输出：[1, 2, 3, 2]

重复元素的数量保持不变。

.. code-block:: text

   输入：[4, 3, 3, 1]
   输出：[1, 3, 3, 4]

原数组已经是最大排列，因此回绕到最小排列。

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
               if (index > 0 &&
                   sorted[index] == sorted[index - 1] &&
                   !used[index - 1]) {
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

           const auto current = std::lower_bound(
               permutations.begin(),
               permutations.end(),
               original
           );
           nums = current + 1 == permutations.end()
               ? permutations.front()
               : *(current + 1);
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

全排列基线
~~~~~~~~~~

最直接的方法是生成全部不同排列，按字典序找到当前数组，再取紧随其后的排列；当前数组位于末尾时回到第一项。
``enumerateAll`` 先排序元素，再按升序选择每个位置，因此叶节点天然按字典序生成。

数组可能包含重复值。若同一递归层中前一个相同值尚未使用，再选择后一个副本只会生成等价分支，所以通过
``sorted[index] == sorted[index - 1] && !used[index - 1]`` 删除重复排列。

该方法完整覆盖定义，却会生成和保存全部排列。不同排列数量最坏达到 ``n!``，而目标只需要当前排列之后的一项。
继续优化的关键是直接构造最小的更大排列。

最右变化位置
~~~~~~~~~~~~

字典序由第一个不同位置决定。要让结果只比当前排列大一点，应尽量保留更长的原前缀，也就是让首次变化位置尽量
靠右。

从右向左扫描，找到第一个满足：

.. code-block:: text

   nums[pivot] < nums[pivot + 1]

的位置。``pivot`` 右侧因此是最长非递增后缀。

非递增后缀已经是这些元素能够组成的最大排列。固定 ``pivot`` 左侧前缀后，单独重排这个后缀不可能得到更大结果，
所以必须增加 ``nums[pivot]``。由于 ``pivot`` 是最右侧仍可增加的位置，选择它能够保留最长前缀。

若不存在这样的 ``pivot``，整个数组都是非递增序列，当前排列就是全局最大值。把整个数组反转为非递减序列，
即可得到全局最小排列并完成回绕。

枢轴最小增量
~~~~~~~~~~~~

找到枢轴后，需要从后缀中选一个严格大于 ``nums[pivot]`` 的值。选择相等值不会增大排列，选择更大的候选又会在
首次变化位置产生不必要的跳跃，因此必须选择后缀中最小的严格更大值。

后缀按非递增顺序排列，从数组末尾向左扫描时，第一个满足
``nums[successor] > nums[pivot]`` 的元素正是所需后继。重复值不会影响这个结论：扫描会越过所有小于或等于
枢轴的元素，停在最靠右的可用值上。

交换后，枢轴位置完成了最小幅度的增加。任何首次变化位于枢轴左侧的排列都会更大；任何在枢轴处选择更大后继的
排列也会更大。因此剩下的任务只有一个：在已经确定的新前缀下，把后缀排列到最小。

后缀最小化
~~~~~~~~~~

设枢轴旧值为 ``x``，后继值为 ``y``。原后缀非递增，并且 ``y`` 是最靠右的严格更大值，所以：

* ``y`` 左侧的后缀元素都不小于 ``y``；
* ``y`` 右侧的元素都不大于 ``x``。

交换后，``x`` 被放到 ``y`` 的旧位置，整个后缀仍保持非递增。非递增序列的反转就是非递减序列，也就是同一
批元素能够组成的最小排列。因此无需排序，只需执行：

.. code-block:: cpp

   std::reverse(nums.begin() + pivot + 1, nums.end());

算法由此同时满足三层最小性：首次变化位置最靠右、枢轴增量最小、剩余后缀最小。不存在其他排列严格位于原数组
与结果之间。

状态演化
~~~~~~~~

对 ``[1, 3, 5, 4, 2]``：

.. list-table::
   :header-rows: 1

   * - 阶段
     - 数组状态
     - 结构
   * - 初始
     - ``[1, 3, 5, 4, 2]``
     - 最长非递增后缀为 ``[5, 4, 2]``
   * - 枢轴
     - ``pivot = 1``，值为 ``3``
     - 最右可增加位置
   * - 后继
     - ``successor = 3``，值为 ``4``
     - 后缀中最小的严格更大值
   * - 交换
     - ``[1, 4, 5, 3, 2]``
     - 枢轴完成最小增量
   * - 反转
     - ``[1, 4, 2, 3, 5]``
     - 后缀变为最小排列

复杂度分析
~~~~~~~~~~

设不同排列数量为 ``P``。全排列方法生成并保存每个长度为 ``n`` 的排列，时间和空间均为 ``O(Pn)``，最坏
``P = n!``。

主方法寻找枢轴、寻找后继和反转后缀都只进行线性扫描，总时间为 ``O(n)``。除少量下标外不分配与输入规模相关的
存储，额外空间为 ``O(1)``。
