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

不能把“当前跳得最远”当成最终选择：

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

先把所有跳法完整枚举
~~~~~~~~~~~~~~~~~~~~

从下标 ``index`` 出发，可以选择区间 ``[index + 1, index + nums[index]]`` 中的任意位置。最直接的方法枚举每个
落点，递归求解余下后缀，再取最小值：

.. code-block:: text

   answer(index) = 1 + min(answer(next))

这棵搜索树不会漏解，因为任意合法路线的第一跳都在枚举区间中；递归到最后一个下标时，余下跳数为零。

问题在于不同路线会反复到达同一个下标。例如从下标 0 跳到 1 或 2，之后都可能到达 3；从 3 开始的全部搜索会被
重复执行。直接递归的分支数可随数组长度指数增长。

把重复后缀改成动态规划
~~~~~~~~~~~~~~~~~~~~~~

令 ``minimumJumps[i]`` 表示从起点到达下标 ``i`` 的最少跳数。初始只有下标 0 可达：

.. code-block:: text

   minimumJumps[0] = 0

从一个已到达位置 ``i`` 出发，它能把 ``minimumJumps[i] + 1`` 传播到整个可达区间。数组中的边只向右，因此按下标
从左到右处理时，所有前驱都已经被考虑。

动态规划把每个下标的最优值只保存一次，删除了指数级重复搜索；它仍可能从许多不同起点反复更新同一段下标。最坏情况
下，每个位置都能跳到数组末尾，总更新次数为 ``O(n^2)``。

为什么这是无权图的最短路
~~~~~~~~~~~~~~~~~~~~~~~~

把每个下标看成一个节点，从 ``i`` 到所有可跳到的位置各连一条边。每条边都代表一次跳跃，代价均为 1，因此答案就是
从节点 0 到末尾节点的最短边数。

广度优先搜索按跳数分层：

* 第 0 层只有下标 0；
* 第 1 层是一次跳跃可以到达的位置；
* 第 2 层是两次跳跃才能首次覆盖的位置；
* 首次覆盖终点的层数就是最少跳数。

普通 BFS 会把每个下标放入队列，并枚举它的全部出边。这里还能继续利用可达位置的区间结构。

为什么每一层可以只保存右端点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若使用不超过 ``k`` 次跳跃能够到达某个下标 ``r``，那么同一区间内更靠左的位置也能在不超过 ``k`` 次跳跃内覆盖。
原因是一次跳跃允许选择任何不超过上限的正距离，而不是只能跳满 ``nums[i]``。

因此，使用不超过 ``k`` 次跳跃可达的位置形成前缀：

.. code-block:: text

   [0, currentEnd]

扫描这个前缀中的所有下标，下一次跳跃能够到达的最远位置为：

.. code-block:: text

   nextEnd = max(index + nums[index])

其中 ``index`` 遍历当前尚未扫描的可达位置。整个下一层仍只需一个右端点，不需要保存队列中的每个节点。

三个变量的真实含义
~~~~~~~~~~~~~~~~~~

``jumps`` 表示已经提交的跳跃次数；``currentEnd`` 表示用这些跳跃最多能覆盖到哪里；``nextEnd`` 表示再增加一次
跳跃后能够覆盖的最远位置。

扫描尚未结束时，只更新 ``nextEnd``，不立即决定落点。到达 ``index == currentEnd`` 时，说明当前层所有可能作为起点的
位置都已检查完，才能执行：

.. code-block:: text

   jumps += 1
   currentEnd = nextEnd

这不是选择跳到 ``nextEnd`` 对应的某个具体下标，而是提交“下一跳可以覆盖整个新前缀”这一事实。

为什么不能每次选择眼前最远的落点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对 ``[2, 3, 0, 1, 4]``，下标 0 能跳到 1 或 2。直接跳到更远的下标 2 会停住；下标 1 虽然更近，却能在下一跳覆盖
终点。

区间算法不会在第一层提前选择 1 或 2。它扫描第一层所有起点能产生的覆盖范围，比较的是
``index + nums[index]``，然后只保留整个下一层的最远边界。这等价于 BFS 完整处理一层后再进入下一层。

状态演化
~~~~~~~~

对 ``[2, 3, 1, 1, 4]``：

.. list-table::
   :header-rows: 1

   * - 扫描下标
     - 当前位置最远可达
     - ``nextEnd``
     - 是否结束一层
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

第一次提交后，一跳可覆盖前缀 ``[0, 2]``。扫描下标 1 和 2 后，第二跳可覆盖到下标 4，首次包含终点，所以答案为 2。

为什么首次覆盖终点一定最优
~~~~~~~~~~~~~~~~~~~~~~~~~~

在提交第 ``k`` 层之前，``currentEnd`` 已经是所有不超过 ``k`` 次跳跃方案能达到的最远位置。扫描这一层全部起点得到的
``nextEnd``，则是所有不超过 ``k + 1`` 次跳跃方案能达到的最远位置。

因此：

* 若终点大于 ``currentEnd``，任何 ``k`` 跳方案都无法到达；
* 当新的 ``currentEnd`` 首次覆盖终点时，已经存在一个 ``k + 1`` 跳方案；
* 更少跳数不可能到达，所以当前层数就是最小值。

循环为什么只扫描到倒数第二个位置
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最后一个下标是目的地，到达后不需要再从它跳出。若把它也当作层末提交，可能额外增加一次跳跃。因此循环只处理
``0`` 到 ``n - 2``，并在新边界覆盖终点时立即结束。

题目保证终点可达，所以每次尚未覆盖终点而结束一层时，``nextEnd`` 一定严格大于旧的 ``currentEnd``。单元素数组则在
进入循环前直接返回 0。

复杂度分析
~~~~~~~~~~

设数组长度为 ``n``：

* 完整递归最坏为指数时间，递归深度最多 ``O(n)``；
* 动态规划最坏 ``O(n^2)`` 时间，使用 ``O(n)`` 额外空间；
* 区间 BFS 每个下标只扫描一次，时间 ``O(n)``，额外空间 ``O(1)``。
