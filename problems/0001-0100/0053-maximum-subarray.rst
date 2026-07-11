0053. Maximum Subarray
======================

题目信息
--------

:题号: 0053
:难度: Medium
:主题: 数组、动态规划、贪心、连续子数组
:原题: `LeetCode 0053 <https://leetcode.com/problems/maximum-subarray/>`_
:访问状态: Available
:教学重点: 以当前位置结尾的最优状态、丢弃负贡献前缀、全负数组、常数空间滚动

题目重述
--------

给定一个非空整数数组 ``nums``，选择一个连续且至少包含一个元素的子数组，使其元素和最大，返回该
最大和。

题目保证 ``1 <= nums.length <= 100000``，且 ``-10000 <= nums[i] <= 10000``。因此任意连续子数组
和的绝对值不超过 ``10^9``，能够由 32 位有符号整数表示。输入数组不会被修改。

自建示例
--------

中间区间最优
~~~~~~~~~~~~

.. code-block:: text

   输入：nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
   输出：6
   解释：连续子数组 [4, -1, 2, 1] 的和为 6。

全部为负数
~~~~~~~~~~

.. code-block:: text

   输入：nums = [-8, -3, -5]
   输出：-3

子数组必须非空，因此不能返回空子数组的和 ``0``。

单元素
~~~~~~

.. code-block:: text

   输入：nums = [7]
   输出：7

问题抽象
--------

对每个位置 ``i``，只需要知道“必须以 ``i`` 结尾的最大子数组和”。记为 ``ending_here``：

* 单独选择 ``nums[i]``，从当前位置重新开始；
* 把 ``nums[i]`` 接到以 ``i-1`` 结尾的最优子数组之后。

因此状态转移为：

.. code-block:: text

   ending_here = max(nums[i], previous_ending + nums[i])
   best = max(best, ending_here)

若 ``previous_ending`` 为负数，把它接到当前元素前只会降低总和，因此应该丢弃；若它为非负数，接上
当前元素不会比单独开始更差。这就是 Kadane 算法的动态规划含义，也可以解释为“丢弃负贡献前缀”的
贪心决策。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - Kadane 滚动动态规划
     - ``O(n)``
     - ``O(1)``
     - 主解法；一次扫描，状态最少
   * - 前缀和减最小前缀
     - ``O(n)``
     - ``O(1)``
     - 等价视角；需要明确空前缀与非空区间边界
   * - 分治合并四类区间信息
     - ``O(n log n)``
     - ``O(log n)``
     - 可推广到线段树，但本题成本更高

主解法：Kadane 滚动动态规划
---------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

扫描到位置 ``i`` 后保持：

* ``ending_here`` 等于所有右端点恰好为 ``i`` 的非空连续子数组中的最大和；
* ``best`` 等于所有完全位于 ``0..i`` 范围内的非空连续子数组中的最大和。

初始化使用 ``nums[0]``，而不是 ``0``。这样状态从一开始就对应非空子数组，并能正确处理全部为负数的
输入。

转移为什么只有两种选择
~~~~~~~~~~~~~~~~~~~~~~

任何以 ``i`` 结尾的非空连续子数组都属于且只属于两类：

#. 只包含 ``nums[i]``；
#. 包含更早元素，其去掉 ``nums[i]`` 后必然是一个以 ``i-1`` 结尾的非空连续子数组。

第二类中，为了使总和最大，前半段必须选择 ``previous_ending``。因此两类最优值取最大，就是完整的
状态转移。

正确性依据
~~~~~~~~~~

**状态转移正确。** 根据上述分类，以 ``i`` 结尾的最优子数组要么从 ``i`` 开始，要么连接到以
``i-1`` 结尾的最优子数组。转移比较这两个候选，因此得到正确的 ``ending_here``。

**全局答案正确。** 任意非空连续子数组都有唯一右端点。当扫描到该右端点时，它的和不会超过对应的
``ending_here``。``best`` 取所有 ``ending_here`` 的最大值，所以最终等于全部非空连续子数组中的
最大和。

**负前缀可丢弃。** 若 ``previous_ending < 0``，对任意当前值 ``x`` 都有
``previous_ending + x < x``，因此包含该负贡献前缀不可能更优；若 ``previous_ending >= 0``，连接它
不会比从 ``x`` 单独开始更差。

**终止性。** 指针从第二个元素单调扫描到数组末尾，每轮处理一个元素，有限步后结束。

复杂度
~~~~~~

设数组长度为 ``n``：

* 每个元素执行常数次加法和比较，时间复杂度为 ``O(n)``；
* 只保存 ``ending_here`` 与 ``best``，算法额外空间为 ``O(1)``；
* 不修改输入，也不创建与 ``n`` 成比例的返回结果；
* 精确约束给出最大绝对子数组和 ``100000 × 10000 = 10^9``，所有实现使用的 32 位整数加法安全。

核心语言实现
------------

C
~

.. code-block:: c

   int maxSubArray(int *nums, int numsSize) {
       int ending_here = nums[0];
       int best = nums[0];

       for (int index = 1; index < numsSize; ++index) {
           int extended = ending_here + nums[index];
           ending_here = extended > nums[index]
               ? extended
               : nums[index];
           if (ending_here > best) {
               best = ending_here;
           }
       }
       return best;
   }

平台保证 ``numsSize >= 1``，因此第一次读取 ``nums[0]`` 有明确前提支撑。

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   public:
       int maxSubArray(const std::vector<int>& nums) {
           int endingHere = nums[0];
           int best = nums[0];

           for (std::size_t index = 1; index < nums.size(); ++index) {
               endingHere = std::max(nums[index], endingHere + nums[index]);
               best = std::max(best, endingHere);
           }
           return best;
       }
   };

循环下标使用 ``std::size_t``，避免与 ``nums.size()`` 的无符号类型混用。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxSubArray(self, nums: list[int]) -> int:
           iterator = iter(nums)
           ending_here = next(iterator)
           best = ending_here

           for value in iterator:
               ending_here = max(value, ending_here + value)
               best = max(best, ending_here)
           return best

直接写 ``for value in nums[1:]`` 会创建 ``O(n)`` 切片副本。主实现使用迭代器，保持 ``O(1)``
算法额外空间；``next`` 由非空约束支撑。

Java
~~~~

.. code-block:: java

   class Solution {
       public int maxSubArray(int[] nums) {
           int endingHere = nums[0];
           int best = nums[0];

           for (int index = 1; index < nums.length; ++index) {
               endingHere = Math.max(
                   nums[index],
                   endingHere + nums[index]
               );
               best = Math.max(best, endingHere);
           }
           return best;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn max_sub_array(nums: Vec<i32>) -> i32 {
           let mut values = nums.into_iter();
           let mut ending_here = values.next().unwrap();
           let mut best = ending_here;

           for value in values {
               ending_here = value.max(ending_here + value);
               best = best.max(ending_here);
           }
           best
       }
   }

``unwrap`` 由题目 ``nums.length >= 1`` 的精确约束支撑。``into_iter`` 消费输入向量；平台按值传参，
调用后不再使用该局部所有权。

Go
~~

.. code-block:: go

   func maxSubArray(nums []int) int {
       endingHere := nums[0]
       best := nums[0]

       for _, value := range nums[1:] {
           if endingHere+value > value {
               endingHere += value
           } else {
               endingHere = value
           }
           if endingHere > best {
               best = endingHere
           }
       }
       return best
   }

Go 的 ``nums[1:]`` 只创建新的切片描述符，与原切片共享底层数组，不复制元素，因此额外空间仍为
``O(1)``。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxSubArray(nums: number[]): number {
       let endingHere = nums[0];
       let best = nums[0];

       for (let index = 1; index < nums.length; index += 1) {
           const value = nums[index];
           endingHere = Math.max(value, endingHere + value);
           best = Math.max(best, endingHere);
       }
       return best;
   }

本题最大绝对和不超过 ``10^9``，远小于 JavaScript ``number`` 的安全整数上限；代码不使用位运算。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int MaxSubArray(int[] nums) {
           int endingHere = nums[0];
           int best = nums[0];

           for (int index = 1; index < nums.Length; ++index) {
               endingHere = System.Math.Max(
                   nums[index],
                   endingHere + nums[index]
               );
               best = System.Math.Max(best, endingHere);
           }
           return best;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function max_sub_array(nums::Vector{Int})::Int
       ending_here = nums[1]
       best = nums[1]

       for index in 2:length(nums)
           value = nums[index]
           ending_here = max(value, ending_here + value)
           best = max(best, ending_here)
       end
       best
   end

当 ``length(nums) == 1`` 时，Julia 的 ``2:1`` 是空 ``UnitRange``，循环不会执行；初始化值直接返回。

R
~

.. code-block:: r

   max_sub_array <- function(nums) {
     ending_here <- nums[[1L]]
     best <- nums[[1L]]

     if (length(nums) >= 2L) {
       for (index in 2L:length(nums)) {
         value <- nums[[index]]
         ending_here <- max(value, ending_here + value)
         best <- max(best, ending_here)
       }
     }
     best
   }

R 显式守卫长度至少为 2，再构造 ``2:length(nums)``，使循环边界对读者保持直接。

对照解法：前缀和减最小前缀
--------------------------

设 ``prefix[i]`` 为前 ``i`` 个元素之和。区间 ``[left, right)`` 的和为
``prefix[right] - prefix[left]``。固定右边界时，要最大化区间和，就应减去此前出现过的最小前缀和。
一次扫描中维护当前前缀和与最小历史前缀即可得到 ``O(n)`` 时间、``O(1)`` 空间算法。

该视角适合连接前缀和知识，但需要格外注意：先用当前前缀减去此前最小前缀，再把当前前缀加入最小值，
才能保证选择的区间非空。Kadane 的状态更直接，因此作为主解法。

验证计划与证据
--------------

本题采用枚举基准和边界分类验证：

* 正常用例 ``[-2,1,-3,4,-1,2,1,-5,4]`` 应返回 ``6``；
* 全负数组 ``[-8,-3,-5]`` 应返回 ``-3``；
* 单元素、全正数、最佳区间位于开头或末尾；
* 随机短数组与 ``O(n²)`` 枚举所有连续区间的独立基准对拍；
* 极值规模使用约束推导确认 32 位整数安全。

已完成的验证：

* **运行验证：** C、C++、Python、Java、Go、TypeScript 运行固定边界和随机对拍；
* **编译验证：** C 使用 C17、``-Wall -Wextra -Werror``，C++ 使用 C++17，Java 使用
  ``javac -Xlint:all``，TypeScript 使用 ``tsc --strict``；
* **基准对拍：** Python 生成随机长度 ``1..20``、数值 ``-20..20`` 的数组，与独立二次枚举比较；
* **静态验证：** Rust、C#、Julia、R 检查非空前提、索引、整数范围、输入语义和返回类型；当前环境
  未安装这四种语言运行时，因此不声称运行通过。

关键边界
--------

* 全负数组：初始化为首元素，不能把 ``best`` 初始化为 0；
* 非空约束：``nums[0]``、``next(...).unwrap()`` 都由精确长度下界支撑；
* 负贡献前缀：只在其和为负时丢弃，不能删除单个负元素后破坏连续性；
* 整数宽度：最大绝对子数组和为 ``10^9``，32 位有符号整数安全；
* Python：列表切片会复制，主实现使用迭代器保持 ``O(1)`` 额外空间；
* Go：切片表达式只复制描述符，不复制底层元素；
* Julia/R：单元素输入的循环范围需要按各自语义处理。

易错点
------

* 把空子数组当作候选，导致全负数组错误返回 0；
* 只维护当前和，却没有独立保存历史最大值；
* 看到当前元素为负就立即丢弃，而不是判断累计前缀是否为负；
* 使用 Python ``nums[1:]`` 后仍宣称实现额外空间严格为 ``O(1)``；
* 把“不修改输入”误写成 Rust 不消费按值传入的局部向量；
* 未由精确约束证明加法和最终返回类型安全。

本题新增知识
------------

* ``ending_here`` 表示必须以当前位置结尾的最优连续区间；
* 任意最优子数组可以按唯一右端点纳入全局最大值；
* Kadane 算法同时具有滚动动态规划和丢弃负贡献前缀的贪心解释；
* 全负数组要求状态从第一个真实元素初始化。

本题强化知识
------------

* 状态定义必须直接对应代码变量，并覆盖非空约束；
* 数值宽度由“元素数量 × 单项最大绝对值”推导；
* 复杂度需要按语言真实切片语义计算；
* 一个线性扫描算法仍需证明局部状态为什么足以代表全部候选。

关联题目
--------

* `0042. Trapping Rain Water <0042-trapping-rain-water.rst>`_：在线提交局部结果需要证明未来信息不会改变它；
* `0045. Jump Game II <0045-jump-game-ii.rst>`_：常数状态线性扫描与局部信息汇总；
* `0035. Search Insert Position <0035-search-insert-position.rst>`_：循环不变量直接对应返回语义。

最小自检
--------

#. ``ending_here`` 为什么必须要求子数组以当前位置结尾？
#. 为什么转移只有“重新开始”和“连接此前最优后缀”两类？
#. 为什么 ``best`` 不能初始化为 0？
#. 负贡献前缀为什么可以安全丢弃？
#. Python 切片与 Go 切片在空间语义上有什么区别？

答案要点
~~~~~~~~

#. 固定右端点后，所有候选都由是否包含此前元素分成两类。
#. 包含此前元素时，前半段必须选择以 ``i-1`` 结尾的最大和，才能得到当前最优。
#. 子数组必须非空；全负数组的答案也是某个负元素，因此从首元素初始化。
#. 负和前缀接到任何当前元素前都会使结果更小，可以从当前元素重新开始。
#. Python 切片复制元素，Go 切片只创建共享底层数组的描述符。
