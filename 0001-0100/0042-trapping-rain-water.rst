0042. Trapping Rain Water
=========================

题目信息
--------

:题号: 0042
:难度: Hard
:主题: 数组、前后缀最大值、单调栈、双指针
:原题: `LeetCode 0042 <https://leetcode.com/problems/trapping-rain-water/>`_
:重点: 从逐柱重复寻找左右挡板，推导到预处理边界、按层结算凹槽和常量空间双指针

题目重述
--------

给定非负整数数组 ``height``。每个元素表示一根宽度为 ``1`` 的柱子高度，所有柱子相邻排列。降雨后，水会保留在
左右都有更高或等高柱子围住的低洼位置。返回全部位置能够储存的水量总和。

柱子本身不储水；数组两端若没有另一侧挡板，也无法留住水。``height`` 的长度位于 ``[1, 2 * 10^4]``，每根柱子
高度位于 ``[0, 10^5]``。

自建示例
--------

* 多个凹槽：``height = [3, 0, 1, 3, 0, 2]``，各位置水量为 ``[0, 3, 2, 0, 2, 0]``，答案为 ``7``；
* 右边界更高：``height = [4, 2, 0, 3, 2, 5]``，各位置水量为 ``[0, 2, 4, 1, 2, 0]``，答案为 ``9``；
* 单调递增：``height = [0, 1, 2, 3]``，答案为 ``0``；
* 单调递减：``height = [4, 3, 2, 1]``，答案为 ``0``；
* 平台不能形成凹槽：``height = [2, 2, 2]``，答案为 ``0``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int scanBothSidesForEveryColumn(const std::vector<int>& height) {
           int total = 0;
           const int size = static_cast<int>(height.size());
           for (int index = 0; index < size; ++index) {
               int leftMaximum = height[index];
               int rightMaximum = height[index];
               for (int left = index - 1; left >= 0; --left) {
                   leftMaximum = std::max(leftMaximum, height[left]);
               }
               for (int right = index + 1; right < size; ++right) {
                   rightMaximum = std::max(rightMaximum, height[right]);
               }
               total += std::min(leftMaximum, rightMaximum) - height[index];
           }
           return total;
       }

       int prefixAndSuffixMaximums(const std::vector<int>& height) {
           const int size = static_cast<int>(height.size());
           if (size == 0) {
               return 0;
           }

           std::vector<int> leftMaximum(size);
           std::vector<int> rightMaximum(size);
           leftMaximum[0] = height[0];
           for (int index = 1; index < size; ++index) {
               leftMaximum[index] = std::max(leftMaximum[index - 1], height[index]);
           }
           rightMaximum[size - 1] = height[size - 1];
           for (int index = size - 2; index >= 0; --index) {
               rightMaximum[index] = std::max(rightMaximum[index + 1], height[index]);
           }

           int total = 0;
           for (int index = 0; index < size; ++index) {
               total += std::min(leftMaximum[index], rightMaximum[index]) - height[index];
           }
           return total;
       }

       int monotonicStack(const std::vector<int>& height) {
           std::vector<int> stack;
           int total = 0;
           for (int right = 0; right < static_cast<int>(height.size()); ++right) {
               while (!stack.empty() && height[right] > height[stack.back()]) {
                   const int bottom = stack.back();
                   stack.pop_back();
                   if (stack.empty()) {
                       break;
                   }

                   const int left = stack.back();
                   const int width = right - left - 1;
                   const int boundedHeight =
                       std::min(height[left], height[right]) - height[bottom];
                   total += width * boundedHeight;
               }
               stack.push_back(right);
           }
           return total;
       }

       int twoPointers(const std::vector<int>& height) {
           int left = 0;
           int right = static_cast<int>(height.size()) - 1;
           int leftMaximum = 0;
           int rightMaximum = 0;
           int total = 0;

           while (left <= right) {
               if (leftMaximum <= rightMaximum) {
                   leftMaximum = std::max(leftMaximum, height[left]);
                   total += leftMaximum - height[left];
                   ++left;
               } else {
                   rightMaximum = std::max(rightMaximum, height[right]);
                   total += rightMaximum - height[right];
                   --right;
               }
           }
           return total;
       }

   public:
       int trap(std::vector<int>& height) {
           return twoPointers(height);
       }
   };

题解
----

先确定一根柱子的水位
~~~~~~~~~~~~~~~~~~~~

位置 ``i`` 能达到的水面由两侧最高挡板中较低的一根决定。设：

.. math::

   L_i=\max(height[0..i]),\qquad R_i=\max(height[i..n-1])

则该位置水量为：

.. math::

   water_i=\min(L_i,R_i)-height[i]

左右最大值都包含当前位置，所以 ``L_i`` 与 ``R_i`` 均不低于 ``height[i]``，差值不会为负。这一公式把整体问题
拆成互不重叠的竖直水柱；所有 ``water_i`` 相加就是答案。

逐柱向两侧扫描
~~~~~~~~~~~~~~

最直接的方法对每个位置重新向左、向右寻找最高柱，再代入公式。它不会漏算：每单位水都位于唯一的数组下标上；也
不会重复：每轮只计算当前下标正上方的水柱。

瓶颈在于边界被反复寻找。相邻位置的左侧最高值往往相同，但直接方法仍从头扫描；右侧同理。``n`` 根柱子各进行最多
``n`` 次搜索，最坏时间为 ``O(n^2)``。

前后缀最大值复用边界
~~~~~~~~~~~~~~~~~~~~

左侧最高值满足递推关系：

.. math::

   L_i=\max(L_{i-1},height[i])

右侧最高值对称地从右向左递推。``prefixAndSuffixMaximums`` 先分别构造两个数组，再用同一水量公式结算每一列。
这样每个方向的最大值只计算一次，时间降为 ``O(n)``，代价是 ``O(n)`` 额外空间。

这一步已经揭示了核心状态：处理某一侧时，并不需要知道那一侧所有柱子，只需知道截至当前位置的最高柱。

双指针为什么只结算较低边界一侧
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

双指针从两端向中间扫描，``leftMaximum`` 与 ``rightMaximum`` 分别表示已经看过的左侧、右侧最高柱。

若 ``leftMaximum <= rightMaximum``，右侧已经存在一根高度至少为 ``rightMaximum`` 的柱子，因此也必然不低于
``leftMaximum``。对当前 ``left`` 位置而言：

* 左边界最高值已经确定为 ``leftMaximum``；
* 右侧至少存在一根不低于它的挡板；
* 水位的较低边界必然是 ``leftMaximum``。

所以当前水量可立即确定为 ``leftMaximum - height[left]``。尚未扫描区域即使出现更高柱，也无法让较低的左边界
升高；出现较低柱也不会消除已经找到的右挡板。该位置以后无需修正，可以移动 ``left``。

若 ``leftMaximum > rightMaximum``，同理可确定右指针位置的水量。每轮至少结算一个位置，最终覆盖全部下标。

更新最大值后再加水
~~~~~~~~~~~~~~~~~~

处理某个位置时先执行：

.. code-block:: text

   sideMaximum = max(sideMaximum, height[position])

再累加 ``sideMaximum - height[position]``。若当前位置本身刷新了最高柱，它是新的挡板，水量自然为零；若没有刷新，
差值就是该柱上方水深。这个顺序也保证累加值永远非负。

状态演化
~~~~~~~~

对 ``height = [4, 2, 0, 3, 2, 5]``：

.. list-table::
   :header-rows: 1

   * - 结算位置
     - ``leftMaximum``
     - ``rightMaximum``
     - 本轮增加
     - 累计
   * - 左 0，高度 4
     - 4
     - 0
     - 0
     - 0
   * - 右 5，高度 5
     - 4
     - 5
     - 0
     - 0
   * - 左 1，高度 2
     - 4
     - 5
     - 2
     - 2
   * - 左 2，高度 0
     - 4
     - 5
     - 4
     - 6
   * - 左 3，高度 3
     - 4
     - 5
     - 1
     - 7
   * - 左 4，高度 2
     - 4
     - 5
     - 2
     - 9

右侧最高柱达到 5 后，左侧最高值 4 始终较低，因此剩余左侧位置可以依次确定。

单调栈是另一种结算方向
~~~~~~~~~~~~~~~~~~~~~~

前后缀与双指针按“竖直列”计算水量。单调栈改为按“横向凹槽层”结算。

栈中保存尚未找到右挡板的柱子下标，并保持对应高度非递增。遇到更高的 ``right`` 时，不断弹出较低柱：

* 弹出的 ``bottom`` 是本层凹槽底；
* 弹出后的栈顶 ``left`` 是左挡板；
* 当前柱 ``right`` 是右挡板；
* 横向宽度为 ``right - left - 1``；
* 新增水层高度为 ``min(height[left], height[right]) - height[bottom]``。

若弹出后栈为空，说明没有左挡板，不能蓄水。一个下标最多入栈和出栈各一次，因此时间仍为 ``O(n)``。不同弹出操作
结算的是不同高度层，不会重复计算已经由更低槽底结算的水。

从边界数组压缩到常量状态
~~~~~~~~~~~~~~~~~~~~~~~~

四种方法的演进关系是：

#. 逐柱扫描直接使用水位定义，但重复寻找左右最高柱；
#. 前后缀数组缓存每个位置的两个最高值，删除重复扫描；
#. 双指针观察到水位只由较低边界决定，每轮只要另一侧已有不低于它的挡板，就能提前结算，因此无需保存全部数组；
#. 单调栈从另一维度处理问题，在右挡板出现时一次结算一个横向凹槽层。

公开入口采用双指针，因为它同时达到线性时间和常量额外空间。

复杂度分析
~~~~~~~~~~

设柱子数量为 ``n``。

* 逐柱向两侧扫描需要 ``O(n^2)`` 时间、``O(1)`` 额外空间；
* 前后缀最大值需要 ``O(n)`` 时间、``O(n)`` 额外空间；
* 单调栈中每个下标最多入栈和出栈一次，需要 ``O(n)`` 时间、``O(n)`` 额外空间；
* 双指针中每个位置只结算一次，需要 ``O(n)`` 时间、``O(1)`` 额外空间。
