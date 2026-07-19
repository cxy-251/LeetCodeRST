0011. Container With Most Water
===============================

题目信息
--------

:题号: 0011
:难度: Medium
:主题: 数组、双指针、贪心、面积上界
:原题: `LeetCode 0011 <https://leetcode.com/problems/container-with-most-water/>`_
:访问状态: Available
:教学重点: 两端指针、短板效应、移动决策、排除证明、乘积溢出

题目重述
--------

给定一个长度至少为 ``2`` 的非负整数数组 ``height``。下标 ``i`` 处有一条竖线，
它的高度是 ``height[i]``。任选两条竖线，与横轴共同形成一个容器，求容器能够容纳的
最大水量。

若选择下标 ``left`` 和 ``right``，其中 ``left < right``，则：

* 容器宽度为 ``right - left``；
* 水面高度受较短竖线限制，为 ``min(height[left], height[right])``；
* 面积为两者乘积。

竖线不能倾斜，数组顺序也不能改变。

自建示例
--------

普通情况
~~~~~~~~

.. code-block:: text

   输入：height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
   选择下标 1 和 8：宽度为 7，短板高度为 7。
   面积 = 7 * 7 = 49。
   输出：49

最高线不一定组成最优答案
~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：height = [9, 1, 8]
   两条最高线位于下标 0 和 2，面积为 min(9, 8) * 2 = 16。
   输出：16

最小输入
~~~~~~~~

.. code-block:: text

   输入：height = [4, 4]
   只有一对可选竖线，宽度为 1，面积为 4。
   输出：4

含零高度
~~~~~~~~

.. code-block:: text

   输入：height = [0, 5, 0, 5, 0]
   选择两个高度为 5 的位置，宽度为 2，面积为 10。
   输出：10

问题抽象
--------

暴力枚举会检查所有下标对。真正需要利用的结构是：当左右边界固定时，面积由宽度和短板
共同决定。双指针从最宽的区间开始，每轮只移动较短的一侧，从而一次排除一批不可能优于
当前面积的候选对。

定义：

.. math::

   area(left, right) = (right - left)
   \times \min(height[left], height[right])

宽度随着任一指针向内移动必然减小。若保留短板并移动长板，新的短板高度不会超过原短板，
宽度还会变小，因此面积不可能增加。只有移动短板，才有机会遇到更高的边界，补偿宽度损失。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 取舍
   * - 两端双指针
     - ``O(n)``
     - ``O(1)``
     - 主解法；利用短板上界，每轮安全排除一侧的全部候选
   * - 枚举所有下标对
     - ``O(n^2)``
     - ``O(1)``
     - 直观，可作为小规模对拍基准，无法满足大输入性能要求
   * - 按高度排序后搜索
     - 至少 ``O(n log n)``
     - ``O(n)``
     - 高度与原下标距离耦合，排序会增加状态管理且没有必要

主解法：两端双指针
------------------

状态含义
~~~~~~~~

维护三个变量：

* ``left``：当前区间左端下标；
* ``right``：当前区间右端下标；
* ``best``：已经检查过的候选对中的最大面积。

初始时 ``left = 0``、``right = n - 1``，先检查宽度最大的候选对。每轮计算当前面积并更新
``best``，随后移动较短的一侧。

移动规则
~~~~~~~~

若 ``height[left] < height[right]``，移动 ``left``：

.. code-block:: text

   left += 1

若 ``height[left] > height[right]``，移动 ``right``：

.. code-block:: text

   right -= 1

两侧等高时，移动任意一侧都正确。本文统一移动右侧，保持实现一致。

为什么移动短板
~~~~~~~~~~~~~~

假设当前左侧不高于右侧：

.. math::

   height[left] \le height[right]

当前面积的高度上限是 ``height[left]``。固定 ``left``，把 ``right`` 移到任意更靠左的位置
``k``，有：

.. math::

   k - left < right - left

并且：

.. math::

   \min(height[left], height[k]) \le height[left]

所以：

.. math::

   area(left, k) < (right-left) \times height[left]
   = area(left, right)

也就是说，当前候选已经是所有仍以 ``left`` 为左边界的候选中面积最大的一个。检查它之后，
可以安全丢弃 ``left``，无需再与任何更内侧的右边界配对。

右侧较短时完全对称。

执行过程
~~~~~~~~

以 ``[1, 8, 6, 2, 5, 4, 8, 3, 7]`` 为例：

.. code-block:: text

   left=0, right=8：面积 8，左侧较短，left -> 1
   left=1, right=8：面积 49，右侧较短，right -> 7
   left=1, right=7：面积 18，右侧较短，right -> 6
   left=1, right=6：面积 40，两侧等高，right -> 5
   后续宽度继续缩小，没有超过 49

算法没有尝试所有下标对。每次移动都基于一个已经证明的面积上界，排除当前短板所在一侧的
全部剩余配对。

核心不变量
~~~~~~~~~~

每轮循环开始时：

* ``best`` 是所有已经检查候选对的最大面积；
* 位于当前闭区间 ``[left, right]`` 外侧、尚未显式检查的候选，已经由短板上界证明不可能
  超过某个已检查候选；
* 因此全局最优解要么已经记录在 ``best`` 中，要么仍由当前区间内的两个下标组成；
* 每轮至少移动一个指针，区间长度严格缩小，循环最终终止。

正确性依据
~~~~~~~~~~

证明算法返回全局最大面积。

每轮先计算当前候选 ``(left, right)``，所以该候选不会遗漏。若左侧高度不大于右侧高度，
对于所有 ``left < k < right``，候选 ``(left, k)`` 的宽度更小，短板高度又不会超过
``height[left]``，因此它的面积严格小于当前候选。于是删除左端下标 ``left`` 不会删除任何
尚未检查且可能优于当前候选的解。

若右侧更短，使用对称论证可安全删除 ``right``。两侧等高时，无论删除哪一侧，固定被删除
端点的所有内侧候选同样受该高度和更小宽度限制。

因此每次指针移动都保持以下事实：全局最优解已经进入 ``best``，或仍完整保留在新区间中。
当 ``left == right`` 时已不存在合法下标对，所有可能成为全局最优的候选都已检查或被安全
排除，所以 ``best`` 等于最大面积。

复杂度
~~~~~~

设数组长度为 ``n``。

* 两个指针总共最多移动 ``n - 1`` 次；
* 每轮只做常数次比较和乘法；
* 时间复杂度为 ``O(n)``；
* 空间复杂度为 ``O(1)``。

数值范围与溢出
~~~~~~~~~~~~~~

面积是“高度乘宽度”。即使数组元素和下标分别能放进 32 位整数，乘积也可能需要更宽类型。
为了让实现不依赖较窄的题目约束：

* C、C++、Java、Rust、C# 使用 64 位整数计算面积；
* Go 的接口常用 ``int``，本文内部使用 ``int64`` 后再按平台接口返回；
* TypeScript 的 ``number`` 在本题常见约束内可精确表示整数乘积；
* Julia 使用 ``Int``，R 使用双精度数值，均足以覆盖题目约束。

核心语言实现
------------

C
~

.. code-block:: c

   long long maxArea(int* height, int heightSize) {
       int left = 0;
       int right = heightSize - 1;
       long long best = 0;

       while (left < right) {
           int shorter = height[left] < height[right]
               ? height[left]
               : height[right];
           long long width = (long long)(right - left);
           long long area = width * shorter;
           if (area > best) {
               best = area;
           }

           // 只移动短板；保留短板而缩小宽度不可能得到更大面积。
           if (height[left] < height[right]) {
               ++left;
           } else {
               --right;
           }
       }

       return best;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int maxArea(vector<int>& height) {
           int left = 0;
           int right = static_cast<int>(height.size()) - 1;
           long long best = 0;

           while (left < right) {
               long long width = right - left;
               long long area = width * min(height[left], height[right]);
               best = max(best, area);

               // 两侧等高时移动任意一侧都不会破坏排除证明。
               if (height[left] < height[right]) {
                   ++left;
               } else {
                   --right;
               }
           }

           return static_cast<int>(best);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxArea(self, height: list[int]) -> int:
           left = 0
           right = len(height) - 1
           best = 0

           while left < right:
               width = right - left
               area = width * min(height[left], height[right])
               best = max(best, area)

               # Python 整数不会溢出；指针决策仍必须基于当前两端高度。
               if height[left] < height[right]:
                   left += 1
               else:
                   right -= 1

           return best

Java
~~~~

.. code-block:: java

   class Solution {
       public int maxArea(int[] height) {
           int left = 0;
           int right = height.length - 1;
           long best = 0L;

           while (left < right) {
               long width = right - left;
               long area = width * Math.min(height[left], height[right]);
               best = Math.max(best, area);

               // 先提升为 long 再乘，避免 int 乘法先发生溢出。
               if (height[left] < height[right]) {
                   left++;
               } else {
                   right--;
               }
           }

           return (int) best;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn max_area(height: Vec<i32>) -> i32 {
           let mut left = 0_usize;
           let mut right = height.len() - 1;
           let mut best = 0_i64;

           while left < right {
               let width = (right - left) as i64;
               let shorter = height[left].min(height[right]) as i64;
               best = best.max(width * shorter);

               // usize 只在 left < right 时递减 right，避免无符号下溢。
               if height[left] < height[right] {
                   left += 1;
               } else {
                   right -= 1;
               }
           }

           best as i32
       }
   }

Go
~~

.. code-block:: go

   func maxArea(height []int) int {
       left, right := 0, len(height)-1
       var best int64

       for left < right {
           shorter := height[left]
           if height[right] < shorter {
               shorter = height[right]
           }
           width := int64(right - left)
           area := width * int64(shorter)
           if area > best {
               best = area
           }

           if height[left] < height[right] {
               left++
           } else {
               right--
           }
       }

       return int(best)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxArea(height: number[]): number {
       let left = 0;
       let right = height.length - 1;
       let best = 0;

       while (left < right) {
           const width = right - left;
           const area = width * Math.min(height[left], height[right]);
           best = Math.max(best, area);

           // number 可精确表示本题约束下的整数面积。
           if (height[left] < height[right]) {
               left++;
           } else {
               right--;
           }
       }

       return best;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int MaxArea(int[] height) {
           int left = 0;
           int right = height.Length - 1;
           long best = 0;

           while (left < right) {
               long width = right - left;
               long area = width * Math.Min(height[left], height[right]);
               best = Math.Max(best, area);

               if (height[left] < height[right]) {
                   left++;
               } else {
                   right--;
               }
           }

           return (int)best;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function max_area(height::Vector{Int})::Int
       left = 1
       right = length(height)
       best = 0

       while left < right
           # Julia 下标从 1 开始，但宽度仍是两个位置编号之差。
           width = right - left
           area = width * min(height[left], height[right])
           best = max(best, area)

           if height[left] < height[right]
               left += 1
           else
               right -= 1
           end
       end

       return best
   end

R
~

.. code-block:: r

   maxArea <- function(height) {
       left <- 1L
       right <- length(height)
       best <- 0

       while (left < right) {
           # R 使用一基下标；位置差仍等于容器的水平宽度。
           width <- right - left
           area <- width * min(height[left], height[right])
           best <- max(best, area)

           if (height[left] < height[right]) {
               left <- left + 1L
           } else {
               right <- right - 1L
           }
       }

       best
   }

关键边界与易错点
----------------

* 面积高度必须使用两端较小值，不能使用较大值或平均值；
* 指针必须移动较短的一侧；移动较长侧没有提升短板上限的机会；
* 宽度是下标差 ``right - left``，不是元素数量 ``right - left + 1``；
* 必须先计算当前面积，再移动指针，否则会漏掉最外层候选；
* 两侧等高时移动任意一侧都正确，不需要同时移动；
* 不能只挑两个最高柱子，距离同样决定面积；
* C 系语言中应在乘法前提升到 64 位，乘完再转换已经来不及；
* Rust 的 ``right`` 是 ``usize``，只有在 ``left < right`` 的循环内递减才安全；
* Julia 与 R 使用一基下标，不需要额外给宽度减一。

新增与强化知识
--------------

新增
~~~~

* **短板控制面积上限**：固定一端时，较短高度决定所有内侧候选的最高水位；
* **双指针排除证明**：移动短板不是经验规则，而是一次删除一整组不可能更优的候选；
* **宽度递减下的补偿条件**：区间缩小后，只有短板高度上升才可能使面积增加。

强化
~~~~

* 0003 的双边界维护用于合法窗口，本题的双边界用于候选空间收缩；
* 0007、0008 的乘算前溢出意识在本题转化为先提升乘积类型；
* Julia 与 R 的一基数组下标继续与数学位置差保持一致。

关联题目
--------

* `0042. Trapping Rain Water <0042-trapping-rain-water.rst>`_：同样由边界高度限制水量，但计算
  每个位置上方的积水，而不是只选择两条边界。
* `0167. Two Sum II - Input Array Is Sorted <0167-two-sum-ii-input-array-is-sorted.rst>`_：同样从
  两端移动指针，但移动依据来自有序数组的和，而不是短板面积上界。

最小自检
--------

#. 为什么固定较短的左端点后，移动右端点不可能得到更大面积？
#. 两侧高度相等时，为什么可以只移动其中一侧？
#. 为什么宽度是 ``right - left`` 而不是 ``right - left + 1``？
#. 两条最高竖线为什么不一定构成最大容器？
#. Java 中把结果变量声明为 ``long``，但仍写 ``int area = width * height``，能防止溢出吗？

答案要点
~~~~~~~~

#. 宽度减小，短板高度又始终不超过固定左端高度，面积严格小于当前候选；
#. 任一被删除端点与所有内侧位置的候选都受相同高度上限和更小宽度约束；
#. 两条竖线的水平距离等于下标差，数组元素数量多包含了一个端点；
#. 面积同时取决于高度和距离，稍低但相距更远的两条线可能更优；
#. 不能；两个 ``int`` 会先完成 32 位乘法，必须在乘法前把至少一个操作数提升为 ``long``。
