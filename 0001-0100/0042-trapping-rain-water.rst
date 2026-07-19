0042. Trapping Rain Water
=========================

题目信息
--------

:题号: 0042
:难度: Hard
:主题: 数组、双指针、前缀最大值、边界证明
:原题: `LeetCode 0042 <https://leetcode.com/problems/trapping-rain-water/>`_
:访问状态: Available
:教学重点: 单柱蓄水公式、较低已知边界、双指针处理顺序、线性空间消除

题目重述
--------

给定一组非负整数 ``height``，每个元素表示宽度为 1 的柱子高度。下雨后，柱子之间可能形成
凹槽。返回所有位置能够储存的雨水总量。

水不会停留在数组两端之外。某个位置能存多少水，由它左侧最高柱和右侧最高柱中较低的一侧
决定。

自建示例
--------

普通凹槽
~~~~~~~~

.. code-block:: text

   输入：[4, 2, 0, 3, 2, 5]
   输出：9

   各位置蓄水量为 [0, 2, 4, 1, 2, 0]，总和为 9。

单个浅槽
~~~~~~~~

.. code-block:: text

   输入：[2, 0, 2]
   输出：2

没有蓄水
~~~~~~~~

.. code-block:: text

   输入：[1, 2, 3, 4]
   输出：0

   输入：[4, 3, 2, 1]
   输出：0

边界不足
~~~~~~~~

.. code-block:: text

   输入：[]
   输出：0

   输入：[7, 1]
   输出：0

问题抽象
--------

对位置 ``i``，设：

.. code-block:: text

   left_max[i]  = height[0..i] 的最大值
   right_max[i] = height[i..n-1] 的最大值

该位置水面不能高于任何一侧较低的边界，因此：

.. code-block:: text

   water[i] = min(left_max[i], right_max[i]) - height[i]

左右最大值都包含当前位置，所以差值不会为负。直接预处理两张数组可以在线性时间求解，
额外空间为 ``O(n)``。本题主解法进一步观察：计算当前位置时只需要知道较小的那一侧最大值，
无需保存每个位置的完整前后缀数组。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 双指针与左右最大值
     - ``O(n)``
     - ``O(1)``
     - 主解法；在线决定哪一侧水量已经确定
   * - 前缀最大值与后缀最大值数组
     - ``O(n)``
     - ``O(n)``
     - 公式最直观，适合推导主解法
   * - 单调递减栈
     - ``O(n)``
     - ``O(n)``
     - 按横向水层结算，适合学习凹槽边界配对
   * - 对每个位置向两侧扫描
     - ``O(n^2)``
     - ``O(1)``
     - 重复寻找最大值，规模较大时不可取

主解法：比较两侧已知最大边界
------------------------------

状态含义
~~~~~~~~

维护四个核心状态：

* ``left``、``right``：尚未结算区间的左右端点；
* ``left_max``：区间左侧已经扫描部分的最高柱，包含 ``height[left]``；
* ``right_max``：区间右侧已经扫描部分的最高柱，包含 ``height[right]``；
* ``water``：已经结算位置的蓄水总量。

每轮先更新两侧最大值，然后比较 ``left_max`` 与 ``right_max``：

* 若 ``left_max <= right_max``，结算 ``left``；
* 否则结算 ``right``。

为什么较小一侧可以立即结算
~~~~~~~~~~~~~~~~~~~~~~~~~~

当 ``left_max <= right_max`` 时，右侧已经存在高度至少为 ``right_max`` 的柱子。即使尚未扫描
区间内部还有更高柱，位置 ``left`` 的较低边界也已经确定为 ``left_max``：

.. code-block:: text

   min(左侧最高柱, 右侧最高柱) = left_max

所以当前位置蓄水量就是 ``left_max - height[left]``，未来信息不会改变它。结算后把 ``left``
向右移动。

``right_max < left_max`` 时完全对称，当前位置 ``right`` 的水量由 ``right_max`` 确定。

核心不变量
~~~~~~~~~~

每轮循环开始并更新两侧最大值后：

* ``left`` 左边的所有位置已经正确结算；
* ``right`` 右边的所有位置已经正确结算；
* ``left_max`` 是从原数组左端到 ``left`` 的最高柱；
* ``right_max`` 是从 ``right`` 到原数组右端的最高柱；
* 尚未结算的位置恰好位于闭区间 ``[left, right]``；
* ``water`` 等于所有已结算位置的真实蓄水量之和。

每轮至少移动一个指针，未结算区间严格缩小，最终所有位置都被结算一次。

正确性依据
~~~~~~~~~~

考虑任意一轮。

若 ``left_max <= right_max``，右侧已经扫描区域中存在高度为 ``right_max`` 的柱子，因此位置
``left`` 的右侧最高柱至少为 ``right_max``。它的左侧最高柱恰好为 ``left_max``，较低边界
必为 ``left_max``，算法加入 ``left_max - height[left]``，与单柱公式一致。

若 ``right_max < left_max``，同理，位置 ``right`` 的左侧最高柱至少为 ``left_max``，较低
边界必为 ``right_max``，算法加入 ``right_max - height[right]``。

因此每轮结算的位置都得到真实水量。指针每次向内移动，所有位置恰好结算一次，累加结果等于
总蓄水量。

复杂度
~~~~~~

设柱子数量为 ``n``：

* 两个指针总共移动 ``n`` 次，每个位置只处理一次，时间复杂度为 ``O(n)``；
* 只使用固定数量的索引和整数变量，额外空间复杂度为 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   int trap(int *height, int heightSize) {
       int left = 0;
       int right = heightSize - 1;
       int left_max = 0;
       int right_max = 0;
       int water = 0;

       while (left <= right) {
           if (height[left] > left_max) {
               left_max = height[left];
           }
           if (height[right] > right_max) {
               right_max = height[right];
           }

           if (left_max <= right_max) {
               water += left_max - height[left];
               ++left;
           } else {
               water += right_max - height[right];
               --right;
           }
       }

       return water;
   }

当 ``heightSize == 0`` 时，``right`` 为 ``-1``，循环条件立即失败，不会访问数组。题目约束下
总水量可以用 ``int`` 表示。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int trap(vector<int>& height) {
           int left = 0;
           int right = static_cast<int>(height.size()) - 1;
           int leftMax = 0;
           int rightMax = 0;
           int water = 0;

           while (left <= right) {
               leftMax = max(leftMax, height[left]);
               rightMax = max(rightMax, height[right]);

               if (leftMax <= rightMax) {
                   water += leftMax - height[left];
                   ++left;
               } else {
                   water += rightMax - height[right];
                   --right;
               }
           }

           return water;
       }
   };

空 ``vector`` 时 ``size()`` 先转换为有符号 ``int`` 再减一，得到 ``-1``；不要在无符号
``size_t`` 上直接执行 ``size() - 1``。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def trap(self, height: list[int]) -> int:
           left = 0
           right = len(height) - 1
           left_max = 0
           right_max = 0
           water = 0

           while left <= right:
               left_max = max(left_max, height[left])
               right_max = max(right_max, height[right])

               if left_max <= right_max:
                   water += left_max - height[left]
                   left += 1
               else:
                   water += right_max - height[right]
                   right -= 1

           return water

空列表时 ``right == -1``，``left <= right`` 为假，因此不会触发 Python 的负下标访问。

Java
~~~~

.. code-block:: java

   class Solution {
       public int trap(int[] height) {
           int left = 0;
           int right = height.length - 1;
           int leftMax = 0;
           int rightMax = 0;
           int water = 0;

           while (left <= right) {
               leftMax = Math.max(leftMax, height[left]);
               rightMax = Math.max(rightMax, height[right]);

               if (leftMax <= rightMax) {
                   water += leftMax - height[left];
                   ++left;
               } else {
                   water += rightMax - height[right];
                   --right;
               }
           }

           return water;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn trap(height: Vec<i32>) -> i32 {
           if height.is_empty() {
               return 0;
           }

           let mut left: usize = 0;
           let mut right: usize = height.len() - 1;
           let mut left_max = 0;
           let mut right_max = 0;
           let mut water = 0;

           loop {
               left_max = left_max.max(height[left]);
               right_max = right_max.max(height[right]);

               if left_max <= right_max {
                   water += left_max - height[left];
                   if left == right {
                       break;
                   }
                   left += 1;
               } else {
                   water += right_max - height[right];
                   if left == right {
                       break;
                   }
                   right -= 1;
               }
           }

           water
       }
   }

Rust 的 ``usize`` 不能表示 ``-1``，所以先单独处理空数组。循环在处理最后一个位置后立即退出，
避免 ``right -= 1`` 在零处下溢。

Go
~~

.. code-block:: go

   func trap(height []int) int {
       left := 0
       right := len(height) - 1
       leftMax := 0
       rightMax := 0
       water := 0

       for left <= right {
           if height[left] > leftMax {
               leftMax = height[left]
           }
           if height[right] > rightMax {
               rightMax = height[right]
           }

           if leftMax <= rightMax {
               water += leftMax - height[left]
               left++
           } else {
               water += rightMax - height[right]
               right--
           }
       }

       return water
   }

Go 空切片时 ``right`` 为 ``-1``，循环不执行。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function trap(height: number[]): number {
       let left = 0;
       let right = height.length - 1;
       let leftMax = 0;
       let rightMax = 0;
       let water = 0;

       while (left <= right) {
           leftMax = Math.max(leftMax, height[left]);
           rightMax = Math.max(rightMax, height[right]);

           if (leftMax <= rightMax) {
               water += leftMax - height[left];
               left++;
           } else {
               water += rightMax - height[right];
               right--;
           }
       }

       return water;
   }

题目数值范围远低于 JavaScript ``number`` 的安全整数上限，累加不会产生精度损失。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int Trap(int[] height) {
           int left = 0;
           int right = height.Length - 1;
           int leftMax = 0;
           int rightMax = 0;
           int water = 0;

           while (left <= right) {
               leftMax = Math.Max(leftMax, height[left]);
               rightMax = Math.Max(rightMax, height[right]);

               if (leftMax <= rightMax) {
                   water += leftMax - height[left];
                   ++left;
               } else {
                   water += rightMax - height[right];
                   --right;
               }
           }

           return water;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function trap(height::Vector{Int})::Int
       left = firstindex(height)
       right = lastindex(height)
       left_max = 0
       right_max = 0
       water = 0

       while left <= right
           left_max = max(left_max, height[left])
           right_max = max(right_max, height[right])

           if left_max <= right_max
               water += left_max - height[left]
               left += 1
           else
               water += right_max - height[right]
               right -= 1
           end
       end

       return water
   end

Julia 的 ``firstindex`` 和 ``lastindex`` 对空向量分别返回 ``1`` 和 ``0``，循环自然跳过；这里
直接使用一基索引，不需要模拟零基坐标。

R
~

.. code-block:: r

   trap <- function(height) {
     left <- 1L
     right <- length(height)
     left_max <- 0
     right_max <- 0
     water <- 0

     while (left <= right) {
       left_max <- max(left_max, height[[left]])
       right_max <- max(right_max, height[[right]])

       if (left_max <= right_max) {
         water <- water + left_max - height[[left]]
         left <- left + 1L
       } else {
         water <- water + right_max - height[[right]]
         right <- right - 1L
       }
     }

     water
   }

R 中 ``water`` 使用双精度数值，避免较大测试下整数加法产生 ``NA``。空向量时 ``right`` 为 0，
循环不执行。

关键边界
--------

* 少于三根柱子：无法形成左右边界，结果为 0；
* 单调递增或递减：每个位置至少一侧缺少更高边界，结果为 0；
* 相同高度平台：平台本身不产生负水量；
* 左右边界等高：任意一侧先结算都正确，本实现选择左侧；
* 内部出现极高柱：会在后续更新相应最大值，不影响已经由较低侧确定的位置；
* 空数组：不同语言应避免无符号下标下溢或负下标误访问。

易错点
------

* 使用 ``max(left_max, right_max)`` 作为水面，导致水越过较低边界；
* 在更新当前端点最大值之前计算差值，产生错误水量；
* 只比较当前柱高，却在证明中误写成比较已知最大边界；
* 移动较高最大边界的一侧，提前结算仍受未知较低边界影响的位置；
* 把每轮双指针移动误判为嵌套扫描，错误写成 ``O(n^2)``；
* Rust/C++ 等语言在空数组上直接用无符号长度减一。

新增与强化知识
--------------

新增
~~~~

* 单柱蓄水量由左右最高边界中的较小者决定；
* 双指针可以根据较小的已知最大边界，在线确定一侧答案；
* “未来信息无法改变当前值”是安全移动指针的重要证明模式。

强化
~~~~

* 复用 0011 的双指针消元思想，但本题比较的是动态最大边界而非当前短板面积；
* 前缀/后缀数组常可通过扫描顺序与不变量压缩到常数空间；
* 空数组边界需要根据有符号、无符号和一基索引语义分别处理。

关联题目
--------

* `0011. Container With Most Water <0011-container-with-most-water.rst>`_：同样从两端收缩，
  但目标是选一对边界形成最大单个容器；
* `0032. Longest Valid Parentheses <0032-longest-valid-parentheses.rst>`_：展示另一种利用边界状态
  在线结算区间贡献的方法。

最小自检
--------

#. 为什么单个位置的水面是左右最高柱中的较小值？
#. 当 ``left_max <= right_max`` 时，为什么不需要知道右侧内部的真实最高值？
#. 为什么每个位置只会被结算一次？
#. 前缀/后缀数组方案与双指针方案的时间复杂度是否不同？
#. Rust 实现为什么需要单独处理空数组？

答案要点
~~~~~~~~

#. 水会从较低边界溢出，较高边界不能单独抬高水面；
#. 已知右侧至少存在 ``right_max`` 高的边界，左侧较低值已经成为限制因素；
#. 每轮移动一个端点，已结算位置离开未处理区间且不会返回；
#. 都是 ``O(n)``，双指针把额外空间从 ``O(n)`` 降为 ``O(1)``；
#. ``usize`` 不能表示 ``-1``，直接计算 ``len() - 1`` 会下溢。
