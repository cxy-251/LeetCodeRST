0152. Maximum Product Subarray
==============================

题目信息
--------

:题号: 0152
:难度: Medium
:主题: 动态规划、连续子数组、乘积极值
:原题: `LeetCode 0152 <https://leetcode.com/problems/maximum-product-subarray/>`_
:访问状态: Available
:教学重点: 结尾状态、最大最小双极值、非空初始化、旧状态快照

精确契约
--------

输入整数数组 ``nums`` 满足：

* ``1 <= len(nums) <= 20000``；
* ``-10 <= nums[i] <= 10``；
* 必须选择连续且非空的子数组；单个元素本身是合法子数组；
* 任意连续子数组的乘积都能用有符号 32 位整数表示；
* 输入只读。Rust 按平台签名取得向量所有权，但不克隆或修改元素。

返回全部非空连续子数组乘积中的最大值。零可以成为答案，也可以把此前乘积链变成零；负数可能把最小负乘积
翻转成新的最大正乘积。因此只记录“当前最大正值”并不完整，状态必须同时保留最大和最小乘积。

“任意子数组乘积适合 32 位”比“最终答案适合 32 位”更强。本文每个候选都对应一个真实连续子数组，故该
保证覆盖最大状态、最小状态和两种扩展乘积。固定宽实现仍先转成 64 位再乘，明确避免窄表达式
先运算后提升。

自建示例与反例
--------------

最小乘积翻转成最大值
~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   nums = [-2, 3, -4]

逐位置状态为：

.. list-table::
   :header-rows: 1

   * - 下标
     - 当前值
     - 以此结尾最大值
     - 以此结尾最小值
     - 全局答案
   * - 0
     - -2
     - -2
     - -2
     - -2
   * - 1
     - 3
     - 3
     - -6
     - 3
   * - 2
     - -4
     - 24
     - -12
     - 24

最后的 24 来自旧最小值 ``-6`` 乘 ``-4``。若只保存旧最大值 3，最多只能看到 ``-12`` 和单独的
``-4``，会漏掉最优子数组。

非空初始化反例
~~~~~~~~~~~~~~

输入 ``[-2]`` 的唯一合法答案是 -2。若把状态或答案初始化为 0，就等价于偷偷允许乘积为 0 的空子数组，
会错误返回 0；初始化为 1 同样引入题目中不存在的候选。所有三个状态必须从 ``nums[0]`` 开始。

问题抽象与解法选择
------------------

直接枚举所有起止位置会重复计算许多乘积。连续性提示按“右端点”划分所有候选：
处理位置 ``i`` 时，只关心所有恰好以 ``i`` 结尾的非空子数组。

设上一位置结尾乘积集合为 ``P``。当前位置值为 ``x`` 时，以当前位置结尾的子数组只有两类：

* 只取 ``[x]``，乘积是 ``x``；
* 把某个以 ``i-1`` 结尾的子数组延长一个元素，乘积是 ``p*x``，其中 ``p in P``。

乘以正数保持大小顺序，乘以负数反转大小顺序，乘以零让全部扩展值都变为零。因此只需保存
``P`` 的最大值和最小值；中间乘积不可能在乘法后越过两端极值。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 工作空间
     - 取舍
   * - 最大/最小结尾乘积滚动 DP
     - ``O(n)``
     - ``O(1)``
     - 主解法；直接表达负数翻转和零重启
   * - 保存两个完整 DP 数组
     - ``O(n)``
     - ``O(n)``
     - 状态直观，但每个位置只依赖前一位置，空间可压缩
   * - 按零分段并分析首尾负数
     - ``O(n)``
     - ``O(1)``
     - 可行，但要额外证明奇偶负数、整段和去首/去尾选择
   * - 枚举全部子数组
     - ``O(n²)``
     - ``O(1)``
     - 重复扩展相同前缀，长度上限下不必要

状态、转移与代码映射
--------------------

``value``
   当前元素 ``nums[i]``，固定宽实现先提升到 64 位。

``max_ending``
   处理位置 ``i`` 后，所有以 ``i`` 结尾非空连续子数组乘积的最大值。

``min_ending``
   同一集合中的最小值。它可能是很小的负数，并在后续遇到负数时成为最大值来源。

``old_max``、``old_min``
   更新位置 ``i`` 前保存的位置 ``i-1`` 状态。两个新状态必须都从同一组旧值计算。

``extend_max``、``extend_min``
   ``old_max*value`` 与 ``old_min*value``；名称描述来源，不保证前者一定更大。

``answer``
   所有已处理右端点的 ``max_ending`` 最大值，也就是已见全部非空连续子数组的最大乘积。

初始化为：

.. code-block:: text

   max_ending = nums[0]
   min_ending = nums[0]
   answer = nums[0]

对每个后续 ``value``，从同一组旧状态产生三个候选：

.. code-block:: text

   alone       = value
   extend_max  = old_max * value
   extend_min  = old_min * value

   max_ending  = max(alone, extend_max, extend_min)
   min_ending  = min(alone, extend_max, extend_min)
   answer      = max(answer, max_ending)

显式保存两个乘积后再覆盖状态，避免用刚更新的 ``max_ending`` 计算 ``min_ending``。
后者会让当前元素在同一轮被乘两次，产生并非真实子数组的值。

核心不变量
----------

结尾极值不变量
~~~~~~~~~~~~~~~~

处理完下标 ``i`` 后，``max_ending`` 和 ``min_ending`` 分别是所有以 ``i`` 结尾非空连续
子数组乘积集合的最大值和最小值，而且两者都由某个真实子数组取得。

全局答案不变量
~~~~~~~~~~~~~~~~

处理完下标 ``i`` 后，``answer`` 是右端点位于 ``0..i`` 的所有非空连续子数组乘积最大值。任意非空连续
子数组都有唯一右端点，所以按右端点分组不会遗漏或重复候选。

非空与连续性不变量
~~~~~~~~~~~~~~~~~~~~

``alone`` 对应单元素区间 ``[i,i]``；两个扩展候选只把 ``i`` 接到一个以 ``i-1`` 结尾的区间后，得到
``[start,i]``。因此所有状态始终来自非空连续子数组，算法不能跨过零或跳过中间元素把两个负数相乘。

数值与终止不变量
~~~~~~~~~~~~~~~~~~

每个候选都是题目保证范围内的真实子数组乘积。扫描下标每轮严格增加，最多处理 ``n`` 个元素，
因而有限终止。

正确性证明
----------

引理一：三个候选完整覆盖所有以当前位置结尾的子数组
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任取一个以 ``i`` 结尾的非空连续子数组。若其起点也是 ``i``，它只含当前元素，乘积是 ``alone=value``。
否则删去末尾元素后，剩余部分是某个以 ``i-1`` 结尾的非空连续子数组，其乘积 ``p`` 属于上一位置集合，
原乘积为 ``p*value``。反过来，上一位置任意子数组接上当前元素仍是合法连续子数组。因此
这两类构成双向完整分类。

引理二：上一集合的最大值和最小值足以得到新极值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设上一位置乘积集合最小值为 ``m``、最大值为 ``M``，当前值为 ``x``。

* 若 ``x>0``，乘法保持顺序，扩展集合最小值是 ``m*x``、最大值是 ``M*x``；
* 若 ``x<0``，乘法反转顺序，扩展集合最小值是 ``M*x``、最大值是 ``m*x``；
* 若 ``x=0``，所有扩展值都为 0，两端相同。

所以扩展集合的两个极值一定在 ``old_min*x`` 与 ``old_max*x`` 中。再与单元素候选 ``x``
比较，三个候选的最大/最小值就是所有以 ``i`` 结尾子数组的真实极值，无需保存集合中间值。

引理三：结尾极值不变量对所有位置成立
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

在 ``i=0`` 时，唯一结尾子数组是 ``[nums[0]]``，最大值和最小值都等于 ``nums[0]``，初始化正确。
假设不变量对 ``i-1`` 成立。引理一给出新集合的完整分类，引理二证明转移取到该集合两端，
且三个候选都来自真实非空连续子数组。因此不变量对 ``i`` 成立。由归纳法，它对全部位置成立。

引理四：``answer`` 始终是已处理范围的全局最大值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

初始化时只有右端点 0，``answer=max_ending=nums[0]``。处理新位置时，结尾极值不变量说明
所有以该位置结尾候选中的最大值是 ``max_ending``；旧 ``answer`` 已覆盖更早右端点。
两者取最大后覆盖 ``0..i`` 的全部
右端点，且记录值来自真实子数组。全局答案不变量保持。

定理：算法返回最大非空连续子数组乘积
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

循环结束时最后处理下标为 ``n-1``。由引理四，``answer`` 覆盖所有可能右端点，也就覆盖全部非空连续
子数组；它又只从真实子数组乘积中选择，因此既不遗漏最优解，也不会高估。循环有限，返回值正确。

数值安全证明
------------

``old_max`` 和 ``old_min`` 由结尾极值不变量保证分别对应真实区间 ``[a,i-1]``、``[b,i-1]``。乘上
``nums[i]`` 后得到 ``[a,i]``、``[b,i]`` 的真实连续子数组乘积。因此官方“任意子数组乘积适合有符号
32 位”保证直接覆盖 ``extend_max``、``extend_min``，而不仅覆盖最终 ``answer``。

C/C++/Java/Rust/Go/C# 仍在乘法前把元素转换为 64 位，让表达式本身在宽类型中计算；结果最后收窄到 32 位
由上述保证支撑。Julia 使用 ``Int64``。Python 任意精度只是本语言额外能力，证明没有把它
外推到固定宽实现。TypeScript 和 R 的双精度数可精确表示所有 32 位整数，两个整数的真实乘积
又仍在 32 位范围，故乘法结果也是可精确表示的整数。

复杂度与语言成本
----------------

初始化后只扫描余下 ``n-1`` 个元素，每个位置做固定次乘法和比较，时间 ``O(n)``。滚动状态只有
``value``、两项旧极值、两项扩展值、两项新极值和答案，核心工作空间 ``O(1)``。

没有输出容器，返回载荷是一个整数。C/C++/Java/Go/TypeScript/C#/Julia/R 都只读输入数组；
Rust 的平台签名按值取得 ``Vec<i32>``，但循环只借用元素，不克隆载荷。Python 索引循环没有
创建 ``nums[1:]`` 切片，Go 的
``nums[1:]`` 只是共享底层数组的切片头，不复制元素。所有实现都没有堆分配算法状态。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdint.h>

   static int64_t max_three(
       int64_t first,
       int64_t second,
       int64_t third
   ) {
       int64_t best = first > second ? first : second;
       return best > third ? best : third;
   }

   static int64_t min_three(
       int64_t first,
       int64_t second,
       int64_t third
   ) {
       int64_t best = first < second ? first : second;
       return best < third ? best : third;
   }

   int maxProduct(int *nums, int numsSize) {
       int64_t max_ending = nums[0];
       int64_t min_ending = nums[0];
       int64_t answer = nums[0];

       for (int index = 1; index < numsSize; ++index) {
           const int64_t value = (int64_t)nums[index];
           const int64_t extend_max = max_ending * value;
           const int64_t extend_min = min_ending * value;

           max_ending = max_three(
               value,
               extend_max,
               extend_min
           );
           min_ending = min_three(
               value,
               extend_max,
               extend_min
           );
           if (max_ending > answer) {
               answer = max_ending;
           }
       }

       return (int)answer;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <cstddef>
   #include <cstdint>
   #include <vector>

   class Solution {
   public:
       int maxProduct(std::vector<int>& nums) {
           std::int64_t maxEnding = nums[0];
           std::int64_t minEnding = nums[0];
           std::int64_t answer = nums[0];

           for (std::size_t index = 1; index < nums.size(); ++index) {
               const std::int64_t value = nums[index];
               const std::int64_t extendMax = maxEnding * value;
               const std::int64_t extendMin = minEnding * value;

               maxEnding = std::max(
                   value,
                   std::max(extendMax, extendMin)
               );
               minEnding = std::min(
                   value,
                   std::min(extendMax, extendMin)
               );
               answer = std::max(answer, maxEnding);
           }

           return static_cast<int>(answer);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxProduct(self, nums: list[int]) -> int:
           max_ending = nums[0]
           min_ending = nums[0]
           answer = nums[0]

           for index in range(1, len(nums)):
               value = nums[index]
               extend_max = max_ending * value
               extend_min = min_ending * value

               max_ending = max(value, extend_max, extend_min)
               min_ending = min(value, extend_max, extend_min)
               answer = max(answer, max_ending)

           return answer

Java
~~~~

.. code-block:: java

   class Solution {
       public int maxProduct(int[] nums) {
           long maxEnding = nums[0];
           long minEnding = nums[0];
           long answer = nums[0];

           for (int index = 1; index < nums.length; ++index) {
               long value = nums[index];
               long extendMax = maxEnding * value;
               long extendMin = minEnding * value;

               maxEnding = Math.max(
                   value,
                   Math.max(extendMax, extendMin)
               );
               minEnding = Math.min(
                   value,
                   Math.min(extendMax, extendMin)
               );
               answer = Math.max(answer, maxEnding);
           }

           return (int)answer;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn max_product(nums: Vec<i32>) -> i32 {
           let mut max_ending = i64::from(nums[0]);
           let mut min_ending = i64::from(nums[0]);
           let mut answer = i64::from(nums[0]);

           for &number in nums.iter().skip(1) {
               let value = i64::from(number);
               let extend_max = max_ending * value;
               let extend_min = min_ending * value;

               max_ending = value.max(extend_max.max(extend_min));
               min_ending = value.min(extend_max.min(extend_min));
               answer = answer.max(max_ending);
           }

           answer as i32
       }
   }

Go
~~

.. code-block:: go

   func maxProduct(nums []int) int {
       maxEnding := int64(nums[0])
       minEnding := int64(nums[0])
       answer := int64(nums[0])

       for _, number := range nums[1:] {
           value := int64(number)
           extendMax := maxEnding * value
           extendMin := minEnding * value

           maxEnding = maxThree(value, extendMax, extendMin)
           minEnding = minThree(value, extendMax, extendMin)
           if maxEnding > answer {
               answer = maxEnding
           }
       }

       return int(answer)
   }

   func maxThree(first int64, second int64, third int64) int64 {
       if second > first {
           first = second
       }
       if third > first {
           first = third
       }
       return first
   }

   func minThree(first int64, second int64, third int64) int64 {
       if second < first {
           first = second
       }
       if third < first {
           first = third
       }
       return first
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxProduct(nums: number[]): number {
       let maxEnding = nums[0];
       let minEnding = nums[0];
       let answer = nums[0];

       for (let index = 1; index < nums.length; index += 1) {
           const value = nums[index];
           const extendMax = maxEnding * value;
           const extendMin = minEnding * value;

           maxEnding = Math.max(value, extendMax, extendMin);
           minEnding = Math.min(value, extendMax, extendMin);
           answer = Math.max(answer, maxEnding);
       }

       return answer;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int MaxProduct(int[] nums) {
           long maxEnding = nums[0];
           long minEnding = nums[0];
           long answer = nums[0];

           for (int index = 1; index < nums.Length; ++index) {
               long value = nums[index];
               long extendMax = maxEnding * value;
               long extendMin = minEnding * value;

               maxEnding = System.Math.Max(
                   value,
                   System.Math.Max(extendMax, extendMin)
               );
               minEnding = System.Math.Min(
                   value,
                   System.Math.Min(extendMax, extendMin)
               );
               answer = System.Math.Max(answer, maxEnding);
           }

           return (int)answer;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function max_product(nums::Vector{Int})::Int
       max_ending = Int64(nums[1])
       min_ending = Int64(nums[1])
       answer = Int64(nums[1])

       for index in 2:length(nums)
           value = Int64(nums[index])
           extend_max = max_ending * value
           extend_min = min_ending * value

           max_ending = max(value, extend_max, extend_min)
           min_ending = min(value, extend_max, extend_min)
           answer = max(answer, max_ending)
       end

       return Int(answer)
   end

R
~

.. code-block:: r

   max_product <- function(nums) {
     max_ending <- as.double(nums[1L])
     min_ending <- as.double(nums[1L])
     answer <- as.double(nums[1L])
     n <- length(nums)

     if (n >= 2L) {
       for (index in seq.int(2L, n)) {
         value <- as.double(nums[index])
         extend_max <- max_ending * value
         extend_min <- min_ending * value

         max_ending <- max(value, extend_max, extend_min)
         min_ending <- min(value, extend_max, extend_min)
         answer <- max(answer, max_ending)
       }
     }

     answer
   }

人工推演与静态审查
------------------

本题没有运行、编译或测试任何题解代码，也没有执行官方示例、随机对拍、穷举、属性测试、
sanitizer 或目标语言最小程序。以下结果来自候选表纸面推演、归纳证明、数值上界推导和
逐语言静态语义审查。

官方示例一
~~~~~~~~~~

对 ``[2,3,-2,4]``：

.. list-table::
   :header-rows: 1

   * - ``i``
     - ``value``
     - ``old_max``
     - ``old_min``
     - 三候选
     - ``new_max``
     - ``new_min``
     - ``answer``
   * - 0
     - 2
     - —
     - —
     - ``{2}``
     - 2
     - 2
     - 2
   * - 1
     - 3
     - 2
     - 2
     - ``{3,6,6}``
     - 6
     - 3
     - 6
   * - 2
     - -2
     - 6
     - 3
     - ``{-2,-12,-6}``
     - -2
     - -12
     - 6
   * - 3
     - 4
     - -2
     - -12
     - ``{4,-8,-48}``
     - 4
     - -48
     - 6

答案 6 由子数组 ``[2,3]`` 取得。

官方示例二
~~~~~~~~~~

对 ``[-2,0,-1]``，初始化 ``max=min=answer=-2``。位置 1 的三个候选全为 0，所以
``max=min=answer=0``。位置 2 的候选是 ``{-1,0,0}``，得到 ``max=0``、``min=-1``，答案仍为 0。
这里的 0 来自连续子数组 ``[0,-1]`` 或单元素 ``[0]``；算法没有跨过零把不相邻的 -2 与 -1 相乘。

自建翻转示例
~~~~~~~~~~~~

对 ``[-2,3,-4]``：位置 1 候选 ``{3,-6,-6}``，得到 ``max=3``、``min=-6``；位置 2 候选
``{-4,-12,24}``，旧最小值扩展为新最大值 24。该推演与开头反例一致，并明确
两个新状态都使用位置 1 的旧值。

关键边界纸面推导
~~~~~~~~~~~~~~~~

* ``[-2]``：循环零次，三个初始化状态都是 -2，返回合法非空答案 -2；
* ``[-2,-3,-4]``：状态最大值依次为 -2、6、12，答案 12 来自 ``[-3,-4]``；
* ``[0,0]``：候选始终为 0，零既能单独开始，也能结束此前链；
* ``[-1,0,-2]``：零后的位置候选含 ``-2`` 与两个 0，状态可从单元素重新开始，但不能跳过零；
* ``[2,-1,2]``：最优为单元素 2 或首尾局部，三候选不会把两个不相邻的 2 相乘；
* 每个扩展乘积都有真实区间见证，故官方任意子数组 32 位保证覆盖最小状态，不只覆盖答案。

逐语言静态语义审查
~~~~~~~~~~~~~~~~~~

* **C / C++**：输入非空支撑槽 0 读取；元素先进入 ``int64_t`` 再乘，两个扩展值都在覆盖状态前保存。
  最终静态转换由 32 位子数组乘积保证支撑，输入未修改。
* **Python**：按下标循环没有切片物化；任意精度乘法与三参数 ``max``/``min``
  使用同一候选，但固定宽语言安全性仍由独立的官方范围证明，而非 Python 行为。
* **Java / C#**：``nums[index]`` 先提升到 ``long``，乘法表达式因此在 64 位完成；两个嵌套
  ``Math.Max``/``Math.Min`` 覆盖三候选，返回窄化安全。
* **Rust**：``i64::from`` 在乘法前提升，``iter().skip(1)`` 只借用已拥有向量，
  不复制元素；三个候选在覆盖前求出，``as i32`` 由题面范围支撑。
* **Go**：``int64(number)`` 先于乘法；``nums[1:]`` 是共享底层数组的切片视图，非空合同保证边界合法，
  不修改输入。返回 ``int`` 至少覆盖 32 位。
* **TypeScript**：没有位运算；输入、状态和全部乘积都在 32 位整数域，远小于 ``2^53-1``，所以
  ``number`` 乘法和比较保持精确整数。
* **Julia**：一基首元素为 ``nums[1]``；``2:length(nums)`` 在单元素时是空的正步长 ``UnitRange``，
  不会访问索引 2。``Int64`` 乘法和最终 ``Int`` 转换覆盖官方范围。
* **R**：仅在 ``n>=2`` 后构造 ``seq.int(2,n)``，端点与正步长方向一致；双精度精确表示全部 32 位候选，
  标量重绑定不修改调用者数组。

剩余风险
~~~~~~~~

静态审查未确认判题机的实际整数宽度、编译器溢出选项、语言版本或平台模板，
也未观察托管运行时的数值表示细节。本文依赖当前官方“任意子数组乘积适合 32 位”保证；
若平台只保证最终最大值，最小状态和扩展候选必须重新推导更宽上界。
没有任何实现被运行、编译或以测试消除这些剩余风险。

关键边界与失败方式
------------------

* 只维护最大结尾乘积会漏掉“负最小值乘负数变最大值”的路径。
* 从 0 或 1 初始化会允许空子数组，单个负数输入立即出错。
* ``max_ending`` 和 ``min_ending`` 必须基于同一旧状态；先覆盖最大值再拿它计算
  最小值会重复使用当前元素。
* 连续子数组只能延长 ``i-1`` 结尾状态，不能跨过零或跳过中间元素连接两个有利片段。
* 零无需特殊重置分支；三个候选自然同时表达单独取零和旧区间乘零。
* 最终答案适合 32 位通常不足以保护中间最小值；本题额外保证任意子数组乘积才关闭这个风险。
* 固定宽乘法必须先提升操作数；先用 32 位相乘再赋给 64 位无法修复已发生的溢出。
* Julia 单元素范围和 R ``seq.int`` 方向不能按 C 风格循环直觉处理，必须分别核对。
* TypeScript/R 的安全来自全部真实乘积位于 32 位，不是因为浮点算法能精确表示任意整数乘积。

学习链与知识更新
----------------

本题把普通“最大子数组”状态扩展成乘法下的双极值状态。加法保持顺序，
只需一个最大前缀；乘法遇负数会反转顺序，所以必须同时携带最大值和最小值。
状态摘要之所以充分，不是经验技巧，而是乘以固定数对区间端点的单调或反单调性质。

新增或强化的知识包括：

* 按唯一右端点划分全部连续子数组，把二次枚举压缩为线性递推；
* 乘正数保持极值角色、乘负数交换角色、乘零合并到零；
* 非空优化问题从首个合法候选初始化，不能用输入域内的 0/1 冒充不存在状态；
* 滚动 DP 覆盖前先保存全部旧依赖，防止同一元素在一轮内被重复使用；
* “每个候选是真实子数组”既是正确性见证，也是应用题面数值上界的桥梁；
* 关联到 `0053. Maximum Subarray <../0001-0100/0053-maximum-subarray.rst>`_ 的结尾状态；本题新增
  负数导致的双极值需求；
* 可继续关联到最大乘积路径、符号状态 DP 和区间乘积问题。

带答案自检
----------

#. **为什么只保存 ``max_ending`` 不够？**

   很小的负乘积遇到负数会变成很大的正乘积；丢掉 ``min_ending`` 会丢掉这个来源。

#. **三个候选为什么覆盖所有以当前位置结尾的子数组？**

   这类子数组要么只有当前元素，要么由某个以前一位置结尾的子数组追加当前元素。

#. **为什么扩展集合只需旧最大值和旧最小值？**

   乘正数保持大小顺序，乘负数反转顺序，乘零全部相等；新极值一定来自旧集合两端。

#. **为什么状态必须从 ``nums[0]`` 初始化？**

   题目要求非空子数组；首元素是第一个合法候选，0 或 1 可能不是任何输入子数组乘积。

#. **怎样避免更新顺序污染？**

   先用旧最大、旧最小计算并保存两个扩展乘积，再同时从同一组三候选得到新最大和新最小。

#. **零为什么不需要特殊分支？**

   ``alone=0``，两个扩展候选也为 0，状态自然变成 0；后续元素又可通过 ``alone`` 重新开始。

#. **为什么 64 位乘法与最终 32 位转换都安全？**

   两个扩展候选对应真实连续子数组，官方保证任意子数组乘积适合 32 位；代码先提升到 64 位再计算，
   最终值再安全收窄。
