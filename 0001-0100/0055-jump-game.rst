0055. Jump Game
===============

题目信息
--------

:题号: 0055
:难度: Medium
:主题: 数组、动态规划、贪心、可达区间
:原题: `LeetCode 0055 <https://leetcode.com/problems/jump-game/>`_
:重点: 从枚举所有落点序列，推导到只维护可达前缀的最右边界

题目重述
--------

给定一个非负整数数组 ``nums``。开始时位于下标 0；位于下标 ``i`` 时，可以向右跳到任意满足
``i < next <= i + nums[i]`` 的下标。

判断是否能够到达最后一个下标。数组只有一个元素时，起点已经是终点。

约束为 ``1 <= nums.length <= 10^4``、``0 <= nums[i] <= 10^5``。

自建示例
--------

.. code-block:: text

   输入：nums = [2,0,2,0,1]
   输出：true

可以按 ``0 -> 2 -> 4`` 到达终点。下标 1 和 3 的值为 0，并不影响这条路径。

.. code-block:: text

   输入：nums = [3,2,1,0,4]
   输出：false

起点能够覆盖下标 0 到 3，但这些位置都无法把可达范围扩展到下标 4。

.. code-block:: text

   输入：nums = [0]
   输出：true

不需要执行任何跳跃。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       bool exhaustiveDfs(const std::vector<int>& nums, int index) {
           const int last = static_cast<int>(nums.size()) - 1;
           if (index == last) return true;

           int end = std::min(last, index + nums[index]);
           for (int next = index + 1; next <= end; ++next) {
               if (exhaustiveDfs(nums, next)) return true;
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
               if (!reachable[index]) continue;

               int end = std::min(n - 1, index + nums[index]);
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
               if (index > farthest) return false;

               int reach = std::min(last, index + nums[index]);
               farthest = std::max(farthest, reach);
               if (farthest == last) return true;
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

从定义出发：枚举下一次落点
~~~~~~~~~~~~~~~~~~~~~~~~~~

位于下标 ``index`` 时，最直接的做法是枚举所有合法的 ``next``，递归判断其中是否存在一条分支能够到达
终点。

``exhaustiveSearch`` 完整对应题意：每条根到叶路径就是一种落点序列；只要任意分支到达最后一个下标，答案
就是 ``true``。

这个搜索会重复处理相同状态。例如不同跳法都可能到达下标 4，而“从下标 4 能否到终点”只取决于下标 4，
与此前路径无关。数组中大量重叠路径会使朴素递归产生指数级搜索树。

显式记录每个位置是否可达
~~~~~~~~~~~~~~~~~~~~~~~~

可以令：

.. code-block:: text

   reachable[i] = 是否存在一条从 0 到 i 的跳跃路径

起点 ``reachable[0]`` 为真。若下标 ``i`` 可达，那么区间
``[i + 1, min(n - 1, i + nums[i])]`` 中的所有位置也都可达。

``explicitReachability`` 只处理每个下标一次，消除了递归对同一状态的重复求解。但多个可达位置覆盖的区间会
大量重叠，同一个 ``reachable[next]`` 仍可能被反复写入；最坏时间为 ``O(n²)``，空间为 ``O(n)``。

可达状态为什么可以压缩成一个边界
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

这里存在比布尔数组更强的结构：所有可达位置始终形成一个连续前缀。

初始只有下标 0 可达，可达集合是前缀 ``[0,0]``。假设当前已经确认 ``[0,farthest]`` 全部可达；扫描其中
任意可达下标 ``i`` 时，它能够新增的也是连续区间 ``[i+1,i+nums[i]]``。这个区间从已有前缀内部或紧邻其
右侧开始，因此合并后仍是一个前缀，只可能把右边界向右扩展。

所以整张 ``reachable`` 表可以压缩为一个整数：

.. code-block:: text

   farthest = 已确认可达前缀的最右下标

扫描下标前的不变量
~~~~~~~~~~~~~~~~~~

准备处理 ``index`` 时，``farthest`` 表示此前所有已处理可达位置能够覆盖到的最右端，并且
``[0,farthest]`` 中每个下标都真实可达。

若 ``index <= farthest``，当前位置位于可达前缀内，可以用它把边界更新为：

.. code-block:: text

   farthest = max(farthest, index + nums[index])

代码把右端限制在 ``last``，因为超过终点的距离对可达性没有额外信息。

为什么越过边界后不可能恢复
~~~~~~~~~~~~~~~~~~~~~~~~~~

若出现 ``index > farthest``，说明此前所有可达位置都无法到达 ``index``。

更右侧位置也不可能突然可达。因为跳跃长度是“至多” ``nums[i]``：若某个更早位置能够直接跳到
``next > index``，它也一定能够选择更短距离跳到 ``index``。既然 ``index`` 已经超出所有可达位置的最大
覆盖范围，就不存在能够跨过这个断点的跳跃。

后面的下标本身还没有被到达，它们的 ``nums`` 值不能用来扩展范围。因此遇到第一个断点即可立即返回
``false``。

失败示例的状态演化
~~~~~~~~~~~~~~~~~~

对 ``nums = [3,2,1,0,4]``：

.. list-table::
   :header-rows: 1

   * - 下标
     - ``nums[index]``
     - 旧 ``farthest``
     - 当前位置能到达
     - 新 ``farthest``
   * - 0
     - 3
     - 0
     - 3
     - 3
   * - 1
     - 2
     - 3
     - 3
     - 3
   * - 2
     - 1
     - 3
     - 3
     - 3
   * - 3
     - 0
     - 3
     - 3
     - 3
   * - 4
     - 4
     - 3
     - 未到达，不能使用
     - 失败

下标 4 的值虽然很大，但算法不能用它扩展边界，因为到达该位置本身就是尚未满足的前提。

为什么不需要实际选择落点
~~~~~~~~~~~~~~~~~~~~~~~~

贪心算法没有承诺“下一跳落在哪里”。它把所有已知可达位置的跳跃区间取并集，只保留这个并集的最右边界。

任意真实路径上的落点都位于可达前缀中；扫描到该落点时，它的跳跃能力会参与边界扩展。因此压缩掉具体路径
不会漏掉某种更优选择。

这也解释了值为 0 的位置何时构成障碍：单个 0 并不必然失败；只有当前边界停在它之前或恰好停在它处，且
此前其他位置都无法把边界继续向右扩展时，才会形成不可跨越的断点。

与最少跳跃次数的区别
~~~~~~~~~~~~~~~~~~~~

本题只判断是否可达，所有可达位置可以合并成一个连续前缀，只需保存 ``farthest``。

若题目要求最少跳跃次数，还必须区分“当前跳跃次数能够覆盖到哪里”和“再跳一次能够覆盖到哪里”，不能只用
一个边界。这正是 Jump Game II 需要额外层边界的原因。

复杂度来源
~~~~~~~~~~

朴素递归最坏为指数级时间，递归深度为 ``O(n)``。显式可达表最坏为 ``O(n²)`` 时间、``O(n)`` 空间。

主方法只顺序扫描一次，每个位置做常数次比较和更新，时间为 ``O(n)``、额外空间为 ``O(1)``。一旦最远边界
覆盖终点即可提前返回 ``true``。
