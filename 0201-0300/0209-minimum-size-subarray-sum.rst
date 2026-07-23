0209. Minimum Size Subarray Sum
===============================

题目信息
--------

:题号: 0209
:难度: Medium
:主题: 数组、滑动窗口、前缀和、二分查找
:原题: `LeetCode 0209 <https://leetcode.com/problems/minimum-size-subarray-sum/>`_
:重点: 正整数数组、连续且非空、元素和至少为 target、返回最短长度或零

题目重述
--------

给定正整数 ``target`` 和只包含正整数的数组 ``nums``，找出元素和大于或等于 ``target`` 的最短非空连续子数组，并返回它的长度。若不存在满足条件的连续子数组，返回 ``0``。

``target`` 位于 ``[1, 10^9]``，``nums`` 的长度位于 ``[1, 10^5]``，每个元素位于 ``[1, 10^4]``。子数组必须由原数组中的连续位置组成；多个子数组拥有相同最短长度时只返回该长度，不要求返回区间位置或元素。

自建示例
--------

最短窗口位于数组中间：

.. code-block:: text

   输入：target = 11，nums = [1, 4, 6, 5, 2]
   输出：2
   解释：连续子数组 [6,5] 的和为 11，长度为 2；数组中没有单个元素达到 11。

总和仍不足：

.. code-block:: text

   输入：target = 20，nums = [3, 5, 4, 2]
   输出：0
   解释：整个数组的和只有 14，不存在元素和至少为 20 的连续子数组。

问题抽象与解法选择
------------------

维护一个当前连续窗口 ``nums[left..right]`` 及其元素和 ``sum``：

#. 右端每次加入一个新元素；
#. 只要 ``sum >= target``，当前窗口可行，先提交长度；
#. 随后移除左端元素并令 ``left`` 右移，继续尝试更短窗口；
#. 当前右端下不再可行后，才进入下一个右端。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 核心额外空间
     - 取舍
   * - 正数滑动窗口
     - ``O(n)``
     - ``O(1)``
     - 主解法；利用边界移动的单调性
   * - 前缀和加二分
     - ``O(n log n)``
     - ``O(n)``
     - 同样利用正数使前缀和严格递增
   * - 枚举起点并向右累加
     - ``O(n²)``
     - ``O(1)``
     - 重复计算大量重叠区间
   * - 枚举所有区间
     - ``O(n²)`` 到 ``O(n³)``
     - 视实现而定
     - 没有利用全正数条件

窗口状态与不变量
----------------

外层循环刚把 ``nums[right]`` 加入后，维护闭区间窗口 ``[left,right]``。在内层收缩过程中保持：

#. ``sum`` 恰好等于 ``nums[left] + ... + nums[right]``；若 ``left=right+1``，窗口为空且 ``sum=0``；
#. ``0 <= left <= right+1``，右端只向右移动，左端也只向右移动；
#. ``best`` 是所有已经提交的可行窗口长度最小值；
#. 所有起点小于当前 ``left`` 的窗口已经在更早时刻被提交，或已被证明不可能产生更短答案；
#. 输入数组没有被修改。

加入右端
~~~~~~~~

执行：

.. code-block:: text

   sum += nums[right]

旧窗口是 ``nums[left..right-1]``，加入新元素后正好变为 ``nums[left..right]``，所以窗口和不变量保持。

持续收缩
~~~~~~~~

当 ``sum >= target`` 时，当前窗口可行：

.. code-block:: text

   best = min(best, right - left + 1)
   sum -= nums[left]
   left += 1

先记录长度，再删除旧左端。删除后 ``sum`` 仍与新窗口精确对应。若新和仍达标，新的窗口更短，必须继续提交和收缩；
若新和不足，因为后续再删正数只会更小，本右端下没有更多可行窗口。

为什么不能只收缩一次
~~~~~~~~~~~~~~~~~~~~

第一个可行窗口通常不是当前右端下最短的窗口。以 ``target=7``、前缀 ``[2,3,1,2,4]`` 为例，
加入 ``4`` 后和为 10：

.. code-block:: text

   [3,1,2,4]  和 10，长度 4
   [1,2,4]    和 7， 长度 3
   [2,4]      和 6， 不可行

必须在同一右端下连续检查前两个窗口，才能得到长度 3。

正确性证明
----------

引理一：窗口和不变量始终成立
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

初始化 ``left=0``、``sum=0``，空窗口和为 0。外层加入 ``nums[right]`` 时，正好把新右端元素加入旧窗口和。
内层删除 ``nums[left]`` 后再递增 ``left``，正好移除旧左端。除此之外没有改变 ``sum``，
因此每一步 ``sum`` 都等于当前窗口元素和。

引理二：对固定右端，算法检查该右端下所有可能改进答案的可行窗口
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

固定 ``right`` 后，左端从当前值单调右移。只要窗口和达标，算法在删除前提交当前长度。
由于元素全为正，左端右移使窗口和严格下降、长度也严格缩短。算法因此依次提交所有连续可行左边界，
直到第一次变为不可行。再继续移动左端只会让和更小，不可能重新可行，所以没有漏掉该右端下更短的可行窗口。

引理三：被永久越过的左端不会在未来产生新的全局最优解
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设起点 ``s`` 在某个较早右端 ``r`` 被算法移除。移除前窗口 ``[s,r]`` 已经可行并被提交。
对任何未来右端 ``r'>r``，窗口 ``[s,r']`` 比 ``[s,r]`` 更长，因此不可能比已经提交的
``[s,r]`` 更短。即使未来窗口仍可行，也没有必要重新保留该起点。故左端只向右移动不会丢失全局最优候选。

引理四：任意全局最短可行窗口都会被提交
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设全局最短窗口为 ``[a,b]``。处理右端 ``b`` 时：

* 若当前 ``left <= a``，内层循环会按顺序检查可行左边界。由引理二，它不会在到达 ``a`` 前漏掉可能的更短窗口；
  ``[a,b]`` 可行，所以会被提交，或算法会提交一个更靠右且更短的可行窗口，这与 ``[a,b]`` 已是全局最短一致；
* 若当前 ``left > a``，起点 ``a`` 已在更早右端被越过。由引理三，当时已经提交了一个终点更早、长度严格小于
  ``[a,b]`` 的可行窗口，这与 ``[a,b]`` 是严格更短的遗漏答案矛盾。

因此至少一个全局最短长度必然进入 ``best``。

引理五：``best`` 始终来自真实可行窗口
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

算法只在 ``sum >= target`` 时更新 ``best``。由引理一，此时 ``sum`` 就是当前连续窗口的真实元素和，
所以每个候选长度都对应合法非空连续子数组，不会产生虚假答案。

定理：算法返回最短可行长度，不存在时返回 0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若存在可行窗口，引理四保证全局最短长度被提交，引理五保证 ``best`` 中没有非法候选；
取所有候选最小值即为答案。若不存在可行窗口，内层循环从不执行，``best`` 保持哨兵 ``n+1``，
算法返回 0，符合合同。

终止性与线性工作量
~~~~~~~~~~~~~~~~~~

右端从 0 到 ``n-1`` 只前进，不回退。左端也只前进且最多从 0 到 ``n``。
每个元素至多被右端加入一次、被左端移除一次，所以两个循环虽然嵌套，总操作数仍为线性。

人工状态推演
------------

``target=7, nums=[2,3,1,2,4,3]``：

.. list-table::
   :header-rows: 1

   * - 加入位置
     - 加入后窗口
     - 收缩过程
     - 当前最短
   * - 0
     - ``[2]``，和 2
     - 不收缩
     - —
   * - 1
     - ``[2,3]``，和 5
     - 不收缩
     - —
   * - 2
     - ``[2,3,1]``，和 6
     - 不收缩
     - —
   * - 3
     - ``[2,3,1,2]``，和 8
     - 提交 4，移除 2 后和 6
     - 4
   * - 4
     - ``[3,1,2,4]``，和 10
     - 提交 4；移除 3 后提交 ``[1,2,4]`` 长度 3；再移除 1 后和 6
     - 3
   * - 5
     - ``[2,4,3]``，和 9
     - 提交 3；移除 2 后提交 ``[4,3]`` 长度 2；再移除 4 后和 3
     - 2

最终返回 2。

复杂度与语言成本
----------------

设 ``n=len(nums)``：

* 每个元素最多进入窗口一次、离开窗口一次，时间复杂度 ``O(n)``；
* ``left``、``right``、``sum`` 和 ``best`` 是固定数量状态，核心额外空间 ``O(1)``；
* 输入数组只读，没有额外结果容器；
* C、C++、Java、Rust、Go 与 C# 使用 64 位累加器，避免多个 32 位正数求和时溢出；
* Python 整数自动扩展；
* TypeScript ``number`` 在官方约束得到的总和范围内保持精确整数；若外部适配器允许总和超过 ``2^53-1``，
  必须改用 ``bigint``，不能继续声称精确；
* Julia 使用 ``Int64`` 累加；若输入元素本身超出 ``Int64`` 合同，需要更宽整数模型；
* R 的 numeric 是双精度，官方整数和处于精确整数域；函数不修改传入向量；
* Rust 的 ``Vec<i32>`` 按值传入会移动所有权，不会复制元素缓冲区；
* R 与 Julia 使用一基索引，窗口长度分别为 ``right-left+1``，不能照抄零基边界后再额外加一。

十语言实现
----------

C
~

.. code-block:: c

   #include <limits.h>

   int minSubArrayLen(int target, int *nums, int numsSize) {
       int left = 0;
       int best = numsSize + 1;
       long long sum = 0;

       for (int right = 0; right < numsSize; ++right) {
           sum += (long long)nums[right];

           while (sum >= (long long)target) {
               const int length = right - left + 1;
               if (length < best) {
                   best = length;
               }

               sum -= (long long)nums[left];
               ++left;
           }
       }

       return best == numsSize + 1 ? 0 : best;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   public:
       int minSubArrayLen(int target, const std::vector<int>& nums) {
           std::size_t left = 0;
           std::size_t best = nums.size() + 1;
           long long sum = 0;

           for (std::size_t right = 0; right < nums.size(); ++right) {
               sum += static_cast<long long>(nums[right]);

               while (sum >= static_cast<long long>(target)) {
                   best = std::min(best, right - left + 1);
                   sum -= static_cast<long long>(nums[left]);
                   ++left;
               }
           }

           return best == nums.size() + 1
               ? 0
               : static_cast<int>(best);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def minSubArrayLen(self, target: int, nums: list[int]) -> int:
           left = 0
           window_sum = 0
           best = len(nums) + 1

           for right, value in enumerate(nums):
               window_sum += value

               while window_sum >= target:
                   best = min(best, right - left + 1)
                   window_sum -= nums[left]
                   left += 1

           return 0 if best == len(nums) + 1 else best

Java
~~~~

.. code-block:: java

   class Solution {
       public int minSubArrayLen(int target, int[] nums) {
           int left = 0;
           int best = nums.length + 1;
           long sum = 0L;

           for (int right = 0; right < nums.length; ++right) {
               sum += nums[right];

               while (sum >= target) {
                   best = Math.min(best, right - left + 1);
                   sum -= nums[left];
                   ++left;
               }
           }

           return best == nums.length + 1 ? 0 : best;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn min_sub_array_len(target: i32, nums: Vec<i32>) -> i32 {
           let mut left = 0usize;
           let mut sum = 0i64;
           let mut best = nums.len() + 1;

           for right in 0..nums.len() {
               sum += i64::from(nums[right]);

               while sum >= i64::from(target) {
                   best = best.min(right - left + 1);
                   sum -= i64::from(nums[left]);
                   left += 1;
               }
           }

           if best == nums.len() + 1 {
               0
           } else {
               best as i32
           }
       }
   }

Go
~~

.. code-block:: go

   func minSubArrayLen(target int, nums []int) int {
       left := 0
       best := len(nums) + 1
       var sum int64

       for right, value := range nums {
           sum += int64(value)

           for sum >= int64(target) {
               length := right - left + 1
               if length < best {
                   best = length
               }

               sum -= int64(nums[left])
               left++
           }
       }

       if best == len(nums)+1 {
           return 0
       }
       return best
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minSubArrayLen(target: number, nums: number[]): number {
       let left = 0;
       let sum = 0;
       let best = nums.length + 1;

       for (let right = 0; right < nums.length; right++) {
           sum += nums[right];

           while (sum >= target) {
               best = Math.min(best, right - left + 1);
               sum -= nums[left];
               left++;
           }
       }

       return best === nums.length + 1 ? 0 : best;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int MinSubArrayLen(int target, int[] nums) {
           int left = 0;
           int best = nums.Length + 1;
           long sum = 0L;

           for (int right = 0; right < nums.Length; ++right) {
               sum += nums[right];

               while (sum >= target) {
                   best = System.Math.Min(best, right - left + 1);
                   sum -= nums[left];
                   ++left;
               }
           }

           return best == nums.Length + 1 ? 0 : best;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function min_sub_array_len(target::Integer, nums::AbstractVector{<:Integer})::Int
       left = firstindex(nums)
       best = length(nums) + 1
       window_sum = Int64(0)

       for right in eachindex(nums)
           window_sum += Int64(nums[right])

           while window_sum >= Int64(target)
               best = min(best, right - left + 1)
               window_sum -= Int64(nums[left])
               left += 1
           end
       end

       best == length(nums) + 1 ? 0 : best
   end

R
~

.. code-block:: r

   min_sub_array_len <- function(target, nums) {
     left <- 1L
     window_sum <- 0
     best <- length(nums) + 1L

     if (length(nums) == 0L) {
       return(0L)
     }

     for (right in seq_along(nums)) {
       window_sum <- window_sum + nums[[right]]

       while (window_sum >= target) {
         best <- min(best, right - left + 1L)
         window_sum <- window_sum - nums[[left]]
         left <- left + 1L
       }
     }

     if (best == length(nums) + 1L) 0L else as.integer(best)
   }

语言静态核对
------------

C
   平台数组指针未声明 ``const``，实现仍只读。``long long`` 保存窗口和；空数组时外层循环不执行并返回 0。

C++
   参数使用常量引用，不复制数组。``std::size_t`` 保存边界和哨兵，返回前在答案存在时转为 ``int``。

Python
   整数自动扩展；列表只读访问。内层 ``while`` 可能多次执行，但 ``left`` 总计最多移动 ``n`` 次。

Java
   ``long`` 累加器阻止 ``int`` 求和溢出；比较时 ``target`` 自动提升为 ``long``。

Rust
   向量按值移动进函数，元素缓冲区不复制。索引只在窗口非空且和达标时读取；正数合同保证收缩不会越过 ``right+1`` 后继续。

Go
   ``int64`` 累加，输入切片只读。``range`` 的 ``right`` 是零基索引，与长度公式一致。

TypeScript
   ``number`` 是双精度；官方约束下整数和精确。实现不使用 ``shift`` 等 32 位位运算，不会把数值截断为有符号 32 位。

C#
   ``long`` 累加器与 ``int`` 长度分工明确；数组不被修改。

Julia
   ``firstindex`` 和 ``eachindex`` 避免假设自定义向量一定从 1 开始，但长度公式仍要求连续整数索引；
   LeetCode 适配器使用普通一基 ``Vector``。``Int64`` 明确承载求和。

R
   ``seq_along`` 在空向量上安全返回 ``integer(0)``；函数先显式返回 0。numeric 在官方范围内精确保存整数和，
   参数绑定未被修改。

静态审查记录
------------

本章未运行、未编译、未对拍或测试任何题解代码。已完成：

* 人工推演标准示例、单元素命中、总和不足、答案位于开头/结尾和同一右端连续多次收缩；
* 明确全正数是窗口方向判断和停止收缩的前提；
* 证明窗口和不变量、固定右端候选覆盖、已越过左端安全性和全局最短不遗漏；
* 核对每个元素最多被左右指针各经过一次；
* 核对十语言都在每次可行时先提交长度、再移除左端；
* 核对固定宽语言使用宽累加器，返回长度仍为普通整数；
* 核对 TypeScript 与 R 的官方精确整数范围；
* 核对 Julia/R 一基边界和空输入扩展；
* 核对全部实现只读输入，没有返回区间载荷；
* 核对单题为一个自包含 RST，未使用 ``.inc`` 或 ``include``。

剩余风险：

* 题解未在目标平台编译或执行，平台签名与语法仍存在静态审查无法消除的风险；
* 外部适配器若允许 0 或负数，本文严格正数证明不能直接复用；
* TypeScript 外部输入总和若超过 ``2^53-1`` 会失去整数精度；
* Julia ``Int64`` 转换要求输入值可表示为 64 位整数；
* R numeric 的精确整数域与平台约束绑定。

关键易错点
----------

* 忘记全正数前提，在含负数数组上继续使用相同窗口；
* 窗口首次达标后立即返回，错过后续更短窗口；
* 每个右端只收缩一次，而不是使用 ``while``；
* 先移除左端再记录长度，导致记录的是错误窗口；
* 把长度写成 ``right-left``，漏掉闭区间的 ``+1``；
* 总和不足时仍移动左端，使窗口更不可能达标；
* 让 ``best`` 初值为 0，无法区分尚无答案；
* 固定宽语言用普通 32 位整数累加；
* 声称嵌套循环是 ``O(n²)``，忽略左端不回退；
* 返回最短元素和而不是最短长度。

知识更新与关联题
----------------

* ``0076 Minimum Window Substring``：同样在可行时持续收缩，但可行性由字符缺口而非正数和决定；
* ``0208 Implement Trie``：前一题是持久对象状态，本题是单次线性窗口状态；
* ``0325 Maximum Size Subarray Sum Equals k``：含负数时需要前缀和与哈希，不能使用本题单调窗口；
* ``0713 Subarray Product Less Than K``：正数乘积窗口，需额外处理 ``k<=1``；
* ``0862 Shortest Subarray with Sum at Least K``：允许负数，使用前缀和与单调队列；
* ``1004 Max Consecutive Ones III``：以“零的数量”维护可行窗口。

自检问题与答案
--------------

**问题 1：为什么 ``sum<target`` 时不移动左端？**

所有元素为正，移除左端只会让和更小，不可能从不可行变为可行；必须等待右端加入新元素。

**问题 2：为什么窗口达标后必须使用 ``while``？**

同一右端下可能连续存在多个更短的可行窗口。每次删除正数都会缩短长度，直到和首次不足才停止。

**问题 3：已经被越过的左端为什么不必为未来右端保留？**

它在被移除前对应的可行窗口已经提交。未来使用同一起点只会增加右端、让窗口更长，不可能改进已提交长度。

**问题 4：两个循环嵌套为什么仍是 ``O(n)``？**

右端总共移动 ``n`` 次，左端在全部内层循环中合计也最多移动 ``n`` 次，没有任何指针回退。

**问题 5：为什么固定宽语言要用 64 位和？**

单个元素可放入 32 位整数不代表多个正数之和仍可放入 32 位。宽累加器避免比较 ``target`` 前发生溢出。

**问题 6：不存在答案时为什么使用 ``n+1`` 哨兵？**

任何合法非空子数组长度都在 ``1..n``。``n+1`` 不可能是答案，可稳定表示“从未提交过可行窗口”，最终映射为 0。
