0042. Trapping Rain Water
=========================

题目信息
--------

:题号: 0042. 接雨水
:难度: Hard
:主题: 数组、前后缀最大值、单调栈、双指针
:原题: `LeetCode 0042 <https://leetcode.com/problems/trapping-rain-water/>`_
:重点: 从逐柱重复寻找左右挡板，推导到缓存边界、按层结算和常量空间双指针

题目重述
--------

给定非负整数数组 ``height``。每个元素表示一根宽度为 ``1`` 的柱子高度，所有柱子相邻排列。降雨后，水会保留在
左右都有挡板的低洼位置。返回所有位置能够储存的水量总和。

柱子本身不储水。数组两端若缺少另一侧挡板，也无法留住水。``height`` 的长度位于 ``[1, 2 * 10^4]``，每根
柱子高度位于 ``[0, 10^5]``。

自建示例
--------

* 多个凹槽：``height = [3, 0, 1, 3, 0, 2]``，各位置水量为 ``[0, 3, 2, 0, 2, 0]``，答案为 ``7``；
* 右边界更高：``height = [4, 2, 0, 3, 2, 5]``，各位置水量为 ``[0, 2, 4, 1, 2, 0]``，答案为 ``9``；
* 单调递增：``height = [0, 1, 2, 3]``，答案为 ``0``；
* 单调递减：``height = [4, 3, 2, 1]``，答案为 ``0``；
* 平台：``height = [2, 2, 2]``，答案为 ``0``。

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

单列水位
~~~~~~~~

位置 ``i`` 上方的水面由左右最高挡板中较低的一侧决定。设：

.. math::

   L_i=\max(height[0..i]),\qquad R_i=\max(height[i..n-1])

则该位置水量为：

.. math::

   water_i=\min(L_i,R_i)-height[i]

两个最大值都包含当前位置，所以差值不会为负。每单位水只属于一个下标对应的竖直列，全部 ``water_i`` 相加就是
总水量。后续方法都没有改变这个公式，只是在减少取得 ``L_i`` 与 ``R_i`` 的成本，或改用横向水层结算同一体积。

逐柱搜索
~~~~~~~~

``scanBothSidesForEveryColumn`` 对每个位置重新向左、向右寻找最高柱，再代入水位公式。它直接对应定义，也不会漏算
或重复计算。

相邻位置的左右最高值通常大量相同，但该方法仍会重复扫描。``n`` 个位置各自最多检查 ``n`` 根柱子，最坏时间为
``O(n^2)``。

前后缀边界
~~~~~~~~~~

左侧最高值满足：

.. math::

   L_i=\max(L_{i-1},height[i])

右侧最高值可以从右向左对称递推。``prefixAndSuffixMaximums`` 分别构造两个边界数组，再逐列应用水位公式。每个方向
只扫描一次，时间降为 ``O(n)``，代价是保存两个长度为 ``n`` 的数组。

这一步说明，计算某一侧的挡板时不需要保留所有历史柱子，只需保留目前见过的最高值。双指针进一步利用“水位只由
较低挡板决定”，把两个边界数组压缩为两个变量。

双指针不变量
~~~~~~~~~~~~

双指针维护尚未结算区间 ``[left, right]``，以及已经扫描部分的最高柱 ``leftMaximum`` 和 ``rightMaximum``。

若 ``leftMaximum <= rightMaximum``，右侧已经存在一根高度至少为 ``rightMaximum`` 的柱子，因此也不低于
``leftMaximum``。当前左端位置的右挡板已经足够高，限制水位的只能是左侧最高值。先更新：

.. code-block:: text

   leftMaximum = max(leftMaximum, height[left])

随后该位置水量就是 ``leftMaximum - height[left]``。未扫描区间以后即使出现更高柱，也无法改变较低的左边界；
因此当前位置可以永久结算并移动 ``left``。

若 ``leftMaximum > rightMaximum``，对称地结算右端位置。每轮至少删除一个候选位置，所有下标最终恰好处理一次。
更新最高值后再累加，也保证刷新边界的柱子贡献为零，其他位置贡献为非负水深。

以 ``height = [4, 2, 0, 3, 2, 5]`` 为例：

.. list-table::
   :header-rows: 1

   * - 结算位置
     - 左最高
     - 右最高
     - 增加水量
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

右侧最高柱达到 ``5`` 后，左侧最高值 ``4`` 始终较低，因此剩余左侧位置都能直接确定。

单调栈水层
~~~~~~~~~~

前后缀和双指针按竖直列结算。``monotonicStack`` 改为在右挡板出现时按横向水层结算。

栈保存尚未找到右挡板的柱子下标，并保持对应高度非递增。遇到更高的当前柱 ``right`` 时，弹出的 ``bottom`` 是
凹槽底；弹出后的栈顶 ``left`` 是左挡板；当前柱是右挡板。新增水层为：

.. math::

   width=right-left-1

.. math::

   boundedHeight=\min(height[left],height[right])-height[bottom]

.. math::

   water=width\times boundedHeight

若弹出后栈为空，说明缺少左挡板，不能蓄水。每次弹出只结算高于当前槽底、尚未被计算的一层水，因此不同弹出操作
不会重复。每个下标最多入栈和出栈各一次，总时间仍为 ``O(n)``。

代码演进
~~~~~~~~

``scanBothSidesForEveryColumn`` 直接使用单列水位公式，但反复寻找左右最高柱。

``prefixAndSuffixMaximums`` 缓存每个位置的两个边界，把重复扫描降为线性预处理。

``twoPointers`` 只结算挡板较低的一侧，使尚未使用的完整边界数组压缩为两个最高值变量。公开入口采用该方法，因为它
同时达到线性时间与常量额外空间。

``monotonicStack`` 保留线性时间，从另一维度按凹槽水层结算，适合训练“右侧元素触发此前状态出栈”的模型。

复杂度分析
~~~~~~~~~~

设柱子数量为 ``n``。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
   * - 逐柱搜索
     - ``O(n^2)``
     - ``O(1)``
   * - 前后缀最大值
     - ``O(n)``
     - ``O(n)``
   * - 单调栈
     - ``O(n)``
     - ``O(n)``
   * - 双指针
     - ``O(n)``
     - ``O(1)``
