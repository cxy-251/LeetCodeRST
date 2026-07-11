0042. Trapping Rain Water
=========================

题目信息
--------

:题号: 0042
:难度: Hard
:主题: 数组、双指针、前缀最大值、单调栈
:原题: `LeetCode 0042 <https://leetcode.com/problems/trapping-rain-water/>`_
:访问状态: Available
:教学重点: 局部水位、短板决定、双指针不变量、面积累加

题目重述
--------

给定一组非负整数，每个整数表示宽度为 1 的柱子高度。下雨后，柱子之间可能形成凹槽。
返回所有位置能够接住的雨水总量。

自建示例
--------

普通凹槽
~~~~~~~~

.. code-block:: text

   输入：[0, 3, 0, 2, 0, 4]
   输出：7

   下标 2 上方接 3， 下标 3 上方接 1，下标 4 上方接 3。

没有凹槽
~~~~~~~~

.. code-block:: text

   输入：[1, 2, 3, 4]
   输出：0

   高度单调递增，任意位置都缺少右侧更高边界。

相等边界
~~~~~~~~

.. code-block:: text

   输入：[2, 0, 2]
   输出：2

短数组
~~~~~~

.. code-block:: text

   输入：[5]
   输出：0

   少于三根柱子不可能围成凹槽。

问题抽象
--------

对位置 ``i``，能够形成的水位由左右两侧最高柱子的较小值决定：

.. code-block:: text

   water_level[i] = min(left_max[i], right_max[i])
   water[i] = max(0, water_level[i] - height[i])

直接预处理左右最大值需要 ``O(n)`` 额外空间。双指针可以把“尚未扫描一侧的最高值”
压缩成一个比较关系，在 ``O(1)`` 额外空间内完成同样的判断。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 双指针
     - ``O(n)``
     - ``O(1)``
     - 主解法；满足最优时间和常数空间
   * - 前后缀最大值
     - ``O(n)``
     - ``O(n)``
     - 公式最直观，适合作为正确性参照
   * - 单调栈
     - ``O(n)``
     - ``O(n)``
     - 按横向水层结算，适合复习单调结构

主解法：较低一侧可以立即结算
----------------------------

状态含义
~~~~~~~~

维护四个变量：

* ``left`` 和 ``right``：尚未结算区间的两端；
* ``left_max``：区间左侧已扫描部分的最高柱；
* ``right_max``：区间右侧已扫描部分的最高柱。

每轮比较 ``height[left]`` 与 ``height[right]``：

* 左柱不高于右柱时，左位置的右侧至少存在 ``height[right]`` 这么高的边界；
* 右柱更低时，右位置的左侧至少存在 ``height[left]`` 这么高的边界。

因此较低一侧的另一侧边界已经足够，不必知道未扫描区域的精确最高值。

左侧结算
~~~~~~~~

当 ``height[left] <= height[right]``：

* 若当前柱不低于 ``left_max``，更新左侧最高值；
* 否则该位置接水 ``left_max - height[left]``；
* 然后 ``left`` 向右移动。

此时 ``height[right] >= height[left]``，并且右侧存在真实柱子作为封闭边界。若
``left_max`` 高于当前柱，水位至少可以达到 ``left_max``；若右边界比 ``left_max`` 更低，
当前比较最终会先处理右侧，直到不再错误结算左侧。

核心不变量
~~~~~~~~~~

每轮开始时：

* ``left`` 左侧和 ``right`` 右侧的所有位置已经准确结算；
* ``left_max``、``right_max`` 分别是两侧已扫描区域的最大高度；
* 尚未结算的位置只位于闭区间 ``[left, right]``；
* 本轮移动较低端时，该端所需的对侧边界已经由当前另一端保证存在。

正确性依据
~~~~~~~~~~

**局部公式。** 任一位置的水量等于左右最高边界较小值减去当前位置高度，负值按零处理。

**左侧安全性。** 当 ``height[left] <= height[right]`` 时，右侧至少有一根高度为
``height[right]`` 的柱。若 ``height[left] >= left_max``，当前位置成为新的左最高边界，
水量为零。若更低，左边界高度为 ``left_max``。当右侧不足以支撑 ``left_max`` 时，
右端会作为较低端持续向内结算并提高 ``right_max``；算法不会越过一个尚未证明可支撑的
右侧状态。因此当前左位置的水量正是 ``left_max - height[left]``。

**右侧安全性。** 与左侧完全对称。

**完备性。** 每轮恰好结算一个端点并缩小未处理区间。循环结束时每个位置都被结算一次，
累加值就是所有位置水量之和。

复杂度
~~~~~~

两个指针总共移动不超过 ``n`` 次，时间复杂度为 ``O(n)``。算法只使用固定数量整数变量，
额外空间复杂度为 ``O(1)``。

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
           if (height[left] <= height[right]) {
               if (height[left] >= left_max) {
                   left_max = height[left];
               } else {
                   water += left_max - height[left];
               }
               ++left;
           } else {
               if (height[right] >= right_max) {
                   right_max = height[right];
               } else {
                   water += right_max - height[right];
               }
               --right;
           }
       }
       return water;
   }

当 ``heightSize == 0`` 时，``right`` 为 ``-1``，循环不会执行。题目总水量在平台整数范围内；
若工程输入规模更大，可把 ``water`` 改为 ``long long``。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int trap(vector<int>& height) {
           int left = 0;
           int right = static_cast<int>(height.size()) - 1;
           int left_max = 0;
           int right_max = 0;
           int water = 0;

           while (left <= right) {
               if (height[left] <= height[right]) {
                   left_max = max(left_max, height[left]);
                   water += left_max - height[left];
                   ++left;
               } else {
                   right_max = max(right_max, height[right]);
                   water += right_max - height[right];
                   --right;
               }
           }
           return water;
       }
   };

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
               if height[left] <= height[right]:
                   left_max = max(left_max, height[left])
                   water += left_max - height[left]
                   left += 1
               else:
                   right_max = max(right_max, height[right])
                   water += right_max - height[right]
                   right -= 1

           return water

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
               if (height[left] <= height[right]) {
                   leftMax = Math.max(leftMax, height[left]);
                   water += leftMax - height[left];
                   left++;
               } else {
                   rightMax = Math.max(rightMax, height[right]);
                   water += rightMax - height[right];
                   right--;
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

           let mut left = 0usize;
           let mut right = height.len() - 1;
           let mut left_max = 0;
           let mut right_max = 0;
           let mut water = 0;

           while left <= right {
               if height[left] <= height[right] {
                   left_max = left_max.max(height[left]);
                   water += left_max - height[left];
                   left += 1;
               } else {
                   right_max = right_max.max(height[right]);
                   water += right_max - height[right];
                   if right == 0 {
                       break;
                   }
                   right -= 1;
               }
           }
           water
       }
   }

Rust 的 ``usize`` 不能减到负数，因此右指针递减前显式处理零边界。空数组也必须先返回，
避免计算 ``len() - 1`` 下溢。

Go
~~

.. code-block:: go

   func trap(height []int) int {
       left, right := 0, len(height)-1
       leftMax, rightMax := 0, 0
       water := 0

       for left <= right {
           if height[left] <= height[right] {
               if height[left] > leftMax {
                   leftMax = height[left]
               }
               water += leftMax - height[left]
               left++
           } else {
               if height[right] > rightMax {
                   rightMax = height[right]
               }
               water += rightMax - height[right]
               right--
           }
       }
       return water
   }

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
           if (height[left] <= height[right]) {
               leftMax = Math.max(leftMax, height[left]);
               water += leftMax - height[left];
               left += 1;
           } else {
               rightMax = Math.max(rightMax, height[right]);
               water += rightMax - height[right];
               right -= 1;
           }
       }
       return water;
   }

TypeScript 的 ``number`` 是 IEEE 754 双精度浮点数；题目整数范围内的加减保持精确。

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
               if (height[left] <= height[right]) {
                   leftMax = Math.Max(leftMax, height[left]);
                   water += leftMax - height[left];
                   left++;
               } else {
                   rightMax = Math.Max(rightMax, height[right]);
                   water += rightMax - height[right];
                   right--;
               }
           }
           return water;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function trap(height::Vector{Int})::Int
       left = 1
       right = length(height)
       left_max = 0
       right_max = 0
       water = 0

       while left <= right
           if height[left] <= height[right]
               left_max = max(left_max, height[left])
               water += left_max - height[left]
               left += 1
           else
               right_max = max(right_max, height[right])
               water += right_max - height[right]
               right -= 1
           end
       end
       return water
   end

Julia 使用一基索引，左右指针从 ``1`` 和 ``length(height)`` 开始。空数组时 ``right == 0``，
循环直接跳过。

R
~

.. code-block:: r

   trap <- function(height) {
     left <- 1L
     right <- length(height)
     left_max <- 0L
     right_max <- 0L
     water <- 0L

     while (left <= right) {
       if (height[left] <= height[right]) {
         left_max <- max(left_max, height[left])
         water <- water + left_max - height[left]
         left <- left + 1L
       } else {
         right_max <- max(right_max, height[right])
         water <- water + right_max - height[right]
         right <- right - 1L
       }
     }
     water
   }

R 的向量同样是一基索引。这里没有使用 ``<<-``；所有变量都属于当前函数调用。

关键边界
--------

* 空数组或长度小于 3：返回 0；
* 全部相等：没有凹槽；
* 单调递增或递减：返回 0；
* 两端很高、中间连续为零：每个内部位置分别累加；
* 多个凹槽：双指针会按位置结算，不会把不同凹槽混为一个矩形。

易错点
------

* 使用 ``max(left_max, right_max)`` 作为水位，会把水越过较低边界；
* 先移动指针再读取高度，容易漏算端点；
* 只比较 ``left_max`` 与 ``right_max`` 却没有维护它们对应的已扫描边界，会破坏不变量；
* Rust 的无符号右指针不能减成负数；
* 把总水量理解为一个大矩形减去柱子面积，会在多凹槽输入上出错。

新增与强化知识
--------------

* 新增：局部水位由左右最高边界的较小值决定；
* 新增：双指针可以在对侧精确最大值未知时，凭现存边界先结算较低一侧；
* 强化：0011 中“短板决定容量”的思想在本题扩展为逐位置水位判断；
* 强化：一基语言与零基语言的指针初始化差异。

最小自检
--------

#. 为什么左端不高于右端时，可以尝试结算左端？
#. ``left_max - height[left]`` 为什么不会为负？
#. 输入 ``[3, 0, 1, 3]`` 的答案是多少？
#. Rust 实现为什么要先判断空数组？

答案要点
~~~~~~~~

#. 右侧至少存在当前 ``height[right]`` 这根真实边界；较低一侧的封闭条件已经具备。
#. 先用当前高度更新 ``left_max``，所以 ``left_max >= height[left]``。
#. ``3 + 2 = 5``。
#. 避免 ``height.len() - 1`` 在 ``usize`` 上下溢。

关联题目
--------

* ``0011. Container With Most Water``：同样由较低边界决定当前可用高度。
* ``0084. Largest Rectangle in Histogram``：使用单调栈按边界结算区间面积。
