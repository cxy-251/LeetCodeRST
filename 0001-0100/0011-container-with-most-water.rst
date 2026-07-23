0011. Container With Most Water
===============================

题目信息
--------

:题号: 0011
:难度: Medium
:主题: 数组、双指针、贪心、上界排除
:原题: `LeetCode 0011 <https://leetcode.com/problems/container-with-most-water/>`_
:重点: 面积公式、短板效应、两端指针、整批候选排除、乘积类型

题目重述
--------

给定非负整数数组 ``height``。下标 ``i`` 处有一条高度为 ``height[i]`` 的竖线。选择两个下标
``left < right``，它们与横轴形成容器，面积为：

.. math::

   (right-left)\times\min(height[left],height[right])

求所有下标对中的最大面积。竖线不能倾斜，数组顺序不能改变。

自建示例
--------

.. code-block:: text

   height = [2, 9, 3, 4, 8, 5]
   最优下标为 1 和 4：宽度 3，短板 8，面积 24。

等高端点：

.. code-block:: text

   height = [6, 1, 6]
   两端面积为 12。两侧等高时移动任意一侧都不会遗漏更优解。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       long long enumeratePairs(const std::vector<int>& height) {
           long long best = 0;
           for (int left = 0; left < static_cast<int>(height.size()); ++left) {
               for (
                   int right = left + 1;
                   right < static_cast<int>(height.size());
                   ++right
               ) {
                   const long long area =
                       1LL * (right - left) *
                       std::min(height[left], height[right]);
                   best = std::max(best, area);
               }
           }
           return best;
       }

       long long twoPointers(const std::vector<int>& height) {
           int left = 0;
           int right = static_cast<int>(height.size()) - 1;
           long long best = 0;

           while (left < right) {
               const long long area =
                   1LL * (right - left) *
                   std::min(height[left], height[right]);
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
           return static_cast<int>(twoPointers(height));
       }
   };

题解
----

枚举下标对暴露了真正的搜索空间
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

长度为 ``n`` 的数组共有 ``n(n-1)/2`` 个合法下标对。暴力方法逐对计算宽度和短板高度，时间复杂度
``O(n^2)``。要降到线性时间，必须在一次比较后排除一整组候选。

为什么容器高度只由短板决定
~~~~~~~~~~~~~~~~~~~~~~~~

两条边界中较高的一侧不会提高水面，因为水会从较低一侧溢出。当前区间的面积上限因此由
``min(height[left], height[right])`` 决定；宽度则由两下标距离决定。

为什么必须移动较短的一侧
~~~~~~~~~~~~~~~~~~~~~~~~

假设 ``height[left] <= height[right]``。固定 ``left``，把右端移动到任意 ``k < right``：

* 宽度 ``k-left`` 严格小于 ``right-left``；
* 新短板高度最多仍是 ``height[left]``。

所以所有 ``(left, k)`` 的面积都不会超过已检查的 ``(left, right)``。当前左端的全部剩余候选已经被当前
面积支配，可以安全删除 ``left``。移动较高的右端则保留同一个短板且缩短宽度，不可能产生更大面积。
右侧较短时论证完全对称。

两侧等高时为什么移动任意一侧都成立
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若两端高度相等，固定任一端并向内选择另一端，宽度更小，短板高度又不可能超过当前共同高度。因此删除
左端或右端都能安全排除该端的全部内侧组合。代码统一移动左端。

指针状态演化
~~~~~~~~~~~~

对 ``[2, 9, 3, 4, 8, 5]``：

.. list-table::
   :header-rows: 1

   * - ``left``
     - ``right``
     - 宽度
     - 短板
     - 面积
     - ``best``
     - 移动
   * - 0
     - 5
     - 5
     - 2
     - 10
     - 10
     - 左端
   * - 1
     - 5
     - 4
     - 5
     - 20
     - 20
     - 右端
   * - 1
     - 4
     - 3
     - 8
     - 24
     - 24
     - 右端
   * - 1
     - 3
     - 2
     - 4
     - 8
     - 24
     - 右端

为什么每次排除都保留全局最优可能性
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每轮先记录当前端点对。被删除的短端与所有内侧位置形成的候选，都受“更小宽度 + 不高于当前短板”的
上界限制，不可能优于当前候选。于是全局最优要么已经进入 ``best``，要么仍由新区间内的两个下标组成。
当指针相遇时已无合法下标对，``best`` 即为全局最大面积。

复杂度来源
~~~~~~~~~~

暴力方法检查 ``O(n^2)`` 个下标对。双指针中每轮至少移动一个指针，每个指针最多移动 ``n-1`` 次，时间
复杂度 ``O(n)``，工作空间 ``O(1)``。乘法先提升到更宽整数可避免中间乘积溢出。

九语言实现
----------

C
~

.. code-block:: c

   int maxArea(int* height, int heightSize) {
       int left = 0, right = heightSize - 1;
       long long best = 0;
       while (left < right) {
           int shorter = height[left] < height[right] ? height[left] : height[right];
           long long area = (long long)(right - left) * shorter;
           if (area > best) best = area;
           if (height[left] <= height[right]) ++left;
           else --right;
       }
       return (int)best;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxArea(self, height: list[int]) -> int:
           left, right, best = 0, len(height) - 1, 0
           while left < right:
               best = max(best, (right - left) * min(height[left], height[right]))
               if height[left] <= height[right]:
                   left += 1
               else:
                   right -= 1
           return best

Java
~~~~

.. code-block:: java

   class Solution {
       public int maxArea(int[] height) {
           int left = 0, right = height.length - 1;
           long best = 0;
           while (left < right) {
               long area = (long)(right - left) * Math.min(height[left], height[right]);
               best = Math.max(best, area);
               if (height[left] <= height[right]) left++;
               else right--;
           }
           return (int)best;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn max_area(height: Vec<i32>) -> i32 {
           let (mut left, mut right) = (0usize, height.len() - 1);
           let mut best = 0_i64;
           while left < right {
               let area = (right - left) as i64 * height[left].min(height[right]) as i64;
               best = best.max(area);
               if height[left] <= height[right] { left += 1; } else { right -= 1; }
           }
           best as i32
       }
   }

Go
~~

.. code-block:: go

   func maxArea(height []int) int {
       left, right, best := 0, len(height)-1, 0
       for left < right {
           shorter := height[left]
           if height[right] < shorter { shorter = height[right] }
           area := (right-left)*shorter
           if area > best { best = area }
           if height[left] <= height[right] { left++ } else { right-- }
       }
       return best
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxArea(height: number[]): number {
       let left = 0, right = height.length - 1, best = 0;
       while (left < right) {
           best = Math.max(best, (right - left) * Math.min(height[left], height[right]));
           if (height[left] <= height[right]) left += 1;
           else right -= 1;
       }
       return best;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int MaxArea(int[] height) {
           int left = 0, right = height.Length - 1;
           long best = 0;
           while (left < right) {
               long area = (long)(right - left) * Math.Min(height[left], height[right]);
               best = Math.Max(best, area);
               if (height[left] <= height[right]) left++;
               else right--;
           }
           return (int)best;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function max_area(height::Vector{Int})::Int
       left, right, best = 1, length(height), 0
       while left < right
           best = max(best, (right - left) * min(height[left], height[right]))
           if height[left] <= height[right]
               left += 1
           else
               right -= 1
           end
       end
       best
   end

R
~

.. code-block:: r

   maxArea <- function(height) {
       left <- 1L; right <- length(height); best <- 0
       while (left < right) {
           area <- (right - left) * min(height[[left]], height[[right]])
           best <- max(best, area)
           if (height[[left]] <= height[[right]]) left <- left + 1L
           else right <- right - 1L
       }
       best
   }
