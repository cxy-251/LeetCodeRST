0045. Jump Game II
==================

题目信息
--------

:题号: 0045
:难度: Medium
:主题: 数组、动态规划、BFS 分层、区间贪心
:原题: `LeetCode 0045 <https://leetcode.com/problems/jump-game-ii/>`_
:重点: 从枚举所有跳法，推导到用当前层右端和下一层最远右端计算最少跳数

题目重述
--------

给定一个非负整数数组 ``nums``。站在下标 ``i`` 时，可以向右跳到任意满足以下条件的下标 ``next``：

.. code-block:: text

   i < next <= i + nums[i]

从下标 ``0`` 出发，返回到达最后一个下标所需的最少跳跃次数。题目保证最后一个下标一定可以到达。

``nums`` 的长度位于 ``[1, 10^4]``，每个元素位于 ``[0, 1000]``。

自建示例
--------

需要比较同一层的多个起点：

.. code-block:: text

   输入：nums = [2, 3, 1, 1, 4]
   输出：2
   解释：第一跳可以到下标 1 或 2。选择下标 1 后，第二跳可以直接到达下标 4。

不能把当前落点最远当成最终选择：

.. code-block:: text

   输入：nums = [2, 3, 0, 1, 4]
   输出：2
   解释：若第一跳只看落点最远，会跳到下标 2 并停住；正确路线是 0 -> 1 -> 4。

单元素数组：

.. code-block:: text

   输入：nums = [0]
   输出：0
   解释：起点已经是终点，不需要跳跃。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <climits>
   #include <vector>

   class Solution {
   private:
       int exhaustiveFrom(const std::vector<int>& nums, int index) {
           const int n = static_cast<int>(nums.size());
           if (index >= n - 1) {
               return 0;
           }

           const int unreachable = INT_MAX / 4;
           int best = unreachable;
           const int farthest = std::min(n - 1, index + nums[index]);
           for (int next = index + 1; next <= farthest; ++next) {
               const int suffix = exhaustiveFrom(nums, next);
               if (suffix != unreachable) {
                   best = std::min(best, suffix + 1);
               }
           }
           return best;
       }

       int exhaustiveSearch(const std::vector<int>& nums) {
           return exhaustiveFrom(nums, 0);
       }

       int quadraticDynamicProgramming(const std::vector<int>& nums) {
           const int n = static_cast<int>(nums.size());
           const int unreachable = INT_MAX / 4;
           std::vector<int> minimumJumps(n, unreachable);
           minimumJumps[0] = 0;

           for (int index = 0; index < n; ++index) {
               if (minimumJumps[index] == unreachable) {
                   continue;
               }
               const int farthest = std::min(n - 1, index + nums[index]);
               for (int next = index + 1; next <= farthest; ++next) {
                   minimumJumps[next] = std::min(
                       minimumJumps[next],
                       minimumJumps[index] + 1
                   );
               }
           }
           return minimumJumps[n - 1];
       }

       int intervalBreadthFirstSearch(const std::vector<int>& nums) {
           const int n = static_cast<int>(nums.size());
           if (n == 1) {
               return 0;
           }

           int jumps = 0;
           int currentEnd = 0;
           int nextEnd = 0;

           for (int index = 0; index < n - 1; ++index) {
               nextEnd = std::max(nextEnd, index + nums[index]);

               if (index == currentEnd) {
                   ++jumps;
                   currentEnd = nextEnd;
                   if (currentEnd >= n - 1) {
                       break;
                   }
               }
           }
           return jumps;
       }

   public:
       int jump(std::vector<int>& nums) {
           return intervalBreadthFirstSearch(nums);
       }
   };

题解
----

完整跳法枚举
~~~~~~~~~~~~

从下标 ``index`` 出发，可以选择区间 ``[index + 1, index + nums[index]]`` 中的任意位置。最直接的递归为：

.. code-block:: text

   answer(index) = 1 + min(answer(next))

任意合法路线的第一跳都位于这个区间中，因此枚举不会漏解；递归到最后一个下标时，剩余跳数为零。

不同路线会反复到达同一下标。例如从下标 0 跳到 1 或 2，之后都可能到达 3，从 3 开始的后续搜索会被重复计算。
直接递归的分支数最坏呈指数增长。

下标动态规划
~~~~~~~~~~~~

令 ``minimumJumps[i]`` 表示从起点到达下标 ``i`` 的最少跳数。初始状态为：

.. code-block:: text

   minimumJumps[0] = 0

从一个已到达位置 ``i`` 出发，值 ``minimumJumps[i] + 1`` 可以传播到它右侧的整个可达区间。所有边都只向右，按
下标从左到右处理时，当前位置的所有前驱都已经被考虑。

动态规划把每个下标的最优值保存下来，删除了重复后缀搜索。它仍可能从许多起点反复更新同一段区间，最坏时间为
``O(n^2)``。继续优化需要利用“每次跳跃覆盖的是连续区间”这一结构。

分层覆盖模型
~~~~~~~~~~~~

把每个下标看成图节点，从 ``i`` 向所有可跳到的位置连一条代价为 1 的边。最少跳数就是无权图最短路，BFS 会按
跳数分层访问节点。

本题无需保存整层队列。若不超过 ``k`` 次跳跃可以到达最远下标 ``r``，那么 ``[0, r]`` 内的所有位置也都可以在
不超过 ``k`` 次跳跃内到达，因为每次可以选择不超过上限的任意正跳跃距离。因此每层可达集合只需记录一个右端点。

三个变量分别表示：

* ``jumps``：已经提交的跳跃次数；
* ``currentEnd``：使用 ``jumps`` 次跳跃能够覆盖的最远下标；
* ``nextEnd``：从当前层所有位置再跳一次能够覆盖的最远下标。

扫描 ``index <= currentEnd`` 的所有位置时，持续更新：

.. code-block:: text

   nextEnd = max(nextEnd, index + nums[index])

到达 ``index == currentEnd`` 时，当前层的所有出边都已检查完。此时才提交下一跳：

.. code-block:: text

   jumps += 1
   currentEnd = nextEnd

算法并未提前选择某个具体落点，而是完整比较当前层所有起点的扩展能力，再保留下一层的最远边界。

分层覆盖不变量
~~~~~~~~~~~~~~

每次开始扫描一层时，保持以下状态：

* ``[0, currentEnd]`` 恰好是使用不超过 ``jumps`` 次跳跃可以覆盖的前缀；
* 当前层尚未扫描的位置位于上一层边界之后、``currentEnd`` 以内；
* ``nextEnd`` 是已扫描位置再跳一次可以到达的最远下标。

扫描完整层后，所有使用不超过 ``jumps + 1`` 次跳跃的方案，其最后一跳都必然从当前层某个位置出发，因此最远覆盖
位置正是 ``nextEnd``。把它赋给 ``currentEnd`` 后，不变量进入下一层。

当新的 ``currentEnd`` 首次覆盖终点时，已经存在一条使用当前 ``jumps`` 次跳跃的路线。上一层边界尚未覆盖终点，
说明更少跳数不可能到达，所以当前跳数最小。

这也解释了为何不能每次跳到眼前最远的下标。对 ``[2, 3, 0, 1, 4]``，下标 2 虽然是第一跳最远落点，却无法
继续；区间算法会同时扫描下标 1 和 2，并比较它们的 ``index + nums[index]``，因此得到下一层边界 4。

状态演化
~~~~~~~~

对 ``[2, 3, 1, 1, 4]``：

.. list-table::
   :header-rows: 1

   * - 扫描下标
     - 当前位置最远可达
     - ``nextEnd``
     - 层结束
     - ``jumps`` / ``currentEnd``
   * - 0
     - 2
     - 2
     - 是
     - ``1 / 2``
   * - 1
     - 4
     - 4
     - 否
     - ``1 / 2``
   * - 2
     - 3
     - 4
     - 是
     - ``2 / 4``

第一次提交后，一跳可覆盖前缀 ``[0, 2]``。扫描下标 1 和 2 后，第二跳可覆盖到下标 4，首次包含终点，答案为 2。

循环边界
~~~~~~~~

最后一个下标是目的地，到达后不需要再从它跳出，因此循环只扫描 ``0`` 到 ``n - 2``。若把终点也当作层末提交，
可能额外增加一次跳跃。

单元素数组在进入循环前返回 0。题目保证终点可达，所以在尚未覆盖终点时，每次层结束后的 ``nextEnd`` 都会推进
边界，不需要处理无法前进的失败状态。

代码演进
~~~~~~~~

``exhaustiveSearch`` 枚举全部落点，直接表达最少跳数定义，但会重复搜索相同后缀。

``quadraticDynamicProgramming`` 保存每个下标的最少跳数，把指数级搜索降为多项式时间，但仍逐个更新可达区间。

``intervalBreadthFirstSearch`` 把相同跳数可达的节点压缩成连续前缀，只维护当前层和下一层的右端点。公开入口采用该
方法，因为它在线性扫描中完成 BFS 分层，并只使用常量状态。

复杂度分析
~~~~~~~~~~

设数组长度为 ``n``：

* 完整递归最坏为指数时间，递归深度最多 ``O(n)``；
* 动态规划最坏 ``O(n^2)`` 时间，使用 ``O(n)`` 额外空间；
* 区间 BFS 每个下标只扫描一次，时间 ``O(n)``，额外空间 ``O(1)``。
