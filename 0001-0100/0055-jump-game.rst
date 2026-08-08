0055. Jump Game
===============

题目信息
--------

:题号: 0055. 跳跃游戏
:难度: Medium
:主题: 数组、动态规划、贪心、可达区间
:原题: `LeetCode 0055 <https://leetcode.com/problems/jump-game/>`_
:重点: 从枚举所有落点序列，推导到只维护可达前缀的最右边界

题目重述
--------

给定一个非负整数数组 ``nums``。开始时位于下标 ``0``；位于下标 ``i`` 时，可以向右跳到任意满足
``i < next <= i + nums[i]`` 的下标。

判断是否能够到达最后一个下标。数组只有一个元素时，起点已经是终点。

约束为 ``1 <= nums.length <= 10^4``、``0 <= nums[i] <= 10^5``。

自建示例
--------

.. code-block:: text

   输入：nums = [2,0,2,0,1]
   输出：true
   解释：可以按 0 -> 2 -> 4 到达终点。

.. code-block:: text

   输入：nums = [3,2,1,0,4]
   输出：false
   解释：下标 0 到 3 可达，但这些位置都无法把范围扩展到下标 4。

.. code-block:: text

   输入：nums = [0]
   输出：true
   解释：起点已经是终点，不需要跳跃。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       bool exhaustiveDfs(const std::vector<int>& nums, int index) {
           const int last = static_cast<int>(nums.size()) - 1;
           if (index == last) {
               return true;
           }

           const int end = std::min(last, index + nums[index]);
           for (int next = index + 1; next <= end; ++next) {
               if (exhaustiveDfs(nums, next)) {
                   return true;
               }
           }
           return false;
       }

       bool exhaustiveSearch(const std::vector<int>& nums) {
           return exhaustiveDfs(nums, 0);
       }

       bool explicitReachability(const std::vector<int>& nums) {
           const int n = static_cast<int>(nums.size());
           std::vector<char> reachable(n, false);
           reachable[0] = true;

           for (int index = 0; index < n; ++index) {
               if (!reachable[index]) {
                   continue;
               }

               const int end = std::min(n - 1, index + nums[index]);
               for (int next = index + 1; next <= end; ++next) {
                   reachable[next] = true;
               }
           }
           return reachable[n - 1];
       }

       bool farthestReach(const std::vector<int>& nums) {
           const int last = static_cast<int>(nums.size()) - 1;
           int farthest = 0;

           for (int index = 0; index <= last; ++index) {
               if (index > farthest) {
                   return false;
               }

               const int reach = std::min(last, index + nums[index]);
               farthest = std::max(farthest, reach);
               if (farthest == last) {
                   return true;
               }
           }
           return true;
       }

   public:
       bool canJump(std::vector<int>& nums) {
           return farthestReach(nums);
       }
   };

题解
----

落点枚举基线
~~~~~~~~~~~~

从下标 ``index`` 出发，可以枚举区间
``[index + 1, min(last, index + nums[index])]`` 中的每个落点，再递归判断后续是否可达。

任意合法路径的下一跳都在该区间中，所以完整枚举不会漏解。到达最后一个下标时返回真；若所有分支都失败，
当前状态才失败。

不同路径可能反复到达同一个下标，而“从该下标能否到终点”与此前路径无关。直接递归会重复展开相同后缀，
最坏产生指数级搜索树。

显式可达状态
~~~~~~~~~~~~

把重复状态改为从左到右传播可达性：

.. code-block:: text

   reachable[i] = 是否存在一条从 0 到 i 的路径

``reachable[0]`` 为真。若 ``i`` 可达，则它能到达的整个右侧区间都应标记为真。

这种动态规划把每个下标是否可达保存一次，却仍可能从许多起点反复写入同一段区间。最坏情况下，前面的每个位置
都能覆盖大量后继，时间仍为 ``O(n^2)``，并使用 ``O(n)`` 状态数组。

可达前缀不变量
~~~~~~~~~~~~~~

显式状态还包含更强的结构：可达位置始终构成连续前缀。

初始可达集合是 ``[0, 0]``。若已经确认 ``[0, farthest]`` 全部可达，扫描其中任意下标 ``i`` 时，
它新增的覆盖范围为 ``[i + 1, i + nums[i]]``。这个区间从现有前缀内部或紧邻右侧开始，与原前缀合并后
仍然是前缀，只会改变最右端点。

因此进入每次循环时保持：

.. code-block:: text

   [0, farthest] 中的所有下标都可达
   farthest 是此前已处理可达位置能够覆盖的最右下标

当 ``index <= farthest`` 时，当前位置真实可达，可以安全更新：

.. code-block:: text

   farthest = max(farthest, index + nums[index])

代码把结果截断到 ``last``，因为超过终点的距离不再提供额外信息。

当 ``index > farthest`` 时，此前所有可达位置都无法到达 ``index``。更右侧位置也不可能被跨越后突然到达：
若某个可达位置能够跳到更远的 ``next``，由于跳跃距离可以小于上限，它也必然能够先到达 ``index``。
因此第一个断点出现后即可返回 ``false``，而断点右侧的 ``nums`` 值没有资格参与边界扩展。

算法也不需要选择具体落点。它等价于把所有已知可达位置的跳跃区间取并集，并只保留并集右端点。
任意真实路径经过的落点都在这个前缀内，扫描到它时，其跳跃能力自然会参与更新。

状态演化
~~~~~~~~

对 ``nums = [3,2,1,0,4]``：

.. list-table::
   :header-rows: 1

   * - 下标
     - 旧 ``farthest``
     - 当前覆盖终点
     - 新 ``farthest``
   * - 0
     - 0
     - 3
     - 3
   * - 1
     - 3
     - 3
     - 3
   * - 2
     - 3
     - 3
     - 3
   * - 3
     - 3
     - 3
     - 3
   * - 4
     - 3
     - 不可达，不能使用 ``nums[4]``
     - 失败

下标 ``4`` 的值虽然很大，但到达该位置本身尚未成立，因此不能用它扩展范围。

边界情况
~~~~~~~~

单元素数组初始时 ``farthest == last == 0``，公开方法在扫描第一个位置后立即返回真。

值为 ``0`` 的位置不一定形成障碍。只要此前某个可达位置已经把边界扩展到它之后，扫描仍可继续；只有最远边界
停在某个位置且无法再向右扩展时，才会形成断点。

本题只判断可达性，一个最远边界已经足够。若要求最少跳跃次数，还必须区分“当前跳数覆盖到哪里”和
“再跳一次覆盖到哪里”，不能压缩成单一边界。

复杂度分析
~~~~~~~~~~

朴素递归最坏为指数级时间，递归深度为 ``O(n)``。显式可达状态最坏为 ``O(n^2)`` 时间、``O(n)`` 空间。

主方法顺序扫描一次，每个位置只做常数次比较和更新，时间为 ``O(n)``，额外空间为 ``O(1)``。
