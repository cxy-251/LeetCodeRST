0011. Container With Most Water
===============================

题目信息
--------

:题号: 0011
:难度: Medium
:主题: 数组、双指针、贪心
:原题: `LeetCode 0011 <https://leetcode.com/problems/container-with-most-water/>`_
:重点: 从枚举全部边界对，推导到短板端点支配其全部内侧候选，并用双指针一次排除一组组合

题目重述
--------

给定整数数组 ``height``。下标 ``i`` 处有一条从 ``(i, 0)`` 延伸到 ``(i, height[i])`` 的竖线。
选择两个不同下标 ``left < right``，两条竖线与横轴围成容器，其容量为
``(right - left) * min(height[left], height[right])``。

需要返回所有下标对能够形成的最大容量。竖线不能倾斜。数组长度位于 ``[2, 10^5]``，高度位于
``[0, 10^4]``；最大可能容量不超过 ``999990000``，可以由 32 位有符号整数保存。

自建示例
--------

* 最优解不使用最高线：``height = [8, 1, 1, 1, 10, 1, 1, 1, 8]``，两端容量为 ``8 * 8 = 64``；
* 只有两条线：``height = [4, 4]``，唯一容量为 ``4``；
* 包含零高度：``height = [0, 6, 2, 5]``，下标 ``1``、``3`` 形成容量 ``2 * 5 = 10``；
* 等高短板：``height = [5, 1, 5]``，两端容量为 ``10``，任意删除一个等高端点都不会遗漏更优解；
* 全部为零：``height = [0, 0, 0]``，返回 ``0``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int enumeratePairs(const std::vector<int>& height) {
           int best = 0;
           for (int left = 0; left < static_cast<int>(height.size()); ++left) {
               for (int right = left + 1; right < static_cast<int>(height.size()); ++right) {
                   const int area = (right - left) * std::min(height[left], height[right]);
                   best = std::max(best, area);
               }
           }
           return best;
       }

       int twoPointers(const std::vector<int>& height) {
           int left = 0;
           int right = static_cast<int>(height.size()) - 1;
           int best = 0;
           while (left < right) {
               const int area = (right - left) * std::min(height[left], height[right]);
               best = std::max(best, area);
               if (height[left] <= height[right]) {
                   ++left;
               } else {
                   --right;
               }
           }
           return best;
       }

   public:
       int maxArea(std::vector<int>& height) {
           return twoPointers(height);
       }
   };

题解
----

原始搜索空间
~~~~~~~~~~~~

长度为 ``n`` 的数组共有 ``n(n - 1) / 2`` 个合法下标对。``enumeratePairs`` 逐对计算宽度与短板高度，
能够直接覆盖全部候选，时间复杂度为 ``O(n²)``。

每个候选的计算只有常数工作，瓶颈来自下标对数量。要降到线性时间，一次比较后必须证明某个端点再也不可能
参与更优答案，从而删除它与全部内侧位置形成的一整组候选。

面积结构
~~~~~~~~

当前端点为 ``left`` 和 ``right`` 时，面积由两个量相乘：

* 宽度 ``right - left``；
* 可用高度 ``min(height[left], height[right])``。

较高端点不会把水面抬过较低端点，因此短板决定高度。向内移动任一指针都会让宽度严格减小，只有新短板高度
提高，面积才可能增大。

短板支配
~~~~~~~~

假设 ``height[left] <= height[right]``。固定 ``left``，考虑任意内侧右端 ``k < right``：

* 新宽度 ``k - left`` 小于当前宽度；
* 新高度 ``min(height[left], height[k])`` 不超过 ``height[left]``。

因此 ``(left, k)`` 的面积一定不超过已经计算的 ``(left, right)``。当前左端与所有剩余右端形成的候选
都已被当前面积支配，可以安全删除 ``left``。

此时若移动较高的 ``right``，较低的 ``left`` 仍然限制高度，而宽度已经缩小，无法得到更大面积。右端更短时
论证完全对称，所以每轮只能删除较短端点。

等高端点
~~~~~~~~

两端等高时，固定任意一端并把另一端向内移动，宽度减小且短板不可能超过当前共同高度。因此两侧都可以安全
删除。代码统一移动左指针，不影响结果完整性。

状态推演
~~~~~~~~

以 ``height = [2, 9, 3, 4, 8, 5]`` 为例：

.. list-table::
   :header-rows: 1

   * - ``left``
     - ``right``
     - 短板
     - 面积
     - ``best``
     - 删除端点
   * - 0
     - 5
     - 2
     - 10
     - 10
     - 左端 0
   * - 1
     - 5
     - 5
     - 20
     - 20
     - 右端 5
   * - 1
     - 4
     - 8
     - 24
     - 24
     - 右端 4
   * - 1
     - 3
     - 4
     - 8
     - 24
     - 右端 3
   * - 1
     - 2
     - 3
     - 3
     - 24
     - 右端 2

每轮先把当前候选写入 ``best``，再删除被支配的短端。全局最优要么已经记录，要么仍完全位于新区间中。

代码演进
~~~~~~~~

``enumeratePairs`` 使用两层循环显式选择两个边界，每次只检查一个下标对。

``twoPointers`` 从最大宽度开始。短板支配关系把“内层继续尝试所有另一端”替换为一次指针移动：删除短端后，
与该端有关的全部未检查组合同时消失。两个指针都只向中间移动，不需要回退或保存历史候选。

公开入口采用 ``twoPointers``。它保留暴力法对面积公式的直接计算，只改变候选排除方式。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要代价
   * - 枚举下标对
     - ``O(n²)``
     - ``O(1)``
     - 检查全部边界组合
   * - 双指针
     - ``O(n)``
     - ``O(1)``
     - 每轮删除一个端点及其全部内侧候选

双指针每轮至少移动一侧，两个指针总移动次数不超过 ``n - 1``。零高度、重复高度和最小规模都由同一面积
公式与移动规则直接处理。
