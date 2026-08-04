1503. Last Moment Before All Ants Fall Out of a Plank
=====================================================

题目信息
--------

:题号: 1503
:难度: Medium
:主题: 数组、运动模拟、等价变换、贪心
:原题: `LeetCode 1503 <https://leetcode.com/problems/last-moment-before-all-ants-fall-out-of-a-plank/>`_
:重点: 从逐时刻模拟碰撞，推导到相遇反向与直接穿过等价，最后只计算每只蚂蚁到对应端点的距离

题目重述
--------

一块长度为 ``n`` 的木板覆盖坐标区间 ``[0, n]``。木板上有若干只蚂蚁，每只蚂蚁每秒移动一个单位：

* 数组 ``left`` 给出初始向左移动的蚂蚁位置；
* 数组 ``right`` 给出初始向右移动的蚂蚁位置。

不同蚂蚁的初始位置互不相同。两只相向而行的蚂蚁相遇时，会立即同时反向，反向过程不消耗时间。蚂蚁到达坐标 ``0`` 或 ``n`` 时立即掉下木板。

需要返回最后一只蚂蚁掉下木板的时刻。若某只蚂蚁初始就在即将离开的端点，例如位于 ``0`` 且向左移动，则它在时刻 ``0`` 掉落。

约束条件：

* ``1 <= n <= 10^4``；
* 所有位置都位于 ``[0, n]``；
* ``left`` 与 ``right`` 中的全部位置互不重复；
* 木板上至少有一只蚂蚁。

测试用例
--------

* 多次相遇：``n = 4, left = [4, 3], right = [0, 1]``，最后掉落时刻为 ``4``；
* 只有向左蚂蚁：``n = 7, left = [5], right = []``，到左端距离为 ``5``，返回 ``5``；
* 只有向右蚂蚁：``n = 7, left = [], right = [2]``，到右端距离为 ``5``，返回 ``5``；
* 初始立即掉落：``n = 5, left = [0], right = [5]``，两只蚂蚁都在时刻 ``0`` 掉落；
* 中点相遇：``n = 4, left = [3], right = [1]``，两只蚂蚁在坐标 ``2`` 相遇，最后掉落时刻为 ``3``。

方法一：半步物理模拟
--------------------

最直接的想法是按照题意模拟所有蚂蚁的移动、相遇、反向和掉落。

碰撞不一定发生在整数时刻。例如两只蚂蚁分别位于相邻整数位置并相向移动，它们会在半秒后相遇。为了避免浮点数，可以把所有坐标扩大两倍，并以半秒为一个时间步：

* 原坐标 ``position`` 变为 ``2 * position``；
* 木板右端变为 ``2 * n``；
* 每经过半秒，蚂蚁在扩大后的坐标上移动 ``1``；
* 两只存活蚂蚁出现在同一扩大坐标时，同时反向。

每个半步都需要扫描所有蚂蚁，并记录同一位置上的碰撞。由于最后掉落时刻不会超过 ``n`` 秒，最多模拟 ``2n`` 个半步。

C++ 实现一
~~~~~~~~~~

.. code-block:: cpp

   class Solution {
   private:
       struct Ant {
           int position2;
           int direction;
           bool alive;
       };

   public:
       int getLastMoment(int n, vector<int>& left, vector<int>& right) {
           vector<Ant> ants;

           for (int position : left) {
               ants.push_back({position * 2, -1, true});
           }
           for (int position : right) {
               ants.push_back({position * 2, 1, true});
           }

           const int end2 = n * 2;
           int aliveCount = static_cast<int>(ants.size());
           int lastMoment2 = 0;

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
               ++lastMoment2;

               for (Ant& ant : ants) {
                   if (ant.alive) {
                       ant.position2 += ant.direction;
                   }
               }

               for (Ant& ant : ants) {
                   if (!ant.alive) {
                       continue;
                   }

                   if (ant.position2 == 0 || ant.position2 == end2) {
                       ant.alive = false;
                       --aliveCount;
                   }
               }

               unordered_map<int, vector<int>> collisionGroups;

               for (int i = 0; i < static_cast<int>(ants.size()); ++i) {
                   if (ants[i].alive) {
                       collisionGroups[ants[i].position2].push_back(i);
                   }
               }

               for (auto& [position, indices] : collisionGroups) {
                   if (indices.size() == 2) {
                       ants[indices[0]].direction *= -1;
                       ants[indices[1]].direction *= -1;
                   }
               }
           }

           return lastMoment2 / 2;
       }
   };

这一版忠实还原了物理过程，也能处理半秒相遇。但代码需要维护位置、方向、存活状态和碰撞分组，真正困难的部分全部来自“追踪每只蚂蚁的身份”。

下一步应先判断：题目是否真的关心哪一只蚂蚁沿哪条轨迹离开。

方法二：穿越等价
----------------

观察两只相向而行的蚂蚁。相遇前，一只向右，另一只向左；相遇后，它们交换方向。

若给蚂蚁贴上身份标签，看起来是两只蚂蚁分别反向。但所有蚂蚁速度相同，忽略身份后，这与两只蚂蚁保持原方向、直接穿过彼此完全等价：

* 真实过程保留了两条离开碰撞点的轨迹，只是由另一只蚂蚁接着走；
* 穿越模型也保留相同的两条轨迹；
* 任意时刻木板上的位置集合相同；
* 所有掉落时刻也完全相同。

题目只询问最后掉落时刻，不询问具体是哪只蚂蚁掉落。因此可以删除全部碰撞处理，把每只蚂蚁看成始终沿初始方向直行。

于是：

* 初始向左、位于 ``position`` 的蚂蚁需要 ``position`` 秒到达左端；
* 初始向右、位于 ``position`` 的蚂蚁需要 ``n - position`` 秒到达右端。

先记录所有掉落时间，再取最大值即可。

C++ 实现二
~~~~~~~~~~

.. code-block:: cpp

   class Solution {
   public:
       int getLastMoment(int n, vector<int>& left, vector<int>& right) {
           vector<int> fallMoments;
           fallMoments.reserve(left.size() + right.size());

           for (int position : left) {
               fallMoments.push_back(position);
           }

           for (int position : right) {
               fallMoments.push_back(n - position);
           }

           return *max_element(fallMoments.begin(), fallMoments.end());
       }
   };

与实现一相比，位置更新、半步计时、碰撞分组、方向反转和存活状态全部消失。优化来自模型变化，而不是对模拟代码做局部加速。

这版已经把时间复杂度降到线性，但它仍保存了所有掉落时刻，而题目最终只需要其中的最大值。

方法三：边扫描边聚合
--------------------

既然每只蚂蚁的掉落时间可以独立计算，而最终答案只是最大值，就没有必要建立 ``fallMoments`` 数组。

扫描 ``left`` 时，用 ``position`` 更新答案；扫描 ``right`` 时，用 ``n - position`` 更新答案。每个掉落时间只计算一次，并立即合并到当前最大值中。

C++ 实现三
~~~~~~~~~~

.. code-block:: cpp

   class Solution {
   public:
       int getLastMoment(int n, vector<int>& left, vector<int>& right) {
           int lastMoment = 0;

           for (int position : left) {
               lastMoment = max(lastMoment, position);
           }

           for (int position : right) {
               lastMoment = max(lastMoment, n - position);
           }

           return lastMoment;
       }
   };

实现三与实现二使用同一个等价模型，进一步删除了保存所有中间结果的数组。代码现在只保留题目真正需要的状态：当前已知的最晚掉落时刻。

代码分析
--------

第一版按照题目表面描述编程。由于碰撞可能发生在半秒时刻，代码先扩大坐标，再维护每只蚂蚁的位置、方向和存活状态。外层时间循环不断推进运动，内部还要检测碰撞。代码复杂的根源是持续追踪蚂蚁身份。

第二版发现，相遇反向只相当于两只蚂蚁交换身份。题目不关心身份，因此可以把碰撞改写为直接穿过。这个思路变化一次性删除了整个动态模拟过程，每只蚂蚁的掉落时间变成由初始位置直接计算的静态值。

第三版继续审查输出需求：只需要最晚时刻，不需要完整的掉落时间列表。因此代码删除 ``fallMoments``，把“先收集、后求最大值”改成“计算一个、合并一个”。

三份代码的变化对应三层认识：

* 直接还原物理过程时，需要模拟时间与碰撞；
* 忽略身份后，碰撞可以消失，每条轨迹独立到达端点；
* 只保留目标统计量后，所有中间掉落时间也可以消失。

复杂度分析
----------

方法一：半步物理模拟
~~~~~~~~~~~~~~~~~~~~

设蚂蚁总数为 ``k``。最多模拟 ``2n`` 个半步，每个半步扫描蚂蚁并建立碰撞分组：

* 平均时间复杂度为 ``O(nk)``；
* 额外空间复杂度为 ``O(k)``。

方法二：穿越等价
~~~~~~~~~~~~~~~~

每只蚂蚁只计算一次掉落时刻：

* 时间复杂度为 ``O(k)``；
* 额外空间复杂度为 ``O(k)``。

方法三：边扫描边聚合
~~~~~~~~~~~~~~~~~~~~

每只蚂蚁只参与一次最大值更新：

* 时间复杂度为 ``O(k)``；
* 额外空间复杂度为 ``O(1)``。

边界处理
--------

* ``left`` 为空时，只计算所有向右蚂蚁的 ``n - position``；
* ``right`` 为空时，只计算所有向左蚂蚁的 ``position``；
* 位于 ``0`` 且向左、或位于 ``n`` 且向右的蚂蚁，其掉落时刻为 ``0``；
* 大量碰撞不会改变答案，因为碰撞只交换身份，不改变轨迹集合；
* 最晚掉落时刻一定不超过 ``n``，返回 ``int`` 足够。