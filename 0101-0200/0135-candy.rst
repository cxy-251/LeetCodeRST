0135. Candy
===========

题目信息
--------

:题号: 0135
:难度: Hard
:主题: 贪心、双向扫描、局部约束、逐点下界
:原题: `LeetCode 0135 <https://leetcode.com/problems/candy/>`_
:访问状态: Available
:教学重点: 把双侧约束拆成两个单侧下界，并证明逐点取最大值就是全局最优解

题目重述
--------

有 ``n`` 个孩子排成一列，第 ``i`` 个孩子的评分为 ``ratings[i]``。需要给每个孩子分配正整数颗糖，
并满足：若一个孩子的评分严格高于某个相邻孩子，那么这个孩子得到的糖也必须严格更多。

返回满足全部要求所需的最少糖果总数。

精确契约
~~~~~~~~

* 输入 ``ratings`` 非空，元素是平台 ``int`` 范围内的整数；评分可以相等。
* 每个位置至少分到 ``1`` 颗糖。
* 只有相邻且评分严格不等时才产生方向约束；相等评分之间没有糖果大小要求。
* 返回最小总数，而不是某一种分配方案。
* 算法只读取 ``ratings``。在题目给定的 ``n <= 2 * 10^4`` 范围内，最坏的严格单调序列需要
  ``n(n+1)/2`` 颗糖，结果可以放入 32 位有符号整数。

自建示例
~~~~~~~~

``ratings = [4, 1, 2, 5, 3]`` 时，一组最优分配是 ``[2, 1, 2, 3, 1]``，总数为 ``9``。

* 评分 ``4`` 高于右边的 ``1``，所以第一位至少为 ``2``；
* 中间的 ``1 < 2 < 5`` 迫使糖果形成 ``1 < 2 < 3``；
* 末尾的 ``5 > 3`` 已由 ``3 > 1`` 满足。

再看 ``ratings = [2, 2, 3, 2, 2]``。相等评分不会互相抬高下界，最优分配为
``[1, 1, 2, 1, 1]``，总数为 ``6``。这说明算法不能把“不下降”误写成“严格上升”。

问题抽象
--------

每一对相邻位置最多给出一个差分约束：

* 若 ``ratings[i] > ratings[i-1]``，则必须有 ``candies[i] >= candies[i-1] + 1``；
* 若 ``ratings[i] < ratings[i-1]``，则必须有 ``candies[i-1] >= candies[i] + 1``；
* 若两者相等，这一对位置没有额外约束。

约束图是一条链，但边的方向可能不断改变。只从左向右扫描只能看见指向右侧的边，严格下降段会被漏掉；
只从右向左扫描则会漏掉严格上升段。关键不是反复修补整条链，而是分别计算两个方向强制出的最小下界。

解法取舍
--------

**反复局部调整** 可以从全 ``1`` 开始，只要发现违规就增加某个位置，但一次增加可能继续影响相邻位置，
难以给出稳定的线性时间界。

**按峰谷分段计数** 可以做到 ``O(1)`` 额外空间，但峰顶归属、相等评分和下降长度的处理更容易出错，
也不利于十种语言保持同一证明。

**双向扫描** 使用一个长度为 ``n`` 的数组，先计算左侧下界，再合并右侧下界。它是 ``O(n)`` 时间、
``O(n)`` 额外空间，状态和证明完全对应，适合作为本题的主解。

状态、转移与实现
----------------

定义两个概念数组：

.. math::

   L_i =
   \begin{cases}
   L_{i-1}+1, & i>0 \text{ 且 } ratings_i>ratings_{i-1},\\
   1, & \text{其他情况；}
   \end{cases}

.. math::

   R_i =
   \begin{cases}
   R_{i+1}+1, & i+1<n \text{ 且 } ratings_i>ratings_{i+1},\\
   1, & \text{其他情况。}
   \end{cases}

``L[i]`` 是只考虑左邻约束时，第 ``i`` 位不可低于的值；``R[i]`` 对右邻约束含义相同。
最终答案在每个位置取 ``max(L[i], R[i])``。

实现不必真的保存两个数组：

1. 把 ``candies`` 全部初始化为 ``1``；
2. 从左向右扫描，令 ``candies[i]`` 得到 ``L[i]``；
3. 从右向左扫描。若当前评分高于右邻，就用
   ``max(candies[i], candies[i+1] + 1)`` 合并右侧下界；
4. 累加最终数组。

第二步结束时的循环不变量是：已经扫描的位置准确保存对应的 ``L`` 值。第三步从右向左执行时，
循环不变量是：当前位置右侧已经是最终值，尚未扫描的位置仍保存 ``L`` 值。

为什么第二遍必须取 ``max``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

考虑 ``ratings = [1, 2, 3, 1]``。左扫得到 ``[1, 2, 3, 1]``。右侧约束只要求第三位至少为 ``2``；
若把第三位直接覆盖成 ``2``，就会破坏它与第二位之间由左扫建立的严格关系。取 ``max(3, 2)`` 才能同时保留
两个方向的下界。

正确性证明
----------

下面证明算法返回合法分配，并且总数最小。

引理一：任何合法分配在第 ``i`` 位都不少于 ``L[i]``。
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

从左向右归纳。若 ``i = 0``，每人至少一颗，所以结论成立。若
``ratings[i] <= ratings[i-1]``，则 ``L[i] = 1``，结论仍由正数要求成立。若
``ratings[i] > ratings[i-1]``，任意合法分配 ``D`` 都有
``D[i] >= D[i-1] + 1``；由归纳假设 ``D[i-1] >= L[i-1]``，所以
``D[i] >= L[i-1] + 1 = L[i]``。

引理二：任何合法分配在第 ``i`` 位都不少于 ``R[i]``。
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

证明与引理一对称，从右向左归纳即可。

引理三：双向扫描结束后，``candies[i] = max(L[i], R[i])``。
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

左扫结束后 ``candies[i] = L[i]``。对右扫进行反向归纳。

* 最右位置的 ``R[n-1] = 1``，所以它已有 ``max(L[n-1], R[n-1])``。
* 若 ``ratings[i] <= ratings[i+1]``，则 ``R[i] = 1``，算法不更新，仍有
  ``candies[i] = L[i] = max(L[i], R[i])``。
* 若 ``ratings[i] > ratings[i+1]``，则 ``ratings[i+1]`` 不高于自己的左邻，故
  ``L[i+1] = 1``。根据反向归纳假设，已经处理的右邻值为
  ``max(L[i+1], R[i+1]) = R[i+1]``。算法的更新恰好得到
  ``max(L[i], R[i+1]+1) = max(L[i], R[i])``。

引理四：``max(L[i], R[i])`` 构成合法分配。
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每个值至少为 ``1``。若 ``ratings[i] > ratings[i-1]``，则 ``L[i] = L[i-1]+1``；
同时因为 ``ratings[i-1] < ratings[i]``，有 ``R[i-1] = 1``。于是

.. math::

   candies_i \ge L_i = L_{i-1}+1 > \max(L_{i-1},R_{i-1}) = candies_{i-1}.

右邻约束完全对称。因此全部相邻约束都满足。

定理：算法返回最少糖果总数。
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理三和引理四，算法给出的分配合法。由引理一、二，任意合法分配 ``D`` 在每个位置都满足
``D[i] >= max(L[i], R[i])``。算法逐位置同时达到这个不可突破的下界，所以任何合法分配的总数都不可能更小。
因此算法返回全局最优总数。

复杂度与数值范围
----------------

两次扫描和一次求和都是线性的，时间复杂度为 ``O(n)``；糖果数组占 ``O(n)`` 额外空间。
所有语言都只读输入，没有排序或复制评分数组。

严格单调时糖果总数达到 ``1 + 2 + ... + n = n(n+1)/2``。官方上界 ``n <= 2 * 10^4``
使最大结果为 ``200010000``，32 位有符号整数足够；TypeScript 的 ``number`` 也能精确表示。
C 的动态分配是适配器额外成本，仍为 ``O(n)`` 空间；分配失败不属于题目合法输入的语义结果，代码以 ``0``
作为防御性失败返回值。

十语言实现
----------

下面十份实现使用同一状态和转移，语言顺序固定。它们均假定题目契约中的非空输入。

C
~

.. code-block:: c

   #include <stdint.h>
   #include <stdlib.h>

   int candy(int *ratings, int ratingsSize) {
       if (ratingsSize <= 0) {
           return 0;
       }

       size_t n = (size_t)ratingsSize;
       if (n > SIZE_MAX / sizeof(int)) {
           return 0;
       }
       int *candies = malloc(n * sizeof(*candies));
       if (candies == NULL) {
           return 0;
       }

       for (int index = 0; index < ratingsSize; ++index) {
           candies[index] = 1;
       }
       for (int index = 1; index < ratingsSize; ++index) {
           if (ratings[index] > ratings[index - 1]) {
               candies[index] = candies[index - 1] + 1;
           }
       }
       for (int index = ratingsSize - 2; index >= 0; --index) {
           if (ratings[index] > ratings[index + 1]) {
               int right_bound = candies[index + 1] + 1;
               if (candies[index] < right_bound) {
                   candies[index] = right_bound;
               }
           }
       }

       int total = 0;
       for (int index = 0; index < ratingsSize; ++index) {
           total += candies[index];
       }
       free(candies);
       return total;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <numeric>
   #include <vector>

   class Solution {
   public:
       int candy(std::vector<int>& ratings) {
           const int n = static_cast<int>(ratings.size());
           std::vector<int> candies(n, 1);

           for (int index = 1; index < n; ++index) {
               if (ratings[index] > ratings[index - 1]) {
                   candies[index] = candies[index - 1] + 1;
               }
           }
           for (int index = n - 2; index >= 0; --index) {
               if (ratings[index] > ratings[index + 1]) {
                   candies[index] = std::max(
                       candies[index], candies[index + 1] + 1
                   );
               }
           }
           return std::accumulate(candies.begin(), candies.end(), 0);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def candy(self, ratings: list[int]) -> int:
           candies = [1] * len(ratings)

           for index in range(1, len(ratings)):
               if ratings[index] > ratings[index - 1]:
                   candies[index] = candies[index - 1] + 1

           for index in range(len(ratings) - 2, -1, -1):
               if ratings[index] > ratings[index + 1]:
                   candies[index] = max(
                       candies[index],
                       candies[index + 1] + 1,
                   )
           return sum(candies)

Java
~~~~

.. code-block:: java

   import java.util.Arrays;

   class Solution {
       public int candy(int[] ratings) {
           int[] candies = new int[ratings.length];
           Arrays.fill(candies, 1);

           for (int index = 1; index < ratings.length; ++index) {
               if (ratings[index] > ratings[index - 1]) {
                   candies[index] = candies[index - 1] + 1;
               }
           }
           for (int index = ratings.length - 2; index >= 0; --index) {
               if (ratings[index] > ratings[index + 1]) {
                   candies[index] = Math.max(
                       candies[index], candies[index + 1] + 1
                   );
               }
           }

           int total = 0;
           for (int value : candies) {
               total += value;
           }
           return total;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn candy(ratings: Vec<i32>) -> i32 {
           let n = ratings.len();
           let mut candies = vec![1_i32; n];

           for index in 1..n {
               if ratings[index] > ratings[index - 1] {
                   candies[index] = candies[index - 1] + 1;
               }
           }
           for index in (0..n.saturating_sub(1)).rev() {
               if ratings[index] > ratings[index + 1] {
                   candies[index] = candies[index]
                       .max(candies[index + 1] + 1);
               }
           }
           candies.into_iter().sum()
       }
   }

Go
~~

.. code-block:: go

   func candy(ratings []int) int {
       candies := make([]int, len(ratings))
       for index := range candies {
           candies[index] = 1
       }

       for index := 1; index < len(ratings); index++ {
           if ratings[index] > ratings[index-1] {
               candies[index] = candies[index-1] + 1
           }
       }
       for index := len(ratings) - 2; index >= 0; index-- {
           if ratings[index] > ratings[index+1] {
               rightBound := candies[index+1] + 1
               if candies[index] < rightBound {
                   candies[index] = rightBound
               }
           }
       }

       total := 0
       for _, value := range candies {
           total += value
       }
       return total
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function candy(ratings: number[]): number {
       const candies = Array<number>(ratings.length).fill(1);

       for (let index = 1; index < ratings.length; index++) {
           if (ratings[index] > ratings[index - 1]) {
               candies[index] = candies[index - 1] + 1;
           }
       }
       for (let index = ratings.length - 2; index >= 0; index--) {
           if (ratings[index] > ratings[index + 1]) {
               candies[index] = Math.max(
                   candies[index],
                   candies[index + 1] + 1,
               );
           }
       }
       return candies.reduce((sum, value) => sum + value, 0);
   }

C#
~~

.. code-block:: csharp

   using System;

   public class Solution {
       public int Candy(int[] ratings) {
           int[] candies = new int[ratings.Length];
           Array.Fill(candies, 1);

           for (int index = 1; index < ratings.Length; ++index) {
               if (ratings[index] > ratings[index - 1]) {
                   candies[index] = candies[index - 1] + 1;
               }
           }
           for (int index = ratings.Length - 2; index >= 0; --index) {
               if (ratings[index] > ratings[index + 1]) {
                   candies[index] = Math.Max(
                       candies[index], candies[index + 1] + 1
                   );
               }
           }

           int total = 0;
           foreach (int value in candies) {
               total += value;
           }
           return total;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function candy(ratings::Vector{Int})::Int
       candies = ones(Int, length(ratings))

       for index in 2:length(ratings)
           if ratings[index] > ratings[index - 1]
               candies[index] = candies[index - 1] + 1
           end
       end
       for index in length(ratings)-1:-1:1
           if ratings[index] > ratings[index + 1]
               candies[index] = max(
                   candies[index],
                   candies[index + 1] + 1,
               )
           end
       end
       return sum(candies)
   end

R
~

.. code-block:: r

   candy <- function(ratings) {
     n <- length(ratings)
     candies <- rep.int(1L, n)

     if (n >= 2L) {
       for (index in 2L:n) {
         if (ratings[[index]] > ratings[[index - 1L]]) {
           candies[[index]] <- candies[[index - 1L]] + 1L
         }
       }
       for (index in seq.int(n - 1L, 1L, by = -1L)) {
         if (ratings[[index]] > ratings[[index + 1L]]) {
           candies[[index]] <- max(
             candies[[index]],
             candies[[index + 1L]] + 1L
           )
         }
       }
     }
     sum(candies)
   }

语言适配与语义风险
------------------

* **C**：显式检查长度乘法和 ``malloc``，所有正常路径都在返回前释放糖果数组；接口不能表达分配失败，
  因而防御性 ``0`` 不是合法题目答案。
* **C++、Java、C#**：平台返回类型是 ``int``，官方规模保证求和不溢出；输入容器没有被修改。
* **Python、TypeScript**：反向 ``range`` 或数值 ``for`` 在单元素输入上自然为空。TypeScript 的结果远低于
  ``number`` 的精确整数上限。
* **Rust**：``saturating_sub(1)`` 让反向区间在 ``n`` 为 ``0`` 或 ``1`` 时均为空，避免无符号减法下溢；
  正式契约仍要求非空。
* **Go**：循环索引是有符号 ``int``，单元素输入从 ``-1`` 开始并立即结束，不访问负下标。
* **Julia**：``2:length(ratings)`` 在长度为 ``1`` 时是空的正步长 ``UnitRange``；反向遍历显式写成
  ``length(ratings)-1:-1:1``，不能用默认正步长代替。
* **R**：只有 ``n >= 2`` 时才构造两个循环；降序必须显式使用
  ``seq.int(n - 1L, 1L, by = -1L)``，避免端点方向被误解。

静态审查记录
------------

本题代码按仓库当前“不运行题解代码”的策略完成以下检查：

* 人工推演题目页面示例，以及单元素、全相等、严格递增、严格递减、平台、峰谷交替和两侧共同抬高峰顶；
* 逐语言核对两个扫描方向、严格比较、``max`` 合并、求和类型、容器长度和平台方法签名；
* 专项检查 C 的分配与释放、Rust 的无符号区间、Julia 的显式负步长和 R 的降序 ``seq.int``；
* 对照证明确认每份实现保存的是同一组 ``L`` 下界，并在第二遍合并 ``R`` 下界。

本轮没有运行或编译任何题解代码，也没有进行对拍、穷举、属性测试或 sanitizer。剩余风险主要是未由真实编译器
确认的语法和平台适配细节；这些风险已通过逐语言静态核对降低，但不能表述为运行通过。

关键边界与易错点
----------------

* 单个孩子的答案是 ``1``；两个扫描循环都不应越界。
* 全部评分相等时答案是 ``n``，相等邻居不能使用 ``>=`` 触发递增。
* 严格递增和严格递减都会形成长度为 ``n`` 的糖果阶梯，只是方向相反。
* 峰顶可能同时受到左右两条上升链约束，必须取两侧下界的较大值，不能相加也不能覆盖。
* 谷底会把对应方向的下界重置为 ``1``，这是双向扫描能够独立分解的原因。
* 返回的是总数；不要返回糖果数组，也不要为了求和去修改评分数组。

学习链
------

本题把“局部条件”转化为“两个方向的逐点下界”。这个模式也适用于链上距离、前后缀约束和双向动态规划。
建议接着比较：

* ``0042. Trapping Rain Water``：同样用左右信息在每个位置合并，但合并形式是取较小边界；
* ``0121. Best Time to Buy and Sell Stock``：单向扫描维护前缀最优状态；
* ``0134. Gas Station``：局部前缀性质如何推出一个全局起点。

带答案自检
----------

**问：为什么不能只做左扫？**

答：左扫只保证评分高于左邻时糖更多。严格下降段中的约束指向左侧，左扫会让这些位置都保留为 ``1``。

**问：为什么逐点最小能推出总和最小？**

答：引理一、二给出了任意合法分配在每个坐标都必须满足的独立下界；算法在每个坐标同时达到这些下界。
因此任何其他合法分配逐项都不小于算法分配，求和后也不可能更小。

**问：第二遍为什么可以使用已经更新过的 ``candies[i+1]``？**

答：只有 ``ratings[i] > ratings[i+1]`` 时才会使用它；此时右邻的左侧下界恰好重置为 ``1``，
所以已经更新的值就是右邻的纯右侧下界 ``R[i+1]``，不会把无关的左侧增长重复传播回来。

**问：能否把额外空间优化到 ``O(1)``？**

答：可以按上坡、下坡长度分段计数，但需要单独处理峰顶和平台。它不改变 ``O(n)`` 时间下界，
而本题主解选择更直接、更容易跨语言审查的 ``O(n)`` 数组方案。
