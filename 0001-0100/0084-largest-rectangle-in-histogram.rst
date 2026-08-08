0084. Largest Rectangle in Histogram
====================================

题目信息
--------

:题号: 0084. 柱状图中最大的矩形
:难度: Hard
:主题: 数组、单调栈、区间边界
:原题: `LeetCode 0084 <https://leetcode.com/problems/largest-rectangle-in-histogram/>`_
:重点: 从固定柱高向两侧扩展，推导到一次扫描确定左右首个更矮位置

题目重述
--------

给定非负整数数组 ``heights``，其中 ``heights[i]`` 表示第 ``i`` 根柱子的高度，每根柱子的宽度均为
``1``。

选择若干根连续柱子，可以在它们覆盖的范围内画一个矩形。矩形高度不能超过区间内最低柱子的高度，宽度等于
所选柱子数量。返回柱状图中能够形成的最大矩形面积。

约束为：

- ``1 <= heights.length <= 10^5``；
- ``0 <= heights[i] <= 10^4``。

自建示例
--------

.. code-block:: text

   输入：heights = [3,1,4,5,2]
   输出：8

下标 ``2..3`` 的柱高为 ``4,5``，可以形成高度 ``4``、宽度 ``2`` 的矩形，面积为 ``8``。

.. code-block:: text

   输入：heights = [2,4,2,1]
   输出：6

前三根柱子的最低高度为 ``2``，宽度为 ``3``，面积为 ``6``。

.. code-block:: text

   输入：heights = [2,2,2]
   输出：6

三根等高柱可以共同形成高度 ``2``、宽度 ``3`` 的矩形。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int expandEachBar(const std::vector<int>& heights) {
           const int n = static_cast<int>(heights.size());
           int best = 0;

           for (int middle = 0; middle < n; ++middle) {
               int left = middle;
               int right = middle;

               while (left > 0 && heights[left - 1] >= heights[middle]) {
                   --left;
               }
               while (right + 1 < n && heights[right + 1] >= heights[middle]) {
                   ++right;
               }

               const int width = right - left + 1;
               best = std::max(best, heights[middle] * width);
           }

           return best;
       }

       int boundaryArrays(const std::vector<int>& heights) {
           const int n = static_cast<int>(heights.size());
           std::vector<int> left_smaller(n);
           std::vector<int> right_smaller(n);
           std::vector<int> stack;

           for (int index = 0; index < n; ++index) {
               while (!stack.empty() && heights[stack.back()] >= heights[index]) {
                   stack.pop_back();
               }
               left_smaller[index] = stack.empty() ? -1 : stack.back();
               stack.push_back(index);
           }

           stack.clear();

           for (int index = n - 1; index >= 0; --index) {
               while (!stack.empty() && heights[stack.back()] >= heights[index]) {
                   stack.pop_back();
               }
               right_smaller[index] = stack.empty() ? n : stack.back();
               stack.push_back(index);
           }

           int best = 0;
           for (int index = 0; index < n; ++index) {
               const int width = right_smaller[index] - left_smaller[index] - 1;
               best = std::max(best, heights[index] * width);
           }

           return best;
       }

       int onePassStack(const std::vector<int>& heights) {
           const int n = static_cast<int>(heights.size());
           std::vector<int> stack{-1};
           int best = 0;

           for (int right = 0; right <= n; ++right) {
               const int current_height = right == n ? 0 : heights[right];

               while (stack.back() != -1 &&
                      heights[stack.back()] > current_height) {
                   const int middle = stack.back();
                   stack.pop_back();

                   const int left = stack.back();
                   const int width = right - left - 1;
                   best = std::max(best, heights[middle] * width);
               }

               stack.push_back(right);
           }

           return best;
       }

   public:
       int largestRectangleArea(std::vector<int>& heights) {
           return onePassStack(heights);
       }
   };

题解
----

固定矩形高度
~~~~~~~~~~~~

任意合法矩形的高度都等于其覆盖区间中的最小柱高。选定一根柱子 ``middle``，把
``heights[middle]`` 作为矩形高度后，矩形可以持续向左右扩展，直到遇到第一根严格更矮的柱子。

因此，每根柱子都对应一个最大可扩展区间：

.. code-block:: text

   左边界：左侧第一根高度小于 heights[middle] 的柱子
   右边界：右侧第一根高度小于 heights[middle] 的柱子

若这两个边界分别为 ``left`` 和 ``right``，则可用宽度为：

.. code-block:: text

   width = right - left - 1

逐柱向外扩展
~~~~~~~~~~~~

``expandEachBar`` 直接为每根柱子向左右扫描，寻找首个更矮位置。它完整枚举了所有可能成为矩形最低柱的
位置，逻辑直接。

当柱高单调递增、单调递减或大量相等时，不同柱子的扩展区间高度重叠，同一段柱子会被反复扫描，最坏时间
复杂度达到 ``O(n^2)``。

预计算两侧边界
~~~~~~~~~~~~~~

重复工作来自反复寻找“首个更矮柱”。单调递增栈可以在线性时间内为所有位置计算这个边界。

从左向右扫描时，栈保存下标，对应柱高严格递增。处理 ``index`` 前，持续弹出高度大于或等于当前柱高的
下标，弹栈结束后的栈顶就是左侧首个严格更矮位置。栈为空时使用边界 ``-1``。

从右向左执行同样过程，可以得到右侧首个严格更矮位置；不存在时使用边界 ``n``。每根柱的最大面积为：

.. code-block:: text

   heights[index] * (right_smaller[index] - left_smaller[index] - 1)

该方法已经达到 ``O(n)`` 时间，但需要两个长度为 ``n`` 的边界数组。

延迟结算
~~~~~~~~

右边界只有在遇到更矮柱时才真正确定，因此可以不保存完整的右边界数组，而是在扫描过程中直接结算面积。

单遍方法的栈保持柱高非递减。栈内每个下标都表示：

- 它左侧首个更矮位置已经由栈中前一个下标确定；
- 它右侧尚未遇到更矮柱，因此面积暂时不能结算。

扫描到 ``right`` 时，若当前高度低于栈顶柱高，当前位置就是栈顶柱的右侧首个更矮位置。此时弹出栈顶
``middle``，弹栈后的新栈顶就是其左侧首个更矮位置。

.. code-block:: text

   middle = stack.top
   stack.pop()
   left = stack.top
   width = right - left - 1
   area = heights[middle] * width

出栈后的左边界
~~~~~~~~~~~~~~

栈中下标按位置递增，柱高保持非递减。``middle`` 入栈后，位于它和当前 ``right`` 之间且更高的柱子会
先于它出栈。

因此轮到 ``middle`` 出栈时，新的栈顶一定是左侧最近的、更矮或等高关系经过栈规则处理后可作为边界的
位置。区间 ``left + 1 .. right - 1`` 中所有柱高都不低于 ``heights[middle]``，该宽度全部可用。

等高柱处理
~~~~~~~~~~

单遍实现只在栈顶高度严格大于当前高度时出栈，所以等高柱可以同时留在栈中。较早的等高柱最终能取得更宽
区间，较晚的等高柱只会产生面积不更大的候选，不影响最大值。

双边界实现使用 ``>=`` 弹栈，让每个位置直接获得两侧严格更矮边界。两种等高处理策略不同，计算出的候选
集合可能不同，但都至少包含等高连续段能够形成的最大矩形。

首尾哨兵
~~~~~~~~

栈初始放入下标 ``-1``，它充当虚拟左边界，使宽度公式无需为空栈单独分支。

遍历完真实柱子后，再处理一个高度为 ``0`` 的虚拟尾柱。它会迫使仍留在栈中的所有正高度柱子出栈，解决
单调递增数组在正常扫描期间没有机会结算的问题。虚拟尾柱只存在于控制流程中，不会写入输入数组。

过程示例
~~~~~~~~

对 ``heights = [3,1,4,5,2]``：

.. list-table::
   :header-rows: 1

   * - 当前下标与高度
     - 栈中真实柱高
     - 结算
   * - ``0:3``
     - ``[3]``
     - 右侧更矮位置未知
   * - ``1:1``
     - ``[3]``
     - 弹出 3，宽度 1，面积 3
   * - ``2:4``
     - ``[1,4]``
     - 暂不结算
   * - ``3:5``
     - ``[1,4,5]``
     - 暂不结算
   * - ``4:2``
     - ``[1,4,5]``
     - 依次弹出 5 和 4，面积最大为 ``4 * 2 = 8``
   * - 虚拟尾柱 0
     - 剩余候选
     - 结算所有仍未获得右边界的柱子

完整性
~~~~~~

最大矩形覆盖区间中至少有一根柱子的高度等于矩形高度。选取其中任意一根最低柱 ``middle``，当它被单调栈
弹出时，算法已经确定它左右两侧首个更矮位置。

算法为该柱计算的区间是以其高度能够覆盖的最大区间，必然包含原最大矩形的区间，面积不会更小。另一方面，
每个计算出的候选都由真实柱高和全部不低于该高度的连续区间组成，因此一定是合法矩形。两者共同保证最终值
恰好是最大面积。

复杂度
~~~~~~

逐柱扩展最坏需要 ``O(n^2)`` 时间和 ``O(1)`` 额外空间。

双边界数组方法和单遍单调栈方法都只让每个下标入栈一次、出栈至多一次，时间为 ``O(n)``。双边界方法使用
``O(n)`` 边界数组，单遍方法使用 ``O(n)`` 栈空间。
