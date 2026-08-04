0011. Container With Most Water
===============================

题目信息
--------

:题号: 0011
:难度: Medium
:主题: 数组、双指针、贪心
:原题: `LeetCode 0011 <https://leetcode.com/problems/container-with-most-water/>`_
:重点: 证明较短端点与所有内侧位置形成的容器都不会更优，从而用一次指针移动排除整组候选

题目重述
--------

给定整数数组 ``height``。下标 ``i`` 处有一条从 ``(i, 0)`` 延伸到 ``(i, height[i])`` 的竖线。
选择两个不同下标 ``left < right``，两条竖线与横轴围成一个容器，其容量为：

``(right - left) * min(height[left], height[right])``。

需要返回所有下标对能够形成的最大容量。竖线不能倾斜。数组长度位于 ``[2, 10^5]``，每个高度位于
``[0, 10^4]``。题目范围内最大容量不超过 ``999990000``，可以由 ``int`` 保存。

自建示例
--------

* 普通情况：``height = [2, 9, 3, 4, 8, 5]``，下标 ``1`` 和 ``4`` 的容量为 ``3 * 8 = 24``；
* 最高竖线不一定入选：``height = [8, 1, 1, 1, 10, 1, 1, 1, 8]``，最优容量由两端得到，为 ``64``；
* 包含零高度：``height = [0, 6, 2, 5]``，下标 ``1`` 和 ``3`` 的容量为 ``10``；
* 最小规模：``height = [4, 4]``，唯一可选容量为 ``4``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int bruteForce(const std::vector<int>& height) {
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

枚举全部边界
~~~~~~~~~~~~

长度为 ``n`` 的数组共有 ``n(n - 1) / 2`` 个下标对。``bruteForce`` 用两层循环枚举 ``left`` 和
``right``，逐个计算：

``area(left, right) = (right - left) * min(height[left], height[right])``。

它不会遗漏答案，时间复杂度为 ``O(n²)``。每个候选的计算已经是常数时间，真正需要减少的是候选数量。

从最大宽度开始
~~~~~~~~~~~~~~

双指针首先选择最外侧两条竖线，此时宽度最大。之后无论移动哪一侧，宽度都会减小。因此，新容器只有在短边
高度提高时，才可能超过当前面积。

这说明移动方向不能任意选择：需要找出哪一侧已经不可能再参与更优答案，并把它连同一整组候选一起删除。

删除短边
~~~~~~~~

假设当前两端满足：

``height[left] <= height[right]``。

当前容器的高度就是 ``height[left]``。固定左端，考虑任意内侧右端 ``k``，其中
``left < k < right``：

``k - left < right - left``

并且：

``min(height[left], height[k]) <= height[left]``。

所以：

``area(left, k) <= area(left, right)``。

也就是说，当前 ``left`` 与所有内侧位置形成的容器都不会超过已经检查的当前容器。继续保留这个左端没有价值，
可以执行 ``++left``，一次排除所有以它为左边界的剩余候选。

若右端更短，证明完全对称，执行 ``--right``。两端等高时，两侧都满足同样的排除条件；代码统一移动左端。

不能移动长边
~~~~~~~~~~~~

仍假设左端较短。若此时移动右端，左端保持不变，新的容器高度仍然不会超过 ``height[left]``，宽度却已经
减小。移动长边没有创造更大面积所需的“更高短边”，因此无法排除短边端点，也没有理由优先选择这一方向。

双指针每轮移动短边，不是猜测哪边更有希望，而是删除已经被证明不可能参与更优答案的端点。

循环不变量
~~~~~~~~~~

每轮开始时，尚未被 ``best`` 覆盖的全局最优候选一定仍位于闭区间 ``[left, right]`` 内。

本轮先计算当前两端面积并更新 ``best``。随后删除较短端点，而上面的不等式已经证明：该端点与区间内所有其他
位置组成的候选都不会优于当前面积。因此删除操作不会丢失尚未记录的更优解，不变量在新区间中继续成立。

当两个指针相遇时，区间内已经没有合法下标对。所有被删除候选都经过安全排除，因此 ``best`` 就是全局最大值。

代码演进
~~~~~~~~

``bruteForce`` 的内层循环逐个尝试固定左端对应的所有右端。

``twoPointers`` 用短边排除证明替换这层枚举：计算当前面积后，一次指针移动就删除短端与全部内侧位置形成的
候选。两个指针只向中间移动，不需要回退、哈希表或额外数组。

公开入口采用 ``twoPointers``。两种实现使用相同面积公式，优化只来自候选排除方式的改变。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要工作
   * - 枚举全部边界
     - ``O(n²)``
     - ``O(1)``
     - 检查全部下标对
   * - 双指针
     - ``O(n)``
     - ``O(1)``
     - 每轮删除一个端点及其全部剩余组合

双指针每轮移动一个端点，两个指针总共移动 ``n - 1`` 次。零高度、重复高度和最小规模都由同一排除规则直接
覆盖。
