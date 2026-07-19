0084. Largest Rectangle in Histogram
====================================

题目信息
--------

:题号: 0084
:难度: Hard
:主题: 数组、单调栈、区间边界
:原题: `LeetCode 0084 <https://leetcode.com/problems/largest-rectangle-in-histogram/>`_
:访问状态: Available
:教学重点: 递增下标栈、弹栈结算、左右首个更矮位置、尾部哨兵

题目重述
--------

给定一个柱状图高度数组 ``heights``，每根柱子的宽度均为 1。寻找完全位于柱状图内部、边与坐标轴
平行的最大矩形面积。

题目保证 ``1 <= len(heights) <= 100000``，``0 <= heights[i] <= 10000``。输入数组只读。

自建示例
--------

.. code-block:: text

   输入：heights = [2,1,5,6,2,3]
   输出：10

高度 5 和 6 可以共同支撑宽度为 2、高度为 5 的矩形，面积为 10。

单调递增
~~~~~~~~

.. code-block:: text

   输入：heights = [1,2,3,4]
   输出：6

扫描期间没有更矮柱触发结算，必须在末尾使用高度 0 的虚拟柱，把栈中候选全部弹出。

问题抽象
--------

任意最大矩形都可以选择其中某根柱子的高度作为矩形高度。固定柱子 ``middle`` 后，矩形能够扩展到：

* 左侧第一个严格更矮柱子的后一位；
* 右侧第一个严格更矮柱子的前一位。

若能为每根柱子在线确定这两个边界，就能计算以该柱高为限制高度的最大面积。递增下标栈保存尚未
遇到右侧更矮柱子的候选；当前柱更矮时，弹出的柱子第一次获得确定的右边界。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 递增下标单调栈
     - ``O(n)``
     - ``O(n)``
     - 主解法；每根柱子最多入栈、出栈各一次
   * - 为每根柱子向两侧扩展
     - ``O(n²)``
     - ``O(1)``
     - 重复扫描相同边界
   * - 分治并寻找区间最矮柱
     - 最坏 ``O(n²)``
     - ``O(n)`` 递归栈
     - 不使用区间最小值结构时可能严重退化

主解法：递增下标单调栈
----------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

扫描位置 ``right`` 之前，栈中保存严格递增的下标，所指高度按非递减顺序排列：

* 每个栈中柱子尚未遇到右侧严格更矮柱；
* 对栈顶柱子，当前 ``right`` 是最新检查位置；
* 栈中相邻下标之间，被后者遮蔽的更高柱子已经完成结算；
* 栈外且已经弹出的柱子，最大可扩展区间和面积已经确定。

当 ``current_height < heights[stack.top]`` 时，栈顶柱子 ``middle`` 必须弹出。此时：

.. code-block:: text

   right boundary = right - 1
   left boundary = stack.top + 1 after popping, or 0 when stack is empty
   width = right - left boundary
   area = heights[middle] * width

这里公式中的 ``right`` 是第一个严格更矮柱的位置，因此矩形实际覆盖到 ``right - 1``。

为什么弹栈时边界已经完整
~~~~~~~~~~~~~~~~~~~~~~~~

当前柱严格矮于 ``middle``，所以 ``right`` 是 ``middle`` 右侧第一个严格更矮位置。若此前出现过更矮柱，
``middle`` 已经在当时弹出，不可能仍留在栈中。

弹出 ``middle`` 后：

* 若栈非空，新栈顶是 ``middle`` 左侧最近的严格更矮柱；
* 若栈为空，说明左侧没有更矮柱，矩形可以扩展到下标 0。

栈中允许相同高度共存。相同高度柱子最终可能计算重复高度的不同宽度，最左侧同高柱会得到最大宽度，
因此不会漏掉答案。使用严格小于触发弹栈也让规则保持统一。

尾部哨兵为何必要
~~~~~~~~~~~~~~~~

若数组后缀保持非递减，真实扫描不会出现更矮柱，栈中候选无法结算。循环额外处理下标 ``n``，令其
虚拟高度为 0。它不会写入输入数组，只负责触发所有正高度柱子弹栈。高度为 0 的柱子即使留在栈中，
面积也为 0，不影响答案。

正确性依据
~~~~~~~~~~

**每次面积计算都合法。** 弹出 ``middle`` 时，左右边界之间所有柱高都不低于
``heights[middle]``，所以高度为 ``heights[middle]``、宽度为计算值的矩形完全位于柱状图内。

**每根柱子的最大宽度都会被计算。** 柱子入栈后一直保留到右侧第一个严格更矮柱出现；弹栈后的新栈顶
给出左侧第一个严格更矮柱。因此计算区间正是该柱高能够覆盖的最大连续区间。

**不会漏掉全局最优矩形。** 任意合法矩形取其区间内最矮柱 ``middle``。算法结算该柱时会使用至少覆盖
这个矩形的最大区间，计算面积不小于该矩形。所有计算面积又都合法，所以最大计算值恰好是最优面积。

**终止性。** 每个真实下标只入栈一次、最多弹出一次；虚拟下标只执行一次扫描，循环必然终止。

复杂度与数值边界
~~~~~~~~~~~~~~~~

设柱子数量为 ``n``：

* 每个下标最多入栈、出栈各一次，总时间 ``O(n)``；
* 栈最多保存 ``n`` 个下标，额外空间 ``O(n)``；
* 最大面积不超过 ``100000 × 10000 = 1000000000``，适合 32 位有符号返回值；
* 乘法在 C、C++、Java、Rust、Go 和 C# 中先提升到 64 位，避免规则依赖未来约束不变；
* TypeScript ``number`` 和 R 双精度数可精确表示本题全部整数面积。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>

   int largestRectangleArea(int *heights, int heightsSize) {
       int *stack = malloc((size_t)heightsSize * sizeof(*stack));
       if (stack == NULL) {
           return 0;
       }

       int top = 0;
       long long best = 0;

       for (int right = 0; right <= heightsSize; ++right) {
           const int current = right == heightsSize ? 0 : heights[right];

           while (top > 0 && heights[stack[top - 1]] > current) {
               const int middle = stack[--top];
               const int left = top == 0 ? 0 : stack[top - 1] + 1;
               const int width = right - left;
               const long long area =
                   (long long)heights[middle] * (long long)width;
               if (area > best) {
                   best = area;
               }
           }

           if (right < heightsSize) {
               stack[top++] = right;
           }
       }

       free(stack);
       return (int)best;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   public:
       int largestRectangleArea(std::vector<int>& heights) {
           std::vector<int> stack;
           stack.reserve(heights.size());
           long long best = 0;

           for (int right = 0;
                right <= static_cast<int>(heights.size());
                ++right) {
               const int current = right == static_cast<int>(heights.size())
                   ? 0
                   : heights[right];

               while (!stack.empty() && heights[stack.back()] > current) {
                   const int middle = stack.back();
                   stack.pop_back();
                   const int left = stack.empty() ? 0 : stack.back() + 1;
                   const int width = right - left;
                   best = std::max(
                       best,
                       static_cast<long long>(heights[middle]) * width
                   );
               }

               if (right < static_cast<int>(heights.size())) {
                   stack.push_back(right);
               }
           }

           return static_cast<int>(best);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def largestRectangleArea(self, heights: list[int]) -> int:
           stack: list[int] = []
           best = 0

           for right in range(len(heights) + 1):
               current = 0 if right == len(heights) else heights[right]

               while stack and heights[stack[-1]] > current:
                   middle = stack.pop()
                   left = 0 if not stack else stack[-1] + 1
                   width = right - left
                   best = max(best, heights[middle] * width)

               if right < len(heights):
                   stack.append(right)

           return best

Java
~~~~

.. code-block:: java

   class Solution {
       public int largestRectangleArea(int[] heights) {
           int[] stack = new int[heights.length];
           int size = 0;
           long best = 0;

           for (int right = 0; right <= heights.length; ++right) {
               int current = right == heights.length ? 0 : heights[right];

               while (size > 0 && heights[stack[size - 1]] > current) {
                   int middle = stack[--size];
                   int left = size == 0 ? 0 : stack[size - 1] + 1;
                   int width = right - left;
                   long area = (long) heights[middle] * width;
                   best = Math.max(best, area);
               }

               if (right < heights.length) {
                   stack[size++] = right;
               }
           }

           return (int) best;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn largest_rectangle_area(heights: Vec<i32>) -> i32 {
           let mut stack: Vec<usize> = Vec::with_capacity(heights.len());
           let mut best: i64 = 0;

           for right in 0..=heights.len() {
               let current = if right == heights.len() {
                   0
               } else {
                   heights[right]
               };

               while let Some(&middle) = stack.last() {
                   if heights[middle] <= current {
                       break;
                   }
                   stack.pop();
                   let left = stack.last().map_or(0, |index| index + 1);
                   let width = right - left;
                   let area = i64::from(heights[middle]) * width as i64;
                   best = best.max(area);
               }

               if right < heights.len() {
                   stack.push(right);
               }
           }

           best as i32
       }
   }

Go
~~

.. code-block:: go

   func largestRectangleArea(heights []int) int {
       stack := make([]int, 0, len(heights))
       var best int64

       for right := 0; right <= len(heights); right++ {
           current := 0
           if right < len(heights) {
               current = heights[right]
           }

           for len(stack) > 0 && heights[stack[len(stack)-1]] > current {
               middle := stack[len(stack)-1]
               stack = stack[:len(stack)-1]
               left := 0
               if len(stack) > 0 {
                   left = stack[len(stack)-1] + 1
               }
               width := right - left
               area := int64(heights[middle]) * int64(width)
               if area > best {
                   best = area
               }
           }

           if right < len(heights) {
               stack = append(stack, right)
           }
       }

       return int(best)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function largestRectangleArea(heights: number[]): number {
       const stack: number[] = [];
       let best = 0;

       for (let right = 0; right <= heights.length; right += 1) {
           const current = right === heights.length ? 0 : heights[right];

           while (
               stack.length > 0 &&
               heights[stack[stack.length - 1]] > current
           ) {
               const middle = stack.pop()!;
               const left = stack.length === 0
                   ? 0
                   : stack[stack.length - 1] + 1;
               const width = right - left;
               best = Math.max(best, heights[middle] * width);
           }

           if (right < heights.length) {
               stack.push(right);
           }
       }

       return best;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int LargestRectangleArea(int[] heights) {
           int[] stack = new int[heights.Length];
           int size = 0;
           long best = 0;

           for (int right = 0; right <= heights.Length; ++right) {
               int current = right == heights.Length ? 0 : heights[right];

               while (size > 0 && heights[stack[size - 1]] > current) {
                   int middle = stack[--size];
                   int left = size == 0 ? 0 : stack[size - 1] + 1;
                   int width = right - left;
                   long area = (long)heights[middle] * width;
                   best = System.Math.Max(best, area);
               }

               if (right < heights.Length) {
                   stack[size++] = right;
               }
           }

           return (int)best;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function largest_rectangle_area(heights::Vector{Int})::Int
       stack = Int[]
       best = 0
       n = length(heights)

       for right in 1:(n + 1)
           current = right == n + 1 ? 0 : heights[right]

           while !isempty(stack) && heights[stack[end]] > current
               middle = pop!(stack)
               left = isempty(stack) ? 1 : stack[end] + 1
               width = right - left
               best = max(best, heights[middle] * width)
           end

           if right <= n
               push!(stack, right)
           end
       end

       return best
   end

R
~

.. code-block:: r

   largest_rectangle_area <- function(heights) {
     n <- length(heights)
     stack <- integer(n)
     size <- 0L
     best <- 0

     for (right in seq_len(n + 1L)) {
       current <- if (right == n + 1L) 0 else heights[[right]]

       while (size > 0L && heights[[stack[[size]]]] > current) {
         middle <- stack[[size]]
         size <- size - 1L
         left <- if (size == 0L) 1L else stack[[size]] + 1L
         width <- right - left
         best <- max(best, heights[[middle]] * width)
       }

       if (right <= n) {
         size <- size + 1L
         stack[[size]] <- right
       }
     }

     as.integer(best)
   }

语言边界说明
------------

* C 的栈按输入长度分配，分配失败返回 0；资源失败不属于题目输入域；
* C、C++、Java、Rust、Go 和 C# 使用 64 位中间面积，再转换为题目要求的 32 位返回值；
* Rust 的栈保存 ``usize``，宽度由两个有序下标相减，不会下溢；
* TypeScript 不使用位运算，面积处于安全整数范围；
* Julia 与 R 直接使用一基柱子下标，虚拟右边界为 ``n + 1``，宽度公式仍为 ``right - left``；
* 所有实现都只读取 ``heights``，尾部哨兵是循环中的局部高度，不会向输入追加元素。

验证计划与证据
--------------

``运行验证``
   覆盖单柱、全零、严格递增、严格递减、全部等高、典型谷底、重复高度和最大约束面积。

``随机基准对拍``
   Python 对随机短数组枚举全部左右边界，以区间最小高度乘宽度作为独立基准；再与单调栈结果比较。

``编译验证``
   C 使用 C17、严格警告、AddressSanitizer 与 UndefinedBehaviorSanitizer；C++ 使用 C++17 和相同检查；
   Java、Go 与 TypeScript 分别完成编译或严格类型检查并运行固定与随机用例。

``静态验证``
   Rust、C#、Julia 和 R 在当前环境缺少运行时，检查索引类型、乘法提升、一基边界和接口返回类型，
   不宣称运行通过。

关键边界
--------

* 单根柱子：虚拟零高度触发其面积计算；
* 全部为零：任何矩形面积都是 0；
* 严格递增：全部候选在尾部哨兵处按逆序结算；
* 严格递减：每个新柱都会立即结算前一个更高柱；
* 相同高度：相同柱可以共同留栈，最左同高柱最终获得最大宽度；
* 中间出现零：零高度自然分隔左右两个不能跨越的正高度区间；
* 最大约束：``100000`` 根高度 ``10000`` 的柱子得到面积 ``1000000000``。

易错点
------

* 弹栈后仍用弹出前栈顶计算左边界；
* 把宽度写成 ``right - left + 1``，忘记 ``right`` 本身是更矮柱；
* 只扫描真实柱子，遗漏非递减后缀；
* 弹栈条件写反，维护成递减栈；
* 把柱高而不是下标压栈，失去宽度边界；
* 在输入末尾真实追加 0，违反只读接口或忘记恢复；
* 只证明每根柱子入栈一次，没有证明弹栈面积使用的是最大可扩展区间；
* 在固定宽度语言中直接使用较窄整数乘法，形成不必要的数值脆弱性。

新增与强化知识
--------------

新增
~~~~

* 单调栈可以延迟处理“右侧第一个更小元素”，直到边界首次确定时一次结算；
* 弹栈后的新栈顶给出左侧第一个严格更小元素，当前扫描位置给出右侧第一个严格更小元素；
* 局部虚拟哨兵可以统一清空未结算状态，无需修改输入容器。

强化
~~~~

* 0042 的单调结构用于确定积水边界，本题用于确定以柱高为限制的最大连续宽度；
* 摊还 ``O(n)`` 证明必须分别计算每个元素的入栈次数和出栈次数；
* 面积、路径数等乘法结果应先由约束推导上界，再决定语言中的中间类型。

最小自检
--------

#. 为什么当前柱更矮时，弹出柱子的右边界可以立即确定？
#. 弹栈后栈为空与非空时，左边界分别是多少？
#. 为什么宽度是 ``right - left``，没有再加 1？
#. 严格递增数组为什么必须依赖尾部虚拟零高度？
#. 相同高度使用严格小于触发弹栈，为什么仍不会漏掉最大面积？

答案要点
~~~~~~~~

#. 当前位置是它右侧第一个严格更矮柱；此前若出现过，它早已被弹出。
#. 空栈时为 0；非空时为新栈顶下标加 1。
#. 实际覆盖区间是 ``[left, right-1]``，长度正好为 ``right-left``。
#. 真实扫描没有更矮柱触发弹栈，哨兵负责统一结算剩余候选。
#. 最左侧同高柱最终得到包含全部同高柱的最大宽度，其面积覆盖其他同高候选。

关联题目
--------

* :doc:`0042-trapping-rain-water`
* :doc:`0085-maximal-rectangle`
