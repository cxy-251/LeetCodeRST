1503. Last Moment Before All Ants Fall Out of a Plank
=====================================================

题目信息
--------

:题号: 1503
:难度: Medium
:主题: 数组、运动模拟、等价变换、贪心
:原题: `LeetCode 1503 <https://leetcode.com/problems/last-moment-before-all-ants-fall-out-of-a-plank/>`_
:重点: 从逐时刻模拟碰撞，推导到忽略身份后的轨迹穿越，再在线聚合最晚掉落时刻

题目重述
--------

长度为 ``n`` 的木板覆盖坐标区间 ``[0,n]``。木板上有若干只蚂蚁，每只蚂蚁每秒移动一个单位：

* ``left`` 保存初始向左移动的蚂蚁位置；
* ``right`` 保存初始向右移动的蚂蚁位置。

所有初始位置互不相同。两只相向而行的蚂蚁相遇时，会立即同时反向，反向不消耗时间。蚂蚁到达坐标
``0`` 或 ``n`` 时立即掉下木板。

返回最后一只蚂蚁掉下木板的时刻。位于 ``0`` 且向左移动，或位于 ``n`` 且向右移动的蚂蚁，会在
时刻 0 掉落。

约束为 ``1 <= n <= 10^4``，所有位置位于 ``[0,n]``，并且木板上至少有一只蚂蚁。

自建示例
--------

.. code-block:: text

   输入：n = 4, left = [4,3], right = [0,1]
   输出：4

忽略身份后，位置 4 的向左轨迹需要 4 秒到达左端，位置 0 的向右轨迹需要 4 秒到达右端。

.. code-block:: text

   输入：n = 7, left = [5], right = [2]
   输出：5

向左蚂蚁的掉落时间为 5，向右蚂蚁的掉落时间为 ``7 - 2 = 5``。

.. code-block:: text

   输入：n = 5, left = [0], right = [5]
   输出：0

两只蚂蚁都位于各自移动方向的端点，立即掉落。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       struct Ant {
           int position2;
           int direction;
           bool alive;
       };

       int simulateHalfSteps(
           int n,
           const std::vector<int>& left,
           const std::vector<int>& right
       ) {
           std::vector<Ant> ants;
           ants.reserve(left.size() + right.size());

           for (int position : left) {
               ants.push_back({position * 2, -1, true});
           }
           for (int position : right) {
               ants.push_back({position * 2, 1, true});
           }

           const int end2 = n * 2;
           int aliveCount = static_cast<int>(ants.size());
           int elapsedHalfSteps = 0;

           for (Ant& ant : ants) {
               const bool fallsImmediately =
                   (ant.position2 == 0 && ant.direction == -1) ||
                   (ant.position2 == end2 && ant.direction == 1);
               if (fallsImmediately) {
                   ant.alive = false;
                   --aliveCount;
               }
           }

           while (aliveCount > 0) {
               ++elapsedHalfSteps;

               for (Ant& ant : ants) {
                   if (ant.alive) {
                       ant.position2 += ant.direction;
                   }
               }

               for (Ant& ant : ants) {
                   if (!ant.alive) continue;
                   if (ant.position2 == 0 || ant.position2 == end2) {
                       ant.alive = false;
                       --aliveCount;
                   }
               }

               std::unordered_map<int, std::vector<int>> collisionGroups;
               for (int index = 0; index < static_cast<int>(ants.size()); ++index) {
                   if (ants[index].alive) {
                       collisionGroups[ants[index].position2].push_back(index);
                   }
               }

               for (auto& entry : collisionGroups) {
                   std::vector<int>& indices = entry.second;
                   if (indices.size() == 2) {
                       ants[indices[0]].direction *= -1;
                       ants[indices[1]].direction *= -1;
                   }
               }
           }

           return elapsedHalfSteps / 2;
       }

       int collectFallTimes(
           int n,
           const std::vector<int>& left,
           const std::vector<int>& right
       ) {
           std::vector<int> fallTimes;
           fallTimes.reserve(left.size() + right.size());

           for (int position : left) {
               fallTimes.push_back(position);
           }
           for (int position : right) {
               fallTimes.push_back(n - position);
           }

           return *std::max_element(fallTimes.begin(), fallTimes.end());
       }

       int aggregateMaximum(
           int n,
           const std::vector<int>& left,
           const std::vector<int>& right
       ) {
           int lastMoment = 0;

           for (int position : left) {
               lastMoment = std::max(lastMoment, position);
           }
           for (int position : right) {
               lastMoment = std::max(lastMoment, n - position);
           }

           return lastMoment;
       }

   public:
       int getLastMoment(
           int n,
           std::vector<int>& left,
           std::vector<int>& right
       ) {
           return aggregateMaximum(n, left, right);
       }
   };

题解
----

逐时刻模拟
~~~~~~~~~~

直接方法按照题意维护每只蚂蚁的位置、方向和存活状态。碰撞可能发生在半秒时刻，因此
``simulateHalfSteps`` 把坐标扩大两倍，并用半秒作为一个离散时间步：

.. code-block:: text

   原位置 position  -> 2 * position
   木板右端 n       -> 2 * n
   每个半步位移     -> 1

每轮先移动全部存活蚂蚁，再删除到达端点的蚂蚁，最后按位置分组并让相遇的两只蚂蚁同时反向。
这种实现完整保留了物理过程，也能覆盖整数时刻和半整数时刻的碰撞。

身份状态的代价
~~~~~~~~~~~~~~

木板长度为 ``n``，所有蚂蚁最迟在 ``n`` 秒内掉落，因此模拟至多执行 ``2n`` 个半步。每个半步都要扫描
蚂蚁并建立碰撞分组，主要成本来自持续追踪每只蚂蚁的身份。

题目只询问最后掉落时刻，不询问某个身份最终从哪一端离开。删除身份信息后，碰撞可以使用更简单的等价模型。

轨迹穿越等价
~~~~~~~~~~~~

两只速度相同、方向相反的蚂蚁相遇后同时反向。若保留身份，可以理解为两只蚂蚁分别沿另一条轨迹继续移动；
若忽略身份，则与它们保持原方向直接穿过完全等价。

两个模型在任意时刻拥有相同的位置集合：

.. code-block:: text

   真实模型：身份 A 接续身份 B 的出射轨迹，身份 B 接续身份 A 的出射轨迹
   穿越模型：两条轨迹保持方向继续延伸

碰撞只交换了轨迹由哪个身份占据，没有改变轨迹本身。所有到达端点的时刻因此完全相同，最后掉落时刻也不变。

静态掉落时间
~~~~~~~~~~~~

穿越模型删除了全部碰撞。每条轨迹从初始位置直线移动到对应端点：

.. code-block:: text

   向左轨迹 position  -> 掉落时间 position
   向右轨迹 position  -> 掉落时间 n - position

``collectFallTimes`` 计算并保存所有轨迹的掉落时间，再取最大值。每只蚂蚁只处理一次，时间已经降为线性。

在线聚合
~~~~~~~~

题目只需要所有掉落时间的最大值，不需要保存完整列表。``aggregateMaximum`` 在计算每个时间后立即更新
``lastMoment``：

.. code-block:: text

   lastMoment = max(lastMoment, 当前轨迹的掉落时间)

扫描结束时，不变量是：``lastMoment`` 等于所有已处理轨迹中的最晚掉落时刻。处理下一条轨迹只需一次最大值
更新，最终得到全部轨迹的最大值，额外空间降为常数。

状态演化
~~~~~~~~

对 ``n = 4, left = [4,3], right = [0,1]``：

.. list-table::
   :header-rows: 1

   * - 轨迹
     - 掉落时间
     - 更新后 ``lastMoment``
   * - 向左，位置 4
     - 4
     - 4
   * - 向左，位置 3
     - 3
     - 4
   * - 向右，位置 0
     - ``4 - 0 = 4``
     - 4
   * - 向右，位置 1
     - ``4 - 1 = 3``
     - 4

真实过程中会发生多次碰撞，但穿越模型中的四条轨迹分别在时刻 3 或 4 到达端点，所以答案为 4。

三种方法的关系
~~~~~~~~~~~~~~

半步模拟保留位置、方向、存活状态和碰撞关系；穿越等价删除身份与碰撞，只保留每条轨迹的静态掉落时间；
在线聚合继续删除中间时间数组，只保留当前最大值。

三步优化依次减少状态：

.. code-block:: text

   动态物理状态 -> 独立轨迹时间 -> 一个最大值

公开入口调用 ``aggregateMaximum``，因为它直接表达题目真正需要的统计量。

边界处理
~~~~~~~~

``left`` 为空时只扫描向右轨迹，``right`` 为空时只扫描向左轨迹。题目保证至少存在一只蚂蚁，因此主方法
一定会处理至少一个位置。

位置 0 的向左轨迹和位置 ``n`` 的向右轨迹贡献时间 0。大量碰撞不会影响结果，因为碰撞只交换身份，不改变
轨迹集合。任意掉落时间都位于 ``[0,n]``，使用 ``int`` 足够。

复杂度分析
~~~~~~~~~~

设蚂蚁总数为 ``k``。半步模拟最多执行 ``2n`` 轮，每轮扫描并分组全部蚂蚁，平均时间为 ``O(nk)``，
额外空间为 ``O(k)``。

保存掉落时间的方法访问每只蚂蚁一次，时间为 ``O(k)``，数组占用 ``O(k)`` 空间。主方法同样为
``O(k)`` 时间，只维护当前最大值，额外空间为 ``O(1)``。
